import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';

import type { CampaignItem } from './types/campaign-context-type';

// ----------------------------------------------------------------------
type CampaignDetailsSummaryProps = {
  newCampaign: CampaignItem;
};

export function CampaignDetailsSummary({ newCampaign }: CampaignDetailsSummaryProps) {
  const { details, content, companyDetails, targets } = newCampaign;
  console.log('Details:', details);
  console.log('companyDetails:', companyDetails);
  const renderTags = (
    <Stack direction="column">
      <Typography variant="subtitle2" sx={{ flexGrow: 1 }}>
        Tags
      </Typography>

      <Stack spacing={1}>
        <Typography variant="body2" component="div" sx={{ textAlign: 'left' }}>
          {details?.tags.toString()}
        </Typography>
      </Stack>
    </Stack>
  );
  const renderPublishType = (
    <Stack direction="column">
      <Typography variant="subtitle2" sx={{ flexGrow: 1 }}>
        Publish Type
      </Typography>

      <Stack spacing={1}>
        <Typography variant="body2" component="div" sx={{ textAlign: 'left' }}>
          {details?.publish_type}
        </Typography>
      </Stack>
    </Stack>
  );
  const renderCoupons = (
    <Stack direction="column">
      <Typography variant="subtitle2" sx={{ flexGrow: 1 }}>
        Coupons
      </Typography>

      <Stack spacing={1}>
        <Typography variant="body2" component="div" sx={{ textAlign: 'left' }}>
          {content?.coupons_url.length}
        </Typography>
      </Stack>
    </Stack>
  );
  const renderPromotions = (
    <Stack direction="column">
      <Typography variant="subtitle2" sx={{ flexGrow: 1 }}>
        Promotions
      </Typography>

      <Stack spacing={1}>
        <Typography variant="body2" component="div" sx={{ textAlign: 'left' }}>
          {content?.promotions_url.length}
        </Typography>
      </Stack>
    </Stack>
  );

  const renderResidents = (
    <Stack direction="column">
      <Typography variant="subtitle2" sx={{ flexGrow: 1 }}>
        Potential Targets
      </Typography>

      <Stack spacing={1}>
        <Typography variant="body2" component="div" sx={{ textAlign: 'left' }}>
          {targets?.residents_count}{' '}
          <Typography variant="body2" sx={{ fontStyle: 'italic' }}>
            (actual number might change as users are actively registering)
          </Typography>
        </Typography>
      </Stack>
    </Stack>
  );

  const renderAddress = (
    <Stack direction="column">
      <Typography variant="subtitle2" sx={{ flexGrow: 1 }}>
        Address
      </Typography>

      <Stack spacing={1}>
        <Typography variant="body2" component="div" sx={{ textAlign: 'left' }}>
          {companyDetails?.address_string}
        </Typography>
      </Stack>
    </Stack>
  );
  const renderSocial = (
    <Stack direction="column">
      <Typography variant="subtitle2" sx={{ flexGrow: 1 }}>
        Website
      </Typography>

      <Stack spacing={1}>
        <Typography variant="body2" component="div" sx={{ textAlign: 'left' }}>
          {companyDetails?.website.toString()}
        </Typography>
      </Stack>
    </Stack>
  );

  return (
    <Stack spacing={3} sx={{ pt: 3 }}>
      <Stack spacing={2} alignItems="flex-start">
        <Typography variant="h4">{details.title}</Typography>
        <Typography variant="subtitle1" sx={{ color: 'text.secondary' }}>
          {details?.caption}
        </Typography>
      </Stack>
      <Divider sx={{ borderStyle: 'dashed' }} />
      {renderTags}
      <Divider sx={{ borderStyle: 'dashed' }} />
      {renderPublishType}
      <Divider sx={{ borderStyle: 'dashed' }} />
      {renderCoupons}
      <Divider sx={{ borderStyle: 'dashed' }} />
      {renderPromotions}
      <Divider sx={{ borderStyle: 'dashed' }} />
      {renderResidents}
      <Divider sx={{ borderStyle: 'dashed' }} />
      {renderAddress}
      <Divider sx={{ borderStyle: 'dashed' }} />
      {renderSocial}
    </Stack>
  );
}
