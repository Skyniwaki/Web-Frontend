const API_BASE = 'http://localhost:3000/api';

async function loadCategories() {
  const container = document.getElementById('cats-full-grid');

  try {
    const res = await fetch(`${API_BASE}/categories`);

    if (!res.ok) {
      throw new Error('โหลดหมวดหมู่ไม่สำเร็จ');
    }

    const categories = await res.json();

    if (categories.length === 0) {
      container.innerHTML = '<p style="color:var(--text-mid);">ยังไม่มีเกมในระบบ</p>';
      return;
    }

    container.innerHTML = '';

    categories.forEach((c) => {
      const a = document.createElement('a');
      a.className = 'cat-tile';
      a.href = `category.html?name=${encodeURIComponent(c.category)}`;
      a.innerHTML = `<b>${c.category}</b><span>${c.count} เกม</span>`;
      container.appendChild(a);
    });
  } catch (err) {
    container.innerHTML = `<p style="color:var(--text-mid);">
      โหลดหมวดหมู่ไม่สำเร็จ ตรวจสอบว่าเปิด backend ด้วย node app.js อยู่ที่ http://localhost:3000 หรือไม่
    </p>`;
    console.error(err);
  }
}

loadCategories();
