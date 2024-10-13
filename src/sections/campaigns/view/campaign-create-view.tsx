import { useEffect, useContext } from 'react';

import { Grid, Container, Typography } from '@mui/material';

import { NewCampaignSteps } from '../campaign-new-steps';
import CampaignReview from '../components/campaign-new/review';
import CampaignDetails from '../components/campaign-new/details';
import CampaignContent from '../components/campaign-new/content';
import CampaignTargets from '../components/campaign-new/targets';
import CampaignComplete from '../components/campaign-new/complete';
import { CAMPAIGN_NEW_STEPS } from '../data/campaign-new-steps-data';
import { CreateCampaignContext } from '../context/create-campaign-provider';
import CampaignCompanyDetails from '../components/campaign-new/company-details';

// ----------------------------------------------------------------------

export function CampaignCreateView() {
  const campaignContext = useContext(CreateCampaignContext);

  useEffect(() => {
    campaignContext?.initialStep();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Container sx={{ mb: 10 }}>
      <Typography variant="h4" sx={{ my: { xs: 3, md: 5 } }}>
        New Campaign
      </Typography>

      <Grid container justifyContent={campaignContext?.completed ? 'center' : 'flex-start'}>
        <Grid item xs={12} md={12}>
          <NewCampaignSteps activeStep={campaignContext?.activeStep} steps={CAMPAIGN_NEW_STEPS} />
        </Grid>
      </Grid>

      {campaignContext?.activeStep === 0 && <CampaignDetails />}

      {campaignContext?.activeStep === 1 && <CampaignContent />}

      {campaignContext?.activeStep === 2 && <CampaignTargets />}

      {campaignContext?.activeStep === 3 && <CampaignCompanyDetails />}

      {campaignContext?.activeStep === 4 && <CampaignReview />}

      {campaignContext?.completed && <CampaignComplete />}
    </Container>
  );
}
