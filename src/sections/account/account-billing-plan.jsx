import PropTypes from 'prop-types';
import { useState, useCallback, useEffect } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Unstable_Grid2';
import CardHeader from '@mui/material/CardHeader';

import { useBoolean } from 'src/hooks/use-boolean';
import { PlanFreeIcon, PlanStarterIcon, PlanPremiumIcon } from 'src/assets/icons';
import Label from 'src/components/label';
import Iconify from 'src/components/iconify';
import { useAuthContext } from 'src/auth/hooks';
import { jwtDecode } from "src/auth/context/jwt/utils";
import axiosInstance from 'src/utils/axios';
import { endpoints } from 'src/api/index';
import { useSnackbar } from 'src/components/snackbar';

import PaymentCardListDialog from '../payment/payment-card-list-dialog';

export default function AccountBillingPlan({ cardList, plans }) {
  const openCards = useBoolean();
  const { enqueueSnackbar } = useSnackbar();
  const { user, updateToken } = useAuthContext();
  const [decodedToken, setDecodedToken] = useState(() => {
    try {
      return user?.token ? jwtDecode(user.token) : null;
    } catch {
      return null;
    }
  });
  const [membershipType, setMembershipType] = useState(decodedToken?.membershipType);
  
  useEffect(() => {
    const newDecodedToken = jwtDecode(user?.token);
    setDecodedToken(newDecodedToken);
    setMembershipType(newDecodedToken.membershipType);
  }, [user?.token]);

  const primaryCard = cardList.filter((card) => card.primary)[0];
  const [selectedCard, setSelectedCard] = useState(primaryCard);
  const [selectedPlan, setSelectedPlan] = useState(plans[membershipType]?.subscription || 'basic');
  const isBasicPlan = selectedPlan === 'basic';

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
    if (user?.isSubscribed === 1 && targetType !== currentType) {
      enqueueSnackbar("Please cancel your current plan before changing to a new plan.", { variant: "warning" });
      return;
    }

    try {
      const res = await axiosInstance.post(`${endpoints.user.subscribe}?userID=${user.userId}&membershipType=${targetType}`);
      if (res.data.status_code === 0) {
        const resToken = await axiosInstance.post(endpoints.user.refreshToken);
        updateToken(resToken.data.Data.newToken);
        enqueueSnackbar("Upgrade plan successfully!", { variant: "success" });
      } else {
        enqueueSnackbar("Failed to upgrade plan: " + res.data.message, { variant: "error" });
      }
    } catch (error) {
      enqueueSnackbar("Upgrade plan failed!", { variant: "error" });
    }
  }, [selectedPlan, membershipType, plans, user, updateToken, enqueueSnackbar]);


  const cancelPlan = useCallback(async () => {
    try {
      const res = await axiosInstance.post(`${endpoints.user.cancelSubscribe}?userID=${user?.userId}`);
      if (res.data.status_code === 0) {
        enqueueSnackbar("Cancel plan successfully!.", { variant: "success" });
      }
    } catch (error) {
      enqueueSnackbar("Cancel plan failed!", { variant: "error" });
    }
  }, [user?.userId, enqueueSnackbar]);

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
        <CardHeader title="Plan" />

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
