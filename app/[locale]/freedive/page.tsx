/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { ArticleCard } from "@/components/ArticleCard";
import { Pagination } from "@/components/Pagination";
import { Tabs } from "@/components/buttons/Tabs";
import { ButtonWithIcon } from "@/components/buttons/ButtonWithIcon";
import { useState, useRef, useEffect } from "react";
import FreediveSitesSection from "@/components/Freedive/DiveSitesSection";
import { useMenu } from "@/app/hooks/useMenu";
import { useLocale } from "next-intl";
import { HeroBanner } from "@/components/HeroBanner";
type ApiSlide = {
  desktop_image_url: string;
  mobile_image_url: string;
  title: string;
  description: string;
};

type ApiTripType = {
  id: number;
  name: string;
  short_description: string;
  description: string;
  image: string;
  price: {
    amount: string | number;
    amount_description?: string;
    currency: string;
  };
};

type ApiRegion = { id: number; name: string; position: number };
type TripCard = {
  image: string;
  price: number;
  title: string;
  description: string;
  link: string;
  details: string;
  equipmentPrice: string;
};
type ApiLocation = {
  id: number;
  region_id: number;
  name: string;
  description: string;
  certification: string;
  fish_level: number;
  difficulty_level: number;
  max_depth: string;
  video_url: string;
  video_cover: string;
};

type FreediveApiData = {
  page: {
    title: string;
    seo: { meta_description: string; meta_keywords: string };
    banner: { slides: ApiSlide[] };
  };
  dive_trip_types: ApiTripType[];
  regions: ApiRegion[];
  locations: ApiLocation[];
};

const CARDS_PER_PAGE = 6;
const FALLBACK_COLOR = "#e84814";
// ─── Component ───────────────────────────────────────────────────────────────

