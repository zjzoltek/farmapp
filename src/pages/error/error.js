const { ipcRenderer } = require("electron");
const channels = require("../../channels");

ipcRenderer.on(channels.error, (_, details) => {
    document.getElementById("error-details").textContent = details;
});

document.getElementById("reload").onclick = (e) => {
    e.currentTarget.classList.add("loading");
    ipcRenderer.send(channels.reload);
}
