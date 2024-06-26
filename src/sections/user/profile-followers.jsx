import PropTypes from 'prop-types';
import { useCallback, useState } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import ListItemText from '@mui/material/ListItemText';

import Iconify from 'src/components/iconify';
import { axiosTest } from 'src/utils/axios';
import { endpoints } from 'src/api';

// ----------------------------------------------------------------------

export default function ProfileFollowers({ followers, onFollowChange }) {
  if (followers.length === 0) {
    return (
      <>
        <Typography variant="h4" sx={{ my: 5 }}>Followers</Typography>
        <Typography>You Do Not Have Any Followers.</Typography>
      </>
    );
  } else {
    return (
      <>
        <Typography variant="h4" sx={{ my: 5 }}>Followers</Typography>
        <Box
          gap={3}
          display="grid"
          gridTemplateColumns={{ xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' }}
        >
          {followers.map((follower) => (
            <FollowerItem
              key={follower.id}
              follower={follower}
              initialFollowStatus={follower.isFollowed}
              onFollowChange={onFollowChange}
            />
          ))}
        </Box>
      </>
    );
  }
}

ProfileFollowers.propTypes = {
  followers: PropTypes.array,
  onFollowChange: PropTypes.func,
};

// ----------------------------------------------------------------------

function FollowerItem({ follower, initialFollowStatus, onFollowChange }) {
  const { name, region, avatarUrl } = follower;
  const [isFollowed, setIsFollowed] = useState(initialFollowStatus);

  const handleClick = useCallback(
    async (followerId) => {
      try {
        const url = `${endpoints.user.followUser}?followingId=${followerId}`;
        const response = await axiosTest.post(url);
        setIsFollowed(true);
        if (response.data.status_code === 0) {
          // Optionally update the follower list state if needed, or let a parent component handle it
          onFollowChange(followerId, true); 
          console.log('Follow status updated successfully');
        } else {
          console.error('Failed to update follow status:', response.data);
        }
      } catch (error) {
        console.error('Error updating follow status:', error.response || error);
      }
    },
    [onFollowChange]
  );

  return (
    <Card
      sx={{
        display: 'flex',
        alignItems: 'center',
        p: (theme) => theme.spacing(3, 2, 3, 3),
      }}
    >
      <Avatar alt={name} src={avatarUrl} sx={{ width: 48, height: 48, mr: 2 }} />

      <ListItemText
        primary={name}
        secondary={
          <>
            <Iconify icon="mingcute:location-fill" width={16} sx={{ flexShrink: 0, mr: 0.5 }} />
            {region}
          </>
        }
        primaryTypographyProps={{
          noWrap: true,
          typography: 'subtitle2',
        }}
        secondaryTypographyProps={{
          mt: 0.5,
          noWrap: true,
          display: 'flex',
          component: 'span',
          alignItems: 'center',
          typography: 'caption',
          color: 'text.disabled',
        }}
      />

      <Button
        size="small"
        variant={isFollowed ? 'text' : 'outlined'}
        color={isFollowed ? 'success' : 'inherit'}
        startIcon={
          isFollowed ? <Iconify width={18} icon="eva:checkmark-fill" sx={{ mr: -0.75 }} /> : null
        }
        onClick={!isFollowed ? () => handleClick(follower.id) : undefined}
        sx={{ flexShrink: 0, ml: 1.5 }}
      >
        {isFollowed ? 'Followed' : 'Follow'}
      </Button>
    </Card>
  );
}

FollowerItem.propTypes = {
  follower: PropTypes.object,
  onSelected: PropTypes.func,
  selected: PropTypes.bool,
  initialFollowStatus: PropTypes.bool,
  onFollowChange: PropTypes.func,
};
