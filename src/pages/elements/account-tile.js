const {
    FarmAppHtmlElement
} = require("./farm-app-html-element");

class AccountTile extends FarmAppHtmlElement {
    constructor() {
        super();

        let shadow = this.init();

        this.actionButton = shadow.getElementById("action-button");
        this.action = shadow.getElementById("action");
        this.tileValue = shadow.getElementById("tile-value");
        this.tileTitle = shadow.getElementById("tile-title");
        this.tileValueInput = shadow.getElementById("tile-value-input");

        if (this.hasAttribute("title")) {
            this.title = this.getAttribute("tile-title");
        }

        if (this.hasAttribute("value")) {
            this.value = this.getAttribute("tile-value");
        }

        if (this.hasAttribute("editable")) {
            this.editable = Boolean(this.getAttribute("editable"));
        } else {
            this.editable = false;
        }

        this.actionButton.addEventListener("click", () => {
            this.tileValueInput.classList.remove("d-none");
            this.tileValue.classList.add("d-none");
            this.actionButton.classList.add("d-none");
            this.tileValueInput.value = this.value;
            this.tileValueInput.focus();
        });

        this.tileValueInput.onblur = () => {
            const inputtedValue = this.tileValueInput.value;

            if (inputtedValue  && inputtedValue.length === 10 && inputtedValue.match(/\d{10}/)) {
                this.value = this.tileValueInput.value;
            }

            this.tileValueInput.classList.add("d-none");
            this.tileValue.classList.remove("d-none");
            this.tileValue.classList.remove("d-none");
            this.actionButton.classList.remove("d-none");
        };
    }

    set editable(editable) {
        if (editable) {
            this.action.classList.remove("d-none");
        } else {
            this.action.classList.add("d-none");
        }
    }

    get value() {
        return this.tileValue.innerText;
    }

    set value(newValue) {
        this.tileValue.innerText = newValue;
    }

    set title(newTitle) {
        this.tileTitle.innerText = newTitle;
    }

    attributeChangedCallback(name, oldValue, newValue) {
        super.attributeChangedCallback(name, oldValue, newValue);
        this[name] = newValue;
    }

    static get observedAttributes() {
        return ['title', 'value', 'editable'];
    }
}

customElements.define("farmapp-account-tile", AccountTile);