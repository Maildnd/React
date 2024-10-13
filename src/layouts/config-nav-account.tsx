import { paths } from 'src/routes/paths';

import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

export const _account = [
  {
    label: 'Home',
    href: '/',
    icon: <Iconify icon="solar:home-angle-bold-duotone" />,
  },
  {
    label: 'Account settings',
    href: paths.dashboard.businessAccount.root,
    icon: <Iconify icon="solar:settings-bold-duotone" />,
  },
];
