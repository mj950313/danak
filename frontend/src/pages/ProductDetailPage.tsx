import { useState } from "react";
import { useParams } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay, A11y } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import ProductCard from "../components/ProductCard";
import Title from "../components/Title";
import TabBar from "../components/TabBar";
import axios from "axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import AuthenticationModal from "../components/AuthenticationModal";
import { useSelector } from "react-redux";
import { message } from "antd";
import api from "../api/api";
import CartPanel from "../components/CartPanel";
import { MoonLoader } from "react-spinners";

export default function ProductDetailPage() {
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("detail");
  const { id } = useParams();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const userId = useSelector((state: any) => state.user.userId);
  const accessToken = useSelector((state: any) => state.accessToken);
  const [cartOpen, setCartOpen] = useState(false);
  const queryClient = useQueryClient();

  const fetchProductDetail = async (id: string) => {
    const response = await axios.get(
      `http://localhost:8080/api/products/${id}`
    );
    return response.data;
  };

  const {
    data,
    isLoading: detailLoading,
    isError: detailError,
  } = useQuery({
    queryKey: ["product"],
    queryFn: () => fetchProductDetail(id!),
    enabled: !!id,
  });

  const fetchProducts = async () => {
    const response = await axios.get("http://localhost:8080/api/products");
    return response.data.products;
  };

  const {
    data: products = [],
    isLoading: productsLoading,
    isError: productsError,
  } = useQuery({
    queryKey: ["products"],
    queryFn: fetchProducts,
  });

  //장바구니
  const addToCart = async ({
    productId,
    quantity,
    productName,
    productImage,
    price,
  }: any) => {
    const response = await api.post(
      "http://localhost:8080/api/cart/add",
      {
        productId,
        quantity,
        productName,
        productImage,
        price,
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    return response.data;
  };

  const addToCartMutation = useMutation({
    mutationFn: () =>
      addToCart({
        productId: id,
        quantity,
        productName: data.productName,
        productImage: data.productImage,
        price: data.price,
      }),
    onSuccess: () => {
      message.success("장바구니에 추가되었습니다!");
      setCartOpen(true);
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
    onError: () => {
      message.error("장바구니 추가에 실패했습니다.");
    },
  });

  const handleAddToCart = () => {
    if (!userId) {
      setShowLoginModal(true);
    } else {
      addToCartMutation.mutate();
    }
  };

  if (detailLoading || productsLoading)
    return (
      <div className="flex justify-center items-center h-[680px]">
        <MoonLoader color="#1E40AF" />
      </div>
    );
  if (detailError || productsError)
    return <p>상품을 불러오는 중 오류가 발생했습니다.</p>;

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
      <div className="flex flex-col md:flex-row justify-between gap-10">
        <div className="xl:w-1/2 w-full h-auto">
          <img
            src={data.productImage}
            alt="product"
            className="w-full object-cover"
            style={{ aspectRatio: "1/1" }}
          />
        </div>
        <div className="flex flex-col gap-8 xl:w-1/2 w-full">
          <h1 className="text-2xl font-medium">{data.productName}</h1>
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
              <p className="text-lg text-blue-500">
                {data.price.toLocaleString()}원
              </p>
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
            <p className="text-2xl">
              TOTAL {(data.price * quantity).toLocaleString()}원
            </p>
          </div>
          <div className="flex gap-8">
            <button
              onClick={handleAddToCart}
              className="text-2xl w-1/2 py-5 text-center text-white bg-blue-500/70 hover:bg-blue-500"
            >
              BUY IT NOW
            </button>
            <button
              onClick={handleAddToCart}
              className="text-2xl w-1/2 py-5 text-center text-blue-500/70 border-blue-500/70 border hover:text-blue-500 hover:border-blue-500"
            >
              CART
            </button>
          </div>
        </div>
      </div>

      <TabBar tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />

      {activeTab === "detail" && (
        <div className="mb-20">
          <h3 className="text-3xl font-bold mb-10">{data.description}</h3>

          {data.detailImages.map((detailImage: string, index: number) => (
            <div
              key={index}
              className=" w-full h-auto mb-10 flex justify-center"
            >
              <img src={detailImage} alt="productDetialImage" />
            </div>
          ))}
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

      <Title
        title="New Products"
        title2="새롭게 입고된 신상품들을 만나보세요"
      />
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
        {products?.map((product: any) => (
          <SwiperSlide key={product._id}>
            <a href={`/products/${product._id}`}>
              <ProductCard key={product._id} product={product} />
            </a>
          </SwiperSlide>
        ))}
      </Swiper>

      {showLoginModal && (
        <AuthenticationModal
          visible={showLoginModal}
          onClose={() => setShowLoginModal(false)}
        />
      )}

      <CartPanel isOpen={cartOpen} onClose={() => setCartOpen(false)} />
    </div>
  );
}
