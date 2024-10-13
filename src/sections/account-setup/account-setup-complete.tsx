import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { OrderCompleteIllustration } from 'src/assets/illustrations';

// ----------------------------------------------------------------------
export function SetupComplete() {
  const router = useRouter();
  const navigateToDashboard = () => {
    router.push(paths.dashboard.root);
  };

  return (
    <Dialog
      fullWidth
      fullScreen
      open
      PaperProps={{
        sx: {
          width: { md: `calc(100% - 48px)` },
          height: { md: `calc(100% - 48px)` },
        },
      }}
    >
      <Box
        gap={5}
        display="flex"
        alignItems="center"
        flexDirection="column"
        sx={{
          py: 5,
          m: 'auto',
          maxWidth: 480,
          textAlign: 'center',
          px: { xs: 2, sm: 0 },
        }}
      >
        <Typography variant="h4">Account setup successful!</Typography>

        <OrderCompleteIllustration />

        <Typography>
          Lets create your first marketing campaign on Bramble.
          <br />
        </Typography>

        <Divider sx={{ width: 1, borderStyle: 'dashed' }} />

        <Box gap={2} display="flex" flexWrap="wrap" justifyContent="center">
          <Button size="large" variant="contained" onClick={navigateToDashboard}>
            Go to dashboard
          </Button>
        </Box>
      </Box>
    </Dialog>
  );
}
