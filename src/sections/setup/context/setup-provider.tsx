import type { DiscountCode, SubscriptionPlanOption } from 'src/types/static';
import type {
  ISetupState,
  SetupContextValue,
  ISetupPaymentDetails,
  ISetupBusinessDetails,
} from 'src/types/setup';

import { useMemo, Suspense, useCallback, createContext } from 'react';

import { paths } from 'src/routes/paths';
import { useRouter, useSearchParams } from 'src/routes/hooks';

import { useLocalStorage } from 'src/hooks/use-local-storage';

import { SplashScreen } from 'src/components/loading-screen';

import { ACCOUNT_SETUP_STEPS } from '../data/setup-steps-data';

// ----------------------------------------------------------------------

export const SetupContext = createContext<SetupContextValue | undefined>(undefined);

export const SetupConsumer = SetupContext.Consumer;

const STORAGE_KEY = 'app-checkout';

const initialState: ISetupState = {
  businessDetails: {} as ISetupBusinessDetails,
  selectedPlan: {} as SubscriptionPlanOption,
  availablePlans: [] as SubscriptionPlanOption[],
  paymentDetails: {} as ISetupPaymentDetails,
  discountCodes: [] as DiscountCode[],
  selectedDiscountCode: {} as DiscountCode,
};

// ------------------------------------------------------------------------

type Props = {
  children: React.ReactNode;
};

export function SetupProvider({ children }: Props) {
  return (
    <Suspense fallback={<SplashScreen />}>
      <Container>{children}</Container>
    </Suspense>
  );
}

// ----------------------------------------------------------------------

function Container({ children }: Props) {
  const router = useRouter();

  const searchParams = useSearchParams();

  const activeStep = Number(searchParams.get('step'));

  const { state, setState, setField, canReset, resetState } = useLocalStorage<ISetupState>(
    STORAGE_KEY,
    initialState
  );

  const completed = activeStep === ACCOUNT_SETUP_STEPS.length;

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

  const onUpdateBusinessDetails = useCallback(
    (businessDetails: ISetupBusinessDetails) => {
      setState({ businessDetails });
    },
    [setState]
  );

  const onSetAvailablePlans = useCallback(
    (availablePlans: SubscriptionPlanOption[]) => {
      setState({ availablePlans });
    },
    [setState]
  );

  const onSelectPlan = useCallback(
    (selectedPlanId: string) => {
      const selectedPlan = state.availablePlans.find((plan) => plan.id === selectedPlanId);
      setState({ selectedPlan });
    },
    [setState, state.availablePlans]
  );

  const onSetDiscountCodes = useCallback(
    (discountCodes: DiscountCode[]) => {
      setState({ discountCodes });
    },
    [setState]
  );

  const onSelectDiscountCode = useCallback(
    (selectedDiscountCode: DiscountCode | null) => {
      setState({ selectedDiscountCode: selectedDiscountCode || null });
    },
    [setState]
  );

  const onUpdatePaymentDetails = useCallback(
    (paymentDetails: ISetupPaymentDetails) => {
      setState({ paymentDetails });
    },
    [setState]
  );

  // Reset
  const onReset = useCallback(() => {
    if (completed) {
      resetState();
      router.push(paths.dashboard.root);
    }
  }, [completed, resetState, router]);

  const memoizedValue = useMemo(
    () => ({
      ...state,
      canReset,
      onReset,
      onUpdate: setState,
      onUpdateField: setField,
      //
      completed,
      onSetAvailablePlans,
      onSelectPlan,
      onUpdateBusinessDetails,
      onSetDiscountCodes,
      onSelectDiscountCode,
      onUpdatePaymentDetails,
      //
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
      setField,
      completed,
      setState,
      activeStep,
      onBackStep,
      onGotoStep,
      onNextStep,
      initialStep,
      onUpdateBusinessDetails,
      onSetAvailablePlans,
      onSelectPlan,
      onSetDiscountCodes,
      onSelectDiscountCode,
      onUpdatePaymentDetails,
    ]
  );

  return <SetupContext.Provider value={memoizedValue}>{children}</SetupContext.Provider>;
}

// ----------------------------------------------------------------------

function createUrl(type: 'back' | 'next' | 'go', activeStep: number) {
  const step = { back: activeStep - 1, next: activeStep + 1, go: activeStep }[type];

  const stepParams = new URLSearchParams({ step: `${step}` }).toString();

  return `${paths.setup.root}?${stepParams}`;
}
