// Script for the chat page
import { initUI, showStatusMessage, toggleOverlay, formatTime } from './navigation.js';
import { userSession, createElement, throttle } from './utils.js';
import { getMessages, getChatSession, getCharacter, createMessage, markMessagesAsRead } from './api.js';

// DOM Elements
let messagesContainer;
let messageInput;
let sendBtn;
let emojiBtn;
let micBtn;
let emojiPicker;
let chatMenu;
let chatMenuBtn;
let characterInfo;
let characterAvatar;
let characterName;
let characterStatus;
let quickReplyContainer;
let quickEmoteContainer;
let messageContextMenu;

// Current session and character data
let currentSession = null;
let currentCharacter = null;
let lastMessageTime = 0;
let isTyping = false;
let sessionId = null;

// Initialization
async function initPage() {
  // Initialize UI components
  initUI();
  
  // Get DOM elements
  getElements();
  
  // Get session ID from URL
  const urlParams = new URLSearchParams(window.location.search);
  sessionId = urlParams.get('sessionId');
  
  // Check if session ID is provided
  if (!sessionId) {
    showStatusMessage('No chat session specified', 'error');
    setTimeout(() => {
      window.location.href = 'index.html';
    }, 2000);
    return;
  }
  
  // Setup event listeners
  setupEventListeners();
  
  // Load chat session data
  await loadChatSession();
  
  // Load messages
  await loadMessages();
  
  // Focus message input
  if (messageInput) {
    messageInput.focus();
  }
}

// Get DOM elements
function getElements() {
  messagesContainer = document.getElementById('messages');
  messageInput = document.getElementById('message-input');
  sendBtn = document.getElementById('send-btn');
  emojiBtn = document.getElementById('emoji-btn');
  micBtn = document.getElementById('mic-btn');
  emojiPicker = document.getElementById('emoji-picker');
  chatMenu = document.getElementById('chat-menu');
  chatMenuBtn = document.getElementById('chat-menu-btn');
  characterInfo = document.getElementById('character-info');
  characterAvatar = document.getElementById('char-avatar');
  characterName = document.getElementById('char-name');
  characterStatus = document.getElementById('char-status-text');
  quickReplyContainer = document.getElementById('quick-reply-container');
  quickEmoteContainer = document.getElementById('quick-emote');
  messageContextMenu = document.getElementById('message-context-menu');
}

