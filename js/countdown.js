/**
 * Countdown Timer Class
 * Handles the countdown functionality for bonus material urgency
 */
export class CountdownTimer {
  constructor(elementId, options = {}) {
    this.element = document.getElementById(elementId);
    this.minutes = options.minutes || 14;
    this.seconds = options.seconds || 59;
    this.timer = null;
    
    if (!this.element) {
      throw new Error(`Countdown element with id '${elementId}' not found`);
    }
  }

  /**
   * Start the countdown timer
   */
  start() {
    this.updateDisplay();
    
    this.timer = setInterval(() => {
      this.updateDisplay();
      
      if (this.seconds === 0) {
        if (this.minutes === 0) {
          this.stop();
          this.onCountdownComplete();
          return;
        }
        this.minutes--;
        this.seconds = 59;
      } else {
        this.seconds--;
      }
    }, 1000);
  }

  /**
   * Stop the countdown timer
   */
  stop() {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }

  /**
   * Update the display with current time
   */
  updateDisplay() {
    const display = `${this.minutes}:${this.seconds.toString().padStart(2, '0')}`;
    this.element.textContent = display;
  }

  /**
   * Handle countdown completion
   */
  onCountdownComplete() {
    this.element.textContent = "00:00";
    // Countdown completed
    
    // Optionally trigger some action when countdown completes
    this.element.dispatchEvent(new CustomEvent('countdownComplete'));
  }

  /**
   * Reset the countdown to initial values
   */
  reset(minutes = 14, seconds = 59) {
    this.stop();
    this.minutes = minutes;
    this.seconds = seconds;
    this.updateDisplay();
  }

  /**
   * Get current time remaining in seconds
   */
  getTimeRemaining() {
    return this.minutes * 60 + this.seconds;
  }
}