const {
    FarmAppHtmlElement
} = require("./FarmAppHtmlElement");

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

    populatePagination(currentPage) {
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
                this.fillTabData(e.currentTarget.firstChild.innerText);
            });

            paginationContainer.appendChild(li);
        }
    }

    populateTable(data) {
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

    async fillTabData(pageNumber) {
        const table = this.getAttribute("data-table");
        const data = await this._makeDbRequest(table, pageNumber);
        this.maxNumberOfPages = data.pages;
        this.populatePagination(pageNumber);
        this.populateTable(data.results);
    }

    async attributeChangedCallback(name, oldValue, newValue) {
        super.attributeChangedCallback(name, oldValue, newValue);

        if (name == "show") {
            this.show = Boolean(newValue);
        } else if (name == "data-table") {
            await this.fillTabData(1);
        }
    }

    static get observedAttributes() {
        return ["show", "data-table"];
    }
}


customElements.define("farmapp-tab", Tab);