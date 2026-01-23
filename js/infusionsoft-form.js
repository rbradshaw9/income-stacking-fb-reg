import { CONFIG } from './config.js';
import { URLParameterTracker } from './url-tracker.js';

/**
 * Infusionsoft-Only Form Submission Handler
 * For webinars without WebinarFuel integration
 */
export class InfusionsoftFormHandler {
  constructor(formId) {
    this.form = document.getElementById(formId);
    this.isSubmitting = false;
    this.hasSubmitted = false;
    this.submitButton = null;
    this.urlTracker = new URLParameterTracker();
    
    if (!this.form) {
      throw new Error(`Form with id '${formId}' not found`);
    }
    
    // Store current parameters and load any previously stored ones
    this.urlTracker.storeParameters();
    this.urlTracker.loadStoredParameters();
    console.log('Form handler initialized with tracking params:', this.urlTracker.getParameters());
    
    this.submitButton = this.form.querySelector('button[type="submit"]');
  }

  initialize() {
    // Add submit handler with explicit event prevention
    this.form.addEventListener('submit', (e) => {
      e.preventDefault();
      e.stopPropagation(); // Prevent any other handlers from interfering
      this.handleSubmit(e);
    }, true); // Use capture phase to ensure we catch it first
    
    console.log('Infusionsoft form handler initialized for form:', this.form.id);
  }

  async handleSubmit(event) {
    // Event already prevented in initialize(), but double-check
    if (event && event.preventDefault) {
      event.preventDefault();
    }
    
    if (this.isSubmitting || this.hasSubmitted) {
      console.warn('Form submission blocked: already submitting or previously submitted');
      return;
    }

    console.warn('Starting Infusionsoft-only form submission...');
    
    try {
      const data = this.extractFormData();
      console.warn('Form data extracted:', {
        ...data,
        email: data.email ? '***@***.***' : undefined
      });
      
      this.setSubmittingState(true);
      
      await this.submitToInfusionsoft(data);
      console.warn('Infusionsoft submission successful');
      
      this.disableForm();
      this.hasSubmitted = true;
      
      // Increased delay before redirect to ensure Infusionsoft fully processes the submission
      // This is critical for proper tracking data capture
      setTimeout(() => {
        const redirectUrl = (window.PAGE_CONFIG && window.PAGE_CONFIG.redirectUrl) 
          ? window.PAGE_CONFIG.redirectUrl 
          : 'confirmed.html';
        console.warn('Redirecting to:', redirectUrl);
        window.location.href = redirectUrl;
      }, 2000); // Increased from 1500ms to 2000ms
      
    } catch (error) {
      console.warn('Registration error:', error);
      this.setSubmittingState(false);
      this.showError('There was an error submitting your registration. Please try again.');
    }
  }

  extractFormData() {
    const formData = new FormData(this.form);
    const consent = formData.get('sms_consent') !== null;
    const phone = formData.get('phone')?.trim() || '';
    
    console.warn('Form data extraction:', {
      consent: consent,
      phone: phone ? 'PROVIDED' : 'EMPTY',
      phoneLength: phone.length
    });
    
    return {
      first_name: formData.get('first_name')?.trim(),
      last_name: formData.get('last_name')?.trim(),
      email: formData.get('email')?.trim(),
      phone: phone,
      consent: consent
    };
  }

