/* ============================================================
   lit-up | script.js - nav toggle + cart + auth + storefront UI
   ============================================================ */

const LITUP_PRODUCTS = {
  1: { id: 1, name: 'satoru gojo', img: './images/products/product-1.webp', price: 799 },
  2: { id: 2, name: 'monkey d luffy', img: './images/products/product-2.webp', price: 799 },
  3: { id: 3, name: 'vegeta ultra ego', img: './images/products/product-3.webp', price: 799 },
  4: { id: 4, name: 'naruto uzumaki', img: './images/products/product-4.webp', price: 799 },
  5: { id: 5, name: 'kakashi hatake', img: './images/products/product-5.webp', price: 799 },
  6: { id: 6, name: 'gojo satoru', img: './images/products/product-6.webp', price: 799 },
  7: { id: 7, name: 'kakarot', img: './images/products/product-7.webp', price: 799 },
  8: { id: 8, name: 'son goku', img: './images/products/product-8.webp', price: 799 },
  9: { id: 9, name: 'master roshi', img: './images/products/product-9.webp', price: 799 },
  10: { id: 10, name: 'itachi uchiha', img: './images/products/product-10.webp', price: 799 },
  11: { id: 11, name: 'meliodas', img: './images/products/product-11.webp', price: 799 },
  12: { id: 12, name: 'vegeta', img: './images/products/product-12.webp', price: 799 },
  13: { id: 13, name: 'sukuna', img: './images/products/product-13.webp', price: 799 },
  14: { id: 14, name: 'zenitsu', img: './images/products/product-14.webp', price: 799 },
  15: { id: 15, name: 'sung jin woo', img: './images/products/product-15.webp', price: 799 },
  16: { id: 16, name: 'satoru gojo black', img: './images/products/product-16.webp', price: 799 }
};

window.LITUP_PRODUCTS = LITUP_PRODUCTS;

function normalizeProductName(value) {
  return String(value || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}

function findProductByName(name) {
  const normalized = normalizeProductName(name);
  return Object.values(LITUP_PRODUCTS).find(product => normalizeProductName(product.name) === normalized) || null;
}

function setActiveAuthView(view) {
  const loginForm = document.getElementById('loginForm');
  const registerForm = document.getElementById('registerForm');
  const logBtn = document.getElementById('removeLog');
  const regBtn = document.getElementById('removeReg');
  if (!loginForm || !registerForm || !logBtn || !regBtn) return;

  const isLogin = view !== 'register';
  loginForm.classList.toggle('active', isLogin);
  registerForm.classList.toggle('active', !isLogin);
  loginForm.toggleAttribute('hidden', !isLogin);
  registerForm.toggleAttribute('hidden', isLogin);
  logBtn.setAttribute('aria-pressed', String(isLogin));
  regBtn.setAttribute('aria-pressed', String(!isLogin));
}

window.login = () => setActiveAuthView('login');
window.register = () => setActiveAuthView('register');

/* ---------- Mobile Nav Toggle ---------- */
const toggle = document.querySelector('.toggle');
const navMenu = document.querySelector('.nav-menu');
if (toggle && navMenu) {
  if (!navMenu.id) navMenu.id = 'site-navigation';
  toggle.setAttribute('aria-controls', navMenu.id);
  toggle.setAttribute('aria-expanded', 'false');

  const closeMenu = () => {
    navMenu.classList.remove('active');
    toggle.setAttribute('aria-expanded', 'false');
  };

  const openMenu = () => {
    navMenu.classList.add('active');
    toggle.setAttribute('aria-expanded', 'true');
  };

  toggle.addEventListener('click', () => {
    const expanded = toggle.getAttribute('aria-expanded') === 'true';
    if (expanded) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') closeMenu();
  });

  navMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', closeMenu);
  });
}

