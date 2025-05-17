// Script for the character page
import { initUI, showStatusMessage, toggleOverlay } from './navigation.js';
import { userSession, createElement, validateForm } from './utils.js';
import { getCharacters, getCharacter, createCharacter, updateCharacter, deleteCharacter, createChatSession } from './api.js';

// DOM Elements
let characterGrid;
let noCharacters;
let addCharacterBtn;
let characterMenu;
let characterMenuBtn;
let importCharacter;
let exportAllCharacters;
let sortCharacters;
let closeCharacterMenu;
let sortOptions;
let sortOptionCreated;
let sortOptionName;
let closeSortOptions;
let characterModal;
let characterForm;
let characterModalTitle;
let saveCharacterBtn;
let cancelCharacterBtn;
let closeCharacterModal;
let characterQuickView;
let closeQuickView;
let startChatWithCharacterBtn;
let editCharacterBtn;
let deleteCharacterBtn;
let addToMyCharactersBtn;
let tabMyCharacters;
let tabPublicCharacters;
let publicCharacterArea;
let publicCharactersLoading;
let publicCharactersEmptyState;
let publicCharactersErrorState;

// Current character being edited/viewed
let currentCharacter = null;

// Character form elements
let charName;
let charTagline;
let charPersonality;
let charDescription;
let charGreeting;
let charFarewell;
let charAiModel;
let charMemorySlider;
let charMemoryValue;
let charQuickReplies;
let charEmotes;
let charIsNSFW;
let charIsPublic;
let charAvatarUpload;
let charAvatarPreview;

// Initialize the page
async function initPage() {
  // Initialize UI components
  initUI();
  
  // Get DOM elements
  getElements();
  
  // Setup event listeners
  setupEventListeners();
  
  // Load user's characters
  await loadUserCharacters();
  
  // Initialize character form
  initCharacterForm();
}

// Get DOM elements
function getElements() {
  characterGrid = document.getElementById('character-grid');
  noCharacters = document.getElementById('no-characters');
  addCharacterBtn = document.getElementById('add-character-btn');
  characterMenu = document.getElementById('character-menu');
  characterMenuBtn = document.getElementById('character-menu-btn');
  importCharacter = document.getElementById('import-character');
  exportAllCharacters = document.getElementById('export-all-characters');
  sortCharacters = document.getElementById('sort-characters');
  closeCharacterMenu = document.getElementById('close-character-menu');
  sortOptions = document.getElementById('sort-options');
  sortOptionCreated = document.getElementById('sort-option-created');
  sortOptionName = document.getElementById('sort-option-name');
  closeSortOptions = document.getElementById('close-sort-options');
  characterModal = document.getElementById('character-modal');
  characterForm = document.getElementById('character-form');
  characterModalTitle = document.getElementById('character-modal-title');
  saveCharacterBtn = document.getElementById('save-character-btn');
  cancelCharacterBtn = document.getElementById('cancel-character-btn');
  closeCharacterModal = document.getElementById('close-character-modal');
  characterQuickView = document.getElementById('character-quick-view');
  closeQuickView = document.getElementById('close-quick-view');
  startChatWithCharacterBtn = document.getElementById('start-chat-with-character-btn');
  editCharacterBtn = document.getElementById('edit-character-btn-quickview');
  deleteCharacterBtn = document.getElementById('delete-character-btn-quickview');
  addToMyCharactersBtn = document.getElementById('add-to-my-characters-btn');
  tabMyCharacters = document.querySelector('.tab-btn[data-tab="my-characters"]');
  tabPublicCharacters = document.querySelector('.tab-btn[data-tab="public-characters"]');
  publicCharacterArea = document.getElementById('public-character-display-area');
  publicCharactersLoading = document.getElementById('public-characters-loading');
  publicCharactersEmptyState = document.getElementById('public-characters-empty-state');
  publicCharactersErrorState = document.getElementById('public-characters-error-state');
  
  // Character form elements
  charName = document.getElementById('char-name');
  charTagline = document.getElementById('char-tagline');
  charPersonality = document.getElementById('char-personality');
  charDescription = document.getElementById('char-description');
  charGreeting = document.getElementById('char-greeting');
  charFarewell = document.getElementById('char-farewell');
  charAiModel = document.getElementById('char-ai-model');
  charMemorySlider = document.getElementById('char-memory-slider');
  charMemoryValue = document.getElementById('char-memory-value');
  charQuickReplies = document.getElementById('char-quick-replies');
  charEmotes = document.getElementById('char-emotes');
  charIsNSFW = document.getElementById('char-is-nsfw');
  charIsPublic = document.getElementById('char-is-public');
  charAvatarUpload = document.getElementById('char-avatar-upload');
  charAvatarPreview = document.getElementById('char-avatar-preview');
}

