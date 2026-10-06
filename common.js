// common.js — ฟังก์ชันที่ใช้ร่วมกันทุกหน้า
// 1) ช่องค้นหาบน nav: พิมพ์แล้วกด Enter เพื่อไปหน้า search.html พร้อมคำค้นหา
// 2) เมนูแบบ hamburger สำหรับจอเล็ก

(function () {
  // ---- ช่องค้นหาบน nav ----
  const form = document.getElementById('nav-search-form');
  const input = document.getElementById('nav-search-input');

  if (form && input) {
    // ถ้าอยู่ที่หน้า search.html อยู่แล้ว ให้เติมคำค้นหาปัจจุบันลงช่อง nav ด้วย
    const params = new URLSearchParams(window.location.search);
    const currentQuery = params.get('q');
    if (window.location.pathname.endsWith('search.html') && currentQuery) {
      input.value = currentQuery;
    }

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      const query = input.value.trim();
      window.location.href = query
        ? `search.html?q=${encodeURIComponent(query)}`
        : 'search.html';
    });
  }

  // ---- เมนู hamburger (จอเล็ก) ----
  const toggle = document.getElementById('nav-toggle');
  const links = document.getElementById('nav-links');

  if (toggle && links) {
    const isMobile = () => window.matchMedia('(max-width:860px)').matches;

    // ซ่อนเมนูไว้ตอนแรกถ้าเปิดบนจอเล็ก
    const sync = () => {
      links.hidden = isMobile();
      toggle.setAttribute('aria-expanded', String(!links.hidden));
    };

    sync();
    window.addEventListener('resize', sync);

    toggle.addEventListener('click', function () {
      const open = links.hidden;
      links.hidden = !open;
      toggle.setAttribute('aria-expanded', String(open));
      toggle.setAttribute('aria-label', open ? 'ปิดเมนู' : 'เปิดเมนู');
    });

    // กดเมนูแล้วปิดเมนูให้เอง
    links.addEventListener('click', function (e) {
      if (e.target.tagName === 'A') links.hidden = true;
    });
  }
})();