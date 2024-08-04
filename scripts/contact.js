document.addEventListener('DOMContentLoaded', function() {
    const form = document.querySelector(".contact");
    const submitButton = document.querySelector(".submit");
    const scriptURL = 'https://script.google.com/macros/s/AKfycby0KJKZT39uaqXgQqHDZ3wbD43JKGEAcO63A_oFZ2EOJPbcaXrfdBmnTozzQqXp6A3v1g/exec';

    form.addEventListener('submit', function(e) {
        submitButton.disabled = true;
        e.preventDefault();
        let requestBody = new FormData(form);
        fetch(scriptURL, {
            method: 'POST',
            body: requestBody
        })
        .then(response => response.text())
        .then(text => {
            alert('Thank you for filling out our Contact form. Our team will be in touch');
            submitButton.disabled = false;
        })
        .catch(error => {
            alert('Error!', error.message);
            submitButton.disabled = false;
        });
    });
});
