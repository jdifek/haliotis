import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { useState, useRef } from "react";
import type { Swiper as SwiperType } from "swiper";
import { ButtonWithIcon } from "../buttons/ButtonWithIcon";
type Props = {
  diveTripsCards: {
    image: string;
    location: string;
    locationNumber: string;
    description: string;
  }[];
};
export const DiveTrips: React.FC<Props> = ({ diveTripsCards }) => {
  const [diveTripsCurrentSlide, setDiveTripsCurrentSlide] = useState(0);
  const diveTripswiperRef = useRef<SwiperType | null>(null);
  const partners = [
    "cressi-71",
    "dan-79",
    "lightmotion-66",
    "mares-15",
    "oms-28",
    "padi-44",
    "x",
    "poseidon-08",
    "razor-logo-22",
    "retra-98",
    "scubapro-06",
    "shearwater-59",
    "sitech-34",
    "tusa-86",
  ];
  return (
    <section className="bg-[#ffff] px-4 pt-6 pb-12 md:px-[30px] md:pb-[77px]">
      <div className="flex flex-col gap-[20px] lg:flex-row lg:gap-[30px]">
        {/* Upcoming Dive Trips Card - 2/3 width on desktop */}
        <div
          className="relative h-[558px] md:h-[720px] overflow-hidden lg:flex-[2]"
          style={{
            borderRadius: "20px",
          }}
        >
          {/* Background Swiper - absolute positioned */}
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
                    {/* Dark Overlay */}
                    <div className="absolute inset-0 bg-black/40" />
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>

          {/* Content - relative positioned */}
          <div className="relative z-10 flex h-full flex-col p-6 md:p-[40px]">
            {/* Header */}
            <div className="md:mb-[54.5px] mb-[19px] text-center">
              <p
                className="text-[20px] font-medium text-white md:text-2xl"
                style={{
                  lineHeight: "140%",
                }}
              >
                Upcoming Dive Trips
              </p>
            </div>

            {/* Main Content */}
            <div className="mb-[20px] md:mb-[60px]">
              {/* Counter */}
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

              {/* Location Badge */}
              <div className="mb-[16px] inline-flex items-center gap-2 rounded-full bg-white px-3 py-1.5 md:mb-[20px] md:px-4 md:py-2">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path fill-rule="evenodd" clip-rule="evenodd" d="M0 10C0 4.47715 4.47715 0 10 0C15.5228 0 20 4.47715 20 10C20 15.5228 15.5228 20 10 20C4.47715 20 0 15.5228 0 10ZM8.6158 7.5C9.0535 6.71823 9.8025 6 10.7498 6C11.284 6 11.819 6.23239 12.2923 6.70646C12.6824 7.09734 13.3156 7.09792 13.7065 6.70775C14.0973 6.31758 14.0979 5.68442 13.7077 5.29354C12.9274 4.51179 11.9042 4 10.7498 4C9.3289 4 8.1189 4.77025 7.29826 5.86449C6.93769 6.34528 6.64329 6.89783 6.42654 7.5H6C5.44772 7.5 5 7.94772 5 8.5C5 8.9581 5.30804 9.3443 5.72828 9.4626C5.82228 9.4891 5.91867 9.5 6.01613 9.5C5.99473 9.8304 5.99473 10.1696 6.01613 10.5C5.91867 10.5 5.82228 10.5109 5.72828 10.5374C5.30804 10.6557 5 11.0419 5 11.5C5 12.0523 5.44772 12.5 6 12.5H6.42654C6.64329 13.1022 6.93769 13.6547 7.29826 14.1355C8.1189 15.2298 9.3289 16 10.7498 16C11.9042 16 12.9274 15.4882 13.7077 14.7065C14.0979 14.3156 14.0973 13.6824 13.7065 13.2923C13.3156 12.9021 12.6824 12.9027 12.2923 13.2935C11.819 13.7676 11.284 14 10.7498 14C9.8025 14 9.0535 13.2818 8.6158 12.5H10C10.5523 12.5 11 12.0523 11 11.5C11 10.9477 10.5523 10.5 10 10.5H8.0217C7.99312 10.1735 7.99312 9.8265 8.0217 9.5H11C11.5523 9.5 12 9.0523 12 8.5C12 7.94772 11.5523 7.5 11 7.5H8.6158Z" fill="black" />
</svg>
                <span
                  className="text-sm font-medium text-[#111111] md:text-base"
                  style={{
                    lineHeight: "140%",
                  }}
                >
                  {diveTripsCards[diveTripsCurrentSlide].locationNumber}
                </span>
              </div>

              {/* Title */}
              <h3
                className="mb-[12px] text-[28px] font-medium text-white md:mb-[12px] md:text-[42px]"
                style={{
                  lineHeight: "130%",
                }}
              >
                {diveTripsCards[diveTripsCurrentSlide].location}
              </h3>

              {/* Description */}
              <p
                className="mb-[20px] max-w-[500px] text-sm font-normal text-white md:text-[15px]"
                style={{
                  lineHeight: "160%",
                  opacity: 0.8,
                }}
              >
                {diveTripsCards[diveTripsCurrentSlide].description}
              </p>

              {/* Button */}
              <ButtonWithIcon
                width="164px"
                label="Find More"
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

            {/* Carousel Controls */}
            <div className="flex items-center justify-between mt-auto">
              <div className="relative h-1.5 w-[180px] overflow-hidden rounded-full md:w-[275px]">
                {/* Background with opacity */}
                <div className="absolute inset-0 bg-white/30" />
                {/* Active bar without opacity */}
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
                {/* Previous Button */}
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

                {/* Next Button */}
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

        {/* Equipment Card - 1/3 width on desktop */}
        <div
          className="relative h-[584px] md:h-[720px] overflow-hidden lg:flex-1"
          style={{
            borderRadius: "20px",
            backgroundImage: "url(/CTABackgroundImage.png)",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          {/* Dark Overlay */}
          <div className="absolute inset-0 bg-black/40" />

          {/* Content */}
          <div className="relative z-10 flex h-full flex-col p-6 md:p-[40px]">
            {/* Header */}
            <div className="mb-auto text-center">
              <p
                className="text-lg font-medium text-white md:text-2xl"
                style={{
                  lineHeight: "140%",
                }}
              >
                Equipment
              </p>
            </div>

            {/* Main Content */}
            <div className="">
              {/* Title */}
              <h3
                className="mb-[12px] text-center text-[28px] font-medium text-white md:mb-[16px] md:text-[42px]"
                style={{
                  lineHeight: "130%",
                }}
              >
                Gear Up with Exclusive Dive Offers
              </h3>

              {/* Description */}
              <p
                className="mb-[30px] text-center text-sm font-normal text-white md:mb-[40px] md:text-[15px]"
                style={{
                  lineHeight: "160%",
                  opacity: 0.8,
                }}
              >
                Discover premium equipment at unbeatable prices — limited-time
                deals for divers.
              </p>

              {/* Brand Logos Grid */}
              <div className="mb-[30px] rounded-2xl bg-white p-4 md:mb-[40px] md:p-8">
  <div className="grid grid-cols-3 gap-x-4 gap-y-4 md:grid-cols-4 md:gap-x-8 md:gap-y-6">
    {partners.map((name) => (
      <div
        key={name}
        className="flex items-center justify-center"
      >
        <img
          src={`/${name}.png`}
          alt={name.replace(/-/g, " ")}
          className="h-6 object-contain md:h-8"
          loading="lazy"           // полезно, когда много картинок
        />
      </div>
    ))}
  </div>
</div>

              {/* Button */}
              <div className="flex justify-center  mt-auto">
                <ButtonWithIcon
                  width="237px"
                  label="Visit our Online Shop"
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
