import { m } from 'framer-motion';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import { useTheme } from '@mui/material/styles';
import Container from '@mui/material/Container';
import { RouterLink } from 'src/routes/components';
import { paths } from 'src/routes/paths';

import { bgGradient } from 'src/theme/css';

import { varFade, MotionViewport } from 'src/components/animate';
import { useSettingsContext } from 'src/components/settings';

// ----------------------------------------------------------------------

export default function HomeAdvertisement() {
  const theme = useTheme();
  const settings = useSettingsContext();

  const renderDescription = (
    <Box
      sx={{
        textAlign: {
          xs: 'center',
          md: 'left',
        },
      }}
    >
      <Box
        component={m.div}
        variants={varFade().inDown}
        sx={{ color: 'common.white', mb: 5, typography: 'h2' }}
      >
        Get started with
        <br /> PathPals today
      </Box>

      <Stack
        direction={{ xs: 'column', md: 'row' }}
        justifyContent={{ xs: 'center', md: 'flex-start' }}
        spacing={2}
      >
        <m.div variants={varFade().inRight}>
          <Button
            component={RouterLink}
            href={paths.login}
            color="inherit"
            size="large"
            variant="contained"
            startIcon={
              <img
                src={`/assets/icons/home/ic_login${settings.themeMode === 'dark' ? '-dark' : ''}.svg`}
                alt="Log in"
                style={{ width: 24, height: 24 }}
              />
            }
          >
            Log In
          </Button>
        </m.div>

        <m.div variants={varFade().inRight}>
          <Button
            color="inherit"
            size="large"
            variant="outlined"
            startIcon={
              <img
                src={`/assets/icons/home/ic_registration${settings.themeMode === 'dark' ? '-dark' : ''}.svg`}
                alt="Sign Up"
                style={{ width: 24, height: 24 }}
              />
            }
            target="_blank"
            rel="noopener"
            href={paths.register}
            sx={{ borderColor: 'text.primary' }}
          >
            Sign Up
          </Button>
        </m.div>
      </Stack>
    </Box >
  );

  const renderImg = (
    <Stack component={m.div} variants={varFade().inUp} alignItems="center">
      <Box
        component={m.img}
        animate={{
          y: [-20, 0, -20],
        }}
        transition={{ duration: 4, repeat: Infinity }}
        alt="rocket"
        src="/assets/images/home/rocket.webp"
        sx={{ maxWidth: 460 }}
      />
    </Stack>
  );

  return (
    <Container component={MotionViewport}>
      <Stack
        alignItems="center"
        direction={{ xs: 'column', md: 'row' }}
        sx={{
          ...bgGradient({
            direction: '135deg',
            startColor: theme.palette.primary.main,
            endColor: theme.palette.primary.dark,
          }),
          borderRadius: 2,
          pb: { xs: 5, md: 0 },
        }}
      >
        {renderImg}

        {renderDescription}
      </Stack>
    </Container>
  );
}
