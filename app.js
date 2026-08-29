const users = {
  admin: {
    email: 'admin@velora.com',
    password: 'admin123',
    role: 'admin',
    name: 'Alicia Singh',
    dashboardTitle: 'Admin dashboard'
  },
  user: {
    email: 'user@velora.com',
    password: 'user123',
    role: 'user',
    name: 'Mia Johnson',
    dashboardTitle: 'User dashboard'
  },
  delivery: {
    email: 'delivery@velora.com',
    password: 'delivery123',
    role: 'delivery',
    name: 'Rafael Chen',
    dashboardTitle: 'Delivery dashboard'
  }
};

const productCatalog = [
  { name: 'Rosalyn Formal Gown', price: 129, oldPrice: 169, tag: 'Formal', accent: 'pink', category: 'Formal wear', collection: 'Formal collection' },
  { name: 'Aurora Traditional Maxi', price: 98, oldPrice: 132, tag: 'Classic', accent: 'blue', category: 'Traditional', collection: 'Traditional collection' },
  { name: 'Luna Satin Evening', price: 118, oldPrice: 150, tag: 'Popular', accent: 'pink', category: 'Formal wear', collection: 'Formal collection' },
  { name: 'Noor Festive Kurta', price: 87, oldPrice: 112, tag: 'Hot', accent: 'blue', category: 'Traditional', collection: 'Traditional collection' },
  { name: 'Sapphire Party Midi', price: 104, oldPrice: 138, tag: 'Best', accent: 'blue', category: 'Formal wear', collection: 'Party collection' },
  { name: 'Blush Bridal Lehenga', price: 142, oldPrice: 178, tag: 'Luxury', accent: 'pink', category: 'Traditional', collection: 'Bridal collection' },
  { name: 'Celeste Cocktail Dress', price: 115, oldPrice: 148, tag: 'Trend', accent: 'blue', category: 'Party wear', collection: 'Cocktail collection' },
  { name: 'Ivory Evening Flare', price: 132, oldPrice: 170, tag: 'Elite', accent: 'pink', category: 'Evening wear', collection: 'Evening collection' },
  { name: 'Aanya Summer Dress', price: 89, oldPrice: 120, tag: 'Fresh', accent: 'blue', category: 'Casual wear', collection: 'Summer collection' },
  { name: 'Nadia Wedding Saree Gown', price: 156, oldPrice: 205, tag: 'Royal', accent: 'pink', category: 'Bridal wear', collection: 'Bridal collection' },
  { name: 'Mira Ethnic Wrap', price: 96, oldPrice: 126, tag: 'Classic', accent: 'blue', category: 'Traditional', collection: 'Traditional collection' },
  { name: 'Daphne Dinner Dress', price: 124, oldPrice: 162, tag: 'New', accent: 'pink', category: 'Formal wear', collection: 'Evening collection' }
];

const collections = [
  { title: 'Formal collection', subtitle: 'Elegant office and evening essentials', group: 'Formal collection' },
  { title: 'Traditional collection', subtitle: 'Classic heritage-inspired silhouettes', group: 'Traditional collection' },
  { title: 'Party collection', subtitle: 'Statement looks for events and celebration', group: 'Party collection' },
  { title: 'Bridal collection', subtitle: 'Luxury dresses for unforgettable moments', group: 'Bridal collection' },
  { title: 'Cocktail collection', subtitle: 'Modern mini and flare silhouettes', group: 'Cocktail collection' },
  { title: 'Evening collection', subtitle: 'Chic dresses for dinners and receptions', group: 'Evening collection' },
  { title: 'Summer collection', subtitle: 'Light, breezy outfits for sunny days', group: 'Summer collection' }
];

const dashboardConfig = {
  admin: {
    summary: [
      { label: 'Revenue', value: '$34.8K' },
      { label: 'Orders', value: '1,248' },
      { label: 'Returns', value: '18' }
    ],
    activity: [
      ['New stock arrived', 'Today'],
      ['High demand for bridal gowns', '2h ago'],
      ['Delivery routing updated', 'This morning']
    ]
  },
  user: {
    summary: [
      { label: 'Saved items', value: '12' },
      { label: 'Orders', value: '4' },
      { label: 'Points', value: '890' }
    ],
    activity: [
      ['Pink satin dress added to cart', 'Just now'],
      ['Order #V1842 shipped', 'Yesterday'],
      ['Free delivery coupon unlocked', '3 days ago']
    ]
  },
  delivery: {
    summary: [
      { label: 'Trips', value: '16' },
      { label: 'On route', value: '5' },
      { label: 'Earnings', value: '$620' }
    ],
    activity: [
      ['Route to North Avenue updated', 'Just now'],
      ['Parcel delivered to 24 Park Road', '1h ago'],
      ['Pickup scheduled for 6:30 PM', 'Today']
    ]
  }
};

