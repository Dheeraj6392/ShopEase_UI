import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useCart } from '../context/CartContext';
import LoadingSpinner from '../components/LoadingSpinner';

function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [adding, setAdding] = useState(false);
  const [added, setAdded] = useState(false);
  const { addItem } = useCart();

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/products/${id}`);
        setProduct(res.data.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleAddToCart = async () => {
    setAdding(true);
    const success = await addItem(product.id, quantity, product);
    if (success) {
      setAdded(true);
      setTimeout(() => setAdded(false), 2000);
    }
    setAdding(false);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  if (loading) return <LoadingSpinner />;

  if (error || !product) {
    return (
      <div className="text-center py-16">
        <p className="text-red-600 mb-4">{error || 'Product not found'}</p>
        <Link
          to="/"
          className="btn-primary"
        >
          Back to Products
        </Link>
      </div>
    );
  }

  return (
    <div>
      <button
        onClick={() => navigate(-1)}
        className="mb-6 text-primary-600 hover:text-primary-700 text-sm font-medium flex items-center gap-1"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back
      </button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="card aspect-square overflow-hidden">
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.src =
                'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400"><rect fill="%23e5e7eb" width="400" height="400"/><text fill="%239ca3af" font-family="sans-serif" font-size="18" x="50%" y="50%" dominant-baseline="middle" text-anchor="middle">No Image</text></svg>';
            }}
          />
        </div>

        <div className="card p-6">
          <span className="text-sm font-medium text-primary-600 bg-primary-50 px-3 py-1 rounded">
            {product.category}
          </span>
          <h1 className="mt-3 text-3xl font-bold text-gray-900">{product.name}</h1>
          <p className="mt-4 text-3xl font-bold text-gray-900">
            {formatPrice(product.price)}
          </p>
          <p className="mt-2 text-sm text-gray-500">
            {product.stock > 0 ? (
              <span className="text-green-600 font-medium">
                In Stock ({product.stock} available)
              </span>
            ) : (
              <span className="text-red-600 font-medium">Out of Stock</span>
            )}
          </p>
          <p className="mt-6 text-gray-600 leading-relaxed">{product.description}</p>

          {product.stock > 0 && (
            <div className="mt-8">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Quantity
              </label>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 rounded-lg border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors"
                >
                  -
                </button>
                <span className="w-12 text-center text-lg font-medium">{quantity}</span>
                <button
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  className="w-10 h-10 rounded-lg border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors"
                >
                  +
                </button>
              </div>
              <p className="mt-1 text-xs text-gray-500">
                Max: {product.stock}
              </p>
            </div>
          )}

          <div className="mt-8 flex gap-3">
            <button
              onClick={handleAddToCart}
              disabled={product.stock === 0 || adding}
              className="btn-primary flex-1 disabled:bg-gray-300 disabled:cursor-not-allowed disabled:shadow-none"
            >
              {adding
                ? 'Adding...'
                : added
                ? 'Added!'
                : 'Add to Cart'}
            </button>
            <Link
              to="/cart"
              className="btn-secondary flex-1 text-center"
            >
              View Cart
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetails;
