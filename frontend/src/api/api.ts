import axios from 'axios';
import store from "../store/store";
import { login, logout } from '../store/slices/userSlice';
import { resetCart } from "../store/slices/cartSlice";
import { message } from 'antd';

// Axios 인스턴스 생성
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true,
});


// 요청 인터셉터 설정
api.interceptors.request.use(
  (config) => {
    const { accessToken } = store.getState().user;
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    config.withCredentials = true; 
    return config;
  },
  (error) => Promise.reject(error)
);

// 응답 인터셉터 설정
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // 401 Unauthorized 에러 처리
    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true; // 무한 루프 방지

      try {
        const response = await axios.post(
          `${import.meta.env.VITE_API_BASE_URL}/api/auth/refresh-token`,
          {},
          { withCredentials: true } // HttpOnly 쿠키로 리프레시 토큰 전송
        );

        const { accessToken, user, userId } = response.data;

        store.dispatch(login({ accessToken, user, userId }));

        // 이전 요청에 새로운 토큰을 추가하고 재시도
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return axios(originalRequest);
      } catch (err) {
        store.dispatch(resetCart());
        store.dispatch(logout());
        message.error('세션이 만료되었습니다. 다시 로그인하세요.');
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
);

export default api;