import Image from "next/image";
import Link from "next/link";
import React from "react";
import Ratings from "../ratings";
import { Eye, Heart, ShoppingBag } from "lucide-react";

const ProductCard = ({
  product,
  isEvent,
}: {
  product: any;
  isEvent?: boolean;
}) => {
  const [timeLeft, setTimeLeft] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (isEvent && product?.ending_date) {
      const interval = setInterval(() => {
        const endTime = new Date(product.ending_date).getTime();
        const now = Date.now();
        const timeDiff = endTime - now;
        if (timeDiff < 0) {
          setTimeLeft("Expired");
          clearInterval(interval);
          return;
        }

        const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
        const hours = Math.floor(
          (timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
        );
        const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
        setTimeLeft(`${days}d ${hours}h ${minutes}m left with this price!`);
      }, 60000);

      return () => clearInterval(interval);
    }

    return;
  }, [isEvent, product?.ending_date]);

  return (
    <div className="w-full min-h-[350px] pb-4 h-max bg-white rounded-xl relative transition-all duration-500 hover:scale-[102%] shadow-sm hover:shadow-md">
      {isEvent && (
        <div className="absolute top-2 left-2 bg-red-600 text-white text-[10px] font-semibold px-2 py-1 rounded-sm shadow-md">
          OFFER
        </div>
      )}

      {product?.stock <= 5 && (
        <div className="absolute top-2 right-2 bg-yellow-400 text-slate-700 text-[10px] font-semibold px-2 py-1 rounded-sm shadow-md">
          Limited Stock
        </div>
      )}

      <Link href={`/products/${product?.slug}`}>
        <Image
          src={
            product?.images[0]?.url ||
            "https://ik.imagekit.io/kvmpdqppz3/Banners_Images/placeholder.avif?updatedAt=1753009298684"
          }
          alt={product?.title}
          width={300}
          height={300}
          className="w-full h-[200px] object-cover mx-auto rounded-t-md"
        />
      </Link>

      <Link
        href={`/shop/${product?.shop?.id}`}
        className="block text-blue-500 text-sm font-medium my-2 px-3"
      >
        {product?.Shop?.name}
      </Link>

      <Link href={`/products/${product?.slug}`}>
        <h3 className="text-lg font-semibold px-3 text-gray-800 line-clamp-2">
          {product?.title}
        </h3>
      </Link>

      <div className="mt-2 px-2">
        <Ratings rating={product?.ratings} />
      </div>

      <div className="mt-3 flex justify-between items-center px-3">
        <div className="flex items-center gap-2">
          <span className="text-lg font-bold text-gray-900">
            ${product?.sale_price}
          </span>
          <span className="text-sm line-through text-gray-400">
            ${product?.regular_price}
          </span>
        </div>

        {product?.totalSales ? (
          <span className="text-green-500 text-sm font-medium">
            {product?.totalSales} sold
          </span>
        ) : (
          ""
        )}
      </div>

      {isEvent && timeLeft && (
        <div className="mt-2">
          <span className="inline-block text-xs bg-orange-100 text-orange-600 px-2 py-1 rounded-md">
            {timeLeft}
          </span>
        </div>
      )}

      <div className="absolute z-10 flex flex-col gap-3 right-3 top-3">
        <div className="bg-white rounded-full p-[6px] shadow-md">
          <Heart
            className="cursor-pointer hover:scale-110 transition"
            size={22}
            fill="red"
            stroke="red"
          />
        </div>
        <div className="bg-white rounded-full p-[6px] shadow-md">
          <Eye
            className="cursor-pointer text-[#4b5563] hover:scale-110 transition"
            size={22}
          />
        </div>
        <div className="bg-white rounded-full p-[6px] shadow-md">
          <ShoppingBag
            className="cursor-pointer text-[#4b5563] hover:scale-110 transition"
            size={22}
          />
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
