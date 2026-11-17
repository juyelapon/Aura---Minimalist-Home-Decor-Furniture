import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import { useGlobal } from '../context/GlobalContext';
import { formatCurrency } from '../utils/format';

export default function ProductCard({ product, index = 0 }) {
  const { addToCart } = useGlobal();
  const primaryImage = product.images[0];
  const secondaryImage = product.images[1] || product.images[0];

  const handleQuickAdd = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1, product.variants?.[0]?.name);
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: Math.min(index * 0.06, 0.3), ease: [0.22, 1, 0.36, 1] }}
      className="group flex flex-col"
    >
      <Link
        to={`/product/${product.id}`}
        className="relative block aspect-[4/5] w-full overflow-hidden rounded-xl bg-[#FAF8F5]"
      >
        {/* Primary Image */}
        <img
          src={primaryImage}
          alt={product.name}
          loading="lazy"
          className="h-full w-full object-cover transition-all duration-700 ease-out group-hover:scale-105 group-hover:opacity-0"
        />

        {/* Secondary Hover-Reveal Image */}
        <img
          src={secondaryImage}
          alt={`${product.name} alternate view`}
          loading="lazy"
          className="absolute inset-0 h-full w-full object-cover opacity-0 scale-105 transition-all duration-700 ease-out group-hover:opacity-100 group-hover:scale-100"
        />

        {/* Subtle Top Editorial Badge */}
        {product.badge && (
          <span className="absolute top-3.5 left-3.5 rounded-full bg-white/90 px-3 py-1 text-[10px] font-medium uppercase tracking-[0.18em] text-stone-800 backdrop-blur-sm">
            {product.badge}
          </span>
        )}

        {/* Quick Add Overlay Button */}
        <div className="pointer-events-none absolute inset-x-3.5 bottom-3.5 flex justify-end opacity-0 translate-y-2 transition-all duration-300 group-hover:pointer-events-auto group-hover:opacity-100 group-hover:translate-y-0">
          <button
            type="button"
            onClick={handleQuickAdd}
            className="inline-flex items-center gap-1.5 rounded-full bg-white/95 px-4 py-2 text-[11px] font-medium uppercase tracking-[0.16em] text-stone-900 shadow-[0_8px_24px_-6px_rgba(28,25,23,0.2)] backdrop-blur-md transition-colors hover:bg-stone-900 hover:text-white"
          >
            <Plus className="h-3.5 w-3.5" />
            Quick Add
          </button>
        </div>
      </Link>

      {/* Product Metadata */}
      <div className="mt-4 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[11px] uppercase tracking-[0.18em] text-stone-400">
            {product.room} · {product.material}
          </p>
          <Link
            to={`/product/${product.id}`}
            className="mt-1 block font-serif text-xl leading-snug text-stone-900 transition-colors group-hover:text-[#A67B5B]"
          >
            {product.name}
          </Link>
        </div>
        <span className="shrink-0 pt-5 text-sm font-medium text-stone-800">
          {formatCurrency(product.price)}
        </span>
      </div>

      {/* Subtle Color Swatch Preview */}
      {product.variants && product.variants.length > 0 && (
        <div className="mt-2.5 flex items-center gap-1.5" aria-label="Available finishes">
          {product.variants.map((variant) => (
            <span
              key={variant.name}
              title={variant.name}
              style={{ backgroundColor: variant.hex }}
              className="h-3 w-3 rounded-full border border-stone-300/80"
            />
          ))}
        </div>
      )}
    </motion.article>
  );
}
