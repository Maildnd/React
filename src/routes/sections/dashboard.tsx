import { lazy, Suspense } from 'react';
import { Outlet } from 'react-router-dom';

import { CONFIG } from 'src/config-global';
import { DashboardLayout } from 'src/layouts/dashboard';

import { LoadingScreen } from 'src/components/loading-screen';

import { GetCampaignsProvider } from 'src/sections/campaigns/context/get-campaigns-provider';

import { AuthGuard } from 'src/auth/guard';

// ----------------------------------------------------------------------

// Dashboard
const IndexPage = lazy(() => import('src/pages/dashboard'));

// campaigns
const CampaignsListPage = lazy(() => import('src/pages/dashboard/campaigns/list'));
const CampaignsDetailsPage = lazy(() => import('src/pages/dashboard/campaigns/details'));
const CampaignsEditPage = lazy(() => import('src/pages/dashboard/campaigns/edit'));
const CampaignsNewPage = lazy(() => import('src/pages/dashboard/campaigns/new'));
// Business Account
const BusinessAccountPage = lazy(() => import('src/pages/dashboard/business-account/account'));

// ----------------------------------------------------------------------

const layoutContent = (
  <GetCampaignsProvider>
    <DashboardLayout>
      <Suspense fallback={<LoadingScreen />}>
        <Outlet />
      </Suspense>
    </DashboardLayout>
  </GetCampaignsProvider>
);

export const dashboardRoutes = [
  {
    path: 'dashboard',
    element: CONFIG.auth.skip ? <>{layoutContent}</> : <AuthGuard>{layoutContent}</AuthGuard>,
    children: [
      { element: <IndexPage />, index: true },
      {
        path: 'campaigns',
        children: [
          { element: <CampaignsListPage />, index: true },
          { path: 'list', element: <CampaignsListPage /> },
          { path: ':id', element: <CampaignsDetailsPage /> },
          { path: 'new', element: <CampaignsNewPage /> },
          { path: ':id/edit', element: <CampaignsEditPage /> },
        ],
      },
      {
        path: 'business-account',
        element: <BusinessAccountPage />,
        index: true,
      },
    ],
  },
];
