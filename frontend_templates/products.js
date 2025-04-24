// Check if user is logged in
document.addEventListener('DOMContentLoaded', function() {
    checkUserLoggedIn();
    loadProducts();
    setupFilterListeners();
    setupSearchFunctionality();
    setupSortingFunctionality();
});

// Sample product data
const products = [
    {
        id: 1,
        name: "ICOM IC-7300 HF/50MHz Transceiver",
        description: "The ICOM IC-7300 is a high-performance HF/50MHz transceiver featuring a direct sampling receiver, real-time spectrum scope, and touch screen interface.",
        price: 1299.95,
        category: "HF Transceivers",
        stock: 15,
        image: "https://www.radioworld.co.uk/images/products/zoom/1460368399-90695700.jpg",
        features: [
            "Direct sampling receiver",
            "Real-time spectrum scope with waterfall display",
            "Touch screen interface",
            "100W output power",
            "USB connection for PC control"
        ],
        specifications: {
            "Frequency Range": "0.5-29.999999 MHz, 50-54 MHz",
            "Mode": "USB, LSB, CW, RTTY, AM, FM",
            "Output Power": "2-100W (HF), 2-100W (50MHz)",
            "Power Supply": "13.8V DC ±15%",
            "Current Drain": "Max 21A",
            "Dimensions": "240(W) × 94(H) × 238(D) mm",
            "Weight": "4.2kg"
        },
        relatedProducts: [2, 3, 5]
    },
    {
        id: 2,
        name: "Yaesu FT-991A HF/VHF/UHF Transceiver",
        description: "The Yaesu FT-991A is an all-mode, all-band MF/HF/VHF/UHF transceiver with C4FM digital capability and a high-resolution TFT touch panel display.",
        price: 1549.95,
        category: "HF Transceivers",
        stock: 8,
        image: "https://www.radioworld.co.uk/images/products/zoom/ft-991a.jpg",
        features: [
            "Multi-mode operation on HF/50/144/430 MHz",
            "C4FM digital mode capability",
            "32-bit high-speed DSP",
            "3.5-inch TFT full-color touch panel",
            "Built-in high accuracy TCXO"
        ],
        specifications: {
            "Frequency Range": "HF/50/144/430 MHz",
            "Mode": "SSB, CW, AM, FM, C4FM Digital",
            "Output Power": "100W (HF/50MHz), 50W (144MHz), 30W (430MHz)",
            "Power Supply": "13.8V DC",
            "Current Drain": "Max 23A",
            "Dimensions": "229(W) × 80(H) × 253(D) mm",
            "Weight": "4.3kg"
        },
        relatedProducts: [1, 3, 4]
    },
    {
        id: 3,
        name: "Kenwood TS-890S HF Transceiver",
        description: "The Kenwood TS-890S is a high-end HF/50MHz transceiver with dual 24-bit ADCs, a 7-inch color TFT display, and roofing filters for exceptional receive performance.",
        price: 3999.95,
        category: "HF Transceivers",
        stock: 5,
        image: "https://www.radioworld.co.uk/images/products/zoom/kenwood-ts-890s-front.jpg",
        features: [
            "Dual 24-bit analog-to-digital converters",
            "Down conversion for all amateur radio bands",
            "High-speed DSP",
            "7-inch color TFT display",
            "Built-in high-speed automatic antenna tuner"
        ],
        specifications: {
            "Frequency Range": "1.8-54 MHz (Amateur bands)",
            "Mode": "USB, LSB, CW, FSK, PSK, FM, AM",
            "Output Power": "5-100W (AM: 5-25W)",
            "Power Supply": "13.8V DC ±15%",
            "Current Drain": "Max 22.5A",
            "Dimensions": "396(W) × 141.3(H) × 340(D) mm",
            "Weight": "15.8kg"
        },
        relatedProducts: [1, 2, 5]
    },
    {
        id: 4,
        name: "Baofeng UV-5R Dual Band Handheld Radio",
        description: "The Baofeng UV-5R is a compact dual-band handheld transceiver providing 4W output on VHF and UHF bands, with 128 programmable channels.",
        price: 29.95,
        category: "Handheld Radios",
        stock: 50,
        image: "https://www.radioworld.co.uk/images/products/zoom/1448551520-71825700.jpg",
        features: [
            "Dual band (VHF/UHF) operation",
            "Up to 4W output power",
            "128 programmable channels",
            "Built-in LED flashlight",
            "FM radio receiver"
        ],
        specifications: {
            "Frequency Range": "136-174 MHz (VHF), 400-520 MHz (UHF)",
            "Mode": "FM, NFM",
            "Output Power": "4W (High), 1W (Low)",
            "Battery": "1800mAh Li-ion",
            "Current Drain": "≤ 1.4A",
            "Dimensions": "58(W) × 110(H) × 32(D) mm",
            "Weight": "130g"
        },
        relatedProducts: [6, 7, 8]
    },
    {
        id: 5,
        name: "Alinco DX-SR8T HF Transceiver",
        description: "The Alinco DX-SR8T is a compact and affordable HF transceiver with 100W output, IF DSP, and detachable front panel for flexible installation.",
        price: 699.95,
        category: "HF Transceivers",
        stock: 12,
        image: "https://www.radioworld.co.uk/images/products/zoom/1597238237-79183400.jpg",
        features: [
            "100W output power (HF bands)",
            "IF DSP for noise reduction and filtering",
            "Detachable front panel for remote mounting",
            "CW keyer built-in",
            "Narrow filters included"
        ],
        specifications: {
            "Frequency Range": "1.8-29.7 MHz (Amateur bands)",
            "Mode": "USB, LSB, CW, AM, FM",
            "Output Power": "10-100W (AM: 4-40W)",
            "Power Supply": "13.8V DC ±15%",
            "Current Drain": "Max 20A",
            "Dimensions": "240(W) × 94(H) × 255(D) mm",
            "Weight": "4.1kg"
        },
        relatedProducts: [1, 2, 3]
    },
    {
        id: 6,
        name: "Yaesu FT-70DR Digital Handheld Transceiver",
        description: "The Yaesu FT-70DR is a rugged dual-band handheld with C4FM digital and conventional FM operation, with 5W output and wide-range receiver.",
        price: 179.95,
        category: "Handheld Radios",
        stock: 25,
        image: "https://www.radioworld.co.uk/images/products/zoom/1487586453-60822900.jpg",
        features: [
            "System Fusion II compatible",
            "Dual band operation (VHF/UHF)",
            "5W maximum output power",
            "IP54 rated water and dust protection",
            "Wide band receive from 108-579.995 MHz"
        ],
        specifications: {
            "Frequency Range": "144-148 MHz, 430-450 MHz (TX)",
            "Mode": "C4FM Digital, FM",
            "Output Power": "5W (High), 2W (Mid), 0.5W (Low)",
            "Battery": "1800mAh Li-ion",
            "Current Drain": "Max 1.6A",
            "Dimensions": "60(W) × 98(H) × 33(D) mm",
            "Weight": "220g with antenna and battery"
        },
        relatedProducts: [4, 7, 8]
    },
    {
        id: 7,
        name: "Kenwood TH-D74A Tri-Band Handheld",
        description: "The Kenwood TH-D74A is a high-performance tri-band handheld with D-STAR digital voice and data communication, GPS/APRS, and color transflective TFT display.",
        price: 549.95,
        category: "Handheld Radios",
        stock: 10,
        image: "https://www.radioworld.co.uk/images/products/zoom/1528117861-51842200.jpg",
        features: [
            "Tri-band operation (144/220/430 MHz)",
            "D-STAR digital voice and data",
            "Integrated GPS and APRS functionality",
            "Color transflective TFT display",
            "IF filter for HF bands"
        ],
        specifications: {
            "Frequency Range": "144-148, 222-225, 430-450 MHz",
            "Mode": "DV, FM, NFM, AM, SSB, CW",
            "Output Power": "5W (High), 2W (Mid), 0.5W (Low)",
            "Battery": "1800mAh Li-ion",
            "Current Drain": "≤ 2.0A",
            "Dimensions": "56(W) × 119.8(H) × 33.9(D) mm",
            "Weight": "257g with antenna and battery"
        },
        relatedProducts: [4, 6, 8]
    },
    {
        id: 8,
        name: "ICOM ID-52E Digital Handheld Transceiver",
        description: "The ICOM ID-52E is a D-STAR digital handheld transceiver with dual receive, color display, Bluetooth, and microSD card slot for voice recording and GPS logging.",
        price: 499.95,
        category: "Handheld Radios",
        stock: 15,
        image: "https://www.radioworld.co.uk/images/products/zoom/1628602993-02082900.jpg",
        features: [
            "D-STAR digital voice and data",
            "Dual receive capability",
            "Color LCD display",
            "Built-in Bluetooth for hands-free operation",
            "IPX7 waterproof rating"
        ],
        specifications: {
            "Frequency Range": "144-146 MHz, 430-440 MHz",
            "Mode": "DV, FM, AM, FM-N",
            "Output Power": "5W (High), 2.5W (Mid), 1W (Low), 0.5W (S-Low)",
            "Battery": "2000mAh Li-ion",
            "Current Drain": "≤ 2.5A",
            "Dimensions": "61.3(W) × 123(H) × 37.3(D) mm",
            "Weight": "330g with antenna and battery"
        },
        relatedProducts: [4, 6, 7]
    },
    {
        id: 9,
        name: "Diamond X50N Dual Band Base Antenna",
        description: "The Diamond X50N is a high-quality dual band VHF/UHF base antenna with fiberglass construction and gold-plated center connector for excellent performance.",
        price: 89.95,
        category: "Antennas",
        stock: 20,
        image: "https://www.radioworld.co.uk/images/products/zoom/1458211711-75562000.jpg",
        features: [
            "Dual band operation (VHF/UHF)",
            "Fiberglass radome construction",
            "Gold-plated SO-239 connector",
            "Wide bandwidth coverage",
            "Wind load rating: 90mph"
        ],
        specifications: {
            "Frequency Range": "144-146 MHz, 430-440 MHz",
            "Gain": "4.5dBi (VHF), 7.2dBi (UHF)",
            "VSWR": "Less than 1.5:1",
            "Impedance": "50 ohms",
            "Max Power": "200W",
            "Length": "1.7m",
            "Weight": "0.9kg"
        },
        relatedProducts: [10, 11, 12]
    },
    {
        id: 10,
        name: "Diamond SRH77CA Dual Band Handheld Antenna",
        description: "The Diamond SRH77CA is a high-performance replacement antenna for handheld radios, providing enhanced gain on both VHF and UHF bands.",
        price: 29.95,
        category: "Antennas",
        stock: 35,
        image: "https://www.radioworld.co.uk/images/products/zoom/1458831468-35168900.jpg",
        features: [
            "Dual band operation (VHF/UHF)",
            "Flexible whip design",
            "Improved reception over stock antennas",
            "Weather resistant construction",
            "SMA connector (male)"
        ],
        specifications: {
            "Frequency Range": "144-148 MHz, 430-450 MHz",
            "Gain": "2.15dBi (VHF), 4dBi (UHF)",
            "VSWR": "Less than 1.5:1",
            "Impedance": "50 ohms",
            "Length": "40cm",
            "Weight": "28g"
        },
        relatedProducts: [9, 11, 12]
    },
    {
        id: 11,
        name: "MFJ-1708SDR T/R Switch for SDR",
        description: "The MFJ-1708SDR is a transmit/receive switch for software defined radios, allowing you to use your SDR with a transmitting radio safely.",
        price: 99.95,
        category: "Accessories",
        stock: 8,
        image: "https://www.radioworld.co.uk/images/products/zoom/1503913558-54519100.jpg",
        features: [
            "Automatic T/R switching",
            "Protects your SDR during transmission",
            "Works with any SDR receiver",
            "Multiple RF ports",
            "Compatible with all transceivers"
        ],
        specifications: {
            "Frequency Range": "1-60 MHz",
            "Insertion Loss": "Less than 0.25dB",
            "Power Handling": "200W",
            "Connections": "SO-239 connectors",
            "Power Supply": "12-14V DC",
            "Dimensions": "165(W) × 38(H) × 140(D) mm",
            "Weight": "0.5kg"
        },
        relatedProducts: [12, 13, 14]
    },
    {
        id: 12,
        name: "LDG Z-100Plus Automatic Antenna Tuner",
        description: "The LDG Z-100Plus is a versatile automatic antenna tuner covering 1.8-54 MHz with 125 memories for fast tuning and wide impedance matching range.",
        price: 179.95,
        category: "Accessories",
        stock: 14,
        image: "https://www.radioworld.co.uk/images/products/zoom/ldg-z-100plus.jpg",
        features: [
            "Frequency range: 1.8-54 MHz",
            "Power: 0.1-125W",
            "125 memory locations",
            "2000 tuning combinations",
            "Optional interfaces for ICOM, Yaesu, Kenwood, and Alinco"
        ],
        specifications: {
            "Frequency Range": "1.8-54 MHz",
            "Power Handling": "0.1-125W SSB/CW, 30W Digital",
            "Impedance Range": "6-1000 ohms",
            "Tuning Time": "0.5-6 seconds",
            "Power Supply": "11-16V DC, 300mA max",
            "Dimensions": "160(W) × 95(H) × 165(D) mm",
            "Weight": "0.68kg"
        },
        relatedProducts: [9, 11, 13]
    }
];

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

