import { paths } from 'src/routes/paths';

import { EmailInboxIcon } from 'src/assets/icons';

import { FormHead } from '../../components/form-head';
import { FormReturnLink } from '../../components/form-return-link';

// ----------------------------------------------------------------------

export function VerifyView() {
  return (
    <>
      <FormHead
        icon={<EmailInboxIcon />}
        title="Please check your email!"
        description={`We've emailed a password reset link. \nPlease click on that link and you will be navigated to a page where you can reset your password.`}
      />

      <FormReturnLink href={paths.auth.signIn} sx={{ mt: 0 }} />
    </>
  );
}
