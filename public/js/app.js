let products = [
  { id: 1,  brand: 'Naviforce',      name: 'Original Chronographe',   price: 6200,  stock: 3, gender: 'homme', image_url: null },
  { id: 2,  brand: 'Naviforce',      name: 'Silicone Sport',          price: 6200,  stock: 2, gender: 'homme', image_url: null },
  { id: 3,  brand: 'Patek Philippe', name: 'Genève Classic',          price: 4500,  stock: 2, gender: 'homme', image_url: null },
  { id: 4,  brand: 'Patek Philippe', name: 'Black Edition',           price: 4500,  stock: 1, gender: 'homme', image_url: null },
  { id: 5,  brand: 'Patek Philippe', name: 'Pack Complet',            price: 10400, stock: 2, gender: 'homme', image_url: null },
  { id: 6,  brand: 'Curren',         name: 'Originale Chronographe',  price: 5200,  stock: 3, gender: 'homme', image_url: null },
  { id: 7,  brand: 'Curren',         name: 'Sport Blue',              price: 3700,  stock: 4, gender: 'homme', image_url: null },
  { id: 8,  brand: 'Hublot',         name: 'Classic Fusion',          price: 3700,  stock: 2, gender: 'homme', image_url: null },
  { id: 9,  brand: 'Hublot',         name: 'Pack Genève',             price: 9200,  stock: 1, gender: 'homme', image_url: null },
  { id: 10, brand: 'Festina',        name: 'Original Automatic',      price: 6900,  stock: 2, gender: 'homme', image_url: null },
  { id: 11, brand: 'Skmei',          name: 'Original Digital',        price: 4200,  stock: 5, gender: 'homme', image_url: null },
  { id: 12, brand: 'Tomi',           name: 'Pack Coffret',            price: 3500,  stock: 3, gender: 'homme', image_url: null },
];

let cart = [];
let activeFilter = 'all';

function loadProducts() {
  renderProducts(products);
  document.getElementById('loading').style.display = 'none';
}

function renderProducts(list) {
  const grid = document.getElementById('productsGrid');
  const filtered = activeFilter === 'all'
    ? list
    : list.filter(p =>
        p.brand.toLowerCase().includes(activeFilter) ||
        p.gender.toLowerCase() === activeFilter
      );

  if (filtered.length === 0) {
    grid.innerHTML = '<p style="color:var(--muted);padding:40px;grid-column:1/-1">Aucun produit trouve.</p>';
    return;
  }

  grid.innerHTML = filtered.map(p => `
    <div class="product-card ${p.stock === 0 ? 'out-of-stock' : ''}" onclick="openModal(${p.id})">
      ${p.stock === 0 ? '<div class="out-badge">Epuise</div>' : ''}
      <div class="product-img">${p.image_url ? `<img src="${p.image_url}" alt="${p.name}" loading="lazy"/>` : '⌚'}</div>
      <div class="card-overlay"><span>Voir details</span></div>
      <div class="card-info">
        <div class="card-brand">${p.brand}</div>
        <div class="card-name">${p.name}</div>
        <div class="card-footer">
          <div class="card-price">${p.stock === 0 ? 'Epuise' : Number(p.price).toLocaleString('fr-DZ') + ' DA'}</div>
          <div class="card-gender">${p.gender === 'homme' ? 'Homme' : 'Femme'}</div>
        </div>
      </div>
    </div>
  `).join('');
}

document.querySelectorAll('.filter-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    activeFilter = btn.dataset.filter;
    renderProducts(products);
  });
});

function openModal(id) {
  const p = products.find(x => x.id === id);
  if (!p) return;
  const inStock = p.stock > 0;
  document.getElementById('modalContent').innerHTML = `
    <div class="modal-img">${p.image_url ? `<img src="${p.image_url}" alt="${p.name}"/>` : '⌚'}</div>
    <div class="modal-info">
      <div class="modal-brand">${p.brand}</div>
      <div class="modal-name">${p.name}</div>
      <div class="modal-gender">${p.gender === 'homme' ? 'Pour Homme' : 'Pour Femme'}</div>
      <div class="modal-price">${Number(p.price).toLocaleString('fr-DZ')} DA</div>
      <div class="modal-stock ${inStock ? 'in' : ''}">
        ${inStock ? '✅ En stock (' + p.stock + ' dispo)' : '✗ Epuise'}
      </div>
      <button class="btn-add" ${!inStock ? 'disabled' : ''} onclick="addToCart(${p.id})">
        ${inStock ? 'Ajouter au panier' : 'Epuise'}
      </button>
    </div>
  `;
  document.getElementById('modalOverlay').classList.add('open');
  document.getElementById('productModal').classList.add('open');
}

function closeModal() {
  document.getElementById('modalOverlay').classList.remove('open');
  document.getElementById('productModal').classList.remove('open');
}

function addToCart(id) {
  const p = products.find(x => x.id === id);
  if (!p || p.stock === 0) return;
  const existing = cart.find(x => x.id === id);
  if (existing) { existing.qty += 1; } else { cart.push({ ...p, qty: 1 }); }
  updateCartUI(); closeModal(); toggleCart();
}

function removeFromCart(id) {
  cart = cart.filter(x => x.id !== id);
  updateCartUI();
}

function updateCartUI() {
  const count = cart.reduce((s, x) => s + x.qty, 0);
  const countEl = document.getElementById('cartCount');
  countEl.textContent = count;
  countEl.classList.toggle('visible', count > 0);
  const itemsEl = document.getElementById('cartItems');
  const footerEl = document.getElementById('cartFooter');
  if (cart.length === 0) {
    itemsEl.innerHTML = '<div class="cart-empty">Votre panier est vide.</div>';
    footerEl.innerHTML = ''; return;
  }
  itemsEl.innerHTML = cart.map(item => `
    <div class="cart-item">
      <div class="cart-item-img">${item.image_url ? `<img src="${item.image_url}" alt="${item.name}"/>` : '⌚'}</div>
      <div class="cart-item-info">
        <div class="cart-item-name">${item.name}</div>
        <div class="cart-item-price">${Number(item.price).toLocaleString('fr-DZ')} DA x ${item.qty}</div>
      </div>
      <button class="cart-item-remove" onclick="removeFromCart(${item.id})">x</button>
    </div>
  `).join('');
  const total = cart.reduce((s, x) => s + x.price * x.qty, 0);
  footerEl.innerHTML = `
    <div class="cart-total"><span>Total</span><strong>${total.toLocaleString('fr-DZ')} DA</strong></div>
    <a href="https://wa.me/213778997572" target="_blank" class="btn-primary" style="display:block;text-align:center;width:100%;margin-top:0">
      Commander sur WhatsApp
    </a>
  `;
}

function toggleCart() {
  document.getElementById('cartOverlay').classList.toggle('open');
  document.getElementById('cartSidebar').classList.toggle('open');
}

loadProducts();
