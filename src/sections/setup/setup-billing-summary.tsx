import type { SetupContextValue } from 'src/types/setup';
import type { DiscountCode, SubscriptionPlanOption } from 'src/types/static';

import { useState } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import TextField from '@mui/material/TextField';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';
import InputAdornment from '@mui/material/InputAdornment';

import { fCurrency } from 'src/utils/format-number';

// ----------------------------------------------------------------------

export function BillingSummary(setupContext: SetupContextValue) {
  const { name, price } = setupContext?.selectedPlan as SubscriptionPlanOption;
  const [promoText, setPromoText] = useState('');
  const [discountAmount, setDiscountAmount] = useState(0);
  const [totalAmount, setTotalAmount] = useState(price);
  const [discountCode, setDiscountCode] = useState<DiscountCode | null>(null);
  const [discountCodeMessage, setDiscountCodeMessage] = useState('');

  const onApplyDiscount = () => {
    const matchingDiscountCode = setupContext?.discountCodes.find(
      (code) => code.name.toLocaleLowerCase() === promoText.toLocaleLowerCase()
    );
    if (matchingDiscountCode) {
      setupContext?.onSelectDiscountCode(matchingDiscountCode);
      setDiscountCode(matchingDiscountCode);
      const discountAmountVal = price * (matchingDiscountCode.percent / 100);
      setDiscountAmount(discountAmountVal);
      setTotalAmount(price - discountAmountVal);
      setDiscountCodeMessage('');
    } else {
      setDiscountCodeMessage('Invalid discount code');
      setupContext?.onSelectDiscountCode({} as DiscountCode);
      setDiscountCode(null);
      setDiscountAmount(0);
      setTotalAmount(price);
    }
  };

  return (
    <Card sx={{ mb: 3 }}>
      <CardHeader title="Order summary" />

      <Stack spacing={2} sx={{ p: 3 }}>
        <Box display="flex">
          <Typography
            component="span"
            variant="body2"
            sx={{ flexGrow: 1, color: 'text.secondary' }}
          >
            {name} Plan (Monthly)
          </Typography>
          <Typography component="span" variant="subtitle2">
            {fCurrency(price)}
          </Typography>
        </Box>

        <Box display="flex">
          <Typography
            component="span"
            variant="body2"
            sx={{ flexGrow: 1, color: 'text.secondary' }}
          >
            {discountCode ? discountCode.name : 'Discount'}
          </Typography>
          <Typography component="span" variant="subtitle2">
            {discountCode ? fCurrency(-discountAmount) : '-'}
          </Typography>
        </Box>

        <Divider sx={{ borderStyle: 'dashed' }} />

        <Box display="flex">
          <Typography component="span" variant="subtitle1" sx={{ flexGrow: 1 }}>
            Total
          </Typography>

          <Box sx={{ textAlign: 'right' }}>
            <Typography
              component="span"
              variant="subtitle1"
              sx={{ display: 'block', color: 'error.main' }}
            >
              {fCurrency(totalAmount)}
            </Typography>
          </Box>
        </Box>

        {onApplyDiscount && (
          <>
            <TextField
              fullWidth
              placeholder="PROMO CODE"
              value={promoText}
              onChange={(e) => setPromoText(e.target.value)}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <Button color="primary" onClick={() => onApplyDiscount()} sx={{ mr: -0.5 }}>
                      Apply
                    </Button>
                  </InputAdornment>
                ),
              }}
            />
            <Typography variant="body2" sx={{ color: 'error.main' }}>
              {discountCodeMessage}
            </Typography>
          </>
        )}
      </Stack>
    </Card>
  );
}
