// ─────────────────────────────────────────────
// THEME TOGGLE (DARK / LIGHT MODE)
// ─────────────────────────────────────────────

const toggle = document.getElementById('theme-toggle');
if (toggle) {
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const savedTheme = localStorage.getItem('theme');

  if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
    document.body.classList.add('dark');
  }

  toggle.addEventListener('click', () => {
    document.body.classList.toggle('dark');
    const isDark = document.body.classList.contains('dark');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  });
}


// ─────────────────────────────────────────────
// TEXT SCRAMBLE EFFECT USING EXISTING LETTERS
// ─────────────────────────────────────────────

function shuffleArray(arr) {
  const shuffled = arr.slice();
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

function scrambleText(element, original) {
  element.classList.add("scrambling");

  let iterations = 0;
  const maxIterations = 10;

  const interval = setInterval(() => {
    if (iterations >= maxIterations) {
      element.textContent = original;
      element.classList.remove("scrambling");
      clearInterval(interval);
      return;
    }

    const scrambled = shuffleArray(original.split("")).join("");
    element.textContent = scrambled;
    iterations++;
  }, 50);
}

document.querySelectorAll(".scramble").forEach(el => {
  const final = el.dataset.text;
  el.addEventListener("mouseenter", () => scrambleText(el, final));
});

// ─────────────────────────────────────────────
// TRANSLATIONS
// ─────────────────────────────────────────────
const translations = {
  en: {
    name: "Jasmine Lee",
    seclusion: "Seclusion",
  },
  zh: {
    name: "李静文",
    seclusion: "隐居",
  }
};

document.addEventListener("DOMContentLoaded", () => {
  const chineseNameEl = document.getElementById("chinese-name");
  const langToggle = document.getElementById("language-toggle");

  let currentLang = "en";

  if (langToggle && chineseNameEl) {
    langToggle.addEventListener("click", () => {
      if (currentLang === "en") {
        chineseNameEl.classList.add("show");
        currentLang = "zh";
      } else {
        chineseNameEl.classList.remove("show");
        currentLang = "en";
      }
    });
  }
});

// ─────────────────────────────────────────────
// LANGUAGE TOGGLE EFFECT
// ─────────────────────────────────────────────
const toggleContainer = document.querySelector('.toggle-container');

// Wait until name is fully loaded
setTimeout(() => {
  toggleContainer.classList.add('visible');
}, 1800); // ← match this to when "Jasmine Lee" animation is done


document.addEventListener("DOMContentLoaded", () => {
  const langToggle = document.getElementById("language-toggle");
  const en = langToggle.querySelector(".en");
  const zh = langToggle.querySelector(".zh");
  const sep = langToggle.querySelector(".separator");

  let currentLang = "en";
  let rotation = 0;

  // Spin on hover
  langToggle.addEventListener("mouseenter", () => {
    rotation += 360;
    sep.style.transform = `rotate(${rotation}deg)`;
  });

  // Click to change language + spin again
  langToggle.addEventListener("click", () => {
    rotation += 360;
    sep.style.transform = `rotate(${rotation}deg)`;

    if (currentLang === "en") {
      en.classList.remove("active");
      zh.classList.add("active");
      currentLang = "zh";
    } else {
      zh.classList.remove("active");
      en.classList.add("active");
      currentLang = "en";
    }
  });
});
