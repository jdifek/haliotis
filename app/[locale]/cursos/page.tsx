/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { Tabs } from "@/components/buttons/Tabs";
import { CategoriesList } from "@/components/CategoriesList";
import { HeroSection } from "@/components/CourseDetail/HeroSection";
import { Pagination } from "@/components/Pagination";
import { CourseCard } from "@/components/CourseCard";
import Image from "next/image";
import { useEffect, useState, useCallback, useRef } from "react";
import CoursesSectionInfo from "@/components/CourseDetail/CoursesSectionInfo";
import { useMenu, DivingCenter } from "@/app/hooks/useMenu";
import { useDivingCenter } from "@/app/hooks/useDivingCenter";
import { useLocale } from "next-intl";

type Category = {
  id: string;
  name: string;
  slug: string;
  description: string;
};

type Course = {
  id: string;
  name: string;
  slug: string;
  image: string | null;
  description: string;
  agency_id: string;
  duration_label: string;
  price: unknown[];
  label: { id: number; name: string; image: string | null } | null;
  page: {
    id: string;
    title: string;
  } | null;
};

type CoursesApiResponse = {
  data: Course[];
  links: {
    first: string | null;
    last: string | null;
    prev: string | null;
    next: string | null;
  };
  meta: {
    current_page: number;
    from: number | null;
    last_page: number;
    per_page: number;
    to: number | null;
    total: number;
  };
  attachCategory: Category[] | string[];
  attachAgency?: any[];
  attachPage?: {
    id: number;
    title: string;
    content?: {
      body?: string;
      tabs?: { title: string; body: string }[] | null;
    };
  };
};

async function fetchCourses(params: {
  centerId: number;
  categoryId?: string | null;
  locale: string;
  page: number;
  attachCategory?: boolean;
}): Promise<CoursesApiResponse> {
  const url = new URL(`${process.env.NEXT_PUBLIC_API_URL}/courses`);
  url.searchParams.set("center", String(params.centerId));
  url.searchParams.set("page", String(params.page));
  url.searchParams.set("per_page", "12");
  url.searchParams.set("lang", params.locale);

  if (params.categoryId) {
    url.searchParams.set("category", params.categoryId);
  }

  url.searchParams.set("attach_category", "true");
  url.searchParams.set("attach_agency", "true");
  url.searchParams.set("attach_page", "true");

  const res = await fetch(url.toString(), {
    headers: { Accept: "application/json" },
  });

  if (!res.ok) throw new Error(`HTTP ${res.status}`);

  const data: CoursesApiResponse = await res.json();
  return data;
}

type CoursesProps = {
  initialCenterSlug?: string;
  initialCategorySlug?: string;
  initialCategoryId?: string;
  initialCategoryData?: Category; // ← готовый объект категории с сервера (с banner)
  initialCenterId?: number;
  initialCoursesData?: CoursesApiResponse;
};

