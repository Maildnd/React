import type { ICampaignItem } from 'src/types/campaign';

import type {
  IContent,
  IDetails,
  ITargets,
  CampaignItem,
  ICompanyDetails,
} from '../types/campaign-context-type';

type CampaignRecord = {
  campaignRecord: ICampaignItem;
};

const useConvertCampaignRecord = async ({ campaignRecord }: CampaignRecord) => {
  const details = {
    title: campaignRecord.title,
    caption: campaignRecord.caption,
    description: campaignRecord.description,
    publish_type: campaignRecord.publish_type || 'now',
    start_date: campaignRecord.start_date || new Date().toISOString(),
    tags: campaignRecord.tags,
  } as IDetails;

  const content = {
    content_type: campaignRecord.content_type,
    images: await convertUrlToFiles(campaignRecord.images || []),
    images_url: campaignRecord.images || [],
    file: await convertUrlToFile(campaignRecord.file),
    file_url: campaignRecord.file,
    promotions: await convertUrlToFiles(campaignRecord.promotions || []),
    promotions_url: campaignRecord.promotions || [],
    coupons: await convertUrlToFiles(campaignRecord.coupons || []),
    coupons_url: campaignRecord.coupons || [],
  } as IContent;

  const targets = {
    target_type: campaignRecord.target_type,
    lat: campaignRecord.lat,
    lng: campaignRecord.lng,
    radius: campaignRecord.radius,
    zip_codes: campaignRecord.zip_codes,
    county: '',
    residents_count: campaignRecord.residents_count,
  } as ITargets;

  const companyDetails = {
    cover_image_url: '',
    socialNetworks: [],
    address: {
      country: '',
      state: '',
      city: '',
      street: '',
      street2: '',
      postal_code: '',
    },
    address_string: campaignRecord.address,
    phone: campaignRecord.phone,
    email: campaignRecord.email,
    website: campaignRecord.website || '',
    business_id: '',
  } as ICompanyDetails;

  const campaign = {
    details,
    content,
    targets,
    companyDetails,
    id: campaignRecord.id,
    status: campaignRecord.status,
  } as CampaignItem;

  return campaign;
};

export const useConvertContent = async ({ campaignRecord }: CampaignRecord) => {
  const content = {
    content_type: campaignRecord.content_type,
    images: await convertUrlToFiles(campaignRecord.images_url || []),
    images_url: campaignRecord.images_url || [],
    file: await convertUrlToFile(campaignRecord.file),
    file_url: campaignRecord.file,
    promotions: await convertUrlToFiles(campaignRecord.promotions || []),
    promotions_url: campaignRecord.promotions || [],
    coupons: await convertUrlToFiles(campaignRecord.coupons || []),
    coupons_url: campaignRecord.coupons || [],
  } as IContent;

  return content;
};

const convertUrlToFiles = (images: string[]) => {
  if (images.length === 0) return [] as File[];
  const imagesPromises = images.map(async (image) => {
    const response = await fetch(image);
    const blob = await response.blob();
    const fileName = image.split('/').pop() || 'image.jpg';
    const urlFile = new File([blob], fileName, { type: blob.type });
    console.log('urlFile', urlFile);
    return urlFile;
  });

  return Promise.all(imagesPromises);
};

const convertUrlToFile = async (image: string) => {
  if (!image) return {} as File;
  const response = await fetch(image);
  const blob = await response.blob();
  const fileName = image.split('/').pop() || 'image.jpg';
  const urlFile = new File([blob], fileName, {
    type: blob.type,
    lastModified: new Date().getTime(),
  });
  return urlFile;
};

export default useConvertCampaignRecord;
