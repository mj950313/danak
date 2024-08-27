import { Outlet } from "react-router-dom";
import Gnb from "./layout/Gnb";
import Footer from "./layout/Footer";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import api from "./api/api.ts";

function App() {
  const accessToken = useSelector((state: any) => state.user.accessToken);

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
