document.addEventListener('DOMContentLoaded', function() {
  const form = document.getElementById('membershipForm');
  const whatsappInput = document.getElementById('whatsapp');
  const whatsappError = document.getElementById('whatsappError');
  const emailInput = document.getElementById('email');
  const emailError = document.getElementById('emailError');
  const messageDiv = document.getElementById('formError');
  const submitButton = document.getElementById('submit');

  // Add spinner CSS (you can also put this in your stylesheet)
  const spinnerStyle = document.createElement('style');
  spinnerStyle.textContent = `
    .spinner {
      display: inline-block;
      width: 1rem;
      height: 1rem;
      border: 2px solid rgba(255,255,255,.3);
      border-radius: 50%;
      border-top-color: #fff;
      animation: spin 1s ease-in-out infinite;
      margin-right: 8px;
    }
    @keyframes spin {
      to { transform: rotate(360deg); }
    }
  `;
  document.head.appendChild(spinnerStyle);

  // Client-side validation functions
  function validateWhatsApp(number) {
    const digits = number.replace(/\D/g, '');
    return digits.length >= 10;
  }

  function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  // Real-time validation
  whatsappInput.addEventListener('input', function() {
    if (!validateWhatsApp(this.value)) {
      whatsappError.textContent = 'Please enter a valid WhatsApp number';
    } else {
      whatsappError.textContent = '';
    }
  });

  emailInput.addEventListener('input', function() {
    if (!validateEmail(this.value)) {
      emailError.textContent = 'Please enter a valid email address';
    } else {
      emailError.textContent = '';
    }
  });

  // Form submission handler
  form.addEventListener('submit', async function(e) {
    e.preventDefault();

    // Reset messages
    messageDiv.textContent = '';
    messageDiv.style.display = 'none';

    // First check standard HTML5 validation
    if (!form.checkValidity()) {
      messageDiv.textContent = 'Please fill all required fields correctly.';
      messageDiv.style.color = '#dc3545';
      messageDiv.style.display = 'block';
      
      // Manually trigger validation UI
      form.querySelectorAll(':invalid').forEach(field => {
        field.style.borderColor = '#dc3545';
      });
      return;
    }

    // Then check custom validation
    let isValid = true;
    const formData = new FormData(form);

    // Check WhatsApp
    if (!validateWhatsApp(formData.get('Whatsapp'))) {
      whatsappError.textContent = 'Please enter a valid WhatsApp number';
      isValid = false;
    }

    // Check Email
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

    // Disable button and show spinner
    submitButton.disabled = true;
    submitButton.innerHTML = '<span class="spinner"></span> Sending...';

    try {
      // Convert FormData to URL-encoded string
      const urlEncodedData = new URLSearchParams(formData).toString();

      // Send data to Google Apps Script
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

    } catch (error) {
      // Show error message
      console.error('Error:', error);
      messageDiv.textContent = 'There was an error submitting your form. Please try again.';
      messageDiv.style.color = '#dc3545';
      messageDiv.style.display = 'block';
    } finally {
      // Re-enable button
      submitButton.disabled = false;
      submitButton.innerHTML = '<span>Submit</span>';
    }
  });

  // Reset field styles when user starts typing
  form.querySelectorAll('input').forEach(input => {
    input.addEventListener('input', function() {
      this.style.borderColor = '';
      // Clear individual field errors
      if (this.name === 'Whatsapp') whatsappError.textContent = '';
      if (this.name === 'Email') emailError.textContent = '';
    });
  });
});