import React from "react";
import { IoClose } from "react-icons/io5";
import api from "../api/api";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

interface CartPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

const CartPanel: React.FC<CartPanelProps> = ({ isOpen, onClose }) => {
  const accessToken = localStorage.getItem("accessToken");
  const queryClient = useQueryClient();

  const fetchCart = async () => {
    const response = await api.get("http://localhost:8080/api/cart", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data;
  };

  const { data, isLoading, isError } = useQuery({
    queryKey: ["cart"],
    queryFn: fetchCart,
    enabled: !!accessToken,
  });

  // 장바구니에서 상품을 삭제하는 함수
  const deleteCartItem = async (productId: string) => {
    const response = await api.delete(
      `http://localhost:8080/api/cart/delete/${productId}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    return response.data;
  };

  // 삭제 기능에 대한 Mutation
  const deleteMutation = useMutation({
    mutationFn: deleteCartItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] }); // 장바구니를 다시 불러오기
    },
  });

  const handleDelete = (productId: string) => {
    deleteMutation.mutate(productId);
  };

  if (isLoading) return <p>로딩 중...</p>;
  if (isError) return <p>장바구니를 불러오는 중 오류가 발생했습니다.</p>;

  return (
    <>
      <div
        className={`fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 z-10 ${
          isOpen ? "block" : "hidden"
        }`}
        onClick={onClose}
      />

      {/* 장바구니 패널 */}
      <div
        className={`fixed top-0 right-0 w-80 h-full bg-white shadow-xl transform ${
          isOpen ? "translate-x-0" : "translate-x-full"
        } transition-transform duration-300 ease-in-out z-20 flex flex-col`}
      >
        <div className="flex justify-between items-center p-4 border-b">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-semibold">장바구니</h2>
            <p className="text-sm bg-blue-200 rounded-md p-[2px]">
              총<span className="font-bold">{data?.cartItems.length || 0}</span>
              개의 상품이 등록되었습니다.
            </p>
          </div>
          <button onClick={onClose}>
            <IoClose className="text-2xl" />
          </button>
        </div>

        <div className="flex-1 overflow-auto p-8">
          {data?.cartItems.length > 0 && (
            <ul>
              {data?.cartItems.map((item: any) => (
                <li key={item.productId} className="mb-4 relative">
                  <a href={`/products/${item.productId}`}>
                    <img
                      src={item.productImage}
                      alt={item.productName}
                      className="w-full h-25 object-cover"
                    />
                  </a>

                  <div className="p-2">
                    <p className="font-bold hover:underline">
                      <a href={`/products/${item.productId}`}>
                        {item.productName}
                      </a>
                    </p>
                    <p className="font-semibold">수량 {item.quantity}개</p>
                    <p className="font-semibold">
                      가격 {item.price.toLocaleString()}원
                    </p>
                  </div>
                  {/* 삭제 버튼 */}
                  <button
                    className="absolute right-0 top-0 text-2xl text-blue-400 p-2 hover:scale-150"
                    onClick={() => handleDelete(item.productId)}
                  >
                    <IoClose />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* 푸터 (총 가격 및 결제 버튼) */}
        <div className="p-4 border-t">
          <div className="flex justify-between mb-4">
            <span className="text-lg font-semibold">총 결제 금액</span>
            <span className="text-lg font-semibold truncate">
              {data?.totalPrice.toLocaleString() || 0}원
            </span>
          </div>
          <button className="w-full bg-blue-500 text-white py-2 rounded-lg">
            결제하기
          </button>
        </div>
      </div>
    </>
  );
};

export default CartPanel;
