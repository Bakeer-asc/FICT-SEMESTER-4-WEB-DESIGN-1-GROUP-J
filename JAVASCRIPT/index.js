

/* 
   Homepage: Products, Filters, Cart, Wishlist, Counters
 */

'use strict';

/* ── STATE ── */
let cart = [];
let wishlisted = new Set();
let currentFilter = 'all';
let visibleCount = 8;
const LOAD_MORE_STEP = 4;

/* ── LOADER ── */
window.addEventListener('load', () => {
  setTimeout(() => {
    const loader = $('loader');
    if (loader) loader.classList.add('hide');
  }, 1600);
});

/* ── PRODUCTS — RENDER ── */
function getFilteredProducts() {
  if (currentFilter === 'all') return PRODUCTS;
  return PRODUCTS.filter((p) => p.category === currentFilter);
}

function buildStars(rating) {
  const full = Math.floor(rating);
  const half = rating % 1 >= 0.5 ? 1 : 0;
  const empty = 5 - full - half;
  return (
    '<i class="fa-solid fa-star"></i>'.repeat(full) +
    (half ? '<i class="fa-solid fa-star-half-stroke"></i>' : '') +
    '<i class="fa-regular fa-star"></i>'.repeat(empty)
  );
}

function buildBadge(badge) {
  if (!badge) return '';
  const cls = badge === 'HOT' ? 'badge-hot' : badge === 'NEW' ? 'badge-new' : 'badge-fresh';
  return `<span class="p-badge ${cls}">${badge}</span>`;
}

function buildProductCard(product, index) {
  const isWished = wishlisted.has(product.id);
  const delay = (index % 4) * 80;

  const imgHTML = product.image
    ? `<img class="p-img-photo" src="${product.image}" alt="${product.name}"
          onerror="this.style.display='none';this.nextElementSibling.style.display='block'" />
       <span class="p-img-emoji" style="display:none">${product.emoji}</span>`
    : `<span class="p-img-emoji">${product.emoji}</span>`;

  return `
    <div class="p-card" style="animation-delay:${delay}ms" data-id="${product.id}">
      <div class="p-img">
        ${buildBadge(product.badge)}
        ${imgHTML}
        <button
          class="p-wish ${isWished ? 'wished' : ''}"
          onclick="toggleWish(${product.id}, this)"
          aria-label="Wishlist"
        >
          <i class="${isWished ? 'fa-solid' : 'fa-regular'} fa-heart"></i>
        </button>
      </div>
      <div class="p-body">
        <div class="p-cat">${product.category}</div>
        <div class="p-name">${product.name}</div>
        <div class="p-rating">
          ${buildStars(product.rating)}
          <span>${product.rating} (${product.reviews})</span>
        </div>
        <div class="p-seller">
          <i class="fa-solid fa-store"></i>
          ${product.seller} · ${product.location}
        </div>
        <div class="p-footer">
          <div>
            <span class="p-price">NLE ${product.price.toLocaleString()}</span>
            ${product.oldPrice ? `<span class="p-price-old">NLE ${product.oldPrice.toLocaleString()}</span>` : ''}
          </div>
          <button class="p-add" onclick="addToCart(${product.id})">
            <i class="fa-solid fa-cart-plus"></i> Add
          </button>
        </div>
      </div>
    </div>
  `;
}

function renderProducts(list) {
  const grid = $('productsGrid');
  if (!grid) return;

  const slice = list.slice(0, visibleCount);

  if (slice.length === 0) {
    grid.innerHTML = `
      <div style="grid-column:1/-1;text-align:center;padding:3rem;color:var(--muted)">
        <i class="fa-solid fa-magnifying-glass" style="font-size:2rem;margin-bottom:1rem;display:block;opacity:.3"></i>
        No products found. Try a different search or category.
      </div>`;
    return;
  }

  grid.innerHTML = slice.map((p, i) => buildProductCard(p, i)).join('');
}

function initProducts() {
  renderProducts(getFilteredProducts());
}

/* ── FILTER TABS ── */
function initFilterTabs() {
  $$('.filter-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      $$('.filter-btn').forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      currentFilter = btn.dataset.filter;
      visibleCount = 8;
      renderProducts(getFilteredProducts());
    });
  });
}

/* ── LOAD MORE ── */
function loadMore() {
  visibleCount += LOAD_MORE_STEP;
  const list = getFilteredProducts();
  renderProducts(list);

  if (visibleCount >= list.length) {
    showToast("You've seen all products in this category!");
  }
}

