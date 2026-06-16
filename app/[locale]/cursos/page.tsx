/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { Tabs } from "@/components/buttons/Tabs";
import { CategoriesList } from "@/components/CategoriesList";
import { HeroSection } from "@/components/CourseDetail/HeroSection";
import { Pagination } from "@/components/Pagination";
import { CourseCard } from "@/components/CourseCard";
import Image from "next/image";
import { useEffect, useState, useCallback } from "react";
import CoursesSectionInfo from "@/components/CourseDetail/CoursesSectionInfo";
import { useMenu, DivingCenter } from "@/app/hooks/useMenu";
import { useDivingCenter } from "@/app/hooks/useDivingCenter";
import { useLocale } from "next-intl";
import { useRouter } from "next/navigation";

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
  page: number;
  attachCategory?: boolean;
}): Promise<CoursesApiResponse> {
  const url = new URL("https://cp.haliotis.space/api/v1/courses");
  url.searchParams.set("center", String(params.centerId));
  url.searchParams.set("page", String(params.page));
  url.searchParams.set("per_page", "12");

  if (params.categoryId) {
    url.searchParams.set("category", params.categoryId);
  }

  url.searchParams.set("attach_category", "true");
  url.searchParams.set("attach_agency", "true");
  url.searchParams.set("attach_page", "true");

  console.log("[fetchCourses] →", {
    url: url.toString(),
    params,
  });

const res = await fetch(url.toString(), {
  headers: { Accept: "application/json" },
  cache: "no-store",
});
  console.log("[fetchCourses] ←", {
    status: res.status,
    ok: res.ok,
    url: res.url,
  });

  if (!res.ok) throw new Error(`HTTP ${res.status}`);

  const data: CoursesApiResponse = await res.json();

  console.log("[fetchCourses] data", {
    data: data,
    total: data.meta?.total,
    currentPage: data.meta?.current_page,
    lastPage: data.meta?.last_page,
    coursesCount: data.data?.length,
    categoriesCount: Array.isArray(data.attachCategory) ? data.attachCategory.length : 0,
    hasAttachPage: !!data.attachPage,
  });

  return data;
}


type CoursesProps = {
  initialCenterSlug?: string;
};

