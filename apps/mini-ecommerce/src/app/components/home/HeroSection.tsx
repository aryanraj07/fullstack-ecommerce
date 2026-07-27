"use client";
import { setCategory } from "@/features/filters/filterSlice";
import { useAppDispatch, useAppSelector } from "@/hooks/hooks";
import { buildProductUrl } from "@/utils/buildProductUrls";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React from "react";

const HeroSection = () => {
  const router = useRouter();
  const filters = useAppSelector((state) => state.filter.selected);
  const dispatch = useAppDispatch();
  const handleCategoryClick = (category: string) => {
    dispatch(setCategory([category]));

    router.push(
      buildProductUrl({
        ...filters,
        category: [category],
      }),
    );
  };
  return (
    <>
      <div className=" relative w-full h-[60vh]  hidden md:block ">
        <Image
          src="/hero-banner.png"
          alt="hero-banner object-cover "
          sizes="100vw"
          fill
          className="object-cover object-top"
        />
        <div className="absolute inset-0 flex">
          <div
            onClick={() => handleCategoryClick("mens-shirts")}
            className="w-1/2 h-full cursor-pointer"
          />
          <div
            onClick={() => {
              handleCategoryClick("womens-dresses");
            }}
            className="w-1/2 h-full cursor-pointer"
          />
        </div>
      </div>
      <div className=" relative w-full h-screen  block md:hidden ">
        <Image
          src="/mobile-hero-banner.png"
          alt="hero-banner object-cover "
          sizes="100vw"
          fill
          className="object-cover object-top"
          loading="eager"
        />
        <div className="absolute inset-0 ">
          <div
            onClick={() => handleCategoryClick("mens-shirts")}
            className="absolute left-1/2 -translate-x-1/2 top-[48%] w-[60%] h-12 "
          />
          <div
            onClick={() => {
              handleCategoryClick("womens-dresses");
            }}
            className="absolute left-1/2 -translate-x-1/2 top-[58%] w-[70%] h-12 cursor-pointer"
          />
        </div>
      </div>
    </>
  );
};

export default HeroSection;
