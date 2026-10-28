import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateSubtotal,
  calculateDeliveryFee,
  calculateAmountForFreeDelivery,
  calculateTotal,
  formatCurrency,
  generateWhatsAppMessage,
  FREE_DELIVERY_THRESHOLD,
} from './cart.ts';
import type { CartItem, OrderDetails } from '../types/restaurant.ts';

const mockItems: CartItem[] = [
  {
    cartId: 'item-1',
    itemId: 'frango-1',
    number: 1,
    namePt: 'Frango Assado no Carvão',
    nameEn: 'Charcoal Spit-Roasted Chicken',
    sizeLabelPt: 'Inteiro',
    sizeLabelEn: 'Whole',
    unitPrice: 8.5,
    quantity: 2,
    selectedSauce: 'Piri-Piri Tradicional',
  },
  {
    cartId: 'item-2',
    itemId: 'pizza-1',
    number: 5,
    namePt: 'Pizza Rústica Portuguesa',
    nameEn: 'Rustic Portuguese Pizza',
    sizeLabelPt: 'Média (30cm)',
    sizeLabelEn: 'Medium (30cm)',
    unitPrice: 11.0,
    quantity: 1,
  },
];

test('calculateSubtotal sums unitPrice * quantity accurately', () => {
  const subtotal = calculateSubtotal(mockItems);
  // 8.5 * 2 + 11.0 * 1 = 17.0 + 11.0 = 28.0
  assert.equal(subtotal, 28.0);
});

test('calculateSubtotal handles empty cart', () => {
  assert.equal(calculateSubtotal([]), 0);
});

test('calculateDeliveryFee waives fee when threshold reached or takeaway selected', () => {
  // Above 12 threshold -> 0 fee
  assert.equal(calculateDeliveryFee(28.0, 'delivery'), 0);
  // Below 12 threshold -> 2.50 fee
  assert.equal(calculateDeliveryFee(8.5, 'delivery'), 2.5);
  // Exactly 12.0 threshold -> 0 fee
  assert.equal(calculateDeliveryFee(12.0, 'delivery'), 0);
  // Takeaway is always 0
  assert.equal(calculateDeliveryFee(5.0, 'takeaway'), 0);
});

test('calculateAmountForFreeDelivery returns remaining amount to threshold', () => {
  assert.equal(calculateAmountForFreeDelivery(10.0), 2.0);
  assert.equal(calculateAmountForFreeDelivery(15.0), 0);
  assert.equal(calculateAmountForFreeDelivery(12.0), 0);
});

test('calculateTotal sums subtotal and delivery fee', () => {
  assert.equal(calculateTotal(10.0, 2.5), 12.5);
  assert.equal(calculateTotal(25.0, 0), 25.0);
});

test('formatCurrency formats accurately for PT and EN', () => {
  assert.equal(formatCurrency(12.5, 'pt'), '12,50€');
  assert.equal(formatCurrency(12.5, 'en'), '€12.50');
});

test('generateWhatsAppMessage generates complete formatted order text', () => {
  const orderDetails: OrderDetails = {
    customerName: 'Manuel Silva',
    phone: '912345678',
    deliveryType: 'delivery',
    address: 'Av. da Liberdade 100, 2º Esq',
    notes: 'Campainha avariada, ligar ao chegar',
    paymentMethod: 'mbway',
  };

  const msgPt = generateWhatsAppMessage(mockItems, orderDetails, 'pt');
  assert.match(msgPt, /NOVO PEDIDO - FOME PIZZARIA & CHURRASQUEIRA/);
  assert.match(msgPt, /Manuel Silva/);
  assert.match(msgPt, /Frango Assado no Carvão/);
  assert.match(msgPt, /GRÁTIS/);
  assert.match(msgPt, /28,00€/);

  const msgEn = generateWhatsAppMessage(mockItems, orderDetails, 'en');
  assert.match(msgEn, /NEW ORDER - FOME PIZZERIA & CHURRASQUEIRA/);
  assert.match(msgEn, /Charcoal Spit-Roasted Chicken/);
  assert.match(msgEn, /FREE/);
  assert.match(msgEn, /€28\.00/);
});