// Setup event listeners
function setupEventListeners() {
  // Create Character button
  if (document.getElementById('create-character-btn')) {
    document.getElementById('create-character-btn').addEventListener('click', () => {
      openCharacterModal();
    });
  }
  
  // Add Character button
  if (addCharacterBtn) {
    addCharacterBtn.addEventListener('click', () => {
      openCharacterModal();
    });
  }
  
  // Character menu button
  if (characterMenuBtn) {
    characterMenuBtn.addEventListener('click', () => {
      characterMenu.classList.toggle('hidden');
      characterMenu.setAttribute('aria-hidden', characterMenu.classList.contains('hidden'));
      
      if (!characterMenu.classList.contains('hidden')) {
        toggleOverlay(true);
      }
    });
  }
  
  // Sort characters button
  if (sortCharacters) {
    sortCharacters.addEventListener('click', () => {
      characterMenu.classList.add('hidden');
      characterMenu.setAttribute('aria-hidden', 'true');
      
      sortOptions.classList.remove('hidden');
      sortOptions.setAttribute('aria-hidden', 'false');
    });
  }
  
  // Sort options
  if (sortOptionCreated) {
    sortOptionCreated.addEventListener('click', () => {
      sortCharactersByDate();
      sortOptions.classList.add('hidden');
      sortOptions.setAttribute('aria-hidden', 'true');
      toggleOverlay(false);
    });
  }
  
  if (sortOptionName) {
    sortOptionName.addEventListener('click', () => {
      sortCharactersByName();
      sortOptions.classList.add('hidden');
      sortOptions.setAttribute('aria-hidden', 'true');
      toggleOverlay(false);
    });
  }
  
  // Close sort options
  if (closeSortOptions) {
    closeSortOptions.addEventListener('click', () => {
      sortOptions.classList.add('hidden');
      sortOptions.setAttribute('aria-hidden', 'true');
      toggleOverlay(false);
    });
  }
  
  // Close character menu
  if (closeCharacterMenu) {
    closeCharacterMenu.addEventListener('click', () => {
      characterMenu.classList.add('hidden');
      characterMenu.setAttribute('aria-hidden', 'true');
      toggleOverlay(false);
    });
  }
  
  // Import character
  if (importCharacter) {
    importCharacter.addEventListener('click', () => {
      // TODO: Implement import character functionality
      showStatusMessage('Import character functionality is not implemented yet', 'warning');
      
      characterMenu.classList.add('hidden');
      characterMenu.setAttribute('aria-hidden', 'true');
      toggleOverlay(false);
    });
  }
  
  // Export all characters
  if (exportAllCharacters) {
    exportAllCharacters.addEventListener('click', () => {
      // TODO: Implement export characters functionality
      showStatusMessage('Export characters functionality is not implemented yet', 'warning');
      
      characterMenu.classList.add('hidden');
      characterMenu.setAttribute('aria-hidden', 'true');
      toggleOverlay(false);
    });
  }
  
  // Save character button
  if (saveCharacterBtn) {
    saveCharacterBtn.addEventListener('click', saveCharacter);
  }
  
  // Cancel character button
  if (cancelCharacterBtn) {
    cancelCharacterBtn.addEventListener('click', () => {
      characterModal.classList.add('hidden');
      characterModal.setAttribute('aria-hidden', 'true');
      toggleOverlay(false);
      resetCharacterForm();
    });
  }
  
  // Close character modal
  if (closeCharacterModal) {
    closeCharacterModal.addEventListener('click', () => {
      characterModal.classList.add('hidden');
      characterModal.setAttribute('aria-hidden', 'true');
      toggleOverlay(false);
      resetCharacterForm();
    });
  }
  
  // Close quick view
  if (closeQuickView) {
    closeQuickView.addEventListener('click', () => {
      characterQuickView.classList.add('hidden');
      characterQuickView.setAttribute('aria-hidden', 'true');
      toggleOverlay(false);
    });
  }
  
  // Start chat with character button
  if (startChatWithCharacterBtn) {
    startChatWithCharacterBtn.addEventListener('click', startChatWithCharacter);
  }
  
  // Edit character button
  if (editCharacterBtn) {
    editCharacterBtn.addEventListener('click', () => {
      characterQuickView.classList.add('hidden');
      characterQuickView.setAttribute('aria-hidden', 'true');
      
      openCharacterModal(currentCharacter);
    });
  }
  
  // Delete character button
  if (deleteCharacterBtn) {
    deleteCharacterBtn.addEventListener('click', deleteCurrentCharacter);
  }
  
  // Add to my characters button
  if (addToMyCharactersBtn) {
    addToMyCharactersBtn.addEventListener('click', addToMyCharacters);
  }
  
  // Tab buttons
  if (tabMyCharacters) {
    tabMyCharacters.addEventListener('click', () => {
      // Already handled by setupTabs()
      loadUserCharacters();
    });
  }
  
  if (tabPublicCharacters) {
    tabPublicCharacters.addEventListener('click', () => {
      // Already handled by setupTabs()
      loadPublicCharacters();
    });
  }
  
  // Character memory slider
  if (charMemorySlider && charMemoryValue) {
    charMemorySlider.addEventListener('input', () => {
      const value = parseInt(charMemorySlider.value);
      let label;
      
      if (value <= 2) {
        label = 'Very Weak';
      } else if (value <= 4) {
        label = 'Weak';
      } else if (value <= 6) {
        label = 'Medium';
      } else if (value <= 8) {
        label = 'Strong';
      } else {
        label = 'Very Strong';
      }
      
      charMemoryValue.textContent = label;
    });
  }
  
  // Character avatar upload
  if (charAvatarUpload && charAvatarPreview) {
    charAvatarUpload.addEventListener('change', (e) => {
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
        charAvatarPreview.src = e.target.result;
      };
      reader.readAsDataURL(file);
    });
  }
}

