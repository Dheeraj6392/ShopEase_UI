import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';

const EMAIL_KEY = 'shopease:checkout-email';

const IMG_FALLBACK =
  'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="80" height="80"><rect fill="%23e5e7eb" width="80" height="80"/><text fill="%239ca3af" font-family="sans-serif" font-size="10" x="50%" y="50%" dominant-baseline="middle" text-anchor="middle">No Image</text></svg>';

function Orders() {
  const [email, setEmail] = useState('');
  const [lookupEmail, setLookupEmail] = useState('');
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const saved = localStorage.getItem(EMAIL_KEY);
    if (saved) {
      setEmail(saved);
      setLookupEmail(saved);
    }
  }, []);

  const fetchOrders = useCallback(async (target) => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get('/orders', { params: { email: target } });
      setOrders(res.data.data);
    } catch (err) {
      setError(err.message);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (lookupEmail) fetchOrders(lookupEmail);
  }, [lookupEmail, fetchOrders]);

  const handleSubmit = (event) => {
    event.preventDefault();
    const trimmed = email.trim();
    if (!trimmed) return;
    localStorage.setItem(EMAIL_KEY, trimmed);
    setLookupEmail(trimmed);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const handleImgError = (event) => {
    event.target.src = IMG_FALLBACK;
  };

  return (
    <div className="mx-auto max-w-4xl">
      <div className="mb-8">
        <Link to="/" className="text-sm font-bold text-primary-600 hover:text-primary-700">
          &larr; Back to products
        </Link>
        <p className="page-kicker">Track &amp; reorder</p>
        <h1 className="page-title">Your Orders</h1>
        <p className="mt-2 text-gray-500">
          {lookupEmail
            ? `All orders placed with ${lookupEmail}`
            : 'Enter your email to see your past orders'}
        </p>
      </div>

      {!lookupEmail && (
        <form
          onSubmit={handleSubmit}
          className="card p-6"
        >
          <label htmlFor="orders-email" className="block text-sm font-medium text-gray-700">
            Email used at checkout
          </label>
          <div className="mt-2 flex gap-2">
            <input
              id="orders-email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="john@example.com"
              className="min-w-0 flex-1 rounded-lg border border-gray-300 px-4 py-2 outline-none transition-colors focus:border-primary-500 focus:ring-2 focus:ring-primary-500"
            />
            <button
              type="submit"
              className="btn-primary px-5 py-2"
            >
              View orders
            </button>
          </div>
        </form>
      )}

      {loading && <LoadingSpinner />}

      {!loading && error && (
        <div className="py-16 text-center">
          <p className="text-red-600">{error}</p>
        </div>
      )}

      {!loading && !error && lookupEmail && orders.length === 0 && (
        <div className="rounded-2xl border border-dashed border-gray-300 bg-white px-6 py-16 text-center">
          <p className="text-lg font-medium text-gray-700">No orders yet</p>
          <p className="mt-2 text-sm text-gray-500">
            When you place an order, it will show up here.
          </p>
          <Link
            to="/"
            className="btn-primary mt-4"
          >
            Start shopping
          </Link>
        </div>
      )}

      {!loading && !error && orders.length > 0 && (
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order.id}
              className="card overflow-hidden"
            >
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-100 px-5 py-4">
                <div>
                  <p className="font-mono text-sm font-semibold text-primary-600">
                    #{order.orderNumber}
                  </p>
                  <p className="mt-1 text-xs text-gray-500">{formatDate(order.createdAt)}</p>
                </div>
                <div className="flex items-center gap-3">
                  {order.items.length > 0 && (
                    <div className="flex -space-x-2">
                      {order.items.map((item) =>
                        item.imageUrl ? (
                          <img
                            key={item.productName}
                            src={item.imageUrl}
                            alt={item.productName}
                            onError={handleImgError}
                            className="h-9 w-9 rounded-full border-2 border-white object-cover"
                          />
                        ) : null
                      )}
                      {order.itemCount > order.items.length && (
                        <span className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-white bg-primary-50 text-[10px] font-bold text-primary-600">
                          +{order.itemCount - order.items.length}
                        </span>
                      )}
                    </div>
                  )}
                  <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
                    {order.status}
                  </span>
                </div>
              </div>
              <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-4">
                <p className="text-sm text-gray-500">
                  {order.itemCount} item{order.itemCount === 1 ? '' : 's'}
                </p>
                <div className="flex items-center gap-4">
                  <p className="text-lg font-bold text-gray-900">
                    {formatPrice(order.totalAmount)}
                  </p>
                  <Link
                    to={`/order/${order.orderNumber}`}
                    className="btn-secondary px-4 py-2"
                  >
                    View details
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Orders;