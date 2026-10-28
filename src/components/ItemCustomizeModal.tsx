import React, { useState } from 'react';
import { X, Plus, Minus, Check, Flame } from 'lucide-react';
import type { ComboDeal, Language, MenuItem, Theme, CartItem } from '../types/restaurant.ts';
import { formatCurrency } from '../utils/cart.ts';

interface ItemCustomizeModalProps {
  item: MenuItem | null;
  combo: ComboDeal | null;
  initialSizeIndex?: number;
  language: Language;
  theme: Theme;
  onClose: () => void;
  onAddToCart: (cartItem: CartItem) => void;
}

export const ItemCustomizeModal: React.FC<ItemCustomizeModalProps> = ({
  item,
  combo,
  initialSizeIndex = 0,
  language,
  theme,
  onClose,
  onAddToCart,
}) => {
  const isPt = language === 'pt';
  const isCombo = !!combo;

  // States
  const [selectedSizeIndex, setSelectedSizeIndex] = useState(initialSizeIndex);
  const [quantity, setQuantity] = useState(1);
  const [selectedSauce, setSelectedSauce] = useState<string>(
    item?.availableSauces?.[1]?.labelPt || ''
  );
  const [selectedSides, setSelectedSides] = useState<string[]>([]);
  const [selectedDrinks, setSelectedDrinks] = useState<string[]>([]);
  const [notes, setNotes] = useState('');

  if (!item && !combo) return null;

  // Pricing calculations
  const basePrice = isCombo
    ? combo.price
    : item!.prices[selectedSizeIndex]?.price || 0;

  // Extra sides prices
  const extraSidesCost = selectedSides.reduce((acc, sideLabel) => {
    const found = item?.availableSides?.find(
      (s) => (isPt ? s.labelPt : s.labelEn) === sideLabel
    );
    return acc + (found?.extraPrice || 0);
  }, 0);

  const unitPrice = basePrice + extraSidesCost;
  const totalPrice = unitPrice * quantity;

  const handleToggleSide = (sideLabel: string) => {
    setSelectedSides((prev) =>
      prev.includes(sideLabel)
        ? prev.filter((s) => s !== sideLabel)
        : [...prev, sideLabel]
    );
  };

  const handleToggleDrink = (drinkName: string) => {
    setSelectedDrinks((prev) => {
      if (prev.includes(drinkName)) {
        return prev.filter((d) => d !== drinkName);
      }
      // Allow up to 2 drinks for combo
      if (prev.length < 2) {
        return [...prev, drinkName];
      }
      return [prev[1], drinkName];
    });
  };

  const handleAdd = () => {
    if (isCombo) {
      const cartItem: CartItem = {
        cartId: `combo-${combo.id}-${Date.now()}`,
        itemId: combo.id,
        number: combo.number,
        namePt: combo.namePt,
        nameEn: combo.nameEn,
        sizeLabelPt: combo.servesPt,
        sizeLabelEn: combo.servesEn,
        unitPrice: combo.price,
        quantity,
        selectedDrinks: selectedDrinks.length > 0 ? selectedDrinks : [combo.drinkOptionsPt[0]],
        selectedSides: selectedSides.length > 0 ? selectedSides : [combo.sideOptionsPt[0]],
        notes: notes.trim(),
      };
      onAddToCart(cartItem);
    } else {
      const selectedSize = item!.prices[selectedSizeIndex];
      const cartItem: CartItem = {
        cartId: `item-${item!.id}-${selectedSize.size}-${Date.now()}`,
        itemId: item!.id,
        number: item!.number,
        namePt: item!.namePt,
        nameEn: item!.nameEn,
        sizeLabelPt: selectedSize.labelPt,
        sizeLabelEn: selectedSize.labelEn,
        unitPrice,
        quantity,
        selectedSauce: selectedSauce || undefined,
        selectedSides: selectedSides.length > 0 ? selectedSides : undefined,
        notes: notes.trim(),
      };
      onAddToCart(cartItem);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div
        className={`relative w-full max-w-lg rounded-2xl overflow-hidden shadow-2xl border my-8 transition-colors ${
          theme === 'dark'
            ? 'bg-[#290d13] border-[#551823] text-[#fffdf9]'
            : 'bg-[#fffdf9] border-[#ebe4d5] text-[#211b1b]'
        }`}
      >
        {/* Header bar with photo banner */}
        <div className="relative aspect-16/9 w-full bg-[#1e070b]">
          <img
            src={isCombo ? combo.image : item!.image}
            alt={isPt ? (isCombo ? combo.namePt : item!.namePt) : isCombo ? combo.nameEn : item!.nameEn}
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

          {/* Close button */}
          <button
            type="button"
            onClick={onClose}
            aria-label="Fechar"
            className="absolute top-3 right-3 p-2 rounded-full bg-black/50 text-white hover:bg-black/80 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Title overlay */}
          <div className="absolute bottom-3 left-4 right-4 text-white">
            <span className="text-xs font-bold font-price uppercase tracking-wider text-amber-400">
              {isCombo
                ? isPt ? 'Combo Especial de Partilha' : 'Special Sharing Combo'
                : isPt ? 'Prato Artesanal' : 'Artisanal Dish'}
            </span>
            <h2 className="text-xl sm:text-2xl font-bold font-display leading-tight">
              {isPt ? (isCombo ? combo.namePt : item!.namePt) : isCombo ? combo.nameEn : item!.nameEn}
            </h2>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 space-y-5 max-h-[60vh] overflow-y-auto">
          {/* Description */}
          <p className="text-sm text-[#554242] dark:text-[#dbc0c0] leading-relaxed">
            {isPt
              ? (isCombo ? combo.taglinePt : item!.descriptionPt)
              : isCombo ? combo.taglineEn : item!.descriptionEn}
          </p>

          {/* Single/Multi-size Selector (if standard item) */}
          {!isCombo && item!.prices.length > 1 && (
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider font-price text-[#5a101a] dark:text-amber-400 block">
                {isPt ? 'Escolha o Tamanho / Dose' : 'Choose Size / Portion'}
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {item!.prices.map((p, idx) => (
                  <button
                    key={p.size}
                    type="button"
                    onClick={() => setSelectedSizeIndex(idx)}
                    className={`p-2.5 rounded-lg border text-left flex flex-col justify-between transition-all cursor-pointer ${
                      selectedSizeIndex === idx
                        ? 'border-[#e5a93c] bg-[#e5a93c]/15 text-[#211b1b] dark:text-white font-bold ring-1 ring-[#e5a93c]'
                        : theme === 'dark'
                        ? 'border-[#4a161f] bg-[#341118] text-[#d6c4c2] hover:bg-[#3f161f]'
                        : 'border-[#ebe4d5] bg-[#f7f3e9] text-[#453836] hover:bg-[#efe7d7]'
                    }`}
                  >
                    <span className="text-xs">{isPt ? p.labelPt : p.labelEn}</span>
                    <span className="font-bold font-price text-sm mt-1 text-[#5a101a] dark:text-amber-400">
                      {formatCurrency(p.price, language)}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Sauces / Piri-Piri if available */}
          {!isCombo && item!.availableSauces && item!.availableSauces.length > 0 && (
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider font-price text-[#5a101a] dark:text-amber-400 flex items-center gap-1.5">
                <Flame className="w-3.5 h-3.5" />
                <span>{isPt ? 'Tempero / Molho Piri-Piri' : 'Spice / Piri-Piri Sauce'}</span>
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {item!.availableSauces.map((sauce) => {
                  const label = isPt ? sauce.labelPt : sauce.labelEn;
                  const isSelected = selectedSauce === label;
                  return (
                    <button
                      key={sauce.id}
                      type="button"
                      onClick={() => setSelectedSauce(label)}
                      className={`p-2 rounded-lg text-xs font-medium border text-center transition-all ${
                        isSelected
                          ? 'border-[#e5a93c] bg-[#e5a93c]/15 font-bold text-[#5a101a] dark:text-amber-400 ring-1 ring-[#e5a93c]'
                          : theme === 'dark'
                          ? 'border-[#4a161f] bg-[#341118] text-[#d6c4c2]'
                          : 'border-[#ebe4d5] bg-[#f7f3e9] text-[#453836]'
                      }`}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Extra sides if available for standard item */}
          {!isCombo && item!.availableSides && item!.availableSides.length > 0 && (
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider font-price text-[#5a101a] dark:text-amber-400 block">
                {isPt ? 'Acompanhamentos Opcionais (+2,00€)' : 'Optional Extra Sides (+€2.00)'}
              </label>
              <div className="space-y-1.5">
                {item!.availableSides.map((side) => {
                  const label = isPt ? side.labelPt : side.labelEn;
                  const isChecked = selectedSides.includes(label);
                  return (
                    <button
                      key={side.id}
                      type="button"
                      onClick={() => handleToggleSide(label)}
                      className={`w-full p-2.5 rounded-lg border text-xs flex items-center justify-between transition-all ${
                        isChecked
                          ? 'border-[#e5a93c] bg-[#e5a93c]/15 font-bold'
                          : theme === 'dark'
                          ? 'border-[#4a161f] bg-[#341118]'
                          : 'border-[#ebe4d5] bg-[#f7f3e9]'
                      }`}
                    >
                      <span>{label}</span>
                      <div className="flex items-center gap-2">
                        <span className="font-price font-bold text-[#5a101a] dark:text-amber-400">
                          +{formatCurrency(side.extraPrice || 0, language)}
                        </span>
                        <div
                          className={`w-4 h-4 rounded flex items-center justify-center border ${
                            isChecked ? 'bg-[#5a101a] border-[#5a101a] text-white' : 'border-stone-400'
                          }`}
                        >
                          {isChecked && <Check className="w-3 h-3" />}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Combo Drinks and Side options */}
          {isCombo && (
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold uppercase tracking-wider font-price text-[#5a101a] dark:text-amber-400 block mb-2">
                  {isPt ? 'Escolha 2 Refrigerantes' : 'Select 2 Soft Drinks'}
                </label>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {(isPt ? combo.drinkOptionsPt : combo.drinkOptionsEn).map((drink) => {
                    const isSelected = selectedDrinks.includes(drink);
                    return (
                      <button
                        key={drink}
                        type="button"
                        onClick={() => handleToggleDrink(drink)}
                        className={`p-2 rounded-lg border text-left transition-all ${
                          isSelected
                            ? 'border-[#e5a93c] bg-[#e5a93c]/15 font-bold ring-1 ring-[#e5a93c]'
                            : theme === 'dark'
                            ? 'border-[#4a161f] bg-[#341118]'
                            : 'border-[#ebe4d5] bg-[#f7f3e9]'
                        }`}
                      >
                        {drink}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Notes field */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-[#554242] dark:text-[#dbc0c0] block">
              {isPt ? 'Instruções especiais (opcional)' : 'Special requests (optional)'}
            </label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder={isPt ? 'Ex: molho à parte, bem passado...' : 'E.g., sauce on the side, well done...'}
              className={`w-full px-3 py-2 rounded-lg border text-xs outline-none transition-colors ${
                theme === 'dark'
                  ? 'bg-[#1e070b] border-[#4a161f] text-white focus:border-amber-400'
                  : 'bg-white border-[#ebe4d5] text-[#211b1b] focus:border-[#5a101a]'
              }`}
            />
          </div>
        </div>

        {/* Modal Footer with Quantity and Add Button */}
        <div
          className={`p-4 border-t flex items-center justify-between gap-4 ${
            theme === 'dark'
              ? 'bg-[#22090e] border-[#4a161f]'
              : 'bg-[#f7f3e9] border-[#ebe4d5]'
          }`}
        >
          {/* Quantity Stepper */}
          <div className="flex items-center gap-2 border border-stone-300 dark:border-stone-700 rounded-lg p-1">
            <button
              type="button"
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              disabled={quantity <= 1}
              className="w-7 h-7 rounded flex items-center justify-center hover:bg-stone-200 dark:hover:bg-stone-800 disabled:opacity-40"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            <span className="w-7 text-center font-bold font-price text-sm">{quantity}</span>
            <button
              type="button"
              onClick={() => setQuantity((q) => q + 1)}
              className="w-7 h-7 rounded flex items-center justify-center hover:bg-stone-200 dark:hover:bg-stone-800"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Add to Cart Button */}
          <button
            type="button"
            onClick={handleAdd}
            className="flex-1 py-3 px-4 rounded-xl bg-[#e5a93c] hover:bg-[#d49527] text-[#211b1b] font-bold text-sm font-price transition-transform active:scale-98 flex items-center justify-between shadow-md"
          >
            <span>{isPt ? 'Adicionar ao Pedido' : 'Add to Order'}</span>
            <span className="font-extrabold">{formatCurrency(totalPrice, language)}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
