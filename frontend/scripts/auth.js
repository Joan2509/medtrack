// auth.js
import { loadProgramsForRegistration } from './programs.js';

console.log('Loading auth.js');

// Use a unified state object to keep all state in one place
export const state = {
  token: null,
  selectedClientId: null,
  selectedProgramIds: []
};

export function init() {
  console.log('Initializing app');
  state.token = localStorage.getItem('token');
  if (state.token) {
    console.log('Token found, showing main UI');
    document.getElementById('login').classList.add('hidden');
    document.getElementById('main').classList.remove('hidden');
    document.body.classList.add('logged-in');
    loadProgramsForRegistration();
  }
}

export function login() {
  console.log('Login function called');
  const password = document.getElementById('password').value;
  if (password === '123') {
    state.token = '123';
    localStorage.setItem('token', state.token);
    document.getElementById('login').classList.add('hidden');
    document.getElementById('main').classList.remove('hidden');
    document.getElementById('login-error').textContent = '';
    document.body.classList.add('logged-in');
    loadProgramsForRegistration();
    console.log('Login successful');
  } else {
    document.getElementById('login-error').textContent = 'Invalid password';
    console.log('Login failed: Invalid password');
  }
}

export function logout() {
  console.log('Logout function called');
  state.token = null;
  state.selectedClientId = null;
  state.selectedProgramIds = [];
  localStorage.removeItem('token');
  document.getElementById('login').classList.remove('hidden');
  document.getElementById('main').classList.add('hidden');
  document.getElementById('profile-modal').classList.add('hidden');
  document.getElementById('search-dropdown').classList.add('hidden');
  document.body.classList.remove('logged-in');
  console.log('Logout successful');
}

// Make functions globally accessible for inline event handlers
window.login = login;
window.logout = logout;