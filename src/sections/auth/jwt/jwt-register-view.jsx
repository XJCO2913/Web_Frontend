import * as Yup from 'yup';
import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { TextField } from '@mui/material';

import Link from '@mui/material/Link';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import InputAdornment from '@mui/material/InputAdornment';
import { MenuItem } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFnsV3'
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { format } from 'date-fns';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';
import { useRouter } from 'src/routes/hooks';
import { useBoolean } from 'src/hooks/use-boolean';
import { useAuthContext } from 'src/auth/hooks';
import Iconify from 'src/components/iconify';
import FormProvider, { RHFTextField, RHFSelect } from 'src/components/hook-form';
import { CityCascader } from 'src/components/city-cascader'


// ----------------------------------------------------------------------

export default function JwtRegisterView() {
  const { register } = useAuthContext();
  const router = useRouter();
  const [errorMsg, setErrorMsg] = useState('');
  // const searchParams = useSearchParams();
  // const returnTo = searchParams.get('returnTo');
  const password = useBoolean();

  // validate the form
  const RegisterSchema = Yup.object().shape({
    username: Yup.string().required('Username is required'),
    password: Yup.string().required('Password is required'),
    gender: Yup.number().nullable().transform((_, originalValue) => originalValue === "" ? null : Number(originalValue)),
    birthday: Yup.date().nullable().transform((value, originalValue) => originalValue === "" ? null : value),
    region: Yup.string().required('Region is required'),
  });

  // set the default values
  const defaultValues = {
    username: '',
    password: '',
    gender: '',
    birthday: null,
    region: ''
  };

  const methods = useForm({
    resolver: yupResolver(RegisterSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  // submit the form
  const onSubmit = handleSubmit(async (data) => {
    // Format the birthday to 'YYYY-MM-DD' if it's not null
    const formattedBirthday = data.birthday ? format(new Date(data.birthday), 'yyyy-MM-dd') : null;

    // Log the formatted date
    console.log('Formatted birthday:', formattedBirthday);

    // Prepare the data to be sent to the server
    const submitData = {
      ...data,
      birthday: formattedBirthday,
    };

    try {
      await register?.(submitData.username, submitData.password, submitData.gender, submitData.birthday, submitData.region);
      router.push('./login');
    } catch (error) {
      console.error(error);
      reset();
      setErrorMsg(typeof error === 'string' ? error : error.message);
    }
  });


  const renderHead = (
    <Stack spacing={1} sx={{ mb: 3, position: 'relative' }}>
      <Typography variant="h4">Get started absolutely free</Typography>

      <Stack direction="row" spacing={0.5}>
        <Typography variant="body2"> Already have an account? </Typography>

        <Link href={paths.auth.jwt.login} component={RouterLink} variant="subtitle2">
          Sign in
        </Link>
      </Stack>
    </Stack>
  );

  const renderTerms = (
    <Typography
      component="div"
      sx={{
        mt: 2.5,
        textAlign: 'center',
        typography: 'caption',
        color: 'text.secondary',
      }}
    >
      {'By signing up, I agree to '}
      <Link underline="always" color="text.primary">
        Terms of Service
      </Link>
      {' and '}
      <Link underline="always" color="text.primary">
        Privacy Policy
      </Link>
      .
    </Typography>
  );

  // gender option
  const genderOptions = [
    { label: "Male", value: 0 },
    { label: "Female", value: 1 },
  ];

  const renderForm = (
    <Stack spacing={1.5}>
      <RHFTextField name="username" label="Username" />

      <RHFTextField
        name="password"
        label="Password"
        type={password.value ? 'text' : 'password'}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton onClick={password.onToggle} edge="end">
                <Iconify icon={password.value ? 'solar:eye-bold' : 'solar:eye-closed-bold'} />
              </IconButton>
            </InputAdornment>
          ),
        }}
      />

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
            <DesktopDatePicker
              label="Birthday"
              inputFormat="yyyy-MM-dd"
              renderInput={(params) => <TextField {...params} error={!!error} helperText={error ? error.message : null} />}
              {...field}
              onChange={(date) => {
                // If the date is not null, format it and log it; otherwise, pass null
                const formattedDate = date ? format(date, 'yyyy-MM-dd') : null;
                console.log('Selected date:', formattedDate); // Log the formatted date to the console
                field.onChange(formattedDate);
              }}
            />
          )}
        />
      </LocalizationProvider>


      <Controller
        name="region"
        control={methods.control}
        render={({ field }) => (
          <CityCascader
            onChange={(value) => {
              console.log(value)
              // This will create 'Province-City'
              const formattedValue = value.join('-');
              field.onChange(formattedValue);

            }}
          />
        )}
      />

      <LoadingButton
        fullWidth
        color="inherit"
        size="large"
        type="submit"
        variant="contained"
        loading={isSubmitting}
      >
        Create account
      </LoadingButton>
    </Stack>
  );

  return (
    <>
      {renderHead}

      {!!errorMsg && (
        <Alert severity="error" sx={{ m: 3 }}>
          {errorMsg}
        </Alert>
      )}

      <FormProvider methods={methods} onSubmit={onSubmit}>
        {renderForm}
      </FormProvider>

      {renderTerms}
    </>
  );
}
