"use client";

import { ReactNode } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay, FreeMode } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/free-mode";

type Props<T> = {
  items: T[];
  renderItem: (item: T, index: number) => ReactNode;

  slidesPerView?: number;
  spaceBetween?: number;
  navigation?: boolean;
  pagination?: boolean;
  autoplay?: boolean;
  freeMode?: boolean;
  loop?: boolean;

  breakpoints?: any;
  className?: string;
};

const CommonSwiper = <T,>({
  items,
  renderItem,
  slidesPerView = 1.2,
  spaceBetween = 20,
  navigation = true,
  pagination = false,
  autoplay = false,
  freeMode = false,
  loop = false,
  breakpoints,
  className = "",
}: Props<T>) => {
  const defaultBreakpoints = {
    480: {
      slidesPerView: 1.2,
    },
    640: {
      slidesPerView: 1.5,
    },
    768: {
      slidesPerView: 2,
    },
    1024: {
      slidesPerView: 3,
    },
    1280: {
      slidesPerView: 4,
    },
  };
  return (
    <Swiper
      modules={[Navigation, Pagination, Autoplay, FreeMode]}
      navigation={navigation}
      pagination={pagination ? { clickable: true } : false}
      autoplay={
        autoplay
          ? {
              delay: 3000,
              disableOnInteraction: false,
            }
          : false
      }
      freeMode={freeMode}
      loop={loop}
      slidesPerView={slidesPerView}
      spaceBetween={spaceBetween}
      breakpoints={breakpoints || defaultBreakpoints}
      className={className}
    >
      {items.map((item, index) => (
        <SwiperSlide key={index}>{renderItem(item, index)}</SwiperSlide>
      ))}
    </Swiper>
  );
};

export default CommonSwiper;
