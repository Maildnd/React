import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import { BusinessAccountView } from 'src/sections/business-account/view/business-account-view';

// ----------------------------------------------------------------------

const metadata = { title: `Account settings | Dashboard - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <BusinessAccountView />
    </>
  );
}
