import { lazy, Suspense } from 'react';
import { Outlet } from 'react-router-dom';

import { AuthGuard } from 'src/auth/guard';
import HomeLayout from 'src/layouts/home';

import { LoadingScreen } from 'src/components/loading-screen';

// ----------------------------------------------------------------------
const HomePage = lazy(() => import('src/pages/home/app'));

// USER
const UserProfilePage = lazy(() => import('src/pages/home/user/profile'));
const UserListPage = lazy(() => import('src/pages/home/user/list'));
const UserAccountPage = lazy(() => import('src/pages/home/user/account'));
const UserEditPage = lazy(() => import('src/pages/home/user/edit'));

// TOUR
const TourDetailsPage = lazy(() => import('src/pages/home/tour/details'));
const TourListPage = lazy(() => import('src/pages/home/tour/list'));
const TourCreatePage = lazy(() => import('src/pages/home/tour/new'));
const TourEditPage = lazy(() => import('src/pages/home/tour/edit'));

// Chat
const ChatPage = lazy(() => import('src/pages/home/chat'));

// ----------------------------------------------------------------------

export const homeRoutes = [
  {
    path: 'home',
    element: (
      <AuthGuard>
        <HomeLayout>
          <Suspense fallback={<LoadingScreen />}>
            <Outlet />
          </Suspense>
        </HomeLayout>
      </AuthGuard>
    ),
    children: [
      { element: <HomePage />, index: true },
      {
        path: 'user',
        children: [
          { element: <UserProfilePage />, index: true },
          { path: 'profile', element: <UserProfilePage /> },
          { path: 'list', element: <UserListPage /> },
          { path: ':id/edit', element: <UserEditPage /> },
          { path: 'account', element: <UserAccountPage /> },
        ],
      },
      {
        path: 'tour',
        children: [
          { element: <TourListPage />, index: true },
          { path: 'list', element: <TourListPage /> },
          { path: ':id', element: <TourDetailsPage /> },
          { path: 'new', element: <TourCreatePage /> },
          { path: ':id/edit', element: <TourEditPage /> },
        ],
      },
      { path: 'chat', element: <ChatPage /> },
    ],
  },
];
