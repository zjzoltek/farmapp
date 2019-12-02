const {
    FarmAppHtmlElement
} = require("./FarmAppHtmlElement");

class AccountTile extends FarmAppHtmlElement {
    constructor() {
        super();

        let shadow = this.init();

        if (this.hasAttribute("tile-title")) {
            this.title = this.getAttribute("tile-title");
        }

        if (this.hasAttribute("tile-value")) {
            this.value = this.getAttribute("tile-value");
        }

        if (this.hasAttribute("editable")) {
            this.editable = false;
        }

        if (this.hasAttribute("oneditclick")) {
            shadow.getElementById("action-button").addEventListener("click", eval(this.getAttribute("oneditclick")));
        }
    }

    set editable(editable) {
        if (editable) {
            this.shadowRoot.getElementById("action").classList.remove("d-none");
        } else {
            this.shadowRoot.getElementById("action").classList.add("d-none");
        }
    }

    get title() {
        return this.shadowRoot.getElementById("tile-value").innerText;
    }

    get value() {
        return this.shadowRoot.getElementById("tile-title").innerText;
    }

    set value(newValue) {
        this.shadowRoot.getElementById("tile-value").innerText = newValue;
    }

    set title(newTitle) {
        this.shadowRoot.getElementById("tile-title").innerText = newTitle;
    }

    attributeChangedCallback(name, oldValue, newValue) {
        super.attributeChangedCallback(name, oldValue, newValue);

        if (name == "tile-title") {
            this.title = newValue;
        }

        if (name == "tile-value") {
            this.value = newValue;
        }

        if (name == "editable") {
            this.editable = Boolean(newValue);
        }
    }

    static get observedAttributes() {
        return ['tile-title', 'tile-value', 'editable'];
    }
}

customElements.define("farmapp-account-tile", AccountTile);