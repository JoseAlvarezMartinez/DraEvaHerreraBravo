/* =========================================================
   Dra. Eva Maria Herrera Bravo — Landing
   Menú móvil · Pestañas de pasos · Aparición al hacer scroll
   ========================================================= */
(function () {
  'use strict';

  var root = document.documentElement;
  root.classList.add('js');

  /* ---------- Altura real del header (para ubicar el menú fijo) ---------- */
  var header = document.getElementById('header');
  function setHeaderHeight() {
    if (header) root.style.setProperty('--header-h', header.offsetHeight + 'px');
  }
  setHeaderHeight();
  window.addEventListener('resize', setHeaderHeight);

  /* ---------- Menú hamburguesa ---------- */
  var burger = document.getElementById('burger');
  var menu = document.getElementById('menu-movil');

  function openMenu() {
    menu.hidden = false;
    burger.classList.add('is-open');
    burger.setAttribute('aria-expanded', 'true');
    burger.setAttribute('aria-label', 'Cerrar menú');
    document.body.classList.add('menu-open');
  }
  function closeMenu() {
    menu.hidden = true;
    burger.classList.remove('is-open');
    burger.setAttribute('aria-expanded', 'false');
    burger.setAttribute('aria-label', 'Abrir menú');
    document.body.classList.remove('menu-open');
  }

  if (burger && menu) {
    burger.addEventListener('click', function () {
      menu.hidden ? openMenu() : closeMenu();
    });
    menu.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', closeMenu);
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && !menu.hidden) { closeMenu(); burger.focus(); }
    });
    window.matchMedia('(min-width: 861px)').addEventListener('change', function (e) {
      if (e.matches) closeMenu();
    });
  }

  /* ---------- Pestañas: Teleconsulta / Consultorio ---------- */
  var tabs = Array.prototype.slice.call(document.querySelectorAll('.tab'));

  function selectTab(tab) {
    tabs.forEach(function (t) {
      var active = t === tab;
      var panel = document.getElementById(t.getAttribute('aria-controls'));
      t.classList.toggle('is-active', active);
      t.setAttribute('aria-selected', active ? 'true' : 'false');
      t.tabIndex = active ? 0 : -1;
      if (panel) {
        panel.hidden = !active;
        if (active) {
          panel.classList.remove('is-entering');
          void panel.offsetWidth; // reinicia la animación
          panel.classList.add('is-entering', 'is-visible');
          panel.querySelectorAll('.reveal').forEach(function (el) { el.classList.add('is-visible'); });
        }
      }
    });
  }

  tabs.forEach(function (tab, i) {
    tab.addEventListener('click', function () { selectTab(tab); });
    tab.addEventListener('keydown', function (e) {
      if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
      var next = tabs[(i + (e.key === 'ArrowRight' ? 1 : tabs.length - 1)) % tabs.length];
      next.focus();
      selectTab(next);
    });
  });

  /* ---------- Títulos: separar en líneas para revelarlas con máscara ---------- */
  document.querySelectorAll('.hero__title, .h2, .contact__title').forEach(function (el) {
    var parts = el.innerHTML.split(/<br\s*\/?>/i);
    el.innerHTML = parts.map(function (p, i) {
      return '<span class="line"><span class="line__in" style="--i:' + i + '">' + p.trim() + '</span></span>';
    }).join(' ');
  });
  var heroSection = document.querySelector('.hero');
  if (heroSection) {
    requestAnimationFrame(function () {
      requestAnimationFrame(function () { heroSection.classList.add('is-loaded'); });
    });
  }

  /* ---------- Aparición al hacer scroll ---------- */
  var animated = document.querySelectorAll('.reveal, .unclip, .steps:not([hidden])');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
    animated.forEach(function (el) { io.observe(el); });
  } else {
    animated.forEach(function (el) { el.classList.add('is-visible'); });
  }

  /* ---------- Pago: copiar alias y link de pago opcional ---------- */
  var copyBtn = document.querySelector('[data-copy]');
  var copyStatus = document.getElementById('copy-status');
  if (copyBtn) {
    copyBtn.addEventListener('click', function () {
      var src = document.getElementById(copyBtn.getAttribute('data-copy'));
      var text = src ? src.textContent.trim() : '';
      function done(ok) {
        copyBtn.textContent = ok ? '¡Copiado!' : 'Copiar alias';
        if (copyStatus) copyStatus.textContent = ok ? 'Alias copiado: ' + text : 'No se pudo copiar. Seleccione el alias y cópielo manualmente.';
        if (ok && src) {
          src.classList.remove('is-copied');
          void src.offsetWidth;
          src.classList.add('is-copied');
        }
        if (ok) setTimeout(function () { copyBtn.textContent = 'Copiar alias'; }, 2500);
      }
      if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(text).then(function () { done(true); }, function () { done(false); });
      } else {
        var range = document.createRange();
        range.selectNodeContents(src);
        var sel = window.getSelection();
        sel.removeAllRanges();
        sel.addRange(range);
        var ok = false;
        try { ok = document.execCommand('copy'); } catch (e) {}
        done(ok);
      }
    });
  }

  var mpLink = document.getElementById('mp-link');
  var mpOpen = document.getElementById('mp-open');
  var linkUrl = mpLink && mpLink.getAttribute('data-link');
  if (linkUrl) {
    mpLink.href = linkUrl;
    mpLink.hidden = false;
    if (mpOpen) mpOpen.hidden = true;
  }

  /* =========================================================
     Animaciones modernas
     ========================================================= */
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  /* ---------- ECG del hero: con movimiento reducido, dejar el trazo quieto y completo ---------- */
  var pulseSvg = document.getElementById('pulse-svg');
  if (pulseSvg && reduceMotion && pulseSvg.pauseAnimations) {
    pulseSvg.setCurrentTime(1.98);
    pulseSvg.pauseAnimations();
  }

  /* ---------- Scroll: barra de progreso, header y parallax de la foto ---------- */
  var photo = document.querySelector('.about__photo');
  var ticking = false;
  function onScrollFrame() {
    ticking = false;
    var y = window.scrollY || window.pageYOffset;
    var max = document.documentElement.scrollHeight - window.innerHeight;
    if (header) {
      header.style.setProperty('--progress', max > 0 ? Math.min(y / max, 1).toFixed(4) : 0);
      header.classList.toggle('is-scrolled', y > 8);
    }
    if (photo && !reduceMotion) {
      var r = photo.getBoundingClientRect();
      if (r.bottom > 0 && r.top < window.innerHeight) {
        var p = (r.top + r.height / 2 - window.innerHeight / 2) / window.innerHeight;
        p = Math.max(-1, Math.min(1, p));
        photo.style.setProperty('--py', (p * -5).toFixed(2) + '%');
      }
    }
  }
  function requestScrollFrame() {
    if (!ticking) { ticking = true; requestAnimationFrame(onScrollFrame); }
  }
  window.addEventListener('scroll', requestScrollFrame, { passive: true });
  window.addEventListener('resize', requestScrollFrame);
  onScrollFrame();

  /* ---------- Menú: resaltar la sección visible ---------- */
  var navLinks = Array.prototype.slice.call(document.querySelectorAll('.nav .link[href^="#"]'));
  if (navLinks.length && 'IntersectionObserver' in window) {
    var linkFor = {};
    navLinks.forEach(function (a) { linkFor[a.getAttribute('href').slice(1)] = a; });
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        navLinks.forEach(function (a) { a.classList.remove('is-active'); });
        var a = linkFor[entry.target.id];
        if (a) a.classList.add('is-active');
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    document.querySelectorAll('main section[id]').forEach(function (s) { spy.observe(s); });
  }

  /* ---------- Contadores de honorarios ---------- */
  var counters = document.querySelectorAll('[data-count]');
  if (counters.length && !reduceMotion && 'IntersectionObserver' in window) {
    var countIO = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        countIO.unobserve(entry.target);
        countUp(entry.target);
      });
    }, { threshold: 0.6 });
    counters.forEach(function (el) { countIO.observe(el); });
  }
  function countUp(el) {
    var target = parseFloat(el.getAttribute('value')) || 0;
    var finalText = el.textContent;
    el.style.minWidth = el.getBoundingClientRect().width + 'px';
    var start = null;
    var duration = 1600;
    function step(t) {
      if (start === null) start = t;
      var k = Math.min((t - start) / duration, 1);
      var eased = k === 1 ? 1 : 1 - Math.pow(2, -10 * k);
      el.textContent = '$' + Math.round(target * eased).toLocaleString('es-AR');
      if (k < 1) requestAnimationFrame(step);
      else el.textContent = finalText;
    }
    requestAnimationFrame(step);
  }

  /* ---------- Efectos de cursor (solo mouse, sin movimiento reducido) ---------- */
  if (finePointer && !reduceMotion) {

    /* Hero: foco que sigue al cursor y orbe con profundidad */
    var heroBg = document.getElementById('hero-bg');
    var pulse = document.getElementById('pulse');
    var pointer = null;
    var heroTicking = false;
    function heroFrame() {
      heroTicking = false;
      if (!pointer || !heroBg) return;
      var b = heroBg.getBoundingClientRect();
      var inside = pointer.y >= b.top && pointer.y <= b.bottom;
      heroBg.classList.toggle('is-pointer', inside);
      if (!inside) {
        if (pulse) { pulse.style.setProperty('--px', 0); pulse.style.setProperty('--py', 0); }
        return;
      }
      heroBg.style.setProperty('--sx', (pointer.x - b.left) + 'px');
      heroBg.style.setProperty('--sy', (pointer.y - b.top) + 'px');
      if (pulse) {
        var pr = pulse.getBoundingClientRect();
        var px = (pointer.x - (pr.left + pr.width / 2)) / (window.innerWidth / 2);
        var py = (pointer.y - (pr.top + pr.height / 2)) / (window.innerHeight / 2);
        pulse.style.setProperty('--px', Math.max(-1, Math.min(1, px)).toFixed(3));
        pulse.style.setProperty('--py', Math.max(-1, Math.min(1, py)).toFixed(3));
      }
    }
    document.addEventListener('pointermove', function (e) {
      pointer = { x: e.clientX, y: e.clientY };
      if (!heroTicking) { heroTicking = true; requestAnimationFrame(heroFrame); }
    }, { passive: true });
    document.addEventListener('pointerleave', function () {
      if (heroBg) heroBg.classList.remove('is-pointer');
    });

    /* Tarjetas: foco de luz + inclinación 3D suave */
    document.querySelectorAll('.card, .quote, .pay__box').forEach(function (el) {
      var tilt = el.classList.contains('card');
      el.addEventListener('pointermove', function (e) {
        var r = el.getBoundingClientRect();
        var x = (e.clientX - r.left) / r.width;
        var y = (e.clientY - r.top) / r.height;
        el.style.setProperty('--mx', (x * 100).toFixed(1) + '%');
        el.style.setProperty('--my', (y * 100).toFixed(1) + '%');
        if (tilt) {
          el.style.setProperty('--rx', ((0.5 - y) * 5).toFixed(2) + 'deg');
          el.style.setProperty('--ry', ((x - 0.5) * 5).toFixed(2) + 'deg');
        }
      });
      el.addEventListener('pointerleave', function () {
        if (tilt) {
          el.style.setProperty('--rx', '0deg');
          el.style.setProperty('--ry', '0deg');
        }
      });
    });

    /* Botones principales: efecto magnético */
    document.querySelectorAll('[data-magnetic]').forEach(function (btn) {
      btn.addEventListener('pointermove', function (e) {
        var r = btn.getBoundingClientRect();
        btn.style.setProperty('--tx', ((e.clientX - r.left - r.width / 2) * 0.22).toFixed(1) + 'px');
        btn.style.setProperty('--ty', ((e.clientY - r.top - r.height / 2) * 0.32).toFixed(1) + 'px');
      });
      btn.addEventListener('pointerleave', function () {
        btn.style.setProperty('--tx', '0px');
        btn.style.setProperty('--ty', '0px');
      });
    });
  }

  /* ---------- Año automático en el footer ---------- */
  var year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();
})();
