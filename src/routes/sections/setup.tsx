import { lazy, Suspense } from 'react';

import { AuthSplitLayout } from 'src/layouts/auth-split';

import { SplashScreen } from 'src/components/loading-screen';

// ----------------------------------------------------------------------

/** **************************************
 * Setup
 *************************************** */

const SetupPage = lazy(() => import('src/pages/account-setup'));

export const setupRoutes = [
  {
    path: 'account-setup',
    element: (
      <Suspense fallback={<SplashScreen />}>
        <AuthSplitLayout>
          <SetupPage />
        </AuthSplitLayout>
      </Suspense>
    ),
  },
];
