const menuToggle = document.getElementById("menu-toggle");
const siteNav = document.getElementById("site-nav");

if (menuToggle && siteNav) {
  menuToggle.addEventListener("click", () => {
    siteNav.classList.toggle("show");
  });
}

const cartDrawer = document.getElementById("cart-drawer");
const cartOverlay = document.getElementById("cart-overlay");
const openCartBtn = document.getElementById("open-cart-btn");
const openCartBtnBottom = document.getElementById("open-cart-btn-bottom");
const closeCartBtn = document.getElementById("close-cart-btn");
const clearCartBtn = document.getElementById("clear-cart-btn");
const cartItemsEl = document.getElementById("cart-items");
const cartTotalEl = document.getElementById("cart-total");
const cartCountEl = document.getElementById("cart-count");

let cart = JSON.parse(localStorage.getItem("hemathCart")) || [];

function saveCart() {
  localStorage.setItem("hemathCart", JSON.stringify(cart));
}

function money(value) {
  return `$${Number(value).toFixed(2)}`;
}

function openCart() {
  if (cartDrawer) cartDrawer.classList.add("active");
  if (cartOverlay) cartOverlay.classList.add("active");
}

function closeCart() {
  if (cartDrawer) cartDrawer.classList.remove("active");
  if (cartOverlay) cartOverlay.classList.remove("active");
}

function getCartTotals() {
  return cart.reduce(
    (totals, item) => {
      totals.quantity += item.quantity;
      totals.price += item.price * item.quantity;
      return totals;
    },
    { quantity: 0, price: 0 }
  );
}

function renderCart() {
  if (!cartItemsEl) return;

  if (cart.length === 0) {
    cartItemsEl.innerHTML = `<div class="cart-empty">Your cart is empty.</div>`;
    if (cartTotalEl) cartTotalEl.textContent = "$0.00";
    if (cartCountEl) cartCountEl.textContent = "0";
    return;
  }

  cartItemsEl.innerHTML = cart.map((item, index) => `
    <div class="cart-item">
      <img src="${item.image}" alt="${item.name}">
      <div class="cart-item-info">
        <h4>${item.name}</h4>
        <p>${money(item.price * item.quantity)}</p>
        <div class="cart-item-controls">
          <button type="button" data-action="decrease" data-index="${index}">−</button>
          <span>${item.quantity}</span>
          <button type="button" data-action="increase" data-index="${index}">+</button>
          <button type="button" data-action="remove" data-index="${index}">Remove</button>
        </div>
      </div>
    </div>
  `).join("");

  const totals = getCartTotals();

  if (cartTotalEl) cartTotalEl.textContent = money(totals.price);
  if (cartCountEl) cartCountEl.textContent = totals.quantity;

  document.querySelectorAll(".cart-item-controls button").forEach(button => {
    button.addEventListener("click", () => {
      const index = Number(button.dataset.index);
      const action = button.dataset.action;

      if (action === "increase") {
        cart[index].quantity += 1;
      }

      if (action === "decrease") {
        cart[index].quantity -= 1;
        if (cart[index].quantity <= 0) {
          cart.splice(index, 1);
        }
      }

      if (action === "remove") {
        cart.splice(index, 1);
      }

      saveCart();
      renderCart();
    });
  });
}

document.querySelectorAll(".add-cart-btn").forEach(button => {
  button.addEventListener("click", () => {
    const id = button.dataset.id;
    const name = button.dataset.name;
    const price = Number(button.dataset.price);
    const image = button.dataset.image;

    const existing = cart.find(item => item.id === id);

    if (existing) {
      existing.quantity += 1;
    } else {
      cart.push({
        id,
        name,
        price,
        image,
        quantity: 1
      });
    }

    saveCart();
    renderCart();

    const originalText = button.textContent;
    button.textContent = "Added!";

    setTimeout(() => {
      button.textContent = originalText;
    }, 900);

    openCart();
  });
});

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
