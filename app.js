const products = [
  { id: 1, name: 'Heirloom tomatoes', meta: '1 lb basket · Local farm', price: 4.99, category: 'produce', emoji: '🍅', tag: 'In season' },
  { id: 2, name: 'Grass-fed ribeye', meta: '12 oz raw cut · Butcher select', price: 16.5, category: 'meat', emoji: '🥩', image: 'https://images.unsplash.com/photo-1588168333986-5078d3ae3976?auto=format&fit=crop&w=700&q=85', tag: 'Raw butcher cut' },
  { id: 9, name: 'Tender mutton curry cut', meta: '1 lb pack · Farm raised', price: 13.99, category: 'meat', emoji: '🍖', image: 'https://images.unsplash.com/photo-1603048297172-c92544798d5a?auto=format&fit=crop&w=700&q=85', tag: 'New cut' },
  { id: 3, name: 'Baby spinach', meta: '5 oz bag · Organic', price: 3.49, category: 'produce', emoji: '🥬', tag: 'Organic' },
  { id: 4, name: 'Sourdough loaf', meta: '24 oz · Baked today', price: 6.25, category: 'pantry', emoji: '🍞', tag: 'Baked today' },
  { id: 5, name: 'Free-range eggs', meta: 'Dozen · Grade A', price: 5.49, category: 'dairy', emoji: '🥚', tag: 'Farm fresh' },
  { id: 6, name: 'Chicken thighs', meta: '2 lb raw pack · Antibiotic-free', price: 9.75, category: 'meat', emoji: '🍗', image: 'https://images.unsplash.com/photo-1604503468506-a8da13d82791?auto=format&fit=crop&w=700&q=85', tag: 'Raw fresh cut' },
  { id: 7, name: 'Cara cara oranges', meta: '3 lb bag · Sweet & bright', price: 7.99, category: 'produce', emoji: '🍊', tag: 'Staff favorite' },
  { id: 8, name: 'Creamy oat milk', meta: '64 fl oz · Barista blend', price: 4.79, category: 'dairy', emoji: '🥛', tag: 'Popular' }
];
let cart = JSON.parse(localStorage.getItem('gromart') || '{}');
let selectedCategory = 'all';
let selectedRole = 'customer';
const $ = (selector) => document.querySelector(selector);
const money = (value) => `$${value.toFixed(2)}`;

function visibleProducts() {
  const query = $('#searchInput').value.toLowerCase().trim();
  const sort = $('#sortSelect').value;
  let result = products.filter((product) => selectedCategory === 'all' || product.category === selectedCategory);
  if (query) result = result.filter((product) => `${product.name} ${product.meta} ${product.category}`.toLowerCase().includes(query));
  if (sort === 'price-low') result.sort((a, b) => a.price - b.price);
  if (sort === 'price-high') result.sort((a, b) => b.price - a.price);
  return result;
}

function renderProducts() {
  const grid = $('#productGrid');
  const items = visibleProducts();
  grid.innerHTML = items.length ? items.map((product, index) => { const details = product.meta.split(' · '); return `<article class="product-card" style="animation-delay:${index * 45}ms"><div class="product-photo ${product.category}"><span class="product-tag">${product.tag}</span>${product.image ? `<img src="${product.image}" alt="Fresh ${product.name}" style="width:100%;height:100%;object-fit:cover;display:block" onerror="this.hidden=true;this.nextElementSibling.hidden=false" /><span hidden>${product.emoji}</span>` : `<span>${product.emoji}</span>`}</div><div class="product-info"><h3>${product.name}</h3><p class="product-meta"><strong style="color:var(--green);font-weight:700">${details[0]}</strong>${details.slice(1).length ? ` · ${details.slice(1).join(' · ')}` : ''}</p><div class="product-bottom"><span class="price">${money(product.price)} <small>/ item</small></span><button class="add-button" data-add="${product.id}" aria-label="Add ${product.name} to cart">+</button></div></div></article>`; }).join('') : '<p class="no-results">No fresh picks found. Try another search.</p>';
  $('#productTitle').textContent = selectedCategory === 'all' ? 'Popular this week' : `${selectedCategory[0].toUpperCase()}${selectedCategory.slice(1)} picks`;
}

