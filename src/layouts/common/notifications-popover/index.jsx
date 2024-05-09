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
import Label from 'src/components/label';
import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';
import { varHover } from 'src/components/animate';
import { axiosTest } from 'src/utils/axios';
import { endpoints } from 'src/api';

import NotificationItem from './notification-item';
import { useAuthContext } from 'src/auth/hooks';

// ----------------------------------------------------------------------

export default function NotificationsPopover() {
  const drawer = useBoolean();

  const smUp = useResponsive('up', 'sm');

  const [currentTab, setCurrentTab] = useState('all');

  const handleChangeTab = useCallback((event, newValue) => {
    setCurrentTab(newValue);
  }, []);
  const { user } = useAuthContext()

  const [notifications, setNotifications] = useState([]);
  const [totalMsgNum, setTotalMsgNum] = useState(0);
  const [totalRut, setTotalRut] = useState(0);
  const [totalApl, setTotalApl] = useState(0);

  const TABS = [
    {
      value: 'all',
      label: 'All',
      count: totalMsgNum,
    },
    {
      value: 'route',
      label: 'Route',
      count: totalRut,
    },
    {
      value: 'application',
      label: 'Application',
      count: totalApl,
    },
  ];

  const fetchNotify = async () => {
    try {
      const response = await axiosTest.get(endpoints.user.notify); // Adjust the URL to your actual API endpoint
      // Check if there are any notifications
      if (response.data.Data.length === 0) {
        setTotalMsgNum(0);
        setTotalApl(0);
        setTotalRut(0);
        return null; // Return null if no notifications
      }

      const now = new Date();
      const formattedData = response.data.Data.map(notification => {
        console.log(notification)
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
        if (notification.type == 1) {
          const action = notification.orgResult ? "approved" : "denied";
          title = `<p><strong>Admin</strong><br/> You've been ${action} as an organizer!`;
        } else if (notification.type == 2) {
          title = `<p><strong>${notification.sender.username}</strong> shared a route with you`;
        }

        return {
          id: notification.notificationId,
          avatarUrl: notification.sender.avatarUrl,
          type: notification.type == 1 ? 'application' : 'route',
          createdAt: timeString,
          title: title,
          route: notification.route
        };
      });

      setNotifications(formattedData);
      console.log(formattedData)
      setTotalMsgNum(formattedData.length);
      setTotalApl(formattedData.filter(notification => notification.type === "application").length);
      setTotalRut(formattedData.filter(notification => notification.type == "route").length);
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
        {notifications.filter(notification => {
          if (currentTab === 'all') return true; // 显示所有通知
          if (currentTab === 'route' && notification.type === 'route') return true; // 显示类型为 route 的通知
          if (currentTab === 'application' && notification.type === 'application') return true; // 显示类型为 application 的通知
          return false;
        }).map((notification) => (
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
        <Badge badgeContent={user?.newNotificationCnt} color="error">
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

        {notifications && notifications.length > 0 ? (
          renderList
        ) : (
          <Typography sx={{ display: 'flex', alignItems: 'center', height: '100%', justifyContent: 'center' }}>
            You do not have any notifications
          </Typography>
        )}
      </Drawer>
    </>
  );
}
