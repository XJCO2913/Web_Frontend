import PropTypes from 'prop-types';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Card from '@mui/material/Card';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';

import { fDate } from 'src/utils/format-time';

import Image from 'src/components/image';
import Iconify from 'src/components/iconify';
import { useAuthContext } from '@/auth/hooks';

// ----------------------------------------------------------------------

export default function ProfilePostItem({ post }) {
  const { user } = useAuthContext()

  const renderHead = (
    <CardHeader
      disableTypography
      avatar={
        <Avatar src={user?.avatarUrl} alt={user?.username}>
          {user?.username?.charAt(0).toUpperCase()}
        </Avatar>
      }
      title={
        <Link color="inherit" variant="subtitle1">
          {user?.username}
        </Link>
      }
      subheader={
        <Box sx={{ color: 'text.disabled', typography: 'caption', mt: 0.5 }}>
          {fDate(post.createdAt)}
        </Box>
      }
      action={
        <IconButton>
          <Iconify icon="eva:more-vertical-fill" />
        </IconButton>
      }
    />
  );

  return (
    <Card>
      {renderHead}

      <Typography
        variant="body2"
        sx={{
          p: (theme) => theme.spacing(3, 3, 2, 3),
        }}
      >
        {post.message}
      </Typography>

      <Box sx={{ p: 1 }}>
        <Image alt={post.media} src={post.media} ratio="16/9" sx={{ borderRadius: 1.5 }} />
      </Box>
    </Card>
  );
}

ProfilePostItem.propTypes = {
  post: PropTypes.object,
};