// Setup event listeners
function setupEventListeners() {
  // Send button
  if (sendBtn) {
    sendBtn.addEventListener('click', sendMessage);
  }
  
  // Input keypress (Enter to send)
  if (messageInput) {
    messageInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
      }
    });
    
    // Auto-resize textarea
    messageInput.addEventListener('input', () => {
      // Reset height to auto to get the correct scrollHeight
      messageInput.style.height = 'auto';
      
      // Set new height based on scrollHeight (with a max of 100px)
      const newHeight = Math.min(messageInput.scrollHeight, 100);
      messageInput.style.height = newHeight + 'px';
    });
  }
  
  // Emoji button
  if (emojiBtn && emojiPicker) {
    emojiBtn.addEventListener('click', () => {
      emojiPicker.classList.toggle('hidden');
      
      if (!emojiPicker.classList.contains('hidden')) {
        if (!emojiPicker.hasChildNodes()) {
          loadEmojis();
        }
      }
    });
  }
  
  // Mic button
  if (micBtn) {
    micBtn.addEventListener('click', startVoiceInput);
  }
  
  // Chat menu button
  if (chatMenuBtn && chatMenu) {
    chatMenuBtn.addEventListener('click', () => {
      chatMenu.classList.toggle('hidden');
      
      if (!chatMenu.classList.contains('hidden')) {
        toggleOverlay(true);
      }
    });
  }
  
  // Close chat menu
  const closeMenu = document.getElementById('close-chat-menu');
  if (closeMenu) {
    closeMenu.addEventListener('click', () => {
      chatMenu.classList.add('hidden');
      toggleOverlay(false);
    });
  }
  
  // Edit character
  const editCharacter = document.getElementById('edit-character');
  if (editCharacter) {
    editCharacter.addEventListener('click', () => {
      // Close menu
      chatMenu.classList.add('hidden');
      toggleOverlay(false);
      
      // Redirect to character page
      if (currentCharacter) {
        window.location.href = `character.html?editId=${currentCharacter.id}`;
      }
    });
  }
  
  // Clear chat
  const clearChat = document.getElementById('clear-chat');
  if (clearChat) {
    clearChat.addEventListener('click', () => {
      // Ask for confirmation
      if (confirm('Are you sure you want to clear this conversation? This cannot be undone.')) {
        // TODO: Implement clear chat functionality
        showStatusMessage('Clear chat functionality is not implemented yet', 'warning');
      }
      
      // Close menu
      chatMenu.classList.add('hidden');
      toggleOverlay(false);
    });
  }
  
  // Export chat
  const exportChat = document.getElementById('export-chat');
  if (exportChat) {
    exportChat.addEventListener('click', () => {
      // TODO: Implement export chat functionality
      showStatusMessage('Export chat functionality is not implemented yet', 'warning');
      
      // Close menu
      chatMenu.classList.add('hidden');
      toggleOverlay(false);
    });
  }
  
  // Auto TTS toggle
  const toggleAutoTTS = document.getElementById('toggle-auto-tts');
  if (toggleAutoTTS) {
    toggleAutoTTS.addEventListener('click', () => {
      const indicator = toggleAutoTTS.querySelector('.toggle-indicator');
      
      if (indicator.classList.contains('on')) {
        indicator.classList.remove('on');
        indicator.classList.add('off');
        indicator.textContent = 'OFF';
      } else {
        indicator.classList.remove('off');
        indicator.classList.add('on');
        indicator.textContent = 'ON';
      }
      
      // TODO: Implement actual TTS toggle functionality
      showStatusMessage('TTS toggle functionality is not implemented yet', 'warning');
    });
  }
  
  // Auto translate toggle
  const toggleAutoTranslate = document.getElementById('toggle-auto-translate');
  if (toggleAutoTranslate) {
    toggleAutoTranslate.addEventListener('click', () => {
      const indicator = toggleAutoTranslate.querySelector('.toggle-indicator');
      
      if (indicator.classList.contains('on')) {
        indicator.classList.remove('on');
        indicator.classList.add('off');
        indicator.textContent = 'OFF';
      } else {
        indicator.classList.remove('off');
        indicator.classList.add('on');
        indicator.textContent = 'ON';
      }
      
      // TODO: Implement actual translate toggle functionality
      showStatusMessage('Translate toggle functionality is not implemented yet', 'warning');
    });
  }
  
  // Chat settings
  const chatSettings = document.getElementById('chat-settings');
  const chatSettingsModal = document.getElementById('chat-settings-modal');
  if (chatSettings && chatSettingsModal) {
    chatSettings.addEventListener('click', () => {
      chatMenu.classList.add('hidden');
      chatSettingsModal.classList.remove('hidden');
    });
    
    // Save settings
    const saveSettings = document.getElementById('save-settings');
    if (saveSettings) {
      saveSettings.addEventListener('click', () => {
        // TODO: Implement save settings functionality
        showStatusMessage('Settings saved', 'success');
        
        chatSettingsModal.classList.add('hidden');
        toggleOverlay(false);
      });
    }
    
    // Close settings modal
    const closeSettingsModal = document.getElementById('close-settings-modal');
    if (closeSettingsModal) {
      closeSettingsModal.addEventListener('click', () => {
        chatSettingsModal.classList.add('hidden');
        toggleOverlay(false);
      });
    }
  }
  
  // Call button
  const callBtn = document.getElementById('call-btn');
  const callModal = document.getElementById('call-modal');
  if (callBtn && callModal) {
    callBtn.addEventListener('click', () => {
      // Set call info
      const callAvatar = document.getElementById('call-avatar');
      const callName = document.getElementById('call-name');
      if (callAvatar && characterAvatar) {
        callAvatar.src = characterAvatar.src;
      }
      if (callName && characterName) {
        callName.textContent = characterName.textContent;
      }
      
      // Show call modal
      callModal.classList.remove('hidden');
      toggleOverlay(true);
      
      // Simulate call connecting
      const callStatus = document.getElementById('call-status');
      if (callStatus) {
        setTimeout(() => {
          callStatus.textContent = 'Connected';
        }, 2000);
      }
    });
    
    // End call button
    const endCall = document.getElementById('end-call');
    if (endCall) {
      endCall.addEventListener('click', () => {
        callModal.classList.add('hidden');
        toggleOverlay(false);
      });
    }
  }
  
  // Quick emote buttons
  const emoteButtons = document.querySelectorAll('.emote-btn');
  emoteButtons.forEach(button => {
    button.addEventListener('click', () => {
      const emote = button.textContent;
      sendEmote(emote);
    });
  });
  
  // Setup message context menu
  if (messagesContainer && messageContextMenu) {
    // Right-click on message
    messagesContainer.addEventListener('contextmenu', (e) => {
      const messageEl = e.target.closest('.message-container');
      if (!messageEl) return;
      
      e.preventDefault();
      
      // Position the context menu
      messageContextMenu.style.top = `${e.clientY}px`;
      messageContextMenu.style.left = `${e.clientX}px`;
      
      // Show the context menu
      messageContextMenu.classList.remove('hidden');
      toggleOverlay(true);
      
      // Store the message element for actions
      messageContextMenu.dataset.messageId = messageEl.dataset.messageId;
    });
    
    // Copy message button
    const copyMessage = document.getElementById('copy-message');
    if (copyMessage) {
      copyMessage.addEventListener('click', () => {
        const messageId = messageContextMenu.dataset.messageId;
        const messageEl = document.querySelector(`.message-container[data-message-id="${messageId}"]`);
        
        if (messageEl) {
          const text = messageEl.querySelector('.message-text').textContent;
          navigator.clipboard.writeText(text)
            .then(() => {
              showStatusMessage('Message copied to clipboard', 'success');
            })
            .catch(() => {
              showStatusMessage('Failed to copy message', 'error');
            });
        }
        
        messageContextMenu.classList.add('hidden');
        toggleOverlay(false);
      });
    }
    
    // Close message context menu
    const closeMessageMenu = document.getElementById('close-message-menu');
    if (closeMessageMenu) {
      closeMessageMenu.addEventListener('click', () => {
        messageContextMenu.classList.add('hidden');
        toggleOverlay(false);
      });
    }
  }
  
  // Listen for scroll to load more messages
  messagesContainer.addEventListener('scroll', throttle(() => {
    if (messagesContainer.scrollTop === 0) {
      // TODO: Implement load more messages functionality
      console.log('Load more messages');
    }
  }, 200));
}

