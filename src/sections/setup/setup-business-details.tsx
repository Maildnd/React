import type { ISetupBusinessDetails } from 'src/types/setup';

import { z as zod } from 'zod';
import { useContext } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { isValidPhoneNumber } from 'react-phone-number-input/input';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import { Stack } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';

import { fData } from 'src/utils/format-number';

import { Form, Field, schemaHelper } from 'src/components/hook-form';

import { US_STATES_LIST } from 'src/assets/data';

import { AuthContext } from 'src/auth/context/auth-context';

import { useSetupContext } from './context';

// ----------------------------------------------------------------------

export type BusinessDetailsSchemaType = zod.infer<typeof BusinessDetailsSchema>;

export const BusinessDetailsSchema = zod.object({
  name: zod.string().min(1, { message: 'Company name is required!' }),
  email: zod
    .string()
    .min(1, { message: 'Email is required!' })
    .email({ message: 'Email must be a valid email address!' }),
  cover_image: schemaHelper.file({
    minFiles: 1,
    message: {
      required_error:
        'Cover image is required. This image will be used as a thumbnail to the mail send to the customers.',
    },
  }),
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
  user_id: zod.string(),
});

export function SetupBusinessDetails() {
  const userState = useContext(AuthContext);
  const setupContext = useSetupContext();
  const businessDetails = setupContext?.businessDetails;

  // const mock_cover_image = _mock.image.avatar(3);

  const defaultValues = {
    name: businessDetails?.name || '',
    email: businessDetails?.email || '',
    cover_image: businessDetails?.cover_image || '',
    phone: businessDetails?.phone || '',
    website: businessDetails?.website?.toString() || '',
    country: businessDetails?.country || 'United States',
    street: businessDetails?.street || '',
    street2: businessDetails?.street2 || '',
    state: businessDetails?.state || '',
    city: businessDetails?.city || '',
    zip_code: businessDetails?.zip_code || '',
    user_id: userState?.user?.id || '',
  };

  const methods = useForm<BusinessDetailsSchemaType>({
    mode: 'all',
    resolver: zodResolver(BusinessDetailsSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onFileUpload = () => {
    console.log('onFileUpload');
  };

  const onSubmit = handleSubmit(async (data) => {
    console.info('DATA', data);
    try {
      const businessDetailsData = {
        ...data,
        website: new URL(
          data.website.startsWith('http') ? data.website : `https://${data.website}`
        ),
      };
      setupContext.onUpdateBusinessDetails(businessDetailsData as ISetupBusinessDetails);
      setupContext.onNextStep();
    } catch (error) {
      console.error(error);
    }
  });

  return (
    <Form methods={methods} onSubmit={onSubmit}>
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
              onUpload={onFileUpload}
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
            <Field.Text name="name" label="Company Name" sx={{ sm: 1, pb: 3 }} />
            <Box
              rowGap={3}
              columnGap={2}
              display="grid"
              gridTemplateColumns={{ xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)' }}
            >
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
          </Card>
        </Grid>
      </Grid>
      <Stack spacing={3} alignItems="flex-end" sx={{ mt: 3 }}>
        <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
          Save & Next
        </LoadingButton>
      </Stack>
    </Form>
  );
}
