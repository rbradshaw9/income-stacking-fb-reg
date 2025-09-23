// Configuration settings for the Income Stacking registration funnel

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

export const CONFIG = {
  // API Configuration
  WEBINAR_FUEL: {
    BASE_URL: 'https://embed.webby.app',
    API_KEY: getEnvVar('WEBINAR_FUEL_API_KEY', 'Dp2kG9Vucpyq5t5RVPqvDxfU'),
    SESSIONS: {
      TUESDAY: parseInt(getEnvVar('WEBINAR_FUEL_SESSION_TUESDAY', '66235')),
      SATURDAY: parseInt(getEnvVar('WEBINAR_FUEL_SESSION_SATURDAY', '66238'))
    },
    WIDGET: {
      ID: parseInt(getEnvVar('WEBINAR_FUEL_WIDGET_ID', '75117')),
      VERSION_ID: parseInt(getEnvVar('WEBINAR_FUEL_WIDGET_VERSION', '126466')),
      REGISTRATION: getEnvVar('WEBINAR_FUEL_REGISTRATION_WIDGET', 'hgtM93jQogXFn9gdLT1dSjUA'),
      HIDDEN_DATE: getEnvVar('WEBINAR_FUEL_HIDDEN_DATE_WIDGET', 'KvKUagFa1nobkfcZGaSK3KiP'),
      CONFIRMATION: getEnvVar('WEBINAR_FUEL_CONFIRMATION_WIDGET', 'xCo1kQcuJZKwRwTTXcySfXJc')
    },
    ENDPOINTS: {
      DATES: '/embed/v2/viewers/dates',
      REGISTER: '/embed/v2/viewers'
    }
  },
  
  INFUSIONSOFT: {
    ACCOUNT_ID: getEnvVar('INFUSIONSOFT_ACCOUNT_ID', 'yv932'),
    BASE_URL: `https://${getEnvVar('INFUSIONSOFT_ACCOUNT_ID', 'yv932')}.infusionsoft.com`,
    FORM_XID: getEnvVar('INFUSIONSOFT_FORM_XID', '2d6fbc78abf8d18ab3268c6cfa02e974'),
    FORM_NAME: 'Income Stacking Web Form submitted - FACEBOOK',
    VERSION: '1.70.0.858820',
    SUCCESS_URL: window.location.origin + '/confirmed.html',
    ENDPOINT: `/app/form/process/${getEnvVar('INFUSIONSOFT_FORM_XID', '2d6fbc78abf8d18ab3268c6cfa02e974')}`
  },
  
  // UI Configuration
  COUNTDOWN: {
    INITIAL_MINUTES: 14,
    INITIAL_SECONDS: 59
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
      last_name: 'border-blue-500', 
      email: 'border-orange-500'
    }
  }
};