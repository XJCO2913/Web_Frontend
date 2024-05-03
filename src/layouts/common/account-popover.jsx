import { m } from 'framer-motion';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';
import { alpha } from '@mui/material/styles';
import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';
import Label from 'src/components/label';
import { useAuthContext } from 'src/auth/hooks';
import { varHover } from 'src/components/animate';
import { useSnackbar } from 'src/components/snackbar';
import CustomPopover, { usePopover } from 'src/components/custom-popover';

// ----------------------------------------------------------------------

const OPTIONS = [
  {
    label: 'Home',
    linkTo: '/home',
  },
  {
    label: 'Profile',
    linkTo: paths.home.user.profile,
  },
  {
    label: 'Settings',
    linkTo: paths.home.user.account,
  },
  {
    label: 'Upgrade',
    action: (router) => {
      router.push('/home/user/account');
    }
  },
];

// ----------------------------------------------------------------------

export default function AccountPopover() {
  const router = useRouter();

  const { user } = useAuthContext();

  const { logout } = useAuthContext();

  const { enqueueSnackbar } = useSnackbar();

  const popover = usePopover();

  const handleLogout = async () => {
    try {
      await logout();
      popover.onClose();
      router.replace('/');
    } catch (error) {
      console.error(error);
      enqueueSnackbar('Unable to logout!', { variant: 'error' });
    }
  };

  const getLabelProps = () => {
    switch (user?.membershipType) {
      case 0:
        return { text: 'Free', colorCustom: 'success' };
      case 1:
        return { text: 'Starter', colorCustom: 'warning' };
      case 2:
        return { text: 'Premium', colorCustom: 'error' };
      default:
        return { text: 'Unknown', colorCustom: 'primary' };
    }
  };

  const { text, colorCustom } = getLabelProps();

  // const handleClickItem = (path) => {
  //   popover.onClose();
  //   router.push(path);
  // };

  const handleClickItem = (option) => {
    popover.onClose();
    if (option.action) {
      // 执行action时传入router对象
      option.action(router);
    } else {
      // 使用自定义router的push方法进行导航
      router.push(option.linkTo);
    }
  };

  return (
    <>
      <IconButton
        component={m.button}
        whileTap="tap"
        whileHover="hover"
        variants={varHover(1.05)}
        onClick={popover.onOpen}
        sx={{
          width: 40,
          height: 40,
          background: (theme) => alpha(theme.palette.grey[500], 0.08),
          ...(popover.open && {
            background: (theme) =>
              `linear-gradient(135deg, ${theme.palette.primary.light} 0%, ${theme.palette.primary.main} 100%)`,
          }),
        }}
      >
        <Avatar
          src={user?.avatarUrl}
          alt="avatar"
          sx={{
            width: 36,
            height: 36,
            border: (theme) => `solid 2px ${theme.palette.background.default}`,
          }}
        >
          {user?.username?.charAt(0).toUpperCase()}
        </Avatar>
      </IconButton>

      <CustomPopover open={popover.open} onClose={popover.onClose} sx={{ width: 200, p: 0 }}>
        <Box sx={{ p: 2, pb: 0.9 }}>
          <Typography variant="subtitle2" noWrap>
            {user?.username}
          </Typography>

          <Label
            color={colorCustom}
            variant="filled"
            sx={{
              px: 1,
              mb: -2,
              height: 20,
              width: 60,
            }}
          >
            {text}
          </Label>
        </Box>

        <Divider sx={{ borderStyle: 'dashed' }} />

        <Stack sx={{ p: 1 }}>
          {OPTIONS.map((option) => (
            <MenuItem key={option.label} onClick={() => handleClickItem(option)}>
              {option.label}
            </MenuItem>
          ))}
        </Stack>

        <Divider sx={{ borderStyle: 'dashed' }} />

        <MenuItem
          onClick={handleLogout}
          sx={{ m: 1, fontWeight: 'fontWeightBold', color: 'error.main' }}
        >
          Logout
        </MenuItem>
      </CustomPopover>
    </>
  );
}
