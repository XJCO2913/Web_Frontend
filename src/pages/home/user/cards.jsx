import { Helmet } from 'react-helmet-async';

import { UserCardsView } from 'src/sections/user/view';

// ----------------------------------------------------------------------

export default function UserCardsPage() {
  return (
    <>
      <Helmet>
        <title> User Cards</title>
      </Helmet>

      <UserCardsView />
    </>
  );
}
