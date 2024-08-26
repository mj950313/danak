import { Outlet } from "react-router-dom";
import Gnb from "./layout/Gnb";
import Footer from "./layout/Footer";
import { useDispatch, useSelector } from "react-redux";
import { login } from "./store/slices/userSlice";
import { useEffect } from "react";
import api from "./api/api.ts";

function App() {
  const dispatch = useDispatch();
  const accessToken = useSelector((state: any) => state.user.accessToken);

  // 페이지 로드 시, 로컬 스토리지에서 액세스 토큰 및 사용자 정보 복원
  useEffect(() => {
    const storedAccessToken = localStorage.getItem("accessToken");
    const storedUser = localStorage.getItem("user");
    const storedUserId = localStorage.getItem("userId");

    // 로컬 스토리지에 토큰과 유저가 있으면 Redux에 저장
    if (storedAccessToken && storedUser && storedUserId) {
      dispatch(
        login({
          accessToken: storedAccessToken,
          user: storedUser,
          userId: storedUserId,
        })
      );
    }
  }, [dispatch]);

  // 액세스 토큰이 변경될 때마다 Axios 헤더에 토큰을 추가
  useEffect(() => {
    if (accessToken) {
      api.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
    }
  }, [accessToken]);

  return (
    <>
      <Gnb />
      <Outlet />
      <Footer />
    </>
  );
}

export default App;
