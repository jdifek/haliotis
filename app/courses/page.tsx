"use client";
import { Tabs } from "@/components/buttons/Tabs";
import { CategoriesList } from "@/components/CategoriesList";
import { HeroSection } from "@/components/CourseDetail/HeroSection";
import { Pagination } from "@/components/Pagination";
import { CourseCard } from "@/components/CourseCard";
import Image from "next/image";
import { useEffect, useState } from "react";
import CoursesSectionInfo from "@/components/CourseDetail/CoursesSectionInfo";

type Tab = {
  id: string;
  label: string;
  description: string;
};

const tabs: Tab[] = [
  { 
    id: "peniche", 
    label: "Peniche",
    description: "Learn how to scuba dive in Peniche is an incredible experience that will allow you to see amazing creatures in their natural habitat and visit the best scuba diving spots. The beginner PADI courses are internationally recognised which allow you to scuba dive anywhere in the world."
  },
  { 
    id: "sesimbra", 
    label: "Sesimbra",
    description: "Discover scuba diving in Sesimbra, one of Portugal's most beautiful diving destinations. Experience crystal-clear waters and diverse marine life while learning from certified PADI instructors in a stunning coastal setting."
  },
  { 
    id: "madeira", 
    label: "Madeira",
    description: "Explore the underwater wonders of Madeira with our PADI courses. This Atlantic paradise offers year-round diving conditions and breathtaking marine biodiversity perfect for beginners and experienced divers alike."
  },
  { 
    id: "santa-maria", 
    label: "Santa Maria",
    description: "Experience world-class diving in Santa Maria, Azores. Known for its encounters with mobula rays and blue sharks, this destination offers unforgettable diving experiences with our certified PADI instructors."
  },
  { 
    id: "faial", 
    label: "Faial",
    description: "Dive into the volcanic underwater landscapes of Faial in the Azores. Our PADI courses will guide you through unique dive sites featuring dramatic rock formations and abundant Atlantic marine life."
  },
  { 
    id: "sao-vicente", 
    label: "Sao Vicente",
    description: "Start your diving journey in São Vicente, Madeira. With excellent visibility and rich marine ecosystems, this location is perfect for completing your PADI certification in a beautiful island setting."
  },
];

const categories = [
  "Promotions",
  "Freediving",
  "Referral",
  "Beginner",
  "Advanced",
  "Rescue",
  "Specialties",
  "AWARE",
  "Sidemount",
  "Caverns",
  "Divemaster",
  "Dive Instructor",
  "Specialty Instructor",
  "First Aid",
  "Junior",
  "ReActivate",
];

const getRandomFromArray = <T,>(arr: T[]) =>
  arr[Math.floor(Math.random() * arr.length)];

const getRandomPrice = () => {
  const prices = [149, 179, 199, 219, 239, 259, 299];
  return getRandomFromArray(prices);
};

const getRandomDuration = () => {
  const durations = ["2hrs", "2.5hrs", "3hrs", "4hrs", "5hrs"];
  return getRandomFromArray(durations);
};

const generateCourses = (location: string, page: number, selectedCategory: string) => {
  const coursesPerPage = 12;
  const startIndex = (page - 1) * coursesPerPage;

  return Array.from({ length: coursesPerPage }, (_, i) => ({
    id: `${location}-${selectedCategory}-${startIndex + i}`,
    image: "/Rectangle 8.png",
    title: `${location} - ${selectedCategory} - Curso de Nitrox PADI Enriched Air Diver - incl mergulhos`,
    price: getRandomPrice(),
    duration: getRandomDuration(),
    requestBased: i % 2 === 0,
    badge: i % 3 === 0 ? "Open Trip" : undefined,
  }));
};

