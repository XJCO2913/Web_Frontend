import PropTypes from 'prop-types';
import { useState, useCallback, useRef, useEffect } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';

import Iconify from 'src/components/iconify';
import AMapPathDrawer from 'src/components/map'
import { useAuthContext } from 'src/auth/hooks';
import { wgs2gcj } from 'src/utils/xml-shift'
import { axiosTest } from 'src/utils/axios';
import { endpoints } from 'src/api/index';
import { useSnackbar } from 'src/components/snackbar';

// ----------------------------------------------------------------------

const colors = [
  "#FF6633", "#FFB399", "#FF33FF", "#FFFF99", "#00B3E6",
  "#E6B333", "#3366E6", "#999966", "#99FF99", "#B34D4D",
  "#80B300", "#809900", "#E6B3B3", "#6680B3", "#66991A",
  "#FF99E6", "#CCFF1A", "#FF1A66", "#E6331A", "#33FFCC",
  "#66994D", "#B366CC", "#4D8000", "#B33300", "#CC80CC",
  "#66664D", "#991AFF", "#E666FF", "#4DB3FF", "#1AB399",
  "#E666B3", "#33991A", "#CC9999", "#B3B31A", "#00E680",
  "#4D8066", "#809980", "#E6FF80", "#1AFF33", "#999933",
  "#FF3380", "#CCCC00", "#66E64D", "#4D80CC", "#9900B3",
  "#E64D66", "#4DB380", "#FF4D4D", "#99E6E6", "#6666FF"
];

// ----------------------------------------------------------------------

function convertDataToPaths(data, color, user = null) {
  const convertedData = wgs2gcj(data);
  const coords = convertedData.map(([lng, lat]) => [lng, lat]);
  const path = {
    coords,
    color,
    user
  };

  return [path];
}

async function fetchRouteData(bookerId, activityId) {
  try {
    const response = await axiosTest.get(`${endpoints.activity.getUserRoute}?activityID=${activityId}&userID=${bookerId}`);
    if (response.status === 200 && response.data.status_code === 0) {
      // Assuming the route and avatar URL are always available on successful fetch
      return {
        route: response.data.Data.route,
        avatarUrl: response.data.Data.avatarUrl
      };
    } else {
      console.error('Failed to fetch route data with status:', response.data.status_msg);
      return null;  // Return null or throw an error based on your error handling strategy
    }
  } catch (error) {
    console.error('Failed to fetch route data:', error);
  }
}

// ----------------------------------------------------------------------

export default function TourDetailsBookers({ bookers, path, id }) {
  const [approved, setApproved] = useState([]);
  const [currentPath, setCurrentPath] = useState([]);
  const { user } = useAuthContext();

  useEffect(() => {
    if (path) {
      setCurrentPath(oldPaths => [...oldPaths, path]);
    }
  }, [path]);

  const handlePathChange = (newPath, color, user) => {
    setCurrentPath(current => [
      ...current,
      ...convertDataToPaths(newPath, color, user)
    ]);
  };

  const handleClick = useCallback(
    (item) => {
      const selected = approved.includes(item)
        ? approved.filter((value) => value !== item)
        : [...approved, item];

      setApproved(selected);
    },
    [approved]
  );

  return (
    <>
      {currentPath && (
        <Stack mb={3} spacing={1} mt={-2}>
          <Typography variant="h6">Route View</Typography>
          <Box
            rowGap={2}
            display="grid"
            gridTemplateColumns={{
              xs: 'repeat(1, 1fr)',
              md: 'repeat(2, 1fr)',
            }}
            sx={{ mb: -2 }}
          >
            <AMapPathDrawer
              paths={currentPath}
              style={{ width: '100%', borderRadius: '8px' }}
            />
          </Box>
        </Stack>
      )}

      <Divider sx={{ borderStyle: 'dashed', mb: 2, mt: 4 }} />

      <Box
        gap={3}
        display="grid"
        gridTemplateColumns={{
          xs: 'repeat(1, 1fr)',
          sm: 'repeat(2, 1fr)',
          md: 'repeat(3, 1fr)',
        }}
      >
        {bookers.map((booker, index) => (
          <BookerItem
            key={booker.userID}
            booker={booker}
            selected={approved.includes(booker.userID)}
            onSelected={() => handleClick(booker.userID)}
            user={user}
            onChangePath={handlePathChange}
            index={index}
            activityID={id}
          />
        ))}
      </Box>
    </>

  );
}

