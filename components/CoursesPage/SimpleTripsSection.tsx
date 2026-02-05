"use client";

import { ArticleCard } from "../ArticleCard";
import { CarouselControls } from "../CarouselControls";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { useState, useRef } from "react";
import type { Swiper as SwiperType } from "swiper";
import { BlackActionButton } from "../buttons/BlackActionButton";

type Props = {
  tripCards: {
    image: string;
    price: number;
    title: string;
    description: string;
    link: string;
    location: string;
    details: string;
    equipmentPrice: string;
  }[];
  className?:string
};

export const SimpleTripsSection: React.FC<Props> = ({ className,tripCards }) => {
  const tripsSwiperRef = useRef<SwiperType | null>(null);
  const [tripsCurrentSlide, setTripsCurrentSlide] = useState(0);

  return (
    <section className={`bg-[#f1f1f1]  mx-auto max-w-[1920px] px-4 md:px-8 lg:px-[158px] md:py-18.25 ${className}`}>
      <div className="flex flex-col gap-[30px] overflow-hidden max-w-[1920px] mx-auto">
        {/* Заголовок и подзаголовок */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="flex flex-col gap-[10px]">
            <h2 className="text-[28px] font-medium leading-[130%] text-black sm:text-[36px] lg:text-[42px]">
              Dive Trips
            </h2>
            <p className="text-[15px] font-normal leading-[160%] text-[#101010] opacity-80">
              Find the perfect diving experience
            </p>
          </div>
          <div className="hidden sm:block">
            <CarouselControls
              currentSlide={tripsCurrentSlide}
              totalSlides={tripCards.length}
              onPrev={() => tripsSwiperRef.current?.slidePrev()}
              onNext={() => tripsSwiperRef.current?.slideNext()}
              theme="dark"
              progressClass="simple-trips-progress"
            />
          </div>
        </div>

        {/* Карусель */}
        <div className="w-full">
          <Swiper
            modules={[Navigation, Pagination]}
            spaceBetween={20}
            slidesPerView={1}
            loop={true}
            onSwiper={(swiper) => {
              tripsSwiperRef.current = swiper;
            }}
            onSlideChange={(swiper) => {
              setTripsCurrentSlide(swiper.realIndex);
            }}
            pagination={{
              type: "progressbar",
              el: ".simple-trips-progress",
            }}
            breakpoints={{
              393: {
                slidesPerView: 1,
                spaceBetween: 20,
              },
              640: {
                slidesPerView: 1,
                spaceBetween: 20,
              },
              768: {
                slidesPerView: 2,
                spaceBetween: 25,
              },
              1024: {
                slidesPerView: 2,
                spaceBetween: 30,
              },
              1495: {
                slidesPerView: 3,
                spaceBetween: 30,
              },
              1905: {
                slidesPerView: 3,
                spaceBetween: 30,
              },
            }}
          >
            {tripCards.map((card, index) => (
              <SwiperSlide key={index}>
                <ArticleCard
                  image={card.image}
                  price={card.price}
                  title={card.title}
                  description={card.description}
                  link={card.link}
                  details={card.details}
                  equipmentPrice={card.equipmentPrice}
                  isExpanded={false}
                  onToggleExpand={() => {}}
                  onBookClick={() => console.log("Book clicked")}
                />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        {/* Mobile controls */}
        <div className="block sm:hidden">
          <CarouselControls
            currentSlide={tripsCurrentSlide}
            totalSlides={tripCards.length}
            onPrev={() => tripsSwiperRef.current?.slidePrev()}
            onNext={() => tripsSwiperRef.current?.slideNext()}
            theme="dark"
            progressClass="simple-trips-progress"
          />
        </div>
      </div>
      <div className="flex justify-center ">
          <BlackActionButton
         
            label=" Show more courses"
            icon={
              <svg
                width="44"
                height="44"
                viewBox="0 0 44 44"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect width="44" height="44" rx="22" fill="white" />
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M27.3906 25.3968C28.0003 25.5779 28.6551 25.2049 28.8292 24.5359C28.9962 23.8769 28.6402 23.1846 28.026 22.9985L27.548 22.8545L26.9287 25.2487L27.3906 25.3968Z"
                  fill="black"
                />
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M26.9284 22.2487L22.2126 20.9315C21.9195 20.855 21.6249 21.0308 21.544 21.3235L21.125 22.8114C21.0427 23.1035 21.2025 23.4035 21.5029 23.4915L26.2187 24.7954L26.9284 22.2487Z"
                  fill="black"
                />
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M30.9392 28.0303C31.5979 27.7085 32.0396 27.0954 32.1 26.3916C32.1822 25.4322 31.4306 24.8019 30.4149 24.7954C29.3525 24.789 29.3008 25.7592 28.8701 26.0717L30.9392 28.0303Z"
                  fill="black"
                />
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M37.1087 34.1877C37.2591 33.7411 36.7001 33.4478 36.7001 33.4478L33.285 31.7303C33.0299 31.5845 32.4472 31.0495 32.4472 31.0495L27.7113 26.2057C27.3128 25.8225 26.817 25.5184 26.2393 25.3581L19.9027 23.5677L16.0946 19.5792C15.812 19.318 15.6633 18.8828 15.6633 18.8828L13.7479 13.7504C13.5367 12.9713 12.5657 12.708 12.5657 12.708L10.8639 12.1818L7.1798 11.2623C7.1798 11.2623 6.91752 11.2151 6.87122 11.4267C6.82424 11.6383 7.06928 11.69 7.06928 11.69L10.8399 13.321C11.6757 13.6026 12.0499 14.543 12.0499 14.543L13.8405 20.7775C13.8405 20.7775 14.0984 21.5505 14.5365 21.9512L18.6177 26.7603C18.6177 26.7603 19.0162 27.407 20.0197 27.7395L28.323 30.2455L31.3815 32.8179C31.3815 32.8179 31.6221 33.1156 32.3448 33.2989L36.3455 34.4598C36.6487 34.5398 36.9951 34.5246 37.1087 34.1877Z"
                  fill="black"
                />
                <mask
                  id="mask0_1_8074"
                  style={{ maskType: "luminance" }}
                  maskUnits="userSpaceOnUse"
                  x="13"
                  y="9"
                  width="6"
                  height="12"
                >
                  <path
                    d="M18.5017 9.5H13.3545V20.707H18.5017V9.5Z"
                    fill="white"
                  />
                </mask>
                <g mask="url(#mask0_1_8074)">
                  <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M17.9893 20.7069L18.479 16.3768C18.6194 15.7771 18.0583 15.25 18.0583 15.25L17.0984 14.2833L14.9404 12.3379C14.9404 12.3379 14.7805 12.2115 14.6718 12.3371C14.5633 12.4625 14.7102 12.5856 14.7102 12.5856L16.6676 15.0406C17.1311 15.5309 17.0423 16.298 17.0423 16.298L16.5667 18.6987C16.5667 18.6987 16.4927 19.1529 16.8802 19.5809L17.9893 20.7069Z"
                    fill="black"
                  />
                </g>
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M30.0483 16.1823C29.8934 16.0206 28.6895 15.1714 27.2136 15.1714C27.0492 15.1714 26.8885 15.1817 26.7312 15.1979L25.4275 14.4438C25.4275 14.8082 25.5256 15.1728 25.6119 15.4215C24.8578 15.6323 24.2059 15.8997 23.6407 15.8997L22.3984 15.0908C22.3984 15.7377 22.7089 16.3849 22.7089 16.3849C22.7089 16.3849 22.3984 17.0318 22.3984 17.6788L23.6407 16.8699C24.2059 16.8699 24.8578 17.1373 25.6119 17.3481C25.5256 17.5971 25.4275 17.9614 25.4275 18.3257L26.7309 17.5716C26.8885 17.5875 27.0492 17.5978 27.2136 17.5978C28.6895 17.5978 29.8934 16.7489 30.0483 16.5869C30.2039 16.4249 30.2039 16.3436 30.0483 16.1823Z"
                  fill="#E84814"
                />
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M20.3305 29.7692C20.1625 29.6074 18.8584 28.7584 17.2599 28.7584C17.0811 28.7584 16.9072 28.7685 16.7369 28.7845L15.3248 28.0303C15.3248 28.3945 15.4312 28.759 15.5245 29.0077C14.7078 29.2183 14.002 29.4859 13.3893 29.4859L12.043 28.6772C12.043 29.3241 12.3796 29.9713 12.3796 29.9713C12.3796 29.9713 12.043 30.6183 12.043 31.2652L13.3893 30.4565C14.0017 30.4565 14.7074 30.724 15.5245 30.9346C15.4312 31.1836 15.3248 31.5482 15.3248 31.9121L16.7369 31.1578C16.9072 31.1739 17.0811 31.184 17.2599 31.184C18.8584 31.184 20.1625 30.3346 20.3305 30.1731C20.4991 30.012 20.4985 29.9304 20.3305 29.7692Z"
                  fill="#E84814"
                />
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M33.9901 18.5485C33.9128 18.4676 33.3109 18.0428 32.5732 18.0428C32.4906 18.0428 32.4103 18.0481 32.3313 18.0561L31.6799 17.6787C31.6799 17.8606 31.7288 18.0432 31.7716 18.1676C31.3949 18.2728 31.069 18.4066 30.7863 18.4066L30.165 18.0021C30.165 18.3258 30.3206 18.6492 30.3206 18.6492C30.3206 18.6492 30.165 18.9729 30.165 19.2963L30.7863 18.8917C31.0694 18.8917 31.3949 19.0252 31.7716 19.1307C31.7288 19.2551 31.6799 19.4374 31.6799 19.6196L32.3313 19.2422C32.41 19.2503 32.4906 19.2555 32.5732 19.2555C33.3109 19.2555 33.9128 18.8307 33.9901 18.7499C34.0677 18.6697 34.0677 18.629 33.9901 18.5485Z"
                  fill="#E84814"
                />
              </svg>
            }
          />
        </div>
    </section>
  );
};