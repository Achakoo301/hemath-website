const menuToggle = document.getElementById("menu-toggle");
const siteNav = document.getElementById("site-nav");

if (menuToggle && siteNav) {
  menuToggle.addEventListener("click", () => {
    siteNav.classList.toggle("open");
  });
}

const CART_STORAGE_KEY = "hemath_cart";

let cart = JSON.parse(localStorage.getItem(CART_STORAGE_KEY)) || [];

const addCartButtons = document.querySelectorAll(".add-cart-btn");
const cartCount = document.getElementById("cart-count");
const cartItemsContainer = document.getElementById("cart-items");
const cartTotal = document.getElementById("cart-total");
const cartDrawer = document.getElementById("cart-drawer");
const cartOverlay = document.getElementById("cart-overlay");
const openCartBtn = document.getElementById("open-cart-btn");
const openCartBtnBottom = document.getElementById("open-cart-btn-bottom");
const closeCartBtn = document.getElementById("close-cart-btn");
const clearCartBtn = document.getElementById("clear-cart-btn");

function saveCart() {
  localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
}

function getCartItemCount() {
  return cart.reduce((total, item) => total + item.quantity, 0);
}

function getCartTotal() {
  return cart.reduce((total, item) => total + item.price * item.quantity, 0);
}

function updateCartCount() {
  if (cartCount) {
    cartCount.textContent = getCartItemCount();
  }
}

function renderCart() {
  if (!cartItemsContainer || !cartTotal) return;

  if (cart.length === 0) {
    cartItemsContainer.innerHTML = `<div class="cart-empty">Your cart is empty.</div>`;
    cartTotal.textContent = "$0.00";
    updateCartCount();
    return;
  }

  cartItemsContainer.innerHTML = cart
    .map(
      (item) => `
        <div class="cart-item">
          <img src="${item.image}" alt="${item.name}" />
          <div class="cart-item-info">
            <h4>${item.name}</h4>
            <p>$${item.price.toFixed(2)}</p>
            <div class="cart-item-controls">
              <button type="button" data-action="decrease" data-id="${item.id}">-</button>
              <span>${item.quantity}</span>
              <button type="button" data-action="increase" data-id="${item.id}">+</button>
              <button type="button" data-action="remove" data-id="${item.id}">Remove</button>
            </div>
          </div>
        </div>
      `
    )
    .join("");

  cartTotal.textContent = `$${getCartTotal().toFixed(2)}`;
  updateCartCount();
}

function addToCart(product) {
  const existingItem = cart.find((item) => item.id === product.id);

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({
      ...product,
      quantity: 1,
    });
  }

  saveCart();
  renderCart();
}

function updateQuantity(id, action) {
  const item = cart.find((product) => product.id === id);
  if (!item) return;

  if (action === "increase") {
    item.quantity += 1;
  }

  if (action === "decrease") {
    item.quantity -= 1;
    if (item.quantity <= 0) {
      cart = cart.filter((product) => product.id !== id);
    }
  }

  if (action === "remove") {
    cart = cart.filter((product) => product.id !== id);
  }

  saveCart();
  renderCart();
}

function openCart() {
  if (cartDrawer) cartDrawer.classList.add("active");
  if (cartOverlay) cartOverlay.classList.add("active");
}

function closeCart() {
  if (cartDrawer) cartDrawer.classList.remove("active");
  if (cartOverlay) cartOverlay.classList.remove("active");
}

addCartButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const product = {
      id: button.dataset.id,
      name: button.dataset.name,
      price: parseFloat(button.dataset.price),
      image: button.dataset.image,
    };

    addToCart(product);
    openCart();
  });
});

if (cartItemsContainer) {
  cartItemsContainer.addEventListener("click", (event) => {
    const target = event.target;

    if (!(target instanceof HTMLElement)) return;

    const action = target.dataset.action;
    const id = target.dataset.id;

    if (!action || !id) return;

    updateQuantity(id, action);
  });
}

if (openCartBtn) {
  openCartBtn.addEventListener("click", openCart);
}

if (openCartBtnBottom) {
  openCartBtnBottom.addEventListener("click", openCart);
}

if (closeCartBtn) {
  closeCartBtn.addEventListener("click", closeCart);
}

if (cartOverlay) {
  cartOverlay.addEventListener("click", closeCart);
}

if (clearCartBtn) {
  clearCartBtn.addEventListener("click", () => {
    cart = [];
    saveCart();
    renderCart();
  });
}

renderCart();
