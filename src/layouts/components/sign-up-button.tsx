import type { ButtonProps } from '@mui/material/Button';

import Button from '@mui/material/Button';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

// ----------------------------------------------------------------------

export function SignUpButton({ sx, ...other }: ButtonProps) {
  return (
    <Button component={RouterLink} href={paths.auth.signUp} variant="contained" sx={sx} {...other}>
      Get Started
    </Button>
  );
}
