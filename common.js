// common.js — ฟังก์ชันที่ใช้ร่วมกันทุกหน้า
// ตอนนี้ทำหน้าที่หลักคือ: ทำให้ช่องค้นหาบน nav ใช้งานได้จริงทุกหน้า
// พิมพ์คำค้นหาแล้วกด Enter (หรือกดปุ่มแว่นขยาย) จะพาไปหน้า search.html พร้อมคำค้นหานั้น

(function () {
  const form = document.getElementById('nav-search-form');
  const input = document.getElementById('nav-search-input');

  if (!form || !input) return;

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
})();
