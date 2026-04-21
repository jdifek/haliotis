"use client";

import { ArticleCard } from "@/components/ArticleCard";
import { Pagination } from "@/components/Pagination";
import { Tabs } from "@/components/buttons/Tabs";
import { ButtonWithIcon } from "@/components/buttons/ButtonWithIcon";
import { useState, useRef, useEffect } from "react";
import DiveSitesSection from "@/components/DiveSitesSection";
import { useMenu } from "@/app/hooks/useMenu";
import { useLocale } from "next-intl";
import { HeroBanner } from "@/components/HeroBanner";
import { createTermGetter } from "@/app/utils/terms";

// ─── Types ────────────────────────────────────────────────────────────────────

type ApiSlide = {
  desktop_image_url: string;
  mobile_image_url: string;
  title: string;
  description: string;
};

type DivingData = {
  title: string;
  banner: { slides: ApiSlide[] } | null;
  seo: { meta_description: string; meta_keywords: string } | null;
  dive_trips: ApiTripType[];
  regions: {
    title: string;
    subtitle: string;
    entities: ApiRegion[];
  } | null;
};

type ApiTripType = {
  id: number;
  name: string;
  slug: string | null;
  description: string | null;
  image_url: string | null;
  price: {
    amount: string | number;
    amount_description?: string;
    currency: string;
  };
};

type ApiRegion = {
  id: number;
  name: string;
  position: number;
  diving_center_id: number;
  locations: ApiLocation[];
};

type ApiLocation = {
  id: number;
  region_id: number;
  name: string;
  description: string;
  certifications: { id: number; title: string }[];
  fish_level: number;
  difficulty_level: number;
  max_depth: string;
  banner: {
    slides: {
      video_url: string;
      video_cover_url: string;
    }[];
  } | null;
};

type TripCard = {
  image: string;
  price: number;
  title: string;
  description: string;
  link: string;
  details: string;
  equipmentPrice: string;
};

const CARDS_PER_PAGE = 6;
const FALLBACK_COLOR = "#e84814";

// ─── Component ────────────────────────────────────────────────────────────────

