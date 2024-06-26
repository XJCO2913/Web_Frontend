import PropTypes from 'prop-types';
import { useRef, useState, useCallback, useReducer, useEffect } from 'react';

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
import { axiosTest } from '@/utils/axios';
import { endpoints } from '@/api';
import { useSnackbar } from 'notistack';
import { useAuthContext } from '@/auth/hooks';
import { wgs2gcj } from 'src/utils/xml-shift'

// ----------------------------------------------------------------------
export default function Moment({ post }) {
  const { user } = useAuthContext();
  const { enqueueSnackbar } = useSnackbar();
  const commentRef = useRef(null);

  // 定义初始状态的函数
  const getInitialState = () => ({
    isLiked: post?.isLiked || false,
    likeCount: post?.personLikes?.length || 0,
    comments: post?.comments || [],
    personLikes: post?.personLikes || []
  });

  // Reducer 函数
  function reducer(state, action) {
    switch (action.type) {
      case 'TOGGLE_LIKE': {
        const { isLiked, user } = action.payload;
        const newPersonLikes = isLiked
          ? [...state.personLikes, { name: user.username, avatarUrl: user.avatarUrl }]
          : state.personLikes.filter(person => person.name !== user.username);
        return {
          ...state,
          isLiked,
          likeCount: isLiked ? state.likeCount + 1 : state.likeCount - 1,
          personLikes: newPersonLikes
        };
      }
      case 'RESET':
        return getInitialState(); // 使用函数返回新的初始状态
      case 'ADD_COMMENT':
        return {
          ...state,
          comments: [...state.comments, action.payload.comment]
        };
      default:
        return state;
    }
  }

  const [state, dispatch] = useReducer(reducer, getInitialState());
  const { isLiked, likeCount, comments, personLikes } = state; // 从state中解构所需的值
  const [message, setMessage] = useState('');

  useEffect(() => {
    // 侦听 post 的变化，并在变化时重置状态
    dispatch({ type: 'RESET', payload: getInitialState() });
  }, [post]); // 依赖项列表中包含 `post`

  const handleChangeMessage = useCallback((event) => {
    setMessage(event.target.value);
  }, []);

  const handleClickComment = useCallback(() => {
    if (commentRef.current) {
      commentRef.current.focus();
    }
  }, []);

  const handleLike = async () => {
    try {
      const resp = await axiosTest.post(endpoints.moment.like + '?momentID=' + post.id);
      if (resp.data.status_code === 0) {
        enqueueSnackbar(resp.data.status_msg);
        dispatch({ type: 'TOGGLE_LIKE', payload: { isLiked: !isLiked, user } });
      } else {
        enqueueSnackbar(resp.data.status_msg, { variant: "error" });
      }
    } catch (err) {
      enqueueSnackbar(err.toString(), { variant: "error" });
    }
  };

  const handleUnlike = async () => {
    try {
      const resp = await axiosTest.delete(endpoints.moment.unlike + '?momentID=' + post.id);
      if (resp.data.status_code === 0) {
        enqueueSnackbar(resp.data.status_msg);
        dispatch({ type: 'TOGGLE_LIKE', payload: { isLiked: !isLiked, user } });
      } else {
        enqueueSnackbar(resp.data.status_msg, { variant: "error" });
      }
    } catch (err) {
      enqueueSnackbar(err.toString(), { variant: "error" });
    }
  };

  const handleSendComment = async () => {
    try {
      const token = sessionStorage.getItem('token')
      const httpConfig = {
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      }

      const data = {
        momentId: post.id,
        content: message,
      }

      const resp = await axiosTest.post(endpoints.moment.comment, data, httpConfig)
      if (resp.data.status_code === 0) {
        enqueueSnackbar(resp.data.status_msg)
        dispatch({
          type: 'ADD_COMMENT', payload: {
            comment: {
              id: "temp",
              author: {
                name: user.username,
                avatarUrl: user.avatarUrl,
              },
              createdAt: new Date(),
              message: message,
            }
          }
        });
      } else {
        enqueueSnackbar(resp.data.status_msg, { variant: "error" });
      }
    } catch (err) {
      enqueueSnackbar(err.toString(), { variant: "error" });
    } finally {
      setMessage('');
    }
  }


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
      {comments?.map((comment) => (
        <Stack key={comment.id} direction="row" spacing={2}>
          <Avatar alt={comment.author.name} src={comment.author.avatarUrl}>
            {comment.author.name.charAt(0).toUpperCase()}
          </Avatar>
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
      <Avatar src={user?.avatarUrl} alt={user?.username} >
        {user?.username.charAt(0).toUpperCase()}
      </Avatar>
      <InputBase
        fullWidth
        value={message}
        inputRef={commentRef}
        placeholder="Write a comment…"
        onChange={handleChangeMessage}
        endAdornment={
          <InputAdornment position="end" sx={{ mr: 1 }}>
            <IconButton
              size="small"
              onClick={async () => { await handleSendComment() }}
            >
              <Iconify icon="bi:send-fill" />
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
            color="error"
            icon={<Iconify icon="solar:heart-bold" />}
            checkedIcon={<Iconify icon="solar:heart-bold" />}
            checked={isLiked}
            onChange={(event) => {
              if (event.target.checked) {
                handleLike()
              } else {
                handleUnlike()
              }
            }}
          />
        }
        label={fShortenNumber(likeCount)}
        sx={{ mr: 1 }}
      />

      {!!personLikes.length && (
        <AvatarGroup
          sx={{
            [`& .${avatarGroupClasses.avatar}`]: {
              width: 32,
              height: 32,
            },
          }}
        >
          {personLikes.map((person) => (
            <Avatar key={person.name} alt={person.name} src={person.avatarUrl}>
              {person.name.charAt(0).toUpperCase()}
            </Avatar>
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
            <AMapPathDrawer
              paths={[{
                coords: wgs2gcj(post.media), // 确保这返回一个坐标数组
                color: '#00A76F' // 静态颜色定义
              }]}
              style={{ width: '100%', borderRadius: '8px' }}
            />
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
