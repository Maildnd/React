import { z as zod } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMemo, useContext, useCallback } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import CardHeader from '@mui/material/CardHeader';
import { Button, Typography } from '@mui/material';

import { CONTENT_TYPES } from 'src/_mock';

import { Iconify } from 'src/components/iconify';
import { Form, Field, schemaHelper } from 'src/components/hook-form';

import { CreateCampaignContext } from '../../context/create-campaign-provider';

import type { IContent } from '../../types/campaign-context-type';

type ContentSchema = zod.infer<typeof Content>;

const Content = zod.object({
  content_type: zod.string(),
  images: schemaHelper.files({
    minFiles: 0,
  }),
  file: schemaHelper.file({ minFiles: 0 }),
  coupons: schemaHelper.files({ minFiles: 0 }),
  promotions: schemaHelper.files({ minFiles: 0 }),
  images_url: zod.array(zod.string()),
});

const CampaignContent = () => {
  const campaignContext = useContext(CreateCampaignContext);
  const content = campaignContext?.newCampaign?.content;
  console.log('CONTENT', content);
  const defaultValues = useMemo(
    () => ({
      content_type: content?.content_type || 'images',
      images: content?.images || ([] as File[]),
      file: content?.file || '',
      promotions: content?.promotions || [],
      coupons: content?.coupons || [],
      images_url: content?.images_url || ([] as string[]),
    }),
    [content]
  );

  const methods = useForm<ContentSchema>({
    resolver: zodResolver(Content),
    defaultValues,
  });

  const { setValue, watch, handleSubmit } = methods;
  const values = watch();

  if (values.content_type === 'images') {
    Content.shape.images = schemaHelper.files({
      minFiles: 1,
      message: {
        required_error: 'Atleast one image is required if the content type is Images',
      },
    });
  }

  const onSubmit = handleSubmit(async (data) => {
    console.info('DATA', data);
    try {
      const contentData = {
        ...data,
        images_url: data.images?.map((file: any) => URL.createObjectURL(file)),
        file_url: data.content_type === 'file' ? URL.createObjectURL(data.file as File) : '',
        coupons_url: data.coupons.map((file: any) => URL.createObjectURL(file)),
        promotions_url: data.promotions.map((file: any) => URL.createObjectURL(file)),
      };
      campaignContext?.onSetCampaignContent(contentData as IContent);
      campaignContext?.onNextStep();
    } catch (error) {
      console.error(error);
    }
  });

  const handleContentTypeChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const contentTypeValue = event.target.value;
      setValue('content_type', contentTypeValue);
      if (contentTypeValue === 'file') {
        Content.shape.file = schemaHelper.file({
          message: { required_error: 'File is required if if the content type is File' },
        });
        Content.shape.images = schemaHelper.files({
          minFiles: 0,
        });
        setValue('images', []);
      }
      if (contentTypeValue === 'images') {
        Content.shape.images = schemaHelper.files({
          minFiles: 1,
          message: {
            required_error: 'Atleast one image is required if the content type is Images',
          },
        });
        Content.shape.file = schemaHelper.file({ minFiles: 0 });
        setValue('file', null);
      }
      console.log('ContentSchema', Content);
    },

    [setValue]
  );

  const handleRemoveAll = useCallback(
    (type: 'images' | 'coupons' | 'promotions') => {
      setValue(type, []);
    },
    [setValue]
  );

  const handleRemove = useCallback(
    (inputFile: any, type: 'images' | 'coupons' | 'promotions') => {
      const filtered = values[type] && values[type]?.filter((file: any) => file !== inputFile);
      setValue(type, filtered);
    },
    [setValue, values]
  );

  return (
    <Form methods={methods} onSubmit={onSubmit}>
      <Card>
        <CardHeader
          title="Content"
          subheader="Design content for this campaign..."
          sx={{ mb: 3 }}
        />
        <Divider />

        <Stack spacing={3} sx={{ p: 3 }}>
          <Stack spacing={1}>
            <Field.Select
              native
              name="content_type"
              label="Content Type"
              InputLabelProps={{ shrink: true }}
              onChange={handleContentTypeChange}
            >
              {CONTENT_TYPES.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </Field.Select>
          </Stack>

          {values.content_type === 'images' && (
            <Stack spacing={1.5}>
              <Field.Upload
                multiple
                thumbnail
                name="images"
                accept={{ 'image/*': [] }}
                maxFiles={8}
                maxSize={3145728}
                onRemove={(input: any) => handleRemove(input, 'images')}
                onRemoveAll={() => handleRemoveAll('images')}
                onUpload={() => console.info('ON UPLOAD')}
                placeHolderTitle="Drop your images here."
                placeHolderDescription="Drop images here or click to browse through your machine. You can upload upto eight images. Image size should not exceed 3MB."
              />
            </Stack>
          )}

          {values.content_type === 'file' && (
            <Stack spacing={1.5}>
              <Field.Upload
                name="file"
                maxSize={9145728}
                accept={{ 'application/pdf': [] }}
                onDelete={() => setValue('file', null)}
                onUpload={() => console.info('ON UPLOAD')}
                placeHolderTitle="Drop your file here."
                placeHolderDescription="Drop files here or click to upload. PDF format only. One file only (Can have multiple pages in the pdf). File size should not exceed 3MB."
              />
            </Stack>
          )}

          {(values.content_type === 'video' || values.content_type === 'animation') && (
            <Box display="flex" alignItems="center" justifyContent="center" flexDirection="column">
              <Stack spacing={1} sx={{ textAlign: 'center' }} paddingTop={5}>
                <Box sx={{ typography: 'h6' }}>Coming Soon!</Box>
                <Box sx={{ typography: 'body2', color: 'text.secondary' }}>
                  We dont have the ability to process videos/animations at this time. But we are
                  working very hard to get the feature out as soon as possible.
                </Box>
              </Stack>
            </Box>
          )}

          <Stack spacing={1.5}>
            <Typography variant="subtitle2">
              Coupons <Typography variant="caption">(Optional)</Typography>
            </Typography>
            <Field.Upload
              multiple
              thumbnail
              name="coupons"
              maxFiles={8}
              maxSize={3145728}
              onRemove={(input: any) => handleRemove(input, 'coupons')}
              onRemoveAll={() => handleRemoveAll('coupons')}
              onUpload={() => console.info('ON UPLOAD')}
              placeHolderTitle="Drop your coupons here. "
              placeHolderDescription="Or click to browse through your machine. Coupons can be images only. You can upload upto eight coupons. Coupon image size should not exceed 3MB."
            />
          </Stack>

          <Stack spacing={1.5}>
            <Typography variant="subtitle2">
              Promotions <Typography variant="caption">(Optional)</Typography>
            </Typography>

            <Field.Upload
              multiple
              thumbnail
              name="promotions"
              maxFiles={8}
              maxSize={3145728}
              onRemove={(input: any) => handleRemove(input, 'promotions')}
              onRemoveAll={() => handleRemoveAll('promotions')}
              onUpload={() => console.info('ON UPLOAD')}
              placeHolderTitle="Drop your promotions here. "
              placeHolderDescription="Or click to browse through your machine. Promotions can be images only. You can upload upto eight promotions. Promotion image size should not exceed 3MB."
            />
          </Stack>
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
        <Button
          startIcon={<Iconify icon="eva:arrow-ios-back-fill" width={16} />}
          onClick={campaignContext?.onBackStep}
        >
          Back
        </Button>
        <Box sx={{ flexGrow: 1 }} />
        <Button endIcon={<Iconify icon="eva:arrow-ios-forward-fill" width={16} />} type="submit">
          Next
        </Button>
      </Stack>
    </Form>
  );
};

export default CampaignContent;
