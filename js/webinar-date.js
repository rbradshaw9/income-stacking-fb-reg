import { CONFIG } from './config.js';

/**
 * Webinar Date Fetcher Class
 * Handles fetching and displaying webinar dates from the API
 */
export class WebinarDateFetcher {
  constructor(elementId) {
    this.element = document.getElementById(elementId);
    
    if (!this.element) {
      throw new Error(`Webinar date element with id '${elementId}' not found`);
    }
  }

  /**
   * Fetch webinar dates from API and display them
   */
  async fetchAndDisplay() {
    try {
      // Default to Tuesday session for date display
      const sessionId = CONFIG.WEBINAR_FUEL.SESSIONS.TUESDAY;
      const url = `${CONFIG.WEBINAR_FUEL.BASE_URL}${CONFIG.WEBINAR_FUEL.ENDPOINTS.DATES}?session_id=${sessionId}`;
      
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${CONFIG.WEBINAR_FUEL.API_KEY}`
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.dates && data.dates.length > 0) {
        const nextDate = new Date(data.dates[0]);
        const formattedDate = this.formatDate(nextDate);
        this.displayDate(formattedDate);
      } else {
        console.warn('No webinar dates received from API');
        this.displayFallbackDate();
      }
    } catch (error) {
      console.warn('Failed to fetch webinar date:', error.message);
      this.displayFallbackDate();
    }
  }

  /**
   * Format date for display
   */
  formatDate(date) {
    const options = { 
      weekday: 'short', 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      timeZoneName: 'short'
    };
    
    return date.toLocaleDateString('en-US', options);
  }

  /**
   * Display the date in the element
   */
  displayDate(dateString) {
    this.element.textContent = dateString;
    this.element.classList.remove('animate-pulse');
  }

  /**
   * Display fallback date when API fails
   */
  displayFallbackDate() {
    this.displayDate(CONFIG.FALLBACK.WEBINAR_DATE);
  }

  /**
   * Set loading state
   */
  setLoading() {
    this.element.textContent = 'Loading webinar dates...';
    this.element.classList.add('animate-pulse');
  }
}