import type { ISetupPaymentDetails } from 'src/types/setup';

import React from 'react';
import { z as zod } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { LoadingButton } from '@mui/lab';
import { Grid, Button } from '@mui/material';

import { Form } from 'src/components/hook-form';
import { Iconify } from 'src/components/iconify';

import { useAuthContext } from 'src/auth/hooks';

import { useSetupContext } from './context';
import { completeSetup } from './context/action';
import { SetupPayment } from './setup-billing-payment';
import { BillingSummary } from './setup-billing-summary';

export type PaymentDetailsSchemaType = zod.infer<typeof PaymentDetailsSchema>;

export const PaymentDetailsSchema = zod.object({
  cardNumber: zod.string().min(1, { message: 'Card number is required!' }),
  expirationDate: zod.string().min(1, { message: 'Expiration date is required!' }),
  cvv: zod.string().min(1, { message: 'cvv is required!' }),
  cardHolder: zod.string().min(1, { message: 'Card holder name is required!' }),
  street: zod.string().min(1, { message: 'Street is required!' }),
  street2: zod.string(),
  state: zod.string().min(1, { message: 'State is required!' }),
  city: zod.string().min(1, { message: 'City is required!' }),
  zip_code: zod.string().min(1, { message: 'Zip code is required!' }),
  country: zod.string(),
});

const SetupBilling = () => {
  const { user, checkUserSession } = useAuthContext();
  const setupContext = useSetupContext();
  const paymentDetails = setupContext?.paymentDetails;
  console.log('SBD payment details', paymentDetails);

  const defaultValues = {
    cardNumber: paymentDetails?.cardNumber || '',
    expirationDate: paymentDetails?.expirationDate || '',
    cvv: paymentDetails?.cvv || '',
    cardHolder: paymentDetails?.cardHolder || user?.name || '',
    street: paymentDetails?.street || setupContext?.businessDetails?.street || '',
    street2: paymentDetails?.street2 || setupContext?.businessDetails?.street2 || '',
    state: paymentDetails?.state || setupContext?.businessDetails?.state || '',
    city: paymentDetails?.city || setupContext?.businessDetails?.city || '',
    zip_code: paymentDetails?.zip_code || setupContext?.businessDetails?.zip_code || '',
    country: paymentDetails?.country || 'United States',
  };

  const methods = useForm<PaymentDetailsSchemaType>({
    resolver: zodResolver(PaymentDetailsSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    watch,
    formState: { isSubmitting },
  } = methods;

  const values = watch();

  const onBackStep = () => {
    setupContext.onUpdatePaymentDetails(values as ISetupPaymentDetails);
    setupContext.onBackStep();
  };

  const onSubmit = handleSubmit(async (data) => {
    try {
      setupContext.onUpdatePaymentDetails(data as ISetupPaymentDetails);
      await completeSetup(setupContext, data as ISetupPaymentDetails);
      await checkUserSession?.();
      setupContext.onNextStep();
      setupContext.onReset();
      console.info('DATA', data);
    } catch (error) {
      console.error(error);
    }
  });

  return (
    <Form methods={methods} onSubmit={onSubmit}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={8} pr={3}>
          <SetupPayment sx={{ my: 3 }} />

          <Button
            size="small"
            color="inherit"
            onClick={onBackStep}
            startIcon={<Iconify icon="eva:arrow-ios-back-fill" />}
            sx={{ mt: 2 }}
          >
            Back
          </Button>
        </Grid>

        <Grid item xs={12} md={4}>
          <BillingSummary {...setupContext} />

          <LoadingButton
            fullWidth
            size="large"
            type="submit"
            variant="contained"
            loading={isSubmitting}
          >
            Complete setup
          </LoadingButton>
        </Grid>
      </Grid>
    </Form>
  );
};

export default SetupBilling;
