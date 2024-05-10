import { useState, useCallback, useEffect } from 'react';

import Tab from '@mui/material/Tab';
import Card from '@mui/material/Card';
import Container from '@mui/material/Container';
import Tabs, { tabsClasses } from '@mui/material/Tabs';

import { paths } from 'src/routes/paths';

import { useAuthContext } from 'src/auth/hooks';

import { _userAbout } from 'src/_mock';

import Iconify from 'src/components/iconify';
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';

import ProfileHome from '../profile-home';
import ProfileCover from '../profile-cover';
import ProfileFriends from '../profile-friends';
import ProfileGallery from '../profile-gallery';
import ProfileFollowers from '../profile-followers';
import { axiosSimple, axiosTest } from '@/utils/axios';
import { endpoints } from '@/api';
import { jwtDecode } from '@/auth/context/jwt/utils';
import { useSnackbar } from 'notistack';

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
  const { enqueueSnakebar } = useSnackbar()
  const { user } = useAuthContext();
  const [currentTab, setCurrentTab] = useState('profile');
  const [joinedActivities, setJoinedActivities] = useState([])
  const [follower, setFollower] = useState([]);
  const [friend, setFriend] = useState([]);
  const [moments, setMoments] = useState(null)

  const handleChangeTab = useCallback((event, newValue) => {
    setCurrentTab(newValue);
  }, []);

  const fetchMyActivities = async () => {
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

      const resp = await axiosTest.get(endpoints.activity.me.all + '?userID=' + userID, httpConfig)
      if (resp.data.status_code === 0) {
        setJoinedActivities(resp.data.Data)
      } else {
        enqueueSnakebar(resp.data.status_msg, { variant: "error" })
      }
    } catch (err) {
      enqueueSnakebar(err.toString(), { variant: "error" })
    }
  }

  const fetchFollower = async () => {
    try {
      const response = await axiosTest.get(endpoints.user.follower);
      // Assuming that 'response.data.data' holds the array of users.
      const followerData = response.data.Data.map((user) => {
        // Here we generate data similar to the mock data provided.
        // Replace the accessors like 'user.avatarUrl' with the correct paths from your API response.
        return {
          id: user.userId,
          name: user.username, // Assuming you want to use the 'username' as the name.
          region: user.region, // This will loop through your countries array.
          avatarUrl: user.avatarUrl, // Replace with the correct path to the avatar URL in your user object.
          isFollowed: user.isFollowed,
        };
      });
      setFollower(followerData);
    } catch (error) {
      console.error('Fetching follower failed:', error.response || error);
    }
  }

  const fetchFriend = async () => {
    try {
      const response = await axiosTest.get(endpoints.user.friend);
      // Assuming that 'response.data.data' holds the array of users.
      const friendData = response.data.Data.map((user) => {
        // Here we generate data similar to the mock data provided.
        // Replace the accessors like 'user.avatarUrl' with the correct paths from your API response.
        return {
          id: user.userId,
          name: user.username, // Assuming you want to use the 'username' as the name.
          region: user.region, // This will loop through your countries array.
          avatarUrl: user.avatarUrl, // Replace with the correct path to the avatar URL in your user object.
        };
      });
      setFriend(friendData);
    } catch (error) {
      console.error('Fetching follower failed:', error.response || error);
    }
  }

  const fetchMyMoments = async () => {
    try {
      const token = sessionStorage.getItem('token')
      const httpConfig = {
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      }

      const resp = await axiosTest.get(endpoints.moment.me, httpConfig)
      if (resp.data.status_code === 0) {
        setMoments(resp.data.Data.moments)
      } else {
        enqueueSnakebar(resp.data.status_msg, { variant: "error" })
      }
    } catch(err) {
      enqueueSnakebar(err.toString(), { variant: "error" })
    }
  }

  useEffect(() => {
    fetchMyActivities()
    fetchFollower()
    fetchFriend()
    fetchMyMoments()
  }, [])

  const handleFollowChange = useCallback((followerId, newFollowStatus) => {
    setFollower(currentFollowers =>
      currentFollowers.map(follower =>
        follower.id === followerId ? { ...follower, isFollowed: newFollowStatus } : follower
      )
    );

    fetchFriend()

  }, [fetchFriend]);

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

      {currentTab === 'profile' && <ProfileHome info={_userAbout} posts={moments} />}

      {currentTab === 'followers' && <ProfileFollowers followers={follower} onFollowChange={handleFollowChange} />}

      {currentTab === 'friends' && (
        <ProfileFriends
          friends={friend}
        />
      )}

      {currentTab === 'activities' && <ProfileGallery gallery={joinedActivities} />}
    </Container>
  );
}
