"use client";
import { Tabs } from "@/components/buttons/Tabs";
import { CategoriesList } from "@/components/CategoriesList";
import { HeroSection } from "@/components/CourseDetail/HeroSection";
import { Pagination } from "@/components/Pagination";
import { CourseCard } from "@/components/CourseCard";
import Image from "next/image";
import { useState } from "react";
import CoursesSectionInfo from "@/components/CourseDetail/CoursesSectionInfo";

type Tab = {
  id: string;
  label: string;
};

const tabs: Tab[] = [
  { id: "peniche", label: "Peniche" },
  { id: "sesimbra", label: "Sesimbra" },
  { id: "madeira", label: "Madeira" },
  { id: "santa-maria", label: "Santa Maria" },
  { id: "faial", label: "Faial" },
  { id: "sao-vicente", label: "Sao Vicente" },
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

const generateCourses = (location: string, page: number) => {
  const coursesPerPage = 12;
  const startIndex = (page - 1) * coursesPerPage;

  return Array.from({ length: coursesPerPage }, (_, i) => ({
    id: `${location}-${startIndex + i}`,
    image: "/Rectangle 8.png",
    title: `${location} - Curso de Nitrox PADI Enriched Air Diver Madeira - incl mergulhos`,
    price: getRandomPrice(),
    duration: getRandomDuration(),
    requestBased: i % 2 === 0,
    badge: i % 3 === 0 ? "Open Trip" : undefined,
  }));
};


const CourseDetail = () => {
  const [activeTab, setActiveTab] = useState("peniche");
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = 12;
  const courses = generateCourses(activeTab, currentPage);

  // Текст описания в зависимости от таба
  const getDescriptionText = () => {
    return `Learn how to scuba dive is an incredible experience that will allow you to see amazing creatures in their natural habitat and visit the best scuba diving spots. The beginner PADI courses are internationally recognised which allow you to scuba dive anywhere in the world. Explore this underwater world using scuba and meet fantastic people. Diver certification begins here, start your scuba lessons now!`;
  };

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
            setCurrentPage(1); // Сброс страницы при смене таба
          }}
          underlineClassName="absolute -bottom-1 left-0 w-full h-[2px] transition-opacity"
        />
      </section>

      {/* Mobile Dropdown */}
      <section className="md:hidden bg-white px-5 py-4">
        <select
          value={activeTab}
          onChange={(e) => {
            setActiveTab(e.target.value);
            setCurrentPage(1);
          }}
          className="w-full rounded-lg border-2 border-gray-300 bg-white px-4 py-2 text-[15px] font-semibold"
          style={{ fontFamily: "var(--font-family)" }}
        >
          {tabs.map((tab) => (
            <option key={tab.id} value={tab.id}>
              {tab.label}
            </option>
          ))}
        </select>
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

          {/* Right Content */}
          <div className="flex flex-1 flex-col gap-6">
            {/* Description Text */}
              <p
                className="text-[14px] leading-[160%] text-[#111] md:text-[15px]"
                style={{ fontFamily: "var(--font-family)" }}
              >
                {getDescriptionText()}
              </p>

            {/* Cards Grid */}
            <div className="grid grid-cols-2 gap-2  sm:gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
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

      <CoursesSectionInfo/>
    </main>
  );
};

export default CourseDetail;