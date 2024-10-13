import type { AxiosRequestConfig } from 'axios';

import axios from 'axios';

import { CONFIG } from 'src/config-global';

// ----------------------------------------------------------------------

const axiosInstance = axios.create({ baseURL: CONFIG.serverUrl });

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject((error.response && error.response.data) || 'Something went wrong!')
);

export default axiosInstance;

// ----------------------------------------------------------------------

export const fetcher = async (args: string | [string, AxiosRequestConfig]) => {
  try {
    const [url, config] = Array.isArray(args) ? args : [args];

    const res = await axiosInstance.get(url, { ...config });

    return res.data;
  } catch (error) {
    console.error('Failed to fetch:', error);
    throw error;
  }
};

// ----------------------------------------------------------------------

export const endpoints = {
  chat: '/api/chat',
  kanban: '/api/kanban',
  calendar: '/api/calendar',
  auth: {
    me: `${CONFIG.serverUrl}/api/auth/getUserSession`,
    signIn: `${CONFIG.serverUrl}/api/auth-business/login`,
    signUp: `${CONFIG.serverUrl}/api/auth-business/signup`,
    userSession: `${CONFIG.serverUrl}/api/auth-business/getUserSession`,
    logout: `${CONFIG.serverUrl}/api/auth-business/logout`,
    updatePassword: `${CONFIG.serverUrl}/api/auth-business/updatePassword`,
    resetPassword: `${CONFIG.serverUrl}/api/auth-business/resetPassword`,
    verifyOTP: `${CONFIG.serverUrl}/api/auth-business/verifyOTP`,
  },
  account_setup: {
    plans: `${CONFIG.serverUrl}/api/account-setup/getAvailablePlans`,
    discountCodes: `${CONFIG.serverUrl}/api/account-setup/getDiscounts`,
    complete: `${CONFIG.serverUrl}/api/account-setup/completeSetup`,
    uploadFile: `${CONFIG.serverUrl}/api/account-setup/uploadFile`,
  },
  business_account: {
    getDetails: `${CONFIG.serverUrl}/api/business-account/getDetails`,
    updateDetails: `${CONFIG.serverUrl}/api/business-account/updateDetails`,
  },
  campaign: {
    getCampaigns: `${CONFIG.serverUrl}/api/campaigns/getCampaigns`,
    create: `${CONFIG.serverUrl}/api/campaigns/createCampaign`,
    getResidentsCountByCoordinates: `${CONFIG.serverUrl}/api/residents/getResidentsCount`,
    getZipCodes: `${CONFIG.serverUrl}/api/residents/getZipCodes`,
    getResidentsCountByZipCodes: `${CONFIG.serverUrl}/api/residents/getResidentsCountByZipCodes`,
    publish: `${CONFIG.serverUrl}/api/campaigns/publishCampaign`,
    getTargetCoordinates: `${CONFIG.serverUrl}/api/campaigns/getTargetCoordinates`,
  },
  dashboard: {
    getDetails: `${CONFIG.serverUrl}/api/dashboard/getDetails`,
  },
  mail: {
    list: '/api/mail/list',
    details: '/api/mail/details',
    labels: '/api/mail/labels',
  },
  post: {
    list: '/api/post/list',
    details: '/api/post/details',
    latest: '/api/post/latest',
    search: '/api/post/search',
  },
  product: {
    list: '/api/product/list',
    details: '/api/product/details',
    search: '/api/product/search',
  },
};
