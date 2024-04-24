import * as Yup from 'yup';
import { useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import _ from 'lodash';

import Card from '@mui/material/Card';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import { MenuItem } from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers';
import dayjs from 'dayjs';

import { fData } from 'src/utils/format-number';
import axiosInstance, { axiosTest } from 'src/utils/axios'
import FormProvider, { RHFTextField, RHFUploadAvatar, RHFSelect } from 'src/components/hook-form';
import { CityCascader } from 'src/components/city-cascader'
import { useSnackbar } from 'src/components/snackbar';
import { useAuthContext } from 'src/auth/hooks';
import { endpoints } from 'src/api/index'

// ----------------------------------------------------------------------

export default function AccountGeneral() {

  const { enqueueSnackbar } = useSnackbar();

  const { user } = useAuthContext();
  const { initialize } = useAuthContext();

  const [avatarChanged, setAvatarChanged] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [errorKey, setErrorKey] = useState(0);
  const [errorMsg, setErrorMsg] = useState('');
  const [open, setOpen] = useState(true);

  const triggerError = (msg) => {
    setErrorMsg(msg);
    setErrorKey(prevKey => prevKey + 1);
  };

  useEffect(() => {
    if (errorMsg) {
      setOpen(true);
    }
  }, [errorMsg, errorKey]);

  const hasFormValueChanged = () => {
    return Object.keys(defaultValues).some(key => {
      if (key === 'photoURL') {
        return false; // 跳过此字段
      }

      const defaultValue = defaultValues[key];
      const watchedValue = watchAllFields[key];

      // 对日期进行特殊处理
      if (defaultValue instanceof Date && watchedValue instanceof Date) {
        return defaultValue.getTime() !== watchedValue.getTime();
      }

      // 增加对对象深度比较的支持（可以使用Lodash的isEqual方法）
      if (typeof defaultValue === 'object' && typeof watchedValue === 'object') {
        return !_.isEqual(defaultValue, watchedValue);
      }

      // 对基本类型使用严格比较
      return defaultValue !== watchedValue;
    });
  };


  const genderOptions = [
    { label: "Male", value: 0 },
    { label: "Female", value: 1 },
    { label: "Prefer not to say", value: 2 },
  ];

  const UpdateUserSchema = Yup.object().shape({
    username: Yup.string(),
    password: Yup.string(),
    gender: Yup.number() | Yup.string(),
    birthday: Yup.date()
      .nullable()
      .transform((value, originalValue) => originalValue === "" ? null : value)
      .max(new Date(), 'Birthday cannot be in the future')
      .typeError('Invalid date'),
    region: Yup.string().required('Region is required').notOneOf(['', undefined], 'Region cannot be empty.'),
  });

  const dateFromBackend = user?.birthday;
  const regionValue = user?.region.split('-');
  const defaultValues = {
    username: user?.username,
    gender: user?.gender,
    birthday: dateFromBackend ? new Date(dateFromBackend) : "",
    region: user?.region,
    photoURL: user?.avatarUrl || ''
  };

  const methods = useForm({
    resolver: yupResolver(UpdateUserSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const watchAllFields = methods.watch();

  const onSubmit = handleSubmit(async (data) => {
    const formChanged = hasFormValueChanged();
    if (!data.region.includes('-')) {
      triggerError('Please select both province and city.');
      return;
    }

    // 如果用户更新了信息
    if (formChanged) {
      const formattedBirthday = data.birthday ? dayjs(data.birthday).format('DD MMM YY HH:mm ZZ') : null;
      const formData = {
        username: data.username,
        gender: data.gender,
        birthday: formattedBirthday,
        region: data.region,
      };
      console.log(formData.birthday)
      try {
        const res = await axiosTest.patch(`${endpoints.user.changeAccount}?userID=${user.userId}`, formData);
        if (res.data.status_code === 0) {
          // 重新初始化表单或页面，无需等待异步操作
          initialize();
          enqueueSnackbar('Update success!');
        }
      } catch (error) {
        console.error(error);
        enqueueSnackbar('An error occurred while updating user information. Please try again.', { variant: 'error' });
        return; // 如果发生错误，提前退出
      }
    }

    // 如果用户更新了头像
    if (avatarChanged && selectedFile) {
      const formData = new FormData();
      formData.append('avatar', selectedFile);
      formData.append('userId', user.userId);
      try {
        const res = await axiosInstance.post(`${endpoints.user.avatarUpload}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        if (res.data.status_code === 0) {
          // 重新初始化表单或页面，无需等待异步操作
          initialize();
          enqueueSnackbar('Update success!');
        }
      } catch (error) {
        console.error(error);
        enqueueSnackbar('An error occurred while uploading avatar. Please try again.', { variant: 'error' });
        return;
      }
    }

    // 如果没有任何更改
    if (!formChanged && !(avatarChanged && selectedFile)) {
      enqueueSnackbar('No changes detected.', { variant: 'warning' });
    }
  });

  const handleDrop = useCallback(
    (acceptedFiles) => {
      const file = acceptedFiles[0];
      if (file) {
        const newFile = Object.assign(file, {
          preview: URL.createObjectURL(file),
        });
        setSelectedFile(newFile);
        setAvatarChanged(true);
      }
    },
    [setSelectedFile]
  );

  useEffect(() => {
    // 当组件卸载时执行清理
    return () => {
      if (selectedFile) {
        URL.revokeObjectURL(selectedFile.preview);
      }
    };
  }, [selectedFile]);

  return (
    <>
      {!!errorMsg && open && (
        <Alert
          severity="error"
          sx={{ width: '100%', mb: 3 }}
          onClose={() => setOpen(false)}>
          {errorMsg}
        </Alert>
      )}

      <FormProvider methods={methods} onSubmit={onSubmit}>
        <Grid container spacing={3}>
          <Grid xs={12} md={4}>
            <Card sx={{ pt: 10, pb: 5, px: 3, textAlign: 'center' }}>
              <RHFUploadAvatar
                name="photoURL"
                maxSize={3145728}
                onDrop={handleDrop}
                file={selectedFile ? selectedFile.preview : defaultValues.photoURL}
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
                        inputFormat="DD-MM-YYYY"
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
                        autoIP={false}
                        error={!!error}
                        errorMessage={error ? error.message : ''}
                        valueArr={regionValue}
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
    </>
  );
}