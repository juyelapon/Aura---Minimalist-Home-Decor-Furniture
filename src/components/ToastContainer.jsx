import { AnimatePresence, motion } from 'framer-motion';
import { Check, Info, X } from 'lucide-react';
import { useGlobal } from '../context/GlobalContext';

export default function ToastContainer() {
  const { toasts, dismissToast } = useGlobal();

  return (
    <div
      aria-live="polite"
      className="pointer-events-none fixed bottom-6 right-6 left-6 sm:left-auto z-[70] flex flex-col items-end gap-2.5"
    >
      <AnimatePresence mode="popLayout">
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            layout
            initial={{ opacity: 0, y: 18, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.96 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            className="pointer-events-auto flex w-full sm:w-auto sm:min-w-[300px] sm:max-w-sm items-center justify-between gap-3 rounded-xl border border-stone-200/90 bg-white/95 px-4 py-3.5 shadow-[0_12px_36px_-10px_rgba(28,25,23,0.14)] backdrop-blur-md"
          >
            <div className="flex items-center gap-3 min-w-0">
              <span
                className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${
                  toast.type === 'info'
                    ? 'bg-stone-100 text-stone-700'
                    : 'bg-[#EEF2EC] text-[#5F6F58]'
                }`}
              >
                {toast.type === 'info' ? <Info className="h-3.5 w-3.5" /> : <Check className="h-3.5 w-3.5" />}
              </span>
              <div className="min-w-0">
                <p className="text-xs font-medium tracking-wide text-stone-900">{toast.message}</p>
                {toast.detail && (
                  <p className="truncate text-xs text-stone-500 mt-0.5">{toast.detail}</p>
                )}
              </div>
            </div>

            <button
              type="button"
              onClick={() => dismissToast(toast.id)}
              aria-label="Dismiss notification"
              className="shrink-0 rounded-full p-1 text-stone-400 transition-colors hover:bg-stone-100 hover:text-stone-700"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
