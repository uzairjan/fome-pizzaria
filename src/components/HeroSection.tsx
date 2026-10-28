import React from 'react';
import { Flame, Sparkles, MessageCircle, ArrowRight } from 'lucide-react';
import type { Language, Theme } from '../types/restaurant.ts';
import { FOOD_IMAGES } from '../assets/foodImages.ts';

interface HeroSectionProps {
  language: Language;
  theme: Theme;
  onExploreMenu: () => void;
  onExploreCombos: () => void;
  onDirectWhatsApp: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  language,
  theme,
  onExploreMenu,
  onExploreCombos,
  onDirectWhatsApp,
}) => {
  const isPt = language === 'pt';

  return (
    <section className="relative overflow-hidden pt-6 pb-12 md:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column (7 cols): Copy and Actions */}
          <div className="lg:col-span-7 space-y-6">
            {/* Tagline kicker */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-bold tracking-wide uppercase font-price bg-[#5a101a] text-amber-300 border border-amber-500/40 shadow-xs">
              <Flame className="w-3.5 h-3.5 text-amber-400" />
              <span>{isPt ? 'Churrasqueira & Forno Tradicional' : 'Authentic Grill & Wood Oven'}</span>
            </div>

            {/* Display Headline */}
            <h1
              className={`text-3xl sm:text-4xl lg:text-5xl font-extrabold font-display tracking-tight leading-[1.15] text-balance ${
                theme === 'dark' ? 'text-[#fffdf9]' : 'text-[#211b1b]'
              }`}
            >
              {isPt ? (
                <>
                  O Autêntico{' '}
                  <span className={theme === 'dark' ? 'text-[#f4c430]' : 'text-[#5a101a]'}>
                    Frango no Carvão
                  </span>{' '}
                  & Sabores da Nossa Terra
                </>
              ) : (
                <>
                  Authentic{' '}
                  <span className={theme === 'dark' ? 'text-[#f4c430]' : 'text-[#5a101a]'}>
                    Charcoal Roast
                  </span>{' '}
                  & Traditional Woodfire Oven
                </>
              )}
            </h1>

            {/* Descriptive Body */}
            <p
              className={`text-base sm:text-lg leading-relaxed max-w-2xl font-body ${
                theme === 'dark' ? 'text-[#e2d5d3]' : 'text-[#554242]'
              }`}
            >
              {isPt
                ? 'Grelhados artesanais sobre brasas de azinho, piri-piri da casa feito com receita de família, pizzas estaladiças em forno a lenha e kebabs suculentos. Preparado na hora com entrega rápida.'
                : 'Artisan barbecue over holm oak coals, house-made secret piri-piri sauce, crispy blistered wood-fired pizzas, and succulent rotisserie kebabs. Freshly prepared for swift delivery.'}
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                type="button"
                onClick={onExploreMenu}
                className="flex items-center gap-2 px-6 py-3.5 rounded-xl bg-[#e5a93c] hover:bg-[#d49527] text-[#211b1b] font-bold text-sm sm:text-base font-price shadow-md hover:shadow-lg transition-all active:scale-95"
              >
                <span>{isPt ? 'Fazer Pedido / Ver Ementa' : 'Order Now / View Menu'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={onExploreCombos}
                className={`flex items-center gap-2 px-5 py-3.5 rounded-xl font-bold text-sm sm:text-base font-price border transition-all active:scale-95 ${
                  theme === 'dark'
                    ? 'border-[#5a101a] bg-[#300f16] text-[#ffdada] hover:bg-[#43141e]'
                    : 'border-[#5a101a] bg-transparent text-[#5a101a] hover:bg-[#5a101a]/5'
                }`}
              >
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>{isPt ? 'Ver Combos Família' : 'Family Combos'}</span>
              </button>

              <button
                type="button"
                onClick={onDirectWhatsApp}
                className="flex items-center gap-2 px-4 py-3.5 rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-white font-bold text-sm font-price transition-all active:scale-95 shadow-xs"
                title={isPt ? 'Pedir diretamente pelo WhatsApp' : 'Direct WhatsApp Order'}
              >
                <MessageCircle className="w-4 h-4" />
                <span>WhatsApp</span>
              </button>
            </div>

            {/* 3 Key Trust Badges */}
            <div className="pt-4 grid grid-cols-3 gap-2 sm:gap-4 border-t border-[#887272]/20 text-xs sm:text-sm">
              <div className="space-y-0.5">
                <p
                  className={`font-extrabold font-price ${
                    theme === 'dark' ? 'text-[#f4c430]' : 'text-[#5a101a]'
                  }`}
                >
                  100% Brasas
                </p>
                <p className={theme === 'dark' ? 'text-[#c2afad]' : 'text-[#554242]'}>
                  {isPt ? 'Lenha de Azinho' : 'Holm Oak Embers'}
                </p>
              </div>
              <div className="space-y-0.5">
                <p
                  className={`font-extrabold font-price ${
                    theme === 'dark' ? 'text-[#f4c430]' : 'text-[#5a101a]'
                  }`}
                >
                  450°C Forno
                </p>
                <p className={theme === 'dark' ? 'text-[#c2afad]' : 'text-[#554242]'}>
                  {isPt ? 'Massa com 48h' : '48h Slow Crust'}
                </p>
              </div>
              <div className="space-y-0.5">
                <p
                  className={`font-extrabold font-price ${
                    theme === 'dark' ? 'text-[#86e2c3]' : 'text-emerald-800'
                  }`}
                >
                  HALAL Certificado
                </p>
                <p className={theme === 'dark' ? 'text-[#c2afad]' : 'text-[#554242]'}>
                  {isPt ? 'Frango & Kebabs' : 'Certified Meats'}
                </p>
              </div>
            </div>
          </div>

          {/* Right Column (5 cols): Food Showcase with Tactile Board styling */}
          <div className="lg:col-span-5">
            <div
              className={`relative rounded-2xl overflow-hidden p-2.5 transition-all shadow-xl ${
                theme === 'dark'
                  ? 'bg-[#290d13] border border-[#501721]'
                  : 'bg-[#fffdf9] border border-[#ebe4d5]'
              }`}
            >
              <div className="relative aspect-4/3 rounded-xl overflow-hidden bg-[#2b0e14]">
                <img
                  src={FOOD_IMAGES.heroChurrasqueiraGrill}
                  alt={isPt ? 'Frango assado no carvão com batatas rústicas' : 'Charcoal roasted chicken with rustic fries'}
                  className="w-full h-full object-cover object-center transform hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent pointer-events-none" />

                {/* Floating Special Stamp */}
                <div className="absolute top-3 right-3 bg-[#e5a93c] text-[#211b1b] px-3 py-1.5 rounded-lg font-bold font-price text-xs shadow-md">
                  {isPt ? 'Assado Lento & Suculento' : 'Slow Charcoal Grilled'}
                </div>

                {/* Bottom caption overlay */}
                <div className="absolute bottom-3 left-3 right-3 text-white">
                  <p className="text-xs font-semibold text-amber-300 font-price uppercase tracking-wider">
                    {isPt ? 'Prato de Assinatura' : 'Signature Dish'}
                  </p>
                  <p className="text-base font-bold font-display leading-tight">
                    {isPt ? 'Frango Inteiro no Ponto com Piri-Piri' : 'Whole Charcoal Chicken & Piri-Piri'}
                  </p>
                  <p className="text-xs text-stone-200 mt-0.5">
                    {isPt ? 'Desde 4,90€ (1/2 frango) até 12,50€ com acompanhamentos' : 'From €4.90 (1/2 chicken) up to €12.50 with sides'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
