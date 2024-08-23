import { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FiShoppingCart } from "react-icons/fi";
import { FaRegUser } from "react-icons/fa";
import { HiMenu } from "react-icons/hi";
import { GiFishbone } from "react-icons/gi";
import CartPanel from "../components/CartPanel";
import SignModal from "../components/SignModal";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../store/slices/userSlice";

export default function Gnb() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [bgColor, setBgColor] = useState("transparent");
  const [textColor, setTextColor] = useState("text-white");
  const [signModalOpen, setSignModalOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false); // 드롭다운 메뉴 상태

  const userMenuRef = useRef<HTMLDivElement>(null); // 드롭다운 영역을 감지하기 위한 ref

  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Redux에서 유저 상태를 가져옴
  const user = useSelector((state: any) => state.user.user);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const toggleCart = () => {
    setCartOpen(!cartOpen);
  };

  const toggleSignModal = () => {
    setSignModalOpen(!signModalOpen);
  };

  const toggleUserMenu = () => {
    setUserMenuOpen(!userMenuOpen); // 유저 드롭다운 메뉴 토글
  };

  const handleScroll = () => {
    if (window.scrollY > 100) {
      setBgColor("bg-black");
    } else {
      setBgColor("transparent");
    }
  };

  useEffect(() => {
    if (location.pathname === "/") {
      setBgColor("transparent");
      setTextColor("text-white");
      window.addEventListener("scroll", handleScroll);
    } else {
      setBgColor("bg-white shadow-xl");
      setTextColor("text-black");
    }

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [location]);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleLogout = () => {
    dispatch(logout());
    localStorage.removeItem("accessToken");
    localStorage.removeItem("user");
    setUserMenuOpen(false);
    navigate("/");
  };

  // 드롭다운 외부 클릭 감지 로직
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(event.target as Node)
      ) {
        setUserMenuOpen(false);
      }
    };

    if (userMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [userMenuOpen]);

  return (
    <div className={`sticky top-0 w-full py-8 z-10 ${bgColor}`}>
      <header className="flex justify-between px-3 xl:px-8 items-center mx-auto xl:w-[1280px]">
        <nav className="flex gap-8 items-center">
          <Link
            to="/"
            onClick={scrollToTop}
            className="flex items-center text-4xl xl:text-5xl font-semibold text-blue-700 hover:text-blue-800"
          >
            <GiFishbone />
            Danak
          </Link>
          <div className={`hidden md:flex gap-8 text-xl ${textColor}`}>
            <Link
              to="/products"
              className={`hover:text-blue-700 ${
                location.pathname === "/products" ? "text-blue-700" : ""
              }`}
            >
              Products
            </Link>
            <Link
              to="/community"
              className={`hover:text-blue-700 ${
                location.pathname === "/community" ? "text-blue-700" : ""
              }`}
            >
              Community
            </Link>
            <Link
              to="/contact"
              className={`hover:text-blue-700 ${
                location.pathname === "/contact" ? "text-blue-700" : ""
              }`}
            >
              Contact us
            </Link>
          </div>
        </nav>
        <nav className="flex gap-2 xl:gap-5 items-center text-md sm:text-xl">
          <button
            className="p-2 rounded-full border-2 bg-white hover:text-blue-700"
            onClick={toggleCart}
          >
            <FiShoppingCart />
          </button>
          <button
            className="md:hidden p-2 rounded-full border-2 bg-white hover:text-blue-700"
            onClick={toggleMenu}
          >
            <HiMenu />
          </button>

          {user ? (
            <div className="relative" ref={userMenuRef}>
              <button
                onClick={toggleUserMenu}
                className="flex items-center gap-1 p-2 rounded-lg text-white border-2 border-blue-700 bg-blue-700 hover:bg-blue-800"
              >
                <FaRegUser />
                {user.nickname || user.name}
              </button>

              {userMenuOpen && (
                <div className="absolute flex flex-col right-0 mt-2 w-max bg-white rounded shadow-xl">
                  <Link to="/mypage">
                    <p className="flex items-center gap-1 px-4 py-2 bg-blue-700 text-white rounded-t">
                      <FaRegUser />
                      {user}
                    </p>

                    <p className="text-base px-4 py-2 hover:bg-blue-100">
                      MyPage
                    </p>
                  </Link>
                  <button
                    className="w-full text-left text-base px-4 py-2 hover:bg-blue-100"
                    onClick={handleLogout}
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={toggleSignModal}
              className="p-2 rounded-full bg-white border-2 hover:text-blue-700"
            >
              <FaRegUser />
            </button>
          )}
        </nav>
      </header>
      {menuOpen && (
        <div
          className={`absolute w-full md:hidden flex flex-col gap-3 text-xl px-8 py-5 shadow-xl ${bgColor} ${textColor}`}
        >
          <Link
            to="/products"
            onClick={toggleMenu}
            className={`hover:text-blue-700 ${
              location.pathname === "/products" ? "text-blue-700" : ""
            }`}
          >
            Products
          </Link>
          <Link
            to="/community"
            onClick={toggleMenu}
            className={`hover:text-blue-700 ${
              location.pathname === "/community" ? "text-blue-700" : ""
            }`}
          >
            Community
          </Link>
          <Link
            to="/contact"
            onClick={toggleMenu}
            className={`hover:text-blue-700 ${
              location.pathname === "/contact" ? "text-blue-700" : ""
            }`}
          >
            Contact us
          </Link>
        </div>
      )}
      <CartPanel isOpen={cartOpen} onClose={toggleCart} />
      <SignModal isOpen={signModalOpen} onClose={toggleSignModal} />
    </div>
  );
}
