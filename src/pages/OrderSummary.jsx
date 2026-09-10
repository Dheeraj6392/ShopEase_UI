import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';

function OrderSummary() {
  const { orderNumber } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await api.get(`/orders/${orderNumber}`);
        setOrder(res.data.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [orderNumber]);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  if (loading) return <LoadingSpinner />;

  if (error || !order) {
    return (
      <div className="text-center py-16">
        <p className="text-red-600 mb-4">{error || 'Order not found'}</p>
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
    <div className="max-w-2xl mx-auto">
      <div className="card p-8">
        <div className="text-center mb-8">
          <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <svg
              className="w-8 h-8 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Order Placed Successfully</h1>
          <p className="mt-2 text-gray-500">
            Order{' '}
            <span className="font-mono font-semibold text-primary-600">
              #{order.orderNumber}
            </span>
          </p>
        </div>

        <div className="border-t pt-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Items</h2>
          <div className="space-y-3">
            {order.items.map((item) => (
              <div
                key={item.id}
                className="flex justify-between items-center text-sm"
              >
                <div>
                  <p className="font-medium text-gray-900">{item.productName}</p>
                  <p className="text-gray-500">
                    {item.quantity} × {formatPrice(item.price)}
                  </p>
                </div>
                <p className="font-medium text-gray-900">{formatPrice(item.subtotal)}</p>
              </div>
            ))}
          </div>
          <div className="border-t mt-4 pt-4">
            <div className="flex justify-between">
              <span className="text-lg font-bold">Total</span>
              <span className="text-lg font-bold">{formatPrice(order.totalAmount)}</span>
            </div>
          </div>
        </div>

        <div className="border-t pt-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Customer Information</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
            <div>
              <span className="text-gray-500">Name:</span>
              <p className="font-medium">{order.customerName}</p>
            </div>
            <div>
              <span className="text-gray-500">Email:</span>
              <p className="font-medium">{order.email}</p>
            </div>
            <div>
              <span className="text-gray-500">Phone:</span>
              <p className="font-medium">{order.phone}</p>
            </div>
            <div>
              <span className="text-gray-500">Address:</span>
              <p className="font-medium">{order.address}</p>
            </div>
          </div>
        </div>

        <div className="border-t pt-6 mb-6">
          <div className="flex justify-between items-center">
            <span className="text-gray-500">Order Status:</span>
            <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
              {order.status}
            </span>
          </div>
          <div className="flex justify-between items-center mt-2">
            <span className="text-gray-500">Order Date:</span>
            <span className="font-medium">
              {new Date(order.createdAt).toLocaleDateString('en-IN', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </span>
          </div>
        </div>

        <div className="text-center flex flex-col sm:flex-row gap-3 justify-center items-center">
          <Link
            to="/orders"
            className="btn-secondary"
          >
            View All Orders
          </Link>
          <Link
            to="/"
            className="btn-primary"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}

export default OrderSummary;
