// Menu + cart. Products are loaded from the database through GET /api/snacks.
const EMOJI = {
  Cookies: "🍪", "Ice Cream": "🍦", Pizza: "🍕", Burgers: "🍔", Donuts: "🍩", Drinks: "🥤",
};

const productGrid = document.getElementById("product-grid");
const searchInput = document.getElementById("search-input");
const cartItemsEl = document.getElementById("cart-items");
const cartCountEl = document.getElementById("cart-count");
const cartTotalEl = document.getElementById("cart-total");

let snacks = [];
let activeCategory = "All";
let cart = loadCart(); // { [snackId]: quantity }

const peso = (n) => "₱" + Number(n).toFixed(2);

function loadCart() {
  try { return JSON.parse(localStorage.getItem("snoopysnack-cart")) || {}; } catch { return {}; }
}
function saveCart() {
  try { localStorage.setItem("snoopysnack-cart", JSON.stringify(cart)); } catch { /* storage unavailable */ }
}

function el(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

async function loadSnacks() {
  productGrid.replaceChildren(el("p", "product-status", "Loading menu..."));
  try {
    const res = await fetch("/api/snacks?available=true");
    if (!res.ok) throw new Error("bad response");
    snacks = (await res.json()).data;
    renderProducts();
    renderCart();
  } catch {
    productGrid.replaceChildren(el("p", "product-status", "Could not load the menu. Please try again later."));
  }
}

function renderProducts() {
  const term = searchInput.value.trim().toLowerCase();
  const list = snacks.filter((s) =>
    (activeCategory === "All" || s.category === activeCategory) &&
    (!term || s.name.toLowerCase().includes(term) || (s.description || "").toLowerCase().includes(term))
  );

  if (!list.length) {
    productGrid.replaceChildren(el("p", "product-status", "No items found."));
    return;
  }

  productGrid.replaceChildren(...list.map((s) => {
    const card = el("article", "product-card");
    card.append(el("div", "product-emoji", EMOJI[s.category] || "🍽️"));

    const info = el("div", "product-info");
    info.append(el("h3", "", s.name), el("p", "", s.description || ""));

    const bottom = el("div", "product-bottom");
    const add = el("button", "add-to-cart", "Add to Cart");
    add.type = "button";
    add.addEventListener("click", () => changeQty(s.id, 1));
    bottom.append(el("span", "product-price", peso(s.price)), add);

    info.append(bottom);
    card.append(info);
    return card;
  }));
}

function changeQty(id, delta) {
  const next = (cart[id] || 0) + delta;
  if (next <= 0) delete cart[id]; else cart[id] = next;
  saveCart();
  renderCart();
}

function renderCart() {
  const lines = Object.entries(cart)
    .map(([id, qty]) => ({ snack: snacks.find((s) => s.id === Number(id)), qty }))
    .filter((l) => l.snack);

  const count = lines.reduce((n, l) => n + l.qty, 0);
  const total = lines.reduce((n, l) => n + l.qty * l.snack.price, 0);
  cartCountEl.textContent = count;
  cartTotalEl.textContent = peso(total);

  if (!lines.length) {
    cartItemsEl.replaceChildren(el("p", "empty-cart", "Your cart is waiting for something yummy! ♡"));
    return;
  }

  cartItemsEl.replaceChildren(...lines.map(({ snack, qty }) => {
    const row = el("div", "cart-item");
    const label = el("div");
    label.append(el("h4", "", snack.name), el("p", "", `${peso(snack.price)} each • ${peso(snack.price * qty)}`));

    const actions = el("div", "cart-item-actions");
    const minus = el("button", "quantity-button", "−");
    const plus = el("button", "quantity-button", "+");
    const remove = el("button", "remove-button", "Remove");
    [minus, plus, remove].forEach((b) => (b.type = "button"));
    minus.addEventListener("click", () => changeQty(snack.id, -1));
    plus.addEventListener("click", () => changeQty(snack.id, 1));
    remove.addEventListener("click", () => changeQty(snack.id, -qty));
    actions.append(minus, el("span", "", String(qty)), plus, remove);

    row.append(label, actions);
    return row;
  }));
}

// Category buttons (both the big cards and the filter pills)
function setCategory(category) {
  activeCategory = category;
  document.querySelectorAll(".filter-button").forEach((b) =>
    b.classList.toggle("active", b.dataset.category === category));
  renderProducts();
}
document.querySelectorAll(".category-card").forEach((b) =>
  b.addEventListener("click", () => {
    setCategory(b.dataset.category);
    document.getElementById("menu").scrollIntoView({ behavior: "smooth" });
  }));
document.querySelectorAll(".filter-button").forEach((b) =>
  b.addEventListener("click", () => setCategory(b.dataset.category)));

searchInput.addEventListener("input", renderProducts);

// Demo checkout (orders are not saved to the database yet)
document.getElementById("checkout-button").addEventListener("click", () => {
  if (!Object.keys(cart).length) return alert("Your cart is empty. Add something yummy first!");
  alert("Thank you for your order! (Demo checkout)");
  cart = {};
  saveCart();
  renderCart();
});

loadSnacks();
