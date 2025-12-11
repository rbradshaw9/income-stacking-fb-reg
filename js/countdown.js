/**
 * Countdown Timer to Webinar Start
 * Counts down to the actual webinar date/time
 */
export class CountdownTimer {
  constructor(elementId, options = {}) {
    this.element = document.getElementById(elementId);
    this.targetDate = options.targetDate; // Date object or timestamp
    this.timer = null;
    
    if (!this.element) {
      throw new Error(`Countdown element with id '${elementId}' not found`);
    }
    
    if (!this.targetDate) {
      throw new Error('Target date is required for countdown');
    }
  }

  /**
   * Start the countdown timer
   */
  start() {
    this.updateDisplay();
    
    this.timer = setInterval(() => {
      this.updateDisplay();
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
   * Update the display with current time remaining
   */
  updateDisplay() {
    const now = new Date().getTime();
    const target = new Date(this.targetDate).getTime();
    const remaining = target - now;
    
    if (remaining <= 0) {
      this.element.textContent = "LIVE NOW!";
      this.stop();
      return;
    }
    
    const days = Math.floor(remaining / (1000 * 60 * 60 * 24));
    const hours = Math.floor((remaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((remaining % (1000 * 60)) / 1000);
    
    // Format based on time remaining
    if (days > 0) {
      this.element.textContent = `${days}d ${hours}h ${minutes}m`;
    } else if (hours > 0) {
      this.element.textContent = `${hours}h ${minutes}m ${seconds}s`;
    } else {
      this.element.textContent = `${minutes}m ${seconds}s`;
    }
  }

  /**
   * Get current time remaining in seconds
   */
  getTimeRemaining() {
    const now = new Date().getTime();
    const target = new Date(this.targetDate).getTime();
    return Math.max(0, Math.floor((target - now) / 1000));
  }
}