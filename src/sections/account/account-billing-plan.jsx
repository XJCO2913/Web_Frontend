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

import { useBoolean } from 'src/hooks/use-boolean';
import { PlanFreeIcon, PlanStarterIcon, PlanPremiumIcon } from 'src/assets/icons';
import Label from 'src/components/label';
import Iconify from 'src/components/iconify';
import { useAuthContext } from 'src/auth/hooks';
import axiosInstance, { axiosTest } from 'src/utils/axios';
import { endpoints } from 'src/api/index';
import { useSnackbar } from 'src/components/snackbar';

import PaymentCardListDialog from '../payment/payment-card-list-dialog';

export default function AccountBillingPlan({ cardList, plans }) {
  const openCards = useBoolean();
  const { enqueueSnackbar } = useSnackbar();
  const { user, updateToken, updateUser } = useAuthContext();
  const [membershipType, setMembershipType] = useState(user?.membershipType);

  const primaryCard = cardList.filter((card) => card.primary)[0];
  const [selectedCard, setSelectedCard] = useState(primaryCard);
  const [selectedPlan, setSelectedPlan] = useState(plans[membershipType]?.subscription || 'basic');
  const isBasicPlan = selectedPlan === 'basic';

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

  const handleSelectCard = useCallback((newValue) => {
    setSelectedCard(newValue);
  }, []);

  const upgradePlan = useCallback(async () => {
    const targetType = plans.findIndex(plan => plan.subscription === selectedPlan);
    const currentType = membershipType;

    // 如果用户尝试选择当前已订阅的计划
    if (targetType === currentType) {
      enqueueSnackbar("Your plan will automatically renew each month.", { variant: "info" });
      return;
    }

    // 如果用户已经订阅并且没有取消当前计划，则不允许升级或更换计划
    if (membershipType !== 0) {
      enqueueSnackbar("Please cancel your current plan before changing to a new plan.", { variant: "warning" });
      return;
    }

    try {
      const res = await axiosTest.post(`${endpoints.user.subscribe}?userID=${user.userId}&membershipType=${targetType}`);

      if (res.data.status_code === 0) {
        const resToken = await axiosInstance.post(endpoints.user.refreshToken);
        updateToken(resToken.data.Data.newToken);
        setMembershipType(targetType);
        updateUser({ membershipType: targetType });
        enqueueSnackbar("Upgrade plan successfully!", { variant: "success" });
      } else {
        enqueueSnackbar("Failed to upgrade plan: " + res.data.message, { variant: "error" });
      }
    } catch (error) {
      console.log(error);
      enqueueSnackbar("Upgrade plan failed!", { variant: "error" });
    }
  }, [selectedPlan, membershipType, plans, user, updateToken, enqueueSnackbar, updateUser]);

  const cancelPlan = useCallback(async () => {
    try {
      const res = await axiosTest.post(`${endpoints.user.cancelSubscribe}?userID=${user?.userId}`);
      const resToken = await axiosInstance.post(endpoints.user.refreshToken);
      updateToken(resToken.data.Data.newToken);
      setMembershipType(0)
      updateUser({ membershipType: 0 });
      if (res.data.status_code === 0) {
        enqueueSnackbar("Cancel plan successfully!", { variant: "success" });
      }
      else {
        enqueueSnackbar("Failed to cancel plan: " + res.data.message, { variant: "error" });
      }
    } catch (error) {
      enqueueSnackbar("Failed to cancel plan since you have expired the cancellation period!", { variant: "error" });
    }
  }, [user?.userId, enqueueSnackbar, updateToken, updateUser]);

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
        {membershipType === index && (
          <Label
            color="info"
            startIcon={<Iconify icon="eva:star-fill" />}
            sx={{ position: 'absolute', top: 8, right: 8 }}
          >
            Current
          </Label>
        )}

        <Box sx={{ width: 48, height: 48 }}>
          {plan.subscription === 'basic' && <PlanFreeIcon />}
          {plan.subscription === 'starter' && <PlanStarterIcon />}
          {plan.subscription === 'premium' && <PlanPremiumIcon />}
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

        <Stack direction="row" alignItems="center" sx={{ typography: 'h4' }}>
          {plan.price || 'Free'}
          {!!plan.price && (
            <Box component="span" sx={{ typography: 'body2', color: 'text.disabled', ml: 0.5 }}>
              /mo
            </Box>
          )}
        </Stack>
      </Stack>
    </Grid>
  ));

  return (
    <>
      <Card>
        <Box display="flex" alignItems="center">
          <CardHeader title="Plan" />
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
              Rules about Membership:<br />
              1. Once you have subscribed you have a 7 day cooling off period to cancel your subscription, after 7 days from the start of your subscription you cannot cancel it.<br />
              2. If you want to change your membership level, please cancel within 7 days and re-subscribe!
            </Typography>
          </Popover>
        </Box>

        <Grid container spacing={2} sx={{ p: 3 }}>
          {renderPlans}
        </Grid>

        <Stack spacing={2} sx={{ p: 3, pt: 0, typography: 'body2' }}>
          <Grid container spacing={{ xs: 0.5, md: 2 }}>
            <Grid xs={12} md={4} sx={{ color: 'text.secondary' }}>
              Plan
            </Grid>
            <Grid xs={12} md={8} sx={{ typography: 'subtitle2', textTransform: 'capitalize' }}>
              {selectedPlan || '-'}
            </Grid>
          </Grid>

          <Grid container spacing={{ xs: 0.5, md: 2 }}>
            <Grid xs={12} md={4} sx={{ color: 'text.secondary' }}>
              Billing name
            </Grid>
            <Grid xs={12} md={8}>
              {user?.username}
            </Grid>
          </Grid>

          <Grid container spacing={{ xs: 0.5, md: 2 }}>
            <Grid xs={12} md={4} sx={{ color: 'text.secondary' }}>
              Payment method
            </Grid>
            <Grid xs={12} md={8}>
              <Button
                onClick={openCards.onTrue}
                endIcon={<Iconify width={16} icon="eva:arrow-ios-downward-fill" />}
                sx={{ typography: 'subtitle2', p: 0, borderRadius: 0 }}
              >
                {selectedCard?.cardNumber}
              </Button>
            </Grid>
          </Grid>
        </Stack>

        <Divider sx={{ borderStyle: 'dashed' }} />

        <Stack spacing={1.5} direction="row" justifyContent="flex-end" sx={{ p: 3 }}>
          <Button variant="outlined" onClick={cancelPlan} disabled={isBasicPlan}>Cancel Plan</Button>
          <Button variant="contained" onClick={upgradePlan} disabled={isBasicPlan}>Upgrade Plan</Button>
        </Stack>
      </Card>

      <PaymentCardListDialog
        list={cardList}
        open={openCards.value}
        onClose={openCards.onFalse}
        selected={(selectedId) => selectedCard?.id === selectedId}
        onSelect={handleSelectCard}
      />
    </>
  );
}

AccountBillingPlan.propTypes = {
  addressBook: PropTypes.array,
  cardList: PropTypes.array,
  plans: PropTypes.array,
};
