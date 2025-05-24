const sheetId = '1OBaobYNGUIYz2p9S8VSy0-xtEQarukXbHd__NoZSpdA';
const apiKey = 'AIzaSyDO92zcmF1yGNa7_JNV_gDxscgnQ-xT6LI';
const range = 'TANGIBLES!A2:H';

const endpoint = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${range}?key=${apiKey}`;
const avatarApiBase = 'https://avatar-proxy-qxd1ngnpe-donsirrs-projects.vercel.app/api/avatar';

const tbody = document.getElementById("player-data");

fetch(endpoint)
  .then(response => response.json())
  .then(async data => {
    const rows = data.values;

    // Fetch all avatars in parallel
    const promises = rows.map(row => {
      const userId = row[0];
      const url = `${avatarApiBase}?userId=${userId}`;

      return fetch(url)
        .then(res => res.json())
        .then(json => ({
          avatarUrl: json.imageUrl || null,
          row
        }))
        .catch(err => {
          console.error(`Failed to load avatar for userId ${userId}`, err);
          return { avatarUrl: null, row };
        });
    });

    const results = await Promise.all(promises);

    // Render all rows
    results.forEach(({ avatarUrl, row }) => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>
          ${avatarUrl ? `<img src="${avatarUrl}" class="avatar" alt="Player" />` : '[No Avatar]'} ${row[1]}
        </td>
        <td>${row[2]}</td>
        <td>${row[3]}</td>
        <td>${row[4]}</td>
        <td>${row[5]}</td>
        <td>${row[6]}</td>
      `;
      tbody.appendChild(tr);
    });
  })
  .catch(error => console.error('Error loading player data:', error));
