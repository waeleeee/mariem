import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios'; // Add axios import at top
// Import the CSS styles
import '../styles/product-detail.css';

// Mock data to use if API fetch fails - later this would be replaced by real API data
// const mockProducts = [
//     {
//         id: 1,
//         name: "Studio Pro Microphone XR-200",
//         description: "Professional studio microphone with ultra-clear audio capture and noise cancellation. Perfect for recording vocals, podcasts, and instruments with exceptional clarity and detail.",
//         price: 299.99,
//         category: "Microphones",
//         stock: 15,
//         image: "https://placehold.co/600x400?text=Microphone",
//         features: [
//             "Ultra-clear audio capture",
//             "Built-in noise cancellation",
//             "Cardioid polar pattern",
//             "Frequency response: 20Hz-20kHz",
//             "Includes shock mount and pop filter",
//             "USB and XLR connectivity options"
//         ],
//         specifications: {
//             "Type": "Large diaphragm condenser microphone",
//             "Frequency Response": "20Hz - 20kHz",
//             "Sensitivity": "-36dB (0dB=1V/Pa @ 1kHz)",
//             "Signal-to-Noise Ratio": ">78dB",
//             "Dimensions": "50mm × 200mm",
//             "Weight": "380g",
//             "Connector": "3-pin XLR, USB-C",
//             "Power Requirements": "48V phantom power or USB"
//         },
//         relatedProducts: [2, 3]
//     },
//     {
//         id: 2,
//         name: "Wireless Transmitter TR-500",
//         description: "Long-range wireless transmitter with crystal clear signal up to 500 meters. Ideal for remote broadcasting and field recording in demanding environments.",
//         price: 449.99,
//         category: "Transmitters",
//         stock: 8,
//         image: "https://placehold.co/600x400?text=Transmitter",
//         features: [
//             "500m range in optimal conditions",
//             "128-bit encryption",
//             "Low latency (<4ms)",
//             "Battery life: 8+ hours",
//             "Multiple frequency bands"
//         ],
//         specifications: {
//             "Frequency Range": "570-608MHz",
//             "RF Output Power": "30mW",
//             "Frequency Response": "40Hz - 15kHz",
//             "THD": "<0.5%",
//             "Battery": "Rechargeable Li-ion, 3000mAh",
//             "Operating Time": "8-10 hours"
//         },
//         relatedProducts: [1, 3]
//     },
//     {
//         id: 3,
//         name: "Premium Studio Headphones H-100",
//         description: "Over-ear studio headphones with noise isolation and enhanced bass response. Designed for professional monitoring during recording and mixing sessions.",
//         price: 199.99,
//         category: "Headphones",
//         stock: 22,
//         image: "https://placehold.co/600x400?text=Headphones",
//         features: [
//             "Closed-back design for isolation",
//             "50mm dynamic drivers",
//             "Memory foam ear cushions",
//             "Detachable cable system",
//             "Foldable design for portability"
//         ],
//         specifications: {
//             "Type": "Over-ear, closed-back",
//             "Driver Size": "50mm",
//             "Frequency Response": "5Hz - 40kHz",
//             "Impedance": "38 ohms",
//             "Sensitivity": "102dB/mW"
//         },
//         relatedProducts: [1, 2]
//     }
// ];

