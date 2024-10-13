import type { ICampaignItem } from 'src/types/campaign';

import { useState, useEffect, useContext } from 'react';

import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Card from '@mui/material/Card';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Unstable_Grid2';
import { Box, Stack, Backdrop, Container, AlertTitle, CircularProgress } from '@mui/material';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { useTabs } from 'src/hooks/use-tabs';

import { varAlpha } from 'src/theme/styles';

import { Iconify } from 'src/components/iconify';

import { PDFPreview } from '../campaign-details-pdf-preview';
import { CampaignDetailsSummary } from '../campaign-details-summary';
import { CampaignDetailsCarousel } from '../campaign-details-carousel';
import { CampaignDetailsDescription } from '../campaign-details-description'; // Import your splash screen component

import { publishCampaign } from '../context/action';
import { Confirmation } from '../components/campaign-new/confirmation';
import { GetCampaignsContext } from '../context/get-campaigns-provider';
import useConvertCampaignRecord from '../context/use-convert-campaign-record';

// ----------------------------------------------------------------------
const CampaignDetailsView = ({ selectedCampaignId }: { selectedCampaignId: string }) => {
  const router = useRouter();
  const getCampaignsContext = useContext(GetCampaignsContext);
  const campaign = getCampaignsContext?.campaigns.find((item) => item.id === selectedCampaignId);
  console.log('campaign status: ', campaign?.status);
  const [selectedCampaign, setSelectedCampaign] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showConfirmation, setShowConfirmation] = useState(false);

  const [file, setFile] = useState(new File([], ''));
  const tabs = useTabs('description');

  useEffect(() => {
    const ConvertCampaignRecord = async () => {
      const campUpdated = await useConvertCampaignRecord({ campaignRecord: campaign } as {
        campaignRecord: ICampaignItem;
      });
      console.log(campUpdated);
      setSelectedCampaign(campUpdated);
    };
    ConvertCampaignRecord();

    if (campaign?.content_type !== 'file') return;
    const fetchFile = async () => {
      try {
        const fileUrl = campaign?.file;
        const response = await fetch(fileUrl);
        const blob = await response.blob();
        const fileName = fileUrl.split('/').pop() || 'file.pdf';
        const urlFile = new File([blob], fileName, { type: blob.type });
        setFile(urlFile);
      } catch (error) {
        console.error('Error fetching file:', error);
      }
    };

    fetchFile();
  }, [campaign]);

  const backToCampaigns = () => {
    router.push(paths.dashboard.campaigns.root);
  };

  const handlePublishCampaign = () => {
    console.log('Publishing campaign');
    setShowConfirmation(true);
  };

  const onCloseConfirmation = () => {
    setShowConfirmation(false);
  };

  const onConfirm = async () => {
    setLoading(true);
    try {
      await publishCampaign(selectedCampaignId, campaign?.publish_type || 'now');
      setLoading(false);
      setShowConfirmation(false);
      router.push(paths.dashboard.campaigns.root);
    } catch (error) {
      console.error(error);
      setErrorMessage(typeof error === 'string' ? error : error.message);
      setShowConfirmation(false);
      setLoading(false);
    }
  };

  return (
    <Container sx={{ mb: 10 }}>
      {!!errorMessage && (
        <Alert severity="error" onClose={() => setErrorMessage('')} sx={{ mb: 3 }}>
          <AlertTitle sx={{ textTransform: 'capitalize' }}> Error </AlertTitle>
          {errorMessage}
        </Alert>
      )}
      <Grid container spacing={{ xs: 3, md: 5, lg: 8 }}>
        <Grid xs={12} md={6} lg={5}>
          {selectedCampaign && <CampaignDetailsSummary newCampaign={selectedCampaign} />}
        </Grid>

        <Grid xs={12} md={6} lg={7}>
          {campaign?.content_type === 'images' && (
            <CampaignDetailsCarousel images={campaign?.images} />
          )}

          {campaign?.content_type === 'file' && <PDFPreview file={file} />}
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
          <CampaignDetailsDescription description={campaign?.description ?? ''} />
        )}
      </Card>
      <Stack spacing={1.5} direction="row" sx={{ mb: { xs: 3, md: 5 }, mt: 3 }}>
        <Button
          startIcon={<Iconify icon="eva:arrow-ios-back-fill" width={16} />}
          onClick={backToCampaigns}
        >
          Back to campaigns
        </Button>
        <Box sx={{ flexGrow: 1 }} />
        {campaign?.status === 'draft' && (
          <Button onClick={handlePublishCampaign} variant="contained">
            Publish
          </Button>
        )}
      </Stack>

      <Confirmation
        open={showConfirmation}
        publish_type={selectedCampaign?.details.publish_type}
        start_date={selectedCampaign?.details.start_date}
        onClose={onCloseConfirmation}
        onConfirm={onConfirm}
      />
    </Container>
  );
};

export default CampaignDetailsView;
