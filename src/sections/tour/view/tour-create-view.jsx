import Container from '@mui/material/Container';

import { paths } from 'src/routes/paths';

import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';

import TourNewEditForm from '../tour-new-edit-form';

// ----------------------------------------------------------------------

export default function TourCreateView() {
  const settings = useSettingsContext();

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading="Create a new activity"
        links={[
          {
            name: 'Home',
            href: paths.home.root,
          },
          {
            name: 'Activity',
            href: paths.home.tour.root,
          },
          { name: 'New activity' },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <TourNewEditForm />
    </Container>
  );
}
