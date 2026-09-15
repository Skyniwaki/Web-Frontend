const API_BASE = 'https://web-backend-silk.vercel.app/api';
const coverColors = ['#4B2A2E', '#2E3A2A', '#2A3038', '#33231F', '#243228', '#1F2A38'];

function coverColorFor(id) {
  return coverColors[(id - 1) % coverColors.length];
}

function makeGameCard(game, small) {
  const a = document.createElement('a');
  a.className = 'review-card';
  a.href = `game-detail.html?id=${game.id}`;
  a.style.display = 'block';
  a.innerHTML = `
    <div class="cover" style="background:${coverColorFor(game.id)}">${game.title}</div>
    <h4${small ? ' style="font-size:14px;"' : ''}>${game.title}</h4>
    <div class="review-meta">
      <span class="genre">${game.category}</span>
      <span class="score">${game.score}</span>
    </div>
  `;
  return a;
}

async function fetchJSON(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`โหลดข้อมูลจาก ${url} ไม่สำเร็จ`);
  return res.json();
}

function showLoadError(container, message) {
  container.innerHTML = `<p style="color:var(--text-mid);font-size:14px;">${message} ตรวจสอบว่าเปิด backend ด้วย node app.js อยู่ที่ http://localhost:3000 หรือไม่</p>`;
}

// 1) แถบรีวิวยอดนิยม — เรียงตามคะแนนสูงสุด
async function loadReviewStrip() {
  const container = document.getElementById('review-strip');
  try {
    const games = await fetchJSON(`${API_BASE}/games?sort=score_desc&limit=8`);
    container.innerHTML = '';
    games.forEach((game) => container.appendChild(makeGameCard(game, false)));
  } catch (err) {
    showLoadError(container, 'โหลดรายการเกมไม่สำเร็จ');
    console.error(err);
  }
}

// 2) หมวดหมู่ยอดนิยม — ดึงจำนวนเกมจริงจาก API แทนตัวเลขสมมติ
async function loadCategoryTiles() {
  const container = document.getElementById('cat-grid');
  try {
    const categories = await fetchJSON(`${API_BASE}/categories`);
    container.innerHTML = '';

    if (categories.length === 0) {
      container.innerHTML = '<p style="color:var(--text-mid);font-size:14px;">ยังไม่มีหมวดหมู่ในระบบ</p>';
      return;
    }

    categories.slice(0, 5).forEach((c, index) => {
      const a = document.createElement('a');
      a.className = 'cat-tile' + (index === 0 || index === 4 ? ' wide' : '');
      a.href = `category.html?name=${encodeURIComponent(c.category)}`;
      a.innerHTML = `<b>${c.category}</b><span>${c.count} เกม</span>`;
      container.appendChild(a);
    });
  } catch (err) {
    showLoadError(container, 'โหลดหมวดหมู่ไม่สำเร็จ');
    console.error(err);
  }
}

// 3) เกมคะแนนสูงสุด
async function loadTopRated() {
  const container = document.getElementById('rec-row');
  try {
    const games = await fetchJSON(`${API_BASE}/games?sort=score_desc&limit=3`);
    container.innerHTML = '';
    games.forEach((game) => {
      const card = makeGameCard(game, true);
      card.classList.add('rec-card');
      container.appendChild(card);
    });
  } catch (err) {
    showLoadError(container, 'โหลดเกมคะแนนสูงสุดไม่สำเร็จ');
    console.error(err);
  }
}

// 4) เกมที่เพิ่มล่าสุด (แทนที่บล็อกข่าวตัวอย่างเดิมด้วยข้อมูลจริงจากฐานข้อมูล)
async function loadRecentlyAdded() {
  const container = document.getElementById('recent-list');
  try {
    const games = await fetchJSON(`${API_BASE}/games?sort=newest&limit=3`);
    container.innerHTML = '';

    if (games.length === 0) {
      container.innerHTML = '<p style="color:var(--text-mid);font-size:14px;">ยังไม่มีเกมในระบบ</p>';
      return;
    }

    games.forEach((game) => {
      const item = document.createElement('a');
      item.className = 'news-item';
      item.href = `game-detail.html?id=${game.id}`;
      item.innerHTML = `
        <div class="news-thumb" style="background:${coverColorFor(game.id)}"></div>
        <div><h5>${game.title}</h5><span>${game.category} · คะแนน ${game.score}</span></div>
      `;
      container.appendChild(item);
    });
  } catch (err) {
    showLoadError(container, 'โหลดเกมล่าสุดไม่สำเร็จ');
    console.error(err);
  }
}

// 5) การ์ดเด่นบน Hero + สถิติ — คำนวณจากข้อมูลจริงทั้งหมดในฐานข้อมูล
async function loadHero() {
  const heroCard = document.getElementById('hero-card');
  const statGames = document.getElementById('stat-games');
  const statPicks = document.getElementById('stat-picks');
  const statCats = document.getElementById('stat-cats');

  try {
    const [games, categories] = await Promise.all([
      fetchJSON(`${API_BASE}/games`),
      fetchJSON(`${API_BASE}/categories`),
    ]);

    if (statGames) statGames.textContent = games.length;
    if (statCats) statCats.textContent = categories.length;

    const picks = games.filter((g) => g.editors_pick);
    if (statPicks) statPicks.textContent = picks.length;

    const featured = picks[0] || [...games].sort((a, b) => b.score - a.score)[0];

    if (featured && heroCard) {
      heroCard.href = `game-detail.html?id=${featured.id}`;
      heroCard.innerHTML = `
        <div class="hero-card-top">
          <span class="badge-score">${featured.score} / 10</span>
          <span class="badge-pick">${featured.editors_pick ? 'ตัวเลือกของบรรณาธิการ' : 'คะแนนสูงสุด'}</span>
        </div>
        <h3>${featured.title}</h3>
        <p>${featured.description}</p>
        <div class="tag-row"><span class="tag">${featured.category}</span></div>
      `;
    }
  } catch (err) {
    if (heroCard) showLoadError(heroCard, 'โหลดข้อมูลไม่สำเร็จ');
    console.error(err);
  }
}

loadHero();
loadReviewStrip();
loadCategoryTiles();
loadTopRated();
loadRecentlyAdded();
