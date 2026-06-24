"use client";
import { CenterCard } from "../CenterCard";
import { CarouselControls } from "../CarouselControls";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import React, { useState, useRef } from "react";
import type { Swiper as SwiperType } from "swiper";

type Props = {
  title: string;
  filter_name: string;
  subtitle: string;
  centerCards: {
    image: string;
    title: string;
    description: string;
    buttonColor: string;
    slug: string;
    location: string;
    imageFull: string;
  }[];
};

export const CentersSection: React.FC<Props> = ({
  centerCards,
  title,
  subtitle,
  filter_name
}) => {
  const mobileRef = useRef<SwiperType | null>(null);
  const tabletRef = useRef<SwiperType | null>(null);
  const [mobileSlide, setMobileSlide] = useState(0);
  const [tabletSlide, setTabletSlide] = useState(0);

  // Одна карточка на локацию (по первому вхождению title)
  const uniqueCards = centerCards.filter(
    (card, index, self) =>
      index === self.findIndex((c) => c.title === card.title)
  );

  return (
    <section className="bg-[#f1f1f1] px-4 py-12 md:px-8 md:py-18.25">
      {/* Header */}
      <div className="mb-8 flex items-start gap-4">
        <div className="flex flex-col gap-[10px]">
          <p className="text-[28px] font-medium leading-[130%] text-black sm:text-[36px] lg:text-[clamp(32px,2.5vw,42px)]">
            {title}
          </p>
          <p className="text-[15px] font-normal leading-[160%] text-black opacity-80">
            {subtitle}
          </p>
        </div>
      </div>

      {/* Mobile: Swiper 1 карточка (< 640px) */}
      <div className="hidden max-[639px]:block">
        <Swiper
          className="!overflow-hidden"
          modules={[Pagination]}
          spaceBetween={16}
          slidesPerView={1}
          loop={uniqueCards.length > 1}
          onSwiper={(swiper) => {
            mobileRef.current = swiper;
          }}
          onSlideChange={(swiper) => setMobileSlide(swiper.realIndex)}
          pagination={{ type: "progressbar", el: ".centers-progress-mobile" }}
        >
          {uniqueCards.map((card, index) => (
            <SwiperSlide key={index} className="!h-auto">
              <CenterCard
                imageFull={card.imageFull}
                className="!max-w-none"
                image={card.image}
                slug={card.slug}
                title={card.title}
                description={card.description}
                buttonColor={card.buttonColor}
                onMoreInfoClick={() => console.log("More info clicked")}
              />
            </SwiperSlide>
          ))}
        </Swiper>
        <div className="mt-4">
          <CarouselControls
            currentSlide={mobileSlide}
            totalSlides={uniqueCards.length}
            onPrev={() => mobileRef.current?.slidePrev()}
            onNext={() => mobileRef.current?.slideNext()}
            theme="dark"
            progressClass="centers-progress-mobile"
          />
        </div>
      </div>

      {/* Tablet/Desktop-до-1490: Swiper, карточек по максимуму сколько влезает */}
      <div className="hidden min-[640px]:max-[1489px]:block">
        <Swiper
          className="!overflow-hidden"
          modules={[Pagination]}
          spaceBetween={20}
          slidesPerView="auto"
          loop={false}
          onSwiper={(swiper) => {
            tabletRef.current = swiper;
          }}
          onSlideChange={(swiper) => setTabletSlide(swiper.realIndex)}
          pagination={{ type: "progressbar", el: ".centers-progress-tablet" }}
        >
          {uniqueCards.map((card, index) => (
            <SwiperSlide key={index} className="!h-auto !w-[320px]">
              <CenterCard
                className="!max-w-none"
                image={card.image}
                title={card.title}
                slug={card.slug}
                imageFull={card.imageFull}
                description={card.description}
                buttonColor={card.buttonColor}
                onMoreInfoClick={() => console.log("More info clicked")}
              />
            </SwiperSlide>
          ))}
        </Swiper>
        <div className="mt-4">
          <CarouselControls
            currentSlide={tabletSlide}
            totalSlides={uniqueCards.length}
            onPrev={() => tabletRef.current?.slidePrev()}
            onNext={() => tabletRef.current?.slideNext()}
            theme="dark"
            progressClass="centers-progress-tablet"
          />
        </div>
      </div>

      {/* Desktop: статичная сетка только от 1490px */}
      <div className="hidden min-[1490px]:flex min-[1490px]:flex-wrap min-[1490px]:gap-5">
        {uniqueCards.map((card, index) => (
          <CenterCard
            key={index}
            image={card.image}
            slug={card.slug}
            imageFull={card.imageFull}
            title={card.title}
            description={card.description}
            buttonColor={card.buttonColor}
            onMoreInfoClick={() => console.log("More info clicked")}
          />
        ))}
      </div>
    </section>
  );
};