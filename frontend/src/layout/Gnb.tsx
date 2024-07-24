import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { FiShoppingCart } from "react-icons/fi";
import { FaRegUser } from "react-icons/fa";
import { HiMenu } from "react-icons/hi";
import { GiFishbone } from "react-icons/gi";
import CartPanel from "../components/CartPanel";

export default function Gnb() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [bgColor, setBgColor] = useState("transparent");
  const [textColor, setTextColor] = useState("text-white");
  const location = useLocation();

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const toggleCart = () => {
    setCartOpen(!cartOpen);
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

  return (
    <div className={`sticky top-0 w-full py-8 z-10 ${bgColor}`}>
      <header className="flex justify-between px-3 xl:px-8 items-center mx-auto xl:w-[1280px]">
        <nav className="flex gap-8 items-center">
          <Link
            to="/"
            onClick={scrollToTop}
            className="flex items-center text-4xl xl:text-5xl font-semibold text-blue-500"
          >
            <GiFishbone />
            Danak
          </Link>
          <div className={`hidden md:flex gap-8 text-xl ${textColor}`}>
            <Link
              to="/products"
              className={`hover:text-blue-500 ${
                location.pathname === "/products" ? "text-blue-500" : ""
              }`}
            >
              Products
            </Link>
            <Link
              to="/community"
              className={`hover:text-blue-500 ${
                location.pathname === "/community" ? "text-blue-500" : ""
              }`}
            >
              Community
            </Link>
            <Link
              to="/contact"
              className={`hover:text-blue-500 ${
                location.pathname === "/contact" ? "text-blue-500" : ""
              }`}
            >
              Contact us
            </Link>
          </div>
        </nav>
        <nav className="flex gap-2 xl:gap-5 items-center text-md sm:text-xl">
          <button
            className="p-2 rounded-full bg-white border-2 hover:text-blue-500 hover:border-blue-500"
            onClick={toggleCart}
          >
            <FiShoppingCart />
          </button>
          <Link
            className="p-2 rounded-full bg-white border-2 hover:text-blue-500 hover:border-blue-500"
            to="/signin"
          >
            <FaRegUser />
          </Link>
          <button
            className="md:hidden p-2 rounded-full bg-white border-2 hover:text-blue-500 hover:border-blue-500"
            onClick={toggleMenu}
          >
            <HiMenu />
          </button>
        </nav>
      </header>
      {menuOpen && (
        <div
          className={`absolute w-full md:hidden flex flex-col gap-3 text-xl px-8 py-5 shadow-xl ${bgColor} ${textColor}`}
        >
          <Link
            to="/products"
            onClick={toggleMenu}
            className={`hover:text-blue-500 ${
              location.pathname === "/products" ? "text-blue-500" : ""
            }`}
          >
            Products
          </Link>
          <Link
            to="/community"
            onClick={toggleMenu}
            className={`hover:text-blue-500 ${
              location.pathname === "/community" ? "text-blue-500" : ""
            }`}
          >
            Community
          </Link>
          <Link
            to="/contact"
            onClick={toggleMenu}
            className={`hover:text-blue-500 ${
              location.pathname === "/contact" ? "text-blue-500" : ""
            }`}
          >
            Contact us
          </Link>
        </div>
      )}
      <CartPanel isOpen={cartOpen} onClose={toggleCart} />
    </div>
  );
}
