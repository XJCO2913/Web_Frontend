import PropTypes from 'prop-types';
import { useMemo, useEffect, useReducer, useCallback } from 'react';

import axios, { endpoints } from 'src/utils/axios';

import { AuthContext } from './auth-context';
import { setSession, isValidToken } from './utils';

// ----------------------------------------------------------------------
/**
 * NOTE:
 * We only build demo at basic level.
 * Customer will need to do some extra handling yourself if you want to extend the logic and other features...
 */
// ----------------------------------------------------------------------

const initialState = {
  user: null,
  loading: true,
};

const reducer = (state, action) => {
  if (action.type === 'INITIAL') {
    return {
      loading: false,
      user: action.payload.user,
    };
  }
  if (action.type === 'LOGIN') {
    return {
      ...state,
      user: action.payload.user,
    };
  }
  if (action.type === 'REGISTER') {
    return {
      ...state,
      user: action.payload.user,
    };
  }
  if (action.type === 'LOGOUT') {
    return {
      ...state,
      user: null,
    };
  }
  return state;
};

// ----------------------------------------------------------------------

const STORAGE_KEY = 'token';

export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const initialize = useCallback(async () => {
    try {
      const token = sessionStorage.getItem(STORAGE_KEY);

      if (token && isValidToken(token)) {
        setSession(token);

        const response = await axios.get(endpoints.auth.me);

        const { user } = response.data;

        dispatch({
          type: 'INITIAL',
          payload: {
            user: {
              ...user,
              token,
            },
          },
        });
      } else {
        dispatch({
          type: 'INITIAL',
          payload: {
            user: null,
          },
        });
      }
    } catch (error) {
      console.error(error);
      dispatch({
        type: 'INITIAL',
        payload: {
          user: null,
        },
      });
    }
  }, []);

  useEffect(() => {
    initialize();
  }, [initialize]);

  // LOGIN
  const login = useCallback(async (username, password) => {
    const data = {
      username,
      password,
    };

    // Send a POST request to the login endpoint
    const response = await axios.post(endpoints.auth.login, data);

    // Check the status code to check whether the login is successful
    if (response.data.status_code === 0) {
      // Extract token and user information
      const { token, userInfo } = response.data.Data;
      // store the token
      setSession(token);
      // Update user status
      dispatch({
        type: 'LOGIN',
        payload: {
          user: {
            ...userInfo,
            token,
          },
        },
      });
      return { success: true };
    } else {
      // Handle login failure, e.g., show error message
      console.error(response.data.status_msg);
      // Return additional login attempt information if available
      const attemptsMsg = response.data.data?.remaining_attempts
        ? `You have ${response.data.data.remaining_attempts} attempts remaining.`
        : '';
      return { success: false, message: `${response.data.status_msg}. ${attemptsMsg}` };
    }
  }, []);

  // REGISTER
  const register = useCallback(async (username, password, gender, birthday, region) => {
    const data = {
      username,
      password,
      gender,
      birthday,
      region
    };

    const response = await axios.post(endpoints.auth.register, data);

    const { token, user } = response.data;

    sessionStorage.setItem(STORAGE_KEY, token);

    dispatch({
      type: 'REGISTER',
      payload: {
        user: {
          ...user,
          token,
        },
      },
    });
  }, []);

  // LOGOUT
  const logout = useCallback(async () => {
    setSession(null);
    dispatch({
      type: 'LOGOUT',
    });
  }, []);

  // ----------------------------------------------------------------------

  const checkAuthenticated = state.user ? 'authenticated' : 'unauthenticated';

  const status = state.loading ? 'loading' : checkAuthenticated;

  const memoizedValue = useMemo(
    () => ({
      user: state.user,
      method: 'jwt',
      loading: status === 'loading',
      authenticated: status === 'authenticated',
      unauthenticated: status === 'unauthenticated',
      //
      login,
      register,
      logout,
    }),
    [login, logout, register, state.user, status]
  );

  return <AuthContext.Provider value={memoizedValue}>{children}</AuthContext.Provider>;
}

AuthProvider.propTypes = {
  children: PropTypes.node,
};
