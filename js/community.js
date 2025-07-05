document.addEventListener('DOMContentLoaded', function () {
  const form = document.getElementById('membershipForm');
  const whatsappInput = document.getElementById('whatsapp');
  const whatsappError = document.getElementById('whatsappError');
  const emailInput = document.getElementById('email');
  const emailError = document.getElementById('emailError');
  const messageDiv = document.getElementById('formError');
  const submitButton = form.querySelector('button[type="submit"]');

  // Inject spinner style (optional: move this to CSS file)
  const spinnerStyle = document.createElement('style');
  spinnerStyle.textContent = `
    .spinner2 {
      display: inline-block;
      width: 1rem;
      height: 1rem;
      border: 2px solid rgba(255,255,255,.3);
      border-radius: 50%;
      border-top-color: #fff;
      animation: spin 1s ease-in-out infinite;
    }
    @keyframes spin {
      to { transform: rotate(360deg); }
    }
  `;
  document.head.appendChild(spinnerStyle);

  // Validation functions
  const validateWhatsApp = number => number.replace(/\D/g, '').length >= 10;
  const validateEmail = email => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  // Real-time input validation
  whatsappInput.addEventListener('input', () => {
    whatsappError.textContent = validateWhatsApp(whatsappInput.value) ? '' : 'Please enter a valid WhatsApp number';
  });

  emailInput.addEventListener('input', () => {
    emailError.textContent = validateEmail(emailInput.value) ? '' : 'Please enter a valid email address';
  });

  // Form submission
  form.addEventListener('submit', async function (e) {
    e.preventDefault();

    messageDiv.textContent = '';
    messageDiv.style.display = 'none';

    // Basic HTML5 validation
    if (!form.checkValidity()) {
      messageDiv.textContent = 'Please fill all required fields correctly.';
      messageDiv.style.color = '#dc3545';
      messageDiv.style.display = 'block';
      form.querySelectorAll(':invalid').forEach(field => {
        field.style.borderColor = '#dc3545';
      });
      return;
    }

    // Manual validation
    const formData = new FormData(form);
    let isValid = true;

    if (!validateWhatsApp(formData.get('WhatsApp'))) {
      whatsappError.textContent = 'Please enter a valid WhatsApp number';
      isValid = false;
    }

    if (!validateEmail(formData.get('Email'))) {
      emailError.textContent = 'Please enter a valid email address';
      isValid = false;
    }

    if (!isValid) {
      messageDiv.textContent = 'Please correct the highlighted fields';
      messageDiv.style.color = '#dc3545';
      messageDiv.style.display = 'block';
      return;
    }

    // Disable submit button and show spinner
    submitButton.disabled = true;
    submitButton.innerHTML = '<span class="spinner2"></span> Sending...';

    try {
      const urlEncodedData = new URLSearchParams(formData).toString();
      const scriptURL = 'https://script.google.com/macros/s/AKfycbyrYIoDw_oV_Lysgfxkq3eLLQRv7FvvzY_6HbYeirurHv622E_5G8fgbz-R4N-v-LjP/exec';

      const res = await fetch(scriptURL, {
        method: 'POST',
        body: urlEncodedData,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        redirect: 'follow'
      });

      const result = await res.json();

      if (result.result === 'success') {
        messageDiv.textContent = result.message;
        messageDiv.style.color = '#28a745';
        form.reset();
      } else {
        messageDiv.textContent = result.message || 'Something went wrong.';
        messageDiv.style.color = '#dc3545';
      }

      messageDiv.style.display = 'block';
      setTimeout(() => {
        messageDiv.style.display = 'none';
      }, 5000);
    } catch (error) {
      console.error('Submission Error:', error);
      messageDiv.textContent = 'There was an error submitting your form. Please try again.';
      messageDiv.style.color = '#dc3545';
      messageDiv.style.display = 'block';
    } finally {
      submitButton.disabled = false;
      submitButton.innerHTML = '<span>Submit</span>';
    }
  });

  // Clear field-specific errors when user starts typing
  form.querySelectorAll('input').forEach(input => {
    input.addEventListener('input', function () {
      this.style.borderColor = '';
      if (this.name === 'WhatsApp') whatsappError.textContent = '';
      if (this.name === 'Email') emailError.textContent = '';
    });
  });
});
