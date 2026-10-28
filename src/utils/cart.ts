import type { CartItem, Language, OrderDetails } from '../types/restaurant.js';

export const FREE_DELIVERY_THRESHOLD = 12.0;
export const STANDARD_DELIVERY_FEE = 2.5;
export const RESTAURANT_PHONE = '351912345678';
export const RESTAURANT_ADDRESS = 'Rua do Forno & Grelha, 42, Lisboa';
export const RESTAURANT_NAME_PT = 'Fome Pizzaria & Churrasqueira';
export const RESTAURANT_NAME_EN = 'Fome Pizzeria & Churrasqueira';
export const RESTAURANT_DOMAIN = 'www.fomepizzariaechurasqueira.com';
export const RESTAURANT_URL = 'http://www.fomepizzariaechurasqueira.com/';

/**
 * Calculates subtotal for all items in the cart
 */
export function calculateSubtotal(items: CartItem[]): number {
  const sum = items.reduce((acc, item) => {
    return acc + item.unitPrice * item.quantity;
  }, 0);
  return Math.round(sum * 100) / 100;
}

/**
 * Calculates delivery fee based on order type and subtotal
 */
export function calculateDeliveryFee(
  subtotal: number,
  deliveryType: 'delivery' | 'takeaway',
  threshold: number = FREE_DELIVERY_THRESHOLD,
  baseFee: number = STANDARD_DELIVERY_FEE
): number {
  if (deliveryType === 'takeaway') {
    return 0;
  }
  if (subtotal >= threshold) {
    return 0;
  }
  return baseFee;
}

/**
 * Calculates remaining amount to reach free delivery
 */
export function calculateAmountForFreeDelivery(
  subtotal: number,
  threshold: number = FREE_DELIVERY_THRESHOLD
): number {
  if (subtotal >= threshold) {
    return 0;
  }
  return Math.round((threshold - subtotal) * 100) / 100;
}

/**
 * Calculates final total
 */
export function calculateTotal(subtotal: number, deliveryFee: number): number {
  return Math.round((subtotal + deliveryFee) * 100) / 100;
}

/**
 * Formats EUR currency
 */
export function formatCurrency(amount: number, language: Language = 'pt'): string {
  if (language === 'pt') {
    return `${amount.toFixed(2).replace('.', ',')}€`;
  }
  return `€${amount.toFixed(2)}`;
}

/**
 * Generates structured, url-encoded or plaintext WhatsApp order message
 */
