/* ══════════════════════════════════════════════
   CATALOG.JS — Renderizado Dinámico del Catálogo
   ══════════════════════════════════════════════ */

const CatalogRenderer = (function () {
  'use strict';

  let products = [];
  const GRID_ID = 'product-grid';

  /**
   * Formatea un precio en Soles Peruanos
   * @param {number} price
   * @returns {string} "S/. XX.XX"
   */
  function formatPrice(price) {
    return `S/. ${price.toFixed(2)}`;
  }

  /**
   * Genera el HTML de una tarjeta de producto
   * @param {Object} product
   * @returns {string} HTML string
   */
  function createCardHTML(product) {
    const badgeHTML = product.badge
      ? `<span class="product-card__badge">${product.badge}</span>`
      : '';

    return `
      <article class="product-card fade-in" data-product-id="${product.id}">
        ${badgeHTML}
        <div class="product-card__image-wrapper">
          <img src="${product.image}"
               alt="${product.imageAlt}"
               loading="lazy"
               width="300"
               height="400"
               class="product-card__image">
        </div>
        <span class="product-card__category">${product.categoryLabel}</span>
        <h3 class="product-card__name">${product.name} ${product.volume}</h3>
        <p class="product-card__price">${formatPrice(product.price)}</p>
        <button class="btn btn--primary btn--sm product-card__btn"
                data-action="add-to-cart"
                data-product-id="${product.id}"
                aria-label="Añadir ${product.name} al carrito">
          Añadir
        </button>
      </article>
    `;
  }

  /**
   * Renderiza el grid completo de productos
   * @param {Array} productList
   */
  function renderGrid(productList) {
    const grid = document.getElementById(GRID_ID);
    if (!grid) return;

    grid.innerHTML = productList.map(createCardHTML).join('');
  }

  /**
   * Carga los productos desde el JSON y renderiza
   */
  async function init() {
    try {
      const response = await fetch('./js/data/products.json');
      if (!response.ok) throw new Error(`HTTP ${response.status}`);

      const data = await response.json();
      products = data.products || [];
      renderGrid(products);

      // Disparar evento para que app.js pueda observar los nuevos elementos
      document.dispatchEvent(new CustomEvent('catalog:rendered'));
    } catch (error) {
      console.error('[CatalogRenderer] Error cargando productos:', error);
      const grid = document.getElementById(GRID_ID);
      if (grid) {
        grid.innerHTML = `
          <p style="color: var(--text-muted); text-align: center; grid-column: 1/-1; padding: 3rem;">
            No se pudieron cargar los productos. Intenta recargar la página.
          </p>`;
      }
    }
  }

  /**
   * Obtiene un producto por su ID
   * @param {string} id
   * @returns {Object|undefined}
   */
  function getProductById(id) {
    return products.find(p => p.id === id);
  }

  // API Pública
  return {
    init,
    getProductById,
    formatPrice,
    get products() { return products; }
  };
})();
