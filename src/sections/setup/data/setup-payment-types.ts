import type { ISetupCardOption, ISetupPaymentOption } from 'src/types/setup';

export const PAYMENT_OPTIONS: ISetupPaymentOption[] = [
  {
    value: 'creditcard',
    label: 'Credit / Debit card',
    description: 'We support Mastercard, Visa, Discover and Stripe.',
    available: true,
  },
];

export const CARD_OPTIONS: ISetupCardOption[] = [
  { value: 'visa1', label: '**** **** **** 1212 - Jimmy Holland' },
  { value: 'visa2', label: '**** **** **** 2424 - Shawn Stokes' },
  { value: 'mastercard', label: '**** **** **** 4545 - Cole Armstrong' },
];
