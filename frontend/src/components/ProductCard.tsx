import React from "react";

interface Product {
  _id: string;
  name: string;
  description: string;
  price: string;
  image: string;
  productImage: string;
  productName: string;
}

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const formattedPrice = new Intl.NumberFormat("ko-KR").format(
    Number(product.price)
  );

  return (
    <div className="border rounded-lg overflow-hidden shadow-lg">
      <div style={{ aspectRatio: "1/1" }} className="overflow-hidden">
        <img
          src={product.productImage}
          alt={product.name}
          className="w-full h-full hover:scale-125"
        />
      </div>
      <div className="p-4 h-[120px]">
        <h2 className="font-bold text-md xl:text-lg truncate">
          {product.productName}
        </h2>
        <p className="text-gray-600 truncate">{product.description}</p>
        <div className="flex justify-between">
          <p className="font-semibold text-md xl:text-lg text-blue-500 mt-2 truncate">
            ₩ {formattedPrice}원
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
