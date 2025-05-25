const sheetId = '1xol0P--Cxp6Ze8xUibt3iTfnHYg-eu1n4ENG4XvFM3I';
const apiKey = 'AIzaSyBxGVk4brDAlwMmJE-Pl5e2WhI36YA4Fmo';
const range = 'REGULAR!A2:H'; // Adjust if needed

const endpoint = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${range}?key=${apiKey}`;
const rosterGrid = document.getElementById('roster-grid');

// Get team slug from URL
const urlParts = window.location.pathname.split('/');
const pageSlug = urlParts[urlParts.length - 1].replace('.html', '');

// Map slug to team name from Sheet column H
const teamSlugMap = {
    'msu': 'Mindanao State University',
    'nu': 'National University',
    'ush': 'University of Sport Ho Chi Minh City',
    'pes': 'PES University',
    'goon': 'Goon International College',
    'kyoto': 'Kyoto University',
    'ite': 'Institute of Technical Education',
    'adu': 'Adamson University',
    'uq': 'University of Queensland',
    'dlsu': 'De La Salle University',
    'chuo': 'Chuo University',
    'up': 'University of the Philippines',
    'sti': 'STI College',
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