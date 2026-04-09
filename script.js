// MOBILE NAV
const menuToggle = document.getElementById("menu-toggle");
const nav = document.getElementById("site-nav");

if (menuToggle && nav) {
  menuToggle.addEventListener("click", () => {
    nav.classList.toggle("show");
  });
}

// CART SYSTEM
let cart = JSON.parse(localStorage.getItem("hemathCart")) || [];

function saveCart() {
  localStorage.setItem("hemathCart", JSON.stringify(cart));
}

function formatPrice(num) {
  return "$" + Number(num).toFixed(2);
}

function renderCart() {
  const container = document.getElementById("cart-items");
  const totalEl = document.getElementById("cart-total");
  const countEl = document.getElementById("cart-count");
  const itemCountEl = document.getElementById("cart-item-total");

  if (!container) return;

  container.innerHTML = "";
  let total = 0;

  if (cart.length === 0) {
    container.innerHTML = `<p class="empty-cart">Your cart is empty.</p>`;
  } else {
    cart.forEach((item, index) => {
      total += item.price;

      container.innerHTML += `
        <div class="cart-item">
          <img src="${item.image}">
          <div class="cart-item-info">
            <h4>${item.name}</h4>
            <p>${formatPrice(item.price)}</p>
          </div>
          <button onclick="removeItem(${index})">x</button>
        </div>
      `;
    });
  }

  if (totalEl) totalEl.textContent = formatPrice(total);
  if (countEl) countEl.textContent = cart.length;
  if (itemCountEl) itemCountEl.textContent = cart.length;
}

function removeItem(index) {
  cart.splice(index, 1);
  saveCart();
  renderCart();
}

function clearCart() {
  cart = [];
  saveCart();
  renderCart();
}

// ADD TO CART BUTTONS
document.addEventListener("click", function (e) {
  if (e.target.classList.contains("add-to-cart")) {
    const btn = e.target;

    cart.push({
      name: btn.dataset.name,
      price: Number(btn.dataset.price),
      image: btn.dataset.image
    });

    saveCart();
    renderCart();
  }
});

// INIT
renderCart();
