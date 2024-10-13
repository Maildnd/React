import type { IPaymentCard, IAddressItem } from 'src/types/common';

import { useState, useContext, useCallback } from 'react';
import { formatPhoneNumberIntl } from 'react-phone-number-input/input';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Unstable_Grid2';
import CardHeader from '@mui/material/CardHeader';

import { useBoolean } from 'src/hooks/use-boolean';

import { PlanFreeIcon, PlanStarterIcon, PlanPremiumIcon } from 'src/assets/icons';

import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';

import { AuthContext } from 'src/auth/context/auth-context';

// ----------------------------------------------------------------------

type Props = {
  cardList: IPaymentCard[];
  addressBook: IAddressItem[];
  plans: {
    price: number;
    primary: boolean;
    subscription: string;
  }[];
};

export function AccountBillingPlan({ cardList, addressBook, plans }: Props) {
  const userState = useContext(AuthContext);
  const subscriptionPlans = userState?.plans || [];
  const businessAccount = userState?.user?.business_account;
  const [selectedPlan, setSelectedPlan] = useState('');

  const openAddress = useBoolean();

  const openCards = useBoolean();

  const handleSelectPlan = useCallback(
    (newValue: string) => {
      const currentPlan = plans.filter((plan) => plan.primary)[0].subscription;
      if (currentPlan !== newValue) {
        setSelectedPlan(newValue);
      }
    },
    [plans]
  );

  const renderPlans = subscriptionPlans.map((plan) => (
    <Grid xs={12} md={4} key={plan.id}>
      <Paper
        variant="outlined"
        onClick={() => handleSelectPlan(plan.id)}
        sx={{
          p: 2.5,
          cursor: 'pointer',
          position: 'relative',
          ...(plan.id === businessAccount.subscription && {
            boxShadow: (theme) => `0 0 0 2px ${theme.vars.palette.text.primary}`,
          }),
        }}
      >
        {plan.id === businessAccount.subscription && (
          <Label
            color="info"
            startIcon={<Iconify icon="eva:star-fill" />}
            sx={{ position: 'absolute', top: 8, right: 8 }}
          >
            Current
          </Label>
        )}

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
      </Paper>
    </Grid>
  ));

  return (
    <Card>
      <CardHeader title="Plan" />

      <Grid container spacing={2} sx={{ p: 3 }}>
        {renderPlans}
      </Grid>

      <Stack spacing={2} sx={{ p: 3, pt: 0, typography: 'body2' }}>
        <Grid container spacing={{ xs: 0.5, md: 2 }}>
          <Grid xs={12} md={4} sx={{ color: 'text.secondary' }}>
            Plan
          </Grid>
          <Grid xs={12} md={8} sx={{ typography: 'subtitle2', textTransform: 'capitalize' }}>
            {businessAccount?.subscription || '-'}
          </Grid>
        </Grid>

        <Grid container spacing={{ xs: 0.5, md: 2 }}>
          <Grid xs={12} md={4} sx={{ color: 'text.secondary' }}>
            Billing name
          </Grid>
          <Grid xs={12} md={8}>
            <Button
              onClick={openAddress.onTrue}
              endIcon={<Iconify width={16} icon="eva:arrow-ios-downward-fill" />}
              sx={{ typography: 'subtitle2', p: 0, borderRadius: 0 }}
            >
              {userState?.user?.name}
            </Button>
          </Grid>
        </Grid>

        <Grid container spacing={{ xs: 0.5, md: 2 }}>
          <Grid xs={12} md={4} sx={{ color: 'text.secondary' }}>
            Billing address
          </Grid>
          <Grid xs={12} md={8} sx={{ color: 'text.secondary' }}>
            {businessAccount?.street} {businessAccount?.city} {businessAccount?.state}
            {' - '}
            {businessAccount?.postal_code}
          </Grid>
        </Grid>

        <Grid container spacing={{ xs: 0.5, md: 2 }}>
          <Grid xs={12} md={4} sx={{ color: 'text.secondary' }}>
            Billing phone number
          </Grid>
          <Grid xs={12} md={8} sx={{ color: 'text.secondary' }}>
            {formatPhoneNumberIntl(businessAccount?.phone)}
          </Grid>
        </Grid>

        <Grid container spacing={{ xs: 0.5, md: 2 }}>
          <Grid xs={12} md={4} sx={{ color: 'text.secondary' }}>
            Payment method
          </Grid>
          <Grid xs={12} md={8}>
            <Button
              onClick={openCards.onTrue}
              endIcon={<Iconify width={16} icon="eva:arrow-ios-downward-fill" />}
              sx={{ typography: 'subtitle2', p: 0, borderRadius: 0 }}
            >
              Test Card
            </Button>
          </Grid>
        </Grid>
      </Stack>
    </Card>
  );
}
