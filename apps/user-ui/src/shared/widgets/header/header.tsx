"use client";
import Link from "next/link";
import React from "react";
import { HeartIcon, Search, ShoppingCartIcon } from "lucide-react";
import { ProfileIcon } from "@/assets/svgs/ProfileIcon";
import HeaderBottom from "./header-bottom";
import useUser from "@/hooks/useUser";

const Header = () => {
  const { user, isLoading } = useUser();
  return (
    <div className="w-full bg-white">
      <div className="w-[80%] py-5 m-auto flex items-center justify-between">
        <div>
          <Link href={"/"}>
            <span className="text-3xl font-[500] ">Eshop</span>
          </Link>
        </div>
        <div className="w-[50%] relative">
          <input
            type="text"
            placeholder="Search for products..."
            className="w-full px-4 font-Poppins font-medium outline-none border-[2.5px] border-blue-main h-[50px]"
          />
          <div className="w-[60px] cursor-pointer flex items-center justify-center h-[50px] bg-blue-main absolute top-0 right-0">
            <Search color="#fff" />
          </div>
        </div>

        <div className="flex items-center gap-8 pb-2">
          <div className="flex items-start gap-2">
            {!isLoading && user ? (
              <>
                <Link
                  href={"/profile"}
                  className="border-2 w-[50px] h-[50px] flex items-center justify-center rounded-full border-black-border"
                >
                  <ProfileIcon className="size-6" />
                </Link>
                <Link href={"/profile"}>
                  <span className="block font-medium">Hello,</span>
                  <span className="font-semibold">
                    {user?.name?.split(" ")[0]}
                  </span>
                </Link>
              </>
            ) : (
              <>
                <Link
                  href={"/login"}
                  className="border-2 w-[50px] h-[50px] flex items-center justify-center rounded-full border-black-border"
                >
                  <ProfileIcon className="size-6" />
                </Link>
                <Link href={"/login"}>
                  <span className="block font-medium">Hello,</span>
                  <span className="font-semibold">
                    {isLoading ? "..." : "Sign In"}
                  </span>
                </Link>
              </>
            )}
          </div>
          <div className="flex items-center gap-6">
            <Link href={"/wishlist"} className="relative">
              <HeartIcon className="w-7 h-7" />
              <div className="w-6 h-6 border-2 border-white bg-red-500 rounded-full flex items-center justify-center absolute top-[-10px] right-[-10px]">
                <span className="text-white font-medium text-sm">0</span>
              </div>
            </Link>
            <Link href={"/cart"} className="relative">
              <ShoppingCartIcon className="w-7 h-7" />
              <div className="w-6 h-6 border-2 border-white bg-red-500 rounded-full flex items-center justify-center absolute top-[-10px] right-[-10px]">
                <span className="text-white font-medium text-sm">0</span>
              </div>
            </Link>
          </div>
        </div>
      </div>

      <div className="border-b border-b-border-light" />
      <HeaderBottom />
    </div>
  );
};

export default Header;
