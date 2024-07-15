import React from "react";

interface Product {
  id: number;
  name: string;
  description: string;
  price: string;
  image: string;
  new: boolean;
}

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  return (
    <div className="border rounded-lg overflow-hidden shadow-lg">
      <img
        src={product.image}
        alt={product.name}
        className="w-full h-48 object-cover"
      />
      <div className="p-4">
        <h2 className="font-bold text-md xl:text-lg">{product.name}</h2>
        <p className="text-gray-600">{product.description}</p>
        <div className="flex justify-between">
          <p className="font-semibold text-md xl:text-lg text-blue-500 mt-2">
            {product.price}
          </p>
          {product.new && (
            <span className="flex mt-2 bg-red-500 text-white text-xs h-[30px] px-2 items-center rounded">
              NEW
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
