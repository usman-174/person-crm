export const API = process.env.API || process.env.NEXT_PUBLIC_API || 'http://localhost:3000/';

export const auth_constants = {
    login: {
        LoginTitle: "Login",
        LoginDescription: "Enter your email and password to login to your account",
        ErrorEmailPasswordRequired: "Please provide Email and Password.",
        ButtonLogin: "Login",
        LinkRegisterText: "Don't have an account?",
        LinkRegister: "Register Now",
        LabelUsername: "Username",
        UsernamePlaceholder: "m@example.com",
        LabelPassword: "Password",
        PasswordPlaceholder: "********",
        ToastSigningIn: "Signing in, Please wait",
        ToastLoginSuccess: "Logged in successfully",
        ErrorInvalidCredentials: "Invalid credentials. Please try again."
    },
    register: {
        pageTitle: "Register",
        pageDescription: "Enter your email and password to Register",
        firstNameLabel: "FirstName",
        firstNamePlaceholder: "John",
        lastNameLabel: "LastName",
        lastNamePlaceholder: "Doe",
        usernameLabel: "username",
        usernamePlaceholder: "m@example.com",
        passwordLabel: "Password",
        passwordPlaceholder: "********",
        confirmPasswordLabel: "Confirm Password",
        confirmPasswordPlaceholder: "********",
        registerButton: "Register",
        loadingMessage: "Registering in, Please wait",
        successMessage: "Registered successfully",
        errorMessage: "Please enter all fields",
        passwordMismatchMessage: "Passwords do not match",
        LinkRegisterText: "Already have an Account?",
        loginLink: "Login",
    }
}