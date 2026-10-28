import React from 'react';
import { Plus, Flame, ShieldCheck } from 'lucide-react';
import type { Language, MenuItem, Theme } from '../types/restaurant.ts';
import { formatCurrency } from '../utils/cart.ts';

interface MenuGridProps {
  items: MenuItem[];
  language: Language;
  theme: Theme;
  onSelectItem: (item: MenuItem, defaultSizeIndex?: number) => void;
}

export const MenuGrid: React.FC<MenuGridProps> = ({
  items,
  language,
  theme,
  onSelectItem,
}) => {
  const isPt = language === 'pt';

  if (items.length === 0) {
    return (
      <div className="py-12 text-center text-stone-500">
        <p className="text-base">
          {isPt ? 'Nenhum prato encontrado nesta categoria.' : 'No items found in this category.'}
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
      {items.map((item) => {
        return (
          <div
            key={item.id}
            className={`rounded-lg p-3.5 sm:p-4 border transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md flex flex-col justify-between gap-3 ${
              theme === 'dark'
                ? 'bg-[#290d13] border-[#4a161f]'
                : 'bg-[#fffdf9] border-[#ebe4d5]'
            }`}
          >
            {/* Top Row: Thumbnail + Item info + Badge */}
            <div className="flex items-start gap-3.5">
              {/* Left: Food thumbnail with index pill */}
              <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-md overflow-hidden shrink-0 bg-[#3b0009]/20">
                <img
                  src={item.image}
                  alt={isPt ? item.namePt : item.nameEn}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                {/* Circular Index Tag */}
                <div className="absolute top-1.5 left-1.5 w-6 h-6 rounded-full bg-[#4a0d15] text-white flex items-center justify-center font-bold text-xs font-price shadow-sm border border-amber-400/40">
                  {item.number}
                </div>
              </div>

              {/* Center: Details */}
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-1.5 mb-1">
                  <h3 className="font-bold text-sm sm:text-base font-display text-[#211b1b] dark:text-[#fffdf9] truncate">
                    {isPt ? item.namePt : item.nameEn}
                  </h3>

                  {/* Dietary / Spice / Halal Badges */}
                  {item.isHalal && (
                    <span className="text-[10px] font-bold font-price px-1.5 py-0.5 rounded bg-emerald-900/10 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300">
                      Halal
                    </span>
                  )}
                  {item.isSpicy && (
                    <span className="text-[10px] font-bold font-price px-1.5 py-0.5 rounded bg-red-900/10 text-red-700 dark:bg-red-900/30 dark:text-red-300 flex items-center gap-0.5">
                      <Flame className="w-2.5 h-2.5" />
                      {isPt ? 'Piri-Piri' : 'Spicy'}
                    </span>
                  )}
                  {item.badgePt && (
                    <span className="text-[10px] font-bold font-price px-1.5 py-0.5 rounded bg-[#e5a93c]/20 text-[#604100] dark:text-amber-300">
                      {isPt ? item.badgePt : item.badgeEn}
                    </span>
                  )}
                </div>

                <p className="text-xs text-[#554242] dark:text-[#dbc0c0] line-clamp-2 leading-relaxed font-body">
                  {isPt ? item.descriptionPt : item.descriptionEn}
                </p>
              </div>
            </div>

            {/* Bottom Row: Multi-size Pricing Matrix & Quick Add CTA */}
            <div className="pt-2 border-t border-[#887272]/15 flex flex-wrap items-center justify-between gap-2">
              {/* Multi-size Matrix */}
              <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                {item.prices.map((p, idx) => (
                  <button
                    key={p.size}
                    type="button"
                    onClick={() => onSelectItem(item, idx)}
                    className={`px-2.5 py-1 rounded text-xs font-price transition-colors flex items-center gap-1.5 cursor-pointer ${
                      theme === 'dark'
                        ? 'bg-[#38141b] hover:bg-[#481923] text-[#f7f3e9]'
                        : 'bg-[#f7f3e9] hover:bg-[#ebe1cf] text-[#211b1b]'
                    }`}
                    title={isPt ? `Pedir ${p.labelPt}` : `Order ${p.labelEn}`}
                  >
                    <span className="text-[11px] opacity-75">
                      {isPt ? p.labelPt : p.labelEn}:
                    </span>
                    <span className="font-bold text-[#5a101a] dark:text-amber-400">
                      {formatCurrency(p.price, language)}
                    </span>
                  </button>
                ))}
              </div>

              {/* Order / Add Button */}
              <button
                type="button"
                onClick={() => onSelectItem(item, 0)}
                className="px-3 py-1.5 rounded-lg bg-[#e5a93c] hover:bg-[#d49527] text-[#211b1b] font-bold text-xs font-price transition-transform active:scale-95 flex items-center gap-1 shadow-xs ml-auto shrink-0"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{isPt ? 'Pedir' : 'Add'}</span>
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};
