import Box from '@mui/material/Box';
import { Card, IconButton, CardHeader, InputAdornment } from '@mui/material';

import { useBoolean } from 'src/hooks/use-boolean';

import { US_STATES_LIST } from 'src/assets/data';

import { Iconify } from 'src/components/iconify';
import { Field } from 'src/components/hook-form';

// ----------------------------------------------------------------------

export function SetupPayment({ ...sx }) {
  const password = useBoolean();
  return (
    <Card>
      <CardHeader title="Payment Details" />
      <Box gap={2.5} display="flex" flexDirection="column" sx={{ width: 1, p: 2, ...sx }}>
        <Field.Text name="cardNumber" label="Card Number" placeholder="xxxx xxxx xxxx xxxx" />
        <Box gap={2} display="flex">
          <Field.Text name="expirationDate" label="Expiration date" placeholder="MM/YY" />
          <Field.Text
            name="cvv"
            label="cvv"
            placeholder="***"
            type={password.value ? 'text' : 'password'}
            InputLabelProps={{ shrink: true }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={password.onToggle} edge="end">
                    <Iconify icon={password.value ? 'solar:eye-bold' : 'solar:eye-closed-bold'} />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </Box>
        <Field.Text name="cardHolder" label="Card holder" placeholder="John Doe" />
        <Field.Text name="street" label="Street" placeholder="Enter your street" />
        <Box gap={2} display="flex">
          <Field.Text name="street2" label="Street 2" placeholder="Apt, Unit, Suite, etc." />
          <Field.Text name="city" label="City" placeholder="city" />
        </Box>
        <Box gap={2} display="flex">
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
          <Field.Text name="zip_code" label="Zip Code" placeholder="zip code" />
        </Box>
        <Field.Text name="country" label="Country" placeholder="United States" disabled />

        <Box
          gap={1}
          display="flex"
          alignItems="center"
          sx={{ typography: 'caption', color: 'text.disabled' }}
        >
          <Iconify icon="solar:lock-password-outline" />
          Your transaction is secured with SSL encryption
        </Box>
      </Box>
    </Card>
  );
}
