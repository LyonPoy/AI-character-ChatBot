// Main script for the index page (chat list)
import { initUI, showStatusMessage, toggleOverlay, formatRelativeTime } from './navigation.js';
import { userSession, createElement } from './utils.js';
import { getChatSessions, deleteChatSession, getCharacter } from './api.js';

// DOM elements
let chatListElement;
let noChatElement;
let menuBtn;
let mainMenu;
let chatItemContextMenu;
let deleteSession;
let archiveSession;
let closeContextMenu;
let deleteAllChats;
let exportAllChats;
let importChats;
let backupChats;
let restoreChats;
let closeMenu;
let overlay;

// Current active context menu item
let activeSessionId = null;

// Initialize the page
async function initPage() {
  // Initialize UI components
  initUI();
  
  // Get DOM elements
  chatListElement = document.getElementById('chat-list');
  noChatElement = document.getElementById('no-chats');
  menuBtn = document.getElementById('menu-btn');
  mainMenu = document.getElementById('main-menu');
  chatItemContextMenu = document.getElementById('chat-item-context-menu');
  deleteSession = document.getElementById('delete-session');
  archiveSession = document.getElementById('archive-session');
  closeContextMenu = document.getElementById('close-context-menu');
  deleteAllChats = document.getElementById('delete-all-chats');
  exportAllChats = document.getElementById('export-all-chats');
  importChats = document.getElementById('import-chats');
  backupChats = document.getElementById('backup-chats');
  restoreChats = document.getElementById('restore-chats');
  closeMenu = document.getElementById('close-menu');
  overlay = document.getElementById('overlay');
  
  // Setup event listeners
  setupEventListeners();
  
  // Load chat sessions
  await loadChatSessions();
}

// Setup event listeners
function setupEventListeners() {
  // Main menu button
  if (menuBtn) {
    menuBtn.addEventListener('click', () => {
      mainMenu.classList.toggle('hidden');
      mainMenu.setAttribute('aria-hidden', mainMenu.classList.contains('hidden'));
      
      if (!mainMenu.classList.contains('hidden')) {
        toggleOverlay(true);
      }
    });
  }
  
  // Close context menu button
  if (closeContextMenu) {
    closeContextMenu.addEventListener('click', () => {
      chatItemContextMenu.classList.add('hidden');
      chatItemContextMenu.setAttribute('aria-hidden', 'true');
      toggleOverlay(false);
    });
  }
  
  // Delete session button
  if (deleteSession) {
    deleteSession.addEventListener('click', async () => {
      if (!activeSessionId) return;
      
      try {
        await deleteChatSession(activeSessionId);
        
        // Remove the session from the UI
        const sessionElement = document.querySelector(`.chat-item[data-session-id="${activeSessionId}"]`);
        if (sessionElement) {
          sessionElement.remove();
        }
        
        // Check if there are any sessions left
        if (chatListElement.children.length === 0) {
          chatListElement.classList.add('hidden');
          noChatElement.classList.remove('hidden');
        }
        
        showStatusMessage('Chat deleted successfully', 'success');
      } catch (error) {
        console.error('Error deleting chat session:', error);
        showStatusMessage('Failed to delete chat session', 'error');
      }
      
      // Close the context menu
      chatItemContextMenu.classList.add('hidden');
      chatItemContextMenu.setAttribute('aria-hidden', 'true');
      toggleOverlay(false);
    });
  }
  
  // Archive session button
  if (archiveSession) {
    archiveSession.addEventListener('click', () => {
      // TODO: Implement archive functionality
      showStatusMessage('Archive functionality is not implemented yet', 'warning');
      
      // Close the context menu
      chatItemContextMenu.classList.add('hidden');
      chatItemContextMenu.setAttribute('aria-hidden', 'true');
      toggleOverlay(false);
    });
  }
  
  // Delete all chats button
  if (deleteAllChats) {
    deleteAllChats.addEventListener('click', () => {
      // TODO: Implement delete all functionality
      showStatusMessage('Delete all functionality is not implemented yet', 'warning');
      
      // Close the menu
      mainMenu.classList.add('hidden');
      mainMenu.setAttribute('aria-hidden', 'true');
      toggleOverlay(false);
    });
  }
  
  // Export all chats button
  if (exportAllChats) {
    exportAllChats.addEventListener('click', () => {
      // TODO: Implement export all functionality
      showStatusMessage('Export all functionality is not implemented yet', 'warning');
      
      // Close the menu
      mainMenu.classList.add('hidden');
      mainMenu.setAttribute('aria-hidden', 'true');
      toggleOverlay(false);
    });
  }
  
  // Import chats button
  if (importChats) {
    importChats.addEventListener('click', () => {
      // TODO: Implement import functionality
      showStatusMessage('Import functionality is not implemented yet', 'warning');
      
      // Close the menu
      mainMenu.classList.add('hidden');
      mainMenu.setAttribute('aria-hidden', 'true');
      toggleOverlay(false);
    });
  }
  
  // Backup chats button
  if (backupChats) {
    backupChats.addEventListener('click', () => {
      // TODO: Implement backup functionality
      showStatusMessage('Backup functionality is not implemented yet', 'warning');
      
      // Close the menu
      mainMenu.classList.add('hidden');
      mainMenu.setAttribute('aria-hidden', 'true');
      toggleOverlay(false);
    });
  }
  
  // Restore chats button
  if (restoreChats) {
    restoreChats.addEventListener('click', () => {
      // TODO: Implement restore functionality
      showStatusMessage('Restore functionality is not implemented yet', 'warning');
      
      // Close the menu
      mainMenu.classList.add('hidden');
      mainMenu.setAttribute('aria-hidden', 'true');
      toggleOverlay(false);
    });
  }
  
  // Close menu button
  if (closeMenu) {
    closeMenu.addEventListener('click', () => {
      mainMenu.classList.add('hidden');
      mainMenu.setAttribute('aria-hidden', 'true');
      toggleOverlay(false);
    });
  }
  
  // Close menus when clicking on the overlay
  if (overlay) {
    overlay.addEventListener('click', () => {
      mainMenu.classList.add('hidden');
      mainMenu.setAttribute('aria-hidden', 'true');
      chatItemContextMenu.classList.add('hidden');
      chatItemContextMenu.setAttribute('aria-hidden', 'true');
      toggleOverlay(false);
    });
  }
}

