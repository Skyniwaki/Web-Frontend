const API_BASE = 'http://localhost:3000/api/games';
const coverColors = ['#4B2A2E', '#2E3A2A', '#2A3038', '#33231F', '#243228', '#1F2A38'];

function getGameId() {
  const params = new URLSearchParams(window.location.search);
  return params.get('id');
}

async function loadGameDetail() {
  const wrap = document.getElementById('detail-wrap');
  const id = getGameId();

  if (!id) {
    wrap.innerHTML += '<p class="detail-state">ไม่พบรหัสเกมใน URL กรุณากลับไปเลือกเกมจากหน้าแรกใหม่</p>';
    return;
  }

  try {
    const res = await fetch(`${API_BASE}/${id}`);

    if (!res.ok) {
      throw new Error('ไม่พบเกมนี้');
    }

    const game = await res.json();
    renderDetail(wrap, game);
  } catch (err) {
    wrap.innerHTML += `<p class="detail-state">โหลดข้อมูลเกมไม่สำเร็จ ตรวจสอบว่าเปิด backend ด้วย node app.js อยู่หรือไม่</p>`;
    console.error(err);
  }
}

function renderDetail(wrap, game) {
  const color = coverColors[(game.id - 1) % coverColors.length];

  wrap.innerHTML = `
    <a class="back-link" href="index.html">← กลับหน้าแรก</a>
    <div class="detail-cover" style="background:${color}">${game.title}</div>
    <div class="detail-top">
      <h1>${game.title}</h1>
      <span class="badge-score">${game.score} / 10</span>
    </div>
    <div class="tag-row" style="margin-bottom:20px;">
      <span class="tag">${game.category}</span>
      ${game.editors_pick ? '<span class="tag">ตัวเลือกของบรรณาธิการ</span>' : ''}
    </div>
    <p class="detail-desc">${game.description}</p>
    <a class="btn-ghost" style="display:inline-block;" href="category.html?name=${encodeURIComponent(game.category)}">ดูเกมอื่นในหมวด ${game.category}</a>
  `;
}

loadGameDetail();
