document.addEventListener('DOMContentLoaded', function () {
  const form = document.getElementById('membershipForm');
  const whatsappInput = document.getElementById('whatsapp');
  const whatsappError = document.getElementById('whatsappError');
  const emailInput = document.getElementById('email');
  const emailError = document.getElementById('emailError');
  const messageDiv = document.getElementById('formError');
  const submitButton = form.querySelector('button[type="submit"]');

  // Spinner CSS (optional to move to stylesheet)
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
  const validateWhatsApp = number => number.replace().length >= 10;
  const validateEmail = email => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  // Real-time input validation
  whatsappInput.addEventListener('input', () => {
    whatsappError.textContent = validateWhatsApp(whatsappInput.value) ? '' : 'Please enter a valid WhatsApp number';
  });

  emailInput.addEventListener('input', () => {
    emailError.textContent = validateEmail(emailInput.value) ? '' : 'Please enter a valid email address';
  });

  form.addEventListener('submit', async function (e) {
    e.preventDefault();

    messageDiv.textContent = '';
    messageDiv.style.display = 'none';

    if (!form.checkValidity()) {
      messageDiv.textContent = 'Please fill all required fields correctly.';
      messageDiv.style.color = '#dc3545';
      messageDiv.style.display = 'block';

      form.querySelectorAll(':invalid').forEach(field => {
        field.style.borderColor = '#dc3545';
      });
      return;
    }

    const formData = new FormData(form);
    let isValid = true;

    if (!validateWhatsApp(formData.get('Whatsapp'))) {
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
      const scriptURL = 'https://script.google.com/macros/s/AKfycbxonryNOaBhPMwAQNoH6hk9NggHU6wHFjBQScfDXonIoqSO5xB0PD-dUKVSYBFT7bHw/exec';

      const response = await fetch(scriptURL, {
        method: 'POST',
        body: urlEncodedData,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        redirect: 'follow'
      });

      // Show success message
      messageDiv.textContent = 'Thank you! Your message has been sent successfully.';
      messageDiv.style.color = '#28a745';
      messageDiv.style.display = 'block';
      form.reset();

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

  // Clear error borders and messages when typing
  form.querySelectorAll('input').forEach(input => {
    input.addEventListener('input', function () {
      this.style.borderColor = '';
      if (this.name === 'Whatsapp') whatsappError.textContent = '';
      if (this.name === 'Email') emailError.textContent = '';
    });
  });
});
