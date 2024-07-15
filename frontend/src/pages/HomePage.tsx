import Title from "../components/Title";
import Youtube from "../components/HomeComponent/Youtube";
import ProductCard from "../components/ProductCard";
import StoryCard from "../components/HomeComponent/StoryCard";

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
    price: "$100",
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
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
        <Title title="Danak's story" title2="새로운 이야기들을 나눠보세요" />
        <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-3">
          {stories.map((story) => (
            <StoryCard key={story.id} story={story} />
          ))}
        </div>
      </div>
      <img
        src="/footer.png"
        alt="footer"
        className="w-full h-48 object-cover"
      />
    </div>
  );
}
