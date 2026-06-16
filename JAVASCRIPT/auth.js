/*
   Login/Register logic for auth.html — now backed by real Firebase Auth.
 */

'use strict';

import { auth, db, googleProvider } from './firebase-init.js';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  updateProfile,
} from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js';
import {
  doc,
  setDoc,
  getDoc,
} from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js';

/* ── Tab Switching ── */
function switchAuthTab(tab) {
  const tabs = $$('.auth-tab');
  const forms = $$('.auth-form');

  tabs.forEach(t => t.classList.remove('active'));
  forms.forEach(f => f.classList.remove('active'));

  if (tab === 'login') {
    tabs[0].classList.add('active');
    $('loginForm').classList.add('active');
  } else {
    tabs[1].classList.add('active');
    $('registerForm').classList.add('active');
  }

  clearAuthErrors();
}

/* ── Clear Errors ── */
function clearAuthErrors() {
  $$('.auth-form input, .auth-form select').forEach(el => {
    el.classList.remove('error');
  });
  $$('.auth-form .field-error').forEach(el => {
    el.textContent = '';
  });
}

/* ── Password Toggle ── */
function togglePasswordVisibility(inputId, icon) {
  const input = $(inputId);
  if (!input) return;

  if (input.type === 'password') {
    input.type = 'text';
    icon.classList.remove('fa-eye');
    icon.classList.add('fa-eye-slash');
  } else {
    input.type = 'password';
    icon.classList.remove('fa-eye-slash');
    icon.classList.add('fa-eye');
  }
}

/* ── Helper: redirect to the right dashboard ── */
function goToDashboard(role) {
  window.location.href = role === 'seller' ? 'seller-dashboard.html' : 'buyer-dashboard.html';
}

/* ── Helper: map Firebase error codes to friendly field errors ── */
function handleAuthError(error, context) {
  const code = error.code || '';

  if (context === 'login') {
    if (code === 'auth/invalid-credential' || code === 'auth/wrong-password') {
      showFieldError('loginPassword', 'Incorrect password. Please try again.');
    } else if (code === 'auth/user-not-found') {
      showFieldError('loginEmail', 'No account found with this email. Please register first.');
    } else if (code === 'auth/invalid-email') {
      showFieldError('loginEmail', 'Please enter a valid email address.');
    } else if (code === 'auth/too-many-requests') {
      showToast('Too many attempts. Please wait a moment and try again.');
    } else {
      showToast('Sign in failed: ' + error.message);
    }
  } else if (context === 'register') {
    if (code === 'auth/email-already-in-use') {
      showFieldError('regEmail', 'This email is already registered. Please login instead.');
    } else if (code === 'auth/invalid-email') {
      showFieldError('regEmail', 'Please enter a valid email address.');
    } else if (code === 'auth/weak-password') {
      showFieldError('regPassword', 'Password must be at least 6 characters.');
    } else {
      showToast('Account creation failed: ' + error.message);
    }
  } else {
    showToast('Something went wrong: ' + error.message);
  }
}

/* ── Handle Login ── */
async function handleAuthLogin(e) {
  e.preventDefault();
  clearAuthErrors();

  const email = $('loginEmail').value.trim().toLowerCase();
  const password = $('loginPassword').value;

  let valid = true;

  if (!email) {
    showFieldError('loginEmail', 'Email is required');
    valid = false;
  } else if (!validateEmail(email)) {
    showFieldError('loginEmail', 'Please enter a valid email');
    valid = false;
  }

  if (!password) {
    showFieldError('loginPassword', 'Password is required');
    valid = false;
  }

  if (!valid) return;

  const btn = $('loginForm').querySelector('.btn-submit');
  const originalHTML = btn.innerHTML;
  btn.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i> Signing in...';
  btn.disabled = true;

  try {
    const cred = await signInWithEmailAndPassword(auth, email, password);
    const profileSnap = await getDoc(doc(db, 'users', cred.user.uid));

    if (!profileSnap.exists()) {
      showToast('Welcome back!');
      goToDashboard('buyer');
      return;
    }

    const profile = profileSnap.data();
    showToast('Welcome back, ' + profile.fname + '! 🎉');
    setTimeout(() => goToDashboard(profile.role), 600);
  } catch (error) {
    handleAuthError(error, 'login');
    btn.innerHTML = originalHTML;
    btn.disabled = false;
  }
}

