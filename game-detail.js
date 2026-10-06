const API_BASE = 'https://web-backend-silk.vercel.app/api/games';

function getGameId() {
  const params = new URLSearchParams(window.location.search);
  return params.get('id');
}

async function loadGameDetail() {
  const wrap = document.getElementById('detail-wrap');
  const id = getGameId();

  if (!id) {
    renderState(wrap, 'ไม่พบรหัสเกมใน URL — กรุณากลับไปเลือกเกมจากหน้าแรกใหม่', true);
    return;
  }

  try {
    const res = await fetch(`${API_BASE}/${id}`);
    if (!res.ok) throw new Error('ไม่พบเกมนี้');

    const game = await res.json();
    renderDetail(wrap, game);
  } catch (err) {
    renderState(wrap, 'โหลดข้อมูลเกมไม่สำเร็จ — ลองรีเฟรชหน้านี้อีกครั้ง', true);
    console.error(err);
  }
}

function renderDetail(wrap, game) {
  document.title = `${game.title} — Game Discovery`;
  const titleEl = document.getElementById('detail-title');
  if (titleEl) titleEl.textContent = game.title;

  const img = game.image_url
    ? `<img src="${game.image_url}" alt="ปกเกม ${game.title}" onerror="this.remove()">`
    : '';

  wrap.innerHTML = `
    <a class="back-link" href="search.html">← กลับหน้าค้นหา</a>

    <div class="detail-cover" style="--cover-bg:${coverColorFor(game.id)}">
      ${img}
      <span class="detail-cover-text">${game.title}</span>
    </div>

    <div class="detail-top">
      <h1>${game.title}</h1>
      <span class="badge-score">${game.score}</span>
    </div>

    <div class="tag-row">
      <span class="chip">${game.category}</span>
      ${game.editors_pick ? '<span class="chip">ตัวเลือกของบรรณาธิการ</span>' : ''}
    </div>

    <div class="detail-divider"></div>

    <p class="detail-desc">${game.description}</p>

    <a class="btn-ghost" href="category.html?name=${encodeURIComponent(game.category)}">ดูเกมอื่นในหมวด ${game.category}</a>
  `;
}

loadGameDetail();