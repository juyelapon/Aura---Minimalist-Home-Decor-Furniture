import { useEffect } from 'react';
import { BrowserRouter, Link, Route, Routes, useLocation } from 'react-router-dom';
import { GlobalProvider } from './context/GlobalContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import CartDrawer from './components/CartDrawer';
import ToastContainer from './components/ToastContainer';
import Home from './pages/Home';
import Shop from './pages/Shop';
import ProductDetail from './pages/ProductDetail';
import Checkout from './pages/Checkout';

function ScrollToTop() {
  const { pathname, search } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [pathname, search]);

  return null;
}

function NotFound() {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-xl flex-col items-center justify-center px-6 py-24 text-center">
      <p className="text-xs uppercase tracking-[0.24em] text-stone-400">404</p>
      <h1 className="mt-3 font-serif text-4xl text-stone-900">Page Not Found</h1>
      <p className="mt-3 text-sm text-stone-500">
        The gallery or room you are looking for is unavailable.
      </p>
      <Link
        to="/"
        className="mt-8 inline-flex items-center rounded-full bg-stone-900 px-7 py-3.5 text-xs uppercase tracking-[0.2em] text-white transition-colors hover:bg-stone-800"
      >
        Return Home
      </Link>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <GlobalProvider>
        <ScrollToTop />
        <div className="flex min-h-screen flex-col bg-white text-stone-900">
          <Navbar />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/shop" element={<Shop />} />
              <Route path="/product/:id" element={<ProductDetail />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
          <Footer />
          <CartDrawer />
          <ToastContainer />
        </div>
      </GlobalProvider>
    </BrowserRouter>
  );
}
