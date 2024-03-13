import { m } from 'framer-motion';
import PropTypes from 'prop-types';
import { useState, useCallback } from 'react';

import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import { alpha } from '@mui/material/styles';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import { paths } from 'src/routes/paths';

import { useResponsive } from 'src/hooks/use-responsive';

import Iconify from 'src/components/iconify';
import { varFade, MotionViewport } from 'src/components/animate';

// ----------------------------------------------------------------------

const plans = [...Array(2)].map((_, index) => ({
  license: ['Standard', 'Extended'][index],
  commons: ['Visualize Your Sport Data', 'Chat With Your Frineds', 'Post Your Moment'],
  options: [
    'Join Outdoor Activities',
    'Apply For Organizer',
  ],
}));

// ----------------------------------------------------------------------

export default function HomePricing() {
  const mdUp = useResponsive('up', 'md');

  const [currentTab, setCurrentTab] = useState('Standard');

  const handleChangeTab = useCallback((event, newValue) => {
    setCurrentTab(newValue);
  }, []);

  const renderDescription = (
    <Stack spacing={3} sx={{ mb: 10, textAlign: 'center' }}>
      <m.div variants={varFade().inUp}>
        <Typography component="div" variant="overline" sx={{ mb: 2, color: 'text.disabled' }}>
          pricing plans
        </Typography>
      </m.div>

      <m.div variants={varFade().inDown}>
        <Typography variant="h2">
          The right plan for <br /> your fitness
        </Typography>
      </m.div>

      <m.div variants={varFade().inDown}>
        <Typography sx={{ color: 'text.secondary' }}>
          Choose the perfect plan for your needs. Always flexible to grow.
        </Typography>
      </m.div>
    </Stack>
  );

  const renderContent = (
    <>
      {mdUp ? (
        <Box
          display="grid"
          gridTemplateColumns="repeat(2, 1fr)"
          sx={{
            borderRadius: 2,
            border: (theme) => `dashed 1px ${theme.palette.divider}`,
          }}
        >
          {plans.map((plan) => (
            <m.div key={plan.license} variants={varFade().in}>
              <PlanCard key={plan.license} plan={plan} />
            </m.div>
          ))}
        </Box>
      ) : (
        <>
          <Stack alignItems="center" sx={{ mb: 5 }}>
            <Tabs value={currentTab} onChange={handleChangeTab}>
              {plans.map((tab) => (
                <Tab key={tab.license} value={tab.license} label={tab.license} />
              ))}
            </Tabs>
          </Stack>

          <Box
            sx={{
              borderRadius: 2,
              border: (theme) => `dashed 1px ${theme.palette.divider}`,
            }}
          >
            {plans.map(
              (tab) =>
                tab.license === currentTab && (
                  <PlanCard
                    key={tab.license}
                    plan={tab}
                    sx={{
                      borderLeft: (theme) => `dashed 1px ${theme.palette.divider}`,
                    }}
                  />
                )
            )}
          </Box>
        </>
      )}
    </>
  );

  return (
    <Box
      sx={{
        py: { xs: 10, md: 15 },
        bgcolor: (theme) => alpha(theme.palette.grey[500], 0.04),
      }}
    >
      <Container component={MotionViewport}>
        {renderDescription}

        {renderContent}
      </Container>
    </Box>
  );
}

// ----------------------------------------------------------------------

function PlanCard({ plan, sx, ...other }) {
  const { license, commons, options } = plan;

  const standardLicense = license === 'Standard';

  const plusLicense = license === 'Standard Plus';

  return (
    <Stack
      spacing={5}
      sx={{
        p: 5,
        pt: 10,
        ...(plusLicense && {
          borderLeft: (theme) => `dashed 1px ${theme.palette.divider}`,
          borderRight: (theme) => `dashed 1px ${theme.palette.divider}`,
          ...sx,
        }),
      }}
      {...other}
    >
      <Stack spacing={2}>
        <Typography variant="overline" component="div" sx={{ color: 'text.disabled' }}>
          License
        </Typography>

        <Box sx={{ position: 'relative' }}>
          <Typography variant="h4">{license}</Typography>
          <Box
            sx={{
              left: 0,
              bottom: 4,
              width: 40,
              height: 8,
              opacity: 0.48,
              bgcolor: 'error.main',
              position: 'absolute',
              ...(standardLicense && { bgcolor: 'primary.main' }),
              ...(plusLicense && { bgcolor: 'warning.main' }),
            }}
          />
        </Box>
      </Stack>

      <Stack spacing={2.5}>
        {commons.map((option) => (
          <Stack key={option} spacing={1} direction="row" alignItems="center">
            <Iconify icon="eva:checkmark-fill" width={16} />
            <Typography variant="body2">{option}</Typography>
          </Stack>
        ))}

        <Divider sx={{ borderStyle: 'dashed' }} />

        {options.map((option, optionIndex) => {
          const disabled =
            (standardLicense && optionIndex === 0) ||
            (standardLicense && optionIndex === 1)
          return (
            <Stack
              spacing={1}
              direction="row"
              alignItems="center"
              sx={{
                ...(disabled && { color: 'text.disabled' }),
              }}
              key={option}
            >
              <Iconify icon={disabled ? 'mingcute:close-line' : 'eva:checkmark-fill'} width={16} />
              <Typography variant="body2">{option}</Typography>
            </Stack>
          );
        })}
      </Stack>

      <Stack alignItems="flex-end">
        <Button
          color="inherit"
          size="small"
          target="_blank"
          rel="noopener"
          href={paths.minimalUI}
          endIcon={<Iconify icon="eva:arrow-ios-forward-fill" />}
        >
          Learn more
        </Button>
      </Stack>
    </Stack>
  );
}

PlanCard.propTypes = {
  plan: PropTypes.object,
  sx: PropTypes.object,
};
