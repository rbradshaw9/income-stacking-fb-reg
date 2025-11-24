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
    sessionId: '70047',        // Single session ID for all days/times
    widgetId: '80341',         // Widget ID from URL
    widgetVersion: '132190',   // Widget version from URL
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
