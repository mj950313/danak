import { useState } from "react";
import Title from "../components/Title";
import ProductCard from "../components/ProductCard";
import { CiWarning } from "react-icons/ci";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { Tabs, Pagination } from "antd";
import { MoonLoader } from "react-spinners";

// Product 타입 정의
interface Product {
  _id: string;
  name: string;
  description: string;
  price: string;
  image: string;
  category: string;
  productImage: string;
  productName: string;
}

export default function ProductPage() {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize] = useState<number>(12);
  const [activeCategory, setActiveCategory] = useState<string>("전체");

  const fetchProducts = async (
    page: number,
    limit: number,
    category: string
  ) => {
    const response = await axios.get(
      `http://localhost:8080/api/products?page=${page}&limit=${limit}&category=${category}`
    );
    return response.data;
  };

  const { data, isLoading, isError } = useQuery({
    queryKey: ["products", currentPage, activeCategory],
    queryFn: () => fetchProducts(currentPage, pageSize, activeCategory),
  });

  const [title, setTitle] = useState<string>("All Products");
  const [subtitle, setSubtitle] = useState<string>("전체 상품들을 만나보세요");

  const handleTabChange = (key: string) => {
    setActiveCategory(key);
    setCurrentPage(1);
    switch (key) {
      case "전체":
        setTitle("All Products");
        setSubtitle("모든 상품을 만나보세요");
        break;
      case "바다":
        setTitle("Saltwater Fishing");
        setSubtitle("바다 낚시용품을 만나보세요");
        break;
      case "민물":
        setTitle("Freshwater Fishing");
        setSubtitle("민물 낚시용품을 만나보세요");
        break;
      case "루어":
        setTitle("Lure Fishing");
        setSubtitle("루어 낚시용품을 만나보세요");
        break;
      case "낚시용품":
        setTitle("Fishing Accessories");
        setSubtitle("낚시 악세서리를 만나보세요");
        break;
      default:
        setTitle("All Products");
        setSubtitle("모든 상품을 만나보세요");
        break;
    }
  };

  const tabItems = [
    { label: "전체", key: "전체" },
    { label: "바다", key: "바다" },
    { label: "민물", key: "민물" },
    { label: "루어", key: "루어" },
    { label: "낚시용품", key: "낚시용품" },
  ];

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[600px]">
        <MoonLoader color="#1E40AF" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex justify-center items-center h-[600px]">
        <p className="text-red-500 text-xl font-semibold">
          상품을 불러오는 중 오류가 발생했습니다.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-[url('/product.png')] bg-repeat-x bg-blend-multiply bg-blue-200">
      <div className="flex flex-col gap-3 xl:w-[1280px] mx-auto px-3 xl:px-8 py-28 xl:py-48">
        <h1 className="text-white text-4xl xl:text-5xl font-bold">
          Products <br />
        </h1>
        <p className="text-white text-xl xl:text-2xl">전체 상품</p>
      </div>

      <div className="border bg-white">
        <div className="xl:w-[1280px] mx-auto px-3 xl:px-8 my-10">
          <Tabs
            activeKey={activeCategory}
            onChange={handleTabChange}
            size="large"
            type="card"
            className="font-semibold text-4xl"
            items={tabItems}
          />

          <Title title={title} title2={subtitle} />

          {data?.products.length > 0 ? (
            <div>
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 min-h-[650px]">
                {data.products.map((product: Product) => (
                  <a href={`/products/${product._id}`} key={product._id}>
                    <ProductCard product={product} />
                  </a>
                ))}
              </div>

              <div className="mt-6 flex justify-center">
                <Pagination
                  current={currentPage}
                  pageSize={pageSize}
                  total={data?.totalProducts}
                  onChange={(page) => setCurrentPage(page)}
                />
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-[650px]">
              <p className="text-black text-xl font-semibold flex flex-col items-center">
                <CiWarning className="text-blue-500 text-4xl" />
                판매중인 상품이 없습니다.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