/* ── Handle Register ── */
async function handleAuthRegister(e) {
  e.preventDefault();
  clearAuthErrors();

  const fname = $('regFName').value.trim();
  const lname = $('regLName').value.trim();
  const email = $('regEmail').value.trim().toLowerCase();
  const phone = $('regPhone').value.trim();
  const district = $('regDistrict').value;
  const roleInput = document.querySelector('input[name="regRole"]:checked');
  const role = roleInput ? roleInput.value : '';
  const password = $('regPassword').value;
  const agreeTerms = $('agreeTerms').checked;

  let valid = true;

  if (!fname || fname.length < 2) {
    showFieldError('regFName', 'First name is required (min 2 characters)');
    valid = false;
  }

  if (!lname || lname.length < 2) {
    showFieldError('regLName', 'Last name is required (min 2 characters)');
    valid = false;
  }

  if (!email) {
    showFieldError('regEmail', 'Email is required');
    valid = false;
  } else if (!validateEmail(email)) {
    showFieldError('regEmail', 'Please enter a valid email address');
    valid = false;
  }

  if (!phone) {
    showFieldError('regPhone', 'Phone number is required');
    valid = false;
  } else if (!validatePhone(phone)) {
    showFieldError('regPhone', 'Enter a valid phone (e.g. +232 76 123 456)');
    valid = false;
  }

  if (!district) {
    showFieldError('regDistrict', 'Please select your district');
    valid = false;
  }

  if (!role) {
    showToast('Please select whether you want to Buy or Sell');
    valid = false;
  }

  if (!password) {
    showFieldError('regPassword', 'Password is required');
    valid = false;
  } else if (password.length < 6) {
    showFieldError('regPassword', 'Password must be at least 6 characters');
    valid = false;
  }

  if (!agreeTerms) {
    showToast('Please agree to the Terms of Service');
    valid = false;
  }

  if (!valid) return;

  const btn = $('registerForm').querySelector('.btn-submit');
  const originalHTML = btn.innerHTML;
  btn.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i> Creating account...';
  btn.disabled = true;

  try {
    const cred = await createUserWithEmailAndPassword(auth, email, password);

    await updateProfile(cred.user, { displayName: `${fname} ${lname}` });

    const profile = {
      uid: cred.user.uid,
      fname,
      lname,
      email,
      phone,
      district,
      role,
      provider: 'password',
      joined: new Date().toISOString(),
    };

    await setDoc(doc(db, 'users', cred.user.uid), profile);

    showToast('Account created successfully! Welcome to SaloneMart 🎉');
    setTimeout(() => goToDashboard(role), 800);
  } catch (error) {
    handleAuthError(error, 'register');
    btn.innerHTML = originalHTML;
    btn.disabled = false;
  }
}

/*
   GOOGLE SIGN-IN
   Real Firebase popup flow — replaces the old fake modal.
   New Google users are asked for Phone + District + Buy/Sell via a small
   modal, since Firebase Auth itself has no field for that.
*/

async function socialAuth(provider) {
  if (provider !== 'google') {
    showToast('Only Google sign-in is enabled right now.');
    return;
  }

  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;

    const profileRef = doc(db, 'users', user.uid);
    const profileSnap = await getDoc(profileRef);

    if (profileSnap.exists()) {
      const profile = profileSnap.data();
      showToast('Welcome back, ' + profile.fname + '! 🎉');
      setTimeout(() => goToDashboard(profile.role), 600);
    } else {
      openGoogleProfileModal(user);
    }
  } catch (error) {
    if (error.code === 'auth/popup-closed-by-user') {
      return;
    }
    showToast('Google sign-in failed: ' + error.message);
  }
}

