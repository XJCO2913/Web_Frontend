import { Navigate, useRoutes } from 'react-router-dom';
import { authRoutes } from './auth';
import { HeroPage } from './hero-page';
import MainLayout from 'src/layouts/main';

// ----------------------------------------------------------------------

export default function Router() {
  return useRoutes([
    // SET INDEX PAGE WITH HOME PAGE
    {
      path: '/',
      element: (
        <MainLayout>
          <HeroPage />
        </MainLayout>
      ),
    },
    // Auth routes
    ...authRoutes,

    // No match 404
    { path: '*', element: <Navigate to="/404" replace /> },
  ]);
}
