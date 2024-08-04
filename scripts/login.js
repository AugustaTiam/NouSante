document.addEventListener('DOMContentLoaded', function() {
    var form = document.getElementById('loginForm');
    var emailField = document.getElementById('email');
    var passwordField = document.getElementById('password');
    var loginMessage = document.getElementById('loginMessage');

    form.addEventListener('submit', function(event) {
        event.preventDefault();
        if (validateLoginForm()) {
            hashPassword(passwordField.value)
                .then(hashedPassword => {
                    var formData = new FormData();
                    formData.append('email', emailField.value);
                    formData.append('password', hashedPassword);

                    for (var pair of formData.entries()) {
                        console.log(pair[0] + ': ' + pair[1]);
                    }

                    fetch(form.action, {
                        method: 'POST',
                        body: formData
                    })
                    .then(response => response.text())
                    .then(data => {
                        loginMessage.textContent = data;
                        if (data.includes('Login successful')) {
                            window.location.href = 'home.html';
                        } else {
                            loginMessage.textContent = 'Invalid email or password. Please try again.';
                        }
                    })
                    .catch(error => {
                        console.error('Error:', error);
                        loginMessage.textContent = 'An error occurred. Please try again later.';
                    });
                })
                .catch(error => {
                    console.error('Error hashing password:', error);
                    loginMessage.textContent = 'An error occurred while processing your request. Please try again later.';
                });
        }
    });

    function validateLoginForm() {
        var email = emailField.value.trim();
        var password = passwordField.value.trim();

        if (email === '' || password === '') {
            loginMessage.textContent = 'Email and password are required.';
            return false;
        }

        return true;
    }

    async function hashPassword(password) {
        const encoder = new TextEncoder();
        const data = encoder.encode(password);
        const hashBuffer = await crypto.subtle.digest('SHA-256', data);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
        return hashHex;
    }
});
