document.addEventListener('DOMContentLoaded', function () {
            const form = document.forms['google-sheet'];
            const submitButton = form.querySelector('button[type="submit"]');
            const messageDiv = document.getElementById('form-message');
            const scriptURL = 'https://script.google.com/macros/s/AKfycbze-Rjm-hpPmdYuUyahTzGhuxTRrfqWAFVQCXy1I6Ve-ZxJAzUP20XfogngMnaMJrWXyg/exec';

            form.addEventListener('submit', async function (e) {
                e.preventDefault();

                // Validate form before submission
                if (!form.checkValidity()) {
                    messageDiv.textContent = 'Please fill all required fields correctly.';
                    messageDiv.style.color = '#dc3545';
                    messageDiv.style.display = 'block';
                    return;
                }

                // Disable button during submission
                submitButton.disabled = true;
                submitButton.innerHTML = '<span class="spinner"></span> Sending...';
                messageDiv.textContent = '';
                messageDiv.style.display = 'block';

                try {
                    // Create FormData object
                    const formData = new URLSearchParams();
                    form.querySelectorAll('input, textarea').forEach(field => {
                        formData.append(field.name, field.value);
                    });

                    // Send data to Google Apps Script
                    const response = await fetch(scriptURL, {
                        method: 'POST',
                        body: formData,
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded'
                        },
                        redirect: 'follow'
                    });

                    // Show success message
                    messageDiv.textContent = 'Thank you! Your message has been sent successfully.';
                    messageDiv.style.color = '#28a745';
                    form.reset();

                } catch (error) {
                    // Show error message
                    console.error('Error:', error);
                    messageDiv.textContent = 'There was an error submitting your form. Please try again.';
                    messageDiv.style.color = '#dc3545';
                } finally {
                    // Re-enable button
                    submitButton.disabled = false;
                    submitButton.innerHTML = '<span>Submit</span>';

                    // Hide message after 5 seconds
                    setTimeout(() => {
                        messageDiv.style.display = 'none';
                    }, 5000);
                }
            });
        });