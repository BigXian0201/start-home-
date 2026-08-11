(function () {
  if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const canvas = document.createElement("canvas");
  canvas.id = "sparkleCanvas";
  canvas.style.cssText = "position:fixed;inset:0;pointer-events:none;z-index:9999;";
  document.body.appendChild(canvas);

  const ctx = canvas.getContext("2d");
  let W = 0;
  let H = 0;
  let dpr = 1;

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    W = window.innerWidth;
    H = window.innerHeight;
    canvas.width = Math.floor(W * dpr);
    canvas.height = Math.floor(H * dpr);
    canvas.style.width = W + "px";
    canvas.style.height = H + "px";
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  resize();
  window.addEventListener("resize", resize);

  const COLORS = ["#fff6c9", "#ffe98a", "#ffd75e", "#c9f3ff", "#ffd9f5", "#ffffff"];
  const particles = [];
  let last = 0;

  function spawn(x, y) {
    const n = 1 + Math.floor(Math.random() * 2);
    for (let i = 0; i < n; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 0.4 + Math.random() * 1.4;
      particles.push({
        x: x,
        y: y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 0.5,
        life: 1,
        decay: 0.012 + Math.random() * 0.02,
        size: 2 + Math.random() * 5,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        phase: Math.random() * Math.PI * 2,
        twinkle: 0.08 + Math.random() * 0.12
      });
    }
    if (particles.length > 400) particles.splice(0, particles.length - 400);
  }

  function drawStar(cx, cy, r, rot, color, alpha) {
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(rot);
    ctx.globalAlpha = alpha;
    ctx.fillStyle = color;
    ctx.shadowColor = color;
    ctx.shadowBlur = 8;
    ctx.beginPath();
    const spikes = 4;
    const outer = r;
    const inner = r * 0.42;
    for (let i = 0; i < spikes * 2; i++) {
      const rad = i % 2 === 0 ? outer : inner;
      const a = (i * Math.PI) / spikes;
      const px = Math.cos(a) * rad;
      const py = Math.sin(a) * rad;
      if (i === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }

  function frame(t) {
    const dt = Math.min((t - last) / 16.7, 3);
    last = t;
    ctx.clearRect(0, 0, W, H);

    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      p.life -= p.decay * dt;
      if (p.life <= 0) {
        particles.splice(i, 1);
        continue;
      }
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.vy += 0.015 * dt;
      p.phase += p.twinkle * dt;
      const tw = 0.6 + 0.4 * Math.sin(p.phase);
      drawStar(p.x, p.y, p.size * tw, p.phase, p.color, p.life);
    }
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);

  let throttle = 0;
  document.addEventListener("mousemove", (e) => {
    const now = performance.now();
    if (now - throttle < 24) return;
    throttle = now;
    spawn(e.clientX, e.clientY);
  });

  document.addEventListener("touchmove", (e) => {
    const touch = e.touches && e.touches[0];
    if (!touch) return;
    const now = performance.now();
    if (now - throttle < 40) return;
    throttle = now;
    spawn(touch.clientX, touch.clientY);
  }, { passive: true });
})();
