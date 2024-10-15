import { useMemo, useEffect, useCallback } from 'react';

import { useSetState } from 'src/hooks/use-set-state';

import axios, { endpoints } from 'src/utils/axios';

import { STORAGE_KEY } from './constant';
import { AuthContext } from '../auth-context';
import { setSession, isValidToken } from './utils';

import type { AuthState } from '../../types';

// ----------------------------------------------------------------------

type Props = {
  children: React.ReactNode;
};

export function AuthProvider({ children }: Props) {
  const { state, setState } = useSetState<AuthState>({
    user: null,
    loading: true,
    subscriptionPlans: [],
  });

  const checkUserSession = useCallback(async () => {
    const emptyState: Partial<AuthState> = { user: null, loading: false, subscriptionPlans: [] };
    try {
      const accessToken = sessionStorage.getItem(STORAGE_KEY);
      if (accessToken && isValidToken(accessToken)) {
        const session = await axios.post(endpoints.auth.userSession);
        if (session.data) {
          console.log('Session Successful!');
        }
        const { user, plans } = session.data;
        if (user) {
          setState({ user: { ...user, accessToken }, loading: false, subscriptionPlans: plans });
        } else {
          setSession(null);
          setState(emptyState);
        }
      } else {
        setState(emptyState);
      }
    } catch (error) {
      console.error(error);
      setSession(null);
      setState(emptyState);
    }
  }, [setState]);

  useEffect(() => {
    checkUserSession();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ----------------------------------------------------------------------

  const checkAuthenticated = state.user ? 'authenticated' : 'unauthenticated';

  const status = state.loading ? 'loading' : checkAuthenticated;

  const memoizedValue = useMemo(
    () => ({
      user: state.user
        ? {
            ...state.user,
            role: state.user?.role ?? 'admin',
          }
        : null,
      checkUserSession,
      loading: status === 'loading',
      authenticated: status === 'authenticated',
      unauthenticated: status === 'unauthenticated',
      profileComplete: state.user?.profile_completed,
      plans: state.subscriptionPlans,
    }),
    [checkUserSession, state.user, status, state.subscriptionPlans]
  );

  return <AuthContext.Provider value={memoizedValue}>{children}</AuthContext.Provider>;
}
