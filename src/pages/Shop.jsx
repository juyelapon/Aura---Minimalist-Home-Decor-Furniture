import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, RotateCcw, SlidersHorizontal, X } from 'lucide-react';
import { products } from '../data/products';
import ProductCard from '../components/ProductCard';

const ROOMS = ['All', 'Living', 'Bedroom', 'Dining'];
const MATERIALS = ['All', 'Bouclé', 'Oak', 'Ceramic', 'Linen', 'Travertine', 'Brass'];
const SORT_OPTIONS = [
  { value: 'featured', label: 'Featured' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
];
const ITEMS_PER_PAGE = 6;

export default function Shop() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const selectedRoom = searchParams.get('room') || 'All';
  const selectedMaterial = searchParams.get('material') || 'All';
  const sortBy = searchParams.get('sort') || 'featured';
  const currentPageParam = parseInt(searchParams.get('page') || '1', 10);
  const currentPage = Number.isNaN(currentPageParam) || currentPageParam < 1 ? 1 : currentPageParam;

  const updateFilter = (key, value) => {
    const next = new URLSearchParams(searchParams);
    if (!value || value === 'All' || value === 'featured') {
      next.delete(key);
    } else {
      next.set(key, value);
    }
    if (key !== 'page') {
      next.delete('page');
    }
    setSearchParams(next);
  };

  const resetFilters = () => {
    setSearchParams({});
  };

  const filteredProducts = useMemo(() => {
    const base = products.filter((item) => {
      const roomMatch = selectedRoom === 'All' || item.room === selectedRoom;
      const materialMatch = selectedMaterial === 'All' || item.material === selectedMaterial;
      return roomMatch && materialMatch;
    });

    if (sortBy === 'price-asc') {
      return [...base].sort((a, b) => a.price - b.price);
    }
    if (sortBy === 'price-desc') {
      return [...base].sort((a, b) => b.price - a.price);
    }
    return base;
  }, [selectedRoom, selectedMaterial, sortBy]);

  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / ITEMS_PER_PAGE));
  const safePage = Math.min(currentPage, totalPages);

  useEffect(() => {
    if (currentPage > totalPages) {
      updateFilter('page', String(totalPages));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [totalPages, currentPage]);

  const paginatedProducts = useMemo(() => {
    const start = (safePage - 1) * ITEMS_PER_PAGE;
    return filteredProducts.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredProducts, safePage]);

  const handlePageChange = (pageNumber) => {
    updateFilter('page', pageNumber === 1 ? '' : String(pageNumber));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const hasActiveFilters = selectedRoom !== 'All' || selectedMaterial !== 'All' || sortBy !== 'featured';

  const startIndex = filteredProducts.length === 0 ? 0 : (safePage - 1) * ITEMS_PER_PAGE + 1;
  const endIndex = Math.min(safePage * ITEMS_PER_PAGE, filteredProducts.length);

  const FilterControls = () => (
    <div className="space-y-8">
      {/* Room Filter */}
      <div>
        <h3 className="text-[11px] font-medium uppercase tracking-[0.22em] text-stone-900">
          Room
        </h3>
        <div className="mt-4 flex flex-col space-y-2">
          {ROOMS.map((room) => {
            const active = selectedRoom === room;
            const count =
              room === 'All'
                ? products.length
                : products.filter((p) => p.room === room).length;
            return (
              <button
                key={room}
                type="button"
                onClick={() => updateFilter('room', room)}
                className={`flex items-center justify-between rounded-lg px-3 py-2 text-left text-sm transition-colors ${
                  active
                    ? 'bg-[#F3EDE4] font-medium text-stone-900'
                    : 'text-stone-500 hover:bg-stone-50 hover:text-stone-900'
                }`}
              >
                <span>{room === 'All' ? 'All Rooms' : room}</span>
                <span className="text-xs text-stone-400">{count}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Material Filter */}
      <div className="border-t border-stone-200/80 pt-7">
        <h3 className="text-[11px] font-medium uppercase tracking-[0.22em] text-stone-900">
          Material
        </h3>
        <div className="mt-4 flex flex-wrap gap-2">
          {MATERIALS.map((material) => {
            const active = selectedMaterial === material;
            return (
              <button
                key={material}
                type="button"
                onClick={() => updateFilter('material', material)}
                className={`rounded-full border px-3.5 py-1.5 text-xs transition-all ${
                  active
                    ? 'border-stone-900 bg-stone-900 text-white'
                    : 'border-stone-200 bg-white text-stone-600 hover:border-stone-400 hover:text-stone-900'
                }`}
              >
                {material}
              </button>
            );
          })}
        </div>
      </div>

      {/* Sort Filter */}
      <div className="border-t border-stone-200/80 pt-7">
        <h3 className="text-[11px] font-medium uppercase tracking-[0.22em] text-stone-900">
          Sort By
        </h3>
        <div className="mt-4 flex flex-col space-y-2">
          {SORT_OPTIONS.map((opt) => {
            const active = sortBy === opt.value;
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => updateFilter('sort', opt.value)}
                className={`flex items-center justify-between rounded-lg px-3 py-2 text-left text-sm transition-colors ${
                  active
                    ? 'bg-[#EEF2EC] font-medium text-[#5F6F58]'
                    : 'text-stone-500 hover:bg-stone-50 hover:text-stone-900'
                }`}
              >
                <span>{opt.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {hasActiveFilters && (
        <button
          type="button"
          onClick={resetFilters}
          className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-stone-300 px-4 py-2.5 text-xs uppercase tracking-[0.18em] text-stone-700 transition-colors hover:border-stone-900 hover:text-stone-900"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          Reset Filters
        </button>
      )}
    </div>
  );

  return (
    <div className="bg-white">
      {/* Editorial Shop Header */}
      <section className="border-b border-stone-200/70 bg-[#FAF8F5]/60">
        <div className="mx-auto max-w-7xl px-5 py-14 sm:px-8 lg:px-12 lg:py-16">
          <p className="text-[11px] font-medium uppercase tracking-[0.24em] text-[#7C8B74]">
            The Collection
          </p>
          <div className="mt-2 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <h1 className="font-serif text-4xl font-normal text-stone-900 sm:text-5xl">
              {selectedRoom === 'All' ? 'All Furniture & Objects' : `${selectedRoom} Collection`}
            </h1>
            <p className="text-xs uppercase tracking-[0.18em] text-stone-500">
              Showing {startIndex}–{endIndex} of {filteredProducts.length}{' '}
              {filteredProducts.length === 1 ? 'piece' : 'pieces'}
            </p>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-5 py-12 sm:px-8 lg:px-12 lg:py-16">
        {/* Mobile Filter Trigger */}
        <div className="mb-8 flex items-center justify-between lg:hidden">
          <button
            type="button"
            onClick={() => setMobileFiltersOpen((prev) => !prev)}
            className="inline-flex items-center gap-2 rounded-full border border-stone-300 px-5 py-2.5 text-xs uppercase tracking-[0.18em] text-stone-800"
          >
            <SlidersHorizontal className="h-3.5 w-3.5" />
            {mobileFiltersOpen ? 'Hide Filters' : 'Filters & Sort'}
          </button>

          {hasActiveFilters && (
            <button
              type="button"
              onClick={resetFilters}
              className="text-xs uppercase tracking-[0.16em] text-stone-500 underline underline-offset-4"
            >
              Clear All
            </button>
          )}
        </div>

        {/* Mobile Collapsible Filters */}
        <AnimatePresence>
          {mobileFiltersOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25 }}
              className="mb-10 overflow-hidden rounded-2xl border border-stone-200 bg-[#FAF8F5] p-6 lg:hidden"
            >
              <FilterControls />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main 2-Column Shop Layout */}
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
          {/* Sticky Desktop Left Sidebar */}
          <aside className="hidden lg:col-span-3 lg:block">
            <div className="sticky top-28 rounded-2xl border border-stone-200/70 bg-white p-6 shadow-[0_8px_30px_-18px_rgba(28,25,23,0.08)]">
              <FilterControls />
            </div>
          </aside>

          {/* Right Side Product Grid & Pagination */}
          <div className="lg:col-span-9">
            {/* Active Filter Chips */}
            {hasActiveFilters && (
              <div className="mb-8 flex flex-wrap items-center gap-2">
                {selectedRoom !== 'All' && (
                  <button
                    type="button"
                    onClick={() => updateFilter('room', 'All')}
                    className="inline-flex items-center gap-1.5 rounded-full bg-[#F3EDE4] px-3.5 py-1.5 text-xs text-stone-800 hover:bg-[#E8DFD5]"
                  >
                    Room: {selectedRoom}
                    <X className="h-3 w-3" />
                  </button>
                )}
                {selectedMaterial !== 'All' && (
                  <button
                    type="button"
                    onClick={() => updateFilter('material', 'All')}
                    className="inline-flex items-center gap-1.5 rounded-full bg-[#EEF2EC] px-3.5 py-1.5 text-xs text-[#5F6F58] hover:opacity-80"
                  >
                    Material: {selectedMaterial}
                    <X className="h-3 w-3" />
                  </button>
                )}
              </div>
            )}

            {paginatedProducts.length === 0 ? (
              <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-stone-200 bg-[#FAF8F5]/60 px-6 py-20 text-center">
                <h2 className="font-serif text-3xl text-stone-900">No matching pieces</h2>
                <p className="mt-2 max-w-md text-sm text-stone-500">
                  No pieces match your current room and material combination. Reset your filters to
                  browse the full Aura catalog.
                </p>
                <button
                  type="button"
                  onClick={resetFilters}
                  className="mt-6 inline-flex items-center gap-2 rounded-full bg-stone-900 px-6 py-3 text-xs uppercase tracking-[0.2em] text-white transition-colors hover:bg-stone-800"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  Reset Filters
                </button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 gap-x-7 gap-y-12 sm:grid-cols-2 xl:grid-cols-3">
                  {paginatedProducts.map((product, index) => (
                    <ProductCard key={product.id} product={product} index={index} />
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <nav
                    aria-label="Pagination"
                    className="mt-16 flex items-center justify-between border-t border-stone-200/80 pt-8"
                  >
                    <button
                      type="button"
                      disabled={safePage <= 1}
                      onClick={() => handlePageChange(safePage - 1)}
                      className="inline-flex items-center gap-2 rounded-full border border-stone-200 px-4 py-2 text-xs uppercase tracking-[0.18em] text-stone-700 transition-colors hover:border-stone-900 hover:text-stone-900 disabled:pointer-events-none disabled:opacity-35"
                    >
                      <ChevronLeft className="h-3.5 w-3.5" />
                      Prev
                    </button>

                    <div className="flex items-center gap-2">
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => {
                        const isActive = pageNum === safePage;
                        return (
                          <button
                            key={pageNum}
                            type="button"
                            onClick={() => handlePageChange(pageNum)}
                            aria-current={isActive ? 'page' : undefined}
                            className={`flex h-9 w-9 items-center justify-center rounded-full text-xs font-medium transition-all ${
                              isActive
                                ? 'bg-stone-900 text-white'
                                : 'text-stone-500 hover:bg-stone-100 hover:text-stone-900'
                            }`}
                          >
                            {pageNum}
                          </button>
                        );
                      })}
                    </div>

                    <button
                      type="button"
                      disabled={safePage >= totalPages}
                      onClick={() => handlePageChange(safePage + 1)}
                      className="inline-flex items-center gap-2 rounded-full border border-stone-200 px-4 py-2 text-xs uppercase tracking-[0.18em] text-stone-700 transition-colors hover:border-stone-900 hover:text-stone-900 disabled:pointer-events-none disabled:opacity-35"
                    >
                      Next
                      <ChevronRight className="h-3.5 w-3.5" />
                    </button>
                  </nav>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
