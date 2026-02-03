import { ArticleCard } from "../ArticleCard";
import { CarouselControls } from "../CarouselControls";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { useState, useRef, useEffect } from "react";
import type { Swiper as SwiperType } from "swiper";
import { FilterList } from "../FilterList";
import { ButtonWithIcon } from "../buttons/ButtonWithIcon";

type Props = {
  locations: {
    id: string;
    label: string;
  }[];
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
};

export const TripsSection: React.FC<Props> = ({ locations, tripCards }) => {
  const tripsSwiperRef = useRef<SwiperType | null>(null);
  const [selectedLocation, setSelectedLocation] = useState("all");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [tripsCurrentSlide, setTripsCurrentSlide] = useState(0);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [triangleX, setTriangleX] = useState<number | null>(null);
  const [expandedCardId, setExpandedCardId] = useState<number | null>(null);

  const filteredTrips =
    selectedLocation === "all"
      ? tripCards
      : tripCards.filter((card) => card.location === selectedLocation);

  // Функция для получения названия локации
  const getLocationLabel = () => {
    const location = locations.find((loc) => loc.id === selectedLocation);
    return location ? location.label : "ALL";
  };

  const handleLocationSelect = (id: string) => {
    setSelectedLocation(id);
    setIsDropdownOpen(false);
  };

  useEffect(() => {
    if (expandedCardId === null) return;

    const cardEl = cardRefs.current[expandedCardId];
    const detailsEl = document.getElementById("trip-details");

    if (!cardEl || !detailsEl) return;

    const cardRect = cardEl.getBoundingClientRect();
    const detailsRect = detailsEl.getBoundingClientRect();

    const centerX = cardRect.left + cardRect.width / 2 - detailsRect.left;

    setTriangleX(centerX);
  }, [expandedCardId, tripsCurrentSlide]);

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
            <h2 className="text-[24px] font-medium leading-[140%] text-[#111]">
              TRIPS
            </h2>
          </div>

          {/* Mobile Dropdown */}
          <div className="mb-6 lg:hidden">
            <div className="relative">
              {/* Dropdown Button */}
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex w-full items-center justify-between rounded-lg bg-[#281D4D] px-4 py-3 transition-colors hover:bg-[#fadc00]"
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
              onSelect={setSelectedLocation}
            />
          </div>
        </div>

        <div className="flex flex-1 flex-col gap-[30px] overflow-hidden">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="flex flex-col gap-[10px]">
              <h2 className="text-[28px] font-medium leading-[130%] text-black sm:text-[36px] lg:text-[42px]">
                Dive Trips:{" "}
                <span className="text-[#e84814]">{getLocationLabel()}</span>
              </h2>
              <p className="text-[15px] font-normal leading-[160%] text-[#101010] opacity-80">
                Find the perfect diving experience
              </p>
            </div>
            <div className="hidden sm:block">
              <CarouselControls
                currentSlide={tripsCurrentSlide}
                totalSlides={filteredTrips.length}
                onPrev={() => tripsSwiperRef.current?.slidePrev()}
                onNext={() => tripsSwiperRef.current?.slideNext()}
                theme="dark"
                progressClass="trips-progress"
              />
            </div>
          </div>

          <div className="w-full ">
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
                el: ".trips-progress",
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
                  slidesPerView: 1,
                  spaceBetween: 25,
                },
                1024: {
                  slidesPerView: 2,
                  spaceBetween: 30,
                },
                1495: {
                  slidesPerView: 2,
                  spaceBetween: 30,
                },
                1904: {
                  slidesPerView: 2,
                  spaceBetween: 30,
                },
                1905: {
                  slidesPerView: 3,
                  spaceBetween: 30,
                },
              }}
            >
              {filteredTrips.map((card, index) => (
                <SwiperSlide key={index}>
                  <div
                    ref={(el) => {
                      cardRefs.current[index] = el;
                    }}
                  >
                    <ArticleCard
                      image={card.image}
                      price={card.price}
                      title={card.title}
                      description={card.description}
                      link={card.link}
                      details={card.details}
                      equipmentPrice={card.equipmentPrice}
                      isExpanded={expandedCardId === index}
                      onToggleExpand={() =>
                        setExpandedCardId(
                          expandedCardId === index ? null : index
                        )
                      }
                      onBookClick={() => console.log("Book clicked")}
                    />
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
            {expandedCardId !== null && filteredTrips[expandedCardId] && (
              <div
                id="trip-details"
                className="hidden lg:block mt-[50px] border-[3px] border-[#f49519] rounded-2xl bg-white relative w-full p-6 lg:p-10"
              >
                {/* SVG треугольник */}
                <div
                  className="absolute -top-6 transition-all duration-300"
                  style={{
                    left: triangleX ?? "50%",
                    transform: "translateX(-50%)",
                  }}
                >
                  <svg width="47" height="24" viewBox="0 0 47 24" fill="none">
                    <path
                      d="M23.3359 0L46.6705 23.3345H23.3359H0.00141412L23.3359 0Z"
                      fill="#F49519"
                    />
                  </svg>
                </div>

                <div className="flex flex-col lg:flex-row gap-8">
                  {/* Левая колонка с текстом */}
                  <div className="flex-1 text-[15px] leading-[160%] text-[#101010] opacity-80 space-y-4">
                    {filteredTrips[expandedCardId].details ? (
                      <div
                        dangerouslySetInnerHTML={{
                          __html: filteredTrips[expandedCardId].details,
                        }}
                      />
                    ) : (
                      <p>No details available</p>
                    )}
                  </div>

                  {/* Правая колонка */}
                  <div className="w-full lg:w-[469px] bg-[#f1f1f1] rounded-3xl p-4 flex flex-col items-center justify-center gap-4">
                    <h3 className="text-[28px] lg:text-[42px] font-medium leading-[1.3] text-center text-black">
                      {filteredTrips[expandedCardId].title}
                    </h3>
                    <div className="flex gap-4">
                      <div className="flex items-center gap-2 rounded-lg bg-[#f49519] px-3 py-2">
                        <svg
                          width="20"
                          height="20"
                          viewBox="0 0 20 20"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M0 10C0 4.47715 4.47715 0 10 0C15.5228 0 20 4.47715 20 10C20 15.5228 15.5228 20 10 20C4.47715 20 0 15.5228 0 10ZM8.6158 7.5C9.0535 6.71823 9.8025 6 10.7498 6C11.284 6 11.819 6.23239 12.2923 6.70646C12.6824 7.09734 13.3156 7.09792 13.7065 6.70775C14.0973 6.31758 14.0979 5.68442 13.7077 5.29354C12.9274 4.51179 11.9042 4 10.7498 4C9.3289 4 8.1189 4.77025 7.29826 5.86449C6.93769 6.34528 6.64329 6.89783 6.42654 7.5H6C5.44772 7.5 5 7.94772 5 8.5C5 8.9581 5.30804 9.3443 5.72828 9.4626C5.82228 9.4891 5.91867 9.5 6.01613 9.5C5.99473 9.8304 5.99473 10.1696 6.01613 10.5C5.91867 10.5 5.82228 10.5109 5.72828 10.5374C5.30804 10.6557 5 11.0419 5 11.5C5 12.0523 5.44772 12.5 6 12.5H6.42654C6.64329 13.1022 6.93769 13.6547 7.29826 14.1355C8.1189 15.2298 9.3289 16 10.7498 16C11.9042 16 12.9274 15.4882 13.7077 14.7065C14.0979 14.3156 14.0973 13.6824 13.7065 13.2923C13.3156 12.9021 12.6824 12.9027 12.2923 13.2935C11.819 13.7676 11.284 14 10.7498 14C9.8025 14 9.0535 13.2818 8.6158 12.5H10C10.5523 12.5 11 12.0523 11 11.5C11 10.9477 10.5523 10.5 10 10.5H8.0217C7.99312 10.1735 7.99312 9.8265 8.0217 9.5H11C11.5523 9.5 12 9.0523 12 8.5C12 7.94772 11.5523 7.5 11 7.5H8.6158Z"
                            fill="white"
                          />
                        </svg>
                        <span className="text-center text-[15px] font-bold leading-[120%] text-white">
                          {filteredTrips[expandedCardId].price}
                        </span>
                      </div>

                      <ButtonWithIcon
                        className="w-full"
                        label="Book now"
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
                              d="M27.9624 23.293C28.8861 22.3501 30.3835 22.3501 31.3072 23.293C32.2309 24.2358 32.2309 25.7642 31.3072 26.707L27.2341 30.8645C27.1332 30.9675 27.0021 31.1066 26.8434 31.2195L26.843 31.2191C26.7172 31.3088 26.5813 31.383 26.4381 31.4402C26.2583 31.5122 26.0727 31.5468 25.9326 31.5754L23.9487 31.9805C23.6275 32.046 23.2955 31.9435 23.0639 31.707C22.8322 31.4706 22.7317 31.1318 22.796 30.8039L23.1928 28.7789C23.2209 28.6358 23.2543 28.4461 23.3249 28.2625C23.3809 28.1164 23.4537 27.9777 23.5415 27.8492L23.6283 27.7332C23.718 27.6223 23.8136 27.5277 23.8893 27.4504L27.9624 23.293ZM29.9219 24.707C29.7634 24.5453 29.5063 24.5453 29.3478 24.707L25.2747 28.8645C25.2078 28.9328 25.175 28.9665 25.1519 28.9918C25.1513 28.9924 25.1505 28.9928 25.15 28.9934C25.1497 28.9943 25.1498 28.9955 25.1496 28.9965C25.1418 29.0301 25.1325 29.0767 25.114 29.1711L25.0053 29.725L25.5484 29.6145C25.6408 29.5956 25.6865 29.5861 25.7194 29.5781C25.7203 29.5779 25.7213 29.5775 25.7221 29.5773C25.7227 29.5768 25.7234 29.5764 25.724 29.5758C25.7488 29.5522 25.7818 29.5187 25.8488 29.4504L29.9219 25.293C30.0803 25.1312 30.0803 24.8688 29.9219 24.707ZM19.8377 26C20.3787 26 20.8174 26.4478 20.8174 27C20.8174 27.5523 20.3788 28 19.8377 28H16.8986C16.3575 28 15.9189 27.5523 15.9189 27C15.9189 26.4477 16.3575 26 16.8986 26H19.8377ZM23.2667 22C23.8077 22 24.2464 22.4478 24.2464 23C24.2464 23.5523 23.8078 24 23.2667 24H16.8986C16.3575 24 15.9189 23.5523 15.9189 23C15.9189 22.4477 16.3575 22 16.8986 22H23.2667ZM29.6348 20H13.9594V27.8C13.9594 28.3764 13.9601 28.7487 13.9828 29.032C14.0045 29.3036 14.0415 29.4045 14.0662 29.4539L14.1041 29.523C14.1848 29.6572 14.2953 29.7701 14.4267 29.8523L14.4944 29.891L14.5419 29.9117C14.6025 29.934 14.7081 29.9595 14.9078 29.9762C15.1853 29.9993 15.55 30 16.1148 30H19.8377C20.3788 30 20.8174 30.4477 20.8174 31C20.8174 31.5523 20.3788 32 19.8377 32H16.1148C15.5823 32 15.124 32.0009 14.7482 31.9695C14.3608 31.9372 13.9754 31.8659 13.6047 31.673V31.6727C13.0517 31.385 12.602 30.9264 12.3203 30.3621C12.1314 29.9837 12.0615 29.5903 12.0299 29.1949C11.9992 28.8113 12 28.3435 12 27.8V18.2C12 17.6565 11.9992 17.1887 12.0299 16.8051C12.0615 16.4097 12.1314 16.0163 12.3203 15.6379C12.6021 15.0735 13.0517 14.6146 13.6047 14.327C13.9754 14.1342 14.3608 14.0628 14.7482 14.0305C15.0771 14.003 15.4692 14.0011 15.9189 14.0008V13C15.9189 12.4477 16.3575 12 16.8986 12C17.4396 12 17.8783 12.4477 17.8783 13V14H25.716V13C25.716 12.4477 26.1546 12 26.6957 12C27.2368 12 27.6754 12.4477 27.6754 13V14.0008C28.1251 14.0011 28.5171 14.003 28.8461 14.0305C29.2334 14.0628 29.6189 14.1341 29.9896 14.327C30.5424 14.6145 30.9918 15.0735 31.2735 15.6379C31.4624 16.0163 31.5328 16.4097 31.5644 16.8051C31.5951 17.1887 31.5943 17.6565 31.5943 18.2V20C31.5943 20.5523 31.1556 21 30.6145 21C30.0735 21 29.6348 20.5523 29.6348 20ZM16.1148 16C15.55 16 15.1853 16.0007 14.9078 16.0238C14.6417 16.046 14.5429 16.0838 14.4944 16.109C14.3101 16.2048 14.1601 16.3579 14.0662 16.5461C14.0415 16.5956 14.0045 16.6964 13.9828 16.968C13.9628 17.2171 13.9606 17.535 13.9602 18H29.6341C29.6336 17.535 29.6314 17.2171 29.6115 16.968C29.5897 16.6964 29.5527 16.5955 29.5281 16.5461C29.446 16.3816 29.321 16.2437 29.1676 16.1477L29.0998 16.109C29.0514 16.0838 28.9526 16.046 28.6865 16.0238C28.4089 16.0007 28.0442 16 27.4795 16H16.1148Z"
                              fill="black"
                            />
                          </svg>
                        }
                      />
                    </div>
                    {filteredTrips[expandedCardId].equipmentPrice && (
                      <p className="underline font-medium text-[18px] leading-[1.4] text-black text-center">
                        Equipment/Extra Price:{" "}
                        <span className="underline font-medium text-[18px] leading-[1.4] text-black">
                          {filteredTrips[expandedCardId].equipmentPrice}
                        </span>
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Mobile controls */}
          <div className="block sm:hidden">
            <CarouselControls
              currentSlide={tripsCurrentSlide}
              totalSlides={tripCards.length}
              onPrev={() => tripsSwiperRef.current?.slidePrev()}
              onNext={() => tripsSwiperRef.current?.slideNext()}
              theme="dark"
              progressClass="trips-progress"
            />
          </div>
        </div>
      </div>
    </section>
  );
};
