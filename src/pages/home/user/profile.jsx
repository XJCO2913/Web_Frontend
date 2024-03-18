import { Helmet } from 'react-helmet-async';

import { UserProfileView } from 'src/sections/user/view';

// ----------------------------------------------------------------------

export default function UserProfilePage() {
  return (
    <>
      <Helmet>
        <title> User Profile</title>
      </Helmet>

      <UserProfileView />
    </>
  );
}
