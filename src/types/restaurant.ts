export type Language = 'pt' | 'en';
export type Theme = 'light' | 'dark';

export type MenuCategory = 
  | 'all'
  | 'frango'
  | 'pizza'
  | 'kebab'
  | 'combos'
  | 'drinks_desserts'
  | 'halal';

export interface PriceOption {
  size: 'single' | 'pq' | 'med' | 'gr' | 'dose' | 'meia_dose';
  labelPt: string;
  labelEn: string;
  price: number;
}

export interface MenuItem {
  id: string;
  number: number;
  namePt: string;
  nameEn: string;
  descriptionPt: string;
  descriptionEn: string;
  category: MenuCategory;
  prices: PriceOption[];
  image: string;
  isHalal: boolean;
  isSpicy?: boolean;
  isVegetarian?: boolean;
  badgePt?: string;
  badgeEn?: string;
  availableSauces?: { id: string; labelPt: string; labelEn: string }[];
  availableSides?: { id: string; labelPt: string; labelEn: string; extraPrice?: number }[];
}

export interface ComboDeal {
  id: string;
  number: number;
  namePt: string;
  nameEn: string;
  taglinePt: string;
  taglineEn: string;
  bundledItemsPt: string[];
  bundledItemsEn: string[];
  servesPt: string;
  servesEn: string;
  price: number;
  originalPrice?: number;
  image: string;
  isHalal: boolean;
  drinkOptionsPt: string[];
  drinkOptionsEn: string[];
  sideOptionsPt: string[];
  sideOptionsEn: string[];
}

export interface CartItem {
  cartId: string;
  itemId: string;
  number: number;
  namePt: string;
  nameEn: string;
  sizeLabelPt: string;
  sizeLabelEn: string;
  unitPrice: number;
  quantity: number;
  selectedSauce?: string;
  selectedSides?: string[];
  selectedDrinks?: string[];
  notes?: string;
}

export interface OrderDetails {
  customerName: string;
  phone: string;
  deliveryType: 'delivery' | 'takeaway';
  address: string;
  notes: string;
  paymentMethod: 'dinheiro' | 'multibanco' | 'mbway';
}
