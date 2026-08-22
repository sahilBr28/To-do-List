// ===== UTILITY FUNCTIONS - STRAW HAT LEDGER =====

// ===== DATE FUNCTIONS =====

/**
 * Get today's date in ISO format (YYYY-MM-DD)
 * @returns {string} Today's date in ISO format
 */
function todayISO() {
    const d = new Date();
    return d.getFullYear() + '-' + 
           String(d.getMonth() + 1).padStart(2, '0') + '-' + 
           String(d.getDate()).padStart(2, '0');
}

/**
 * Format a date string for display
 * @param {string} dateStr - ISO date string
 * @returns {string} Formatted date (e.g., "Dec 25, 2024")
 */
function formatDateForDisplay(dateStr) {
    if (!dateStr) return 'N/A';
    try {
        const d = new Date(dateStr);
        if (isNaN(d.getTime())) return 'N/A';
        return d.toLocaleDateString(undefined, { 
            month: 'short', 
            day: 'numeric', 
            year: 'numeric' 
        });
    } catch (e) {
        return 'N/A';
    }
}

/**
 * Format a time string for display
 * @param {string} dateStr - ISO date string
 * @returns {string} Formatted time (e.g., "10:30 AM")
 */
function formatTimeForDisplay(dateStr) {
    if (!dateStr) return 'N/A';
    try {
        const d = new Date(dateStr);
        if (isNaN(d.getTime())) return 'N/A';
        return d.toLocaleTimeString(undefined, { 
            hour: '2-digit', 
            minute: '2-digit' 
        });
    } catch (e) {
        return 'N/A';
    }
}

/**
 * Format date and time together
 * @param {string} dateStr - ISO date string
 * @returns {string} Formatted date and time
 */
function formatDateTimeForDisplay(dateStr) {
    if (!dateStr) return 'N/A';
    try {
        const d = new Date(dateStr);
        if (isNaN(d.getTime())) return 'N/A';
        return d.toLocaleDateString(undefined, { 
            month: 'short', 
            day: 'numeric', 
            year: 'numeric' 
        }) + ' at ' + d.toLocaleTimeString(undefined, { 
            hour: '2-digit', 
            minute: '2-digit' 
        });
    } catch (e) {
        return 'N/A';
    }
}

/**
 * Format duration in seconds to readable format
 * @param {number} seconds - Duration in seconds
 * @returns {string} Formatted duration (e.g., "2h 30m" or "45m" or "30s")
 */
function formatDuration(seconds) {
    if (!seconds || seconds < 0) return '0m';
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
        return hours + 'h ' + (mins > 0 ? mins + 'm' : '');
    } else if (mins > 0) {
        return mins + 'm' + (secs > 0 ? ' ' + secs + 's' : '');
    } else {
        return secs + 's';
    }
}

/**
 * Format duration to HH:MM:SS format
 * @param {number} seconds - Duration in seconds
 * @returns {string} Formatted duration (e.g., "02:30:45")
 */
function formatDurationHMS(seconds) {
    if (!seconds || seconds < 0) seconds = 0;
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return String(hours).padStart(2, '0') + ':' + 
           String(mins).padStart(2, '0') + ':' + 
           String(secs).padStart(2, '0');
}

/**
 * Get the day of the week
 * @param {string} dateStr - ISO date string
 * @returns {string} Day of the week (e.g., "Monday")
 */
function getDayOfWeek(dateStr) {
    if (!dateStr) return 'N/A';
    try {
        const d = new Date(dateStr);
        if (isNaN(d.getTime())) return 'N/A';
        return d.toLocaleDateString(undefined, { weekday: 'long' });
    } catch (e) {
        return 'N/A';
    }
}

/**
 * Check if a date is today
 * @param {string} dateStr - ISO date string
 * @returns {boolean} True if date is today
 */
function isToday(dateStr) {
    if (!dateStr) return false;
    return dateStr === todayISO();
}

/**
 * Check if a date is overdue (before today)
 * @param {string} dateStr - ISO date string
 * @returns {boolean} True if date is overdue
 */
function isOverdue(dateStr) {
    if (!dateStr) return false;
    return dateStr < todayISO();
}

/**
 * Get difference in days between two dates
 * @param {string} date1 - ISO date string
 * @param {string} date2 - ISO date string
 * @returns {number} Difference in days
 */
function daysBetween(date1, date2) {
    if (!date1 || !date2) return 0;
    try {
        const d1 = new Date(date1 + 'T00:00:00');
        const d2 = new Date(date2 + 'T00:00:00');
        const diffTime = Math.abs(d2 - d1);
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    } catch (e) {
        return 0;
    }
}

// ===== ID GENERATION =====

/**
 * Generate a unique ID
 * @returns {string} Unique ID
 */
