import { Helmet } from 'react-helmet-async';

import MapView from 'src/sections/map-view';

// ----------------------------------------------------------------------

export default function MapPage() {
  return (
    <>
      <Helmet>
        <title> Components: Map</title>
      </Helmet>

      <MapView />
    </>
  );
}
