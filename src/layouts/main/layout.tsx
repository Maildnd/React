import type { Theme, SxProps, Breakpoint } from '@mui/material/styles';

import { useContext } from 'react';

import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';

import { Logo } from 'src/components/logo';

import { AuthContext } from 'src/auth/context/auth-context';

import { Main } from './main';
import { LayoutSection } from '../core/layout-section';
import { HeaderSection } from '../core/header-section';
import { SignInButton } from '../components/sign-in-button';
import { SignUpButton } from '../components/sign-up-button';
import { DashboradButton } from '../components/dashboard-button';

import type { NavMainProps } from './nav/types';

// ----------------------------------------------------------------------

export type MainLayoutProps = {
  sx?: SxProps<Theme>;
  children: React.ReactNode;
  header?: {
    sx?: SxProps<Theme>;
  };
  data?: {
    nav?: NavMainProps['data'];
  };
};

export function MainLayout({ sx, data, children, header }: MainLayoutProps) {
  const userState = useContext(AuthContext);
  const user = userState?.user;

  const layoutQuery: Breakpoint = 'md';

  return (
    <LayoutSection
      /** **************************************
       * Header
       *************************************** */
      headerSection={
        <HeaderSection
          layoutQuery={layoutQuery}
          sx={header?.sx}
          slots={{
            topArea: (
              <Alert severity="info" sx={{ display: 'none', borderRadius: 0 }}>
                This is an info Alert.
              </Alert>
            ),
            leftArea: (
              <>
                {/* -- Logo -- */}
                <Logo />
              </>
            ),
            rightArea: (
              <>
                {/* -- Nav desktop -- */}
                {user != null && user.profile_completed && <DashboradButton />}
                {(user == null || !user.profile_completed) && (
                  <Box display="flex" alignItems="center" gap={{ xs: 1, sm: 1.5 }}>
                    {/* -- Sign in button -- */}
                    <SignInButton />
                    {/* -- Sign up button -- */}
                    <SignUpButton />
                  </Box>
                )}
              </>
            ),
          }}
        />
      }
      /** **************************************
       * Footer
       *************************************** */
      // footerSection={homePage ? <HomeFooter /> : <Footer layoutQuery={layoutQuery} />}
      /** **************************************
       * Style
       *************************************** */
      sx={sx}
    >
      <Main>{children}</Main>
    </LayoutSection>
  );
}
