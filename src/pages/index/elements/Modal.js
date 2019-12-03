const {
    FarmAppHtmlElement
} = require("./farm-app-html-element");

class Modal extends FarmAppHtmlElement {
    constructor() {
        super();

        let shadow = this.init();

        this.cancelButton = shadow.getElementById("cancel-button");
        this.modal = shadow.getElementById("modal");
        this.okButton = shadow.getElementById("ok-button");
        this.xButton = shadow.getElementById("modal-x");

        this.cancelButton.addEventListener("click", () => {
            this.modal.classList.remove("active");
        });

        this.xButton.addEventListener("click", () => {
            this.modal.classList.remove("active");
        });

        if (this.hasAttribute("onok")) {
            this.okButton.addEventListener("click", window[this.getAttribute("onok")]);
        }
0
        if (this.hasAttribute("oncancel")) {
            this.cancelButton.addEventListener("click", window[this.getAttribute("oncancel")]);
        }
    }

    set active(active) {
        if (active) {
            this.modal.classList.add("active");
        } else {
            this.modal.classList.remove("active");
        }
    }

    attributeChangedCallback(name, oldValue, newValue) {
        super.attributeChangedCallback(name, oldValue, newValue);
        this[name] = newValue;
    }

    static get observedAttributes() {
        return ['active'];
    }
}


customElements.define('farmapp-modal', Modal);