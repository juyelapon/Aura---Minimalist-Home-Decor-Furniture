import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Menu, ShoppingBag, X } from 'lucide-react';
import { useGlobal } from '../context/GlobalContext';

const navLinks = [
  { label: 'Home', to: '/' },
  { label: 'Shop All', to: '/shop' },
  { label: 'Living', to: '/shop?room=Living' },
  { label: 'Bedroom', to: '/shop?room=Bedroom' },
  { label: 'Dining', to: '/shop?room=Dining' },
];

export default function Navbar() {
  const { cartCount, openCart } = useGlobal();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 18);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const isLinkActive = (to) => {
    if (to === '/') return location.pathname === '/';
    if (to === '/shop') return location.pathname === '/shop' && !location.search;
    return `${location.pathname}${location.search}` === to;
  };

  return (
    <>
      <header
        className={`sticky top-0 z-40 w-full transition-all duration-300 ${
          scrolled
            ? 'border-b border-stone-200/80 bg-white/88 backdrop-blur-md shadow-[0_4px_24px_-12px_rgba(28,25,23,0.08)]'
            : 'border-b border-stone-200/50 bg-white/80 backdrop-blur-md'
        }`}
      >
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5 sm:px-8 lg:px-12">
          {/* Mobile menu toggle */}
          <div className="flex items-center lg:hidden">
            <button
              type="button"
              onClick={() => setMobileOpen((prev) => !prev)}
              aria-label={mobileOpen ? 'Close navigation menu' : 'Open navigation menu'}
              className="rounded-full p-2 -ml-2 text-stone-700 transition-colors hover:bg-stone-100"
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>

          {/* Left Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8" aria-label="Primary">
            {navLinks.slice(0, 3).map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={`text-xs uppercase tracking-[0.2em] transition-colors ${
                  isLinkActive(item.to)
                    ? 'font-medium text-stone-900 underline underline-offset-8 decoration-[#A67B5B]'
                    : 'text-stone-500 hover:text-stone-900'
                }`}
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          {/* Center Brand Wordmark */}
          <Link
            to="/"
            className="font-serif text-3xl sm:text-[2rem] font-normal tracking-[0.28em] text-stone-900 transition-opacity hover:opacity-75 pl-[0.28em]"
          >
            AURA
          </Link>

          {/* Right Desktop Navigation + Cart */}
          <div className="flex items-center gap-8">
            <nav className="hidden lg:flex items-center gap-8" aria-label="Rooms">
              {navLinks.slice(3).map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={`text-xs uppercase tracking-[0.2em] transition-colors ${
                    isLinkActive(item.to)
                      ? 'font-medium text-stone-900 underline underline-offset-8 decoration-[#A67B5B]'
                      : 'text-stone-500 hover:text-stone-900'
                  }`}
                >
                  {item.label}
                </NavLink>
              ))}
            </nav>

            <button
              type="button"
              onClick={openCart}
              aria-label={`Open shopping bag with ${cartCount} items`}
              className="group relative flex items-center gap-2 rounded-full border border-stone-200/90 bg-white px-3.5 py-2 text-xs uppercase tracking-[0.16em] text-stone-800 transition-all hover:border-stone-400 hover:bg-[#FAF8F5]"
            >
              <ShoppingBag className="h-4 w-4 text-stone-700 transition-transform duration-300 group-hover:-translate-y-0.5" />
              <span className="hidden sm:inline">Bag</span>
              <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-stone-900 px-1.5 text-[10px] font-medium text-white">
                {cartCount}
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Navigation Drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="overflow-hidden border-b border-stone-200 bg-white lg:hidden"
          >
            <nav className="flex flex-col space-y-1 px-6 py-5" aria-label="Mobile Navigation">
              {navLinks.map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={() => setMobileOpen(false)}
                  className={`py-2.5 text-xs uppercase tracking-[0.2em] transition-colors ${
                    isLinkActive(item.to)
                      ? 'font-medium text-stone-900'
                      : 'text-stone-500 hover:text-stone-900'
                  }`}
                >
                  {item.label}
                </Link>
              ))}
              <Link
                to="/checkout"
                onClick={() => setMobileOpen(false)}
                className="pt-3 mt-2 border-t border-stone-100 text-xs uppercase tracking-[0.2em] text-[#5F6F58] font-medium"
              >
                Checkout
              </Link>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
