/**
 * Spots Remaining Counter
 * Shows decreasing available spots with realistic variation
 */
export class SpotsCounter {
  constructor(elementId, options = {}) {
    this.element = document.getElementById(elementId);
    this.storageKey = options.storageKey || 'spots_counter';
    this.baseSpots = options.baseSpots || 47;
    this.decayRate = options.decayRate || 0.15;
    this.minSpots = options.minSpots || 7;
    
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
      try {
        const { initialSpots, startTime, seed } = JSON.parse(saved);
        
        // Validate saved data
        if (!initialSpots || !startTime || isNaN(initialSpots)) {
          throw new Error('Invalid saved data');
        }
        
        const minutesElapsed = (Date.now() - startTime) / 1000 / 60;
        
        // Add some randomness based on visitor's seed to vary the experience
        const variance = this.seededRandom(seed || Math.random()) * 5; // 0-5 spot variation
        const spotsDecreased = Math.floor(minutesElapsed * this.decayRate) + Math.floor(variance);
        this.currentSpots = Math.max(this.minSpots, initialSpots - spotsDecreased);
        this.seed = seed || Math.random();
      } catch (e) {
        // If saved data is invalid, reset
        localStorage.removeItem(this.storageKey);
        this.initializeNew();
        return;
      }
    } else {
      this.initializeNew();
    }
    
    this.updateDisplay();
    this.startDecay();
  }
  
  /**
   * Initialize for new visitor
   */
  initializeNew() {
    this.seed = Math.random();
    const startVariation = Math.floor(this.seededRandom(this.seed + 0.5) * 8); // 0-8 variation
    this.currentSpots = this.baseSpots - startVariation;
    
    localStorage.setItem(this.storageKey, JSON.stringify({
      initialSpots: this.currentSpots,
      startTime: Date.now(),
      seed: this.seed
    }));
  }

  /**
   * Seeded random for consistent variation per user
   */
  seededRandom(seed) {
    const x = Math.sin(seed) * 10000;
    return x - Math.floor(x);
  }

  /**
   * Start the decay timer
   */
  startDecay() {
    // Irregular intervals to seem more natural
    const checkInterval = 45000 + Math.random() * 30000; // 45-75 seconds
    
    this.timer = setInterval(() => {
      if (this.currentSpots > this.minSpots) {
        // Variable chance based on current spots (more likely when higher)
        const chance = this.currentSpots > 20 ? 0.25 : 0.15;
        if (Math.random() < chance) {
          this.currentSpots--;
          this.updateDisplay();
          this.saveState();
        }
      }
    }, checkInterval);
  }

  /**
   * Save current state
   */
  saveState() {
    const saved = JSON.parse(localStorage.getItem(this.storageKey));
    if (saved) {
      // Update the calculated spots based on actual current value
      const minutesElapsed = (Date.now() - saved.startTime) / 1000 / 60;
      const expectedDecay = Math.floor(minutesElapsed * this.decayRate);
      const actualDecay = saved.initialSpots - this.currentSpots;
      
      // Only save if it makes sense (not too many spots gone)
      if (actualDecay <= expectedDecay + 10) {
        localStorage.setItem(this.storageKey, JSON.stringify({
          ...saved,
          currentSpots: this.currentSpots
        }));
      }
    }
  }

  /**
   * Update the display
   */
  updateDisplay() {
    this.element.textContent = this.currentSpots;
    
    // Update colors based on urgency but keep classes from HTML
    const classList = this.element.classList;
    if (this.currentSpots <= 10) {
      classList.remove('text-yellow-300', 'text-orange-600');
      classList.add('text-red-500');
    } else if (this.currentSpots <= 20) {
      classList.remove('text-yellow-300', 'text-red-500');
      classList.add('text-orange-400');
    }
    // Keep yellow-300 for higher numbers (default from HTML)
  }

  /**
   * Stop the decay timers
   */
  stop() {
    if (this.timer) clearInterval(this.timer);
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
