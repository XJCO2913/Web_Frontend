// import { paramCase } from 'src/utils/change-case';

// import { _id, _postTitles } from 'src/_mock/assets';

// ----------------------------------------------------------------------

// const MOCK_ID = _id[1];
// const MOCK_TITLE = _postTitles[2];

const ROOTS = {
  AUTH: '/auth',
  AUTH_DEMO: '/auth-demo',
  DASHBOARD: '/dashboard',
};

// ----------------------------------------------------------------------

export const paths = {
  //   post: {
  //     root: `/post`,
  //     details: (title) => `/post/${paramCase(title)}`,
  //     demo: {
  //       details: `/post/${paramCase(MOCK_TITLE)}`,
  //     },
  //   },
  // AUTH
  auth: {
    jwt: {
      login: `${ROOTS.AUTH}/jwt/login`,
      register: `${ROOTS.AUTH}/jwt/register`,
    }
  },
  //   authDemo: {
  //     classic: {
  //       login: `${ROOTS.AUTH_DEMO}/classic/login`,
  //       register: `${ROOTS.AUTH_DEMO}/classic/register`,
  //       forgotPassword: `${ROOTS.AUTH_DEMO}/classic/forgot-password`,
  //       newPassword: `${ROOTS.AUTH_DEMO}/classic/new-password`,
  //       verify: `${ROOTS.AUTH_DEMO}/classic/verify`,
  //     },
  //     modern: {
  //       login: `${ROOTS.AUTH_DEMO}/modern/login`,
  //       register: `${ROOTS.AUTH_DEMO}/modern/register`,
  //       forgotPassword: `${ROOTS.AUTH_DEMO}/modern/forgot-password`,
  //       newPassword: `${ROOTS.AUTH_DEMO}/modern/new-password`,
  //       verify: `${ROOTS.AUTH_DEMO}/modern/verify`,
  //     },
  //   }

};
