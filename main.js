/* ============================================================
   VISHAL RAJ PORTFOLIO — MAIN JS
   Particle System | Cursor Glow | Nav Indicator | Animations
   ============================================================ */

// ─────────────────────────────────────────
// 0. TYPEWRITER ANIMATION
// ─────────────────────────────────────────
(function initTypewriter() {
  const el = document.getElementById('typewriterText');
  if (!el) return;

  const words  = ['AI/ML Student', 'Frontend Developer', 'Competitive Programmer'];
  let wordIdx  = 0;
  let charIdx  = 0;
  let deleting = false;

  const TYPE_SPEED   = 75;   // ms per character when typing
  const DELETE_SPEED = 40;   // ms per character when deleting
  const PAUSE_END    = 1800; // ms pause after fully typed
  const PAUSE_START  = 400;  // ms pause before next word starts

  function tick() {
    const currentWord = words[wordIdx];

    if (!deleting) {
      // Typing forward
      el.textContent = currentWord.slice(0, charIdx + 1);
      charIdx++;

      if (charIdx === currentWord.length) {
        // Fully typed — pause, then start deleting
        deleting = true;
        setTimeout(tick, PAUSE_END);
        return;
      }
      setTimeout(tick, TYPE_SPEED);
    } else {
      // Deleting backward
      el.textContent = currentWord.slice(0, charIdx - 1);
      charIdx--;

      if (charIdx === 0) {
        // Fully deleted — move to next word
        deleting = false;
        wordIdx  = (wordIdx + 1) % words.length;
        setTimeout(tick, PAUSE_START);
        return;
      }
      setTimeout(tick, DELETE_SPEED);
    }
  }

  // Kick off after a short initial delay
  setTimeout(tick, 800);
})();

