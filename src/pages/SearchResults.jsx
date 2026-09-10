import { useCallback, useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import api from '../services/api';
import { useCart } from '../context/CartContext';
import LoadingSpinner from '../components/LoadingSpinner';
import QuantityControl from '../components/QuantityControl';

const IMG_FALLBACK =
  'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400"><rect fill="%23e5e7eb" width="400" height="400"/><text fill="%239ca3af" font-family="sans-serif" font-size="18" x="50%" y="50%" dominant-baseline="middle" text-anchor="middle">No Image</text></svg>';

function SearchResults() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q')?.trim() || '';
  const category = searchParams.get('category')?.trim() || '';
  const [products, setProducts] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [addingId, setAddingId] = useState(null);
  const { cart, addItem, updateItem, removeItem } = useCart();

  const fetchResults = useCallback(async (page = 1) => {
    const params = { page, limit: 12 };
    if (category) {
      params.category = category;
    } else if (query) {
      params.q = query;
    } else {
      setProducts([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const res = await api.get('/products', { params });
      setProducts(res.data.data.products);
      setPagination(res.data.data.pagination);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [query, category]);

  useEffect(() => {
    fetchResults();
  }, [fetchResults]);

  const handleAddToCart = async (product) => {
    setAddingId(product.id);
    await addItem(product.id, 1, product);
    setAddingId(null);
  };

  const getCartQuantity = (productId) => {
    return cart.items.find((item) => item.product?.id === productId)?.quantity || 0;
  };

  const changeQuantity = async (productId, quantity) => {
    const cartItem = cart.items.find((item) => item.product?.id === productId);
    if (!cartItem) return;
    if (quantity <= 0) {
      await removeItem(cartItem.id);
      return;
    }
    await updateItem(cartItem.id, quantity);
  };

  const handleImgError = (event) => {
    event.target.src = IMG_FALLBACK;
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  if (loading) return <LoadingSpinner />;

  if (error) {
    return <p className="py-16 text-center text-red-600">{error}</p>;
  }

  return (
    <div>
      <div className="mb-8 flex items-end justify-between gap-4">
        <div>
<Link to="/" className="text-sm font-bold text-primary-600 hover:text-primary-700">
            &larr; Back to products
          </Link>
          <p className="page-kicker">{category ? 'Category' : 'Search'}</p>
          <h1 className="page-title">{category || 'Search results'}</h1>
          <p className="mt-2 text-gray-500">
            {category
              ? products.length > 0
                ? `${pagination.total} product${pagination.total === 1 ? '' : 's'} in ${category}`
                : `No products in ${category}`
              : products.length > 0
              ? `${pagination.total} result${pagination.total === 1 ? '' : 's'} for "${query}"`
              : `No results for "${query}"`}
          </p>
        </div>
      </div>

      {products.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-gray-300 bg-white px-6 py-16 text-center">
          <p className="text-lg font-medium text-gray-700">
              {category ? 'No products in this category' : 'No products found'}
            </p>
            <p className="mt-2 text-sm text-gray-500">
              {category
                ? 'Try another category or check back later.'
                : 'Try searching for a different product.'}
            </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {products.map((product) => {
            const quantity = getCartQuantity(product.id);
            return <div key={product.id} className="card overflow-hidden">
              <div className="aspect-square overflow-hidden bg-gray-100">
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  onError={handleImgError}
                  className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
                />
              </div>
              <div className="p-4">
                <span className="rounded bg-primary-50 px-2 py-1 text-xs font-medium text-primary-600">
                  {product.category}
                </span>
                <h2 className="mt-2 line-clamp-2 text-lg font-semibold text-gray-900">{product.name}</h2>
                <p className="mt-1 text-2xl font-bold text-gray-900">{formatPrice(product.price)}</p>
                <p className="mt-1 text-sm text-gray-500">
                  {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                </p>
                <div className="mt-4 flex gap-2">
                  <Link
                    to={`/product/${product.id}`}
                    className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-center text-sm font-medium text-gray-700 hover:bg-gray-50"
                  >
                    View Details
                  </Link>
                  <QuantityControl
                    quantity={quantity}
                    loading={addingId === product.id}
                    onAdd={() => handleAddToCart(product)}
                    onDecrease={() => changeQuantity(product.id, quantity - 1)}
                    onIncrease={() => changeQuantity(product.id, quantity + 1)}
                  />
                </div>
              </div>
            </div>;
          })}
        </div>
      )}

      {pagination.totalPages > 1 && (
        <div className="mt-8 flex justify-center gap-2">
          {Array.from({ length: pagination.totalPages }, (_, index) => index + 1).map((page) => (
            <button
              key={page}
              type="button"
              onClick={() => fetchResults(page)}
              className={`rounded-xl px-4 py-2 text-sm font-medium ${
                page === pagination.page
                  ? 'bg-primary-600 text-white shadow-[0_6px_16px_rgba(229,45,45,0.25)]'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {page}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default SearchResults;
