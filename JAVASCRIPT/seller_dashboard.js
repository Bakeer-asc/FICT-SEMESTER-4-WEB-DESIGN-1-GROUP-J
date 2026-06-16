
/* 
   Seller dashboard logic
 */

'use strict';

let currentUser = null;
let products = [];
let orders = [];

/* ── Initialize ── */
document.addEventListener('DOMContentLoaded', () => {
  currentUser = getStoredUser();
  if (!currentUser || currentUser.role !== 'seller') {
    window.location.href = 'auth.html';
    return;
  }

  const userId = currentUser.id;
  $('sellerName').textContent = `${currentUser.fname} ${currentUser.lname} · ${currentUser.district}`;

  products = getStoredData('sm_products_' + userId);
  orders = getStoredData('sm_seller_orders_' + userId);

  updateSellerStats();
  renderSellerProducts();
  renderSellerOrders();
});

function updateSellerStats() {
  const totalSales = orders.filter(o => o.status === 'completed').reduce((sum, o) => sum + o.total, 0);
  $('totalSales').textContent = formatNLE(totalSales);
  $('activeProducts').textContent = products.length;
  $('totalOrders').textContent = orders.length;
}

function renderSellerProducts(list) {
  const tbody = $('productsTable');
  const displayList = list || products;

  if (displayList.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="5" class="table-empty">
          No products yet. Click "Add New Product" to get started.
        </td>
      </tr>`;
    return;
  }

  tbody.innerHTML = displayList.map((prod, index) => {
    const stockClass = prod.stock > 10 ? 'stock-high' : prod.stock > 0 ? 'stock-low' : 'stock-out';
    const stockText = prod.stock > 10 ? 'In Stock' : prod.stock > 0 ? 'Low Stock' : 'Out of Stock';
    const realIndex = products.indexOf(prod);

    return `
      <tr>
        <td>
          <div class="product-cell">
            <div class="product-thumb">${prod.emoji || '📦'}</div>
            <div class="product-info">
              <h4>${prod.name}</h4>
              <span>${prod.category}</span>
            </div>
          </div>
        </td>
        <td class="product-price">${formatNLE(prod.price)}</td>
        <td><span class="product-stock ${stockClass}">${stockText} (${prod.stock})</span></td>
        <td><span style="color: var(--green); font-weight: 600;">Active</span></td>
        <td>
          <div class="product-actions">
            <button class="action-btn edit" onclick="editProduct(${realIndex})">
              <i class="fa-solid fa-pen"></i>
            </button>
            <button class="action-btn delete" onclick="deleteProduct(${realIndex})">
              <i class="fa-solid fa-trash"></i>
            </button>
          </div>
        </td>
      </tr>`;
  }).join('');
}

function renderSellerOrders() {
  const recentContainer = $('recentOrders');
  const allContainer = $('allOrders');

  if (orders.length === 0) {
    const html = `
      <div class="empty-state">
        <i class="fa-solid fa-box-open"></i>
        <p>No orders yet</p>
      </div>`;
    recentContainer.innerHTML = html;
    allContainer.innerHTML = html;
    return;
  }

  recentContainer.innerHTML = orders.slice(0, 3).map(createSellerOrderCard).join('');
  allContainer.innerHTML = orders.map(createSellerOrderCard).join('');
}

function createSellerOrderCard(order) {
  const statusClass = 'status-' + order.status;
  const statusText = order.status.charAt(0).toUpperCase() + order.status.slice(1);

  return `
    <div class="order-card">
      <div class="order-card-header">
        <span class="order-id">Order #${order.id}</span>
        <span class="order-status ${statusClass}">${statusText}</span>
      </div>
      <div class="order-card-body">
        <div class="order-customer">
          <div class="customer-avatar">👤</div>
          <div>
            <div class="customer-name">${order.customerName}</div>
            <div class="customer-district">${order.district}</div>
          </div>
        </div>
        <div>
          <div style="font-size: 0.85rem; color: var(--muted); margin-bottom: 0.25rem;">Product</div>
          <div style="font-weight: 600;">${order.productName}</div>
        </div>
        <div>
          <div style="font-size: 0.85rem; color: var(--muted); margin-bottom: 0.25rem;">Quantity</div>
          <div style="font-weight: 600;">${order.quantity}</div>
        </div>
        <div class="order-total">${formatNLE(order.total)}</div>
      </div>
    </div>`;
}

function switchSellerTab(tab) {
  $$('.dash-menu-item').forEach(item => item.classList.remove('active'));
  $$('.dash-tab').forEach(t => t.classList.remove('active'));

  $(tab + 'Tab').classList.add('active');

  const index = ['overview', 'products', 'orders', 'analytics'].indexOf(tab);
  if (index >= 0) {
    $$('.dash-menu-item')[index]?.classList.add('active');
  }
}

function openModal() {
  $('productModal').classList.add('active');
}

function closeModal() {
  $('productModal').classList.remove('active');
}

function addProduct(e) {
  e.preventDefault();

  const newProduct = {
    name: $('prodName').value,
    price: parseFloat($('prodPrice').value),
    stock: parseInt($('prodStock').value),
    category: $('prodCategory').value,
    description: $('prodDesc').value,
    image: $('prodImage').value || null,
    emoji: '📦',
    date: new Date().toISOString()
  };

  products.push(newProduct);
  setStoredData('sm_products_' + currentUser.id, products);

  updateSellerStats();
  renderSellerProducts();
  closeModal();
  $('addProductForm').reset();

  showToast('Product added successfully!');
}

function editProduct(index) {
  showToast('Edit feature coming soon!');
}

function deleteProduct(index) {
  if (confirm('Are you sure you want to delete this product?')) {
    products.splice(index, 1);
    setStoredData('sm_products_' + currentUser.id, products);
    updateSellerStats();
    renderSellerProducts();
    showToast('Product deleted');
  }
}

function searchProducts(query) {
  const q = query.toLowerCase();
  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(q) ||
    p.category.toLowerCase().includes(q)
  );
  renderSellerProducts(filtered);
}

function filterSellerOrders(status, btn) {
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
    container.innerHTML = filtered.map(createSellerOrderCard).join('');
  }
}

/* ── Expose ── */
window.switchSellerTab = switchSellerTab;
window.openModal = openModal;
window.closeModal = closeModal;
window.addProduct = addProduct;
window.editProduct = editProduct;
window.deleteProduct = deleteProduct;
window.searchProducts = searchProducts;
window.filterSellerOrders = filterSellerOrders;