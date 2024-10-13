import { Helmet } from 'react-helmet-async';

import { useParams } from 'src/routes/hooks';

import { CONFIG } from 'src/config-global';

import CampaignDetailsView from 'src/sections/campaigns/view/campaign-details-view';

// ----------------------------------------------------------------------

const metadata = { title: `Campaign details | Dashboard - ${CONFIG.appName}` };

export default function Page() {
  const { id = '' } = useParams();
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <CampaignDetailsView selectedCampaignId={id} />
    </>
  );
}
