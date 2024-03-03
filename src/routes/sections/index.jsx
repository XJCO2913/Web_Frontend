import { Navigate, useRoutes } from 'react-router-dom';
import Layout from "@/pages/Layout"
import Home from '@/pages/Home';
import { authRoutes } from './auth';

// import { authDemoRoutes } from './auth-demo';
// import { HomePage, mainRoutes } from './main';
// import { dashboardRoutes } from './dashboard';
// import { componentsRoutes } from './components';

// ----------------------------------------------------------------------

export default function Router() {
  return useRoutes([
    // SET INDEX PAGE WITH HOME PAGE
    {
      path: '/dashboard',
        // element: <AuthRoute><Layout/></AuthRoute>
        element: <Layout />,
        children: [
            {
                path: '',
                element: <Home />
            }
        ]
    },

    // Auth routes
    ...authRoutes,
    // ...authDemoRoutes,

    // Dashboard routes
    // ...dashboardRoutes,

    // // Main routes
    // ...mainRoutes,

    // // Components routes
    // ...componentsRoutes,

    // No match 404
    { path: '*', element: <Navigate to="/404" replace /> },
  ]);
}
