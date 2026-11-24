/* ============================================
   main.js — Asosiy JavaScript kirish nuqtasi
   Vanilla JS (ES6+) — Arxitektura qoidalariga binoan
   ============================================ */

'use strict';

document.addEventListener('DOMContentLoaded', () => {
    console.log('Portfolio va Xizmatlar bo\'limi muvaffaqiyatli ishga tushdi!');

    // ============================================
    // 0. PRELOADER (Sahifa yuklash animatsiyasi)
    // ============================================
    const preloader = document.querySelector('#preloader');
    const preloaderBar = document.querySelector('#preloaderBar');

    const dismissPreloader = () => {
        if (preloaderBar) preloaderBar.style.width = '100%';
        setTimeout(() => {
            if (preloader) {
                preloader.classList.add('is-hidden');
                // Sahifa siyrilish blokirovkasini olib tashlash
                document.body.style.overflow = '';
            }
        }, 300);
    };

    // Preloader progress simulyatsiyasi
    if (preloader && preloaderBar) {
        document.body.style.overflow = 'hidden';
        let progress = 0;
        const preloaderInterval = setInterval(() => {
            progress += Math.random() * 18 + 6;
            if (progress > 90) progress = 90;
            preloaderBar.style.width = progress + '%';
        }, 150);

        if (document.readyState === 'complete') {
            clearInterval(preloaderInterval);
            dismissPreloader();
        } else {
            window.addEventListener('load', () => {
                clearInterval(preloaderInterval);
                dismissPreloader();
            });

            // Xavfsizlik uchun 2.5 soniyadan keyin majburan yopish
            setTimeout(() => {
                clearInterval(preloaderInterval);
                dismissPreloader();
            }, 2500);
        }
    }

    // ============================================
    // 0.1 GLOBAL STATE & SOZLAMALAR
    // ============================================
    const THEME_STORAGE_KEY = 'portfolio_theme';
    const LANG_STORAGE_KEY = 'portfolio_lang';
    let currentLang = localStorage.getItem(LANG_STORAGE_KEY) || 'uz';
    let activeCaseStudyId = null;

    // ============================================
    // 0.2 MAVZU (DARK / LIGHT MODE) BOSHQARUVI
    // ============================================
    const themeToggleBtn = document.querySelector('#themeToggleBtn');
    const rootHtml = document.documentElement;
    const metaThemeColor = document.querySelector('#metaThemeColor');

    const updateThemeMeta = (theme) => {
        if (metaThemeColor) {
            metaThemeColor.setAttribute('content', theme === 'light' ? '#f4f5f8' : '#121212');
        }
    };

    // Boshlang'ich meta theme-color ni tekshirish
    updateThemeMeta(rootHtml.getAttribute('data-theme') || 'dark');

    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            const currentTheme = rootHtml.getAttribute('data-theme') || 'dark';
            const nextTheme = currentTheme === 'light' ? 'dark' : 'light';

            rootHtml.setAttribute('data-theme', nextTheme);
            localStorage.setItem(THEME_STORAGE_KEY, nextTheme);
            updateThemeMeta(nextTheme);
        });
    }

    // ============================================
    // 0.3 KO'PTILLILIK (LANGUAGE SWITCHER: UZ / EN)
    // ============================================
    const langButtons = document.querySelectorAll('.lang-btn');

    function getNestedTranslation(obj, path) {
        return path.split('.').reduce((prev, curr) => (prev ? prev[curr] : undefined), obj);
    }

    function applyTranslations(lang) {
        if (!window.portfolioTranslations || !window.portfolioTranslations[lang]) return;
        const dict = window.portfolioTranslations[lang];
        currentLang = lang;
        document.documentElement.setAttribute('lang', lang);

        // Tugmalardagi aktiv holatni yangilash
        langButtons.forEach(btn => {
            if (btn.getAttribute('data-lang') === lang) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });

        // Sahifa sarlavhasini (Title) yangilash
        if (dict.meta && dict.meta.title) {
            document.title = dict.meta.title;
        }

        // Oddiy matn elementlarini [data-i18n] yangilash
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            const translation = getNestedTranslation(dict, key);
            if (translation !== undefined) {
                el.textContent = translation;
            }
        });

        // HTML elementlarini [data-i18n-html] yangilash
        document.querySelectorAll('[data-i18n-html]').forEach(el => {
            const key = el.getAttribute('data-i18n-html');
            const translation = getNestedTranslation(dict, key);
            if (translation !== undefined) {
                el.innerHTML = translation;
            }
        });

        // Placeholder atributlarini [data-i18n-placeholder] yangilash
        document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
            const key = el.getAttribute('data-i18n-placeholder');
            const translation = getNestedTranslation(dict, key);
            if (translation !== undefined) {
                el.setAttribute('placeholder', translation);
            }
        });

        // Xizmatlar panelini faol karta bo'yicha yangilash
        const activeCard = document.querySelector('.service-card.is-active') || document.querySelector('.service-card');
        if (activeCard && typeof updateServiceDetail === 'function') {
            updateServiceDetail(activeCard);
        }

        // Agar Case Study modal ochiq bo'lsa, uni ham yangi til bo'yicha darhol yangilash
        if (activeCaseStudyId && typeof renderCaseStudy === 'function') {
            renderCaseStudy(activeCaseStudyId);
        }

        // Kalkulyator hisobini yangi til bo'yicha yangilash
        if (typeof updateCalculator === 'function') {
            updateCalculator();
        }

        // Yuqoriga qaytish va tezkor aloqa tugmalari aria-label
        const scrollTopBtnEl = document.querySelector('#scrollTopBtn');
        if (dict.scrollTop && dict.scrollTop.ariaLabel && scrollTopBtnEl) {
            scrollTopBtnEl.setAttribute('aria-label', dict.scrollTop.ariaLabel);
        }
        const quickConnectPillEl = document.querySelector('#quickConnectPill');
        if (dict.quickConnect && dict.quickConnect.btnText && quickConnectPillEl) {
            quickConnectPillEl.setAttribute('aria-label', dict.quickConnect.btnText);
        }

        // Sharhlar navigatsiya tugmalari aria-label
        const testimonialPrevBtnEl = document.querySelector('#testimonialPrevBtn');
        const testimonialNextBtnEl = document.querySelector('#testimonialNextBtn');
        if (dict.testimonials && testimonialPrevBtnEl && testimonialNextBtnEl) {
            if (dict.testimonials.prevBtn) testimonialPrevBtnEl.setAttribute('aria-label', dict.testimonials.prevBtn);
            if (dict.testimonials.nextBtn) testimonialNextBtnEl.setAttribute('aria-label', dict.testimonials.nextBtn);
        }

        // Hero Typewriter matnini darhol yangilash
        if (typeof updateTypewriterLanguage === 'function') {
            updateTypewriterLanguage();
        }
    }

    // Til tugmalarini bosish hodisasi
    langButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const selectedLang = btn.getAttribute('data-lang');
            if (selectedLang && selectedLang !== currentLang) {
                applyTranslations(selectedLang);
                localStorage.setItem(LANG_STORAGE_KEY, selectedLang);
            }
        });
    });

    // Boshlang'ich yuklashda saqlangan tilni qo'llash
    applyTranslations(currentLang);

    // ============================================
    // 0.4 SCROLL-REVEAL (Kirish animatsiyalari)
    // ============================================
    const revealElements = document.querySelectorAll('.reveal');

    if ('IntersectionObserver' in window && revealElements.length > 0) {
        const revealObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-revealed');
                    revealObserver.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.12,
            rootMargin: '0px 0px -40px 0px'
        });

        revealElements.forEach(el => revealObserver.observe(el));
    } else {
        // Qo'llab-quvvatlanmasa, darhol ko'rsatish
        revealElements.forEach(el => el.classList.add('is-revealed'));
    }

    // ============================================
    // 1. NAVIGATSIYA (Sticky Navbar, Smooth Scroll va ScrollSpy)
    // ============================================
    const headerNav = document.querySelector('.header-nav');
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section[id]');

    // Silliq skroll qilish
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const targetId = link.getAttribute('href');
            if (targetId && targetId.startsWith('#')) {
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    e.preventDefault();
                    // Sticky navbar balandligini hisobga olib siljitish
                    const navHeight = headerNav ? headerNav.offsetHeight : 0;
                    const elementPosition = targetElement.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - navHeight - 10;

                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });

                    navLinks.forEach(item => item.classList.remove('active'));
                    link.classList.add('active');
                }
            }
        });
    });

    // Mobile Drawer elementlari
    const navHamburgerBtn = document.querySelector('#navHamburgerBtn');
    const mobileDrawerOverlay = document.querySelector('#mobileDrawerOverlay');
    const drawerCloseBtn = document.querySelector('#drawerCloseBtn');
    const drawerNavLinks = document.querySelectorAll('.drawer-nav-link');
    const drawerLogo = document.querySelector('#drawerLogo');
    const drawerHireBtn = document.querySelector('#drawerHireBtn');

    // Yuqoriga qaytish va SVG progress doirasi
    const scrollTopBtn = document.querySelector('#scrollTopBtn');
    const scrollProgressBar = document.querySelector('#scrollProgressBar');
    const SCROLL_CIRCUMFERENCE = 125.6; // 2 * PI * 20

    const updateScrollProgress = (scrollY) => {
        if (!scrollTopBtn || !scrollProgressBar) return;
        const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
        if (totalHeight > 0) {
            const progress = Math.min(Math.max(scrollY / totalHeight, 0), 1);
            const offset = SCROLL_CIRCUMFERENCE - (SCROLL_CIRCUMFERENCE * progress);
            scrollProgressBar.style.strokeDashoffset = offset;
        }

        if (scrollY > 300) {
            scrollTopBtn.classList.add('is-visible');
        } else {
            scrollTopBtn.classList.remove('is-visible');
        }
    };

    if (scrollTopBtn) {
        scrollTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // Mobil Menyuni ochish va yopish
    const openMobileDrawer = () => {
        if (mobileDrawerOverlay) {
            mobileDrawerOverlay.classList.add('is-open');
            mobileDrawerOverlay.setAttribute('aria-hidden', 'false');
        }
        if (navHamburgerBtn) {
            navHamburgerBtn.classList.add('is-active');
            navHamburgerBtn.setAttribute('aria-expanded', 'true');
        }
        document.body.style.overflow = 'hidden';
    };

    const closeMobileDrawer = () => {
        if (mobileDrawerOverlay) {
            mobileDrawerOverlay.classList.remove('is-open');
            mobileDrawerOverlay.setAttribute('aria-hidden', 'true');
        }
        if (navHamburgerBtn) {
            navHamburgerBtn.classList.remove('is-active');
            navHamburgerBtn.setAttribute('aria-expanded', 'false');
        }
        document.body.style.overflow = '';
    };

    if (navHamburgerBtn) {
        navHamburgerBtn.addEventListener('click', () => {
            const isOpen = mobileDrawerOverlay && mobileDrawerOverlay.classList.contains('is-open');
            if (isOpen) {
                closeMobileDrawer();
            } else {
                openMobileDrawer();
            }
        });
    }

    if (drawerCloseBtn) {
        drawerCloseBtn.addEventListener('click', closeMobileDrawer);
    }

    if (mobileDrawerOverlay) {
        mobileDrawerOverlay.addEventListener('click', (e) => {
            if (e.target === mobileDrawerOverlay) {
                closeMobileDrawer();
            }
        });
    }

    drawerNavLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const targetId = link.getAttribute('href');
            if (targetId && targetId.startsWith('#')) {
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    e.preventDefault();
                    closeMobileDrawer();
                    const navHeight = headerNav ? headerNav.offsetHeight : 0;
                    const elementPosition = targetElement.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - navHeight - 10;
                    setTimeout(() => {
                        window.scrollTo({
                            top: offsetPosition,
                            behavior: 'smooth'
                        });
                    }, 250);

                    drawerNavLinks.forEach(item => item.classList.remove('active'));
                    link.classList.add('active');
                }
            }
        });
    });

    if (drawerLogo) {
        drawerLogo.addEventListener('click', () => {
            closeMobileDrawer();
        });
    }

    if (drawerHireBtn) {
        drawerHireBtn.addEventListener('click', () => {
            closeMobileDrawer();
            const contactSection = document.querySelector('#contact');
            if (contactSection) {
                const navHeight = headerNav ? headerNav.offsetHeight : 0;
                const elementPosition = contactSection.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - navHeight - 10;
                setTimeout(() => {
                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });
                }, 250);
            }
        });
    }

    // Skroll bo'yicha hodisalarni tinglash (Sticky, ScrollSpy & Progress)
    const handleScroll = () => {
        const scrollY = window.pageYOffset || document.documentElement.scrollTop;

        // 1. Sticky fonni faollashtirish
        if (headerNav) {
            if (scrollY > 30) {
                headerNav.classList.add('is-sticky');
            } else {
                headerNav.classList.remove('is-sticky');
            }
        }

        // 2. Yuqoriga qaytish progress doirasi
        updateScrollProgress(scrollY);

        // 3. ScrollSpy: Ekranda turgan bo'limni menyularda avtomatik belgilash
        sections.forEach(current => {
            const sectionHeight = current.offsetHeight;
            const sectionTop = current.offsetTop - 140;
            const sectionId = current.getAttribute('id');

            if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
                drawerNavLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Dastlabki yuklanishda tekshirish

    // ============================================
    // ANIMATSIYALI STATISTIKA HISOB LAGICHI (Counters)
    // ============================================
    const statsCard = document.querySelector('.stats-card');
    const statNumbers = document.querySelectorAll('.stat-number[data-target]');
    let statsAnimated = false;

    const animateCounters = () => {
        if (statsAnimated) return;
        statsAnimated = true;

        const duration = 1600; // 1.6 soniya
        const startTime = performance.now();
        const easeOutQuad = (t) => t * (2 - t);

        const step = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const easedProgress = easeOutQuad(progress);

            statNumbers.forEach(statEl => {
                const target = parseInt(statEl.getAttribute('data-target'), 10) || 0;
                const current = Math.floor(easedProgress * target);
                statEl.textContent = `${current}+`;
            });

            if (progress < 1) {
                requestAnimationFrame(step);
            } else {
                statNumbers.forEach(statEl => {
                    const target = statEl.getAttribute('data-target');
                    statEl.textContent = `${target}+`;
                });
            }
        };

        requestAnimationFrame(step);
    };

    if ('IntersectionObserver' in window && statsCard) {
        const statsObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounters();
                    statsObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.3 });

        statsObserver.observe(statsCard);
    } else {
        animateCounters();
    }

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

    function updateServiceDetail(card) {
        if (!card) return;
        const category = card.getAttribute('data-category');
        const lang = (typeof currentLang !== 'undefined') ? currentLang : 'uz';
        const dict = (window.portfolioTranslations && window.portfolioTranslations[lang]) ? window.portfolioTranslations[lang] : null;

        const isCard3 = card.getAttribute('data-title') && card.getAttribute('data-title').includes('Responsive');
        let title = card.getAttribute('data-title') || 'Xizmat';
        let detail = card.getAttribute('data-detail') || '';
        let time = card.getAttribute('data-time') || '';

        if (dict && dict.services) {
            if (category === 'design') {
                title = dict.services.card1Title;
                detail = dict.services.card1Detail;
                time = dict.services.card1Time;
            } else if (isCard3) {
                title = dict.services.card3Title;
                detail = dict.services.card3Detail;
                time = dict.services.card3Time;
            } else if (category === 'dev') {
                title = dict.services.card2Title;
                detail = dict.services.card2Detail;
                time = dict.services.card2Time;
            } else if (category === 'audit') {
                title = dict.services.card4Title;
                detail = dict.services.card4Detail;
                time = dict.services.card4Time;
            }
        }

        currentSelectedService = title;

        if (detailTitle && detailDesc) {
            const prefix = dict && dict.services && dict.services.detailPrefix ? dict.services.detailPrefix : 'Tanlangan xizmat:';
            detailTitle.textContent = `${prefix} ${title}`;
            detailDesc.innerHTML = `${detail} <strong class="detail-time" style="margin-left: 8px;">${time}</strong>`;
        }
    }

    serviceCards.forEach(card => {
        card.addEventListener('click', () => {
            // Faol kartani belgilash
            serviceCards.forEach(c => c.classList.remove('is-active'));
            card.classList.add('is-active');

            updateServiceDetail(card);
            
            // Panelga yengil vizual impuls berish
            const detailBox = document.querySelector('#serviceDetailBox');
            if (detailBox) {
                detailBox.style.transform = 'scale(1.01)';
                setTimeout(() => {
                    detailBox.style.transform = 'scale(1)';
                }, 200);
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
            const contactSection = document.querySelector('#contact');
            const subjectInput = document.querySelector('#userSubject');
            const lang = (typeof currentLang !== 'undefined') ? currentLang : 'uz';
            const dict = (window.portfolioTranslations && window.portfolioTranslations[lang]) ? window.portfolioTranslations[lang] : null;
            const prefix = dict && dict.services && dict.services.orderSubjectPrefix ? dict.services.orderSubjectPrefix : 'Xizmat:';

            if (subjectInput) {
                subjectInput.value = `${prefix} ${currentSelectedService}`;
            }
            if (contactSection) {
                contactSection.scrollIntoView({ behavior: 'smooth' });
            }
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
    // 5. REAL PROJECT CASE STUDY MODAL BOSHQARUVI
    // ============================================
    const caseStudyModal = document.querySelector('#caseStudyModal');
    const caseModalCloseBtn = document.querySelector('#caseModalCloseBtn');
    const caseModalFooterCloseBtn = document.querySelector('#caseModalFooterCloseBtn');
    const caseModalOrderBtn = document.querySelector('#caseModalOrderBtn');
    const caseModalDemoBtn = document.querySelector('#caseModalDemoBtn');
    const caseModalImage = document.querySelector('#caseModalImage');
    const caseModalBadge = document.querySelector('#caseModalBadge');
    const caseModalTitle = document.querySelector('#caseModalTitle');
    const caseModalClient = document.querySelector('#caseModalClient');
    const caseModalDuration = document.querySelector('#caseModalDuration');
    const caseModalRole = document.querySelector('#caseModalRole');
    const caseModalMetrics = document.querySelector('#caseModalMetrics');
    const caseModalOverview = document.querySelector('#caseModalOverview');
    const caseModalProblem = document.querySelector('#caseModalProblem');
    const caseModalSolution = document.querySelector('#caseModalSolution');
    const caseModalTools = document.querySelector('#caseModalTools');
    activeCaseStudyId = null;

    function renderCaseStudy(projectId) {
        if (!projectId) return;
        const lang = (typeof currentLang !== 'undefined') ? currentLang : 'uz';
        const dict = (window.portfolioTranslations && window.portfolioTranslations[lang]) ? window.portfolioTranslations[lang] : null;
        if (!dict || !dict.caseStudies || !dict.caseStudies[projectId]) return;

        const data = dict.caseStudies[projectId];

        if (caseModalImage) {
            caseModalImage.src = data.image || data.img || '';
            caseModalImage.alt = data.title || 'Project Preview';
        }
        if (caseModalBadge) caseModalBadge.textContent = data.badge;
        if (caseModalTitle) caseModalTitle.textContent = data.title;
        if (caseModalClient) caseModalClient.textContent = data.client;
        if (caseModalDuration) caseModalDuration.textContent = data.duration;
        if (caseModalRole) caseModalRole.textContent = data.role;
        if (caseModalOverview) caseModalOverview.textContent = data.overview;
        if (caseModalProblem) caseModalProblem.textContent = data.problem;
        if (caseModalSolution) caseModalSolution.textContent = data.solution;

        // Metrikalarni dinamik render qilish
        if (caseModalMetrics) {
            caseModalMetrics.innerHTML = '';
            if (Array.isArray(data.metrics)) {
                data.metrics.forEach(m => {
                    const box = document.createElement('div');
                    box.className = 'case-metric-box';
                    box.innerHTML = `
                        <div class="case-metric-val">${m.value}</div>
                        <div class="case-metric-label">${m.label}</div>
                    `;
                    caseModalMetrics.appendChild(box);
                });
            }
        }

        // Texnologiya teglarini render qilish
        if (caseModalTools) {
            caseModalTools.innerHTML = '';
            if (Array.isArray(data.tools)) {
                data.tools.forEach(tool => {
                    const tag = document.createElement('span');
                    tag.className = 'case-tool-tag';
                    tag.textContent = tool;
                    caseModalTools.appendChild(tag);
                });
            }
        }

        // Jonli demo ssilkasini belgilash
        if (caseModalDemoBtn) {
            caseModalDemoBtn.href = data.demoUrl || data.image || '#';
        }
    }

    function openCaseStudy(projectId) {
        activeCaseStudyId = projectId;
        renderCaseStudy(projectId);
        if (caseStudyModal) {
            caseStudyModal.classList.add('is-open');
            caseStudyModal.setAttribute('aria-hidden', 'false');
            document.body.style.overflow = 'hidden';
        }
    }

    function closeCaseStudy() {
        activeCaseStudyId = null;
        if (caseStudyModal) {
            caseStudyModal.classList.remove('is-open');
            caseStudyModal.setAttribute('aria-hidden', 'true');
            document.body.style.overflow = '';
        }
    }

    // Loyiha "Batafsil ko'rish" tugmalari
    const projectLinkBtns = document.querySelectorAll('.project-link-btn');
    projectLinkBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const projectId = btn.getAttribute('data-project-id');
            if (projectId) {
                openCaseStudy(projectId);
            }
        });
    });

    // Case Study modalni yopish hodisalari
    if (caseModalCloseBtn) caseModalCloseBtn.addEventListener('click', closeCaseStudy);
    if (caseModalFooterCloseBtn) caseModalFooterCloseBtn.addEventListener('click', closeCaseStudy);

    if (caseStudyModal) {
        caseStudyModal.addEventListener('click', (e) => {
            if (e.target === caseStudyModal) {
                closeCaseStudy();
            }
        });
    }

    // Modal ichidagi buyurtma berish tugmasi
    if (caseModalOrderBtn) {
        caseModalOrderBtn.addEventListener('click', () => {
            const lang = (typeof currentLang !== 'undefined') ? currentLang : 'uz';
            const dict = (window.portfolioTranslations && window.portfolioTranslations[lang]) ? window.portfolioTranslations[lang] : null;
            const prefix = dict && dict.portfolio && dict.portfolio.projectSubjectPrefix ? dict.portfolio.projectSubjectPrefix : 'Loyiha:';
            const projTitle = caseModalTitle ? caseModalTitle.textContent : 'Loyiha';

            const subjectInput = document.querySelector('#userSubject');
            const contactSection = document.querySelector('#contact');

            if (subjectInput) {
                subjectInput.value = `${prefix} ${projTitle}`;
            }

            closeCaseStudy();

            if (contactSection) {
                contactSection.scrollIntoView({ behavior: 'smooth' });
                setTimeout(() => {
                    const nameInput = document.querySelector('#userName');
                    if (nameInput) nameInput.focus();
                }, 600);
            }
        });
    }

    // Toast xabarnoma boshqaruvi
    const toastNotification = document.querySelector('#toastNotification');
    const toastMessage = document.querySelector('#toastMessage');
    let toastTimeout = null;

    const showToast = (message) => {
        if (!toastNotification || !toastMessage) return;
        toastMessage.textContent = message;
        toastNotification.classList.add('is-show');
        if (toastTimeout) clearTimeout(toastTimeout);
        toastTimeout = setTimeout(() => {
            toastNotification.classList.remove('is-show');
        }, 3600);
    };

    const downloadCvBtn = document.querySelector('#downloadCvBtn');
    if (downloadCvBtn) {
        downloadCvBtn.addEventListener('click', () => {
            const lang = (typeof currentLang !== 'undefined') ? currentLang : 'uz';
            const dict = (window.portfolioTranslations && window.portfolioTranslations[lang]) ? window.portfolioTranslations[lang] : null;
            const toastMsg = (dict && dict.hero && dict.hero.cvToast) 
                ? dict.hero.cvToast 
                : 'CV muvaffaqiyatli yuklab olinmoqda (PDF)...';
            showToast(toastMsg);
        });
    }

    // ============================================
    // HERO DYNAMIC TYPEWRITER EFFECT
    // ============================================
    const heroTypedEl = document.querySelector('#heroTypedText');
    let typeRoleIndex = 0;
    let typeCharIndex = 0;
    let isDeleting = false;
    let typeTimer = null;

    const getTypedRoles = () => {
        const lang = currentLang || 'uz';
        const dict = (window.portfolioTranslations && window.portfolioTranslations[lang]) ? window.portfolioTranslations[lang] : null;
        if (dict && dict.hero && dict.hero.typedRoles && dict.hero.typedRoles.length > 0) {
            return dict.hero.typedRoles;
        }
        return ['UI/UX dizayner', 'Frontend dasturchi', 'Figma tizimlari mutaxassisi', 'Kreativ veb-arxitektor'];
    };

    const typeRoleStep = () => {
        if (!heroTypedEl) return;
        const roles = getTypedRoles();
        const currentRole = roles[typeRoleIndex % roles.length];

        if (isDeleting) {
            typeCharIndex--;
            heroTypedEl.textContent = currentRole.substring(0, typeCharIndex);
            if (typeCharIndex <= 0) {
                isDeleting = false;
                typeRoleIndex++;
                typeTimer = setTimeout(typeRoleStep, 450);
                return;
            }
            typeTimer = setTimeout(typeRoleStep, 40);
        } else {
            typeCharIndex++;
            heroTypedEl.textContent = currentRole.substring(0, typeCharIndex);
            if (typeCharIndex >= currentRole.length) {
                isDeleting = true;
                typeTimer = setTimeout(typeRoleStep, 2500);
                return;
            }
            typeTimer = setTimeout(typeRoleStep, 70 + Math.random() * 30);
        }
    };

    function updateTypewriterLanguage() {
        if (heroTypedEl) {
            if (typeTimer) clearTimeout(typeTimer);
            isDeleting = false;
            typeCharIndex = 0;
            typeRoleIndex = 0;
            typeRoleStep();
        }
    }

    if (heroTypedEl) {
        typeTimer = setTimeout(typeRoleStep, 900);
    }

    // ============================================
    // TESTIMONIALS SLIDER / CAROUSEL CONTROLLER
    // ============================================
    const testimonialsSlider = document.querySelector('#testimonialsSlider');
    const testimonialsTrack = document.querySelector('#testimonialsTrack');
    const testimonialPrevBtn = document.querySelector('#testimonialPrevBtn');
    const testimonialNextBtn = document.querySelector('#testimonialNextBtn');
    const testimonialCurrentNum = document.querySelector('#testimonialCurrentNum');
    const testimonialTotalNum = document.querySelector('#testimonialTotalNum');
    const testimonialDots = document.querySelectorAll('.testimonial-dot');
    const testimonialCards = document.querySelectorAll('.testimonials-track .testimonial-card');

    let currentTestimonialSlide = 0;
    const totalTestimonialSlides = testimonialCards.length || 3;
    let testimonialAutoplayTimer = null;

    if (testimonialTotalNum) {
        testimonialTotalNum.textContent = String(totalTestimonialSlides).padStart(2, '0');
    }

    const updateTestimonialSlider = (index) => {
        currentTestimonialSlide = (index + totalTestimonialSlides) % totalTestimonialSlides;
        if (testimonialsTrack) {
            testimonialsTrack.style.transform = `translateX(-${currentTestimonialSlide * 100}%)`;
        }
        if (testimonialCurrentNum) {
            testimonialCurrentNum.textContent = String(currentTestimonialSlide + 1).padStart(2, '0');
        }
        testimonialDots.forEach((dot, idx) => {
            if (idx === currentTestimonialSlide) {
                dot.classList.add('is-active');
                dot.setAttribute('aria-selected', 'true');
            } else {
                dot.classList.remove('is-active');
                dot.setAttribute('aria-selected', 'false');
            }
        });
    };

    const nextTestimonial = () => updateTestimonialSlider(currentTestimonialSlide + 1);
    const prevTestimonial = () => updateTestimonialSlider(currentTestimonialSlide - 1);

    if (testimonialNextBtn) testimonialNextBtn.addEventListener('click', nextTestimonial);
    if (testimonialPrevBtn) testimonialPrevBtn.addEventListener('click', prevTestimonial);

    testimonialDots.forEach((dot) => {
        dot.addEventListener('click', () => {
            const idx = parseInt(dot.getAttribute('data-index') || '0', 10);
            updateTestimonialSlider(idx);
        });
    });

    const stopTestimonialAutoplay = () => {
        if (testimonialAutoplayTimer) {
            clearInterval(testimonialAutoplayTimer);
            testimonialAutoplayTimer = null;
        }
    };

    const startTestimonialAutoplay = () => {
        stopTestimonialAutoplay();
        testimonialAutoplayTimer = setInterval(nextTestimonial, 5000);
    };

    if (testimonialsSlider) {
        testimonialsSlider.addEventListener('mouseenter', stopTestimonialAutoplay);
        testimonialsSlider.addEventListener('mouseleave', startTestimonialAutoplay);
        startTestimonialAutoplay();

        // Touch swipe qo'llab-quvvatlash
        let touchStartX = 0;
        let touchEndX = 0;
        testimonialsSlider.addEventListener('touchstart', (e) => {
            stopTestimonialAutoplay();
            if (e.changedTouches && e.changedTouches[0]) {
                touchStartX = e.changedTouches[0].screenX;
            }
        }, { passive: true });

        testimonialsSlider.addEventListener('touchend', (e) => {
            if (e.changedTouches && e.changedTouches[0]) {
                touchEndX = e.changedTouches[0].screenX;
                const diff = touchStartX - touchEndX;
                if (Math.abs(diff) > 40) {
                    if (diff > 0) nextTestimonial();
                    else prevTestimonial();
                }
            }
            startTestimonialAutoplay();
        }, { passive: true });
    }

    // ============================================
    // PROJECT CARDS 3D TILT MICRO-INTERACTIONS
    // ============================================
    const hasFinePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

    if (hasFinePointer && projectCards && projectCards.length > 0) {
        projectCards.forEach(card => {
            card.addEventListener('pointermove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                const percentX = (x - centerX) / centerX;
                const percentY = (y - centerY) / centerY;

                const rotateX = -percentY * 8; // max 8 gradus
                const rotateY = percentX * 8;

                card.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateY(-8px) scale3d(1.02, 1.02, 1.02)`;
                card.style.setProperty('--glare-x', `${x}px`);
                card.style.setProperty('--glare-y', `${y}px`);
            });

            card.addEventListener('pointerleave', () => {
                card.style.transform = '';
            });
        });
    }

    // ============================================
    // MODAL DIALOG FOCUS TRAP (A11Y)
    // ============================================
    const trapFocusInModal = (modalElement) => {
        if (!modalElement) return;
        const focusableSelectors = 'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

        modalElement.addEventListener('keydown', (e) => {
            if (e.key !== 'Tab') return;
            const focusables = modalElement.querySelectorAll(focusableSelectors);
            if (focusables.length === 0) return;

            const firstEl = focusables[0];
            const lastEl = focusables[focusables.length - 1];

            if (e.shiftKey) {
                if (document.activeElement === firstEl) {
                    e.preventDefault();
                    lastEl.focus();
                }
            } else {
                if (document.activeElement === lastEl) {
                    e.preventDefault();
                    firstEl.focus();
                }
            }
        });
    };

    if (caseStudyModal) trapFocusInModal(caseStudyModal);
    if (mobileDrawerOverlay) trapFocusInModal(mobileDrawerOverlay);

    // ============================================
    // 6. LOYIHA NARXI KALKULYATORI (CALCULATOR CONTROLLER)
    // ============================================
    const calcTypeCards = document.querySelectorAll('.calc-type-card');
    const calcScalePills = document.querySelectorAll('.calc-scale-pill');
    const calcExtraItems = document.querySelectorAll('.calc-extra-item');

    const calcSummaryType = document.querySelector('#calcSummaryType');
    const calcSummaryScale = document.querySelector('#calcSummaryScale');
    const calcSummaryExtras = document.querySelector('#calcSummaryExtras');
    const calcTimeText = document.querySelector('#calcTimeText');
    const calcPriceRange = document.querySelector('#calcPriceRange');
    const calcOrderBtn = document.querySelector('#calcOrderBtn');

    let currentCalculatedData = {
        typeName: 'UI/UX Dizayn',
        scaleName: '1 - 3 sahifa',
        extrasList: ['Responsive', 'Dark/Light'],
        timeline: '7 - 10 kun',
        priceRange: '$240 — $380'
    };

    function updateCalculator() {
        const lang = (typeof currentLang !== 'undefined') ? currentLang : 'uz';
        const dict = (window.portfolioTranslations && window.portfolioTranslations[lang]) ? window.portfolioTranslations[lang] : null;

        // Tanlangan loyiha turi
        const activeTypeCard = document.querySelector('.calc-type-card.is-selected') || calcTypeCards[0];
        const baseMin = activeTypeCard ? parseInt(activeTypeCard.getAttribute('data-base-min') || '180', 10) : 180;
        const baseMax = activeTypeCard ? parseInt(activeTypeCard.getAttribute('data-base-max') || '320', 10) : 320;
        const daysMin = activeTypeCard ? parseInt(activeTypeCard.getAttribute('data-days-min') || '5', 10) : 5;
        const daysMax = activeTypeCard ? parseInt(activeTypeCard.getAttribute('data-days-max') || '8', 10) : 8;
        const typeKey = activeTypeCard ? activeTypeCard.getAttribute('data-type') : 'ui';

        let typeName = activeTypeCard ? (activeTypeCard.querySelector('.calc-type-name')?.textContent || 'UI/UX Dizayn') : 'UI/UX Dizayn';
        if (dict && dict.calculator) {
            if (typeKey === 'ui') typeName = dict.calculator.typeUi;
            else if (typeKey === 'web') typeName = dict.calculator.typeWeb;
            else if (typeKey === 'ecom') typeName = dict.calculator.typeEcom;
            else if (typeKey === 'mobile') typeName = dict.calculator.typeMobile;
        }

        // Tanlangan hajm / sahifalar
        const activeScalePill = document.querySelector('.calc-scale-pill.is-selected') || calcScalePills[0];
        const scaleMult = activeScalePill ? parseFloat(activeScalePill.getAttribute('data-mult') || '1.0') : 1.0;
        const timeMult = activeScalePill ? parseFloat(activeScalePill.getAttribute('data-time-mult') || '1.0') : 1.0;
        const scaleId = activeScalePill ? activeScalePill.getAttribute('data-scale') : '1';

        let scaleName = activeScalePill ? activeScalePill.textContent.trim() : '1 - 3 sahifa';
        if (dict && dict.calculator && dict.calculator[`scale${scaleId}`]) {
            scaleName = dict.calculator[`scale${scaleId}`];
        }

        // Tanlangan qo'shimchalar
        let extrasCost = 0;
        let extrasDays = 0;
        const selectedExtrasText = [];

        calcExtraItems.forEach(item => {
            if (item.classList.contains('is-checked')) {
                const cost = parseInt(item.getAttribute('data-cost') || '0', 10);
                const days = parseInt(item.getAttribute('data-days') || '0', 10);
                const extraKey = item.getAttribute('data-extra');
                extrasCost += cost;
                extrasDays += days;

                const textSpan = item.querySelector('.calc-extra-text');
                const label = textSpan ? textSpan.textContent.trim() : extraKey;
                selectedExtrasText.push(label);
            }
        });

        // Yakuniy narx va muddat hisobi
        const finalMinPrice = Math.round((baseMin * scaleMult + extrasCost) / 10) * 10;
        const finalMaxPrice = Math.round((baseMax * scaleMult + extrasCost * 1.1) / 10) * 10;
        const finalMinDays = Math.round(daysMin * timeMult + extrasDays);
        const finalMaxDays = Math.round(daysMax * timeMult + extrasDays);

        const daysSuffix = (dict && dict.calculator && dict.calculator.daysSuffix) ? dict.calculator.daysSuffix : 'kun';
        const formattedTime = `${finalMinDays} - ${finalMaxDays} ${daysSuffix}`;
        const formattedPrice = `$${finalMinPrice} — $${finalMaxPrice}`;

        currentCalculatedData = {
            typeName,
            scaleName,
            extrasList: selectedExtrasText,
            timeline: formattedTime,
            priceRange: formattedPrice
        };

        if (calcSummaryType) calcSummaryType.textContent = typeName;
        if (calcSummaryScale) calcSummaryScale.textContent = scaleName;
        if (calcTimeText) calcTimeText.textContent = formattedTime;
        if (calcPriceRange) calcPriceRange.textContent = formattedPrice;

        if (calcSummaryExtras) {
            calcSummaryExtras.innerHTML = '';
            if (selectedExtrasText.length === 0) {
                const emptySpan = document.createElement('span');
                emptySpan.style.color = 'var(--color-text-dim)';
                emptySpan.style.fontSize = '0.78rem';
                emptySpan.textContent = dict && dict.calculator ? dict.calculator.summaryExtrasNone : 'Tanlanmagan';
                calcSummaryExtras.appendChild(emptySpan);
            } else {
                selectedExtrasText.forEach(name => {
                    const tag = document.createElement('span');
                    tag.className = 'calc-extra-tag';
                    tag.textContent = name.length > 24 ? name.substring(0, 22) + '...' : name;
                    calcSummaryExtras.appendChild(tag);
                });
            }
        }
    }

    calcTypeCards.forEach(card => {
        card.addEventListener('click', () => {
            calcTypeCards.forEach(c => c.classList.remove('is-selected'));
            card.classList.add('is-selected');
            updateCalculator();
        });
    });

    calcScalePills.forEach(pill => {
        pill.addEventListener('click', () => {
            calcScalePills.forEach(p => p.classList.remove('is-selected'));
            pill.classList.add('is-selected');
            updateCalculator();
        });
    });

    calcExtraItems.forEach(item => {
        item.addEventListener('click', () => {
            if (item.getAttribute('data-fixed') === 'true') return;
            item.classList.toggle('is-checked');
            updateCalculator();
        });
    });

    if (calcOrderBtn) {
        calcOrderBtn.addEventListener('click', () => {
            const subjectInput = document.querySelector('#userSubject');
            const messageInput = document.querySelector('#userMessage');
            const contactSection = document.querySelector('#contact');
            const lang = (typeof currentLang !== 'undefined') ? currentLang : 'uz';
            const dict = (window.portfolioTranslations && window.portfolioTranslations[lang]) ? window.portfolioTranslations[lang] : null;

            const prefix = dict && dict.calculator && dict.calculator.subjectPrefix ? dict.calculator.subjectPrefix : 'Loyiha hisobi:';

            if (subjectInput) {
                subjectInput.value = `${prefix} ${currentCalculatedData.typeName} (${currentCalculatedData.scaleName})`;
            }

            if (messageInput) {
                const extrasStr = currentCalculatedData.extrasList.join(', ');
                const labelType = dict && dict.calculator ? dict.calculator.summaryType : 'Loyiha turi:';
                const labelScale = dict && dict.calculator ? dict.calculator.summaryScale : 'Hajm:';
                const labelExtras = dict && dict.calculator ? dict.calculator.summaryExtras : 'Qo\'shimchalar:';
                const labelPrice = dict && dict.calculator ? dict.calculator.summaryEstPrice : 'Taxminiy byudjet:';
                const labelTime = dict && dict.calculator ? dict.calculator.summaryEstTime : 'Muddat:';

                messageInput.value = `Salom! Men kalkulyatorda quyidagi parametrlarni hisobladim:\n\n` +
                    `• ${labelType} ${currentCalculatedData.typeName}\n` +
                    `• ${labelScale} ${currentCalculatedData.scaleName}\n` +
                    `• ${labelExtras} ${extrasStr || 'Standart'}\n` +
                    `• ${labelPrice} ${currentCalculatedData.priceRange}\n` +
                    `• ${labelTime} ${currentCalculatedData.timeline}\n\n` +
                    `Loyiha tafsilotlarini muhokama qilishimiz mumkinmi?`;
            }

            if (contactSection) {
                contactSection.scrollIntoView({ behavior: 'smooth' });
                setTimeout(() => {
                    const nameInput = document.querySelector('#userName');
                    if (nameInput) nameInput.focus();
                }, 600);
            }
        });
    }

    // ============================================
    // 7. FAQ ACCORDION CONTROLLER
    // ============================================
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const header = item.querySelector('.faq-header');
        if (header) {
            header.addEventListener('click', () => {
                const isOpen = item.classList.contains('is-open');

                // Boshqa barcha ochiq savollarni yopish (yagona akkordeon effekti)
                faqItems.forEach(other => {
                    if (other !== item) {
                        other.classList.remove('is-open');
                        const otherHeader = other.querySelector('.faq-header');
                        if (otherHeader) otherHeader.setAttribute('aria-expanded', 'false');
                    }
                });

                if (isOpen) {
                    item.classList.remove('is-open');
                    header.setAttribute('aria-expanded', 'false');
                } else {
                    item.classList.add('is-open');
                    header.setAttribute('aria-expanded', 'true');
                }
            });
        }
    });

    // ============================================
    // 8. ALOQA FORMASI VA CHIROYLI MODAL OYNA (Success Modal)
    // ============================================
    const contactForm = document.querySelector('#contactForm');
    const successModal = document.querySelector('#successModal');
    const modalCloseBtn = document.querySelector('#modalCloseBtn');
    const modalOkBtn = document.querySelector('#modalOkBtn');
    const modalSenderName = document.querySelector('#modalSenderName');
    const modalSenderEmail = document.querySelector('#modalSenderEmail');

    if (successModal) trapFocusInModal(successModal);

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
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const nameInput = document.querySelector('#userName');
            const emailInput = document.querySelector('#userEmail');
            const subjectInput = document.querySelector('#userSubject');
            const messageInput = document.querySelector('#userMessage');
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const submitBtnText = submitBtn ? submitBtn.querySelector('span') : null;
            const originalText = submitBtnText ? submitBtnText.textContent : 'Xabarni Yuborish';

            const name = nameInput ? nameInput.value.trim() : '';
            const email = emailInput ? emailInput.value.trim() : '';
            const subject = subjectInput ? subjectInput.value.trim() : '';
            const message = messageInput ? messageInput.value.trim() : '';

            if (!name || !email || !message) {
                return;
            }

            // Tugma holatini o'zgartirish (Yuborish jarayoni)
            const lang = (typeof currentLang !== 'undefined') ? currentLang : 'uz';
            const dict = (window.portfolioTranslations && window.portfolioTranslations[lang]) ? window.portfolioTranslations[lang] : null;
            const sendingText = dict && dict.contact && dict.contact.formSubmitting ? dict.contact.formSubmitting : 'Yuborilmoqda...';
            const errorAlertText = dict && dict.contact && dict.contact.formErrorAlert ? dict.contact.formErrorAlert : "Kechirasiz, xabarni yuborishda xatolik yuz berdi. Iltimos, to'g'ridan-to'g'ri ferganafergana66@gmail.com manziliga yozing.";

            if (submitBtn) submitBtn.disabled = true;
            if (submitBtnText) submitBtnText.textContent = sendingText;

            try {
                const response = await fetch('https://formsubmit.co/ajax/ferganafergana66@gmail.com', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    body: JSON.stringify({
                        name: name,
                        email: email,
                        _subject: subject ? `Portfolio: ${subject}` : `Portfolio saytidan yangi xabar (${name})`,
                        message: message,
                        _template: 'table',
                        _captcha: 'false'
                    })
                });

                if (!response.ok) {
                    throw new Error('Xat yuborishda xatolik yuz berdi');
                }

                // Muvaffaqiyatli xabar oynasini ochish
                openModal(name, email);
                contactForm.reset();
            } catch (error) {
                console.error('Xabar yuborishda xatolik:', error);
                alert(errorAlertText);
            } finally {
                if (submitBtn) submitBtn.disabled = false;
                if (submitBtnText) submitBtnText.textContent = originalText;
            }
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

    // ============================================
    // TEZKOR ALOQA WIDGETI (Floating Quick Connect)
    // ============================================
    const quickConnectWidget = document.querySelector('#quickConnectWidget');
    const quickConnectPill = document.querySelector('#quickConnectPill');
    const quickConnectPopover = document.querySelector('#quickConnectPopover');
    const quickPopCloseBtn = document.querySelector('#quickPopCloseBtn');

    const toggleQuickConnect = () => {
        if (!quickConnectPopover) return;
        const isOpen = quickConnectPopover.classList.contains('is-open');
        if (isOpen) {
            quickConnectPopover.classList.remove('is-open');
            if (quickConnectPill) quickConnectPill.setAttribute('aria-expanded', 'false');
        } else {
            quickConnectPopover.classList.add('is-open');
            if (quickConnectPill) quickConnectPill.setAttribute('aria-expanded', 'true');
        }
    };

    const closeQuickConnect = () => {
        if (quickConnectPopover) {
            quickConnectPopover.classList.remove('is-open');
        }
        if (quickConnectPill) {
            quickConnectPill.setAttribute('aria-expanded', 'false');
        }
    };

    if (quickConnectPill) {
        quickConnectPill.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleQuickConnect();
        });
    }

    if (quickPopCloseBtn) {
        quickPopCloseBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            closeQuickConnect();
        });
    }

    // Tashqi joy bosilganda yopish
    document.addEventListener('click', (e) => {
        if (quickConnectWidget && !quickConnectWidget.contains(e.target)) {
            closeQuickConnect();
        }
    });

    // Escape tugmasi bosilganda barcha ochiq oynalarni yopish
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            if (caseStudyModal && caseStudyModal.classList.contains('is-open')) {
                closeCaseStudy();
            }
            if (successModal && successModal.classList.contains('is-open')) {
                closeModal();
            }
            if (mobileDrawerOverlay && mobileDrawerOverlay.classList.contains('is-open')) {
                closeMobileDrawer();
            }
            closeQuickConnect();
        }
    });
});
