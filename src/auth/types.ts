import type { SubscriptionPlanOption } from 'src/types/static';

export type UserType = Record<string, any> | null;

export type AuthState = {
  user: UserType;
  loading: boolean;
  subscriptionPlans: SubscriptionPlanOption[];
};

export type AuthContextValue = {
  user: UserType;
  loading: boolean;
  authenticated: boolean;
  unauthenticated: boolean;
  profileComplete: boolean;
  plans: SubscriptionPlanOption[];
  checkUserSession?: () => Promise<void>;
  setUserSession?: (user: UserType) => void;
};
