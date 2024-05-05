import PropTypes from 'prop-types';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton';
import LoadingButton from '@mui/lab/LoadingButton';

import { RouterLink } from 'src/routes/components';

import Iconify from 'src/components/iconify';
import CustomPopover, { usePopover } from 'src/components/custom-popover';
import { useSnackbar } from 'notistack';
import { useEffect, useState } from 'react';
import { axiosSimple } from '@/utils/axios';
import { endpoints } from '@/api';
import { jwtDecode } from '@/auth/context/jwt/utils';

// ----------------------------------------------------------------------

export default function TourDetailsToolbar({
  publish,
  backLink,
  editLink,
  liveLink,
  publishOptions,
  onChangePublish,
  sx,
  isJoined,
  activityId,
  ...other
}) {
  const { enqueueSnackbar } = useSnackbar()

  const [curIsJoined, setCurIsJoined] = useState(isJoined)

  const handleJoin = async () => {
    try {
      const token = sessionStorage.getItem('token')

      // only membership can join in activity
      const payload = jwtDecode(token)
      if (payload.membershipType != '1' && payload.membershipType != '2') {
        enqueueSnackbar("Only membership can join in activities!", { variant: "error" })
        return
      }

      const httpConfig = {
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      }

      const resp = await axiosSimple.post(endpoints.activity.join + "?activityID=" + activityId, null, httpConfig)
      if (resp.data.status_code === 0) {
        enqueueSnackbar(resp.data.status_msg)
        setCurIsJoined(true)
      } else {
        enqueueSnackbar(resp.data.status_msg, { variant: "error" })
      }
    } catch(err) {
      enqueueSnackbar(err.toString(), { variant: "error" })
    }
  }

  useEffect(() => {
    setCurIsJoined(isJoined)
  }, [isJoined])

  return (
    <>
      <Stack
        spacing={1.5}
        direction="row"
        sx={{
          mb: { xs: 3, md: 5 },
          ...sx,
        }}
        {...other}
      >
        <Button
          component={RouterLink}
          href={backLink}
          startIcon={<Iconify icon="eva:arrow-ios-back-fill" width={16} />}
        >
          Back
        </Button>

        <Box sx={{ flexGrow: 1 }} />

        <LoadingButton
          color="inherit"
          variant="contained"
          loading={!publish}
          loadingIndicator="Loading…"
          sx={{ textTransform: 'capitalize' }}
          disabled={curIsJoined}
          onClick={handleJoin}
        >
          {
            curIsJoined ? 
            "Joined" :
            "Join Now"
          }
        </LoadingButton>
      </Stack>
    </>
  );
}

TourDetailsToolbar.propTypes = {
  backLink: PropTypes.string,
  editLink: PropTypes.string,
  liveLink: PropTypes.string,
  onChangePublish: PropTypes.func,
  publish: PropTypes.string,
  publishOptions: PropTypes.array,
  sx: PropTypes.object,
};
