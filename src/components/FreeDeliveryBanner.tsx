import React from 'react';
import { Truck, ShieldCheck, Clock } from 'lucide-react';
import type { Language, Theme } from '../types/restaurant.ts';

interface FreeDeliveryBannerProps {
  language: Language;
  theme: Theme;
}

export const FreeDeliveryBanner: React.FC<FreeDeliveryBannerProps> = ({ language, theme }) => {
  const isPt = language === 'pt';

  return (
    <div
      className={`border-b text-xs sm:text-sm font-medium transition-colors ${
        theme === 'dark'
          ? 'bg-[#380b12] border-[#55141f] text-[#ffdf9e]'
          : 'bg-[#fcedcb] border-[#e8d5ad] text-[#4a2800]'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 py-2 sm:py-2.5 flex flex-wrap items-center justify-between gap-2.5">
        {/* Left: Free delivery promo */}
        <div className="flex items-center gap-2">
          <div className="p-1 rounded bg-[#e5a93c] text-[#211b1b] shrink-0">
            <Truck className="w-3.5 h-3.5" />
          </div>
          <p className="font-semibold tracking-tight">
            <span
              className={`font-extrabold uppercase font-display ${
                theme === 'dark' ? 'text-[#fdbe50]' : 'text-[#5a101a]'
              }`}
            >
              {isPt ? 'Entregas Grátis' : 'Free Delivery'}
            </span>
            <span className="opacity-90">
              {isPt ? ' — Em compras superiores a 12€' : ' — On orders over €12'}
            </span>
          </p>
        </div>

        {/* Center: Halal badge & Store status */}
        <div className="flex items-center gap-4 text-xs">
          {/* Halal badge without glyph tofu */}
          <div
            className={`flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border font-semibold font-price ${
              theme === 'dark'
                ? 'bg-[#003427] border-[#0d5942] text-[#86e2c3]'
                : 'bg-[#e7f7f0] border-[#b2dfcf] text-[#1b4d3e]'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span className="tracking-wide">HALAL CERTIFICADO</span>
          </div>

          {/* Open schedule */}
          <div className="hidden md:flex items-center gap-1.5 opacity-90">
            <Clock className="w-3.5 h-3.5" />
            <span>{isPt ? 'Aberto Hoje: 11h30 – 23h30' : 'Open Today: 11:30 – 23:30'}</span>
          </div>
        </div>

        {/* Right: Delivery partner pills */}
        <div className="hidden sm:flex items-center gap-2 text-xs">
          <span className="opacity-75">{isPt ? 'Também em:' : 'Also on:'}</span>
          <span
            className={`px-2 py-0.5 rounded font-bold text-[11px] ${
              theme === 'dark' ? 'bg-white/10 text-white' : 'bg-black/10 text-stone-800'
            }`}
          >
            Uber Eats
          </span>
          <span
            className={`px-2 py-0.5 rounded font-bold text-[11px] ${
              theme === 'dark' ? 'bg-[#ffc244]/25 text-[#ffd67a]' : 'bg-[#ffc244]/35 text-[#5e4300]'
            }`}
          >
            Glovo
          </span>
          <span
            className={`px-2 py-0.5 rounded font-bold text-[11px] ${
              theme === 'dark' ? 'bg-[#34d186]/25 text-[#86efac]' : 'bg-[#34d186]/35 text-[#0f5434]'
            }`}
          >
            Bolt Food
          </span>
        </div>
      </div>
    </div>
  );
};
