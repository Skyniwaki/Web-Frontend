const API_URL = 'http://localhost:3000/api/games';
const coverColors = ['#4B2A2E', '#2E3A2A', '#2A3038', '#33231F', '#243228', '#1F2A38'];

function getCategoryName() {
  const params = new URLSearchParams(window.location.search);
  return params.get('name');
}

async function loadCategory() {
  const titleEl = document.getElementById('cat-title');
  const countEl = document.getElementById('cat-count');
  const resultsEl = document.getElementById('cat-results');
  const category = getCategoryName();

  if (!category) {
    titleEl.textContent = 'ไม่พบหมวดหมู่';
    countEl.textContent = 'กรุณากลับไปเลือกหมวดหมู่จากหน้าแรกใหม่';
    return;
  }

  titleEl.textContent = `หมวดหมู่: ${category}`;

  try {
    const res = await fetch(`${API_URL}?category=${encodeURIComponent(category)}`);

    if (!res.ok) {
      throw new Error('โหลดข้อมูลไม่สำเร็จ');
    }

    const games = await res.json();
    renderResults(resultsEl, countEl, games);
  } catch (err) {
    countEl.textContent = 'โหลดข้อมูลไม่สำเร็จ ตรวจสอบว่าเปิด backend ด้วย node app.js อยู่หรือไม่';
    console.error(err);
  }
}

function renderResults(resultsEl, countEl, games) {
  countEl.textContent = `พบ ${games.length} เกม`;
  resultsEl.innerHTML = '';

  if (games.length === 0) {
    resultsEl.innerHTML = '<p style="color:var(--text-mid);">ยังไม่มีเกมในหมวดหมู่นี้</p>';
    return;
  }

  games.forEach((game, index) => {
    const color = coverColors[(game.id - 1) % coverColors.length];

    const card = document.createElement('a');
    card.className = 'review-card';
    card.href = `game-detail.html?id=${game.id}`;
    card.style.display = 'block';
    card.innerHTML = `
      <div class="cover" style="background:${color}">${game.title}</div>
      <h4>${game.title}</h4>
      <div class="review-meta">
        <span class="genre">${game.category}</span>
        <span class="score">${game.score}</span>
      </div>
    `;
    resultsEl.appendChild(card);
  });
}

loadCategory();