// Load chat session data
async function loadChatSession() {
  try {
    if (!sessionId) return;
    
    // Get session data
    const session = await getChatSession(sessionId);
    
    if (!session || session.error) {
      showStatusMessage('Failed to load chat session', 'error');
      return;
    }
    
    currentSession = session;
    
    // Get character data
    const character = await getCharacter(session.character_id);
    
    if (!character || character.error) {
      showStatusMessage('Failed to load character data', 'error');
      return;
    }
    
    currentCharacter = character;
    
    // Update character info
    updateCharacterInfo();
    
    // Mark messages as read
    await markMessagesAsRead(sessionId);
  } catch (error) {
    console.error('Error loading chat session:', error);
    showStatusMessage('An error occurred while loading the chat session', 'error');
  }
}

// Update character info in header
function updateCharacterInfo() {
  if (!currentCharacter) return;
  
  // Set avatar
  if (characterAvatar) {
    characterAvatar.src = currentCharacter.avatar_url || '/images/default-avatar.png';
    characterAvatar.alt = `${currentCharacter.name} Avatar`;
  }
  
  // Set name
  if (characterName) {
    characterName.textContent = currentCharacter.name || 'Unknown Character';
  }
  
  // Set status
  if (characterStatus) {
    characterStatus.textContent = 'online'; // Default status
  }
}

