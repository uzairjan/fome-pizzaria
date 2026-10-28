import React from 'react';
import { ShoppingBag, ArrowRight } from 'lucide-react';
import type { Language, Theme } from '../types/restaurant.ts';
import { formatCurrency } from '../utils/cart.ts';

interface StickyMobileBarProps {
  cartCount: number;
  cartSubtotal: number;
  onOpenCart: () => void;
  language: Language;
  theme: Theme;
}

export const StickyMobileBar: React.FC<StickyMobileBarProps> = ({
  cartCount,
  cartSubtotal,
  onOpenCart,
  language,
  theme,
}) => {
  if (cartCount === 0) return null;

  const isPt = language === 'pt';

  return (
    <aside
      aria-label="Floating cart summary"
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 p-2.5 bg-black/40 backdrop-blur-xs"
    >
      <div
        className={`max-w-md mx-auto rounded-xl p-2.5 px-4 shadow-xl border flex items-center justify-between gap-3 ${
          theme === 'dark'
            ? 'bg-[#290d13] border-[#551823] text-white'
            : 'bg-[#5a101a] border-[#7a1824] text-white'
        }`}
      >
        <div className="flex items-center gap-2.5">
          <div className="relative">
            <ShoppingBag className="w-5 h-5 text-amber-400" />
            <span className="absolute -top-1.5 -right-2 bg-[#e5a93c] text-[#211b1b] rounded-full text-[10px] w-4 h-4 flex items-center justify-center font-bold font-price">
              {cartCount}
            </span>
          </div>
          <div>
            <p className="text-[11px] text-amber-200/90 font-semibold leading-tight">
              {isPt ? 'Total Pedido:' : 'Order Total:'}
            </p>
            <p className="font-bold font-price text-sm leading-tight text-white">
              {formatCurrency(cartSubtotal, language)}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onOpenCart}
          className="py-1.5 px-3.5 rounded-lg bg-[#e5a93c] hover:bg-[#d49527] text-[#211b1b] font-bold text-xs font-price flex items-center gap-1.5 transition-transform active:scale-95 shadow-xs"
        >
          <span>{isPt ? 'Ver Pedido' : 'View Order'}</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </aside>
  );
};
