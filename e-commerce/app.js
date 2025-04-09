let currentUser = null;
let cart = JSON.parse(localStorage.getItem("cart")) || [];
let allProducts = [];

const authSection = document.getElementById("authSection");
const mainContent = document.getElementById("mainContent");
const cartPage = document.getElementById("cartPage");
const productList = document.getElementById("productList");
const cartCount = document.getElementById("cartCount");
const cartItemsContainer = document.getElementById("cartItems");
const userEmail = document.getElementById("userEmail");
const cartTotal = document.getElementById("cartTotal");
const closeCartBtn = document.getElementById("closeCartBtn");

document.getElementById("loginForm").addEventListener("submit", handleLogin);
document.getElementById("signupForm").addEventListener("submit", handleSignup);
document.getElementById("logoutBtn").addEventListener("click", handleLogout);
document.getElementById("cartLink").addEventListener("click", showCartPage);
closeCartBtn.addEventListener("click", closeCartPage);

function toggleAuthNavItems(show) {
  const cartLink = document.getElementById("cartLink");
  const userEmailDisplay = document.querySelector(".text-white");
  const logoutBtn = document.getElementById("logoutBtn");
  
  if (cartLink) cartLink.style.display = show ? "block" : "none";
  if (userEmailDisplay) userEmailDisplay.style.display = show ? "block" : "none";
  if (logoutBtn) logoutBtn.style.display = show ? "block" : "none";
}

function handleLogin(e) {
  e.preventDefault();
  currentUser = {
    email: e.target.querySelector('input[type="email"]').value,
  };
  localStorage.setItem("currentUser", JSON.stringify(currentUser));
  toggleAuthNavItems(true);
  showMainContent();
}

function handleSignup(e) {
  e.preventDefault();
  currentUser = {
    name: e.target.querySelector('input[type="text"]').value,
    email: e.target.querySelector('input[type="email"]').value,
  };
  localStorage.setItem("currentUser", JSON.stringify(currentUser));
  toggleAuthNavItems(true);
  showMainContent();
}

function handleLogout() {
  localStorage.removeItem("currentUser");
  localStorage.removeItem("cart");
  toggleAuthNavItems(false);
  window.location.reload();
}

function addToCart(product) {
  const existingItem = cart.find((item) => item.id === product.id);
  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({ ...product, quantity: 1 });
  }
  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartCount();
}

function addToCartById(productId) {
  const product = allProducts.find((p) => p.id === productId);
  if (product) {
    addToCart(product);
  }
}

function updateCartCount() {
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  cartCount.textContent = totalItems;
}

function renderCartItems() {
  document.getElementById("footer").style.display = "none";
  cartItemsContainer.innerHTML = cart
    .map(
      (item) => `
      <div class="cart-item d-flex justify-content-between align-items-center mb-3 border-bottom pb-2">
        <div class="flex-grow-1">
         <img src="${item.image}" style="width:60px;height:60px;margin-bottom:20px">
          <h5>${item.title}</h5> 
          <p>Price: $${item.price} x ${item.quantity} = $${(item.price * item.quantity).toFixed(2)}</p>
          <div class="btn-group" role="group">
            <button class="btn btn-sm btn-secondary" onclick="decreaseQuantity(${item.id})">-</button>
            <span class="px-3">${item.quantity}</span>
            <button class="btn btn-sm btn-secondary" onclick="increaseQuantity(${item.id})">+</button>
          </div>
        </div>
        <button class="btn btn-close" aria-label="Close" onclick="removeFromCart(${item.id})"></button>
      </div>
    `
    )
    .join("");

  updateCartCount();
  updateTotalPrice();
}

function removeFromCart(productId) {
  cart = cart.filter((item) => item.id !== productId);
  localStorage.setItem("cart", JSON.stringify(cart));
  renderCartItems();
}

function increaseQuantity(productId) {
  const item = cart.find((item) => item.id === productId);
  if (item) {
    item.quantity += 1;
    localStorage.setItem("cart", JSON.stringify(cart));
    renderCartItems();
  }
}

function decreaseQuantity(productId) {
  const item = cart.find((item) => item.id === productId);
  if (item && item.quantity > 1) {
    item.quantity -= 1;
  } else {
    cart = cart.filter((i) => i.id !== productId);
  }
  localStorage.setItem("cart", JSON.stringify(cart));
  renderCartItems();
}

function updateTotalPrice() {
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  cartTotal.textContent = `Total: $${total.toFixed(2)}`;
}

function showMainContent() {
  authSection.classList.add("d-none");
  mainContent.classList.remove("d-none");
  cartPage.classList.add("d-none");
  document.getElementById("footer").style.display = "block";
  loadProducts();
}

function showCartPage(e) {
  if (e) e.preventDefault();
  mainContent.classList.add("d-none");
  cartPage.classList.remove("d-none");
  renderCartItems();
}

function closeCartPage() {
  cartPage.classList.add("d-none");
  mainContent.classList.remove("d-none");
  document.getElementById("footer").style.display = "block"; 
}

async function loadProducts() {
  try {
    const response = await fetch("https://fakestoreapi.com/products");
    const products = await response.json();
    allProducts = products;
    renderProducts(products);
  } catch (error) {
    console.error("Error loading products:", error);
    productList.innerHTML = `
      <div class="alert alert-danger">
        Failed to load products. Please try again later.
      </div>
    `;
  }
}

function renderProducts(products) {
  productList.innerHTML = `<h2>Product List</h2>`;
  productList.innerHTML += products
    .map(
      (product) => `
        <div class="col-md-4 mb-4">
          <div class="card product-card h-100">
            <img src="${product.image}" class="card-img-top" alt="${product.title}">
            <div class="card-body">
              <h5 class="card-title">${product.title.substring(0, 30)}</h5>
              <p class="card-text"><strong>Price:</strong> $${product.price.toFixed(2)}</p>
              <button class="btn btn-primary w-100" onclick="addToCartById(${product.id})">
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      `
    )
    .join("");
}

function init() {
  currentUser = JSON.parse(localStorage.getItem("currentUser"));
  if (currentUser) {
    userEmail.textContent = currentUser.email || "";
    showMainContent();
    updateCartCount();
    toggleAuthNavItems(true);
  } else {
    authSection.classList.remove("d-none");
    mainContent.classList.add("d-none");
    cartPage.classList.add("d-none");
    document.getElementById("footer").style.display = "none";
    toggleAuthNavItems(false);
  }
}

function checkout() {
  alert("Checkout functionality not implemented yet");
}

window.onload = init;