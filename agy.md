# 📐 Loyiha Arxitektura Qoidalari (RULES)

> Bu fayl loyihaning asosiy arxitektura qoidalarini belgilaydi.
> Har qanday yangi kod yozishdan yoki fayl qo'shishdan **oldin** shu qoidalar o'qilishi va ularga qat'iy amal qilinishi shart.

---

## 1. Texnologiyalar

| Texnologiya | Versiya / Izoh |
|-------------|---------------|
| **HTML**    | Sof HTML5 |
| **CSS**     | Sof CSS3 (Vanilla) |
| **JS**      | Sof JavaScript (Vanilla ES6+) |

> [!CAUTION]
> **Hech qanday tashqi kutubxona yoki framework ishlatilmaydi!**
> React, Vue, Angular, Tailwind, Bootstrap, jQuery va boshqa har qanday tashqi paket **taqiqlangan**.
> Agar biron bir kutubxona yoki paket qo'shish zarurati paydo bo'lsa — avval foydalanuvchidan (loyiha egasidan) ruxsat so'raladi.

---

## 2. Papkalar Strukturasi

```
📁 loyiha-root/
├── 📄 index.html            ← Asosiy HTML fayl
├── 📄 agy.md                ← Shu qoidalar fayli
│
├── 📁 css/
│   ├── 📄 main.css          ← Yagona CSS kirish nuqtasi (HTMLga faqat shu ulanadi)
│   ├── 📄 reset.css         ← CSS reset / normalize (ixtiyoriy)
│   ├── 📄 variables.css     ← CSS o'zgaruvchilar (ixtiyoriy)
│   ├── 📄 base.css          ← Umumiy asosiy stillar (ixtiyoriy)
│   ├── 📄 components.css    ← Komponentlar stillari (ixtiyoriy)
│   ├── 📄 layout.css        ← Joylashuv stillari (ixtiyoriy)
│   └── 📄 responsive.css    ← Media query / responsiv stillar (ixtiyoriy)
│
├── 📁 js/
│   ├── 📄 main.js           ← Asosiy JS kirish nuqtasi (HTMLga shu ulanadi)
│   └── 📄 ...               ← Qo'shimcha modul fayllar (kerak bo'lganda)
│
├── 📁 assets/               ← Rasmlar, ikonkalar, shriftlar (ixtiyoriy)
│   ├── 📁 images/
│   ├── 📁 icons/
│   └── 📁 fonts/
│
└── 📁 pages/                ← Qo'shimcha HTML sahifalar (ixtiyoriy)
```

---

## 3. CSS Qoidalari

### 3.1 Ulanish tartibi
- HTMLga **faqat bitta** CSS fayl ulanadi: `css/main.css`
- `main.css` ichida boshqa CSS fayllar `@import` orqali ulanadi:

```css
/* css/main.css */
@import url('./reset.css');
@import url('./variables.css');
@import url('./base.css');
@import url('./layout.css');
@import url('./components.css');
@import url('./responsive.css');
```

### 3.2 Yozish qoidalari
- **Responsiv dizayn** har doim e'tiborga olinadi (`mobile-first` yondashuv tavsiya etiladi).
- CSS o'zgaruvchilardan (`--custom-property`) faol foydalaniladi.
- Stillar toza, tartibli va tushunarli bo'lishi kerak.
- Har bir katta CSS blokiga izoh (`/* comment */`) yoziladi.
- BEM nomlash konvensiyasi tavsiya etiladi: `.block__element--modifier`.

### 3.3 HTML'dagi ulanish

```html
<link rel="stylesheet" href="css/main.css">
```

---

## 4. JavaScript Qoidalari

### 4.1 Ulanish tartibi
- HTMLga **bitta asosiy JS fayl** ulanadi: `js/main.js`
- Qo'shimcha modullar kerak bo'lganda, `js/` papkasida alohida fayllar yaratiladi va `main.js` orqali boshqariladi.

### 4.2 Yozish qoidalari
- Faqat **Vanilla JavaScript** (ES6+) ishlatiladi.
- Kod toza, o'qilishi oson va yaxshi tuzilgan bo'lishi kerak.
- O'zgaruvchilar `const` va `let` bilan e'lon qilinadi (`var` dan qochiladi).
- Funksiyalar aniq nomlanadi va bir vazifaga mo'ljallangan bo'ladi.
- Inline JavaScript (`onclick="..."`) dan qochiladi — event listener'lar JS faylida yoziladi.
- `document.querySelector` / `addEventListener` kabi standart DOM API'laridan foydalaniladi.

### 4.3 HTML'dagi ulanish

```html
<script src="js/main.js" defer></script>
```

---

## 5. HTML Qoidalari

- Semantik teglardan foydalaniladi (`<header>`, `<main>`, `<section>`, `<nav>`, `<footer>`, va h.k.).
- `<meta viewport>` tegi har doim mavjud bo'lishi kerak (responsivlik uchun).
- Accessibility (`alt`, `aria-label`, `role`) ga e'tibor beriladi.
- Kod indentatsiyasi — **4 bo'sh joy (space)**.

---

## 6. Umumiy Cheklovlar

| # | Qoida | Holat |
|---|-------|-------|
| 1 | Tashqi kutubxona/framework qo'shish | ❌ Taqiqlangan (ruxsatsiz) |
| 2 | CDN orqali skript/stil yuklash | ❌ Taqiqlangan (ruxsatsiz) |
| 3 | CSS preprocessor (SASS, LESS) | ❌ Taqiqlangan |
| 4 | Build tool (Webpack, Vite) | ❌ Taqiqlangan |
| 5 | Inline CSS/JS | ⚠️ Qochish kerak (JS faylda, CSS faylda bo'lsin) |
| 6 | Yangi paket qo'shish | ⏳ Faqat foydalanuvchi ruxsati bilan |

---

## 7. AI Assistent Uchun Ko'rsatmalar

> Quyidagi ko'rsatmalar men (AI assistent) uchun:

1. **Har safar murojaat qilinganda** avval shu `agy.md` faylini o'qib chiqish shart.
2. Yangi fayl yaratishda — papka strukturasiga qat'iy amal qilish.
3. Yangi kutubxona/paket kerak bo'lsa — foydalanuvchidan **so'rash**, o'zboshimchalik bilan qo'shmaslik.
4. Kod yozishda — yuqoridagi barcha qoidalarga rioya qilish.
5. Bu faylga loyiha rivojlangani sari foydali qo'shimchalar kiritish mumkin, lekin **asosiy arxitekturani buzmaslik**.

---

## 📝 O'zgarishlar tarixi

| Sana | O'zgarish |
|------|-----------|
| 2026-11-09 | Dastlabki qoidalar yaratildi |

