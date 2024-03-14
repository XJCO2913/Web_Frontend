import { m } from 'framer-motion';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import { alpha } from '@mui/material/styles';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import { varFade, MotionViewport } from 'src/components/animate';
import { useSettingsContext } from 'src/components/settings';

// ----------------------------------------------------------------------

const CARDS = [
  {
    iconLight: '/assets/icons/home/ic_path.svg',
    iconDark: '/assets/icons/home/ic_path-dark.svg',
    title: 'Paths',
    description: 'Upload the paths that you have gone through, and highlight them in map!',
  },
  {
    iconLight: '/assets/icons/home/ic_contact.svg',
    iconDark: '/assets/icons/home/ic_contact-dark.svg',
    title: 'Contacts',
    description: 'Feel free to share paths, activities, moments with your friends!',
  },
  {
    iconLight: '/assets/icons/home/ic_activity.svg',
    iconDark: '/assets/icons/home/ic_activity-dark.svg',
    title: 'Activities',
    description: 'Join or organise any outdoor activities in which you are interested!',
  },
];

// ----------------------------------------------------------------------

export default function HeroInfo() {
  const settings = useSettingsContext();
  return (
    <Container
      component={MotionViewport}
      sx={{
        py: { xs: 10, md: 15 },
      }}
    >
      <Stack
        spacing={3}
        sx={{
          textAlign: 'center',
          mb: { xs: 5, md: 10 },
        }}
      >
        <m.div variants={varFade().inUp}>
          <Typography component="div" variant="overline" sx={{ color: 'text.disabled' }}>
            PathPals APP
          </Typography>
        </m.div>

        <m.div variants={varFade().inDown}>
          <Typography variant="h2">
            What <span style={{ color: '#00A76F' }}>PathPals</span> <br /> can offer?
          </Typography>
        </m.div>
      </Stack>

      <Box
        gap={{ xs: 3, lg: 10 }}
        display="grid"
        alignItems="center"
        gridTemplateColumns={{
          xs: 'repeat(1, 1fr)',
          md: 'repeat(3, 1fr)',
        }}
      >
        {CARDS.map((card, index) => (
          <m.div variants={varFade().inUp} key={card.title}>
            <Card
              sx={{
                textAlign: 'center',
                boxShadow: { md: 'none' },
                bgcolor: 'background.default',
                p: (theme) => theme.spacing(10, 5),
                ...(index === 1 && {
                  boxShadow: (theme) => ({
                    md: `-40px 40px 80px ${theme.palette.mode === 'light'
                        ? alpha(theme.palette.grey[500], 0.16)
                        : alpha(theme.palette.common.black, 0.4)
                      }`,
                  }),
                }),
              }}
            >
              <Box
                component="img"
                src={settings.themeMode === 'dark' ? card.iconDark : card.iconLight}
                alt={card.title}
                sx={{ mx: 'auto', width: 48, height: 48 }}
              />

              <Typography variant="h5" sx={{ mt: 8, mb: 2 }}>
                {card.title}
              </Typography>

              <Typography sx={{ color: 'text.secondary' }}>{card.description}</Typography>
            </Card>
          </m.div>
        ))}
      </Box>
    </Container>
  );
}
