import type { BusinessDetails, SubscriptionPlanOption } from './static';

// ----------------------------------------------------------------------

export type AccountState = {
  businessDetails: BusinessDetails;
  availablePlans: SubscriptionPlanOption[];
  selectedPlanId: SubscriptionPlanOption;
};

export type AccountContextValue = AccountState & {
  onSetAvailablePlans: (availablePlans: SubscriptionPlanOption[]) => void;
  onUpdateBusinessDetails: (businessDetails: BusinessDetails) => void;
};
