/**
 * Spots Remaining Counter
 * Creates scarcity by showing decreasing available spots
 * Syncs across visits using localStorage with time-based decay
 */
export class SpotsCounter {
  constructor(elementId, options = {}) {
    this.element = document.getElementById(elementId);
    this.storageKey = options.storageKey || 'spots_counter';
    this.baseSpots = options.baseSpots || 47; // Starting number (feels more real than round number)
    this.decayRate = options.decayRate || 0.15; // Spots decrease per minute
    this.minSpots = options.minSpots || 7; // Never go below this
    
    if (!this.element) {
      throw new Error(`Spots counter element with id '${elementId}' not found`);
    }
    
    this.initialize();
  }

  /**
   * Initialize the counter
   */
  initialize() {
    const saved = localStorage.getItem(this.storageKey);
    
    if (saved) {
      const { initialSpots, startTime } = JSON.parse(saved);
      const minutesElapsed = (Date.now() - startTime) / 1000 / 60;
      
      // Calculate spots based on time decay
      const spotsDecreased = Math.floor(minutesElapsed * this.decayRate);
      this.currentSpots = Math.max(this.minSpots, initialSpots - spotsDecreased);
      
      console.log(`[SpotsCounter] ${minutesElapsed.toFixed(1)} minutes elapsed, ${spotsDecreased} spots taken, ${this.currentSpots} remaining`);
    } else {
      // First visit
      this.currentSpots = this.baseSpots;
      localStorage.setItem(this.storageKey, JSON.stringify({
        initialSpots: this.baseSpots,
        startTime: Date.now()
      }));
      console.log(`[SpotsCounter] New visitor - starting at ${this.currentSpots} spots`);
    }
    
    this.updateDisplay();
    this.startDecay();
  }

  /**
   * Start the decay timer (updates every minute)
   */
  startDecay() {
    // Update every minute
    this.timer = setInterval(() => {
      if (this.currentSpots > this.minSpots) {
        // Random chance to decrease (makes it feel more realistic)
        if (Math.random() < this.decayRate) {
          this.currentSpots--;
          this.updateDisplay();
          console.log(`[SpotsCounter] Spot taken! ${this.currentSpots} remaining`);
        }
      }
    }, 60000); // Every minute
    
    // Also update every 10 seconds for more dynamic feel
    this.microTimer = setInterval(() => {
      if (this.currentSpots > this.minSpots && Math.random() < 0.02) {
        this.currentSpots--;
        this.updateDisplay();
        this.flashUpdate();
      }
    }, 10000);
  }

  /**
   * Update the display
   */
  updateDisplay() {
    this.element.textContent = this.currentSpots;
    
    // Add urgency colors based on spots remaining
    if (this.currentSpots <= 10) {
      this.element.classList.add('text-red-600', 'font-black');
      this.element.classList.remove('text-orange-600', 'text-yellow-600');
    } else if (this.currentSpots <= 20) {
      this.element.classList.add('text-orange-600', 'font-bold');
      this.element.classList.remove('text-red-600', 'text-yellow-600');
    } else {
      this.element.classList.add('text-yellow-600');
      this.element.classList.remove('text-red-600', 'text-orange-600');
    }
  }

  /**
   * Flash the element when updated
   */
  flashUpdate() {
    this.element.classList.add('scale-110', 'transition-transform', 'duration-200');
    setTimeout(() => {
      this.element.classList.remove('scale-110');
    }, 200);
  }

  /**
   * Stop the decay timers
   */
  stop() {
    if (this.timer) clearInterval(this.timer);
    if (this.microTimer) clearInterval(this.microTimer);
  }

  /**
   * Reset the counter
   */
  reset() {
    this.stop();
    localStorage.removeItem(this.storageKey);
    this.initialize();
  }
}
