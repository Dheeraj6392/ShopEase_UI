import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useCart } from '../context/CartContext';
import LoadingSpinner from '../components/LoadingSpinner';
import QuantityControl from '../components/QuantityControl';

const IMG_FALLBACK =
  'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400"><rect fill="%23e5e7eb" width="400" height="400"/><text fill="%239ca3af" font-family="sans-serif" font-size="18" x="50%" y="50%" dominant-baseline="middle" text-anchor="middle">No Image</text></svg>';

const heroSlides = [
  {
    kicker: 'Fresh in, fast out',
    title: 'Your everyday cart, elevated.',
    text: 'A brighter way to stock up on the good stuff.',
    image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1400&q=85',
    accent: 'from-[#ffd4d4] to-[#fff3f3]',
  },
  {
    kicker: 'Make the week easier',
    title: 'Little luxuries, right on time.',
    text: 'Pantry staples, treats and home finds in one calm scroll.',
    image: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/9/94/Breakfast_spread_with_coffee%2C_pastry%2C_and_juice_on_a_table_in_a_cozy_morning_setting.jpg/1280px-Breakfast_spread_with_coffee%2C_pastry%2C_and_juice_on_a_table_in_a_cozy_morning_setting.jpg',
    accent: 'from-[#dff8f2] to-[#f2fffb]',
  },
];

