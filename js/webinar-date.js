/**
 * Webinar Date Handler - Enhanced Version
 * Scrapes actual date from hidden WebinarFuel widget instead of API calls
 * Uses Day.js for robust date parsing and timezone formatting
 * Determines appropriate session ID based on webinar day
 */

/* global dayjs */

// Session configuration
const SESSIONS = {
  TUESDAY: '66235',
  SATURDAY: '66238'
};

// Utility function to add ordinal suffix to day numbers
const ordinal = (n) => (n > 3 && n < 21) ? 'th' : (['th', 'st', 'nd', 'rd'][n % 10] || 'th');

/**
 * Parse WebinarFuel date text format
 * Expected format: "Tuesday, January 14th 2025 @ 8:00 PM"
 */
function parseWFDateText(txt) {
  const m = txt.match(/^[A-Za-z]+,\s([A-Za-z]+)\s(\d+)[a-z]{2}\s(\d{4})\s@\s(\d{1,2}:\d{2}\s[AP]M)/);
  if (!m) {
    return null;
  }
  const [, month, day, year, time] = m;
  return dayjs(`${month} ${day}, ${year} ${time}`, 'MMMM D, YYYY h:mm A');
}

/**
 * Determine session ID based on the day of the week
 */
function getSessionIdFromDate(dateObj) {
  if (!dateObj || !dateObj.isValid()) {
    return SESSIONS.TUESDAY; // Default fallback
  }
  
  const dayOfWeek = dateObj.format('dddd').toLowerCase();
  
  if (dayOfWeek === 'saturday') {
    return SESSIONS.SATURDAY;
  } else {
    return SESSIONS.TUESDAY; // Default to Tuesday for all other days
  }
}

/**
 * Render date and time information to the page
 */
function renderDateTime(dateObj) {
  if (!dateObj || !dateObj.isValid()) {
    console.warn('[WebinarDate] Invalid date object received');
    return;
  }

  const day = dateObj.date();
  const longDate = `${dateObj.format('dddd')}, ${dateObj.format('MMMM')} ${day}${ordinal(day)}`;

  // Update the main webinar date element
  const webinarDateEl = document.getElementById('webinar-date');
  if (webinarDateEl) {
    // Display the formatted date
    webinarDateEl.innerHTML = `<strong>${longDate}</strong>`;
    webinarDateEl.classList.remove('animate-pulse');
  }

  // Generate multi-timezone display
  const zones = { 
    PT: 'America/Los_Angeles', 
    MT: 'America/Denver', 
    CT: 'America/Chicago', 
    ET: 'America/New_York' 
  };
  
  const timeDisplays = Object.entries(zones).map(([abbr, zone]) => 
    `${dateObj.tz(zone).format('h:mm A').toUpperCase()} ${abbr}`
  ).join(' | ');

  // Determine and store session information
  const sessionId = getSessionIdFromDate(dateObj);
  const dayOfWeek = dateObj.format('dddd');
  
  console.warn('[WebinarDate] Date rendered:', longDate, '| Times:', timeDisplays);
  console.warn('[WebinarDate] Session determined:', dayOfWeek, '→ Session ID:', sessionId);
  
  // Store session info globally for form submission
  window.webinarDateFormatted = dateObj.format('YYYY-MM-DD h:mm A');
  window.webinarSessionId = sessionId;
  window.webinarDayOfWeek = dayOfWeek;
}

/**
 * Display fallback date when scraping fails
 */
function displayFallbackDate() {
  console.warn('[WebinarDate] Using fallback date');
  
  const webinarDateEl = document.getElementById('webinar-date');
  if (webinarDateEl) {
    webinarDateEl.innerHTML = '<strong>Tuesday, January 14th</strong>';
    webinarDateEl.classList.remove('animate-pulse');
  }
  
  // Set fallback session info
  window.webinarDateFormatted = '2025-01-14 8:00 PM';
  window.webinarSessionId = SESSIONS.TUESDAY;
  window.webinarDayOfWeek = 'Tuesday';
}

/**
 * Watch for WebinarFuel date to appear and process it
 */
function watchWFDate(maxRetries = 160) {
  let tries = 0;
  
  function tick() {
    // Look for the WebinarFuel dropdown value
    const el = document.querySelector('.wf_dropdown_value_container .wf_dropdown_value');
    const raw = el?.textContent?.trim() || '';
    
    if (raw.includes('@')) {
      const dateObj = parseWFDateText(raw);
      if (dateObj && dateObj.isValid()) {
        renderDateTime(dateObj);
        console.warn('[WebinarDate] Successfully scraped date from WF widget:', raw);
        return;
      }
    }
    
    // Retry if we haven't hit the limit
    if (++tries < maxRetries) {
      setTimeout(tick, 500);
    } else {
      console.warn('[WebinarDate] Failed to scrape date after', maxRetries, 'attempts');
      displayFallbackDate();
    }
  }
  
  // Start watching
  tick();
}

/**
 * Initialize webinar date functionality
 */
export function initWebinarDate() {
  console.warn('[WebinarDate] Initializing webinar date handler');
  
  // Set initial loading state
  const webinarDateEl = document.getElementById('webinar-date');
  if (webinarDateEl) {
    webinarDateEl.textContent = 'Loading webinar dates...';
    webinarDateEl.classList.add('animate-pulse');
  }
  
  // Wait a moment for the hidden WebinarFuel widget to load, then start watching
  setTimeout(() => {
    watchWFDate();
  }, 1000);
}

// Legacy support - maintain the class structure for backward compatibility
export class WebinarDateFetcher {
  constructor(elementId) {
    this.elementId = elementId;
    console.warn('[WebinarDateFetcher] Legacy class instantiated, delegating to new system');
  }
  
  async fetchAndDisplay() {
    initWebinarDate();
  }
  
  setLoading() {
    const element = document.getElementById(this.elementId);
    if (element) {
      element.textContent = 'Loading webinar dates...';
      element.classList.add('animate-pulse');
    }
  }
}