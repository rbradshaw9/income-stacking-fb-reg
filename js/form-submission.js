import { CONFIG } from './config.js';
import { URLParameterTracker } from './url-tracker.js';

/**
 * Form Submission Handler Class
 * Handles form submission to Infusionsoft and Webinar Fuel APIs
 */
export class FormSubmissionHandler {
  constructor(formId) {
    this.form = document.getElementById(formId);
    this.isSubmitting = false;
    this.hasSubmitted = false; // Prevent multiple successful submissions
    this.submitButton = null;
    this.urlTracker = new URLParameterTracker();
    
    if (!this.form) {
      throw new Error(`Form with id '${formId}' not found`);
    }
    
    // Store tracking parameters for persistence
    this.urlTracker.storeParameters();
    
    // Cache submit button reference
    this.submitButton = this.form.querySelector('button[type="submit"]');
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
    
    // Prevent duplicate submissions
    if (this.isSubmitting || this.hasSubmitted) {
      console.warn('Submission already in progress or completed');
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
      
      // Submit to services sequentially for better reliability
      console.warn('Starting form submission process...');
      
      // Submit to Infusionsoft first (more reliable)
      this.setSubmittingState(true, 'infusionsoft');
      console.warn('Submitting to Infusionsoft...');
      await this.submitToInfusionsoft(data, cid);
      
      // Small delay to prevent rate limiting
      await this.delay(500);
      
      // Submit to Webinar Fuel second
      this.setSubmittingState(true, 'webinarfuel');
      console.warn('Submitting to Webinar Fuel...');
      await this.submitToWebinarFuel(data, cid);
      
      // Mark as successfully submitted
      this.hasSubmitted = true;
      
      console.warn('Both submissions completed successfully');
      
      // Redirect to confirmation page
      this.redirectToConfirmation(cid);
      
    } catch (error) {
      console.error('Registration error:', error);
      this.showError(error.message || 'Registration failed. Please try again.');
      
      // Reset submission state on error to allow retry
      this.hasSubmitted = false;
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
   * Utility method to add delays between API calls
   */
  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Submit data to Infusionsoft
   */
  async submitToInfusionsoft(data, cid) {
    const trackingParams = this.urlTracker.getInfusionsoftParameters();
    
    const infusionsoftData = {
      inf_form_xid: CONFIG.INFUSIONSOFT.FORM_XID,
      inf_form_name: CONFIG.INFUSIONSOFT.FORM_NAME,
      infusionsoft_version: CONFIG.INFUSIONSOFT.VERSION,
      inf_field_FirstName: data.first_name,
      inf_field_LastName: data.last_name,
      inf_field_Email: data.email,
      inf_field_Phone1: data.phone || '',
      inf_field_Custom_CID: cid,
      ...trackingParams  // Include all UTM and tracking parameters
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
  async submitToWebinarFuel(data, _cid) {
    // Default to Tuesday session, but this could be made dynamic
    const sessionId = CONFIG.WEBINAR_FUEL.SESSIONS.TUESDAY;
    const trackingParams = this.urlTracker.getParameters();
    
    const webinarFuelData = {
      version_id: CONFIG.WEBINAR_FUEL.WIDGET.VERSION_ID,
      recaptcha_action: "wf_verify_recaptcha",
      viewer: {
        webinar_session_id: sessionId,
        time_zone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        email: data.email,
        first_name: data.first_name,
        last_name: data.last_name,
        phone: data.phone || '',
        lead: false,
        registration_source_widget_type: "embed",
        registration_source_widget_name: "Income Stacking Registration",
        widget_id: CONFIG.WEBINAR_FUEL.WIDGET.ID,
        widget_version_id: CONFIG.WEBINAR_FUEL.WIDGET.VERSION_ID,
        source: trackingParams.utm_source || "Direct",
        utm_medium: trackingParams.utm_medium || '',
        utm_source: trackingParams.utm_source || '',
        utm_campaign: trackingParams.utm_campaign || '',
        utm_term: trackingParams.utm_term || '',
        utm_content: trackingParams.utm_content || ''
      }
    };

    const response = await fetch(CONFIG.WEBINAR_FUEL.BASE_URL + CONFIG.WEBINAR_FUEL.ENDPOINTS.REGISTER, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${CONFIG.WEBINAR_FUEL.API_KEY}`
      },
      body: JSON.stringify(webinarFuelData)
    });

    if (!response.ok) {
      throw new Error(`Webinar Fuel submission failed: ${response.status}`);
    }

    // Parse the response to get the CID
    const result = await response.json();
    
    // Store the CID from Webinar Fuel response for the confirmation page
    if (result.cid) {
      localStorage.setItem('_wf_cid', result.cid);
      console.warn('Webinar Fuel CID stored:', result.cid);
    }

    return response;
  }

  /**
   * Set form submitting state with detailed progress
   */
  setSubmittingState(isSubmitting, step = '') {
    this.isSubmitting = isSubmitting;
    
    if (this.submitButton) {
      if (isSubmitting) {
        this.submitButton.disabled = true;
        
        let buttonText = 'Submitting...';
        if (step === 'infusionsoft') {
          buttonText = 'Saving to CRM...';
        } else if (step === 'webinarfuel') {
          buttonText = 'Registering for Webinar...';
        }
        
        this.submitButton.innerHTML = `
          <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          ${buttonText}
        `;
      } else {
        this.submitButton.disabled = false;
        this.submitButton.innerHTML = 'REGISTER NOW - IT\'S FREE!';
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
    const confirmationUrl = `/confirmed.html?cid=${cid}`;
    window.location.href = confirmationUrl;
  }
}