// Initialize character form
function initCharacterForm() {
  // Reset the form to its default state
  resetCharacterForm();
  
  // Set initial memory value label
  if (charMemorySlider && charMemoryValue) {
    charMemorySlider.value = 5;
    charMemoryValue.textContent = 'Medium';
  }
}

// Reset character form
function resetCharacterForm() {
  if (!characterForm) return;
  
  // Reset form fields
  characterForm.reset();
  
  // Reset preview image
  if (charAvatarPreview) {
    charAvatarPreview.src = '/api/placeholder/150/150';
  }
  
  // Reset memory slider
  if (charMemorySlider && charMemoryValue) {
    charMemorySlider.value = 5;
    charMemoryValue.textContent = 'Medium';
  }
  
  // Reset current character
  currentCharacter = null;
}

// Open character modal
function openCharacterModal(character = null) {
  if (!characterModal || !characterModalTitle) return;
  
  // Set modal title
  characterModalTitle.textContent = character ? 'Edit Character' : 'Add New Character';
  
  // Reset form first
  resetCharacterForm();
  
  // If editing a character, fill the form with its data
  if (character) {
    currentCharacter = character;
    
    // Set form fields
    if (charName) charName.value = character.name || '';
    if (charTagline) charTagline.value = character.tagline || '';
    if (charPersonality) charPersonality.value = character.personality || '';
    if (charDescription) charDescription.value = character.background || '';
    if (charGreeting) charGreeting.value = character.greeting || '';
    if (charFarewell) charFarewell.value = character.farewell || '';
    if (charIsNSFW) charIsNSFW.checked = character.is_nsfw || false;
    if (charIsPublic) charIsPublic.checked = character.is_public || false;
    
    // Set avatar preview
    if (charAvatarPreview && character.avatar_url) {
      charAvatarPreview.src = character.avatar_url;
    }
    
    // Set memory slider
    if (charMemorySlider && charMemoryValue) {
      const memoryStrength = character.memory_strength || 5;
      charMemorySlider.value = memoryStrength;
      
      let label;
      if (memoryStrength <= 2) {
        label = 'Very Weak';
      } else if (memoryStrength <= 4) {
        label = 'Weak';
      } else if (memoryStrength <= 6) {
        label = 'Medium';
      } else if (memoryStrength <= 8) {
        label = 'Strong';
      } else {
        label = 'Very Strong';
      }
      
      charMemoryValue.textContent = label;
    }
    
    // Set AI model
    if (charAiModel && character.ai_model) {
      charAiModel.value = character.ai_model;
    }
    
    // Set quick replies
    if (charQuickReplies && character.quick_replies) {
      if (Array.isArray(character.quick_replies)) {
        charQuickReplies.value = character.quick_replies.join(', ');
      } else {
        charQuickReplies.value = character.quick_replies;
      }
    }
    
    // Set emotes
    if (charEmotes && character.emotes) {
      if (Array.isArray(character.emotes)) {
        charEmotes.value = character.emotes.join(', ');
      } else {
        charEmotes.value = character.emotes;
      }
    }
  }
  
  // Show the modal
  characterModal.classList.remove('hidden');
  characterModal.setAttribute('aria-hidden', 'false');
  toggleOverlay(true);
}

