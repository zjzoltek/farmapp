const { ipcRenderer } = require("electron");

async function dbRequest(route, params) {
    return new Promise((resolve) => {
        const nonce = ~~(Math.random() * 1000);
        ipcRenderer.once(`${nonce}`, (_, data) => {
            console.info("Resolving DB request");
            resolve(data);
        });

        ipcRenderer.send(channels.dbRequest, nonce, route, params);
    });
}

module.exports = { dbRequest };