import PropTypes from 'prop-types';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import { alpha, useTheme } from '@mui/material/styles';

import { RouterLink } from 'src/routes/components';
import { useResponsive } from 'src/hooks/use-responsive';
import { bgGradient } from 'src/theme/css';
import { useAuthContext } from 'src/auth/hooks';
// import Logo from 'src/components/logo';

// ----------------------------------------------------------------------

const METHODS = [
];

export default function AuthClassicLayout({ children, image, title, type }) {
  const { method } = useAuthContext();
  const theme = useTheme();
  const mdUp = useResponsive('up', 'md');

  // const renderLogo = (
  //   <Logo
  //     sx={{
  //       zIndex: 9,
  //       position: 'absolute',
  //       m: { xs: 2, md: 5 },
  //     }}
  //   />
  // );

  const renderContent = () => {
    let sxProps;
    
    switch (type) {
      case 'login':
        sxProps = {
          px: { xs: 2, md: 8 },
          pt: { xs: 15, md: 20 },
          pb: { xs: 15, md: 0 },
        };
        break;
      case 'register':
        sxProps = {
          px: { xs: 3, md: 10 },
          pt: { xs: 20, md: 15 },
          pb: { xs: 20, md: 5 },
        };
        break;
      default:
        sxProps = {
          px: { xs: 2, md: 8 },
          pt: { xs: 15, md: 20 },
          pb: { xs: 15, md: 0 },
        };
        break;
    }
    
    return (
      <Stack
        sx={{
          width: 1,
          mx: 'auto',
          maxWidth: 480,
          ...sxProps,
        }}
      >
        {children}
      </Stack>
    );
  };

  const renderSection = (
    <Stack
      flexGrow={1}
      spacing={10}
      alignItems="center"
      justifyContent="center"
      sx={{
        ...bgGradient({
          color: alpha(
            theme.palette.background.default,
            theme.palette.mode === 'light' ? 0.88 : 0.94
          ),
          imgUrl: '/assets/background/overlay_2.jpg',
        }),
      }}
    >
      <Typography variant="h3" sx={{ maxWidth: 480, textAlign: 'center' }}>
        {title || 'Hi, Welcome back'}
      </Typography>

      <Box
        component="img"
        alt="auth"
        src={image || '/assets/illustrations/illustration_dashboard.png'}
        sx={{
          maxWidth: {
            xs: 480,
            lg: 560,
            xl: 720,
          },
        }}
      />

      <Stack direction="row" spacing={2}>
        {METHODS.map((option) => (
          <Tooltip key={option.label} title={option.label}>
            <Link component={RouterLink} href={option.path}>
              <Box
                component="img"
                alt={option.label}
                src={option.icon}
                sx={{
                  width: 32,
                  height: 32,
                  ...(method !== option.id && {
                    filter: 'grayscale(100%)',
                  }),
                }}
              />
            </Link>
          </Tooltip>
        ))}
      </Stack>
    </Stack>
  );

  return (
    <Stack
      component="main"
      direction="row"
      sx={{
        minHeight: '100vh',
      }}
    >
      {/* {renderLogo} */}

      {mdUp && renderSection}

      {renderContent()}
    </Stack>
  );
}

AuthClassicLayout.propTypes = {
  children: PropTypes.node,
  image: PropTypes.string,
  title: PropTypes.string,
  type: PropTypes.oneOf(['login', 'register'])
};
