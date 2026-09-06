/* ══════════════════════════════════════════════
   NAVIGATION.JS — Menú Responsive + Scroll
   ══════════════════════════════════════════════ */

const Navigation = (function () {
  'use strict';

  const HEADER_HEIGHT = 72;

  /**
   * Inicializa el menú hamburguesa para móvil
   */
  function initMobileMenu() {
    const menuToggle = document.getElementById('menu-toggle');
    const mainNav    = document.getElementById('main-nav');

    if (!menuToggle || !mainNav) return;

    menuToggle.addEventListener('click', () => {
      const isOpen = mainNav.classList.contains('is-open');

      mainNav.classList.toggle('is-open');
      menuToggle.classList.toggle('is-active');
      menuToggle.setAttribute('aria-expanded', !isOpen);
      document.body.classList.toggle('no-scroll', !isOpen);
    });

    // Cerrar menú al hacer click en un enlace
    const navLinks = mainNav.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        mainNav.classList.remove('is-open');
        menuToggle.classList.remove('is-active');
        menuToggle.setAttribute('aria-expanded', 'false');
        document.body.classList.remove('no-scroll');
      });
    });
  }

  /**
   * Añade clase al header cuando se hace scroll
   */
  function initStickyHeader() {
    const header = document.getElementById('site-header');
    if (!header) return;

    let ticking = false;

    function onScroll() {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          if (window.scrollY > 10) {
            header.classList.add('is-scrolled');
          } else {
            header.classList.remove('is-scrolled');
          }
          ticking = false;
        });
        ticking = true;
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true });
  }

  /**
   * Scroll suave a las secciones con compensación del header
   */
  function initSmoothScroll() {
    const anchors = document.querySelectorAll('a[href^="#"]');

    anchors.forEach(anchor => {
      anchor.addEventListener('click', (e) => {
        const targetId = anchor.getAttribute('href');
        if (targetId === '#') return;

        const target = document.querySelector(targetId);
        if (!target) return;

        e.preventDefault();

        const targetPosition = target.getBoundingClientRect().top + window.scrollY - HEADER_HEIGHT;

        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      });
    });
  }

  // API Pública
  return {
    initMobileMenu,
    initStickyHeader,
    initSmoothScroll
  };
})();