const roleButtons = document.querySelectorAll('.role-btn');
const loginForm = document.getElementById('loginForm');
const emailInput = document.getElementById('emailInput');
const passwordInput = document.getElementById('passwordInput');
const demoText = document.getElementById('demoText');
const dashboardPanel = document.getElementById('dashboardPanel');
const dashboardTitle = document.getElementById('dashboardTitle');
const summaryGrid = document.getElementById('summaryGrid');
const activityList = document.getElementById('activityList');
const logoutBtn = document.getElementById('logoutBtn');
const headerLoginBtn = document.getElementById('headerLoginBtn');
const productGrid = document.getElementById('productGrid');
const browseProductsBtn = document.getElementById('browseProductsBtn');

let activeRole = 'admin';

function renderProducts() {
  productGrid.innerHTML = collections
    .map(
      (collection) => {
        const items = productCatalog.filter((product) => product.collection === collection.group);

        return `
          <div class="collection-panel">
            <div class="collection-header">
              <div>
                <p class="eyebrow small">Collection</p>
                <h3>${collection.title}</h3>
              </div>
              <span>${collection.subtitle}</span>
            </div>
            <div class="collection-grid">
              ${items
                .map(
                  (product) => `
                    <article class="product-card">
                      <div class="product-media" style="background: linear-gradient(135deg, ${product.accent === 'pink' ? '#ffe8f5' : '#e2f2ff'}, ${product.accent === 'pink' ? '#f8ddf1' : '#d9ebff'});">
                        <span class="sale-tag">${product.tag}</span>
                      </div>
                      <div class="product-info">
                        <div class="product-meta">
                          <span>${product.category}</span>
                          <span>In stock</span>
                        </div>
                        <h3>${product.name}</h3>
                        <div class="product-price-row">
                          <div>
                            <span class="price">$${product.price}</span>
                            <span class="old-price">$${product.oldPrice}</span>
                          </div>
                          <button class="add-btn" type="button">Add</button>
                        </div>
                      </div>
                    </article>
                  `
                )
                .join('')}
            </div>
          </div>
        `;
      }
    )
    .join('');
}

function setActiveRole(role) {
  activeRole = role;
  roleButtons.forEach((button) => {
    const isActive = button.dataset.role === role;
    button.classList.toggle('active', isActive);
  });

  const selectedUser = users[role];
  emailInput.value = selectedUser.email;
  passwordInput.value = selectedUser.password;
  demoText.textContent = `Demo ${role} login: ${selectedUser.email} / ${selectedUser.password}`;
}

function renderDashboard(role) {
  const config = dashboardConfig[role];
  dashboardTitle.textContent = users[role].dashboardTitle;

  summaryGrid.innerHTML = config.summary
    .map(
      (item) => `
        <div class="summary-card">
          <span>${item.label}</span>
          <strong>${item.value}</strong>
        </div>
      `
    )
    .join('');

  activityList.innerHTML = config.activity
    .map(
      ([text, time]) => `
        <li>
          <span>${text}</span>
          <strong>${time}</strong>
        </li>
      `
    )
    .join('');

  dashboardPanel.classList.remove('hidden');
}

function hideDashboard() {
  dashboardPanel.classList.add('hidden');
}

function handleLogin(event) {
  event.preventDefault();

  const enteredEmail = emailInput.value.trim().toLowerCase();
  const enteredPassword = passwordInput.value.trim();

  const matchedUser = Object.values(users).find(
    (user) => user.email.toLowerCase() === enteredEmail && user.password === enteredPassword
  );

  if (!matchedUser) {
    alert('Invalid login details. Please use the correct demo credentials for the selected role.');
    return;
  }

  renderDashboard(matchedUser.role);
  const dashboardHeading = document.getElementById('dashboardTitle');
  dashboardHeading.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function logout() {
  hideDashboard();
  emailInput.value = users[activeRole].email;
  passwordInput.value = users[activeRole].password;
}

roleButtons.forEach((button) => {
  button.addEventListener('click', () => setActiveRole(button.dataset.role));
});

loginForm.addEventListener('submit', handleLogin);
logoutBtn.addEventListener('click', logout);
headerLoginBtn.addEventListener('click', () => {
  document.getElementById('login').scrollIntoView({ behavior: 'smooth' });
});
browseProductsBtn.addEventListener('click', () => {
  document.getElementById('products').scrollIntoView({ behavior: 'smooth' });
});

renderProducts();
setActiveRole(activeRole);
hideDashboard();
