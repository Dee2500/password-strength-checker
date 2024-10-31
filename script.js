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

function generatePassword() {
    const length = parseInt(document.getElementById("length").value);
    if (isNaN(length) || length < 12) {
        alert("Please enter a valid length (minimum 12).");
        return;
    }

    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+[]{}|;:,.<>?";
    let password = "";
    for (let i = 0; i < length; i++) {
        password += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    document.getElementById("generatedPassword").innerText = password;
}
