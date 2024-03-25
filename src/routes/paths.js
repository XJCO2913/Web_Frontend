import { _id } from 'src/_mock/assets';

// ----------------------------------------------------------------------
const MOCK_ID = _id[1];


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
    chat: `${ROOTS.HOME}/chat`,
    user: {
      root: `${ROOTS.HOME}/user`,
      list: `${ROOTS.HOME}/user/list`,
      profile: `${ROOTS.HOME}/user/profile`,
      account: `${ROOTS.HOME}/user/account`,
    },
    tour: {
      root: `${ROOTS.HOME}/tour`,
      new: `${ROOTS.HOME}/tour/new`,
      details: `${ROOTS.HOME}/tour/${MOCK_ID}`,
      edit: `${ROOTS.HOME}/tour/${MOCK_ID}/edit`,
      demo: {
        details: `${ROOTS.HOME}/tour/${MOCK_ID}`,
        edit: `${ROOTS.HOME}/tour/${MOCK_ID}/edit`,
      },
    },
  },
};

