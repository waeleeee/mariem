// Check if user is logged in
document.addEventListener('DOMContentLoaded', function() {
    checkUserLoggedIn();
    loadProductDetails();
    setupTabNavigation();
    initializeQuantityControls();
});

// Check if user is logged in
function checkUserLoggedIn() {
    const userId = localStorage.getItem('userId');
    const userEmail = localStorage.getItem('userEmail');
    
    if (userId && userEmail) {
        document.getElementById('user-info').textContent = userEmail;
        document.getElementById('login-section').style.display = 'none';
        document.getElementById('user-section').style.display = 'flex';
    } else {
        document.getElementById('login-section').style.display = 'flex';
        document.getElementById('user-section').style.display = 'none';
    }
}

// Get product ID from URL
function getProductIdFromUrl() {
    const params = new URLSearchParams(window.location.search);
    return parseInt(params.get('id'));
}

// Load product details
function loadProductDetails() {
    const productId = getProductIdFromUrl();
    
    if (!productId) {
        window.location.href = 'products.html';
        return;
    }
    
    // Import product data from products.js
    const product = findProductById(productId);
    
    if (!product) {
        showProductNotFound();
        return;
    }
    
    // Update page title
    document.title = `${product.name} - RadioWorld`;
    
    // Update product details
    document.getElementById('product-title').textContent = product.name;
    document.getElementById('product-image').src = product.image;
    document.getElementById('product-image').alt = product.name;
    document.getElementById('product-description').textContent = product.description;
    document.getElementById('product-price').textContent = `$${product.price.toFixed(2)}`;
    
    // Update stock status
    const stockElement = document.getElementById('product-stock');
    if (product.stock < 5) {
        stockElement.textContent = 'Low Stock';
        stockElement.classList.add('low-stock');
    } else {
        stockElement.textContent = 'In Stock';
    }
    
    // Update add to cart button
    const addToCartBtn = document.getElementById('add-to-cart-btn');
    addToCartBtn.addEventListener('click', () => addToCart(product));
    
    // Populate features
    const featuresList = document.getElementById('features-list');
    featuresList.innerHTML = '';
    
    product.features.forEach(feature => {
        const li = document.createElement('li');
        li.textContent = feature;
        featuresList.appendChild(li);
    });
    
    // Populate specifications
    const specificationsTable = document.getElementById('specifications-table');
    specificationsTable.innerHTML = '';
    
    for (const [key, value] of Object.entries(product.specifications)) {
        const row = document.createElement('tr');
        
        const keyCell = document.createElement('td');
        keyCell.textContent = key;
        
        const valueCell = document.createElement('td');
        valueCell.textContent = value;
        
        row.appendChild(keyCell);
        row.appendChild(valueCell);
        specificationsTable.appendChild(row);
    }
    
    // Load related products
    loadRelatedProducts(product.relatedProducts);
}

// Find product by ID (we'll load this from products.js)
function findProductById(productId) {
    // Note: In a real application, this would be imported from products.js
    // For the sake of simplicity, we'll define a placeholder method that
    // accesses the global products array defined in products.js
    return window.products.find(product => product.id === productId);
}

// Show product not found message
function showProductNotFound() {
    const container = document.querySelector('.product-detail-container');
    container.innerHTML = `
        <div class="product-not-found">
            <h2>Product Not Found</h2>
            <p>The product you're looking for doesn't exist or has been removed.</p>
            <a href="products.html" class="btn btn-primary">Back to Products</a>
        </div>
    `;
}

// Load related products
function loadRelatedProducts(relatedProductIds) {
    const relatedProductsGrid = document.getElementById('related-products-grid');
    relatedProductsGrid.innerHTML = '';
    
    // If no related products, show message
    if (!relatedProductIds || relatedProductIds.length === 0) {
        relatedProductsGrid.innerHTML = '<p>No related products found.</p>';
        return;
    }
    
    // Load related products
    relatedProductIds.forEach(id => {
        const relatedProduct = findProductById(id);
        
        if (relatedProduct) {
            const productCard = document.createElement('div');
            productCard.className = 'related-product-card';
            
            productCard.innerHTML = `
                <div class="product-image">
                    <img src="${relatedProduct.image}" alt="${relatedProduct.name}">
                    <div class="product-category">${relatedProduct.category}</div>
                </div>
                <div class="product-info">
                    <h3>${relatedProduct.name}</h3>
                    <div class="product-price">$${relatedProduct.price.toFixed(2)}</div>
                    <a href="product-detail.html?id=${relatedProduct.id}" class="view-product-btn">View Product</a>
                </div>
            `;
            
            relatedProductsGrid.appendChild(productCard);
        }
    });
}

