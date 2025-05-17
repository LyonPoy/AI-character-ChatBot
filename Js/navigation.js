// Navigation and UI helper functions for the AI Character Chat application

// Show a status message
function showStatusMessage(message, type = 'info', duration = 3000) {
  const statusArea = document.getElementById('status-message-area');
  if (!statusArea) return;

  statusArea.textContent = message;
  statusArea.className = 'status-message-area';
  
  if (type) {
    statusArea.classList.add(type);
  }
  
  statusArea.classList.remove('hidden');
  statusArea.setAttribute('aria-hidden', 'false');
  
  setTimeout(() => {
    statusArea.classList.add('hidden');
    statusArea.setAttribute('aria-hidden', 'true');
  }, duration);
}

// Show/hide the overlay
function toggleOverlay(show) {
  const overlay = document.getElementById('overlay');
  if (!overlay) return;
  
  if (show) {
    overlay.classList.remove('hidden');
    overlay.setAttribute('aria-hidden', 'false');
  } else {
    overlay.classList.add('hidden');
    overlay.setAttribute('aria-hidden', 'true');
  }
}

// Get URL parameters
function getUrlParams() {
  const params = {};
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  
  for (const [key, value] of urlParams) {
    params[key] = value;
  }
  
  return params;
}

// Navigate to a page with parameters
function navigateTo(page, params = {}) {
  let url = page;
  const queryParams = [];
  
  for (const key in params) {
    if (params[key] !== undefined && params[key] !== null) {
      queryParams.push(`${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`);
    }
  }
  
  if (queryParams.length > 0) {
    url += `?${queryParams.join('&')}`;
  }
  
  window.location.href = url;
}

// Format date to relative time (e.g., "2 hours ago")
function formatRelativeTime(dateString) {
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now - date) / 1000);
  
  // Handle invalid dates
  if (isNaN(seconds)) {
    return 'Invalid date';
  }
  
  // Time intervals in seconds
  const intervals = {
    year: 31536000,
    month: 2592000,
    week: 604800,
    day: 86400,
    hour: 3600,
    minute: 60,
    second: 1
  };
  
  let counter;
  for (const [unit, secondsInUnit] of Object.entries(intervals)) {
    counter = Math.floor(seconds / secondsInUnit);
    if (counter > 0) {
      // If it's recent, show "just now" instead of "X seconds ago"
      if (unit === 'second' && counter < 60) {
        return 'just now';
      }
      return `${counter} ${unit}${counter === 1 ? '' : 's'} ago`;
    }
  }
  
  return 'just now';
}

// Format timestamp (HH:MM)
function formatTime(dateString) {
  const date = new Date(dateString);
  
  // Return the time in 12-hour format (e.g., "2:30 PM")
  return date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
}

// Format full date (MMM D, YYYY)
function formatDate(dateString) {
  const date = new Date(dateString);
  
  // Return the date (e.g., "May 15, 2025")
  return date.toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' });
}

// Check if an element is in the viewport
function isInViewport(element) {
  const rect = element.getBoundingClientRect();
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
}

// Scroll to element
function scrollToElement(element, behavior = 'smooth') {
  element.scrollIntoView({ behavior, block: 'nearest' });
}

// Handle tab navigation
function setupTabs() {
  const tabButtons = document.querySelectorAll('[data-tab]');
  
  tabButtons.forEach(button => {
    button.addEventListener('click', () => {
      // Deactivate all tab buttons and content
      tabButtons.forEach(btn => {
        btn.classList.remove('active');
        btn.setAttribute('aria-selected', 'false');
        
        const content = document.getElementById(btn.dataset.tab);
        if (content) {
          content.classList.add('hidden');
          content.setAttribute('aria-hidden', 'true');
        }
      });
      
      // Activate selected tab
      button.classList.add('active');
      button.setAttribute('aria-selected', 'true');
      
      const targetContent = document.getElementById(button.dataset.tab);
      if (targetContent) {
        targetContent.classList.remove('hidden');
        targetContent.setAttribute('aria-hidden', 'false');
      }
    });
  });
}

// Toggle theme (light/dark mode)
function toggleTheme() {
  const body = document.body;
  const isDarkMode = body.classList.contains('dark-mode');
  
  if (isDarkMode) {
    body.classList.remove('dark-mode');
    body.classList.add('light-mode');
    localStorage.setItem('theme', 'light');
  } else {
    body.classList.remove('light-mode');
    body.classList.add('dark-mode');
    localStorage.setItem('theme', 'dark');
  }
}

// Apply saved theme
function applyTheme() {
  const savedTheme = localStorage.getItem('theme') || 'light';
  const body = document.body;
  
  body.classList.remove('light-mode', 'dark-mode');
  body.classList.add(`${savedTheme}-mode`);
}

// Setup context menus
function setupContextMenus() {
  // Close context menus when clicking outside
  document.addEventListener('click', (e) => {
    const contextMenus = document.querySelectorAll('.context-menu, .popup-menu');
    
    contextMenus.forEach(menu => {
      // Skip if menu is already hidden
      if (menu.classList.contains('hidden')) return;
      
      // Check if the click is outside the menu
      if (!menu.contains(e.target) && !e.target.closest('[data-menu]')) {
        menu.classList.add('hidden');
        menu.setAttribute('aria-hidden', 'true');
        toggleOverlay(false);
      }
    });
  });
  
  // Close context menus when pressing Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      const contextMenus = document.querySelectorAll('.context-menu, .popup-menu');
      
      contextMenus.forEach(menu => {
        if (!menu.classList.contains('hidden')) {
          menu.classList.add('hidden');
          menu.setAttribute('aria-hidden', 'true');
          toggleOverlay(false);
        }
      });
    }
  });
}

// Setup modals
function setupModals() {
  // Close modals when clicking the overlay
  const overlay = document.getElementById('overlay');
  if (overlay) {
    overlay.addEventListener('click', () => {
      const modals = document.querySelectorAll('.modal');
      
      modals.forEach(modal => {
        if (!modal.classList.contains('hidden')) {
          modal.classList.add('hidden');
          modal.setAttribute('aria-hidden', 'true');
          toggleOverlay(false);
        }
      });
    });
  }
  
  // Close modals when pressing Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      const modals = document.querySelectorAll('.modal');
      
      modals.forEach(modal => {
        if (!modal.classList.contains('hidden')) {
          modal.classList.add('hidden');
          modal.setAttribute('aria-hidden', 'true');
          toggleOverlay(false);
        }
      });
    }
  });
  
  // Close buttons for modals
  document.querySelectorAll('.close-btn, [data-close-modal]').forEach(button => {
    button.addEventListener('click', () => {
      const modal = button.closest('.modal');
      if (modal) {
        modal.classList.add('hidden');
        modal.setAttribute('aria-hidden', 'true');
        toggleOverlay(false);
      }
    });
  });
}

// Initialize UI components
function initUI() {
  applyTheme();
  setupTabs();
  setupContextMenus();
  setupModals();
  
  // Toggle dark mode button
  const darkModeToggle = document.getElementById('dark-mode-toggle');
  if (darkModeToggle) {
    darkModeToggle.addEventListener('click', toggleTheme);
  }
}

// Export navigation and UI functions
export {
  showStatusMessage,
  toggleOverlay,
  getUrlParams,
  navigateTo,
  formatRelativeTime,
  formatTime,
  formatDate,
  isInViewport,
  scrollToElement,
  toggleTheme,
  initUI
};