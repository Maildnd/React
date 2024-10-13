import { z as zod } from 'zod';
import { useForm } from 'react-hook-form';
import { useMemo, useContext } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';

import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import { Box, Button } from '@mui/material';
import CardHeader from '@mui/material/CardHeader';

import { US_STATES_LIST } from 'src/assets/data';

import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';
import { Form, Field } from 'src/components/hook-form';

import { AuthContext } from 'src/auth/context/auth-context';

import { CreateCampaignContext } from '../../context/create-campaign-provider';

import type { ICompanyDetails } from '../../types/campaign-context-type';

type CompanyDetailsSchema = zod.infer<typeof CompanyDetails>;

const CompanyDetails = zod.object({
  address: zod.object({
    country: zod.string(),
    state: zod.string(),
    city: zod.string(),
    street: zod.string(),
    street2: zod.string(),
    postal_code: zod.string(),
  }),
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
  email: zod.string(),
  phone: zod.string(),
});

const CampaignCompanyDetails = () => {
  const userState = useContext(AuthContext);
  const businessAccount = userState?.user?.business_account;
  const campaignContext = useContext(CreateCampaignContext);
  const companyDetails = campaignContext?.newCampaign?.companyDetails;

  const defaultValues = useMemo(
    () => ({
      address: companyDetails?.address || {
        country: 'United States',
        state: businessAccount.state || '',
        city: businessAccount.city || '',
        street: businessAccount.street || '',
        street2: businessAccount.street2 || '',
        postal_code: businessAccount.postal_code || '',
      },
      phone: companyDetails?.phone || businessAccount?.phone || '',
      email: companyDetails?.email || businessAccount.email || '',
      website: companyDetails?.website?.toString() || businessAccount?.website || '',
    }),
    [companyDetails, businessAccount]
  );

  const methods = useForm<CompanyDetailsSchema>({
    resolver: zodResolver(CompanyDetails),
    defaultValues,
  });

  const { handleSubmit } = methods;

  const onSubmit = handleSubmit(async (data) => {
    console.info('DATA', data);
    try {
      const companyDetailsData = {
        ...data,
        cover_image_url: businessAccount?.cover_image_url || '',
        socialNetworks: [],
        business_id: businessAccount?.id || '',
        website: new URL(
          data.website.startsWith('http') ? data.website : `https://${data.website}`
        ),
        address_string: `${data.address.street} ${data.address.city}, ${data.address.state} ${data.address.postal_code}`,
      };
      campaignContext?.onSetCompanyDetails(companyDetailsData as ICompanyDetails);
      campaignContext?.onNextStep();
    } catch (error) {
      console.error(error);
    }
  });

  return (
    <Form methods={methods} onSubmit={onSubmit}>
      <Card>
        <CardHeader title="Company Details" subheader="Company Address, website" sx={{ mb: 3 }} />

        <Divider />

        <Stack spacing={3} sx={{ p: 3 }}>
          <Box
            rowGap={3}
            columnGap={2}
            display="grid"
            gridTemplateColumns={{ xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)' }}
          >
            <Field.Text name="email" label="Email address" />
            <Field.Phone name="phone" label="Phone number" />
          </Box>
          <Label>Address</Label>
          <Box
            rowGap={3}
            columnGap={2}
            display="grid"
            gridTemplateColumns={{ xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)' }}
          >
            <Field.Text name="address.street" label="Street" />
            <Field.Text name="address.street2" label="Apt/Unit" />

            <Field.Text name="address.city" label="City" />
            <Field.Select
              native
              name="address.state"
              label="State"
              InputLabelProps={{ shrink: true }}
              placeholder="State"
            >
              {US_STATES_LIST.map((type: any) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </Field.Select>

            <Field.Text name="address.postal_code" label="Zip/code" />
            <Field.CountrySelect
              name="address.country"
              label="Country"
              placeholder="Choose a country"
              disabled
            />
          </Box>

          <Field.Text name="website" label="Website" />
        </Stack>
      </Card>
      <Stack spacing={1.5} direction="row" sx={{ mb: { xs: 3, md: 5 }, mt: 3 }}>
        <Button
          startIcon={<Iconify icon="eva:arrow-ios-back-fill" width={16} />}
          onClick={campaignContext?.onBackStep}
        >
          Back
        </Button>
        <Box sx={{ flexGrow: 1 }} />
        <Button endIcon={<Iconify icon="eva:arrow-ios-forward-fill" width={16} />} type="submit">
          Next
        </Button>
      </Stack>
    </Form>
  );
};

export default CampaignCompanyDetails;
