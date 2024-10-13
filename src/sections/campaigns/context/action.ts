import axios, { endpoints } from 'src/utils/axios';

export const getCampaigns = async (business_id: string) => {
  try {
    const res = await axios.post(endpoints.campaign.getCampaigns, { business_id });
    return res.data.campaigns;
  } catch (error) {
    const errorMessage = error.details;
    throw new Error(errorMessage);
  }
};

export const getResidentsCountByCoordinates = async (
  selectedlat: number,
  selectedlng: number,
  radius: number
) => {
  try {
    const params = {
      selectedlat,
      selectedlng,
      radius,
    };
    const res = await axios.post(endpoints.campaign.getResidentsCountByCoordinates, params);
    return res.data.residents;
  } catch (error) {
    const errorMessage = error.details;
    throw new Error(errorMessage);
  }
};

export const getZipCodes = async () => {
  try {
    const res = await axios.get(endpoints.campaign.getZipCodes);
    return res.data.zip_codes;
  } catch (error) {
    const errorMessage = error.details;
    throw new Error(errorMessage);
  }
};

export const getResidentsCountByZipCodes = async (zip_codes: string[]) => {
  try {
    const res = await axios.post(endpoints.campaign.getResidentsCountByZipCodes, {
      zip_codes,
    });
    return res.data.residents;
  } catch (error) {
    const errorMessage = error.details;
    throw new Error(errorMessage);
  }
};

export const createCampaign = async (data: any) => {
  try {
    const campaignData = new FormData();
    campaignData.append('finalData', JSON.stringify(data));
    if (data.images.length > 0) {
      data.images.forEach((image: File) => {
        campaignData.append('images_files', image);
      });
    }

    if (data.file) {
      campaignData.append('pdf_files', data.file);
    }

    if (data.coupons.length > 0) {
      data.coupons.forEach((coupon: File) => {
        campaignData.append('coupon_files', coupon);
      });
    }
    if (data.promotions.length > 0) {
      data.promotions.forEach((promotion: File) => {
        campaignData.append('promotion_files', promotion);
      });
    }

    console.log('Create campaign data:', campaignData);

    const res = await axios.post(endpoints.campaign.create, campaignData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data;
  } catch (error) {
    const errorMessage = error.details;
    throw new Error(errorMessage);
  }
};

export const publishCampaign = async (campaign_id: string, publish_type: string) => {
  try {
    const params = {
      campaign_id,
      publish_type,
    };
    const res = await axios.post(endpoints.campaign.publish, params);
    return res.data.residents;
  } catch (error) {
    const errorMessage = error.details;
    throw new Error(errorMessage);
  }
};

export const getTargetCoordinates = async (address: string) => {
  try {
    const res = await axios.post(endpoints.campaign.getTargetCoordinates, { address });
    return res.data.coordinates;
  } catch (error) {
    const errorMessage = error.details;
    throw new Error(errorMessage);
  }
};
