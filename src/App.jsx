import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import HomeStorefront from './pages/HomeStorefront';
import ProductDetails from './pages/ProductDetails';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import OrderSummary from './pages/OrderSummary';
import Footer from './components/Footer';
import SearchResults from './pages/SearchResults';
import Orders from './pages/Orders';

function App() {
  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <Navbar />
      <main className="w-full max-w-7xl flex-1 mx-auto px-4 py-6 sm:px-6 lg:px-8">
        <Routes>
          <Route path="/" element={<HomeStorefront />} />
          <Route path="/search" element={<SearchResults />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/product/:id" element={<ProductDetails />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/order/:orderNumber" element={<OrderSummary />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
