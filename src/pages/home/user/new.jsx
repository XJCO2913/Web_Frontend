import { Helmet } from 'react-helmet-async';

import { UserCreateView } from 'src/sections/user/view';

// ----------------------------------------------------------------------

export default function UserCreatePage() {
  return (
    <>
      <Helmet>
        <title> Create a new user</title>
      </Helmet>

      <UserCreateView />
    </>
  );
}
