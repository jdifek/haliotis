"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */
import { CarouselControls } from "../CarouselControls";
import { CourseCard } from "../CourseCard";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import React, { useState, useRef } from "react";
import type { Swiper as SwiperType } from "swiper";

type EquipmentItem = {
  id: string | number;
  name: string;
  image: string;
  price: { amount: string | number; currency: string };
  purchase_link?: string;
};

type Props = {
  className?: string;
  headers: {
    id: string;
    widget: string;
    entity: string;
    title: string;
    description: string;
  };
  equipment: EquipmentItem[];
};

export const RecommendedEquipmentSection: React.FC<Props> = ({
  className,
  headers,
  equipment,
}) => {
  const swiperRef = useRef<SwiperType | null>(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isSwiperLocked, setIsSwiperLocked] = useState(false);

  const updateLockState = (swiper: SwiperType) => {
    setIsSwiperLocked(swiper.isLocked);
  };

  return (
    <section
      className={`bg-white relative px-4 py-10 md:px-[30px] lg:px-[188px] md:py-[60px] ${className ?? ""}`}
    >
      <div className="flex flex-col gap-[10px] md:gap-[30px]">
        {/* Заголовок и контролы */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="flex flex-col gap-[10px]">
            <h2 className="text-[28px] font-medium leading-[130%] text-black sm:text-[36px] lg:text-[clamp(32px,2.5vw,42px)]">
              {headers.title}
            </h2>
            <p className="text-[15px] font-normal leading-[160%] text-[#101010] opacity-80">
              {headers.description}
            </p>
          </div>
          {!isSwiperLocked && (
            <div className="hidden sm:block">
              <CarouselControls
                currentSlide={currentSlide}
                totalSlides={equipment.length}
                onPrev={() => swiperRef.current?.slidePrev()}
                onNext={() => swiperRef.current?.slideNext()}
                theme="dark"
                progressClass="recommended-equipment-progress"
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
              el: ".recommended-equipment-progress",
            }}
            breakpoints={{
              0: {
                slidesPerView: 2,
                spaceBetween: 10,
              },
              640: {
                slidesPerView: 2,
                spaceBetween: 15,
              },
              768: {
                slidesPerView: 2,
                slidesPerGroup: 1,
                spaceBetween: 20,
              },
              1024: {
                slidesPerView: 2,
                slidesPerGroup: 1,
                spaceBetween: 30,
              },
              1495: {
                slidesPerView: 3,
                slidesPerGroup: 1,
                spaceBetween: 30,
              },
              1895: {
                slidesPerView: 4,
                slidesPerGroup: 1,
                spaceBetween: 30,
              },
            }}
          >
            {equipment.map((item) => (
              <SwiperSlide key={item.id}>
                <CourseCard
                  image={item.image}
                  title={item.name}
                  description={item.description}
                  price={Number(item.price.amount)}
                  currency={item.price.currency}
                  duration="false"
                  requestBased={false}
                  purchaseLink={item.purchase_link}
                />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        {/* Mobile controls */}
        {!isSwiperLocked && (
          <div className="flex justify-center w-full sm:hidden">
            <CarouselControls
              currentSlide={currentSlide}
              totalSlides={equipment.length}
              onPrev={() => swiperRef.current?.slidePrev()}
              onNext={() => swiperRef.current?.slideNext()}
              theme="dark"
              progressClass="recommended-equipment-progress"
            />
          </div>
        )}
      </div>
    </section>
  );
};