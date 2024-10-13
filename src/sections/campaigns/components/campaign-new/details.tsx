import { z as zod } from 'zod';
import { useForm } from 'react-hook-form';
import { useMemo, useContext } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';

import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import { Button } from '@mui/material';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';

import { Iconify } from 'src/components/iconify';
import { Form, Field, schemaHelper } from 'src/components/hook-form';

import { _tags, PUBLISH_TYPES } from '../../types/_campaign';
import { CreateCampaignContext } from '../../context/create-campaign-provider';

import type { IDetails } from '../../types/campaign-context-type';

type DetailsSchema = zod.infer<typeof Details>;

const Details = zod.object({
  title: zod.string().min(1, { message: 'Title is required!' }),
  caption: zod.string().min(1, { message: 'Caption is required!' }),
  description: schemaHelper.editor({ message: { required_error: 'Description is required!' } }),
  tags: zod.array(zod.string()),
  publish_type: zod.string(),
  start_date: zod.string().refine((val) => true, {
    message: 'Start Date must be in the future!',
  }),
});

const CampaignDetails = () => {
  const campaignContext = useContext(CreateCampaignContext);
  const details = campaignContext?.newCampaign?.details;
  if (!details) {
    campaignContext?.onReset();
  }

  const defaultValues = useMemo(
    () => ({
      title: details?.title || '',
      caption: details?.caption || '',
      description: details?.description || '',
      tags: details?.tags || [],
      publish_type: details?.publish_type || 'now',
      start_date: details?.start_date?.toString() || new Date().toISOString(),
    }),
    [details]
  );

  const methods = useForm<DetailsSchema>({
    resolver: zodResolver(Details),
    defaultValues,
  });

  const { setValue, watch, handleSubmit } = methods;
  const values = watch();

  const handlePublishTypeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue('publish_type', event.target.value);
    if (event.target.value === 'schedule') {
      Details.shape.start_date = zod.string().refine(
        (val) => {
          const date = new Date(val);
          return date.getTime() > Date.now();
        },
        {
          message: 'Start Date must be in the future!',
        }
      );
    } else if (event.target.value === 'now') {
      Details.shape.start_date = zod.string().refine((val) => true, {
        message: 'Start Date must be in the future!',
      });
    }
  };

  const onSubmit = handleSubmit(async (data) => {
    try {
      campaignContext?.onSetCampaignDetails(data as IDetails);
      campaignContext?.onNextStep();
    } catch (error) {
      console.error(error);
    }
  });

  return (
    <Form methods={methods} onSubmit={onSubmit}>
      <Card>
        <CardHeader title="Details" subheader="Title, short description, image..." sx={{ mb: 3 }} />

        <Divider />

        <Stack spacing={3} sx={{ p: 3 }}>
          <Field.Text name="title" label="Title" />

          <Field.Text name="caption" label="Caption" multiline rows={2} />

          <Stack spacing={1.5}>
            <Typography variant="subtitle2">Description</Typography>
            <Field.Editor name="description" sx={{ minHeight: 480 }} />
          </Stack>

          <Field.Autocomplete
            name="tags"
            label="Tags"
            placeholder="+ Tags"
            multiple
            freeSolo
            disableCloseOnSelect={false}
            options={_tags.map((option) => option)}
            getOptionLabel={(option) => option}
            renderOption={(props, option) => (
              <li {...props} key={option}>
                {option}
              </li>
            )}
            onChange={(event, newValue) => {
              console.log('newValue', newValue);
              setValue('tags', newValue);
            }}
            renderTags={(selected, getTagProps) =>
              selected.map((option, index) => (
                <Chip
                  {...getTagProps({ index })}
                  key={option}
                  label={option}
                  size="small"
                  color="info"
                  variant="soft"
                />
              ))
            }
          />
          <Field.Select
            native
            name="publish_type"
            label="Publish Type"
            InputLabelProps={{ shrink: true }}
            onChange={handlePublishTypeChange}
          >
            {PUBLISH_TYPES.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </Field.Select>
          {values.publish_type === 'schedule' && (
            <Field.MobileDateTimePicker name="start_date" label="Start Date" />
          )}
        </Stack>
      </Card>
      <Stack
        spacing={3}
        direction="row"
        alignItems="center"
        justifyContent="flex-end"
        flexWrap="wrap"
        sx={{ mt: 3 }}
      >
        <Button endIcon={<Iconify icon="eva:arrow-ios-forward-fill" width={16} />} type="submit">
          Next
        </Button>
      </Stack>
    </Form>
  );
};

export default CampaignDetails;
