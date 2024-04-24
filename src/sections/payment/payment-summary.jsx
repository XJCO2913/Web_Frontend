import PropTypes from 'prop-types';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Switch from '@mui/material/Switch';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import { useAuthContext } from 'src/auth/hooks';
import Label from 'src/components/label';
import Iconify from 'src/components/iconify';
import { Radio } from 'antd';
import { useMockedUser } from 'src/hooks/use-mocked-user';
import { endpoints } from 'src/api/index'
// ----------------------------------------------------------------------
import axiosInstance from 'src/utils/axios';
export default function PaymentSummary({ sx, ...other }) {
    // const { subscribe } = useAuthContext();
const { user } =useAuthContext();
    
  const submit = async() => {
    console.log(111);
    // `${endpoints.auth.me}?userID=${userID}`
        const res = await axiosInstance.post(`${endpoints.auth.subscribe}?userID=${user.userId}&membershipType=1`)
    // const res = await axiosInstance.post(endpoints.auth.subscribe, {userId: user?.id,membershipType: '1' })
    console.log(res)
      }
  const renderPrice = (
    <Stack direction="row" justifyContent="flex-end">
      <Typography variant="h4">$</Typography>

      <Typography variant="h2">9.99</Typography>

      <Typography
        component="span"
        sx={{
          alignSelf: 'center',
          color: 'text.disabled',
          ml: 1,
          typography: 'body2',
        }}
      >
        / mon
      </Typography>
    </Stack>
  );

  return (
    <Box
      sx={{
        p: 5,
        borderRadius: 2,
        bgcolor: 'background.neutral',
        ...sx,
      }}
      {...other}
    >
      <Typography variant="h6" sx={{ mb: 5 }}>
        Summary
      </Typography>

      <Stack spacing={2.5}>
        <Stack direction="row" justifyContent="space-between">
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Subscription
          </Typography>

          <Label color="error">PREMIUM</Label>
        </Stack>

        <Stack direction="row" justifyContent="space-between">
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Billed Monthly
          </Typography>
          <Switch defaultChecked />
        </Stack>

        {renderPrice}

        <Divider sx={{ borderStyle: 'dashed' }} />

        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Typography variant="subtitle1">Total Billed</Typography>

          <Typography variant="subtitle1">$9.99*</Typography>
        </Stack>

        <Divider sx={{ borderStyle: 'dashed' }} />
      </Stack>

      {/* <Typography component="div" variant="caption" sx={{ color: 'text.secondary', mt: 1 }}>
        * Plus applicable taxes
      </Typography>
      <Radio label="0" name="membershipType">0</Radio>
      <Radio label="1" name="membershipType">1</Radio>
      <Radio label="2" name="membershipType">2</Radio> */}
      
      <Button fullWidth size="large" variant="contained" onClick={submit} sx={{ mt: 5, mb: 3 }}>
        Upgrade My Plan
      </Button>

      <Stack alignItems="center" spacing={1}>
        <Stack direction="row" alignItems="center" spacing={1}>
          <Iconify icon="solar:shield-check-bold" sx={{ color: 'success.main' }} />
          <Typography variant="subtitle2">Secure credit card payment</Typography>
        </Stack>

        <Typography variant="caption" sx={{ color: 'text.disabled', textAlign: 'center' }}>
          This is a secure 128-bit SSL encrypted payment
        </Typography>
      </Stack>
    </Box>
  );
}

PaymentSummary.propTypes = {
  sx: PropTypes.object,
};
