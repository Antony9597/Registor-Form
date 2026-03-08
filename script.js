const form = document.getElementById("registerForm");
    const nameInput = document.getElementById("name");
    const emailInput = document.getElementById("email");
    const passwordInput = document.getElementById("password");
    const submitBtn = document.getElementById("submitBtn");
    const passwordHint = document.getElementById("passwordHint");
    const successToast = document.getElementById("successToast");
    const toastMessage = document.getElementById("toastMessage");
    const closeToastBtn = document.getElementById("closeToastBtn");

    const formErrors = document.getElementById("formErrors");
    const touched = { name: false, email: false, password: false };
    let submitAttempted = false;
    let toastTimer = null;

    function isValidEmail(email) {
      const hasAt = email.includes("@");
      const hasDot = email.includes(".");
      const hasNoSpaces = !email.includes(" ");
      const atIndex = email.indexOf("@");
      const dotIndex = email.lastIndexOf(".");
      const hasTextBeforeAt = atIndex > 0;
      const hasTextBetweenAtAndDot = dotIndex > atIndex + 1;
      const hasTextAfterDot = dotIndex < email.length - 1;

      return (
        hasAt &&
        hasDot &&
        hasNoSpaces &&
        hasTextBeforeAt &&
        hasTextBetweenAtAndDot &&
        hasTextAfterDot
      );
    }

    function setFieldClass(input, isValid, shouldDisplayState) {
      input.classList.remove("valid", "invalid");
      if (!shouldDisplayState) return;
      input.classList.add(isValid ? "valid" : "invalid");
    }

    function validateName() {
      const value = nameInput.value.trim();
      const isValid = Boolean(value);
      const showState = touched.name || submitAttempted || value.length > 0;
      setFieldClass(nameInput, isValid, showState);
      return { isValid, message: "Name is required." };
    }

    function validateEmail() {
      const value = emailInput.value.trim();
      const isValid = isValidEmail(value);
      const showState = touched.email || submitAttempted || value.length > 0;
      setFieldClass(emailInput, isValid, showState);
      return { isValid, message: "Please enter a valid email address." };
    }

    function validatePassword() {
      const value = passwordInput.value;
      const isValid = value.length >= 6;
      const showState = touched.password || submitAttempted || value.length > 0;
      setFieldClass(passwordInput, isValid, showState);

      if (value.length === 0) {
        passwordHint.textContent = "Minimum 6 characters";
        passwordHint.classList.remove("ok");
      } else if (isValid) {
        passwordHint.textContent = "Strong enough";
        passwordHint.classList.add("ok");
      } else {
        const remaining = 6 - value.length;
        passwordHint.textContent = `${remaining} more character${remaining > 1 ? "s" : ""} needed`;
        passwordHint.classList.remove("ok");
      }
      return { isValid, message: "Password must be at least 6 characters." };
    }

    function renderFormErrors(messages, shouldShow) {
      if (!shouldShow || messages.length === 0) {
        formErrors.innerHTML = "";
        formErrors.classList.remove("show");
        return;
      }

      const errorItems = messages.map((message) => `<li>${message}</li>`).join("");
      formErrors.innerHTML = `<ul>${errorItems}</ul>`;
      formErrors.classList.add("show");
    }

    function updateFormState() {
      const nameResult = validateName();
      const emailResult = validateEmail();
      const passwordResult = validatePassword();

      const isNameValid = nameResult.isValid;
      const isEmailValid = emailResult.isValid;
      const isPasswordValid = passwordResult.isValid;

      submitBtn.disabled = !(isNameValid && isEmailValid && isPasswordValid);

      const shouldShowErrors = submitAttempted || touched.name || touched.email || touched.password;
      const messages = [nameResult, emailResult, passwordResult]
        .filter((result) => !result.isValid)
        .map((result) => result.message);
      renderFormErrors(messages, shouldShowErrors);
    }

    function hideToast() {
      successToast.classList.remove("show");
    }

    function showToast(message) {
      toastMessage.textContent = message;
      successToast.classList.add("show");

      if (toastTimer) {
        clearTimeout(toastTimer);
      }
      toastTimer = setTimeout(hideToast, 3000);
    }

    function markTouched(field) {
      touched[field] = true;
      updateFormState();
    }

    nameInput.addEventListener("input", updateFormState);
    emailInput.addEventListener("input", updateFormState);
    passwordInput.addEventListener("input", updateFormState);

    nameInput.addEventListener("blur", () => markTouched("name"));
    emailInput.addEventListener("blur", () => markTouched("email"));
    passwordInput.addEventListener("blur", () => markTouched("password"));

    form.addEventListener("submit", (event) => {
      event.preventDefault();
      submitAttempted = true;
      touched.name = true;
      touched.email = true;
      touched.password = true;
      updateFormState();

      if (!submitBtn.disabled) {
        const enteredName = nameInput.value.trim();
        showToast(`Welcome ${enteredName}! Account created successfully.`);
      }
    });

    closeToastBtn.addEventListener("click", hideToast);

    updateFormState();