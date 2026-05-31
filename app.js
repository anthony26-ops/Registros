document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('registration-form');
  const nameInput = document.getElementById('name');
  const phoneInput = document.getElementById('phone');
  const consentCheckbox = document.getElementById('consent');
  
  const nameError = document.getElementById('name-error');
  const phoneError = document.getElementById('phone-error');
  const consentError = document.getElementById('consent-error');
  const generalError = document.getElementById('general-error');
  
  const submitBtn = document.getElementById('submit-btn');
  const btnSpinner = document.getElementById('btn-spinner');
  const btnText = submitBtn.querySelector('span');
  
  const formCard = document.getElementById('form-card');
  const successCard = document.getElementById('success-card');
  const resetBtn = document.getElementById('reset-btn');

  // Phone Validation Regex: basic international validation
  // Allows +, digits, spaces, dashes, and parentheses, 7 to 15 digits total
  const PHONE_REGEX = /^\+?[0-9\s\-()]{7,15}$/;

  function validateForm() {
    let isValid = true;

    // Reset error messages
    nameError.style.display = 'none';
    phoneError.style.display = 'none';
    consentError.style.display = 'none';
    generalError.style.display = 'none';
    
    nameInput.style.borderColor = '';
    phoneInput.style.borderColor = '';

    // Validate Name
    const nameValue = nameInput.value.trim();
    if (!nameValue) {
      nameError.textContent = 'El nombre es obligatorio.';
      nameError.style.display = 'block';
      nameInput.style.borderColor = 'var(--color-error)';
      isValid = false;
    }

    // Validate Phone
    const phoneValue = phoneInput.value.trim();
    if (!phoneValue) {
      phoneError.textContent = 'El número de teléfono es obligatorio.';
      phoneError.style.display = 'block';
      phoneInput.style.borderColor = 'var(--color-error)';
      isValid = false;
    } else if (!PHONE_REGEX.test(phoneValue)) {
      phoneError.textContent = 'Ingrese un número válido (ej. +502 5555 1234, min. 7 dígitos).';
      phoneError.style.display = 'block';
      phoneInput.style.borderColor = 'var(--color-error)';
      isValid = false;
    }

    // Validate Consent Checkbox
    if (!consentCheckbox.checked) {
      consentError.textContent = 'Debe aceptar que le contactemos por WhatsApp/SMS.';
      consentError.style.display = 'block';
      isValid = false;
    }

    return isValid;
  }

  // Handle Form Submission
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    // Show loading state
    submitBtn.disabled = true;
    btnSpinner.style.display = 'block';
    btnText.style.opacity = '0.3';
    generalError.style.display = 'none';

    const payload = {
      name: nameInput.value.trim(),
      phone: phoneInput.value.trim(),
      consent: consentCheckbox.checked
    };

    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      const result = await response.json();

      if (response.ok && result.success) {
        // Show success animation
        formCard.style.display = 'none';
        successCard.style.display = 'block';
        
        // Reset form
        form.reset();
      } else {
        // Server side validation error
        generalError.textContent = result.error || 'Ocurrió un error inesperado al procesar el registro.';
        generalError.style.display = 'block';
      }
    } catch (error) {
      console.error('Error al enviar los datos:', error);
      generalError.textContent = 'Error de conexión. Por favor, verifique su acceso a internet e intente nuevamente.';
      generalError.style.display = 'block';
    } finally {
      // Hide loading state
      submitBtn.disabled = false;
      btnSpinner.style.display = 'none';
      btnText.style.opacity = '1';
    }
  });

  // Handle Form Reset
  resetBtn.addEventListener('click', () => {
    successCard.style.display = 'none';
    formCard.style.display = 'block';
  });

  // Real-time input clearing validation style on input
  nameInput.addEventListener('input', () => {
    if (nameInput.value.trim()) {
      nameError.style.display = 'none';
      nameInput.style.borderColor = '';
    }
  });

  phoneInput.addEventListener('input', () => {
    if (phoneInput.value.trim() && PHONE_REGEX.test(phoneInput.value.trim())) {
      phoneError.style.display = 'none';
      phoneInput.style.borderColor = '';
    }
  });

  consentCheckbox.addEventListener('change', () => {
    if (consentCheckbox.checked) {
      consentError.style.display = 'none';
    }
  });
});