// Save character
async function saveCharacter() {
  try {
    // Get user
    const user = userSession.getUser();
    if (!user) {
      showStatusMessage('You must be logged in to save a character', 'error');
      return;
    }
    
    // Validate form
    if (!charName || !charName.value.trim()) {
      showStatusMessage('Character name is required', 'error');
      return;
    }
    
    // Get form data
    const characterData = {
      name: charName.value.trim(),
      creator_id: user.id,
      personality: charPersonality?.value.trim() || null,
      greeting: charGreeting?.value.trim() || null,
      farewell: charFarewell?.value.trim() || null,
      background: charDescription?.value.trim() || null,
      tagline: charTagline?.value.trim() || null,
      is_nsfw: charIsNSFW?.checked || false,
      is_public: charIsPublic?.checked || false,
      ai_model: charAiModel?.value || 'gpt-3.5-turbo',
      memory_strength: parseInt(charMemorySlider?.value || 5),
    };
    
    // Quick replies (convert to array)
    if (charQuickReplies?.value.trim()) {
      characterData.quick_replies = charQuickReplies.value.split(',').map(reply => reply.trim());
    }
    
    // Emotes (convert to array)
    if (charEmotes?.value.trim()) {
      characterData.emotes = charEmotes.value.split(',').map(emote => emote.trim());
    }
    
    // Avatar (base64)
    if (charAvatarPreview && charAvatarPreview.src && !charAvatarPreview.src.includes('/api/placeholder/')) {
      characterData.avatar_url = charAvatarPreview.src;
    }
    
    let result;
    if (currentCharacter) {
      // Update existing character
      result = await updateCharacter(currentCharacter.id, characterData);
      
      if (result && !result.error) {
        showStatusMessage('Character updated successfully', 'success');
        
        // Refresh the character list
        await loadUserCharacters();
      } else {
        showStatusMessage('Failed to update character: ' + (result?.error || 'Unknown error'), 'error');
      }
    } else {
      // Create new character
      result = await createCharacter(characterData);
      
      if (result && !result.error) {
        showStatusMessage('Character created successfully', 'success');
        
        // Refresh the character list
        await loadUserCharacters();
      } else {
        showStatusMessage('Failed to create character: ' + (result?.error || 'Unknown error'), 'error');
      }
    }
    
    // Close the modal
    characterModal.classList.add('hidden');
    characterModal.setAttribute('aria-hidden', 'true');
    toggleOverlay(false);
    resetCharacterForm();
  } catch (error) {
    console.error('Error saving character:', error);
    showStatusMessage('An error occurred while saving the character', 'error');
  }
}

