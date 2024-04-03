// API
// ----------------------------------------------------------------------

// Base URL
export const HOST_API = 'http://43.136.232.116:5000/api'

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
        changeAccount:'/user',
        avatarUpload:'/user/avatar'
    },
    chat: '/chat'
};