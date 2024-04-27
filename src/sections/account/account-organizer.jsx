import PropTypes from 'prop-types';

import Grid from '@mui/material/Unstable_Grid2';

import AccountOrganizerPlan from './account-organizer-plan';

// ----------------------------------------------------------------------

export default function AccountOrganizer({ plans }) {
  return (
    <Grid container spacing={5} disableEqualOverflow>
      <Grid xs={12} md={12} lg={12}>
        <AccountOrganizerPlan plans={plans}/>
      </Grid>
    </Grid>
  );
}

AccountOrganizer.propTypes = {
  plans: PropTypes.array,
};
