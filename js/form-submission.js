import { CONFIG } from './config.js';

/**
 * Form Submission Handler Class
 * Handles form submission to Infusionsoft and Webinar Fuel APIs
 */
export class FormSubmissionHandler {
  constructor(formId) {
    this.form = document.getElementById(formId);
    this.isSubmitting = false;
    
    if (!this.form) {
      throw new Error(`Form with id '${formId}' not found`);
    }
  }

  /**
   * Initialize form submission handling
   */
  initialize() {
    this.form.addEventListener('submit', (e) => {
      this.handleSubmit(e);
    });
  }

  /**
   * Handle form submission
   */
  async handleSubmit(event) {
    event.preventDefault();
    
    if (this.isSubmitting) {
      return;
    }

    try {
      this.setSubmittingState(true);
      
      const formData = new FormData(this.form);
      const data = Object.fromEntries(formData.entries());
      
      // Validate form data
      if (!this.validateFormData(data)) {
        throw new Error('Please fill in all required fields correctly');
      }

      // Generate unique customer ID
      const cid = this.generateCID();
      
      // Submit to both services
      await Promise.all([
        this.submitToInfusionsoft(data, cid),
        this.submitToWebinarFuel(data, cid)
      ]);
      
      // Redirect to confirmation page
      this.redirectToConfirmation(cid);
      
    } catch (error) {
      console.error('Registration error:', error);
      this.showError(error.message || 'Registration failed. Please try again.');
    } finally {
      this.setSubmittingState(false);
    }
  }

  /**
   * Validate form data before submission
   */
  validateFormData(data) {
    const required = ['first_name', 'last_name', 'email'];
    
    for (const field of required) {
      if (!data[field] || !data[field].trim()) {
        return false;
      }
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      return false;
    }

    return true;
  }

  /**
   * Generate unique customer ID
   */
  generateCID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }

  /**
   * Submit data to Infusionsoft
   */
  async submitToInfusionsoft(data, cid) {
    const infusionsoftData = {
      inf_form_xid: CONFIG.INFUSIONSOFT.FORM_XID,
      inf_form_name: CONFIG.INFUSIONSOFT.FORM_NAME,
      infusionsoft_version: CONFIG.INFUSIONSOFT.VERSION,
      inf_field_FirstName: data.first_name,
      inf_field_LastName: data.last_name,
      inf_field_Email: data.email,
      inf_field_Phone1: data.phone || '',
      inf_field_Custom_CID: cid
    };

    const response = await fetch(CONFIG.INFUSIONSOFT.BASE_URL + CONFIG.INFUSIONSOFT.ENDPOINT, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/x-www-form-urlencoded' 
      },
      body: new URLSearchParams(infusionsoftData)
    });

    if (!response.ok) {
      throw new Error(`Infusionsoft submission failed: ${response.status}`);
    }

    return response;
  }

  /**
   * Submit data to Webinar Fuel
   */
  async submitToWebinarFuel(data, cid) {
    const webinarFuelData = {
      webinar_id: CONFIG.WEBINAR_FUEL.WEBINAR_ID,
      name: `${data.first_name} ${data.last_name}`,
      email: data.email,
      phone: data.phone || '',
      cid: cid
    };

    const response = await fetch(CONFIG.WEBINAR_FUEL.BASE_URL + CONFIG.WEBINAR_FUEL.ENDPOINTS.REGISTER, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json' 
      },
      body: JSON.stringify(webinarFuelData)
    });

    if (!response.ok) {
      throw new Error(`Webinar Fuel submission failed: ${response.status}`);
    }

    return response;
  }

  /**
   * Set form submitting state
   */
  setSubmittingState(isSubmitting) {
    this.isSubmitting = isSubmitting;
    const submitButton = this.form.querySelector('button[type="submit"]');
    
    if (submitButton) {
      if (isSubmitting) {
        submitButton.disabled = true;
        submitButton.innerHTML = `
          <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Submitting...
        `;
      } else {
        submitButton.disabled = false;
        submitButton.innerHTML = 'REGISTER NOW - IT\'S FREE!';
      }
    }
  }

  /**
   * Show error message
   */
  showError(message) {
    // Remove any existing error messages
    const existingError = this.form.querySelector('.submission-error');
    if (existingError) {
      existingError.remove();
    }

    // Create error message element
    const errorDiv = document.createElement('div');
    errorDiv.className = 'submission-error bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4';
    errorDiv.innerHTML = `
      <strong class="font-bold">Error:</strong>
      <span class="block sm:inline"> ${message}</span>
    `;

    // Insert error message at the top of the form
    this.form.insertBefore(errorDiv, this.form.firstChild);

    // Scroll to error message
    errorDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  /**
   * Redirect to confirmation page
   */
  redirectToConfirmation(cid) {
    const confirmationUrl = `${CONFIG.FALLBACK.CONFIRMATION_URL}?cid=${cid}`;
    window.location.href = confirmationUrl;
  }
}