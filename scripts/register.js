async function hashPassword(password) {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    return hashHex;
}

function validatePassword(password) {
    const minLength = 8;
    let message = "Password must meet the following requirements:\n";
    let isValid = true;

    if (password.length < minLength) {
        message += "\n- At least 8 characters long";
        isValid = false;
    }
    if (!/[A-Z]/.test(password)) {
        message += "\n- At least one uppercase letter";
        isValid = false;
    }
    if (!/[a-z]/.test(password)) {
        message += "\n- At least one lowercase letter";
        isValid = false;
    }
    if (!/[0-9]/.test(password)) {
        message += "\n- At least one number";
        isValid = false;
    }
    if (!/[~!@#$%^&*()_\-+=]/.test(password)) {
        message += "\n- At least one special character";
        isValid = false;
    }

    return isValid ? "" : message;
}

async function validateForm(event) {
    event.preventDefault();

    var password = document.getElementById("password").value;
    var confirm_password = document.getElementById("confirm_password").value;
    var password_message = document.getElementById("password_message");

    const passwordValidationMessage = validatePassword(password);

    if (passwordValidationMessage) {
        password_message.textContent = passwordValidationMessage;
        password_message.style.color = "red";
        return false;
    }

    if (password !== confirm_password) {
        password_message.textContent = "Passwords do not match.";
        password_message.style.color = "red";
        return false;
    } else {
        password_message.textContent = "";

        var hashedPassword = await hashPassword(password);

        const form = document.getElementById("registrationForm");
        const formData = new FormData(form);
        formData.set('password', hashedPassword);

        try {
            const response = await fetch(form.action, {
                method: 'POST',
                body: formData
            });

            if (response.ok) {
                window.location.href = 'home.html';
            } else {
                throw new Error('Network response was not ok.');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('There was an error processing your registration. Please try again.');
        }

        return true;
    }
}

document.getElementById("registrationForm").addEventListener("submit", validateForm);