/* ---------- Swiper (home page) ---------- */
(function initHomeSwiper() {
  const homeSwiper = document.querySelector('.home__swiper');
  if (!homeSwiper || typeof Swiper === 'undefined' || homeSwiper.dataset.swiperReady === 'true') return;

  const prevButton = document.querySelector('.swiper-button-prev');
  const nextButton = document.querySelector('.swiper-button-next');
  if (prevButton) prevButton.setAttribute('aria-label', 'Show previous featured product');
  if (nextButton) nextButton.setAttribute('aria-label', 'Show next featured product');

  new Swiper('.home__swiper', {
    loop: true,
    loopAdditionalSlides: 2,
    grabCursor: true,
    slidesPerView: 3,
    centeredSlides: true,
    spaceBetween: 24,
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev'
    },
    keyboard: { enabled: true },
    breakpoints: {
      0: { slidesPerView: 1, spaceBetween: 0 },
      600: { slidesPerView: 3, spaceBetween: 24 }
    }
  });

  homeSwiper.dataset.swiperReady = 'true';
})();

/* ============================================================
   STORAGE HELPERS (localStorage wrappers)
   ============================================================ */
const Store = {
  getCart: () => JSON.parse(localStorage.getItem('litup_cart') || '[]'),
  setCart: cart => localStorage.setItem('litup_cart', JSON.stringify(cart)),
  getUser: () => JSON.parse(localStorage.getItem('litup_user') || 'null'),
  setUser: user => localStorage.setItem('litup_user', JSON.stringify(user)),
  clearUser: () => localStorage.removeItem('litup_user'),
  getUsers: () => JSON.parse(localStorage.getItem('litup_users') || '[]'),
  setUsers: users => localStorage.setItem('litup_users', JSON.stringify(users))
};

/* ---------- Cart badge in nav ---------- */
function updateCartBadge() {
  const cart = Store.getCart();
  const total = cart.reduce((sum, item) => sum + item.qty, 0);
  let badge = document.querySelector('.cart-badge');
  const cartIcon = document.querySelector('a[href*="cart"] img.cart');

  if (!cartIcon) return;

  if (!badge) {
    badge = document.createElement('span');
    badge.className = 'cart-badge';
    badge.setAttribute('aria-hidden', 'true');
    cartIcon.parentElement.style.position = 'relative';
    cartIcon.parentElement.appendChild(badge);
  }

  cartIcon.parentElement.setAttribute('aria-label', `Shopping cart with ${total} item${total === 1 ? '' : 's'}`);
  badge.textContent = total;
  badge.style.display = total ? 'flex' : 'none';
}
updateCartBadge();

/* ============================================================
   ADD TO CART
   ============================================================ */
function addToCart(id, name, price, img, size, qty) {
  if (!Store.getUser()) {
    showToast('Please log in to add items to your cart.', 'error');
    setTimeout(() => {
      window.location.href = './account.html';
    }, 1200);
    return;
  }

  const safeId = String(id);
  const safeQty = Math.max(1, parseInt(qty, 10) || 1);
  const safeSize = size || 'M';
  const cart = Store.getCart();
  const key = `${safeId}-${safeSize}`;
  const existing = cart.find(item => item.key === key);

  if (existing) {
    existing.qty += safeQty;
  } else {
    cart.push({
      key,
      id: safeId,
      name,
      price,
      img,
      size: safeSize,
      qty: safeQty
    });
  }

  Store.setCart(cart);
  updateCartBadge();
  showToast(`${name} added to cart.`, 'success');
}

window.addToCart = addToCart;

(function initProductPage() {
  const addBtn = document.querySelector('.add-to-cart-btn');
  if (!addBtn) return;

  if (document.getElementById('sizeSelector')) return;

  addBtn.addEventListener('click', () => {
    const sizeEl = document.querySelector('select[name="size"]');
    const qtyEl = document.querySelector('input[type="number"]');
    const size = sizeEl ? sizeEl.value : 'M';

    if (!sizeEl || !sizeEl.value || sizeEl.value === 'Select Size') {
      showToast('Please select a size.', 'error');
      return;
    }

    const qty = qtyEl ? parseInt(qtyEl.value, 10) || 1 : 1;
    addToCart(
      addBtn.dataset.id,
      addBtn.dataset.name,
      parseInt(addBtn.dataset.price, 10),
      addBtn.dataset.img,
      size,
      qty
    );
  });
})();

