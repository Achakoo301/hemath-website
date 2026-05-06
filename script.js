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
const cartItemTotalElement = document.getElementById("cart-item-total");
const clearCartButton = document.getElementById("clear-cart");
const checkoutInquiryButton = document.getElementById("checkout-inquiry");

const searchInput = document.getElementById("shop-search");
const categoryFilter = document.getElementById("shop-category-filter");
const sortSelect = document.getElementById("shop-sort");
const productGridSections = document.querySelectorAll(".product-grid");
const products = Array.from(document.querySelectorAll(".shop-product"));

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
    cartItemsContainer.innerHTML = `<p class="empty-cart">Your cart is empty.</p>`;
    if (cartTotalElement) cartTotalElement.textContent = "$0.00";
    if (cartCountElement) cartCountElement.textContent = "0";
    if (cartItemTotalElement) cartItemTotalElement.textContent = "0";
    return;
  }

  let total = 0;
  let totalItems = 0;

  cartItemsContainer.innerHTML = cart.map((item, index) => {
    const quantity = Number(item.quantity) || 1;
    const itemTotal = Number(item.price) * quantity;

    total += itemTotal;
    totalItems += quantity;

    return `
      <div class="cart-item">
        <img src="${item.image}" alt="${item.name}">
        <div class="cart-item-info">
          <h4>${item.name}</h4>
          <p>${formatPrice(itemTotal)}</p>
          <div class="cart-item-controls">
            <button type="button" data-action="decrease" data-index="${index}">−</button>
            <span>${quantity}</span>
            <button type="button" data-action="increase" data-index="${index}">+</button>
            <button type="button" data-action="remove" data-index="${index}">Remove</button>
          </div>
        </div>
      </div>
    `;
  }).join("");

  if (cartTotalElement) cartTotalElement.textContent = formatPrice(total);
  if (cartCountElement) cartCountElement.textContent = String(totalItems);
  if (cartItemTotalElement) cartItemTotalElement.textContent = String(totalItems);

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

document.querySelectorAll(".add-to-cart").forEach(button => {
  button.addEventListener("click", () => {
    const name = button.dataset.name;
    const price = Number(button.dataset.price);
    const image = button.dataset.image;

    const existingItem = cart.find(item => item.name === name);

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.push({
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
    if (cart.length === 0) {
      alert("Your cart is empty.");
      return;
    }

    const summary = cart
      .map(item => `${item.quantity} x ${item.name} - ${formatPrice(item.price * item.quantity)}`)
      .join("\n");

    alert(`Checkout Inquiry\n\n${summary}\n\nPlease contact HemAth to complete your purchase.`);
  });
}

function applyFiltersAndSort() {
  const searchTerm = searchInput ? searchInput.value.toLowerCase().trim() : "";
  const category = categoryFilter ? categoryFilter.value : "all";
  const sortValue = sortSelect ? sortSelect.value : "default";

  products.forEach(product => {
    const name = product.dataset.name.toLowerCase();
    const productCategory = product.dataset.category;
    const description = product.querySelector(".product-desc")?.textContent.toLowerCase() || "";

    const matchesSearch = name.includes(searchTerm) || description.includes(searchTerm);
    const matchesCategory = category === "all" || productCategory === category;

    product.style.display = matchesSearch && matchesCategory ? "" : "none";
  });

  productGridSections.forEach(grid => {
    const visibleProducts = Array.from(grid.querySelectorAll(".shop-product"))
      .filter(product => product.style.display !== "none");

    if (sortValue !== "default") {
      visibleProducts.sort((a, b) => {
        const priceA = Number(a.dataset.price);
        const priceB = Number(b.dataset.price);
        const nameA = a.dataset.name.toLowerCase();
        const nameB = b.dataset.name.toLowerCase();

        if (sortValue === "low-high") return priceA - priceB;
        if (sortValue === "high-low") return priceB - priceA;
        if (sortValue === "name-az") return nameA.localeCompare(nameB);

        return 0;
      });

      visibleProducts.forEach(product => grid.appendChild(product));
    }
  });

  document.querySelectorAll(".shop-category").forEach(section => {
    const visible = section.querySelectorAll(".shop-product:not([style*='display: none'])");
    section.style.display = visible.length > 0 ? "" : "none";
  });
}

if (searchInput) {
  searchInput.addEventListener("input", applyFiltersAndSort);
}

if (categoryFilter) {
  categoryFilter.addEventListener("change", applyFiltersAndSort);
}

if (sortSelect) {
  sortSelect.addEventListener("change", applyFiltersAndSort);
}

renderCart();
applyFiltersAndSort();
