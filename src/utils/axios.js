import axios from 'axios';
import { HOST_API } from 'src/config-global';

// ----------------------------------------------------------------------
// 添加请求拦截器
// 在请求发送之前做拦截 插入一些自定义的配置

const axiosInstance = axios.create({ baseURL: HOST_API });

axiosInstance.interceptors.response.use(
  (res) => res,
  (error) => Promise.reject((error.response && error.response.data) || 'Something went wrong')
);

export default axiosInstance;

// ----------------------------------------------------------------------
// 获取get请求

export const fetcher = async (args) => {
  const [url, config] = Array.isArray(args) ? args : [args];

  const res = await axiosInstance.get(url, { ...config });

  return res.data;
};

// ----------------------------------------------------------------------

export const endpoints = {
  //   chat: '/api/chat',
  //   kanban: '/api/kanban',
  //   calendar: '/api/calendar',
  auth: {
    me: '/api/auth/me',
    login: '/api/user/login',
    register: '/api/user/register',
  },
  //   mail: {
  //     list: '/api/mail/list',
  //     details: '/api/mail/details',
  //     labels: '/api/mail/labels',
  //   },
  //   post: {
  //     list: '/api/post/list',
  //     details: '/api/post/details',
  //     latest: '/api/post/latest',
  //     search: '/api/post/search',
  //   },
  //   product: {
  //     list: '/api/product/list',
  //     details: '/api/product/details',
  //     search: '/api/product/search',
  //   },
};