// Load chat sessions
async function loadChatSessions() {
  try {
    // Check if user is logged in
    const user = userSession.getUser();
    if (!user) {
      window.location.href = 'login.html';
      return;
    }
    
    // Show loading indicator
    chatListElement.innerHTML = '<div class="loading-indicator"><i class="fas fa-spinner fa-spin"></i> Loading chats...</div>';
    
    // Get chat sessions
    const sessions = await getChatSessions(user.id);
    
    // Clear loading indicator
    chatListElement.innerHTML = '';
    
    // Check if there are any sessions
    if (!sessions || sessions.length === 0 || sessions.error) {
      chatListElement.classList.add('hidden');
      noChatElement.classList.remove('hidden');
      return;
    }
    
    // Render chat sessions
    noChatElement.classList.add('hidden');
    chatListElement.classList.remove('hidden');
    
    // Sort sessions by last message time (most recent first)
    const sortedSessions = [...sessions].sort((a, b) => {
      return new Date(b.updated_at) - new Date(a.updated_at);
    });
    
    // Render each session
    for (const session of sortedSessions) {
      await renderChatSession(session);
    }
  } catch (error) {
    console.error('Error loading chat sessions:', error);
    chatListElement.innerHTML = '<div class="error-state">Failed to load chat sessions. Please try again later.</div>';
  }
}

// Render a chat session
async function renderChatSession(session) {
  try {
    // Get the chat item template
    const template = document.getElementById('chat-item-template');
    if (!template) return;
    
    // Clone the template
    const chatItem = document.importNode(template.content, true).querySelector('.chat-item');
    
    // Set session ID
    chatItem.setAttribute('data-session-id', session.id);
    chatItem.setAttribute('data-character-id', session.character_id);
    
    // Get character data
    const character = await getCharacter(session.character_id);
    
    // Set avatar
    const avatar = chatItem.querySelector('.avatar img');
    if (avatar) {
      avatar.src = character.avatar_url || '/images/default-avatar.png';
      avatar.alt = `${character.name} Avatar`;
    }
    
    // Set character name
    const nameElement = chatItem.querySelector('.character-name');
    if (nameElement) {
      nameElement.textContent = character.name || 'Unknown Character';
    }
    
    // Set timestamp
    const timestampElement = chatItem.querySelector('.timestamp');
    if (timestampElement) {
      timestampElement.textContent = formatRelativeTime(session.updated_at);
    }
    
    // Set last message
    const lastMessageElement = chatItem.querySelector('.last-message');
    if (lastMessageElement) {
      lastMessageElement.textContent = session.last_message || 'No messages yet';
    }
    
    // Set unread count
    const unreadCountElement = chatItem.querySelector('.unread-count');
    if (unreadCountElement) {
      if (session.unread_count && session.unread_count > 0) {
        unreadCountElement.textContent = session.unread_count;
        unreadCountElement.classList.remove('hidden');
      } else {
        unreadCountElement.classList.add('hidden');
      }
    }
    
    // Add click event to navigate to chat
    chatItem.addEventListener('click', (e) => {
      // Skip if right-click or if clicking on a button
      if (e.button === 2 || e.target.closest('button')) {
        return;
      }
      
      window.location.href = `chat.html?sessionId=${session.id}`;
    });
    
    // Add contextmenu event (right-click)
    chatItem.addEventListener('contextmenu', (e) => {
      e.preventDefault();
      
      // Set active session ID
      activeSessionId = session.id;
      
      // Position the context menu
      const rect = chatItem.getBoundingClientRect();
      const menuWidth = 200; // Estimated width
      
      // Check if menu would go off screen to the right
      let leftPos = e.clientX;
      if (leftPos + menuWidth > window.innerWidth) {
        leftPos = window.innerWidth - menuWidth - 10;
      }
      
      chatItemContextMenu.style.top = `${e.clientY}px`;
      chatItemContextMenu.style.left = `${leftPos}px`;
      
      // Show the context menu
      chatItemContextMenu.classList.remove('hidden');
      chatItemContextMenu.setAttribute('aria-hidden', 'false');
      toggleOverlay(true);
    });
    
    // Append the chat item
    chatListElement.appendChild(chatItem);
  } catch (error) {
    console.error('Error rendering chat session:', error, session);
  }
}

// Initialize when document is loaded
document.addEventListener('DOMContentLoaded', initPage);