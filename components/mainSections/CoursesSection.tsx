import { CarouselControls } from "../CarouselControls";
import { FilterList } from "../FilterList";
import { CourseCard } from "../CourseCard";
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
  courseCards: {
    image: string;
    title: string;
    price: number;
    duration: string;
    requestBased: boolean;
    badge: string;
    location: string;
}[]
};
export const CoursesSection: React.FC<Props> = ({ locations, courseCards }) => {
  const [selectedLocation, setSelectedLocation] = useState("all");
  const coursesSwiperRef = useRef<SwiperType | null>(null);

  const [coursesCurrentSlide, setCoursesCurrentSlide] = useState(0);
  const filteredCourses = selectedLocation === "all" 
  ? courseCards 
  : courseCards.filter(card => card.location === selectedLocation);

  // Функцию для получения названия локации
  const getLocationLabel = () => {
    const location = locations.find((loc) => loc.id === selectedLocation);
    return location ? location.label : "ALL";
  };

  return (
    <section className="bg-[#FFFF] px-4 py-12 md:px-8 md:py-18.25">
      <div className="flex flex-col lg:flex-row">
        {/* Sidebar - скрыт на мобильных */}
        <div className="mb-8 lg:mr-[34px] lg:mb-0 lg:w-[282px] lg:flex-shrink-0">
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
            <h2 className="text-[24px] font-medium leading-[140%] text-[#111]">
              COURSES
            </h2>
          </div>
          <div className="hidden lg:block">
            <FilterList
              options={locations}
              selected={selectedLocation}
              onSelect={setSelectedLocation}
            />
          </div>
        </div>

        <div className="flex flex-1 flex-col gap-[30px] overflow-hidden">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="flex flex-col gap-[10px]">
              <h2 className="text-[28px] font-medium leading-[130%] text-black sm:text-[36px] lg:text-[42px]">
                Upcoming Courses:{" "}
                <span className="text-[#e84814]">{getLocationLabel()}</span>
                </h2>
              <p className="text-[15px] font-normal leading-[160%] text-[#101010] opacity-80">
                The perfect course for you
              </p>
            </div>
            <div className="hidden sm:block">
              <CarouselControls
                currentSlide={coursesCurrentSlide}
                totalSlides={filteredCourses.length}
                onPrev={() => coursesSwiperRef.current?.slidePrev()}
                onNext={() => coursesSwiperRef.current?.slideNext()}
                theme="dark"
                progressClass="courses-progress"
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
                coursesSwiperRef.current = swiper;
              }}
              onSlideChange={(swiper) => {
                setCoursesCurrentSlide(swiper.realIndex);
              }}
              pagination={{
                type: "progressbar",
                el: ".courses-progress",
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
                1780: {
                  slidesPerView: 4,
                  spaceBetween: 30,
                },
              }}
            >
              {filteredCourses.map((card, index) => (
                <SwiperSlide key={index}>
                  <CourseCard
                    image={card.image}
                    title={card.title}
                    price={card.price}
                    duration={card.duration}
                    requestBased={card.requestBased}
                    badge={card.badge}
                    onBookClick={() => console.log("Book clicked")}
                  />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>

          {/* Mobile controls */}
          <div className="block sm:hidden">
            <CarouselControls
              currentSlide={coursesCurrentSlide}
              totalSlides={courseCards.length}
              onPrev={() => coursesSwiperRef.current?.slidePrev()}
              onNext={() => coursesSwiperRef.current?.slideNext()}
              theme="dark"
              progressClass="courses-progress"
            />
          </div>
        </div>
      </div>
    </section>
  );
};
