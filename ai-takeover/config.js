/**
 * Page-specific configuration for AI Takeover webinar
 * This overrides the base config in /js/config.js
 */

window.PAGE_CONFIG = {
  // Infusionsoft settings for this page
  infusionsoft: {
    formXid: 'a142710cfc173cf3f8d827811e068178',
    formName: 'Investing in the Age of AI Web Form submitted - GHLEvergreen Form',
    accountId: 'yv932',
    consentFieldName: 'inf_option_BycheckingthisboxIagreetoreceivetextmessagessuchasremindersupdatesandpromotionaloffersfromTheCashFlowAcademyatthemobilenumberprovidedMessageanddataratesmayapplyMessagefrequencyvariesConsentisnotaconditionofpurchaseReplySTOPtounsubscribe',
    consentFieldValue: '4011'
  },
  
  // WebinarFuel settings for this webinar
  webinarfuel: {
    sessionId: '69512',        // Single session ID for all days/times
    widgetId: '79631',         // Widget ID from WebinarFuel
    widgetVersion: '131404',   // Widget version from WebinarFuel
    registrationWidget: '3T4iRu6P14R1reHjZCFL86Z7',
    apiKey: 'Dp2kG9Vucpyq5t5RVPqvDxfU',
    source: 'GHL - Registration Page'
  },
  
  // Redirect URL after successful registration
  redirectUrl: 'https://go.thecashflowacademy.com/ai-tcfa-success-wf-ghl',
  
  // Optional: Custom countdown settings
  countdown: {
    minutes: 14,
    seconds: 59
  }
};