function cartEntries() { return Object.entries(cart).filter(([, quantity]) => quantity > 0).map(([id, quantity]) => ({ product: products.find((product) => product.id === Number(id)), quantity })); }
function renderCart() {
  const entries = cartEntries();
  const count = entries.reduce((sum, entry) => sum + entry.quantity, 0);
  const subtotal = entries.reduce((sum, entry) => sum + entry.product.price * entry.quantity, 0);
  $('#cartCount').textContent = count;
  $('#cartItems').innerHTML = entries.map(({ product, quantity }) => `<div class="cart-line"><div class="cart-line-photo">${product.emoji}</div><div class="cart-line-info"><strong>${product.name}</strong><small>${money(product.price)} each</small></div><div class="qty"><button data-quantity="${product.id}" data-change="-1">−</button><span>${quantity}</span><button data-quantity="${product.id}" data-change="1">+</button></div></div>`).join('');
  $('#cartEmpty').style.display = entries.length ? 'none' : 'block';
  $('#cartSummary').style.display = entries.length ? 'block' : 'none';
  $('#subtotal').textContent = money(subtotal);
  $('#total').textContent = money(subtotal);
  localStorage.setItem('gromart', JSON.stringify(cart));
}
function showToast(message) { const toast = $('#toast'); toast.textContent = message; toast.classList.add('show'); setTimeout(() => toast.classList.remove('show'), 2200); }
function setCartOpen(open) { $('#cartDrawer').classList.toggle('open', open); $('#drawerBackdrop').classList.toggle('open', open); }
function setLoginOpen(open) { $('#modalBackdrop').classList.toggle('open', open); }

document.addEventListener('click', (event) => {
  const add = event.target.closest('[data-add]');
  if (add) { const id = add.dataset.add; cart[id] = (cart[id] || 0) + 1; renderCart(); showToast(`${products.find((product) => product.id === Number(id)).name} added to your basket`); }
  const quantity = event.target.closest('[data-quantity]');
  if (quantity) { const id = quantity.dataset.quantity; cart[id] = (cart[id] || 0) + Number(quantity.dataset.change); if (cart[id] <= 0) delete cart[id]; renderCart(); }
  const category = event.target.closest('[data-category]');
  if (category) { selectedCategory = category.dataset.category; document.querySelectorAll('.category').forEach((button) => button.classList.toggle('active', button === category)); renderProducts(); }
  const role = event.target.closest('[data-role]');
  if (role) { selectedRole = role.dataset.role; document.querySelectorAll('.role-tab').forEach((button) => button.classList.toggle('active', button === role)); const notes = { customer: 'Shop fresh food and track your deliveries.', delivery: 'Manage your route and earn with every delivery.', vendor: 'List your products and grow your local store.' }; const headings = { customer: 'Sign in to your<br /><em>fresh account.</em>', delivery: 'Get moving with<br /><em>GroMart delivery.</em>', vendor: 'Grow your store with<br /><em>GroMart.</em>' }; $('#roleNote').textContent = notes[selectedRole]; $('#loginTitle').innerHTML = headings[selectedRole]; }
});
$('#cartButton').addEventListener('click', () => setCartOpen(true)); $('#closeCart').addEventListener('click', () => setCartOpen(false)); $('#drawerBackdrop').addEventListener('click', () => setCartOpen(false));
$('.login-trigger').addEventListener('click', () => setLoginOpen(true)); $('#closeLogin').addEventListener('click', () => setLoginOpen(false)); $('#modalBackdrop').addEventListener('click', (event) => { if (event.target === $('#modalBackdrop')) setLoginOpen(false); });
$('#searchInput').addEventListener('input', renderProducts); $('#sortSelect').addEventListener('change', renderProducts); $('#closeAnnouncement').addEventListener('click', () => $('.announcement').remove());
$('#howItWorks').addEventListener('click', () => showToast('We pick, pack, and deliver in three simple steps.'));
$('#checkout').addEventListener('click', () => showToast('Checkout is ready for your fresh order.'));
$('#loginForm').addEventListener('submit', (event) => { event.preventDefault(); setLoginOpen(false); const messages = { customer: 'Welcome back to GroMart.', delivery: 'Your delivery dashboard is ready.', vendor: 'Your GroMart store is ready.' }; showToast(messages[selectedRole]); });
renderProducts(); renderCart();
