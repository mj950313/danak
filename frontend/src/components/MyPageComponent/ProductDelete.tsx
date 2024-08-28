import ProductCard from "../ProductCard";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Popconfirm, message, Pagination } from "antd";
import api from "../../api/api";
import { useSelector } from "react-redux";
import { CiWarning } from "react-icons/ci";
import { useState } from "react";
import { IoClose } from "react-icons/io5";

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

export default function ProductDelete() {
  const queryClient = useQueryClient();
  const accessToken = useSelector((state: any) => state.user.accessToken);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(12);

  const fetchProducts = async (page: number, limit: number) => {
    const response = await api.get(`/api/products?page=${page}&limit=${limit}`);
    return response.data;
  };

  const deleteProduct = async (id: string): Promise<void> => {
    const response = await api.delete(`/api/products/delete/${id}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    console.log(response);
  };

  const { data, isLoading, isError } = useQuery({
    queryKey: ["products", currentPage],
    queryFn: () => fetchProducts(currentPage, pageSize),
  });

  const mutation = useMutation<void, Error, string>({
    mutationFn: deleteProduct,
    onSuccess: () => {
      message.success("상품이 삭제되었습니다.");
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
    onError: () => {
      message.error("상품 삭제에 실패했습니다.");
    },
  });

  const handleDelete = (_id: string) => {
    mutation.mutate(_id);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[600px]">
        <p className="text-black text-xl font-semibold">로딩 중...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex justify-center items-center h-[600px]">
        <p className="text-red-500 text-xl font-semibold">
          데이터를 불러오는 중 오류가 발생했습니다.
        </p>
      </div>
    );
  }

  // 상품이 없을 경우 메시지 출력
  if (data.length === 0) {
    return (
      <div className="flex justify-center items-center h-[600px]">
        <p className="text-black text-xl font-semibold flex flex-col items-center">
          <CiWarning className="text-blue-500 text-4xl" />
          등록된 상품이 없습니다.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-[700px]">
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3">
        {data.products.map((product: Product) => (
          <div key={data._id} className="relative">
            <ProductCard product={product} />

            <Popconfirm
              title="정말 삭제하시겠습니까?"
              onConfirm={() => handleDelete(product._id)}
              okText="예"
              cancelText="아니요"
            >
              <IoClose className="absolute right-2 top-2 text-3xl hover:scale-150 cursor-pointer text-blue-300" />
            </Popconfirm>
          </div>
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
  );
}
