import React from "react";
import { Link } from "react-router-dom";
import { FaFacebookF, FaTwitter, FaInstagram, FaYoutube } from "react-icons/fa";

const Footer: React.FC = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div>
      <img
        src="/footer.png"
        alt="footer"
        className="w-full h-48 object-cover"
      />
      <footer className="bg-[#030712] text-white py-12">
        <div className="xl:w-[1280px] px-3 xl:px-8 mx-auto">
          <div className="flex flex-col md:flex-row justify-between">
            <div className="mb-8 md:mb-0">
              <h2
                className="text-2xl font-bold mb-4 cursor-pointer"
                onClick={scrollToTop}
              >
                Danak
              </h2>
              <p className="text-gray-400  pb-3">
                Your ultimate destination for fishing gear and community.
              </p>
              <div className="border-b-[3px] border-b-blue-500"></div>
            </div>

            {/* 링크 섹션 */}
            <div className="flex md:flex-row gap-8 ml-3">
              <div>
                <h3 className="font-semibold mb-4">Products</h3>
                <ul>
                  <li className="mb-2">
                    <Link
                      to="/products"
                      className="text-gray-400 hover:text-white"
                    >
                      All Products
                    </Link>
                  </li>
                  <li className="mb-2">
                    <Link
                      to="/products"
                      className="text-gray-400 hover:text-white"
                    >
                      New Arrivals
                    </Link>
                  </li>
                  <li className="mb-2">
                    <Link
                      to="/products"
                      className="text-gray-400 hover:text-white"
                    >
                      Best Sellers
                    </Link>
                  </li>
                  <li className="mb-2">
                    <Link
                      to="/products"
                      className="text-gray-400 hover:text-white"
                    >
                      Sale
                    </Link>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-4">Community</h3>
                <ul>
                  <li className="mb-2">
                    <Link
                      to="/community"
                      className="text-gray-400 hover:text-white"
                    >
                      Forums
                    </Link>
                  </li>
                  <li className="mb-2">
                    <Link
                      to="/community"
                      className="text-gray-400 hover:text-white"
                    >
                      Events
                    </Link>
                  </li>
                  <li className="mb-2">
                    <Link
                      to="/community"
                      className="text-gray-400 hover:text-white"
                    >
                      Blogs
                    </Link>
                  </li>
                  <li className="mb-2">
                    <Link
                      to="/community"
                      className="text-gray-400 hover:text-white"
                    >
                      Gallery
                    </Link>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-4">Support</h3>
                <ul>
                  <li className="mb-2">
                    <Link
                      to="/contact"
                      className="text-gray-400 hover:text-white"
                    >
                      Contact Us
                    </Link>
                  </li>
                  <li className="mb-2">
                    <Link
                      to="/contact"
                      className="text-gray-400 hover:text-white"
                    >
                      FAQ
                    </Link>
                  </li>
                  <li className="mb-2">
                    <Link
                      to="/contact"
                      className="text-gray-400 hover:text-white"
                    >
                      Shipping & Returns
                    </Link>
                  </li>
                  <li className="mb-2">
                    <Link
                      to="/contact"
                      className="text-gray-400 hover:text-white"
                    >
                      Warranty
                    </Link>
                  </li>
                </ul>
              </div>
            </div>

            {/* 소셜 미디어 섹션 */}
            <div className="flex flex-col items-center md:items-end">
              <h3 className="font-semibold mb-4">Follow Us</h3>
              <div className="flex gap-4">
                <a className="text-gray-400 hover:text-white">
                  <FaFacebookF />
                </a>
                <a className="text-gray-400 hover:text-white">
                  <FaTwitter />
                </a>
                <a className="text-gray-400 hover:text-white">
                  <FaInstagram />
                </a>
                <a className="text-gray-400 hover:text-white">
                  <FaYoutube />
                </a>
              </div>
            </div>
          </div>
          <div className="text-center text-gray-400 text-sm mt-8">
            &copy; 2023 Danak. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Footer;
