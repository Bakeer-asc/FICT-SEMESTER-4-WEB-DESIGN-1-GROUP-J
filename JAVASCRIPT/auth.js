

/*
   
   Login/Register logic for auth.html
 */

'use strict';

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

/* ── Handle Login ── */
function handleAuthLogin(e) {
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

  setTimeout(() => {
    const users = getStoredData('sm_users');
    const user = users.find(u => u.email.toLowerCase() === email && u.password === password);

    if (user) {
      setStoredUser(user);
      showToast('Welcome back, ' + user.fname + '! 🎉');
      
      setTimeout(() => {
        const dashLink = user.role === 'seller' ? 'seller-dashboard.html' : 'buyer-dashboard.html';
        window.location.href = dashLink;
      }, 800);
    } else {
      const emailExists = users.find(u => u.email.toLowerCase() === email);
      
      if (emailExists) {
        showFieldError('loginPassword', 'Incorrect password. Please try again.');
      } else {
        showFieldError('loginEmail', 'No account found with this email. Please register first.');
      }
      
      btn.innerHTML = originalHTML;
      btn.disabled = false;
    }
  }, 1200);
}

/* ── Handle Register ── */
function handleAuthRegister(e) {
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

  const users = getStoredData('sm_users');
  if (users.find(u => u.email.toLowerCase() === email)) {
    showFieldError('regEmail', 'This email is already registered. Please login instead.');
    return;
  }

  const btn = $('registerForm').querySelector('.btn-submit');
  const originalHTML = btn.innerHTML;
  btn.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i> Creating account...';
  btn.disabled = true;

  setTimeout(() => {
    const newUser = {
      id: Date.now(),
      fname: fname,
      lname: lname,
      email: email,
      phone: phone,
      district: district,
      role: role,
      password: password,
      joined: new Date().toISOString()
    };

    users.push(newUser);
    setStoredData('sm_users', users);
    setStoredUser(newUser);

    showToast('Account created successfully! Welcome to SaloneMart 🎉');
    
    setTimeout(() => {
      const dashLink = role === 'seller' ? 'seller-dashboard.html' : 'buyer-dashboard.html';
      window.location.href = dashLink;
    }, 1000);
  }, 1500);
}

/* 
   SOCIAL AUTH 
   */

function socialAuth(provider) {
  openSocialAuthModal(provider);
}

function openSocialAuthModal(provider) {
  let modal = $('socialAuthModal');
  
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'socialAuthModal';
    modal.className = 'modal';
    document.body.appendChild(modal);
  }

  const providerName = provider.charAt(0).toUpperCase() + provider.slice(1);
  const providerIcon = provider === 'google' ? 'fa-google' : 'fa-facebook-f';
  const providerColor = provider === 'google' ? '#DB4437' : '#4267B2';

  modal.innerHTML = `
    <div class="modal-content social-modal">
      <div class="modal-header">
        <h2>
          <i class="fa-brands ${providerIcon}" style="color:${providerColor}"></i>
          Continue with ${providerName}
        </h2>
        <button class="modal-close" onclick="closeSocialAuthModal()">
          <i class="fa-solid fa-xmark"></i>
        </button>
      </div>
      <div class="modal-body">
        <div class="social-auth-steps">
          <!-- Step 1: Loading -->
          <div class="social-step active" id="socialStep1">
            <div class="social-loading">
              <i class="fa-solid fa-circle-notch fa-spin" style="font-size:3rem;color:${providerColor}"></i>
              <p>Connecting to ${providerName}...</p>
            </div>
          </div>
          
          <!-- Step 2: Profile Completion Form -->
          <div class="social-step" id="socialStep2" style="display:none">
            <p class="social-success-msg">
              <i class="fa-solid fa-circle-check" style="color:var(--green);font-size:2rem;margin-bottom:1rem;display:block"></i>
              Successfully connected to ${providerName}!
            </p>
            
            <div class="form-group">
              <label for="socialName"><i class="fa-solid fa-user"></i> Your Full Name</label>
              <input type="text" id="socialName" placeholder="Enter your full name" required />
              <span class="field-error"></span>
            </div>
            
            <div class="form-group">
              <label for="socialEmail"><i class="fa-solid fa-envelope"></i> Email Address</label>
              <input type="email" id="socialEmail" placeholder="your.email@gmail.com" required />
              <span class="field-error"></span>
            </div>
            
            <div class="form-group">
              <label for="socialDistrict"><i class="fa-solid fa-map-location-dot"></i> District</label>
              <select id="socialDistrict" required>
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
                  <input type="radio" name="socialRole" value="buyer" checked />
                  <span><i class="fa-solid fa-bag-shopping"></i> Buy</span>
                </label>
                <label class="role-option">
                  <input type="radio" name="socialRole" value="seller" />
                  <span><i class="fa-solid fa-store"></i> Sell</span>
                </label>
              </div>
            </div>
            
            <button class="btn-submit" onclick="completeSocialAuth('${provider}')">
              <i class="fa-solid fa-rocket"></i> Complete Sign Up
            </button>
          </div>
        </div>
      </div>
    </div>
  `;

  modal.classList.add('active');

  // Show form after loading animation
  setTimeout(() => {
    $('socialStep1').style.display = 'none';
    $('socialStep2').style.display = 'block';
    
    // Generate UNIQUE email each time so it NEVER matches existing users
    const timestamp = Date.now();
    const randomNum = Math.floor(Math.random() * 9999);
    
    if (provider === 'google') {
      $('socialEmail').value = `user${timestamp}${randomNum}@gmail.com`;
    } else {
      $('socialEmail').value = `user${timestamp}${randomNum}@facebook.com`;
    }
    
    // Leave name and district EMPTY - user MUST fill them in
    $('socialName').value = '';
    $('socialDistrict').value = '';
    
    // Focus on name field
    $('socialName').focus();
  }, 2000);
}

