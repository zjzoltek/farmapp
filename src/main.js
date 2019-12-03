"use strict";

const {
    ipcMain,
    BrowserWindow,
    app
} = require("electron");
const {
    Database
} = require("./database");
const {
    readFileSync
} = require("fs");
const assert = require("assert");
const path = require("path");
const minimist = require("minimist");
const channels = require("./channels");

// To stop app from launching multiple times when installing the application via Squirrel.Windows
if (require('electron-squirrel-startup')) return app.quit();

// For hot-reloading for renderer windows
require("electron-reload")(__dirname);

const argv = minimist(process.argv);

global.farmApp = {
    maximumItemsPerPage: 5,
    browserWindowDefaults: {
        icon: path.resolve(__dirname, "icon.ico"),
        show: false,
        title: "Farm Tracking App Report",
        webPreferences: {
            nodeIntegration: true,
            preload: path.resolve(__dirname, "preload.js")
        }
    },

    windows: {
        login: undefined,
        error: undefined,
        index: undefined
    },

    farmAppDatabase: null,
    user: null
};

function sha256Hash(string) {
    const crypto = require("crypto");
    const hasher = crypto.createHash("sha256");
    return hasher.update(string).digest("hex");
}

function setupIpcMainMessageHandlers() {
    ipcMain.on(channels.reload, () => {
        console.info("Request to reload the program received. Performing reload");
        main();
    });

    ipcMain.on(channels.dbRequest, async (e, nonce, route, params) => {
        console.info("Regular DB request received");
        console.info("Params:", params);
        console.info("Route:", route);

        const results = await global.farmApp.farmAppDatabase[route](params);

        e.reply(`${nonce}`, results);
    });

    ipcMain.on(channels.pagedDbRequest, async (e, route, nonce, page) => {
        console.info("Paged DB request received:", route);

        const results = await global.farmApp.farmAppDatabase.performPagedQuery({
            number: global.farmApp.maximumItemsPerPage,
            offset: (page - 1) * global.farmApp.maximumItemsPerPage,
            user: global.farmApp.user,
            route
        });

        e.reply(`${nonce}`, results);
    });

    ipcMain.on(channels.credentials, async (e, credentials) => {
        console.info("Received credentials from login page. Verifying proper syntax of data");
        assert(credentials && credentials.email && credentials.password, "Malformed credentials object");

        const {
            results
        } = await global.farmApp.farmAppDatabase.getUserByEmail(credentials.email);

        const user = results[0];
        const hashedPassword = sha256Hash(credentials.password);

        if (!user) {
            e.reply(channels.error, "Invalid email and password combination");
        } else if (hashedPassword.toLowerCase() !== user.password_hash.toLowerCase()) {
            e.reply(channels.error, "Invalid email and password combination");
        } else {
            global.farmApp.user = user;
            openIndexWindow();
        }
    });


    ipcMain.on(channels.signout, async () => {
        global.farmApp.user = undefined;
        openLoginWindow();
        closeAllWindows("login");
    });

    ipcMain.on(channels.signup, async (e, user) => {
        console.info("Attempting to sign user up:", user.email);
        const {
            results
        } = await global.farmApp.farmAppDatabase.getUserByEmail(user.email);

        if (results[0]) {
            console.info("User already exists. Cannot signup");
            e.reply(channels.error, "Email already reigstered");
        } else {
            console.info("User does not exist. Hashing pass and inserting them into the DB");
            const hashedPassword = sha256Hash(user.password_hash);
            await global.farmApp.farmAppDatabase.insertEntity({
                ...user,
                password_hash: hashedPassword
            }, "users");

            console.info("Setting current user to user that we just inserted");
            global.farmApp.user = (await global.farmApp.farmAppDatabase.getUserByEmail(user.email)).results[0];
            openIndexWindow();
        }
    });
}

function setupDatabase() {
    console.info("Checking if db is setup");
    if (!global.farmApp.farmAppDatabase) {
        console.info("DB is not setup");
        console.info("Beginning read of package.json's mysql configuration");

        const packageJsonObject = JSON.parse(
            readFileSync(
                path.resolve(__dirname, "../package.json")
            )
        );

        console.info("Performing sanitfy checks on package.json");
        assert(packageJsonObject.config, "No 'config' entry found in package.json!");
        assert(packageJsonObject.config.mysql, "No 'mysql' entry within 'config' object in package.json!");
        assert(packageJsonObject.config.mysql.username, "No 'username' entry found within 'mysql' configuration!");
        assert(packageJsonObject.config.mysql.password, "No 'password' entry found within 'mysql' configuration!");
        assert(packageJsonObject.config.mysql.database, "No 'database' entry found within 'mysql' configuration!");

        const username = packageJsonObject.config.mysql.username;
        const password = packageJsonObject.config.mysql.password;
        const database = packageJsonObject.config.mysql.database;
        const port = parseInt(packageJsonObject.config.mysql.port);
        const host = packageJsonObject.config.mysql.host;

        console.info("Attempting connection to database using the following parameters");
        console.info(`username:${username}`);
        console.info(`password:${password}`);
        console.info(`database:${database}`);
        console.info(`port:${port}`);
        console.info(`host:${host}`);

        global.farmApp.farmAppDatabase = new Database({
            username,
            password,
            database,
            port,
            host
        });

        console.info("Successfully connected to db", database);
    }
}

