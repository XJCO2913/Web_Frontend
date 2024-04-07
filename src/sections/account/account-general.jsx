import * as Yup from 'yup';
import { useCallback ,useState,useEffect} from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';

import { useMockedUser } from 'src/hooks/use-mocked-user';

import { fData } from 'src/utils/format-number';

import { countries } from 'src/assets/data';

import { useSnackbar } from 'src/components/snackbar';
import FormProvider, {
  RHFSwitch,
  RHFTextField,
  RHFUploadAvatar,
  RHFAutocomplete,
  RHFSelect
} from 'src/components/hook-form';
import {InputAdornment,IconButton,MenuItem} from '@mui/material';
import Iconify from 'src/components/iconify';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import { CityCascader } from 'src/components/city-cascader'
import {  Controller } from 'react-hook-form';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { useBoolean } from 'src/hooks/use-boolean';
 import axiosInstance from '@/utils/axios'
 import { isValidToken, jwtDecode ,setSession} from "src/auth/context/jwt/utils";
 import { endpoints } from 'src/api/index'
 import Snackbar from '@mui/material/Snackbar';
 import Alert from '@mui/material/Alert';
 import moment from 'moment';

const genderOptions = [
  { label: "Male", value: 0 },
  { label: "Female", value: 1 },
  { label: "Prefer not to say", value: 2 },
  {label:"",value:''}
];
let userInfo = sessionStorage.getItem('userInfo') || JSON.stringify({});
userInfo = JSON.parse(userInfo)

// ----------------------------------------------------------------------

export default function AccountGeneral() {
  const { enqueueSnackbar } = useSnackbar();

  const { user } = useMockedUser();
  const password = useBoolean();
  const [open,setOpen]=useState(false)
  const [userID,setUserID] = useState('')
  const UpdateUserSchema = Yup.object().shape({
    username: Yup.string(),
    password: Yup.string(),
    gender: Yup.number()|Yup.string(),
    birthday: Yup.date()
      .nullable()
      .transform((value, originalValue) => originalValue === "" ? null : value)
      .max(new Date(), 'Birthday cannot be in the future')
      .typeError('Invalid date'),
    // Correctly exclude undefined and empty strings
    region: Yup.string(),
  });
  const defaultValues = {
    username: userInfo.username,
    password: '',
    gender: userInfo.gender,
    birthday: new Date(userInfo.birthday),
    region: userInfo.region.split('-'),
    photoURL:userInfo.avatarUrl||''
  };
  const methods = useForm({
    resolver: yupResolver(UpdateUserSchema),
    defaultValues,
  });

  const {
    setValue,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;
  const getUserInfo = async(flag,userId) =>{
    flag && setOpen(true)
    const response = await axiosInstance.get(`${endpoints.auth.me}?userID=${userId || userID}`);
    sessionStorage.setItem("userInfo",JSON.stringify(response.data.Data));
  }
  const onSubmit = handleSubmit(async (data) => {
    const {username,password,gender,birthday,region} = data
    const params = {
      username:username||undefined,
      password:password||undefined,
      gender:typeof gender==='number'?gender:undefined,
      birthday:birthday?moment(birthday).format('YYYY-MM-DD'):undefined,
      region:region||undefined
    }
      const res = await axiosInstance.patch(`${endpoints.auth.changeAccount}?userID=${userID}`,params)
        if(res.data.status_code===0){
          getUserInfo(true,undefined);
        }
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
        formData.append('userId', userID);
        const rest = await axiosInstance.post(`${endpoints.auth.avatarUpload}`,formData,{
          headers:{
            'Content-Type':'multipart/form-data'
          }
        })
        if(rest.data.status_code===0){
          setValue('photoURL', newFile, { shouldValidate: true });
          setOpen(true)
        }
        
      }
    },
    [userID]
  );
  const [lastError, setLastError] = useState({ message: '', key: 0 });
  const [shouldFetchData, setShouldFetchData] = useState(true);
  useEffect(()=>{
    const STORAGE_KEY = 'token';
    const token = sessionStorage.getItem(STORAGE_KEY);

      if (token && isValidToken(token)) {
        setSession(token);
        const decodedToken = jwtDecode(token);
        const userID = decodedToken.userID;
        setUserID(userID)
        getUserInfo(undefined,userID)
      }
  },[])
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
                    <DatePicker
                      label={error ? error.message : "Birthday"}
                      inputFormat="yyyy-MM-dd"
                      maxDate={new Date()}
                      value={field.value || null}
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
                render={({ field, fieldState: { error } }) =>{
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
                    error={!!error}
                    errorMessage={error ? error.message : ''}
                    key={lastError.key}
                    shouldFetchData={shouldFetchData}
                  />
                )}}
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
      <Snackbar 
        open={open} 
        autoHideDuration={2000}
        anchorOrigin={{ vertical:'top', horizontal:'center' }}
        onClose={()=>{setOpen(false)}}
       >
        <Alert
          severity="success"
          variant="filled"
          sx={{ width: '100%' }}
          onClose={()=>{setOpen(false)}}
        >
          Update success!
        </Alert>
      </Snackbar>
    </FormProvider>
  );
}
