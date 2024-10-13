import React from 'react';

import Box from '@mui/material/Box';
import { Card } from '@mui/material';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { OrderCompleteIllustration } from 'src/assets/illustrations';

const CampaignComplete = () => {
  const router = useRouter();

  console.log('CampaignComplete');

  const onNavigateToDashboard = () => {
    router.push(paths.dashboard.root);
  };

  return (
    <Card sx={{ mt: 4 }}>
      <Box
        gap={5}
        display="flex"
        alignItems="center"
        flexDirection="column"
        sx={{
          py: 5,
          m: 'auto',
          maxWidth: 480,
          textAlign: 'center',
          px: { xs: 2, sm: 0 },
        }}
      >
        <Typography variant="h4">Congratulations. Your campaign has been created!</Typography>

        <OrderCompleteIllustration />

        <Typography>
          You can track the progress of the campaign on the Campaigns tab.
          <br />
          <br />
          <br />
        </Typography>

        <Divider sx={{ width: 1, borderStyle: 'dashed' }} />

        <Box gap={2} display="flex" flexWrap="wrap" justifyContent="center">
          <Button size="large" variant="contained" onClick={onNavigateToDashboard}>
            Go to dashboard
          </Button>
        </Box>
      </Box>
    </Card>
  );
};

export default CampaignComplete;