/* ── FILTER BY CATEGORY ── */
function filterByCategory(cat) {
  currentFilter = cat;
  visibleCount = 8;

  $$('.filter-btn').forEach((btn) => {
    btn.classList.toggle('active', btn.dataset.filter === cat);
  });

  renderProducts(getFilteredProducts());

  document.getElementById('products').scrollIntoView({ behavior: 'smooth' });
  showToast(`Showing: ${cat.charAt(0).toUpperCase() + cat.slice(1)}`);
}

/* ── SEARCH ── */
function searchProducts(query) {
  const q = query.toLowerCase();
  currentFilter = 'all';
  visibleCount = 8;

  $$('.filter-btn').forEach((b) => b.classList.remove('active'));
  $$('.filter-btn')[0].classList.add('active');

  const matches = PRODUCTS.filter(
    (p) =>
      p.name.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      p.seller.toLowerCase().includes(q) ||
      p.location.toLowerCase().includes(q)
  );

  renderProducts(matches);
  showToast(`Found ${matches.length} result${matches.length !== 1 ? 's' : ''} for "${query}"`);

  document.getElementById('products').scrollIntoView({ behavior: 'smooth' });
}

/* ── WISHLIST ── */
function toggleWish(id, btn) {
  if (wishlisted.has(id)) {
    wishlisted.delete(id);
    btn.classList.remove('wished');
    btn.innerHTML = '<i class="fa-regular fa-heart"></i>';
    showToast('Removed from wishlist');
  } else {
    wishlisted.add(id);
    btn.classList.add('wished');
    btn.innerHTML = '<i class="fa-solid fa-heart"></i>';
    showToast('Added to wishlist ❤️');
  }
}

/* ── CART ── */
function addToCart(id) {
  const product = PRODUCTS.find((p) => p.id === id);
  if (!product) return;

  const existing = cart.find((item) => item.id === id);
  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ ...product, qty: 1 });
  }

  updateCartUI();
  showToast(`${product.name} added to cart!`);
}

function removeFromCart(id) {
  cart = cart.filter((item) => item.id !== id);
  updateCartUI();
  renderCartItems();
  showToast('Item removed from cart');
}

function updateCartUI() {
  const total = cart.reduce((sum, item) => sum + item.qty, 0);
  const badge = $('cartBadge');
  if (badge) badge.textContent = total;
  renderCartItems();
}

function renderCartItems() {
  const container = $('cartItems');
  const footer = $('cartFooter');
  const totalEl = $('cartTotal');
  if (!container) return;

  if (cart.length === 0) {
    container.innerHTML = `
      <div class="cart-empty">
        <i class="fa-solid fa-bag-shopping"></i>
        <p>Your cart is empty</p>
        <a href="#products" onclick="toggleCart()">Browse Products</a>
      </div>`;
    if (footer) footer.style.display = 'none';
    return;
  }

  container.innerHTML = cart
    .map(
      (item) => `
    <div class="cart-item">
      <div class="cart-item-emoji">${item.emoji || '📦'}</div>
      <div class="cart-item-info">
        <div class="cart-item-name">${item.name}</div>
        <div class="cart-item-price">NLE ${item.price.toLocaleString()} × ${item.qty}</div>
      </div>
      <button class="cart-item-remove" onclick="removeFromCart(${item.id})" aria-label="Remove">
        <i class="fa-solid fa-trash-can"></i>
      </button>
    </div>`
    )
    .join('');

  const grandTotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  if (totalEl) totalEl.textContent = `NLE ${grandTotal.toLocaleString()}`;
  if (footer) footer.style.display = 'block';
}

function toggleCart() {
  const drawer = $('cartDrawer');
  const overlay = $('drawerOverlay');
  if (!drawer) return;
  const isOpen = drawer.classList.toggle('open');
  if (overlay) overlay.classList.toggle('show', isOpen);
  document.body.style.overflow = isOpen ? 'hidden' : '';
}

function checkout() {
  if (cart.length === 0) return;
  showToast('🎉 Order placed! A seller will contact you shortly.');
  cart = [];
  updateCartUI();
  toggleCart();
}

if ($('cartToggle')) {
  $('cartToggle').addEventListener('click', toggleCart);
}

