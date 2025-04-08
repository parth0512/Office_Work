document.addEventListener("DOMContentLoaded", function () {
  // Cart state
  let cartItems = JSON.parse(localStorage.getItem("cart")) || [];
  const cartIcon = document.querySelector(".icon-cart");
  const cartCount = document.querySelector(".icon-cart span");
  const cartPanel = document.querySelector(".cart-panel");
  const cartItemsContainer = document.querySelector(".cart-items");
  const closeCart = document.querySelector(".close-cart");
  const cartOverlay = document.querySelector(".cart-overlay");
  const body = document.body;

  // Initialize cart
  updateCartCount();

  // Cart functions
  function addToCart(product) {
    const existingItem = cartItems.find((item) => item.id === product.id);

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cartItems.push({
        ...product,
        quantity: 1,
      });
    }

    updateCart();
    showCartNotification(`${product.title} added to cart!`);
  }

  function updateCart() {
    localStorage.setItem("cart", JSON.stringify(cartItems));
    updateCartCount();
    renderCartItems();
  }

  function updateCartCount() {
    const totalItems = cartItems.reduce(
      (total, item) => total + item.quantity,
      0
    );
    cartCount.textContent = totalItems;
  }

  function renderCartItems() {
    cartItemsContainer.innerHTML = "";

    if (cartItems.length === 0) {
      cartItemsContainer.innerHTML =
        '<p class="empty-cart-message">Your cart is empty</p>';
      return;
    }

    cartItems.forEach((item) => {
      const cartItemElement = document.createElement("div");
      cartItemElement.className = "cart-item";
      cartItemElement.innerHTML = `
          <div class="cart-item-image">
            <img src="${item.image}" alt="${item.title}">
          </div>
          <div class="cart-item-details">
            <h6>${item.title}</h6>
            <p>$${item.price.toFixed(2)} x ${item.quantity}</p>
            <p>$${(item.price * item.quantity).toFixed(2)}</p>
          </div>
          <div class="cart-item-actions">
            <button class="cart-item-decrease" data-id="${item.id}">-</button>
            <button class="cart-item-remove" data-id="${
              item.id
            }">&times;</button>
          </div>
        `;
      cartItemsContainer.appendChild(cartItemElement);
    });

    // Add total
    const total = cartItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    const totalElement = document.createElement("div");
    totalElement.className = "cart-total";
    totalElement.innerHTML = `Total: $${total.toFixed(2)}`;
    cartItemsContainer.appendChild(totalElement);

    // Add checkout button
    const checkoutBtn = document.createElement("button");
    checkoutBtn.className = "checkout-btn";
    checkoutBtn.textContent = "Proceed to Checkout";
    cartItemsContainer.appendChild(checkoutBtn);

    // Add event listeners
    document.querySelectorAll(".cart-item-decrease").forEach((button) => {
      button.addEventListener("click", function () {
        const productId = this.getAttribute("data-id");
        decreaseQuantity(productId);
      });
    });

    document.querySelectorAll(".cart-item-remove").forEach((button) => {
      button.addEventListener("click", function () {
        const productId = this.getAttribute("data-id");
        removeFromCart(productId);
      });
    });

    checkoutBtn.addEventListener("click", function () {
      alert("Proceeding to checkout!");
    });
  }

  function decreaseQuantity(productId) {
    const itemIndex = cartItems.findIndex((item) => item.id == productId);

    if (itemIndex !== -1) {
      if (cartItems[itemIndex].quantity > 1) {
        cartItems[itemIndex].quantity -= 1;
      } else {
        cartItems.splice(itemIndex, 1);
      }
      updateCart();
    }
  }

  function removeFromCart(productId) {
    cartItems = cartItems.filter((item) => item.id != productId);
    updateCart();
  }

  function showCartNotification(message) {
    const notification = document.createElement("div");
    notification.className = "login-notification";
    notification.innerHTML = `<span>${message}</span>`;
    document.body.appendChild(notification);

    setTimeout(() => {
      notification.classList.add("show");
    }, 10);

    setTimeout(() => {
      notification.classList.remove("show");
      setTimeout(() => {
        notification.remove();
      }, 300);
    }, 3000);
  }

  // Cart panel toggle
  cartIcon.addEventListener("click", function (e) {
    e.preventDefault();
    cartPanel.classList.add("active");
    cartOverlay.style.display = "block";
    body.classList.add("body-login-open");
    renderCartItems();
  });

  function closeCartPanel() {
    cartPanel.classList.remove("active");
    cartOverlay.style.display = "none";
    body.classList.remove("body-login-open");
  }

  closeCart.addEventListener("click", closeCartPanel);
  cartOverlay.addEventListener("click", closeCartPanel);

  // Make addToCart function available globally
  window.addToCart = addToCart;
});
