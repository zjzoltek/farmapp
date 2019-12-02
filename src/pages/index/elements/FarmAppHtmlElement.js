const { ipcRenderer } = require("electron");
const channels = require("../../../channels");

class FarmAppHtmlElement extends HTMLElement {
    constructor() {
        super();

        if (!this.hasAttribute("template")) {
            throw Error("No template provided to modal element!");
        }
    }

    _inheritLinksandStyles(root) {
        for (const node of document.getElementsByTagName("style")) {
            root.appendChild(node.cloneNode(true));
        }

        for (const node of document.getElementsByTagName("link")) {
            root.appendChild(node.cloneNode(true));
        }
    }


    _initShadow() {
        return this.attachShadow({
            mode: "open"
        });
    }

    _getTemplate() {
        let template = document.getElementById(this.getAttribute("template"));
        let templateContent = template.content;
        return templateContent.cloneNode(true);
    }

    _ensureAttributeExists(attribute) {
        if (!this.hasAttribute(attribute)) {
            throw Error(`No '${attribute}' attribute on ${this.tagName} element!`);
        } else {
            return this.getAttribute(attribute);
        }
    }

    async _makeDbRequest(table, pageNumber) {
        return new Promise((resolve) => {
            const nonce = ~~(Math.random() * 1000);
            ipcRenderer.once(`${nonce}`, (_, data) => {
                console.info("Resolving DB request");
                resolve(data);
            });
    
            ipcRenderer.send(channels.dbRequest, table, nonce, pageNumber);
        });
    }

    init() {
        let shadow = this._initShadow();
        this._inheritLinksandStyles(shadow);
        shadow.appendChild(this._getTemplate());

        return shadow;
    }

    attributeChangedCallback(name, oldValue, newValue) {
        console.info(this.tagName, ": Modal attribute has changed:", name, oldValue, "-", newValue);
    }
}

module.exports = { FarmAppHtmlElement }