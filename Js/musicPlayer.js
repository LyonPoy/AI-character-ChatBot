// Music player functionality for the AI Character Chat application
// Handles background music and sound effects

// Audio element for background music
let backgroundMusic;

// Sound effects objects
const soundEffects = {
  message: null,
  notification: null,
  typing: null,
  call: null
};

// Volume settings
let musicVolume = 0.3; // Default music volume (30%)
let effectsVolume = 0.5; // Default sound effects volume (50%)

// Music tracks
const musicTracks = {
  default: '/music/default-track.mp3',
  calm: '/music/calm-track.mp3',
  upbeat: '/music/upbeat-track.mp3',
  ambient: '/music/ambient-track.mp3'
};

// Sound effect paths
const effectPaths = {
  message: '/sounds/message.mp3',
  notification: '/sounds/notification.mp3',
  typing: '/sounds/typing.mp3',
  call: '/sounds/call.mp3'
};

// Current selected track
let currentTrack = 'default';

// Playback state
let isMusicEnabled = false;
let areEffectsEnabled = true;

// Initialize music player
function initMusicPlayer() {
  // Get background music element
  backgroundMusic = document.getElementById('background-music');
  
  // Check if background music element exists
  if (!backgroundMusic) {
    console.warn('Background music element not found');
    return;
  }
  
  // Set initial volume
  backgroundMusic.volume = musicVolume;
  
  // Load sound effects
  loadSoundEffects();
  
  // Check if music preference is stored
  const storedMusicEnabled = localStorage.getItem('musicEnabled');
  if (storedMusicEnabled !== null) {
    isMusicEnabled = storedMusicEnabled === 'true';
  }
  
  // Check if effects preference is stored
  const storedEffectsEnabled = localStorage.getItem('effectsEnabled');
  if (storedEffectsEnabled !== null) {
    areEffectsEnabled = storedEffectsEnabled === 'true';
  }
  
  // Auto-play based on preference
  if (isMusicEnabled) {
    playMusic();
  }
  
  // Set event listeners
  setupEventListeners();
}

// Load sound effects
function loadSoundEffects() {
  Object.keys(effectPaths).forEach(effect => {
    soundEffects[effect] = new Audio(effectPaths[effect]);
    soundEffects[effect].volume = effectsVolume;
    
    // Preload effects
    soundEffects[effect].load();
  });
}

// Setup event listeners
function setupEventListeners() {
  // Handle end of track
  if (backgroundMusic) {
    // This is already handled by the 'loop' attribute on the audio element
    backgroundMusic.addEventListener('error', (e) => {
      console.error('Music player error:', e);
    });
  }
  
  // Handle page visibility changes to pause music when tab is not visible
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      if (backgroundMusic && !backgroundMusic.paused && isMusicEnabled) {
        backgroundMusic.pause();
      }
    } else {
      if (backgroundMusic && backgroundMusic.paused && isMusicEnabled) {
        backgroundMusic.play().catch(error => {
          console.warn('Could not resume music:', error);
        });
      }
    }
  });
}

// Play background music
function playMusic() {
  if (!backgroundMusic) return;
  
  isMusicEnabled = true;
  localStorage.setItem('musicEnabled', 'true');
  
  backgroundMusic.play().catch(error => {
    console.warn('Could not play music:', error);
    isMusicEnabled = false;
    localStorage.setItem('musicEnabled', 'false');
  });
}

// Pause background music
function pauseMusic() {
  if (!backgroundMusic) return;
  
  backgroundMusic.pause();
  isMusicEnabled = false;
  localStorage.setItem('musicEnabled', 'false');
}

// Toggle background music
function toggleMusic() {
  if (!backgroundMusic) return;
  
  if (backgroundMusic.paused) {
    playMusic();
  } else {
    pauseMusic();
  }
  
  return isMusicEnabled;
}

// Set music volume (0-1)
function setMusicVolume(volume) {
  if (!backgroundMusic) return;
  
  musicVolume = Math.min(Math.max(volume, 0), 1); // Ensure volume is between 0 and 1
  backgroundMusic.volume = musicVolume;
  localStorage.setItem('musicVolume', musicVolume.toString());
}

// Enable sound effects
function enableSoundEffects() {
  areEffectsEnabled = true;
  localStorage.setItem('effectsEnabled', 'true');
}

// Disable sound effects
function disableSoundEffects() {
  areEffectsEnabled = false;
  localStorage.setItem('effectsEnabled', 'false');
}

// Toggle sound effects
function toggleSoundEffects() {
  areEffectsEnabled = !areEffectsEnabled;
  localStorage.setItem('effectsEnabled', areEffectsEnabled.toString());
  
  return areEffectsEnabled;
}

// Set sound effects volume (0-1)
function setEffectsVolume(volume) {
  effectsVolume = Math.min(Math.max(volume, 0), 1); // Ensure volume is between 0 and 1
  
  Object.values(soundEffects).forEach(effect => {
    if (effect) {
      effect.volume = effectsVolume;
    }
  });
  
  localStorage.setItem('effectsVolume', effectsVolume.toString());
}

// Change the current music track
function changeTrack(trackId) {
  if (!backgroundMusic || !musicTracks[trackId]) return false;
  
  const wasPlaying = !backgroundMusic.paused;
  
  // Update current track
  currentTrack = trackId;
  
  // Update source
  backgroundMusic.src = musicTracks[trackId];
  
  // If music was playing, resume play
  if (wasPlaying) {
    backgroundMusic.play().catch(error => {
      console.warn('Could not play music:', error);
    });
  }
  
  // Store preference
  localStorage.setItem('currentTrack', currentTrack);
  
  return true;
}

// Play a sound effect
function playSound(soundId) {
  if (!areEffectsEnabled || !soundEffects[soundId]) return;
  
  // Clone the audio to allow overlapping sounds
  const sound = soundEffects[soundId].cloneNode();
  
  sound.volume = effectsVolume;
  sound.play().catch(error => {
    console.warn(`Could not play ${soundId} sound:`, error);
  });
}

// Check if music is enabled
function isMusicOn() {
  return isMusicEnabled;
}

// Check if sound effects are enabled
function areEffectsOn() {
  return areEffectsEnabled;
}

// Get current track ID
function getCurrentTrack() {
  return currentTrack;
}

// Get available tracks
function getAvailableTracks() {
  return Object.keys(musicTracks);
}

// Initialize when document is loaded
document.addEventListener('DOMContentLoaded', initMusicPlayer);

// Export music player functions
export {
  playMusic,
  pauseMusic,
  toggleMusic,
  setMusicVolume,
  enableSoundEffects,
  disableSoundEffects,
  toggleSoundEffects,
  setEffectsVolume,
  changeTrack,
  playSound,
  isMusicOn,
  areEffectsOn,
  getCurrentTrack,
  getAvailableTracks
};