TourDetailsBookers.propTypes = {
  bookers: PropTypes.array,
  path: PropTypes.object,
  id: PropTypes.string,
};

// ----------------------------------------------------------------------

function BookerItem({ booker, selected, user, onChangePath, index, activityID }) {
  const fileRef = useRef(null);
  const { enqueueSnackbar } = useSnackbar();

  const handleAttach = () => {
    if (fileRef.current) {
      fileRef.current.click();
    }
  };

  const handleUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) {
      enqueueSnackbar('No file selected', { variant: 'error' });
      return;
    }

    const formData = new FormData();
    formData.append("gpxData", file);
    formData.append("activityId", activityID);

    try {
      const response = await axiosTest.post(endpoints.activity.upload, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      if (response.status === 200) {
        enqueueSnackbar('XML uploaded successfully!', { variant: 'success' });
      } else {
        throw new Error('Failed to upload file!');
      }
    } catch (error) {
      console.error('Error uploading file:', error);
      enqueueSnackbar('Error uploading file: ' + error.message, { variant: 'error' });
    }
  };

  const handleChangePath = async () => {
    const fetchedData = await fetchRouteData(booker.userID, activityID);
    if (fetchedData) {
      onChangePath(fetchedData.route, getColor(index), {
        avatarUrl: fetchedData.avatarUrl  // Pass the avatar URL along with the route data
      });
    }
  };

  const getColor = (index) => {
    return colors[index % colors.length]; // 使用模运算确保不会超出数组范围
  };

  return (
    <Stack component={Card} direction="row" spacing={2} key={booker?.userID} sx={{ p: 3 }}>
      <Avatar alt={booker?.username} src={booker?.avatarURL} sx={{ width: 48, height: 48 }} />

      <input
        type="file"
        accept=".xml"
        style={{ display: 'none' }}
        ref={fileRef}
        onChange={handleUpload}
      />

      <Stack spacing={2} flexGrow={1}>
        <ListItemText
          primary={booker?.username
          }
          
          secondary={
            <Stack direction="row" alignItems="center" spacing={0.5}>
              <div style={{
                width: '10px',
                height: '10px',
                borderRadius: '50%',
                backgroundColor: getColor(index), // 使用函数获取颜色
                marginRight: '5px',
              }} />
              <Iconify icon="solar:buildings-2-bold-duotone" width={16} />
              {booker?.region}
            </Stack>
          }
          secondaryTypographyProps={{
            mt: 0.5,
            component: 'span',
            typography: 'caption',
            color: 'text.disabled',
          }}
        />

        {user?.username === booker?.username && (
          <Stack spacing={1} direction="row" sx={{ mb: -1 }}>
            <Button
              size="small"
              variant={'outlined'}
              onClick={handleAttach}
            >
              upload
            </Button>

            <Button
              size="small"
              variant={selected ? 'text' : 'outlined'}
              onClick={handleChangePath}
            >
              {selected ? 'hide' : 'show'}
            </Button>
          </Stack>
        )}
      </Stack>

      <Button
        size="small"
        variant={selected ? 'text' : 'outlined'}
        onClick={handleChangePath}
      >
        {selected ? 'hide' : 'show'}
      </Button>
    </Stack>
  );
}

BookerItem.propTypes = {
  booker: PropTypes.object,
  onSelected: PropTypes.func,
  selected: PropTypes.bool,
  user: PropTypes.object,
  onChangePath: PropTypes.func,
  index: PropTypes.number,
  activityID: PropTypes.string,
};
