import { lazy, Suspense } from 'react';
import { Outlet } from 'react-router-dom';

// import { AuthSplitLayout } from 'src/layouts/auth-split';
import { AuthCenteredLayout } from 'src/layouts/auth-centered';

import { SplashScreen } from 'src/components/loading-screen';

import { GuestGuard } from 'src/auth/guard';

// ----------------------------------------------------------------------

/** **************************************
 * Jwt
 *************************************** */
const Jwt = {
  SignInPage: lazy(() => import('src/pages/auth/sign-in')),
  SignUpPage: lazy(() => import('src/pages/auth/sign-up')),
};

/** **************************************
 * Supabase
 *************************************** */
const Supabase = {
  SignInPage: lazy(() => import('src/pages/auth/sign-in')),
  SignUpPage: lazy(() => import('src/pages/auth/sign-up')),
  VerifyPage: lazy(() => import('src/pages/auth/verify')),
  UpdatePasswordPage: lazy(() => import('src/pages/auth/update-password')),
  ResetPasswordPage: lazy(() => import('src/pages/auth/reset-password')),
};

const authJwt = {
  children: [
    {
      path: 'sign-in',
      element: (
        <GuestGuard>
          <AuthCenteredLayout>
            <Jwt.SignInPage />
          </AuthCenteredLayout>
        </GuestGuard>
      ),
    },
    {
      path: 'sign-up',
      element: (
        <GuestGuard>
          <AuthCenteredLayout>
            <Jwt.SignUpPage />
          </AuthCenteredLayout>
        </GuestGuard>
      ),
    },

    {
      path: 'verify',
      element: (
        <AuthCenteredLayout>
          <Supabase.VerifyPage />
        </AuthCenteredLayout>
      ),
    },
    {
      path: 'reset-password',
      element: (
        <AuthCenteredLayout>
          <Supabase.ResetPasswordPage />
        </AuthCenteredLayout>
      ),
    },
    {
      path: 'update-password',
      element: (
        <AuthCenteredLayout>
          <Supabase.UpdatePasswordPage />
        </AuthCenteredLayout>
      ),
    },
  ],
};

// ----------------------------------------------------------------------

export const authRoutes = [
  {
    path: 'auth',
    element: (
      <Suspense fallback={<SplashScreen />}>
        <Outlet />
      </Suspense>
    ),
    children: [authJwt],
  },
];
