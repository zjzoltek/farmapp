const { ipcMain, BrowserWindow, dialog, app } = require("electron");

// To stop app from launching multiple times when installing the application via Squirrel.Windows
if (require('electron-squirrel-startup')) return app.quit();

function setupIpcMainMessageHandlers() {
    
}

function main() {
    setupIpcMainMessageHandlers();
}

main();
