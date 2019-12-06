const {
    FarmAppHtmlElement
} = require("./farm-app-html-element");

class NavItem extends FarmAppHtmlElement {
    constructor() {
        super();

        this.init();

        this.liElement = this.shadowRoot.querySelector("li");
        this.addNewButton = this.shadowRoot.getElementById("add-new");
        this.activates = this.ensureAttributeExists("activates");
        this.addNewButton = this.shadowRoot.getElementById("add-new");

        this.addNewButton.setAttribute("for", this.activates);
        this.liElement.addEventListener("click", () => {
            const activeTabs = document.querySelectorAll("farmapp-nav-item[active='true']");
            activeTabs.forEach((elem) => { 
                elem.removeAttribute("active"); 
                elem.shadowRoot.querySelector("li").classList.remove("active"); 
                document.getElementById(elem.getAttribute("activates")).removeAttribute("show");
            });
            
            this.setAttribute("active", "true");
            const tab = document.getElementById(this.activates);
            tab.setAttribute("show", "true");
            this.liElement.classList.add("active");
        });

        if (this.hasAttribute("title")) {
            this.shadowRoot.getElementById("title").textContent = this.getAttribute("title");
        }
    }


    attributeChangedCallback(name, o, n) {
        super.attributeChangedCallback(name, o, n);
    }

    static get observedAttributes() {
        return ["active"];
    }
}

customElements.define("farmapp-nav-item", NavItem);