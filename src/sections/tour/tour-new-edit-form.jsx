import * as Yup from 'yup';
import PropTypes from 'prop-types';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm, Controller } from 'react-hook-form';
import { useMemo, useEffect, useCallback, useState } from 'react';
import { format } from "date-fns";

import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Unstable_Grid2';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { useResponsive } from 'src/hooks/use-responsive';

import { useSnackbar } from 'src/components/snackbar';
import FormProvider, {
  RHFUpload,
  RHFTextField,
  RHFMultiCheckbox,
} from 'src/components/hook-form';
import { Autocomplete, TextField } from '@mui/material';
import { axiosTest } from '@/utils/axios';
import { endpoints } from '@/api';

// ----------------------------------------------------------------------

const ACTIVITY_TAGS = [
  { tagID: '10001', tagName: 'refresher' },
  { tagID: '10002', tagName: 'supplement' },
  { tagID: '10003', tagName: 'sports-outfit' },
  { tagID: '10004', tagName: 'medical-support' },
]

export default function TourNewEditForm({ currentTour }) {
  const [isActivityScaleError, setIsActivityScaleError] = useState(false)
  const [acticityScale, setActivityScale] = useState(null)

  const router = useRouter();

  const mdUp = useResponsive('up', 'md');

  const { enqueueSnackbar } = useSnackbar();

  const NewTourSchema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
    description: Yup.string().required('Description is required'),
    file: Yup.array().min(2, 'Cover iamge and xml file are required'),
    //
    // destination: Yup.string().required('Destination is required'),
    available: Yup.object().shape({
      startDate: Yup.mixed().nullable().required('Start date is required'),
      endDate: Yup.mixed()
        .required('End date is required')
        .test(
          'date-min',
          'End date must be later than start date',
          (value, { parent }) => value.getTime() > parent.startDate.getTime()
        ),
    }),
  });

  const defaultValues = useMemo(
    () => ({
      name: currentTour?.name || '',
      description: currentTour?.description || '',
      file: [],
      //
      level: currentTour?.level || [],
      destination: currentTour?.destination || '',
      tags: currentTour?.tags || [],
      available: {
        startDate: currentTour?.available.startDate || null,
        endDate: currentTour?.available.endDate || null,
      },
    }),
    [currentTour]
  );

  const methods = useForm({
    resolver: yupResolver(NewTourSchema),
    defaultValues,
  });

  const {
    watch,
    reset,
    control,
    setValue,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const values = watch();

  useEffect(() => {
    if (currentTour) {
      reset(defaultValues);
    }
  }, [currentTour, defaultValues, reset]);

  const onSubmit = handleSubmit(async (data) => {
    if (!acticityScale) {
      return;
    }

    // 检查文件类型
    const files = data.file;
    let hasXML = false;
    let hasImage = false;

    if (files && files.length === 2) {
      files.forEach(file => {
        if (file.type === 'text/xml') {
          hasXML = true;
        } else if (file.type.match('image.*')) {
          hasImage = true;
        }
      });
    }

    if (!hasXML || !hasImage) {
      enqueueSnackbar('Please upload one XML file and one image file!', { variant: 'error' });
      return;
    }

    try {
      const formData = new FormData();

      // Convert data to form-data
      for (const key in data) {
        if (key === 'available') {
          formData.append('startDate', format(new Date(data[key].startDate), 'yyyy-MM-dd'));
          formData.append('endDate', format(new Date(data[key].endDate), 'yyyy-MM-dd'));
          continue;
        } else if (key === 'tags') {
          formData.append('tags', data['tags'].toString().replace(/,/g, '|'));
          continue;
        }
        formData.append(key, data[key]);
      }

      // Append files to formData
      files.forEach(file => {
        let fieldName = '';
        if (file.type.match('image.*')) {
          fieldName = 'coverFile';
        } else if (file.type === 'text/xml') {
          fieldName = 'gpxFile';
        }
        formData.append(fieldName, file);
      });

      const httpConfig = {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      };

      const resp = await axiosTest.post(endpoints.activity.create, formData, httpConfig);
      console.log(resp.data);

      reset();
      enqueueSnackbar(currentTour ? 'Update success!' : 'Create success!', { variant: 'success' });
      router.push(paths.home.tour.root);
    } catch (error) {
      console.error(error);
      enqueueSnackbar('Failed to submit the data!', { variant: 'error' });
    }
  });

  const handleDrop = useCallback(
    (acceptedFiles) => {

      const newFiles = acceptedFiles.map(file =>
        Object.assign(file, {
          preview: URL.createObjectURL(file),
        })
      );

      setValue('file', [...(values.file || []), ...newFiles], { shouldValidate: true });
    },
    [setValue, values.file]
  );

  const handleRemoveFile = useCallback(
    (inputFile) => {
      const filtered = values.file && values.file?.filter((file) => file !== inputFile);
      setValue('file', filtered);
    },
    [setValue, values.file]
  );

  const handleRemoveAllFiles = useCallback(() => {
    setValue('file', []);
  }, [setValue]);

  const renderDetails = (
    <>
      {mdUp && (
        <Grid md={4}>
          <Typography variant="h6" sx={{ mb: 0.5 }}>
            Details
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Bacis infomations about activity
          </Typography>
        </Grid>
      )}

      <Grid xs={12} md={8}>
        <Card>
          {!mdUp && <CardHeader title="Details" />}

          <Stack spacing={3} sx={{ p: 3 }}>
            <Stack spacing={1.5}>
              <Typography variant="subtitle2">Name</Typography>
              <RHFTextField name="name" placeholder="Enter name of activity" />
            </Stack>

            <Stack spacing={1.5}>
              <Typography variant="subtitle2">Description</Typography>
              <RHFTextField name="description" placeholder="Enther description of activity" multiline rows={5} />
            </Stack>

            <Stack spacing={1.5}>
              <Typography variant="subtitle2">Cover Images</Typography>
              <RHFUpload
                multiple
                thumbnail
                name="file"
                onDrop={handleDrop}
                onRemove={handleRemoveFile}
                onRemoveAll={handleRemoveAllFiles}
              />
            </Stack>
          </Stack>
        </Card>
      </Grid>
    </>
  );

  const renderProperties = (
    <>
      {mdUp && (
        <Grid md={4}>
          <Typography variant="h6" sx={{ mb: 0.5 }}>
            Properties
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Additional functions and attributes
          </Typography>
        </Grid>
      )}

      <Grid xs={12} md={8}>
        <Card>
          {!mdUp && <CardHeader title="Properties" />}

          <Stack spacing={3} sx={{ p: 3 }}>
            <Stack>
              <Typography variant="subtitle2" sx={{ mb: 1.5 }}>
                Activity Scale
              </Typography>

              <Autocomplete
                disablePortal
                id="activityScale"
                name="acticityScale"
                options={['1~10 people', '11~30 people', '31~100 people']}
                onChange={(event, newValue) => {
                  switch (newValue) {
                    case '1~10 people':
                      setActivityScale('small')
                      setValue('level', 'small', { shouldValidate: true })
                      break

                    case '11~30 people':
                      setActivityScale('medium')
                      setValue('level', 'medium', { shouldValidate: true })
                      break

                    case '31~100 people':
                      setActivityScale('large')
                      setValue('level', 'large', { shouldValidate: true })
                      break

                    default:
                      if (!isActivityScaleError) {
                        setIsActivityScaleError(true)
                      }
                  }
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Scale"
                    error={isActivityScaleError}
                    helperText={isActivityScaleError ? "Scale is required" : null}
                  />
                )}
              />
            </Stack>

            <Stack spacing={1.5}>
              <Typography variant="subtitle2">Time Range</Typography>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
                  <Controller
                    name="available.startDate"
                    control={control}
                    render={({ field, fieldState: { error } }) => (
                      <DatePicker
                        {...field}
                        format="dd/MM/yyyy"
                        label='Start Date'
                        slotProps={{
                          textField: {
                            fullWidth: true,
                            error: !!error,
                            helperText: error?.message,
                          },
                        }}
                      />
                    )}
                  />

                  <Controller
                    name="available.endDate"
                    control={control}
                    render={({ field, fieldState: { error } }) => (
                      <DatePicker
                        {...field}
                        format="yyyy-MM-dd"
                        label='End Date'
                        slotProps={{
                          textField: {
                            fullWidth: true,
                            error: !!error,
                            helperText: error?.message,
                          },
                        }}
                      />
                    )}
                  />

                </Stack>
              </LocalizationProvider>
            </Stack>

            {/* <Stack spacing={1.5}>
              <Typography variant="subtitle2">Duration</Typography>
              <RHFTextField name="durations" placeholder="Ex: 2 days, 4 days 3 nights..." />
            </Stack> */}

            {/* <Stack spacing={1.5}>
              <Typography variant="subtitle2">Destination</Typography>
              <RHFAutocomplete
                name="destination"
                type="country"
                placeholder="+ Destination"
                options={countries.map((option) => option.label)}
                getOptionLabel={(option) => option}
              />
            </Stack> */}

            <Stack spacing={1}>
              <Typography variant="subtitle2">Services</Typography>
              <RHFMultiCheckbox
                name="tags"
                options={ACTIVITY_TAGS}
                sx={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(2, 1fr)',
                }}
              />
            </Stack>

          </Stack>
        </Card>
      </Grid>
    </>
  );

  const renderActions = (
    <>
      {mdUp && <Grid md={4} />}
      <Grid xs={12} md={8} sx={{ display: 'flex', alignItems: 'center' }}>
        {/* <FormControlLabel
          control={<Switch defaultChecked />}
          label="Publish"
          sx={{ flexGrow: 1, pl: 3 }}
        /> */}

        <LoadingButton
          type="submit"
          variant="contained"
          size="large"
          loading={isSubmitting}
          sx={{ ml: 2 }}
          onClick={() => {
            // validate activity scale
            if (!acticityScale) {
              setIsActivityScaleError(true)
            } else {
              setIsActivityScaleError(false)
            }

            onSubmit()
          }}
        >
          {!currentTour ? 'Create Tour' : 'Save Changes'}
        </LoadingButton>
      </Grid>
    </>
  );

  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <Grid container spacing={3}>
        {renderDetails}

        {renderProperties}

        {renderActions}
      </Grid>
    </FormProvider>
  );
}

TourNewEditForm.propTypes = {
  currentTour: PropTypes.object,
};
