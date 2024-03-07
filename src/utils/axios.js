import axios from 'axios';
import { HOST_API } from 'src/apis/index';

// ----------------------------------------------------------------------

// Can be used to send various requests get post delete
const axiosInstance = axios.create({ baseURL: HOST_API });

axiosInstance.interceptors.response.use(
  (res) => res,
  (error) => {
    // If there is a response and the response contains data
    if (error.response && error.response.data.Data !== null) {
      // Constructing a custom error object
      let customError = {
        status_code: error.response.data.status_code,
        status_msg: error.response.data.status_msg,
        data: {}
      };

      // If there is a remaining number of attempts, add to the error object
      if (error.response.data.Data.remaining_attempts !== undefined) {
        customError.data.remainingAttempts = error.response.data.Data.remaining_attempts;
      }

      // If the account is locked, add the lock expiration time
      if (error.response.data.Data.lock_expires !== undefined) {
        // lockExpires is unix timestamp
        customError.data.lockExpires = error.response.data.Data.lock_expires;
      }

      // Returning custom error objects instead of throwing exceptions
      return Promise.reject(customError);
    }
    
    // If there is no response or the response does not contain data, return a generic error message
    return Promise.reject((error.response && error.response.data)||'Something went wrong');
  }
);

export default axiosInstance;

// ----------------------------------------------------------------------

// Use only for get requests, Simplifies code, Increases maintainability

export const fetcher = async (args) => {
  const [url, config] = Array.isArray(args) ? args : [args];

  const res = await axiosInstance.get(url, { ...config });

  return res.data;
};
