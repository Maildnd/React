import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';

import { OrderCompleteIllustration } from 'src/assets/illustrations';

// ----------------------------------------------------------------------
type Props = {
  onReset: () => void;
};

export function SetupComplete({ onReset }: Props) {
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
        <Typography variant="h4">Thank you for your subscription!</Typography>

        <OrderCompleteIllustration />

        <Typography>
          Lets create your first marketing campaign on Maildnd.
          <br />
        </Typography>

        <Divider sx={{ width: 1, borderStyle: 'dashed' }} />

        <Box gap={2} display="flex" flexWrap="wrap" justifyContent="center">
          <Button size="large" variant="contained" onClick={onReset}>
            Go to dashboard
          </Button>
        </Box>
      </Box>
    </Dialog>
  );
}
