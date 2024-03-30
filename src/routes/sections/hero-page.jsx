import { lazy, Suspense } from 'react';
import { Outlet } from 'react-router-dom';


import { SplashScreen } from 'src/components/loading-screen';

// ----------------------------------------------------------------------

export const HeroPage = lazy(() => import('src/pages/hero-page'));
const PricingPage = lazy(() => import('src/pages/pricing'));
const MapPage = lazy(() => import('src/pages/map'));

// ----------------------------------------------------------------------

export const heroRoutes = [
    {
        element: (
            <Suspense fallback={<SplashScreen />}>
                <Outlet />
            </Suspense>
        ),
        children: [
            { path: 'pricing', element: <PricingPage /> },
            { path: 'map', element: <MapPage /> },
        ],
    },
];
