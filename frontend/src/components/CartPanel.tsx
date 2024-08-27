import React, { useState, useEffect } from "react";
import { IoClose } from "react-icons/io5";
import { Modal, message } from "antd";
import api from "../api/api";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useDispatch, useSelector } from "react-redux";
import { setTotalItems } from "../store/slices/cartSlice";

interface CartPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

const CartPanel: React.FC<CartPanelProps> = ({ isOpen, onClose }) => {
  const queryClient = useQueryClient();
  const accessToken = useSelector((state: any) => state.user.accessToken);
  const dispatch = useDispatch();

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);

  const fetchCart = async () => {
    const response = await api.get("http://localhost:8080/api/cart", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data;
  };

  const { data } = useQuery({
    queryKey: ["cart"],
    queryFn: fetchCart,
    enabled: !!accessToken,
  });

  useEffect(() => {
    if (data && data.cartItems) {
      dispatch(setTotalItems(data.cartItems.length));
    }
  }, [data, dispatch]);

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

  const deleteMutation = useMutation({
    mutationFn: deleteCartItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });

  const handleDelete = (productId: string) => {
    deleteMutation.mutate(productId);
  };

  const showModal = () => {
    setIsModalVisible(true);
  };

  //결제하기
  const paymentItems = async () => {
    const response = await api.post("/api/payment", {
      cartItems: data?.cartItems,
      totalPrice: data?.totalPrice,
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data;
  };

  const paymentMutation = useMutation({
    mutationFn: paymentItems,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });

  const handleOk = () => {
    setConfirmLoading(true);
    paymentMutation.mutate();
    setConfirmLoading(false);
    setIsModalVisible(false);
    message.success("결제가 완료되었습니다.");
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const isCartEmpty = data?.cartItems.length === 0;

  return (
    <>
      <div
        className={`fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 z-10 ${
          isOpen ? "block" : "hidden"
        }`}
        onClick={onClose}
      />

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

        <div className="p-4 border-t">
          <div className="flex justify-between mb-4">
            <span className="text-lg font-semibold">총 결제 금액</span>
            <span className="text-lg font-semibold truncate">
              {data?.totalPrice.toLocaleString() || 0}원
            </span>
          </div>
          <button
            className={`w-full bg-blue-500 text-white py-2 rounded-lg ${
              !accessToken || isCartEmpty ? "opacity-50 cursor-not-allowed" : ""
            }`}
            onClick={showModal}
            disabled={!accessToken || isCartEmpty}
          >
            {accessToken ? "결제하기" : "로그인이 필요합니다"}
          </button>
        </div>
      </div>

      {/* 결제 모달 */}
      <Modal
        title="결제 확인"
        open={isModalVisible}
        onOk={handleOk}
        confirmLoading={confirmLoading}
        onCancel={handleCancel}
        className="text-center"
      >
        <ul className="max-h-[500px] overflow-auto">
          {data?.cartItems.map((item: any) => (
            <li
              key={item.productId}
              className="flex gap-2 items-end justify-between mb-5"
            >
              <img
                className="w-[150px] shrink-0"
                src={item.productImage}
                alt={item.productName}
              />
              <div className="flex flex-col items-end text-base font-semibold overflow-hidden w-full">
                <p className="truncate w-full text-right font-bold">
                  {item.productName}
                </p>
                <p>수량 {item.quantity}개</p>
                <p>가격 {item.price.toLocaleString()}원</p>
              </div>
            </li>
          ))}
        </ul>
        <div className="text-xl font-bold flex justify-between mt-10">
          <p>총 결제 금액</p>
          <p>{data?.totalPrice.toLocaleString()}원</p>
        </div>
      </Modal>
    </>
  );
};

export default CartPanel;
