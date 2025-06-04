const flip = document.getElementById('flip-name');

let decayTimeout;
let active = false;

flip?.addEventListener('mouseenter', () => {
  if (active) return;
  active = true;

  let delay = 40; // start super fast
  let state = true;

  function decayBounce() {
    if (!active || delay > 800) return; // stop when it's slow but not too slow

    flip.textContent = state ? 'LJ' : 'JL';
    flip.style.transform = `translateX(${state ? 5 : -5}px)`;
    state = !state;

    decayTimeout = setTimeout(decayBounce, delay);
    delay *= 1.25; // slower decay growth
  }

  decayBounce();
});

flip?.addEventListener('mouseleave', () => {
  active = false;
  clearTimeout(decayTimeout);
  flip.textContent = 'JL';
  flip.style.transform = 'translateX(0)';
});