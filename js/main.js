/* ============================================
   main.js — Asosiy JavaScript kirish nuqtasi
   Vanilla JS (ES6+) — Arxitektura qoidalariga binoan
   ============================================ */

'use strict';

document.addEventListener('DOMContentLoaded', () => {
    console.log('Portfolio va Xizmatlar bo\'limi muvaffaqiyatli ishga tushdi!');

    // ============================================
    // 1. NAVIGATSIYA HAVOLALARI (Smooth Scroll va Active)
    // ============================================
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const targetId = link.getAttribute('href');
            if (targetId && targetId.startsWith('#')) {
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    e.preventDefault();
                    targetElement.scrollIntoView({ behavior: 'smooth' });
                    navLinks.forEach(item => item.classList.remove('active'));
                    link.classList.add('active');
                }
            }
        });
    });

    // ============================================
    // 2. XIZMATLAR FILTRLASH (Interactive Filter)
    // ============================================
    const filterButtons = document.querySelectorAll('.filter-btn');
    const serviceCards = document.querySelectorAll('.service-card');

    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            // Aktiv holatni yangilash
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filterValue = btn.getAttribute('data-filter');

            // Kartalarni ko'rsatish / yashirish
            serviceCards.forEach(card => {
                const category = card.getAttribute('data-category');
                if (filterValue === 'all' || category === filterValue) {
                    card.classList.remove('is-hidden');
                } else {
                    card.classList.remove('is-active');
                    card.classList.add('is-hidden');
                }
            });
        });
    });

    // ============================================
    // 3. XIZMAT TANLASH VA DETALLAR PANELI (Interactive Selection)
    // ============================================
    const detailTitle = document.querySelector('#detailTitle');
    const detailDesc = document.querySelector('#detailDesc');
    let currentSelectedService = 'UI/UX Dizayn';

    serviceCards.forEach(card => {
        card.addEventListener('click', () => {
            // Faol kartani belgilash
            serviceCards.forEach(c => c.classList.remove('is-active'));
            card.classList.add('is-active');

            // Ma'lumotlarni o'qish
            const title = card.getAttribute('data-title') || 'Xizmat';
            const detail = card.getAttribute('data-detail') || '';
            const time = card.getAttribute('data-time') || '';
            currentSelectedService = title;

            // Pastdagi panelni yangilash
            if (detailTitle && detailDesc) {
                detailTitle.textContent = `Tanlangan xizmat: ${title}`;
                detailDesc.innerHTML = `${detail} <strong style="color: #ffffff; margin-left: 8px;">${time}</strong>`;
                
                // Panelga yengil vizual impuls berish
                const detailBox = document.querySelector('#serviceDetailBox');
                if (detailBox) {
                    detailBox.style.transform = 'scale(1.01)';
                    setTimeout(() => {
                        detailBox.style.transform = 'scale(1)';
                    }, 200);
                }
            }
        });
    });

    // ============================================
    // 4. BUYURTMA VA HAMKORLIK TUGMALARI
    // ============================================
    const orderServiceBtn = document.querySelector('#orderServiceBtn');
    if (orderServiceBtn) {
        orderServiceBtn.addEventListener('click', () => {
            alert(`Ajoyib tanlov! "${currentSelectedService}" xizmati bo'yicha tez orada siz bilan bog'lanamiz.`);
        });
    }

    const hireButtons = document.querySelectorAll('#navHireBtn, #hireMeBtn');
    hireButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            alert("Rahmat! Bog'lanish uchun tez orada aloqaga chiqamiz.");
        });
    });

    const downloadCvBtn = document.querySelector('#downloadCvBtn');
    if (downloadCvBtn) {
        downloadCvBtn.addEventListener('click', () => {
            alert('Rezyume (CV) yuklab olish boshlanmoqda...');
        });
    }
});
