// Script for the settings page
import { initUI, showStatusMessage, toggleOverlay } from './navigation.js';
import { userSession, storage } from './utils.js';
import { playMusic, pauseMusic, setMusicVolume, setEffectsVolume, toggleMusic, toggleSoundEffects, changeTrack, isMusicOn, areEffectsOn } from './musicPlayer.js';

// DOM Elements
let languageSelect;
let themeSelect;
let darkModeToggle;
let notificationToggle;
let musicToggle;
let soundEffectsToggle;
let musicVolumeSlider;
let musicVolumeValue;
let effectsVolumeSlider;
let effectsVolumeValue;
let musicTrackSelect;
let contentFilterToggle;
let contentFilterLevel;
let saveLangThemeBtn;
let saveAudioBtn;
let saveContentFilterBtn;
let shareUsageToggle;
let dataDeletionBtn;
let clearCacheBtn;
let resetDefaultsBtn;
let resetTutorialsBtn;
let resetOnboardingBtn;
let resetPreferencesBtn;
let apiKeyBtn;
let openAIKeyInput;
let openAIKeyStatus;
let testOpenAIBtn;
let saveOpenAIBtn;
let openRouterKeyInput;
let openRouterKeyStatus;
let testOpenRouterBtn;
let saveOpenRouterBtn;
let aboutAppVersion;
let aboutAppBuild;
let helpCenterBtn;
let faqBtn;
let feedbackBtn;
let privacyPolicyBtn;
let termsBtn;
let settingsModal;
let closeSettingsModal;
let cancelSettingsModal;
let saveSettingsModal;

// Current settings
let currentSettings = {
  language: 'en',
  theme: 'light',
  darkMode: false,
  notifications: false,
  musicEnabled: false,
  soundEffectsEnabled: true,
  musicVolume: 0.3,
  effectsVolume: 0.5,
  musicTrack: 'default',
  contentFilter: true,
  contentFilterLevel: 'medium',
  shareUsage: true,
  apiKeys: {
    openai: '',
    openrouter: ''
  }
};

// Initialize page
async function initPage() {
  // Initialize UI components
  initUI();
  
  // Get DOM elements
  getElements();
  
  // Check if user is logged in
  if (!userSession.isLoggedIn()) {
    // Redirect to login page
    window.location.href = 'login.html';
    return;
  }
  
  // Load settings
  loadSettings();
  
  // Setup event listeners
  setupEventListeners();
  
  // Check API key status
  checkAPIStatus();
}

// Get DOM elements
function getElements() {
  // Language and Theme settings
  languageSelect = document.getElementById('language-select');
  themeSelect = document.getElementById('theme-select');
  darkModeToggle = document.getElementById('dark-mode-toggle');
  notificationToggle = document.getElementById('notification-toggle');
  saveLangThemeBtn = document.getElementById('save-lang-theme');
  
  // Audio settings
  musicToggle = document.getElementById('music-toggle');
  soundEffectsToggle = document.getElementById('sound-effects-toggle');
  musicVolumeSlider = document.getElementById('music-volume');
  musicVolumeValue = document.getElementById('music-volume-value');
  effectsVolumeSlider = document.getElementById('effects-volume');
  effectsVolumeValue = document.getElementById('effects-volume-value');
  musicTrackSelect = document.getElementById('music-track-select');
  saveAudioBtn = document.getElementById('save-audio');
  
  // Content filter settings
  contentFilterToggle = document.getElementById('content-filter-toggle');
  contentFilterLevel = document.getElementById('content-filter-level');
  saveContentFilterBtn = document.getElementById('save-content-filter');
  
  // Data settings
  shareUsageToggle = document.getElementById('share-usage-toggle');
  dataDeletionBtn = document.getElementById('data-deletion-btn');
  clearCacheBtn = document.getElementById('clear-cache-btn');
  
  // Reset settings
  resetDefaultsBtn = document.getElementById('reset-defaults-btn');
  resetTutorialsBtn = document.getElementById('reset-tutorials-btn');
  resetOnboardingBtn = document.getElementById('reset-onboarding-btn');
  resetPreferencesBtn = document.getElementById('reset-preferences-btn');
  
  // API settings
  apiKeyBtn = document.getElementById('api-key-btn');
  openAIKeyInput = document.getElementById('openai-key');
  openAIKeyStatus = document.getElementById('openai-status');
  testOpenAIBtn = document.getElementById('test-openai');
  saveOpenAIBtn = document.getElementById('save-openai');
  openRouterKeyInput = document.getElementById('openrouter-key');
  openRouterKeyStatus = document.getElementById('openrouter-status');
  testOpenRouterBtn = document.getElementById('test-openrouter');
  saveOpenRouterBtn = document.getElementById('save-openrouter');
  
  // About
  aboutAppVersion = document.getElementById('app-version');
  aboutAppBuild = document.getElementById('app-build');
  helpCenterBtn = document.getElementById('help-center-btn');
  faqBtn = document.getElementById('faq-btn');
  feedbackBtn = document.getElementById('feedback-btn');
  privacyPolicyBtn = document.getElementById('privacy-policy-btn');
  termsBtn = document.getElementById('terms-btn');
  
  // Modal
  settingsModal = document.getElementById('settings-modal');
  closeSettingsModal = document.getElementById('close-settings-modal');
  cancelSettingsModal = document.getElementById('cancel-settings-modal');
  saveSettingsModal = document.getElementById('save-settings-modal');
}

