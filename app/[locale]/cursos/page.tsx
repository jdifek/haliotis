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

  const res = await fetch(url.toString(), {
    headers: { Accept: "application/json" },
  });

  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

function formatPrice(price: unknown[]): number | null {
  if (!price || price.length === 0) return null;
  const first = price[0] as { amount?: number; value?: number } | number | null;
  if (first == null) return null;
  if (typeof first === "number") return first;
  return first.amount ?? first.value ?? null;
}

const Courses = () => {
  const locale = useLocale();
  const router = useRouter();
  const { divingCenters, loading: menuLoading } = useMenu(locale);

  const [activeTabId, setActiveTabId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [isTabOpen, setIsTabOpen] = useState(false);
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [attachPage, setAttachPage] = useState<CoursesApiResponse['attachPage']>(undefined);

  const [categories, setCategories] = useState<Category[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [attachAgency, setAttachAgency] = useState<any[]>([]);
  const [selectedCategoryData, setSelectedCategoryData] = useState<Category | null>(null);
  const [totalPages, setTotalPages] = useState(1);
  const [coursesLoading, setCoursesLoading] = useState(false);
  const [coursesError, setCoursesError] = useState<string | null>(null);

  useEffect(() => {
    if (divingCenters.length > 0 && activeTabId === null) {
      setActiveTabId(divingCenters[0].slug);
    }
  }, [divingCenters, activeTabId]);

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
    // Редирект на центр
    router.push(`/${locale}/courses/${slug}`);
  };

  const handleCategoryChange = (categoryId: string | null) => {
    setSelectedCategoryId(categoryId);
    setCurrentPage(1);

    if (categoryId) {
      const categoryData = categories.find((cat) => cat.id === categoryId);
      setSelectedCategoryData(categoryData || null);
      // Редирект на категорию + центр
      if (categoryData?.slug && activeTabId) {
        router.push(`/${locale}/courses/${categoryData.slug}/${activeTabId}`);
      }
    } else {
      setSelectedCategoryData(null);
      // Редирект на центр
      if (activeTabId) {
        router.push(`/${locale}/courses/${activeTabId}`);
      }
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
        description={centerData?.small_description || undefined}
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
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className={`transition-transform flex-shrink-0 ${isTabOpen ? "rotate-180" : ""}`}>
                  <path d="M17.8534 9.85369L12.8537 14.8534C12.8073 14.8999 12.7522 14.9367 12.6915 14.9619C12.6308 14.9871 12.5657 15 12.5 15C12.4343 15 12.3692 14.9871 12.3085 14.9619C12.2478 14.9367 12.1927 14.8999 12.1463 14.8534L7.14663 9.85369C7.07663 9.78377 7.02895 9.69465 7.00963 9.59761C6.9903 9.50058 7.00021 9.39999 7.03808 9.30858C7.07595 9.21718 7.1401 9.13907 7.22239 9.08413C7.30468 9.0292 7.40142 8.99992 7.50036 9H17.4996C17.5986 8.99992 17.6953 9.0292 17.7776 9.08413C17.8599 9.13907 17.924 9.21718 17.9619 9.30858C17.9998 9.39999 18.0097 9.50058 17.9904 9.59761C17.971 9.69465 17.9234 9.78377 17.8534 9.85369Z" fill="black" />
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
                          style={isSelected ? { backgroundColor: tab.color, borderColor: tab.color } : { backgroundColor: "white", borderColor: "#d9d9d9" }}
                        >
                          <span className={`text-[16px] font-normal leading-[140%] ${isSelected ? "text-white" : "text-[#111]"}`}>
                            {tab.label}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            <h2 className="text-[20px] font-bold leading-[140%] text-center text-[#e84814]">Categories</h2>

            <button
              onClick={() => setIsCategoryOpen(!isCategoryOpen)}
              className="flex items-center cursor-pointer justify-between rounded-[10px] px-3 py-2 h-[42px] bg-white border-2 border-[#d9d9d9]"
            >
              <span className="text-[16px] font-semibold leading-[160%] text-[#111]">{selectedCategoryName}</span>
            </button>
          </div>

          {isCategoryOpen && (
            <>
              <div className="fixed inset-0 z-40 min-[930px]:hidden bg-black/50" onClick={() => setIsCategoryOpen(false)} />
              <div className="fixed inset-0 z-50 min-[930px]:hidden flex flex-col">
                <div className="h-[82px] flex-shrink-0" />
                <div className="flex-1 overflow-y-auto p-4 bg-[#f1f1f1]">
                  <h2 className="text-[20px] font-medium leading-[140%] text-center text-black mb-[10px]">Categories</h2>
                  <div className="flex flex-col gap-[10px]">
                    <button
                      onClick={() => {
                        handleCategoryChange(null);
                        setIsCategoryOpen(false);
                      }}
                      className={`flex items-center cursor-pointer justify-between rounded-[10px] px-3 py-2 h-[40px] border-2 ${selectedCategoryId === null ? "bg-[#e84814] border-[#e84814]" : "bg-white border-[#d9d9d9]"}`}
                    >
                      <span className={`text-[16px] font-normal leading-[140%] text-center ${selectedCategoryId === null ? "text-white" : "text-[#111]"}`}>
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
                          className={`flex items-center cursor-pointer justify-between rounded-[10px] px-3 py-2 h-[40px] border-2 ${isSelected ? "bg-[#e84814] border-[#e84814]" : "bg-white border-[#d9d9d9]"}`}
                        >
                          <span className={`text-[16px] font-normal leading-[140%] text-center ${isSelected ? "text-white" : "text-[#111]"}`}>
                            {category.name}
                          </span>
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
                  const price = formatPrice(course.price);
                  return (
                    <CourseCard
                      slug={course.slug}
                      key={course.id}
                      image={course.image ?? "/Rectangle 8.png"}
                      title={course.name}
                      price={price ?? 0}
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