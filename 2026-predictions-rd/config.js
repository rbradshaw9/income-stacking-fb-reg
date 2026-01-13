/**
 * Page-specific configuration for 2026 Market Predictions webinar (Rich Dad)
 * This overrides the base config in /js/config.js
 */

window.PAGE_CONFIG = {
  // Infusionsoft settings for this page
  infusionsoft: {
    formXid: 'b1bb46a7155595dff8234bd4fe4039ba',
    formName: 'RD - Stock Investing Webclass Jan 2026',
    accountId: 'yv932',
    consentFieldName: 'inf_option_BycheckingthisboxIagreetoreceivetextmessagessuchasremindersupdatesandpromotionaloffersfromTheCashFlowAcademyatthemobilenumberprovidedMessageanddataratesmayapplyMessagefrequencyvariesConsentisnotaconditionofpurchaseReplySTOPtounsubscribe',
    consentFieldValue: '4149'
  },
  
  // No WebinarFuel for this webinar - Infusionsoft only
  webinarfuel: null,
  
  // Webinar details
  webinarDate: {
    date: 'Friday, January 24th, 2026',
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