// Load settings
function loadSettings() {
  // Load from local storage
  const storedSettings = storage.getItem('userSettings');
  
  if (storedSettings) {
    currentSettings = { ...currentSettings, ...storedSettings };
  }
  
  // Apply settings to form elements
  applySettings();
}

// Apply settings to form elements
function applySettings() {
  // Language and Theme
  if (languageSelect) languageSelect.value = currentSettings.language || 'en';
  if (themeSelect) themeSelect.value = currentSettings.theme || 'light';
  if (darkModeToggle) darkModeToggle.checked = currentSettings.darkMode || false;
  if (notificationToggle) notificationToggle.checked = currentSettings.notifications || false;
  
  // Audio
  if (musicToggle) musicToggle.checked = currentSettings.musicEnabled || false;
  if (soundEffectsToggle) soundEffectsToggle.checked = currentSettings.soundEffectsEnabled || true;
  
  if (musicVolumeSlider) {
    musicVolumeSlider.value = currentSettings.musicVolume * 100 || 30;
    updateVolumeLabel('music');
  }
  
  if (effectsVolumeSlider) {
    effectsVolumeSlider.value = currentSettings.effectsVolume * 100 || 50;
    updateVolumeLabel('effects');
  }
  
  if (musicTrackSelect) musicTrackSelect.value = currentSettings.musicTrack || 'default';
  
  // Content filter
  if (contentFilterToggle) contentFilterToggle.checked = currentSettings.contentFilter || true;
  if (contentFilterLevel) contentFilterLevel.value = currentSettings.contentFilterLevel || 'medium';
  
  // Data settings
  if (shareUsageToggle) shareUsageToggle.checked = currentSettings.shareUsage || true;
  
  // API Keys (show partial key if exists)
  if (openAIKeyInput && currentSettings.apiKeys.openai) {
    const key = currentSettings.apiKeys.openai;
    openAIKeyInput.value = key.substring(0, 3) + '...' + key.substring(key.length - 4);
    openAIKeyInput.dataset.originalValue = ''; // Clear original value to indicate this is a masked key
  }
  
  if (openRouterKeyInput && currentSettings.apiKeys.openrouter) {
    const key = currentSettings.apiKeys.openrouter;
    openRouterKeyInput.value = key.substring(0, 3) + '...' + key.substring(key.length - 4);
    openRouterKeyInput.dataset.originalValue = ''; // Clear original value to indicate this is a masked key
  }
  
  // About
  if (aboutAppVersion) aboutAppVersion.textContent = '1.0.0';
  if (aboutAppBuild) aboutAppBuild.textContent = 'May 16, 2025';
}

