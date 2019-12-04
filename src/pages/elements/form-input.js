const {
    FarmAppHtmlElement
} = require("./farm-app-html-element");

class FormInput extends FarmAppHtmlElement {
    constructor() {
        super();

        const shadow = this.init();

        this.inputElementId = this.ensureAttributeExists("input-element-id");
        this.inputElement = document.getElementById(this.inputElementId);
        this.hintElement = shadow.getElementById("hint");
        this.hint = this.ensureAttributeExists("hint");

        if (!this.inputElement) throw Error("No element with id " + this.inputElementId + " exists!");

        this.inputElement.addEventListener("input", () => {
            this.hintElement.parentElement.classList.remove("has-error");
            this.hintElement.parentElement.classList.remove("has-success");

            if (!(this.inputElement.value)) {
                this.hintElement.textContent = "Field cannot be empty";
                this.hintElement.parentElement.classList.add("has-error");
            } else {
                if (!this.inputElement.checkValidity()) {
                    this.hintElement.textContent = this.hint;
                    this.hintElement.parentElement.classList.add("has-error");
                } else {
                    this.hintElement.textContent = "";
                    this.hintElement.parentElement.classList.add("has-success");
                    this.hintElement.textContent = "Looks good 🎉!";
                }
            }
        });
    }

    attributeChangedCallback(name, oldValue, newValue) {
        super.attributeChangedCallback(name, oldValue, newValue);
    }

    static get observedAttributes() {
        return [];
    }
}

customElements.define("farmapp-form-input", FormInput);