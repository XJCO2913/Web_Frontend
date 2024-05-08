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
import AMapPathDrawer from 'src/components/map'
import { wgs2gcj } from 'src/utils/xml-shift'

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
        {post.content}
      </Typography>

      {
        post?.imageUrl && (
          <Box sx={{ p: 1 }}>
            <Image alt="Post image" src={post.imageUrl} style={{ width: '100%', borderRadius: '8px' }} />
          </Box>
        )
      }
      {
        post?.videoUrl && (
          <Box sx={{ p: 1 }}>
            <video controls src={post.videoUrl} style={{ width: '100%', borderRadius: '8px' }} />
          </Box>
        )
      }
      {
        post?.gpxRoute && (
          <Box sx={{ p: 1 }}>
            <AMapPathDrawer
              paths={[{
                coords: wgs2gcj(post?.gpxRoute), // 确保这返回一个坐标数组
                color: '#00A76F' // 静态颜色定义
              }]}
              style={{ width: '100%', borderRadius: '8px' }}
            />
          </Box>
        )
      }
    </Card>
  );
}

ProfilePostItem.propTypes = {
  post: PropTypes.object,
};
