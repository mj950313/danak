import { Outlet } from "react-router-dom";
import Gnb from "./layout/Gnb";
import Footer from "./layout/Footer";
function App() {
  return (
    <>
      <Gnb />
      <Outlet />
      <Footer />
    </>
  );
}

export default App;
