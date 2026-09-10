import { useState, useEffect, useCallback, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useCart } from '../context/CartContext';
import LoadingSpinner from '../components/LoadingSpinner';

const carouselSlides = [
  {
    eyebrow: 'Fresh picks, easy living',
    title: 'Good things, ready when you are.',
    description: 'Discover everyday essentials chosen for your next order.',
    image:
      'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1400&q=85',
  },
  {
    eyebrow: 'Small upgrades',
    title: 'Make room for better favourites.',
    description: 'Find the products that make ordinary routines feel effortless.',
    image:
      'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=1400&q=85',
  },
  {
    eyebrow: 'Weekend ready',
    title: 'Everything for the days ahead.',
    description: 'Shop across categories and bring a little more ease home.',
    image:
      'https://images.unsplash.com/photo-1601598851547-4302969d7c71?auto=format&fit=crop&w=1400&q=85',
  },
];

const searchStatements = [
  'Search for fresh groceries',
  'Search for everyday essentials',
  'Search for something you love',
];

function ProductListing() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [searchSuggestions, setSearchSuggestions] = useState([]);
  const [suggestionsLoading, setSuggestionsLoading] = useState(false);
  const [activeSlide, setActiveSlide] = useState(0);
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [placeholderCharacter, setPlaceholderCharacter] = useState(0);
  const [isDeletingPlaceholder, setIsDeletingPlaceholder] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 });
  const [initialLoading, setInitialLoading] = useState(true);
  const [switching, setSwitching] = useState(false);
  const [error, setError] = useState(null);
  const [addingId, setAddingId] = useState(null);
  const requestId = useRef(0);
  const suggestionsRequestId = useRef(0);
  const { addItem } = useCart();
  const navigate = useNavigate();

  const fetchProducts = useCallback(async (page = 1, category = '', search = '', isSwitch = false) => {
    const currentRequestId = ++requestId.current;
    if (isSwitch) setSwitching(true);
    setError(null);
    try {
      const params = { page, limit: 12 };
      if (category) params.category = category;
      if (search) params.q = search;
      const res = await api.get('/products', { params });
      if (currentRequestId !== requestId.current) return;
      setProducts(res.data.data.products);
      setPagination(res.data.data.pagination);
      setSelectedCategory(category);
    } catch (err) {
      if (currentRequestId !== requestId.current) return;
      setError(err.message);
    } finally {
      if (currentRequestId !== requestId.current) return;
      setInitialLoading(false);
      setSwitching(false);
    }
  }, []);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await api.get('/products', { params: { limit: 100 } });
        const cats = [...new Set(res.data.data.products.map((p) => p.category))];
        setCategories(cats);
      } catch {
        // ignore
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchProducts(1, '', false);
  }, [fetchProducts]);

  useEffect(() => {
    const timer = setTimeout(() => {
      const query = searchInput.trim();
      const currentRequestId = ++suggestionsRequestId.current;

      if (!query) {
        setSearchSuggestions([]);
        setSuggestionsLoading(false);
        return;
      }

      const fetchSuggestions = async () => {
        setSuggestionsLoading(true);
        try {
          const res = await api.get('/products', {
            params: { q: query, limit: 7 },
          });
          if (currentRequestId !== suggestionsRequestId.current) return;
          setSearchSuggestions(res.data.data.products);
        } catch {
          if (currentRequestId === suggestionsRequestId.current) {
            setSearchSuggestions([]);
          }
        } finally {
          if (currentRequestId === suggestionsRequestId.current) {
            setSuggestionsLoading(false);
          }
        }
      };

      fetchSuggestions();
    }, 350);
    return () => clearTimeout(timer);
  }, [searchInput]);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((current) => (current + 1) % carouselSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const phrase = searchStatements[placeholderIndex];
    const isPhraseComplete = placeholderCharacter === phrase.length;
    const isPhraseEmpty = placeholderCharacter === 0;
    const delay = isPhraseComplete ? 1400 : isPhraseEmpty ? 300 : isDeletingPlaceholder ? 45 : 75;

    const timer = setTimeout(() => {
      if (!isDeletingPlaceholder && !isPhraseComplete) {
        setPlaceholderCharacter((current) => current + 1);
      } else if (!isDeletingPlaceholder && isPhraseComplete) {
        setIsDeletingPlaceholder(true);
      } else if (isDeletingPlaceholder && !isPhraseEmpty) {
        setPlaceholderCharacter((current) => current - 1);
      } else {
        setIsDeletingPlaceholder(false);
        setPlaceholderIndex((current) => (current + 1) % searchStatements.length);
      }
    }, delay);

    return () => clearTimeout(timer);
  }, [isDeletingPlaceholder, placeholderCharacter, placeholderIndex]);

  const handleAddToCart = async (productId) => {
    setAddingId(productId);
    await addItem(productId, 1);
    setAddingId(null);
  };

  const handleViewDetails = (productId) => {
    navigate(`/product/${productId}`);
  };

  const handlePageChange = (page) => {
    fetchProducts(page, selectedCategory, '', true);
  };

  const handleCategoryChange = (category) => {
    if (category === selectedCategory || switching) return;
    fetchProducts(1, category, '', true);
  };

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    const nextSearch = searchInput.trim();
    setSearchFocused(false);
    if (!nextSearch) return;
    navigate(`/search?q=${encodeURIComponent(nextSearch)}`);
  };

  const showSlide = (direction) => {
    setActiveSlide(
      (current) => (current + direction + carouselSlides.length) % carouselSlides.length
    );
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  if (initialLoading) return <LoadingSpinner />;

  if (error && products.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-red-600 mb-4">{error}</p>
        <button
          onClick={() => fetchProducts()}
          className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Products</h1>
        <p className="text-gray-500">Browse our collection of quality products</p>
      </div>

      <form
        onSubmit={handleSearchSubmit}
        className="relative z-30 mb-8"
        onFocus={() => setSearchFocused(true)}
        onBlur={() => setTimeout(() => setSearchFocused(false), 150)}
      >
        <label htmlFor="product-search" className="sr-only">Search products</label>
        <input
          id="product-search"
          type="search"
          value={searchInput}
          onChange={(event) => setSearchInput(event.target.value)}
          placeholder={searchStatements[placeholderIndex].slice(0, placeholderCharacter)}
          className="w-full rounded-2xl border border-gray-200 bg-white py-4 pl-12 pr-28 text-gray-900 shadow-sm outline-none transition-shadow placeholder:text-gray-400 focus:border-primary-400 focus:ring-4 focus:ring-primary-100"
        />
        <svg className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="m21 21-4.35-4.35m1.35-5.15a6.5 6.5 0 1 1-13 0 6.5 6.5 0 0 1 13 0Z" />
        </svg>
        <button type="submit" className="absolute right-2 top-2 rounded-xl bg-primary-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary-700">
          Search
        </button>
        {searchFocused && searchInput.trim() && (
          <div className="absolute left-0 right-0 top-full mt-2 overflow-hidden rounded-2xl border border-gray-200 bg-white p-2 shadow-xl">
            {suggestionsLoading ? (
              <div className="flex items-center gap-3 px-4 py-5 text-sm text-gray-500">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-primary-500" />
                Finding products...
              </div>
            ) : searchSuggestions.length > 0 ? (
              <div className="max-h-80 overflow-y-auto">
                {searchSuggestions.map((product) => (
                  <button
                    type="button"
                    key={product.id}
                    onMouseDown={(event) => event.preventDefault()}
                    onClick={() => {
                      setSearchFocused(false);
                      navigate(`/product/${product.id}`);
                    }}
                    className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-colors hover:bg-primary-50"
                  >
                    <img src={product.imageUrl} alt="" className="h-11 w-11 rounded-lg border border-gray-100 object-cover" />
                    <span className="min-w-0 flex-1 truncate text-sm font-semibold text-gray-800">{product.name}</span>
                    <span className="text-xs font-medium text-primary-600">View details</span>
                  </button>
                ))}
              </div>
            ) : (
              <p className="px-4 py-5 text-sm text-gray-500">No matching products found</p>
            )}
          </div>
        )}
      </form>

      <section className="relative mb-10 overflow-hidden rounded-3xl bg-gray-900" aria-label="Featured products">
        {carouselSlides.map((slide, index) => (
          <div
            key={slide.title}
            className={`absolute inset-0 transition-opacity duration-700 ${index === activeSlide ? 'opacity-100' : 'pointer-events-none opacity-0'}`}
            aria-hidden={index !== activeSlide}
          >
            <img src={slide.image} alt="" className="h-full w-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-r from-gray-950/80 via-gray-900/45 to-transparent" />
            <div className="relative flex min-h-[300px] items-center px-7 py-10 sm:min-h-[360px] sm:px-12">
              <div className="max-w-lg text-white">
                <p className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-primary-200">{slide.eyebrow}</p>
                <h2 className="text-3xl font-bold leading-tight sm:text-5xl">{slide.title}</h2>
                <p className="mt-4 max-w-md text-sm leading-6 text-gray-200 sm:text-base">{slide.description}</p>
              </div>
            </div>
          </div>
        ))}
        <div className="relative flex min-h-[300px] items-end justify-between px-7 pb-6 sm:min-h-[360px] sm:px-12">
          <div className="flex gap-2">
            {carouselSlides.map((slide, index) => (
              <button
                key={slide.title}
                type="button"
                aria-label={`Show slide ${index + 1}`}
                onClick={() => setActiveSlide(index)}
                className={`h-2 rounded-full transition-all ${index === activeSlide ? 'w-8 bg-white' : 'w-2 bg-white/50'}`}
              />
            ))}
          </div>
          <div className="flex gap-2">
            <button type="button" aria-label="Previous slide" onClick={() => showSlide(-1)} className="flex h-10 w-10 items-center justify-center rounded-full bg-white/15 text-xl text-white backdrop-blur transition-colors hover:bg-white/30">&larr;</button>
            <button type="button" aria-label="Next slide" onClick={() => showSlide(1)} className="flex h-10 w-10 items-center justify-center rounded-full bg-white/15 text-xl text-white backdrop-blur transition-colors hover:bg-white/30">&rarr;</button>
          </div>
        </div>
      </section>

      <div className="flex flex-wrap gap-2 mb-6">
        <button
          onClick={() => handleCategoryChange('')}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
            selectedCategory === ''
              ? 'bg-primary-600 text-white shadow-sm'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          All
        </button>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => handleCategoryChange(cat)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
              selectedCategory === cat
                ? 'bg-primary-600 text-white shadow-sm'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="relative">
        {switching && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/70 backdrop-blur-[1px]">
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-primary-500"></div>
              <span>Loading...</span>
            </div>
          </div>
        )}
      {products.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-gray-500 text-lg">No products found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow"
            >
              <div className="aspect-square bg-gray-100 overflow-hidden">
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  onError={(e) => {
                    e.target.src =
                      'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200"><rect fill="%23e5e7eb" width="200" height="200"/><text fill="%239ca3af" font-family="sans-serif" font-size="14" x="50%" y="50%" dominant-baseline="middle" text-anchor="middle">No Image</text></svg>';
                  }}
                />
              </div>
              <div className="p-4">
                <span className="text-xs font-medium text-primary-600 bg-primary-50 px-2 py-1 rounded">
                  {product.category}
                </span>
                <h3 className="mt-2 text-lg font-semibold text-gray-900 line-clamp-2">
                  {product.name}
                </h3>
                <p className="mt-1 text-2xl font-bold text-gray-900">
                  {formatPrice(product.price)}
                </p>
                <p className="mt-1 text-sm text-gray-500">
                  {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                </p>
                <div className="mt-4 flex gap-2">
                  <button
                    type="button"
                    onClick={() => handleViewDetails(product.id)}
                    className="flex-1 text-center px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    View Details
                  </button>
                  <button
                    onClick={() => handleAddToCart(product.id)}
                    disabled={product.stock === 0 || addingId === product.id}
                    className="flex-1 px-3 py-2 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                  >
                    {addingId === product.id ? 'Adding...' : 'Add to Cart'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      </div>

      {pagination.totalPages > 1 && (
        <div className="flex justify-center mt-8 gap-2">
          {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map(
            (page) => (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  page === pagination.page
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {page}
              </button>
            )
          )}
        </div>
      )}
    </div>
  );
}

export default ProductListing;
