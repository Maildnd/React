import { useMemo, Suspense, useState, useCallback, createContext } from 'react';

import { SplashScreen } from 'src/components/loading-screen';

import type { DashboardDetails, DashboardContextValue } from '../types/dashborad-context-type';

export const DashboardContext = createContext<DashboardContextValue | undefined>(undefined);

export const DashboardConsumer = DashboardContext.Consumer;

type Props = {
  children: React.ReactNode;
};

export function DashboardProvider({ children }: Props) {
  return (
    <Suspense fallback={<SplashScreen />}>
      <Container>{children}</Container>
    </Suspense>
  );
}

const initialDetails: DashboardDetails = {} as DashboardDetails;

function Container({ children }: Props) {
  const [details, setDetails] = useState<DashboardDetails>(initialDetails);

  const onSetDashboardDetails = useCallback((dashboradDetails: DashboardDetails) => {
    setDetails(dashboradDetails);
  }, []);

  const memoizedValue = useMemo(
    () => ({
      details,
      onSetDashboardDetails,
    }),
    [details, onSetDashboardDetails]
  );

  return <DashboardContext.Provider value={memoizedValue}>{children}</DashboardContext.Provider>;
}
