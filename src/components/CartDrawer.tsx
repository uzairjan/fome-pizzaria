import React, { useState } from 'react';
import { X, Trash2, Plus, Minus, MessageCircle, Truck, ShoppingBag, CheckCircle2 } from 'lucide-react';
import type { CartItem, Language, OrderDetails, Theme } from '../types/restaurant.ts';
import {
  calculateSubtotal,
  calculateDeliveryFee,
  calculateAmountForFreeDelivery,
  calculateTotal,
  formatCurrency,
  getWhatsAppUrl,
  FREE_DELIVERY_THRESHOLD,
} from '../utils/cart.ts';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (cartId: string, delta: number) => void;
  onRemoveItem: (cartId: string) => void;
  onClearCart: () => void;
  language: Language;
  theme: Theme;
  onConfirmOrder: (orderDetails: OrderDetails) => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  language,
  theme,
  onConfirmOrder,
}) => {
  const isPt = language === 'pt';

  const [deliveryType, setDeliveryType] = useState<'delivery' | 'takeaway'>('delivery');
  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [notes, setNotes] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'dinheiro' | 'multibanco' | 'mbway'>('mbway');
  const [formError, setFormError] = useState('');

  if (!isOpen) return null;

  const subtotal = calculateSubtotal(items);
  const deliveryFee = calculateDeliveryFee(subtotal, deliveryType);
  const total = calculateTotal(subtotal, deliveryFee);
  const amountForFree = calculateAmountForFreeDelivery(subtotal);

  const orderDetails: OrderDetails = {
    customerName: customerName.trim(),
    phone: phone.trim(),
    deliveryType,
    address: address.trim(),
    notes: notes.trim(),
    paymentMethod,
  };

  const validateForm = () => {
    if (!customerName.trim()) {
      setFormError(isPt ? 'Por favor indique o seu nome.' : 'Please enter your name.');
      return false;
    }
    if (!phone.trim()) {
      setFormError(isPt ? 'Por favor indique o seu contacto telefónico.' : 'Please enter your phone number.');
      return false;
    }
    if (deliveryType === 'delivery' && !address.trim()) {
      setFormError(isPt ? 'Por favor indique a morada para entrega.' : 'Please enter your delivery address.');
      return false;
    }
    setFormError('');
    return true;
  };

  const handleWhatsAppClick = () => {
    if (!validateForm()) return;
    const url = getWhatsAppUrl(items, orderDetails, language);
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleDirectCheckout = () => {
    if (!validateForm()) return;
    onConfirmOrder(orderDetails);
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-xs">
      <div
        className={`w-full max-w-md h-full flex flex-col shadow-2xl transition-all duration-300 ${
          theme === 'dark'
            ? 'bg-[#20090e] border-l border-[#45141c] text-[#fffdf9]'
            : 'bg-[#fffdf9] border-l border-[#ebe4d5] text-[#211b1b]'
        }`}
      >
        {/* Drawer Header */}
        <div
          className={`p-4 border-b flex items-center justify-between ${
            theme === 'dark' ? 'border-[#45141c] bg-[#290d13]' : 'border-[#ebe4d5] bg-[#f7f3e9]'
          }`}
        >
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-amber-500" />
            <h2 className="font-bold font-display text-lg">
              {isPt ? 'O Seu Pedido' : 'Your Order'}
            </h2>
            <span className="text-xs font-price px-2 py-0.5 rounded-full bg-[#5a101a] text-white">
              {items.length} {items.length === 1 ? (isPt ? 'item' : 'item') : (isPt ? 'itens' : 'items')}
            </span>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label={isPt ? 'Fechar carrinho' : 'Close cart'}
            className="p-1.5 rounded-lg hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Free Delivery Bar */}
        <div
          className={`px-4 py-2.5 border-b text-xs flex items-center gap-2 ${
            deliveryType === 'takeaway'
              ? theme === 'dark' ? 'bg-[#290d13] text-[#d6c4c2] border-[#45141c]' : 'bg-[#f7f3e9] text-[#6b5e59] border-[#ebe4d5]'
              : amountForFree === 0
              ? 'bg-emerald-900/30 text-emerald-300 border-emerald-800'
              : theme === 'dark' ? 'bg-[#3b1219] text-amber-200 border-[#551823]' : 'bg-amber-50 text-amber-900 border-amber-200'
          }`}
        >
          <Truck className="w-4 h-4 shrink-0 text-amber-500" />
          {deliveryType === 'takeaway' ? (
            <span>{isPt ? 'Levantamento no restaurante — Sem taxa de entrega.' : 'Restaurant pickup — No delivery fee.'}</span>
          ) : amountForFree === 0 ? (
            <span className="font-semibold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              {isPt ? 'Parabéns! A sua entrega é GRÁTIS!' : 'Congratulations! Your delivery is FREE!'}
            </span>
          ) : (
            <span>
              {isPt ? 'Faltam apenas ' : 'Only '}
              <strong className="font-price text-amber-600 dark:text-amber-400">
                {formatCurrency(amountForFree, language)}
              </strong>
              {isPt ? ' para ter Entrega Grátis (mín. 12€)!' : ' more for Free Delivery (min €12)!'}
            </span>
          )}
        </div>

        {/* Items List or Empty State */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-3 text-[#887272]">
              <ShoppingBag className="w-12 h-12 stroke-[1.5] text-amber-500/50" />
              <p className="font-bold text-base font-display text-[#211b1b] dark:text-[#fffdf9]">
                {isPt ? 'O seu carrinho está vazio' : 'Your cart is empty'}
              </p>
              <p className="text-xs">
                {isPt
                  ? 'Escolha pratos da ementa ou os nossos combos de família para começar.'
                  : 'Add dishes from our menu or family combos to get started.'}
              </p>
            </div>
          ) : (
            items.map((item) => (
              <div
                key={item.cartId}
                className={`p-3 rounded-xl border flex items-start justify-between gap-3 ${
                  theme === 'dark' ? 'bg-[#290d13] border-[#45141c]' : 'bg-white border-[#ebe4d5]'
                }`}
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-[#5a101a] text-white flex items-center justify-center font-bold text-[10px] font-price">
                      {item.number}
                    </span>
                    <h3 className="font-bold text-xs sm:text-sm truncate">
                      {isPt ? item.namePt : item.nameEn}
                    </h3>
                  </div>
                  <p className="text-[11px] text-[#887272] dark:text-[#d6c4c2] mt-0.5">
                    {isPt ? item.sizeLabelPt : item.sizeLabelEn}
                    {item.selectedSauce && ` • ${item.selectedSauce}`}
                  </p>
                  {item.selectedSides && item.selectedSides.length > 0 && (
                    <p className="text-[10px] text-amber-600 dark:text-amber-400">
                      + {item.selectedSides.join(', ')}
                    </p>
                  )}
                  {item.selectedDrinks && item.selectedDrinks.length > 0 && (
                    <p className="text-[10px] text-amber-600 dark:text-amber-400">
                      + {item.selectedDrinks.join(', ')}
                    </p>
                  )}

                  <p className="font-bold font-price text-xs text-[#5a101a] dark:text-amber-400 mt-1">
                    {formatCurrency(item.unitPrice * item.quantity, language)}
                  </p>
                </div>

                {/* Quantity Controls & Delete */}
                <div className="flex flex-col items-end gap-1.5 shrink-0">
                  <button
                    type="button"
                    onClick={() => onRemoveItem(item.cartId)}
                    className="text-stone-400 hover:text-red-500 p-1 transition-colors"
                    aria-label={isPt ? 'Remover item' : 'Remove item'}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>

                  <div className="flex items-center gap-1.5 border border-stone-300 dark:border-stone-700 rounded-md p-0.5">
                    <button
                      type="button"
                      onClick={() => onUpdateQuantity(item.cartId, -1)}
                      className="w-5 h-5 flex items-center justify-center hover:bg-stone-200 dark:hover:bg-stone-800 rounded"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="w-4 text-center font-bold font-price text-xs">
                      {item.quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => onUpdateQuantity(item.cartId, 1)}
                      className="w-5 h-5 flex items-center justify-center hover:bg-stone-200 dark:hover:bg-stone-800 rounded"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}

          {/* Customer Details Form if cart has items */}
          {items.length > 0 && (
            <div
              className={`p-3.5 rounded-xl border space-y-3 mt-4 ${
                theme === 'dark' ? 'bg-[#290d13] border-[#45141c]' : 'bg-[#fcf7ef] border-[#ebe4d5]'
              }`}
            >
              <h3 className="text-xs font-bold font-price uppercase tracking-wider text-[#5a101a] dark:text-amber-400">
                {isPt ? 'Dados para Entrega / Levantamento' : 'Delivery / Pickup Details'}
              </h3>

              {/* Delivery vs Takeaway Tab */}
              <div className="grid grid-cols-2 gap-1 p-1 rounded-lg bg-stone-200/60 dark:bg-stone-800/80 text-xs font-semibold">
                <button
                  type="button"
                  onClick={() => setDeliveryType('delivery')}
                  className={`py-1.5 rounded-md transition-all ${
                    deliveryType === 'delivery'
                      ? 'bg-[#5a101a] text-white shadow-xs font-bold'
                      : 'text-[#554242] dark:text-[#d6c4c2]'
                  }`}
                >
                  {isPt ? 'Entrega ao Domicílio' : 'Home Delivery'}
                </button>
                <button
                  type="button"
                  onClick={() => setDeliveryType('takeaway')}
                  className={`py-1.5 rounded-md transition-all ${
                    deliveryType === 'takeaway'
                      ? 'bg-[#5a101a] text-white shadow-xs font-bold'
                      : 'text-[#554242] dark:text-[#d6c4c2]'
                  }`}
                >
                  {isPt ? 'Takeaway (Restaurante)' : 'Takeaway (Pickup)'}
                </button>
              </div>

              {/* Name & Phone */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <label className="text-[11px] font-medium block mb-1">
                    {isPt ? 'Nome *' : 'Name *'}
                  </label>
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder={isPt ? 'O seu nome' : 'Your name'}
                    className={`w-full px-2.5 py-1.5 rounded-lg border text-xs outline-none ${
                      theme === 'dark' ? 'bg-[#1a060a] border-[#45141c] text-white' : 'bg-white border-[#ebe4d5]'
                    }`}
                  />
                </div>
                <div>
                  <label className="text-[11px] font-medium block mb-1">
                    {isPt ? 'Telefone *' : 'Phone *'}
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="912 345 678"
                    className={`w-full px-2.5 py-1.5 rounded-lg border text-xs outline-none ${
                      theme === 'dark' ? 'bg-[#1a060a] border-[#45141c] text-white' : 'bg-white border-[#ebe4d5]'
                    }`}
                  />
                </div>
              </div>

              {/* Address (only if delivery) */}
              {deliveryType === 'delivery' && (
                <div className="text-xs">
                  <label className="text-[11px] font-medium block mb-1">
                    {isPt ? 'Morada de Entrega *' : 'Delivery Address *'}
                  </label>
                  <input
                    type="text"
                    required
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder={isPt ? 'Rua, Nº, Andar e Código Postal' : 'Street, Number, Floor & Postcode'}
                    className={`w-full px-2.5 py-1.5 rounded-lg border text-xs outline-none ${
                      theme === 'dark' ? 'bg-[#1a060a] border-[#45141c] text-white' : 'bg-white border-[#ebe4d5]'
                    }`}
                  />
                </div>
              )}

              {/* Payment Method */}
              <div className="text-xs space-y-1">
                <label className="text-[11px] font-medium block">
                  {isPt ? 'Forma de Pagamento' : 'Payment Method'}
                </label>
                <div className="grid grid-cols-3 gap-1.5">
                  {(['mbway', 'dinheiro', 'multibanco'] as const).map((method) => (
                    <button
                      key={method}
                      type="button"
                      onClick={() => setPaymentMethod(method)}
                      className={`p-1.5 rounded-md border text-center text-[11px] capitalize transition-all ${
                        paymentMethod === method
                          ? 'border-[#e5a93c] bg-[#e5a93c]/20 font-bold text-[#5a101a] dark:text-amber-400'
                          : theme === 'dark' ? 'border-[#45141c] bg-[#1a060a]' : 'border-[#ebe4d5] bg-white'
                      }`}
                    >
                      {method === 'mbway' ? 'MB WAY' : method === 'dinheiro' ? (isPt ? 'Dinheiro' : 'Cash') : (isPt ? 'Multibanco' : 'Card')}
                    </button>
                  ))}
                </div>
              </div>

              {/* Notes */}
              <div className="text-xs">
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder={isPt ? 'Notas (ex: código do prédio...)' : 'Notes (e.g. gate code...)'}
                  className={`w-full px-2.5 py-1.5 rounded-lg border text-xs outline-none ${
                    theme === 'dark' ? 'bg-[#1a060a] border-[#45141c] text-white' : 'bg-white border-[#ebe4d5]'
                  }`}
                />
              </div>

              {formError && (
                <p className="text-xs font-semibold text-red-500">{formError}</p>
              )}
            </div>
          )}
        </div>

        {/* Drawer Footer with Calculations and CTAs */}
        {items.length > 0 && (
          <div
            className={`p-4 border-t space-y-3 ${
              theme === 'dark' ? 'bg-[#290d13] border-[#45141c]' : 'bg-[#f7f3e9] border-[#ebe4d5]'
            }`}
          >
            {/* Price breakdown */}
            <div className="space-y-1 text-xs">
              <div className="flex justify-between">
                <span className="text-[#887272] dark:text-[#d6c4c2]">{isPt ? 'Subtotal' : 'Subtotal'}</span>
                <span className="font-price font-semibold">{formatCurrency(subtotal, language)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#887272] dark:text-[#d6c4c2]">
                  {deliveryType === 'takeaway' ? (isPt ? 'Levantamento' : 'Pickup') : (isPt ? 'Taxa de Entrega' : 'Delivery Fee')}
                </span>
                <span className="font-price font-semibold">
                  {deliveryFee === 0 ? (
                    <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                      {isPt ? 'GRÁTIS' : 'FREE'}
                    </span>
                  ) : (
                    formatCurrency(deliveryFee, language)
                  )}
                </span>
              </div>
              <div className="flex justify-between text-base font-bold pt-1 border-t border-stone-300 dark:border-stone-700">
                <span className="font-display">{isPt ? 'Total' : 'Total'}</span>
                <span className="font-price text-[#5a101a] dark:text-amber-400 text-lg">
                  {formatCurrency(total, language)}
                </span>
              </div>
            </div>

            {/* Two Action CTAs: WhatsApp & In-App Confirm */}
            <div className="grid grid-cols-1 gap-2 pt-1">
              {/* WhatsApp direct order */}
              <button
                type="button"
                onClick={handleWhatsAppClick}
                className="w-full py-3 px-4 rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-white font-bold text-sm font-price transition-transform active:scale-98 flex items-center justify-center gap-2 shadow-sm"
              >
                <MessageCircle className="w-5 h-5" />
                <span>{isPt ? 'Pedir via WhatsApp (Directo)' : 'Order via WhatsApp'}</span>
              </button>

              {/* In-app order confirmation */}
              <button
                type="button"
                onClick={handleDirectCheckout}
                className="w-full py-2.5 px-4 rounded-xl bg-[#e5a93c] hover:bg-[#d49527] text-[#211b1b] font-bold text-xs sm:text-sm font-price transition-transform active:scale-98 flex items-center justify-center gap-1.5 shadow-xs"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>{isPt ? 'Confirmar Pedido no Restaurante' : 'Confirm Order at Restaurant'}</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
