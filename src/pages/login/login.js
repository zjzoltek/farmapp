const { ipcRenderer } = require("electron");
const channels = require("../../channels");

const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const submitButton = document.getElementById("login-btn");
const passwordHint = document.getElementById("password-hint");
const emailHint = document.getElementById("email-hint");
const formError = document.getElementById("form-error");

ipcRenderer.on(channels.error, (_, error) => {
    submitButton.classList.remove("loading");
    formError.classList.add("text-error");
    formError.textContent = error;
});

passwordInput.addEventListener("blur", () => {
    passwordHint.textContent = "";
    passwordInput.parentElement.classList.remove("has-error");
});

emailInput.addEventListener("blur", () => {
    emailHint.textContent = "";
    emailInput.parentElement.classList.remove("has-error");
});

submitButton.addEventListener("click", () => {
    let formIsGood = true;
    
    if (emailInput.value.trim() === "") {
        emailHint.textContent = "Email field cannot be empty";
        emailInput.parentElement.classList.add("has-error");
        formIsGood = false;
    } else if (!emailInput.reportValidity()) {
        emailHint.textContent = "Invalid email";
        emailInput.parentElement.classList.add("has-error");
        formIsGood = false;
    }
    
    if (passwordInput.value.trim() === "") {
        passwordHint.textContent = "Password field cannot be empty";
        passwordHint.parentElement.classList.add("has-error");
        formIsGood = false;
    }
    
    if (formIsGood) {
        submitButton.classList.add("loading");
        ipcRenderer.send(channels.credentials, {
            email: emailInput.value,
            password: passwordInput.value
        });
        return true;
    } else {
        return false;
    }
});