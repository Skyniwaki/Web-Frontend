const API_BASE = 'https://web-backend-silk.vercel.app/api/games';

function getGameId() {
  const params = new URLSearchParams(window.location.search);
  return params.get('id');
}

async function loadGameDetail() {
  const wrap = document.getElementById('detail-wrap');
  const id = getGameId();

  if (!id) {
    wrap.innerHTML += `
      <p class="detail-state">
        ไม่พบรหัสเกมใน URL กรุณากลับไปเลือกเกมจากหน้าแรกใหม่
      </p>
    `;
    return;
  }

  try {
    const res = await fetch(`${API_BASE}/${id}`);

    if (!res.ok) {
      throw new Error('ไม่พบเกมนี้');
    }

    const game = await res.json();

    console.log('Game data:', game);

    renderDetail(wrap, game);

  } catch (err) {
    wrap.innerHTML += `
      <p class="detail-state">
        โหลดข้อมูลเกมไม่สำเร็จ
      </p>
    `;

    console.error(err);
  }
}

function renderDetail(wrap, game) {

  // รองรับชื่อ field รูปหลายแบบ
  const imageUrl =
    game.image_url ||
    game.imageUrl ||
    game.cover_url ||
    game.cover ||
    game.image ||
    '';

  wrap.innerHTML = `
    <a class="back-link" href="index.html">
      ← กลับหน้าแรก
    </a>

    <div class="cover-box">

      ${
        imageUrl
          ? `
            <img
              src="${imageUrl}"
              alt="${game.title}"
              class="cover-img"
            >
          `
          : `
            <div class="detail-cover-placeholder">
              ${game.title}
            </div>
          `
      }

    </div>

    <div class="detail-top">
      <h1>${game.title}</h1>
      <span class="badge-score">
        ${game.score} / 10
      </span>
    </div>

    <div class="tag-row" style="margin-bottom:20px;">
      <span class="tag">${game.category}</span>

      ${
        game.editors_pick
          ? '<span class="tag">ตัวเลือกของบรรณาธิการ</span>'
          : ''
      }
    </div>

    <p class="detail-desc">
      ${game.description || ''}
    </p>

    <a
      class="btn-ghost"
      style="display:inline-block;"
      href="category.html?name=${encodeURIComponent(game.category)}"
    >
      ดูเกมอื่นในหมวด ${game.category}
    </a>
  `;
}

loadGameDetail();
