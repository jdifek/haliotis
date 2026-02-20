"use client";

import { HeroSection } from "@/components/Diving/HeroSection";
import { ArticleCard } from "@/components/ArticleCard";
import { Pagination } from "@/components/Pagination";
import { Tabs } from "@/components/buttons/Tabs";
import { ButtonWithIcon } from "@/components/buttons/ButtonWithIcon";
import { useState, useRef, useEffect } from "react";

type Tab = {
  id: string;
  label: string;
  description: string;
};

const tabs: Tab[] = [
  {
    id: "peniche",
    label: "Peniche",
    description:
      "Learn how to scuba dive in Peniche is an incredible experience that will allow you to see amazing creatures in their natural habitat and visit the best scuba diving spots. The beginner PADI courses are internationally recognised which allow you to scuba dive anywhere in the world.",
  },
  {
    id: "sesimbra",
    label: "Sesimbra",
    description:
      "Discover scuba diving in Sesimbra, one of Portugal's most beautiful diving destinations. Experience crystal-clear waters and diverse marine life while learning from certified PADI instructors in a stunning coastal setting.",
  },
  {
    id: "madeira",
    label: "Madeira",
    description:
      "Explore the underwater wonders of Madeira with our PADI courses. This Atlantic paradise offers year-round diving conditions and breathtaking marine biodiversity perfect for beginners and experienced divers alike.",
  },
  {
    id: "santa-maria",
    label: "Santa Maria",
    description:
      "Experience world-class diving in Santa Maria, Azores. Known for its encounters with mobula rays and blue sharks, this destination offers unforgettable diving experiences with our certified PADI instructors.",
  },
  {
    id: "faial",
    label: "Faial",
    description:
      "Dive into the volcanic underwater landscapes of Faial in the Azores. Our PADI courses will guide you through unique dive sites featuring dramatic rock formations and abundant Atlantic marine life.",
  },
  {
    id: "sao-vicente",
    label: "Sao Vicente",
    description:
      "Start your diving journey in São Vicente, Madeira. With excellent visibility and rich marine ecosystems, this location is perfect for completing your PADI certification in a beautiful island setting.",
  },
];

type TripCard = {
  image: string;
  price: number;
  title: string;
  description: string;
  link: string;
  location: string;
  details: string;
  equipmentPrice: string;
};

const generateCards = (location: string, count: number): TripCard[] => {
  const names = [
    "Double Dive Trip",
    "Night Dive Trip",
    "Sunset Dive Trip",
    "Discovery Dive",
    "Shark Watching Dive",
    "Wreck Dive",
    "Reef Dive",
    "Cave Dive",
    "Twilight Dive",
    "Manta Ray Dive",
    "Volcanic Dive",
    "Blue Shark Dive",
  ];
  const prices = [79, 80, 85, 89, 89, 95, 99, 105, 110, 75, 92, 120];

  return Array.from({ length: count }, (_, i) => ({
    image: "/Rectangle 8.png",
    price: prices[i % prices.length],
    title: `${names[i % names.length]} — ${location}`,
    description: `Amazing ${names[i % names.length].toLowerCase()} in ${location}. Explore the best dive spots with our certified PADI instructors.`,
    link: `/trips/${location.toLowerCase().replace(/ /g, "-")}-${i}`,
    location,
    details: `<p>Morning dive trip by boat to 2 different dive sites in ${location} Natural Reserve intended for certified divers.</p><p>The Archipelago of Berlengas is composed by 3 groups of islands and both can provide great dives for all levels of experience!</p><p>The meeting point is in our diving center at 8h30, where you will prepare all the diving equipment and you can use our changing rooms to change clothes.</p><p>The transfer from the dive center to the harbor, where we have our boats, takes 5 minutes and we do it in our vans. Boat trips last an average of 30 to 40 minutes and we spend the surface interval on board in quiet bays where we provide water, bananas and one 'pastel de nata'.</p><p>The return time is between 15h00 and 16h00 and you can take a hot shower in our facilities.</p><p>The choice of the dive sites may change depending on the weather conditions and the experience of the divers.</p>`,
    equipmentPrice: `€ ${25 + (i % 4) * 5}.00`,
  }));
};

