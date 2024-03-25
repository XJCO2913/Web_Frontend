import { Helmet } from 'react-helmet-async';

import { HeroView } from 'src/sections/hero/view';

// ----------------------------------------------------------------------

export default function HeroPage() {
  return (
    <>
      <Helmet>
        <title> PathPals </title>
      </Helmet>

      <HeroView />
    </>
  );
}
