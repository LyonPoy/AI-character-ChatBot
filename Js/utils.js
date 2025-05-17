// Utility functions for the AI Character Chat application

// Generate a random ID
function generateId(length = 10) {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}

// Local storage helper functions
const storage = {
  // Set item with optional expiration (in seconds)
  setItem: (key, value, expiration = null) => {
    const item = {
      value,
      timestamp: Date.now(),
      expiration: expiration ? Date.now() + (expiration * 1000) : null
    };
    localStorage.setItem(key, JSON.stringify(item));
  },
  
  // Get item (returns null if expired)
  getItem: (key) => {
    const itemString = localStorage.getItem(key);
    if (!itemString) return null;
    
    try {
      const item = JSON.parse(itemString);
      
      // Check if item is expired
      if (item.expiration && item.expiration < Date.now()) {
        localStorage.removeItem(key);
        return null;
      }
      
      return item.value;
    } catch (error) {
      console.error('Error parsing item from localStorage:', error);
      return null;
    }
  },
  
  // Remove item
  removeItem: (key) => {
    localStorage.removeItem(key);
  },
  
  // Clear all items
  clear: () => {
    localStorage.clear();
  }
};

// Session storage helper functions
const sessionStore = {
  setItem: (key, value) => {
    sessionStorage.setItem(key, JSON.stringify(value));
  },
  
  getItem: (key) => {
    const itemString = sessionStorage.getItem(key);
    if (!itemString) return null;
    
    try {
      return JSON.parse(itemString);
    } catch (error) {
      console.error('Error parsing item from sessionStorage:', error);
      return null;
    }
  },
  
  removeItem: (key) => {
    sessionStorage.removeItem(key);
  },
  
  clear: () => {
    sessionStorage.clear();
  }
};

// User session management
const userSession = {
  // Set user data
  setUser: (userData) => {
    storage.setItem('user', userData);
  },
  
  // Get user data
  getUser: () => {
    return storage.getItem('user');
  },
  
  // Check if user is logged in
  isLoggedIn: () => {
    const user = storage.getItem('user');
    return !!user;
  },
  
  // Log out user
  logout: () => {
    storage.removeItem('user');
    // Clear any user-specific session data
    sessionStore.clear();
  }
};

// Validate form data
function validateForm(data, rules) {
  const errors = {};
  
  for (const field in rules) {
    const value = data[field];
    const fieldRules = rules[field];
    
    // Check required fields
    if (fieldRules.required && (!value || value.trim() === '')) {
      errors[field] = fieldRules.message || 'This field is required';
      continue;
    }
    
    // Skip other validations if the field is empty and not required
    if (!value && !fieldRules.required) continue;
    
    // Check minimum length
    if (fieldRules.minLength && value.length < fieldRules.minLength) {
      errors[field] = fieldRules.message || `Must be at least ${fieldRules.minLength} characters`;
      continue;
    }
    
    // Check maximum length
    if (fieldRules.maxLength && value.length > fieldRules.maxLength) {
      errors[field] = fieldRules.message || `Must be at most ${fieldRules.maxLength} characters`;
      continue;
    }
    
    // Check pattern (regex)
    if (fieldRules.pattern && !fieldRules.pattern.test(value)) {
      errors[field] = fieldRules.message || 'Invalid format';
      continue;
    }
    
    // Check email format
    if (fieldRules.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      errors[field] = fieldRules.message || 'Invalid email address';
      continue;
    }
    
    // Check match (for password confirmation)
    if (fieldRules.match && value !== data[fieldRules.match]) {
      errors[field] = fieldRules.message || `Does not match ${fieldRules.match}`;
      continue;
    }
    
    // Custom validation function
    if (fieldRules.validate && typeof fieldRules.validate === 'function') {
      const result = fieldRules.validate(value, data);
      if (result !== true) {
        errors[field] = result || 'Invalid value';
      }
    }
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
}

// Format file size (e.g., "2.5 MB")
function formatFileSize(bytes) {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// Sanitize HTML to prevent XSS
function sanitizeHTML(html) {
  const temp = document.createElement('div');
  temp.textContent = html;
  return temp.innerHTML;
}

// Truncate text with ellipsis
function truncateText(text, maxLength) {
  if (!text || text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
}

// Create DOM element with attributes and children
function createElement(tag, attributes = {}, children = []) {
  const element = document.createElement(tag);
  
  // Set attributes
  for (const key in attributes) {
    if (key === 'className') {
      element.className = attributes[key];
    } else if (key === 'style' && typeof attributes[key] === 'object') {
      Object.assign(element.style, attributes[key]);
    } else {
      element.setAttribute(key, attributes[key]);
    }
  }
  
  // Add children
  if (Array.isArray(children)) {
    children.forEach(child => {
      if (typeof child === 'string') {
        element.appendChild(document.createTextNode(child));
      } else if (child instanceof Node) {
        element.appendChild(child);
      }
    });
  } else if (typeof children === 'string') {
    element.textContent = children;
  } else if (children instanceof Node) {
    element.appendChild(children);
  }
  
  return element;
}

// Debounce function (for search inputs, window resize, etc.)
function debounce(func, wait = 300) {
  let timeout;
  
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Throttle function (for scroll events, etc.)
function throttle(func, limit = 300) {
  let inThrottle;
  
  return function executedFunction(...args) {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

// Copy text to clipboard
function copyToClipboard(text) {
  if (navigator.clipboard) {
    return navigator.clipboard.writeText(text)
      .then(() => true)
      .catch(err => {
        console.error('Could not copy text: ', err);
        return false;
      });
  } else {
    // Fallback for older browsers
    try {
      const textarea = document.createElement('textarea');
      textarea.value = text;
      textarea.style.position = 'fixed';  // Prevent scrolling to bottom
      document.body.appendChild(textarea);
      textarea.select();
      const successful = document.execCommand('copy');
      document.body.removeChild(textarea);
      return Promise.resolve(successful);
    } catch (err) {
      console.error('Could not copy text: ', err);
      return Promise.resolve(false);
    }
  }
}

// Download file
function downloadFile(content, filename, contentType = 'text/plain') {
  const blob = new Blob([content], { type: contentType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  
  a.href = url;
  a.download = filename;
  a.style.display = 'none';
  
  document.body.appendChild(a);
  a.click();
  
  setTimeout(() => {
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, 100);
}

// Parse CSV
function parseCSV(text, delimiter = ',') {
  const lines = text.split('\n');
  const result = [];
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    
    const values = line.split(delimiter);
    result.push(values);
  }
  
  return result;
}

// Generate CSV
function generateCSV(data, delimiter = ',') {
  return data.map(row => {
    return row.map(cell => {
      // Quote cells that contain delimiter, quotes, or newlines
      if (cell !== null && cell !== undefined && (
        cell.toString().includes(delimiter) || 
        cell.toString().includes('"') || 
        cell.toString().includes('\n')
      )) {
        return `"${cell.toString().replace(/"/g, '""')}"`;
      }
      return cell;
    }).join(delimiter);
  }).join('\n');
}

// Export utilities
export {
  generateId,
  storage,
  sessionStore,
  userSession,
  validateForm,
  formatFileSize,
  sanitizeHTML,
  truncateText,
  createElement,
  debounce,
  throttle,
  copyToClipboard,
  downloadFile,
  parseCSV,
  generateCSV
};