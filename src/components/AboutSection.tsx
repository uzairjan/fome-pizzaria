import React from 'react';
import { MapPin, Phone, Clock, Flame, ShieldCheck, HeartHandshake } from 'lucide-react';
import type { Language, Theme } from '../types/restaurant.ts';
import { RESTAURANT_ADDRESS, RESTAURANT_PHONE } from '../utils/cart.ts';

interface AboutSectionProps {
  language: Language;
  theme: Theme;
}

export const AboutSection: React.FC<AboutSectionProps> = ({ language, theme }) => {
  const isPt = language === 'pt';

  return (
    <section id="sobre" className="py-12 scroll-mt-20">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Story Section (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold font-price uppercase tracking-wider text-[#e5a93c]">
            <Flame className="w-4 h-4" />
            <span>{isPt ? 'Tradição & Autenticidade' : 'Tradition & Craft'}</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold font-display tracking-tight text-[#211b1b] dark:text-[#fffdf9]">
            {isPt
              ? 'A Nossa Churrasqueira & Forno a Lenha'
              : 'Our Charcoal Grill & Wood-Fired Oven'}
          </h2>

          <div className="text-sm text-[#554242] dark:text-[#dbc0c0] space-y-3 leading-relaxed">
            <p>
              {isPt
                ? 'Na Fome Pizzaria & Churrasqueira respeitamos o tempo e o calor da brasa verdadeira. O nosso frango é selecionado, marinado durante 24 horas em vinha d’alhos tradicional e assado na perfeição sobre carvão vegetal de azinho, garantindo uma pele dourada e estaladiça com carne tenra e sumarenta.'
                : 'At Fome Pizzeria & Churrasqueira we honor the warmth and patience of genuine embers. Our chicken is hand-selected, slow-marinated for 24 hours in aromatic herb broth and flame-roasted slowly over holm oak coals, ensuring crackling skin and tender, juicy meat.'}
            </p>
            <p>
              {isPt
                ? 'Aliamos à tradição dos grelhados a nossa pizzaria em forno de cúpula de pedra a 450°C, com massa fermentada a frio durante 48 horas, além dos nossos saborosos kebabs artesanais e espetadas temperadas com especiarias mediterrânicas.'
                : 'Alongside traditional barbecue we craft stone-dome wood-fired pizzas baked at 450°C with 48h cold-fermented dough, alongside succulent rotisserie kebabs and Mediterranean skewers.'}
            </p>
          </div>

          {/* Highlights */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            <div
              className={`p-3.5 rounded-xl border ${
                theme === 'dark' ? 'bg-[#290d13] border-[#4a161f]' : 'bg-[#fffdf9] border-[#ebe4d5]'
              }`}
            >
              <Flame className="w-5 h-5 text-amber-500 mb-2" />
              <h3 className="font-bold text-xs font-price uppercase">
                {isPt ? 'Carvão Vegetal' : 'Holm Oak Embers'}
              </h3>
              <p className="text-[11px] text-[#887272] dark:text-[#dbc0c0] mt-0.5">
                {isPt ? 'Fumo natural sem aditivos' : 'Natural smoke flavor'}
              </p>
            </div>

            <div
              className={`p-3.5 rounded-xl border ${
                theme === 'dark' ? 'bg-[#290d13] border-[#4a161f]' : 'bg-[#fffdf9] border-[#ebe4d5]'
              }`}
            >
              <ShieldCheck className="w-5 h-5 text-emerald-500 mb-2" />
              <h3 className="font-bold text-xs font-price uppercase">
                {isPt ? '100% Halal' : '100% Halal'}
              </h3>
              <p className="text-[11px] text-[#887272] dark:text-[#dbc0c0] mt-0.5">
                {isPt ? 'Carnes certificadas e seguras' : 'Certified poultry & meats'}
              </p>
            </div>

            <div
              className={`p-3.5 rounded-xl border ${
                theme === 'dark' ? 'bg-[#290d13] border-[#4a161f]' : 'bg-[#fffdf9] border-[#ebe4d5]'
              }`}
            >
              <HeartHandshake className="w-5 h-5 text-amber-500 mb-2" />
              <h3 className="font-bold text-xs font-price uppercase">
                {isPt ? 'Entrega Rápida' : 'Hot & Fresh'}
              </h3>
              <p className="text-[11px] text-[#887272] dark:text-[#dbc0c0] mt-0.5">
                {isPt ? 'Embalagens térmicas próprias' : 'Insulated thermal boxes'}
              </p>
            </div>
          </div>
        </div>

        {/* Location & Info Card (5 cols) */}
        <div id="contacto" className="lg:col-span-5 scroll-mt-20">
          <div
            className={`p-6 rounded-2xl border space-y-5 shadow-sm ${
              theme === 'dark'
                ? 'bg-[#290d13] border-[#4a161f] text-[#fffdf9]'
                : 'bg-[#fffdf9] border-[#ebe4d5] text-[#211b1b]'
            }`}
          >
            <h3 className="text-lg font-bold font-display text-[#5a101a] dark:text-amber-400">
              {isPt ? 'Horário & Localização' : 'Hours & Location'}
            </h3>

            <div className="space-y-4 text-xs sm:text-sm">
              {/* Address */}
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-[#5a101a] text-white shrink-0 mt-0.5">
                  <MapPin className="w-4 h-4 text-amber-400" />
                </div>
                <div>
                  <p className="font-bold font-price uppercase text-[11px] text-stone-500">
                    {isPt ? 'Morada' : 'Address'}
                  </p>
                  <p className="font-semibold">{RESTAURANT_ADDRESS}</p>
                  <p className="text-xs text-stone-500 mt-0.5">
                    {isPt ? 'Estacionamento fácil para levantamento rápido' : 'Easy parking for quick takeaway'}
                  </p>
                </div>
              </div>

              {/* Hours */}
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-[#5a101a] text-white shrink-0 mt-0.5">
                  <Clock className="w-4 h-4 text-amber-400" />
                </div>
                <div>
                  <p className="font-bold font-price uppercase text-[11px] text-stone-500">
                    {isPt ? 'Horário de Funcionamento' : 'Opening Hours'}
                  </p>
                  <p className="font-semibold">
                    {isPt ? 'Segunda a Domingo (Todos os dias)' : 'Monday to Sunday (Every Day)'}
                  </p>
                  <p className="text-xs text-amber-700 dark:text-amber-300 font-price mt-0.5">
                    11:30 – 15:30 • 18:30 – 23:30
                  </p>
                </div>
              </div>

              {/* Phone */}
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-[#5a101a] text-white shrink-0 mt-0.5">
                  <Phone className="w-4 h-4 text-amber-400" />
                </div>
                <div>
                  <p className="font-bold font-price uppercase text-[11px] text-stone-500">
                    {isPt ? 'Telefone / Reservas' : 'Phone / Orders'}
                  </p>
                  <p className="font-semibold font-price text-sm">
                    +351 912 345 678 / +351 210 123 456
                  </p>
                </div>
              </div>
            </div>

            {/* Quick Action Buttons */}
            <div className="pt-2 flex flex-col sm:flex-row gap-2">
              <a
                href={`tel:${RESTAURANT_PHONE}`}
                className="flex-1 py-2.5 px-3 rounded-lg border border-[#5a101a] dark:border-amber-400/50 text-[#5a101a] dark:text-amber-300 font-bold text-xs font-price text-center hover:bg-[#5a101a]/10 transition-colors"
              >
                {isPt ? 'Ligar para Restaurante' : 'Call Restaurant'}
              </a>
              <a
                href={`https://wa.me/${RESTAURANT_PHONE}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 py-2.5 px-3 rounded-lg bg-[#25D366] text-white font-bold text-xs font-price text-center hover:bg-[#20ba59] transition-colors"
              >
                {isPt ? 'Conversar no WhatsApp' : 'Chat on WhatsApp'}
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
