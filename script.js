const translations = {
    en: {
        title: "Password Strength Checker & Generator",
        enterPassword: "Enter Password:",
        show: "Show",
        hide: "Hide",
        enterLength: "Enter Length for Generated Password (min 12):",
        includeUpper: "Include Uppercase",
        includeLower: "Include Lowercase",
        includeNumbers: "Include Numbers",
        includeSpecial: "Include Special Characters",
        generate: "Generate Password",
        copy: "Copy Password",
        passwordCopied: "Password copied to clipboard!",
        noPassword: "No password to copy.",
        minLengthError: "Please enter a valid length (minimum 12).",
        selectCharacterError: "Please select at least one character type.",
        breachAlert: "This password has been exposed in a data breach! Please choose a different password.",
        veryWeak: "Very Weak",
        weak: "Weak",
        moderate: "Moderate",
        strong: "Strong",
        veryStrong: "Very Strong",
        excellent: "Excellent",
        darkMode: "Toggle Dark Mode"
    },
    es: {
        title: "Comprobador y Generador de Fuerza de Contraseña",
        enterPassword: "Ingrese Contraseña:",
        show: "Mostrar",
        hide: "Ocultar",
        enterLength: "Ingrese la Longitud para la Contraseña Generada (mínimo 12):",
        includeUpper: "Incluir Mayúsculas",
        includeLower: "Incluir Minúsculas",
        includeNumbers: "Incluir Números",
        includeSpecial: "Incluir Caracteres Especiales",
        generate: "Generar Contraseña",
        copy: "Copiar Contraseña",
        passwordCopied: "¡Contraseña copiada al portapapeles!",
        noPassword: "No hay contraseña para copiar.",
        minLengthError: "Por favor, ingrese una longitud válida (mínimo 12).",
        selectCharacterError: "Por favor, seleccione al menos un tipo de carácter.",
        breachAlert: "¡Esta contraseña ha sido expuesta en una violación de datos! Elija una contraseña diferente.",
        veryWeak: "Muy Débil",
        weak: "Débil",
        moderate: "Moderado",
        strong: "Fuerte",
        veryStrong: "Muy Fuerte",
        excellent: "Excelente",
        darkMode: "Activar Modo Oscuro"
    }
};

let checkTimeout;

document.getElementById("languageSelector").addEventListener("change", translate);

document.getElementById("password").addEventListener("input", checkStrength);
document.getElementById("toggleVisibility").addEventListener("click", togglePasswordVisibility);
document.getElementById("toggleDarkMode").addEventListener("click", toggleDarkMode);
document.getElementById("generateButton").addEventListener("click", generatePassword);
document.getElementById("copyButton").addEventListener("click", copyPassword);

function translate() {
    const selectedLang = document.getElementById("languageSelector").value;
    const keys = document.querySelectorAll('[data-i18n]');

    keys.forEach(key => {
        const translationKey = key.getAttribute('data-i18n');
        key.innerText = translations[selectedLang][translationKey];
    });
}

// Call translate on initial load
translate();

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
        case 0: strength = translations[document.getElementById("languageSelector").value].veryWeak; width = "0%"; strengthBar.style.backgroundColor = "red"; break;
        case 1: strength = translations[document.getElementById("languageSelector").value].weak; width = "20%"; strengthBar.style.backgroundColor = "orange"; break;
        case 2: strength = translations[document.getElementById("languageSelector").value].moderate; width = "40%"; strengthBar.style.backgroundColor = "yellow"; break;
        case 3: strength = translations[document.getElementById("languageSelector").value].strong; width = "60%"; strengthBar.style.backgroundColor = "lightgreen"; break;
        case 4: strength = translations[document.getElementById("languageSelector").value].veryStrong; width = "80%"; strengthBar.style.backgroundColor = "green"; break;
        case 5: strength = translations[document.getElementById("languageSelector").value].excellent; width = "100%"; strengthBar.style.backgroundColor = "darkgreen"; break;
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
            alert(translations[document.getElementById("languageSelector").value].breachAlert);
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
        toggleButton.innerText = translations[document.getElementById("languageSelector").value].hide;
    } else {
        passwordInput.type = "password";
        toggleButton.innerText = translations[document.getElementById("languageSelector").value].show;
    }
}

function generatePassword() {
    const length = parseInt(document.getElementById("length").value);
    if (isNaN(length) || length < 12) {
        alert(translations[document.getElementById("languageSelector").value].minLengthError);
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
        alert(translations[document.getElementById("languageSelector").value].selectCharacterError);
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
    if (password) {
        navigator.clipboard.writeText(password)
            .then(() => alert(translations[document.getElementById("languageSelector").value].passwordCopied))
            .catch(err => console.error("Error copying password: ", err));
    } else {
        alert(translations[document.getElementById("languageSelector").value].noPassword);
    }
}

function toggleDarkMode() {
    document.body.classList.toggle("dark-mode");
}
