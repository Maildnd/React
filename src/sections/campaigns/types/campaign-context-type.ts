import type { ICampaignItem } from 'src/types/campaign';

export type IDetails = {
  name: string;
  title: string;
  caption: string;
  description: string;
  publish_type: string;
  start_date: string;
  tags: string[];
};

export type IContent = {
  content_type: string;
  images: File[];
  images_url: string[];
  file: File;
  file_url: string;
  promotions: File[];
  promotions_url: string[];
  coupons: File[];
  coupons_url: string[];
};

export type ITargets = {
  target_type: string;
  lat: number;
  lng: number;
  radius: number;
  zip_codes: string[];
  county: string;
  residents_count: number;
};

export type ZipCode = {
  code: string;
  county: string;
  state: string;
  id: string;
  name: string;
};

export type ICompanyDetails = {
  cover_image_url: string;
  socialNetworks: string[];
  address: {
    country: string;
    state: string;
    city: string;
    street: string;
    street2: string;
    postal_code: string;
  };
  address_string: string;
  phone: string;
  email: string;
  website: URL;
  business_id: string;
};

export type CampaignItem = {
  details: IDetails;
  content: IContent;
  targets: ITargets;
  companyDetails: ICompanyDetails;
  id: string;
  status: string;
};

export type CreateCampaignState = {
  newCampaign: CampaignItem;
  zip_codes_list: ZipCode[];
};

export type CreateCampaignContextValue = CreateCampaignState & {
  canReset: boolean;
  zip_codes_list: ZipCode[];
  onReset: () => void;
  onUpdate: (updateValue: Partial<CreateCampaignState>) => void;
  onUpdateField: (
    name: keyof CreateCampaignState,
    updateValue: CreateCampaignState[keyof CreateCampaignState]
  ) => void;
  //
  completed: boolean;

  //
  onSetCampaignDetails: (details: IDetails) => void;
  onSetCampaignContent: (content: IContent) => void;
  onSetCampaignTargets: (targets: ITargets) => void;
  onSetCompanyDetails: (companyDetails: ICompanyDetails) => void;
  onSetCampaignItem: (newCampaign: CampaignItem) => void;
  onSetCampaignId: (id: string) => void;
  onSetZipCodes: (zipCodes: ZipCode[]) => void;

  //
  activeStep: number;
  initialStep: () => void;
  onBackStep: () => void;
  onNextStep: () => void;
  onGotoStep: (step: number) => void;
};

export type GetCampaignsState = {
  campaigns: ICampaignItem[];
};

export type GetCampaignsContextValue = GetCampaignsState & {
  onSetCampaigns: (campaigns: ICampaignItem[]) => void;
};
