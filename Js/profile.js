// Script for the profile page
import { initUI, showStatusMessage, toggleOverlay } from './navigation.js';
import { userSession } from './utils.js';
import { getUser, updateUser } from './api.js';

// DOM elements
let profileForm;
let displayName;
let pronouns;
let userBio;
let genderRadios;
let birthDate;
let communicationStyle;
let messageLength;
let interestsInput;
let interestsTags;
let goals;
let avoid;
let saveProfileBtn;
let userAvatar;
let profileAvatarUpload;
let userName;
let chatCount;
let characterCount;
let messageCount;
let privacySettingsBtn;
let privacyModal;
let signOutBtn;
let profileMenuBtn;
let profileMenu;
let exportAllData;
let darkModeToggleMenu;
let deleteAccount;
let closeProfileMenu;
let shareUsageData;
let allowNotifications;
let showOnlineStatus;
let savePrivacySettings;
let cancelPrivacyModal;
let closePrivacyModal;

// Current user data
let currentUser = null;

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
  
  // Setup event listeners
  setupEventListeners();
  
  // Load user data
  await loadUserData();
  
  // Setup tags input handler
  setupTagsInput();
}

// Get DOM elements
function getElements() {
  profileForm = document.getElementById('profile-form');
  displayName = document.getElementById('display-name');
  pronouns = document.getElementById('pronouns');
  userBio = document.getElementById('user-bio');
  genderRadios = document.getElementsByName('gender');
  birthDate = document.getElementById('birth-date');
  communicationStyle = document.getElementById('communication-style');
  messageLength = document.getElementById('message-length');
  interestsInput = document.getElementById('interests-input');
  interestsTags = document.getElementById('interests-tags');
  goals = document.getElementById('goals');
  avoid = document.getElementById('avoid');
  saveProfileBtn = document.getElementById('save-profile');
  userAvatar = document.getElementById('user-avatar');
  profileAvatarUpload = document.getElementById('profile-avatar-upload');
  userName = document.getElementById('user-name');
  chatCount = document.getElementById('chat-count');
  characterCount = document.getElementById('character-count');
  messageCount = document.getElementById('message-count');
  privacySettingsBtn = document.getElementById('privacy-settings-btn');
  privacyModal = document.getElementById('privacy-modal');
  signOutBtn = document.getElementById('sign-out-btn');
  profileMenuBtn = document.getElementById('profile-menu-btn');
  profileMenu = document.getElementById('profile-menu');
  exportAllData = document.getElementById('export-all-data');
  darkModeToggleMenu = document.getElementById('dark-mode-toggle-menu');
  deleteAccount = document.getElementById('delete-account');
  closeProfileMenu = document.getElementById('close-profile-menu');
  shareUsageData = document.getElementById('share-usage-data');
  allowNotifications = document.getElementById('allow-notifications');
  showOnlineStatus = document.getElementById('show-online-status');
  savePrivacySettings = document.getElementById('save-privacy-settings');
  cancelPrivacyModal = document.getElementById('cancel-privacy-modal');
  closePrivacyModal = document.getElementById('close-privacy-modal');
}

