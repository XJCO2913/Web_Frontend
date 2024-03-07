// import { paramCase } from 'src/utils/change-case';

// import { _id, _postTitles } from 'src/_mock/assets';

// ----------------------------------------------------------------------

// const MOCK_ID = _id[1];
// const MOCK_TITLE = _postTitles[2];

const ROOTS = {
  AUTH: '/auth',
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
};