// Delete current character
async function deleteCurrentCharacter() {
  try {
    if (!currentCharacter) return;
    
    // Confirm deletion
    if (!confirm(`Are you sure you want to delete the character "${currentCharacter.name}"?`)) {
      return;
    }
    
    // Delete character
    const result = await deleteCharacter(currentCharacter.id);
    
    if (result && !result.error) {
      showStatusMessage('Character deleted successfully', 'success');
      
      // Refresh the character list
      await loadUserCharacters();
      
      // Close the quick view
      characterQuickView.classList.add('hidden');
      characterQuickView.setAttribute('aria-hidden', 'true');
      toggleOverlay(false);
    } else {
      showStatusMessage('Failed to delete character: ' + (result?.error || 'Unknown error'), 'error');
    }
  } catch (error) {
    console.error('Error deleting character:', error);
    showStatusMessage('An error occurred while deleting the character', 'error');
  }
}

// Start chat with character
async function startChatWithCharacter() {
  try {
    if (!currentCharacter) return;
    
    const user = userSession.getUser();
    if (!user) {
      showStatusMessage('You must be logged in to chat with a character', 'error');
      return;
    }
    
    // Create a new chat session
    const sessionData = {
      user_id: user.id,
      character_id: currentCharacter.id,
    };
    
    const result = await createChatSession(sessionData);
    
    if (result && !result.error) {
      // Navigate to the chat page
      window.location.href = `chat.html?sessionId=${result.id}`;
    } else {
      showStatusMessage('Failed to create chat session: ' + (result?.error || 'Unknown error'), 'error');
    }
  } catch (error) {
    console.error('Error starting chat:', error);
    showStatusMessage('An error occurred while starting the chat', 'error');
  }
}

// Add to my characters
async function addToMyCharacters() {
  try {
    if (!currentCharacter) return;
    
    const user = userSession.getUser();
    if (!user) {
      showStatusMessage('You must be logged in to add a character', 'error');
      return;
    }
    
    // Create a copy of the character
    const characterData = {
      name: currentCharacter.name,
      creator_id: user.id,
      personality: currentCharacter.personality,
      greeting: currentCharacter.greeting,
      farewell: currentCharacter.farewell,
      background: currentCharacter.background,
      tagline: currentCharacter.tagline,
      is_nsfw: currentCharacter.is_nsfw,
      is_public: false, // Reset public flag for the copy
      avatar_url: currentCharacter.avatar_url,
      memory_strength: currentCharacter.memory_strength,
      ai_model: currentCharacter.ai_model,
      quick_replies: currentCharacter.quick_replies,
      emotes: currentCharacter.emotes,
    };
    
    const result = await createCharacter(characterData);
    
    if (result && !result.error) {
      showStatusMessage('Character added to your collection', 'success');
      
      // Close the quick view
      characterQuickView.classList.add('hidden');
      characterQuickView.setAttribute('aria-hidden', 'true');
      toggleOverlay(false);
      
      // Switch to My Characters tab
      if (tabMyCharacters) {
        tabMyCharacters.click();
      }
    } else {
      showStatusMessage('Failed to add character: ' + (result?.error || 'Unknown error'), 'error');
    }
  } catch (error) {
    console.error('Error adding character:', error);
    showStatusMessage('An error occurred while adding the character', 'error');
  }
}

