const API_BASE = 'https://web-backend-silk.vercel.app/api';

const searchInput = document.getElementById('search-input');
const categoryFilter = document.getElementById('category-filter');
const sortFilter = document.getElementById('sort-filter');
const editorsPickFilter = document.getElementById('editors-pick-filter');
const countEl = document.getElementById('search-count');
const resultsEl = document.getElementById('search-results');

let debounceTimer = null;

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

  countEl.textContent = '';
  renderSkeletons(resultsEl, 6, true);

  try {
    const res = await fetch(`${API_BASE}/games?${qs}`);
    if (!res.ok) throw new Error('ค้นหาไม่สำเร็จ');

    const games = await res.json();
    renderResults(games);
  } catch (err) {
    countEl.textContent = '';
    renderState(resultsEl, 'ค้นหาไม่สำเร็จ — ลองรีเฟรชหน้านี้อีกครั้ง', true);
    console.error(err);
  }
}

function renderResults(games) {
  if (games.length === 0) {
    countEl.textContent = 'ไม่พบเกมที่ตรงกับเงื่อนไข';
    renderState(resultsEl, 'ลองเปลี่ยนคำค้นหา หมวดหมู่ หรือปิดตัวกรองบางอย่างดูนะ');
    return;
  }

  countEl.textContent = `พบ ${games.length} เกม`;
  resultsEl.innerHTML = '';
  games.forEach((game) => resultsEl.appendChild(makeGameCard(game)));
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