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
    // 4. PORTFOLIO FILTRLASH (Projects Interactive Filter)
    // ============================================
    const pFilterButtons = document.querySelectorAll('.portfolio-filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    pFilterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            pFilterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filterValue = btn.getAttribute('data-pfilter');

            projectCards.forEach(card => {
                const category = card.getAttribute('data-pcategory');
                if (filterValue === 'all' || category === filterValue) {
                    card.classList.remove('is-hidden');
                } else {
                    card.classList.add('is-hidden');
                }
            });
        });
    });

    // ============================================
    // 5. BUYURTMA VA HAMKORLIK TUGMALARI
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
            const contactSection = document.querySelector('#contact');
            if (contactSection) {
                contactSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    // ============================================
    // 6. ALOQA FORMASI VA CHIROYLI MODAL OYNA (Success Modal)
    // ============================================
    const contactForm = document.querySelector('#contactForm');
    const successModal = document.querySelector('#successModal');
    const modalCloseBtn = document.querySelector('#modalCloseBtn');
    const modalOkBtn = document.querySelector('#modalOkBtn');
    const modalSenderName = document.querySelector('#modalSenderName');
    const modalSenderEmail = document.querySelector('#modalSenderEmail');

    // Modalni ochish funksiyasi
    const openModal = (name, email) => {
        if (modalSenderName) modalSenderName.textContent = name || "Do'stim";
        if (modalSenderEmail) modalSenderEmail.textContent = email || "pochtangiz";
        if (successModal) {
            successModal.classList.add('is-open');
            successModal.setAttribute('aria-hidden', 'false');
            document.body.style.overflow = 'hidden'; // Orqa fon skrollini to'xtatish
        }
    };

    // Modalni yopish funksiyasi
    const closeModal = () => {
        if (successModal) {
            successModal.classList.remove('is-open');
            successModal.setAttribute('aria-hidden', 'true');
            document.body.style.overflow = ''; // Skrollni qaytarish
        }
    };

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.querySelector('#userName').value.trim();
            const email = document.querySelector('#userEmail').value.trim();
            
            // Chiroyli oyna ochish
            openModal(name, email);
            contactForm.reset();
        });
    }

    // Yopish tugmalari
    if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeModal);
    if (modalOkBtn) modalOkBtn.addEventListener('click', closeModal);

    // Fonni (Overlay) bosganda yopish
    if (successModal) {
        successModal.addEventListener('click', (e) => {
            if (e.target === successModal) {
                closeModal();
            }
        });
    }

    // Escape tugmasi bosilganda yopish
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && successModal && successModal.classList.contains('is-open')) {
            closeModal();
        }
    });
});