// Load products into the container
function loadProducts(filteredProducts = null) {
    const productsContainer = document.getElementById('products-container');
    const productsToDisplay = filteredProducts || products;
    
    // Clear existing products
    productsContainer.innerHTML = '';
    
    if (productsToDisplay.length === 0) {
        productsContainer.innerHTML = '<div class="no-products">No products found matching your criteria.</div>';
        return;
    }
    
    // Create product cards
    productsToDisplay.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        
        productCard.innerHTML = `
            <div class="product-image">
                <img src="${product.image}" alt="${product.name}">
                <div class="product-category">${product.category}</div>
            </div>
            <div class="product-info">
                <h3>${product.name}</h3>
                <p class="product-description">${product.description.substring(0, 120)}${product.description.length > 120 ? '...' : ''}</p>
                <div class="product-meta">
                    <div class="product-price">$${product.price.toFixed(2)}</div>
                    <div class="product-stock ${product.stock < 5 ? 'low-stock' : ''}">${product.stock < 5 ? 'Low Stock' : 'In Stock'}</div>
                </div>
                <a href="product-detail.html?id=${product.id}" class="view-details-btn">View Details</a>
            </div>
        `;
        
        productsContainer.appendChild(productCard);
    });
}

// Setup filter functionality
function setupFilterListeners() {
    const categoryFilters = document.querySelectorAll('.category-filter');
    const priceRangeMin = document.getElementById('price-range-min');
    const priceRangeMax = document.getElementById('price-range-max');
    const stockFilter = document.getElementById('stock-filter');
    
    // Setup category filter listeners
    categoryFilters.forEach(filter => {
        filter.addEventListener('change', applyFilters);
    });
    
    // Setup price range filter listeners
    if (priceRangeMin && priceRangeMax) {
        priceRangeMin.addEventListener('input', applyFilters);
        priceRangeMax.addEventListener('input', applyFilters);
    }
    
    // Setup stock filter listener
    if (stockFilter) {
        stockFilter.addEventListener('change', applyFilters);
    }
}

