import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import { SetupProvider } from 'src/sections/setup/context';
import { SetupView } from 'src/sections/setup/view/setup-view';

// ----------------------------------------------------------------------

const metadata = { title: `Account Setup - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>
      <SetupProvider>
        <SetupView />
      </SetupProvider>
    </>
  );
}
