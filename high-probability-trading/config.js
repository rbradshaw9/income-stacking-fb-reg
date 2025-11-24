/**
 * Page-specific configuration for High-Probability Trading webinar
 * This overrides the base config in /js/config.js
 */

window.PAGE_CONFIG = {
  // Infusionsoft settings for this page
  infusionsoft: {
    formXid: '7d3ead8dd4d0c7908277caa2ead4409f',
    formName: 'WF - The 90% Win Rate Secret - Evergreen Web Form submitted - GHL',
    accountId: 'yv932'
  },
  
  // WebinarFuel settings for this webinar
  webinarfuel: {
    sessionSaturday: 70047,  // Saturday only sessions
    sessionTuesday: 70047,   // Use same session for all days
    widgetId: 'Mr18Vw5GKr31qNMPbNKJHGmo',
    registrationWidget: 'Mr18Vw5GKr31qNMPbNKJHGmo',
    apiKey: 'Dp2kG9Vucpyq5t5RVPqvDxfU',
    source: 'GHL - Reg Page'
  },
  
  // Redirect URL after successful registration
  redirectUrl: 'https://go.thecashflowacademy.com/hpp-success-wf-eg',
  
  // Optional: Custom countdown settings
  countdown: {
    minutes: 14,
    seconds: 59
  }
};

console.log('[Page Config] High-Probability Trading configuration loaded');
