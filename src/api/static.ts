import axios, { endpoints } from 'src/utils/axios';

export const getAvailablePlans = async () => {
  try {
    const res = await axios.get(endpoints.account_setup.plans);
    return res.data.subscription_plans;
  } catch (error) {
    console.error('Error during get available plans:', error);
    throw error;
  }
};

export const getDiscountCodes = async () => {
  try {
    const res = await axios.get(endpoints.account_setup.discountCodes);
    return res.data.discount_codes;
  } catch (error) {
    console.error('Error during check discount code:', error);
    throw error;
  }
};
