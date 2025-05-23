const sheetId = '1xol0P--Cxp6Ze8xUibt3iTfnHYg-eu1n4ENG4XvFM3I';
const apiKey = 'AIzaSyBxGVk4brDAlwMmJE-Pl5e2WhI36YA4Fmo';
const sheetName = 'MATCHES';

const filterCompetition = document.getElementById('filter-competition');
const filterRound = document.getElementById('filter-round');
const matchContainer = document.getElementById('match-container');

let allMatches = [];

window.onload = async () => {
    await loadMatchesFromSheet();
    updateRoundOptions();
    applyFilters();
};

// Fetch and store all match data
async function loadMatchesFromSheet() {
    const range = `${sheetName}!A2:K`;
    const endpoint = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${range}?key=${apiKey}`;

    try {
        const res = await fetch(endpoint);
        const data = await res.json();

        allMatches = data.values.map(row => ({
            team1_name: row[0],
            team2_name: row[1],
            team1_logo: row[2],
            team2_logo: row[3],
            team1_score: row[4],
            team2_score: row[5],
            sets_team1: row[6]?.split(',') || [],
            sets_team2: row[7]?.split(',') || [],
            competition: row[8],
            round: row[9],
        }));

    } catch (error) {
        console.error("Error loading match data:", error);
        matchContainer.innerHTML = '<p>Error loading matches.</p>';
    }
}

// Filter handlers
filterCompetition.addEventListener('change', () => {
    updateRoundOptions();
    applyFilters();
});

filterRound.addEventListener('change', applyFilters);

// Populate round dropdown based on selected competition
function updateRoundOptions() {
    const selectedCompetition = filterCompetition.value;
    const rounds = new Set();

    allMatches.forEach(match => {
        if (selectedCompetition === 'All' || match.competition === selectedCompetition) {
            if (match.round) rounds.add(match.round);
        }
    });

    filterRound.innerHTML = '<option value="All">All Rounds</option>';
    [...rounds].sort().forEach(round => {
        const option = document.createElement('option');
        option.value = round;
        option.textContent = round;
        filterRound.appendChild(option);
    });
}

// Apply filters and render
function applyFilters() {
    const comp = filterCompetition.value;
    const rnd = filterRound.value;

    const filtered = allMatches.filter(m =>
        (comp === 'All' || m.competition === comp) &&
        (rnd === 'All' || m.round === rnd)
    );

    renderMatches(filtered);
}

// Render matches
function renderMatches(matches) {
    const matchesContainer = document.getElementById("matches");
    matchesContainer.innerHTML = "";

    matches.forEach(match => {
        const {
            team1_name,
            team2_name,
            team1_logo,
            team2_logo,
            team1_score,
            team2_score,
            round,
        } = match;

        const sets1 = (match.sets_team1 || "").toString().split(",").map(s => parseInt(s.trim()));
        const sets2 = (match.sets_team2 || "").toString().split(",").map(s => parseInt(s.trim()));
        
        const setsHTML = sets1.map((set1Score, i) => {
            const set2Score = sets2[i] || 0;
            const team1Winner = set1Score > set2Score;
            const team2Winner = set2Score > set1Score;

            return `
                <div class="set">
                    <span class="set-score ${team1Winner ? 'winner' : ''}">${set1Score}</span> - 
                    <span class="set-score ${team2Winner ? 'winner' : ''}">${set2Score}</span>
                </div>
            `;
        }).join('');

        const matchHTML = `
            <div class="match-card">
                <div class="match-round">${round}</div>
                <div class="match-top">
                    <div class="match-team">
                        <img src="${team1_logo}" alt="${team1_name}">
                        <div>${team1_name}</div>
                    </div>
                    <div class="match-score">${team1_score}–${team2_score}</div>
                    <div class="match-team">
                        <img src="${team2_logo}" alt="${team2_name}">
                        <div>${team2_name}</div>
                    </div>
                </div>
                <div class="set-scores">
                    ${setsHTML}
                </div>
            </div>
        `;

        matchesContainer.innerHTML += matchHTML;
    });
}
