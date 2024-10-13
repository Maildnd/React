import type { DialogProps } from '@mui/material/Dialog';

import { useState } from 'react';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import { Backdrop, CircularProgress } from '@mui/material';

// ----------------------------------------------------------------------

type Props = DialogProps & {
  open: boolean;
  publish_type: string;
  start_date: string;
  onClose: () => void;
  onConfirm: () => void;
};

export function Confirmation({
  open,
  onClose,
  publish_type,
  start_date,
  onConfirm,
  ...other
}: Props) {
  const dateObject = new Date(start_date);
  const dateDisplay = dateObject.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
  });

  const [loading, setLoading] = useState(false);

  const onConfirmHandler = async () => {
    setLoading(true);
    try {
      await onConfirm();
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error(error);
    }
  };

  return (
    <Dialog
      fullWidth
      fullScreen
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          width: '60%',
          height: '60%',
          borderRadius: 2,
        },
      }}
      {...other}
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
        <Typography variant="h4">Confirm Campaign Publish</Typography>

        {publish_type === 'now' && (
          <Typography>
            You have selected to publish this campaign as Now. All the selected targets will receive
            the campaign mail right away.
            <br />
            <br />
            Are you sure you want to publish this campaign?
          </Typography>
        )}

        {publish_type === 'schedule' && (
          <Typography>
            You have selected to publish this campaign at a scheduled time. All the selected targets
            will receive the campaign at <br />
            <br />
            <Typography fontWeight="bold">{dateDisplay}.</Typography> <br />
            <br />
            You cannot make changes to the campaign once it is scheduled. Are you sure you want to
            schedule the campaign?
          </Typography>
        )}

        {loading && (
          <Backdrop open sx={{ zIndex: (theme) => theme.zIndex.modal + 1 }}>
            <CircularProgress color="inherit" size={48} />
          </Backdrop>
        )}

        <Divider sx={{ width: 1, borderStyle: 'dashed' }} />

        <Box gap={2} display="flex" flexWrap="wrap" justifyContent="center">
          <Button size="large" variant="outlined" onClick={onClose}>
            Cancel
          </Button>
          <Button size="large" variant="contained" onClick={onConfirmHandler}>
            Confirm
          </Button>
        </Box>
      </Box>
    </Dialog>
  );
}
