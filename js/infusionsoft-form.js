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
    
    this.urlTracker.storeParameters();
    this.submitButton = this.form.querySelector('button[type="submit"]');
  }

  initialize() {
    this.form.addEventListener('submit', (e) => {
      this.handleSubmit(e);
    });
  }

  async handleSubmit(event) {
    event.preventDefault();
    
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
      
      setTimeout(() => {
        const redirectUrl = (window.PAGE_CONFIG && window.PAGE_CONFIG.redirectUrl) 
          ? window.PAGE_CONFIG.redirectUrl 
          : 'confirmed.html';
        window.location.href = redirectUrl;
      }, 1500);
      
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

      Object.entries(infusionsoftData).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          const input = document.createElement('input');
          input.type = 'hidden';
          input.name = key;
          input.value = String(value);
          form.appendChild(input);
        }
      });

      document.body.appendChild(form);
      
      console.warn('Submitting Infusionsoft form with data:', {
        ...infusionsoftData,
        email: '***@***.***'
      });

      form.submit();
      
      let resolved = false;
      
      iframe.onload = () => {
        if (!resolved) {
          resolved = true;
          setTimeout(() => {
            try {
              document.body.removeChild(form);
            } catch (e) {
              console.warn('Cleanup error:', e);
            }
            console.warn('Infusionsoft submission completed');
            resolve();
          }, 1000);
        }
      };
      
      setTimeout(() => {
        if (!resolved) {
          resolved = true;
          try {
            document.body.removeChild(form);
          } catch (e) {
            console.warn('Cleanup error:', e);
          }
          console.warn('Infusionsoft submission timeout - proceeding anyway');
          resolve();
        }
      }, 3000);
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
