/* ══════════════════════════════════════════════
   APP.JS — Orquestador Principal
   ══════════════════════════════════════════════ */

(function () {
  'use strict';

  /**
   * Inicializa el Intersection Observer para animaciones fade-in
   */
  function initScrollAnimations() {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target); // Solo animar una vez
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -40px 0px'
      }
    );

    // Observar elementos con clase .fade-in
    function observeElements() {
      document.querySelectorAll('.fade-in:not(.is-visible)').forEach(el => {
        observer.observe(el);
      });
    }

    // Observar los elementos iniciales
    observeElements();

    // Re-observar después de que el catálogo se renderice dinámicamente
    document.addEventListener('catalog:rendered', () => {
      // Pequeño delay para que el DOM se actualice
      requestAnimationFrame(observeElements);
    });
  }

  /**
   * Inicialización principal al cargar el DOM
   */
  document.addEventListener('DOMContentLoaded', () => {
    // Módulos del catálogo y carrito
    CatalogRenderer.init();
    Cart.init();

    // Navegación
    Navigation.initMobileMenu();
    Navigation.initStickyHeader();
    Navigation.initSmoothScroll();

    // Newsletter
    Newsletter.init();

    // Animaciones de scroll
    initScrollAnimations();

    // Año dinámico en el copyright
    const yearEl = document.getElementById('current-year');
    if (yearEl) {
      yearEl.textContent = new Date().getFullYear();
    }

    console.log('%c Ari Katay — Licorería Premium', 'color: #D4AF37; font-size: 14px; font-weight: bold;');
  });
})();
