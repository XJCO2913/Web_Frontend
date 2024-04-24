import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';

import { paths } from 'src/routes/paths';

import Label from 'src/components/label';
import { useAuthContext } from '@/auth/hooks';

// ----------------------------------------------------------------------

export default function NavUpgrade() {
  const { user } = useAuthContext()

  const getLabelProps = () => {
    switch (user.membershipType) {
      case 0:
        return { text: 'Free', color: 'success' };
      case 1:
        return { text: 'Starter', color: 'warning' };
      case 2:
        return { text: 'Premium', color: 'error' };
      default:
        return { text: 'Unknown', color: 'grey' };
    }
  };

  const { text, color } = getLabelProps();

  return (
    <Stack
      sx={{
        px: 2,
        py: 5,
        textAlign: 'center',
      }}
    >
      <Stack alignItems="center">
        <Box sx={{ position: 'relative' }}>
          <Avatar src={user?.avatarUrl} alt={user?.username} sx={{ width: 48, height: 48 }}>
            {user?.username?.charAt(0).toUpperCase()}
          </Avatar>

          <Label
            color={color}
            variant="filled"
            sx={{
              top: -6,
              px: 0.5,
              left: 40,
              height: 20,
              position: 'absolute',
              borderBottomLeftRadius: 2,
            }}
          >
            {text}
          </Label>
        </Box>

        <Stack spacing={0.5} sx={{ mb: 2, mt: 1.5, width: 1 }}>
          <Typography variant="subtitle2" noWrap>
            {user?.username}
          </Typography>

        </Stack>

        <Button variant="contained" href={paths.home.user.account} target="_blank" rel="noopener">
          Upgrade to Pro
        </Button>
      </Stack>
    </Stack >
  );
}