const Courses = ({
  initialCenterSlug,
  initialCategorySlug,
  initialCategoryId,
  initialCategoryData,
  initialCenterId,
  initialCoursesData,
}: CoursesProps) => {
  const locale = useLocale();
  const { divingCenters, loading: menuLoading } = useMenu(locale);

  // сразу знаем таб — не ждём загрузку меню
  const [activeTabId, setActiveTabId] = useState<string | null>(
    initialCenterSlug ?? null
  );

  const [currentPage, setCurrentPage] = useState(1);
  const [isTabOpen, setIsTabOpen] = useState(false);
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(
    initialCategoryId ?? null
  );

  const [attachPage, setAttachPage] = useState<CoursesApiResponse["attachPage"]>(
    initialCoursesData?.attachPage
  );

  const [categories, setCategories] = useState<Category[]>(() => {
    const cats = initialCoursesData?.attachCategory;
    return Array.isArray(cats) && cats.length > 0 && typeof cats[0] === "object"
      ? (cats as Category[])
      : [];
  });

  const [courses, setCourses] = useState<Course[]>(
    () => (initialCoursesData?.data as Course[]) ?? []
  );

  const [attachAgency, setAttachAgency] = useState<any[]>(
    () => initialCoursesData?.attachAgency ?? []
  );

  // ⬇️ ГЛАВНЫЙ ФИКС мигания: берём готовый объект категории (с banner)
  // напрямую с сервера, а не ищем его заново внутри отфильтрованного
  // attachCategory (там может не быть нужных полей / порядок другой)
  const [selectedCategoryData, setSelectedCategoryData] = useState<Category | null>(
    initialCategoryData ?? null
  );
  console.log(selectedCategoryData, 'selectedCategoryData');
  

  const [totalPages, setTotalPages] = useState(
    () => initialCoursesData?.meta?.last_page ?? 1
  );

  const [coursesLoading, setCoursesLoading] = useState(false);
  const [coursesError, setCoursesError] = useState<string | null>(null);
  const isFirstLoadRef = useRef(true);

  // кэш ответов по ключу center+category+page+locale — повторные клики
  // на уже посещённые комбинации применяются мгновенно, без похода в сеть
  const cacheRef = useRef<Map<string, CoursesApiResponse>>(new Map());

  // прогреваем кэш SSR-данными, чтобы клиентский loadCourses не сделал
  // повторный (и уже не нужный) запрос при первом рендере
  useEffect(() => {
    if (initialCenterId && initialCoursesData) {
      const key = `${initialCenterId}|${initialCategoryId ?? "all"}|1|${locale}`;
      cacheRef.current.set(key, initialCoursesData as CoursesApiResponse);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (
      initialCategorySlug &&
      categories.length > 0 &&
      selectedCategoryId === null
    ) {
      const found = categories.find((c) => c.slug === initialCategorySlug);
      if (found) {
        setSelectedCategoryId(found.id);
        setSelectedCategoryData(found);
      }
    }
  }, [initialCategorySlug, categories, selectedCategoryId]);

  useEffect(() => {
    if (divingCenters.length > 0 && activeTabId === null) {
      const target = initialCenterSlug
        ? divingCenters.find((c) => c.slug === initialCenterSlug)?.slug
        : undefined;
      setActiveTabId(target ?? divingCenters[0].slug);
    }
  }, [divingCenters, activeTabId, initialCenterSlug]);

  const activeCenter: DivingCenter | null =
    divingCenters.find((c) => c.slug === activeTabId) ?? null;

  const centerSlug = activeCenter?.slug || null;
  const { data: centerData } = useDivingCenter(centerSlug, locale);

  // предзагружает картинки курсов в браузерный кэш ДО того, как они
  // попадут в setCourses — так сетка обновляется одним разом, уже с
  // готовыми изображениями, без промежуточного "мелькания" старых картинок
  const preloadImages = useCallback((urls: (string | null)[]) => {
    const valid = urls.filter((u): u is string => !!u);
    if (valid.length === 0) return Promise.resolve();

    return Promise.all(
      valid.map(
        (src) =>
          new Promise<void>((resolve) => {
            const img = new window.Image();
            img.onload = () => resolve();
            img.onerror = () => resolve();
            img.src = src;
          })
      )
    );
  }, []);

  // применяет ответ API к стейту — используется и для свежего запроса,
  // и для мгновенного применения данных из кэша (без лоадера/запроса)
  const applyResponse = useCallback(
    (resp: CoursesApiResponse, categoryId: string | null) => {
      setCourses(resp.data);

      if (resp.attachAgency && Array.isArray(resp.attachAgency)) {
        setAttachAgency(resp.attachAgency);
      }

      if (resp.attachPage) {
        setAttachPage(resp.attachPage);
      }

      setTotalPages(resp.meta.last_page);

      if (
        Array.isArray(resp.attachCategory) &&
        resp.attachCategory.length > 0
      ) {
        const firstItem = resp.attachCategory[0];

        if (typeof firstItem === "object" && "id" in firstItem) {
          const cats = resp.attachCategory as Category[];

          // категории обновляются при каждой загрузке (не только при
          // первом заходе), иначе при смене Dive Center список категорий
          // оставался от предыдущего центра
          setCategories(cats);

          if (categoryId) {
            const selectedCat = cats.find(
              (cat) => String(cat.id) === String(categoryId)
            );
            setSelectedCategoryData((prev) => {
              if (!selectedCat) return null;
              // attachCategory обычно не содержит banner — не даём его затирать
              const bannerFallback =
                (selectedCat as any).banner ??
                (prev && String(prev.id) === String(selectedCat.id)
                  ? (prev as any).banner
                  : undefined) ??
                (initialCategoryData &&
                String(initialCategoryData.id) === String(selectedCat.id)
                  ? (initialCategoryData as any).banner
                  : undefined);
          
              return { ...selectedCat, banner: bannerFallback } as Category;
            });
          } else {
            setSelectedCategoryData(null);
          }
        }
      } else {
        setCategories([]);
        setSelectedCategoryData(null);
      }
    },
    []
  );

  const loadCourses = useCallback(async () => {
    if (!activeCenter) return;

    const cacheKey = `${activeCenter.id}|${selectedCategoryId ?? "all"}|${currentPage}|${locale}`;
    const cached = cacheRef.current.get(cacheKey);

    if (cached) {
      setCoursesError(null);
      applyResponse(cached, selectedCategoryId);
      isFirstLoadRef.current = false;
      return;
    }

    // старый контент (курсы/текст/картинки) НЕ трогаем и не чистим —
    // он остаётся на экране как есть, пока полностью не соберутся новые
    // данные и не догрузятся все картинки. Подмена происходит одним
    // разом, без промежуточных пустых/спиннерных состояний.
    setCoursesLoading(true);
    setCoursesError(null);

    try {
      const resp = await fetchCourses({
        centerId: activeCenter.id,
        categoryId: selectedCategoryId,
        page: currentPage,
        attachCategory: true,
        locale: locale,
      });

      // ждём, пока все картинки нового набора курсов реально загрузятся,
      // и только потом одним разом обновляем стейт
      await preloadImages(resp.data.map((c) => c.image));

      cacheRef.current.set(cacheKey, resp);
      applyResponse(resp, selectedCategoryId);
    } catch (err) {
      setCoursesError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setCoursesLoading(false);
      isFirstLoadRef.current = false;
    }
  }, [activeCenter, selectedCategoryId, currentPage, locale, applyResponse, preloadImages]);

  useEffect(() => {
    loadCourses();
  }, [loadCourses]);

  // ⬇️ ВЕРНУЛИ мягкую SPA-навигацию (без window.location.href) —
  // скролл остаётся на месте, страница не перезагружается.
  // Мигание убрано не типом навигации, а тем, что selectedCategoryData
  // теперь корректно инициализируется из initialCategoryData сразу.
  const handleTabChange = (slug: string) => {
    const currentCategorySlug = selectedCategoryData?.slug ?? null;

    // старые courses/categories/selectedCategoryData НЕ обнуляем здесь —
    // они остаются на экране (затемнённые через coursesLoading) до тех
    // пор, пока loadCourses не подтянет новые данные и не заменит их
    setActiveTabId(slug);
    setCurrentPage(1);
    setSelectedCategoryId(null);

    if (currentCategorySlug) {
      window.history.pushState(
        null,
        "",
        `/${locale}/cursos/${currentCategorySlug}/${slug}`
      );
    } else {
      window.history.pushState(null, "", `/${locale}/cursos/${slug}`);
    }
  };

  const handleCategoryChange = (categoryId: string | null) => {
    setSelectedCategoryId(categoryId);
    setCurrentPage(1);

    if (categoryId) {
      const categoryData = categories.find(
        (cat) => String(cat.id) === String(categoryId)
      );
      setSelectedCategoryData(categoryData || null);
      if (categoryData) {
        window.history.pushState(
          null,
          "",
          `/${locale}/cursos/${categoryData.slug}/${centerSlug}`
        );
      }
    } else {
      setSelectedCategoryData(null);
      window.history.pushState(null, "", `/${locale}/cursos/${centerSlug}`);
    }
  };

  useEffect(() => {
    document.body.style.overflow = isCategoryOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isCategoryOpen]);

  const tabs = divingCenters.map((c) => ({
    id: c.slug,
    label: c.name,
    color: c.color,
  }));

  const activeTabData =
    tabs.find((t) => t.id === activeTabId) ?? tabs[0] ?? null;
  const selectedCategoryName =
    categories.find((c) => String(c.id) === String(selectedCategoryId))?.name ??
    "All Categories";

  if (menuLoading && courses.length === 0) {
    return (
      <main className="-mt-[97px]">
        <HeroSection />
        <section className="bg-[#f1f1f1] px-4 pb-12 pt-8 min-[930px]:px-[30px] min-[930px]:pb-[50px] min-[930px]:pt-[46px]">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#e84814]" />
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="-mt-[97px]">
   <HeroSection
  centerName={centerData?.center_name}
  heroSlides={
    selectedCategoryData?.banner?.slides &&
    selectedCategoryData.banner.slides.length > 0
      ? selectedCategoryData.banner.slides
          .filter(
            (slide: any) =>
              slide && (slide.desktop_image_url || slide.mobile_image_url)
          )
          .map((slide: any) => ({
            title: slide.title || "Courses",
            description:
              slide.description ?? centerData?.small_description ?? "",
            desktopImage: slide.desktop_image_url ?? undefined,
            mobileImage: slide.mobile_image_url ?? undefined,
          }))
      : undefined
  }
/>

      <section className="hidden min-[930px]:flex h-[95px] bg-white justify-center items-end">
        <Tabs
          useLocationColors={true}
          className="mb-1"
          tabsContainerClassName="relative flex gap-6"
          tabs={tabs}
          activeTab={activeTabId ?? ""}
          onTabChange={handleTabChange}
          underlineClassName="absolute -bottom-1 left-0 w-full h-[2px] transition-opacity"
        />
      </section>

      <section className="bg-[#f1f1f1] px-4 pb-12 pt-8 min-[930px]:px-[30px] min-[930px]:pb-[50px] min-[930px]:pt-[46px]">
        <div className="flex flex-col gap-[30px] min-[930px]:flex-row">
          <div className="hidden min-[930px]:flex min-[930px]:flex-col min-[930px]:gap-[10px]">
            {(Array.isArray(attachAgency) ? attachAgency : []).map((ag, i) => (
              <a
                key={i}
                href={ag.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block"
              >
                <Image
                  alt={ag.name}
                  src={ag.image_url}
                  width={285}
                  height={140}
                  className="h-[140px] w-[285px]"
                />
              </a>
            ))}
            <CategoriesList
              categories={categories}
              selectedCategoryId={selectedCategoryId}
              onCategorySelect={handleCategoryChange}
            />
          </div>

          <div className="min-[930px]:hidden mb-6 flex flex-col gap-[10px]">
            <div className="flex flex-col gap-2">
              <button
                onClick={() => setIsTabOpen(!isTabOpen)}
                className="flex items-center cursor-pointer justify-between rounded-[10px] px-3 py-2 h-[42px] bg-white border-1 border-[#e84814]"
              >
                <span className="text-[16px] font-semibold leading-[160%] text-[#111]">
                  {activeTabData?.label ?? ""}
                </span>
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  className={`transition-transform flex-shrink-0 ${
                    isTabOpen ? "rotate-180" : ""
                  }`}
                >
                  <path
                    d="M17.8534 9.85369L12.8537 14.8534C12.8073 14.8999 12.7522 14.9367 12.6915 14.9619C12.6308 14.9871 12.5657 15 12.5 15C12.4343 15 12.3692 14.9871 12.3085 14.9619C12.2478 14.9367 12.1927 14.8999 12.1463 14.8534L7.14663 9.85369C7.07663 9.78377 7.02895 9.69465 7.00963 9.59761C6.9903 9.50058 7.00021 9.39999 7.03808 9.30858C7.07595 9.21718 7.1401 9.13907 7.22239 9.08413C7.30468 9.0292 7.40142 8.99992 7.50036 9H17.4996C17.5986 8.99992 17.6953 9.0292 17.7776 9.08413C17.8599 9.13907 17.924 9.21718 17.9619 9.30858C17.9998 9.39999 18.0097 9.50058 17.9904 9.59761C17.971 9.69465 17.9234 9.78377 17.8534 9.85369Z"
                    fill="black"
                  />
                </svg>
              </button>

              {isTabOpen && (
                <div className="bg-white rounded-[10px] border-2 border-gray-200 overflow-hidden">
                  <div className="flex flex-col gap-[10px] p-2">
                    {tabs.map((tab) => {
                      const isSelected = tab.id === activeTabId;
                      return (
                        <button
                          key={tab.id}
                          onClick={() => {
                            handleTabChange(tab.id);
                            setIsTabOpen(false);
                          }}
                          className="flex items-center cursor-pointer justify-between rounded-[10px] px-3 py-2 h-[40px] border-2"
                          style={
                            isSelected
                              ? {
                                  backgroundColor: tab.color,
                                  borderColor: tab.color,
                                }
                              : {
                                  backgroundColor: "white",
                                  borderColor: "#d9d9d9",
                                }
                          }
                        >
                          <span
                            className={`text-[16px] font-normal leading-[140%] ${
                              isSelected ? "text-white" : "text-[#111]"
                            }`}
                          >
                            {tab.label}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            <h2 className="text-[20px] font-bold leading-[140%] text-center text-[#e84814]">
              Categories
            </h2>

            <button
              onClick={() => setIsCategoryOpen(!isCategoryOpen)}
              className="flex items-center cursor-pointer justify-between rounded-[10px] px-3 py-2 h-[42px] bg-white border-2 border-[#d9d9d9]"
            >
              <span className="text-[16px] font-semibold leading-[160%] text-[#111]">
                {selectedCategoryName}
              </span>
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M3.75 7C3.75 6.80109 3.82902 6.61032 3.96967 6.46967C4.11032 6.32902 4.30109 6.25 4.5 6.25H19.5C19.6989 6.25 19.8897 6.32902 20.0303 6.46967C20.171 6.61032 20.25 6.80109 20.25 7C20.25 7.19891 20.171 7.38968 20.0303 7.53033C19.8897 7.67098 19.6989 7.75 19.5 7.75H4.5C4.30109 7.75 4.11032 7.67098 3.96967 7.53033C3.82902 7.38968 3.75 7.19891 3.75 7ZM6.25 12C6.25 11.8011 6.32902 11.6103 6.46967 11.4697C6.61032 11.329 6.80109 11.25 7 11.25H17C17.1989 11.25 17.3897 11.329 17.5303 11.4697C17.671 11.6103 17.75 11.8011 17.75 12C17.75 12.1989 17.671 12.3897 17.5303 12.5303C17.3897 12.671 17.1989 12.75 17 12.75H7C6.80109 12.75 6.61032 12.671 6.46967 12.5303C6.32902 12.3897 6.25 12.1989 6.25 12ZM9.25 17C9.25 16.8011 9.32902 16.6103 9.46967 16.4697C9.61032 16.329 9.80109 16.25 10 16.25H14C14.1989 16.25 14.3897 16.329 14.5303 16.4697C14.671 16.6103 14.75 16.8011 14.75 17C14.75 17.1989 14.671 17.3897 14.5303 17.5303C14.3897 17.671 14.1989 17.75 14 17.75H10C9.80109 17.75 9.61032 17.671 9.46967 17.5303C9.32902 17.3897 9.25 17.1989 9.25 17Z"
                  fill="#E84814"
                />
              </svg>
            </button>
          </div>

          {isCategoryOpen && (
            <>
              <div
                className="fixed inset-0 z-40 min-[930px]:hidden bg-black/50"
                onClick={() => setIsCategoryOpen(false)}
              />
              <div className="fixed inset-0 z-50 min-[930px]:hidden flex flex-col">
                <div className="h-[82px] flex-shrink-0" />
                <div className="flex-1 overflow-y-auto p-4 bg-[#f1f1f1]">
                  <h2 className="text-[20px] font-medium leading-[140%] text-center text-black mb-[10px]">
                    Categories
                  </h2>
                  <div className="flex flex-col gap-[10px]">
                    <button
                      onClick={() => {
                        handleCategoryChange(null);
                        setIsCategoryOpen(false);
                      }}
                      className={`flex items-center cursor-pointer justify-between rounded-[10px] px-3 py-2 h-[40px] border-2 ${
                        selectedCategoryId === null
                          ? "bg-[#e84814] border-[#e84814]"
                          : "bg-white border-[#d9d9d9]"
                      }`}
                    >
                      <span
                        className={`text-[16px] font-normal leading-[140%] text-center ${
                          selectedCategoryId === null
                            ? "text-white"
                            : "text-[#111]"
                        }`}
                      >
                        All Categories
                      </span>
                    </button>

                    {categories.map((category) => {
                      const isSelected = category.id === selectedCategoryId;
                      return (
                        <button
                          key={category.id}
                          onClick={() => {
                            handleCategoryChange(category.id);
                            setIsCategoryOpen(false);
                          }}
                          className={`flex items-center cursor-pointer justify-between rounded-[10px] px-3 py-2 h-[40px] border-2 ${
                            isSelected
                              ? "bg-[#e84814] border-[#e84814]"
                              : "bg-white border-[#d9d9d9]"
                          }`}
                        >
                          <span
                            className={`text-[16px] font-normal leading-[140%] text-center ${
                              isSelected ? "text-white" : "text-[#111]"
                            }`}
                          >
                            {category.name}
                          </span>
                          {isSelected && (
                            <svg
                              width="20"
                              height="20"
                              viewBox="0 0 24 24"
                              fill="none"
                              className="flex-shrink-0"
                            >
                              <path
                                d="M9.85369 17.8534L14.8534 12.8537C14.8999 12.8073 14.9367 12.7522 14.9619 12.6915C14.9871 12.6308 15 12.5657 15 12.5C15 12.4343 14.9871 12.3692 14.9619 12.3085C14.9367 12.2478 14.8999 12.1927 14.8534 12.1463L9.85369 7.14663C9.78377 7.07663 9.69465 7.02895 9.59761 7.00963C9.50058 6.9903 9.39999 7.00021 9.30858 7.03808C9.21718 7.07595 9.13907 7.1401 9.08413 7.22239C9.0292 7.30468 8.99992 7.40142 9 7.50036V17.4996C8.99992 17.5986 9.0292 17.6953 9.08413 17.7776C9.13907 17.8599 9.21718 17.924 9.30858 17.9619C9.39999 17.9998 9.50058 18.0097 9.59761 17.9904C9.69465 17.971 9.78377 17.9234 9.85369 17.8534Z"
                                fill="white"
                              />
                            </svg>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </>
          )}

          <div className="flex flex-1 flex-col gap-6">
            {selectedCategoryData && selectedCategoryData.description && (
              <div
                className="text-[14px] leading-[160%] text-[#111] min-[930px]:text-[15px]"
                dangerouslySetInnerHTML={{
                  __html: selectedCategoryData.description,
                }}
              />
            )}

            {coursesError && (
              <div className="rounded-[10px] bg-red-50 border border-red-200 px-4 py-3 text-red-600 text-[14px]">
                Failed to load courses: {coursesError}
                <button
                  onClick={loadCourses}
                  className="ml-2 underline cursor-pointer"
                >
                  Retry
                </button>
              </div>
            )}

            {courses.length === 0 ? (
              <div className="flex justify-center items-center h-48 text-[#666] text-[15px]">
                {!coursesLoading && "No courses found for this selection."}
              </div>
            ) : (
              <div
                key={`${activeTabId}-${selectedCategoryId ?? "all"}-${currentPage}`}
                className="grid grid-cols-2 gap-2 sm:gap-4 max-[1500px]:grid-cols-2 min-[1220px]:grid-cols-3 min-[1700px]:grid-cols-4"
              >
                {courses.map((course) => {
                  const price = (course.price as any)?.amount ?? null;
                  const currency = (course.price as any)?.currency ?? "€";
                  return (
                    <CourseCard
                      categorySlug={selectedCategoryData?.slug}
                      centerSlug={activeCenter?.slug}
                      slug={course.slug}
                      key={course.id}
                      id={+course.id}
                      image={course.image ?? ""}
                      title={course.name}
                      price={price ?? 0}
                      currency={currency}
                      duration={course.duration_label}
                      requestBased={!course.duration_label}
                      badge={course.labels?.length > 0 ? course.labels : []}
                      onBookClick={() => console.log("Book:", course.slug)}
                    />
                  );
                })}
              </div>
            )}

            {totalPages > 1 && (
              <div className="mt-6 flex justify-center">
                <Pagination
                  totalPages={totalPages}
                  currentPage={currentPage}
                  onPageChange={(page) => {
                    setCurrentPage(page);
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                />
              </div>
            )}
          </div>
        </div>
      </section>

      <CoursesSectionInfo
        body={attachPage?.content?.body}
        tabs={attachPage?.content?.tabs ?? undefined}
        contactPhone={centerData?.contact_phone}
        contactAddress={centerData?.contact_address}
      />
    </main>
  );
};

export default Courses;