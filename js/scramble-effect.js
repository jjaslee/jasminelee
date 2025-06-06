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
