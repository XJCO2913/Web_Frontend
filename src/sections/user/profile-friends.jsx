import PropTypes from 'prop-types';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import { alpha } from '@mui/material/styles';
import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';

import { _socials } from 'src/_mock';

import Iconify from 'src/components/iconify';
import CustomPopover, { usePopover } from 'src/components/custom-popover';

// ----------------------------------------------------------------------

export default function ProfileFriends({ friends }) {

  if (friends.length === 0) {
    return (
      <>
        <Stack
          spacing={2}
          justifyContent="space-between"
          direction={{ xs: 'column', sm: 'row' }}
          sx={{ my: 5 }}
        >
          <Typography variant="h4">Friends</Typography>
        </Stack>

        <Typography>You Do Not Have Any Friends.</Typography>
      </>
    )
  }
  else {
    return (
      <>
        <Stack
          spacing={2}
          justifyContent="space-between"
          direction={{ xs: 'column', sm: 'row' }}
          sx={{ my: 5 }}
        >
          <Typography variant="h4">Friends</Typography>
        </Stack>

        <Box
          gap={3}
          display="grid"
          gridTemplateColumns={{
            xs: 'repeat(1, 1fr)',
            sm: 'repeat(2, 1fr)',
            md: 'repeat(3, 1fr)',
          }}
        >
          {friends.map((friend) => (
            <FriendCard key={friend.id} friend={friend} />
          ))}
        </Box>
      </>
    );
  }
}

ProfileFriends.propTypes = {
  friends: PropTypes.array,
  onSearchFriends: PropTypes.func,
  searchFriends: PropTypes.string,
};

// ----------------------------------------------------------------------

function FriendCard({ friend }) {
  const { name, role, avatarUrl } = friend;

  const popover = usePopover();

  const handleDelete = () => {
    popover.onClose();
    console.info('DELETE', name);
  };

  const handleEdit = () => {
    popover.onClose();
    console.info('EDIT', name);
  };

  return (
    <>
      <Card
        sx={{
          py: 5,
          display: 'flex',
          position: 'relative',
          alignItems: 'center',
          flexDirection: 'column',
        }}
      >
        <Avatar alt={name} src={avatarUrl} sx={{ width: 64, height: 64, mb: 3 }} />

        <Link variant="subtitle1" color="text.primary">
          {name}
        </Link>

        <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1, mt: 0.5 }}>
          {role}
        </Typography>

        <Stack alignItems="center" justifyContent="center" direction="row">
          {_socials.map((social) => (
            <IconButton
              key={social.name}
              sx={{
                color: social.color,
                '&:hover': {
                  bgcolor: alpha(social.color, 0.08),
                },
              }}
            >
              <Iconify icon={social.icon} />
            </IconButton>
          ))}
        </Stack>

        <IconButton
          color={popover.open ? 'inherit' : 'default'}
          onClick={popover.onOpen}
          sx={{ top: 8, right: 8, position: 'absolute' }}
        >
          <Iconify icon="eva:more-vertical-fill" />
        </IconButton>
      </Card>

      <CustomPopover
        open={popover.open}
        onClose={popover.onClose}
        arrow="right-top"
        sx={{ width: 140 }}
      >
        <MenuItem onClick={handleDelete} sx={{ color: 'error.main' }}>
          <Iconify icon="solar:trash-bin-trash-bold" />
          Delete
        </MenuItem>

        <MenuItem onClick={handleEdit}>
          <Iconify icon="solar:pen-bold" />
          Edit
        </MenuItem>
      </CustomPopover>
    </>
  );
}

FriendCard.propTypes = {
  friend: PropTypes.object,
};

