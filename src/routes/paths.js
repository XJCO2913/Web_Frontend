import { _id, _postTitles } from 'src/_mock/assets';
import { paramCase } from 'src/utils/change-case';

// ----------------------------------------------------------------------
const MOCK_ID = _id[1];

const MOCK_TITLE = _postTitles[2];

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
      new: `${ROOTS.HOME}/user/new`,
      list: `${ROOTS.HOME}/user/list`,
      cards: `${ROOTS.HOME}/user/cards`,
      profile: `${ROOTS.HOME}/user/profile`,
      account: `${ROOTS.HOME}/user/account`,
      edit: (id) => `${ROOTS.HOME}/user/${id}/edit`,
      demo: {
        edit: `${ROOTS.HOME}/user/${MOCK_ID}/edit`,
      },
    },
    post: {
      root: `${ROOTS.HOME}/post`,
      new: `${ROOTS.HOME}/post/new`,
      details: (title) => `${ROOTS.HOME}/post/${paramCase(title)}`,
      edit: (title) => `${ROOTS.HOME}/post/${paramCase(title)}/edit`,
      demo: {
        details: `${ROOTS.HOME}/post/${paramCase(MOCK_TITLE)}`,
        edit: `${ROOTS.HOME}/post/${paramCase(MOCK_TITLE)}/edit`,
      },
    },
    tour: {
      root: `${ROOTS.HOME}/tour`,
      new: `${ROOTS.HOME}/tour/new`,
      details: (id) => `${ROOTS.HOME}/tour/${id}`,
      edit: (id) => `${ROOTS.HOME}/tour/${id}/edit`,
      demo: {
        details: `${ROOTS.HOME}/tour/${MOCK_ID}`,
        edit: `${ROOTS.HOME}/tour/${MOCK_ID}/edit`,
      },
    },
  },
};

