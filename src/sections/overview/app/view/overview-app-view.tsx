import type { DashboardDetails } from 'src/sections/dashborad/types/dashborad-context-type';

import { useState, useEffect, useContext } from 'react';

import Button from '@mui/material/Button';
import { useTheme } from '@mui/material/styles';
import Grid from '@mui/material/Unstable_Grid2';
import { Backdrop, Typography, CircularProgress } from '@mui/material';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { DashboardContent } from 'src/layouts/dashboard';
import { SeoIllustration } from 'src/assets/illustrations';

import { getDashboardDetails } from 'src/sections/dashborad/context/action';

// import { useMockedUser } from 'src/auth/hooks';
import { AuthContext } from 'src/auth/context/auth-context';

import { AppWelcome } from '../app-welcome';
import { AppWidgetSummary } from '../app-widget-summary';

// ----------------------------------------------------------------------

export function OverviewAppView() {
  const router = useRouter();

  // const { user } = useMockedUser();
  const userState = useContext(AuthContext);
  const displayName = userState?.user?.name ?? 'GUEST NAME';
  const [loading, setLoading] = useState(false);
  const [details, setDetails] = useState<DashboardDetails | null>(null);
  // const profileCompleted = userState?.user?.profile_completed ?? false;

  useEffect(() => {
    setLoading(true);
    const getDetails = async () => {
      try {
        const res = await getDashboardDetails(userState?.user?.business_account.id ?? '');
        if (res) {
          setDetails(res);
        }
      } catch (error) {
        console.error('Error during get campaigns:', error);
      }
      setLoading(false);
    };
    getDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const theme = useTheme();

  const createCampaignHandler = () => {
    router.push(paths.dashboard.campaigns.new);
  };

  return (
    <DashboardContent maxWidth="xl">
      <Grid container spacing={3}>
        <Grid xs={12} md={12}>
          <AppWelcome
            title={`Welcome back 👋 \n ${displayName}`}
            description="Make the most out of your next direct mail campaign by partnering with Bramble! "
            img={<SeoIllustration hideBackground />}
            action={
              <Button variant="contained" color="primary" onClick={createCampaignHandler}>
                Create Campaign
              </Button>
            }
          />
        </Grid>
        {loading && (
          <Backdrop open sx={{ zIndex: (tm) => tm.zIndex.modal + 1 }}>
            <CircularProgress color="inherit" size={48} />
          </Backdrop>
        )}
        <Grid xs={12} md={3}>
          <AppWidgetSummary
            title="Campaigns published"
            percent={details?.campaigns_percent_increase ?? 0}
            total={details?.number_of_campaigns ?? 0}
            chart={{
              categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
              series: [15, 18, 12, 51, 68, 11, 39, 37],
            }}
          />
        </Grid>

        <Grid xs={12} md={3}>
          <AppWidgetSummary
            title="Total mails sent"
            percent={details?.mails_sent_percent_increase ?? 0}
            total={details?.total_mail_sent ?? 0}
            chart={{
              colors: [theme.vars.palette.info.main],
              categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
              series: [20, 41, 63, 33, 28, 35, 50, 46],
            }}
          />
        </Grid>

        <Grid xs={12} md={3}>
          <AppWidgetSummary
            title="Mails opened"
            percent={details?.mails_opened_percent_increase ?? 0}
            total={details?.total_mail_opened ?? 0}
            chart={{
              colors: [theme.vars.palette.error.main],
              categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
              series: [18, 19, 31, 8, 16, 37, 12, 33],
            }}
          />
        </Grid>

        <Grid xs={12} md={3}>
          <AppWidgetSummary
            title="Unique targets"
            percent={details?.unique_targets_percent_increase ?? 0}
            total={details?.unique_targets ?? 0}
            chart={{
              colors: [theme.vars.palette.error.main],
              categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
              series: [18, 19, 31, 8, 16, 37, 12, 33],
            }}
          />
        </Grid>
      </Grid>
      <Typography variant="body1" sx={{ mt: 5 }}>
        We will be adding more components on this page as we gather more data.
      </Typography>
    </DashboardContent>
  );
}
