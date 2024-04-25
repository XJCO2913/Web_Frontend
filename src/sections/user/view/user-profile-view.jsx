import { useState, useCallback, useEffect } from 'react';

import Tab from '@mui/material/Tab';
import Card from '@mui/material/Card';
import Container from '@mui/material/Container';
import Tabs, { tabsClasses } from '@mui/material/Tabs';

import { paths } from 'src/routes/paths';

import { useAuthContext } from 'src/auth/hooks';

import { _userAbout, _userFeeds, _userFriends, _userGallery, _userFollowers } from 'src/_mock';

import Iconify from 'src/components/iconify';
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';

import ProfileHome from '../profile-home';
import ProfileCover from '../profile-cover';
import ProfileFriends from '../profile-friends';
import ProfileGallery from '../profile-gallery';
import ProfileFollowers from '../profile-followers';
import { axiosSimple } from '@/utils/axios';
import { endpoints } from '@/api';
import { jwtDecode } from '@/auth/context/jwt/utils';
import { useSnackbar } from 'notistack';
import { useWebSocketManager } from '@/websocket/context/websocket_provider';

// ----------------------------------------------------------------------

const TABS = [
  {
    value: 'profile',
    label: 'Profile',
    icon: <Iconify icon="solar:user-id-bold" width={24} />,
  },
  {
    value: 'followers',
    label: 'Followers',
    icon: <Iconify icon="solar:heart-bold" width={24} />,
  },
  {
    value: 'friends',
    label: 'Friends',
    icon: <Iconify icon="solar:users-group-rounded-bold" width={24} />,
  },
  {
    value: 'activities',
    label: 'Activities',
    icon: <Iconify icon="solar:flag-bold-duotone" width={24} />,
  },
];

// ----------------------------------------------------------------------

export default function UserProfileView() {
  const settings = useSettingsContext();

  const {enqueueSnakebar} = useSnackbar()

  const { user } = useAuthContext();

  const [searchFriends, setSearchFriends] = useState('');

  const [currentTab, setCurrentTab] = useState('profile');

  const [joinedActivities, setJoinedActivities] = useState([])

  const handleChangeTab = useCallback((event, newValue) => {
    setCurrentTab(newValue);
  }, []);

  const handleSearchFriends = useCallback((event) => {
    setSearchFriends(event.target.value);
  }, []);

  const fetchMyActivities = async() => {
    try {
      // prepare for request
      const token = sessionStorage.getItem('token')
      const decodedToken = jwtDecode(token)
      const userID = decodedToken.userID
      const httpConfig = {
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      }

      const resp = await axiosSimple.get(endpoints.activity.me.all + '?userID=' + userID, httpConfig)
      if (resp.data.status_code === 0) {
        setJoinedActivities(resp.data.Data)
      } else {
        enqueueSnakebar(resp.data.status_msg, {variant: "error"})
      }
    } catch(err) {
      enqueueSnakebar(err.toString(), {variant: "error"})
    }
  }

  useEffect(() => {
    fetchMyActivities()
  }, [])

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading="Profile"
        links={[
          { name: 'Home', href: paths.home.root },
          { name: 'User', href: paths.home.user.root },
          { name: user?.username },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <Card
        sx={{
          mb: 3,
          height: 290,
        }}
      >
        <ProfileCover
          role={_userAbout.role}
          name={user?.username}
          avatarUrl={user?.avatarUrl}
          coverUrl={_userAbout.coverUrl}
        />

        <Tabs
          value={currentTab}
          onChange={handleChangeTab}
          sx={{
            width: 1,
            bottom: 0,
            zIndex: 9,
            position: 'absolute',
            bgcolor: 'background.paper',
            [`& .${tabsClasses.flexContainer}`]: {
              pr: { md: 3 },
              justifyContent: {
                sm: 'center',
                md: 'flex-end',
              },
            },
          }}
        >
          {TABS.map((tab) => (
            <Tab key={tab.value} value={tab.value} icon={tab.icon} label={tab.label} />
          ))}
        </Tabs>
      </Card>

      {currentTab === 'profile' && <ProfileHome info={_userAbout} posts={_userFeeds} />}

      {currentTab === 'followers' && <ProfileFollowers followers={_userFollowers} />}

      {currentTab === 'friends' && (
        <ProfileFriends
          friends={_userFriends}
          searchFriends={searchFriends}
          onSearchFriends={handleSearchFriends}
        />
      )}

      {currentTab === 'activities' && <ProfileGallery gallery={joinedActivities} />}
    </Container>
  );
}
