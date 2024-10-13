import { paths } from 'src/routes/paths';

import axios, { endpoints } from 'src/utils/axios';

import { setSession } from './utils';

// ----------------------------------------------------------------------

export type SignInParams = {
  email: string;
  password: string;
};

export type SignUpParams = {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
};

export type ResetPasswordParams = {
  email: string;
  options?: {
    redirectTo?: string;
    captchaToken?: string;
  };
};

export type UpdatePasswordParams = {
  password: string;
  options?: {
    emailRedirectTo?: string | undefined;
  };
};

/** **************************************
 * Sign in
 *************************************** */
export const signInWithPassword = async ({ email, password }: SignInParams): Promise<void> => {
  try {
    const params = { email, password };

    const res = await axios.post(endpoints.auth.signIn, params);
    const { access_token } = res.data;
    if (!access_token) {
      throw new Error(
        'Error Logging in. Access token not found in response. Please try again after sometime.'
      );
    } else {
      setSession(access_token);
    }
  } catch (error) {
    const errorMessage = error.details;
    throw new Error(errorMessage);
  }
};

/** **************************************
 * Sign up
 *************************************** */
export const signUp = async ({
  email,
  password,
  firstName,
  lastName,
}: SignUpParams): Promise<void> => {
  const params = {
    email,
    password,
    firstName,
    lastName,
    account_type: 'business',
  };

  try {
    const res = await axios.post(endpoints.auth.signUp, params);
    const { access_token } = res.data;
    if (!access_token) {
      throw new Error(
        'Error signing up. Access token not found in response. Please try again after sometime.'
      );
    } else {
      setSession(access_token);
    }
  } catch (error) {
    let errorMessage = error.details;
    if (error.code === 'weak_password') {
      errorMessage =
        'Invalid Password. Password should contain at least one upper case letter, one lower case letter, one number and one special character';
    }
    throw new Error(errorMessage);
  }
};

/** **************************************
 * Sign out
 *************************************** */
export const signOut = async (): Promise<void> => {
  try {
    await setSession(null);
    await axios.post(endpoints.auth.logout);
  } catch (error) {
    const errorMessage = error.details;
    throw new Error(errorMessage);
  }
};

/** **************************************
 * Reset password
 *************************************** */
export const resetPassword = async ({ email }: ResetPasswordParams): Promise<void> => {
  try {
    const res = await axios.post(endpoints.auth.resetPassword, {
      email,
      redirectTo: paths.auth.updatePassword,
    });
    console.log('Reset password response:', res);
  } catch (error) {
    const errorMessage = error.details;
    throw new Error(errorMessage);
  }
};

/** **************************************
 * Update password
 *************************************** */
export const updatePassword = async ({ password }: UpdatePasswordParams): Promise<void> => {
  try {
    const res = await axios.post(endpoints.auth.updatePassword, { password });
    console.log('Update password response:', res);
  } catch (error) {
    const errorMessage = error.details;
    throw new Error(errorMessage);
  }
};

/** **************************************
 * Verify OTP
 *************************************** */
export const verifyOTP = async ({ token_hash }: { token_hash: string | null }): Promise<void> => {
  try {
    const res = await axios.post(endpoints.auth.verifyOTP, { token_hash });
    console.log('Update password response:', res);
  } catch (error) {
    const errorMessage = error.details;
    throw new Error(errorMessage);
  }
};
