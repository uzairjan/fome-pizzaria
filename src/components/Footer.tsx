import React from 'react';
import { UtensilsCrossed, ShieldCheck } from 'lucide-react';
import type { Language, Theme } from '../types/restaurant.ts';

interface FooterProps {
  language: Language;
  theme: Theme;
}

export const Footer: React.FC<FooterProps> = ({ language, theme }) => {
  const isPt = language === 'pt';

  return (
    <footer
      className={`border-t transition-colors ${
        theme === 'dark'
          ? 'bg-[#180508] border-[#381118] text-[#c9b7b5]'
          : 'bg-[#f7f0eb] border-[#ebe0d5] text-[#554242]'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-6 border-b border-[#887272]/20">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[#5a101a] text-amber-400 flex items-center justify-center">
              <UtensilsCrossed className="w-4 h-4" />
            </div>
            <div>
              <p className="font-bold font-display text-base text-[#211b1b] dark:text-white">
                Fome Pizzaria & Churrasqueira
              </p>
              <p className="text-xs text-[#887272] dark:text-[#a89593]">
                {isPt ? 'Pizzaria em Forno a Lenha & Churrasqueira no Carvão' : 'Artisan Woodfire Pizzeria & Charcoal Churrasqueira'}
              </p>
              <a
                href="http://www.fomepizzariaechurasqueira.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-amber-600 dark:text-amber-400 font-price hover:underline inline-block mt-0.5"
              >
                www.fomepizzariaechurasqueira.com
              </a>
            </div>
          </div>

          {/* Trust points */}
          <div className="flex flex-wrap items-center gap-4 text-xs font-semibold">
            <span className="flex items-center gap-1.5 text-emerald-700 dark:text-emerald-400 font-price">
              <ShieldCheck className="w-4 h-4" />
              HALAL 100% Certified
            </span>
            <span aria-hidden="true">·</span>
            <span>{isPt ? 'Entregas Rápidas' : 'Fast Delivery'}</span>
            <span aria-hidden="true">·</span>
            <span>{isPt ? 'Brasas 100% Naturais' : '100% Wood Embers'}</span>
          </div>
        </div>

        {/* Bottom row: allergens and legal */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs text-[#887272] dark:text-[#a89593]">
          <p>
            {isPt
              ? 'Se tiver alergias ou intolerâncias alimentares, por favor informe a nossa equipa antes de encomendar.'
              : 'If you suffer from food allergies or intolerances, please notify our team before ordering.'}
          </p>
          <p className="font-price shrink-0">
            © {new Date().getFullYear()} Fome Pizzaria & Churrasqueira. {isPt ? 'Todos os direitos reservados.' : 'All rights reserved.'}
          </p>
        </div>
      </div>
    </footer>
  );
};