const tripCardsData: Record<string, TripCard[]> = {
  peniche: generateCards("Peniche", 9),
  sesimbra: generateCards("Sesimbra", 6),
  madeira: generateCards("Madeira", 7),
  "santa-maria": generateCards("Santa Maria", 4),
  faial: generateCards("Faial", 5),
  "sao-vicente": generateCards("Sao Vicente", 3),
};

const CARDS_PER_PAGE = 6;

const Diving = () => {
  const [activeTab, setActiveTab] = useState("peniche");
  const [currentPage, setCurrentPage] = useState(1);
  const [isTabOpen, setIsTabOpen] = useState(false);
  const [expandedCardId, setExpandedCardId] = useState<number | null>(null);
  const [triangleX, setTriangleX] = useState<number | null>(null);

  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  const currentTabData = tabs.find((t) => t.id === activeTab) || tabs[0];
  const allCards = tripCardsData[activeTab] || [];
  const totalPages = Math.ceil(allCards.length / CARDS_PER_PAGE);
  const paginatedCards = allCards.slice(
    (currentPage - 1) * CARDS_PER_PAGE,
    currentPage * CARDS_PER_PAGE
  );

  // Calculate triangle position under the expanded card
  useEffect(() => {
    if (expandedCardId === null) return;

    const cardEl = cardRefs.current[expandedCardId];
    const detailsEl = document.getElementById("diving-trip-details");

    if (!cardEl || !detailsEl) return;

    const cardRect = cardEl.getBoundingClientRect();
    const detailsRect = detailsEl.getBoundingClientRect();
    const centerX = cardRect.left + cardRect.width / 2 - detailsRect.left;

    setTriangleX(centerX);
  }, [expandedCardId]);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    setCurrentPage(1);
    setExpandedCardId(null);
  };

  const handleToggleExpand = (index: number) => {
    setExpandedCardId(expandedCardId === index ? null : index);
  };

  const expandedCard = expandedCardId !== null ? paginatedCards[expandedCardId] : null;

  // Determine which row the expanded card is in (0-indexed), so details panel appears after that row
  const expandedRow = expandedCardId !== null ? Math.floor(expandedCardId / 3) : null;

  // Split cards into rows of 3
  const rows: TripCard[][] = [];
  for (let i = 0; i < paginatedCards.length; i += 3) {
    rows.push(paginatedCards.slice(i, i + 3));
  }

  return (
    <main className="-mt-[97px]">
      <HeroSection />

      {/* Tabs Section - Desktop */}
      <section className="hidden md:flex h-[95px] bg-white justify-center items-end">
        <Tabs
          useLocationColors={true}

          className="mb-1"
          tabsContainerClassName="relative flex gap-6"
          tabs={tabs}
          activeTab={activeTab}
          onTabChange={handleTabChange}
          underlineClassName="absolute -bottom-1 left-0 w-full h-[2px] transition-opacity"
        />
      </section>

      {/* Mobile Tab Selector */}
      <div className="md:hidden bg-white px-4 py-3">
        <button
          onClick={() => setIsTabOpen(!isTabOpen)}
          className="flex w-full items-center justify-between rounded-[10px] px-3 py-2 h-[42px] bg-white border border-[#e84814]"
        >
          <span className="text-[16px] font-semibold leading-[160%] text-[#111]">
            {currentTabData.label}
          </span>
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            className={`transition-transform flex-shrink-0 ${isTabOpen ? "rotate-180" : ""}`}
          >
            <path
              d="M17.8534 9.85369L12.8537 14.8534C12.8073 14.8999 12.7522 14.9367 12.6915 14.9619C12.6308 14.9871 12.5657 15 12.5 15C12.4343 15 12.3692 14.9871 12.3085 14.9619C12.2478 14.9367 12.1927 14.8999 12.1463 14.8534L7.14663 9.85369C7.07663 9.78377 7.02895 9.69465 7.00963 9.59761C6.9903 9.50058 7.00021 9.39999 7.03808 9.30858C7.07595 9.21718 7.1401 9.13907 7.22239 9.08413C7.30468 9.0292 7.40142 8.99992 7.50036 9H17.4996C17.5986 8.99992 17.6953 9.0292 17.7776 9.08413C17.8599 9.13907 17.924 9.21718 17.9619 9.30858C17.9998 9.39999 18.0097 9.50058 17.9904 9.59761C17.971 9.69465 17.9234 9.78377 17.8534 9.85369Z"
              fill="black"
            />
          </svg>
        </button>

        {isTabOpen && (
          <div className="mt-2 bg-white rounded-[10px] border-2 border-gray-200 overflow-hidden">
            <div className="flex flex-col gap-[10px] p-2">
              {tabs.map((tab) => {
                const isSelected = tab.id === activeTab;
                return (
                  <button
                    key={tab.id}
                    onClick={() => {
                      handleTabChange(tab.id);
                      setIsTabOpen(false);
                    }}
                    className={`flex items-center justify-between rounded-[10px] px-3 py-2 h-[40px] border-2 ${
                      isSelected ? "bg-[#e84814] border-[#e84814]" : "bg-white border-[#d9d9d9]"
                    }`}
                  >
                    <span className={`text-[16px] font-normal leading-[140%] ${isSelected ? "text-white" : "text-[#111]"}`}>
                      {tab.label}
                    </span>
                    {isSelected && (
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <path
                          d="M9.8537 6.14663L14.8534 11.1463C14.8999 11.1927 14.9367 11.2478 14.9619 11.3085C14.9871 11.3692 15 11.4343 15 11.5C15 11.5657 14.9871 11.6308 14.9619 11.6915C14.9367 11.7522 14.8999 11.8073 14.8534 11.8537L9.8537 16.8534C9.78377 16.9234 9.69465 16.971 9.59762 16.9904C9.50058 17.0097 9.39999 16.9998 9.30859 16.9619C9.21718 16.924 9.13907 16.8599 9.08414 16.7776C9.0292 16.6953 8.99992 16.5986 9 16.4996L9 6.50036C8.99992 6.40142 9.0292 6.30468 9.08414 6.22239C9.13907 6.1401 9.21718 6.07595 9.30859 6.03808C9.39999 6.00021 9.50058 5.99031 9.59761 6.00963C9.69465 6.02895 9.78377 6.07663 9.8537 6.14663Z"
                          fill="white"
                        />
                      </svg>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Main Content Section */}
      <section className="bg-[#f1f1f1] px-4 pb-12 pt-8 md:px-[30px]  md:pb-[50px] md:pt-[46px]">
        {/* Description — centered */}
        <p
          className="text-center mb-10 md:mb-12"
          style={{
            fontFamily: "var(--font-family)",
            fontWeight: 400,
            fontSize: "15px",
            lineHeight: "160%",
            color: "#101010",
            opacity: 0.8,
          }}
        >
          {currentTabData.description}
        </p>

        {/* Cards Grid — row by row, details panel inserted after the row of the expanded card */}
        <div className="flex flex-col gap-5">
          {rows.map((row, rowIndex) => {
            const rowStartIndex = rowIndex * 3;
            return (
              <div key={`${activeTab}-${currentPage}-row-${rowIndex}`}>
                {/* Row of cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {row.map((card, colIndex) => {
                    const globalIndex = rowStartIndex + colIndex;
                    return (
                      <div
                        key={`${activeTab}-${currentPage}-${globalIndex}`}
                        ref={(el) => { cardRefs.current[globalIndex] = el; }}
                      >
                        <ArticleCard
                          bgTextBlock="!bg-[#fffff]"
                          image={card.image}
                          price={card.price}
                          title={card.title}
                          description={card.description}
                          link={card.link}
                          details={card.details}
                          equipmentPrice={card.equipmentPrice}
                          isExpanded={expandedCardId === globalIndex}
                          onToggleExpand={() => handleToggleExpand(globalIndex)}
                          onBookClick={() => console.log("Book clicked", card.title)}
                        />
                      </div>
                    );
                  })}
                </div>

                {/* Details panel — shown after the row that contains the expanded card */}
                {expandedRow === rowIndex && expandedCard && (
                  <div
                    id="diving-trip-details"
                    className="hidden lg:block mt-[30px] border-[3px] border-[#f49519] rounded-2xl bg-white relative w-full p-6 lg:p-10"
                  >
                    {/* Triangle pointer */}
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
                      {/* Left — details text */}
                      <div
                        className="flex-1 text-[15px] leading-[160%] text-[#101010] space-y-4"
                        style={{ opacity: 0.8 }}
                        dangerouslySetInnerHTML={{ __html: expandedCard.details }}
                      />

                      {/* Right — card summary */}
                      <div className="w-full lg:w-[469px] bg-[#f1f1f1] rounded-3xl p-4 flex flex-col items-center justify-center gap-4">
                        <h3 className="text-[28px] lg:text-[42px] font-medium leading-[1.3] text-center text-black">
                          {expandedCard.title}
                        </h3>
                        <div className="flex gap-4 items-center">
                          {/* Price badge */}
                          <div className="flex items-center gap-2 rounded-lg bg-[#f49519] px-3 py-2">
                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                              <path
                                fillRule="evenodd"
                                clipRule="evenodd"
                                d="M0 10C0 4.47715 4.47715 0 10 0C15.5228 0 20 4.47715 20 10C20 15.5228 15.5228 20 10 20C4.47715 20 0 15.5228 0 10ZM8.6158 7.5C9.0535 6.71823 9.8025 6 10.7498 6C11.284 6 11.819 6.23239 12.2923 6.70646C12.6824 7.09734 13.3156 7.09792 13.7065 6.70775C14.0973 6.31758 14.0979 5.68442 13.7077 5.29354C12.9274 4.51179 11.9042 4 10.7498 4C9.3289 4 8.1189 4.77025 7.29826 5.86449C6.93769 6.34528 6.64329 6.89783 6.42654 7.5H6C5.44772 7.5 5 7.94772 5 8.5C5 8.9581 5.30804 9.3443 5.72828 9.4626C5.82228 9.4891 5.91867 9.5 6.01613 9.5C5.99473 9.8304 5.99473 10.1696 6.01613 10.5C5.91867 10.5 5.82228 10.5109 5.72828 10.5374C5.30804 10.6557 5 11.0419 5 11.5C5 12.0523 5.44772 12.5 6 12.5H6.42654C6.64329 13.1022 6.93769 13.6547 7.29826 14.1355C8.1189 15.2298 9.3289 16 10.7498 16C11.9042 16 12.9274 15.4882 13.7077 14.7065C14.0979 14.3156 14.0973 13.6824 13.7065 13.2923C13.3156 12.9021 12.6824 12.9027 12.2923 13.2935C11.819 13.7676 11.284 14 10.7498 14C9.8025 14 9.0535 13.2818 8.6158 12.5H10C10.5523 12.5 11 12.0523 11 11.5C11 10.9477 10.5523 10.5 10 10.5H8.0217C7.99312 10.1735 7.99312 9.8265 8.0217 9.5H11C11.5523 9.5 12 9.0523 12 8.5C12 7.94772 11.5523 7.5 11 7.5H8.6158Z"
                                fill="white"
                              />
                            </svg>
                            <span className="text-[15px] font-bold leading-[120%] text-white">
                              {expandedCard.price}
                            </span>
                          </div>

                          {/* Book Now button */}
                          <ButtonWithIcon
                            label="Book now"
                            icon={
                              <svg width="44" height="44" viewBox="0 0 44 44" fill="none">
                                <rect width="44" height="44" rx="22" fill="white" />
                                <path
                                  d="M27.9624 23.293C28.8861 22.3501 30.3835 22.3501 31.3072 23.293C32.2309 24.2358 32.2309 25.7642 31.3072 26.707L27.2341 30.8645C27.1332 30.9675 27.0021 31.1066 26.8434 31.2195L26.843 31.2191C26.7172 31.3088 26.5813 31.383 26.4381 31.4402C26.2583 31.5122 26.0727 31.5468 25.9326 31.5754L23.9487 31.9805C23.6275 32.046 23.2955 31.9435 23.0639 31.707C22.8322 31.4706 22.7317 31.1318 22.796 30.8039L23.1928 28.7789C23.2209 28.6358 23.2543 28.4461 23.3249 28.2625C23.3809 28.1164 23.4537 27.9777 23.5415 27.8492L23.6283 27.7332C23.718 27.6223 23.8136 27.5277 23.8893 27.4504L27.9624 23.293ZM29.9219 24.707C29.7634 24.5453 29.5063 24.5453 29.3478 24.707L25.2747 28.8645C25.2078 28.9328 25.175 28.9665 25.1519 28.9918C25.1497 28.9943 25.1498 28.9955 25.1496 28.9965C25.1418 29.0301 25.1325 29.0767 25.114 29.1711L25.0053 29.725L25.5484 29.6145C25.6408 29.5956 25.6865 29.5861 25.7194 29.5781C25.7227 29.5768 25.7234 29.5764 25.724 29.5758C25.7488 29.5522 25.7818 29.5187 25.8488 29.4504L29.9219 25.293C30.0803 25.1312 30.0803 24.8688 29.9219 24.707ZM19.8377 26C20.3787 26 20.8174 26.4478 20.8174 27C20.8174 27.5523 20.3788 28 19.8377 28H16.8986C16.3575 28 15.9189 27.5523 15.9189 27C15.9189 26.4477 16.3575 26 16.8986 26H19.8377ZM23.2667 22C23.8077 22 24.2464 22.4478 24.2464 23C24.2464 23.5523 23.8078 24 23.2667 24H16.8986C16.3575 24 15.9189 23.5523 15.9189 23C15.9189 22.4477 16.3575 22 16.8986 22H23.2667ZM29.6348 20H13.9594V27.8C13.9594 28.3764 13.9601 28.7487 13.9828 29.032C14.0045 29.3036 14.0415 29.4045 14.0662 29.4539L14.1041 29.523C14.1848 29.6572 14.2953 29.7701 14.4267 29.8523L14.4944 29.891L14.5419 29.9117C14.6025 29.934 14.7081 29.9595 14.9078 29.9762C15.1853 29.9993 15.55 30 16.1148 30H19.8377C20.3788 30 20.8174 30.4477 20.8174 31C20.8174 31.5523 20.3788 32 19.8377 32H16.1148C15.5823 32 15.124 32.0009 14.7482 31.9695C14.3608 31.9372 13.9754 31.8659 13.6047 31.673V31.6727C13.0517 31.385 12.602 30.9264 12.3203 30.3621C12.1314 29.9837 12.0615 29.5903 12.0299 29.1949C11.9992 28.8113 12 28.3435 12 27.8V18.2C12 17.6565 11.9992 17.1887 12.0299 16.8051C12.0615 16.4097 12.1314 16.0163 12.3203 15.6379C12.6021 15.0735 13.0517 14.6146 13.6047 14.327C13.9754 14.1342 14.3608 14.0628 14.7482 14.0305C15.0771 14.003 15.4692 14.0011 15.9189 14.0008V13C15.9189 12.4477 16.3575 12 16.8986 12C17.4396 12 17.8783 12.4477 17.8783 13V14H25.716V13C25.716 12.4477 26.1546 12 26.6957 12C27.2368 12 27.6754 12.4477 27.6754 13V14.0008C28.1251 14.0011 28.5171 14.003 28.8461 14.0305C29.2334 14.0628 29.6189 14.1341 29.9896 14.327C30.5424 14.6145 30.9918 15.0735 31.2735 15.6379C31.4624 16.0163 31.5328 16.4097 31.5644 16.8051C31.5951 17.1887 31.5943 17.6565 31.5943 18.2V20C31.5943 20.5523 31.1556 21 30.6145 21C30.0735 21 29.6348 20.5523 29.6348 20ZM16.1148 16C15.55 16 15.1853 16.0007 14.9078 16.0238C14.6417 16.046 14.5429 16.0838 14.4944 16.109C14.3101 16.2048 14.1601 16.3579 14.0662 16.5461C14.0415 16.5956 14.0045 16.6964 13.9828 16.968C13.9628 17.2171 13.9606 17.535 13.9602 18H29.6341C29.6336 17.535 29.6314 17.2171 29.6115 16.968C29.5897 16.6964 29.5527 16.5955 29.5281 16.5461C29.446 16.3816 29.321 16.2437 29.1676 16.1477L29.0998 16.109C29.0514 16.0838 28.9526 16.046 28.6865 16.0238C28.4089 16.0007 28.0442 16 27.4795 16H16.1148Z"
                                  fill="black"
                                />
                              </svg>
                            }
                          />
                        </div>

                        {expandedCard.equipmentPrice && (
                          <p className="font-medium text-[18px] leading-[1.4] text-black text-center">
                            Equipment/Extra Price:{" "}
                            <span className="underline font-medium text-[18px] leading-[1.4] text-black">
                              {expandedCard.equipmentPrice}
                            </span>
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-10 flex justify-center">
            <Pagination
              totalPages={totalPages}
              currentPage={currentPage}
              onPageChange={(page) => {
                setCurrentPage(page);
                setExpandedCardId(null);
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
            />
          </div>
        )}
      </section>
    </main>
  );
};

export default Diving;