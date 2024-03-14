import { m } from 'framer-motion';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import { useTheme } from '@mui/material/styles';
import Container from '@mui/material/Container';
import { styled } from '@mui/material/styles';

import { bgGradient, textGradient } from 'src/theme/css';
import { RouterLink } from 'src/routes/components';
import { paths } from 'src/routes/paths';

import { varFade, MotionViewport } from 'src/components/animate';
import { useSettingsContext } from 'src/components/settings';

// ----------------------------------------------------------------------

const StyledTextGradient = styled(m.h1)(({ theme }) => ({
  ...textGradient(
    `300deg, ${theme.palette.primary.main} 0%, ${theme.palette.warning.main} 25%, ${theme.palette.primary.main} 50%, ${theme.palette.warning.main} 75%, ${theme.palette.primary.main} 100%`
  ),
  padding: 0,
  marginTop: 8,
  lineHeight: 1,
  marginBottom: 12,
  letterSpacing: 1,
  textAlign: 'center',
  backgroundSize: '400%',
  fontSize: `${12 / 3}rem`,
  fontFamily: theme.typography.fontSecondaryFamily,
  [theme.breakpoints.up('md')]: {
    fontSize: `${12 / 2}rem`,
  },
}));

// ----------------------------------------------------------------------

export default function HeroFooter() {
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
        sx={{ color: 'common.white', mb: 3, typography: 'h2'}}
      >
        Get started with
        <br /> <StyledTextGradient
          animate={{ backgroundPosition: '200% center' }}
          transition={{
            repeatType: 'reverse',
            ease: 'linear',
            duration: 20,
            repeat: Infinity,
          }}
        >
          PathPals
        </StyledTextGradient>
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
            sx={{ fontSize: 20, fontWeight: 700 }}
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
            sx={{ borderColor: 'text.primary', fontSize: 20, fontWeight: 800 }}
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
        sx={{ maxWidth: 460, cursor: 'pointer' }}
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
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
