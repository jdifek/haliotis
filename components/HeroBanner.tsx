"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";
import { CarouselControls } from "./CarouselControls";
import { Breadcrumbs } from "./Breadcrumbs";

type Slide = {
  image: string;
  title?: string;
  description?: string;
};

type BreadcrumbItem = {
  label: string;
  href?: string;
};

type HeroBannerProps = {
  slides: Slide[];
  breadcrumbs?: BreadcrumbItem[];
  height?: string;
  children?: React.ReactNode;
};

export function HeroBanner({
  slides,
  breadcrumbs,
  height = "h-[75vh]",
  children,
}: HeroBannerProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const swiperRef = useRef<SwiperType | null>(null);

  const isMultiple = slides.length > 1;

  return (
    <section className={`relative ${height} -mt-[97px] pt-[97px] w-full`}>
      {breadcrumbs && (
        <div className="absolute bottom-1 z-10 block">
          <Breadcrumbs
            className="mb-6 mx-5 md:mb-8"
            items={breadcrumbs}
            itemLabelColorWhite={true}
          />
        </div>
      )}

      <div className="absolute inset-0 z-0">
        {isMultiple ? (
          <Swiper
            modules={[Navigation, Pagination]}
            spaceBetween={0}
            slidesPerView={1}
            loop={true}
            onSwiper={(swiper) => { swiperRef.current = swiper; }}
            onSlideChange={(swiper) => { setCurrentSlide(swiper.realIndex); }}
            className="h-full w-full"
          >
            {slides.map((slide, index) => (
              <SwiperSlide key={index} className="h-full">
                <div className="relative h-full w-full">
                  <Image
                    src={slide.image}
                    alt={slide.title ?? `Slide ${index + 1}`}
                    fill
                    className="object-cover"
                    priority={index === 0}
                  />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        ) : (
          <div className="relative h-full w-full">
            <Image
              src={slides[0].image}
              alt={slides[0].title ?? "Banner"}
              fill
              className="object-cover"
              priority
            />
          </div>
        )}
      </div>

      {isMultiple && (
        <div className="absolute right-10 bottom-10 z-10">
          <CarouselControls
            currentSlide={currentSlide}
            totalSlides={slides.length}
            onPrev={() => swiperRef.current?.slidePrev()}
            onNext={() => swiperRef.current?.slideNext()}
            progressClass="hero-progress"
            theme="light"
          />
        </div>
      )}

      {/* Новый рендер children */}
      <div className="relative z-20 h-full">
        {children}
      </div>
    </section>
  );
}