// Apply all active filters
function applyFilters() {
    const selectedCategories = Array.from(document.querySelectorAll('.category-filter:checked')).map(el => el.value);
    const minPrice = parseFloat(document.getElementById('price-range-min').value) || 0;
    const maxPrice = parseFloat(document.getElementById('price-range-max').value) || Number.MAX_SAFE_INTEGER;
    const inStockOnly = document.getElementById('stock-filter').checked;
    const searchTerm = document.getElementById('search-input').value.toLowerCase().trim();
    
    // Apply filters
    let filteredProducts = products.filter(product => {
        // Category filter
        if (selectedCategories.length > 0 && !selectedCategories.includes(product.category)) {
            return false;
        }
        
        // Price range filter
        if (product.price < minPrice || product.price > maxPrice) {
            return false;
        }
        
        // Stock filter
        if (inStockOnly && product.stock <= 0) {
            return false;
        }
        
        // Search filter
        if (searchTerm && !(
            product.name.toLowerCase().includes(searchTerm) || 
            product.description.toLowerCase().includes(searchTerm) ||
            product.category.toLowerCase().includes(searchTerm)
        )) {
            return false;
        }
        
        return true;
    });
    
    // Apply current sorting
    const sortSelect = document.getElementById('sort-select');
    if (sortSelect) {
        const sortValue = sortSelect.value;
        sortProducts(filteredProducts, sortValue);
    }
    
    // Update product count
    const productCount = document.getElementById('product-count');
    if (productCount) {
        productCount.textContent = filteredProducts.length;
    }
    
    // Load filtered products
    loadProducts(filteredProducts);
}

