// components/TravelDetail/TravelBookingWrapper.tsx
"use client";

import { useState } from "react";
import { CourseDetailHeroSection } from "./CourseDetailHeroSection";
import { BookingFormModal } from "@/components/Modals/BookingFormModal";

// просто пробрасываем все пропы CourseDetailHeroSection как есть
type Props = React.ComponentProps<typeof CourseDetailHeroSection> & {
  pricePerPerson: number;
};

export function TravelBookingWrapper({ pricePerPerson, ...heroProps }: Props) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <CourseDetailHeroSection
        {...heroProps}
        onBookClick={() => setIsOpen(true)}
      />
      <BookingFormModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        courseTitle={heroProps.title}
        pricePerPerson={pricePerPerson}
      />
    </>
  );
}