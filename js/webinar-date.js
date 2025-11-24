/**
 * Webinar Date Handler - Enhanced Version
 * Scrapes actual date from hidden WebinarFuel widget instead of API calls
 * Uses Day.js for robust date parsing and timezone formatting
 * Determines appropriate session ID based on webinar day
 */

/* global dayjs */

import { CONFIG } from './config.js';

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
 * Gets the session ID from the WebinarFuel widget's displayed date/time
 * Since users don't select - we auto-show next available - we parse from displayed text
 * @param {string} dateText - The date text from WebinarFuel widget (e.g., "Tuesday, January 14th 2025 @ 8:00 PM")
 * @returns {string|null} The session ID based on the displayed date, or null if can't determine
 */
function getSessionIdFromDisplayedDate(dateText) {
  try {
    // Parse the displayed date
    const dateObj = parseWFDateText(dateText);
    if (!dateObj || !dateObj.isValid()) {
      console.warn('[WF Bridge] Could not parse date text:', dateText);
      return null;
    }
    
    // Get day of week from the parsed date
    const dayOfWeek = dateObj.format('dddd').toLowerCase();
    
    // Map to session ID from config
    if (dayOfWeek === 'saturday') {
      console.log('[WF Bridge] ✅ Detected Saturday session from displayed date');
      return CONFIG.WEBINAR_FUEL.SESSIONS.SATURDAY;
    } else if (dayOfWeek === 'tuesday') {
      console.log('[WF Bridge] ✅ Detected Tuesday session from displayed date');
      return CONFIG.WEBINAR_FUEL.SESSIONS.TUESDAY;
    }
    
    // Default fallback
    console.log('[WF Bridge] Using default session for day:', dayOfWeek);
    return CONFIG.WEBINAR_FUEL.SESSIONS.TUESDAY;
    
  } catch (error) {
    console.error('[WF Bridge] Error determining session from displayed date:', error);
    return null;
  }
}

/**
 * Determine session ID based on the day of the week
 * This is now a fallback method when we can't read from the widget
 */
function getSessionIdFromDate(dateObj) {
  if (!dateObj || !dateObj.isValid()) {
    return CONFIG.WEBINAR_FUEL.SESSIONS.TUESDAY; // Default fallback
  }
  
  const dayOfWeek = dateObj.format('dddd').toLowerCase();
  
  if (dayOfWeek === 'saturday') {
    return CONFIG.WEBINAR_FUEL.SESSIONS.SATURDAY;
  } else {
    return CONFIG.WEBINAR_FUEL.SESSIONS.TUESDAY; // Default to Tuesday for all other days
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

  // Update the main webinar date element
  const webinarDateEl = document.getElementById('webinar-date');
  if (webinarDateEl) {
    // Display the formatted date with time zones
    webinarDateEl.innerHTML = `
      <div><strong>${longDate}</strong></div>
      <div class="text-sm text-blue-600 mt-1">${timeDisplays}</div>
    `;
    webinarDateEl.classList.remove('animate-pulse');
  }

  // Update the user timezone display
  const userTimezoneEl = document.getElementById('user-timezone');
  if (userTimezoneEl) {
    const userTimezone = dayjs.tz.guess();
    const userTime = dateObj.tz(userTimezone).format('h:mm A');
    const timezoneName = userTimezone.split('/').pop().replace('_', ' ');
    userTimezoneEl.textContent = `Your time: ${userTime} (${timezoneName})`;
  }

  // Determine and store session information from the displayed date
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
    webinarDateEl.innerHTML = `
      <div><strong>Tuesday, January 14th</strong></div>
      <div class="text-sm text-blue-600 mt-1">11:00 PM PT | 12:00 AM MT | 1:00 AM CT | 2:00 AM ET</div>
    `;
    webinarDateEl.classList.remove('animate-pulse');
  }
  
  // Update the user timezone display with fallback
  const userTimezoneEl = document.getElementById('user-timezone');
  if (userTimezoneEl) {
    const userTimezone = dayjs.tz.guess();
    const fallbackDate = dayjs('2025-01-14 8:00 PM', 'YYYY-MM-DD h:mm A');
    const userTime = fallbackDate.tz(userTimezone).format('h:mm A');
    const timezoneName = userTimezone.split('/').pop().replace('_', ' ');
    userTimezoneEl.textContent = `Your time: ${userTime} (${timezoneName})`;
  }
  
  // Set fallback session info
  window.webinarDateFormatted = '2025-01-14 8:00 PM';
  window.webinarSessionId = CONFIG.WEBINAR_FUEL.SESSIONS.TUESDAY;
  window.webinarDayOfWeek = 'Tuesday';
}

/**
 * Watch for WebinarFuel date to appear and process it
 */
function watchWFDate(maxRetries = 160) {
  let tries = 0;
  
  function tick() {
    // Try multiple selectors for WebinarFuel date elements
    const selectors = [
      '.wf_dropdown_value_container .wf_dropdown_value',
      '.wf_dropdown_value',
      '[class*="wf_dropdown"] [class*="value"]',
      '.wf_target select option:checked',
      '.wf_target select option[selected]',
      '.wf_element_dropdown select',
      '.wf_element_dropdown option:checked'
    ];
    
    let el = null;
    let raw = '';
    
    for (const selector of selectors) {
      el = document.querySelector(selector);
      if (el) {
        raw = el.textContent?.trim() || el.value?.trim() || '';
        if (raw) {
          break;
        }
      }
    }
    
    // Debug: Log what we're finding
    if (tries % 20 === 0) { // Log every 10 seconds
      console.warn('[WebinarDate] Searching for WF date...', {
        attempt: tries,
        foundElement: !!el,
        textContent: raw,
        elementSelector: el ? `${el.tagName}.${el.className}` : null,
        allWFElements: document.querySelectorAll('[class*="wf_"]').length
      });
    }
    
    if (raw.includes('@')) {
      const dateObj = parseWFDateText(raw);
      if (dateObj && dateObj.isValid()) {
        // Determine session ID from the displayed date text
        const sessionId = getSessionIdFromDisplayedDate(raw);
        if (sessionId) {
          window.webinarSessionId = sessionId;
          console.log('[WF Bridge] ✅ Session ID set from displayed date:', sessionId);
        }
        
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
      console.warn('[WebinarDate] Final DOM state:', {
        wfElements: Array.from(document.querySelectorAll('[class*="wf_"]')).map(el => ({
          className: el.className,
          textContent: el.textContent?.trim(),
          tagName: el.tagName
        }))
      });
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