export function generateWhatsAppMessage(
  items: CartItem[],
  orderDetails: OrderDetails,
  language: Language
): string {
  const subtotal = calculateSubtotal(items);
  const deliveryFee = calculateDeliveryFee(subtotal, orderDetails.deliveryType);
  const total = calculateTotal(subtotal, deliveryFee);

  if (language === 'pt') {
    let msg = `*NOVO PEDIDO - FOME PIZZARIA & CHURRASQUEIRA*\n`;
    msg += `🌐 ${RESTAURANT_DOMAIN}\n`;
    msg += `------------------------------\n`;
    msg += `*Cliente:* ${orderDetails.customerName || 'Não especificado'}\n`;
    msg += `*Telefone:* ${orderDetails.phone || 'Não especificado'}\n`;
    msg += `*Tipo:* ${orderDetails.deliveryType === 'delivery' ? 'Entrega ao Domicílio' : 'Takeaway (Levantamento)'}\n`;
    if (orderDetails.deliveryType === 'delivery') {
      msg += `*Morada:* ${orderDetails.address || 'Não especificada'}\n`;
    }
    msg += `*Pagamento:* ${orderDetails.paymentMethod.toUpperCase()}\n`;
    if (orderDetails.notes) {
      msg += `*Observações:* ${orderDetails.notes}\n`;
    }
    msg += `------------------------------\n`;
    msg += `*ITENS DO PEDIDO:*\n`;

    items.forEach((item, index) => {
      msg += `${index + 1}. ${item.quantity}x ${item.namePt} (${item.sizeLabelPt}) — ${formatCurrency(item.unitPrice * item.quantity, 'pt')}\n`;
      if (item.selectedSauce) {
        msg += `   • Molho: ${item.selectedSauce}\n`;
      }
      if (item.selectedSides && item.selectedSides.length > 0) {
        msg += `   • Acompanhamentos: ${item.selectedSides.join(', ')}\n`;
      }
      if (item.selectedDrinks && item.selectedDrinks.length > 0) {
        msg += `   • Bebidas: ${item.selectedDrinks.join(', ')}\n`;
      }
      if (item.notes) {
        msg += `   • Obs: ${item.notes}\n`;
      }
    });

    msg += `------------------------------\n`;
    msg += `*Subtotal:* ${formatCurrency(subtotal, 'pt')}\n`;
    msg += `*Taxa de Entrega:* ${deliveryFee === 0 ? 'GRÁTIS' : formatCurrency(deliveryFee, 'pt')}\n`;
    msg += `*TOTAL A PAGAR:* ${formatCurrency(total, 'pt')}\n`;
    msg += `------------------------------\n`;
    msg += `Aguardamos a confirmação. Muito obrigado!`;
    return msg;
  } else {
    let msg = `*NEW ORDER - FOME PIZZERIA & CHURRASQUEIRA*\n`;
    msg += `🌐 ${RESTAURANT_DOMAIN}\n`;
    msg += `------------------------------\n`;
    msg += `*Customer:* ${orderDetails.customerName || 'Not specified'}\n`;
    msg += `*Phone:* ${orderDetails.phone || 'Not specified'}\n`;
    msg += `*Type:* ${orderDetails.deliveryType === 'delivery' ? 'Home Delivery' : 'Takeaway (Pickup)'}\n`;
    if (orderDetails.deliveryType === 'delivery') {
      msg += `*Address:* ${orderDetails.address || 'Not specified'}\n`;
    }
    msg += `*Payment:* ${orderDetails.paymentMethod.toUpperCase()}\n`;
    if (orderDetails.notes) {
      msg += `*Notes:* ${orderDetails.notes}\n`;
    }
    msg += `------------------------------\n`;
    msg += `*ORDER ITEMS:*\n`;

    items.forEach((item, index) => {
      msg += `${index + 1}. ${item.quantity}x ${item.nameEn} (${item.sizeLabelEn}) — ${formatCurrency(item.unitPrice * item.quantity, 'en')}\n`;
      if (item.selectedSauce) {
        msg += `   • Sauce: ${item.selectedSauce}\n`;
      }
      if (item.selectedSides && item.selectedSides.length > 0) {
        msg += `   • Sides: ${item.selectedSides.join(', ')}\n`;
      }
      if (item.selectedDrinks && item.selectedDrinks.length > 0) {
        msg += `   • Drinks: ${item.selectedDrinks.join(', ')}\n`;
      }
      if (item.notes) {
        msg += `   • Notes: ${item.notes}\n`;
      }
    });

    msg += `------------------------------\n`;
    msg += `*Subtotal:* ${formatCurrency(subtotal, 'en')}\n`;
    msg += `*Delivery Fee:* ${deliveryFee === 0 ? 'FREE' : formatCurrency(deliveryFee, 'en')}\n`;
    msg += `*TOTAL PAYABLE:* ${formatCurrency(total, 'en')}\n`;
    msg += `------------------------------\n`;
    msg += `Awaiting confirmation. Thank you!`;
    return msg;
  }
}

/**
 * Creates the full whatsapp web/api URL
 */
export function getWhatsAppUrl(
  items: CartItem[],
  orderDetails: OrderDetails,
  language: Language,
  phone: string = RESTAURANT_PHONE
): string {
  const text = generateWhatsAppMessage(items, orderDetails, language);
  return `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
}