// Load user's characters
async function loadUserCharacters() {
  try {
    if (!characterGrid || !noCharacters) return;
    
    // Check if user is logged in
    const user = userSession.getUser();
    if (!user) {
      window.location.href = 'login.html';
      return;
    }
    
    // Clear character grid
    characterGrid.innerHTML = '';
    
    // Show loading indicator
    characterGrid.innerHTML = '<div class="loading-indicator"><i class="fas fa-spinner fa-spin"></i> Loading characters...</div>';
    
    // Get characters
    const characters = await getCharacters(user.id);
    
    // Clear loading indicator
    characterGrid.innerHTML = '';
    
    // Check if there are any characters
    if (!characters || characters.length === 0 || characters.error) {
      characterGrid.classList.add('hidden');
      noCharacters.classList.remove('hidden');
      return;
    }
    
    // Render characters
    noCharacters.classList.add('hidden');
    characterGrid.classList.remove('hidden');
    
    // Sort characters by creation date (most recent first)
    const sortedCharacters = [...characters].sort((a, b) => {
      return new Date(b.created_at) - new Date(a.created_at);
    });
    
    // Render each character
    sortedCharacters.forEach(character => {
      renderCharacterCard(character, characterGrid);
    });
  } catch (error) {
    console.error('Error loading characters:', error);
    characterGrid.innerHTML = '<div class="error-state">Failed to load characters. Please try again later.</div>';
  }
}

// Load public characters
async function loadPublicCharacters() {
  try {
    if (!publicCharacterArea || !publicCharactersLoading || !publicCharactersEmptyState || !publicCharactersErrorState) return;
    
    // Clear character grid
    publicCharacterArea.innerHTML = '';
    
    // Show loading indicator
    publicCharactersLoading.classList.remove('hidden');
    publicCharactersEmptyState.classList.add('hidden');
    publicCharactersErrorState.classList.add('hidden');
    
    // Get characters
    const characters = await getCharacters(null, true);
    
    // Hide loading indicator
    publicCharactersLoading.classList.add('hidden');
    
    // Check if there are any characters
    if (!characters || characters.length === 0 || characters.error) {
      publicCharactersEmptyState.classList.remove('hidden');
      publicCharactersEmptyState.innerHTML = '<i class="fas fa-users fa-4x"></i><p>No public characters available.</p>';
      return;
    }
    
    // Render characters
    publicCharactersEmptyState.classList.add('hidden');
    
    // Sort characters by popularity or creation date
    const sortedCharacters = [...characters].sort((a, b) => {
      // If like_count is available, sort by that first
      if (a.like_count !== undefined && b.like_count !== undefined) {
        return b.like_count - a.like_count;
      }
      // Fallback to creation date
      return new Date(b.created_at) - new Date(a.created_at);
    });
    
    // Render each character
    sortedCharacters.forEach(character => {
      renderCharacterCard(character, publicCharacterArea);
    });
  } catch (error) {
    console.error('Error loading public characters:', error);
    publicCharactersLoading.classList.add('hidden');
    publicCharactersErrorState.classList.remove('hidden');
    publicCharactersErrorState.innerHTML = '<i class="fas fa-exclamation-triangle"></i><p>Failed to load public characters. Please try again later.</p>';
  }
}

// Render a character card
function renderCharacterCard(character, container) {
  try {
    // Get the character card template
    const template = document.getElementById('character-card-template');
    if (!template) return;
    
    // Clone the template
    const card = document.importNode(template.content, true).querySelector('.character-card');
    
    // Set character ID
    card.setAttribute('data-character-id', character.id);
    
    // Set avatar
    const avatar = card.querySelector('.card-image img');
    if (avatar) {
      avatar.src = character.avatar_url || '/images/default-avatar.png';
      avatar.alt = `${character.name} Avatar`;
    }
    
    // Set NSFW indicator
    const nsfw = card.querySelector('.nsfw-indicator');
    if (nsfw) {
      if (character.is_nsfw) {
        nsfw.classList.remove('hidden');
      } else {
        nsfw.classList.add('hidden');
      }
    }
    
    // Set character name
    const nameElement = card.querySelector('.char-name');
    if (nameElement) {
      nameElement.textContent = character.name || 'Unknown Character';
    }
    
    // Set tagline
    const taglineElement = card.querySelector('.char-tagline');
    if (taglineElement) {
      taglineElement.textContent = character.tagline || '';
    }
    
    // Add click event to show quick view
    card.addEventListener('click', () => {
      showCharacterQuickView(character);
    });
    
    // Append the card
    container.appendChild(card);
  } catch (error) {
    console.error('Error rendering character card:', error, character);
  }
}

