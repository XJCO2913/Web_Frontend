// ----------------------------------------------------------------------

// ROOT PATH AFTER LOGIN SUCCESSFUL
export const PATH_AFTER_LOGIN = '/home';

const ROOTS = {
  HOME: '/home',
};

// ----------------------------------------------------------------------

export const paths = {
  heroPage: '/',
  login: '/login',
  register: '/register',
  pricing: '/pricing',
  payment: '/payment',
  // HOME
  home: {
    root: ROOTS.HOME,
    user: {
      root: `${ROOTS.HOME}/user`,
      profile: `${ROOTS.HOME}/user/profile`,
      account: `${ROOTS.HOME}/user/account`,
    },
    tour: {
      root: `${ROOTS.HOME}/tour`,
      new: `${ROOTS.HOME}/tour/new`,
      details: (id) => `${ROOTS.HOME}/tour/${id}`,
    },
  },
};

