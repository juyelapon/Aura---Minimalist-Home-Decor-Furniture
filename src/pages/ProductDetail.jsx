import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import {
  ArrowLeft,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Minus,
  Plus,
  ShieldCheck,
  Truck,
} from 'lucide-react';
import { products } from '../data/products';
import { useGlobal } from '../context/GlobalContext';
import { formatCurrency } from '../utils/format';
import ProductCard from '../components/ProductCard';

function AccordionItem({ title, isOpen, onToggle, children }) {
  return (
    <div className="border-b border-stone-200">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isOpen}
        className="flex w-full items-center justify-between py-4 text-left"
      >
        <span className="text-xs font-medium uppercase tracking-[0.2em] text-stone-900">
          {title}
        </span>
        <ChevronDown
          className={`h-4 w-4 text-stone-500 transition-transform duration-300 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <div className="pb-5 text-sm leading-relaxed text-stone-600">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function ProductDetail() {
  const { id } = useParams();
  return <ProductDetailContent key={id} id={id} />;
}

function ProductDetailContent({ id }) {
  const { addToCart, openCart } = useGlobal();

  const product = products.find((p) => p.id === id);

  const [selectedImageIdx, setSelectedImageIdx] = useState(0);
  const [selectedVariantIdx, setSelectedVariantIdx] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [openAccordion, setOpenAccordion] = useState('dimensions');
  const [justAdded, setJustAdded] = useState(false);

  if (!product) {
    return (
      <div className="mx-auto flex min-h-[60vh] max-w-3xl flex-col items-center justify-center px-6 py-24 text-center">
        <p className="text-xs uppercase tracking-[0.24em] text-stone-400">404 — Piece Not Found</p>
        <h1 className="mt-3 font-serif text-4xl text-stone-900">
          This piece could not be located.
        </h1>
        <p className="mt-3 text-sm text-stone-500">
          It may have moved or been archived from our seasonal catalog.
        </p>
        <Link
          to="/shop"
          className="mt-8 inline-flex items-center gap-2 rounded-full bg-stone-900 px-7 py-3.5 text-xs uppercase tracking-[0.2em] text-white transition-colors hover:bg-stone-800"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Return to Shop
        </Link>
      </div>
    );
  }

  const variants = product.variants || [];
  const activeVariant = variants[selectedVariantIdx] || {
    name: product.material,
    materialNote: product.material,
  };
  const images = product.images || [];
  const activeImage = images[selectedImageIdx] || images[0];

  const relatedProducts = products
    .filter((p) => p.id !== product.id && (p.room === product.room || p.material === product.material))
    .slice(0, 4);

  const handleAddToCart = () => {
    addToCart(product, quantity, activeVariant.name);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 2000);
  };

  const toggleAccordion = (key) => {
    setOpenAccordion((prev) => (prev === key ? null : key));
  };

  const nextImage = () => setSelectedImageIdx((prev) => (prev + 1) % images.length);
  const prevImage = () => setSelectedImageIdx((prev) => (prev - 1 + images.length) % images.length);

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-7xl px-5 py-10 sm:px-8 lg:px-12 lg:py-14">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="mb-8 flex items-center gap-2 text-xs text-stone-400">
          <Link to="/" className="hover:text-stone-900 transition-colors">
            Home
          </Link>
          <span>/</span>
          <Link to="/shop" className="hover:text-stone-900 transition-colors">
            Shop
          </Link>
          <span>/</span>
          <Link
            to={`/shop?room=${encodeURIComponent(product.room)}`}
            className="hover:text-stone-900 transition-colors"
          >
            {product.room}
          </Link>
          <span>/</span>
          <span className="truncate text-stone-700">{product.name}</span>
        </nav>

        {/* Main Product 2-Column Layout */}
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
          {/* Left: Interactive Image Gallery */}
          <div className="lg:col-span-7">
            <div className="group relative aspect-[4/5] w-full overflow-hidden rounded-2xl bg-[#FAF8F5]">
              <AnimatePresence mode="wait">
                <motion.img
                  key={activeImage}
                  src={activeImage}
                  alt={`${product.name} — view ${selectedImageIdx + 1}`}
                  initial={{ opacity: 0.35, scale: 1.02 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0.2 }}
                  transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                  className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                />
              </AnimatePresence>

              {product.badge && (
                <span className="absolute top-5 left-5 rounded-full bg-white/90 px-3.5 py-1.5 text-[10px] font-medium uppercase tracking-[0.2em] text-stone-800 backdrop-blur-sm">
                  {product.badge}
                </span>
              )}

              {images.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={prevImage}
                    aria-label="Previous product image"
                    className="absolute top-1/2 left-4 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-white/85 text-stone-800 opacity-0 shadow-sm backdrop-blur-sm transition-all duration-300 group-hover:opacity-100 hover:bg-white"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={nextImage}
                    aria-label="Next product image"
                    className="absolute top-1/2 right-4 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-white/85 text-stone-800 opacity-0 shadow-sm backdrop-blur-sm transition-all duration-300 group-hover:opacity-100 hover:bg-white"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </>
              )}
            </div>

            {/* Thumbnail Strip */}
            {images.length > 1 && (
              <div className="mt-4 grid grid-cols-3 gap-4 sm:grid-cols-4">
                {images.map((imgUrl, idx) => {
                  const isActive = idx === selectedImageIdx;
                  return (
                    <button
                      key={`${product.id}-thumb-${idx}`}
                      type="button"
                      onClick={() => setSelectedImageIdx(idx)}
                      aria-label={`Select image ${idx + 1}`}
                      className={`relative aspect-square overflow-hidden rounded-xl bg-[#FAF8F5] transition-all ${
                        isActive
                          ? 'ring-2 ring-stone-900 ring-offset-2'
                          : 'opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img
                        src={imgUrl}
                        alt={`${product.name} thumbnail ${idx + 1}`}
                        className="h-full w-full object-cover"
                      />
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Right: Details, Material Selector, Add to Cart & Accordions */}
          <div className="lg:col-span-5">
            <div className="lg:sticky lg:top-28">
              <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-[#7C8B74]">
                {product.room} · {product.category}
              </p>

              <h1 className="mt-2 font-serif text-3xl font-normal leading-tight text-stone-900 sm:text-4xl lg:text-[2.75rem]">
                {product.name}
              </h1>

              <p className="mt-1.5 text-sm text-stone-500">{product.subtitle}</p>

              <div className="mt-5 flex items-baseline gap-3 border-b border-stone-200/80 pb-6">
                <span className="font-serif text-3xl text-stone-900">
                  {formatCurrency(product.price)}
                </span>
                <span className="text-xs text-stone-400">Tax included where applicable</span>
              </div>

              <p className="mt-6 text-sm leading-relaxed text-stone-600">{product.description}</p>

              {/* Color / Material Selector */}
              {variants.length > 0 && (
                <div className="mt-8">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium uppercase tracking-[0.18em] text-stone-900">
                      Finish &amp; Material
                    </span>
                    <span className="text-xs text-stone-500">
                      {activeVariant.name} · {activeVariant.materialNote}
                    </span>
                  </div>

                  <div className="mt-3.5 flex flex-wrap items-center gap-3">
                    {variants.map((variant, idx) => {
                      const active = idx === selectedVariantIdx;
                      return (
                        <button
                          key={variant.name}
                          type="button"
                          onClick={() => setSelectedVariantIdx(idx)}
                          aria-label={`Select ${variant.name}`}
                          className={`group flex items-center gap-2.5 rounded-full border px-3.5 py-2 text-xs transition-all ${
                            active
                              ? 'border-stone-900 bg-[#FAF8F5] font-medium text-stone-900'
                              : 'border-stone-200 bg-white text-stone-600 hover:border-stone-400'
                          }`}
                        >
                          <span
                            style={{ backgroundColor: variant.hex }}
                            className="h-4 w-4 rounded-full border border-stone-300/90 shadow-inner"
                          />
                          <span>{variant.name}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Quantity & Add to Cart */}
              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
                <div className="inline-flex h-12 items-center justify-between rounded-full border border-stone-300 bg-white px-2 sm:w-32">
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    aria-label="Decrease quantity"
                    className="flex h-8 w-8 items-center justify-center rounded-full text-stone-600 transition-colors hover:bg-stone-100 hover:text-stone-900"
                  >
                    <Minus className="h-3.5 w-3.5" />
                  </button>
                  <span className="text-sm font-medium text-stone-900">{quantity}</span>
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => q + 1)}
                    aria-label="Increase quantity"
                    className="flex h-8 w-8 items-center justify-center rounded-full text-stone-600 transition-colors hover:bg-stone-100 hover:text-stone-900"
                  >
                    <Plus className="h-3.5 w-3.5" />
                  </button>
                </div>

                <button
                  type="button"
                  onClick={handleAddToCart}
                  className="flex h-12 flex-1 items-center justify-center gap-2 rounded-full bg-stone-900 px-8 text-xs font-medium uppercase tracking-[0.2em] text-white transition-all hover:bg-[#5F6F58]"
                >
                  {justAdded ? (
                    <>
                      <Check className="h-4 w-4" />
                      Added to Bag
                    </>
                  ) : (
                    <>Add to Cart — {formatCurrency(product.price * quantity)}</>
                  )}
                </button>
              </div>

              <button
                type="button"
                onClick={openCart}
                className="mt-3 w-full text-center text-xs uppercase tracking-[0.18em] text-stone-500 underline underline-offset-4 transition-colors hover:text-stone-900"
              >
                Open Shopping Bag
              </button>

              {/* Minimalist Trust Highlights */}
              <div className="mt-7 grid grid-cols-2 gap-3 rounded-xl bg-[#FAF8F5] p-4">
                <div className="flex items-center gap-2.5 text-xs text-stone-600">
                  <Truck className="h-4 w-4 shrink-0 text-[#A67B5B]" />
                  <span>Free shipping over $1,500</span>
                </div>
                <div className="flex items-center gap-2.5 text-xs text-stone-600">
                  <ShieldCheck className="h-4 w-4 shrink-0 text-[#5F6F58]" />
                  <span>5-year craft warranty</span>
                </div>
              </div>

              {/* Minimalist Accordions */}
              <div className="mt-8 border-t border-stone-200">
                <AccordionItem
                  title="Dimensions & Specifications"
                  isOpen={openAccordion === 'dimensions'}
                  onToggle={() => toggleAccordion('dimensions')}
                >
                  <dl className="space-y-2.5">
                    <div className="flex justify-between gap-4">
                      <dt className="text-stone-400">Overall Size</dt>
                      <dd className="text-right font-medium text-stone-800">
                        {product.dimensions}
                      </dd>
                    </div>
                    <div className="flex justify-between gap-4">
                      <dt className="text-stone-400">Weight</dt>
                      <dd className="text-right text-stone-800">{product.weight}</dd>
                    </div>
                    <div className="flex justify-between gap-4">
                      <dt className="text-stone-400">Primary Material</dt>
                      <dd className="text-right text-stone-800">{product.material}</dd>
                    </div>
                  </dl>
                </AccordionItem>

                <AccordionItem
                  title="Shipping & White-Glove Delivery"
                  isOpen={openAccordion === 'shipping'}
                  onToggle={() => toggleAccordion('shipping')}
                >
                  <p>{product.leadTime}</p>
                  <p className="mt-2 text-stone-500">
                    30-day home trial included. All packaging materials are 100% recyclable and
                    removed upon white-glove placement.
                  </p>
                </AccordionItem>

                <AccordionItem
                  title="Materials & Care"
                  isOpen={openAccordion === 'care'}
                  onToggle={() => toggleAccordion('care')}
                >
                  <p>{product.care}</p>
                </AccordionItem>
              </div>
            </div>
          </div>
        </div>

        {/* Related Pieces */}
        {relatedProducts.length > 0 && (
          <section className="mt-24 border-t border-stone-200/80 pt-16">
            <div className="flex items-end justify-between">
              <div>
                <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-[#7C8B74]">
                  Complete the Space
                </p>
                <h2 className="mt-2 font-serif text-3xl font-normal text-stone-900">
                  Complementary Pieces
                </h2>
              </div>
              <Link
                to="/shop"
                className="text-xs uppercase tracking-[0.18em] text-stone-500 hover:text-stone-900"
              >
                View All
              </Link>
            </div>

            <div className="mt-10 grid grid-cols-1 gap-x-7 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
              {relatedProducts.map((item, idx) => (
                <ProductCard key={item.id} product={item} index={idx} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