  async submitToInfusionsoft(data) {
    return new Promise((resolve) => {
      const trackingParams = this.urlTracker.getInfusionsoftParameters();
      
      console.log('Preparing Infusionsoft submission with tracking params:', {
        utm_source: trackingParams.inf_field_UTMSource,
        utm_campaign: trackingParams.inf_field_UTMCampaign,
        fbclid: trackingParams.inf_field_FBCLID,
        referrer: trackingParams.inf_field_Referrer ? 'present' : 'missing'
      });
      
      const infusionsoftData = {
        inf_form_xid: CONFIG.INFUSIONSOFT.FORM_XID,
        inf_form_name: CONFIG.INFUSIONSOFT.FORM_NAME,
        infusionsoft_version: CONFIG.INFUSIONSOFT.VERSION,
        inf_field_FirstName: data.first_name,
        inf_field_LastName: data.last_name,
        inf_field_Email: data.email,
        inf_field_Phone1: data.phone || '',
        ...trackingParams
      };
      
      if (data.consent && CONFIG.INFUSIONSOFT.CONSENT_FIELD_NAME) {
        infusionsoftData[CONFIG.INFUSIONSOFT.CONSENT_FIELD_NAME] = CONFIG.INFUSIONSOFT.CONSENT_FIELD_VALUE || 'yes';
        console.warn('Adding consent field:', CONFIG.INFUSIONSOFT.CONSENT_FIELD_NAME, '=', CONFIG.INFUSIONSOFT.CONSENT_FIELD_VALUE);
      }

      const iframeId = 'hidden-submit-frame';
      let iframe = document.getElementById(iframeId);
      if (!iframe) {
        iframe = document.createElement('iframe');
        iframe.id = iframeId;
        iframe.name = iframeId;
        iframe.style.display = 'none';
        iframe.sandbox = 'allow-forms allow-scripts allow-same-origin';
        document.body.appendChild(iframe);
      }

      const form = document.createElement('form');
      form.method = 'POST';
      form.action = `${CONFIG.INFUSIONSOFT.BASE_URL}/app/form/process/${CONFIG.INFUSIONSOFT.FORM_XID}`;
      form.target = iframeId;
      form.style.display = 'none';
      form.className = 'infusion-form';
      form.id = `inf_form_${CONFIG.INFUSIONSOFT.FORM_XID}`;
      form.setAttribute('accept-charset', 'UTF-8');

      // Add all form fields as hidden inputs
      // Important: Send ALL fields including empty strings for proper Infusionsoft tracking
      Object.entries(infusionsoftData).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          const input = document.createElement('input');
          input.type = 'hidden';
          input.name = key;
          input.value = String(value);
          form.appendChild(input);
          
          // Log tracking fields for debugging
          if (key.startsWith('inf_field_UTM') || key.startsWith('inf_field_FB') || key.startsWith('inf_field_Referrer')) {
            console.log(`Adding tracking field: ${key} = ${value || '(empty)'}`);
          }
        }
      });

      document.body.appendChild(form);
      
      console.warn('Submitting Infusionsoft form with data:', {
        ...infusionsoftData,
        email: '***@***.***'
      });

      // Submit form to Infusionsoft
      console.warn('Submitting form to Infusionsoft...');
      form.submit();
      
      let resolved = false;
      
      // Handle iframe load event (indicates Infusionsoft received the submission)
      iframe.onload = () => {
        if (!resolved) {
          resolved = true;
          console.warn('Infusionsoft iframe loaded - submission received');
          setTimeout(() => {
            try {
              document.body.removeChild(form);
            } catch (e) {
              console.warn('Form cleanup error:', e);
            }
            console.warn('Infusionsoft submission completed successfully');
            resolve();
          }, 1500); // Increased delay to ensure Infusionsoft processes the submission
        }
      };
      
      // Timeout fallback - increased to 5 seconds to give Infusionsoft more time
      setTimeout(() => {
        if (!resolved) {
          resolved = true;
          try {
            document.body.removeChild(form);
          } catch (e) {
            console.warn('Form cleanup error:', e);
          }
          console.warn('Infusionsoft submission timeout - proceeding anyway (this is usually OK)');
          resolve();
        }
      }, 5000); // Increased from 3000ms to 5000ms
    });
  }

  setSubmittingState(isSubmitting) {
    this.isSubmitting = isSubmitting;
    
    if (this.submitButton) {
      if (isSubmitting) {
        this.submitButton.disabled = true;
        this.submitButton.innerHTML = `
          <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Submitting...
        `;
      } else {
        this.submitButton.disabled = false;
        this.submitButton.innerHTML = '🚀 CLAIM MY FREE SEAT NOW';
      }
    }
  }

  disableForm() {
    const inputs = this.form.querySelectorAll('input, button');
    inputs.forEach(input => {
      input.disabled = true;
    });
    
    if (this.submitButton) {
      this.submitButton.innerHTML = '✅ Registration Complete - Redirecting...';
      this.submitButton.className = this.submitButton.className.replace(/bg-gradient-to-r from-red-600 to-red-700/, 'bg-green-600');
    }
  }

  showError(message) {
    const existingError = this.form.querySelector('.submission-error');
    if (existingError) {
      existingError.remove();
    }

    const errorDiv = document.createElement('div');
    errorDiv.className = 'submission-error bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4';
    errorDiv.innerHTML = `
      <strong class="font-bold">Error:</strong>
      <span class="block sm:inline"> ${message}</span>
    `;

    this.form.insertBefore(errorDiv, this.form.firstChild);
    errorDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
}
