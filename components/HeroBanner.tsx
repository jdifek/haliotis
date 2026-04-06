// components/HeroBanner.tsx
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
  height?: string; // например "h-[75vh]" или "h-[930px]"
  children?: React.ReactNode; // контент поверх баннера
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
  const activeSlide = slides[currentSlide];

  return (
    <section className={`relative ${height} -mt-[97px] pt-[97px] w-full`}>
      {/* Breadcrumbs */}
      {breadcrumbs && (
        <div className="absolute bottom-1 z-10 block">
          <Breadcrumbs
            className="mb-6 mx-5 md:mb-8"
            items={breadcrumbs}
            itemLabelColorWhite={true}
          />
        </div>
      )}

      {/* Background */}
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

      {/* Carousel controls — только если несколько слайдов */}
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

      {/* Content */}
    {/* Content */}
<div className="relative z-20 h-full">
  {typeof children === "function"
    ? (children as (props: { activeSlide: Slide; currentSlide: number }) => React.ReactNode)({ activeSlide, currentSlide })
    : children}
</div>
    </section>
  );
}