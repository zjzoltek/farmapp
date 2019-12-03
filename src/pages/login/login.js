const { ipcRenderer } = require("electron");
const channels = require("../../channels");

const passwordInputLoginPage = document.getElementById("login-password");
const emailInputLoginPage = document.getElementById("login-email");

const passwordHint = document.getElementById("password-hint");
const emailHint = document.getElementById("email-hint");
const signupFormError = document.getElementById("form-error-signup");
const loginFormError = document.getElementById("form-error-login");
const signupButtonOnSignupPage = document.getElementById("signup-btn-signup");
const loginButtonOnSignupPage = document.getElementById("login-btn-signup");
const signupButtonOnLoginPage = document.getElementById("signup-btn-login");
const loginButtonOnLoginPage = document.getElementById("login-btn-login");
const loginForm = document.getElementById("login-form");
const signupForm = document.getElementById("signup-form");

ipcRenderer.on(channels.error, (_, error) => {
    console.info("Received error in login page: ", error);
    signupButtonOnSignupPage.classList.remove("loading");
    loginButtonOnLoginPage.classList.remove("loading");

    if (loginForm.classList.contains("d-none")) {
        signupFormError.classList.add("text-error");
        signupFormError.scrollIntoView({ behavior: "smooth" });
        signupFormError.textContent = error;
    } else {
        loginFormError.classList.add("text-error");
        loginFormError.scrollIntoView({ behavior: "smooth" });
        loginFormError.textContent = error;
    }
});

passwordInputLoginPage.addEventListener("blur", () => {
    passwordHint.textContent = "";
    passwordInputLoginPage.parentElement.classList.remove("has-error");
});

emailInputLoginPage.addEventListener("blur", () => {
    emailHint.textContent = "";
    emailInputLoginPage.parentElement.classList.remove("has-error");
});

signupButtonOnSignupPage.addEventListener("click", () => {
    signupButtonOnSignupPage.classList.add("loading");

    const email = document.getElementById("signup-email").value;
    const password_hash = document.getElementById("signup-password").value;
    const first_name = document.getElementById("signup-first-name").value;
    const last_name = document.getElementById("signup-last-name").value;
    const address = document.getElementById("signup-address").value;
    const zip_code = document.getElementById("signup-zip").value;
    const phone_num = document.getElementById("signup-phone").value;
    const user_type = "reg_usr";

    ipcRenderer.send(channels.signup, {
       email,
       first_name,
       last_name,
       address,
       zip_code,
       phone_num,
       user_type,
       password_hash
    });
});

loginButtonOnLoginPage.addEventListener("click", () => {
    let formIsGood = true;
    
    if (emailInputLoginPage.value.trim() === "") {
        emailHint.textContent = "Email field cannot be empty";
        emailInputLoginPage.parentElement.classList.add("has-error");
        formIsGood = false;
    } else if (!emailInputLoginPage.reportValidity()) {
        emailHint.textContent = "Invalid email";
        emailInputLoginPage.parentElement.classList.add("has-error");
        formIsGood = false;
    }
    
    if (passwordInputLoginPage.value.trim() === "") {
        passwordHint.textContent = "Password field cannot be empty";
        passwordHint.parentElement.classList.add("has-error");
        formIsGood = false;
    }
    
    if (formIsGood) {
        loginButtonOnLoginPage.classList.add("loading");
        ipcRenderer.send(channels.credentials, {
            email: emailInputLoginPage.value,
            password: passwordInputLoginPage.value
        });
        return true;
    } else {
        return false;
    }
});

signupButtonOnLoginPage.addEventListener("click", () => {
    signupForm.classList.remove("d-none");
    loginForm.classList.add("d-none");
});

loginButtonOnSignupPage.addEventListener("click", () => {
    loginForm.classList.remove("d-none");
    signupForm.classList.add("d-none");
});