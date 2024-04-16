import { paths } from 'src/routes/paths';
import axiosInstance, {axiosTest} from 'src/utils/axios';

// ----------------------------------------------------------------------

// Decode the JWT token.
export function jwtDecode(token) {
  const base64Url = token.split('.')[1];
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  const jsonPayload = decodeURIComponent(
    window
      .atob(base64)
      .split('')
      .map((c) => `%${`00${c.charCodeAt(0).toString(16)}`.slice(-2)}`)
      .join('')
  );

  return JSON.parse(jsonPayload);
}

// ----------------------------------------------------------------------

// Verify the validity of the JWT token.
export const isValidToken = (token) => {
  if (!token) {
    return false;
  }

  const decoded = jwtDecode(token);

  const currentTime = Date.now() / 1000;

  return decoded.exp > currentTime;
};

// ----------------------------------------------------------------------

// Set a timer to perform an action when the JWT token expires.
export const tokenExpired = (exp) => {
  // eslint-disable-next-line prefer-const
  let expiredTimer;

  const currentTime = Date.now();

  // Test token expires after 10s
  // const timeLeft = currentTime + 10000 - currentTime; // ~10s
  const timeLeft = exp * 1000 - currentTime;

  clearTimeout(expiredTimer);

  expiredTimer = setTimeout(() => {
    alert('Token expired');

    sessionStorage.removeItem('token');

    window.location.href = paths.login;
  }, timeLeft);
};

// ----------------------------------------------------------------------

// Store the token sent from the backend and then set a time limit 
// If the token expires it will erase the token and redirect to a new page
export const setSession = (token) => {
  if (token) {
    sessionStorage.setItem('token', token);
    axiosInstance.defaults.headers.common.Authorization = `Bearer ${token}`;
    axiosTest.defaults.headers.common.Authorization = `Bearer ${token}`;

    // This function below will handle when token is expired
    const { exp } = jwtDecode(token);
    tokenExpired(exp);
  } else {
    sessionStorage.removeItem('token');
    delete axiosInstance.defaults.headers.common.Authorization;
    delete axiosTest.defaults.headers.common.Authorization;
  }
};
