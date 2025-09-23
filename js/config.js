// Configuration settings for the Income Stacking registration funnel
export const CONFIG = {
  // API Configuration
  WEBINAR_FUEL: {
    BASE_URL: 'https://api.webinarfuel.com',
    WEBINAR_ID: 1,
    ENDPOINTS: {
      DATES: '/webinars/dates',
      REGISTER: '/register'
    }
  },
  
  INFUSIONSOFT: {
    BASE_URL: 'https://ck123.infusionsoft.com',
    FORM_XID: '123456789',
    FORM_NAME: 'Webinar Registration',
    VERSION: '1.70.0.77',
    ENDPOINT: '/app/form/process/123456789'
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