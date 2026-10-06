const API_BASE = 'https://web-backend-silk.vercel.app/api';

async function fetchJSON(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`โหลดข้อมูลจาก ${url} ไม่สำเร็จ`);
  return res.json();
}

// 1) แถบรีวิวยอดนิยม — เรียงตามคะแนนสูงสุด
async function loadReviewStrip() {
  const container = document.getElementById('review-strip');
  renderSkeletons(container, 6, true);
  try {
    const games = await fetchJSON(`${API_BASE}/games?sort=score_desc&limit=8`);
    container.innerHTML = '';
    if (games.length === 0) {
      renderState(container, 'ยังไม่มีเกมในระบบ');
      return;
    }
    games.forEach((game) => container.appendChild(makeGameCard(game)));
  } catch (err) {
    renderState(container, 'โหลดรายการเกมไม่สำเร็จ', true);
    console.error(err);
  }
}

// 2) หมวดหมู่ยอดนิยม — ดึงจำนวนเกมจริงจาก API
async function loadCategoryTiles() {
  const container = document.getElementById('cat-grid');
  try {
    const categories = await fetchJSON(`${API_BASE}/categories`);
    container.innerHTML = '';

    if (categories.length === 0) {
      renderState(container, 'ยังไม่มีหมวดหมู่ในระบบ');
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
    renderState(container, 'โหลดหมวดหมู่ไม่สำเร็จ', true);
    console.error(err);
  }
}

// 3) เกมคะแนนสูงสุด
async function loadTopRated() {
  const container = document.getElementById('rec-row');
  renderSkeletons(container, 3, true);
  try {
    const games = await fetchJSON(`${API_BASE}/games?sort=score_desc&limit=3`);
    container.innerHTML = '';
    if (games.length === 0) {
      renderState(container, 'ยังไม่มีเกมในระบบ');
      return;
    }
    games.forEach((game) => container.appendChild(makeGameCard(game)));
  } catch (err) {
    renderState(container, 'โหลดเกมคะแนนสูงสุดไม่สำเร็จ', true);
    console.error(err);
  }
}

// 4) เกมที่เพิ่มล่าสุด
async function loadRecentlyAdded() {
  const container = document.getElementById('recent-list');
  try {
    const games = await fetchJSON(`${API_BASE}/games?sort=newest&limit=4`);
    container.innerHTML = '';

    if (games.length === 0) {
      renderState(container, 'ยังไม่มีเกมในระบบ');
      return;
    }

    games.forEach((game) => {
      const item = document.createElement('a');
      item.className = 'news-item';
      item.href = `game-detail.html?id=${game.id}`;

      const thumb = game.image_url
        ? `<div class="news-thumb"><img src="${game.image_url}" alt="" loading="lazy" onerror="this.remove()"></div>`
        : `<div class="news-thumb" style="--cover-bg:${coverColorFor(game.id)}"></div>`;

      item.innerHTML = `
        ${thumb}
        <div>
          <h5>${game.title}</h5>
          <span>${game.category} · คะแนน ${game.score}</span>
        </div>
      `;
      container.appendChild(item);
    });
  } catch (err) {
    renderState(container, 'โหลดเกมล่าสุดไม่สำเร็จ', true);
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
          <span class="badge-score">${featured.score}</span>
          <span class="badge-pick">${featured.editors_pick ? 'ตัวเลือกของบรรณาธิการ' : 'คะแนนสูงสุด'}</span>
        </div>
        <h3>${featured.title}</h3>
        <p>${featured.description}</p>
        <div class="tag-row"><span class="chip">${featured.category}</span></div>
      `;
    }
  } catch (err) {
    if (heroCard) {
      heroCard.removeAttribute('href');
      renderState(heroCard, 'โหลดข้อมูลไม่สำเร็จ', true);
    }
    console.error(err);
  }
}

loadHero();
loadReviewStrip();
loadCategoryTiles();
loadTopRated();
loadRecentlyAdded();