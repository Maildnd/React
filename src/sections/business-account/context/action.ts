import type { BusinessDetails } from 'src/types/static';

import axios, { endpoints } from 'src/utils/axios';

export type SetupContextActionProps = {
  details: BusinessDetails;
};

export const updateBusinessAccount = async (details: BusinessDetails) => {
  try {
    const setupData = new FormData();
    setupData.append('businessDetails', JSON.stringify(details));
    if (typeof details.cover_image !== 'string') {
      setupData.append('cover_image', details.cover_image as File);
    }
    const res = await axios.post(endpoints.business_account.updateDetails, setupData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });

    console.log('Complete setup response:', res.data);
    return res.data;
  } catch (error) {
    console.error('Error during complete setup:', error);
    throw error;
  }
};
