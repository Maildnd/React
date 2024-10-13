import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import { CreateCampaignProvider } from 'src/sections/campaigns/context';
import { CampaignCreateView } from 'src/sections/campaigns/view/campaign-create-view';

// ----------------------------------------------------------------------

const metadata = { title: `Create a new campaign| Dashboard - ${CONFIG.appName}` };

export default function NewCampaignPage() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <CreateCampaignProvider>
        <CampaignCreateView />
      </CreateCampaignProvider>
    </>
  );
}
