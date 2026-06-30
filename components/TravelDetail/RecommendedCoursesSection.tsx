// components/TravelDetail/RecommendedCoursesSection.tsx
"use client";

import { CarouselControls } from "../CarouselControls";
import { TripCard } from "../TravelTripsSection";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import React, { useState, useRef } from "react";
import type { Swiper as SwiperType } from "swiper";

type TripCardType = {
  locationId: string;
  images: string[];
  price: number;
  title: string;
  description: string;
  link: string;
};

type Props = {
  className?: string;
  recommendedHeader: {
    title: string;
    description: string;
  };
  courseCards: TripCardType[];
};

export const RecommendedCoursesSection: React.FC<Props> = ({
  className,
  courseCards,
  recommendedHeader,
}) => {
  const swiperRef = useRef<SwiperType | null>(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isSwiperLocked, setIsSwiperLocked] = useState(false);

  const updateLockState = (swiper: SwiperType) => {
    setIsSwiperLocked(swiper.isLocked);
  };

  return (
    <section
      className={`bg-[#f1f1f1] relative pt-4 pb-4 md:pt-6 md:pb-8 ${className ?? ""}`}
    >
      <div className="mx-auto max-w-[1920px] px-4 md:px-8 lg:px-[188px] flex flex-col gap-[10px] md:gap-[30px]">
        {/* Заголовок и контролы */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="flex flex-col gap-[10px]">
            <h2 className="text-[28px] font-medium leading-[130%] text-black sm:text-[36px] lg:text-[clamp(32px,2.5vw,42px)]">
              {recommendedHeader.title}
            </h2>
            <p className="text-[15px] font-normal leading-[160%] text-[#101010] opacity-80">
              {recommendedHeader.description}
            </p>
          </div>
          {!isSwiperLocked && (
            <div className="hidden sm:block">
              <CarouselControls
                currentSlide={currentSlide}
                totalSlides={courseCards.length}
                onPrev={() => swiperRef.current?.slidePrev()}
                onNext={() => swiperRef.current?.slideNext()}
                theme="dark"
                progressClass="recommended-travels-progress"
              />
            </div>
          )}
        </div>

        {/* Карусель */}
        <div className="w-full">
          <Swiper
            modules={[Navigation, Pagination]}
            spaceBetween={16}
            slidesPerView={2}
            slidesPerGroup={2}
            loop={false}
            watchOverflow={true}
            onSwiper={(swiper) => {
              swiperRef.current = swiper;
              updateLockState(swiper);
            }}
            onSlideChange={(swiper) => {
              setCurrentSlide(swiper.realIndex);
            }}
            onResize={(swiper) => {
              updateLockState(swiper);
            }}
            onBreakpoint={(swiper) => {
              updateLockState(swiper);
            }}
            pagination={{
              type: "progressbar",
              el: ".recommended-travels-progress",
            }}
            breakpoints={{
              0: {
                slidesPerView: 1,
                spaceBetween: 10,
              },
              640: {
                slidesPerView: 1,
                spaceBetween: 15,
              },
              768: {
                slidesPerView: 1,
                slidesPerGroup: 1,
                spaceBetween: 20,
              },
              1024: {
                slidesPerView: 1,
                slidesPerGroup: 1,
                spaceBetween: 30,
              },
              1495: {
                slidesPerView: 1,
                slidesPerGroup: 1,
                spaceBetween: 30,
              },
              1895: {
                slidesPerView: 1,
                slidesPerGroup: 1,
                spaceBetween: 30,
              },
            }}
          >
            {courseCards.map((card, index) => (
              <SwiperSlide key={`${card.locationId}-${index}`}>
                <TripCard card={card} />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        {/* Mobile controls */}
        {!isSwiperLocked && (
          <div className="flex justify-center w-full sm:hidden">
            <CarouselControls
              currentSlide={currentSlide}
              totalSlides={courseCards.length}
              onPrev={() => swiperRef.current?.slidePrev()}
              onNext={() => swiperRef.current?.slideNext()}
              theme="dark"
              progressClass="recommended-travels-progress"
            />
          </div>
        )}
      </div>
    </section>
  );
};