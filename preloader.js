/* ============================================================
   VISHAL RAJ — PREMIUM PRELOADER JS
   Particle System | Progress Counter | Fade-Out Logic
   ============================================================ */

(function initPreloader() {
  'use strict';

  const preloader  = document.getElementById('vr-preloader');
  const barFill    = document.getElementById('pl-bar-fill');
  const barLead    = document.getElementById('pl-bar-lead');
  const pctLabel   = document.getElementById('pl-pct');
  const canvas     = document.getElementById('pl-particles');

  if (!preloader) return;

  /* ── Lock scroll ── */
  document.body.classList.add('pl-active');

  /* ── Particle System ── */
  const ctx = canvas ? canvas.getContext('2d') : null;
  let particles = [];
  let animId;

  function resizeCanvas() {
    if (!canvas) return;
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  function spawnParticle() {
    return {
      x:     Math.random() * (canvas ? canvas.width  : window.innerWidth),
      y:     Math.random() * (canvas ? canvas.height : window.innerHeight),
      r:     Math.random() * 1.4 + 0.4,
      vx:    (Math.random() - 0.5) * 0.3,
      vy:    -(Math.random() * 0.5 + 0.15),
      alpha: Math.random() * 0.45 + 0.1,
      life:  0,
      maxLife: Math.random() * 180 + 100,
      hue:   Math.random() > 0.75 ? '139, 92, 246' : '0, 212, 255',
    };
  }

  function initParticles() {
    particles = [];
    for (let i = 0; i < 70; i++) {
      const p = spawnParticle();
      p.life = Math.random() * p.maxLife;
      particles.push(p);
    }
  }

  function drawParticles() {
    if (!ctx || !canvas) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    particles.forEach((p, i) => {
      p.life++;
      p.x += p.vx;
      p.y += p.vy;

      const progress = p.life / p.maxLife;
      const opacity  = progress < 0.15
        ? (progress / 0.15) * p.alpha
        : progress > 0.8
        ? ((1 - progress) / 0.2) * p.alpha
        : p.alpha;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${p.hue}, ${opacity})`;
      ctx.fill();

      if (p.life >= p.maxLife) {
        particles[i] = spawnParticle();
      }
    });

    animId = requestAnimationFrame(drawParticles);
  }

  /* ── CSS Floating Dots around logo card ── */
  function createFloatDots() {
    const stage = document.querySelector('.pl-logo-stage');
    if (!stage) return;

    const colors = [
      'rgba(0,212,255,0.7)',
      'rgba(0,212,255,0.45)',
      'rgba(139,92,246,0.5)',
      'rgba(64,224,255,0.55)',
    ];

    for (let i = 0; i < 12; i++) {
      const dot = document.createElement('span');
      dot.className = 'pl-float-dot';
      const size  = Math.random() * 4 + 2;
      const angle = Math.random() * 360;
      const dist  = Math.random() * 60 + 70;
      const rad   = (angle * Math.PI) / 180;
      const cx    = 100 + dist * Math.cos(rad);
      const cy    = 100 + dist * Math.sin(rad);
      dot.style.cssText = `
        width: ${size}px;
        height: ${size}px;
        left: ${cx - size / 2}px;
        top:  ${cy - size / 2}px;
        background: ${colors[i % colors.length]};
        animation-duration: ${Math.random() * 2.5 + 1.8}s;
        animation-delay: ${-Math.random() * 3}s;
        filter: blur(${Math.random() * 0.6}px);
        box-shadow: 0 0 ${size * 2}px ${colors[i % colors.length]};
      `;
      stage.appendChild(dot);
    }
  }

  /* ── Progress Counter ── */
  const DURATION = 2700; // ms — total preload duration
  let progress   = 0;
  let startTime  = null;
  let rafId;

  function easeInOutCubic(t) {
    return t < 0.5
      ? 4 * t * t * t
      : 1 - Math.pow(-2 * t + 2, 3) / 2;
  }

  function animateProgress(ts) {
    if (!startTime) startTime = ts;
    const elapsed  = ts - startTime;
    const rawT     = Math.min(elapsed / DURATION, 1);
    const easedT   = easeInOutCubic(rawT);
    progress       = Math.round(easedT * 100);

    /* Update bar */
    if (barFill)  barFill.style.width   = progress + '%';
    if (pctLabel) pctLabel.textContent  = progress + '%';

    /* Show/hide lead dot */
    if (barLead) {
      barLead.style.display = progress > 0 && progress < 100 ? 'block' : 'none';
    }

    /* Pulse status dots */
    updateStatusDots(progress);

    if (rawT < 1) {
      rafId = requestAnimationFrame(animateProgress);
    } else {
      /* 100% reached — start exit sequence */
      setTimeout(exitPreloader, 320);
    }
  }

  function updateStatusDots(pct) {
    const dots = document.querySelectorAll('.pl-status-dot');
    dots.forEach((dot, i) => {
      const threshold = ((i + 1) / dots.length) * 100;
      if (pct >= threshold) {
        dot.classList.add('pl-dot-active');
        dot.classList.remove('pl-dot-inactive');
      } else if (pct >= threshold - 30) {
        dot.classList.add('pl-dot-active');
      } else {
        dot.classList.remove('pl-dot-active');
      }
    });
  }

  function exitPreloader() {
    cancelAnimationFrame(animId);

    preloader.classList.add('pl-fade-out');

    /* Re-enable scroll & remove preloader after transition */
    const onEnd = () => {
      document.body.classList.remove('pl-active');
      preloader.style.display = 'none';
      preloader.removeEventListener('transitionend', onEnd);
    };
    preloader.addEventListener('transitionend', onEnd, { once: true });

    /* Safety fallback */
    setTimeout(() => {
      document.body.classList.remove('pl-active');
      preloader.style.display = 'none';
    }, 1200);
  }

  /* ── Init ── */
  resizeCanvas();
  initParticles();
  drawParticles();
  createFloatDots();

  window.addEventListener('resize', resizeCanvas, { passive: true });

  /* Kick off progress after a brief moment for styles to settle */
  setTimeout(() => {
    requestAnimationFrame(animateProgress);
  }, 120);

})();
