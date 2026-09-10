import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import LoadingSpinner from '../components/LoadingSpinner';

function Cart() {
  const { cart, loading, error, updateItem, removeItem } = useCart();

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  if (loading) return <LoadingSpinner />;

  if (error) {
    return (
      <div className="text-center py-16">
        <p className="text-red-600 mb-4">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="btn-primary"
        >
          Retry
        </button>
      </div>
    );
  }

  if (!cart.items || cart.items.length === 0) {
    return (
      <div className="text-center py-16">
        <svg
          className="mx-auto h-16 w-16 text-gray-300"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z"
          />
        </svg>
        <h2 className="mt-4 text-xl font-semibold text-gray-900">Your cart is empty</h2>
        <p className="mt-2 text-gray-500">Start shopping to add items to your cart</p>
        <Link
          to="/"
          className="btn-primary mt-6"
        >
          Browse Products
        </Link>
      </div>
    );
  }

  return (
    <div>
      <p className="page-kicker">Almost there</p>
      <h1 className="page-title mb-8">Shopping Cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {cart.items.map((item) => (
            <div
              key={item.id}
              className="card p-4 flex gap-4"
            >
              <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                <img
                  src={item.product.imageUrl}
                  alt={item.product.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src =
                      'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="80" height="80"><rect fill="%23e5e7eb" width="80" height="80"/><text fill="%239ca3af" font-family="sans-serif" font-size="10" x="50%" y="50%" dominant-baseline="middle" text-anchor="middle">No Image</text></svg>';
                  }}
                />
              </div>
              <div className="flex-1 min-w-0">
                <Link
                  to={`/product/${item.product.id}`}
                  className="text-lg font-semibold text-gray-900 hover:text-primary-600 transition-colors"
                >
                  {item.product.name}
                </Link>
                <p className="text-sm text-gray-500">{formatPrice(item.product.price)}</p>
                <div className="mt-2 flex items-center gap-3">
                  <div className="flex items-center">
                    <button
                      onClick={() =>
                        item.quantity > 1
                          ? updateItem(item.id, item.quantity - 1)
                          : removeItem(item.id)
                      }
                      className="w-8 h-8 rounded border border-gray-300 flex items-center justify-center hover:bg-gray-50 text-sm"
                    >
                      -
                    </button>
                    <span className="w-10 text-center text-sm font-medium">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateItem(item.id, item.quantity + 1)}
                      className="w-8 h-8 rounded border border-gray-300 flex items-center justify-center hover:bg-gray-50 text-sm"
                    >
                      +
                    </button>
                  </div>
                  <button
                    onClick={() => removeItem(item.id)}
                    className="text-red-500 hover:text-red-700 text-sm font-medium transition-colors"
                  >
                    Remove
                  </button>
                </div>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold text-gray-900">
                  {formatPrice(item.subtotal)}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="lg:col-span-1">
          <div className="card p-6 sticky top-24">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h2>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Items ({cart.totalItems})</span>
                <span className="font-medium">{formatPrice(cart.totalAmount)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Shipping</span>
                <span className="text-green-600 font-medium">Free</span>
              </div>
              <div className="border-t pt-3 mt-3">
                <div className="flex justify-between">
                  <span className="text-lg font-bold">Total</span>
                  <span className="text-lg font-bold">{formatPrice(cart.totalAmount)}</span>
                </div>
              </div>
            </div>
            <Link
              to="/checkout"
              className="btn-primary mt-6 w-full"
            >
              Proceed to Checkout
            </Link>
            <Link
              to="/"
              className="btn-secondary mt-3 w-full"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Cart;
