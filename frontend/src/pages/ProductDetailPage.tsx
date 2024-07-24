import { useState } from "react";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay, A11y } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import ProductCard from "../components/ProductCard";
import Title from "../components/Title";
import TabBar from "../components/TabBar";

const products = [
  {
    id: 1,
    name: "BIXOD N MOUNTAIN STREAM",
    description: "(빅소드 엔 마운틴 스트림)",
    price: "290,000원",
    image: "/path/to/image1.jpg",
    new: true,
  },
  // ... other products
];

export default function ProductDetailPage() {
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("detail");

  const handleIncrement = () => {
    setQuantity(quantity + 1);
  };

  const handleDecrement = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const tabs = [
    { label: "Detail", value: "detail" },
    { label: "Review", value: "reviews" },
  ];

  return (
    <div className="xl:w-[1280px] mx-auto px-3 xl:px-8 my-24">
      {/* Product Details */}
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

      <TabBar tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />

      {activeTab === "detail" && (
        <div className="mb-20">
          <div className="md:w-1/2 w-full h-auto mb-10">
            <img
              src="/"
              alt="product"
              className="w-full pb-[100%] object-contain border-2"
            />
          </div>
          <h1 className="text-3xl font-bold">프리미엄 낚싯대</h1>
          <p className="text-lg mt-4">
            이 제품은 최고급 소재로 제작되었습니다. 모든 낚시 애호가들이
            추천하는 제품입니다.
          </p>
          <ul className="mt-4 space-y-2">
            <li>경량 설계로 장시간 사용에도 피로감이 적습니다.</li>
            <li>내구성이 뛰어나 오랫동안 사용할 수 있습니다.</li>
            <li>정밀한 조작이 가능하여 다양한 낚시 상황에 적합합니다.</li>
          </ul>
          <div className="mt-6">
            <h2 className="text-xl font-semibold">사용 설명</h2>
            <p className="mt-2">
              초보자부터 전문가까지 모두에게 적합한 낚싯대입니다. 다양한 어종을
              낚을 수 있도록 설계되었습니다.
            </p>
          </div>
          <div className="mt-6">
            <h2 className="text-xl font-semibold">구성품</h2>
            <p className="mt-2">
              구성품: 낚싯대 본체, 보호 케이스, 추가 악세서리
            </p>
          </div>
          <div className="mt-6">
            <h2 className="text-xl font-semibold">주의사항</h2>
            <p className="mt-2">
              사용 후 깨끗이 세척하여 보관하십시오. 아이들의 손이 닿지 않는 곳에
              보관해 주세요.
            </p>
          </div>
        </div>
      )}

      {activeTab === "reviews" && (
        <div className="mb-20">
          <h2 className="text-2xl font-semibold">리뷰</h2>
          <p className="mt-2">
            아직 리뷰가 없습니다. 첫 번째 리뷰를 작성해보세요!
          </p>
        </div>
      )}

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
          <SwiperSlide key={product.id}>
            <Link to={`/products/${product.id}`}>
              <ProductCard key={product.id} product={product} />
            </Link>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
