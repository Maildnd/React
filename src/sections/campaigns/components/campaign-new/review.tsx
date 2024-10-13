import { useState, useContext } from 'react';

import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Card from '@mui/material/Card';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Unstable_Grid2';
import { Box, Stack, Alert, Backdrop, AlertTitle, CircularProgress } from '@mui/material';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { useTabs } from 'src/hooks/use-tabs';

import { varAlpha } from 'src/theme/styles';

import { Iconify } from 'src/components/iconify';

import { Confirmation } from './confirmation';
import { createCampaign } from '../../context/action';
import { PDFPreview } from '../../campaign-details-pdf-preview';
import { CampaignDetailsSummary } from '../../campaign-details-summary';
import { CampaignDetailsCarousel } from '../../campaign-details-carousel';
import { CreateCampaignContext } from '../../context/create-campaign-provider';
import { CampaignDetailsDescription } from '../../campaign-details-description'; // Import your splash screen component

// ----------------------------------------------------------------------
const CampaignReview = () => {
  const campaignContext = useContext(CreateCampaignContext);
  const newCampaign = campaignContext?.newCampaign;
  console.log('File: ', newCampaign?.content.file);
  const router = useRouter();
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const tabs = useTabs('description');

  const handleSaveAsDraft = async () => {
    setLoading(true);
    try {
      const finalData = {
        ...newCampaign?.details,
        ...newCampaign?.content,
        ...newCampaign?.targets,
        ...newCampaign?.companyDetails,
        save_as_draft: true,
      };
      await createCampaign(finalData);
      campaignContext?.onReset();
      router.push(paths.dashboard.campaigns.root);
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };
  const handlePublishCampaign = () => {
    console.log('Publishing campaign');
    setShowConfirmation(true);
  };

  const onCloseConfirmation = () => {
    setShowConfirmation(false);
  };

  const onConfirm = async () => {
    try {
      const finalData = {
        ...newCampaign?.details,
        ...newCampaign?.content,
        ...newCampaign?.targets,
        ...newCampaign?.companyDetails,
        save_as_draft: false,
      };
      await createCampaign(finalData);
      campaignContext?.onReset();
      setShowConfirmation(false);
      campaignContext?.onNextStep();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      {!!errorMessage && (
        <Alert severity="error" onClose={() => setErrorMessage('')} sx={{ mb: 3 }}>
          <AlertTitle sx={{ textTransform: 'capitalize' }}> Error </AlertTitle>
          {errorMessage}
        </Alert>
      )}
      <Grid container spacing={{ xs: 3, md: 5, lg: 8 }}>
        <Grid xs={12} md={6} lg={5}>
          {newCampaign && <CampaignDetailsSummary newCampaign={newCampaign} />}
        </Grid>

        <Grid xs={12} md={6} lg={7}>
          {newCampaign?.content.content_type === 'images' && (
            <CampaignDetailsCarousel images={newCampaign?.content.images_url} />
          )}

          {newCampaign?.content.content_type === 'file' && (
            <PDFPreview file={newCampaign?.content.file} />
          )}
        </Grid>
      </Grid>

      {loading && (
        <Backdrop open sx={{ zIndex: (theme) => theme.zIndex.modal + 1 }}>
          <CircularProgress color="inherit" size={48} />
        </Backdrop>
      )}

      <Card sx={{ mt: 4 }}>
        <Tabs
          value={tabs.value}
          onChange={tabs.onChange}
          sx={{
            px: 3,
            boxShadow: (theme) =>
              `inset 0 -2px 0 0 ${varAlpha(theme.vars.palette.grey['500Channel'], 0.08)}`,
          }}
        >
          {[{ value: 'description', label: 'Description' }].map((tab) => (
            <Tab key={tab.value} value={tab.value} label={tab.label} />
          ))}
        </Tabs>

        {tabs.value === 'description' && (
          <CampaignDetailsDescription description={newCampaign?.details?.description ?? ''} />
        )}
      </Card>
      <Stack spacing={1.5} direction="row" sx={{ mb: { xs: 3, md: 5 }, mt: 3 }}>
        <Button
          startIcon={<Iconify icon="eva:arrow-ios-back-fill" width={16} />}
          onClick={campaignContext?.onBackStep}
        >
          Back
        </Button>
        <Box sx={{ flexGrow: 1 }} />
        <Button onClick={handleSaveAsDraft} variant="outlined">
          Save as Draft
        </Button>
        <Button onClick={handlePublishCampaign} variant="contained">
          Publish
        </Button>
      </Stack>

      <Confirmation
        open={showConfirmation}
        publish_type={newCampaign!.details.publish_type}
        start_date={newCampaign!.details.start_date}
        onClose={onCloseConfirmation}
        onConfirm={onConfirm}
      />
    </>
  );
};

export default CampaignReview;
