const {
    FarmAppHtmlElement
} = require("./FarmAppHtmlElement");

class Modal extends FarmAppHtmlElement {
    constructor() {
        super();

        let shadow = this.init();

        shadow.getElementById("cancel-button").addEventListener("click", () => {
            shadow.getElementById("modal").classList.remove("active");
        });

        shadow.getElementById("modal-x").addEventListener("click", () => {
            shadow.getElementById("modal").classList.remove("active");
        });
    }

    set active(active) {
        if (active) {
            this.shadowRoot.getElementById("modal").classList.add("active");
        } else {
            this.shadowRoot.getElementById("modal").classList.remove("active");
        }
    }

    attributeChangedCallback(name, oldValue, newValue) {
        super.attributeChangedCallback(name, oldValue, newValue);

        if (name === "active") {
            this.active = Boolean(newValue);
        }
    }

    static get observedAttributes() {
        return ['active'];
    }
}


customElements.define('farmapp-modal', Modal);