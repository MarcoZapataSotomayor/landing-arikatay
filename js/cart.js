/* ══════════════════════════════════════════════
   CART.JS — Lógica del Carrito de Compras
   ══════════════════════════════════════════════ */

const Cart = (function () {
  'use strict';

  // ── Estado ──
  let items = [];
  const WHATSAPP_NUMBER = '51967307634';

  // ── Elementos DOM (se cachean en init) ──
  let cartDrawer, cartOverlay, cartItemsEl, cartTotalEl, cartCountEl, checkoutBtn;
  let feedbackEl;

  /**
   * Inicializa el carrito y cachea los elementos DOM
   */
  function init() {
    cartDrawer   = document.getElementById('cart-drawer');
    cartOverlay  = document.getElementById('cart-overlay');
    cartItemsEl  = document.getElementById('cart-items');
    cartTotalEl  = document.getElementById('cart-total');
    cartCountEl  = document.getElementById('cart-count');
    checkoutBtn  = document.getElementById('checkout-btn');

    // Crear elemento de feedback
    feedbackEl = document.createElement('div');
    feedbackEl.className = 'added-feedback';
    feedbackEl.setAttribute('role', 'status');
    feedbackEl.setAttribute('aria-live', 'polite');
    document.body.appendChild(feedbackEl);

    bindEvents();
  }

  /**
   * Bindea todos los event listeners
   */
  function bindEvents() {
    // Toggle carrito
    const cartToggle = document.getElementById('cart-toggle');
    const cartClose  = document.getElementById('cart-close');

    if (cartToggle) cartToggle.addEventListener('click', toggleDrawer);
    if (cartClose)  cartClose.addEventListener('click', toggleDrawer);
    if (cartOverlay) cartOverlay.addEventListener('click', toggleDrawer);

    // Delegación de eventos para "Añadir" en el grid de productos
    const productGrid = document.getElementById('product-grid');
    if (productGrid) {
      productGrid.addEventListener('click', handleGridClick);
    }

    // Delegación de eventos dentro del carrito (qty +/-, eliminar)
    if (cartItemsEl) {
      cartItemsEl.addEventListener('click', handleCartClick);
    }

    // Checkout WhatsApp
    if (checkoutBtn) {
      checkoutBtn.addEventListener('click', handleCheckout);
    }

    // Cerrar carrito con Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && cartDrawer?.classList.contains('is-open')) {
        toggleDrawer();
      }
    });
  }

  /**
   * Maneja clicks en el grid de productos (delegación)
   */
  function handleGridClick(e) {
    const btn = e.target.closest('[data-action="add-to-cart"]');
    if (!btn) return;

    const productId = btn.dataset.productId;
    addItem(productId);
  }

  /**
   * Maneja clicks dentro del carrito (delegación)
   */
  function handleCartClick(e) {
    const target = e.target.closest('[data-cart-action]');
    if (!target) return;

    const action    = target.dataset.cartAction;
    const productId = target.dataset.productId;

    switch (action) {
      case 'increase':
        updateQuantity(productId, getItemQty(productId) + 1);
        break;
      case 'decrease':
        updateQuantity(productId, getItemQty(productId) - 1);
        break;
      case 'remove':
        removeItem(productId);
        break;
    }
  }

  /**
   * Añade un producto al carrito
   */
  function addItem(productId) {
    const product = CatalogRenderer.getProductById(productId);
    if (!product) return;

    const existing = items.find(item => item.product.id === productId);

    if (existing) {
      existing.quantity += 1;
    } else {
      items.push({ product, quantity: 1 });
    }

    updateUI();
    updateCounter();
    showFeedback(`✓ ${product.name} añadido`);
  }

  /**
   * Elimina un producto del carrito
   */
  function removeItem(productId) {
    items = items.filter(item => item.product.id !== productId);
    updateUI();
    updateCounter();
  }

  /**
   * Actualiza la cantidad de un producto
   */
  function updateQuantity(productId, newQty) {
    if (newQty <= 0) {
      removeItem(productId);
      return;
    }
    const item = items.find(i => i.product.id === productId);
    if (item) {
      item.quantity = newQty;
      updateUI();
      updateCounter();
    }
  }

  /**
   * Obtiene la cantidad actual de un producto en el carrito
   */
  function getItemQty(productId) {
    const item = items.find(i => i.product.id === productId);
    return item ? item.quantity : 0;
  }

  /**
   * Calcula el total del carrito
   */
  function getTotal() {
    return items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  }

  /**
   * Calcula la cantidad total de ítems
   */
  function getTotalItems() {
    return items.reduce((sum, item) => sum + item.quantity, 0);
  }

  /**
   * Actualiza el contador visual del carrito
   */
  function updateCounter() {
    if (!cartCountEl) return;

    const total = getTotalItems();
    cartCountEl.textContent = total;

    if (total > 0) {
      cartCountEl.classList.add('has-items');
      // Trigger bounce animation
      cartCountEl.classList.remove('bounce');
      void cartCountEl.offsetWidth; // Force reflow
      cartCountEl.classList.add('bounce');
    } else {
      cartCountEl.classList.remove('has-items', 'bounce');
    }
  }

  /**
   * Renderiza la UI del carrito
   */
  function updateUI() {
    if (!cartItemsEl || !cartTotalEl) return;

    if (items.length === 0) {
      cartItemsEl.innerHTML = `
        <div class="cart-drawer__empty">
          <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" stroke-linecap="round" stroke-linejoin="round"/>
            <line x1="3" y1="6" x2="21" y2="6"/>
            <path d="M16 10a4 4 0 01-8 0"/>
          </svg>
          <p>Tu selección está vacía</p>
        </div>`;
      cartTotalEl.textContent = 'S/. 0.00';

      // Disable checkout
      if (checkoutBtn) checkoutBtn.style.pointerEvents = 'none';
      if (checkoutBtn) checkoutBtn.style.opacity = '0.5';
      return;
    }

    // Enable checkout
    if (checkoutBtn) checkoutBtn.style.pointerEvents = '';
    if (checkoutBtn) checkoutBtn.style.opacity = '';

    cartItemsEl.innerHTML = items.map(({ product, quantity }) => `
      <div class="cart-item" data-product-id="${product.id}">
        <img src="${product.image}" alt="${product.imageAlt}" class="cart-item__img"
             width="56" height="70" loading="lazy">
        <div class="cart-item__info">
          <span class="cart-item__name">${product.name} ${product.volume}</span>
          <span class="cart-item__price">${CatalogRenderer.formatPrice(product.price * quantity)}</span>
        </div>
        <div class="cart-item__controls">
          <div class="cart-item__qty">
            <button data-cart-action="decrease" data-product-id="${product.id}"
                    aria-label="Reducir cantidad de ${product.name}">−</button>
            <span aria-label="Cantidad">${quantity}</span>
            <button data-cart-action="increase" data-product-id="${product.id}"
                    aria-label="Aumentar cantidad de ${product.name}">+</button>
          </div>
          <button class="cart-item__remove" data-cart-action="remove"
                  data-product-id="${product.id}"
                  aria-label="Eliminar ${product.name} del carrito">
            Eliminar
          </button>
        </div>
      </div>
    `).join('');

    cartTotalEl.textContent = CatalogRenderer.formatPrice(getTotal());
  }

  /**
   * Abre/cierra el drawer del carrito
   */
  function toggleDrawer() {
    if (!cartDrawer || !cartOverlay) return;

    const isOpen = cartDrawer.classList.contains('is-open');

    cartDrawer.classList.toggle('is-open');
    cartOverlay.classList.toggle('is-visible');
    cartDrawer.setAttribute('aria-hidden', isOpen ? 'true' : 'false');
    document.body.classList.toggle('no-scroll', !isOpen);

    // Focus trap: focus al botón de cerrar al abrir
    if (!isOpen) {
      const closeBtn = document.getElementById('cart-close');
      if (closeBtn) closeBtn.focus();
    }
  }

  /**
   * Muestra un feedback visual temporal
   */
  function showFeedback(message) {
    if (!feedbackEl) return;

    feedbackEl.textContent = message;
    feedbackEl.classList.add('is-visible');

    setTimeout(() => {
      feedbackEl.classList.remove('is-visible');
    }, 1800);
  }

  /**
   * Genera el mensaje de WhatsApp y redirige
   */
  function handleCheckout(e) {
    e.preventDefault();
    if (items.length === 0) return;

    let message = '🛒 *Pedido Ari Katay*\n\n';

    items.forEach(({ product, quantity }) => {
      const subtotal = product.price * quantity;
      message += `▸ ${product.name} ${product.volume} x${quantity} — ${CatalogRenderer.formatPrice(subtotal)}\n`;
    });

    message += `\n💰 *Total: ${CatalogRenderer.formatPrice(getTotal())}*`;
    message += '\n\n📍 Por favor, confirmar dirección de envío.';

    const encodedMessage = encodeURIComponent(message);
    const whatsappURL = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`;

    window.open(whatsappURL, '_blank');
  }

  // API Pública
  return {
    init,
    addItem,
    removeItem,
    toggleDrawer
  };
})();
