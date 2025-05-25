const sheetId = '1xol0P--Cxp6Ze8xUibt3iTfnHYg-eu1n4ENG4XvFM3I';
const apiKey = 'AIzaSyBxGVk4brDAlwMmJE-Pl5e2WhI36YA4Fmo';
const sheetMap = {
    "Continental Cup": "STANDINGS-CONTINENTAL",
    "Challengers Cup": "STANDINGS-CHALLENGERS",
    "Regular Season": "STANDINGS-REGULAR"
};

const filterSelect = document.getElementById('standings-filter');
const tableBody = document.getElementById('standings-body');

// Listener for dropdown
filterSelect.addEventListener('change', () => {
    const selectedSheet = sheetMap[filterSelect.value];
    loadStandings(selectedSheet);
});

// Main loader
async function loadStandings(sheetName) {
    const range = `${sheetName}!A2:G`; // Includes team_id column
    const endpoint = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${range}?key=${apiKey}`;

    try {
        const res = await fetch(endpoint);
        const data = await res.json();
        let rows = data.values;

        // Sort by Win% (index 4), descending
        rows.sort((a, b) => parseFloat(b[4]) - parseFloat(a[4]));

        // Clear table first
        tableBody.innerHTML = '';

        // Render table with dynamic rank
        rows.forEach((row, index) => {
            const rank = index + 1;
            const teamName = row[1];
            const teamId = row[0]; // team_id
            const wins = row[2];
            const losses = row[3];
            let winPct = row[4];
            const streak = row[5];
            const country = row[6];

            // Handle #DIV/0! or empty Win%
            if (winPct === '#DIV/0!' || (!wins && !losses)) {
                winPct = '0';
            }

            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${rank}</td>
                <td>
                    <a href="teams/continental/${country}.html" class="team-link">
                        <img src="${teamId}" class="team-logo">
                        ${teamName}
                    </a>
                </td>
                <td>${wins}</td>
                <td>${losses}</td>
                <td>${winPct}</td>
                <td>${streak}</td>
            `;
            tableBody.appendChild(tr);
        });

    } catch (error) {
        console.error("Error loading standings:", error);
        tableBody.innerHTML = '<tr><td colspan="6">Failed to load standings</td></tr>';
    }
}

// Auto-load default
loadStandings("STANDINGS-CONTINENTAL");