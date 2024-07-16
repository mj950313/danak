import React from "react";
import { IoClose } from "react-icons/io5";

interface CartPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

const CartPanel: React.FC<CartPanelProps> = ({ isOpen, onClose }) => {
  return (
    <div
      className={`fixed top-0 right-0 w-80 h-full bg-white shadow-xl transform ${
        isOpen ? "translate-x-0" : "translate-x-full"
      } transition-transform duration-300 ease-in-out z-20`}
    >
      <div className="flex justify-between items-center p-4 border-b">
        <h2 className="text-2xl font-semibold">Shopping Cart</h2>
        <button onClick={onClose}>
          <IoClose className="text-2xl" />
        </button>
      </div>
      {/* 장바구니 내용 */}
      <div className="p-4">Your cart is empty.</div>
    </div>
  );
};

export default CartPanel;
