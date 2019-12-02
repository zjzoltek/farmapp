class Toaster {
    constructor(toastHalfLife) {
      this.timeTillToastDissappears = toastHalfLife || 3000;
      this.progressUpdateIntervalDelay = 10;
      this.toastElement = `
  <div class="toast p-fixed text-center" id="toast" style="z-index: 1000;top:0px;">
    <button class="btn btn-clear float-right" id="toast-clear-button"></button>
    <div class="bar bar-sm p-absolute" style="bottom:-1px;right:1px;width:100%; background: inherit;">
        <div class="bar-item" role="progressbar" style="width:0%;" id="toast-progressbar"></div>
    </div>
  </div>`
    }
  
    showWarningToast(content) {
      this.showToast(content, "toast-warning");
    }
  
    showErrorToast(content) {
      this.showToast(content, "toast-error");
    }
  
    showSuccessToast(content) {
      this.showToast(content, "toast-success");
    }
  
    showToast(content, style) {
      let count = 0;
  
      const toastContainer = document.createElement("div");
      toastContainer.innerHTML = this.toastElement.trim();
      document.body.appendChild(toastContainer);
  
      const toast = toastContainer.firstChild;
      const toastProgressBar = document.getElementById("toast-progressbar");
  
      document.getElementById("toast-clear-button").onclick = () => {
          toastContainer.remove();
      };
  
      toast.firstChild.textContent = content;
      toast.classList.add(style);
      toast.classList.remove("d-none");
  
      const progressUpdateInterval = setInterval(() => {
          if (count >= this.timeTillToastDissappears) {
              toast.classList.add("d-none");
              clearInterval(progressUpdateInterval);
              toastContainer.remove();
          }
  
          const currentWidth = parseFloat(toastProgressBar.style.width);
          const widthToAdd = 100 / (this.timeTillToastDissappears / this.progressUpdateIntervalDelay);
          const stringifiedFinalValue = ("" + (widthToAdd + currentWidth));
  
          const rounded = stringifiedFinalValue.substr(0, stringifiedFinalValue.indexOf(".") + 3);
          toastProgressBar.style.width = `${rounded}%`;
          count += this.progressUpdateIntervalDelay;
      }, this.progressUpdateIntervalDelay);
    }
  }
  
  module.exports = Toaster;
  