// Load messages
async function loadMessages() {
  try {
    if (!sessionId || !messagesContainer) return;
    
    // Show loading indicator
    messagesContainer.innerHTML = '<div class="loading-indicator"><i class="fas fa-spinner fa-spin"></i> Loading messages...</div>';
    
    // Get messages
    const messages = await getMessages(sessionId);
    
    // Clear loading indicator
    messagesContainer.innerHTML = '';
    
    if (!messages || messages.error) {
      messagesContainer.innerHTML = '<div class="error-state">Failed to load messages. Please try again later.</div>';
      return;
    }
    
    // If no messages, show greeting
    if (messages.length === 0 && currentCharacter && currentCharacter.greeting) {
      // Add character greeting as first message
      const greeting = {
        id: 'greeting',
        session_id: sessionId,
        sender_id: currentCharacter.id,
        is_character: true,
        content: currentCharacter.greeting,
        created_at: new Date().toISOString()
      };
      
      renderMessage(greeting);
      
      // Show quick replies if available
      if (currentCharacter.quick_replies && currentCharacter.quick_replies.length > 0) {
        showQuickReplies(currentCharacter.quick_replies);
      }
      
      return;
    }
    
    // Sort messages by timestamp
    const sortedMessages = [...messages].sort((a, b) => {
      return new Date(a.created_at) - new Date(b.created_at);
    });
    
    // Render messages
    sortedMessages.forEach(message => {
      renderMessage(message);
    });
    
    // Scroll to bottom
    scrollToBottom();
  } catch (error) {
    console.error('Error loading messages:', error);
    if (messagesContainer) {
      messagesContainer.innerHTML = '<div class="error-state">An error occurred while loading messages. Please try again later.</div>';
    }
  }
}

// Render a message
function renderMessage(message) {
  if (!messagesContainer) return;
  
  // Get template
  const isCharacterMessage = message.is_character;
  const templateId = isCharacterMessage ? 'character-message-template' : 'user-message-template';
  const template = document.getElementById(templateId);
  
  if (!template) return;
  
  // Clone template
  const messageElement = document.importNode(template.content, true).querySelector('.message-container');
  
  // Set message ID
  messageElement.setAttribute('data-message-id', message.id);
  
  // Set message text
  const messageText = messageElement.querySelector('.message-text');
  if (messageText) {
    messageText.textContent = message.content;
  }
  
  // Set timestamp
  const timestamp = messageElement.querySelector('.timestamp');
  if (timestamp) {
    timestamp.textContent = formatTime(message.created_at);
  }
  
  // If character message, set avatar
  if (isCharacterMessage && currentCharacter) {
    const avatar = messageElement.querySelector('.avatar img');
    if (avatar) {
      avatar.src = currentCharacter.avatar_url || '/images/default-avatar.png';
      avatar.alt = `${currentCharacter.name} Avatar`;
    }
  }
  
  // Add to container
  messagesContainer.appendChild(messageElement);
  
  // Update last message time
  lastMessageTime = new Date(message.created_at).getTime();
  
  // Scroll to bottom
  scrollToBottom();
}