function uid() {
    return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

// ===== STRING FUNCTIONS =====

/**
 * Escape HTML special characters to prevent XSS
 * @param {string} str - String to escape
 * @returns {string} Escaped string
 */
function escapeHtml(str) {
    if (!str) return '';
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}

/**
 * Truncate a string to a maximum length
 * @param {string} str - String to truncate
 * @param {number} maxLength - Maximum length
 * @returns {string} Truncated string
 */
function truncateString(str, maxLength = 50) {
    if (!str) return '';
    if (str.length <= maxLength) return str;
    return str.slice(0, maxLength) + '...';
}

/**
 * Capitalize first letter of each word
 * @param {string} str - String to capitalize
 * @returns {string} Capitalized string
 */
function capitalizeWords(str) {
    if (!str) return '';
    return str.split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ');
}

// ===== STORAGE FUNCTIONS =====

/**
 * Save data to localStorage with error handling
 * @param {string} key - Storage key
 * @param {*} value - Value to store
 * @returns {boolean} Success status
 */
function saveToStorage(key, value) {
    try {
        localStorage.setItem(key, JSON.stringify(value));
        return true;
    } catch (e) {
        console.error('Error saving to localStorage:', e);
        return false;
    }
}

/**
 * Load data from localStorage with error handling
 * @param {string} key - Storage key
 * @param {*} defaultValue - Default value if key doesn't exist
 * @returns {*} Loaded value or default
 */
function loadFromStorage(key, defaultValue = null) {
    try {
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : defaultValue;
    } catch (e) {
        console.error('Error loading from localStorage:', e);
        return defaultValue;
    }
}

/**
 * Remove data from localStorage
 * @param {string} key - Storage key
 * @returns {boolean} Success status
 */
function removeFromStorage(key) {
    try {
        localStorage.removeItem(key);
        return true;
    } catch (e) {
        console.error('Error removing from localStorage:', e);
        return false;
    }
}

// ===== VALIDATION FUNCTIONS =====

/**
 * Check if a string is empty or only whitespace
 * @param {string} str - String to check
 * @returns {boolean} True if empty
 */
function isEmpty(str) {
    return !str || str.trim().length === 0;
}

/**
 * Validate an email address
 * @param {string} email - Email to validate
 * @returns {boolean} True if valid
 */
function isValidEmail(email) {
    if (!email) return false;
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

/**
 * Validate a URL
 * @param {string} url - URL to validate
 * @returns {boolean} True if valid
 */
function isValidUrl(url) {
    if (!url) return false;
    try {
        new URL(url);
        return true;
    } catch (e) {
        return false;
    }
}

// ===== ARRAY FUNCTIONS =====

/**
 * Shuffle an array (Fisher-Yates algorithm)
 * @param {Array} array - Array to shuffle
 * @returns {Array} Shuffled array
 */
function shuffleArray(array) {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}

/**
 * Group array items by a key
 * @param {Array} array - Array to group
 * @param {string} key - Key to group by
 * @returns {Object} Grouped object
 */
function groupBy(array, key) {
    if (!array || !key) return {};
    return array.reduce((result, item) => {
        const groupKey = item[key] || 'undefined';
        if (!result[groupKey]) {
            result[groupKey] = [];
        }
        result[groupKey].push(item);
        return result;
    }, {});
}

// ===== DOM HELPERS =====

/**
 * Create a DOM element with classes and attributes
 * @param {string} tag - HTML tag
 * @param {Object} options - Options (className, attributes, text, html)
 * @returns {HTMLElement} Created element
 */
function createElement(tag, options = {}) {
    const el = document.createElement(tag);
    if (options.className) el.className = options.className;
    if (options.text) el.textContent = options.text;
    if (options.html) el.innerHTML = options.html;
    if (options.attributes) {
        Object.entries(options.attributes).forEach(([key, value]) => {
            el.setAttribute(key, value);
        });
    }
    if (options.dataset) {
        Object.entries(options.dataset).forEach(([key, value]) => {
            el.dataset[key] = value;
        });
    }
    return el;
}

/**
 * Show an element with animation
 * @param {HTMLElement} el - Element to show
 * @param {string} display - Display style (default: 'block')
 */
function showElement(el, display = 'block') {
    if (!el) return;
    el.style.display = display;
    el.style.opacity = '0';
    el.style.transition = 'opacity 0.3s ease';
    requestAnimationFrame(() => {
        el.style.opacity = '1';
    });
}

/**
 * Hide an element with animation
 * @param {HTMLElement} el - Element to hide
 */
function hideElement(el) {
    if (!el) return;
    el.style.opacity = '0';
    el.style.transition = 'opacity 0.3s ease';
    setTimeout(() => {
        el.style.display = 'none';
    }, 300);
}

// ===== COLOR FUNCTIONS =====

/**
 * Get priority color
 * @param {string} priority - 'high', 'med', or 'low'
 * @returns {string} Color value
 */
function getPriorityColor(priority) {
    const colors = {
        high: 'var(--luffy-red)',
        med: 'var(--gold)',
        low: 'var(--olive)'
    };
    return colors[priority] || 'var(--brown)';
}

/**
 * Get priority emoji
 * @param {string} priority - 'high', 'med', or 'low'
 * @returns {string} Emoji
 */
function getPriorityEmoji(priority) {
    const emojis = {
        high: '🔥',
        med: '⚖️',
        low: '🍃'
    };
    return emojis[priority] || '⚖️';
}

// ===== EXPORT FUNCTIONS FOR GLOBAL ACCESS =====
// These functions need to be available globally
window.todayISO = todayISO;
window.formatDateForDisplay = formatDateForDisplay;
window.formatTimeForDisplay = formatTimeForDisplay;
window.formatDateTimeForDisplay = formatDateTimeForDisplay;
window.formatDuration = formatDuration;
window.formatDurationHMS = formatDurationHMS;
window.getDayOfWeek = getDayOfWeek;
window.isToday = isToday;
window.isOverdue = isOverdue;
window.daysBetween = daysBetween;
window.uid = uid;
window.escapeHtml = escapeHtml;
window.truncateString = truncateString;
window.capitalizeWords = capitalizeWords;
window.saveToStorage = saveToStorage;
window.loadFromStorage = loadFromStorage;
window.removeFromStorage = removeFromStorage;
window.isEmpty = isEmpty;
window.isValidEmail = isValidEmail;
window.isValidUrl = isValidUrl;
window.shuffleArray = shuffleArray;
window.groupBy = groupBy;
window.createElement = createElement;
window.showElement = showElement;
window.hideElement = hideElement;
window.getPriorityColor = getPriorityColor;
window.getPriorityEmoji = getPriorityEmoji;