document.querySelectorAll('.home__add-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const product = LITUP_PRODUCTS[btn.dataset.id] || findProductByName(btn.dataset.product);

    if (!product) {
      showToast('Product details are unavailable right now.', 'error');
      return;
    }

    addToCart(
      product.id,
      product.name,
      product.price,
      product.img,
      'One Size',
      1
    );
  });
});

/* ============================================================
   CART PAGE
   ============================================================ */
(function initCartPage() {
  const cartPage = document.querySelector('.cart-page');
  if (!cartPage) return;
  cartPage.setAttribute('aria-live', 'polite');

  function renderCart() {
    const user = Store.getUser();
    const cart = Store.getCart();

    if (!user) {
      cartPage.innerHTML = `
        <div class="cart-empty-state">
          <div class="cart-empty-icon" aria-hidden="true">Cart</div>
          <h2>You're not logged in</h2>
          <p>Log in to view and manage your cart.</p>
          <a href="./account.html" class="btn">Go to Account</a>
        </div>`;
      return;
    }

    if (!cart.length) {
      cartPage.innerHTML = `
        <div class="cart-empty-state">
          <div class="cart-empty-icon" aria-hidden="true">Bag</div>
          <h2>Your cart is empty</h2>
          <p>Looks like you haven't added anything yet.</p>
          <a href="./products.html" class="btn">Browse Products</a>
        </div>`;
      return;
    }

    const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
    const shipping = subtotal >= 999 ? 0 : 99;
    const total = subtotal + shipping;

    cartPage.innerHTML = `
      <h1 class="cart-title">My Cart</h1>
      <div class="cart-layout">
        <div class="cart-items" aria-label="Cart items">
          ${cart.map(item => `
            <article class="cart-item" data-key="${item.key}">
              <div class="cart-item-img-wrap">
                ${item.img ? `<img src="${item.img}" alt="${item.name}">` : '<div class="cart-item-no-img" aria-hidden="true">Item</div>'}
              </div>
              <div class="cart-item-info">
                <h2>${item.name}</h2>
                <p class="cart-item-meta">Size: <span>${item.size}</span></p>
                <p class="cart-item-price">\u20B9${item.price.toLocaleString()}</p>
              </div>
              <div class="cart-item-controls">
                <div class="qty-control" aria-label="Quantity controls">
                  <button class="qty-btn" data-action="dec" data-key="${item.key}" aria-label="Decrease quantity for ${item.name}">-</button>
                  <span aria-live="polite">${item.qty}</span>
                  <button class="qty-btn" data-action="inc" data-key="${item.key}" aria-label="Increase quantity for ${item.name}">+</button>
                </div>
                <button class="remove-btn" data-key="${item.key}" aria-label="Remove ${item.name} from cart">Remove</button>
              </div>
              <div class="cart-item-total">\u20B9${(item.price * item.qty).toLocaleString()}</div>
            </article>
          `).join('')}
        </div>
        <aside class="cart-summary" aria-label="Order summary">
          <h2>Order Summary</h2>
          <div class="summary-row"><span>Subtotal</span><span>\u20B9${subtotal.toLocaleString()}</span></div>
          <div class="summary-row"><span>Shipping</span><span>${shipping === 0 ? '<span class="free-tag">FREE</span>' : `\u20B9${shipping}`}</span></div>
          <div class="summary-divider"></div>
          <div class="summary-row summary-total">
            <span>Total</span>
            <span>\u20B9${total.toLocaleString()}</span>
          </div>
          <button class="btn checkout-btn" id="checkoutBtn">Place Order</button>
          <a href="./products.html" class="continue-link">Continue Shopping</a>
          <p class="free-ship-note">${subtotal < 999 ? `Add \u20B9${999 - subtotal} more for free shipping.` : 'You unlocked free shipping.'}</p>
        </aside>
      </div>`;

    cartPage.querySelector('.cart-items').addEventListener('click', event => {
      const key = event.target.dataset.key;
      if (!key) return;

      let nextCart = Store.getCart();

      if (event.target.classList.contains('qty-btn')) {
        const item = nextCart.find(cartItem => cartItem.key === key);
        if (!item) return;

        if (event.target.dataset.action === 'inc') item.qty += 1;
        if (event.target.dataset.action === 'dec') item.qty -= 1;

        nextCart = nextCart.filter(cartItem => cartItem.qty > 0);
        Store.setCart(nextCart);
        updateCartBadge();
        renderCart();
        return;
      }

      if (event.target.classList.contains('remove-btn')) {
        Store.setCart(nextCart.filter(cartItem => cartItem.key !== key));
        updateCartBadge();
        renderCart();
        showToast('Item removed from cart.', 'info');
      }
    });

    document.getElementById('checkoutBtn').addEventListener('click', () => {
      Store.setCart([]);
      updateCartBadge();
      renderCart();
      showToast('Order placed successfully.', 'success');
    });
  }

  renderCart();
})();

