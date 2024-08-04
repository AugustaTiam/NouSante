let fetchedData = [];

function fetchData() {
    const scriptUrl = 'https://script.google.com/macros/s/AKfycbyjO1-rTvjV9MpQCUE2sfsHgVXCKte879yuArRrpJxnIBe2RrcyRK0ogvq2xC4KlgSn/exec';

    fetch(scriptUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log('Fetched Data:', data);
            fetchedData = data;
            displayDoctors();
        })
        .catch(error => console.error('Error fetching data:', error));
}


function displayDoctors() {
    const container = document.getElementById('doctors-container');
    const searchInput = document.getElementById('searchInput').value.trim().toLowerCase();
    const filteredDoctors = fetchedData.filter(doctor =>
        doctor.Name.toLowerCase().includes(searchInput)
    );

    container.innerHTML = '';

    filteredDoctors.forEach(doctor => {
        const doctorDiv = document.createElement('div');
        doctorDiv.classList.add('doctor');
        
        doctorDiv.innerHTML = `
            <h2>${doctor.Name}</h2>
            <p><strong>Speciality:</strong> ${doctor.Speciality}</p>
            <p><strong>Email:</strong> ${doctor.Email}</p>
            <p><strong>Phone Number:</strong> ${doctor['Phone Number']}</p>
            <p><strong>Location:</strong> ${doctor.Location}</p>
        `;
        
        container.appendChild(doctorDiv);
    });

    if (filteredDoctors.length === 0) {
        container.innerHTML = '<p>No doctors found.</p>';
    }
}

function filterDoctors() {
    displayDoctors();
}

window.onload = () => {
    fetchData();
    document.getElementById('searchInput').addEventListener('keyup', filterDoctors);
};
