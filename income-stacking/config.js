/**
 * Page-specific configuration for Income Stacking webinar
 * This overrides the base config in /js/config.js
 */

window.PAGE_CONFIG = {
  // Infusionsoft settings for this page
  infusionsoft: {
    formXid: '2d6fbc78abf8d18ab3268c6cfa02e974',
    formName: 'Income Stacking Web Form submitted - FACEBOOK',
    accountId: 'yv932'
  },
  
  // WebinarFuel settings for this webinar
  webinarfuel: {
    sessionTuesday: 66235,
    sessionSaturday: 66238,
    widgetId: 'KvKUagFa1nobkfcZGaSK3KiP',
    registrationWidget: 'hgtM93jQogXFn9gdLT1dSjUA',
    confirmationWidget: 'xCo1kQcuJZKwRwTTXcySfXJc',
    apiKey: 'Dp2kG9Vucpyq5t5RVPqvDxfU'
  },
  
  // Redirect URL after successful registration
  redirectUrl: 'https://go.thecashflowacademy.com/confirmed-income-stacking-fb',
  
  // Optional: Custom countdown settings
  countdown: {
    minutes: 14,
    seconds: 59
  }
};

console.log('[Page Config] Income Stacking configuration loaded');
