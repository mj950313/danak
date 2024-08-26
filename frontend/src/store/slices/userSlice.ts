import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isAuthenticated: false, 
  user: null, 
  accessToken: null,
  userId: null,
};

const userSlice = createSlice({
  name: 'user', // 슬라이스의 이름
  initialState, // 슬라이스의 초기 상태
  reducers: {
    // 로그인 액션: 유저 데이터를 받아 상태를 업데이트
    login(state, action) {
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.accessToken = action.payload.accessToken;
      state.userId = action.payload.userId;

    },
    // 로그아웃 액션: 유저 데이터를 초기화하고 인증 상태를 false로 설정
    logout(state) {
      state.isAuthenticated = false;
      state.user = null;
      state.accessToken = null;
      state.userId = null;
    },
  },
});

export const { login, logout } = userSlice.actions;
export default userSlice.reducer;
