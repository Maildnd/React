import { useContext } from 'react';

import { GetCampaignsContext } from './get-campaigns-provider';

// ----------------------------------------------------------------------

export function useGetCampaignsContext() {
  const context = useContext(GetCampaignsContext);

  if (!context) throw new Error('useCreateCampaignContext must be use inside CampaignProvider');

  return context;
}