function closeSocialAuthModal() {
  const modal = $('socialAuthModal');
  if (modal) {
    modal.classList.remove('active');
    setTimeout(() => modal.remove(), 300);
  }
}

function completeSocialAuth(provider) {
  const name = $('socialName').value.trim();
  const email = $('socialEmail').value.trim();
  const district = $('socialDistrict').value;
  const roleInput = document.querySelector('input[name="socialRole"]:checked');
  const role = roleInput ? roleInput.value : 'buyer';

  // Clear previous errors
  $$('#socialStep2 .field-error').forEach(el => el.textContent = '');
  $$('#socialStep2 input, #socialStep2 select').forEach(el => el.classList.remove('error'));

  // Validation
  let valid = true;

  if (!name || name.length < 2) {
    showFieldError('socialName', 'Please enter your full name');
    valid = false;
  }

  if (!email || !validateEmail(email)) {
    showFieldError('socialEmail', 'Please enter a valid email address');
    valid = false;
  }

  if (!district) {
    showFieldError('socialDistrict', 'Please select your district');
    valid = false;
  }

  if (!valid) return;

  // Split name into first and last
  const nameParts = name.split(' ');
  const fname = nameParts[0];
  const lname = nameParts.slice(1).join(' ') || 'User';

  // Check if email already exists
  const users = getStoredData('sm_users');
  const existingUser = users.find(u => u.email.toLowerCase() === email.toLowerCase());

  if (existingUser) {
    setStoredUser(existingUser);
    showToast('Welcome back, ' + existingUser.fname + '! 🎉');
    closeSocialAuthModal();
    
    setTimeout(() => {
      const dashLink = existingUser.role === 'seller' ? 'seller-dashboard.html' : 'buyer-dashboard.html';
      window.location.href = dashLink;
    }, 1000);
    return;
  }

  // Create new user
  const newUser = {
    id: Date.now(),
    fname: fname,
    lname: lname,
    email: email.toLowerCase(),
    phone: '+232 76 000 000',
    district: district,
    role: role,
    password: 'social_' + Date.now(),
    provider: provider,
    joined: new Date().toISOString()
  };

  users.push(newUser);
  setStoredData('sm_users', users);
  setStoredUser(newUser);

  showToast('Account created via ' + provider + '! Welcome 🎉');
  closeSocialAuthModal();

  setTimeout(() => {
    const dashLink = role === 'seller' ? 'seller-dashboard.html' : 'buyer-dashboard.html';
    window.location.href = dashLink;
  }, 1000);
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

/* ── Expose to global scope ── */
window.switchAuthTab = switchAuthTab;
window.togglePasswordVisibility = togglePasswordVisibility;
window.handleAuthLogin = handleAuthLogin;
window.handleAuthRegister = handleAuthRegister;
window.socialAuth = socialAuth;
window.closeSocialAuthModal = closeSocialAuthModal;
window.completeSocialAuth = completeSocialAuth;