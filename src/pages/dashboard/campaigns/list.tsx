import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import { CampaignsListView } from 'src/sections/campaigns/view/campaigns-list-view';

// ----------------------------------------------------------------------

const metadata = { title: `Campaigns list | Dashboard - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <CampaignsListView />
    </>
  );
}
