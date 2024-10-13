import { useEffect } from 'react';

import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import SetupBilling from '../setup-billing';
import { useSetupContext } from '../context';
import SelectPlan from '../setup-select-plan';
import { SetupComplete } from '../setup-complete';
import { SetupBusinessDetails } from '../setup-business-details';
import { getDiscountCodes, getAvailablePlans } from '../context/action';

// ----------------------------------------------------------------------

export function SetupView() {
  const setupContext = useSetupContext();
  useEffect(() => {
    getAvailablePlans(setupContext);
    getDiscountCodes(setupContext);
    setupContext.initialStep();
    console.log('checkout.initialStep()');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Container sx={{ mb: 10 }}>
      <Typography variant="h4" sx={{ my: { xs: 3, md: 5 } }}>
        Account Setup
      </Typography>

      {/* <Grid container justifyContent={setupContext.completed ? 'center' : 'flex-start'}>
        <Grid xs={12} md={8}>
          <SetupSteps activeStep={setupContext.activeStep} steps={ACCOUNT_SETUP_STEPS} />
        </Grid>
      </Grid> */}

      <>
        {setupContext.activeStep === 0 && <SetupBusinessDetails />}

        {setupContext.activeStep === 1 && <SelectPlan />}

        {setupContext.activeStep === 2 && <SetupBilling />}

        {setupContext.completed && <SetupComplete onReset={setupContext.onReset} />}
      </>
    </Container>
  );
}
