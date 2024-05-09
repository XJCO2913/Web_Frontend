import { m } from 'framer-motion';
import { useState, useCallback, useEffect } from 'react';

import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import List from '@mui/material/List';
import Stack from '@mui/material/Stack';
import Badge from '@mui/material/Badge';
import Drawer from '@mui/material/Drawer';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';

import { useBoolean } from 'src/hooks/use-boolean';
import { useResponsive } from 'src/hooks/use-responsive';

import { _notifications } from 'src/_mock';

import Label from 'src/components/label';
import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';
import { varHover } from 'src/components/animate';
import { axiosTest } from 'src/utils/axios';
import { endpoints } from 'src/api';

import NotificationItem from './notification-item';

// ----------------------------------------------------------------------

const TABS = [
  {
    value: 'all',
    label: 'All',
    count: 22,
  },
  {
    value: 'route',
    label: 'Route',
    count: 12,
  },
  {
    value: 'application',
    label: 'Application',
    count: 10,
  },
];

// ----------------------------------------------------------------------

const notifications = [...Array(9)].map((_, index) => ({
  // id: _mock.id(index),
  avatarUrl: [
    // _mock.image.avatar(1),
    // _mock.image.avatar(2),
    // _mock.image.avatar(3),
    // _mock.image.avatar(4),
    // _mock.image.avatar(5),
    null,
    null,
    null,
    null,
    null,
  ][index],
  type: ['route', 'application'][
    index
  ],
  // createdAt: _mock.time(index),
  title:
    (index === 0 && `<p><strong>Deja Brady</strong> sent you a friend request</p>`) ||
    (index === 1 &&
      `<p><strong>Jayvon Hull</strong> mentioned you in <strong><a href='#'>Minimal UI</a></strong></p>`) ||
    (index === 2 &&
      `<p><strong>Lainey Davidson</strong> added file to <strong><a href='#'>File Manager</a></strong></p>`) ||
    (index === 3 &&
      `<p><strong>Angelique Morse</strong> added new tags to <strong><a href='#'>File Manager<a/></strong></p>`) ||
    (index === 4 &&
      `<p><strong>Giana Brandt</strong> request a payment of <strong>$200</strong></p>`) ||
    (index === 5 && `<p>Your order is placed waiting for shipping</p>`) ||
    (index === 6 && `<p>Delivery processing your order is being shipped</p>`) ||
    (index === 7 && `<p>You have new message 5 unread messages</p>`) ||
    (index === 8 && `<p>You have new mail`) ||
    '',
}));

// ----------------------------------------------------------------------

export default function NotificationsPopover() {
  const drawer = useBoolean();

  const smUp = useResponsive('up', 'sm');

  const [currentTab, setCurrentTab] = useState('all');

  const handleChangeTab = useCallback((event, newValue) => {
    setCurrentTab(newValue);
  }, []);

  const [notifications, setNotifications] = useState([]);

  // const totalUnRead = notifications.filter((item) => item.isUnRead === true).length;

  const fetchNotify = async () => {
    try {
      const response = await axiosTest.get(endpoints.user.notify); // Adjust the URL to your actual API endpoint
      const now = new Date();

      const formattedData = response.data.Data.map(notification => {
        // Calculate time difference in seconds and convert to human-readable format
        const createdAt = new Date(notification.createdAt);
        const secondsAgo = Math.floor((now - createdAt) / 1000);
        let timeString = secondsAgo + " seconds ago";
        if (secondsAgo > 60) {
          const minutesAgo = Math.floor(secondsAgo / 60);
          timeString = minutesAgo + " minutes ago";
          if (minutesAgo > 60) {
            const hoursAgo = Math.floor(minutesAgo / 60);
            timeString = hoursAgo + " hours ago";
            if (hoursAgo > 24) {
              const daysAgo = Math.floor(hoursAgo / 24);
              timeString = daysAgo + " days ago";
            }
          }
        }

        let title = '';
        if (notification.type === 1) {
          title = `${notification.sender.username} shared a map data with you`;
        } else if (notification.type === 2) {
          const action = notification.route.includes("denied") ? "denied" : "approved"; // Check the route for determining the action
          title = `You've been ${action} as an organizer`;
        }

        console.log({
          avatarUrl: notification.sender.avatarUrl,
          type: notification.type === 1 ? 'application' : 'route',
          createdAt: timeString,
          title: title
        })

        return {
          id: notification.notificationId,
          avatarUrl: notification.sender.avatarUrl,
          type: notification.type === 1 ? 'application' : 'route',
          createdAt: timeString,
          title: title
        };
      });

      setNotifications(formattedData);  // Assuming you have a state or a way to store the notifications in your frontend
    } catch (error) {
      console.error('Error fetching notifications:', error.response || error);
    }
  }

  useEffect(() => {
    fetchNotify()
  }, [])

  const renderHead = (
    <Stack direction="row" alignItems="center" sx={{ py: 2, pl: 2.5, pr: 1, minHeight: 68 }}>
      <Typography variant="h6" sx={{ flexGrow: 1 }}>
        Notifications
      </Typography>

      {!smUp && (
        <IconButton onClick={drawer.onFalse}>
          <Iconify icon="mingcute:close-line" />
        </IconButton>
      )}
    </Stack>
  );

  const renderTabs = (
    <Tabs value={currentTab} onChange={handleChangeTab}>
      {TABS.map((tab) => (
        <Tab
          key={tab.value}
          iconPosition="end"
          value={tab.value}
          label={tab.label}
          icon={
            <Label
              variant={((tab.value === 'all' || tab.value === currentTab) && 'filled') || 'soft'}
              color={
                (tab.value === 'route' && 'info') ||
                (tab.value === 'application' && 'success') ||
                'default'
              }
            >
              {tab.count}
            </Label>
          }
          sx={{
            '&:not(:last-of-type)': {
              mr: 3,
            },
          }}
        />
      ))}
    </Tabs>
  );

  const renderList = (
    <Scrollbar>
      <List disablePadding>
        {notifications.map((notification) => (
          <NotificationItem key={notification.id} notification={notification} />
        ))}
      </List>
    </Scrollbar>
  );

  return (
    <>
      <IconButton
        component={m.button}
        whileTap="tap"
        whileHover="hover"
        variants={varHover(1.05)}
        color={drawer.value ? 'primary' : 'default'}
        onClick={drawer.onTrue}
      >
        <Badge badgeContent={3} color="error">
          <Iconify icon="solar:bell-bing-bold-duotone" width={24} />
        </Badge>
      </IconButton>

      <Drawer
        open={drawer.value}
        onClose={drawer.onFalse}
        anchor="right"
        slotProps={{
          backdrop: { invisible: true },
        }}
        PaperProps={{
          sx: { width: 1, maxWidth: 420 },
        }}
      >
        {renderHead}

        <Divider />

        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          sx={{ pl: 2.5, pr: 1 }}
        >
          {renderTabs}
        </Stack>

        <Divider />

        {renderList}
      </Drawer>
    </>
  );
}
