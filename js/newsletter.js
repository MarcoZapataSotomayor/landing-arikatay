/* ══════════════════════════════════════════════
   NEWSLETTER.JS — Validación del Formulario
   ══════════════════════════════════════════════ */

const Newsletter = (function () {
  'use strict';

  const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  let form, nameInput, emailInput, emailError, submitBtn;

  /**
   * Inicializa la validación del formulario
   */
  function init() {
    form       = document.getElementById('newsletter-form');
    nameInput  = document.getElementById('newsletter-name');
    emailInput = document.getElementById('newsletter-email');
    emailError = document.getElementById('email-error');
    submitBtn  = document.getElementById('newsletter-submit');

    if (!form) return;

    form.addEventListener('submit', handleSubmit);

    // Validación en tiempo real
    if (emailInput) {
      emailInput.addEventListener('input', validateEmailRealtime);
      emailInput.addEventListener('blur', validateEmailRealtime);
    }

    if (nameInput) {
      nameInput.addEventListener('blur', validateName);
    }
  }

  /**
   * Valida el nombre
   */
  function validateName() {
    if (!nameInput) return true;

    const value = nameInput.value.trim();

    if (value.length < 2) {
      nameInput.classList.add('is-invalid');
      nameInput.classList.remove('is-valid');
      return false;
    }

    nameInput.classList.remove('is-invalid');
    nameInput.classList.add('is-valid');
    return true;
  }

  /**
   * Validación en tiempo real del email
   */
  function validateEmailRealtime() {
    if (!emailInput || !emailError) return;

    const value = emailInput.value.trim();

    if (value === '') {
      emailInput.classList.remove('is-invalid', 'is-valid');
      emailError.textContent = '';
      return;
    }

    if (!EMAIL_REGEX.test(value)) {
      emailInput.classList.add('is-invalid');
      emailInput.classList.remove('is-valid');
      emailError.textContent = 'Ingresa un correo electrónico válido';
      return false;
    }

    emailInput.classList.remove('is-invalid');
    emailInput.classList.add('is-valid');
    emailError.textContent = '';
    return true;
  }

  /**
   * Maneja el envío del formulario
   */
  function handleSubmit(e) {
    e.preventDefault();

    const isNameValid  = validateName();
    const isEmailValid = validateEmailRealtime();

    // Validar campos vacíos
    if (!nameInput.value.trim()) {
      nameInput.classList.add('is-invalid');
    }

    if (!emailInput.value.trim()) {
      emailInput.classList.add('is-invalid');
      emailError.textContent = 'Este campo es obligatorio';
    }

    if (!isNameValid || !isEmailValid) return;

    // Simular envío
    submitBtn.disabled = true;
    submitBtn.textContent = 'Enviando...';

    setTimeout(() => {
      showSuccess();
    }, 1500);
  }

  /**
   * Muestra el mensaje de éxito
   */
  function showSuccess() {
    const newsletter = document.getElementById('newsletter');
    if (!newsletter) return;

    const successHTML = `
      <div class="newsletter__success">
        <div style="font-size: 2.5rem; margin-bottom: 1rem;">🎉</div>
        <h3>¡Bienvenido al Club Ari Katay!</h3>
        <p>Revisa tu correo para ofertas exclusivas y recomendaciones de sommelier.</p>
      </div>
    `;

    // Fade out form, fade in success
    form.style.opacity = '0';
    form.style.transform = 'translateY(-10px)';
    form.style.transition = 'all 0.3s ease';

    setTimeout(() => {
      form.remove();
      newsletter.querySelector('.newsletter__subtitle').remove();
      newsletter.querySelector('.newsletter__title').textContent = '';
      newsletter.insertAdjacentHTML('beforeend', successHTML);
    }, 300);
  }

  // API Pública
  return { init };
})();