const Diving = ({ params }: { params: Promise<{ locale: string }> }) => {
  const locale = useLocale();
  const [freediveData, setFreediveData] = useState<any | null>(
    null
  );
  const [dataLoading, setDataLoading] = useState(false);
  const { divingCenters, colorBySlug, loading } = useMenu(locale);

  // Табы строятся из diving_centers, отсортированных по position
  const tabs = divingCenters.map((center) => ({
    id: center.slug,
    label: center.name,
    color: center.color,
  }));

  // Инициализируем сразу — данные могут уже быть в кэше на момент первого рендера
  const [activeTab, setActiveTab] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [expandedCardId, setExpandedCardId] = useState<number | null>(null);
  const [triangleX, setTriangleX] = useState<number | null>(null);
  const [colCount, setColCount] = useState(3);

  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Если данных не было на момент mount (первая загрузка без кэша) — ставим первый таб
  useEffect(() => {
    if (tabs.length > 0 && !activeTab) {
      setActiveTab(tabs[0].id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tabs.length]);
  useEffect(() => {
    if (!activeTab) return;
    const activeCenter = divingCenters.find((c) => c.slug === activeTab);
    if (!activeCenter) return;

    setDataLoading(true);
    setFreediveData(null);

    fetch(
`https://cp.haliotis.space/api/v1/diving-category/freedive?center_id=${activeCenter.id}&lang=${locale}&attach_regions=true`,
      { headers: { Accept: "application/json" } }
    )
      .then((r) => r.json())
      .then((json) => setFreediveData(json.data))
      .catch(console.error)
      .finally(() => setDataLoading(false));
  }, [activeTab, divingCenters, locale]);

  useEffect(() => {
    const update = () => {
      setColCount(
        window.innerWidth >= 1500 ? 3 : window.innerWidth >= 640 ? 2 : 1
      );
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const activeColor = (activeTab ? colorBySlug[activeTab] : null) ?? FALLBACK_COLOR;
  // Карточки — в идеале приходят с бэкенда, пока генерим моки по slug
  const allCards = (freediveData?.dive_trips ?? []).map((trip: any) => ({
    image: trip.image_url || "",                    // обрати внимание: image_url, а не image
    price: Number(trip.price?.amount || 0),
    title: trip.name,
    description: trip.description || trip.short_description || "",   // в твоём API description есть
    link: "#",
    details: trip.description || "",
    equipmentPrice: trip.price?.amount_description || "",
  }));
  console.log(allCards, "allCards");

  const totalPages = Math.ceil(allCards.length / CARDS_PER_PAGE);
  const paginatedCards = allCards.slice(
    (currentPage - 1) * CARDS_PER_PAGE,
    currentPage * CARDS_PER_PAGE
  );
  // Позиция треугольника под развёрнутой карточкой
  useEffect(() => {
    if (expandedCardId === null) return;
    const cardEl = cardRefs.current[expandedCardId];
    const detailsEl = document.getElementById("diving-trip-details");
    if (!cardEl || !detailsEl) return;
    const cardRect = cardEl.getBoundingClientRect();
    const detailsRect = detailsEl.getBoundingClientRect();
    setTriangleX(cardRect.left + cardRect.width / 2 - detailsRect.left);
  }, [expandedCardId]);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    setCurrentPage(1);
    setExpandedCardId(null);
  };

  const handleToggleExpand = (index: number) => {
    setExpandedCardId(expandedCardId === index ? null : index);
  };

  const rows: TripCard[][] = [];
  for (let i = 0; i < paginatedCards.length; i += colCount) {
    rows.push(paginatedCards.slice(i, i + colCount));
  }

  const expandedRow =
    expandedCardId !== null ? Math.floor(expandedCardId / colCount) : null;
  const expandedCard =
    expandedCardId !== null ? paginatedCards[expandedCardId] : null;


  console.log("Diving render:", { tabs, activeTab, loading });

  return (
    <main className="-mt-[97px]">
<HeroBanner
  slides={
    freediveData?.banner?.slides?.length
      ? freediveData.banner.slides.map((s: any) => ({
          image: s.desktop_image_url,
          mobileImage: s.mobile_image_url,
          title: s.title,
          description: s.description,
        }))
      : [{ image: "" }]
  }
  height="h-[75vh]"
  breadcrumbs={[
    { label: "Haliotis", href: "/" },
    { label: freediveData?.title ?? "Freedive" },
  ]}
>
  <section className="container px-5 py-6">
    <div className="max-w-3xl">
      <div className="mb-12">
        <h1 className="mb-3 text-[32px] font-bold leading-tight text-white xl:text-5xl">
          {freediveData?.title || "Freedive"}
        </h1>

        <div className="mb-6">
        <svg
                      width="157"
                      height="7"
                      viewBox="0 0 157 7"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <mask
                        id="mask0_1_2763"
                        maskUnits="userSpaceOnUse"
                        x="0"
                        y="0"
                        width="157"
                        height="7"
                      >
                        <path
                          d="M156.168 6.05303H0V0H156.168V6.05303Z"
                          fill="white"
                        />
                      </mask>
                      <g mask="url(#mask0_1_2763)">
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M155.21 4.137C153.464 4.137 152.645 3.3435 151.609 2.3385C150.478 1.242 149.196 0 146.674 0C144.152 0 142.87 1.242 141.74 2.3385C140.703 3.3435 139.884 4.137 138.139 4.137C136.393 4.137 135.574 3.3435 134.537 2.3385C133.406 1.242 132.124 0 129.602 0C127.079 0 125.797 1.242 124.666 2.3385C123.628 3.3435 122.809 4.137 121.063 4.137C119.317 4.137 118.498 3.3435 117.46 2.3385C116.329 1.242 115.047 0 112.524 0C110.002 0 108.719 1.242 107.588 2.3385C106.551 3.3435 105.732 4.137 103.985 4.137C103.974 4.137 103.964 4.143 103.953 4.14375C103.941 4.143 103.932 4.137 103.92 4.137C102.174 4.137 101.355 3.3435 100.318 2.3385C99.1875 1.242 97.9057 0 95.3835 0C92.8612 0 91.5795 1.242 90.4492 2.3385C89.4127 3.3435 88.5937 4.137 86.8485 4.137C85.1025 4.137 84.2835 3.3435 83.247 2.3385C82.116 1.242 80.8335 0 78.3112 0C75.7882 0 74.5065 1.242 73.3755 2.3385C72.3382 3.3435 71.5192 4.137 69.7732 4.137C68.0265 4.137 67.2075 3.3435 66.1702 2.3385C65.0392 1.242 63.7567 0 61.2337 0C58.7115 0 57.429 1.242 56.298 2.3385C55.2608 3.3435 54.4417 4.137 52.695 4.137C52.6042 4.137 52.5225 4.16475 52.4393 4.18875C52.356 4.16475 52.2742 4.137 52.1835 4.137C50.4375 4.137 49.6185 3.3435 48.582 2.3385C47.451 1.24275 46.1685 0 43.6463 0C41.1248 0 39.843 1.24275 38.712 2.3385C37.6755 3.3435 36.8572 4.137 35.112 4.137C33.366 4.137 32.5463 3.3435 31.5098 2.3385C30.3788 1.24275 29.097 0 26.5748 0C24.0518 0 22.77 1.24275 21.6383 2.3385C20.6018 3.3435 19.7828 4.137 18.0368 4.137C16.29 4.137 15.4703 3.3435 14.4338 2.3385C13.302 1.24275 12.0202 0 9.49725 0C6.97425 0 5.6925 1.24275 4.5615 2.3385C3.52425 3.3435 2.70525 4.137 0.9585 4.137C0.429 4.137 0 4.566 0 5.09475C0 5.62425 0.429 6.05325 0.9585 6.05325C3.48075 6.05325 4.76325 4.8105 5.89425 3.71475C6.9315 2.70975 7.7505 1.91625 9.49725 1.91625C11.244 1.91625 12.063 2.70975 13.1003 3.71475C14.2313 4.8105 15.5138 6.05325 18.0368 6.05325C20.559 6.05325 21.8407 4.8105 22.9725 3.71475C24.009 2.70975 24.828 1.91625 26.5748 1.91625C28.3208 1.91625 29.1398 2.70975 30.1763 3.71475C31.3073 4.8105 32.589 6.05325 35.112 6.05325C37.6335 6.05325 38.9152 4.8105 40.0462 3.71475C41.082 2.70975 41.901 1.91625 43.6463 1.91625C45.393 1.91625 46.2113 2.70975 47.2485 3.71475C48.3795 4.8105 49.6612 6.05325 52.1835 6.05325C52.2742 6.05325 52.356 6.02475 52.4393 6.0015C52.5225 6.02475 52.6042 6.05325 52.695 6.05325C55.218 6.05325 56.4998 4.8105 57.6315 3.71475C58.668 2.70975 59.487 1.91625 61.2337 1.91625C62.9812 1.91625 63.8002 2.70975 64.8375 3.71475C65.9685 4.8105 67.2502 6.05325 69.7732 6.05325C72.2955 6.05325 73.578 4.8105 74.709 3.71475C75.7455 2.70975 76.5645 1.91625 78.3112 1.91625C80.0572 1.91625 80.8762 2.70975 81.9135 3.71475C83.0445 4.8105 84.3262 6.05325 86.8485 6.05325C89.37 6.05325 90.6517 4.8105 91.7827 3.71475C92.8192 2.70975 93.6375 1.91625 95.3835 1.91625C97.1295 1.91625 97.9485 2.70975 98.985 3.71475C100.116 4.8105 101.398 6.05325 103.92 6.05325C103.932 6.05325 103.941 6.04725 103.953 6.0465C103.964 6.04725 103.974 6.05325 103.985 6.05325C106.508 6.05325 107.79 4.8105 108.921 3.71475C109.958 2.70975 110.777 1.91625 112.524 1.91625C114.271 1.91625 115.09 2.70975 116.127 3.71475C117.259 4.8105 118.54 6.05325 121.063 6.05325C123.586 6.05325 124.868 4.8105 125.999 3.71475C127.036 2.70975 127.855 1.91625 129.602 1.91625C131.348 1.91625 132.167 2.70975 133.203 3.71475C134.335 4.8105 135.616 6.05325 138.139 6.05325C140.66 6.05325 141.942 4.8105 143.073 3.71475C144.109 2.70975 144.928 1.91625 146.674 1.91625C148.42 1.91625 149.239 2.70975 150.275 3.71475C151.406 4.8105 152.688 6.05325 155.21 6.05325C155.739 6.05325 156.168 5.62425 156.168 5.09475C156.168 4.566 155.739 4.137 155.21 4.137Z"
                          fill="white"
                        />
                      </g>
                    </svg>        </div>

        {freediveData?.banner?.slides?.[0]?.description && (
          <p className="max-w-xl text-[16px] font-light text-white xl:text-lg">
            {freediveData.banner.slides[0].description}
          </p>
        )}
      </div>
    </div>
  </section>
</HeroBanner>
      {/* ── Desktop tabs ── */}
      <section className="hidden md:flex h-[95px] bg-white justify-center items-end">
        <Tabs
          className="mb-1"
          tabsContainerClassName="relative flex gap-6"
          tabs={tabs}
          activeTab={activeTab ?? ""}
          onTabChange={handleTabChange}
          underlineClassName="absolute -bottom-1 left-0 w-full h-[2px] transition-opacity"
        />
      </section>
      {/* ── Mobile tabs ── */}
      <div className="md:hidden bg-white px-4 py-3">
        <Tabs tabs={tabs} activeTab={activeTab ?? ""} onTabChange={handleTabChange} />
      </div>
      {/* ── Main content ── */}
      <section className="bg-[#f1f1f1] px-4 pb-12 pt-8 md:px-[30px] md:pb-[50px] md:pt-[46px]">
        <div className="flex flex-col gap-5">
          {dataLoading ? (
            <div className="flex justify-center items-center h-48 text-gray-400">
              Loading…
            </div>
          ) : (
            rows.map((row, rowIndex) => {
              const rowStartIndex = rowIndex * colCount;
              return (
                <div key={`${activeTab}-${currentPage}-row-${rowIndex}`}>
                  <div className="grid max-[700px]:grid-cols-1 max-[1500px]:grid-cols-2 min-[1500px]:grid-cols-3 gap-5">
                    {row.map((card, colIndex) => {
                      const globalIndex = rowStartIndex + colIndex;
                      return (
                        <div
                          key={`${activeTab}-${currentPage}-${globalIndex}`}
                          ref={(el) => {
                            cardRefs.current[globalIndex] = el;
                          }}
                        >
                          <ArticleCard
                            borderColor={activeColor}
                            bgTextBlock="!bg-[#ffffff] "
                            image={card.image}
                            price={card.price}
                            title={card.title}
                            description={card.description}
                            link={card.link}
                            details={card.details}
                            equipmentPrice={card.equipmentPrice}
                            isExpanded={expandedCardId === globalIndex}
                            onToggleExpand={() =>
                              handleToggleExpand(globalIndex)
                            }
                            onBookClick={() =>
                              console.log("Book clicked", card.title)
                            }
                          />
                        </div>
                      );
                    })}
                  </div>

                  {/* Details panel */}
                  {expandedRow === rowIndex && expandedCard && (
                    <div
                      id="diving-trip-details"
                      style={{ borderColor: activeColor }}
                      className="hidden lg:block mt-[30px] border-[3px] rounded-2xl bg-white relative w-full p-6 lg:p-10"
                    >
                      <div
                        className="absolute -top-6 transition-all duration-300"
                        style={{
                          left: triangleX ?? "50%",
                          transform: "translateX(-50%)",
                        }}
                      >
                        <svg
                          width="47"
                          height="24"
                          viewBox="0 0 47 24"
                          fill="none"
                        >
                          <path
                            d="M23.3359 0L46.6705 23.3345H23.3359H0.00141412L23.3359 0Z"
                            fill={activeColor}
                          />
                        </svg>
                      </div>

                      <div className="flex flex-col lg:flex-row gap-8">
                        <div
                          className="flex-1 text-[15px] leading-[160%] text-[#101010] space-y-4"
                          style={{ opacity: 0.8 }}
                          dangerouslySetInnerHTML={{
                            __html: expandedCard.details,
                          }}
                        />
                        <div className="w-full lg:w-[469px] bg-[#f1f1f1] rounded-3xl p-4 flex flex-col items-center justify-center gap-4">
                          <h3 className="text-[28px] lg:text-[42px] font-medium leading-[1.3] text-center text-black">
                            {expandedCard.title}
                          </h3>
                          <div className="flex gap-4 items-center">
                            <div
                              style={{ backgroundColor: activeColor }}
                              className="flex items-center gap-2 rounded-lg px-3 py-2"
                            >
                              <svg
                                width="20"
                                height="20"
                                viewBox="0 0 20 20"
                                fill="none"
                              >
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
                            <ButtonWithIcon
                              label="Book now"
                              icon={
                                <svg
                                  width="44"
                                  height="44"
                                  viewBox="0 0 44 44"
                                  fill="none"
                                >
                                  <rect
                                    width="44"
                                    height="44"
                                    rx="22"
                                    fill="white"
                                  />
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
                              {/* {expandedCard.amount_description} */}
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
            })
          )}
        </div>

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
      <FreediveSitesSection
  regions={freediveData?.regions?.entities?.map((entity: any) => ({
    id: entity.id,
    name: entity.name,
    position: entity.position,
  })) || []}
  
  locations={freediveData?.regions?.entities?.flatMap((entity: any) =>
    entity.locations?.map((loc: any) => ({
      id: loc.id,
      region_id: loc.region_id || entity.id,
      name: loc.name,
      description: loc.description,
      certification: loc.certifications ? loc.certifications.join(", ") : "",
      fish_level: loc.fish_level,
      difficulty_level: loc.difficulty_level,
      max_depth: loc.max_depth,
      video_url: loc.banner?.slides?.[0]?.video_url || "",
      video_cover: loc.banner?.slides?.[0]?.video_cover_url || "",
    })) || []
  ) || []}
/>
    </main>
  );
};

export default Diving;
