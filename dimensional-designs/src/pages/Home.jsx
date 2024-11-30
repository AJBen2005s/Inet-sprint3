import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Cookies from 'js-cookie';

function Home() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_API_HOST}/products/all`);

                if (!response.ok) {
                    throw new Error('Failed to fetch products');
                }

                const data = await response.json();
                setProducts(data);
                setLoading(false);
            } catch (error) {
                setError('Error fetching products');
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    const addToCart = (productId) => {
        let cart = Cookies.get('cart') ? JSON.parse(Cookies.get('cart')) : [];

        const existingProduct = cart.find(item => item.productId === productId);

        if (existingProduct) {
            existingProduct.quantity += 1;
        } else {
            cart.push({ productId, quantity: 1 });
        }

        Cookies.set('cart', JSON.stringify(cart));
    };

    if (loading) {
        return <div className="text-center">Loading products...</div>;
    }

    if (error) {
        return <div className="text-center text-danger">{error}</div>;
    }

    return (
        <div className="container mt-4">
            <h1 className="text-center mb-4">Our Products</h1>

            <div className="row">
                {products.map((product) => (
                    <div key={product.product_id} className="col-md-3 mb-4">
                        <div className="card h-100">
                            <img
                                src={`${import.meta.env.VITE_API_HOST}/images/${product.image_filename}`}
                                alt={product.name}
                                className="card-img-top"
                                style={{ height: '200px', objectFit: 'cover' }}
                            />
                            <div className="card-body d-flex flex-column">
                                <h5 className="card-title">{product.name}</h5>
                                <p className="card-text">${product.cost.toFixed(2)}</p>
                                <div className="mt-auto">
                                    <Link
                                        to={`/details/${product.product_id}`}
                                        className="btn btn-primary w-100 mb-2"
                                    >
                                        View Details
                                    </Link>
                                    <button
                                        onClick={() => addToCart(product.product_id)}
                                        className="btn btn-secondary w-100"
                                    >
                                        Add to Cart
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Home;
