/**
 * Page-specific configuration for 2026 Market Predictions webinar
 * This overrides the base config in /js/config.js
 */

window.PAGE_CONFIG = {
  // Infusionsoft settings for this page
  infusionsoft: {
    formXid: '34fe1127dfc3fe8126cd0f0a55a31cbc',
    formName: 'TCFA - Stock Investing Webclass Jan 2026',
    accountId: 'yv932',
    consentFieldName: 'inf_option_BycheckingthisboxIagreetoreceivetextmessagessuchasremindersupdatesandpromotionaloffersfromTheCashFlowAcademyatthemobilenumberprovidedMessageanddataratesmayapplyMessagefrequencyvariesConsentisnotaconditionofpurchaseReplySTOPtounsubscribe',
    consentFieldValue: '4091'
  },
  
  // No WebinarFuel for this webinar - Infusionsoft only
  webinarfuel: null,
  
  // Webinar details
  webinarDate: {
    date: 'Saturday, January 3rd, 2026',
    time: '2:00 PM Eastern',
    timezone: 'America/New_York'
  },
  
  // Redirect URL after successful registration
  redirectUrl: '/2026-predictions/confirmed.html',
  
  // Optional: Custom countdown settings
  countdown: {
    minutes: 14,
    seconds: 59
  }
};
