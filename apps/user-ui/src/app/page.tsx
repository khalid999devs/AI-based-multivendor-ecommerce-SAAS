"use client";
import ProductCard from "@/shared/components/cards/product-card";
import SectionTitle from "@/shared/components/section/section-title";
import Hero from "@/shared/modules/Hero";
import axiosInstance from "@/utils/axiosInstance";
import { useQuery } from "@tanstack/react-query";
import React from "react";

const Page = () => {
  const {
    data: products,
    isError,
    isLoading,
  } = useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const response = await axiosInstance.get(
        "/product/api/get-all-products?page=1&limit=10"
      );
      return response.data.products;
    },
    staleTime: 1000 * 60 * 2,
  });

  const { data: latestProducts } = useQuery({
    queryKey: ["latest_products"],
    queryFn: async () => {
      const response = await axiosInstance.get(
        "/product/api/get-all-products?page=1&limit=10&type=latest"
      );
      return response.data.products;
    },
    staleTime: 1000 * 60 * 2,
  });

  return (
    <div className="bg-[#f5f5f5]">
      <Hero />
      <div className="md:w-[80%] w-[90%] my-10 m-auto pb-24">
        <div className="mb-8">
          <SectionTitle title="Suggested Products" />
        </div>

        {isLoading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-5">
            {Array.from({ length: 10 }).map((_, index) => (
              <div
                className="h-[350px] bg-gray-300 animate-pulse rounded-xl"
                key={index}
              />
            ))}
          </div>
        )}

        {!isLoading && !isError && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-5">
            {products?.map((product: any) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Page;
