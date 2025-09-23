import { CONFIG } from './config.js';
import { CountdownTimer } from './countdown.js';
import { WebinarDateFetcher } from './webinar-date.js';
import { FormValidator } from './form-validator.js';
import { FormSubmissionHandler } from './form-submission.js';

/**
 * Main application class for the Income Stacking registration funnel
 */
class IncomeStackingApp {
  constructor() {
    this.countdownTimer = null;
    this.webinarDateFetcher = null;
    this.formValidator = null;
    this.formSubmissionHandler = null;
  }

  /**
   * Initialize all application components
   */
  init() {
    try {
      // Initialize countdown timer
      this.countdownTimer = new CountdownTimer('countdown', {
        minutes: CONFIG.COUNTDOWN.INITIAL_MINUTES,
        seconds: CONFIG.COUNTDOWN.INITIAL_SECONDS
      });
      this.countdownTimer.start();

      // Initialize webinar date fetcher
      this.webinarDateFetcher = new WebinarDateFetcher('webinar-date');
      this.webinarDateFetcher.fetchAndDisplay();

      // Initialize form validation
      this.formValidator = new FormValidator('registration-form-element');
      this.formValidator.initialize();

      // Initialize form submission
      this.formSubmissionHandler = new FormSubmissionHandler('registration-form-element');
      this.formSubmissionHandler.initialize();

      // Successfully initialized
    } catch (error) {
      console.error('❌ Failed to initialize app:', error);
    }
  }

  /**
   * Cleanup resources when needed
   */
  destroy() {
    if (this.countdownTimer) {
      this.countdownTimer.stop();
    }
  }
}

// Initialize the application when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  const app = new IncomeStackingApp();
  app.init();
  
  // Make app available globally for debugging
  window.IncomeStackingApp = app;
});

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
  if (window.IncomeStackingApp) {
    window.IncomeStackingApp.destroy();
  }
});