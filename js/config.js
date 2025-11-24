// Configuration settings for the registration funnel
// This is the BASE config - page-specific settings override these values

/**
 * Get environment variable or fallback value
 * For production, set these as environment variables in your hosting platform
 */
const getEnvVar = (varName, fallback) => {
  // Check if we're in a build environment with access to process.env
  if (typeof process !== 'undefined' && process?.env && process.env[varName]) {
    return process.env[varName];
  }
  
  // Check for runtime environment variables (some hosts inject these)
  if (typeof window !== 'undefined' && window.ENV && window.ENV[varName]) {
    return window.ENV[varName];
  }
  
  // Development fallback - remove these in production
  console.warn(`Using fallback value for ${varName}. Set environment variable for production.`);
  return fallback;
};

/**
 * Get page-specific config value or fallback to base config
 */
const getPageConfig = (path, fallback) => {
  if (typeof window !== 'undefined' && window.PAGE_CONFIG) {
    const keys = path.split('.');
    let value = window.PAGE_CONFIG;
    for (const key of keys) {
      if (value && typeof value === 'object' && key in value) {
        value = value[key];
      } else {
        return fallback;
      }
    }
    return value;
  }
  return fallback;
};

export const CONFIG = {
  // API Configuration
  WEBINAR_FUEL: {
    BASE_URL: 'https://embed.webby.app',
    get API_KEY() { return getPageConfig('webinarfuel.apiKey', getEnvVar('WEBINAR_FUEL_API_KEY', 'Dp2kG9Vucpyq5t5RVPqvDxfU')); },
    
    // New simplified approach: single session ID for all days
    get SESSION_ID() { return getPageConfig('webinarfuel.sessionId', null); },
    
    // Legacy approach: different sessions per day (for backward compatibility)
    SESSIONS: {
      get TUESDAY() { return getPageConfig('webinarfuel.sessionTuesday', getEnvVar('WEBINAR_FUEL_SESSION_TUESDAY', '66235')); },
      get SATURDAY() { return getPageConfig('webinarfuel.sessionSaturday', getEnvVar('WEBINAR_FUEL_SESSION_SATURDAY', '66238')); }
    },
    WIDGET: {
      ID: parseInt(getEnvVar('WEBINAR_FUEL_WIDGET_ID', '75117')),
      VERSION_ID: parseInt(getEnvVar('WEBINAR_FUEL_WIDGET_VERSION', '126466')),
      get REGISTRATION() { return getPageConfig('webinarfuel.registrationWidget', getEnvVar('WEBINAR_FUEL_REGISTRATION_WIDGET', 'hgtM93jQogXFn9gdLT1dSjUA')); },
      get HIDDEN_DATE() { return getPageConfig('webinarfuel.widgetId', getEnvVar('WEBINAR_FUEL_HIDDEN_DATE_WIDGET', 'KvKUagFa1nobkfcZGaSK3KiP')); },
      get CONFIRMATION() { return getPageConfig('webinarfuel.confirmationWidget', getEnvVar('WEBINAR_FUEL_CONFIRMATION_WIDGET', 'xCo1kQcuJZKwRwTTXcySfXJc')); }
    },
    ENDPOINTS: {
      DATES: '/embed/v2/viewers/dates',
      REGISTER: '/embed/v2/viewers'
    }
  },
  
  INFUSIONSOFT: {
    get ACCOUNT_ID() { return getPageConfig('infusionsoft.accountId', getEnvVar('INFUSIONSOFT_ACCOUNT_ID', 'yv932')); },
    get BASE_URL() { return `https://${this.ACCOUNT_ID}.infusionsoft.com`; },
    get FORM_XID() { return getPageConfig('infusionsoft.formXid', getEnvVar('INFUSIONSOFT_FORM_XID', '2d6fbc78abf8d18ab3268c6cfa02e974')); },
    get FORM_NAME() { return getPageConfig('infusionsoft.formName', 'Income Stacking Web Form submitted - FACEBOOK'); },
    VERSION: '1.70.0.858820',
    get SUCCESS_URL() { return getPageConfig('redirectUrl', 'https://go.thecashflowacademy.com/confirmed-income-stacking-fb'); },
    RETURN_URL: window.location.origin + '/confirmed.html',
    get ENDPOINT() { return `/app/form/process/${this.FORM_XID}`; }
  },
  
  // UI Configuration
  COUNTDOWN: {
    get INITIAL_MINUTES() { return getPageConfig('countdown.minutes', 14); },
    get INITIAL_SECONDS() { return getPageConfig('countdown.seconds', 59); }
  },
  
  // Fallback Configuration
  FALLBACK: {
    WEBINAR_DATE: 'Tue, Sep 23rd 2025 @ 11:00 PM UTC',
    CONFIRMATION_URL: '/confirmed'
  },
  
  // Form Configuration
  FORM: {
    VALIDATION_COLORS: {
      first_name: 'border-green-500',
      last_name: 'border-green-500', 
      email: 'border-green-500'
    }
  }
};