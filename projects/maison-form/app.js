const products = [
  { id: "cleanser", name: "The Gentle Cleanse", category: "cleanse", categoryLabel: "CLEANSE", price: 18, description: "A soft, simple start to your everyday routine.", badge: "EVERYDAY", art: "tone-cream product-bottle" },
  { id: "moisture", name: "Daily Moisture", category: "moisture", categoryLabel: "MOISTURE", price: 26, description: "An easy final layer for a comfortable-feeling day.", badge: "BEST LOVED", art: "tone-sage product-bottle" },
  { id: "face-oil", name: "The Quiet Oil", category: "moisture", categoryLabel: "MOISTURE", price: 32, description: "A few considered drops for your evening ritual.", badge: "SLOW DOWN", art: "tone-mist product-oil" },
  { id: "balm", name: "Soft Reset Balm", category: "cleanse", categoryLabel: "CLEANSE", price: 22, description: "A comforting balm for a slower end to the day.", badge: "NEW", art: "tone-peach product-jar" },
];

const cartKey = "maisonFormDemoCart";
const productGrid = document.querySelector("#product-grid");
const cartDialog = document.querySelector("#cart-dialog");
const checkoutDialog = document.querySelector("#checkout-dialog");
const cartItems = document.querySelector("#cart-items");
let cart = {};
let activeFilter = "all";

function readCart() {
  try {
    const stored = JSON.parse(localStorage.getItem(cartKey) || "{}");
    if (stored && typeof stored === "object" && !Array.isArray(stored)) {
      for (const product of products) {
        const quantity = stored[product.id];
        if (Number.isInteger(quantity) && quantity > 0 && quantity <= 20) {
          cart[product.id] = quantity;
        }
      }
    }
  } catch (error) {
    console.error("Could not read the Maison demo bag.", error);
  }
}

function saveCart() {
  try {
    localStorage.setItem(cartKey, JSON.stringify(cart));
  } catch (error) {
    console.error("Could not save the Maison demo bag.", error);
  }
}

function productArt(product, includeBadge = true) {
  const art = document.createElement("div");
  art.className = `product-art ${product.art}`;
  art.setAttribute("aria-hidden", "true");
  if (includeBadge) {
    const badge = document.createElement("span");
    badge.className = "product-badge";
    badge.textContent = product.badge;
    art.append(badge);
  }
  const bottle = document.createElement("div");
  bottle.className = "product-bottle";
  const label = document.createElement("span");
  label.textContent = "MAISON";
  bottle.append(label);
  art.append(bottle);
  return art;
}

function renderProducts() {
  productGrid.replaceChildren();
  const visibleProducts = products.filter((product) => activeFilter === "all" || product.category === activeFilter);
  document.querySelector("#product-count").textContent = `Showing ${visibleProducts.length} sample product${visibleProducts.length === 1 ? "" : "s"}`;

  for (const product of visibleProducts) {
    const card = document.createElement("article");
    card.className = "product-card";
    card.append(productArt(product));
    const info = document.createElement("div");
    info.className = "product-info";
    const meta = document.createElement("div");
    meta.className = "product-meta";
    const category = document.createElement("span");
    category.textContent = product.categoryLabel;
    const sample = document.createElement("span");
    sample.textContent = "SAMPLE";
    meta.append(category, sample);
    const title = document.createElement("h3");
    title.textContent = product.name;
    const description = document.createElement("p");
    description.textContent = product.description;
    const buyRow = document.createElement("div");
    buyRow.className = "product-buy";
    const price = document.createElement("span");
    price.className = "product-price";
    price.textContent = `$${product.price.toFixed(2)}`;
    const addButton = document.createElement("button");
    addButton.className = "add-button";
    addButton.type = "button";
    addButton.dataset.addProduct = product.id;
    addButton.textContent = cart[product.id] ? `In bag (${cart[product.id]}) · Add` : "Add to bag +";
    buyRow.append(price, addButton);
    info.append(meta, title, description, buyRow);
    card.append(info);
    productGrid.append(card);
  }
}

function cartQuantity() {
  return Object.values(cart).reduce((total, quantity) => total + quantity, 0);
}

function cartSubtotal() {
  return products.reduce((sum, product) => sum + product.price * (cart[product.id] || 0), 0);
}

