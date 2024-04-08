import * as Yup from 'yup';
import { useCallback, useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import { MenuItem } from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers';

import { fData } from 'src/utils/format-number';
import axiosInstance from 'src/utils/axios'
import FormProvider, { RHFTextField, RHFUploadAvatar, RHFSelect } from 'src/components/hook-form';
import { CityCascader } from 'src/components/city-cascader'
import { useSnackbar } from 'src/components/snackbar';
import { useAuthContext } from 'src/auth/hooks';
import { endpoints } from 'src/api/index'
import moment from 'moment';

// ----------------------------------------------------------------------

export default function AccountGeneral() {
  const { enqueueSnackbar } = useSnackbar();
  const { user } = useAuthContext()


  const UpdateUserSchema = Yup.object().shape({
    username: Yup.string(),
    password: Yup.string(),
    gender: Yup.number() | Yup.string(),
    birthday: Yup.date()
      .nullable()
      .transform((value, originalValue) => originalValue === "" ? null : value)
      .max(new Date(), 'Birthday cannot be in the future')
      .typeError('Invalid date'),
    // Correctly exclude undefined and empty strings
    region: Yup.string(),
  });

  const dateFromBackend = user.birthday; 
  const defaultValues = {
    username: user.username,
    gender: user.gender,
    birthday: dateFromBackend ? new Date(dateFromBackend) : null,
    region: user.region.split('-'),
    photoURL: user.avatarUrl || ''
  };

  console.log(typeof defaultValues.birthday)
  const methods = useForm({
    resolver: yupResolver(UpdateUserSchema),
    defaultValues,
  });

  const {
    setValue,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    const { username, gender, birthday, region } = data
    console.log(region)
    const params = {
      username: username || undefined,
      gender: typeof gender === 'number' ? gender : undefined,
      birthday: birthday ? moment(birthday).format('YYYY-MM-DD') : undefined,
      region: region || undefined
    }
    await axiosInstance.post(`${endpoints.auth.changeAccount}?userID=${user.userId}`, params)

  });

  const handleDrop = useCallback(
    async (acceptedFiles) => {
      const file = acceptedFiles[0];
      const newFile = Object.assign(file, {
        preview: URL.createObjectURL(file),
      });

      if (file) {
        const formData = new FormData();
        formData.append('avatar', file);
        formData.append('userId', user.userId);
        const rest = await axiosInstance.post(`${endpoints.auth.avatarUpload}`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        })
        if (rest.data.status_code === 0) {
          setValue('photoURL', newFile, { shouldValidate: true });
        }
      }
    },
    [setValue, user.userId]
  );

  const genderOptions = [
    { label: "Male", value: 0 },
    { label: "Female", value: 1 },
    { label: "Prefer not to say", value: 2 },
  ];

  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <Grid container spacing={3}>
        <Grid xs={12} md={4}>
          <Card sx={{ pt: 10, pb: 5, px: 3, textAlign: 'center' }}>
            <RHFUploadAvatar
              name="photoURL"
              maxSize={3145728}
              onDrop={handleDrop}
              helperText={
                <Typography
                  variant="caption"
                  sx={{
                    mt: 3,
                    mx: 'auto',
                    display: 'block',
                    textAlign: 'center',
                    color: 'text.disabled',
                  }}
                >
                  Allowed *.jpeg, *.jpg, *.png, *.gif
                  <br /> max size of {fData(3145728)}
                </Typography>
              }
            />
          </Card>
        </Grid>

        <Grid xs={12} md={8}>
          <Card sx={{ p: 3 }}>
            <Stack spacing={1.5}>
              <RHFTextField name="username" label="Username" />

              <RHFSelect name="gender" label="Gender">
                {genderOptions.map((option) => (
                  <MenuItem key={option.value} value={genderOptions.indexOf(option)}>
                    {option.label}
                  </MenuItem>
                ))}
              </RHFSelect>

              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <Controller
                  name="birthday"
                  control={methods.control}
                  render={({ field, fieldState: { error } }) => (
                    <DatePicker
                      label={error ? error.message : "Birthday"}
                      inputFormat="yyyy-MM-dd"
                      maxDate={new Date()}
                      value={field.value === '' ? null : field.value}
                      onChange={(newValue) => {
                        field.onChange(newValue);
                      }}
                    />
                  )}
                />
              </LocalizationProvider>

              <Controller
                name="region"
                label="Region"
                control={methods.control}
                render={({ field, fieldState: { error } }) => {
                  return (
                    <CityCascader
                      {...field}
                      onChange={(value) => {
                        // Ensure that value is an array, if it is not or undefined, it defaults to an empty array
                        const safeValue = Array.isArray(value) ? value : [];
                        // Filter out the undefined value in the array and concatenate it with join('-')
                        const filteredValue = safeValue.filter(item => item !== undefined);
                        const formattedValue = filteredValue.join('-');
                        field.onChange(formattedValue);
                      }}
                      shouldFetchData={true}
                      error={!!error}
                      errorMessage={error ? error.message : ''}
                      value={defaultValues.region}
                    />
                  )
                }}
              />

              <LoadingButton
                fullWidth
                color="inherit"
                size="large"
                type='submit'
                variant="contained"
                loading={isSubmitting}
              >
                Save Changes
              </LoadingButton>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </FormProvider>
  );
}
