let checkTimeout;

document.getElementById("password").addEventListener("input", checkStrength);
document.getElementById("toggleVisibility").addEventListener("click", togglePasswordVisibility);
document.getElementById("toggleDarkMode").addEventListener("click", toggleDarkMode);
document.getElementById("generateButton").addEventListener("click", generatePassword);
document.getElementById("copyButton").addEventListener("click", copyPassword);

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
        case 0: strength = "Very Weak"; width = "0%"; strengthBar.style.backgroundColor = "red"; break;
        case 1: strength = "Weak"; width = "20%"; strengthBar.style.backgroundColor = "orange"; break;
        case 2: strength = "Moderate"; width = "40%"; strengthBar.style.backgroundColor = "yellow"; break;
        case 3: strength = "Strong"; width = "60%"; strengthBar.style.backgroundColor = "lightgreen"; break;
        case 4: strength = "Very Strong"; width = "80%"; strengthBar.style.backgroundColor = "green"; break;
        case 5: strength = "Excellent"; width = "100%"; strengthBar.style.backgroundColor = "darkgreen"; break;
    }

    strengthMessage.innerText = strength;
    strengthBar.style.width = width;

    clearTimeout(checkTimeout);
    checkTimeout = setTimeout(() => {
        checkPasswordBreach(password);
    }, 1000);
}

async function checkPasswordBreach(password) {
    const sha1 = await hashPassword(password);
    const prefix = sha1.slice(0, 5);
    const suffix = sha1.slice(5);
    
    const response = await fetch(`https://api.pwnedpasswords.com/range/${prefix}`);
    
    if (response.ok) {
        const data = await response.text();
        const breachedPasswords = data.split('\n').map(line => line.split(':')[0]);

        if (breachedPasswords.includes(suffix.toUpperCase())) {
            alert("This password has been exposed in a data breach! Please choose a different password.");
        }
    } else {
        console.error("Failed to check password: ", response.status);
    }
}

function hashPassword(password) {
    return new Promise((resolve, reject) => {
        const encoder = new TextEncoder();
        const data = encoder.encode(password);
        crypto.subtle.digest('SHA-1', data).then(hashBuffer => {
            const hashArray = Array.from(new Uint8Array(hashBuffer));
            const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
            resolve(hashHex);
        }).catch(reject);
    });
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

    let charPool = "";
    if (includeUpper) charPool += upperChars;
    if (includeLower) charPool += lowerChars;
    if (includeNumbers) charPool += numberChars;
    if (includeSpecial) charPool += specialChars;

    if (charPool.length === 0) {
        alert("Please select at least one character type.");
        return;
    }

    let password = "";
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * charPool.length);
        password += charPool[randomIndex];
    }

    document.getElementById("generatedPassword").innerText = password;
}

function copyPassword() {
    const generatedPassword = document.getElementById("generatedPassword").innerText.trim();
    if (generatedPassword) {
        navigator.clipboard.writeText(generatedPassword).then(() => {
            alert("Password copied to clipboard!");
        }).catch(err => {
            alert("Failed to copy password: " + err);
        });
    } else {
        alert("No password to copy.");
    }
}

function toggleDarkMode() {
    document.body.classList.toggle("dark-mode");
}
