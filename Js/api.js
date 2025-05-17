// API functions for the AI Character Chat application

// Base URL for API endpoints
const BASE_URL = '';

// Check server health
async function checkServerHealth() {
  try {
    const response = await fetch(`${BASE_URL}/api/health`);
    return await response.json();
  } catch (error) {
    console.error('Server health check failed:', error);
    return { status: 'error', message: 'Could not connect to server' };
  }
}

// Check if AI API is available
async function checkAIStatus() {
  try {
    const response = await fetch(`${BASE_URL}/api/ai/status`);
    return await response.json();
  } catch (error) {
    console.error('AI API status check failed:', error);
    return { status: 'error', message: 'Could not check AI API status' };
  }
}

// Test a character response
async function testCharacterResponse(character, userMessage) {
  try {
    const response = await fetch(`${BASE_URL}/api/test-character`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ character, userMessage }),
    });
    return await response.json();
  } catch (error) {
    console.error('Character response test failed:', error);
    return { success: false, error: 'Could not generate character response' };
  }
}

// User Management
async function createUser(userData) {
  try {
    const response = await fetch(`${BASE_URL}/api/users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });
    return await response.json();
  } catch (error) {
    console.error('User creation failed:', error);
    return { error: 'Could not create user' };
  }
}

async function getUser(userId) {
  try {
    const response = await fetch(`${BASE_URL}/api/users/${userId}`);
    return await response.json();
  } catch (error) {
    console.error('User fetch failed:', error);
    return { error: 'Could not fetch user data' };
  }
}

async function updateUser(userId, userData) {
  try {
    const response = await fetch(`${BASE_URL}/api/users/${userId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });
    return await response.json();
  } catch (error) {
    console.error('User update failed:', error);
    return { error: 'Could not update user data' };
  }
}

// Character Management
async function createCharacter(characterData) {
  try {
    const response = await fetch(`${BASE_URL}/api/characters`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(characterData),
    });
    return await response.json();
  } catch (error) {
    console.error('Character creation failed:', error);
    return { error: 'Could not create character' };
  }
}

async function getCharacters(creatorId, isPublic = false) {
  try {
    let url = `${BASE_URL}/api/characters?`;
    if (creatorId) {
      url += `creatorId=${creatorId}&`;
    }
    if (isPublic) {
      url += 'isPublic=true';
    }
    
    const response = await fetch(url);
    return await response.json();
  } catch (error) {
    console.error('Characters fetch failed:', error);
    return { error: 'Could not fetch characters' };
  }
}

async function getCharacter(characterId) {
  try {
    const response = await fetch(`${BASE_URL}/api/characters/${characterId}`);
    return await response.json();
  } catch (error) {
    console.error('Character fetch failed:', error);
    return { error: 'Could not fetch character data' };
  }
}

async function updateCharacter(characterId, characterData) {
  try {
    const response = await fetch(`${BASE_URL}/api/characters/${characterId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(characterData),
    });
    return await response.json();
  } catch (error) {
    console.error('Character update failed:', error);
    return { error: 'Could not update character data' };
  }
}

async function deleteCharacter(characterId) {
  try {
    const response = await fetch(`${BASE_URL}/api/characters/${characterId}`, {
      method: 'DELETE',
    });
    return await response.json();
  } catch (error) {
    console.error('Character deletion failed:', error);
    return { error: 'Could not delete character' };
  }
}

// Chat Session Management
async function createChatSession(sessionData) {
  try {
    const response = await fetch(`${BASE_URL}/api/chat-sessions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(sessionData),
    });
    return await response.json();
  } catch (error) {
    console.error('Chat session creation failed:', error);
    return { error: 'Could not create chat session' };
  }
}

async function getChatSessions(userId) {
  try {
    const response = await fetch(`${BASE_URL}/api/chat-sessions?userId=${userId}`);
    return await response.json();
  } catch (error) {
    console.error('Chat sessions fetch failed:', error);
    return { error: 'Could not fetch chat sessions' };
  }
}

async function deleteChatSession(sessionId) {
  try {
    const response = await fetch(`${BASE_URL}/api/chat-sessions/${sessionId}`, {
      method: 'DELETE',
    });
    return await response.json();
  } catch (error) {
    console.error('Chat session deletion failed:', error);
    return { error: 'Could not delete chat session' };
  }
}

// Message Management
async function createMessage(messageData) {
  try {
    const response = await fetch(`${BASE_URL}/api/messages`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(messageData),
    });
    return await response.json();
  } catch (error) {
    console.error('Message creation failed:', error);
    return { error: 'Could not create message' };
  }
}

async function getMessages(sessionId) {
  try {
    const response = await fetch(`${BASE_URL}/api/messages?sessionId=${sessionId}`);
    return await response.json();
  } catch (error) {
    console.error('Messages fetch failed:', error);
    return { error: 'Could not fetch messages' };
  }
}

async function markMessagesAsRead(sessionId) {
  try {
    const response = await fetch(`${BASE_URL}/api/messages/read`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ sessionId }),
    });
    return await response.json();
  } catch (error) {
    console.error('Message read status update failed:', error);
    return { error: 'Could not mark messages as read' };
  }
}

// Export all API functions
export {
  checkServerHealth,
  checkAIStatus,
  testCharacterResponse,
  createUser,
  getUser,
  updateUser,
  createCharacter,
  getCharacters,
  getCharacter,
  updateCharacter,
  deleteCharacter,
  createChatSession,
  getChatSessions,
  deleteChatSession,
  createMessage,
  getMessages,
  markMessagesAsRead
};