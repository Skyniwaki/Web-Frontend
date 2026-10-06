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
      navigate(query ? `search.html?q=${encodeURIComponent(query)}` : 'search.html');
    });
  }

  // ---- แอนิเมชันตอนเปลี่ยนหน้า ----
  // เข้าหน้า: เพิ่มคลาสให้ CSS เล่น animation
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (!prefersReduced) {
    document.body.classList.add('page-enter');
  }

  // ออกจากหน้า: fade ออกก่อน แล้วค่อยเปลี่ยนเส้นทาง
  function navigate(url) {
    if (prefersReduced) {
      window.location.href = url;
      return;
    }

    document.body.classList.add('is-leaving');
    window.setTimeout(() => {
      window.location.href = url;
    }, 190);
  }

  // จับการคลิกลิงก์ภายในเว็บไซต์ เพื่อเล่น animation ก่อนออกจากหน้า
  // ข้ามลิงก์ที่เปิดแท็บใหม่, ดาวน์โหลด, ลิงก์ภายนอก, หรือคลิกพร้อม modifier key
  document.addEventListener('click', function (e) {
    if (e.defaultPrevented) return;
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;

    const link = e.target instanceof Element ? e.target.closest('a[href]') : null;
    if (!link) return;
    if (link.target === '_blank' || link.hasAttribute('download')) return;

    const href = link.getAttribute('href');
    if (!href || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:')) return;

    // ลิงก์ภายนอก — ปล่อยให้เบราว์เซอร์จัดการ
    if (/^https?:\/\//i.test(href) && link.origin !== window.location.origin) return;

    // ลิงก์ไฟล์อื่นในโฟลเดอร์เดียวกัน ให้ผ่าน animation
    e.preventDefault();
    navigate(link.href);
  });

  // เมื่อย้อนกลับมาด้วยปุ่ม Back/Forward ต้องเอาคลาสออกด้วย
  window.addEventListener('pageshow', function (e) {
    if (e.persisted) {
      document.body.classList.remove('is-leaving');
    }
  });

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