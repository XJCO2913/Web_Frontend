import { Helmet } from 'react-helmet-async';
import { JwtLoginView } from 'src/sections/auth/jwt';

// ----------------------------------------------------------------------

export default function Login() {
  return (
    <>
      <Helmet>
        <title>Login</title>
      </Helmet>

      <JwtLoginView />
    </>
  );
}
