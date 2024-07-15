import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { IoSearchSharp } from "react-icons/io5";
import { FiShoppingCart } from "react-icons/fi";
import { FaRegUser } from "react-icons/fa";
import { HiMenu } from "react-icons/hi";
import { GiFishbone } from "react-icons/gi";

export default function Gnb() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [bgColor, setBgColor] = useState("transparent");
  const location = useLocation();

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const handleScroll = () => {
    if (window.scrollY > 100) {
      // 헤더 높이만큼의 스크롤 위치를 설정합니다.
      setBgColor("bg-black");
    } else {
      setBgColor("transparent");
    }
  };

  useEffect(() => {
    if (location.pathname !== "/") {
      setBgColor("bg-black");
    } else {
      setBgColor("transparent");
      window.addEventListener("scroll", handleScroll);
      return () => {
        window.removeEventListener("scroll", handleScroll);
      };
    }
  }, [location]);

  return (
    <div
      className={`sticky top-0 w-full py-8 z-10 transition-colors duration-300 ${bgColor}`}
    >
      <header className="flex justify-between px-3 xl:px-8 items-center mx-auto xl:w-[1280px]">
        <nav className="flex gap-8 items-center">
          <Link
            to="/"
            className="flex items-center text-3xl sm:text-4xl xl:text-5xl font-semibold text-blue-500"
          >
            <GiFishbone />
            Danak
          </Link>
          <div className="hidden md:flex gap-8 text-xl text-white">
            <Link to="/products" className="hover:text-blue-500">
              Products
            </Link>
            <Link to="/community" className="hover:text-blue-500">
              Community
            </Link>
            <Link to="/contact" className="hover:text-blue-500">
              Contact us
            </Link>
          </div>
        </nav>
        <nav className="flex gap-2 xl:gap-5 items-center text-xl">
          <Link
            className="p-2 rounded-full bg-white border hover:text-blue-500 hover:border-blue-500"
            to="/signin"
          >
            <IoSearchSharp />
          </Link>
          <Link
            className="p-2 rounded-full bg-white border hover:text-blue-500 hover:border-blue-500"
            to="/signin"
          >
            <FiShoppingCart />
          </Link>
          <Link
            className="p-2 rounded-full bg-white border hover:text-blue-500 hover:border-blue-500"
            to="/signin"
          >
            <FaRegUser />
          </Link>
          <button
            className="md:hidden p-2 rounded-full bg-white border hover:text-blue-500 hover:border-blue-500"
            onClick={toggleMenu}
          >
            <HiMenu />
          </button>
        </nav>
      </header>
      {menuOpen && (
        <div className="md:hidden flex flex-col gap-4 text-white text-xl mt-4 px-8">
          <Link
            to="/products"
            onClick={toggleMenu}
            className="hover:text-blue-500"
          >
            Products
          </Link>
          <Link
            to="/community"
            onClick={toggleMenu}
            className="hover:text-blue-500"
          >
            Community
          </Link>
          <Link
            to="/contact"
            onClick={toggleMenu}
            className="hover:text-blue-500"
          >
            Contact us
          </Link>
        </div>
      )}
    </div>
  );
}
