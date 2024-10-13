import type { BusinessDetails } from 'src/types/static';

import axios, { endpoints } from 'src/utils/axios';

export type SetupContextActionProps = {
  details: BusinessDetails;
};

export const completeSetup = async (details: BusinessDetails) => {
  try {
    const setupData = new FormData();
    setupData.append('businessDetails', JSON.stringify(details));
    setupData.append('cover_image', details.cover_image as File);
    const res = await axios.post(endpoints.account_setup.complete, setupData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });

    return res.data;
  } catch (error) {
    const errorMessage = error.details;
    throw new Error(errorMessage);
  }
};
