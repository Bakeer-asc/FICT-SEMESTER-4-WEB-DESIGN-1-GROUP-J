
/* 
   Buyer dashboard logic
 */

'use strict';

let currentUser = null;
let orders = [];
let savedItems = [];
let cart = [];

/* ── Initialize ── */
document.addEventListener('DOMContentLoaded', () => {
  currentUser = getStoredUser();
  if (!currentUser || currentUser.role !== 'buyer') {
    window.location.href = 'auth.html';
    return;
  }

  const userId = currentUser.id;
  orders = getStoredData('sm_orders_' + userId);
  savedItems = getStoredData('sm_saved_' + userId);
  cart = getStoredData('sm_cart_' + userId);

  $('welcomeName').textContent = 'Welcome back, ' + currentUser.fname + '!';
  updateBuyerStats();
  renderBuyerOrders();
  renderSavedItems();
  updateCartCount();
});

function updateBuyerStats() {
  const totalSpent = orders.filter(o => o.status === 'completed').reduce((sum, o) => sum + o.total, 0);
  $('totalOrders').textContent = orders.length;
  $('totalSpent').textContent = formatNLE(totalSpent);
  $('activeCarts').textContent = cart.length;
  $('savedCount').textContent = savedItems.length;
}

function renderBuyerOrders() {
  const recentContainer = $('recentOrders');
  const allContainer = $('allOrders');

  if (orders.length === 0) {
    const emptyHTML = `
      <div class="empty-state">
        <i class="fa-solid fa-box-open"></i>
        <p>No orders yet</p>
        <a href="index.html#products" class="btn-primary btn-inline-flex">Start Shopping</a>
      </div>`;
    recentContainer.innerHTML = emptyHTML;
    allContainer.innerHTML = emptyHTML;
    return;
  }

  recentContainer.innerHTML = orders.slice(0, 3).map(createOrderHTML).join('');
  allContainer.innerHTML = orders.map(createOrderHTML).join('');
}

function createOrderHTML(order) {
  const statusClass = 'status-' + order.status;
  const statusText = order.status.charAt(0).toUpperCase() + order.status.slice(1);

  return `
    <div class="order-item">
      <div class="order-img">${order.emoji || '📦'}</div>
      <div class="order-details">
        <div class="order-name">${order.productName}</div>
        <div class="order-meta">
          <i class="fa-solid fa-store"></i> ${order.seller} ·
          <i class="fa-solid fa-calendar"></i> ${new Date(order.date).toLocaleDateString()}
        </div>
      </div>
      <span class="order-status ${statusClass}">${statusText}</span>
      <div class="order-price">${formatNLE(order.total)}</div>
    </div>`;
}

function renderSavedItems() {
  const container = $('savedItems');

  if (savedItems.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <i class="fa-regular fa-heart"></i>
        <p>No saved items yet</p>
        <a href="index.html#products" class="btn-primary btn-inline-flex">Browse Products</a>
      </div>`;
    return;
  }

  container.innerHTML = savedItems.map(item => `
    <div class="saved-item">
      <div class="saved-item-img">${item.emoji || '📦'}</div>
      <div class="saved-item-body">
        <div class="saved-item-name">${item.name}</div>
        <div class="saved-item-price">${formatNLE(item.price)}</div>
      </div>
    </div>`).join('');
}

function switchBuyerTab(tab) {
  $$('.dash-nav-btn').forEach(btn => btn.classList.remove('active'));
  $$('.dash-menu-item').forEach(item => item.classList.remove('active'));
  $$('.dash-tab').forEach(t => t.classList.remove('active'));

  $(tab + 'Tab').classList.add('active');

  const index = ['overview', 'orders', 'saved'].indexOf(tab);
  if (index >= 0) {
    $$('.dash-nav-btn')[index]?.classList.add('active');
    $$('.dash-menu-item')[index]?.classList.add('active');
  }
}

function filterBuyerOrders(status, btn) {
  $$('#ordersTab .filter-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');

  const container = $('allOrders');
  let filtered = orders;

  if (status !== 'all') {
    filtered = orders.filter(o => o.status === status);
  }

  if (filtered.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <i class="fa-solid fa-clipboard-list"></i>
        <p>No ${status} orders found</p>
      </div>`;
  } else {
    container.innerHTML = filtered.map(createOrderHTML).join('');
  }
}

function updateCartCount() {
  const badge = $('cartCount');
  if (badge) badge.textContent = cart.length;
}

function toggleDashCart() {
  showToast('Cart feature coming soon!');
}

/* ── Expose ── */
window.switchBuyerTab = switchBuyerTab;
window.filterBuyerOrders = filterBuyerOrders;
window.toggleDashCart = toggleDashCart;