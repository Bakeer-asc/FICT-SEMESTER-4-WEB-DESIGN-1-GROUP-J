
/* 
   
   Navbar scroll, mobile menu, search, active links
 */

'use strict';

/* ── NAVBAR — scroll behavior ── */
const navbar = $('navbar');

window.addEventListener('scroll', () => {
  if (navbar) {
    navbar.classList.toggle('solid', window.scrollY > 50);
  }

  const btn = $('backToTop');
  if (btn) btn.classList.toggle('show', window.scrollY > 400);

  updateActiveLink();
});

function updateActiveLink() {
  const sections = ['home', 'categories', 'products', 'how-it-works', 'sellers', 'contact'];
  let current = '';

  sections.forEach((id) => {
    const el = document.getElementById(id);
    if (!el) return;
    if (window.scrollY >= el.offsetTop - 120) current = id;
  });

  $$('.nav-link').forEach((link) => {
    link.classList.remove('active');
    const href = link.getAttribute('href');
    if (href && href.includes(current) && current !== '') {
      link.classList.add('active');
    }
  });
}

/* ── MOBILE MENU ── */
const hamburger = $('hamburger');
const mobileNav = $('mobileNav');
const mobileOverlay = $('mobileOverlay');

if (hamburger) {
  hamburger.addEventListener('click', () => {
    const isOpen = mobileNav.classList.toggle('open');
    mobileOverlay.classList.toggle('show', isOpen);
    hamburger.classList.toggle('open', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });
}

function closeMobile() {
  if (mobileNav) mobileNav.classList.remove('open');
  if (mobileOverlay) mobileOverlay.classList.remove('show');
  if (hamburger) hamburger.classList.remove('open');
  document.body.style.overflow = '';
}

/* ── SEARCH OVERLAY ── */
const searchToggle = $('searchToggle');
const searchOverlay = $('searchOverlay');
const searchClose = $('searchClose');
const searchInput = $('searchInput');

if (searchToggle && searchOverlay) {
  searchToggle.addEventListener('click', () => {
    searchOverlay.classList.toggle('open');
    if (searchOverlay.classList.contains('open') && searchInput) {
      setTimeout(() => searchInput.focus(), 50);
    }
  });
}

if (searchClose && searchOverlay) {
  searchClose.addEventListener('click', () => {
    searchOverlay.classList.remove('open');
  });
}

if (searchInput) {
  searchInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      const q = e.target.value.trim();
      if (q && typeof searchProducts === 'function') {
        searchProducts(q);
        searchOverlay.classList.remove('open');
      }
    }
    if (e.key === 'Escape') {
      searchOverlay.classList.remove('open');
    }
  });
}

/* ── KEYBOARD ACCESSIBILITY ── */
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeMobile();
    if (searchOverlay) searchOverlay.classList.remove('open');
    const drawer = $('cartDrawer');
    if (drawer && drawer.classList.contains('open') && typeof toggleCart === 'function') {
      toggleCart();
    }
  }
});

/* ── Expose ── */
window.closeMobile = closeMobile;