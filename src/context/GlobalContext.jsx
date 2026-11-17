import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';

export const CartContext = createContext(null);

const STORAGE_KEY = 'aura_cart_v1';

function loadInitialCart() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function GlobalProvider({ children }) {
  const [cartItems, setCartItems] = useState(loadInitialCart);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [toasts, setToasts] = useState([]);
  const toastTimers = useRef(new Map());

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cartItems));
    } catch {
      // Ignore storage quota errors in restricted environments
    }
  }, [cartItems]);

  useEffect(() => {
    const timers = toastTimers.current;
    return () => {
      timers.forEach((timerId) => clearTimeout(timerId));
      timers.clear();
    };
  }, []);

  const dismissToast = useCallback((id) => {
    const existing = toastTimers.current.get(id);
    if (existing) {
      clearTimeout(existing);
      toastTimers.current.delete(id);
    }
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback(
    (message, detail = '', type = 'success') => {
      const id = `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
      setToasts((prev) => [...prev.slice(-2), { id, message, detail, type }]);

      const timer = setTimeout(() => {
        dismissToast(id);
      }, 3400);
      toastTimers.current.set(id, timer);
    },
    [dismissToast]
  );

  const openCart = useCallback(() => setIsCartOpen(true), []);
  const closeCart = useCallback(() => setIsCartOpen(false), []);
  const toggleCart = useCallback(() => setIsCartOpen((prev) => !prev), []);

  const addToCart = useCallback(
    (product, quantity = 1, variant) => {
      const selectedVariant =
        variant || product.variants?.[0]?.name || product.material || 'Standard';
      const itemKey = `${product.id}__${selectedVariant}`;

      setCartItems((prev) => {
        const existingIndex = prev.findIndex((item) => item.key === itemKey);
        if (existingIndex > -1) {
          const updated = [...prev];
          updated[existingIndex] = {
            ...updated[existingIndex],
            quantity: updated[existingIndex].quantity + quantity,
          };
          return updated;
        }
        return [
          ...prev,
          {
            key: itemKey,
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.images?.[0],
            variant: selectedVariant,
            room: product.room,
            quantity,
          },
        ];
      });

      showToast('Added to Cart', `${product.name} — ${selectedVariant}`);
    },
    [showToast]
  );

  const removeFromCart = useCallback(
    (itemKey) => {
      setCartItems((prev) => {
        const target = prev.find((item) => item.key === itemKey);
        if (target) {
          showToast('Removed from Cart', target.name, 'info');
        }
        return prev.filter((item) => item.key !== itemKey);
      });
    },
    [showToast]
  );

  const updateQuantity = useCallback(
    (itemKey, nextQty) => {
      if (nextQty <= 0) {
        removeFromCart(itemKey);
        return;
      }
      setCartItems((prev) =>
        prev.map((item) => (item.key === itemKey ? { ...item, quantity: nextQty } : item))
      );
    },
    [removeFromCart]
  );

  const clearCart = useCallback(() => {
    setCartItems([]);
  }, []);

  const cartCount = useMemo(
    () => cartItems.reduce((sum, item) => sum + item.quantity, 0),
    [cartItems]
  );

  const cartSubtotal = useMemo(
    () => cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [cartItems]
  );

  const value = useMemo(
    () => ({
      cartItems,
      cartCount,
      cartSubtotal,
      isCartOpen,
      openCart,
      closeCart,
      toggleCart,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      toasts,
      showToast,
      dismissToast,
    }),
    [
      cartItems,
      cartCount,
      cartSubtotal,
      isCartOpen,
      openCart,
      closeCart,
      toggleCart,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      toasts,
      showToast,
      dismissToast,
    ]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useGlobal() {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error('useGlobal must be used within a GlobalProvider');
  }
  return ctx;
}

export const useCart = useGlobal;