// Send a message
async function sendMessage() {
  try {
    if (!messageInput || !messageInput.value.trim()) return;
    
    const user = userSession.getUser();
    if (!user) {
      showStatusMessage('You must be logged in to send messages', 'error');
      return;
    }
    
    const content = messageInput.value.trim();
    messageInput.value = '';
    messageInput.style.height = 'auto';
    
    // Hide quick replies and emotes
    if (quickReplyContainer) {
      quickReplyContainer.classList.add('hidden');
    }
    if (quickEmoteContainer) {
      quickEmoteContainer.classList.add('hidden');
    }
    
    // Create message object
    const message = {
      session_id: parseInt(sessionId),
      sender_id: parseInt(user.id),
      is_character: false,
      content: content,
      created_at: new Date().toISOString()
    };
    
    // Add message to UI immediately
    renderMessage(message);
    
    // Send message to API
    const result = await createMessage(message);
    
    if (result && !result.error) {
      // Update the temporary message with the actual ID
      const tempMessage = messagesContainer.lastElementChild;
      if (tempMessage) {
        tempMessage.setAttribute('data-message-id', result.id);
      }
      
      // Simulate character typing
      simulateCharacterTyping();
      
      // Generate character response
      setTimeout(() => {
        generateCharacterResponse(content);
      }, 1000);
    } else {
      showStatusMessage('Failed to send message', 'error');
    }
  } catch (error) {
    console.error('Error sending message:', error);
    showStatusMessage('An error occurred while sending the message', 'error');
  }
}

// Simulate character typing
function simulateCharacterTyping() {
  if (!characterStatus) return;
  
  isTyping = true;
  characterStatus.textContent = 'typing...';
  
  // Add typing indicator to messages
  if (messagesContainer) {
    const typingElement = document.createElement('div');
    typingElement.className = 'message-container character-message typing-indicator';
    typingElement.innerHTML = `
      <div class="avatar small">
        <img src="${currentCharacter?.avatar_url || '/images/default-avatar.png'}" alt="Character Avatar">
      </div>
      <div class="message typing">
        <div class="dots">
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
    `;
    
    messagesContainer.appendChild(typingElement);
    scrollToBottom();
  }
}

// Stop character typing
function stopCharacterTyping() {
  if (!characterStatus) return;
  
  isTyping = false;
  characterStatus.textContent = 'online';
  
  // Remove typing indicator
  const typingIndicator = messagesContainer.querySelector('.typing-indicator');
  if (typingIndicator) {
    typingIndicator.remove();
  }
}

// Generate character response
async function generateCharacterResponse(userMessage) {
  try {
    if (!currentCharacter) return;
    
    // In a real app, this would call the AI API
    // For this demo, we'll use a simple response simulation
    
    // Create dummy response data
    const responseContent = await simulatedAIResponse(userMessage);
    
    // Create message object
    const message = {
      id: Date.now().toString(), // Temporary ID
      session_id: parseInt(sessionId),
      sender_id: currentCharacter.id,
      is_character: true,
      content: responseContent,
      created_at: new Date().toISOString()
    };
    
    // Stop typing indicator
    stopCharacterTyping();
    
    // Add message to UI
    renderMessage(message);
    
    // Randomly show quick replies or emotes
    if (Math.random() > 0.5 && currentCharacter.quick_replies) {
      showQuickReplies(currentCharacter.quick_replies);
    } else if (Math.random() > 0.7) {
      showQuickEmotes();
    }
  } catch (error) {
    console.error('Error generating character response:', error);
    stopCharacterTyping();
    showStatusMessage('Failed to generate character response', 'error');
  }
}

// Simulated AI response for demo purposes
async function simulatedAIResponse(userMessage) {
  // In a real app, this would call the AI API
  // For this demo, we'll use a simple response simulation
  
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // Simple responses based on user input
  const responses = [
    `I understand what you're saying about "${userMessage.substring(0, 20)}..." That's an interesting perspective.`,
    `I'm not sure I fully agree with your point about "${userMessage.substring(0, 20)}..." Let me think about it.`,
    `Thanks for sharing that! I've been thinking about similar things lately.`,
    `That's fascinating! I'd love to hear more about your thoughts on this topic.`,
    `I've been considering something similar. What made you think about this?`,
    `I appreciate you sharing that with me. It helps me understand you better.`,
    `I'm curious to know more about what led you to that conclusion?`,
    `That's a really good point! I hadn't thought about it that way before.`
  ];
  
  // Pick a random response
  const randomIndex = Math.floor(Math.random() * responses.length);
  return responses[randomIndex];
}

// Send an emote
function sendEmote(emote) {
  if (!messageInput) return;
  
  messageInput.value = emote;
  sendMessage();
}