const Courses = () => {
  const [activeTab, setActiveTab] = useState("peniche");
  const [currentPage, setCurrentPage] = useState(1);
  const [isTabOpen, setIsTabOpen] = useState(false);
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("Promotions");

  const totalPages = 12;
  const courses = generateCourses(activeTab, currentPage, selectedCategory);

  const getCurrentTabData = () => {
    return tabs.find((tab) => tab.id === activeTab) || tabs[0];
  };
  useEffect(() => {
    if (isCategoryOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
  
    // на всякий случай — очистка
    return () => {
      document.body.style.overflow = "";
    };
  }, [isCategoryOpen]);
  
  return (
    <main className="-mt-[97px]">
      <HeroSection />

      {/* Tabs Section - Desktop */}
      <section className="hidden md:flex h-[95px] bg-white justify-center items-end">
        <Tabs
          className="mb-1"
          tabsContainerClassName="relative flex gap-6"
          tabs={tabs}
          activeTab={activeTab}
          onTabChange={(tab) => {
            setActiveTab(tab);
            setCurrentPage(1);
          }}
          underlineClassName="absolute -bottom-1 left-0 w-full h-[2px] transition-opacity"
        />
      </section>

      {/* Main Content Section */}
      <section className="bg-[#f1f1f1] px-4 pb-12 pt-8 md:px-[30px] md:pb-[50px] md:pt-[46px]">
        <div className="flex flex-col gap-[30px] md:flex-row">
          {/* Left Sidebar - Desktop Only */}
          <div className="hidden md:flex md:flex-col md:gap-[10px]">
            <Image
              alt="PADI Logo"
              src={"/Frame 25.png"}
              width={285}
              height={140}
              className="h-[140px] w-[285px]"
            />
            <CategoriesList />
          </div>

          {/* Mobile - Tabs and Categories */}
          <div className="md:hidden mb-6 flex flex-col gap-[10px]">
            {/* Tab Selector Accordion */}
            <div className="flex flex-col gap-2">
              <button
                onClick={() => setIsTabOpen(!isTabOpen)}
                className="flex items-center cursor-pointer justify-between rounded-[10px] px-3 py-2 h-[42px] bg-white border-1 border-[#e84814]"
              >
                <span className="text-[16px] font-semibold leading-[160%] text-[#111]">
                  {getCurrentTabData().label}
                </span>
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className={`transition-transform flex-shrink-0 ${isTabOpen ? "rotate-180" : ""}`}
                >
                  <path
                    d="M17.8534 9.85369L12.8537 14.8534C12.8073 14.8999 12.7522 14.9367 12.6915 14.9619C12.6308 14.9871 12.5657 15 12.5 15C12.4343 15 12.3692 14.9871 12.3085 14.9619C12.2478 14.9367 12.1927 14.8999 12.1463 14.8534L7.14663 9.85369C7.07663 9.78377 7.02895 9.69465 7.00963 9.59761C6.9903 9.50058 7.00021 9.39999 7.03808 9.30858C7.07595 9.21718 7.1401 9.13907 7.22239 9.08413C7.30468 9.0292 7.40142 8.99992 7.50036 9H17.4996C17.5986 8.99992 17.6953 9.0292 17.7776 9.08413C17.8599 9.13907 17.924 9.21718 17.9619 9.30858C17.9998 9.39999 18.0097 9.50058 17.9904 9.59761C17.971 9.69465 17.9234 9.78377 17.8534 9.85369Z"
                    fill="black"
                  />
                </svg>
              </button>

              {/* Tabs dropdown */}
              {isTabOpen && (
                <div className="bg-white rounded-[10px] border-2 border-gray-200 overflow-hidden">
                  <div className="flex flex-col gap-[10px] p-2">
                    {tabs.map((tab) => {
                      const isSelected = tab.id === activeTab;
                      return (
                        <button
                          key={tab.id}
                          onClick={() => {
                            setActiveTab(tab.id);
                            setIsTabOpen(false);
                            setCurrentPage(1);
                          }}
                          className={`flex items-center cursor-pointer justify-between rounded-[10px] px-3 py-2 h-[40px] border-2 ${
                            isSelected
                              ? "bg-[#e84814] border-[#e84814]"
                              : "bg-white border-[#d9d9d9]"
                          }`}
                        >
                          <span
                            className={`text-[16px] font-normal leading-[140%] ${
                              isSelected ? "text-white" : "text-[#111]"
                            }`}
                          >
                            {tab.label}
                          </span>
                          {isSelected && (
                            <svg
                              width="24"
                              height="24"
                              viewBox="0 0 24 24"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                              className="flex-shrink-0"
                            >
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

            {/* Categories Title */}
            <h2 className="text-[20px] font-bold leading-[140%] text-center text-[#e84814]">
              Categories
            </h2>

            {/* Category Selector */}
            <button
              onClick={() => setIsCategoryOpen(!isCategoryOpen)}
              className="flex items-center cursor-pointer justify-between rounded-[10px] px-3 py-2 h-[42px] bg-white border-2 border-[#d9d9d9]"
            >
              <span className="text-[16px] font-semibold leading-[160%] text-[#111]">
                {selectedCategory}
              </span>
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="flex-shrink-0"
              >
                <path
                  d="M3.75 7C3.75 6.80109 3.82902 6.61032 3.96967 6.46967C4.11032 6.32902 4.30109 6.25 4.5 6.25H19.5C19.6989 6.25 19.8897 6.32902 20.0303 6.46967C20.171 6.61032 20.25 6.80109 20.25 7C20.25 7.19891 20.171 7.38968 20.0303 7.53033C19.8897 7.67098 19.6989 7.75 19.5 7.75H4.5C4.30109 7.75 4.11032 7.67098 3.96967 7.53033C3.82902 7.38968 3.75 7.19891 3.75 7ZM6.25 12C6.25 11.8011 6.32902 11.6103 6.46967 11.4697C6.61032 11.329 6.80109 11.25 7 11.25H17C17.1989 11.25 17.3897 11.329 17.5303 11.4697C17.671 11.6103 17.75 11.8011 17.75 12C17.75 12.1989 17.671 12.3897 17.5303 12.5303C17.3897 12.671 17.1989 12.75 17 12.75H7C6.80109 12.75 6.61032 12.671 6.46967 12.5303C6.32902 12.3897 6.25 12.1989 6.25 12ZM9.25 17C9.25 16.8011 9.32902 16.6103 9.46967 16.4697C9.61032 16.329 9.80109 16.25 10 16.25H14C14.1989 16.25 14.3897 16.329 14.5303 16.4697C14.671 16.6103 14.75 16.8011 14.75 17C14.75 17.1989 14.671 17.3897 14.5303 17.5303C14.3897 17.671 14.1989 17.75 14 17.75H10C9.80109 17.75 9.61032 17.671 9.46967 17.5303C9.32902 17.3897 9.25 17.1989 9.25 17Z"
                  fill="#E84814"
                />
              </svg>
            </button>
          </div>

          {/* Categories Dropdown Overlay */}
          {isCategoryOpen && (
            <>
              {/* Backdrop */}
              <div 
                className="fixed inset-0 z-40 md:hidden bg-black/50"
                onClick={() => setIsCategoryOpen(false)}
              />
              
              {/* Content */}
              <div className="fixed inset-0 z-50 md:hidden flex flex-col">
                {/* Header spacer - keeping original header visible */}
                <div className="h-[82px] flex-shrink-0" />
                
                {/* Scrollable content */}
                <div className="flex-1 overflow-y-auto p-4  bg-[#f1f1f1]">
                  <h2 className="text-[20px] font-medium leading-[140%] text-center text-black mb-[10px]">
                    Categories
                  </h2>
                  <div className="flex flex-col gap-[10px]">
                    {categories.map((category) => {
                      const isSelected = category === selectedCategory;
                      return (
                        <button
                          key={category}
                          onClick={() => {
                            setSelectedCategory(category);
                            setIsCategoryOpen(false);
                            setCurrentPage(1);
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
                            {category}
                          </span>
                          {isSelected && (
                            <svg
                              width="24"
                              height="24"
                              viewBox="0 0 24 24"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                              className="flex-shrink-0"
                            >
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
              </div>
            </>
          )}

          {/* Right Content */}
          <div className="flex flex-1 flex-col gap-6">
            {/* Description Text - Changes based on active tab */}
            <p
              className="text-[14px] leading-[160%] text-[#111] md:text-[15px]"
              style={{ fontFamily: "var(--font-family)" }}
            >
              {getCurrentTabData().description}
            </p>

            {/* Cards Grid */}
            <div className="grid grid-cols-2 gap-2 sm:gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {courses.map((course) => (
                <CourseCard
                  key={course.id}
                  image={course.image}
                  title={course.title}
                  price={course.price}
                  duration={course.duration}
                  requestBased={course.requestBased}
                  badge={course.badge}
                  onBookClick={() => console.log("Book:", course.id)}
                />
              ))}
            </div>

            {/* Pagination */}
            <div className="mt-6 flex justify-center">
              <Pagination
                totalPages={totalPages}
                currentPage={currentPage}
                onPageChange={setCurrentPage}
              />
            </div>
          </div>
        </div>
      </section>

      <CoursesSectionInfo />
    </main>
  );
};

export default Courses;