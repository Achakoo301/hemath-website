const menuToggle = document.getElementById("menu-toggle");
const siteNav = document.getElementById("site-nav");

if (menuToggle && siteNav) {
  menuToggle.addEventListener("click", () => {
    siteNav.classList.toggle("show");
  });
}

const navLinks = document.querySelectorAll("#site-nav a");
navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    if (siteNav) {
      siteNav.classList.remove("show");
    }
  });
});

const cartItemsContainer = document.getElementById("cart-items");
const cartTotalElement = document.getElementById("cart-total");
const cartCountElement = document.getElementById("cart-count");
const cartItemTotalElement = document.getElementById("cart-item-total");
const clearCartButton = document.getElementById("clear-cart");
const checkoutInquiryButton = document.getElementById("checkout-inquiry");
const addToCartButtons = document.querySelectorAll(".add-to-cart");
const searchInput = document.getElementById("shop-search");
const categoryFilter = document.getElementById("shop-category-filter");
const sortSelect = document.getElementById("shop-sort");
const productCards = Array.from(document.querySelectorAll(".shop-product"));
const categorySections = document.querySelectorAll("[data-category-section]");

let cart = JSON.parse(localStorage.getItem("hemathCart")) || [];

function saveCart() {
  localStorage.setItem("hemathCart", JSON.stringify(cart));
}

function formatPrice(value) {
  return `$${Number(value).toFixed(2)}`;
}

function renderCart() {
  if (!cartItemsContainer) return;

  if (!cart.length) {
    cartItemsContainer.innerHTML = '<p class="empty-cart">Your cart is empty.</p>';
    if (cartTotalElement) cartTotalElement.textContent = "$0.00";
    if (cartCountElement) cartCountElement.textContent = "0";
    if (cartItemTotalElement) cartItemTotalElement.textContent = "0";
    return;
  }

  cartItemsContainer.innerHTML = "";
  let total = 0;
  let itemCount = 0;

  cart.forEach((item, index) => {
    const quantity = Number(item.quantity || 1);
    const lineTotal = Number(item.price) * quantity;
    total += lineTotal;
    itemCount += quantity;

    const itemElement = document.createElement("div");
    itemElement.className = "cart-item";
    itemElement.innerHTML = `
      <img src="${item.image}" alt="${item.name}">
      <div class="cart-item-info">
        <h4>${item.name}</h4>
        <p>${formatPrice(item.price)}</p>
        <div class="cart-item-controls">
          <button type="button" data-action="decrease" data-index="${index}">−</button>
          <span>${quantity}</span>
          <button type="button" data-action="increase" data-index="${index}">+</button>
          <button type="button" data-action="remove" data-index="${index}">Remove</button>
        </div>
      </div>
    `;
    cartItemsContainer.appendChild(itemElement);
  });

  if (cartTotalElement) cartTotalElement.textContent = formatPrice(total);
  if (cartCountElement) cartCountElement.textContent = String(itemCount);
  if (cartItemTotalElement) cartItemTotalElement.textContent = String(itemCount);

  const cartActionButtons = cartItemsContainer.querySelectorAll("[data-action]");
  cartActionButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const action = button.dataset.action;
      const index = Number(button.dataset.index);
      const item = cart[index];
      if (!item) return;

      if (action === "increase") {
        item.quantity = Number(item.quantity || 1) + 1;
      }

      if (action === "decrease") {
        item.quantity = Number(item.quantity || 1) - 1;
        if (item.quantity <= 0) {
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

function addItemToCart(name, price, image) {
  const existingItem = cart.find((item) => item.name === name);
  if (existingItem) {
    existingItem.quantity = Number(existingItem.quantity || 1) + 1;
  } else {
    cart.push({
      name,
      price: Number(price),
      image,
      quantity: 1
    });
  }
  saveCart();
  renderCart();
}

addToCartButtons.forEach((button) => {
  button.addEventListener("click", () => {
    addItemToCart(button.dataset.name, button.dataset.price, button.dataset.image);
  });
});

if (clearCartButton) {
  clearCartButton.addEventListener("click", () => {
    cart = [];
    saveCart();
    renderCart();
  });
}

if (checkoutInquiryButton) {
  checkoutInquiryButton.addEventListener("click", () => {
    const itemLines = cart.map((item) => {
      const quantity = Number(item.quantity || 1);
      const lineTotal = Number(item.price) * quantity;
      return `${item.name} x${quantity} - ${formatPrice(lineTotal)}`;
    }).join("%0A");

    const total = cart.reduce((sum, item) => {
      return sum + (Number(item.price) * Number(item.quantity || 1));
    }, 0).toFixed(2);

    const mailtoLink = `mailto:?subject=HemAth Shop Inquiry&body=Hello HemAth,%0A%0AI am interested in the following items:%0A%0A${itemLines || "No items listed"}%0A%0ATotal: $${total}%0A%0APlease let me know the next steps for purchase.%0A`;
    window.location.href = mailtoLink;
  });
}

function applyFiltersAndSort() {
  if (!productCards.length || !searchInput || !categoryFilter || !sortSelect) return;

  const searchTerm = searchInput.value.trim().toLowerCase();
  const selectedCategory = categoryFilter.value;
  const sortValue = sortSelect.value;

  productCards.forEach((card) => {
    const name = card.dataset.name.toLowerCase();
    const category = card.dataset.category;
    const matchesSearch = name.includes(searchTerm);
    const matchesCategory = selectedCategory === "all" || category === selectedCategory;
    card.style.display = matchesSearch && matchesCategory ? "" : "none";
  });

  categorySections.forEach((section) => {
    const visibleCards = section.querySelectorAll(".shop-product:not([style*='display: none'])");
    section.style.display = visibleCards.length ? "" : "none";
  });

  categorySections.forEach((section) => {
    const grid = section.querySelector(".amazon-product-grid");
    if (!grid) return;

    const visibleCards = Array.from(grid.querySelectorAll(".shop-product"))
      .filter((card) => card.style.display !== "none");

    visibleCards.sort((a, b) => {
      const nameA = a.dataset.name.toLowerCase();
      const nameB = b.dataset.name.toLowerCase();
      const priceA = Number(a.dataset.price);
      const priceB = Number(b.dataset.price);

      if (sortValue === "low-high") return priceA - priceB;
      if (sortValue === "high-low") return priceB - priceA;
      if (sortValue === "name-az") return nameA.localeCompare(nameB);
      return 0;
    });

    visibleCards.forEach((card) => grid.appendChild(card));
  });
}

if (searchInput) searchInput.addEventListener("input", applyFiltersAndSort);
if (categoryFilter) categoryFilter.addEventListener("change", applyFiltersAndSort);
if (sortSelect) sortSelect.addEventListener("change", applyFiltersAndSort);

renderCart();
applyFiltersAndSort();
