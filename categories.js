const API_BASE = 'https://web-backend-silk.vercel.app/api';

async function loadCategories() {
  const container = document.getElementById('cats-full-grid');

  try {
    const res = await fetch(`${API_BASE}/categories`);
    if (!res.ok) throw new Error('โหลดหมวดหมู่ไม่สำเร็จ');

    const categories = await res.json();

    if (categories.length === 0) {
      renderState(container, 'ยังไม่มีเกมในระบบ');
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
    staggerReveal(container.children);
  } catch (err) {
    renderState(container, 'โหลดหมวดหมู่ไม่สำเร็จ — ลองรีเฟรชหน้านี้อีกครั้ง', true);
    console.error(err);
  }
}

loadCategories();