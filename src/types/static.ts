export type SubscriptionPlanOption = {
  id: string;
  name: string;
  price: number;
  description: [{ value: string; id: string }];
};

export type DiscountCode = {
  id: string;
  name: string;
  percent: number;
  description: string;
};

export type BusinessDetails = {
  name: string;
  email: string;
  phone: string;
  website: URL;
  street: string;
  street2: string;
  city: string;
  state: string;
  zip_code: string;
  country: string;
  cover_image: File | null;
};
