import { Outlet } from "react-router-dom";
import Gnb from "./components/Gnb";
import Footer from "./components/Footer";
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
