const sheetId = '1xol0P--Cxp6Ze8xUibt3iTfnHYg-eu1n4ENG4XvFM3I';
const apiKey = 'AIzaSyBxGVk4brDAlwMmJE-Pl5e2WhI36YA4Fmo';
const range = 'CONTINENTAL!A2:H'; // Adjust if needed

const endpoint = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${range}?key=${apiKey}`;
const rosterGrid = document.getElementById('roster-grid');

// Get team slug from URL
const urlParts = window.location.pathname.split('/');
const pageSlug = urlParts[urlParts.length - 1].replace('.html', '');

// Map slug to team name from Sheet column H
const teamSlugMap = {
    'china': 'Dragons of the Red Sun',
    'japan': 'Samurai Storm',
    'indonesia': 'Timnas',
    'australia': 'Southern Stars',
    'malaysia': 'Tiger Spirit',
    'mongolia': 'Steppe Thunder',
    'philippines': 'Tropic Blaze',
    'singapore': 'Lion City Legends',
    'korea': 'Hongdaegenus',
    'india': 'Indus Warriors'
};

const currentTeam = teamSlugMap[pageSlug];

if (!currentTeam) {
    console.error('Team not found for slug:', pageSlug);
    rosterGrid.innerHTML = '<p>Team not recognized for this page.</p>';
} else {
    fetch(endpoint)
        .then(response => response.json())
        .then(data => {
            const rows = data.values;

            rows.forEach(row => {
                const [username, displayName, flagUrl, position, role, avatarUrl, userId, teamName] = row;

                if (teamName === currentTeam) {
                    const playerHTML = `
                        <a href="https://www.roblox.com/users/${userId}" target="_blank" class="player-card">
                            <img src="${avatarUrl}" alt="Avatar" class="player-avatar"/>
                            <div class="player-info">
                                <p class="position">${position}</p>
                                <p class="display-name">${displayName} <span class="role-tag">${role}</span></p>
                                <p class="username">
                                    <img src="${flagUrl}" class="flag-icon" alt="Flag" />
                                    @${username}
                                </p>
                            </div>
                        </a>
                    `;

                    rosterGrid.innerHTML += playerHTML;
                }
            });
        })
        .catch(err => {
            console.error('Error loading player data:', err);
            rosterGrid.innerHTML = '<p>Failed to load player data.</p>';
        });
}