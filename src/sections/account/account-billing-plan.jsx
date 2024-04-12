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

import { useBoolean } from 'src/hooks/use-boolean';
import { PlanFreeIcon, PlanStarterIcon, PlanPremiumIcon } from 'src/assets/icons';
import Label from 'src/components/label';
import Iconify from 'src/components/iconify';
import { useAuthContext } from 'src/auth/hooks';
import axiosInstance from 'src/utils/axios';
import { endpoints } from 'src/api/index';
import { useSnackbar } from 'src/components/snackbar';

import PaymentCardListDialog from '../payment/payment-card-list-dialog';

// ----------------------------------------------------------------------

export default function AccountBillingPlan({ cardList, plans }) {
  const openCards = useBoolean();
  const { user } = useAuthContext();
  const { enqueueSnackbar } = useSnackbar();
  const { isSubscribed, membershipType, userId } = user;

  const primaryCard = cardList.filter((card) => card.primary)[0];
  const [selectedCard, setSelectedCard] = useState(primaryCard);
  const [selectedPlan, setSelectedPlan] = useState(plans[isSubscribed ? membershipType : 0].subscription);

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
    const type = plans.findIndex(plan => plan.subscription === selectedPlan);
    // 检查如果用户的当前等级是free（假设membershipType为0对应的是free）
    if (membershipType === 0) {
      enqueueSnackbar("Upgrade from Free plan is not allowed directly. Please choose another plan.", { variant: "warning" });
      return;
    }
    try {
      await axiosInstance.post(`${endpoints.user.subscribe}?userID=${userId}&membershipType=${type}`);
      enqueueSnackbar("Upgrade plan successfully!", { variant: "success" });
    } catch (error) {
      enqueueSnackbar("Upgrade plan failed!", { variant: "error" });
    }
  }, [selectedPlan, userId, plans, membershipType]);


  // const cancelPlan = useCallback(async () => {
  //   try {
  //     const res = await axiosInstance.post(`${endpoints.user.cancelSubscribe}?userID=${userId}`);

  //     setSelectedPlan(plans[0].subsubscriptionscri)
  //   } catch (error) {

  //   }
  // }, [userId])

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
              <Button
                endIcon={<Iconify width={16} icon="eva:arrow-ios-downward-fill" />}
                sx={{ typography: 'subtitle2', p: 0, borderRadius: 0 }}
              >
                {user.username}
              </Button>
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
          <Button variant="outlined" onClick={cancelPlan}>Cancel Plan</Button>
          <Button variant="contained" onClick={upgradePlan}>Upgrade Plan</Button>
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
