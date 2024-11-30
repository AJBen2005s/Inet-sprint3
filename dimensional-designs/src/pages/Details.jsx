import { useParams, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Cookies from 'js-cookie';

function Details() {
    const { id } = useParams(); // Get the product ID from the URL
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProductDetails = async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_API_HOST}/products/${id}`);

                if (!response.ok) {
                    throw new Error('Failed to fetch product details');
                }

                const data = await response.json();
                setProduct(data);
                setLoading(false);
            } catch (error) {
                setError('Error fetching product details');
                setLoading(false);
            }
        };

        fetchProductDetails();
    }, [id]);

    const addToCart = () => {
        const cart = Cookies.get('cart') ? JSON.parse(Cookies.get('cart')) : [];
        const existingProduct = cart.find(item => item.productId === id);

        if (existingProduct) {
            // If the product is already in the cart, increase the quantity
            existingProduct.quantity += 1;
        } else {
            // If the product is not in the cart, add it with quantity 1
            cart.push({ productId: id, quantity: 1 });
        }

        // Save the updated cart to cookies
        Cookies.set('cart', JSON.stringify(cart)); 
    };

    if (loading) return <p>Loading...</p>;
    
    if (error) return <p>{error}</p>;

    return (
        <div className="container d-flex justify-content-center align-items-center" style={{ minHeight: 'calc(100vh - 60px)' }}>
            <div className="w-100" style={{ maxWidth: '500px', marginTop: '10px' }}>
                <h1 className="text-center mb-4">Product Details</h1>
                <div className="card">
                    <img
                        src={`${import.meta.env.VITE_API_HOST}/images/${product.image_filename}`}
                        alt={product.name}
                        className="card-img-top"
                        style={{ height: '200px', objectFit: 'cover' }}
                        onError={(e) => {
                            console.error('Image load error:', {
                                src: e.target.src,
                                filename: product.image_filename
                            });
                        }}
                    />
                    <div className="card-body">
                        <h5 className="card-title">{product.name}</h5>
                        <p className="card-text">{product.description}</p>
                        <p className="card-text"><strong>Price: </strong>${product.cost.toFixed(2)}</p>

                        <button onClick={addToCart} className="btn btn-primary w-100 mb-3">Add to Cart</button>
                        <Link to="/" className="btn btn-secondary w-100">Back to Products</Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Details;
