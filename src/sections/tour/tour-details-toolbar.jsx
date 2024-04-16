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
  ...other
}) {

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
          disabled={isJoined}
        >
          {
            isJoined ? 
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
