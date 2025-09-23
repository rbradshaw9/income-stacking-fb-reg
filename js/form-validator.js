import { CONFIG } from './config.js';

/**
 * Form Validator Class
 * Handles real-time form validation and visual feedback
 */
export class FormValidator {
  constructor(formId) {
    this.form = document.getElementById(formId);
    this.validationColors = CONFIG.FORM.VALIDATION_COLORS;
    
    if (!this.form) {
      throw new Error(`Form with id '${formId}' not found`);
    }
  }

  /**
   * Initialize form validation
   */
  initialize() {
    const inputs = this.form.querySelectorAll('input[required]');
    
    inputs.forEach(input => {
      this.setupInputValidation(input);
    });

    // Setup email validation
    const emailInput = this.form.querySelector('input[type="email"]');
    if (emailInput) {
      this.setupEmailValidation(emailInput);
    }

    // Setup phone validation
    const phoneInput = this.form.querySelector('input[type="tel"]');
    if (phoneInput) {
      this.setupPhoneValidation(phoneInput);
    }
  }

  /**
   * Setup validation for an individual input
   */
  setupInputValidation(input) {
    input.addEventListener('input', () => {
      this.validateInput(input);
    });

    input.addEventListener('blur', () => {
      this.validateInput(input, true);
    });
  }

  /**
   * Validate an individual input
   */
  validateInput(input, showErrors = false) {
    const value = input.value.trim();
    const isValid = this.isInputValid(input, value);
    
    this.updateInputStyles(input, isValid, showErrors);
    
    return isValid;
  }

  /**
   * Check if input value is valid
   */
  isInputValid(input, value) {
    // Check required fields
    if (input.hasAttribute('required') && !value) {
      return false;
    }

    // Email validation
    if (input.type === 'email' && value) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(value);
    }

    // Phone validation (basic)
    if (input.type === 'tel' && value) {
      const phoneRegex = /^[+]?[\d\s\-().]{10,}$/;
      return phoneRegex.test(value);
    }

    // Name validation (basic)
    if (input.name === 'first_name' || input.name === 'last_name') {
      return value.length >= 2;
    }

    return true;
  }

  /**
   * Update input styles based on validation
   */
  updateInputStyles(input, isValid, showErrors) {
    // Remove all validation classes
    input.classList.remove('border-gray-300', 'border-red-500');
    Object.values(this.validationColors).forEach(color => {
      input.classList.remove(color);
    });

    if (input.value.trim()) {
      if (isValid) {
        // Apply success color based on field type
        const successColor = this.validationColors[input.name];
        if (successColor) {
          input.classList.add(successColor);
        }
      } else if (showErrors) {
        input.classList.add('border-red-500');
      } else {
        input.classList.add('border-gray-300');
      }
    } else {
      input.classList.add('border-gray-300');
    }
  }

  /**
   * Setup email-specific validation
   */
  setupEmailValidation(emailInput) {
    emailInput.addEventListener('blur', () => {
      const value = emailInput.value.trim();
      if (value && !this.isInputValid(emailInput, value)) {
        this.showFieldError(emailInput, 'Please enter a valid email address');
      } else {
        this.clearFieldError(emailInput);
      }
    });
  }

  /**
   * Setup phone-specific validation
   */
  setupPhoneValidation(phoneInput) {
    phoneInput.addEventListener('blur', () => {
      const value = phoneInput.value.trim();
      if (value && !this.isInputValid(phoneInput, value)) {
        this.showFieldError(phoneInput, 'Please enter a valid phone number');
      } else {
        this.clearFieldError(phoneInput);
      }
    });
  }

  /**
   * Show error message for a field
   */
  showFieldError(input, message) {
    this.clearFieldError(input);
    
    const errorDiv = document.createElement('div');
    errorDiv.className = 'text-red-500 text-sm mt-1 field-error';
    errorDiv.textContent = message;
    
    input.parentNode.insertBefore(errorDiv, input.nextSibling);
  }

  /**
   * Clear error message for a field
   */
  clearFieldError(input) {
    const errorDiv = input.parentNode.querySelector('.field-error');
    if (errorDiv) {
      errorDiv.remove();
    }
  }

  /**
   * Validate entire form
   */
  validateForm() {
    const inputs = this.form.querySelectorAll('input[required]');
    let isValid = true;

    inputs.forEach(input => {
      if (!this.validateInput(input, true)) {
        isValid = false;
      }
    });

    return isValid;
  }
}