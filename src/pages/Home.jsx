import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, ArrowUpRight, Sparkles } from 'lucide-react';
import {
  curatedCollections,
  heroSlides,
  products,
  roomInspirations,
} from '../data/products';
import ProductCard from '../components/ProductCard';

const SLIDE_INTERVAL_MS = 5500;

export default function Home() {
  const [activeSlide, setActiveSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused) return undefined;
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % heroSlides.length);
    }, SLIDE_INTERVAL_MS);
    return () => clearInterval(timer);
  }, [isPaused]);

  const nextSlide = () => setActiveSlide((prev) => (prev + 1) % heroSlides.length);
  const prevSlide = () =>
    setActiveSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);

  const currentHero = heroSlides[activeSlide];
  const featuredProducts = products.filter((p) => p.featured).slice(0, 4);

  return (
    <div className="bg-white">
      {/* 1. Immersive Auto-Playing Hero Slider */}
      <section
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        aria-label="Featured Collections Slider"
        className="relative h-[78vh] min-h-[540px] max-h-[820px] w-full overflow-hidden bg-stone-900"
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={currentHero.id}
            initial={{ opacity: 0, scale: 1.04 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-0"
          >
            <img
              src={currentHero.image}
              alt={currentHero.title}
              className="h-full w-full object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-stone-950/65 via-stone-950/25 to-stone-950/20" />
          </motion.div>
        </AnimatePresence>

        {/* Editorial Typography Overlay */}
        <div className="relative z-10 mx-auto flex h-full max-w-7xl flex-col justify-end px-5 pb-14 sm:px-8 sm:pb-20 lg:px-12">
          <AnimatePresence mode="wait">
            <motion.div
              key={`${currentHero.id}-text`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
              className="max-w-2xl"
            >
              <span className="inline-block text-[11px] font-medium uppercase tracking-[0.26em] text-[#E8DFD5]">
                {currentHero.eyebrow}
              </span>
              <h1 className="mt-3 font-serif text-4xl font-normal leading-[1.08] tracking-tight text-white sm:text-6xl lg:text-7xl">
                {currentHero.title}
              </h1>
              <p className="mt-5 max-w-lg text-sm leading-relaxed text-stone-200 sm:text-base">
                {currentHero.subtitle}
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-4">
                <Link
                  to={currentHero.ctaLink}
                  className="inline-flex items-center gap-2.5 rounded-full bg-white px-7 py-3.5 text-xs font-medium uppercase tracking-[0.2em] text-stone-900 transition-all hover:bg-[#E8DFD5]"
                >
                  {currentHero.ctaLabel}
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  to="/shop"
                  className="inline-flex items-center gap-2 rounded-full border border-white/40 bg-white/10 px-6 py-3.5 text-xs uppercase tracking-[0.2em] text-white backdrop-blur-sm transition-colors hover:bg-white/20"
                >
                  View Catalog
                </Link>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Slider Controls */}
          <div className="mt-10 flex items-center justify-between border-t border-white/20 pt-5">
            <div className="flex items-center gap-3">
              {heroSlides.map((slide, idx) => (
                <button
                  key={slide.id}
                  type="button"
                  onClick={() => setActiveSlide(idx)}
                  aria-label={`Go to slide ${idx + 1}: ${slide.title}`}
                  className="group flex items-center gap-2 py-1"
                >
                  <span
                    className={`block h-[2px] transition-all duration-500 ${
                      idx === activeSlide
                        ? 'w-10 bg-white'
                        : 'w-5 bg-white/40 group-hover:bg-white/75'
                    }`}
                  />
                </button>
              ))}
              <span className="ml-2 text-[11px] tracking-[0.2em] text-white/75">
                0{activeSlide + 1} / 0{heroSlides.length}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={prevSlide}
                aria-label="Previous slide"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/30 bg-white/10 text-white backdrop-blur-sm transition-colors hover:bg-white hover:text-stone-900"
              >
                <ArrowLeft className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={nextSlide}
                aria-label="Next slide"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/30 bg-white/10 text-white backdrop-blur-sm transition-colors hover:bg-white hover:text-stone-900"
              >
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Curated Collections */}
      <section className="mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:px-12 lg:py-28">
        <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
          <div>
            <p className="text-[11px] font-medium uppercase tracking-[0.24em] text-[#7C8B74]">
              Material Studies
            </p>
            <h2 className="mt-2 font-serif text-3xl font-normal text-stone-900 sm:text-5xl">
              Curated Collections
            </h2>
          </div>
          <Link
            to="/shop"
            className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-stone-600 transition-colors hover:text-stone-900"
          >
            Browse All 12 Pieces
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-3">
          {curatedCollections.map((collection, idx) => (
            <motion.div
              key={collection.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.55, delay: idx * 0.1 }}
            >
              <Link to={collection.link} className="group block">
                <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-[#FAF8F5]">
                  <img
                    src={collection.image}
                    alt={collection.title}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-stone-950/35 via-transparent to-transparent opacity-80 transition-opacity group-hover:opacity-100" />
                  <span className="absolute top-4 left-4 rounded-full bg-white/90 px-3.5 py-1 text-[10px] font-medium uppercase tracking-[0.18em] text-stone-800 backdrop-blur-sm">
                    {collection.count}
                  </span>
                </div>

                <div className="mt-5 flex items-start justify-between gap-4">
                  <div>
                    <h3 className="font-serif text-2xl text-stone-900 transition-colors group-hover:text-[#A67B5B]">
                      {collection.title}
                    </h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-stone-500">
                      {collection.subtitle}
                    </p>
                  </div>
                  <span className="mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-stone-200 text-stone-600 transition-all group-hover:border-stone-900 group-hover:bg-stone-900 group-hover:text-white">
                    <ArrowUpRight className="h-4 w-4" />
                  </span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 3. Featured Objects Preview */}
      <section className="border-y border-stone-200/70 bg-[#FAF8F5]/70 py-20 lg:py-24">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="text-[11px] font-medium uppercase tracking-[0.24em] text-[#A67B5B]">
                Atelier Highlights
              </p>
              <h2 className="mt-2 font-serif text-3xl font-normal text-stone-900 sm:text-4xl">
                Signature Silhouettes
              </h2>
            </div>
            <Link
              to="/shop"
              className="inline-flex items-center gap-2 rounded-full border border-stone-300 bg-white px-5 py-2.5 text-xs uppercase tracking-[0.18em] text-stone-800 transition-colors hover:border-stone-900 hover:bg-stone-900 hover:text-white"
            >
              Shop Collection
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-x-7 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
            {featuredProducts.map((product, index) => (
              <ProductCard key={product.id} product={product} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* 4. Room Inspirations Masonry Grid */}
      <section className="mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:px-12 lg:py-28">
        <div className="mx-auto max-w-2xl text-center">
          <span className="inline-flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-[0.24em] text-[#7C8B74]">
            <Sparkles className="h-3.5 w-3.5" />
            Spatial Storytelling
          </span>
          <h2 className="mt-3 font-serif text-3xl font-normal text-stone-900 sm:text-5xl">
            Room Inspirations
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-stone-500 sm:text-base">
            Explore how Aura pieces converse with natural daylight, plaster walls, and quiet
            architectural interiors.
          </p>
        </div>

        {/* True Editorial Masonry Layout */}
        <div className="mt-14 columns-1 gap-6 space-y-6 sm:columns-2 lg:columns-3">
          {roomInspirations.map((item, idx) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.5, delay: (idx % 3) * 0.08 }}
              className="break-inside-avoid"
            >
              <Link
                to={item.link}
                className="group relative block overflow-hidden rounded-2xl bg-[#FAF8F5] shadow-[0_8px_30px_-14px_rgba(28,25,23,0.12)]"
              >
                <div className={`${item.aspect} w-full overflow-hidden`}>
                  <img
                    src={item.image}
                    alt={item.title}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                </div>

                <div className="absolute inset-0 bg-gradient-to-t from-stone-950/70 via-stone-950/15 to-transparent opacity-85 transition-opacity duration-300 group-hover:opacity-100" />

                <div className="absolute inset-x-0 bottom-0 p-6 text-white">
                  <span className="inline-block rounded-full bg-white/20 px-3 py-1 text-[10px] uppercase tracking-[0.2em] backdrop-blur-md">
                    {item.room}
                  </span>
                  <h3 className="mt-2.5 font-serif text-2xl font-normal leading-snug">
                    {item.title}
                  </h3>
                  <p className="mt-1 text-xs text-stone-200/90">{item.caption}</p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 5. Editorial Ethos Banner */}
      <section className="mx-auto max-w-7xl px-5 pb-20 sm:px-8 lg:px-12 lg:pb-24">
        <div className="grid grid-cols-1 items-center gap-10 rounded-3xl bg-[#F3EDE4]/65 p-8 sm:p-12 lg:grid-cols-12 lg:p-16">
          <div className="lg:col-span-7">
            <p className="text-[11px] font-medium uppercase tracking-[0.24em] text-[#8C6239]">
              The Aura Standard
            </p>
            <h2 className="mt-3 font-serif text-3xl font-normal leading-tight text-stone-900 sm:text-4xl">
              Designed to age with quiet dignity, delivered straight to your room.
            </h2>
            <p className="mt-4 max-w-xl text-sm leading-relaxed text-stone-600">
              Every piece is crafted in small batches with FSC-certified European timber, Belgian
              flax textiles, and zero-VOC finishes. Complimentary white-glove delivery and
              in-room placement on orders over $1,500.
            </p>
          </div>
          <div className="flex flex-wrap gap-4 lg:col-span-5 lg:justify-end">
            <Link
              to="/shop"
              className="inline-flex items-center gap-2 rounded-full bg-stone-900 px-7 py-3.5 text-xs font-medium uppercase tracking-[0.2em] text-white transition-colors hover:bg-[#5F6F58]"
            >
              Shop Full Collection
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
