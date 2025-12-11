/**
 * Persistent Countdown Timer Class
 * Handles countdown functionality with localStorage persistence
 * Timer remembers visitor and continues from where they left off
 */
export class CountdownTimer {
  constructor(elementId, options = {}) {
    this.element = document.getElementById(elementId);
    this.storageKey = options.storageKey || 'countdown_timer';
    this.initialMinutes = options.minutes || 14;
    this.initialSeconds = options.seconds || 59;
    this.timer = null;
    
    if (!this.element) {
      throw new Error(`Countdown element with id '${elementId}' not found`);
    }
    
    // Load saved state or initialize new countdown
    this.loadState();
  }

  /**
   * Load countdown state from localStorage
   */
  loadState() {
    const saved = localStorage.getItem(this.storageKey);
    
    if (saved) {
      const { expireTime } = JSON.parse(saved);
      const now = Date.now();
      
      // Calculate remaining time
      const remainingMs = expireTime - now;
      
      if (remainingMs > 0) {
        // Timer still active - restore remaining time
        const remainingSeconds = Math.floor(remainingMs / 1000);
        this.minutes = Math.floor(remainingSeconds / 60);
        this.seconds = remainingSeconds % 60;
        console.log(`[Countdown] Restored timer: ${this.minutes}:${this.seconds.toString().padStart(2, '0')} remaining`);
      } else {
        // Timer expired
        this.minutes = 0;
        this.seconds = 0;
        console.log('[Countdown] Timer expired (loaded from storage)');
      }
    } else {
      // First visit - start new countdown
      this.minutes = this.initialMinutes;
      this.seconds = this.seconds || this.initialSeconds;
      this.saveState();
      console.log(`[Countdown] New visitor - starting ${this.minutes}:${this.seconds.toString().padStart(2, '0')} countdown`);
    }
  }

  /**
   * Save countdown state to localStorage
   */
  saveState() {
    const totalSeconds = this.minutes * 60 + this.seconds;
    const expireTime = Date.now() + (totalSeconds * 1000);
    
    localStorage.setItem(this.storageKey, JSON.stringify({
      expireTime,
      startTime: Date.now()
    }));
  }

  /**
   * Start the countdown timer
   */
  start() {
    this.updateDisplay();
    
    this.timer = setInterval(() => {
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
      
      this.updateDisplay();
      this.saveState();
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
    console.log('[Countdown] Timer expired');
    
    // Dispatch event so other components can react
    this.element.dispatchEvent(new CustomEvent('countdownComplete'));
  }

  /**
   * Reset the countdown to initial values (clear storage)
   */
  reset(minutes = 14, seconds = 59) {
    this.stop();
    localStorage.removeItem(this.storageKey);
    this.initialMinutes = minutes;
    this.initialSeconds = seconds;
    this.minutes = minutes;
    this.seconds = seconds;
    this.saveState();
    this.updateDisplay();
    console.log('[Countdown] Timer reset');
  }

  /**
   * Get current time remaining in seconds
   */
  getTimeRemaining() {
    return this.minutes * 60 + this.seconds;
  }
}