/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { Search, Flame, Sparkles } from 'lucide-react';
import type { CartItem, ComboDeal, Language, MenuCategory, MenuItem, OrderDetails, Theme } from './types/restaurant.ts';
import { MENU_ITEMS, COMBO_DEALS } from './data/menuData.ts';
import { Header } from './components/Header.tsx';
import { FreeDeliveryBanner } from './components/FreeDeliveryBanner.tsx';
import { HeroSection } from './components/HeroSection.tsx';
import { CategoryChips } from './components/CategoryChips.tsx';
import { ComboDealsSection } from './components/ComboDealsSection.tsx';
import { MenuGrid } from './components/MenuGrid.tsx';
import { ItemCustomizeModal } from './components/ItemCustomizeModal.tsx';
import { CartDrawer } from './components/CartDrawer.tsx';
import { OrderConfirmationModal } from './components/OrderConfirmationModal.tsx';
import { AboutSection } from './components/AboutSection.tsx';
import { Footer } from './components/Footer.tsx';
import { StickyMobileBar } from './components/StickyMobileBar.tsx';
import { calculateSubtotal, getWhatsAppUrl } from './utils/cart.ts';

export default function App() {
  // Language: English and Portuguese only
  const [language, setLanguage] = useState<Language>('pt');

  // Theme: Light & Dark mode
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('sabor_rustico_theme') as Theme;
      if (saved === 'light' || saved === 'dark') return saved;
      if (window.matchMedia('(prefers-color-scheme: dark)').matches) return 'dark';
    }
    return 'light';
  });

  // Category and Search filter
  const [activeCategory, setActiveCategory] = useState<MenuCategory>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Cart state
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('sabor_rustico_cart');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch {
          return [];
        }
      }
    }
    return [];
  });

  // Modals & Drawers
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedItemForModal, setSelectedItemForModal] = useState<MenuItem | null>(null);
  const [selectedComboForModal, setSelectedComboForModal] = useState<ComboDeal | null>(null);
  const [modalDefaultSizeIndex, setModalDefaultSizeIndex] = useState(0);

  // Confirmed Order State
  const [confirmedOrder, setConfirmedOrder] = useState<OrderDetails | null>(null);
  const [isConfirmedModalOpen, setIsConfirmedModalOpen] = useState(false);

  // Sync theme to root class and localStorage
  useEffect(() => {
    localStorage.setItem('sabor_rustico_theme', theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  // Persist cart
  useEffect(() => {
    localStorage.setItem('sabor_rustico_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const isPt = language === 'pt';

  // Filtered menu items
  const filteredItems = useMemo(() => {
    return MENU_ITEMS.filter((item) => {
      // Category check
      if (activeCategory === 'halal') {
        if (!item.isHalal) return false;
      } else if (activeCategory === 'combos') {
        return false; // Handled in dedicated combos section
      } else if (activeCategory !== 'all' && item.category !== activeCategory) {
        return false;
      }

      // Search query check
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const matchesName =
          item.namePt.toLowerCase().includes(query) ||
          item.nameEn.toLowerCase().includes(query);
        const matchesDesc =
          item.descriptionPt.toLowerCase().includes(query) ||
          item.descriptionEn.toLowerCase().includes(query);
        const matchesNumber = item.number.toString() === query;
        return matchesName || matchesDesc || matchesNumber;
      }

      return true;
    });
  }, [activeCategory, searchQuery]);

  // Cart operations
  const handleAddToCart = (item: CartItem) => {
    setCartItems((prev) => {
      const existingIndex = prev.findIndex(
        (ci) =>
          ci.itemId === item.itemId &&
          ci.sizeLabelPt === item.sizeLabelPt &&
          ci.selectedSauce === item.selectedSauce &&
          JSON.stringify(ci.selectedSides || []) === JSON.stringify(item.selectedSides || []) &&
          JSON.stringify(ci.selectedDrinks || []) === JSON.stringify(item.selectedDrinks || [])
      );

      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex].quantity += item.quantity;
        return updated;
      }
      return [...prev, item];
    });
    setIsCartOpen(true);
  };

  const handleUpdateQuantity = (cartId: string, delta: number) => {
    setCartItems((prev) =>
      prev
        .map((item) => {
          if (item.cartId === cartId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const handleRemoveItem = (cartId: string) => {
    setCartItems((prev) => prev.filter((item) => item.cartId !== cartId));
  };

  const handleClearCart = () => {
    setCartItems([]);
  };

  const handleConfirmOrder = (details: OrderDetails) => {
    setConfirmedOrder(details);
    setIsCartOpen(false);
    setIsConfirmedModalOpen(true);
  };

  const cartSubtotal = calculateSubtotal(cartItems);
  const cartCount = cartItems.reduce((acc, it) => acc + it.quantity, 0);

  // Quick navigation helpers
  const scrollToMenu = () => {
    const el = document.getElementById('cardapio');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToCombos = () => {
    setActiveCategory('combos');
    const el = document.getElementById('combos');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const handleDirectWhatsApp = () => {
    const dummyOrder: OrderDetails = {
      customerName: '',
      phone: '',
      deliveryType: 'delivery',
      address: '',
      notes: '',
      paymentMethod: 'mbway',
    };
    const url = getWhatsAppUrl(cartItems, dummyOrder, language);
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div
      className={`min-h-screen transition-colors duration-200 ${
        theme === 'dark' ? 'bg-[#190508] text-[#fffdf9]' : 'bg-[#fff8f6] text-[#1f1b1a]'
      }`}
    >
      {/* Top Free Delivery & Halal Banner */}
      <FreeDeliveryBanner language={language} theme={theme} />

      {/* Main Top Navigation Bar */}
      <Header
        language={language}
        onLanguageChange={setLanguage}
        theme={theme}
        onThemeToggle={toggleTheme}
        cartCount={cartCount}
        cartSubtotal={cartSubtotal}
        onOpenCart={() => setIsCartOpen(true)}
      />

      {/* Hero Section */}
      <HeroSection
        language={language}
        theme={theme}
        onExploreMenu={scrollToMenu}
        onExploreCombos={scrollToCombos}
        onDirectWhatsApp={handleDirectWhatsApp}
      />

      {/* Main Interactive Menu Board */}
      <main id="cardapio" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 scroll-mt-20">
        {/* Menu Section Header with Search Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold font-price uppercase tracking-wider text-[#5a101a] dark:text-amber-400">
              <Flame className="w-3.5 h-3.5 text-amber-500" />
              <span>{isPt ? 'Ementa Completa do Restaurante' : 'Full Restaurant Menu'}</span>
            </div>
            <h2
              className={`text-2xl sm:text-3xl font-extrabold font-display tracking-tight ${
                theme === 'dark' ? 'text-[#fffdf9]' : 'text-[#211b1b]'
              }`}
            >
              {isPt ? 'Grelhados, Pizzas & Especialidades' : 'Grill, Woodfire Pizzas & Specialties'}
            </h2>
          </div>

          {/* Search Bar */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={isPt ? 'Pesquisar prato ou nº...' : 'Search dish or number...'}
              className={`w-full pl-9 pr-4 py-2 rounded-xl text-xs sm:text-sm border outline-none transition-colors ${
                theme === 'dark'
                  ? 'bg-[#290d13] border-[#4a161f] text-white focus:border-amber-400 placeholder:text-stone-500'
                  : 'bg-white border-[#ebe4d5] text-[#211b1b] focus:border-[#5a101a] placeholder:text-stone-400'
              }`}
            />
          </div>
        </div>

        {/* Category Filter Chips */}
        <div className="mb-6">
          <CategoryChips
            activeCategory={activeCategory}
            onSelectCategory={setActiveCategory}
            language={language}
            theme={theme}
          />
        </div>

        {/* Two-tone Combo Deals Banner Section (visible when All or Combos is selected) */}
        {(activeCategory === 'all' || activeCategory === 'combos') && !searchQuery.trim() && (
          <ComboDealsSection
            language={language}
            theme={theme}
            onSelectCombo={(combo) => {
              setSelectedComboForModal(combo);
              setSelectedItemForModal(null);
            }}
          />
        )}

        {/* Standard Menu Item Cards Grid */}
        {activeCategory !== 'combos' && (
          <div className="mt-8 space-y-4">
            <div className="flex items-center justify-between border-b border-[#887272]/20 pb-2">
              <h3
                className={`text-lg font-bold font-display ${
                  theme === 'dark' ? 'text-[#f4c430]' : 'text-[#5a101a]'
                }`}
              >
                {isPt
                  ? activeCategory === 'all'
                    ? 'Pratos da Churrasqueira & Forno'
                    : 'Pratos Selecionados'
                  : activeCategory === 'all'
                  ? 'Grill & Oven Specialties'
                  : 'Selected Dishes'}
              </h3>
              <span className="text-xs text-[#887272] dark:text-[#dbc0c0] font-price">
                {filteredItems.length} {isPt ? 'opções' : 'items'}
              </span>
            </div>

            <MenuGrid
              items={filteredItems}
              language={language}
              theme={theme}
              onSelectItem={(item, defaultSizeIndex = 0) => {
                setSelectedItemForModal(item);
                setSelectedComboForModal(null);
                setModalDefaultSizeIndex(defaultSizeIndex);
              }}
            />
          </div>
        )}

        {/* About Restaurant, Charcoal Heritage & Location Section */}
        <AboutSection language={language} theme={theme} />
      </main>

      {/* Global Footer */}
      <Footer language={language} theme={theme} />

      {/* Sticky Mobile Bar (under 15% mobile viewport cap) */}
      <StickyMobileBar
        cartCount={cartCount}
        cartSubtotal={cartSubtotal}
        onOpenCart={() => setIsCartOpen(true)}
        language={language}
        theme={theme}
      />

      {/* Item & Combo Customization Modal */}
      {(selectedItemForModal || selectedComboForModal) && (
        <ItemCustomizeModal
          item={selectedItemForModal}
          combo={selectedComboForModal}
          initialSizeIndex={modalDefaultSizeIndex}
          language={language}
          theme={theme}
          onClose={() => {
            setSelectedItemForModal(null);
            setSelectedComboForModal(null);
          }}
          onAddToCart={handleAddToCart}
        />
      )}

      {/* Cart & Checkout Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onClearCart={handleClearCart}
        language={language}
        theme={theme}
        onConfirmOrder={handleConfirmOrder}
      />

      {/* Order Confirmation Live Tracking Modal */}
      <OrderConfirmationModal
        isOpen={isConfirmedModalOpen}
        onClose={() => {
          setIsConfirmedModalOpen(false);
          handleClearCart();
        }}
        orderDetails={confirmedOrder}
        items={cartItems}
        language={language}
        theme={theme}
      />
    </div>
  );
}
