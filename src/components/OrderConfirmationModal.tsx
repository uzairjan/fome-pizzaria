import React, { useMemo } from 'react';
import { CheckCircle2, Clock, MapPin, MessageCircle, Flame, ArrowRight, X } from 'lucide-react';
import type { CartItem, Language, OrderDetails, Theme } from '../types/restaurant.ts';
import { calculateSubtotal, calculateDeliveryFee, calculateTotal, formatCurrency, getWhatsAppUrl } from '../utils/cart.ts';

interface OrderConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderDetails: OrderDetails | null;
  items: CartItem[];
  language: Language;
  theme: Theme;
}

export const OrderConfirmationModal: React.FC<OrderConfirmationModalProps> = ({
  isOpen,
  onClose,
  orderDetails,
  items,
  language,
  theme,
}) => {
  const orderNumber = useMemo(
    () => `FOME-${Math.floor(1000 + Math.random() * 9000)}`,
    [orderDetails]
  );

  if (!isOpen || !orderDetails) return null;

  const isPt = language === 'pt';
  const subtotal = calculateSubtotal(items);
  const deliveryFee = calculateDeliveryFee(subtotal, orderDetails.deliveryType);
  const total = calculateTotal(subtotal, deliveryFee);

  const whatsappUrl = getWhatsAppUrl(items, orderDetails, language);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div
        className={`relative w-full max-w-lg rounded-2xl overflow-hidden shadow-2xl border my-8 transition-colors ${
          theme === 'dark'
            ? 'bg-[#290d13] border-[#551823] text-[#fffdf9]'
            : 'bg-[#fffdf9] border-[#ebe4d5] text-[#211b1b]'
        }`}
      >
        {/* Header Celebration banner */}
        <div className="bg-[#5a101a] text-white p-6 text-center relative">
          <button
            type="button"
            onClick={onClose}
            className="absolute top-3 right-3 p-1.5 rounded-full bg-black/30 hover:bg-black/50 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="w-14 h-14 mx-auto mb-3 rounded-full bg-[#e5a93c] text-[#211b1b] flex items-center justify-center shadow-lg">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <span className="text-xs font-bold font-price uppercase tracking-widest text-amber-300">
            {isPt ? 'Pedido Confirmado' : 'Order Confirmed'}
          </span>
          <h2 className="text-2xl font-bold font-display mt-0.5">
            {isPt ? 'Obrigado pelo seu pedido!' : 'Thank you for your order!'}
          </h2>
          <p className="text-sm text-stone-200 mt-1">
            {isPt ? `Código do pedido: #${orderNumber}` : `Order Code: #${orderNumber}`}
          </p>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 max-h-[65vh] overflow-y-auto">
          {/* Real-time Order Progress Status */}
          <div
            className={`p-4 rounded-xl border space-y-3 ${
              theme === 'dark' ? 'bg-[#1e070b] border-[#4a161f]' : 'bg-[#f7f3e9] border-[#ebe4d5]'
            }`}
          >
            <div className="flex items-center justify-between text-xs font-bold font-price text-[#5a101a] dark:text-amber-400">
              <span className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-amber-500" />
                {isPt ? 'Tempo Estimado:' : 'Estimated Time:'}
              </span>
              <span className="text-sm font-extrabold">
                {orderDetails.deliveryType === 'delivery' ? '30 – 40 min' : '15 – 25 min'}
              </span>
            </div>

            {/* Step Pipeline */}
            <div className="grid grid-cols-3 gap-2 text-center text-[11px] pt-1">
              <div className="space-y-1">
                <div className="w-6 h-6 mx-auto rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs font-bold">
                  ✓
                </div>
                <p className="font-semibold text-emerald-600 dark:text-emerald-400">
                  {isPt ? 'Recebido' : 'Received'}
                </p>
              </div>

              <div className="space-y-1">
                <div className="w-6 h-6 mx-auto rounded-full bg-amber-500 text-[#211b1b] flex items-center justify-center text-xs font-bold">
                  <Flame className="w-3.5 h-3.5" />
                </div>
                <p className="font-semibold text-amber-600 dark:text-amber-400">
                  {isPt ? 'No Carvão' : 'Grilling'}
                </p>
              </div>

              <div className="space-y-1">
                <div className="w-6 h-6 mx-auto rounded-full bg-stone-300 dark:bg-stone-700 text-stone-500 flex items-center justify-center text-xs font-bold">
                  3
                </div>
                <p className="text-stone-400">
                  {orderDetails.deliveryType === 'delivery'
                    ? isPt ? 'A Caminho' : 'On the Way'
                    : isPt ? 'Pronto' : 'Ready'}
                </p>
              </div>
            </div>
          </div>

          {/* Delivery Details Summary */}
          <div className="text-xs space-y-1.5">
            <h3 className="font-bold font-price uppercase tracking-wider text-[#5a101a] dark:text-amber-400">
              {isPt ? 'Dados da Encomenda' : 'Order Details'}
            </h3>
            <p>
              <strong>{isPt ? 'Cliente:' : 'Customer:'}</strong> {orderDetails.customerName} ({orderDetails.phone})
            </p>
            <p>
              <strong>{isPt ? 'Tipo:' : 'Type:'}</strong>{' '}
              {orderDetails.deliveryType === 'delivery'
                ? isPt ? `Entrega em: ${orderDetails.address}` : `Delivery to: ${orderDetails.address}`
                : isPt ? 'Levantamento no restaurante (Takeaway)' : 'Restaurant Pickup (Takeaway)'}
            </p>
            <p>
              <strong>{isPt ? 'Pagamento:' : 'Payment:'}</strong>{' '}
              {orderDetails.paymentMethod.toUpperCase()} ({formatCurrency(total, language)})
            </p>
          </div>

          {/* WhatsApp Direct Notification */}
          <div className="p-3.5 rounded-xl bg-emerald-950/20 border border-emerald-800/40 space-y-2">
            <p className="text-xs text-emerald-800 dark:text-emerald-300">
              {isPt
                ? 'Deseja enviar ou acompanhar o pedido pelo WhatsApp directamente com o grelhador?'
                : 'Want to send or track this order on WhatsApp directly with the kitchen?'}
            </p>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-[#25D366] text-white font-bold text-xs font-price shadow-xs hover:bg-[#20ba59]"
            >
              <MessageCircle className="w-4 h-4" />
              <span>{isPt ? 'Abrir no WhatsApp' : 'Open in WhatsApp'}</span>
            </a>
          </div>
        </div>

        {/* Modal Footer */}
        <div
          className={`p-4 border-t flex justify-end ${
            theme === 'dark' ? 'bg-[#22090e] border-[#4a161f]' : 'bg-[#f7f3e9] border-[#ebe4d5]'
          }`}
        >
          <button
            type="button"
            onClick={onClose}
            className="w-full py-2.5 px-4 rounded-xl bg-[#5a101a] text-white hover:bg-[#430b13] font-bold text-xs font-price shadow-sm"
          >
            {isPt ? 'Concluir & Voltar à Ementa' : 'Done & Return to Menu'}
          </button>
        </div>
      </div>
    </div>
  );
};
