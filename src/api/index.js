// API
// ----------------------------------------------------------------------

// Base URL
export const HOST_API = 'http://43.136.232.116:5000/api'
export const TEST_HOST_API = 'http://43.136.232.116:5000/test'

// ----------------------------------------------------------------------

export const GAODE_API = {
    apiKey: '03eceb9420e057a98616285039c15367',
    apiAdmin: 'https://restapi.amap.com/v3/config/district',
    apiIP: 'https://restapi.amap.com/v3/ip?key='
};

// ----------------------------------------------------------------------

// request for the backend
export const endpoints = {
    auth: {
        login: '/user/login',
        register: '/user/register',
        me: '/user',
    },
    user: {
        changeAccount: '/user',
        avatarUpload: '/user/avatar',
        subscribe: '/user/subscribe',
        cancelSubscribe: '/user/cancel',
        refreshToken: '/user/refresh',
        follower: '/friend/follower',
        followUser: '/friend/follow',
        friend: '/friend/',
        applyOrg: '/org/apply',
        notify: '/notify/pull',
    },
    chat: '/chat',
    activity: {
        create: '/activity/create',
        all: '/activity/all',
        fetch: '/activity/feed',
        join: '/activity/signup',
        getById: '/activity',
        me: {
            all: '/activity/user'
        },
        getUserRoute: '/activity/route',
        upload: '/activity/route'
    },
    moment: {
        create: '/moment/create',
        fetch: '/moment/feed',
        like: '/moment/like',
        unlike: '/moment/unlike',
        comment: '/moment/comment',
        me: '/moment/me'
    },
};