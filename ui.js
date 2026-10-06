// ui.js — ตัวช่วยซ้ำ ๆ ที่ใช้ร่วมกันระหว่างทุกหน้า
// เก็บไว้ในไฟล์เดียวเพื่อไม่ต้องก๊อป coverColors / makeGameCard ซ้ำหลายที่

const coverColors = ['var(--cover-1)', 'var(--cover-2)', 'var(--cover-3)', 'var(--cover-4)', 'var(--cover-5)', 'var(--cover-6)'];

function coverColorFor(id) {
  return coverColors[(id - 1) % coverColors.length];
}

// การ์ดเกม: ปก 16:10 + คะแนนบนปก + ชื่อ + หมวดหมู่
function makeGameCard(game) {
  const a = document.createElement('a');
  a.className = 'review-card';
  a.href = `game-detail.html?id=${game.id}`;

  const img = game.image_url
    ? `<img src="${game.image_url}" alt="ปกเกม ${game.title}" loading="lazy" onerror="this.remove()">`
    : '';

  const flag = game.editors_pick
    ? '<span class="cover-flag">ตัวเลือกบรรณาธิการ</span>'
    : '';

  a.innerHTML = `
    <div class="cover" style="--cover-bg:${coverColorFor(game.id)}">
      ${img}
      ${flag}
      <span class="cover-score">${game.score}</span>
      <span class="cover-title">${game.title}</span>
    </div>
    <h4>${game.title}</h4>
    <div class="review-meta">
      <span class="genre">${game.category}</span>
      <span class="score">${game.score}</span>
    </div>
  `;
  return a;
}

// สถานะระหว่างโหลด / โหลดไม่สำเร็จ
function renderState(container, message, isError) {
  const el = document.createElement('span');
  el.className = 'state' + (isError ? ' is-error' : '');
  el.textContent = message;
  container.innerHTML = '';
  container.appendChild(el);
}

// skeleton แบบเบา ๆ ใช้ระหว่างรอข้อมูลจาก API
function renderSkeletons(container, count, card) {
  container.innerHTML = '';
  for (let i = 0; i < count; i++) {
    const box = document.createElement(card ? 'a' : 'div');
    box.className = 'review-card';
    if (card) box.href = '#';
    box.setAttribute('aria-hidden', 'true');
    box.innerHTML = `
      <div class="skeleton sk-cover"></div>
      <div class="skeleton sk-line" style="width:82%"></div>
      <div class="skeleton sk-line" style="width:48%"></div>
    `;
    container.appendChild(box);
  }
}