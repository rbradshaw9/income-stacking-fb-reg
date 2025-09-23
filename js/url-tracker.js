/**
 * URL Parameter Tracker Class
 * Captures and manages UTM parameters and fbclid for tracking
 */
export class URLParameterTracker {
  constructor() {
    this.params = this.captureParameters();
  }

  /**
   * Capture all relevant tracking parameters from URL
   */
  captureParameters() {
    const urlParams = new URLSearchParams(window.location.search);
    
    return {
      // UTM Parameters
      utm_source: urlParams.get('utm_source') || '',
      utm_medium: urlParams.get('utm_medium') || '',
      utm_campaign: urlParams.get('utm_campaign') || '',
      utm_term: urlParams.get('utm_term') || '',
      utm_content: urlParams.get('utm_content') || '',
      
      // Facebook Click ID
      fbclid: urlParams.get('fbclid') || '',
      
      // Google Click ID
      gclid: urlParams.get('gclid') || '',
      
      // Referrer information
      referrer: document.referrer || '',
      
      // Landing page
      landing_page: window.location.href
    };
  }

  /**
   * Get all captured parameters
   */
  getParameters() {
    return this.params;
  }

  /**
   * Get specific parameter
   */
  getParameter(key) {
    return this.params[key] || '';
  }

  /**
   * Get parameters formatted for Infusionsoft
   */
  getInfusionsoftParameters() {
    return {
      inf_field_UTMSource: this.params.utm_source,
      inf_field_UTMMedium: this.params.utm_medium,
      inf_field_UTMCampaign: this.params.utm_campaign,
      inf_field_UTMTerm: this.params.utm_term,
      inf_field_UTMContent: this.params.utm_content,
      inf_field_FBCLID: this.params.fbclid,
      inf_field_GCLID: this.params.gclid,
      inf_field_Referrer: this.params.referrer,
      inf_field_LandingPage: this.params.landing_page
    };
  }

  /**
   * Store parameters in localStorage for persistence
   */
  storeParameters() {
    localStorage.setItem('trackingParams', JSON.stringify(this.params));
  }

  /**
   * Load parameters from localStorage
   */
  loadStoredParameters() {
    const stored = localStorage.getItem('trackingParams');
    if (stored) {
      try {
        const parsedParams = JSON.parse(stored);
        // Only use stored params if current URL doesn't have them
        Object.keys(parsedParams).forEach(key => {
          if (!this.params[key]) {
            this.params[key] = parsedParams[key];
          }
        });
      } catch (error) {
        console.warn('Failed to load stored tracking parameters:', error);
      }
    }
  }
}