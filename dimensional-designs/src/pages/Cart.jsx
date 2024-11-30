import { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { Link } from 'react-router-dom';

function Cart() {
    const [cart, setCart] = useState([]);
    const [productPrices, setProductPrices] = useState({});

    // Fetch cart from cookies when the component mounts
    useEffect(() => {
        const cartFromCookies = Cookies.get('cart') ? JSON.parse(Cookies.get('cart')) : [];
        setCart(cartFromCookies);
        
        // Fetch product prices
        fetchProductPrices(cartFromCookies);
    }, []);

    const fetchProductPrices = async (cart) => {
        let prices = {};
        let productDetails = {};

        for (let item of cart) {
            try {
                const response = await fetch(`${import.meta.env.VITE_API_HOST}/products/${item.productId}`);

                if (!response.ok) {
                    throw new Error('Failed to fetch product details');
                }

                const productData = await response.json();
                prices[item.productId] = productData.cost;
                productDetails[item.productId] = productData;
            } catch (error) {
                console.error(`Error fetching product for productId ${item.productId}:`, error);
            }
        }

        setProductPrices(prices);
        
        // Update cart with full product details
        const updatedCart = cart.map(item => ({
            ...item,
            ...productDetails[item.productId]  // Add product details to cart items
        }));
        
        setCart(updatedCart);
    };

    // Function to update the cart in cookies
    const updateCartInCookies = (updatedCart) => {
        Cookies.set('cart', JSON.stringify(updatedCart));
    };

    // Function to remove one item from the cart
    const removeFromCart = (productId) => {
        let updatedCart = [...cart];
        const productIndex = updatedCart.findIndex(item => item.productId === productId);

        if (productIndex !== -1) {
            if (updatedCart[productIndex].quantity > 1) {
                updatedCart[productIndex].quantity -= 1;
            } else {
                updatedCart.splice(productIndex, 1);
            }
        }

        setCart(updatedCart);  // Update the state
        updateCartInCookies(updatedCart);  // Update the cookies
    };

    // Function to remove the entire item from the cart
    const removeEntireItem = (productId) => {
        let updatedCart = cart.filter(item => item.productId !== productId);

        setCart(updatedCart);  // Update the state
        updateCartInCookies(updatedCart);  // Update the cookies
    };

    // Calculate total cart value
    const calculateTotal = () => {
        return cart.reduce((total, item) => {
            return total + (productPrices[item.productId] * item.quantity);
        }, 0).toFixed(2);
    };

    return (
        <div className="container mt-4">
            <h1 className="text-center mb-4">Your Cart</h1>

            {cart.length > 0 ? (
                <>
                    <div className="row">
                        {cart.map((item, index) => (
                            <div key={index} className="col-md-3 mb-4">
                                <div className="card h-100">
                                    <img
                                        src={`${import.meta.env.VITE_API_HOST}/images/${item.image_filename}`}
                                        alt={item.name}
                                        className="card-img-top"
                                        style={{ height: '200px', objectFit: 'cover' }}
                                        onError={(e) => {
                                            console.error('Image load error:', {
                                                src: e.target.src,
                                                productId: item.productId
                                            });
                                        }}
                                    />
                                    <div className="card-body d-flex flex-column">
                                        <h5 className="card-title">{item.name}</h5>
                                        <p className="card-text">Quantity: {item.quantity}</p>
                                        <p className="card-text">
                                            Item Price: ${productPrices[item.productId]?.toFixed(2)}
                                        </p>
                                        <p className="card-text">
                                            Sub Total: ${(productPrices[item.productId] * item.quantity)?.toFixed(2)}
                                        </p>
                                        <div className="mt-auto">
                                            <Link
                                                to={`/details/${item.productId}`}
                                                className="btn btn-primary w-100 mb-2"
                                            >
                                                View Details
                                            </Link>
                                            <button 
                                                onClick={() => removeFromCart(item.productId)}
                                                className="btn w-100 mb-2 custom-button" 
                                                style={{ backgroundColor: '#ffcccc', color: '#900' }}
                                            >
                                                Remove 1 Item
                                            </button>
                                            <button 
                                                onClick={() => removeEntireItem(item.productId)}
                                                className="btn btn-danger w-100 mb-2"
                                            >
                                                Remove Entire Item
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="row mt-4">
                        <div className="col-md-6 offset-md-3">
                            <div className="card">
                                <div className="card-body">
                                    <h5 className="card-title">Cart Summary</h5>
                                    <p className="card-text">
                                        Total Items: {cart.reduce((sum, item) => sum + item.quantity, 0)}
                                    </p>
                                    <p className="card-text">
                                        <strong>Total Price: ${calculateTotal()}</strong>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="row mt-4">
                        <div className="col-md-6 offset-md-3">
                            <Link to="/checkout" className="btn btn-primary w-100 mb-2">
                                Proceed to Checkout
                            </Link>
                            <Link to="/" className="btn btn-outline-secondary w-100">
                                Continue Shopping
                            </Link>
                        </div>
                    </div>
                </>
            ) : (
                <p className="text-center">Your cart is empty.</p>
            )}
        </div>
    );
}

export default Cart;
