const {
    FarmAppHtmlElement
} = require("./farm-app-html-element");

class FormInput extends FarmAppHtmlElement {
    constructor() {
        super();

        const shadow = this.init();

        this.inputElementId = this.getAttribute("input-element-id");
        this.hintElement = shadow.getElementById("hint");
        this.hint = this.ensureAttributeExists("hint");
    }

    set inputElementId(value) {
        this.inputElement = document.getElementById(value);

        if (!this.inputElement) return;

        this.inputElement.addEventListener("input", () => {
            this.inputElement.classList.remove("is-error", "is-success");
            this.hintElement.classList.remove("text-success", "text-error");

            if (!(this.inputElement.value)) {
                this.hintElement.textContent = "Field cannot be empty";
                this.inputElement.classList.add("is-error");
                this.hintElement.classList.add("text-error");
            } else {
                if (!this.inputElement.checkValidity()) {
                    this.hintElement.textContent = this.hint;
                    this.inputElement.classList.add("is-error");
                    this.hintElement.classList.add("text-error");
                } else {
                    this.inputElement.classList.add("is-success");
                    this.hintElement.classList.add("text-success");
                    this.hintElement.textContent = "Looks good 🎉!";
                }
            }
        });
    }

    attributeChangedCallback(name, oldValue, newValue) {
        super.attributeChangedCallback(name, oldValue, newValue);

        if (name == "input-element-id") {
            console.log(newValue);
            this.inputElementId = newValue;
        }
    }

    static get observedAttributes() {
        return ["input-element-id"];
    }
}

customElements.define("farmapp-form-input", FormInput);