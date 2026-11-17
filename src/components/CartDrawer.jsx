import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight, Minus, Plus, ShoppingBag, Trash2, X } from 'lucide-react';
import { useGlobal } from '../context/GlobalContext';
import { formatCurrency } from '../utils/format';

const FREE_SHIPPING_THRESHOLD = 1500;

export default function CartDrawer() {
  const {
    cartItems,
    cartCount,
    cartSubtotal,
    isCartOpen,
    closeCart,
    updateQuantity,
    removeFromCart,
  } = useGlobal();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isCartOpen) return undefined;
    const onKeyDown = (e) => {
      if (e.key === 'Escape') closeCart();
    };
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [isCartOpen, closeCart]);

  const progress = Math.min(100, Math.round((cartSubtotal / FREE_SHIPPING_THRESHOLD) * 100));
  const remainingForFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD - cartSubtotal);

  const handleProceedToCheckout = () => {
    closeCart();
    navigate('/checkout');
  };

  return (
    <AnimatePresence>
      {isCartOpen && (
        <div className="fixed inset-0 z-50 flex justify-end" role="dialog" aria-modal="true" aria-label="Shopping Bag">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.28 }}
            onClick={closeCart}
            className="fixed inset-0 bg-stone-950/30 backdrop-blur-[2px]"
          />

          {/* Slide-over Panel */}
          <motion.aside
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 32, stiffness: 320 }}
            className="relative z-10 flex h-full w-full max-w-md flex-col bg-white shadow-[-20px_0_60px_-15px_rgba(28,25,23,0.16)]"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-stone-100 px-6 py-5">
              <div className="flex items-baseline gap-2.5">
                <h2 className="font-serif text-2xl font-normal text-stone-900">Your Bag</h2>
                <span className="text-xs uppercase tracking-[0.18em] text-stone-400">
                  ({cartCount} {cartCount === 1 ? 'piece' : 'pieces'})
                </span>
              </div>
              <button
                type="button"
                onClick={closeCart}
                aria-label="Close bag"
                className="rounded-full p-2 text-stone-400 transition-colors hover:bg-stone-100 hover:text-stone-900"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Complimentary Shipping Progress */}
            {cartItems.length > 0 && (
              <div className="border-b border-stone-100 bg-[#FAF8F5] px-6 py-3.5">
                <p className="text-xs text-stone-600">
                  {remainingForFreeShipping === 0 ? (
                    <span className="font-medium text-[#5F6F58]">
                      Complimentary white-glove delivery unlocked.
                    </span>
                  ) : (
                    <>
                      Add{' '}
                      <span className="font-medium text-stone-900">
                        {formatCurrency(remainingForFreeShipping)}
                      </span>{' '}
                      more for complimentary white-glove delivery.
                    </>
                  )}
                </p>
                <div className="mt-2 h-1 w-full overflow-hidden rounded-full bg-stone-200">
                  <motion.div
                    className="h-full rounded-full bg-[#7C8B74]"
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.4, ease: 'easeOut' }}
                  />
                </div>
              </div>
            )}

            {/* Cart Items List */}
            <div className="flex-1 overflow-y-auto px-6 py-6">
              {cartItems.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center text-center py-12">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#FAF8F5] text-stone-400">
                    <ShoppingBag className="h-7 w-7 stroke-[1.5]" />
                  </div>
                  <h3 className="mt-5 font-serif text-2xl text-stone-900">Your bag is empty</h3>
                  <p className="mt-2 max-w-[240px] text-sm leading-relaxed text-stone-500">
                    Explore our latest architectural furniture and hand-thrown stoneware.
                  </p>
                  <Link
                    to="/shop"
                    onClick={closeCart}
                    className="mt-7 inline-flex items-center gap-2 rounded-full bg-stone-900 px-7 py-3 text-xs uppercase tracking-[0.2em] text-white transition-colors hover:bg-stone-800"
                  >
                    Explore Shop
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              ) : (
                <ul className="divide-y divide-stone-100">
                  <AnimatePresence initial={false}>
                    {cartItems.map((item) => (
                      <motion.li
                        key={item.key}
                        layout
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                        transition={{ duration: 0.25 }}
                        className="flex gap-4 py-5 first:pt-0 last:pb-0"
                      >
                        <Link
                          to={`/product/${item.id}`}
                          onClick={closeCart}
                          className="h-24 w-20 shrink-0 overflow-hidden rounded-lg bg-[#FAF8F5]"
                        >
                          <img
                            src={item.image}
                            alt={item.name}
                            className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                          />
                        </Link>

                        <div className="flex flex-1 flex-col justify-between min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <div className="min-w-0">
                              <Link
                                to={`/product/${item.id}`}
                                onClick={closeCart}
                                className="block truncate font-serif text-lg leading-snug text-stone-900 hover:text-[#A67B5B] transition-colors"
                              >
                                {item.name}
                              </Link>
                              <p className="mt-0.5 text-xs text-stone-500">{item.variant}</p>
                            </div>
                            <button
                              type="button"
                              onClick={() => removeFromCart(item.key)}
                              aria-label={`Remove ${item.name}`}
                              className="shrink-0 rounded p-1 text-stone-300 transition-colors hover:text-stone-700"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>

                          <div className="mt-3 flex items-center justify-between">
                            {/* Quantity Stepper */}
                            <div className="inline-flex items-center rounded-full border border-stone-200 bg-white">
                              <button
                                type="button"
                                onClick={() => updateQuantity(item.key, item.quantity - 1)}
                                aria-label="Decrease quantity"
                                className="flex h-7 w-7 items-center justify-center text-stone-500 transition-colors hover:text-stone-900"
                              >
                                <Minus className="h-3 w-3" />
                              </button>
                              <span className="min-w-6 text-center text-xs font-medium text-stone-900">
                                {item.quantity}
                              </span>
                              <button
                                type="button"
                                onClick={() => updateQuantity(item.key, item.quantity + 1)}
                                aria-label="Increase quantity"
                                className="flex h-7 w-7 items-center justify-center text-stone-500 transition-colors hover:text-stone-900"
                              >
                                <Plus className="h-3 w-3" />
                              </button>
                            </div>

                            <span className="text-sm font-medium text-stone-900">
                              {formatCurrency(item.price * item.quantity)}
                            </span>
                          </div>
                        </div>
                      </motion.li>
                    ))}
                  </AnimatePresence>
                </ul>
              )}
            </div>

            {/* Footer Summary */}
            {cartItems.length > 0 && (
              <div className="border-t border-stone-200/80 bg-[#FAF8F5]/70 px-6 py-6">
                <div className="flex items-center justify-between">
                  <span className="text-xs uppercase tracking-[0.18em] text-stone-500">
                    Subtotal
                  </span>
                  <span className="font-serif text-2xl text-stone-900">
                    {formatCurrency(cartSubtotal)}
                  </span>
                </div>
                <p className="mt-1.5 text-xs text-stone-500">
                  Taxes and delivery options calculated at checkout.
                </p>

                <button
                  type="button"
                  onClick={handleProceedToCheckout}
                  className="mt-5 flex w-full items-center justify-center gap-2 rounded-full bg-stone-900 px-6 py-3.5 text-xs font-medium uppercase tracking-[0.2em] text-white transition-all hover:bg-[#5F6F58]"
                >
                  Proceed to Checkout
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            )}
          </motion.aside>
        </div>
      )}
    </AnimatePresence>
  );
}