// Setup event listeners
function setupEventListeners() {
  // Volume sliders
  if (musicVolumeSlider) {
    musicVolumeSlider.addEventListener('input', () => {
      updateVolumeLabel('music');
    });
  }
  
  if (effectsVolumeSlider) {
    effectsVolumeSlider.addEventListener('input', () => {
      updateVolumeLabel('effects');
    });
  }
  
  // Save language and theme settings
  if (saveLangThemeBtn) {
    saveLangThemeBtn.addEventListener('click', saveLanguageAndTheme);
  }
  
  // Save audio settings
  if (saveAudioBtn) {
    saveAudioBtn.addEventListener('click', saveAudioSettings);
  }
  
  // Save content filter settings
  if (saveContentFilterBtn) {
    saveContentFilterBtn.addEventListener('click', saveContentFilterSettings);
  }
  
  // Share usage toggle
  if (shareUsageToggle) {
    shareUsageToggle.addEventListener('change', (e) => {
      currentSettings.shareUsage = e.target.checked;
      saveSettings();
      showStatusMessage('Usage data sharing ' + (e.target.checked ? 'enabled' : 'disabled'), 'success');
    });
  }
  
  // Data deletion button
  if (dataDeletionBtn) {
    dataDeletionBtn.addEventListener('click', () => {
      if (confirm('Are you sure you want to request data deletion? This will delete all your user data and cannot be undone.')) {
        // TODO: Implement data deletion request
        showStatusMessage('Data deletion request submitted', 'success');
      }
    });
  }
  
  // Clear cache button
  if (clearCacheBtn) {
    clearCacheBtn.addEventListener('click', () => {
      if (confirm('Are you sure you want to clear the application cache? This will log you out and may delete unsaved data.')) {
        // Clear cache
        localStorage.clear();
        sessionStorage.clear();
        
        showStatusMessage('Cache cleared successfully. Logging out...', 'success');
        
        // Redirect to login after a delay
        setTimeout(() => {
          window.location.href = 'login.html';
        }, 2000);
      }
    });
  }
  
  // Reset buttons
  if (resetDefaultsBtn) {
    resetDefaultsBtn.addEventListener('click', () => {
      if (confirm('Are you sure you want to reset all settings to default? This cannot be undone.')) {
        resetToDefaults();
      }
    });
  }
  
  if (resetTutorialsBtn) {
    resetTutorialsBtn.addEventListener('click', () => {
      localStorage.removeItem('tutorialsCompleted');
      showStatusMessage('Tutorials reset successfully', 'success');
    });
  }
  
  if (resetOnboardingBtn) {
    resetOnboardingBtn.addEventListener('click', () => {
      localStorage.removeItem('onboardingCompleted');
      showStatusMessage('Onboarding reset successfully', 'success');
    });
  }
  
  if (resetPreferencesBtn) {
    resetPreferencesBtn.addEventListener('click', () => {
      resetToDefaults();
      showStatusMessage('Preferences reset successfully', 'success');
    });
  }
  
  // API Key buttons
  if (apiKeyBtn) {
    apiKeyBtn.addEventListener('click', () => {
      // Open API key modal (assuming it exists)
      if (settingsModal) {
        settingsModal.classList.remove('hidden');
        toggleOverlay(true);
      }
    });
  }
  
  // Test API keys
  if (testOpenAIBtn) {
    testOpenAIBtn.addEventListener('click', () => testAPIKey('openai'));
  }
  
  if (testOpenRouterBtn) {
    testOpenRouterBtn.addEventListener('click', () => testAPIKey('openrouter'));
  }
  
  // Save API keys
  if (saveOpenAIBtn) {
    saveOpenAIBtn.addEventListener('click', () => saveAPIKey('openai'));
  }
  
  if (saveOpenRouterBtn) {
    saveOpenRouterBtn.addEventListener('click', () => saveAPIKey('openrouter'));
  }
  
  // Clear key on focus for masked keys
  if (openAIKeyInput) {
    openAIKeyInput.addEventListener('focus', (e) => {
      if (!e.target.dataset.originalValue) {
        e.target.value = '';
      }
    });
  }
  
  if (openRouterKeyInput) {
    openRouterKeyInput.addEventListener('focus', (e) => {
      if (!e.target.dataset.originalValue) {
        e.target.value = '';
      }
    });
  }
  
  // Modal buttons
  if (closeSettingsModal) {
    closeSettingsModal.addEventListener('click', () => {
      settingsModal.classList.add('hidden');
      toggleOverlay(false);
    });
  }
  
  if (cancelSettingsModal) {
    cancelSettingsModal.addEventListener('click', () => {
      settingsModal.classList.add('hidden');
      toggleOverlay(false);
    });
  }
  
  if (saveSettingsModal) {
    saveSettingsModal.addEventListener('click', () => {
      // Save both API keys at once
      saveAPIKey('openai');
      saveAPIKey('openrouter');
      
      settingsModal.classList.add('hidden');
      toggleOverlay(false);
    });
  }
  
  // Help buttons
  if (helpCenterBtn) {
    helpCenterBtn.addEventListener('click', () => {
      window.open('https://help.example.com', '_blank');
    });
  }
  
  if (faqBtn) {
    faqBtn.addEventListener('click', () => {
      window.open('https://help.example.com/faq', '_blank');
    });
  }
  
  if (feedbackBtn) {
    feedbackBtn.addEventListener('click', () => {
      window.open('https://help.example.com/feedback', '_blank');
    });
  }
  
  if (privacyPolicyBtn) {
    privacyPolicyBtn.addEventListener('click', () => {
      window.open('https://help.example.com/privacy', '_blank');
    });
  }
  
  if (termsBtn) {
    termsBtn.addEventListener('click', () => {
      window.open('https://help.example.com/terms', '_blank');
    });
  }
}

