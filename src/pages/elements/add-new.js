const {
    FarmAppHtmlElement
} = require("./farm-app-html-element");

const { Toaster } = require("../index/toaster");

const { ensureAllInputElementsAreValid } = require("../utility");

class AddNew extends FarmAppHtmlElement {
    constructor() {
        super();

        this.init();

        this.addNewButton = this.shadowRoot.getElementById("add-button");
        this.addNewButton.style.animation = "transition opacity 0.5s";

        this.style.transition = "opacity .25s ease-in-out";
        this.style.opacity = "0";

        this.modalTitle = document.getElementById("add-new-panel-title");
        this.modalSubtitle = document.getElementById("add-new-panel-subtitle");
        this.modalButton = document.getElementById("add-new-save-button");
        this.modal = document.getElementById("add-new-modal");
        this.modalInputArea = document.getElementById("add-new-modal-input-area");
        this.modalForm = document.getElementById("add-new-modal-form");

        this.addNewButton.addEventListener("click", async () => {
            while (this.modalInputArea.firstChild) this.modalInputArea.firstChild.remove();

            this.modalTitle.textContent = this.activatingElement.getAttribute("title");
            this.modalSubtitle.textContent = this.activatingElement.getAttribute(`Add New ${this.activatingElement.getAttribute("title")}`);
            
            const route = document.getElementById(this.activatingElement.getAttribute("activates")).getAttribute("route");
            const results = await this.pagedDbRequest(route, 1);
            const keys = Object.keys(results.data[0]);
            for (const key of keys) {
                const inputContainer = document.createElement("div");
                inputContainer.innerHTML = `
                    <farmapp-form-input class="my-2" template="form-input-template" hint="">
                        <span slot="label">${key}</span>
                        <input slot="input" type="text" required id="${key}">
                    </farmapp-form-input>
                `;

                this.modalInputArea.appendChild(inputContainer);

                inputContainer.querySelector("farmapp-form-input").setAttribute("input-element-id", key);
            }


            this.modalButton.onclick = () => {
                if (ensureAllInputElementsAreValid(this.modalForm)) {
                    const reformattedKeys = keys.map((key) => key.split(" ").map((i) => i[0].toLowerCase() + i.substring(1))).join("_");
                    const entity = {};

                    for (let i = 0; i < keys.length; i++) {
                        entity[reformattedKeys[i]] = document.getElementById(keys[i]);
                    }

                    this.dbRequest("insertEntity", { table: this.activatingElement.getAttribute("activates"), entity })
                    this.modalForm.submit();
                    (new Toaster()).showSuccessToast("Saved!");
                } else {
                    (new Toaster()).showErrorToast("There were some issues with the data you entered");
                    return false;
                }
            };

            this.modal.setAttribute("active", "true");
        });

    }

    set for(value) {
        this.forValue = value;
        this.activatingElement = document.querySelector(`farmapp-nav-item[activates='${this.forValue}']`)
        this.activatingElement.addEventListener("mouseover", () => {
            this.style.opacity = "100";
        });

        this.activatingElement.addEventListener("mouseout", () => {
            this.style.opacity = "0";
        });
    }

    attributeChangedCallback(name, o, n) {
        super.attributeChangedCallback(name, o, n);
        this[name] = n;
    }

    static get observedAttributes() {
        return ["for"];
    }
}

customElements.define("farmapp-add-new", AddNew);