import type { BusinessDetails } from 'src/types/static';

import { z as zod } from 'zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { isValidPhoneNumber, formatPhoneNumberIntl } from 'react-phone-number-input/input';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import { Stack, Alert, AlertTitle } from '@mui/material';

import { fData } from 'src/utils/format-number';

import { _mock } from 'src/_mock/_mock';
import { US_STATES_LIST } from 'src/assets/data';

import { toast } from 'src/components/snackbar';
import { Form, Field, schemaHelper } from 'src/components/hook-form';

import { useAuthContext } from 'src/auth/hooks';

import { updateBusinessAccount } from './context/action';

// ----------------------------------------------------------------------

export type UpdateUserSchemaType = zod.infer<typeof UpdateUserSchema>;

export const UpdateUserSchema = zod.object({
  name: zod.string(),
  first_name: zod.string().min(1, { message: 'First Name is required!' }),
  last_name: zod.string().min(1, { message: 'Last Name is required!' }),
  email: zod
    .string()
    .min(1, { message: 'Email is required!' })
    .email({ message: 'Email must be a valid email address!' }),
  cover_image: schemaHelper.file(),
  phone: schemaHelper.phoneNumber({ isValidPhoneNumber }),
  website: zod.string().refine(
    (val) => {
      try {
        // eslint-disable-next-line no-new
        new URL(val.startsWith('http') ? val : `https://${val}`);
        return true;
      } catch (error) {
        return false;
      }
    },
    {
      message: 'Invalid URL format!',
    }
  ),
  country: schemaHelper.objectOrNull({ message: { required_error: 'Country is required!' } }),
  street: zod.string().min(1, { message: 'Street is required!' }),
  street2: zod.string(),
  state: zod.string().min(1, { message: 'State is required!' }),
  city: zod.string().min(1, { message: 'City is required!' }),
  zip_code: zod.string().min(1, { message: 'Zip code is required!' }),
});

export function AccountGeneral() {
  const [showErrorAlert, setShowErrorAlert] = useState(false);
  const { user, checkUserSession } = useAuthContext();
  const businessAccount = user?.business_account;

  const defaultValues = {
    name: businessAccount?.name || '',
    first_name: user?.first_name || '',
    last_name: user?.last_name || '',
    email: businessAccount?.email || '',
    cover_image: businessAccount?.cover_image_url || _mock.image.avatar(3),
    phone: businessAccount?.phone ? formatPhoneNumberIntl(businessAccount.phone) : '' || '',
    website: businessAccount?.website || '',
    country: businessAccount?.country || 'United States',
    street: businessAccount?.street || '',
    street2: businessAccount?.street2 || '',
    state: businessAccount?.state || '',
    city: businessAccount?.city || '',
    zip_code: businessAccount?.postal_code || '',
  };

  const methods = useForm<UpdateUserSchemaType>({
    mode: 'all',
    resolver: zodResolver(UpdateUserSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    console.info('DATA', data);
    try {
      const businessDetailsData = {
        ...data,
        id: user?.business_account?.id,
        website: new URL(
          data.website.startsWith('http') ? data.website : `https://${data.website}`
        ),
      };
      const res = await updateBusinessAccount(businessDetailsData as BusinessDetails);
      if (res.error) {
        console.error('Error during complete setup:', res);
        setShowErrorAlert(true);
      } else {
        await checkUserSession?.();
        toast.success('Update success!');
      }
    } catch (error) {
      console.error(error);
    }
  });

  return (
    <Form methods={methods} onSubmit={onSubmit}>
      {showErrorAlert && (
        <Alert severity="error" onClose={() => setShowErrorAlert(false)} sx={{ mb: 2 }}>
          <AlertTitle sx={{ textTransform: 'capitalize' }}> Error</AlertTitle>
          Error during account setup. Please try again later. If the problem persists, please
          contact support at <strong>666-777-8888.</strong>
        </Alert>
      )}
      <Grid container spacing={3}>
        <Grid xs={12} md={4}>
          <Card
            sx={{
              pt: 10,
              pb: 5,
              px: 3,
              textAlign: 'center',
            }}
          >
            <Field.UploadAvatar
              name="cover_image"
              maxSize={3145728}
              helperText={
                <Typography
                  variant="caption"
                  sx={{
                    mt: 3,
                    mx: 'auto',
                    display: 'block',
                    textAlign: 'center',
                    color: 'text.disabled',
                  }}
                >
                  Allowed *.jpeg, *.jpg, *.png, *.gif
                  <br /> max size of {fData(3145728)}
                </Typography>
              }
            />
          </Card>
        </Grid>

        <Grid xs={12} md={8}>
          <Card sx={{ p: 3 }}>
            <Box sx={{ mb: 3 }}>
              <Field.Text name="name" label="Business Name" />
            </Box>
            <Box
              rowGap={3}
              columnGap={2}
              display="grid"
              gridTemplateColumns={{ xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)' }}
            >
              <Field.Text name="first_name" label="First Name" />
              <Field.Text name="last_name" label="Last Name" />
              <Field.Text name="email" label="Email address" />
              <Field.Phone name="phone" label="Phone number" />
            </Box>
            <Field.Text name="website" label="Website" sx={{ sm: 1, mt: 3, pb: 3 }} />
            <Box
              rowGap={3}
              columnGap={2}
              display="grid"
              gridTemplateColumns={{ xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)' }}
            >
              <Field.Text name="street" label="Street" />
              <Field.Text name="street2" label="Apt/Unit" />

              <Field.Text name="city" label="City" />
              <Field.Select
                native
                name="state"
                label="State"
                InputLabelProps={{ shrink: true }}
                placeholder="State"
              >
                {US_STATES_LIST.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </Field.Select>

              <Field.Text name="zip_code" label="Zip/code" />

              <Field.CountrySelect
                name="country"
                label="Country"
                placeholder="Choose a country"
                disabled
              />
            </Box>

            <Stack spacing={3} alignItems="flex-end" sx={{ mt: 3 }}>
              <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                Save changes
              </LoadingButton>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </Form>
  );
}
