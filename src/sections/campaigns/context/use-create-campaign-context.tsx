import { useContext } from 'react';

import { CreateCampaignContext } from './create-campaign-provider';

// ----------------------------------------------------------------------

export function useCreateCampaignContext() {
  const context = useContext(CreateCampaignContext);

  if (!context) throw new Error('useCreateCampaignContext must be use inside CampaignProvider');

  return context;
}