/* ============================================================
   ACCOUNT PAGE
   ============================================================ */
(function initAccountPage() {
  const authForms = document.getElementById('authForms');
  const loginForm = document.getElementById('loginForm');
  const registerForm = document.getElementById('registerForm');
  const logBtn = document.getElementById('removeLog');
  const regBtn = document.getElementById('removeReg');
  const profileSection = document.getElementById('profileSection');

  if (!loginForm && !profileSection) return;

  const user = Store.getUser();

  if (user && profileSection) {
    if (authForms) authForms.hidden = true;
    profileSection.hidden = false;

    const nameEl = document.getElementById('profileName');
    const emailEl = document.getElementById('profileEmail');
    if (nameEl) nameEl.textContent = user.username;
    if (emailEl) emailEl.textContent = user.email || '-';
  } else if (loginForm && registerForm) {
    setActiveAuthView('login');
  }

  if (logBtn) {
    logBtn.addEventListener('click', () => setActiveAuthView('login'));
  }

  if (regBtn) {
    regBtn.addEventListener('click', () => setActiveAuthView('register'));
  }

  if (loginForm) {
    loginForm.addEventListener('submit', event => {
      event.preventDefault();
      const username = loginForm.querySelector('input[name="username"]').value.trim();
      const password = loginForm.querySelector('input[name="password"]').value;
      const users = Store.getUsers();
      const found = users.find(savedUser => savedUser.username === username && savedUser.password === password);

      if (!found) {
        showToast('Invalid username or password.', 'error');
        return;
      }

      Store.setUser({ username: found.username, email: found.email });
      showToast(`Welcome back, ${found.username}.`, 'success');
      setTimeout(() => {
        window.location.reload();
      }, 900);
    });
  }

  if (registerForm) {
    registerForm.addEventListener('submit', event => {
      event.preventDefault();
      const username = registerForm.querySelector('input[name="username"]').value.trim();
      const email = registerForm.querySelector('input[name="email"]').value.trim();
      const password = registerForm.querySelector('input[name="password"]').value;

      if (!username || !email || !password) {
        showToast('Please fill in every field.', 'error');
        return;
      }

      const users = Store.getUsers();
      if (users.find(savedUser => savedUser.username.toLowerCase() === username.toLowerCase())) {
        showToast('That username is already taken.', 'error');
        return;
      }

      users.push({ username, email, password });
      Store.setUsers(users);
      Store.setUser({ username, email });
      showToast(`Account created for ${username}.`, 'success');
      setTimeout(() => {
        window.location.reload();
      }, 900);
    });
  }

  const logoutBtn = document.getElementById('logoutBtn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      Store.clearUser();
      showToast('Logged out successfully.', 'info');
      setTimeout(() => {
        window.location.reload();
      }, 700);
    });
  }
})();

/* ============================================================
   TOAST NOTIFICATIONS
   ============================================================ */
function showToast(message, type = 'info') {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    container.setAttribute('role', 'status');
    container.setAttribute('aria-live', 'polite');
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.textContent = message;
  container.appendChild(toast);

  requestAnimationFrame(() => toast.classList.add('show'));
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 400);
  }, 3000);
}

window.showToast = showToast;

/* ============================================================
   SCROLL REVEAL (if library loaded)
   ============================================================ */
if (typeof ScrollReveal !== 'undefined') {
  ScrollReveal().reveal('.childprods', { delay: 100, distance: '30px', origin: 'bottom', interval: 80 });
  ScrollReveal().reveal('.home__content', { delay: 200, distance: '40px', origin: 'left' });
}
