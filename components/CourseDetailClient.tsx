"use client";

import { useState } from "react";
import { CourseDetailHeroSection } from "@/components/CourseDetail/CourseDetailHeroSection";
import { RecommendedCoursesSection } from "@/components/CourseDetail/RecommendedCoursesSection";
import { BookingFormModal } from "@/components/Modals/BookingFormModal";

type AccordionItem = {
  id: string;
  label: string;
  content: React.ReactNode;
};

type RecommendedCourse = {
  image: string;
  title: string;
  price: number;
  duration: string;
  requestBased: boolean;
  badge: string;
  location: string;
  slug: string;
};

type RecommendedEquipment = {
  headers: {
    id: string;
    widget: string;
    entity: string;
    title: string;
    description: string;
  };
  equipment: string;
};

type Props = {
  courseTitle: string;
  pricePerPerson: number;
  courseImage: string;
  courseImageAlt: string;
  courseDescription: string;
  accordionItems: AccordionItem[];
  recommendedCourses: RecommendedCourse[];
  recommendedEquipment: RecommendedEquipment;
  currency: string
};

export const CourseDetailClient = ({
  courseTitle,
  pricePerPerson,
  courseImage,
  courseImageAlt,
  courseDescription,
  accordionItems,
  recommendedCourses,
  recommendedEquipment,
  currency
    }: Props) => {
  const [isBookingOpen, setIsBookingOpen] = useState(false);

  return (
    <>
      <CourseDetailHeroSection
        title={courseTitle}
        description={courseDescription}
        price={pricePerPerson}
        currency={currency}
        image={courseImage}
        imageAlt={courseImageAlt}
        onBookClick={() => setIsBookingOpen(true)}
        accordionItems={accordionItems}
      />

      <BookingFormModal
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
        courseTitle={courseTitle}
        pricePerPerson={pricePerPerson}
      />

      {recommendedCourses.length > 0 && (
        <RecommendedCoursesSection courseCards={recommendedCourses} />
      )}

      {recommendedEquipment?.equipment && (
        <section className="bg-white px-4 py-10 md:px-[30px] lg:px-[188px] md:py-[60px]">
          <div className="mb-8 md:mb-10">
            <h2 className="text-[42px] font-medium leading-[130%] text-[#000] mb-2">
              {recommendedEquipment.headers.title}
            </h2>
            <p className="text-[15px] font-normal leading-[160%] text-[#101010] opacity-80">
              {recommendedEquipment.headers.description}
            </p>
          </div>

          <div
            className="text-[15px] font-normal leading-[160%] text-[#101010] opacity-80"
            dangerouslySetInnerHTML={{ __html: recommendedEquipment.equipment }}
          />
        </section>
      )}
    </>
  );
};