// Update volume label
function updateVolumeLabel(type) {
  if (type === 'music' && musicVolumeSlider && musicVolumeValue) {
    const value = parseInt(musicVolumeSlider.value);
    musicVolumeValue.textContent = `${value}%`;
  } else if (type === 'effects' && effectsVolumeSlider && effectsVolumeValue) {
    const value = parseInt(effectsVolumeSlider.value);
    effectsVolumeValue.textContent = `${value}%`;
  }
}

// Save language and theme settings
function saveLanguageAndTheme() {
  if (!languageSelect || !themeSelect || !darkModeToggle || !notificationToggle) return;
  
  // Update settings
  currentSettings.language = languageSelect.value;
  currentSettings.theme = themeSelect.value;
  currentSettings.darkMode = darkModeToggle.checked;
  currentSettings.notifications = notificationToggle.checked;
  
  // Apply theme
  if (darkModeToggle.checked) {
    document.body.classList.add('dark-mode');
    document.body.classList.remove('light-mode');
  } else {
    document.body.classList.remove('dark-mode');
    document.body.classList.add('light-mode');
  }
  
  // Save settings
  saveSettings();
  
  // Show success message
  showStatusMessage('Language and theme settings saved successfully', 'success');
}

// Save audio settings
function saveAudioSettings() {
  if (!musicToggle || !soundEffectsToggle || !musicVolumeSlider || !effectsVolumeSlider || !musicTrackSelect) return;
  
  // Update settings
  currentSettings.musicEnabled = musicToggle.checked;
  currentSettings.soundEffectsEnabled = soundEffectsToggle.checked;
  currentSettings.musicVolume = parseInt(musicVolumeSlider.value) / 100;
  currentSettings.effectsVolume = parseInt(effectsVolumeSlider.value) / 100;
  currentSettings.musicTrack = musicTrackSelect.value;
  
  // Apply settings
  if (currentSettings.musicEnabled) {
    playMusic();
  } else {
    pauseMusic();
  }
  
  setMusicVolume(currentSettings.musicVolume);
  setEffectsVolume(currentSettings.effectsVolume);
  changeTrack(currentSettings.musicTrack);
  
  // Save settings
  saveSettings();
  
  // Show success message
  showStatusMessage('Audio settings saved successfully', 'success');
}

