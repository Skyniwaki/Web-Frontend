const API_URL = 'https://web-backend-silk.vercel.app/api/games';

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

  titleEl.textContent = category;
  document.title = `${category} — Game Discovery`;

  renderSkeletons(resultsEl, 6, true);

  try {
    const res = await fetch(`${API_URL}?category=${encodeURIComponent(category)}`);
    if (!res.ok) throw new Error('โหลดข้อมูลไม่สำเร็จ');

    const games = await res.json();
    renderResults(resultsEl, countEl, games);
  } catch (err) {
    countEl.textContent = '';
    renderState(resultsEl, 'โหลดข้อมูลไม่สำเร็จ — ลองรีเฟรชหน้านี้อีกครั้ง', true);
    console.error(err);
  }
}

function renderResults(resultsEl, countEl, games) {
  countEl.textContent = `พบ ${games.length} เกม`;
  resultsEl.innerHTML = '';

  if (games.length === 0) {
    renderState(resultsEl, 'ยังไม่มีเกมในหมวดหมู่นี้');
    return;
  }

  games.forEach((game) => resultsEl.appendChild(makeGameCard(game)));
}

loadCategory();