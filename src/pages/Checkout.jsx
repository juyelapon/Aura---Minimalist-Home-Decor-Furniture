import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, CheckCircle2, Lock, ShoppingBag } from 'lucide-react';
import { useGlobal } from '../context/GlobalContext';
import { formatCurrency } from '../utils/format';

const initialFormState = {
  email: '',
  phone: '',
  firstName: '',
  lastName: '',
  address: '',
  apartment: '',
  city: '',
  postalCode: '',
  country: 'United States',
  cardName: '',
  cardNumber: '',
  expiry: '',
  cvc: '',
};

const unboxedInputClass =
  'w-full border-0 border-b border-stone-300 bg-transparent px-0 py-2.5 text-sm text-stone-900 placeholder:text-stone-400 transition-colors focus:border-stone-900 focus:outline-none rounded-none';

export default function Checkout() {
  const { cartItems, cartSubtotal, clearCart, showToast } = useGlobal();
  const [form, setForm] = useState(initialFormState);
  const [errors, setErrors] = useState({});
  const [deliveryMethod, setDeliveryMethod] = useState('standard');
  const [promoInput, setPromoInput] = useState('');
  const [appliedPromo, setAppliedPromo] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [completedOrder, setCompletedOrder] = useState(null);

  const shippingFee =
    deliveryMethod === 'express' ? 140 : cartSubtotal >= 1500 || cartSubtotal === 0 ? 0 : 85;
  const discountAmount = appliedPromo ? Math.round(cartSubtotal * 0.1) : 0;
  const taxableAmount = Math.max(0, cartSubtotal - discountAmount);
  const estimatedTax = Math.round(taxableAmount * 0.08);
  const orderTotal = taxableAmount + shippingFee + estimatedTax;

  const handleFieldChange = (field) => (e) => {
    let value = e.target.value;

    if (field === 'cardNumber') {
      const digits = value.replace(/\D/g, '').slice(0, 16);
      value = digits.replace(/(\d{4})(?=\d)/g, '$1 ');
    } else if (field === 'expiry') {
      const digits = value.replace(/\D/g, '').slice(0, 4);
      value = digits.length > 2 ? `${digits.slice(0, 2)}/${digits.slice(2)}` : digits;
    } else if (field === 'cvc') {
      value = value.replace(/\D/g, '').slice(0, 4);
    }

    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  const handleApplyPromo = (e) => {
    e.preventDefault();
    const code = promoInput.trim().toUpperCase();
    if (code === 'AURA10') {
      setAppliedPromo(true);
      showToast('Privilege Code Applied', '10% courtesy savings added to your order.');
    } else {
      showToast('Code Not Recognized', 'Try AURA10 for 10% courtesy savings.', 'info');
    }
  };

  const validateForm = () => {
    const nextErrors = {};
    if (!form.email.trim() || !form.email.includes('@')) nextErrors.email = 'Valid email required';
    if (!form.firstName.trim()) nextErrors.firstName = 'Required';
    if (!form.lastName.trim()) nextErrors.lastName = 'Required';
    if (!form.address.trim()) nextErrors.address = 'Street address required';
    if (!form.city.trim()) nextErrors.city = 'City required';
    if (!form.postalCode.trim()) nextErrors.postalCode = 'Postal code required';
    if (!form.cardName.trim()) nextErrors.cardName = 'Name on card required';
    if (form.cardNumber.replace(/\s/g, '').length < 13)
      nextErrors.cardNumber = 'Enter valid card number';
    if (!/^\d{2}\/\d{2}$/.test(form.expiry)) nextErrors.expiry = 'Use MM/YY';
    if (form.cvc.length < 3) nextErrors.cvc = '3–4 digits';

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) {
      showToast('Please review highlighted fields', 'Some shipping or payment details are incomplete.', 'info');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      const orderRef = `AUR-${Math.floor(100000 + Math.random() * 900000)}`;
      setCompletedOrder({
        reference: orderRef,
        email: form.email,
        name: `${form.firstName} ${form.lastName}`,
        address: `${form.address}${form.apartment ? `, ${form.apartment}` : ''}, ${form.city} ${form.postalCode}`,
        total: orderTotal,
        itemsCount: cartItems.reduce((sum, item) => sum + item.quantity, 0),
      });
      clearCart();
      setIsSubmitting(false);
      showToast('Order Confirmed', `Reference ${orderRef}`);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 800);
  };

  if (completedOrder) {
    return (
      <div className="bg-white">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="mx-auto max-w-2xl px-6 py-24 text-center"
        >
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#EEF2EC] text-[#5F6F58]">
            <CheckCircle2 className="h-8 w-8 stroke-[1.5]" />
          </div>
          <p className="mt-6 text-xs font-medium uppercase tracking-[0.24em] text-[#7C8B74]">
            Order Confirmed · {completedOrder.reference}
          </p>
          <h1 className="mt-3 font-serif text-4xl font-normal text-stone-900 sm:text-5xl">
            Thank you, {completedOrder.name}.
          </h1>
          <p className="mt-4 text-sm leading-relaxed text-stone-600">
            Your order of {completedOrder.itemsCount}{' '}
            {completedOrder.itemsCount === 1 ? 'piece' : 'pieces'} totaling{' '}
            <span className="font-medium text-stone-900">
              {formatCurrency(completedOrder.total)}
            </span>{' '}
            has been scheduled. Confirmation sent to{' '}
            <span className="text-stone-900">{completedOrder.email}</span>.
          </p>

          <div className="mt-10 rounded-2xl border border-stone-200/80 bg-[#FAF8F5] p-6 text-left text-sm">
            <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-stone-400">
              Delivery Destination
            </p>
            <p className="mt-2 text-stone-800">{completedOrder.address}</p>
          </div>

          <Link
            to="/shop"
            className="mt-10 inline-flex items-center gap-2 rounded-full bg-stone-900 px-8 py-3.5 text-xs font-medium uppercase tracking-[0.2em] text-white transition-colors hover:bg-[#5F6F58]"
          >
            Continue Exploring
          </Link>
        </motion.div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="mx-auto flex min-h-[60vh] max-w-2xl flex-col items-center justify-center px-6 py-24 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#FAF8F5] text-stone-400">
          <ShoppingBag className="h-7 w-7 stroke-[1.5]" />
        </div>
        <h1 className="mt-5 font-serif text-4xl text-stone-900">Your bag is currently empty</h1>
        <p className="mt-3 text-sm text-stone-500">
          Add furniture or home objects to your bag before proceeding to checkout.
        </p>
        <Link
          to="/shop"
          className="mt-8 inline-flex items-center gap-2 rounded-full bg-stone-900 px-8 py-3.5 text-xs uppercase tracking-[0.2em] text-white transition-colors hover:bg-stone-800"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Browse Collection
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-7xl px-5 py-12 sm:px-8 lg:px-12 lg:py-16">
        <div className="mb-10 flex items-center justify-between border-b border-stone-200/80 pb-6">
          <div>
            <p className="text-[11px] font-medium uppercase tracking-[0.24em] text-[#7C8B74]">
              Private Client Checkout
            </p>
            <h1 className="mt-2 font-serif text-3xl font-normal text-stone-900 sm:text-4xl">
              Shipping &amp; Payment
            </h1>
          </div>
          <Link
            to="/shop"
            className="hidden sm:inline-flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-stone-500 hover:text-stone-900"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Continue Shopping
          </Link>
        </div>

        {/* 2-Column Checkout Layout */}
        <div className="grid grid-cols-1 gap-14 lg:grid-cols-12">
          {/* Left Column: Clean Unboxed Input Fields */}
          <form onSubmit={handleSubmit} noValidate className="space-y-12 lg:col-span-7">
            {/* Contact */}
            <section>
              <h2 className="font-serif text-2xl font-normal text-stone-900">
                01. Contact Details
              </h2>
              <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <label className="block text-[11px] uppercase tracking-[0.18em] text-stone-500">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={handleFieldChange('email')}
                    placeholder="claire@studio.com"
                    className={unboxedInputClass}
                  />
                  {errors.email && (
                    <p className="mt-1.5 text-xs text-rose-600">{errors.email}</p>
                  )}
                </div>

                <div>
                  <label className="block text-[11px] uppercase tracking-[0.18em] text-stone-500">
                    Phone (For Delivery Coordination)
                  </label>
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={handleFieldChange('phone')}
                    placeholder="+1 (212) 555-0148"
                    className={unboxedInputClass}
                  />
                </div>
              </div>
            </section>

            {/* Shipping Address */}
            <section>
              <h2 className="font-serif text-2xl font-normal text-stone-900">
                02. Shipping Address
              </h2>
              <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <label className="block text-[11px] uppercase tracking-[0.18em] text-stone-500">
                    First Name *
                  </label>
                  <input
                    type="text"
                    value={form.firstName}
                    onChange={handleFieldChange('firstName')}
                    placeholder="Claire"
                    className={unboxedInputClass}
                  />
                  {errors.firstName && (
                    <p className="mt-1.5 text-xs text-rose-600">{errors.firstName}</p>
                  )}
                </div>

                <div>
                  <label className="block text-[11px] uppercase tracking-[0.18em] text-stone-500">
                    Last Name *
                  </label>
                  <input
                    type="text"
                    value={form.lastName}
                    onChange={handleFieldChange('lastName')}
                    placeholder="Vance"
                    className={unboxedInputClass}
                  />
                  {errors.lastName && (
                    <p className="mt-1.5 text-xs text-rose-600">{errors.lastName}</p>
                  )}
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-[11px] uppercase tracking-[0.18em] text-stone-500">
                    Street Address *
                  </label>
                  <input
                    type="text"
                    value={form.address}
                    onChange={handleFieldChange('address')}
                    placeholder="42 Mercer Street"
                    className={unboxedInputClass}
                  />
                  {errors.address && (
                    <p className="mt-1.5 text-xs text-rose-600">{errors.address}</p>
                  )}
                </div>

                <div>
                  <label className="block text-[11px] uppercase tracking-[0.18em] text-stone-500">
                    Apartment / Suite
                  </label>
                  <input
                    type="text"
                    value={form.apartment}
                    onChange={handleFieldChange('apartment')}
                    placeholder="Penthouse B"
                    className={unboxedInputClass}
                  />
                </div>

                <div>
                  <label className="block text-[11px] uppercase tracking-[0.18em] text-stone-500">
                    City *
                  </label>
                  <input
                    type="text"
                    value={form.city}
                    onChange={handleFieldChange('city')}
                    placeholder="New York"
                    className={unboxedInputClass}
                  />
                  {errors.city && (
                    <p className="mt-1.5 text-xs text-rose-600">{errors.city}</p>
                  )}
                </div>

                <div>
                  <label className="block text-[11px] uppercase tracking-[0.18em] text-stone-500">
                    Postal Code *
                  </label>
                  <input
                    type="text"
                    value={form.postalCode}
                    onChange={handleFieldChange('postalCode')}
                    placeholder="10013"
                    className={unboxedInputClass}
                  />
                  {errors.postalCode && (
                    <p className="mt-1.5 text-xs text-rose-600">{errors.postalCode}</p>
                  )}
                </div>

                <div>
                  <label className="block text-[11px] uppercase tracking-[0.18em] text-stone-500">
                    Country
                  </label>
                  <input
                    type="text"
                    value={form.country}
                    onChange={handleFieldChange('country')}
                    className={unboxedInputClass}
                  />
                </div>
              </div>
            </section>

            {/* Delivery Method */}
            <section>
              <h2 className="font-serif text-2xl font-normal text-stone-900">
                03. Delivery Service
              </h2>
              <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <button
                  type="button"
                  onClick={() => setDeliveryMethod('standard')}
                  className={`rounded-xl border p-4 text-left transition-all ${
                    deliveryMethod === 'standard'
                      ? 'border-stone-900 bg-[#FAF8F5]'
                      : 'border-stone-200 hover:border-stone-400'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium uppercase tracking-[0.16em] text-stone-900">
                      White-Glove Standard
                    </span>
                    <span className="text-xs font-medium text-[#5F6F58]">
                      {cartSubtotal >= 1500 ? 'Complimentary' : '$85'}
                    </span>
                  </div>
                  <p className="mt-1.5 text-xs text-stone-500">
                    5–8 business days · In-room placement
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => setDeliveryMethod('express')}
                  className={`rounded-xl border p-4 text-left transition-all ${
                    deliveryMethod === 'express'
                      ? 'border-stone-900 bg-[#FAF8F5]'
                      : 'border-stone-200 hover:border-stone-400'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium uppercase tracking-[0.16em] text-stone-900">
                      Priority Scheduled
                    </span>
                    <span className="text-xs font-medium text-stone-900">$140</span>
                  </div>
                  <p className="mt-1.5 text-xs text-stone-500">
                    2–4 business days · Dedicated time slot
                  </p>
                </button>
              </div>
            </section>

            {/* Payment */}
            <section>
              <div className="flex items-center justify-between">
                <h2 className="font-serif text-2xl font-normal text-stone-900">
                  04. Payment Method
                </h2>
                <span className="inline-flex items-center gap-1.5 text-xs text-stone-400">
                  <Lock className="h-3.5 w-3.5" />
                  Encrypted
                </span>
              </div>

              <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label className="block text-[11px] uppercase tracking-[0.18em] text-stone-500">
                    Cardholder Name *
                  </label>
                  <input
                    type="text"
                    value={form.cardName}
                    onChange={handleFieldChange('cardName')}
                    placeholder="Claire Vance"
                    className={unboxedInputClass}
                  />
                  {errors.cardName && (
                    <p className="mt-1.5 text-xs text-rose-600">{errors.cardName}</p>
                  )}
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-[11px] uppercase tracking-[0.18em] text-stone-500">
                    Card Number *
                  </label>
                  <input
                    type="text"
                    inputMode="numeric"
                    value={form.cardNumber}
                    onChange={handleFieldChange('cardNumber')}
                    placeholder="4242 4242 4242 4242"
                    className={unboxedInputClass}
                  />
                  {errors.cardNumber && (
                    <p className="mt-1.5 text-xs text-rose-600">{errors.cardNumber}</p>
                  )}
                </div>

                <div>
                  <label className="block text-[11px] uppercase tracking-[0.18em] text-stone-500">
                    Expiration (MM/YY) *
                  </label>
                  <input
                    type="text"
                    inputMode="numeric"
                    value={form.expiry}
                    onChange={handleFieldChange('expiry')}
                    placeholder="08/29"
                    className={unboxedInputClass}
                  />
                  {errors.expiry && (
                    <p className="mt-1.5 text-xs text-rose-600">{errors.expiry}</p>
                  )}
                </div>

                <div>
                  <label className="block text-[11px] uppercase tracking-[0.18em] text-stone-500">
                    Security Code *
                  </label>
                  <input
                    type="text"
                    inputMode="numeric"
                    value={form.cvc}
                    onChange={handleFieldChange('cvc')}
                    placeholder="842"
                    className={unboxedInputClass}
                  />
                  {errors.cvc && (
                    <p className="mt-1.5 text-xs text-rose-600">{errors.cvc}</p>
                  )}
                </div>
              </div>
            </section>

            <button
              type="submit"
              disabled={isSubmitting}
              className="flex h-13 w-full items-center justify-center rounded-full bg-stone-900 px-8 text-xs font-medium uppercase tracking-[0.22em] text-white transition-all hover:bg-[#5F6F58] disabled:opacity-60"
            >
              {isSubmitting
                ? 'Confirming Reservation...'
                : `Complete Order — ${formatCurrency(orderTotal)}`}
            </button>
          </form>

          {/* Right Column: Minimalist Order Summary */}
          <aside className="lg:col-span-5">
            <div className="lg:sticky lg:top-28 rounded-2xl border border-stone-200/80 bg-[#FAF8F5] p-6 sm:p-8">
              <h2 className="font-serif text-2xl font-normal text-stone-900">Order Summary</h2>

              <ul className="mt-6 divide-y divide-stone-200/80">
                {cartItems.map((item) => (
                  <li key={item.key} className="flex items-center gap-4 py-4 first:pt-0">
                    <div className="relative h-18 w-16 shrink-0 overflow-hidden rounded-lg bg-white">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-serif text-lg text-stone-900">{item.name}</p>
                      <p className="text-xs text-stone-500">
                        {item.variant} · Qty {item.quantity}
                      </p>
                    </div>
                    <span className="shrink-0 text-sm font-medium text-stone-900">
                      {formatCurrency(item.price * item.quantity)}
                    </span>
                  </li>
                ))}
              </ul>

              {/* Promo Code */}
              <form onSubmit={handleApplyPromo} className="mt-6 border-t border-stone-200/80 pt-5">
                <label className="block text-[11px] uppercase tracking-[0.18em] text-stone-500">
                  Privilege Code (Hint: AURA10)
                </label>
                <div className="mt-2 flex items-center gap-3">
                  <input
                    type="text"
                    value={promoInput}
                    onChange={(e) => setPromoInput(e.target.value)}
                    placeholder="Enter code"
                    disabled={appliedPromo}
                    className={unboxedInputClass}
                  />
                  <button
                    type="submit"
                    disabled={appliedPromo}
                    className="shrink-0 rounded-full border border-stone-300 bg-white px-4 py-2 text-[11px] uppercase tracking-[0.18em] text-stone-800 transition-colors hover:border-stone-900 disabled:opacity-50"
                  >
                    {appliedPromo ? 'Applied' : 'Apply'}
                  </button>
                </div>
              </form>

              {/* Totals Breakdown */}
              <dl className="mt-6 space-y-3 border-t border-stone-200/80 pt-5 text-sm">
                <div className="flex justify-between text-stone-600">
                  <dt>Subtotal</dt>
                  <dd>{formatCurrency(cartSubtotal)}</dd>
                </div>
                {appliedPromo && (
                  <div className="flex justify-between text-[#5F6F58]">
                    <dt>Privilege (AURA10 — 10%)</dt>
                    <dd>-{formatCurrency(discountAmount)}</dd>
                  </div>
                )}
                <div className="flex justify-between text-stone-600">
                  <dt>Delivery</dt>
                  <dd>{shippingFee === 0 ? 'Complimentary' : formatCurrency(shippingFee)}</dd>
                </div>
                <div className="flex justify-between text-stone-600">
                  <dt>Estimated Tax (8%)</dt>
                  <dd>{formatCurrency(estimatedTax)}</dd>
                </div>
                <div className="flex items-baseline justify-between border-t border-stone-200 pt-4">
                  <dt className="text-xs font-medium uppercase tracking-[0.2em] text-stone-900">
                    Total
                  </dt>
                  <dd className="font-serif text-3xl text-stone-900">
                    {formatCurrency(orderTotal)}
                  </dd>
                </div>
              </dl>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