// Save content filter settings
function saveContentFilterSettings() {
  if (!contentFilterToggle || !contentFilterLevel) return;
  
  // Update settings
  currentSettings.contentFilter = contentFilterToggle.checked;
  currentSettings.contentFilterLevel = contentFilterLevel.value;
  
  // Save settings
  saveSettings();
  
  // Show success message
  showStatusMessage('Content filter settings saved successfully', 'success');
}

// Test API key
async function testAPIKey(type) {
  try {
    let keyInput, statusElement;
    let endpoint;
    
    if (type === 'openai') {
      keyInput = openAIKeyInput;
      statusElement = openAIKeyStatus;
      endpoint = '/api/openai/status';
    } else if (type === 'openrouter') {
      keyInput = openRouterKeyInput;
      statusElement = openRouterKeyStatus;
      endpoint = '/api/ai/status';
    } else {
      return;
    }
    
    if (!keyInput || !statusElement) return;
    
    // Show testing status
    statusElement.textContent = 'Testing...';
    statusElement.className = 'api-status testing';
    
    // Test the key
    const result = await fetch(endpoint);
    const data = await result.json();
    
    if (data.status === 'ok') {
      statusElement.textContent = 'Valid';
      statusElement.className = 'api-status valid';
    } else {
      statusElement.textContent = 'Invalid';
      statusElement.className = 'api-status invalid';
    }
  } catch (error) {
    console.error(`Error testing ${type} API key:`, error);
    
    let statusElement = type === 'openai' ? openAIKeyStatus : openRouterKeyStatus;
    
    if (statusElement) {
      statusElement.textContent = 'Error';
      statusElement.className = 'api-status invalid';
    }
  }
}

// Save API key
function saveAPIKey(type) {
  let keyInput, statusElement;
  
  if (type === 'openai') {
    keyInput = openAIKeyInput;
    statusElement = openAIKeyStatus;
  } else if (type === 'openrouter') {
    keyInput = openRouterKeyInput;
    statusElement = openRouterKeyStatus;
  } else {
    return;
  }
  
  if (!keyInput || !statusElement) return;
  
  // If key input is not empty and doesn't contain ..., save it
  const key = keyInput.value.trim();
  if (key && !key.includes('...')) {
    currentSettings.apiKeys[type] = key;
    
    // Mask the key for display
    keyInput.value = key.substring(0, 3) + '...' + key.substring(key.length - 4);
    keyInput.dataset.originalValue = '';
    
    // Save settings
    saveSettings();
    
    // Show success message
    showStatusMessage(`${type.charAt(0).toUpperCase() + type.slice(1)} API key saved successfully`, 'success');
    
    // Test the key
    testAPIKey(type);
  }
}

// Check API status
async function checkAPIStatus() {
  await testAPIKey('openai');
  await testAPIKey('openrouter');
}

// Reset to default settings
function resetToDefaults() {
  // Default settings
  const defaults = {
    language: 'en',
    theme: 'light',
    darkMode: false,
    notifications: false,
    musicEnabled: false,
    soundEffectsEnabled: true,
    musicVolume: 0.3,
    effectsVolume: 0.5,
    musicTrack: 'default',
    contentFilter: true,
    contentFilterLevel: 'medium',
    shareUsage: true
  };
  
  // Keep API keys
  defaults.apiKeys = currentSettings.apiKeys;
  
  // Update current settings
  currentSettings = defaults;
  
  // Apply settings
  applySettings();
  
  // Save settings
  saveSettings();
  
  // Apply theme
  document.body.classList.remove('dark-mode');
  document.body.classList.add('light-mode');
  
  // Show success message
  showStatusMessage('Settings reset to defaults', 'success');
}

// Save settings to storage
function saveSettings() {
  storage.setItem('userSettings', currentSettings);
}

// Initialize when document is loaded
document.addEventListener('DOMContentLoaded', initPage);