import { useState, useCallback } from 'react';

import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Container from '@mui/material/Container';

import { paths } from 'src/routes/paths';

import Iconify from 'src/components/iconify';
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';

import AccountGeneral from '../account-general';
import AccountBilling from '../account-billing';
import AccountOrganizer from '../account-organizer';

// ----------------------------------------------------------------------

const TABS = [
  {
    value: 'general',
    label: 'General',
    icon: <Iconify icon="solar:user-id-bold" width={24} />,
  },
  {
    value: 'billing',
    label: 'Billing',
    icon: <Iconify icon="solar:bill-list-bold" width={24} />,
  },
  {
    value: 'organizer',
    label: 'Organizer',
    icon: <Iconify icon="wpf:administrator" width={24} />,
  }
];

const userPlans = [
  {
    subscription: 'basic',
    price: 0,
  },
  {
    subscription: 'starter',
    price: 4.99,
  },
  {
    subscription: 'premium',
    price: 9.99,
  },
];

const organizerPlans = [
  {
    subscription: 'member',
    price: 0,
  },
  {
    subscription: 'Organizer',
    price: 4.99,
  },
];

function generateId(index) {
  return new Date().getTime() + index;  // Combines current timestamp with index
}

const userPayment = [...Array(3)].map((_, index) => ({
  id: generateId(index),
  cardNumber: ['**** **** **** 8576', '**** **** **** 8823', '**** **** **** 1268'][index],
  cardType: ['mastercard', 'visa', 'visa'][index],
  primary: index === 1,
}));

// ----------------------------------------------------------------------

export default function AccountView() {
  const settings = useSettingsContext();

  const [currentTab, setCurrentTab] = useState('general');

  const handleChangeTab = useCallback((event, newValue) => {
    setCurrentTab(newValue);
  }, []);

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading="Account"
        links={[
          { name: 'Home', href: paths.home.root },
          { name: 'User', href: paths.home.user.root },
          { name: 'Account' },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <Tabs
        value={currentTab}
        onChange={handleChangeTab}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      >
        {TABS.map((tab) => (
          <Tab key={tab.value} label={tab.label} icon={tab.icon} value={tab.value} />
        ))}
      </Tabs>

      {currentTab === 'general' && <AccountGeneral />}

      {currentTab === 'billing' && (
        <AccountBilling
          plans={userPlans}
          cards={userPayment}
        />
      )}

      {currentTab === 'organizer' && (
        <AccountOrganizer
          plans={organizerPlans}
        />
      )}
    </Container>
  );
}