// Show quick replies
function showQuickReplies(replies) {
  if (!quickReplyContainer) return;
  
  // Clear existing quick replies
  quickReplyContainer.innerHTML = '';
  
  // Process replies
  let replyList = replies;
  if (typeof replies === 'string') {
    replyList = replies.split(',').map(reply => reply.trim());
  }
  
  // Create quick reply buttons
  replyList.forEach(reply => {
    const template = document.getElementById('quick-reply-template');
    if (!template) return;
    
    const replyButton = document.importNode(template.content, true).querySelector('.quick-reply-btn');
    replyButton.textContent = reply;
    
    replyButton.addEventListener('click', () => {
      if (messageInput) {
        messageInput.value = reply;
        sendMessage();
      }
    });
    
    quickReplyContainer.appendChild(replyButton);
  });
  
  // Show container
  quickReplyContainer.classList.remove('hidden');
}

// Show quick emotes
function showQuickEmotes() {
  if (!quickEmoteContainer) return;
  
  // Show container
  quickEmoteContainer.classList.remove('hidden');
}

// Load emojis for emoji picker
function loadEmojis() {
  if (!emojiPicker) return;
  
  const emojiGrid = emojiPicker.querySelector('.emoji-grid');
  if (!emojiGrid) return;
  
  // Common emojis
  const emojis = [
    '😀', '😁', '😂', '🤣', '😃', '😄', '😅', '😆', '😉', '😊',
    '😋', '😎', '😍', '🥰', '😘', '😗', '😙', '😚', '🙂', '🤗',
    '🤔', '🤨', '😐', '😑', '😶', '🙄', '😏', '😣', '😥', '😮',
    '🤐', '😯', '😪', '😫', '😴', '😌', '😛', '😜', '😝', '🤤',
    '😒', '😓', '😔', '😕', '🙃', '🤑', '😲', '☹️', '🙁', '😖',
    '😞', '😟', '😤', '😢', '😭', '😦', '😧', '😨', '😩', '🤯',
    '😬', '😰', '😱', '😳', '🥵', '🥶', '😇', '🤠', '🤡', '🥳',
    '🥴', '🥺', '🤥', '🤫', '🤭', '🧐', '🤓', '😈', '👿', '👹',
    '👺', '💀', '👻', '👽', '🤖', '💩', '😺', '😸', '😹', '😻'
  ];
  
  // Create emoji buttons
  emojis.forEach(emoji => {
    const button = document.createElement('button');
    button.className = 'emoji-item';
    button.textContent = emoji;
    
    button.addEventListener('click', () => {
      if (messageInput) {
        messageInput.value += emoji;
        messageInput.focus();
      }
      
      emojiPicker.classList.add('hidden');
    });
    
    emojiGrid.appendChild(button);
  });
}

// Start voice input
function startVoiceInput() {
  if (!messageInput) return;
  
  // Check if browser supports speech recognition
  if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
    showStatusMessage('Speech recognition is not supported in this browser', 'error');
    return;
  }
  
  // Create speech recognition object
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  const recognition = new SpeechRecognition();
  
  recognition.lang = 'en-US';
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;
  
  // Update UI to show recording
  micBtn.classList.add('recording');
  showStatusMessage('Listening...', 'info');
  
  recognition.start();
  
  recognition.onresult = (event) => {
    const speechResult = event.results[0][0].transcript;
    messageInput.value = speechResult;
    micBtn.classList.remove('recording');
  };
  
  recognition.onerror = (event) => {
    console.error('Speech recognition error', event.error);
    showStatusMessage(`Speech recognition error: ${event.error}`, 'error');
    micBtn.classList.remove('recording');
  };
  
  recognition.onend = () => {
    micBtn.classList.remove('recording');
  };
}

// Scroll to the bottom of the messages container
function scrollToBottom() {
  if (messagesContainer) {
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }
}

// Initialize when document is loaded
document.addEventListener('DOMContentLoaded', initPage);