const categoryTiles = [
  { name: 'Fresh Produce', label: 'Fruits & vegetables', image: 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?auto=format&fit=crop&w=300&q=80', tone: 'bg-[#fff0e5]' },
  { name: 'Dairy & Eggs', label: 'Daily essentials', image: 'https://images.unsplash.com/photo-1628088062854-d1870b4553da?auto=format&fit=crop&w=300&q=80', tone: 'bg-[#e8f6ff]' },
  { name: 'Snacks', label: 'Crunch time', image: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/8/8f/A_bowl_of_snacks.jpg/330px-A_bowl_of_snacks.jpg', tone: 'bg-[#fff5d9]' },
  { name: 'Beverages', label: 'Pour something good', image: 'https://images.unsplash.com/photo-1544145945-f90425340c7e?auto=format&fit=crop&w=300&q=80', tone: 'bg-[#e7f8ee]' },
  { name: 'Home Care', label: 'Clean and calm', image: 'https://images.unsplash.com/photo-1583947215259-38e31be8751f?auto=format&fit=crop&w=300&q=80', tone: 'bg-[#eeeafd]' },
  { name: 'Personal Care', label: 'Feel your best', image: 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?auto=format&fit=crop&w=300&q=80', tone: 'bg-[#ffe8f0]' },
];

const categoryOrder = ['Fresh Produce', 'Dairy & Eggs', 'Snacks', 'Beverages', 'Home Care', 'Personal Care', 'Pantry', 'Accessories', 'Electronics', 'Home', 'Office'];

function HomeStorefront() {
  const navigate = useNavigate();
  const { cart, addItem, updateItem, removeItem } = useCart();
  const [products, setProducts] = useState([]);
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [suggestionsLoading, setSuggestionsLoading] = useState(false);
  const [focused, setFocused] = useState(false);
  const [slide, setSlide] = useState(0);
  const [addingId, setAddingId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const response = await api.get('/products', { params: { limit: 100 } });
        setProducts(response.data.data.products);
      } finally {
        setLoading(false);
      }
    };
    loadProducts();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => setSlide((current) => (current + 1) % heroSlides.length), 4800);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const value = query.trim();
    if (!value) {
      setSuggestions([]);
      return undefined;
    }
    const timer = setTimeout(async () => {
      setSuggestionsLoading(true);
      try {
        const response = await api.get('/products', { params: { q: value, limit: 6 } });
        setSuggestions(response.data.data.products);
      } catch {
        setSuggestions([]);
      } finally {
        setSuggestionsLoading(false);
      }
    }, 250);
    return () => clearTimeout(timer);
  }, [query]);

  const groupedProducts = useMemo(() => {
    const groups = new Map();
    products.forEach((product) => {
      if (!groups.has(product.category)) groups.set(product.category, []);
      groups.get(product.category).push(product);
    });
    return [...groups.entries()].sort((left, right) => {
      const leftIndex = categoryOrder.indexOf(left[0]);
      const rightIndex = categoryOrder.indexOf(right[0]);
      return (leftIndex < 0 ? 99 : leftIndex) - (rightIndex < 0 ? 99 : rightIndex);
    });
  }, [products]);

  const submitSearch = (event) => {
    event.preventDefault();
    if (query.trim()) navigate(`/search?q=${encodeURIComponent(query.trim())}`);
  };

  const addProduct = async (product) => {
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

  if (loading) return <LoadingSpinner />;

  return (
    <div className="pb-10">
      <section className="relative mb-8 overflow-visible rounded-[28px] bg-[#fff8f1] p-5 shadow-[0_16px_50px_rgba(95,55,40,0.08)] sm:p-7">
        <div className="mb-5 flex items-center justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#f84040]">Good morning, shopper</p>
            <h1 className="mt-1 text-2xl font-black tracking-tight text-[#17202a] sm:text-3xl">What are we bringing home?</h1>
          </div>
          <span className="hidden rounded-full bg-white px-4 py-2 text-xs font-semibold text-[#6b7280] shadow-sm sm:block">Curated for your everyday</span>
        </div>

        <form onSubmit={submitSearch} className="relative z-30">
          <label htmlFor="home-search" className="sr-only">Search the store</label>
          <div className="flex rounded-2xl border border-[#e4e4e4] bg-white p-1.5 shadow-sm focus-within:border-[#f84040] focus-within:ring-4 focus-within:ring-[#f84040]/10">
            <svg className="ml-3 h-5 w-5 self-center text-[#a5aab2]" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="m21 21-4.35-4.35m1.35-5.15a6.5 6.5 0 1 1-13 0Z" /></svg>
            <input id="home-search" value={query} onChange={(event) => setQuery(event.target.value)} onFocus={() => setFocused(true)} onBlur={() => setTimeout(() => setFocused(false), 150)} placeholder="Search groceries, snacks, home finds..." className="min-w-0 flex-1 bg-transparent px-3 py-3 text-sm text-[#17202a] outline-none placeholder:text-[#a5aab2]" />
            <button type="submit" className="rounded-xl bg-[#f84040] px-5 py-3 text-sm font-bold text-white shadow-[0_6px_16px_rgba(248,64,64,0.25)] transition hover:bg-[#e52d2d]">Search</button>
          </div>
          {focused && query.trim() && (
            <div className="absolute left-0 right-0 top-full mt-2 overflow-hidden rounded-2xl border border-[#eee3dc] bg-white p-2 shadow-2xl">
              {suggestionsLoading ? <p className="px-4 py-5 text-sm text-[#7c8490]">Finding your picks...</p> : suggestions.length ? suggestions.map((product) => (
                <button key={product.id} type="button" onMouseDown={(event) => event.preventDefault()} onClick={() => navigate(`/product/${product.id}`)} className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left hover:bg-[#fff0f4]">
                  <img src={product.imageUrl} alt="" className="h-10 w-10 rounded-lg object-cover" onError={handleImgError} />
                  <span className="min-w-0 flex-1 truncate text-sm font-semibold text-[#26313d]">{product.name}</span>
                  <span className="text-xs font-bold text-[#f84040]">View details</span>
                </button>
              )) : <p className="px-4 py-5 text-sm text-[#7c8490]">No matching products yet</p>}
            </div>
          )}
        </form>
      </section>

      <section className="relative mb-9 overflow-hidden rounded-[26px] bg-[#17202a] shadow-[0_18px_45px_rgba(23,32,42,0.16)]">
        <div className="flex min-h-[260px] items-center sm:min-h-[310px]">
          <div className={`absolute inset-0 bg-gradient-to-r ${heroSlides[slide].accent}`} />
          <div className="relative z-10 max-w-[58%] px-6 py-10 sm:px-12">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-[#f84040]">{heroSlides[slide].kicker}</p>
            <h2 className="mt-3 text-3xl font-black leading-[1.02] tracking-tight text-[#17202a] sm:text-5xl">{heroSlides[slide].title}</h2>
            <p className="mt-4 max-w-sm text-sm leading-6 text-[#5e6873]">{heroSlides[slide].text}</p>
            <button type="button" onClick={() => document.getElementById('product-rails')?.scrollIntoView({ behavior: 'smooth' })} className="mt-6 rounded-xl bg-[#17202a] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#2b3947]">Shop the edit</button>
          </div>
          <img src={heroSlides[slide].image} alt="" className="absolute right-0 h-full w-[48%] object-cover" onError={handleImgError} />
          <div className="absolute inset-y-0 right-[38%] w-32 bg-gradient-to-r from-transparent to-transparent" />
        </div>
        <div className="absolute bottom-5 left-6 flex gap-2 sm:left-12">
          {heroSlides.map((item, index) => <button key={item.title} type="button" aria-label={`Show banner ${index + 1}`} onClick={() => setSlide(index)} className={`h-2 rounded-full transition-all ${index === slide ? 'w-8 bg-[#f84040]' : 'w-2 bg-[#17202a]/25'}`} />)}
        </div>
      </section>

      <section className="mb-10">
        <div className="mb-4 flex items-end justify-between"><div><p className="text-xs font-bold uppercase tracking-[0.16em] text-[#f84040]">Browse by mood</p><h2 className="mt-1 text-xl font-black text-[#17202a]">Shop your way</h2></div><span className="text-xs font-semibold text-[#8b929b]">Tap to explore</span></div>
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-6">
          {categoryTiles.map((tile) => <button key={tile.name} type="button" onClick={() => navigate(`/search?category=${encodeURIComponent(tile.name)}`)} className={`group overflow-hidden rounded-2xl ${tile.tone} p-3 text-left transition duration-300 hover:shadow-lg`}><img src={tile.image} alt="" className="mx-auto h-20 w-full object-contain mix-blend-multiply transition group-hover:scale-105 sm:h-24" onError={handleImgError} /><p className="mt-2 text-xs font-black text-[#26313d]">{tile.name}</p><p className="mt-1 hidden text-[11px] text-[#737b85] sm:block">{tile.label}</p></button>)}
        </div>
      </section>

      <div id="product-rails" className="space-y-10">
        {groupedProducts.map(([category, items]) => <section key={category} className="relative"><div className="mb-4 flex items-end justify-between"><div><p className="text-xs font-bold uppercase tracking-[0.16em] text-[#f84040]">Freshly picked</p><h2 className="mt-1 text-xl font-black text-[#17202a]">{category}</h2></div><Link to={`/search?category=${encodeURIComponent(category)}`} className="text-sm font-bold text-[#f84040] hover:text-[#e52d2d]">See all <span aria-hidden="true">&rarr;</span></Link></div><div className="scrollbar-hide flex snap-x gap-3 overflow-x-auto pb-2">{items.map((product) => { const quantity = getCartQuantity(product.id); return <article key={product.id} className="min-w-[156px] max-w-[156px] snap-start overflow-hidden rounded-2xl border border-[#e8e8e8] bg-white shadow-[0_5px_18px_rgba(23,32,42,0.05)] transition hover:shadow-lg sm:min-w-[190px] sm:max-w-[190px]"><button type="button" onClick={() => navigate(`/product/${product.id}`)} className="block w-full text-left"><div className="relative flex h-36 items-center justify-center bg-[#fafafa] p-3 sm:h-40"><img src={product.imageUrl} alt={product.name} className="h-full w-full object-contain mix-blend-multiply" onError={handleImgError} />{product.stock < 10 && <span className="absolute left-2 top-2 rounded-md bg-[#fff0d4] px-1.5 py-1 text-[9px] font-black uppercase text-[#9a641b]">Low stock</span>}</div><div className="p-3"><p className="line-clamp-2 min-h-9 text-xs font-bold leading-4 text-[#26313d]">{product.name}</p><p className="mt-2 text-sm font-black text-[#17202a]">{new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(product.price)}</p><p className="mt-1 text-[10px] text-[#89919b]">{product.stock > 0 ? `${product.stock} available` : 'Out of stock'}</p></div></button><QuantityControl quantity={quantity} loading={addingId === product.id} onAdd={() => addProduct(product)} onDecrease={() => changeQuantity(product.id, quantity - 1)} onIncrease={() => changeQuantity(product.id, quantity + 1)} /></article>; })}</div></section>)}
      </div>
    </div>
  );
}

export default HomeStorefront;
