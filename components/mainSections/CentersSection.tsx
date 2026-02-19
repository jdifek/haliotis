import { CarouselControls } from "../CarouselControls";
import { FilterList } from "../FilterList";
import { CenterCard } from "../CenterCard";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import React, { useState, useRef } from "react";
import type { Swiper as SwiperType } from "swiper";

type Props = {
  locations: {
    id: string;
    label: string;
  }[];
  centerCards: {
    image: string;
    title: string;
    description: string;
    buttonColor: string;
    location: string;
  }[];
};

export const CentersSection: React.FC<Props> = ({ locations, centerCards }) => {
  const [selectedLocation, setSelectedLocation] = useState("all");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const centersSwiperRef = useRef<SwiperType | null>(null);
  const [centersCurrentSlide, setCentersCurrentSlide] = useState(0);

  const filteredCenters =
  selectedLocation === "all"
    ? centerCards.filter(
        (card, index, self) =>
          index === self.findIndex((c) => c.title === card.title)
      )
    : centerCards.filter((card) => card.location === selectedLocation);
  // Функция для получения названия локации
  const getLocationLabel = () => {
    const location = locations.find((loc) => loc.id === selectedLocation);
    return location ? location.label : "ALL";
  };

  const handleLocationSelect = (id: string) => {
    setSelectedLocation(id);
    setIsDropdownOpen(false);
  };

  return (
    <section className="bg-[#f1f1f1] px-4 py-12 md:px-8 md:py-18.25">
      <div className="flex flex-col lg:flex-row">
        {/* Sidebar */}
        <div className=" lg:mr-[34px] lg:mb-0 lg:w-[282px] lg:flex-shrink-0">
          <div className="mb-6 flex items-center gap-4 lg:mb-[85px]">
            <div
              className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full p-1.5"
              style={{ backgroundColor: "#e84814" }}
            >
              <svg
                width="9"
                height="9"
                viewBox="0 0 9 9"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="h-full w-full"
              >
                <path
                  d="M4.16705 0.69458V7.63902M6.62228 1.71157L1.71181 6.62203M7.63927 4.1668H0.694824M6.62228 6.62203L1.71181 1.71157"
                  stroke="#0C0C0C"
                  strokeWidth="0.833333"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <h2 className="text-[24px] font-medium leading-[140%] text-black">
              CENTERS
            </h2>
          </div>

          {/* Mobile Dropdown */}
          <div className="mb-6 lg:hidden">
            <div className="relative">
              {/* Dropdown Button */}
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex w-full items-center justify-between rounded-lg bg-[#a0c52e] px-4 py-3 transition-colors hover:bg-[#fadc00]"
              >
                <span className="text-[16px] font-bold uppercase leading-[160%] text-[#ffff]">
                  {getLocationLabel()}
                </span>
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className={`transition-transform ${
                    isDropdownOpen ? "rotate-180" : ""
                  }`}
                >
                  <path
                    d="M4 6L8 10L12 6"
                    stroke="#ffff"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>

              {/* Dropdown Content */}
              {isDropdownOpen && (
                <div className="absolute left-0 right-0 top-full z-10 mt-2 rounded-lg bg-white shadow-lg">
                  <FilterList
                    options={locations}
                    selected={selectedLocation}
                    onSelect={handleLocationSelect}
                  />
                </div>
              )}
            </div>

            {/* Backdrop */}
            {isDropdownOpen && (
              <div
                className="fixed inset-0 z-[5]"
                onClick={() => setIsDropdownOpen(false)}
              />
            )}
          </div>

          {/* Desktop FilterList */}
          <div className="hidden lg:block">
            <FilterList
              options={locations}
              selected={selectedLocation}
              onSelect={handleLocationSelect}
            />
          </div>
        </div>

        <div className="flex flex-1 flex-col gap-[30px] overflow-hidden">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="flex flex-col gap-[10px]">
              <h2 className="text-[28px] font-medium leading-[130%] text-black sm:text-[36px] lg:text-[clamp(32px,2.5vw,42px)]">
                Discover Where We Dive
              </h2>
              <p className="text-[15px] font-normal leading-[160%] text-black opacity-80">
                From crystal-clear waters to hidden reefs — choose your next
                dive.
              </p>
            </div>
            <div className="hidden sm:block">
              <CarouselControls
                currentSlide={centersCurrentSlide}
                totalSlides={filteredCenters.length}
                onPrev={() => centersSwiperRef.current?.slidePrev()}
                onNext={() => centersSwiperRef.current?.slideNext()}
                theme="dark"
                progressClass="centers-progress"
              />
            </div>
          </div>

          <div className="w-full">
            <Swiper
              modules={[Navigation, Pagination]}
              spaceBetween={20}
              slidesPerView={1}
              loop={true}
              onSwiper={(swiper) => {
                centersSwiperRef.current = swiper;
              }}
              onSlideChange={(swiper) => {
                setCentersCurrentSlide(swiper.realIndex);
              }}
              pagination={{
                type: "progressbar",
                el: ".centers-progress",
              }}
              breakpoints={{
                393: {
                  slidesPerView: 1,
                  spaceBetween: 20,
                },
                640: {
                  slidesPerView: 2,
                  spaceBetween: 20,
                },
                768: {
                  slidesPerView: 2,
                  spaceBetween: 25,
                },
                1024: {
                  slidesPerView: 3,
                  spaceBetween: 30,
                },
                1495: {
                  slidesPerView: 4,
                  spaceBetween: 30,
                },
              }}
            >
              {filteredCenters.map((card, index) => (
                <SwiperSlide key={index}>
                  <CenterCard
                    image={card.image}
                    title={card.title}
                    description={card.description}
                    buttonColor={card.buttonColor}
                    onMoreInfoClick={() => console.log("More info clicked")}
                  />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>

          {/* Mobile controls */}
          <div className="block sm:hidden">
            <CarouselControls
              currentSlide={centersCurrentSlide}
              totalSlides={filteredCenters.length}
              onPrev={() => centersSwiperRef.current?.slidePrev()}
              onNext={() => centersSwiperRef.current?.slideNext()}
              theme="dark"
              progressClass="centers-progress"
            />
          </div>
        </div>
      </div>
    </section>
  );
};
