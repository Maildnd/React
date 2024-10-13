import type { DiscountCode, BusinessDetails, SubscriptionPlanOption } from './static';

// ----------------------------------------------------------------------

export type ISetupBusinessDetails = BusinessDetails & {
  user_id: string;
};

export type ISetupPaymentDetails = {
  cardNumber: string;
  expirationDate: string;
  cvv: string;
  cardHolder: string;
  street: string;
  street2: string;
  city: string;
  state: string;
  zip_code: string;
  country: string;
};

export type ISetupPaymentOption = {
  value: string;
  label: string;
  description: string;
  available: boolean;
};

export type ISetupCardOption = {
  value: string;
  label: string;
};

export type ISetupState = {
  businessDetails: ISetupBusinessDetails;
  availablePlans: SubscriptionPlanOption[];
  selectedPlan: SubscriptionPlanOption;
  paymentDetails: ISetupPaymentDetails;
  discountCodes: DiscountCode[];
  selectedDiscountCode: DiscountCode | null;
};

export type SetupContextValue = ISetupState & {
  canReset: boolean;
  onReset: () => void;
  onUpdate: (updateValue: Partial<ISetupState>) => void;
  onUpdateField: (name: keyof ISetupState, updateValue: ISetupState[keyof ISetupState]) => void;
  //
  completed: boolean;
  onSetAvailablePlans: (availablePlans: SubscriptionPlanOption[]) => void;
  onSelectPlan: (planId: string) => void;
  onUpdateBusinessDetails: (businessDetails: ISetupBusinessDetails) => void;
  onSetDiscountCodes: (discountCodes: DiscountCode[]) => void;
  onSelectDiscountCode: (discountCode: DiscountCode) => void;
  onUpdatePaymentDetails: (paymentDetails: ISetupPaymentDetails) => void;

  //
  activeStep: number;
  initialStep: () => void;
  onBackStep: () => void;
  onNextStep: () => void;
  onGotoStep: (step: number) => void;
};
