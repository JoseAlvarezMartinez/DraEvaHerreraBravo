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
          panel.classList.add('is-entering');
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

  /* ---------- Aparición al hacer scroll ---------- */
  var animated = document.querySelectorAll('.reveal, .unclip');
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

  /* ---------- Año automático en el footer ---------- */
  var year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();
})();
