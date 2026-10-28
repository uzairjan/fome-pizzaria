import React from 'react';
import { Sun, Moon, ShoppingBag, UtensilsCrossed } from 'lucide-react';
import type { Language, Theme } from '../types/restaurant.ts';
import { formatCurrency } from '../utils/cart.ts';

interface HeaderProps {
  language: Language;
  onLanguageChange: (lang: Language) => void;
  theme: Theme;
  onThemeToggle: () => void;
  cartCount: number;
  cartSubtotal: number;
  onOpenCart: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  language,
  onLanguageChange,
  theme,
  onThemeToggle,
  cartCount,
  cartSubtotal,
  onOpenCart,
}) => {
  const isPt = language === 'pt';

  return (
    <header
      className={`sticky top-0 z-40 transition-colors duration-200 border-b ${
        theme === 'dark'
          ? 'bg-[#1e070b]/95 border-[#45141c] text-[#fffdf9]'
          : 'bg-[#fffdf9]/95 border-[#ebe4d5] text-[#211b1b]'
      } backdrop-blur-md`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-4 md:gap-8">
        {/* Zone 1: Brand Wordmark (Single Text Element) */}
        <a
          href="#"
          className="flex items-center gap-2.5 text-xl sm:text-2xl font-bold font-display tracking-tight text-amber-600 dark:text-[#f4c430] whitespace-nowrap shrink-0 group"
        >
          <div className="w-9 h-9 rounded-full bg-[#5a101a] text-amber-400 flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
            <UtensilsCrossed className="w-5 h-5 text-amber-400" />
          </div>
          <span className="font-extrabold tracking-tight">
            Fome{' '}
            <span className="font-semibold text-sm opacity-90 hidden sm:inline">
              {isPt ? 'Pizzaria & Churrasqueira' : 'Pizzeria & Churrasqueira'}
            </span>
          </span>
        </a>

        {/* Zone 2: Navigation Links (Single Line, 4 Links) */}
        <nav className="hidden lg:flex items-center gap-7 text-sm font-medium">
          <a
            href="#cardapio"
            className={`transition-colors whitespace-nowrap hover:text-amber-600 dark:hover:text-amber-400 ${
              theme === 'dark' ? 'text-[#e5d5d3]' : 'text-[#453836]'
            }`}
          >
            {isPt ? 'Ementa & Grelhados' : 'Menu & Grill'}
          </a>
          <a
            href="#combos"
            className={`transition-colors whitespace-nowrap hover:text-amber-600 dark:hover:text-amber-400 ${
              theme === 'dark' ? 'text-[#e5d5d3]' : 'text-[#453836]'
            }`}
          >
            {isPt ? 'Combos Família' : 'Family Combos'}
          </a>
          <a
            href="#sobre"
            className={`transition-colors whitespace-nowrap hover:text-amber-600 dark:hover:text-amber-400 ${
              theme === 'dark' ? 'text-[#e5d5d3]' : 'text-[#453836]'
            }`}
          >
            {isPt ? 'Churrasqueira & Forno' : 'Our Story'}
          </a>
          <a
            href="#contacto"
            className={`transition-colors whitespace-nowrap hover:text-amber-600 dark:hover:text-amber-400 ${
              theme === 'dark' ? 'text-[#e5d5d3]' : 'text-[#453836]'
            }`}
          >
            {isPt ? 'Localização & Horário' : 'Location & Hours'}
          </a>
        </nav>

        {/* Zone 3: Interactive Controls (Language, Dark Mode, Cart) */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Language Toggle: PT and EN only */}
          <div
            className={`flex items-center p-0.5 rounded-lg border text-xs font-semibold ${
              theme === 'dark'
                ? 'bg-[#2b0e14] border-[#45141c]'
                : 'bg-[#f7f3e9] border-[#e2d8cb]'
            }`}
            role="group"
            aria-label="Language selector"
          >
            <button
              type="button"
              onClick={() => onLanguageChange('pt')}
              className={`px-2.5 py-1.5 rounded-md transition-all whitespace-nowrap ${
                language === 'pt'
                  ? 'bg-[#5a101a] text-white shadow-xs font-bold'
                  : theme === 'dark'
                  ? 'text-[#d4bfbe] hover:text-white'
                  : 'text-[#6b5e59] hover:text-[#211b1b]'
              }`}
              aria-pressed={language === 'pt'}
            >
              PT
            </button>
            <button
              type="button"
              onClick={() => onLanguageChange('en')}
              className={`px-2.5 py-1.5 rounded-md transition-all whitespace-nowrap ${
                language === 'en'
                  ? 'bg-[#5a101a] text-white shadow-xs font-bold'
                  : theme === 'dark'
                  ? 'text-[#d4bfbe] hover:text-white'
                  : 'text-[#6b5e59] hover:text-[#211b1b]'
              }`}
              aria-pressed={language === 'en'}
            >
              EN
            </button>
          </div>

          {/* Dark / Light Mode Toggle */}
          <button
            type="button"
            onClick={onThemeToggle}
            aria-label={theme === 'dark' ? 'Ativar modo claro' : 'Ativar modo escuro'}
            className={`p-2 rounded-lg border transition-all ${
              theme === 'dark'
                ? 'bg-[#2b0e14] border-[#45141c] text-amber-400 hover:bg-[#38131a]'
                : 'bg-[#f7f3e9] border-[#e2d8cb] text-[#453836] hover:bg-[#ede5d5]'
            }`}
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-[#5a101a]" />
            )}
          </button>

          {/* Cart Trigger Button */}
          <button
            type="button"
            onClick={onOpenCart}
            aria-label={`Carrinho de compras com ${cartCount} itens`}
            className="flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg bg-[#e5a93c] hover:bg-[#d49527] text-[#211b1b] font-bold text-xs sm:text-sm font-price transition-transform active:scale-95 shadow-sm"
          >
            <div className="relative">
              <ShoppingBag className="w-4 h-4" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-[#5a101a] text-white rounded-full text-[10px] w-4 h-4 flex items-center justify-center font-bold">
                  {cartCount}
                </span>
              )}
            </div>
            <span className="hidden sm:inline">
              {cartCount === 0
                ? isPt
                  ? 'Carrinho'
                  : 'Cart'
                : formatCurrency(cartSubtotal, language)}
            </span>
          </button>
        </div>
      </div>
    </header>
  );
};
