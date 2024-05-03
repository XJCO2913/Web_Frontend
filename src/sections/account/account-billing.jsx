import PropTypes from 'prop-types';

import Grid from '@mui/material/Unstable_Grid2';

import AccountBillingPlan from './account-billing-plan';
import AccountBillingPayment from './account-billing-payment';

// ----------------------------------------------------------------------

export default function AccountBilling({ cards, plans }) {
  return (
    <Grid container spacing={5} disableEqualOverflow>
      <Grid xs={12} md={12} lg={12}>
        <AccountBillingPlan plans={plans} cardList={cards} />
        <AccountBillingPayment cards={cards} />
      </Grid>
    </Grid>
  );
}

AccountBilling.propTypes = {
  cards: PropTypes.array,
  plans: PropTypes.array,
};
