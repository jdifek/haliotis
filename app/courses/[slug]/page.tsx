"use client";

import { Breadcrumbs } from "@/components/Breadcrumbs";
import { CourseDetailHeroSection } from "@/components/CourseDetail/CourseDetailHeroSection";
import { RecommendedCoursesSection } from "@/components/CourseDetail/RecommendedCoursesSection";
import { BookingFormModal } from "@/components/Modals/BookingFormModal";
import { useState } from "react";

const mockCourseCards = [
  {
    image: "/Rectangle 8.png",
    title: "Curso de Nitrox PADI Enriched Air Diver Madeira - inclui mergulhos",
    price: 239,
    duration: "3hrs",
    requestBased: true,
    badge: "Open Trip",
    location: "Madeira",
  },
  {
    image: "/Rectangle 8.png",
    title: "Curso de Mergulho Profundo PADI Deep Diver Santa Maria, Açores",
    price: 349,
    duration: "3hrs",
    requestBased: true,
    badge: "Open Trip",
    location: "Santa Maria",
  },
  {
    image: "/Rectangle 8.png",
    title: "Curso de Nitrox PADI Enriched Air Diver Madeira - inclui mergulhos",
    price: 239,
    duration: "3hrs",
    requestBased: true,
    badge: "Open Trip",
    location: "Madeira",
  },
  {
    image: "/Rectangle 8.png",
    title: "Curso de Mergulho Profundo PADI Deep Diver Santa Maria, Açores",
    price: 349,
    duration: "3hrs",
    requestBased: true,
    badge: "Open Trip",
    location: "Santa Maria",
  },
];

const CourseDetail = () => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <main className="min-h-screen bg-[#ffffff] relative pt-4  md:pt-6 ">
      <Breadcrumbs
        className="mb-6 mx-5 md:mb-8 "
        items={[
          { label: "Haliotis", href: "/" },
          { label: "Courses", href: "/courses" },
          { label: "Peniche" },
        ]}
      />
      <CourseDetailHeroSection
        title="PADI Advanced Open Water Diver & PADI Underwater Naturalist Sesimbra"
        description="Take two courses at a time, saving you money and time: the PADI Advanced Open Water Diver course and the specialty PADI Underwater Naturalist. You will be able to dive up to 30 metres deep and will be prepared to scientifically observe marine ecosystems, emphasising the relationships between organisms, the environment and human beings, making the most of every dive!"
        price={349}
        image="/Rectangle 8.png"
        imageAlt="PADI Advanced Open Water Diver course"
        onBookClick={() => setIsOpen(true)} 
        
      />
      <BookingFormModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        courseTitle="PADI Advanced Open Water Diver..."
        pricePerPerson={519}
      />
      <RecommendedCoursesSection courseCards={mockCourseCards} />
    </main>
  );
};

export default CourseDetail;