/* ── FORM — REGISTRATION ── */
function handleRegister() {
  const fName     = $('fName')?.value.trim()     || '';
  const lName     = $('lName')?.value.trim()     || '';
  const email     = $('fEmail')?.value.trim()    || '';
  const phone     = $('fPhone')?.value.trim()    || '';
  const district  = $('fDistrict')?.value        || '';
  const role      = $('fRole')?.value            || '';

  let valid = true;

  ['fNameErr','lNameErr','fEmailErr','fPhoneErr','fDistrictErr','fRoleErr'].forEach((id) => {
    const el = $(id);
    if (el) el.textContent = '';
  });
  ['fName','lName','fEmail','fPhone','fDistrict','fRole'].forEach((id) => {
    const el = $(id);
    if (el) el.classList.remove('error');
  });

  if (!fName) { $('fName').classList.add('error'); $('fNameErr').textContent = 'First name is required'; valid = false; }
  if (!lName) { $('lName').classList.add('error'); $('lNameErr').textContent = 'Last name is required'; valid = false; }
  if (!email) { $('fEmail').classList.add('error'); $('fEmailErr').textContent = 'Email is required'; valid = false; }
  else if (!validateEmail(email)) { $('fEmail').classList.add('error'); $('fEmailErr').textContent = 'Invalid email'; valid = false; }
  if (!phone) { $('fPhone').classList.add('error'); $('fPhoneErr').textContent = 'Phone is required'; valid = false; }
  else if (!validatePhone(phone)) { $('fPhone').classList.add('error'); $('fPhoneErr').textContent = 'Invalid phone'; valid = false; }
  if (!district) { $('fDistrict').classList.add('error'); $('fDistrictErr').textContent = 'Select district'; valid = false; }
  if (!role) { $('fRole').classList.add('error'); $('fRoleErr').textContent = 'Select role'; valid = false; }

  if (!valid) {
    showToast('Please fill in all required fields correctly');
    return;
  }

  const btn = $('submitBtn');
  if (btn) {
    btn.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i> Creating account…';
    btn.disabled = true;
  }

  setTimeout(() => {
    const user = {
      id: Date.now(),
      fname: fName,
      lname: lName,
      email,
      phone,
      district,
      role: role === 'seller' ? 'seller' : 'buyer',
      joined: new Date().toISOString()
    };

    const users = getStoredData('sm_users');
    users.push(user);
    setStoredData('sm_users', users);
    setStoredUser(user);

    $('formBody').style.display = 'none';
    $('formSuccess').style.display = 'block';
    showToast(`Welcome, ${fName}! Your account has been created 🎉`);
  }, 1800);
}

/* ── SCROLL REVEAL ── */
function initScrollReveal() {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
  );

  $$('.reveal').forEach((el) => observer.observe(el));
}

/* ── ANIMATED COUNTERS ── */
function animateCounter(el, target, duration = 1800) {
  let start = 0;
  const step = target / (duration / 16);

  const update = () => {
    start += step;
    if (start >= target) {
      el.textContent = target.toLocaleString();
      return;
    }
    el.textContent = Math.floor(start).toLocaleString();
    requestAnimationFrame(update);
  };
  requestAnimationFrame(update);
}

function initCounters() {
  const counterEls = $$('.stat-n[data-target]');
  if (!counterEls.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const target = parseInt(el.dataset.target, 10);
          animateCounter(el, target);
          observer.unobserve(el);
        }
      });
    },
    { threshold: 0.5 }
  );

  counterEls.forEach((el) => observer.observe(el));
}

/* ── SMOOTH SCROLL ── */
function initSmoothScroll() {
  $$('a[href^="#"]').forEach((link) => {
    link.addEventListener('click', (e) => {
      const target = document.querySelector(link.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const offset = target.getBoundingClientRect().top + window.scrollY - 75;
      window.scrollTo({ top: offset, behavior: 'smooth' });
    });
  });
}

/* ── Expose globals ── */
window.addToCart = addToCart;
window.toggleWish = toggleWish;
window.filterByCategory = filterByCategory;
window.loadMore = loadMore;
window.handleRegister = handleRegister;
window.toggleCart = toggleCart;
window.removeFromCart = removeFromCart;
window.checkout = checkout;
window.searchProducts = searchProducts;

/* ── INIT ── */
document.addEventListener('DOMContentLoaded', () => {
  initProducts();
  initFilterTabs();
  initScrollReveal();
  initCounters();
  initSmoothScroll();
  updateActiveLink();
});