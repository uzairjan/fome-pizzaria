import React from 'react';
import { CATEGORIES_DATA } from '../data/menuData.ts';
import type { Language, MenuCategory, Theme } from '../types/restaurant.ts';

interface CategoryChipsProps {
  activeCategory: MenuCategory;
  onSelectCategory: (cat: MenuCategory) => void;
  language: Language;
  theme: Theme;
}

export const CategoryChips: React.FC<CategoryChipsProps> = ({
  activeCategory,
  onSelectCategory,
  language,
  theme,
}) => {
  const isPt = language === 'pt';

  return (
    <div className="w-full overflow-x-auto pb-2 scrollbar-none">
      <div className="flex items-center gap-2 min-w-max py-1">
        {CATEGORIES_DATA.map((cat) => {
          const isSelected = activeCategory === cat.id;

          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => onSelectCategory(cat.id)}
              className={`px-4 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all whitespace-nowrap cursor-pointer select-none ${
                isSelected
                  ? 'bg-[#5a101a] text-white shadow-sm ring-2 ring-[#e5a93c]/50 font-bold'
                  : theme === 'dark'
                  ? 'bg-[#280c12] text-[#d6c4c2] hover:bg-[#38131a] hover:text-white border border-[#4a161f]'
                  : 'bg-[#f7f3e9] text-[#554242] hover:bg-[#ece4d3] hover:text-[#211b1b] border border-[#e2d8cb]'
              }`}
              aria-pressed={isSelected}
            >
              {isPt ? cat.namePt : cat.nameEn}
            </button>
          );
        })}
      </div>
    </div>
  );
};