// ─────────────────────────────────────────
// 1. PARTICLE CANVAS
// ─────────────────────────────────────────
(function initParticles() {
  const canvas = document.getElementById('particles-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let particles = [];
  let animFrame;
  let mouse = { x: -9999, y: -9999 };

  const CONFIG = {
    count: 80,
    radius: { min: 1, max: 2.5 },
    speed: { min: 0.1, max: 0.4 },
    color: 'rgba(0, 212, 255,',
    connectDist: 120,
    mouseRepel: 100,
  };

  function resize() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  function createParticle() {
    return {
      x:  Math.random() * canvas.width,
      y:  Math.random() * canvas.height,
      r:  CONFIG.radius.min + Math.random() * (CONFIG.radius.max - CONFIG.radius.min),
      vx: (Math.random() - 0.5) * CONFIG.speed.max,
      vy: (Math.random() - 0.5) * CONFIG.speed.max,
      o:  0.2 + Math.random() * 0.5,
    };
  }

  function init() {
    resize();
    particles = Array.from({ length: CONFIG.count }, createParticle);
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    particles.forEach((p, i) => {
      // Move
      p.x += p.vx;
      p.y += p.vy;

      // Wrap
      if (p.x < 0)             p.x = canvas.width;
      if (p.x > canvas.width)  p.x = 0;
      if (p.y < 0)             p.y = canvas.height;
      if (p.y > canvas.height) p.y = 0;

      // Mouse repulsion
      const dx = p.x - mouse.x;
      const dy = p.y - mouse.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < CONFIG.mouseRepel) {
        const force = (CONFIG.mouseRepel - dist) / CONFIG.mouseRepel;
        p.x += (dx / dist) * force * 1.5;
        p.y += (dy / dist) * force * 1.5;
      }

      // Draw dot
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `${CONFIG.color}${p.o})`;
      ctx.fill();

      // Draw connections
      for (let j = i + 1; j < particles.length; j++) {
        const q = particles[j];
        const cdx = p.x - q.x;
        const cdy = p.y - q.y;
        const cdist = Math.sqrt(cdx * cdx + cdy * cdy);
        if (cdist < CONFIG.connectDist) {
          const alpha = (1 - cdist / CONFIG.connectDist) * 0.15;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(q.x, q.y);
          ctx.strokeStyle = `rgba(0, 212, 255, ${alpha})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }
    });

    animFrame = requestAnimationFrame(draw);
  }

  window.addEventListener('resize', () => { resize(); });
  window.addEventListener('mousemove', e => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });

  init();
  draw();
})();


// ─────────────────────────────────────────
// 2. CURSOR GLOW
// ─────────────────────────────────────────
(function initCursorGlow() {
  const glow = document.getElementById('cursorGlow');
  if (!glow) return;

  let cx = -9999, cy = -9999;
  let tx = -9999, ty = -9999;

  window.addEventListener('mousemove', e => {
    tx = e.clientX;
    ty = e.clientY;
  });

  function animate() {
    cx += (tx - cx) * 0.08;
    cy += (ty - cy) * 0.08;
    glow.style.left = cx + 'px';
    glow.style.top  = cy + 'px';
    requestAnimationFrame(animate);
  }
  animate();
})();


// ─────────────────────────────────────────
// 3. HEADER SCROLL EFFECT
// ─────────────────────────────────────────
const header = document.getElementById('header');
window.addEventListener('scroll', () => {
  if (window.scrollY > 30) {
    header.classList.add('scrolled');
  } else {
    header.classList.remove('scrolled');
  }
});


// ─────────────────────────────────────────
// 4. SMOOTH SCROLL
// ─────────────────────────────────────────
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const href = this.getAttribute('href');
    if (href === '#') return;
    e.preventDefault();
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      // Close mobile nav if open
      const navContainer = document.querySelector('.nav-container');
      navContainer.classList.remove('open');
    }
  });
});


// ─────────────────────────────────────────
// 5. ACTIVE NAV + GLOWING INDICATOR
// ─────────────────────────────────────────
const sections  = document.querySelectorAll('section[id]');
const navLinks  = document.querySelectorAll('.nav-link');
const indicator = document.getElementById('navIndicator');

function updateNavIndicator(activeLink) {
  if (!indicator || !activeLink) return;
  const navRect  = activeLink.closest('nav').getBoundingClientRect();
  const linkRect = activeLink.getBoundingClientRect();
  indicator.style.width  = linkRect.width  + 'px';
  indicator.style.height = linkRect.height + 'px';
  indicator.style.left   = (linkRect.left - navRect.left) + 'px';
  indicator.style.top    = (linkRect.top  - navRect.top)  + 'px';
}

// Initial position
setTimeout(() => {
  const initial = document.querySelector('.nav-link.active');
  updateNavIndicator(initial);
}, 100);

window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(section => {
    const sectionTop = section.offsetTop;
    if (window.scrollY >= sectionTop - 250) {
      current = section.getAttribute('id');
    }
  });

  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === '#' + current) {
      link.classList.add('active');
      updateNavIndicator(link);
    }
  });
});

window.addEventListener('resize', () => {
  const active = document.querySelector('.nav-link.active');
  updateNavIndicator(active);
});


// ─────────────────────────────────────────
// 6. HAMBURGER MENU
// ─────────────────────────────────────────
const hamburger    = document.getElementById('hamburger');
const navContainer = document.querySelector('.nav-container');

if (hamburger) {
  hamburger.addEventListener('click', () => {
    navContainer.classList.toggle('open');
    // Animate hamburger lines
    const spans = hamburger.querySelectorAll('span');
    if (navContainer.classList.contains('open')) {
      spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
      spans[1].style.opacity = '0';
      spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
    } else {
      spans[0].style.transform = '';
      spans[1].style.opacity = '';
      spans[2].style.transform = '';
    }
  });
}


// ─────────────────────────────────────────
// 7. SCROLL REVEAL
// ─────────────────────────────────────────
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('revealed');
      revealObserver.unobserve(entry.target);
    }
  });
}, {
  threshold: 0.1,
  rootMargin: '0px 0px -60px 0px',
});

document.querySelectorAll('.scroll-reveal').forEach(el => revealObserver.observe(el));


// ─────────────────────────────────────────
// 8. SKILL CARD ANIMATE
// ─────────────────────────────────────────
const skillObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('animate');
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.skill-card, .competitive-card').forEach(el => {
  skillObserver.observe(el);
});


// ─────────────────────────────────────────
// 9. ANIMATED COUNTER
// ─────────────────────────────────────────
const statNumbers = document.querySelectorAll('.stat-number');
let statsAnimated = false;

function easeOutExpo(t) {
  return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
}

function animateCounter(el) {
  const target   = parseInt(el.getAttribute('data-target'), 10);
  const duration = 2200;
  const start    = performance.now();

  function step(now) {
    const elapsed  = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const eased    = easeOutExpo(progress);
    el.textContent = Math.floor(eased * target);
    if (progress < 1) {
      requestAnimationFrame(step);
    } else {
      el.textContent = target;
    }
  }
  requestAnimationFrame(step);
}

const statsObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting && !statsAnimated) {
      statsAnimated = true;
      statNumbers.forEach(el => animateCounter(el));
    }
  });
}, { threshold: 0.4 });

const statsGrid = document.querySelector('.stats-grid');
if (statsGrid) statsObserver.observe(statsGrid);


// ─────────────────────────────────────────
// 10. ORBIT CARD HOVER — PAUSE/RESUME
// ─────────────────────────────────────────
const orbitTrack   = document.querySelector('.orbit-track');
const projectCards = document.querySelectorAll('.project-card');

projectCards.forEach(card => {
  card.addEventListener('mouseenter', () => {
    if (orbitTrack) orbitTrack.style.animationPlayState = 'paused';
    projectCards.forEach(c => c.style.animationPlayState = 'paused');
  });
  card.addEventListener('mouseleave', () => {
    if (orbitTrack) orbitTrack.style.animationPlayState = 'running';
    projectCards.forEach(c => c.style.animationPlayState = 'running');
  });
});


// ─────────────────────────────────────────
// 11. CONTACT FORM
// ─────────────────────────────────────────
const contactForm = document.getElementById('contactForm');
if (contactForm) {
  contactForm.addEventListener('submit', function (e) {
    e.preventDefault();
    const btn = this.querySelector('.btn-submit');
    const originalHTML = btn.innerHTML;
    btn.innerHTML = '<i class="bi bi-check-lg"></i> Message Sent!';
    btn.style.background = 'linear-gradient(135deg, #10b981, #059669)';
    setTimeout(() => {
      btn.innerHTML = originalHTML;
      btn.style.background = '';
      this.reset();
    }, 3000);
  });
}
