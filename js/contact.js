document.addEventListener('DOMContentLoaded', function () {
  const form = document.forms['google-sheet'];
  const submitButton = form.querySelector('button[type="submit"]');
  const messageDiv = document.getElementById('form-message');
  const scriptURL = 'https://script.google.com/macros/s/AKfycbzV0DT-3aJwjBdmsf1C19GvAjVvgX41fPRV9BItirCekHJ2_PH45A6YK5BS3l8ISJJPsQ/exec';

  // Multi-select logic
  const options = [
    "Fashion",
    "Electronics",
    "Home & Kitchen",
    "Beauty",
    "Sports",
    "Toys",
    "Books",
  ];

  const input = document.getElementById("category-input");
  const dropdown = document.getElementById("dropdown-list");
  const selectedContainer = document.getElementById("selected-options");

  let selectedValues = [];

  function renderDropdown(filteredOptions) {
    dropdown.innerHTML = "";
    filteredOptions.forEach((item) => {
      if (!selectedValues.includes(item)) {
        const li = document.createElement("li");
        li.textContent = item;
        li.onclick = () => {
          selectedValues.push(item);
          updateSelected();
          dropdown.style.display = "none";
          input.value = "";
        };
        dropdown.appendChild(li);
      }
    });
    dropdown.style.display = filteredOptions.length ? "block" : "none";
  }

  function updateSelected() {
    selectedContainer.innerHTML = "";
    selectedValues.forEach((item) => {
      const tag = document.createElement("div");
      tag.className = "selected-tag";
      tag.innerHTML = `<span>${item}</span><div class="remove-tag" onclick="removeTag('${item}')">×</div>`;
      selectedContainer.appendChild(tag);
    });
  }

  window.removeTag = function (item) {
    selectedValues = selectedValues.filter((val) => val !== item);
    updateSelected();
  };

  input.addEventListener("input", () => {
    const search = input.value.toLowerCase();
    const filtered = options.filter((opt) =>
      opt.toLowerCase().includes(search)
    );
    renderDropdown(filtered);
  });

  input.addEventListener("focus", () => {
    renderDropdown(options);
  });

  document.addEventListener("click", (e) => {
    if (!e.target.closest(".multi-select")) {
      dropdown.style.display = "none";
    }
  });

  // Form submission
  form.addEventListener('submit', async function (e) {
    e.preventDefault();

    // Validation
    if (!form.checkValidity()) {
      messageDiv.textContent = 'Please fill all required fields correctly.';
      messageDiv.style.color = '#dc3545';
      messageDiv.style.display = 'block';
      return;
    }

    // Add selected categories to form before sending
    const selectedCategories = selectedValues.join(', ');
    const hiddenInput = document.createElement("input");
    hiddenInput.type = "hidden";
    hiddenInput.name = "Marketplace";
    hiddenInput.value = selectedCategories;
    form.appendChild(hiddenInput);

    // Disable button
    submitButton.disabled = true;
    submitButton.innerHTML = '<span class="spinner"></span> Sending...';
    messageDiv.textContent = '';
    messageDiv.style.display = 'block';

    try {
      const formData = new URLSearchParams();
      form.querySelectorAll('input, textarea, input[type="hidden"]').forEach(field => {
        formData.append(field.name, field.value);
      });

      const response = await fetch(scriptURL, {
        method: 'POST',
        body: formData,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        redirect: 'follow'
      });

      messageDiv.textContent = 'Thank you! Your message has been sent successfully.';
      messageDiv.style.color = '#28a745';
      form.reset();
      selectedValues = [];
      updateSelected();

    } catch (error) {
      console.error('Error:', error);
      messageDiv.textContent = 'There was an error submitting your form. Please try again.';
      messageDiv.style.color = '#dc3545';
    } finally {
      submitButton.disabled = false;
      submitButton.innerHTML = '<span>Submit</span>';
      setTimeout(() => {
        messageDiv.style.display = 'none';
      }, 5000);
    }
  });
});