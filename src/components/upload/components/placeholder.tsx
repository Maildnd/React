import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';

import { UploadIllustration } from 'src/assets/illustrations';

import type { PlaceHolderProps } from '../types';

// ----------------------------------------------------------------------

export function UploadPlaceholder({
  multiple,
  title,
  description,
  sx,
  ...other
}: PlaceHolderProps) {
  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="center"
      flexDirection="column"
      sx={sx}
      {...other}
    >
      <UploadIllustration hideBackground sx={{ width: 200 }} />

      <Stack spacing={1} sx={{ textAlign: 'center' }}>
        <Box sx={{ typography: 'h6' }}>{title}</Box>
        <Box sx={{ typography: 'body2', color: 'text.secondary' }}>
          {description}
          {/* Drop files here or click to
          <Box
            component="span"
            sx={{ mx: 0.5, color: 'primary.main', textDecoration: 'underline' }}
          >
            browse
          </Box>
          through your machine. */}
        </Box>
      </Stack>
    </Box>
  );
}
