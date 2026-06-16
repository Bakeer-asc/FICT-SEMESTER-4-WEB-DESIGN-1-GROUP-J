
/* 
   Updates navbar based on login state (for index.html)
 */

'use strict';

(function () {
  const user = getStoredUser();

  /* ── Update navbar CTA based on login state ── */
  const navCta = document.querySelector('.btn-nav-cta');
  if (navCta && user) {
    navCta.href = user.role === 'buyer' ? 'buyer-dashboard.html' : 'seller-dashboard.html';
    navCta.innerHTML = `<i class="fa-solid fa-${user.role === 'buyer' ? 'bag-shopping' : 'store'}"></i> My Dashboard`;
  }

  /* ── Update Register section if user is logged in ── */
  const regSection = $('register');
  if (regSection && user) {
    const formWrap = regSection.querySelector('.form-wrap');
    if (formWrap) {
      const isBuyer = user.role === 'buyer';
      const dashLink = isBuyer ? 'buyer-dashboard.html' : 'seller-dashboard.html';
      const icon = isBuyer ? 'bag-shopping' : 'store';
      const bgColor = isBuyer ? '#e8f2fa' : 'var(--green-pale)';
      const textColor = isBuyer ? '#1a5c8a' : 'var(--green)';
      const btnBg = isBuyer ? '#1a5c8a' : 'var(--green)';
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
          <h3 class="logged-in-title">Welcome back, ${user.fname}!</h3>
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

  /* ── Logout from homepage ── */
  window.logoutFromHome = function () {
    clearStoredUser();
    window.location.reload();
  };
})();