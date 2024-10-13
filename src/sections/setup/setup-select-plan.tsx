import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Unstable_Grid2';
import CardHeader from '@mui/material/CardHeader';
import { List, Button, Typography } from '@mui/material';

import { DashboardContent } from 'src/layouts/dashboard';
import { PlanFreeIcon, PlanStarterIcon, PlanPremiumIcon } from 'src/assets/icons';

import { Iconify } from 'src/components/iconify';

import { useSetupContext } from './context';

const SelectPlan = () => {
  const setupContext = useSetupContext();
  const availablePlans = setupContext?.availablePlans || [];
  const selectedPlanId = setupContext?.selectedPlan?.id || '';

  const handleSelectPlan = (planId: string) => {
    console.log('newValue: ', planId);
    setupContext.onSelectPlan(planId);
  };

  const renderPlans = availablePlans.map((plan) => (
    <Grid xs={12} md={4} key={plan.id}>
      <Paper
        variant="outlined"
        onClick={() => handleSelectPlan(plan.id)}
        sx={{
          p: 2.5,
          cursor: 'pointer',
          position: 'relative',
          ...(plan.id === selectedPlanId && {
            boxShadow: (theme) => `0 0 0 2px ${theme.vars.palette.text.primary}`,
          }),
        }}
      >
        {plan.name === 'Basic' && <PlanFreeIcon />}
        {plan.name === 'Starter' && <PlanStarterIcon />}
        {plan.name === 'Premium' && <PlanPremiumIcon />}

        <Box
          sx={{
            typography: 'subtitle2',
            mt: 2,
            mb: 0.5,
            textTransform: 'capitalize',
          }}
        >
          {plan.name}
        </Box>

        <Stack direction="row" alignItems="center" sx={{ typography: 'h4' }}>
          {plan.price || 'Free'}

          {!!plan.price && (
            <Box component="span" sx={{ typography: 'body2', color: 'text.disabled', ml: 0.5 }}>
              /mo
            </Box>
          )}
        </Stack>

        <Stack direction="row" alignItems="center">
          <List>
            {plan.description.map((item) => (
              <Typography
                key={item.id}
                variant="body2"
                sx={{ color: 'text.secondary', display: 'flex', alignItems: 'center' }}
              >
                <Box component="span" sx={{ mr: 0.5 }}>
                  •
                </Box>
                {item.value}
              </Typography>
            ))}
          </List>
        </Stack>
      </Paper>
    </Grid>
  ));

  return (
    <DashboardContent>
      <Grid container spacing={5} disableEqualOverflow>
        <Grid xs={12} md={12}>
          <Card>
            <CardHeader title="Select plan" />

            <Grid container spacing={2} sx={{ p: 3 }}>
              {renderPlans}
            </Grid>
            <Stack
              direction="row"
              justifyContent="space-between"
              spacing={3}
              alignItems="flex-end"
              sx={{ p: 3, mt: 3 }}
            >
              <Button
                size="small"
                color="inherit"
                onClick={setupContext.onBackStep}
                startIcon={<Iconify icon="eva:arrow-ios-back-fill" />}
              >
                Back
              </Button>
              <Button
                size="large"
                type="submit"
                variant="contained"
                onClick={setupContext.onNextStep}
              >
                Continue
              </Button>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </DashboardContent>
  );
};

export default SelectPlan;
