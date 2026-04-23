let cart = [];

const buttons = document.querySelectorAll(".add-to-cart");
const cartItems = document.getElementById("cart-items");
const cartTotal = document.getElementById("cart-total");

buttons.forEach(btn => {
  btn.addEventListener("click", () => {
    const name = btn.dataset.name;
    const price = parseFloat(btn.dataset.price);

    cart.push({ name, price });
    updateCart();
  });
});

function updateCart() {
  cartItems.innerHTML = "";
  let total = 0;

  cart.forEach(item => {
    total += item.price;

    const div = document.createElement("div");
    div.classList.add("cart-item");
    div.innerHTML = `${item.name} - $${item.price}`;
    cartItems.appendChild(div);
  });

  cartTotal.textContent = total.toFixed(2);
}

document.getElementById("clear-cart").addEventListener("click", () => {
  cart = [];
  updateCart();
});
