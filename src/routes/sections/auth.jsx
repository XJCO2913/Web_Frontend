import { lazy, Suspense } from 'react';
import { Outlet } from 'react-router-dom';
import AuthClassicLayout from 'src/layouts/auth/classic';
import { SplashScreen } from 'src/components/loading-screen';
// import CompactLayout from 'src/layouts/compact';

// ----------------------------------------------------------------------

// AMPLIFY
// const AmplifyLoginPage = lazy(() => import('src/pages/auth/amplify/login'));
// const AmplifyRegisterPage = lazy(() => import('src/pages/auth/amplify/register'));
// const AmplifyVerifyPage = lazy(() => import('src/pages/auth/amplify/verify'));
// const AmplifyNewPasswordPage = lazy(() => import('src/pages/auth/amplify/new-password'));
// const AmplifyForgotPasswordPage = lazy(() => import('src/pages/auth/amplify/forgot-password'));

// JWT
const JwtLoginPage = lazy(() => import('src/pages/auth/login'));
const JwtRegisterPage = lazy(() => import('src/pages/auth/register'));

// FIREBASE
// const FirebaseLoginPage = lazy(() => import('src/pages/auth/firebase/login'));
// const FirebaseRegisterPage = lazy(() => import('src/pages/auth/firebase/register'));
// const FirebaseVerifyPage = lazy(() => import('src/pages/auth/firebase/verify'));
// const FirebaseForgotPasswordPage = lazy(() => import('src/pages/auth/firebase/forgot-password'));

// SUPABASE
// const SupabaseLoginPage = lazy(() => import('src/pages/auth/supabase/login'));
// const SupabaseVerifyPage = lazy(() => import('src/pages/auth/supabase/verify'));
// const SupabaseRegisterPage = lazy(() => import('src/pages/auth/supabase/register'));
// const SupabaseNewPasswordPage = lazy(() => import('src/pages/auth/supabase/new-password'));
// const SupabaseForgotPasswordPage = lazy(() => import('src/pages/auth/supabase/forgot-password'));

// ----------------------------------------------------------------------

const authJwt = {
  path: 'jwt',
  element: (
    <Suspense fallback={<SplashScreen />}>
      <Outlet />
    </Suspense>
  ),
  children: [
    {
      path: 'login',
      element: (

          <AuthClassicLayout type="login">
            <JwtLoginPage />
          </AuthClassicLayout>

      ),
    },
    {
      path: 'register',
      element: (

          <AuthClassicLayout type="register" title="Manage the job more effectively with XXX">
            <JwtRegisterPage />
          </AuthClassicLayout>
      ),
    },
  ],
};

// const authAmplify = {
//   path: 'amplify',
//   element: (
//     <Suspense fallback={<SplashScreen />}>
//       <Outlet />
//     </Suspense>
//   ),
//   children: [
//     {
//       path: 'login',
//       element: (
//         <GuestGuard>
//           <AuthClassicLayout>
//             <AmplifyLoginPage />
//           </AuthClassicLayout>
//         </GuestGuard>
//       ),
//     },
//     {
//       path: 'register',
//       element: (
//         <GuestGuard>
//           <AuthClassicLayout title="Manage the job more effectively with Minimal">
//             <AmplifyRegisterPage />
//           </AuthClassicLayout>
//         </GuestGuard>
//       ),
//     },
//     {
//       element: (
//         <CompactLayout>
//           <Outlet />
//         </CompactLayout>
//       ),
//       children: [
//         { path: 'verify', element: <AmplifyVerifyPage /> },
//         { path: 'new-password', element: <AmplifyNewPasswordPage /> },
//         { path: 'forgot-password', element: <AmplifyForgotPasswordPage /> },
//       ],
//     },
//   ],
// };

// const authFirebase = {
//   path: 'firebase',
//   element: (
//     <Suspense fallback={<SplashScreen />}>
//       <Outlet />
//     </Suspense>
//   ),
//   children: [
//     {
//       path: 'login',
//       element: (
//         <GuestGuard>
//           <AuthClassicLayout>
//             <FirebaseLoginPage />
//           </AuthClassicLayout>
//         </GuestGuard>
//       ),
//     },
//     {
//       path: 'register',
//       element: (
//         <GuestGuard>
//           <AuthClassicLayout title="Manage the job more effectively with Minimal">
//             <FirebaseRegisterPage />
//           </AuthClassicLayout>
//         </GuestGuard>
//       ),
//     },
//     {
//       element: (
//         <CompactLayout>
//           <Outlet />
//         </CompactLayout>
//       ),
//       children: [
//         { path: 'verify', element: <FirebaseVerifyPage /> },
//         { path: 'forgot-password', element: <FirebaseForgotPasswordPage /> },
//       ],
//     },
//   ],
// };

// const authAuth0 = {
//   path: 'auth0',
//   element: (
//     <Suspense fallback={<SplashScreen />}>
//       <Outlet />
//     </Suspense>
//   ),
//   children: [
//     {
//       path: 'login',
//       element: (
//         <GuestGuard>
//           <AuthClassicLayout>
//             <Auth0LoginPage />
//           </AuthClassicLayout>
//         </GuestGuard>
//       ),
//     },
//     {
//       path: 'callback',
//       element: (
//         <GuestGuard>
//           <Auth0Callback />
//         </GuestGuard>
//       ),
//     },
//   ],
// };

// const authSupabase = {
//   path: 'supabase',
//   element: (
//     <Suspense fallback={<SplashScreen />}>
//       <Outlet />
//     </Suspense>
//   ),
//   children: [
//     {
//       path: 'login',
//       element: (
//         <GuestGuard>
//           <AuthClassicLayout>
//             <SupabaseLoginPage />
//           </AuthClassicLayout>
//         </GuestGuard>
//       ),
//     },
//     {
//       path: 'register',
//       element: (
//         <GuestGuard>
//           <AuthClassicLayout title="Manage the job more effectively with Minimal">
//             <SupabaseRegisterPage />
//           </AuthClassicLayout>
//         </GuestGuard>
//       ),
//     },
//     {
//       element: (
//         <CompactLayout>
//           <Outlet />
//         </CompactLayout>
//       ),
//       children: [
//         { path: 'verify', element: <SupabaseVerifyPage /> },
//         {
//           path: 'forgot-password',
//           element: <SupabaseForgotPasswordPage />,
//         },
//         { path: 'new-password', element: <SupabaseNewPasswordPage /> },
//       ],
//     },
//   ],
// };

export const authRoutes = [
  {
    path: 'auth',
    children: [authJwt],
  },
];