// Setup event listeners
function setupEventListeners() {
  // Profile form submission
  if (profileForm) {
    profileForm.addEventListener('submit', (e) => {
      e.preventDefault();
      saveProfile();
    });
  }
  
  // Avatar upload
  if (profileAvatarUpload) {
    profileAvatarUpload.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (!file) return;
      
      // Check file size (max 2MB)
      if (file.size > 2 * 1024 * 1024) {
        showStatusMessage('Avatar image is too large (max 2MB)', 'error');
        return;
      }
      
      // Check file type
      if (!file.type.startsWith('image/')) {
        showStatusMessage('Please select an image file', 'error');
        return;
      }
      
      // Preview the image
      const reader = new FileReader();
      reader.onload = (e) => {
        if (userAvatar) userAvatar.src = e.target.result;
      };
      reader.readAsDataURL(file);
    });
  }
  
  // Privacy settings button
  if (privacySettingsBtn && privacyModal) {
    privacySettingsBtn.addEventListener('click', () => {
      privacyModal.classList.remove('hidden');
      toggleOverlay(true);
    });
  }
  
  // Save privacy settings
  if (savePrivacySettings) {
    savePrivacySettings.addEventListener('click', () => {
      savePrivacyPreferences();
      privacyModal.classList.add('hidden');
      toggleOverlay(false);
    });
  }
  
  // Cancel privacy modal
  if (cancelPrivacyModal) {
    cancelPrivacyModal.addEventListener('click', () => {
      privacyModal.classList.add('hidden');
      toggleOverlay(false);
    });
  }
  
  // Close privacy modal
  if (closePrivacyModal) {
    closePrivacyModal.addEventListener('click', () => {
      privacyModal.classList.add('hidden');
      toggleOverlay(false);
    });
  }
  
  // Sign out button
  if (signOutBtn) {
    signOutBtn.addEventListener('click', () => {
      userSession.logout();
      
      // Show success message
      showStatusMessage('Logged out successfully!', 'success');
      
      // Redirect to login page
      setTimeout(() => {
        window.location.href = 'login.html';
      }, 1000);
    });
  }
  
  // Profile menu button
  if (profileMenuBtn && profileMenu) {
    profileMenuBtn.addEventListener('click', () => {
      profileMenu.classList.toggle('hidden');
      
      if (!profileMenu.classList.contains('hidden')) {
        toggleOverlay(true);
      }
    });
  }
  
  // Export all data
  if (exportAllData) {
    exportAllData.addEventListener('click', () => {
      // TODO: Implement export data functionality
      showStatusMessage('Export data functionality is not implemented yet', 'warning');
      
      profileMenu.classList.add('hidden');
      toggleOverlay(false);
    });
  }
  
  // Dark mode toggle
  if (darkModeToggleMenu) {
    darkModeToggleMenu.addEventListener('click', () => {
      // Toggle dark mode
      document.body.classList.toggle('dark-mode');
      document.body.classList.toggle('light-mode');
      
      // Save preference
      localStorage.setItem('theme', document.body.classList.contains('dark-mode') ? 'dark' : 'light');
      
      profileMenu.classList.add('hidden');
      toggleOverlay(false);
      
      showStatusMessage('Theme changed successfully', 'success');
    });
  }
  
  // Delete account
  if (deleteAccount) {
    deleteAccount.addEventListener('click', () => {
      // Ask for confirmation
      if (confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
        // TODO: Implement delete account functionality
        showStatusMessage('Delete account functionality is not implemented yet', 'warning');
      }
      
      profileMenu.classList.add('hidden');
      toggleOverlay(false);
    });
  }
  
  // Close profile menu
  if (closeProfileMenu) {
    closeProfileMenu.addEventListener('click', () => {
      profileMenu.classList.add('hidden');
      toggleOverlay(false);
    });
  }
  
  // Interests input (add tag on Enter key)
  if (interestsInput) {
    interestsInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && interestsInput.value.trim()) {
        e.preventDefault();
        addInterestTag(interestsInput.value.trim());
        interestsInput.value = '';
      }
    });
  }
}

// Setup tags input handler
function setupTagsInput() {
  if (!interestsTags) return;
  
  interestsTags.innerHTML = '';
  
  // Check if there are any stored interests
  if (currentUser && currentUser.interests && Array.isArray(currentUser.interests)) {
    currentUser.interests.forEach(interest => {
      addInterestTag(interest);
    });
  }
}

// Add interest tag
function addInterestTag(text) {
  if (!interestsTags) return;
  
  // Create tag element
  const tag = document.createElement('div');
  tag.className = 'tag';
  
  const tagText = document.createElement('span');
  tagText.textContent = text;
  
  const removeBtn = document.createElement('span');
  removeBtn.className = 'remove-tag';
  removeBtn.textContent = '×';
  removeBtn.addEventListener('click', () => {
    tag.remove();
  });
  
  tag.appendChild(tagText);
  tag.appendChild(removeBtn);
  
  interestsTags.appendChild(tag);
}

// Get all interest tags
function getInterestTags() {
  if (!interestsTags) return [];
  
  const tags = [];
  const tagElements = interestsTags.querySelectorAll('.tag');
  
  tagElements.forEach(tag => {
    const tagText = tag.querySelector('span').textContent;
    tags.push(tagText);
  });
  
  return tags;
}

// Load user data
async function loadUserData() {
  try {
    // Get user from session
    const sessionUser = userSession.getUser();
    if (!sessionUser) return;
    
    // Get user from API (in real app)
    // For this demo, we'll just use the session data with some extensions
    currentUser = {
      ...sessionUser,
      gender: 'male',
      pronouns: '',
      bio: '',
      birth_date: '',
      communication_style: 'casual',
      message_length: 'medium',
      interests: ['AI', 'Technology', 'Chat'],
      goals: '',
      avoid: '',
      chat_count: 0,
      character_count: 0,
      message_count: 0,
      privacy_settings: {
        share_usage_data: true,
        allow_notifications: false,
        show_online_status: true
      }
    };
    
    // Populate form
    populateUserData();
    
    // Update profile stats
    updateProfileStats();
  } catch (error) {
    console.error('Error loading user data:', error);
    showStatusMessage('Failed to load user data', 'error');
  }
}

