import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import { AccountSetupView } from 'src/sections/account-setup/account-setup-view';

// ----------------------------------------------------------------------

const metadata = { title: `Account Setup - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <AccountSetupView />
    </>
  );
}
