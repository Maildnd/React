import type { ICampaignItem } from 'src/types/campaign';

import { useState, useEffect, useContext } from 'react';

import { Grid, Container, Typography } from '@mui/material';

import { paths } from 'src/routes/paths';

import { DashboardContent } from 'src/layouts/dashboard';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { NewCampaignSteps } from '../campaign-new-steps';
import CampaignReview from '../components/campaign-new/review';
import CampaignDetails from '../components/campaign-new/details';
import CampaignContent from '../components/campaign-new/content';
import CampaignTargets from '../components/campaign-new/targets';
import CampaignComplete from '../components/campaign-new/complete';
import { CAMPAIGN_NEW_STEPS } from '../data/campaign-new-steps-data';
import { GetCampaignsContext } from '../context/get-campaigns-provider';
import { CreateCampaignContext } from '../context/create-campaign-provider';
import useConvertCampaignRecord from '../context/use-convert-campaign-record';
import CampaignCompanyDetails from '../components/campaign-new/company-details';

// ----------------------------------------------------------------------

type Props = {
  campaignId: string;
};

export function CampaignEditView({ campaignId }: Props) {
  const campaignContext = useContext(CreateCampaignContext);
  const getCampaignsContext = useContext(GetCampaignsContext);
  const campaign = getCampaignsContext?.campaigns.find((item) => item.id === campaignId);

  const [showComponent, setShowComponent] = useState(false);

  useEffect(() => {
    const ConvertCampaignRecord = async () => {
      const selectedCampaign = await useConvertCampaignRecord({ campaignRecord: campaign } as {
        campaignRecord: ICampaignItem;
      });
      console.log(selectedCampaign);
      campaignContext?.onSetCampaignItem(selectedCampaign);
      setShowComponent(true);
    };
    ConvertCampaignRecord();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [campaign]);

  return (
    <>
      <DashboardContent>
        <CustomBreadcrumbs
          heading="Edit"
          links={[
            { name: 'Dashboard', href: paths.dashboard.root },
            { name: 'Campaigns', href: paths.dashboard.campaigns.root },
            { name: campaign?.title || '...' },
          ]}
          sx={{ mb: { xs: 3, md: 5 } }}
        />
      </DashboardContent>

      {showComponent && (
        <Container sx={{ mb: 10 }}>
          <Typography variant="h4" sx={{ my: { xs: 3, md: 5 } }}>
            Edit Campaign
          </Typography>

          <Grid container justifyContent={campaignContext?.completed ? 'center' : 'flex-start'}>
            <Grid item xs={12} md={12}>
              <NewCampaignSteps
                activeStep={campaignContext?.activeStep}
                steps={CAMPAIGN_NEW_STEPS}
              />
            </Grid>
          </Grid>

          {campaignContext?.activeStep === 0 && <CampaignDetails />}

          {campaignContext?.activeStep === 1 && <CampaignContent />}

          {campaignContext?.activeStep === 2 && <CampaignTargets />}

          {campaignContext?.activeStep === 3 && <CampaignCompanyDetails />}

          {campaignContext?.activeStep === 4 && <CampaignReview />}

          {campaignContext?.completed && <CampaignComplete />}
        </Container>
      )}
    </>
  );
}
