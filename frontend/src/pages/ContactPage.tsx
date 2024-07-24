import KakaoMap from "../components/ContactComponent/KakaoMap";
import { FaFacebookF, FaTwitter, FaInstagram, FaYoutube } from "react-icons/fa";

export default function ContactPage() {
  return (
    <div className="bg-[url('/contact.png')] bg-repeat-x bg-blend-multiply bg-blue-300">
      <div className="flex flex-col md:flex-row gap-3 justify-between xl:items-center xl:w-[1280px] mx-auto px-3 xl:px-8 py-10 xl:py-20 ">
        <h1 className="text-white text-5xl font-bold flex flex-col gap-3  py-28 xl:py-24 w-[250px]">
          Contact Us
          <p className="text-white text-2xl">문의하기</p>
        </h1>

        <div className="mb-4 md:mb-0 p-5 shadow-lg bg-white/30 ">
          <p className="mb-4 ">
            <strong className="text-xl ">Address</strong>
            <br /> Simgok-dong, Seo-gu, Incheon Metropolitan City
          </p>
          <p className="mb-4">
            <strong className="text-xl">Phone</strong>
            <br /> (032) 560-2400
          </p>
          <p className="mb-4">
            <strong className="text-xl">Email</strong>
            <br /> danak@example.com
          </p>
          <p className="mb-4">
            <strong className="text-xl">Open Time</strong>
            <br /> Our store has re-opened for shopping, exchange Every day 11am
            to 7pm
          </p>
          <div className="flex my-2">
            <a href="#" className="mr-2">
              <FaFacebookF />
            </a>
            <a href="#" className="mr-2">
              <FaTwitter />
            </a>
            <a href="#" className="mr-2">
              <FaInstagram />
            </a>
            <a href="#" className="mr-2">
              <FaYoutube />
            </a>
          </div>
        </div>
      </div>

      <div className="border bg-white">
        <div className="flex flex-col md:flex-row justify-between xl:w-[1280px] mx-auto px-3 xl:px-8 py-8">
          <KakaoMap />
        </div>
      </div>
    </div>
  );
}