// Show character quick view
function showCharacterQuickView(character) {
  try {
    if (!characterQuickView) return;
    
    // Set current character
    currentCharacter = character;
    
    // Set character name
    const nameElement = document.getElementById('quick-view-name');
    if (nameElement) {
      nameElement.textContent = character.name || 'Unknown Character';
    }
    
    // Set avatar
    const avatar = document.getElementById('quick-view-avatar');
    if (avatar) {
      avatar.src = character.avatar_url || '/images/default-avatar.png';
      avatar.alt = `${character.name} Avatar`;
    }
    
    // Set tagline
    const taglineElement = document.getElementById('quick-view-tagline');
    if (taglineElement) {
      taglineElement.textContent = character.tagline || '';
    }
    
    // Set personality
    const personalityElement = document.getElementById('quick-view-personality');
    if (personalityElement) {
      personalityElement.textContent = character.personality || '';
    }
    
    // Set description
    const descriptionElement = document.getElementById('quick-view-full-description');
    if (descriptionElement) {
      descriptionElement.textContent = character.background || '';
    }
    
    // Set chat count
    const chatCountElement = document.getElementById('quick-view-chat-count');
    if (chatCountElement) {
      chatCountElement.textContent = character.chat_count || 'N/A';
    }
    
    // Set like count
    const likeCountElement = document.getElementById('quick-view-like-count');
    if (likeCountElement) {
      likeCountElement.textContent = character.like_count || 'N/A';
    }
    
    // Get user
    const user = userSession.getUser();
    
    // Show/hide buttons based on ownership
    if (editCharacterBtn && deleteCharacterBtn && addToMyCharactersBtn) {
      if (user && character.creator_id === parseInt(user.id)) {
        // User owns this character
        editCharacterBtn.classList.remove('hidden');
        deleteCharacterBtn.classList.remove('hidden');
        addToMyCharactersBtn.classList.add('hidden');
      } else {
        // User does not own this character
        editCharacterBtn.classList.add('hidden');
        deleteCharacterBtn.classList.add('hidden');
        addToMyCharactersBtn.classList.remove('hidden');
      }
    }
    
    // Show the quick view
    characterQuickView.classList.remove('hidden');
    characterQuickView.setAttribute('aria-hidden', 'false');
    toggleOverlay(true);
  } catch (error) {
    console.error('Error showing character quick view:', error, character);
  }
}

// Sort characters by date
function sortCharactersByDate() {
  try {
    if (!characterGrid) return;
    
    // Get all character cards
    const cards = Array.from(characterGrid.querySelectorAll('.character-card'));
    
    // Sort cards by data-creation-date (most recent first)
    cards.sort((a, b) => {
      const dateA = new Date(a.getAttribute('data-creation-date') || 0);
      const dateB = new Date(b.getAttribute('data-creation-date') || 0);
      return dateB - dateA;
    });
    
    // Re-append cards in sorted order
    cards.forEach(card => {
      characterGrid.appendChild(card);
    });
    
    showStatusMessage('Characters sorted by creation date', 'info');
  } catch (error) {
    console.error('Error sorting characters by date:', error);
  }
}

// Sort characters by name
function sortCharactersByName() {
  try {
    if (!characterGrid) return;
    
    // Get all character cards
    const cards = Array.from(characterGrid.querySelectorAll('.character-card'));
    
    // Sort cards by character name (A-Z)
    cards.sort((a, b) => {
      const nameA = a.querySelector('.char-name')?.textContent || '';
      const nameB = b.querySelector('.char-name')?.textContent || '';
      return nameA.localeCompare(nameB);
    });
    
    // Re-append cards in sorted order
    cards.forEach(card => {
      characterGrid.appendChild(card);
    });
    
    showStatusMessage('Characters sorted by name', 'info');
  } catch (error) {
    console.error('Error sorting characters by name:', error);
  }
}

// Initialize when document is loaded
document.addEventListener('DOMContentLoaded', initPage);