const Diving = () => {
  const locale = useLocale();
  const { terms } = useMenu(locale);
  const t = createTermGetter(terms);

  const { divingCenters, colorBySlug, loading } = useMenu(locale);

  const tabs = divingCenters.map((center) => ({
    id: center.slug,
    label: center.name,
    color: center.color,
  }));

  const [activeTab, setActiveTab] = useState<string | null>(null);
  const [divingData, setDivingData] = useState<DivingData | null>(null);
  const [dataLoading, setDataLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [expandedCardId, setExpandedCardId] = useState<number | null>(null);
  const [triangleX, setTriangleX] = useState<number | null>(null);
  const [colCount, setColCount] = useState(3);

  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Инициализация первого таба
  useEffect(() => {
    if (tabs.length > 0 && !activeTab) {
      setActiveTab(tabs[0].id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tabs.length]);

  // Fetch при смене таба
  useEffect(() => {
    if (!activeTab) return;
    const activeCenter = divingCenters.find((c) => c.slug === activeTab);
    if (!activeCenter) return;

    setDataLoading(true);
    setDivingData(null);

    fetch(
      `https://cp.haliotis.space/api/v1/diving-category/diving?center_id=${activeCenter.id}&lang=${locale}&attach_regions=true`,
      { headers: { Accept: "application/json" } }
    )
      .then((r) => r.json())
      .then((json) => {
        const normalized: DivingData = {
          title: json.data?.title ?? "",
          banner: json.data?.banner ?? null,
          seo: json.data?.seo ?? null,
          dive_trips: json.dive_trips ?? [],
          regions: json.regions ?? null,
        };
        setDivingData(normalized);
      })
      .catch(console.error)
      .finally(() => setDataLoading(false));
  }, [activeTab, divingCenters, locale]);

  // Колонки
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

  const activeColor =
    (activeTab ? colorBySlug[activeTab] : null) ?? FALLBACK_COLOR;

  const allCards: TripCard[] = (divingData?.dive_trips ?? []).map((trip) => ({
    image: trip.image_url || "",
    price: Number(trip.price?.amount || 0),
    title: trip.name,
    description: trip.description || "",
    link: "#",
    details: trip.description || "",
    equipmentPrice: trip.price?.amount_description || "",
  }));

  const totalPages = Math.ceil(allCards.length / CARDS_PER_PAGE);
  const paginatedCards = allCards.slice(
    (currentPage - 1) * CARDS_PER_PAGE,
    currentPage * CARDS_PER_PAGE
  );

  const rows: TripCard[][] = [];
  for (let i = 0; i < paginatedCards.length; i += colCount) {
    rows.push(paginatedCards.slice(i, i + colCount));
  }

  const expandedRow =
    expandedCardId !== null ? Math.floor(expandedCardId / colCount) : null;
  const expandedCard =
    expandedCardId !== null ? paginatedCards[expandedCardId] : null;

  // Треугольник
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

  return (
    <main className="-mt-[97px]">
      <HeroBanner
        slides={
          divingData?.banner?.slides?.length
            ? divingData.banner.slides.map((s) => ({
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
          { label: divingData?.title ?? "Diving" },
        ]}
      >
        <section className="container px-5 py-6">
          <div className="max-w-3xl">
            <h1 className="mb-3 text-[32px] font-bold leading-tight text-white xl:text-5xl">
              {divingData?.title || "Diving"}
            </h1>
          </div>
        </section>
      </HeroBanner>

      {/* Desktop tabs */}
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

      {/* Mobile tabs */}
      <div className="md:hidden bg-white px-4 py-3">
        <Tabs
          tabs={tabs}
          activeTab={activeTab ?? ""}
          onTabChange={handleTabChange}
        />
      </div>

      {/* Main content */}
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
                            bgTextBlock="!bg-[#ffffff]"
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
label={t("book_now", "Book now")}                              icon={
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
                                    d="M27.9624 23.293C28.8861 22.3501 30.3835 22.3501 31.3072 23.293C32.2309 24.2358 32.2309 25.7642 31.3072 26.707L27.2341 30.8645C27.1332 30.9675 27.0021 31.1066 26.8434 31.2195L26.843 31.2191C26.7172 31.3088 26.5813 31.383 26.4381 31.4402C26.2583 31.5122 26.0727 31.5468 25.9326 31.5754L23.9487 31.9805C23.6275 32.046 23.2955 31.9435 23.0639 31.707C22.8322 31.4706 22.7317 31.1318 22.796 30.8039L23.1928 28.7789C23.2209 28.6358 23.2543 28.4461 23.3249 28.2625C23.3809 28.1164 23.4537 27.9777 23.5415 27.8492L23.6283 27.7332C23.718 27.6223 23.8136 27.5277 23.8893 27.4504L27.9624 23.293ZM29.9219 24.707C29.7634 24.5453 29.5063 24.5453 29.3478 24.707L25.2747 28.8645C25.2078 28.9328 25.175 28.9665 25.1519 28.9918C25.1497 28.9943 25.1498 28.9955 25.1496 28.9965C25.1418 29.0301 25.1325 29.0767 25.114 29.1711L25.0053 29.725L25.5484 29.6145C25.6408 29.5956 25.6865 29.5861 25.7194 29.5781C25.7227 29.5768 25.7234 29.5764 25.724 29.5758C25.7488 29.5522 25.7818 29.5187 25.8488 29.4504L29.9219 25.293C30.0803 25.1312 30.0803 24.8688 29.9219 24.707Z"
                                    fill="black"
                                  />
                                </svg>
                              }
                            />
                          </div>
                          {expandedCard.equipmentPrice && (
                            <p className="font-medium text-[18px] leading-[1.4] text-black text-center">
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

      <DiveSitesSection
        regions={
          divingData?.regions?.entities?.map((e) => ({
            id: e.id,
            name: e.name,
            position: e.position,
          })) ?? []
        }
        locations={
          divingData?.regions?.entities?.flatMap((e) =>
            e.locations.map((loc) => ({
              id: loc.id,
              region_id: loc.region_id,
              name: loc.name,
              description: loc.description,
              certification:
                loc.certifications?.map((c) => c.title).join(", ") ?? "",
              fish_level: loc.fish_level,
              difficulty_level: loc.difficulty_level,
              max_depth: loc.max_depth,
              video_url: loc.banner?.slides?.[0]?.video_url ?? "",
              video_cover: loc.banner?.slides?.[0]?.video_cover_url ?? "",
            }))
          ) ?? []
        }
      />
    </main>
  );
};

export default Diving;
