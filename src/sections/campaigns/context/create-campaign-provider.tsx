import { useMemo, Suspense, useCallback, createContext } from 'react';

import { paths } from 'src/routes/paths';
import { useRouter, useSearchParams } from 'src/routes/hooks';

import { useLocalStorage } from 'src/hooks/use-local-storage';

import { SplashScreen } from 'src/components/loading-screen';

import { CAMPAIGN_NEW_STEPS } from '../data/campaign-new-steps-data';

import type {
  ZipCode,
  IDetails,
  IContent,
  ITargets,
  CampaignItem,
  ICompanyDetails,
  CreateCampaignState,
  CreateCampaignContextValue,
} from '../types/campaign-context-type';

export const CreateCampaignContext = createContext<CreateCampaignContextValue | undefined>(
  undefined
);

export const CampaignConsumer = CreateCampaignContext.Consumer;

const STORAGE_KEY = 'new-Campaign';

const initialState: CreateCampaignState = {
  newCampaign: {} as CampaignItem,
  zip_codes_list: [] as ZipCode[],
};

// ------------------------------------------------------------------------

type Props = {
  children: React.ReactNode;
};

export function CreateCampaignProvider({ children }: Props) {
  return (
    <Suspense fallback={<SplashScreen />}>
      <Container>{children}</Container>
    </Suspense>
  );
}

function Container({ children }: Props) {
  const router = useRouter();

  const searchParams = useSearchParams();

  const activeStep = Number(searchParams.get('step'));

  const { state, setState, setField, canReset, resetState } = useLocalStorage<CreateCampaignState>(
    STORAGE_KEY,
    initialState
  );

  const completed = activeStep === CAMPAIGN_NEW_STEPS.length;

  const initialStep = useCallback(() => {
    if (!activeStep) {
      const href = createUrl('go', 0);
      router.push(href);
    }
  }, [activeStep, router]);

  const onBackStep = useCallback(() => {
    const href = createUrl('back', activeStep);
    router.push(href);
  }, [activeStep, router]);

  const onNextStep = useCallback(() => {
    const href = createUrl('next', activeStep);
    router.push(href);
  }, [activeStep, router]);

  const onGotoStep = useCallback(
    (step: number) => {
      const href = createUrl('go', step);
      router.push(href);
    },
    [router]
  );

  const onSetCampaignDetails = useCallback(
    (details: IDetails) => {
      const newCampaign = { ...state.newCampaign, details, status: 'draft' };
      console.log('Details Provider: ', newCampaign);
      setState({ newCampaign });
    },
    [setState, state.newCampaign]
  );

  const onSetCampaignContent = useCallback(
    (content: IContent) => {
      const newCampaign = { ...state.newCampaign, content };
      setState({ newCampaign });
    },
    [setState, state.newCampaign]
  );

  const onSetCampaignTargets = useCallback(
    (targets: ITargets) => {
      const newCampaign = { ...state.newCampaign, targets };
      setState({ newCampaign });
    },
    [setState, state.newCampaign]
  );

  const onSetCompanyDetails = useCallback(
    (companyDetails: ICompanyDetails) => {
      console.log('Company details Provider 1: ', companyDetails);
      const newCampaign = { ...state.newCampaign, companyDetails };
      console.log('Company details Provider 2: ', newCampaign);
      setState({ newCampaign });
    },
    [setState, state.newCampaign]
  );

  const onSetCampaignItem = useCallback(
    (newCampaign: CampaignItem) => {
      setState({ newCampaign });
    },
    [setState]
  );

  const onSetCampaignId = useCallback(
    (id: string) => {
      const newCampaign = { ...state.newCampaign, id };
      setState({ newCampaign });
    },
    [setState, state.newCampaign]
  );

  const onSetZipCodes = useCallback(
    (zip_codes_list: ZipCode[]) => {
      setState({ zip_codes_list });
    },
    [setState]
  );

  // Reset
  const onReset = useCallback(() => {
    resetState();
    // if (completed) {
    //   resetState();
    //   router.push(paths.dashboard.root);
    // }
  }, [resetState]);

  const memoizedValue = useMemo(
    () => ({
      ...state,
      canReset,
      onReset,
      onUpdate: setState,
      onUpdateField: setField,
      completed,
      //
      onSetCampaignDetails,
      onSetCampaignContent,
      onSetCampaignTargets,
      onSetCompanyDetails,
      onSetCampaignItem,
      onSetCampaignId,
      onSetZipCodes,
      activeStep,
      initialStep,
      onBackStep,
      onNextStep,
      onGotoStep,
    }),
    [
      state,
      onReset,
      canReset,
      completed,
      setField,
      setState,
      activeStep,
      onBackStep,
      onGotoStep,
      onNextStep,
      initialStep,
      onSetCampaignDetails,
      onSetCampaignContent,
      onSetCampaignTargets,
      onSetCompanyDetails,
      onSetCampaignItem,
      onSetCampaignId,
      onSetZipCodes,
    ]
  );

  return (
    <CreateCampaignContext.Provider value={memoizedValue}>
      {children}
    </CreateCampaignContext.Provider>
  );
}

// ----------------------------------------------------------------------

function createUrl(type: 'back' | 'next' | 'go', activeStep: number) {
  const step = { back: activeStep - 1, next: activeStep + 1, go: activeStep }[type];

  const stepParams = new URLSearchParams({ step: `${step}` }).toString();

  return `${paths.dashboard.campaigns.new}?${stepParams}`;
}