function openLoginWindow() {
    console.info("Attempting to open login window. Checking if window is already open");
    if (!global.farmApp.windows.login) {
        console.info("Window is not opened already. Created and showing");
        global.farmApp.windows.login = new BrowserWindow({
            ...global.farmApp.browserWindowDefaults,
        });

        global.farmApp.windows.login.removeMenu();
        global.farmApp.windows.login.webContents.on("did-finish-load", () => {
            closeWindow("error");

            global.farmApp.windows.login.show();
        });

        global.farmApp.windows.login.loadFile(path.resolve("file://", __dirname, "pages", "login", "login.html"));

        if (argv.debug) {
            global.farmApp.windows.login.webContents.openDevTools();
        }
    } else {
        console.info("Window is already opened");
    }
}

function openErrorWindow(errorDetails) {
    console.info("Attempting to open error window. Checking if window is already open");
    if (!global.farmApp.windows.error) {
        console.info("Window is not opened already. Created and showing");
        global.farmApp.windows.error = new BrowserWindow({
            ...global.farmApp.browserWindowDefaults
        });

        global.farmApp.windows.error.webContents.on("did-finish-load", () => {
            global.farmApp.windows.error.webContents.send(channels.error, errorDetails);
            global.farmApp.windows.error.show();
        });

        global.farmApp.windows.error.removeMenu();
        global.farmApp.windows.error.on("close", () => {
            global.farmApp.windows.error = null;
        });

        global.farmApp.windows.error.loadFile(path.resolve("file://", __dirname, "pages", "error", "error.html"));

        if (argv.debug) {
            global.farmApp.windows.error.webContents.openDevTools();
        }
    } else {
        console.info("Window is already opened");
    }

    closeAllWindows("error");
}

function openIndexWindow() {
    console.info("Attempting to open index window. Checking if window is already open");
    if (!global.farmApp.windows.index) {
        console.info("Window is not opened already. Created and showing");
        global.farmApp.windows.index = new BrowserWindow({
            ...global.farmApp.browserWindowDefaults
        });

        global.farmApp.windows.index.removeMenu();
        global.farmApp.windows.index.webContents.on("did-finish-load", async () => {
            closeAllWindows("index");

            global.farmApp.windows.index.webContents.send(channels.bootstrapData, {
                user: global.farmApp.user
            });

            global.farmApp.windows.index.show();
        });

        global.farmApp.windows.index.loadFile(path.resolve("file://", __dirname, "pages", "index", "index.html"));

        if (argv.debug) {
            global.farmApp.windows.index.webContents.openDevTools();
        }
    } else {
        console.info("Window is already opened");
    }
}

function closeWindow(window) {
    if (global.farmApp.windows[window]) {
        console.info("Closing " + window + " window");
        global.farmApp.windows[window].close();
        global.farmApp.windows[window] = null;
    }
}

function closeAllWindows(exception) {
    for (const key in global.farmApp.windows) {
        if (global.farmApp.windows.hasOwnProperty(key) &&
            key !== exception &&
            global.farmApp.windows[key] !== null && global.farmApp.windows[key] !== undefined) {
            console.info("Closing", key, "window");
            global.farmApp.windows[key].close();
            global.farmApp.windows[key] = null;
        }
    }
}

function main() {
    closeAllWindows("error");
    console.info("Running main");
    console.info("Checking if a user is currently logged in");
    if (global.farmApp.user) {
        console.info("User is logged in");
        openIndexWindow();
    } else {
        console.info("No user is logged in");
        openLoginWindow();
    }
}

app.on("ready", () => {
    setupDatabase();
    setupIpcMainMessageHandlers();
    main();
});

app.on("window-all-closed", () => {
    console.info("All windows closed. Quitting application");
    app.quit();
});

process.on("uncaughtException", (error) => {
    console.error("Uncaught exception: ", error.message);
    console.error("Opening up error window");
    openErrorWindow(error.stack);
});