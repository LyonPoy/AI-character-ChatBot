// Script for the login page
import { initUI, showStatusMessage, navigateTo } from './navigation.js';
import { userSession, validateForm } from './utils.js';
import { createUser } from './api.js';

// DOM Elements
let loginForm;
let loginEmail;
let loginPassword;
let loginBtn;
let signupForm;
let signupEmail;
let signupPassword;
let signupBtn;
let anonymousLoginBtn;
let forgotPasswordLink;
let showSignupLink;
let showLoginLink;
let errorMessage;

// Initialize page
function initPage() {
  // Initialize UI components
  initUI();
  
  // Get DOM elements
  getElements();
  
  // Check if user is already logged in
  checkLoginStatus();
  
  // Setup event listeners
  setupEventListeners();
}

// Get DOM elements
function getElements() {
  loginForm = document.getElementById('login-form');
  loginEmail = document.getElementById('login-email');
  loginPassword = document.getElementById('login-password');
  loginBtn = document.getElementById('login-btn');
  signupForm = document.getElementById('signup-form');
  signupEmail = document.getElementById('signup-email');
  signupPassword = document.getElementById('signup-password');
  signupBtn = document.getElementById('signup-btn');
  anonymousLoginBtn = document.getElementById('anonymous-login-btn');
  forgotPasswordLink = document.getElementById('forgot-password-link');
  showSignupLink = document.getElementById('show-signup-link');
  showLoginLink = document.getElementById('show-login-link');
  errorMessage = document.getElementById('error-message');
}

// Check if user is already logged in
function checkLoginStatus() {
  const isLoggedIn = userSession.isLoggedIn();
  
  if (isLoggedIn) {
    // Redirect to home page
    window.location.href = 'index.html';
  }
}

// Setup event listeners
function setupEventListeners() {
  // Login form submission
  if (loginForm) {
    loginForm.addEventListener('submit', handleLogin);
  }
  
  // Signup form submission
  if (signupForm) {
    signupForm.addEventListener('submit', handleSignup);
  }
  
  // Anonymous login
  if (anonymousLoginBtn) {
    anonymousLoginBtn.addEventListener('click', handleAnonymousLogin);
  }
  
  // Forgot password link
  if (forgotPasswordLink) {
    forgotPasswordLink.addEventListener('click', (e) => {
      e.preventDefault();
      // TODO: Implement forgot password functionality
      showStatusMessage('Forgot password functionality is not implemented yet', 'warning');
    });
  }
  
  // Show signup form link
  if (showSignupLink) {
    showSignupLink.addEventListener('click', (e) => {
      e.preventDefault();
      document.getElementById('login-section').classList.add('hidden');
      document.getElementById('signup-section').classList.remove('hidden');
    });
  }
  
  // Show login form link
  if (showLoginLink) {
    showLoginLink.addEventListener('click', (e) => {
      e.preventDefault();
      document.getElementById('signup-section').classList.add('hidden');
      document.getElementById('login-section').classList.remove('hidden');
    });
  }
  
  // Social login buttons
  const socialButtons = document.querySelectorAll('.social-icon');
  socialButtons.forEach(button => {
    button.addEventListener('click', () => {
      // TODO: Implement social login functionality
      showStatusMessage('Social login functionality is not implemented yet', 'warning');
    });
  });
}

