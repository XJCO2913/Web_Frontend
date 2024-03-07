import axios from 'axios';
import { HOST_API } from 'src/config-global';

// ----------------------------------------------------------------------
const axiosInstance = axios.create({ baseURL: HOST_API });

axiosInstance.interceptors.response.use(
  (res) => res,
  (error) => {
    // 如果有响应并且响应中包含数据
    if (error.response && error.response.data) {
      // 构造一个自定义错误对象
      let customError = {
        status_code: error.response.data.status_code,
        status_msg: error.response.data.status_msg,
        data: {}
      };

      // 如果有剩余尝试次数，添加到错误对象中
      if (error.response.data.Data.remaining_attempts !== undefined) {
        customError.data.remainingAttempts = error.response.data.Data.remaining_attempts;
      }

      // 如果账号被锁定，添加锁定到期时间
      if (error.response.data.Data.lock_expires !== undefined) {
        // 将时间戳转换为更易读的格式，如果需要
        const expires = new Date(parseInt(error.response.data.Data.lock_expires) * 1000);
        customError.data.lockExpires = expires.toString();
      }

      // 返回自定义错误对象，而不是抛出异常
      return Promise.reject(customError);
    }
    
    // 如果没有响应或者响应中不包含数据，返回通用错误信息
    return Promise.reject((error.response && error.response.data)||'Something went wrong');
  }
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
