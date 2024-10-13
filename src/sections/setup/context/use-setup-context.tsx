import { useContext } from 'react';

import { SetupContext } from './setup-provider';

// ----------------------------------------------------------------------

export function useSetupContext() {
  const context = useContext(SetupContext);

  if (!context) throw new Error('useSetupContext must be use inside SetupProvider');

  return context;
}
