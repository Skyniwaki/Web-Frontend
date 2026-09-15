const API_BASE = 'https://web-backend-silk.vercel.app/api';
const coverColors = ['#4B2A2E', '#2E3A2A', '#2A3038', '#33231F', '#243228', '#1F2A38'];

const searchInput = document.getElementById('search-input');
const categoryFilter = document.getElementById('category-filter');
const sortFilter = document.getElementById('sort-filter');
const editorsPickFilter = document.getElementById('editors-pick-filter');
const countEl = document.getElementById('search-count');
const resultsEl = document.getElementById('search-results');

let debounceTimer = null;

function coverColorFor(id) {
  return coverColors[(id - 1) % coverColors.length];
}

function readParamsFromUrl() {
  const params = new URLSearchParams(window.location.search);

  if (params.get('q')) searchInput.value = params.get('q');
  if (params.get('category')) categoryFilter.value = params.get('category');
  if (params.get('sort')) sortFilter.value = params.get('sort');
  if (params.get('editors_pick') === '1') editorsPickFilter.checked = true;
}

async function loadCategoryOptions() {
  try {
    const res = await fetch(`${API_BASE}/categories`);
    if (!res.ok) throw new Error('โหลดหมวดหมู่ไม่สำเร็จ');

    const categories = await res.json();
    const currentValue = categoryFilter.value;

    categories.forEach((c) => {
      const opt = document.createElement('option');
      opt.value = c.category;
      opt.textContent = `${c.category} (${c.count})`;
      categoryFilter.appendChild(opt);
    });

    // คงค่าที่เลือกไว้จาก URL (ถ้ามี) หลังเติม option แล้ว
    if (currentValue) categoryFilter.value = currentValue;
  } catch (err) {
    console.error(err);
  }
}

function buildQueryParams() {
  const params = new URLSearchParams();
  const q = searchInput.value.trim();

  if (q) params.set('q', q);
  if (categoryFilter.value) params.set('category', categoryFilter.value);
  if (sortFilter.value) params.set('sort', sortFilter.value);
  if (editorsPickFilter.checked) params.set('editors_pick', '1');

  return params;
}

async function runSearch() {
  const params = buildQueryParams();
  const qs = params.toString();

  // อัปเดต URL bar ด้วย (ไม่ reload หน้า) เพื่อให้แชร์ลิงก์ผลการค้นหาได้
  window.history.replaceState(null, '', qs ? `search.html?${qs}` : 'search.html');

  resultsEl.innerHTML = '<p class="search-state">กำลังค้นหา...</p>';
  countEl.textContent = '';

  try {
    const res = await fetch(`${API_BASE}/games?${qs}`);
    if (!res.ok) throw new Error('ค้นหาไม่สำเร็จ');

    const games = await res.json();
    renderResults(games);
  } catch (err) {
    countEl.textContent = '';
    resultsEl.innerHTML = `<p class="search-state">
      ค้นหาไม่สำเร็จ ตรวจสอบว่าเปิด backend ด้วย node app.js อยู่ที่ http://localhost:3000 หรือไม่
    </p>`;
    console.error(err);
  }
}

function renderResults(games) {
  if (games.length === 0) {
    countEl.textContent = 'ไม่พบเกมที่ตรงกับเงื่อนไข';
    resultsEl.innerHTML = '<p class="search-state">ลองเปลี่ยนคำค้นหา หมวดหมู่ หรือปิดตัวกรองบางอย่างดูนะ</p>';
    return;
  }

  countEl.textContent = `พบ ${games.length} เกม`;
  resultsEl.innerHTML = '';

  games.forEach((game) => {
    const card = document.createElement('a');
    card.className = 'review-card';
    card.href = `game-detail.html?id=${game.id}`;
    card.style.display = 'block';
    card.innerHTML = `
      <div class="cover" style="background:${coverColorFor(game.id)}">${game.title}</div>
      <h4>${game.title}</h4>
      <div class="review-meta">
        <span class="genre">${game.category}</span>
        <span class="score">${game.score}</span>
      </div>
    `;
    resultsEl.appendChild(card);
  });
}

function debouncedSearch() {
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(runSearch, 250);
}

readParamsFromUrl();

searchInput.addEventListener('input', debouncedSearch);
categoryFilter.addEventListener('change', runSearch);
sortFilter.addEventListener('change', runSearch);
editorsPickFilter.addEventListener('change', runSearch);

loadCategoryOptions().then(runSearch);
