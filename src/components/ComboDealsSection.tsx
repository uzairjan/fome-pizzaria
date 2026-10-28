import React from 'react';
import { Users, Plus, Check } from 'lucide-react';
import { COMBO_DEALS } from '../data/menuData.ts';
import type { ComboDeal, Language, Theme } from '../types/restaurant.ts';
import { formatCurrency } from '../utils/cart.ts';

interface ComboDealsSectionProps {
  language: Language;
  theme: Theme;
  onSelectCombo: (combo: ComboDeal) => void;
}

export const ComboDealsSection: React.FC<ComboDealsSectionProps> = ({
  language,
  theme,
  onSelectCombo,
}) => {
  const isPt = language === 'pt';

  return (
    <section id="combos" className="py-8 scroll-mt-24">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold font-price uppercase tracking-wider text-[#e5a93c]">
            <span className="w-2 h-2 rounded-full bg-[#e5a93c]" />
            <span>{isPt ? 'Grandes Poupanças' : 'Best Value Bundles'}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold font-display tracking-tight text-[#211b1b] dark:text-[#fffdf9]">
            {isPt ? 'Combos de Família & Amigos' : 'Family & Group Combos'}
          </h2>
          <p className="text-sm text-[#554242] dark:text-[#dbc0c0] mt-1">
            {isPt
              ? 'Menús completos com frango, pizzas, acompanhamentos e bebidas para partilhar com o melhor preço.'
              : 'Complete feasts with chicken, pizza, sides and drinks to share at the best bundle price.'}
          </p>
        </div>
      </div>

      {/* Grid of Combo Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {COMBO_DEALS.map((combo) => {
          return (
            <div
              key={combo.id}
              className={`flex flex-col rounded-xl overflow-hidden border transition-all duration-200 hover:-translate-y-1 hover:shadow-lg ${
                theme === 'dark'
                  ? 'bg-[#290d13] border-[#4a161f]'
                  : 'bg-[#fffdf9] border-[#e8e2d2]'
              }`}
            >
              {/* Top Header Strip: Rich Burgundy #5A101A */}
              <div className="bg-[#5a101a] text-white p-4 relative">
                {/* Index tag & Serves badge */}
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-[#3b0009] border border-[#e5a93c]/40 text-amber-300 flex items-center justify-center font-bold text-xs font-price">
                      {combo.number}
                    </span>
                    <span className="text-[11px] font-semibold tracking-wider uppercase text-amber-200/90 flex items-center gap-1 font-price">
                      <Users className="w-3 h-3" />
                      {isPt ? combo.servesPt : combo.servesEn}
                    </span>
                  </div>

                  {combo.originalPrice && (
                    <span className="text-xs line-through text-white/60 font-price">
                      {formatCurrency(combo.originalPrice, language)}
                    </span>
                  )}
                </div>

                {/* Combo Title */}
                <h3 className="text-lg font-bold font-display text-white pr-20 leading-snug">
                  {isPt ? combo.namePt : combo.nameEn}
                </h3>
                <p className="text-xs text-amber-200/80 mt-0.5 line-clamp-1">
                  {isPt ? combo.taglinePt : combo.taglineEn}
                </p>

                {/* Oversized Price Hero in golden amber pill at top-right */}
                <div className="absolute top-4 right-4 bg-[#e5a93c] text-[#211b1b] px-3 py-1.5 rounded-lg shadow-md font-bold font-price text-lg">
                  {formatCurrency(combo.price, language)}
                </div>
              </div>

              {/* Combo Image with Subtle Contrast Scrim */}
              <div className="relative aspect-16/9 w-full overflow-hidden bg-[#1e070b]">
                <img
                  src={combo.image}
                  alt={isPt ? combo.namePt : combo.nameEn}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>

              {/* Lower Section: Bundled Items List */}
              <div className="p-4 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <p className="text-xs font-bold font-price uppercase tracking-wider text-[#5a101a] dark:text-amber-400">
                    {isPt ? 'Incluído neste combo:' : 'Included in this bundle:'}
                  </p>
                  <ul className="space-y-1.5 text-xs text-[#554242] dark:text-[#d6c4c2]">
                    {(isPt ? combo.bundledItemsPt : combo.bundledItemsEn).map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <Check className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Primary Action Button */}
                <button
                  type="button"
                  onClick={() => onSelectCombo(combo)}
                  className="w-full py-2.5 px-4 rounded-lg bg-[#e5a93c] hover:bg-[#d49527] text-[#211b1b] font-bold text-xs sm:text-sm font-price transition-all active:scale-98 flex items-center justify-center gap-2 shadow-xs"
                >
                  <Plus className="w-4 h-4" />
                  <span>{isPt ? 'Personalizar & Pedir' : 'Customize & Order'}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
