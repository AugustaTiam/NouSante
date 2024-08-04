let currentPage = 1;
const rowsPerPage = 10;
let allPatientRecords = [];

async function fetchData(url) {
    try {
        console.log('Fetching data from:', url);
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Network response was not ok. Status: ${response.status}`);
        }
        const data = await response.json();
        console.log('Received data:', data);
        return data;
    } catch (error) {
        console.error('Error fetching data:', error);
        return [];
    }
}

async function displayPatientRecords() {
    console.log('Fetching patient records...');
    allPatientRecords = await fetchData('http://127.0.0.1:5000/patients'); 
    console.log('Patient records:', allPatientRecords);

    if (Array.isArray(allPatientRecords)) {
        console.log('Patient records are an array.');
        const patientTable = document.getElementById('patient-records');
        patientTable.innerHTML = '';

        const table = document.createElement('table');
        const thead = document.createElement('thead');
        const tbody = document.createElement('tbody');

        thead.innerHTML = `
            <tr>
                <th>Name</th>
                <th>Age</th>
                <th>Gender</th>
                <th>Symptoms</th>
                <th>Diagnosis</th>
                <th>Date of Visit</th>
            </tr>
        `;
        table.appendChild(thead);
        table.appendChild(tbody);
        patientTable.appendChild(table);

        updateTable(allPatientRecords);
    } else {
        console.error('Expected an array for patient records, but received:', allPatientRecords);
    }
}

async function displayHealthTips() {
    console.log('Fetching health tips...');
    const healthTips = await fetchData('http://127.0.0.1:5000/health_tips');
    console.log('Health tips:', healthTips);

    if (Array.isArray(healthTips)) {
        console.log('Health tips are an array.');
        const tipsDiv = document.getElementById('health-tips');
        tipsDiv.innerHTML = '';

        healthTips.forEach(tip => {
            const tipDiv = document.createElement('div');
            tipDiv.innerHTML = `<p>${tip.Diagnosis}: ${tip['Health Tips']}</p>`;
            tipsDiv.appendChild(tipDiv);
        });
    } else {
        console.error('Expected an array for health tips, but received:', healthTips);
    }
}

function updateTable(records) {
    console.log('Updating table for page:', currentPage);
    const table = document.querySelector('#patient-records table');
    const tbody = table.querySelector('tbody');
    tbody.innerHTML = '';

    const totalPages = Math.ceil(records.length / rowsPerPage);
    console.log('Total pages:', totalPages);

    const start = (currentPage - 1) * rowsPerPage;
    const end = Math.min(currentPage * rowsPerPage, records.length);
    console.log('Displaying rows from', start, 'to', end);

    for (let i = start; i < end; i++) {
        const record = records[i];
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${record.Name}</td>
            <td>${record.Age}</td>
            <td>${record.Gender}</td>
            <td>${record.Symptoms}</td>
            <td>${record.Diagnosis}</td>
            <td>${record['Date of Visit']}</td>  <!-- Added Date of Visit -->
        `;
        tbody.appendChild(row);
    }

    document.getElementById('page-info').textContent = `Page ${currentPage} of ${Math.ceil(records.length / rowsPerPage)}`;
    document.getElementById('prevBtn').style.display = currentPage === 1 ? 'none' : 'inline';
    document.getElementById('nextBtn').style.display = currentPage === Math.ceil(records.length / rowsPerPage) ? 'none' : 'inline';
}

async function changePage(direction) {
    console.log('Changing page by direction:', direction);
    if (Array.isArray(allPatientRecords)) {
        const totalPages = Math.ceil(allPatientRecords.length / rowsPerPage);
        currentPage += direction;
        currentPage = Math.max(1, Math.min(currentPage, totalPages));
        console.log('Current page:', currentPage);
        updateTable(allPatientRecords);
    }
}

function filterTable() {
    const input = document.getElementById('searchInput');
    const filter = input.value.toUpperCase();
    const filteredRecords = allPatientRecords.filter(record => {
        return record.Name.toUpperCase().indexOf(filter) > -1;
    });

    currentPage = 1;
    updateTable(filteredRecords);
}

window.onload = () => {
    displayPatientRecords();
    displayHealthTips();
    document.getElementById('searchInput').addEventListener('keyup', filterTable);
};