function ProductDetail() {
    const { productId } = useParams(); // Get productId from URL
    const navigate = useNavigate(); // For programmatic navigation
    const [product, setProduct] = useState(null);
    const [relatedProducts, setRelatedProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [activeTab, setActiveTab] = useState('features'); // 'features', 'specifications', 'related'

    // Use the existing auth hook or set up a simple auth check
    const useAuth = () => {
        // Check if token exists in localStorage
        const token = localStorage.getItem('token');
        const userRole = localStorage.getItem('userRole');
        const userName = localStorage.getItem('userName');
        
        return {
            isAuthenticated: !!token,
            isAdmin: userRole === 'admin',
            user: { name: userName || 'User' }
        };
    };
    
    const { isAuthenticated, user } = useAuth();

    // Logout function
    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userRole');
        localStorage.removeItem('userName');
        // Redirect to login
        navigate('/login');
    };

    // Add to cart function
    const handleAddToCart = () => {
        if (!product) return;
        
        // Get current cart from localStorage or initialize empty array
        const currentCart = JSON.parse(localStorage.getItem('cart') || '[]');
        
        // Check if product is already in cart
        const existingItemIndex = currentCart.findIndex(item => item.id === product.id);
        
        if (existingItemIndex >= 0) {
            // Update quantity if product already exists
            currentCart[existingItemIndex].quantity += quantity;
        } else {
            // Add new product to cart
            currentCart.push({
                id: product.id,
                name: product.name,
                price: product.price,
                image: product.image,
                quantity: quantity
            });
        }
        
        // Save updated cart back to localStorage
        localStorage.setItem('cart', JSON.stringify(currentCart));
        
        // Provide feedback to user
        alert(`Added ${quantity} ${product.name} to your cart!`);
    };

    useEffect(() => {
        // Redirect if not logged in
        if (!isAuthenticated) {
            navigate('/login', { replace: true });
            return;
        }

        const fetchProductData = async () => {
            setLoading(true);
            setError(null);
            try {
                // Fetch product from backend API
                const response = await axios.get(`http://localhost:3000/api/products/${productId}`);
                const data = response.data;
                setProduct(data);

                // Fetch related products if specified
                if (data.relatedProducts && data.relatedProducts.length > 0) {
                    const relatedRes = await Promise.all(
                        data.relatedProducts.map(id => axios.get(`http://localhost:3000/api/products/${id}`))
                    );
                    setRelatedProducts(relatedRes.map(r => r.data));
                } else {
                    setRelatedProducts([]);
                }

            } catch (err) {
                console.error("Failed to fetch product data:", err);
                setError("Failed to load product details. Please try again later.");
                setProduct(null);
            } finally {
                setLoading(false);
            }
        };

        fetchProductData();
    }, [productId, isAuthenticated, navigate]);

    const handleQuantityChange = (amount) => {
        setQuantity(prev => Math.max(1, prev + amount));
    };

    if (loading) {
        return <div className="loading-container">Loading product details...</div>;
    }

    if (error) {
        return <div className="error-message">Error: {error}</div>;
    }

    if (!product) {
        return <div className="not-found-message">Product not found.</div>;
    }

    // Main render
    return (
        <div className="container">
            {/* Product Detail Main Content */}
            <div className="main-content">
                {/* Top Bar */}
                <div className="top-bar">
                    <div className="breadcrumbs">
                        <Link to="/dashboard">Dashboard</Link> &gt;
                        <Link to="/shop">Products</Link> &gt;
                        <span>{product.name}</span>
                    </div>
                    {isAuthenticated && (
                        <div className="user-info">
                            <span className="lang">🇺🇸 English</span>
                            <span className="user-name">{user.name}</span>
                            <button className="logout-btn" onClick={handleLogout}>Logout</button>
                        </div>
                    )}
                </div>

                {/* Product Detail Section */}
                <div className="product-detail-container">
                    <div className="product-detail-left">
                        <div className="product-detail-image">
                            <img src={product.imageUrls && product.imageUrls.length > 0 ? product.imageUrls[0] : 'https://placehold.co/600x400?text=No+Image'} alt={product.name} />
                            <span className="product-category">{product.category}</span>
                        </div>
                    </div>
                    <div className="product-detail-right">
                        <h1>{product.name}</h1>
                        <p className="product-description">{product.description}</p>

                        <div className="product-detail-price-row">
                            <div className="product-price">${product.price != null ? parseFloat(product.price).toFixed(2) : 'N/A'}</div>
                            <div className="product-stock">{product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}</div>
                        </div>

                        <div className="quantity-container">
                            <label htmlFor="quantity">Quantity:</label>
                            <div className="quantity-input">
                                <button type="button" onClick={() => handleQuantityChange(-1)}>-</button>
                                <input
                                    type="number"
                                    id="quantity"
                                    min="1"
                                    value={quantity}
                                    onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                                />
                                <button type="button" onClick={() => handleQuantityChange(1)}>+</button>
                            </div>
                        </div>

                        <button
                            className="add-to-cart-btn"
                            onClick={handleAddToCart}
                            disabled={product.stock <= 0}
                        >
                            {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
                        </button>
                    </div>
                </div>

                {/* Product Tabs Section */}
                <div className="product-tabs">
                    <div className="tab-header">
                        <div
                            className={`tab-button ${activeTab === 'features' ? 'active' : ''}`}
                            onClick={() => setActiveTab('features')}
                        >
                            Features
                        </div>
                        <div
                            className={`tab-button ${activeTab === 'specifications' ? 'active' : ''}`}
                            onClick={() => setActiveTab('specifications')}
                        >
                            Specifications
                        </div>
                        <div
                            className={`tab-button ${activeTab === 'related' ? 'active' : ''}`}
                            onClick={() => setActiveTab('related')}
                        >
                            Related Products
                        </div>
                    </div>

                    <div className="tab-content">
                        {/* Features Tab */}
                        <div id="features" className={`tab-pane ${activeTab === 'features' ? 'active' : ''}`}>
                            <h2>Key Features</h2>
                            {product.features && product.features.length > 0 ? (
                                <ul className="features-list">
                                    {product.features.map((feature, index) => (
                                        <li key={index}>{feature}</li>
                                    ))}
                                </ul>
                            ) : (
                                <p>No features listed for this product.</p>
                            )}
                        </div>

                        {/* Specifications Tab */}
                        <div id="specifications" className={`tab-pane ${activeTab === 'specifications' ? 'active' : ''}`}>
                            <h2>Technical Specifications</h2>
                            {product.specifications && Object.keys(product.specifications).length > 0 ? (
                                <table className="specifications-table">
                                    <tbody>
                                        {Object.entries(product.specifications).map(([key, value]) => (
                                            <tr key={key}>
                                                <td>{key}</td>
                                                <td>{value}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            ) : (
                                <p>No specifications listed for this product.</p>
                            )}
                        </div>

                        {/* Related Products Tab */}
                        <div id="related" className={`tab-pane ${activeTab === 'related' ? 'active' : ''}`}>
                            <h2>Related Products</h2>
                            {relatedProducts.length > 0 ? (
                                <div className="related-products-grid">
                                    {relatedProducts.map(related => (
                                        <div key={related.id} className="related-product-card">
                                            <div className="product-image">
                                                <img src={related.imageUrls && related.imageUrls.length > 0 ? related.imageUrls[0] : 'https://placehold.co/600x400?text=No+Image'} alt={related.name} />
                                                <span className="product-category">{related.category}</span>
                                            </div>
                                            <div className="product-info">
                                                <h3>{related.name}</h3>
                                                <div className="product-price">${related.price != null ? parseFloat(related.price).toFixed(2) : 'N/A'}</div>
                                                <Link to={`/products/${related.id}`} className="view-product-btn">View Details</Link>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p>No related products found.</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ProductDetail; 