// Setup search functionality
function setupSearchFunctionality() {
    const searchInput = document.getElementById('search-input');
    const searchBtn = document.getElementById('search-btn');
    
    if (searchInput && searchBtn) {
        // Search on button click
        searchBtn.addEventListener('click', (e) => {
            e.preventDefault();
            applyFilters();
        });
        
        // Search on enter key
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                applyFilters();
            }
        });
    }
}

// Setup sorting functionality
function setupSortingFunctionality() {
    const sortSelect = document.getElementById('sort-select');
    
    if (sortSelect) {
        sortSelect.addEventListener('change', () => {
            applyFilters();
        });
    }
}

// Sort products based on selected option
function sortProducts(productsList, sortOption) {
    switch (sortOption) {
        case 'price-low':
            productsList.sort((a, b) => a.price - b.price);
            break;
        case 'price-high':
            productsList.sort((a, b) => b.price - a.price);
            break;
        case 'name-asc':
            productsList.sort((a, b) => a.name.localeCompare(b.name));
            break;
        case 'name-desc':
            productsList.sort((a, b) => b.name.localeCompare(a.name));
            break;
        default: // Default to featured
            // No sorting needed as the default order is assumed to be "featured"
            break;
    }
    
    return productsList;
}

// Handle logout
function logout() {
    localStorage.removeItem('userId');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('token');
    
    // Redirect to login page
    window.location.href = 'login.html';
}

// Initialize cart counter
function initCartCounter() {
    const cartItems = JSON.parse(localStorage.getItem('cart')) || [];
    const cartCounter = document.getElementById('cart-counter');
    
    if (cartCounter) {
        cartCounter.textContent = cartItems.length;
        
        if (cartItems.length > 0) {
            cartCounter.style.display = 'flex';
        } else {
            cartCounter.style.display = 'none';
        }
    }
}

// Add event listeners
document.addEventListener('DOMContentLoaded', function() {
    // Logout button
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', logout);
    }
    
    // Initialize cart counter
    initCartCounter();
    
    // Mobile menu toggle
    const menuToggle = document.getElementById('menu-toggle');
    const mobileMenu = document.getElementById('mobile-menu');
    
    if (menuToggle && mobileMenu) {
        menuToggle.addEventListener('click', () => {
            mobileMenu.classList.toggle('active');
        });
    }
    
    // Filter toggle on mobile
    const filterToggle = document.getElementById('filter-toggle');
    const filterSidebar = document.getElementById('filter-sidebar');
    
    if (filterToggle && filterSidebar) {
        filterToggle.addEventListener('click', () => {
            filterSidebar.classList.toggle('active');
        });
    }
}); 