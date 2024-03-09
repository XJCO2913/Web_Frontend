import { lazy, Suspense } from 'react';
import AuthClassicLayout from 'src/layouts/auth/classic';
import { SplashScreen } from 'src/components/loading-screen';

// ----------------------------------------------------------------------

// Use lazy to load the login and registration pages
const JwtLoginPage = lazy(() => import('src/pages/auth/login'));
const JwtRegisterPage = lazy(() => import('src/pages/auth/register'));

// ----------------------------------------------------------------------
const loginRoute = {
  path: 'login',
  element: (
    <Suspense fallback={<SplashScreen />}>
      <AuthClassicLayout type="login">
        <JwtLoginPage />
      </AuthClassicLayout>
    </Suspense>
  ),
};

const registerRoute = {
  path: 'register',
  element: (
    <Suspense fallback={<SplashScreen />}>
      <AuthClassicLayout type="register" title="Map Your Moves, Chat Your Paths!">
        <JwtRegisterPage />
      </AuthClassicLayout>
    </Suspense>
  ),
};

export const authRoutes = [loginRoute, registerRoute];
