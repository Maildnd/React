import { z as zod } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMemo, useState, useContext, useCallback } from 'react';

import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import CardHeader from '@mui/material/CardHeader';
import {
  Box,
  Chip,
  Alert,
  Button,
  Backdrop,
  AlertTitle,
  Typography,
  CircularProgress,
} from '@mui/material';

import { Iconify } from 'src/components/iconify';
import { Form, Field } from 'src/components/hook-form';

import { TARGET_TYPES } from '../../types/_campaign';
import CampaignGoogleMap from '../../campaign-google-maps';
import { CreateCampaignContext } from '../../context/create-campaign-provider';
import {
  getZipCodes,
  getResidentsCountByZipCodes,
  getResidentsCountByCoordinates,
} from '../../context/action';

import type { ZipCode } from '../../types/campaign-context-type';

type TargetsSchema = zod.infer<typeof Targets>;

type zipCodeOptionsType = {
  label: string;
  value: string;
};

const Targets = zod.object({
  target_type: zod.string().min(1, { message: 'Target Type is required!' }),
  lat: zod.number().min(1, { message: 'Latitude must be greater than zero!' }),
  lng: zod.number().min(1, { message: 'Longitude must be greater than zero!' }),
  radius: zod.number(),
  zip_codes: zod.array(zod.string()),
  county: zod.string(),
  residents_count: zod.number(),
});

