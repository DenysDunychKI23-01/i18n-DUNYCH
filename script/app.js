const STORAGE_KEY = 'preferred_language';

// 1. Словник для i18next (Завдання 2 та Завдання 3)
const i18nextResources = {
  uk: {
    translation: {
      mainHeader: "Практична робота: Інтернаціоналізація (i18n)",
      langLabel: "Мова: ",
      task1Label: "Завдання 1: Чистий JavaScript (fetch + JSON)",
      task2Label: "Завдання 2: Бібліотека i18next",
      task3Label: "Завдання 3: Каталог товарів (localStorage + i18next)",
      i18nGreeting: "Привіт (i18next)",
      i18nFarewell: "До побачення! Цей блок перекладено через бібліотеку i18next.",
      buyBtn: "Купити",
      currency: "грн"
    }
  },
  en: {
    translation: {
      mainHeader: "Practical Work: Internationalization (i18n)",
      langLabel: "Language: ",
      task1Label: "Task 1: Pure JavaScript (fetch + JSON)",
      task2Label: "Task 2: i18next Library",
      task3Label: "Task 3: Product Catalog (localStorage + i18next)",
      i18nGreeting: "Hello (i18next)",
      i18nFarewell: "Goodbye! This block is translated via i18next library.",
      buyBtn: "Buy Now",
      currency: "UAH"
    }
  }
};

// Дані каталогу товарів
const productsData = [
  {
    id: 1,
    price: 32000,
    title: { uk: "Ноутбук Ultrabook Pro", en: "Laptop Ultrabook Pro" },
    description: { uk: "Потужний ноутбук для роботи та навчання", en: "Powerful laptop for work and study" }
  },
  {
    id: 2,
    price: 4500,
    title: { uk: "Бездротові навушники", en: "Wireless Headphones" },
    description: { uk: "Активне шумозаглушення та 30 годин роботи", en: "Active noise cancellation and 30h battery life" }
  },
  {
    id: 3,
    price: 2800,
    title: { uk: "Механічна клавіатура", en: "Mechanical Keyboard" },
    description: { uk: "RGB-підсвітка та тактильні перемикачі", en: "RGB backlight and tactile switches" }
  }
];

// 2. Функція для Завдання 1 (Чистий JS + завантаження JSON через fetch)
async function updatePureJsSection(lang) {
  try {
    const response = await fetch(`./locales/${lang}.json`);
    if (!response.ok) throw new Error(`HTTP error: ${response.status}`);
    const translations = await response.json();

    document.getElementById('pure-greeting').textContent = translations.greeting;
    document.getElementById('pure-farewell').textContent = translations.farewell;
  } catch (error) {
    console.error('Помилка завантаження JSON (переконайтесь, що запущено через Live Server):', error);
    // Резервний текст, якщо відкрито без локального сервера
    document.getElementById('pure-greeting').textContent = lang === 'uk' ? 'Привіт (локально)' : 'Hello (local fallback)';
    document.getElementById('pure-farewell').textContent = lang === 'uk' ? 'Запустіть через Live Server для fetch()' : 'Run via Live Server for fetch()';
  }
}

// 3. Функція оновлення блоків i18next та каталогу (Завдання 2 і 3)
function updateI18nextAndCatalog() {
  const currentLang = i18next.language;

  document.getElementById('main-header').textContent = i18next.t('mainHeader');
  document.getElementById('lang-label').textContent = i18next.t('langLabel');
  document.getElementById('task1-label').textContent = i18next.t('task1Label');
  document.getElementById('task2-label').textContent = i18next.t('task2Label');
  document.getElementById('task3-label').textContent = i18next.t('task3Label');

  document.getElementById('i18n-greeting').textContent = i18next.t('i18nGreeting');
  document.getElementById('i18n-farewell').textContent = i18next.t('i18nFarewell');

  // Рендеринг карток каталогу
  const container = document.getElementById('catalog-container');
  container.innerHTML = '';

  productsData.forEach(item => {
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
      <h3>${item.title[currentLang]}</h3>
      <p>${item.description[currentLang]}</p>
      <p class="price">${item.price} ${i18next.t('currency')}</p>
      <button onclick="alert('${item.title[currentLang]}')">${i18next.t('buyBtn')}</button>
    `;
    container.appendChild(card);
  });
}

// Загальна функція зміни мови для всіх блоків одразу
function applyLanguage(lang) {
  localStorage.setItem(STORAGE_KEY, lang);
  document.getElementById('language-selector').value = lang;
  
  updatePureJsSection(lang);
  i18next.changeLanguage(lang, updateI18nextAndCatalog);
}

// Вибір мови з модального вікна при першому вході
window.selectInitialLanguage = function(lang) {
  document.getElementById('language-modal').style.display = 'none';
  applyLanguage(lang);
};

// Кнопка для тестування першого входу (очищає localStorage та перезавантажує сторінку)
window.resetLanguageChoice = function() {
  localStorage.removeItem(STORAGE_KEY);
  location.reload();
};

// Ініціалізація при завантаженні сторінки
document.addEventListener('DOMContentLoaded', () => {
  const savedLang = localStorage.getItem(STORAGE_KEY);
  const initialLang = savedLang || 'uk';
  const modal = document.getElementById('language-modal');
  const selector = document.getElementById('language-selector');

  selector.value = initialLang;

  i18next.init({
    lng: initialLang,
    resources: i18nextResources
  }, () => {
    if (!savedLang) {
      modal.style.display = 'flex';
    }
    updatePureJsSection(initialLang);
    updateI18nextAndCatalog();
  });

  selector.addEventListener('change', (e) => {
    applyLanguage(e.target.value);
  });
});
