/*
   Updates navbar based on login state (for index.html) — now backed
   by Firebase's real auth state instead of localStorage.
 */

'use strict';

import { auth, db } from './firebase-init.js';
import { onAuthStateChanged, signOut } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js';
import { doc, getDoc } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js';

onAuthStateChanged(auth, async (user) => {
  const navCta = document.querySelector('.btn-nav-cta');
  const regSection = $('register');

  if (!user) {
    return;
  }

  const profileSnap = await getDoc(doc(db, 'users', user.uid));
  if (!profileSnap.exists()) return;

  const profile = profileSnap.data();
  const dashLink = profile.role === 'buyer' ? 'buyer-dashboard.html' : 'seller-dashboard.html';

  /* ── Update navbar CTA based on login state ── */
  if (navCta) {
    navCta.href = dashLink;
    navCta.innerHTML = `<i class="fa-solid fa-${profile.role === 'buyer' ? 'bag-shopping' : 'store'}"></i> My Dashboard`;
  }

  /* ── Update Register section if user is logged in ── */
  if (regSection) {
    const formWrap = regSection.querySelector('.form-wrap');
    if (formWrap) {
      const isBuyer = profile.role === 'buyer';
      const icon = isBuyer ? 'bag-shopping' : 'store';
      const bgColor = isBuyer ? '#e8f2fa' : 'var(--green-pale)';
      const textColor = isBuyer ? '#1a5c8a' : 'var(--green)';
      const dashDesc = isBuyer
        ? 'browse products, manage your cart, and track orders.'
        : 'manage your listings, view orders, and track your sales.';

      formWrap.innerHTML = `
        <div class="logged-in-card">
          <div class="logged-in-icon" style="background:${bgColor};color:${textColor}">
            <i class="fa-solid fa-${icon}"></i>
          </div>
          <div class="logged-in-badge" style="background:${bgColor};color:${textColor}">
            <i class="fa-solid fa-circle-check"></i>
            ${isBuyer ? 'Buyer' : 'Seller'} Account Active
          </div>
          <h3 class="logged-in-title">Welcome back, ${profile.fname}!</h3>
          <p class="logged-in-desc">
            You already have a SaloneMart account. Head to your dashboard to ${dashDesc}
          </p>
          <a href="${dashLink}" class="btn-primary btn-inline-flex">
            <i class="fa-solid fa-chart-line"></i> Go to My Dashboard
          </a>
          <div class="logged-in-logout">
            <button onclick="logoutFromHome()">
              <i class="fa-solid fa-right-from-bracket"></i> Sign out
            </button>
          </div>
        </div>`;
    }
  }
});

/* ── Logout from homepage ── */
window.logoutFromHome = function () {
  signOut(auth).then(() => window.location.reload());
};