// Setup tab navigation
function setupTabNavigation() {
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabPanes = document.querySelectorAll('.tab-pane');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons and panes
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabPanes.forEach(pane => pane.classList.remove('active'));
            
            // Add active class to clicked button and corresponding pane
            button.classList.add('active');
            const tabId = button.getAttribute('data-tab');
            document.getElementById(tabId).classList.add('active');
        });
    });
}

// Initialize quantity controls
function initializeQuantityControls() {
    const decreaseBtn = document.getElementById('decrease-quantity');
    const increaseBtn = document.getElementById('increase-quantity');
    const quantityInput = document.getElementById('quantity-input');
    
    // Set minimum quantity to 1
    if (quantityInput.value < 1) {
        quantityInput.value = 1;
    }
    
    // Decrease quantity
    decreaseBtn.addEventListener('click', () => {
        let quantity = parseInt(quantityInput.value);
        if (quantity > 1) {
            quantityInput.value = quantity - 1;
        }
    });
    
    // Increase quantity
    increaseBtn.addEventListener('click', () => {
        let quantity = parseInt(quantityInput.value);
        quantityInput.value = quantity + 1;
    });
    
    // Validate input to ensure it's a positive number
    quantityInput.addEventListener('change', () => {
        let quantity = parseInt(quantityInput.value);
        if (isNaN(quantity) || quantity < 1) {
            quantityInput.value = 1;
        }
    });
}

// Add to cart
function addToCart(product) {
    const quantity = parseInt(document.getElementById('quantity-input').value);
    
    if (isNaN(quantity) || quantity < 1) {
        alert('Please enter a valid quantity.');
        return;
    }
    
    // Get existing cart from localStorage
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    // Check if product already exists in cart
    const existingProductIndex = cart.findIndex(item => item.id === product.id);
    
    if (existingProductIndex !== -1) {
        // Update quantity if product already exists
        cart[existingProductIndex].quantity += quantity;
    } else {
        // Add new product to cart
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            quantity: quantity
        });
    }
    
    // Save updated cart to localStorage
    localStorage.setItem('cart', JSON.stringify(cart));
    
    // Update cart counter
    updateCartCounter();
    
    // Show success message
    showAddToCartSuccess(product.name, quantity);
}

// Update cart counter
function updateCartCounter() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const cartCounter = document.getElementById('cart-counter');
    
    if (cartCounter) {
        const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
        cartCounter.textContent = totalItems;
        
        if (totalItems > 0) {
            cartCounter.style.display = 'flex';
        } else {
            cartCounter.style.display = 'none';
        }
    }
}

// Show add to cart success message
function showAddToCartSuccess(productName, quantity) {
    // Create success message element
    const successMessage = document.createElement('div');
    successMessage.className = 'add-to-cart-success';
    successMessage.innerHTML = `
        <div class="success-icon">✓</div>
        <div class="success-message">
            <strong>${quantity}x ${productName}</strong> added to your cart.
        </div>
        <div class="success-actions">
            <a href="cart.html" class="btn btn-primary">View Cart</a>
            <button class="btn btn-outline close-success">Continue Shopping</button>
        </div>
    `;
    
    // Add success message to the page
    document.body.appendChild(successMessage);
    
    // Add close button functionality
    const closeButton = successMessage.querySelector('.close-success');
    closeButton.addEventListener('click', () => {
        successMessage.remove();
    });
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (document.body.contains(successMessage)) {
            successMessage.remove();
        }
    }, 5000);
}

// Handle logout
function logout() {
    localStorage.removeItem('userId');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('token');
    
    // Redirect to login page
    window.location.href = 'login.html';
}

// Add event listeners
document.addEventListener('DOMContentLoaded', function() {
    // Logout button
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', logout);
    }
    
    // Update cart counter on page load
    updateCartCounter();
    
    // Mobile menu toggle
    const menuToggle = document.getElementById('menu-toggle');
    const mobileMenu = document.getElementById('mobile-menu');
    
    if (menuToggle && mobileMenu) {
        menuToggle.addEventListener('click', () => {
            mobileMenu.classList.toggle('active');
        });
    }
}); 