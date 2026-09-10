import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import LottieRunner from './LottieRunner';

function Navbar() {
  const { cart } = useCart();
  const logoRef = useRef(null);
  const cartRef = useRef(null);
  const rowRef = useRef(null);
  const [flight, setFlight] = useState(null);
  const [patrolTo, setPatrolTo] = useState('120px');
  const flightSeq = useRef(0);

  useEffect(() => {
    const updatePatrol = () => {
      const runner = logoRef.current?.getBoundingClientRect();
      const cart = cartRef.current?.getBoundingClientRect();
      const row = rowRef.current?.getBoundingClientRect();
      if (!runner || !cart || !row) return;
      const to = Math.max(0, Math.round(cart.left - row.left - runner.width - 10));
      setPatrolTo(`${to}px`);
    };
    updatePatrol();
    window.addEventListener('resize', updatePatrol);
    return () => window.removeEventListener('resize', updatePatrol);
  }, []);

  useEffect(() => {
    const handleAddToCart = (event) => {
      const from = logoRef.current?.getBoundingClientRect();
      const to = cartRef.current?.getBoundingClientRect();
      if (!from || !to) return;
      flightSeq.current += 1;
      setFlight({
        seq: flightSeq.current,
        fromX: from.left + from.width / 2,
        fromY: from.top + from.height / 2,
        toX: to.left + to.width / 2,
        toY: to.top + to.height / 2,
        product: event.detail?.product || null,
      });
    };
    window.addEventListener('cart:item-added', handleAddToCart);
    return () => window.removeEventListener('cart:item-added', handleAddToCart);
  }, []);

  useEffect(() => {
    if (!flight) return undefined;
    const timer = setTimeout(() => setFlight(null), 950);
    return () => clearTimeout(timer);
  }, [flight]);

  return (
    <nav className="sticky top-0 z-50 overflow-hidden border-b border-[#e8e8e8] bg-white/95 backdrop-blur">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between" ref={rowRef}>
          <Link to="/" className="flex self-stretch items-center space-x-2">
            <span className="text-2xl font-black tracking-tight text-[#f84040]">ShopEase<span className="text-[#17202a]">.</span></span>
            <span
              ref={logoRef}
              className="runner-mover ml-1 inline-flex items-center self-end"
              title="Your speedy courier"
              style={{ '--patrol-from': '0px', '--patrol-to': patrolTo }}
            >
              <LottieRunner height={40} className="drop-shadow-sm" />
            </span>
          </Link>

          <div className="flex items-center gap-5" ref={cartRef}>
            <Link
              to="/"
              className="hidden text-sm font-bold text-[#58616b] transition-colors hover:text-[#f84040] sm:block"
            >
              Shop
            </Link>
            <Link
              to="/orders"
              className="hidden text-sm font-bold text-[#58616b] transition-colors hover:text-[#f84040] sm:block"
            >
              Orders
            </Link>
            <Link
              key={flight ? `pulse-${flight.seq}` : 'cart-idle'}
              to="/cart"
              aria-label="Shopping cart"
              className={`relative text-[#58616b] transition-colors hover:text-[#f84040] ${flight ? 'cart-pulse' : ''}`}
            >
              <svg
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z"
                />
              </svg>
              {cart.totalItems > 0 && (
                <span
                  key={`badge-${cart.totalItems}`}
                  className="badge-pop absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-[#f84040] text-xs font-bold text-white"
                >
                  {cart.totalItems}
                </span>
              )}
            </Link>
          </div>
        </div>
      </div>

      {flight && (
        <div
          key={`flight-${flight.seq}`}
          className="runner-flight"
          style={{
            '--from-x': `${flight.fromX}px`,
            '--from-y': `${flight.fromY}px`,
            '--to-x': `${flight.toX}px`,
            '--to-y': `${flight.toY}px`,
          }}
        >
          {flight.product?.imageUrl ? (
            <span
              className="runner-flight__item"
              style={{ backgroundImage: `url('${flight.product.imageUrl}')` }}
            />
          ) : (
            <span className="runner-flight__item runner-flight__item--box" />
          )}
          <LottieRunner height={30} className="runner-flight__courier" />
        </div>
      )}
    </nav>
  );
}

export default Navbar;