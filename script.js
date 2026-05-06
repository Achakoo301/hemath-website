const menuToggle = document.getElementById("menu-toggle");
const siteNav = document.getElementById("site-nav");

if (menuToggle && siteNav) {
  menuToggle.addEventListener("click", () => {
    siteNav.classList.toggle("show");
  });
}

const cartItemsContainer = document.getElementById("cart-items");
const cartTotalElement = document.getElementById("cart-total");
const cartCountElement = document.getElementById("cart-count");

const addToCartButtons = document.querySelectorAll(".add-cart-btn, .add-to-cart");
const clearCartButton = document.getElementById("clear-cart-btn") || document.getElementById("clear-cart");

let cart = JSON.parse(localStorage.getItem("hemathCart")) || [];

function saveCart() {
  localStorage.setItem("hemathCart", JSON.stringify(cart));
}

function formatPrice(price) {
  return `$${Number(price).toFixed(2)}`;
}

function renderCart() {
  if (!cartItemsContainer) return;

  if (cart.length === 0) {
    cartItemsContainer.innerHTML = "<p>Your cart is empty.</p>";
    if (cartTotalElement) cartTotalElement.textContent = "$0.00";
    if (cartCountElement) cartCountElement.textContent = "0";
    return;
  }

  let total = 0;

  cartItemsContainer.innerHTML = cart.map((item, index) => {
    total += Number(item.price);
    return `
      <div class="cart-item">
        <div>
          <strong>${item.name}</strong>
          <p>${formatPrice(item.price)}</p>
        </div>
        <button class="cart-remove" data-index="${index}">Remove</button>
      </div>
    `;
  }).join("");

  if (cartTotalElement) cartTotalElement.textContent = formatPrice(total);
  if (cartCountElement) cartCountElement.textContent = cart.length;

  document.querySelectorAll(".cart-remove").forEach(button => {
    button.addEventListener("click", () => {
      cart.splice(Number(button.dataset.index), 1);
      saveCart();
      renderCart();
    });
  });
}

addToCartButtons.forEach(button => {
  button.addEventListener("click", () => {
    cart.push({
      id: button.dataset.id,
      name: button.dataset.name,
      price: button.dataset.price,
      image: button.dataset.image
    });

    saveCart();
    renderCart();

    button.textContent = "Added!";
    setTimeout(() => {
      button.textContent = "Add to Cart";
    }, 1000);
  });
});

if (clearCartButton) {
  clearCartButton.addEventListener("click", () => {
    cart = [];
    saveCart();
    renderCart();
  });
}

renderCart();
