import type { DiscountCode, SubscriptionPlanOption } from 'src/types/static';
import type { SetupContextValue, ISetupPaymentDetails } from 'src/types/setup';

import axios, { endpoints } from 'src/utils/axios';

export const getAvailablePlans = async (setupContext: SetupContextValue) => {
  try {
    const res = await axios.get(endpoints.account_setup.plans);
    const availablePlans = res.data.subscription_plans as SubscriptionPlanOption[];
    setupContext.onSetAvailablePlans(availablePlans);
  } catch (error) {
    console.error('Error during get available plans:', error);
    throw error;
  }
};

export const getDiscountCodes = async (setupContext: SetupContextValue) => {
  try {
    const res = await axios.get(endpoints.account_setup.discountCodes);
    const discountCodes = res.data.discount_codes as DiscountCode[];
    setupContext.onSetDiscountCodes(discountCodes);

    return res.data;
  } catch (error) {
    console.error('Error during check discount code:', error);
    throw error;
  }
};

export const completeSetup = async (
  setupContext: SetupContextValue,
  paymentDetails: ISetupPaymentDetails
) => {
  try {
    const setupData = new FormData();
    setupData.append('businessDetails', JSON.stringify(setupContext.businessDetails));
    setupData.append('selectedPlanId', setupContext.selectedPlan.id);
    setupData.append('paymentDetails', JSON.stringify(paymentDetails));
    setupData.append(
      'discount_code_id',
      setupContext.selectedDiscountCode ? setupContext.selectedDiscountCode.id : ''
    );
    setupData.append('cover_image', setupContext.businessDetails.cover_image as File);
    const res = await axios.post(endpoints.account_setup.complete, setupData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });

    console.log('Complete setup response:', res.data);
    return res.data;
  } catch (error) {
    console.error('Error during complete setup:', error);
    throw error;
  }
};

export const uploadFileToServer = async (cover_image: File) => {
  try {
    console.log('Upload file to server:', cover_image);

    const businessDetails = {
      name: 'Maildnd',
      email: 'nrt@maildnd.com',
      phone: '+16787738141',
      country: 'United States',
      street: '42624 Golden Bear Ct',
      street2: '',
      state: 'VA',
      city: 'Brambleton ',
      zip_code: '20148',
      user_id: '62859c62-6187-4317-9626-1966356ff854',
    };
    const formData = new FormData();
    formData.append('file', cover_image);
    formData.append('businessDetails', JSON.stringify(businessDetails));
    const res = await axios.post(endpoints.account_setup.uploadFile, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    console.log('Upload file response:', res.data);
    return res.data;
  } catch (error) {
    console.error('Error during upload file:', error);
    throw error;
  }
};