// Handle login form submission
async function handleLogin(e) {
  e.preventDefault();
  
  try {
    // Validate form
    const validation = validateForm(
      { email: loginEmail.value, password: loginPassword.value },
      {
        email: { required: true, email: true, message: 'Please enter a valid email address' },
        password: { required: true, message: 'Password is required' }
      }
    );
    
    if (!validation.isValid) {
      // Show error for the first validation error
      const firstError = Object.values(validation.errors)[0];
      showError(firstError);
      return;
    }
    
    // Clear error message
    clearError();
    
    // Disable login button
    if (loginBtn) {
      loginBtn.disabled = true;
      loginBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Logging in...';
    }
    
    // Simulate login API call
    await simulateApiCall();
    
    // Create a dummy user object (in a real app, this would come from the API)
    const user = {
      id: '1',
      email: loginEmail.value,
      name: 'User',
      avatar_url: null
    };
    
    // Save user in session
    userSession.setUser(user);
    
    // Show success message
    showStatusMessage('Login successful! Redirecting...', 'success');
    
    // Redirect to home page
    setTimeout(() => {
      window.location.href = 'index.html';
    }, 1000);
  } catch (error) {
    console.error('Login error:', error);
    showError('An error occurred during login. Please try again.');
    
    // Re-enable login button
    if (loginBtn) {
      loginBtn.disabled = false;
      loginBtn.innerHTML = 'Masuk';
    }
  }
}

// Handle signup form submission
async function handleSignup(e) {
  e.preventDefault();
  
  try {
    // Validate form
    const validation = validateForm(
      { email: signupEmail.value, password: signupPassword.value },
      {
        email: { required: true, email: true, message: 'Please enter a valid email address' },
        password: { required: true, minLength: 6, message: 'Password must be at least 6 characters' }
      }
    );
    
    if (!validation.isValid) {
      // Show error for the first validation error
      const firstError = Object.values(validation.errors)[0];
      showError(firstError);
      return;
    }
    
    // Clear error message
    clearError();
    
    // Disable signup button
    if (signupBtn) {
      signupBtn.disabled = true;
      signupBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Creating account...';
    }
    
    // Create user
    const userData = {
      email: signupEmail.value,
      password: signupPassword.value,
      name: signupEmail.value.split('@')[0], // Default name from email
    };
    
    // Simulate API call
    await simulateApiCall();
    
    // Create a dummy user object (in a real app, this would come from the API)
    const user = {
      id: '1',
      email: userData.email,
      name: userData.name,
      avatar_url: null
    };
    
    // Save user in session
    userSession.setUser(user);
    
    // Show success message
    showStatusMessage('Account created successfully! Redirecting...', 'success');
    
    // Redirect to home page
    setTimeout(() => {
      window.location.href = 'index.html';
    }, 1000);
  } catch (error) {
    console.error('Signup error:', error);
    showError('An error occurred during sign up. Please try again.');
    
    // Re-enable signup button
    if (signupBtn) {
      signupBtn.disabled = false;
      signupBtn.innerHTML = 'Daftar';
    }
  }
}

// Handle anonymous login
async function handleAnonymousLogin() {
  try {
    // Disable button
    if (anonymousLoginBtn) {
      anonymousLoginBtn.disabled = true;
      anonymousLoginBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Logging in...';
    }
    
    // Clear error message
    clearError();
    
    // Simulate API call
    await simulateApiCall();
    
    // Create a dummy anonymous user
    const user = {
      id: 'anon-' + Date.now(),
      email: 'anonymous@user.com',
      name: 'Anonymous User',
      isAnonymous: true
    };
    
    // Save user in session
    userSession.setUser(user);
    
    // Show success message
    showStatusMessage('Logged in anonymously! Redirecting...', 'success');
    
    // Redirect to home page
    setTimeout(() => {
      window.location.href = 'index.html';
    }, 1000);
  } catch (error) {
    console.error('Anonymous login error:', error);
    showError('An error occurred. Please try again.');
    
    // Re-enable button
    if (anonymousLoginBtn) {
      anonymousLoginBtn.disabled = false;
      anonymousLoginBtn.innerHTML = '👥 Anonymous';
    }
  }
}

// Simulate API call (for demo purposes)
async function simulateApiCall() {
  return new Promise(resolve => setTimeout(resolve, 1000));
}

// Show error message
function showError(message) {
  if (errorMessage) {
    errorMessage.textContent = message;
    errorMessage.classList.remove('hidden');
  }
}

// Clear error message
function clearError() {
  if (errorMessage) {
    errorMessage.textContent = '';
    errorMessage.classList.add('hidden');
  }
}

// Initialize when document is loaded
document.addEventListener('DOMContentLoaded', initPage);