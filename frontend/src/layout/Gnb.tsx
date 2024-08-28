import { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FiShoppingCart } from "react-icons/fi";
import { FaRegUser } from "react-icons/fa";
import { HiMenu } from "react-icons/hi";
import { GiFishbone } from "react-icons/gi";
import CartPanel from "../components/CartPanel";
import SignModal from "../components/SignModal";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../store/slices/userSlice";
import { useQueryClient } from "@tanstack/react-query";
import { persistor } from "../store/store";
import { resetCart } from "../store/slices/cartSlice";
import api from "../api/api";

export default function Gnb() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [bgColor, setBgColor] = useState("transparent");
  const [textColor, setTextColor] = useState("text-white");
  const [signModalOpen, setSignModalOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const queryClient = useQueryClient();
  const totalItems = useSelector((state: any) => state.cart.totalItems);

  const userMenuRef = useRef<HTMLDivElement>(null);

  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

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
    setUserMenuOpen(!userMenuOpen);
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

  const handleLogout = async () => {
    try {
      await api.post("/api/auth/logout");
      dispatch(logout());
      queryClient.clear();
      dispatch(resetCart());
      persistor.purge();
      setUserMenuOpen(false);
      navigate("/");
    } catch (err) {
      console.log(err);
    }
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
          <a
            href="/"
            onClick={scrollToTop}
            className="flex items-center text-4xl xl:text-5xl font-semibold text-blue-700 hover:text-blue-800"
          >
            <GiFishbone />
            Danak
          </a>
          <div className={`hidden md:flex gap-8 text-xl ${textColor}`}>
            <a
              href="/products"
              className={`hover:text-blue-700 ${
                location.pathname === "/products" ? "text-blue-700" : ""
              }`}
            >
              Products
            </a>
            <a
              href="/community"
              className={`hover:text-blue-700 ${
                location.pathname === "/community" ? "text-blue-700" : ""
              }`}
            >
              Community
            </a>
            <a
              href="/contact"
              className={`hover:text-blue-700 ${
                location.pathname === "/contact" ? "text-blue-700" : ""
              }`}
            >
              Contact us
            </a>
          </div>
        </nav>
        <nav className="flex gap-2 xl:gap-5 items-center text-md sm:text-xl">
          <div className="relative">
            <button
              className="p-2 rounded-full border-2 bg-white hover:text-blue-700"
              onClick={toggleCart}
            >
              <FiShoppingCart />
            </button>
            {totalItems > 0 && (
              <div className="absolute top-[-6px] right-[-6px] w-5 h-5 text-center text-sm bg-blue-400 text-white rounded-full">
                {totalItems}
              </div>
            )}
          </div>
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
                  <a href="/mypage">
                    <p className="flex items-center gap-1 px-4 py-2 bg-blue-700 text-white rounded-t">
                      <FaRegUser />
                      {user}
                    </p>

                    <p className="text-base px-4 py-2 hover:bg-blue-100">
                      MyPage
                    </p>
                  </a>
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
          <a
            href="/products"
            onClick={toggleMenu}
            className={`hover:text-blue-700 ${
              location.pathname === "/products" ? "text-blue-700" : ""
            }`}
          >
            Products
          </a>
          <a
            href="/community"
            onClick={toggleMenu}
            className={`hover:text-blue-700 ${
              location.pathname === "/community" ? "text-blue-700" : ""
            }`}
          >
            Community
          </a>
          <a
            href="/contact"
            onClick={toggleMenu}
            className={`hover:text-blue-700 ${
              location.pathname === "/contact" ? "text-blue-700" : ""
            }`}
          >
            Contact us
          </a>
        </div>
      )}
      <CartPanel isOpen={cartOpen} onClose={toggleCart} />
      <SignModal isOpen={signModalOpen} onClose={toggleSignModal} />
    </div>
  );
}