const Courses = ({ initialCenterSlug }: CoursesProps) => {
  const locale = useLocale();
  const router = useRouter();
  const { divingCenters, loading: menuLoading } = useMenu(locale);

  const [activeTabId, setActiveTabId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [isTabOpen, setIsTabOpen] = useState(false);
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [attachPage, setAttachPage] = useState<CoursesApiResponse["attachPage"]>(undefined);

  const [categories, setCategories] = useState<Category[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [attachAgency, setAttachAgency] = useState<any[]>([]);
  const [selectedCategoryData, setSelectedCategoryData] = useState<Category | null>(null);
  const [totalPages, setTotalPages] = useState(1);
  const [coursesLoading, setCoursesLoading] = useState(false);
  const [coursesError, setCoursesError] = useState<string | null>(null);

  // ← ИЗМЕНЁН: учитываем initialCenterSlug
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

  const loadCourses = useCallback(async () => {
    if (!activeCenter) return;

    setCoursesLoading(true);
    setCoursesError(null);

    try {
      const isFirstLoad = categories.length === 0;
      const resp = await fetchCourses({
        centerId: activeCenter.id,
        categoryId: selectedCategoryId,
        page: currentPage,
        attachCategory: true,
      });

      setCourses(resp.data);

      if (resp.attachAgency && Array.isArray(resp.attachAgency)) {
        setAttachAgency(resp.attachAgency);
      }
      if (resp.attachPage) {
        setAttachPage(resp.attachPage);
      }

      setTotalPages(resp.meta.last_page);

      if (Array.isArray(resp.attachCategory) && resp.attachCategory.length > 0) {
        const firstItem = resp.attachCategory[0];

        if (typeof firstItem === "object" && "id" in firstItem) {
          const cats = resp.attachCategory as Category[];

          if (isFirstLoad) {
            setCategories(cats);
          }

          if (selectedCategoryId) {
            const selectedCat = cats.find((cat) => cat.id === selectedCategoryId);
            if (selectedCat) {
              setSelectedCategoryData(selectedCat);
            }
          } else {
            setSelectedCategoryData(null);
          }
        }
      }
    } catch (err) {
      setCoursesError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setCoursesLoading(false);
    }
  }, [activeCenter, selectedCategoryId, currentPage, categories.length]);

  useEffect(() => {
    loadCourses();
  }, [loadCourses]);

  const handleTabChange = (slug: string) => {
    setActiveTabId(slug);
    setCurrentPage(1);
    setSelectedCategoryId(null);
    setSelectedCategoryData(null);
    setCategories([]);
    router.push(`/${locale}/cursos/${slug}`);
  };

  const handleCategoryChange = (categoryId: string | null) => {
    setSelectedCategoryId(categoryId);
    setCurrentPage(1);

    if (categoryId) {
      const categoryData = categories.find((cat) => cat.id === categoryId);
      setSelectedCategoryData(categoryData || null);
    } else {
      setSelectedCategoryData(null);
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

  const activeTabData = tabs.find((t) => t.id === activeTabId) ?? tabs[0] ?? null;
  const selectedCategoryName =
    categories.find((c) => c.id === selectedCategoryId)?.name ?? "All Categories";

  if (menuLoading) {
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
        title={selectedCategoryData?.banner?.slides?.[0]?.title ?? undefined}
        description={
          selectedCategoryData?.banner?.slides?.[0]?.description ??
          centerData?.small_description ??
          undefined
        }
        bannerImage={selectedCategoryData?.banner?.slides?.[0]?.desktop_image_url ?? undefined}
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
              <Image
                key={i}
                alt={ag.name}
                src={ag.image_url}
                width={285}
                height={140}
                className="h-[140px] w-[285px]"
              />
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
                  className={`transition-transform flex-shrink-0 ${isTabOpen ? "rotate-180" : ""}`}
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
                              ? { backgroundColor: tab.color, borderColor: tab.color }
                              : { backgroundColor: "white", borderColor: "#d9d9d9" }
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
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M3.75 7C3.75 6.80109 3.82902 6.61032 3.96967 6.46967C4.11032 6.32902 4.30109 6.25 4.5 6.25H19.5C19.6989 6.25 19.8897 6.32902 20.0303 6.46967C20.171 6.61032 20.25 6.80109 20.25 7C20.25 7.19891 20.171 7.38968 20.0303 7.53033C19.8897 7.67098 19.6989 7.75 19.5 7.75H4.5C4.30109 7.75 4.11032 7.67098 3.96967 7.53033C3.82902 7.38968 3.75 7.19891 3.75 7ZM6.25 12C6.25 11.8011 6.32902 11.6103 6.46967 11.4697C6.61032 11.329 6.80109 11.25 7 11.25H17C17.1989 11.25 17.3897 11.329 17.5303 11.4697C17.671 11.6103 17.75 11.8011 17.75 12C17.75 12.1989 17.671 12.3897 17.5303 12.5303C17.3897 12.671 17.1989 12.75 17 12.75H7C6.80109 12.75 6.61032 12.671 6.46967 12.5303C6.32902 12.3897 6.25 12.1989 6.25 12ZM9.25 17C9.25 16.8011 9.32902 16.6103 9.46967 16.4697C9.61032 16.329 9.80109 16.25 10 16.25H14C14.1989 16.25 14.3897 16.329 14.5303 16.4697C14.671 16.6103 14.75 16.8011 14.75 17C14.75 17.1989 14.671 17.3897 14.5303 17.5303C14.3897 17.671 14.1989 17.75 14 17.75H10C9.80109 17.75 9.61032 17.671 9.46967 17.5303C9.32902 17.3897 9.25 17.1989 9.25 17Z" fill="#E84814" />
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
                          selectedCategoryId === null ? "text-white" : "text-[#111]"
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
                dangerouslySetInnerHTML={{ __html: selectedCategoryData.description }}
              />
            )}

            {coursesError && (
              <div className="rounded-[10px] bg-red-50 border border-red-200 px-4 py-3 text-red-600 text-[14px]">
                Failed to load courses: {coursesError}
                <button onClick={loadCourses} className="ml-2 underline cursor-pointer">
                  Retry
                </button>
              </div>
            )}

            {coursesLoading ? (
              <div className="grid grid-cols-2 gap-2 sm:gap-4 max-[1500px]:grid-cols-2 min-[1220px]:grid-cols-3 min-[1500px]:grid-cols-4">
                {Array.from({ length: 12 }).map((_, i) => (
                  <div key={i} className="rounded-[10px] bg-white animate-pulse h-[280px]" />
                ))}
              </div>
            ) : courses.length === 0 ? (
              <div className="flex justify-center items-center h-48 text-[#666] text-[15px]">
                No courses found for this selection.
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2 sm:gap-4 max-[1500px]:grid-cols-2 min-[1220px]:grid-cols-3 min-[1500px]:grid-cols-4">
                {courses.map((course) => {
const price = (course.price as any)?.amount ?? null;
const currency = (course.price as any)?.currency ?? "€";                  return (
                    <CourseCard
                          centerSlug={activeCenter?.slug}  // ← ДОБАВИТЬ

                      slug={course.slug}
                      key={course.id}
                      image={course.image ?? "/Rectangle 8.png"}
                      title={course.name}
                      price={price ?? 0}
                      currency={currency}
                      duration={course.duration_label}
                      requestBased={price === null}
                      badge={course.label?.name}
                      onBookClick={() => console.log("Book:", course.slug)}
                    />
                  );
                })}
              </div>
            )}

            {!coursesLoading && totalPages > 1 && (
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