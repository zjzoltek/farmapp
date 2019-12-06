const { ipcRenderer } = require("electron");

function ensureAllInputElementsAreValid (root) {
    let formIsValid = true;
    for (const elem of root.childNodes) {
        if (elem.checkValidity) {
            const currentElementValidity = elem.checkValidity();
            const areAllChildElementsvValid = ensureAllInputElementsAreValid(elem);

            formIsValid = formIsValid && currentElementValidity && areAllChildElementsvValid;
            if (!elem.checkValidity()) elem.dispatchEvent(new Event("input"));
        } else {
            const areAllChildElementsvValid = ensureAllInputElementsAreValid(elem);

            formIsValid = formIsValid && areAllChildElementsvValid;
        }
    }

    return formIsValid;
}

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

module.exports = { dbRequest, ensureAllInputElementsAreValid };