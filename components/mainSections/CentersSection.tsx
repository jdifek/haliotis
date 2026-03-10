import { CenterCard } from "../CenterCard";
import { CarouselControls } from "../CarouselControls";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import React, { useState, useRef } from "react";
import type { Swiper as SwiperType } from "swiper";

type Props = {
  centerCards: {
    image: string;
    title: string;
    description: string;
    buttonColor: string;
    location: string;
  }[];
};

export const CentersSection: React.FC<Props> = ({ centerCards }) => {
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
        <div
          className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full p-1.5"
          style={{ backgroundColor: "#e84814" }}
        >
          <svg width="9" height="9" viewBox="0 0 9 9" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-full w-full">
            <path d="M4.16705 0.69458V7.63902M6.62228 1.71157L1.71181 6.62203M7.63927 4.1668H0.694824M6.62228 6.62203L1.71181 1.71157" stroke="#0C0C0C" strokeWidth="0.833333" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <div className="flex flex-col gap-[10px]">
          <h2 className="text-[24px] font-medium leading-[140%] text-black">CENTERS</h2>
          <p className="text-[28px] font-medium leading-[130%] text-black sm:text-[36px] lg:text-[clamp(32px,2.5vw,42px)]">
            Discover Where We Dive
          </p>
          <p className="text-[15px] font-normal leading-[160%] text-black opacity-80">
            From crystal-clear waters to hidden reefs — choose your next dive.
          </p>
        </div>
      </div>

      {/* Mobile: Swiper 1 карточка (< 640px) */}
      <div className="block sm:hidden">
        <Swiper
          modules={[Pagination]}
          spaceBetween={16}
          slidesPerView={1}
          loop={uniqueCards.length > 1}
          onSwiper={(swiper) => { mobileRef.current = swiper; }}
          onSlideChange={(swiper) => setMobileSlide(swiper.realIndex)}
          pagination={{ type: "progressbar", el: ".centers-progress-mobile" }}
        >
          {uniqueCards.map((card, index) => (
            <SwiperSlide key={index} className="!h-auto">
              <CenterCard
              className="!max-w-none"
                image={card.image}
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

      {/* Tablet: Swiper 2 карточки (640px – 1023px) */}
      <div className="hidden sm:block lg:hidden">
        <Swiper
          modules={[Pagination]}
          spaceBetween={20}
          slidesPerView={2}
          loop={uniqueCards.length > 2}
          onSwiper={(swiper) => { tabletRef.current = swiper; }}
          onSlideChange={(swiper) => setTabletSlide(swiper.realIndex)}
          pagination={{ type: "progressbar", el: ".centers-progress-tablet" }}
        >
          {uniqueCards.map((card, index) => (
            <SwiperSlide key={index} className="!h-auto">
              <CenterCard
              className="!max-w-none"
                image={card.image}
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
            currentSlide={tabletSlide}
            totalSlides={uniqueCards.length}
            onPrev={() => tabletRef.current?.slidePrev()}
            onNext={() => tabletRef.current?.slideNext()}
            theme="dark"
            progressClass="centers-progress-tablet"
          />
        </div>
      </div>

      {/* Desktop: сетка 3 колонки × 2 ряда (1024px+) */}
      <div className="hidden lg:grid lg:grid-cols-3 lg:gap-5">
        {uniqueCards.map((card, index) => (
          <CenterCard
            key={index}
                   className="!max-w-none"
            image={card.image}
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