function renderCart() {
  const quantity = cartQuantity();
  const subtotal = cartSubtotal();
  document.querySelector("#bag-count").textContent = String(quantity);
  document.querySelector("#cart-title-count").textContent = `(${quantity})`;
  document.querySelector("#cart-subtotal").textContent = `$${subtotal.toFixed(2)}`;
  document.querySelector("#checkout-total").textContent = `$${subtotal.toFixed(2)}`;
  document.querySelector("#cart-empty").hidden = quantity > 0;
  document.querySelector("#cart-footer").hidden = quantity === 0;
  cartItems.replaceChildren();

  for (const product of products) {
    const count = cart[product.id] || 0;
    if (!count) continue;
    const row = document.createElement("article");
    row.className = "cart-line";
    const thumb = document.createElement("div");
    thumb.className = "cart-thumb";
    thumb.setAttribute("aria-hidden", "true");
    const bottle = document.createElement("span");
    thumb.append(bottle);
    const details = document.createElement("div");
    const title = document.createElement("h3");
    title.textContent = product.name;
    const price = document.createElement("p");
    price.textContent = `$${(product.price * count).toFixed(2)} · sample price`;
    const controls = document.createElement("div");
    controls.className = "quantity-controls";
    const decrease = document.createElement("button");
    decrease.type = "button";
    decrease.dataset.cartAction = "decrease";
    decrease.dataset.productId = product.id;
    decrease.setAttribute("aria-label", `Remove one ${product.name}`);
    decrease.textContent = "−";
    const number = document.createElement("span");
    number.textContent = String(count);
    const increase = document.createElement("button");
    increase.type = "button";
    increase.dataset.cartAction = "increase";
    increase.dataset.productId = product.id;
    increase.setAttribute("aria-label", `Add one ${product.name}`);
    increase.textContent = "+";
    controls.append(decrease, number, increase);
    details.append(title, price, controls);
    const remove = document.createElement("button");
    remove.type = "button";
    remove.className = "remove-button";
    remove.dataset.cartAction = "remove";
    remove.dataset.productId = product.id;
    remove.textContent = "Remove";
    row.append(thumb, details, remove);
    cartItems.append(row);
  }
  renderProducts();
}

readCart();
renderProducts();
renderCart();

for (const filterButton of document.querySelectorAll("[data-filter]")) {
  filterButton.addEventListener("click", () => {
    activeFilter = filterButton.dataset.filter;
    for (const button of document.querySelectorAll("[data-filter]")) {
      const selected = button === filterButton;
      button.classList.toggle("is-active", selected);
      button.setAttribute("aria-pressed", String(selected));
    }
    renderProducts();
  });
}

productGrid.addEventListener("click", (event) => {
  const button = event.target.closest("[data-add-product]");
  if (!button) return;
  const product = products.find((item) => item.id === button.dataset.addProduct);
  if (!product) return;
  cart[product.id] = Math.min(20, (cart[product.id] || 0) + 1);
  saveCart();
  renderCart();
  button.textContent = `Added · Bag (${cartQuantity()})`;
  window.setTimeout(renderProducts, 900);
});

cartItems.addEventListener("click", (event) => {
  const button = event.target.closest("[data-cart-action]");
  if (!button) return;
  const productId = button.dataset.productId;
  const quantity = cart[productId] || 0;
  if (button.dataset.cartAction === "increase") cart[productId] = Math.min(20, quantity + 1);
  if (button.dataset.cartAction === "decrease" && quantity > 1) cart[productId] = quantity - 1;
  else if (button.dataset.cartAction === "decrease" || button.dataset.cartAction === "remove") delete cart[productId];
  saveCart();
  renderCart();
});

document.querySelector("#open-cart").addEventListener("click", () => cartDialog.showModal());
document.querySelectorAll("[data-close]").forEach((button) => {
  button.addEventListener("click", () => document.getElementById(button.dataset.close).close());
});
document.addEventListener("keydown", (event) => {
  if (event.key !== "Escape") return;
  const openDialog = Array.from(document.querySelectorAll("dialog[open]")).pop();
  if (openDialog) {
    event.preventDefault();
    openDialog.close();
  }
});
document.querySelector("#checkout-button").addEventListener("click", () => {
  cartDialog.close();
  document.querySelector("#checkout-status").textContent = "";
  checkoutDialog.showModal();
  document.querySelector("#checkout-name").focus();
});

document.querySelector("#checkout-form").addEventListener("submit", (event) => {
  event.preventDefault();
  const form = event.currentTarget;
  if (!form.reportValidity()) return;
  const orderNumber = `MF-DEMO-${Math.random().toString(36).slice(2, 7).toUpperCase()}`;
  document.querySelector("#checkout-status").textContent = `Test preview complete. Reference ${orderNumber}; no order or payment was created.`;
  cart = {};
  saveCart();
  renderCart();
  form.reset();
});
