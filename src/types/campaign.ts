import type { IDateValue } from './common';

// ----------------------------------------------------------------------

export type ICampaignFilters = {
  rating: string;
  gender: string[];
  category: string;
  colors: string[];
  priceRange: number[];
};

export type ICampaignTableFilters = {
  status: string[];
};

export type ICampaignReviewNewForm = {
  rating: number | null;
  review: string;
  name: string;
  email: string;
};

export type ICampaignItem = {
  id: string;
  name: string;
  title: string;
  caption: string;
  description: string;
  cover_image: string;
  content_type: string;
  publish_type: string;
  images: string[];
  images_url: string[];
  file: string;
  promotions: string[];
  coupons: string[];
  tags: string[];
  target_type: string;
  address: string;
  phone: string;
  email: string;
  website: URL;
  lat: number;
  lng: number;
  radius: number;
  zip_codes: string[];
  start_date: IDateValue;
  end_date: IDateValue;
  status: string;
  residents_count: number;
};