// Populate user data in form
function populateUserData() {
  if (!currentUser) return;
  
  // Basic info
  if (userName) userName.textContent = currentUser.name || 'User';
  if (displayName) displayName.value = currentUser.name || '';
  if (pronouns) pronouns.value = currentUser.pronouns || '';
  if (userBio) userBio.value = currentUser.bio || '';
  if (birthDate) birthDate.value = currentUser.birth_date || '';
  
  // Avatar
  if (userAvatar && currentUser.avatar_url) {
    userAvatar.src = currentUser.avatar_url;
  }
  
  // Gender
  if (genderRadios.length > 0 && currentUser.gender) {
    for (const radio of genderRadios) {
      if (radio.value === currentUser.gender) {
        radio.checked = true;
        break;
      }
    }
  }
  
  // Preferences
  if (communicationStyle) communicationStyle.value = currentUser.communication_style || 'casual';
  if (messageLength) messageLength.value = currentUser.message_length || 'medium';
  if (goals) goals.value = currentUser.goals || '';
  if (avoid) avoid.value = currentUser.avoid || '';
  
  // Interests are handled by setupTagsInput()
  
  // Privacy settings
  const privacy = currentUser.privacy_settings || {};
  if (shareUsageData) shareUsageData.checked = privacy.share_usage_data !== false;
  if (allowNotifications) allowNotifications.checked = privacy.allow_notifications === true;
  if (showOnlineStatus) showOnlineStatus.checked = privacy.show_online_status !== false;
}

// Update profile stats
function updateProfileStats() {
  if (!currentUser) return;
  
  // Update stats
  if (chatCount) chatCount.textContent = currentUser.chat_count || 0;
  if (characterCount) characterCount.textContent = currentUser.character_count || 0;
  if (messageCount) messageCount.textContent = currentUser.message_count || 0;
}

// Save profile
async function saveProfile() {
  try {
    if (!profileForm || !currentUser) return;
    
    // Disable save button
    if (saveProfileBtn) {
      saveProfileBtn.disabled = true;
      saveProfileBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Saving...';
    }
    
    // Get form data
    const userData = {
      name: displayName ? displayName.value.trim() : currentUser.name,
      pronouns: pronouns ? pronouns.value : currentUser.pronouns,
      bio: userBio ? userBio.value.trim() : currentUser.bio,
      birth_date: birthDate ? birthDate.value : currentUser.birth_date,
      gender: '',
      communication_style: communicationStyle ? communicationStyle.value : currentUser.communication_style,
      message_length: messageLength ? messageLength.value : currentUser.message_length,
      interests: getInterestTags(),
      goals: goals ? goals.value.trim() : currentUser.goals,
      avoid: avoid ? avoid.value.trim() : currentUser.avoid
    };
    
    // Get selected gender
    if (genderRadios.length > 0) {
      for (const radio of genderRadios) {
        if (radio.checked) {
          userData.gender = radio.value;
          break;
        }
      }
    }
    
    // Get avatar if changed
    if (userAvatar && userAvatar.src && !userAvatar.src.includes('/api/placeholder/')) {
      userData.avatar_url = userAvatar.src;
    }
    
    // Update user data
    currentUser = { ...currentUser, ...userData };
    
    // Update user in session (in real app, would update via API)
    userSession.setUser(currentUser);
    
    // Show success message
    showStatusMessage('Profile saved successfully', 'success');
    
    // In a real app, we would send the update to the server
    // await updateUser(currentUser.id, userData);
    
    // Enable save button
    if (saveProfileBtn) {
      saveProfileBtn.disabled = false;
      saveProfileBtn.textContent = 'Save Profile';
    }
    
    // Update name in header
    if (userName) userName.textContent = userData.name || 'User';
  } catch (error) {
    console.error('Error saving profile:', error);
    showStatusMessage('Failed to save profile', 'error');
    
    // Enable save button
    if (saveProfileBtn) {
      saveProfileBtn.disabled = false;
      saveProfileBtn.textContent = 'Save Profile';
    }
  }
}

// Save privacy preferences
function savePrivacyPreferences() {
  if (!currentUser) return;
  
  // Get privacy settings
  const privacySettings = {
    share_usage_data: shareUsageData ? shareUsageData.checked : true,
    allow_notifications: allowNotifications ? allowNotifications.checked : false,
    show_online_status: showOnlineStatus ? showOnlineStatus.checked : true
  };
  
  // Update user data
  currentUser.privacy_settings = privacySettings;
  
  // Update user in session
  userSession.setUser(currentUser);
  
  // Show success message
  showStatusMessage('Privacy settings saved successfully', 'success');
}

// Initialize when document is loaded
document.addEventListener('DOMContentLoaded', initPage);