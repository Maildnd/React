import type { ICampaignItem } from 'src/types/campaign';

import { useMemo, Suspense, useCallback, createContext } from 'react';

import { useLocalStorage } from 'src/hooks/use-local-storage';

import { SplashScreen } from 'src/components/loading-screen';

import type { GetCampaignsState, GetCampaignsContextValue } from '../types/campaign-context-type';

export const GetCampaignsContext = createContext<GetCampaignsContextValue | undefined>(undefined);

export const CampaignConsumer = GetCampaignsContext.Consumer;

const STORAGE_KEY = 'get-Campaigns';

const initialState: GetCampaignsState = {
  campaigns: [] as ICampaignItem[],
};

// ------------------------------------------------------------------------

type Props = {
  children: React.ReactNode;
};

export function GetCampaignsProvider({ children }: Props) {
  return (
    <Suspense fallback={<SplashScreen />}>
      <Container>{children}</Container>
    </Suspense>
  );
}

function Container({ children }: Props) {
  const { state, setState, resetState } = useLocalStorage<GetCampaignsState>(
    STORAGE_KEY,
    initialState
  );

  const onSetCampaigns = useCallback(
    async (campaigns: ICampaignItem[]) => {
      setState({ campaigns });
    },
    [setState]
  );

  // Reset
  const onReset = useCallback(() => {
    resetState();
  }, [resetState]);

  const memoizedValue = useMemo(
    () => ({
      ...state,
      setState,
      onReset,
      onSetCampaigns,
    }),
    [state, setState, onReset, onSetCampaigns]
  );

  return (
    <GetCampaignsContext.Provider value={memoizedValue}>{children}</GetCampaignsContext.Provider>
  );
}
