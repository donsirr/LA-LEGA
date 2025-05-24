const sheetId = '1OBaobYNGUIYz2p9S8VSy0-xtEQarukXbHd__NoZSpdA';
const apiKey = 'AIzaSyDO92zcmF1yGNa7_JNV_gDxscgnQ-xT6LI';
const range = 'TANGIBLES!A2:H';

const endpoint = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${range}?key=${apiKey}`;
const tbody = document.getElementById("player-data");

fetch(endpoint)
    .then(response => response.json())
    .then(data => {
        const rows = data.values;

        for (const row of rows) {
            const userId = row[0]; // Roblox user ID in column A
            const proxyApi = `https://avatar-proxy-phi.vercel.app/api/avatar?userId=${userId}`; // Proxy endpoint

            fetch(proxyApi)
                .then(response => response.json())
                .then(avatarData => {
                    const avatarUrl = avatarData.imageUrl;

                    const tr = document.createElement('tr');
                    tr.innerHTML = `
                        <td><img src="${avatarUrl}" class="avatar" alt="Player" /> ${row[1]}</td>
                        <td>${row[2]}</td>
                        <td>${row[3]}</td>
                        <td>${row[4]}</td>
                        <td>${row[5]}</td>
                        <td>${row[6]}</td>
                    `;

                    tbody.appendChild(tr);
                })
                .catch(err => {
                    console.error(`Error fetching avatar for userId ${userId}:`, err);
                });
        }
    })
    .catch(error => {
        console.error('Error fetching player data:', error);
    });