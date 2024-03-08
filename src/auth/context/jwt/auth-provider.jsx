import PropTypes from 'prop-types';
import { useMemo, useReducer, useCallback } from 'react';
import axiosInstance from 'src/utils/axios';
import { endpoints } from 'src/apis/index'
import { AuthContext } from './auth-context';
import { setSession } from './utils';

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

  // const initialize = useCallback(async () => {
  //   try {
  //     const token = sessionStorage.getItem(STORAGE_KEY);

  //     if (token && isValidToken(token)) {
  //       setSession(token);

  //       const response = await axiosInstance.get(endpoints.auth.me);

  //       const { user } = response.data;

  //       dispatch({
  //         type: 'INITIAL',
  //         payload: {
  //           user: {
  //             ...user,
  //             token,
  //           },
  //         },
  //       });
  //     } else {
  //       dispatch({
  //         type: 'INITIAL',
  //         payload: {
  //           user: null,
  //         },
  //       });
  //     }
  //   } catch (error) {
  //     console.error(error);
  //     dispatch({
  //       type: 'INITIAL',
  //       payload: {
  //         user: null,
  //       },
  //     });
  //   }
  // }, []);

  // useEffect(() => {
  //   initialize();
  // }, [initialize]);

  // LOGIN
  const login = useCallback(async (username, password) => {
    const data = {
      username,
      password,
    };

    try {
      const response = await axiosInstance.post(endpoints.auth.login, data);
      console.log(100)
      // Check whether user login successfully
      if (response.data.status_code === 0) {
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
        // If the status code is not 0, processing of the login fails, but this should already be caught by the interceptor
        return { success: false, message: 'Login failed due to unexpected error.' };
      }
    } catch (error) {
      let customErrorData = { success: false, data: {} };

      // If user not found send the message to upper layer
      if(error.data.status_code === -1 && error.data.status_msg === 'user not found')
      {
        customErrorData.message = "The username does not exist.";
        return customErrorData;
      }

      if (error.status_code === -1) {
        // Send the remaining attempts to upper layer
        if (error.data.remainingAttempts) {
          customErrorData.message = `Login failed. You have ${error.data.remainingAttempts} attempts remaining.`;
          customErrorData.data.remainingAttempts = error.data.remainingAttempts;
        }
        // Send the lockdown time to upper layer
        if (error.data.lockExpires) {
          customErrorData.message = `Account is locked.`;
          customErrorData.data.lockExpires = error.data.lockExpires;
        }
      } else {
        customErrorData.message = 'Login failed due to an unexpected error. Please try again later.';
      }
      return customErrorData;
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

    // Get response from backend
    const response = await axiosInstance.post(endpoints.auth.register, data);
    const { token, userInfo } = response.data.Data;
    // Store the token
    sessionStorage.setItem(STORAGE_KEY, token);
    // Update user status
    dispatch({
      type: 'REGISTER',
      payload: {
        user: {
          ...userInfo,
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
