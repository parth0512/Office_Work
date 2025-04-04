document.addEventListener('DOMContentLoaded', function() {
    const cartTab = document.querySelector('.cartTab');
    const iconCart = document.querySelector('.icon-cart');
    const closeBtn = document.querySelector('.close');
    const listCart = document.querySelector('.listCart');
    const cartCount = document.querySelector('.icon-cart span');
    const addToCartButtons = document.querySelectorAll('.add_cart');
    const cartOverlay = document.querySelector('.cart-overlay');
    const body = document.body;

    let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    updateCart();

    iconCart.addEventListener('click', openCart);
    closeBtn.addEventListener('click', closeCart);
    cartOverlay.addEventListener('click', closeCart);

    addToCartButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            
            const card = this.closest('.card-body') || this.closest('.gift-body');
            const productName = card.querySelector('h5').textContent;
            const productPrice = parseFloat(card.querySelector('p').textContent.replace('₹', '').trim());
            const productImg = card.closest('.col-md-4, .col-lg-4').querySelector('img').src;
            
            addToCart(productName, productPrice, productImg);
            showAddToCartNotification(productName);
        });
    });

    function openCart() {
        cartTab.style.right = '0';
        cartOverlay.classList.add('active');
        body.classList.add('body-lock');
    }

    function closeCart() {
        cartTab.style.right = '-400px';
        cartOverlay.classList.remove('active');
        body.classList.remove('body-lock');
    }

    function addToCart(name, price, img) {
        const existingItem = cartItems.find(item => item.name === name);
        
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cartItems.push({
                name: name,
                price: price,
                img: img,
                quantity: 1
            });
        }
        
        saveCart();
        updateCart();
    }

    function updateCart() {
        listCart.innerHTML = '';
        let totalCount = 0;
        let totalPrice = 0;
        
        cartItems.forEach(item => {
            totalCount += item.quantity;
            totalPrice += item.price * item.quantity;
            
            const cartItem = document.createElement('div');
            cartItem.className = 'cart-item';
            cartItem.innerHTML = `
                <img src="${item.img}" alt="${item.name}">
                <div class="cart-item-details">
                    <h5>${item.name}</h5>
                    <p>₹${item.price.toFixed(2)}</p>
                    <div class="quantity-controls">
                        <button class="decrease-quantity" data-name="${item.name}">−</button>
                        <span class="quantity">${item.quantity}</span>
                        <button class="increase-quantity" data-name="${item.name}">+</button>
                    </div>
                </div>
                <button class="remove-item" data-name="${item.name}">×</button>
            `;
            listCart.appendChild(cartItem);
        });
 
        cartCount.textContent = totalCount;
 
        const checkoutBtn = document.querySelector('.checkout');
        checkoutBtn.innerHTML = `Check Out - ₹${totalPrice.toFixed(2)}`;
 
        document.querySelectorAll('.decrease-quantity').forEach(button => {
            button.addEventListener('click', function() {
                const itemName = this.getAttribute('data-name');
                adjustQuantity(itemName, -1);
            });
        });
        
        document.querySelectorAll('.increase-quantity').forEach(button => {
            button.addEventListener('click', function() {
                const itemName = this.getAttribute('data-name');
                adjustQuantity(itemName, 1);
            });
        });
        
        document.querySelectorAll('.remove-item').forEach(button => {
            button.addEventListener('click', function() {
                const itemName = this.getAttribute('data-name');
                removeItemCompletely(itemName);
            });
        });
    }

    function adjustQuantity(name, change) {
        const item = cartItems.find(item => item.name === name);
        if (item) {
            item.quantity += change;

            if (item.quantity <= 0) {
                cartItems = cartItems.filter(i => i.name !== name);
            }
            
            saveCart();
            updateCart();
        }
    }

    function removeItemCompletely(name) {
        cartItems = cartItems.filter(item => item.name !== name);
        saveCart();
        updateCart();
    }

    function saveCart() {
        localStorage.setItem('cartItems', JSON.stringify(cartItems));
    }

    function showAddToCartNotification(productName) {
        const notification = document.createElement('div');
        notification.className = 'add-to-cart-notification';
        notification.innerHTML = `
            <span>${productName} added to cart!</span>
        `;
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.classList.add('show');
        }, 10);
        
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 2000);
    }

    listCart.addEventListener('wheel', function(e) {
        e.stopPropagation();
    });
});