const CampaignTargets = () => {
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [zipCodeOptions, setZipCodeOptions] = useState<zipCodeOptionsType[]>([]);
  const campaignContext = useContext(CreateCampaignContext);
  const targets = campaignContext?.newCampaign?.targets;
  const circle = targets
    ? { center: { lat: targets.lat, lng: targets.lng }, radius: targets.radius }
    : { center: { lat: 0, lng: 0 }, radius: 0 };

  const defaultValues = useMemo(
    () => ({
      target_type: targets?.target_type || 'map',
      radius: targets?.radius || 0,
      lat: targets?.lat || 0,
      lng: targets?.lng || 0,
      zip_codes: targets?.zip_codes || [],
      county: targets?.county || '',
      residents_count: targets?.residents_count || 0,
    }),
    [targets]
  );

  const methods = useForm<TargetsSchema>({
    resolver: zodResolver(Targets),
    defaultValues,
  });

  const {
    setValue,
    watch,
    handleSubmit,
    formState: { errors },
    clearErrors,
  } = methods;
  const values = watch();

  const onSubmit = handleSubmit(async (data) => {
    try {
      const zipCodesValues = values.zip_codes.map((item) => item.substring(0, 5));
      campaignContext?.onSetCampaignTargets({
        ...data,
        zip_codes: zipCodesValues,
      } as TargetsSchema);
      campaignContext?.onNextStep();
    } catch (error) {
      setErrorMessage(typeof error === 'string' ? error : error.message);
    }
  });

  type radiusData = {
    location: { lat: number; lng: number };
    radius: number;
  };

  const setCoordinatesHandler = async ({ location, radius }: radiusData) => {
    clearErrors('lat');
    clearErrors('lng');
    setValue('lat', location.lat);
    setValue('lng', location.lng);
    setValue('radius', radius);
    getResCountByCoordinates(location.lat, location.lng, radius);
  };

  const getResCountByCoordinates = async (lat: number, lng: number, radius: number) => {
    setLoading(true);
    try {
      const resCount = await getResidentsCountByCoordinates(lat, lng, radius * 1609.34);
      await setTimeout(() => {
        setValue('residents_count', resCount);
        setLoading(false);
      }, 1000);
    } catch (error) {
      setErrorMessage(typeof error === 'string' ? error : error.message);
      setLoading(false);
    }
  };

  const handleTargetTypeChange = useCallback(
    (event: any) => {
      const target_type = event.target.value;
      setValue('target_type', target_type);
      setLoading(true);

      const adjustTargetTypes = async () => {
        await setTimeout(() => {
          if (target_type === 'zip_codes') {
            if (!zipCodeOptions.length) {
              getZipCodesList();
            }

            Targets.shape.zip_codes = zod
              .array(zod.string())
              .min(1, { message: 'At least one zip code is required!' });

            Targets.shape.lat = zod.number();
            Targets.shape.lng = zod.number();
            setValue('lat', 0);
            setValue('lng', 0);
            setValue('radius', 0);
            setValue('residents_count', 0);
          } else if (target_type === 'map') {
            setValue('residents_count', 0);
            setValue('zip_codes', []);
            Targets.shape.zip_codes = zod.array(zod.string());
          }
          setLoading(false);
        }, 500);
      };
      adjustTargetTypes();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [setValue, campaignContext]
  );

  const getZipCodesList = async () => {
    setLoading(true);
    try {
      const zip_codes_list = await getZipCodes();
      const zip_code_options = zip_codes_list.map((item: ZipCode) => ({
        value: item.code,
        label: `${item.code} (${item.name}, ${item.county})`,
      }));
      setZipCodeOptions(zip_code_options);
      campaignContext?.onSetZipCodes(zip_codes_list);
      setLoading(false);
    } catch (error) {
      setErrorMessage(typeof error === 'string' ? error : error.message);
      setLoading(false);
    }
  };

  const onZipCodeChange = () => {
    clearErrors('zip_codes');
    const zipCodesSearch = values.zip_codes.map((item) => item.substring(0, 5));
    if (zipCodesSearch.length > 0) {
      getResCountByZipCodes(zipCodesSearch);
    }
  };

  const removeZipCode = (zipCode: string) => {
    const zipCodes = values.zip_codes.filter((item) => item !== zipCode);
    setValue('zip_codes', zipCodes);
    const zipCodesSearch = zipCodes.map((item) => item.substring(0, 5));
    getResCountByZipCodes(zipCodesSearch);
  };

  const getResCountByZipCodes = async (zipCodes: string[]) => {
    setLoading(true);
    try {
      const resCount = await getResidentsCountByZipCodes(zipCodes);
      setValue('residents_count', resCount);
      setLoading(false);
    } catch (error) {
      setErrorMessage(typeof error === 'string' ? error : error.message);
      setLoading(false);
    }
  };

  return (
    <Form methods={methods} onSubmit={onSubmit}>
      {!!errorMessage && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setErrorMessage('')}>
          <AlertTitle sx={{ textTransform: 'capitalize' }}> Error</AlertTitle>
          {errorMessage}
        </Alert>
      )}
      <Card>
        <CardHeader
          title="Targets"
          subheader="Select the target audience for this campaign..."
          sx={{ mb: 3 }}
        />
        <Divider />
        <Stack spacing={3} sx={{ p: 3 }}>
          <Stack spacing={1}>
            <Field.Select
              native
              name="target_type"
              label="Target Type"
              InputLabelProps={{ shrink: true }}
              placeholder="Select target type..."
              onChange={handleTargetTypeChange}
            >
              {TARGET_TYPES.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </Field.Select>
          </Stack>

          {values.target_type === 'map' && (
            <Stack spacing={1}>
              <CampaignGoogleMap
                setCoordinates={setCoordinatesHandler}
                iShowCircle={!!targets}
                iCircle={circle}
                residentsCount={values.residents_count}
                hasError={!!errors?.lat || !!errors?.lng || !!errors?.radius}
              />
            </Stack>
          )}

          {values.target_type === 'zip_codes' && (
            <Stack spacing={1}>
              {/* <Field.Text name="zip_codes" label="Zip Code" /> */}

              <Typography variant="body2" sx={{ mb: 1 }}>
                Select the zipcodes from the list. And we will provide real time data of the
                residents in the target zip code area.
              </Typography>

              <Field.Autocomplete
                name="zip_codes"
                label="Zip Codes"
                placeholder="Select zip codes ... "
                multiple
                freeSolo
                disableCloseOnSelect
                options={zipCodeOptions.map((option) => option.label)}
                getOptionLabel={(option) => option}
                onBlurCapture={onZipCodeChange}
                renderOption={(props, option) => (
                  <li {...props} key={option}>
                    {option}
                  </li>
                )}
                onChange={(event, newValue) => {
                  setValue('zip_codes', newValue);
                }}
                renderTags={(selected, getTagProps) =>
                  selected.map((option, index) => (
                    <Chip
                      {...getTagProps({ index })}
                      key={option}
                      label={option}
                      onDelete={() => removeZipCode(option)}
                      size="small"
                      color="info"
                      variant="soft"
                    />
                  ))
                }
              />

              <Typography variant="body1" sx={{ mt: 1 }}>
                Residents in the target zip codes: {values.residents_count}
              </Typography>
            </Stack>
          )}
          {values.target_type === 'county' && (
            <Stack spacing={1}>
              <Field.Text name="county" label="County" />
            </Stack>
          )}
        </Stack>
      </Card>
      <Stack spacing={1.5} direction="row" sx={{ mb: { xs: 3, md: 5 }, mt: 3 }}>
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

      {loading && (
        <Backdrop open sx={{ zIndex: (theme) => theme.zIndex.modal + 1 }}>
          <CircularProgress color="inherit" size={48} />
        </Backdrop>
      )}
    </Form>
  );
};

export default CampaignTargets;