function openGoogleProfileModal(user) {
  let modal = $('socialAuthModal');

  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'socialAuthModal';
    modal.className = 'modal';
    document.body.appendChild(modal);
  }

  const nameParts = (user.displayName || 'Google User').split(' ');
  const fname = nameParts[0];
  const lname = nameParts.slice(1).join(' ') || 'User';

  modal.innerHTML = `
    <div class="modal-content social-modal">
      <div class="modal-header">
        <h2>
          <i class="fa-brands fa-google" style="color:#DB4437"></i>
          Finish setting up your account
        </h2>
        <button class="modal-close" onclick="closeSocialAuthModal()">
          <i class="fa-solid fa-xmark"></i>
        </button>
      </div>
      <div class="modal-body">
        <p class="social-success-msg">
          <i class="fa-solid fa-circle-check" style="color:var(--green);font-size:2rem;margin-bottom:1rem;display:block"></i>
          Signed in as ${user.email}
        </p>

        <div class="form-group">
          <label for="googlePhone"><i class="fa-solid fa-phone"></i> Phone Number</label>
          <input type="tel" id="googlePhone" placeholder="+232 76 000 000" required />
          <span class="field-error"></span>
        </div>

        <div class="form-group">
          <label for="googleDistrict"><i class="fa-solid fa-map-location-dot"></i> District</label>
          <select id="googleDistrict" required>
            <option value="">Select District</option>
            <option>Western Area (Freetown)</option>
            <option>Bo</option>
            <option>Kenema</option>
            <option>Makeni (Bombali)</option>
            <option>Kailahun</option>
            <option>Koidu (Kono)</option>
            <option>Moyamba</option>
            <option>Port Loko</option>
            <option>Pujehun</option>
            <option>Tonkolili</option>
            <option>Kambia</option>
            <option>Bonthe</option>
          </select>
          <span class="field-error"></span>
        </div>

        <div class="form-group">
          <label><i class="fa-solid fa-briefcase"></i> I want to...</label>
          <div class="role-selector">
            <label class="role-option">
              <input type="radio" name="googleRole" value="buyer" checked />
              <span><i class="fa-solid fa-bag-shopping"></i> Buy</span>
            </label>
            <label class="role-option">
              <input type="radio" name="googleRole" value="seller" />
              <span><i class="fa-solid fa-store"></i> Sell</span>
            </label>
          </div>
        </div>

        <button class="btn-submit" id="completeGoogleSetupBtn">
          <i class="fa-solid fa-rocket"></i> Complete Sign Up
        </button>
      </div>
    </div>
  `;

  modal.classList.add('active');

  $('completeGoogleSetupBtn').addEventListener('click', () => {
    completeGoogleProfile(user, fname, lname);
  });
}

async function completeGoogleProfile(user, fname, lname) {
  const phone = $('googlePhone').value.trim();
  const district = $('googleDistrict').value;
  const roleInput = document.querySelector('input[name="googleRole"]:checked');
  const role = roleInput ? roleInput.value : 'buyer';

  $$('#socialAuthModal .field-error').forEach(el => (el.textContent = ''));
  $$('#socialAuthModal input, #socialAuthModal select').forEach(el => el.classList.remove('error'));

  let valid = true;

  if (!phone) {
    showFieldError('googlePhone', 'Phone number is required');
    valid = false;
  } else if (!validatePhone(phone)) {
    showFieldError('googlePhone', 'Enter a valid phone (e.g. +232 76 123 456)');
    valid = false;
  }

  if (!district) {
    showFieldError('googleDistrict', 'Please select your district');
    valid = false;
  }

  if (!valid) return;

  const btn = $('completeGoogleSetupBtn');
  btn.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i> Saving...';
  btn.disabled = true;

  try {
    const profile = {
      uid: user.uid,
      fname,
      lname,
      email: user.email,
      phone,
      district,
      role,
      provider: 'google',
      joined: new Date().toISOString(),
    };

    await setDoc(doc(db, 'users', user.uid), profile);

    showToast('Account created via Google! Welcome 🎉');
    closeSocialAuthModal();
    setTimeout(() => goToDashboard(role), 800);
  } catch (error) {
    showToast('Could not save your profile: ' + error.message);
    btn.innerHTML = '<i class="fa-solid fa-rocket"></i> Complete Sign Up';
    btn.disabled = false;
  }
}

function closeSocialAuthModal() {
  const modal = $('socialAuthModal');
  if (modal) {
    modal.classList.remove('active');
    setTimeout(() => modal.remove(), 300);
  }
}

/* ── Field Error Helper ── */
function showFieldError(inputId, message) {
  const input = $(inputId);
  if (!input) return;

  input.classList.add('error');

  let errorEl = input.parentElement.querySelector('.field-error');
  if (!errorEl) {
    errorEl = document.createElement('span');
    errorEl.className = 'field-error';
    input.parentElement.appendChild(errorEl);
  }
  errorEl.textContent = message;
}

/* ── Expose to global scope (needed because this file is a module) ── */
window.switchAuthTab = switchAuthTab;
window.togglePasswordVisibility = togglePasswordVisibility;
window.handleAuthLogin = handleAuthLogin;
window.handleAuthRegister = handleAuthRegister;
window.socialAuth = socialAuth;
window.closeSocialAuthModal = closeSocialAuthModal;
