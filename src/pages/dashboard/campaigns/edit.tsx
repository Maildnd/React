import { Helmet } from 'react-helmet-async';

import { useParams } from 'src/routes/hooks';

import { CONFIG } from 'src/config-global';

import { CreateCampaignProvider } from 'src/sections/campaigns/context';
import { CampaignEditView } from 'src/sections/campaigns/view/campaign-edit-view';

// ----------------------------------------------------------------------

const metadata = { title: `Campaign edit | Dashboard - ${CONFIG.appName}` };

export default function Page() {
  const { id = '' } = useParams();

  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>
      <CreateCampaignProvider>
        <CampaignEditView campaignId={id} />
      </CreateCampaignProvider>
    </>
  );
}
