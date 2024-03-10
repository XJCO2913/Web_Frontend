import PropTypes from 'prop-types';

import Button from '@mui/material/Button';

import { RouterLink } from 'src/routes/components';

import { paths } from 'src/routes/paths';

// ----------------------------------------------------------------------

export default function LoginButton({ sx }) {
  return (
    <Button component={RouterLink} href={paths.login} variant="outlined" sx={{ mr: 1, ...sx }}>
      Login
    </Button>
  );
}

LoginButton.propTypes = {
  sx: PropTypes.object,
};
