import axios, { endpoints } from 'src/utils/axios';

export const getDashboardDetails = async (business_id: string) => {
  console.log('business_id:', business_id);
  try {
    const res = await axios.post(endpoints.dashboard.getDetails, { business_id });
    console.log('Response:', res.data);
    return res.data;
  } catch (error) {
    console.error('Error during get campaigns:', error);
    throw error;
  }
};
