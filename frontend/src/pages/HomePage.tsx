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

const stories = [
  {
    id: 1,
    name: "Fishing Adventure",
    description: "A thrilling fishing adventure",
    image: "/path/to/image1.jpg",
    new: true,
    user: {
      name: "John Doe",
    },
  },
  {
    id: 2,
    name: "River Exploration",
    description: "Exploring the river",
    image: "/path/to/image2.jpg",
    new: true,
    user: {
      name: "Jane Smith",
    },
  },
  {
    id: 3,
    name: "River Exploration",
    description: "Exploring the river",
    image: "/path/to/image2.jpg",
    new: true,
    user: {
      name: "Jane Smith",
    },
  },
  {
    id: 4,
    name: "River Exploration",
    description: "Exploring the river",
    image: "/path/to/image2.jpg",
    new: true,
    user: {
      name: "Jane Smith",
    },
  },
  {
    id: 5,
    name: "River Exploration",
    description: "Exploring the river",
    price: "$150",
    image: "/path/to/image2.jpg",
    new: true,
    user: {
      name: "Jane Smith",
    },
  },
];

export default function HomePage() {
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
            <SwiperSlide key={product.id}>
              <Link to={`/products/${product.id}`}>
                <ProductCard key={product.id} product={product} />
              </Link>
            </SwiperSlide>
          ))}
        </Swiper>
        <Title title="Danak's story" title2="새로운 이야기들을 나눠보세요" />
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
            <SwiperSlide key={story.id}>
              <StoryCard key={story.id} story={story} />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
}
