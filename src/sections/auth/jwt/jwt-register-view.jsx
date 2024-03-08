import * as Yup from 'yup';
import { useState, useEffect } from 'react';
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
  const [open, setOpen] = useState(true);
  const password = useBoolean();
  const [errorKey, setErrorKey] = useState(0);
  const [lastError, setLastError] = useState({ message: '', key: 0 });

  // validate the form
  const RegisterSchema = Yup.object().shape({
    username: Yup.string().required('Username is required'),
    password: Yup.string().required('Password is required'),
    gender: Yup.number().nullable().transform((_, originalValue) => originalValue === "" ? null : Number(originalValue)),
    birthday: Yup.date().nullable().transform((value, originalValue) => originalValue === "" ? null : value),
    // Correctly exclude undefined and empty strings
    region: Yup.string().required('Region is required').notOneOf([''], 'Region cannot be empty.'),
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
    // Format the birthday field to 'YYYY-MM-DD' format if it's not null
    const formattedBirthday = data.birthday ? format(new Date(data.birthday), 'yyyy-MM-dd') : null;

    // Verify if the region format contains '-'
    if (!data.region.includes('-')) {
      // If the region does not contain '-', it indicates the format does not conform to the Province-City format
      triggerError('Please select both province and city.');
      return;
    }

    // Prepare the data to be sent to the server
    const submitData = {
      ...data,
      birthday: formattedBirthday,
    };

    try {
      const result = await register?.(submitData.username, submitData.password, submitData.gender, submitData.birthday, submitData.region);

      if (result.success) {
        // Registration successful, navigate to the login page or another page
        router.push(paths.login);
      } else {
        triggerError(result.message)
      }
    } catch (error) {
      console.error(error);
      reset(); // Reset form state
      triggerError('An unexpected error occurred. Please try again later.'); // Catch and handle unexpected errors
    }
  });

  const triggerError = (msg) => {
    setErrorMsg(msg);
    // Increments the errorKey or sets it to the current timestamp 
    // to force an update of alert to be triggered
    setErrorKey(prevKey => prevKey + 1);
  };

  // Monitor the error message occur
  useEffect(() => {
    if (errorMsg) {
      setOpen(true);
    }
  }, [errorMsg, errorKey]);

  // Listen for error changes in react-hook-form and update lastError status
  useEffect(() => {
    const error = methods.formState.errors.region;
    if (error && error.message) {
      // Use a timestamp as a unique identifier
      setLastError({ message: error.message, key: Date.now() });
    }
    // Note the errors object that relies on reacting-hook-form 
  }, [methods.formState.errors]);

  const renderHead = (
    <Stack spacing={1} sx={{ mb: 3, position: 'relative' }}>
      <Typography variant="h4">Get started absolutely free</Typography>

      <Stack direction="row" spacing={0.5}>
        <Typography variant="body2"> Already have an account? </Typography>

        <Link href={paths.login} component={RouterLink} variant="subtitle2">
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
              maxDate={new Date()}
              renderInput={(params) => <TextField {...params} error={!!error} helperText={error ? error.message : null} />}
              {...field}
              onChange={(date) => {
                // If the date is not null, format it and log it; otherwise, pass null
                const formattedDate = date ? format(date, 'yyyy-MM-dd') : null;
                field.onChange(formattedDate);
              }}
            />
          )}
        />
      </LocalizationProvider>


      <Controller
        name="region"
        label="Region"
        control={methods.control}
        rules={{ required: 'Region is required' }}
        render={({ field, fieldState: { error } }) => (
          <CityCascader
            {...field}
            onChange={(value) => {
              // console.log(value);
              // Ensure that value is an array, if it is not or undefined, it defaults to an empty array
              const safeValue = Array.isArray(value) ? value : [];
              // Filter out the undefined value in the array and concatenate it with join('-')
              const filteredValue = safeValue.filter(item => item !== undefined);
              const formattedValue = filteredValue.join('-');
              field.onChange(formattedValue);
              console.log(formattedValue);
            }}
            error={!!error}
            errorMessage={error ? error.message : ''}
            key={lastError.key}
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

      {!!errorMsg && open && (
        <Alert
          severity="error"
          sx={{ width: '100%', mb: 3 }}
          onClose={() => setOpen(false)}>
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
