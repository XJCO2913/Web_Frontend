import PropTypes from 'prop-types';
import { useCallback, useState, useRef, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';

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
    return null
  }
}

// ----------------------------------------------------------------------

export default function TourDetailsBookers({ bookers, path, id }) {
  const [currentPath, setCurrentPath] = useState([]);
  const { user } = useAuthContext();

  useEffect(() => {
    if (path) {
      setCurrentPath(oldPaths => [...oldPaths, path]);
    }
  }, [path]);

  const handlePathChange = (newPath, color, user, shouldAdd = true) => {
    setCurrentPath(current => {
      if (shouldAdd) {
        // 添加路径
        return [
          ...current,
          ...convertDataToPaths(newPath, color, user)
        ];
      } else {
        // 删除路径
        return current.filter(path => path.user?.userID !== user?.userID);
      }
    });
  };

  return (
    <>
      {currentPath && (
        <Stack mb={3} spacing={1} mt={-2}>
          <Typography variant="h6">Route View</Typography>
          <AMapPathDrawer
            paths={currentPath}
            style={{ width: '100%', borderRadius: '8px' }}
          />
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
            user={user}
            onChangePath={handlePathChange}
            index={index}
            activityID={id}
            initialFollowStatus={booker.isFollowed}
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

function BookerItem({ booker, user, onChangePath, index, activityID, initialFollowStatus }) {
  const fileRef = useRef(null);
  const [buttonText, setButtonText] = useState('show');
  const { enqueueSnackbar } = useSnackbar();
  const [isFollowed, setIsFollowed] = useState(initialFollowStatus);

  const handleClick = useCallback(
    async (followerId) => {
      try {
        const url = `${endpoints.user.followUser}?followingId=${followerId}`;
        const response = await axiosTest.post(url);
        if (response.data.status_code === 0) {
          setIsFollowed(true);
          enqueueSnackbar('Follow user successfully!', { variant: 'success' });
        } else {
          console.error('Failed to follow:', response.data);
          enqueueSnackbar('Failed to follow user!', { variant: 'error' });
        }
      } catch (error) {
        console.error('Error during follow operation:', error.response || error);
        enqueueSnackbar('Failed to follow user!', { variant: 'error' });
      }
    },
    []
  );

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
    } finally {
      event.target.value = null;
    }
  };

  const handleChangePath = async () => {
    if (buttonText === 'show') {
      const fetchedData = await fetchRouteData(booker.userID, activityID);
      if (fetchedData === null) {
        enqueueSnackbar('User does not have any route data!', { variant: 'warning' });
        return; // 直接返回，不执行后续操作
      }
      if (fetchedData) {
        onChangePath(fetchedData.route, getColor(index), {
          avatarUrl: fetchedData.avatarUrl,
          userID: booker.userID
        }, true); // 添加路径
        setButtonText('hide');
      }
    } else {
      setButtonText('show');
      onChangePath(null, null, {
        userID: booker.userID
      }, false); // 移除路径
    }
  };

  const getColor = (index) => {
    return colors[index % colors.length];
  };

  const handleDownload = () => {
    const fileName = `download-${uuidv4()}.xml`;
    const link = document.createElement('a');
    link.href = '/example.xml';
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
          primary={
            <Stack direction="row" alignItems="center" spacing={0.5}>
              {booker?.username}
              <div style={{
                width: '10px',
                height: '10px',
                borderRadius: '50%',
                backgroundColor: getColor(index),
                marginRight: '-5px',
                marginLeft: '5px',
              }} />
              {user?.username !== booker?.username && (
                <IconButton
                  size="small"
                  onClick={!isFollowed ? () => handleClick(booker.userID) : undefined}
                >
                  {isFollowed ? (
                    <Iconify icon="ic:baseline-check" width={20} />
                  ) : (
                    <Iconify icon="ic:round-add" width={20} />
                  )}
                </IconButton>
              )}

            </Stack>
          }
          secondary={
            <Stack direction="row" alignItems="center" spacing={0.5}>
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
              variant="outlined"
              onClick={handleAttach}
            >
              upload
            </Button>
            <Button
              size="small"
              variant="outlined"
              onClick={handleDownload}
            >
              dowload
            </Button>
          </Stack>
        )}
      </Stack>


      <Button
        size="small"
        variant="outlined"
        onClick={handleChangePath}
      >
        {buttonText}
      </Button>
    </Stack>
  );
}

BookerItem.propTypes = {
  booker: PropTypes.object,
  selected: PropTypes.bool,
  user: PropTypes.object,
  onChangePath: PropTypes.func,
  index: PropTypes.number,
  activityID: PropTypes.string,
  initialFollowStatus: PropTypes.bool,
};
