/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { CourseDetailHeroSection } from "@/components/CourseDetail/CourseDetailHeroSection";
import { RecommendedCoursesSection } from "@/components/CourseDetail/RecommendedCoursesSection";
import { BookingFormModal } from "@/components/Modals/BookingFormModal";
import { CourseCard } from "./CourseCard";
import { RecommendedEquipmentSection } from "./CourseDetail/RecommendedEquipmentSection";

type AccordionItem = {
  id: string;
  label: string;
  content: React.ReactNode;
};

type RecommendedCourse = {
  image: string;
  title: string;
  currency: string;
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
  recommendedHeader: any;
  courseDescription: string;
  accordionItems: AccordionItem[];
  recommendedCourses: RecommendedCourse[];
  recommendedEquipment: RecommendedEquipment;
  currency: string
    courseId: number;       // ← добавить
  centerSlug: string;  
};

export const CourseDetailClient = ({
  courseTitle,
  recommendedHeader,
  pricePerPerson,
  courseImage,
  courseImageAlt,
  courseDescription,
  accordionItems,
  recommendedCourses,
  recommendedEquipment,
  currency,
  courseId,
  centerSlug
}: Props) => {
  const [isBookingOpen, setIsBookingOpen] = useState(false);
console.log(courseDescription, 'courseDescriptioncourseDescription');
console.log(recommendedEquipment, 'recommendedEquipment.equipment');
console.log(recommendedCourses, 'recommendedCourses');

  return (
    <>
      <CourseDetailHeroSection
        id={courseId}
        location={centerSlug}
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
        <RecommendedCoursesSection recommendedHeader={recommendedHeader} courseCards={recommendedCourses} />
      )}

{recommendedEquipment?.equipment.length > 0 && (
  <RecommendedEquipmentSection
    headers={recommendedEquipment.headers}
    equipment={recommendedEquipment.equipment}
  />
)}
    </>
  );
};