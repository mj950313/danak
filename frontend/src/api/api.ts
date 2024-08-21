import axios from 'axios';
import store from "../store/store";
import { login, logout } from '../store/slices/userSlice';
import { message } from 'antd';

// Axios 인스턴스 생성
const api = axios.create({
  baseURL: 'http://localhost:8080', // 서버 주소
  withCredentials: true, // CORS 정책에서 쿠키 전송 허용
});

// 요청 인터셉터 설정
api.interceptors.request.use(
  (config) => {
    const { accessToken } = store.getState().user;
    console.log('AccessToken:', accessToken);
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
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
        // 리프레시 토큰을 이용하여 액세스 토큰 재발급
        const response = await axios.post(
          'http://localhost:8080/api/auth/refresh-token',  // 수정된 부분
          {},
          { withCredentials: true } // HttpOnly 쿠키로 리프레시 토큰 전송
        );

        const { accessToken, user } = response.data;

        // 새로 발급된 액세스 토큰을 Redux 및 로컬 스토리지에 저장
        store.dispatch(login({ accessToken, user }));
        localStorage.setItem('accessToken', accessToken);

        // 이전 요청에 새로운 토큰을 추가하고 재시도
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return axios(originalRequest);
      } catch (err) {
        // 만료 시 로그아웃 처리 및 로컬 스토리지에서 토큰 삭제
        localStorage.removeItem('accessToken');
        store.dispatch(logout());
        message.error('세션이 만료되었습니다. 다시 로그인하세요.');
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
