document.addEventListener("DOMContentLoaded", () => {
  const container = document.querySelector(".carousel-3d-container");
  const carousel  = document.querySelector(".carousel-3d");
  const cells     = Array.from(document.querySelectorAll(".carousel-cell"));
  const toggles   = document.querySelector(".toggle-container");
  if (!container || !carousel || cells.length === 0) return;

  // ─────────────── CONFIG ───────────────
  const N = cells.length;
  const CARD_WIDTH    = 300;
  const THETA         = 360 / N;
  const SPACING_FACTOR = 1.2;
  const BASE_RADIUS   = (CARD_WIDTH / 2) / Math.tan(Math.PI / N);
  const RADIUS        = Math.round(BASE_RADIUS * SPACING_FACTOR);

  const AUTO_SPEED = 0.02;

  // Replace single FRIC constant with two + a variable
  const NORMAL_FRICTION  = 0.995;  // normal deceleration
  const INITIAL_FRICTION = 0.995;  // (unchanged here—so initial decay ≈ normal)
  let friction = NORMAL_FRICTION;  // start using normal

  const MIN_SPEED      = 0.005;
  const VISIBLE_ANGLE  = 60;
  const VISIBLE_SCALE  = 1.03;
  const HOVER_POP      = 1.05;

  // ─────────────── INITIAL POSITIONING & CAPTION ───────────────
  cells.forEach((cell, i) => {
    const angle = THETA * i;
    cell.style.transform = `rotateY(${angle}deg) translateZ(${RADIUS}px) scale(1)`;
    const img     = cell.querySelector("img");
    const altText = img.getAttribute("alt") || "";
    const caption = document.createElement("div");
    caption.className = "caption";
    caption.textContent = altText;
    cell.appendChild(caption);
    cell.addEventListener("mouseenter", () => cell.classList.add("hovered"));
    cell.addEventListener("mouseleave", () => cell.classList.remove("hovered"));
  });

  let currRotation      = 0;
  let isDragging        = false;
  let dragStartX        = 0;
  let dragStartRotation = 0;
  let prevRotFrame      = 0;
  let velocity          = AUTO_SPEED;

  // ─────────────── MAIN ANIMATE LOOP ───────────────
  function animate() {
    if (!isDragging) {
      currRotation += velocity;
      carousel.style.transform = `rotateY(${currRotation}deg)`;

      if (Math.abs(velocity - AUTO_SPEED) > MIN_SPEED) {
        // use the variable “friction” here:
        velocity = velocity * friction + AUTO_SPEED * (1 - friction);
      } else {
        velocity = AUTO_SPEED;
      }
    }

    cells.forEach((cell, i) => {
      const baseAngle = THETA * i;
      let absAngle = (baseAngle + currRotation) % 360;
      if (absAngle > 180) absAngle -= 360;
      const absDeg = Math.abs(absAngle);
      const isFront3 = absDeg <= VISIBLE_ANGLE;

      let baseScale = isFront3 ? VISIBLE_SCALE : 1;
      if (cell.classList.contains("hovered")) {
        baseScale *= HOVER_POP;
      }
      if (!isFront3) {
        cell.classList.add("dimmed");
      } else {
        cell.classList.remove("dimmed");
      }

      const rad = (baseAngle * Math.PI) / 180;
      const x   = RADIUS * Math.sin(rad);
      const z   = RADIUS * Math.cos(rad);
      cell.style.transform =
        `translate3d(${x}px, 0, ${z}px) rotateY(${baseAngle}deg) scale(${baseScale})`;
    });

    requestAnimationFrame(animate);
  }
  requestAnimationFrame(animate);

  // ─────────────── DRAG & WHEEL HANDLERS ───────────────

  // Mouse drag (desktop)
  container.addEventListener("mousedown", (e) => {
    if (e.button !== 0) return; // only left click
    isDragging = true;
    dragStartX        = e.clientX;
    dragStartRotation = currRotation;
    prevRotFrame      = currRotation;
    velocity          = AUTO_SPEED;
    container.style.cursor = "grabbing";
    e.preventDefault();
  });

  container.addEventListener("mousemove", (e) => {
    if (!isDragging) return;
    const dx = e.clientX - dragStartX;
    const ROT_PER_PIXEL = 0.2; // low sensitivity → heavy feel
    currRotation = dragStartRotation + dx * ROT_PER_PIXEL;
    carousel.style.transform = `rotateY(${currRotation}deg)`;

    // Measure instantaneous velocity = Δrotation per frame
    velocity = currRotation - prevRotFrame;
    prevRotFrame = currRotation;
  });

  container.addEventListener("mouseup", () => {
    if (!isDragging) return;
    isDragging = false;
    container.style.cursor = "grab";
    // velocity remains at last measured → friction will slow it
  });

  container.addEventListener("mouseleave", () => {
    if (!isDragging) return;
    isDragging = false;
    container.style.cursor = "grab";
  });

  // Touch drag (mobile/trackpad)
  container.addEventListener("touchstart", (e) => {
    isDragging = true;
    dragStartX        = e.touches[0].clientX;
    dragStartRotation = currRotation;
    prevRotFrame      = currRotation;
    velocity          = AUTO_SPEED;
  });

  container.addEventListener("touchmove", (e) => {
    if (!isDragging) return;
    const dx = e.touches[0].clientX - dragStartX;
    const ROT_PER_PIXEL = 0.2;
    currRotation = dragStartRotation + dx * ROT_PER_PIXEL;
    carousel.style.transform = `rotateY(${currRotation}deg)`;

    velocity = currRotation - prevRotFrame;
    prevRotFrame = currRotation;
  });

  container.addEventListener("touchend", () => {
    if (!isDragging) return;
    isDragging = false;
  });

  // Wheel/Scroll (trackpad or mouse wheel)
  container.addEventListener(
    "wheel",
    (e) => {
      e.preventDefault(); // prevent page scroll while over carousel

      // Combine horizontal (deltaX) or vertical (deltaY) scroll into one “delta”:
      const delta = e.deltaX !== 0 ? e.deltaX : e.deltaY;
      const ROT_PER_SCROLL_PX = 0.2; // same low sensitivity
      currRotation += delta * ROT_PER_SCROLL_PX;

      carousel.style.transform = `rotateY(${currRotation}deg)`;

      // Immediately set velocity to that scroll speed:
      velocity = delta * ROT_PER_SCROLL_PX;
    },
    { passive: false } // so that e.preventDefault() actually works
  );

  // Set “grab” cursor by default
  container.style.cursor = "grab";

  // ─────────────── SEQUENCE: name → toggles → carousel ───────────────

  // 1) Show toggles at ~1.2s
  setTimeout(() => {
    toggles.classList.add("visible");
  }, 1200);

  // 2) Show carousel at ~1.7s, with a small initial spin, then gradually settle
  setTimeout(() => {
    document.querySelector('.carousel-3d-container').classList.add('visible');

    // Initial gentle push
    velocity = 1;

    // After 800 ms, restore normal friction so it slows naturally
    setTimeout(() => {
      friction = NORMAL_FRICTION;
      // (No hard snap to AUTO_SPEED; it will ease in naturally)
    }, 800);
  }, 1700);
});
