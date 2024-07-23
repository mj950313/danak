import { useState } from "react";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay, A11y } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import ProductCard from "../components/ProductCard";
import Title from "../components/Title";

const products = [
  {
    id: 1,
    name: "BIXOD N MOUNTAIN STREAM",
    description: "(빅소드 엔 마운틴 스트림)",
    price: "290,000원",
    image: "/path/to/image1.jpg",
    new: true,
  },
  {
    id: 2,
    name: "INK N AIR",
    description: "잉크 엔 에어 쭈꾸미 갑오징어 낚싯대",
    price: "330,000원",
    image: "/path/to/image2.jpg",
    new: true,
  },
  {
    id: 3,
    name: "40주년 로드",
    description: "40주년 한정판)배스,참돔,오징어,갑오징어,광어",
    price: "410,000원",
    image: "/path/to/image3.jpg",
    new: false,
  },
  {
    id: 4,
    name: "BIXOD N BLACK LABEL",
    description: "(BIXOD N BLACK LABEL)배스",
    price: "500,000원",
    image: "/path/to/image4.jpg",
    new: true,
  },
  {
    id: 5,
    name: "BIXOD N BLACK LABEL",
    description: "(BIXOD N BLACK LABEL)배스",
    price: "500,000원",
    image: "/path/to/image4.jpg",
    new: true,
  },
];

export default function ProductDetailPage() {
  const [quantity, setQuantity] = useState(1);

  const handleIncrement = () => {
    setQuantity(quantity + 1);
  };

  const handleDecrement = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  return (
    <div className="xl:w-[1280px] mx-auto px-3 xl:px-8 my-24">
      <div className="flex flex-col md:flex-row justify-between gap-10">
        <div className="xl:w-1/2 w-full h-auto">
          <img
            src="/"
            alt="product"
            className="w-full pb-[100%] object-contain border-2"
          />
        </div>

        <div className="flex flex-col gap-8 xl:w-1/2 w-full">
          <h1 className="text-2xl font-medium">존나개쩌는 낚싯대!!!</h1>
          <div className="flex gap-5">
            <div className="flex flex-col gap-5">
              <p className="text-lg text-blue-500">판매가</p>
              <p>제조국</p>
              <p>국내∙해외배송</p>
              <p>배송방법</p>
              <p>배송비</p>
              <p>ITEM</p>
              <p className="text-sm">(최소주문수량 1개 이상)</p>
            </div>
            <div className="flex flex-col gap-5">
              <p className="text-lg text-blue-500">78,000원</p>
              <p>대한민국</p>
              <p>국내배송</p>
              <p>택배</p>
              <p>3000원</p>
              <div className="flex items-center gap-4">
                <button onClick={handleDecrement} className="border px-3 py-1">
                  -
                </button>
                <p>{quantity}</p>
                <button onClick={handleIncrement} className="border px-3 py-1">
                  +
                </button>
              </div>
            </div>
          </div>
          <div className="flex h-full items-center">
            <p className="text-2xl">TOTAL 78,000원</p>
          </div>
          <div className="flex gap-8">
            <button className="text-2xl w-1/2 py-5 text-center text-white bg-blue-500/70 hover:bg-blue-500">
              BUY IT NOW
            </button>
            <button className="text-2xl w-1/2 py-5 text-center text-blue-500/70 border-blue-500/70 border hover:text-blue-500 hover:border-blue-500">
              CART
            </button>
          </div>
        </div>
      </div>
      <Title title="All Products" title2="모든 상품들을 만나보세요" />
      <Swiper
        modules={[Navigation, Pagination, Autoplay, A11y]}
        spaceBetween={10}
        slidesPerView={4}
        navigation
        pagination={{ clickable: true }}
        autoplay={{ delay: 6000 }}
        breakpoints={{
          1024: {
            slidesPerView: 4,
          },
          768: {
            slidesPerView: 3,
          },
          640: {
            slidesPerView: 2,
          },
          320: {
            slidesPerView: 2,
          },
        }}
      >
        {products.map((product) => (
          <SwiperSlide key={product.id} className="pb-12">
            <Link to={`/products/${product.id}`}>
              <ProductCard key={product.id} product={product} />
            </Link>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
