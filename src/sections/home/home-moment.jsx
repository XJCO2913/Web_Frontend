import PropTypes from 'prop-types';
import { useRef, useState, useCallback } from 'react';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Card from '@mui/material/Card';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import { alpha } from '@mui/material/styles';
import Checkbox from '@mui/material/Checkbox';
import InputBase from '@mui/material/InputBase';
import IconButton from '@mui/material/IconButton';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';
import InputAdornment from '@mui/material/InputAdornment';
import FormControlLabel from '@mui/material/FormControlLabel';
import AvatarGroup, { avatarGroupClasses } from '@mui/material/AvatarGroup';

import { fDate } from 'src/utils/format-time';
import { fShortenNumber } from 'src/utils/format-number';
import AMapPathDrawer from 'src/components/map'
import Image from 'src/components/image';
import Iconify from 'src/components/iconify';

// ----------------------------------------------------------------------

export default function Moment({ post }) {
  const commentRef = useRef(null);

  const fileRef = useRef(null);

  const [message, setMessage] = useState('');

  const handleChangeMessage = useCallback((event) => {
    setMessage(event.target.value);
  }, []);

  const handleClickComment = useCallback(() => {
    if (commentRef.current) {
      commentRef.current.focus();
    }
  }, []);

  const renderHead = (
    <CardHeader
      disableTypography
      avatar={
        <Avatar src={post.authorInfo?.avatarUrl} alt={post.authorInfo?.name}>
          {post.authorInfo?.username?.charAt(0).toUpperCase()}
        </Avatar>
      }
      title={
        <Link color="inherit" variant="subtitle1">
          {post.authorInfo?.name}
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

  const renderCommentList = (
    <Stack spacing={1.5} sx={{ px: 3, pb: 2 }}>
      {post?.comments?.map((comment) => (
        <Stack key={comment.id} direction="row" spacing={2}>
          <Avatar alt={comment.author.name} src={comment.author.avatarUrl} />
          <Paper
            sx={{
              p: 1.5,
              flexGrow: 1,
              bgcolor: 'background.neutral',
            }}
          >
            <Stack
              sx={{ mb: 0.5 }}
              alignItems={{ sm: 'center' }}
              justifyContent="space-between"
              direction={{ xs: 'column', sm: 'row' }}
            >
              <Box sx={{ typography: 'subtitle2' }}>{comment.author.name}</Box>

              <Box sx={{ typography: 'caption', color: 'text.disabled' }}>
                {fDate(comment.createdAt)}
              </Box>
            </Stack>

            <Box sx={{ typography: 'body2', color: 'text.secondary' }}>{comment.message}</Box>
          </Paper>
        </Stack>
      ))}
    </Stack>
  );

  const renderInput = (
    <Stack
      spacing={2}
      direction="row"
      alignItems="center"
      sx={{
        p: (theme) => theme.spacing(0, 3, 3, 3),
      }}
    >
      <Avatar src={post.authorInfo?.avatarUrl} alt={post.authorInfo?.name} />
      <InputBase
        fullWidth
        value={message}
        inputRef={commentRef}
        placeholder="Write a comment…"
        onChange={handleChangeMessage}
        endAdornment={
          <InputAdornment position="end" sx={{ mr: 1 }}>
            <IconButton size="small">
              <Iconify icon="solar:gallery-add-bold" />
            </IconButton>

            <IconButton size="small">
              <Iconify icon="eva:smiling-face-fill" />
            </IconButton>
          </InputAdornment>
        }
        sx={{
          pl: 1.5,
          height: 40,
          borderRadius: 1,
          border: (theme) => `solid 1px ${alpha(theme.palette.grey[500], 0.32)}`,
        }}
      />

      <input type="file" ref={fileRef} style={{ display: 'none' }} />
    </Stack>
  );

  const renderActions = (
    <Stack
      direction="row"
      alignItems="center"
      sx={{
        p: (theme) => theme.spacing(2, 3, 3, 3),
      }}
    >
      <FormControlLabel
        control={
          <Checkbox
            defaultChecked
            color="error"
            icon={<Iconify icon="solar:heart-bold" />}
            checkedIcon={<Iconify icon="solar:heart-bold" />}
          />
        }
        label={fShortenNumber(post?.personLikes?.length)}
        sx={{ mr: 1 }}
      />

      {!!post?.personLikes?.length && (
        <AvatarGroup
          sx={{
            [`& .${avatarGroupClasses.avatar}`]: {
              width: 32,
              height: 32,
            },
          }}
        >
          {post?.personLikes?.map((person) => (
            <Avatar key={person.name} alt={person.name} src={person.avatarUrl} />
          ))}
        </AvatarGroup>
      )}

      <Box sx={{ flexGrow: 1 }} />

      <IconButton onClick={handleClickComment}>
        <Iconify icon="solar:chat-round-dots-bold" />
      </IconButton>

      <IconButton>
        <Iconify icon="solar:share-bold" />
      </IconButton>
    </Stack>
  );

  return (
    <Card sx={{ mt: 2 }}>
      {renderHead}
      {post?.message && (
        <Typography
          variant="body2"
          sx={{
            p: (theme) => theme.spacing(3, 3, 2, 3),
          }}
        >
          {post?.message}
        </Typography>)}

      {
        post?.media_image && (
          <Box sx={{ p: 1 }}>
            <Image alt="Post image" src={post.media_image} style={{ width: '100%', borderRadius: '8px' }} />
          </Box>
        )
      }
      {
        post?.media_video && (
          <Box sx={{ p: 1 }}>
            <video controls src={post.media_video} style={{ width: '100%', borderRadius: '8px' }} />
          </Box>
        )
      }
      {
        post?.media && (
          <Box sx={{ p: 1 }}>
            <AMapPathDrawer path={post.media} style={{ width: '100%', borderRadius: '8px' }}/>
          </Box>
        )
      }

      {renderActions}

      {post?.comments?.length > 0 && renderCommentList}

      {renderInput}
    </Card>
  );
}

Moment.propTypes = {
  post: PropTypes.object,
};
