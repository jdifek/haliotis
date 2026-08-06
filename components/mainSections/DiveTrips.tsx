/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { useState, useRef } from "react";
import type { Swiper as SwiperType } from "swiper";
import { ButtonWithIcon } from "../buttons/ButtonWithIcon";
import { useMenu } from "@/app/hooks/useMenu";
import { createTermGetter } from "@/app/utils/terms";

type Props = {
  diveTripsTitile: string;
  locale: string;
  diveTripsCards: {
    image: string;
    slug: string;
    location: string;
    locationNumber: string;
    description: string;
  }[];
  equipmentData: {
    title: string;
    online_shop_title: string;
    label_name: string;
    online_shop_link: string;
    subtitle: string;
    partners: {
      name: string;
      image: string;
    }[];
  };
};

export const DiveTrips: React.FC<Props> = ({
  diveTripsCards,
  diveTripsTitile,
  equipmentData,
  locale,
}) => {
  const [diveTripsCurrentSlide, setDiveTripsCurrentSlide] = useState(0);
  const diveTripswiperRef = useRef<SwiperType | null>(null);
  const { terms } = useMenu(locale);
  console.log(terms, "ttt");

  if (!diveTripsCards || diveTripsCards.length === 0) {
    return null;
  }

  const currentTrip =
    diveTripsCards[diveTripsCurrentSlide] ?? diveTripsCards[0];

  return (
    <section className="bg-[#ffff] px-4 pt-6 pb-12 md:px-[30px] md:pb-[77px]">
      <div className="flex flex-col gap-[20px] lg:flex-row lg:gap-[30px]">
        <div
          className="relative h-[558px] md:h-[720px] overflow-hidden lg:flex-[2]"
          style={{
            borderRadius: "20px",
          }}
        >
          {/* Background Swiper */}
          <div className="absolute inset-0">
            <Swiper
              modules={[Navigation, Pagination]}
              spaceBetween={0}
              slidesPerView={1}
              loop={true}
              onSwiper={(swiper) => {
                diveTripswiperRef.current = swiper;
              }}
              onSlideChange={(swiper) => {
                setDiveTripsCurrentSlide(swiper.realIndex);
              }}
              className="h-full w-full"
            >
              {diveTripsCards.map((trip, index) => (
                <SwiperSlide key={index} className="h-full">
                  <div
                    className="relative h-full w-full"
                    style={{
                      backgroundImage: `url(${trip.image})`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                    }}
                  >
                    <div className="absolute inset-0 bg-black/40" />
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>

          {/* Content */}
          <div className="relative z-10 flex h-full flex-col p-6 md:p-[40px]">
            <div className="md:mb-[54.5px] mb-[19px] text-center">
              <p
                className="text-[20px] font-medium text-white md:text-2xl"
                style={{
                  lineHeight: "140%",
                }}
              >
                {diveTripsTitile}
              </p>
            </div>

            <div className="mb-[20px] md:mb-[60px]">
              <div className="mb-[20px] flex items-baseline gap-1 md:mb-[54.5px]">
                <span
                  className="text-[24px] font-medium text-white"
                  style={{
                    lineHeight: "130%",
                  }}
                >
                  {String(diveTripsCurrentSlide + 1).padStart(2, "0")}
                </span>
                <span
                  className="text-[24px] font-medium "
                  style={{
                    lineHeight: "130%",
                    color: "rgba(255, 255, 255, 0.3)",
                  }}
                >
                  /{String(diveTripsCards.length).padStart(2, "0")}
                </span>
              </div>

              <div className="mb-[16px] inline-flex items-center gap-2 rounded-full bg-white px-3 py-1.5 md:mb-[20px] md:px-4 md:py-2">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <circle cx="10" cy="10" r="10" fill="black" />
                  <text x="10" y="14" textAnchor="middle" fill="white" fontSize="12" fontWeight="700">
  {currentTrip.currency}
</text>
</svg>
                <span
                  className="text-sm font-medium text-[#111111] md:text-base"
                  style={{
                    lineHeight: "140%",
                  }}
                >
                  {currentTrip.amount}
                </span>
              </div>

              <h3
                className="mb-[12px] text-[28px] font-medium text-white md:mb-[12px] md:text-[42px]"
                style={{
                  lineHeight: "130%",
                }}
              >
           {currentTrip.location}

              </h3>

              <p
                className="mb-[20px] max-w-[500px] text-sm font-normal text-white md:text-[15px]"
                style={{
                  lineHeight: "160%",
                  opacity: 0.8,
                }}
              >
              {currentTrip.description}

              </p>

              <ButtonWithIcon
  href={`/viagens/${currentTrip.slug}`}
  width="164px"
                label={terms.find_more || "Find More"}
                textColor="text-black"
                className="flex items-center gap-2 rounded-full bg-white px-4 py-2.5 text-sm transition-all hover:bg-gray-200 "
                icon={
                  <svg
                    width="44"
                    height="44"
                    viewBox="0 0 44 44"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <g clipPath="url(#clip0_23_101)">
                      <path
                        d="M44 22C44 9.84974 34.1503 0 22 0C9.84974 0 0 9.84974 0 22C0 34.1503 9.84974 44 22 44C34.1503 44 44 34.1503 44 22Z"
                        fill="#E84814"
                      />
                      <path
                        d="M30 20.3333H18.75C16.6789 20.3333 15 22.0123 15 24.0833C15 26.1544 16.6789 27.8333 18.75 27.8333H22.5M30 20.3333L26.6667 17M30 20.3333L26.6667 23.6667"
                        stroke="white"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </g>
                    <defs>
                      <clipPath id="clip0_23_101">
                        <rect width="44" height="44" fill="white" />
                      </clipPath>
                    </defs>
                  </svg>
                }
              />
            </div>

            <div className="flex items-center justify-between mt-auto">
              <div className="relative h-1.5 w-[60%] md:w-[80%] overflow-hidden rounded-full ">
                <div className="absolute inset-0 bg-white/30" />
                <div
                  className="absolute left-0 top-0 z-20 h-full bg-white transition-all duration-300"
                  style={{
                    width: `${
                      ((diveTripsCurrentSlide + 1) / diveTripsCards.length) *
                      100
                    }%`,
                  }}
                />
              </div>

              <div className="flex gap-3 md:gap-6">
                <button
                  onClick={() => diveTripswiperRef.current?.slidePrev()}
                  className="flex cursor-pointer items-center justify-center rounded-full bg-[#e84814] p-3 transition-all hover:bg-[#d03d0f] md:p-4"
                >
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                    className="h-4 w-4 md:h-5 md:w-5"
                  >
                    <path
                      d="M2.5 7.50008H13.75C15.8211 7.50008 17.5 9.17901 17.5 11.2501C17.5 13.3211 15.8211 15.0001 13.75 15.0001H10M2.5 7.50008L5.83333 4.16675M2.5 7.50008L5.83333 10.8334"
                      stroke="white"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>

                <button
                  onClick={() => diveTripswiperRef.current?.slideNext()}
                  className="flex cursor-pointer items-center justify-center rounded-full bg-[#e4e4e4] p-3 transition-all hover:bg-white md:p-4"
                >
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                    className="h-4 w-4 md:h-5 md:w-5"
                  >
                    <path
                      d="M17.5 7.50008H6.25C4.17893 7.50008 2.5 9.17901 2.5 11.2501C2.5 13.3211 4.17893 15.0001 6.25 15.0001H10M17.5 7.50008L14.1667 4.16675M17.5 7.50008L14.1667 10.8334"
                      stroke="#111111"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Equipment Card */}
        <div
          className="relative h-[584px] md:h-[720px] overflow-hidden lg:flex-1"
          style={{
            borderRadius: "20px",
            backgroundImage: "url(/CTABackgroundImage.png)",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="absolute inset-0 bg-black/40" />

          <div className="relative z-10 flex h-full flex-col p-6 md:p-[40px]">
            <div className="mb-auto text-center">
              <p
                className="text-lg font-medium text-white md:text-2xl"
                style={{
                  lineHeight: "140%",
                }}
              >
                {equipmentData.label_name}
              </p>
            </div>

            <div className="">
              <h3
                className="mb-[12px] text-center text-[28px] font-medium text-white md:mb-[16px] md:text-[42px]"
                style={{
                  lineHeight: "130%",
                }}
              >
                {equipmentData.title}
              </h3>

              <p
                className="mb-[30px] text-center text-sm font-normal text-white md:mb-[40px] md:text-[15px]"
                style={{
                  lineHeight: "160%",
                  opacity: 0.8,
                }}
              >
                {equipmentData.subtitle}
              </p>

              <div className="mb-[30px] rounded-[30px] bg-white p-4 md:mb-[40px] md:p-8">
                <div className="grid grid-cols-3 gap-x-4 gap-y-4 md:grid-cols-4 md:gap-x-8 md:gap-y-6">
                  {equipmentData.partners.map((partner, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-center"
                    >
                      <img
                        src={partner.image}
                        alt={partner.name}
                        className="h-6 object-contain md:h-8"
                        loading="lazy"
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-center mt-auto">
                <ButtonWithIcon
                  href={equipmentData.online_shop_link}
                  width="!w-fit "
                  label={equipmentData.online_shop_title}
                  textColor="text-black"
                  className="flex items-center gap-3 rounded-full bg-white px-6 py-3 transition-all hover:bg-gray-100"
                  icon={
                    <svg
                      width="44"
                      height="44"
                      viewBox="0 0 44 44"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <g clipPath="url(#clip0_23_101_equipment)">
                        <path
                          d="M44 22C44 9.84974 34.1503 0 22 0C9.84974 0 0 9.84974 0 22C0 34.1503 9.84974 44 22 44C34.1503 44 44 34.1503 44 22Z"
                          fill="#E84814"
                        />
                        <path
                          d="M30 20.3333H18.75C16.6789 20.3333 15 22.0123 15 24.0833C15 26.1544 16.6789 27.8333 18.75 27.8333H22.5M30 20.3333L26.6667 17M30 20.3333L26.6667 23.6667"
                          stroke="white"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </g>
                      <defs>
                        <clipPath id="clip0_23_101_equipment">
                          <rect width="44" height="44" fill="white" />
                        </clipPath>
                      </defs>
                    </svg>
                  }
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
