"use client";
import { CenterCard } from "../CenterCard";
import { CarouselControls } from "../CarouselControls";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import React, { useEffect, useRef, useState, useCallback } from "react";
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
  filter_name,
}) => {
  const swiperRef = useRef<SwiperType | null>(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const sectionRef = useRef<HTMLElement>(null);
  const [panelHeight, setPanelHeight] = useState<number | undefined>(undefined);

  const uniqueCards = centerCards.filter(
    (card, index, self) =>
      index === self.findIndex((c) => c.title === card.title)
  );

  const recalc = useCallback(() => {
    if (!sectionRef.current) return;
  
    const nodes = sectionRef.current.querySelectorAll<HTMLElement>(
      "[data-panel-text]"
    );
  
    // сбрасываем для замера естественной высоты
    nodes.forEach((n) => {
      n.style.minHeight = "0px";
    });
  
    let max = 0;
    nodes.forEach((n) => {
      if (n.offsetParent === null) return; // скрытая ветка (grid/swiper)
      const h = n.scrollHeight;
      if (h > max) max = h;
    });
  
    if (max > 0) {
      // ВСЕГДА применяем итоговую высоту напрямую в DOM —
      // не полагаемся на React re-render, который может не случиться
      nodes.forEach((n) => {
        n.style.minHeight = `${max}px`;
      });
  
      // state держим просто для синхронизации при следующем маунте/пропсах
      setPanelHeight((prev) => (prev === max ? prev : max));
    }
  }, []);
  // двойной rAF — дожидаемся, пока браузер и Swiper закончат раскладку текущего кадра
  const scheduleRecalc = useCallback(() => {
    requestAnimationFrame(() => {
      requestAnimationFrame(recalc);
    });
  }, [recalc]);

  useEffect(() => {
    console.log("[effect] запуск, карточек:", uniqueCards.length, "panelHeight:", panelHeight);
  
    scheduleRecalc();
  
    if (typeof document !== "undefined" && "fonts" in document) {
      (document).fonts.ready.then(() => {
        console.log("[effect] fonts.ready сработал");
        scheduleRecalc();
      });
    }
  
    const ro = new ResizeObserver((entries) => {
      console.log("[ResizeObserver] сработал, entries:", entries.length);
      scheduleRecalc();
    });
  
    const nodes = sectionRef.current?.querySelectorAll<HTMLElement>(
      "[data-panel-text]"
    );
    console.log("[effect] вешаем observer на узлов:", nodes?.length);
    nodes?.forEach((n) => ro.observe(n));
  
    window.addEventListener("resize", scheduleRecalc);
  
    return () => {
      console.log("[effect] cleanup");
      ro.disconnect();
      window.removeEventListener("resize", scheduleRecalc);
    };
  }, [recalc, scheduleRecalc, uniqueCards.length, panelHeight === undefined]);
  return (
    <section ref={sectionRef} className="bg-[#f1f1f1] px-4 pb-12 md:px-8 md:pb-18.25">
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

   {/* Swiper: от 0 до 1489px */}
<div className="hidden max-[1605px]:block">
  <Swiper
    className="!overflow-hidden"
    modules={[Pagination]}
    spaceBetween={16}
    slidesPerView="auto"
    loop={false}
    onSwiper={(swiper) => {
      swiperRef.current = swiper;
    }}
    onResize={() => scheduleRecalc()}
    onSlideChange={(swiper) => setCurrentSlide(swiper.realIndex)}
    pagination={{ type: "progressbar", el: ".centers-progress" }}
  >
    {uniqueCards.map((card, index) => (
      <SwiperSlide key={index} className="!h-auto !w-[240px]">
        <CenterCard
          image={card.image}
          title={card.title}
          slug={card.slug}
          imageFull={card.imageFull}
          description={card.description}
          buttonColor={card.buttonColor}
          onMoreInfoClick={() => console.log("More info clicked")}
          panelMinHeight={panelHeight}
        />
      </SwiperSlide>
    ))}
  </Swiper>
  <div className="mt-4">
    <CarouselControls
      currentSlide={currentSlide}
      totalSlides={uniqueCards.length}
      onPrev={() => swiperRef.current?.slidePrev()}
      onNext={() => swiperRef.current?.slideNext()}
      theme="dark"
      progressClass="centers-progress"
    />
  </div>
</div>

{/* Desktop: статичная сетка только от 1490px */}
<div className="hidden min-[1606px]:flex min-[1606px]:flex-wrap min-[1606px]:justify-center min-[1606px]:gap-5">
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
      panelMinHeight={panelHeight}
    />
  ))}
</div>
    </section>
  );
};