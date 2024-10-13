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
    me: 'http://localhost:4000/api/auth/getUserSession',
    signIn: 'http://localhost:4000/api/auth-business/login',
    signUp: 'http://localhost:4000/api/auth-business/signup',
    userSession: 'http://localhost:4000/api/auth-business/getUserSession',
    logout: 'http://localhost:4000/api/auth-business/logout',
    updatePassword: 'http://localhost:4000/api/auth-business/updatePassword',
    resetPassword: 'http://localhost:4000/api/auth-business/resetPassword',
    verifyOTP: 'http://localhost:4000/api/auth-business/verifyOTP',
  },
  account_setup: {
    plans: 'http://localhost:4000/api/account-setup/getAvailablePlans',
    discountCodes: 'http://localhost:4000/api/account-setup/getDiscounts',
    complete: 'http://localhost:4000/api/account-setup/completeSetup',
    uploadFile: 'http://localhost:4000/api/account-setup/uploadFile',
  },
  business_account: {
    getDetails: 'http://localhost:4000/api/business-account/getDetails',
    updateDetails: 'http://localhost:4000/api/business-account/updateDetails',
  },
  campaign: {
    getCampaigns: 'http://localhost:4000/api/campaigns/getCampaigns',
    create: 'http://localhost:4000/api/campaigns/createCampaign',
    getResidentsCountByCoordinates: 'http://localhost:4000/api/residents/getResidentsCount',
    getZipCodes: 'http://localhost:4000/api/residents/getZipCodes',
    getResidentsCountByZipCodes: 'http://localhost:4000/api/residents/getResidentsCountByZipCodes',
    publish: 'http://localhost:4000/api/campaigns/publishCampaign',
    getTargetCoordinates: 'http://localhost:4000/api/campaigns/getTargetCoordinates',
  },
  dashboard: {
    getDetails: 'http://localhost:4000/api/dashboard/getDetails',
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
