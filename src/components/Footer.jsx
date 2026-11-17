import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useGlobal } from '../context/GlobalContext';

const CURRENT_YEAR = new Date().getFullYear();

export default function Footer() {
  const [email, setEmail] = useState('');
  const { showToast } = useGlobal();

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email.trim() || !email.includes('@')) {
      showToast('Please enter a valid email', 'So we can send your seasonal lookbook.', 'info');
      return;
    }
    showToast('Welcome to Aura Journal', 'Seasonal collection notes will arrive shortly.');
    setEmail('');
  };

  return (
    <footer className="border-t border-stone-200/80 bg-[#FAF8F5] text-stone-800">
      <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:px-12 lg:py-20">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
          {/* Brand Editorial Column */}
          <div className="lg:col-span-4 space-y-5">
            <Link
              to="/"
              className="inline-block font-serif text-3xl tracking-[0.28em] text-stone-900"
            >
              AURA
            </Link>
            <p className="max-w-sm text-sm leading-relaxed text-stone-500">
              Architectural furniture and tactile home objects crafted from Belgian bouclé, solid
              European oak, honed travertine, and raw stoneware.
            </p>
            <p className="text-[11px] uppercase tracking-[0.2em] text-[#7C8B74] font-medium">
              Copenhagen · New York · Kyoto
            </p>
          </div>

          {/* Navigation Columns */}
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:col-span-5">
            <div>
              <h3 className="text-[11px] font-medium uppercase tracking-[0.22em] text-stone-900">
                Rooms
              </h3>
              <ul className="mt-4 space-y-2.5 text-sm text-stone-500">
                <li>
                  <Link to="/shop" className="hover:text-stone-900 transition-colors">
                    All Pieces
                  </Link>
                </li>
                <li>
                  <Link to="/shop?room=Living" className="hover:text-stone-900 transition-colors">
                    Living Room
                  </Link>
                </li>
                <li>
                  <Link to="/shop?room=Bedroom" className="hover:text-stone-900 transition-colors">
                    Bedroom Sanctuary
                  </Link>
                </li>
                <li>
                  <Link to="/shop?room=Dining" className="hover:text-stone-900 transition-colors">
                    Dining Space
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-[11px] font-medium uppercase tracking-[0.22em] text-stone-900">
                Materials
              </h3>
              <ul className="mt-4 space-y-2.5 text-sm text-stone-500">
                <li>
                  <Link
                    to="/shop?material=Boucl%C3%A9"
                    className="hover:text-stone-900 transition-colors"
                  >
                    Belgian Bouclé
                  </Link>
                </li>
                <li>
                  <Link to="/shop?material=Oak" className="hover:text-stone-900 transition-colors">
                    White European Oak
                  </Link>
                </li>
                <li>
                  <Link
                    to="/shop?material=Ceramic"
                    className="hover:text-stone-900 transition-colors"
                  >
                    Raw Stoneware
                  </Link>
                </li>
                <li>
                  <Link
                    to="/shop?material=Travertine"
                    className="hover:text-stone-900 transition-colors"
                  >
                    Tivoli Travertine
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-[11px] font-medium uppercase tracking-[0.22em] text-stone-900">
                Client Care
              </h3>
              <ul className="mt-4 space-y-2.5 text-sm text-stone-500">
                <li>
                  <Link to="/checkout" className="hover:text-stone-900 transition-colors">
                    Shipping &amp; Bag
                  </Link>
                </li>
                <li>
                  <Link to="/shop" className="hover:text-stone-900 transition-colors">
                    Material Swatches
                  </Link>
                </li>
                <li>
                  <span className="text-stone-400">White-Glove Delivery</span>
                </li>
                <li>
                  <span className="text-stone-400">5-Year Craft Warranty</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Newsletter */}
          <div className="lg:col-span-3">
            <h3 className="text-[11px] font-medium uppercase tracking-[0.22em] text-stone-900">
              The Aura Journal
            </h3>
            <p className="mt-4 text-sm leading-relaxed text-stone-500">
              Receive private invitations to seasonal releases and architectural home stories.
            </p>
            <form onSubmit={handleSubscribe} className="mt-5">
              <div className="flex items-center border-b border-stone-300 pb-2 focus-within:border-stone-900 transition-colors">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email address"
                  aria-label="Email address for Aura Journal"
                  className="w-full bg-transparent text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none"
                />
                <button
                  type="submit"
                  aria-label="Subscribe to Aura Journal"
                  className="ml-2 p-1 text-stone-700 transition-transform hover:translate-x-0.5 hover:text-stone-900"
                >
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </form>
          </div>
        </div>

        <div className="mt-14 flex flex-col items-start justify-between gap-4 border-t border-stone-200/80 pt-8 text-xs text-stone-400 sm:flex-row sm:items-center">
          <p>&copy; {CURRENT_YEAR} AURA Studio Inc. All rights reserved.</p>
          <p className="tracking-wide">Crafted for calm, tactile living.</p>
        </div>
      </div>
    </footer>
  );
}
