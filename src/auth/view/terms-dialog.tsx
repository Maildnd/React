import type { DialogProps } from '@mui/material/Dialog';

import Box from '@mui/material/Box';
import Dialog from '@mui/material/Dialog';

import { PrivacyPolicy } from './privacy-policy';
import { TermsOfService } from './terms-of-service';

// ----------------------------------------------------------------------
type Props = DialogProps & {
  onCloseDialog: () => void;
  dialogType: string;
};

export function TermsDialog({ open, dialogType, onCloseDialog }: Props) {
  return (
    <Dialog
      fullWidth
      fullScreen
      open={open}
      onClose={onCloseDialog}
      PaperProps={{
        sx: {
          width: '70%',
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
          mx: 'auto',
          px: 20,
          overflowY: 'auto',
        }}
      >
        {dialogType === 'termsOfService' && <TermsOfService />}
        {dialogType === 'privacyPolicy' && <PrivacyPolicy />}
      </Box>
    </Dialog>
  );
}
