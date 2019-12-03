const {
    FarmAppHtmlElement
} = require("./farm-app-html-element");

class Tab extends FarmAppHtmlElement {
    constructor() {
        super();

        this.init();

        if (this.hasAttribute("show")) {
            this.show = Boolean(this.getAttribute("show"));
        }
    }

    set show(show) {
        if (show) {
            this.shadowRoot.getElementById("content").classList.remove("d-none");
        } else {
            this.shadowRoot.getElementById("content").classList.add("d-none");
        }
    }

    _populatePagination(currentPage) {
        const paginationContainer = this.shadowRoot.getElementById("pagination");

        while (paginationContainer.firstChild) paginationContainer.firstChild.remove();

        for (let i = 0; i < this.maxNumberOfPages; i++) {
            const li = document.createElement("li");
            li.classList.add("page-item", "c-hand");

            if (i == currentPage - 1) {
                li.classList.add("active");
            }

            const innerContent = document.createElement("a");
            innerContent.setAttribute("href", "#");
            innerContent.innerText = i + 1;

            li.appendChild(innerContent);

            li.addEventListener("click", (e) => {
                paginationContainer.getElementsByClassName("active")[0].classList.remove("active");
                e.currentTarget.classList.add("active");
            });

            li.addEventListener("click", (e) => {
                this._fillTabData(e.currentTarget.firstChild.innerText);
            });

            paginationContainer.appendChild(li);
        }
    }

    _populateTable(data) {
        if (!data || data.length === 0) return;
        
        const head = this.shadowRoot.getElementById("thead");
        const body = this.shadowRoot.getElementById("tbody");

        while (head.firstChild) head.removeChild(head.firstChild);
        while (body.firstChild) body.removeChild(body.firstChild);

        const headRow = document.createElement("tr");

        for (const key of Object.keys(data[0])) {
            const headRowHeader = document.createElement("th");
            headRowHeader.innerText = key;
            headRow.appendChild(headRowHeader);
        }

        head.appendChild(headRow);

        for (const element of data) {
            const row = document.createElement("tr");
            row.classList.add("c-hand");
            for (const key in element) {
                if (element.hasOwnProperty(key)) {
                    const rowData = document.createElement("td");
                    rowData.innerText = element[key];
                    row.appendChild(rowData);
                }
            }

            body.appendChild(row);
        }
    }

    async _fillTabData(pageNumber) {
        const route = this.getAttribute("route");
        const results = await this.pagedDbRequest(route, pageNumber);
        this.maxNumberOfPages = results.pages;
        this._populatePagination(pageNumber);
        this._populateTable(results.data);
    }

    set route(_) {
        this._fillTabData(1);
    }

    async attributeChangedCallback(name, oldValue, newValue) {
        super.attributeChangedCallback(name, oldValue, newValue);
        this[name] = newValue;
    }

    static get observedAttributes() {
        return ["show", "route"];
    }
}


customElements.define("farmapp-tab", Tab);