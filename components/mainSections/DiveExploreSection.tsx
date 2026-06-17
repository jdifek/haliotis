"use client";

import Image from "next/image";
import { ButtonWithIcon } from "../buttons/ButtonWithIcon";
import { CarouselControls } from "../CarouselControls";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import React, { useState, useRef } from "react";
import type { Swiper as SwiperType } from "swiper";

type Card = {
  title: string;
  description: string;
  image: string;
  button_name: string;
  tag: string;
  href: string;
};

type DiveExploreSectionProps = {
  title: string;
  subtitle: string;
  cards: Card[];
};

export const DiveExploreSection = ({
  title,
  subtitle,
  cards,
}: DiveExploreSectionProps) => {
  const swiperRef = useRef<SwiperType | null>(null);
  const [currentSlide, setCurrentSlide] = useState(0);

  if (!cards.length) return null;

  return (
    <section className="section">
      {/* Header */}
      <div className="header">
        <h2 className="text-black">{title}</h2>
        <p>{subtitle}</p>
      </div>

      {/* Desktop Grid (≥1024px) */}
      <div className="desktop-grid">
        {cards.map((card, index) => (
          <CardItem card={card} key={index} />
        ))}
      </div>

      {/* Tablet/Mobile Swiper (<1024px) */}
      <div className="swiper-wrapper-outer">
        <Swiper
          modules={[Navigation, Pagination]}
          spaceBetween={16}
          loop={false}
          onSwiper={(swiper) => {
            swiperRef.current = swiper;
          }}
          onSlideChange={(swiper) => {
            setCurrentSlide(swiper.realIndex);
          }}
          pagination={{
            type: "progressbar",
            el: ".explore-progress",
          }}
          breakpoints={{
            0: {
              slidesPerView: 1.15,
              spaceBetween: 12,
            },
            480: {
              slidesPerView: 1.5,
              spaceBetween: 16,
            },
            640: {
              slidesPerView: 2.1,
              spaceBetween: 20,
            },
            768: {
              slidesPerView: 2.2,
              spaceBetween: 24,
            },
          }}
        >
          {cards.map((card, index) => (
            <SwiperSlide key={index}>
              <CardItem card={card} />
            </SwiperSlide>
          ))}
        </Swiper>

        <div className="controls-row">
          <CarouselControls
            currentSlide={currentSlide}
            totalSlides={cards.length}
            onPrev={() => swiperRef.current?.slidePrev()}
            onNext={() => swiperRef.current?.slideNext()}
            theme="dark"
            progressClass="explore-progress"
          />
        </div>
      </div>

      <style jsx>{`
        .section {
          width: 100%;
          background: #f1f1f1;
          padding: 64px 0;
        }

        /* HEADER */
        .header {
          text-align: center;
          margin-bottom: 48px;
          padding: 0 20px;
        }

        .header h2 {
          font-size: clamp(26px, 3vw, 44px);
          font-weight: 500;
          margin: 0;
        }

        .header p {
          font-size: 15px;
          margin-top: 10px;
          max-width: 640px;
          margin-left: auto;
          margin-right: auto;
          color: rgba(0, 0, 0, 0.75);
        }

        /* за замовчуванням — swiper видимий, grid прихований */
        .desktop-grid {
          display: none;
        }

        .swiper-wrapper-outer {
          display: block;
          padding: 0 24px;
        }

        .controls-row {
          display: flex;
          justify-content: flex-end;
          margin-top: 20px;
        }

        /* DESKTOP — grid видимий, swiper прихований */
        @media (min-width: 1024px) {
          .desktop-grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 24px;
            width: 100%;
            box-sizing: border-box;
            padding: 0 24px;
          }

          .swiper-wrapper-outer {
            display: none;
          }
        }
      `}</style>
    </section>
  );
};

/* ── Card extracted to reuse in both grid and swiper ── */
const CardItem = ({ card }: { card: Card }) => (
  <div className="card">
    <Image src={card.image} alt={card.title} fill className="image" />
    <div className="overlay" />

    <div className="top-content">
      <div className="tag-wrapper">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none">
          <rect width="24" height="24" rx="12" fill="#E84814" />
          <path
            d="M12 8.5V15.5M14.45 9.54L9.54 14.45M15.47 12H8.53M14.45 14.45L9.54 9.54"
            stroke="#0C0C0C"
            strokeWidth="0.833"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <div className="tag">{card.tag}</div>
      </div>
    </div>

    <div className="bottom-panel">
      <div className="text-block">
        <h3>{card.title}</h3>
        <p>{card.description}</p>
      </div>
      <ButtonWithIcon
        href={card.href}
        label={card.button_name}
        width="auto"
        className="custom-button !w-fit !gap-2"
        height="48px"
        icon={
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path
              d="M17.5 7.50033H6.25C4.17893 7.50033 2.5 9.17926 2.5 11.2503C2.5 13.3214 4.17893 15.0003 6.25 15.0003H10M14.1667 10.8337L17.5 7.50033L14.1667 4.16699"
              stroke="#E84814"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        }
      />
    </div>

    <style jsx>{`
      .card {
        position: relative;
        height: 420px;
        border-radius: 22px;
        overflow: hidden;
      }

      .image {
        object-fit: cover;
      }

      .overlay {
        position: absolute;
        inset: 0;
        background: linear-gradient(to bottom, rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.75));
      }

      .top-content {
        position: absolute;
        top: 20px;
        left: 20px;
        z-index: 3;
      }

      .tag-wrapper {
        display: flex;
        align-items: center;
        gap: 8px;
      }

      .tag {
        color: #fff;
        font-size: 14px;
        font-weight: 500;
      }

      .bottom-panel {
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        background: rgba(0, 0, 0, 0.3);
        border-radius: 16px;
        margin: 20px;
        padding: 40px 16px 12px;
        display: flex;
        flex-direction: column;
        gap: 14px;
        backdrop-filter: blur(8px);
        -webkit-backdrop-filter: blur(8px);
        z-index: 3;
      }

      .text-block h3 {
        margin: 0;
        font-size: 20px;
        color: #fff;
      }

      .text-block p {
        margin: 8px 0 0;
        font-size: 14px;
        line-height: 1.5;
        color: rgba(255, 255, 255, 0.8);
      }

      .custom-button {
        background: #e84814;
      }

      .custom-button:hover {
        opacity: 0.9;
      }
    `}</style>
  </div>
);