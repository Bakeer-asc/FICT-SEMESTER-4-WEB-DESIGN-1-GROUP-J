
/* 
   Shared utilities used across all pages
 */

'use strict';

/* ── DOM Helpers ── */
const $ = (id) => document.getElementById(id);
const $$ = (sel) => document.querySelectorAll(sel);

/* ── Toast Notification ── */
let toastTimer = null;

function showToast(message, duration = 3000) {
  const toast = $('toast');
  const msg = $('toastMsg');
  if (!toast || !msg) return;

  msg.textContent = message;
  toast.classList.add('show');

  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    toast.classList.remove('show');
  }, duration);
}

/* ── Validation Helpers ── */
function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function validatePhone(phone) {
  return /^[\+\d\s\-]{7,}$/.test(phone);
}

/* ── Storage Helpers ── */
function getStoredUser() {
  return JSON.parse(localStorage.getItem('sm_current_user') || 'null');
}

function setStoredUser(user) {
  localStorage.setItem('sm_current_user', JSON.stringify(user));
}

function clearStoredUser() {
  localStorage.removeItem('sm_current_user');
}

function getStoredData(key) {
  return JSON.parse(localStorage.getItem(key) || '[]');
}

function setStoredData(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}

/* ── Format Currency ── */
function formatNLE(amount) {
  return 'NLE ' + amount.toLocaleString();
}

/* ── Logout (shared across dashboards) ── */
function logout() {
  clearStoredUser();
  window.location.href = 'auth.html';
}

/* ── Expose to global scope ── */
window.showToast = showToast;
window.logout = logout;