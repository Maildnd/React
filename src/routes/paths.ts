import { paramCase } from 'src/utils/change-case';

import { _id, _postTitles } from 'src/_mock/assets';

// ----------------------------------------------------------------------

const MOCK_ID = _id[1];

const MOCK_TITLE = _postTitles[2];

const ROOTS = {
  AUTH: '/auth',
  DASHBOARD: '/dashboard',
  SETUP: '/account-setup',
};

// ----------------------------------------------------------------------

export const paths = {
  comingSoon: '/coming-soon',
  maintenance: '/maintenance',
  pricing: '/pricing',
  payment: '/payment',
  about: '/about-us',
  contact: '/contact-us',
  faqs: '/faqs',
  page403: '/error/403',
  page404: '/error/404',
  page500: '/error/500',
  components: '/components',
  docs: 'https://docs.minimals.cc',
  changelog: 'https://docs.minimals.cc/changelog',
  zoneStore: 'https://mui.com/store/items/zone-landing-page/',
  minimalStore: 'https://mui.com/store/items/minimal-dashboard/',
  freeUI: 'https://mui.com/store/items/minimal-dashboard-free/',
  figmaUrl: 'https://www.figma.com/design/cAPz4pYPtQEXivqe11EcDE/%5BPreview%5D-Minimal-Web.v6.0.0',
  product: {
    root: `/product`,
    checkout: `/product/checkout`,
    details: (id: string) => `/product/${id}`,
    demo: { details: `/product/${MOCK_ID}` },
  },
  post: {
    root: `/post`,
    details: (title: string) => `/post/${paramCase(title)}`,
    demo: { details: `/post/${paramCase(MOCK_TITLE)}` },
  },
  // AUTH
  auth: {
    signIn: `${ROOTS.AUTH}/sign-in`,
    verify: `${ROOTS.AUTH}/verify`,
    signUp: `${ROOTS.AUTH}/sign-up`,
    updatePassword: `${ROOTS.AUTH}/update-password`,
    resetPassword: `${ROOTS.AUTH}/reset-password`,
  },
  // SETUP
  setup: {
    root: ROOTS.SETUP,
    userDetails: `${ROOTS.SETUP}/user-details`,
    companyDetails: `${ROOTS.SETUP}/company-details`,
    selectPlan: `${ROOTS.SETUP}/select-plan`,
    paymentDetails: `${ROOTS.SETUP}/payment-details`,
  },
  // DASHBOARD
  dashboard: {
    root: ROOTS.DASHBOARD,
    landing: `${ROOTS.DASHBOARD}/landing`,
    campaigns: {
      root: `${ROOTS.DASHBOARD}/campaigns`,
      new: `${ROOTS.DASHBOARD}/campaigns/new`,
      details: (id: string) => `${ROOTS.DASHBOARD}/campaigns/${id}`,
      edit: (id: string) => `${ROOTS.DASHBOARD}/campaigns/${id}/edit`,
      demo: {
        details: `${ROOTS.DASHBOARD}/campaigns/${MOCK_ID}`,
        edit: `${ROOTS.DASHBOARD}/campaigns/${MOCK_ID}/edit`,
      },
    },
    businessAccount: {
      root: `${ROOTS.DASHBOARD}/business-account`,
    },
    user: {
      root: `${ROOTS.DASHBOARD}/user`,
      new: `${ROOTS.DASHBOARD}/user/new`,
      list: `${ROOTS.DASHBOARD}/user/list`,
      cards: `${ROOTS.DASHBOARD}/user/cards`,
      profile: `${ROOTS.DASHBOARD}/user/profile`,
      account: `${ROOTS.DASHBOARD}/user/account`,
      edit: (id: string) => `${ROOTS.DASHBOARD}/user/${id}/edit`,
      demo: {
        edit: `${ROOTS.DASHBOARD}/user/${MOCK_ID}/edit`,
      },
    },
  },
};
