import Title from "../components/Title";
import Youtube from "../components/HomeComponent/Youtube";
import ProductCard from "../components/ProductCard";
import StoryCard from "../components/HomeComponent/StoryCard";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay, A11y } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";

interface Product {
  _id: string;
  name: string;
  description: string;
  price: string;
  category: string;
  productImage: string;
  image: string;
  productName: string;
}

interface Story {
  _id: string;
  name: string;
  title: string;
  content: string;
  description: string;
  image: string;
  userInfo: {
    nickname: string;
  };
}

export default function HomePage() {
  // 상품 데이터를 fetch하는 함수
  const fetchProducts = async () => {
    const response = await axios.get("http://localhost:8080/api/products");
    console.log(response.data);

    return response.data.products;
  };

  const {
    data: products = [],
    isLoading: productsLoading,
    isError: productsError,
  } = useQuery<Product[], Error>({
    queryKey: ["products"],
    queryFn: fetchProducts,
  });

  // 스토리 데이터를 fetch하는 함수
  const fetchStories = async () => {
    const response = await axios.get("http://localhost:8080/api/community");
    return response.data.posts;
  };

  const {
    data: stories = [],
    isLoading: storiesLoading,
    isError: storiesError,
  } = useQuery<Story[], Error>({
    queryKey: ["stories"],
    queryFn: fetchStories,
  });

  if (productsLoading || storiesLoading) {
    return (
      <div className="flex justify-center items-center h-[600px]">
        <p className="text-black text-xl font-semibold">로딩 중...</p>
      </div>
    );
  }

  if (productsError || storiesError) {
    return (
      <div className="flex justify-center items-center h-[600px]">
        <p className="text-red-500 text-xl font-semibold">
          데이터를 불러오는 중 오류가 발생했습니다.
        </p>
      </div>
    );
  }

  return (
    <div>
      <Youtube />
      <div className="mt-[380px] xl:mt-[600px] text-black xl:w-[1280px] mx-auto px-3 xl:px-8 mb-10">
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
          {products.map((product) => (
            <SwiperSlide key={product._id}>
              <Link to={`/products/${product._id}`}>
                <ProductCard key={product._id} product={product} />
              </Link>
            </SwiperSlide>
          ))}
        </Swiper>

        <Title title="Danak's Story" title2="새로운 이야기들을 나눠보세요" />
        <Swiper
          modules={[Navigation, Pagination, Autoplay, A11y]}
          spaceBetween={10}
          slidesPerView={2}
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
          className="my-10"
        >
          {stories.map((story) => (
            <SwiperSlide key={story._id}>
              <Link to={`/community/${story._id}`}>
                <StoryCard key={story._id} story={story} />
              </Link>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
}
