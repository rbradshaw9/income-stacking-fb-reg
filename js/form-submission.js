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
    
    if (this.isSubmitting) {
      return;
    }

    console.warn('Starting form submission process...');
    
    try {
      // Extract form data
      const data = this.extractFormData();
      let cid = null;
      let wfResponse = null;
      
      // Submit to Webinar Fuel first to get CID
      this.setSubmittingState(true, 'webinarfuel');
      console.warn('Submitting to Webinar Fuel...');
      try {
        wfResponse = await this.submitToWebinarFuel(data, cid);
        console.warn('WebinarFuel registration successful');
      } catch (error) {
        console.warn('WebinarFuel submission failed:', error);
        throw error;
      }
      
      // Submit to Infusionsoft with the CID
      console.warn('Submitting to Infusionsoft...');
      this.setSubmittingState(true, 'infusionsoft');
      try {
        await this.submitToInfusionsoft(data, localStorage.getItem('_wf_cid'));
        console.warn('Infusionsoft submission successful');
      } catch (error) {
        console.warn('Infusionsoft submission failed:', error);
        throw error;
      }
      
      // Both submissions successful
      console.warn('Both submissions completed successfully');
      
      // Get CID for confirmation page
      const wfCid = localStorage.getItem('_wf_cid');
      
      // Short delay to ensure both submissions are processed
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Redirect to confirmation page
      if (wfCid) {
        window.location.href = `confirmed.html?cid=${wfCid}`;
      } else {
        throw new Error('No WebinarFuel CID available for redirect');
      }
    } catch (error) {
      console.warn('Registration error:', error);
      this.setSubmittingState(false);
      this.showError('There was an error submitting your registration. Please try again.');
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
   * Submit data to Infusionsoft using hidden form (avoids CORS issues)
   */
  async submitToInfusionsoft(data, cid) {
    return new Promise((resolve) => {
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
        ...(data.consent ? {
          inf_option_BycheckingthisboxIagreetoreceivetextmessagessuchasremindersupdatesandpromotionaloffersfromTheCashFlowAcademyatthemobilenumberprovidedMessageanddataratesmayapplyMessagefrequencyvariesConsentisnotaconditionofpurchaseReplySTOPtounsubscribe: '3893'
        } : {}),
        // Only include consent field if checked
        ...trackingParams  // Include all UTM and tracking parameters
      };

      // Create hidden iframe for form target
      const iframeId = 'hidden-submit-frame';
      let iframe = document.getElementById(iframeId);
      if (!iframe) {
        iframe = document.createElement('iframe');
        iframe.id = iframeId;
        iframe.name = iframeId;
        iframe.style.display = 'none';
        document.body.appendChild(iframe);
      }

      // Create hidden form for submission (avoids CORS)
      const form = document.createElement('form');
      form.method = 'POST';
      form.action = `${CONFIG.INFUSIONSOFT.BASE_URL}/app/form/process/${CONFIG.INFUSIONSOFT.FORM_XID}`;
      form.target = iframeId;
      form.style.display = 'none';
      form.className = 'infusion-form';
      form.id = `inf_form_${CONFIG.INFUSIONSOFT.FORM_XID}`;
      form.setAttribute('accept-charset', 'UTF-8');

      // Add all form fields
      Object.entries(infusionsoftData).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          const input = document.createElement('input');
          input.type = 'hidden';
          input.name = key;
          input.value = String(value);
          form.appendChild(input);
        }
      });

      // Add form to page and submit
      document.body.appendChild(form);
      
      // Add form to body and submit in hidden iframe
      document.body.appendChild(form);
      form.submit();
      
      // Handle submission completion
      iframe.onload = () => {
        // Give time for the submission to process before cleanup
        setTimeout(() => {
          try {
            document.body.removeChild(form);
            // Keep iframe for potential reuse
          } catch (e) {
            console.warn('Cleanup error:', e);
          }
          resolve();
        }, 2000);
      };

      console.warn('Infusionsoft submission sent via form post');
    });
  }

  /**
   * Submit data to Webinar Fuel
   */
  async submitToWebinarFuel(data, _cid) {
    // Use session ID determined from scraped webinar date, fallback to Tuesday
    const sessionId = window.webinarSessionId || CONFIG.WEBINAR_FUEL.SESSIONS.TUESDAY;
    const trackingParams = this.urlTracker.getParameters();
    
    console.warn('Using Webinar Fuel session ID:', sessionId, 
                 window.webinarDayOfWeek ? `(${window.webinarDayOfWeek})` : '(fallback)');
    
    const webinarFuelData = {
      version_id: CONFIG.WEBINAR_FUEL.WIDGET.VERSION_ID,
      recaptcha_action: "wf_verify_recaptcha",
      viewer: {
        webinar_session_id: sessionId,
        time_zone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        email: data.email,
        first_name: data.first_name,
        last_name: data.last_name,
        phone: data.consent ? (data.phone || '') : '',
        lead: false,
        registration_source_widget_type: "embed",
        registration_source_widget_name: "Income Stacking Registration",
        consent: data.consent ? 'yes' : 'no',
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

    try {
      console.warn('WebinarFuel request:', {
        url: CONFIG.WEBINAR_FUEL.BASE_URL + CONFIG.WEBINAR_FUEL.ENDPOINTS.REGISTER,
        data: webinarFuelData
      });

      const response = await fetch(CONFIG.WEBINAR_FUEL.BASE_URL + CONFIG.WEBINAR_FUEL.ENDPOINTS.REGISTER, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${CONFIG.WEBINAR_FUEL.API_KEY}`
        },
        body: JSON.stringify(webinarFuelData)
      });

      const responseText = await response.text();
      console.warn('WebinarFuel response:', {
        status: response.status,
        text: responseText
      });

      if (!response.ok) {
        throw new Error(`Webinar Fuel submission failed: ${response.status} - ${responseText}`);
      }

      // Try to parse JSON response
      let result;
      try {
        result = JSON.parse(responseText);
      } catch (e) {
        console.warn('WebinarFuel response not JSON:', e);
        throw new Error('Invalid response from WebinarFuel');
      }
      
      // Store the CID from Webinar Fuel response for the confirmation page
      if (result.cid) {
        localStorage.setItem('_wf_cid', result.cid);
        console.warn('Webinar Fuel CID stored:', result.cid);
        return result;
      } else {
        console.warn('No CID in WebinarFuel response:', result);
        throw new Error('No CID returned from WebinarFuel');
      }
    } catch (error) {
      console.warn('WebinarFuel submission error:', error);
      throw error;
    }
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