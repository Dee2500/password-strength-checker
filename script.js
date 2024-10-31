document.getElementById("password").addEventListener("input", checkStrength);
document.getElementById("toggleVisibility").addEventListener("click", togglePasswordVisibility);
document.getElementById("toggleDarkMode").addEventListener("click", toggleDarkMode);

function checkStrength() {
    const password = document.getElementById("password").value;
    const strengthMessage = document.getElementById("strengthMessage");
    const strengthBar = document.getElementById("strengthBar");
    let score = 0;

    if (password.length >= 12) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[\W_]/.test(password)) score++;

    let strength = "";
    let width = 0;

    switch (score) {
        case 0:
            strength = "Very Weak";
            width = "0%";
            strengthBar.style.backgroundColor = "red";
            break;
        case 1:
            strength = "Weak";
            width = "20%";
            strengthBar.style.backgroundColor = "orange";
            break;
        case 2:
            strength = "Moderate";
            width = "40%";
            strengthBar.style.backgroundColor = "yellow";
            break;
        case 3:
            strength = "Strong";
            width = "60%";
            strengthBar.style.backgroundColor = "lightgreen";
            break;
        case 4:
            strength = "Very Strong";
            width = "80%";
            strengthBar.style.backgroundColor = "green";
            break;
        case 5:
            strength = "Excellent";
            width = "100%";
            strengthBar.style.backgroundColor = "darkgreen";
            break;
    }

    strengthMessage.innerText = strength;
    strengthBar.style.width = width;
}

function togglePasswordVisibility() {
    const passwordInput = document.getElementById("password");
    const toggleButton = document.getElementById("toggleVisibility");
    if (passwordInput.type === "password") {
        passwordInput.type = "text";
        toggleButton.innerText = "Hide";
    } else {
        passwordInput.type = "password";
        toggleButton.innerText = "Show";
    }
}

function generatePassword() {
    const length = parseInt(document.getElementById("length").value);
    if (isNaN(length) || length < 12) {
        alert("Please enter a valid length (minimum 12).");
        return;
    }

    const includeUpper = document.getElementById("includeUpper").checked;
    const includeLower = document.getElementById("includeLower").checked;
    const includeNumbers = document.getElementById("includeNumbers").checked;
    const includeSpecial = document.getElementById("includeSpecial").checked;

    const upperChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const lowerChars = "abcdefghijklmnopqrstuvwxyz";
    const numberChars = "0123456789";
    const specialChars = "!@#$%^&*()_+[]{}|;:,.<>?";
    
    let characters = "";
    if (includeUpper) characters += upperChars;
    if (includeLower) characters += lowerChars;
    if (includeNumbers) characters += numberChars;
    if (includeSpecial) characters += specialChars;

    if (characters.length === 0) {
        alert("Please select at least one character type.");
        return;
    }

    let password = "";
    for (let i = 0; i < length; i++) {
        password += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    document.getElementById("generatedPassword").innerText = password;
}

function copyPassword() {
    const password = document.getElementById("generatedPassword").innerText;
    navigator.clipboard.writeText(password)
        .then(() => alert("Password copied to clipboard!"))
        .catch(err => console.error("Error copying password: ", err));
}

function toggleDarkMode() {
    document.body.classList.toggle("dark-mode");
}
