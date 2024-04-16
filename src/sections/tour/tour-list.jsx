import PropTypes from 'prop-types';
import { useCallback } from 'react';

import Box from '@mui/material/Box';
import Pagination, { paginationClasses } from '@mui/material/Pagination';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import TourItem from './tour-item';
import { axiosSimple } from '@/utils/axios';
import { endpoints } from '@/api';
import { useSnackbar } from 'notistack';
import { error } from '@/theme/palette';

// ----------------------------------------------------------------------

export default function TourList({ tours }) {
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();

  const handleView = useCallback(
    (id) => {
      router.push(paths.home.tour.details(id));
    },
    [router]
  );

  const handleJoin = async (tour) => {
    try {
      const token = sessionStorage.getItem('token')
      const httpConfig = {
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      }

      const resp = await axiosSimple.post(endpoints.activity.join + "?activityID=" + tour.activityId, null, httpConfig)
      if (resp.data.status_code === 0) {
        enqueueSnackbar(resp.data.status_msg)
      } else {
        enqueueSnackbar(resp.data.status_msg, { variant: "error" })
      }
    } catch(err) {
      enqueueSnackbar(err.toString(), { variant: "error" })
    }
  }

  return (
    <>
      <Box
        gap={3}
        display="grid"
        gridTemplateColumns={{
          xs: 'repeat(1, 1fr)',
          sm: 'repeat(2, 1fr)',
          md: 'repeat(3, 1fr)',
        }}
      >
        {tours.map((tour) => (
          <TourItem
            key={tour.activityId}
            tour={tour}
            onView={() => handleView(tour.activityId)}
            onJoin={async() => {
              await handleJoin(tour)
            }}
          />
        ))}
      </Box>

      {tours.length > 8 && (
        <Pagination
          count={8}
          sx={{
            mt: 8,
            [`& .${paginationClasses.ul}`]: {
              justifyContent: 'center',
            },
          }}
        />
      )}
    </>
  );
}

TourList.propTypes = {
  tours: PropTypes.array,
};
