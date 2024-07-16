document.addEventListener("DOMContentLoaded", (event) => {
  const slider = document.querySelector("#character-length");
  const characterLengthOutput = document.querySelector(
    "#character-length-output"
  );
  const passwordOutput = document.querySelector("#password-output");
  const copyButton = document.querySelector(".copy-button");
  const textCopied = document.querySelector(".copy-button span");
  const generateButton = document.querySelector(".generate-button");
  const checkboxes = document.querySelectorAll(".checkbox-input");
  const strengthOutput = document.querySelector(".strength-output");
  const strengthBars = document.querySelector(".strength-bars");

  // Set initial state
  slider.value = 10;
  characterLengthOutput.textContent = slider.value;
  passwordOutput.classList.add("clr-neutral-500");
  checkboxes.forEach((checkbox) => {
    checkbox.checked = false;
  });

  const updateSlider = () => {
    const max = slider.max;
    const value = slider.value;
    const percentage = (value / max) * 100;
    slider.style.setProperty("--characterLength", `${percentage}%`);
  };

  const secureMathRandom = () => {
    return (
      window.crypto.getRandomValues(new Uint32Array(1))[0] /
      (Math.pow(2, 32) - 1)
    );
  };

  const generatePassword = () => {
    const length = parseInt(slider.value);
    let charset = "";
    let password = "";

    checkboxes.forEach((checkbox) => {
      if (checkbox.checked) {
        switch (checkbox.value) {
          case "uppercase":
            charset += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
            break;
          case "lowercase":
            charset += "abcdefghijklmnopqrstuvwxyz";
            break;
          case "numbers":
            charset += "0123456789";
            break;
          case "symbols":
            charset += "!@#$%^&*()_+[]{}|;:,.<>?";
            break;
        }
      }
    });

    // Ensure charset is not empty
    if (charset === "") {
      alert("Please select at least one character type.");
      return "";
    }

    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(secureMathRandom() * charset.length);
      password += charset[randomIndex];
    }

    return password;
  };

  const evaluateStrength = (password) => {
    let strength = 0;

    if (password.length >= 8) {
      if (/[a-z]/.test(password)) strength++;
      if (/[A-Z]/.test(password)) strength++;
      if (/\d/.test(password)) strength++;
      if (/[!@#$%^&*()_+\[\]{}|;:,.<>?]/.test(password)) strength++;
      if (/([a-zA-Z0-9])\1+/.test(password)) strength--; // Deduct point for repeated characters
    }

    if (password.length >= 12) strength++; // Additional point for longer length

    return strength;
  };

  const updateStrengthIndicator = (strength) => {
    strengthBars.className = "strength-bars";
    let strengthText = "";

    switch (true) {
      case strength === 1:
        strengthBars.classList.add("too-weak");
        strengthText = "Too Weak!";
        break;
      case strength === 2:
        strengthBars.classList.add("weak");
        strengthText = "Weak";
        break;
      case strength === 3:
        strengthBars.classList.add("medium");
        strengthText = "Medium";
        break;
      case strength >= 4:
        strengthBars.classList.add("strong");
        strengthText = "Strong";
        break;
      default:
        strengthBars.classList.add("too-weak");
        strengthText = "Too Weak!";
    }

    strengthOutput.textContent = strengthText;
    strengthBars.setAttribute("aria-valuenow", strength); // Update aria-valuenow
  };

  const updatePasswordAndStrength = () => {
    const password = generatePassword();
    if (password === "") return; // Do not proceed if no charset was selected

    const strength = evaluateStrength(password);
    updateStrengthIndicator(strength);

    passwordOutput.classList.remove("clr-neutral-500");
    passwordOutput.classList.add("clr-neutral-200");
  };

  slider.addEventListener("input", (event) => {
    updateSlider();
    characterLengthOutput.textContent = event.target.value;
    event.target.setAttribute("aria-valuenow", event.target.value);
    updatePasswordAndStrength();
  });

  checkboxes.forEach((checkbox) => {
    checkbox.addEventListener("change", updatePasswordAndStrength);
  });

  let passwordText = passwordOutput.textContent; // Initialize with initial password output
  const copyContent = async () => {
    try {
      await navigator.clipboard.writeText(passwordText);
    } catch (err) {
      console.error("Failed to copy: ", err);
    }
  };

  copyButton.addEventListener("click", () => {
    setTimeout(() => {
      textCopied.classList.toggle("hidden");
    }, 3000);
    copyContent();
    textCopied.classList.toggle("hidden");
    copyButton.blur();
  });

  generateButton.addEventListener("click", (event) => {
    event.preventDefault();
    const password = generatePassword();
    if (password === "") return; // Do not proceed if no charset was selected
    passwordOutput.textContent = password; // Move this line here
    passwordText = password; // Ensure passwordText is updated
    const strength = evaluateStrength(password);
    updateStrengthIndicator(strength);
    generateButton.blur();
  });

  updateSlider(); // Initialize slider value
});
