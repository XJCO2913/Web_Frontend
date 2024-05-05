import PropTypes from 'prop-types';
import { useState, useCallback, useRef } from 'react';

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

// ----------------------------------------------------------------------

export default function TourDetailsBookers({ bookers, media_gpx }) {
  const [approved, setApproved] = useState([]);
  const { user } = useAuthContext();

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
      {media_gpx && (
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
            <AMapPathDrawer path={media_gpx} style={{ width: '100%', borderRadius: '8px' }} />
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
        {bookers.map((booker) => (
          <BookerItem
            key={booker.userID}
            booker={booker}
            selected={approved.includes(booker.userID)}
            onSelected={() => handleClick(booker.userID)}
            user={user}
          />
        ))}
      </Box>
    </>

  );
}

TourDetailsBookers.propTypes = {
  bookers: PropTypes.array,
  media_gpx: PropTypes.array,
};

// ----------------------------------------------------------------------

function BookerItem({ booker, selected, user }) {
  const fileRef = useRef(null);

  const handleAttach = () => {
    if (fileRef.current) {
      fileRef.current.click();
    }
  };

  return (
    <Stack component={Card} direction="row" spacing={2} key={booker.userID} sx={{ p: 3 }}>
      <Avatar alt={booker.username} src={booker.avatarURL} sx={{ width: 48, height: 48 }} />

      <input
        type="file"
        style={{ display: 'none' }}
        ref={fileRef}
      />

      <Stack spacing={2} flexGrow={1}>
        <ListItemText
          primary={booker.username}
          secondary={
            <Stack direction="row" alignItems="center" spacing={0.5}>
              <Iconify icon="solar:buildings-2-bold-duotone" width={16} />
              {booker.region}
            </Stack>
          }
          secondaryTypographyProps={{
            mt: 0.5,
            component: 'span',
            typography: 'caption',
            color: 'text.disabled',
          }}
        />

        {user.username === booker.username && (
          <Stack spacing={1} direction="row" sx={{ mb: -1 }}>
            <Button
              size="small"
              variant={selected ? 'text' : 'outlined'}
              onClick={handleAttach}
            >
              upload
            </Button>
            <Button
              size="small"
              variant={selected ? 'text' : 'outlined'}
            >
              start now
            </Button>
          </Stack>
        )}
      </Stack>

      <Button
        size="small"
        variant={selected ? 'text' : 'outlined'}
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
  user: PropTypes.object
};
