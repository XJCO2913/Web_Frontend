import PropTypes from 'prop-types';
import { useState, useCallback } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Unstable_Grid2';
import CardHeader from '@mui/material/CardHeader';
import Popover from '@mui/material/Popover';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';

import { PlanStarterIcon, PlanPremiumIcon } from 'src/assets/icons';
import Label from 'src/components/label';
import Iconify from 'src/components/iconify';
import { useAuthContext } from 'src/auth/hooks';
import axiosInstance, { axiosTest } from 'src/utils/axios';
import { endpoints } from 'src/api/index';
import { useSnackbar } from 'src/components/snackbar';

export default function AccountorganizerPlan({ plans }) {
  const { enqueueSnackbar } = useSnackbar();
  const { user, updateToken, updateUser } = useAuthContext();
  const [organizer, setorganizer] = useState(user?.isOrganiser ? 1 : 0);
  const [selectedPlan, setSelectedPlan] = useState(plans[organizer]?.subscription || 'member');
  const isBasicPlan = selectedPlan === 'member';
  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;

  const handleSelectPlan = useCallback(
    (newValue) => {
      if (selectedPlan !== newValue) {
        setSelectedPlan(newValue);
      }
    },
    [selectedPlan]
  );

  const upgradePlan = useCallback(async () => {
    const targetType = plans.findIndex(plan => plan.subscription === selectedPlan);
    console.log(organizer);
    console.log(targetType);

    if (targetType === organizer) {
      enqueueSnackbar("Your are already an organizer.", { variant: "info" });
      return;
    }

    if (user?.membershipType === 0) {
      enqueueSnackbar("Please open the membership first.", { variant: "warning" });
      return;
    }

    try {
      const res = await axiosTest.post(endpoints.user.applyOrg);
      if (res.data.status_code === 0) {
        await axiosInstance.post(endpoints.user.refreshToken);
        enqueueSnackbar("Apply successfully! Waiting for admin's approval.", { variant: "success" });
      } else {
        enqueueSnackbar("Failed to apply: " + res.data.message, { variant: "error" });
      }
    } catch (error) {
      console.log(error);
      enqueueSnackbar("Apply failed!", { variant: "error" });
    }
  }, [selectedPlan, user, updateToken, enqueueSnackbar, updateUser]);

  const renderPlans = plans.map((plan, index) => (
    <Grid xs={12} md={4} key={plan.subscription}>
      <Stack
        component={Paper}
        variant="outlined"
        onClick={() => handleSelectPlan(plan.subscription)}
        sx={{
          p: 2.5,
          position: 'relative',
          cursor: 'pointer',
          ...(plan.subscription === selectedPlan && {
            boxShadow: (theme) => `0 0 0 2px ${theme.palette.text.primary}`,
          }),
        }}
      >
        {organizer === index && (
          <Label
            color="info"
            startIcon={<Iconify icon="eva:star-fill" />}
            sx={{ position: 'absolute', top: 8, right: 8 }}
          >
            Current
          </Label>
        )}

        <Box sx={{ width: 48, height: 48 }}>
          {plan.subscription === 'member' && <PlanStarterIcon />}
          {plan.subscription === 'Organizer' && <PlanPremiumIcon />}
        </Box>

        <Box
          sx={{
            typography: 'subtitle2',
            mt: 2,
            mb: 0.5,
            textTransform: 'capitalize',
          }}
        >
          {plan.subscription}
        </Box>
      </Stack>
    </Grid>
  ));

  return (
    <>
      <Card>
        <Box display="flex" alignItems="center">
          <CardHeader title="Apply to an organizer" />
          <IconButton
            aria-describedby={id}
            onClick={handleClick}
            sx={{
              width: 24,
              height: 24,
              overflow: 'hidden',
              border: '1px solid #ccc',
              color: "#ccc",
              padding: 1,
              mt: 3,
              fontSize: 15,
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            ?
          </IconButton>

          <Popover
            id={id}
            open={open}
            anchorEl={anchorEl}
            onClose={handleClose}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'center',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'center',
            }}
          >
            <Typography sx={{ p: 1, borderRadius: '50%', display: 'flex', height: 150, width: 300, fontSize: 12, }}>
              Rules about organizer:<br />
              1. If you want to be an organizer, you have to be a member.<br />
              2. Organizer permissions will expire simultaneously when the member expires!
            </Typography>
          </Popover>
        </Box>

        <Grid container spacing={2} sx={{ p: 3 }}>
          {renderPlans}
        </Grid>

        <Stack spacing={2} sx={{ p: 3, pt: 0, typography: 'body2' }}>
          <Grid container spacing={{ xs: 0.5, md: 2 }}>
            <Grid xs={12} md={4} sx={{ color: 'text.secondary' }}>
              Account Type
            </Grid>
            <Grid xs={12} md={8} sx={{ typography: 'subtitle2', textTransform: 'capitalize' }}>
              {selectedPlan || '-'}
            </Grid>
          </Grid>

          <Grid container spacing={{ xs: 0.5, md: 2 }}>
            <Grid xs={12} md={4} sx={{ color: 'text.secondary' }}>
              Username
            </Grid>
            <Grid xs={12} md={8}>
              {user?.username}
            </Grid>
          </Grid>
        </Stack>

        <Divider sx={{ borderStyle: 'dashed' }} />

        <Stack spacing={1.5} direction="row" justifyContent="flex-end" sx={{ p: 3 }}>
          <Button variant="contained" onClick={upgradePlan} disabled={isBasicPlan}>Apply</Button>
        </Stack>
      </Card>
    </>
  );
}

AccountorganizerPlan.propTypes = {
  plans: PropTypes.array,
};
