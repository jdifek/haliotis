/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { LegalInfo } from "@/components/CoursesPage/LegalInfo";
import { Parceiros } from "@/components/CoursesPage/Parceiros";
import { PaymentMethods } from "@/components/CoursesPage/PaymentMethods";
import { PenicheHero } from "@/components/CoursesPage/PenicheHero";
import { SimpleCoursesSection } from "@/components/CoursesPage/SimpleCoursesSection";
import { SimpleTripsSection } from "@/components/CoursesPage/SimpleTripsSection";
import { CenterInfoSection } from "@/components/CoursesPage/CenterInfoSection";
import type { CenterData, CenterTabs } from "@/types/center";


type Props = {
  center: CenterData;
  tabs: CenterTabs;
};

export default function PenichePage({ center, tabs }: Props) {
  const courseCards = center?.sliders?.courses?.entities?.map((course: any) => ({
    image: course.image_url || "/placeholder.png",
    title: course.title || course.name || "Course",
    price:
      typeof course.price === "object"
        ? `${course.price.amount} ${course.price.currency}`
        : course.price ?? 0,
    duration: course.duration ?? "",
    requestBased: course.request_based ?? false,
    badge: course.badge ?? "",
    location: center.slug,
  })) ?? [];
  const tripCards =
  center?.sliders?.dive_trip?.entities?.map((trip: any) => ({
    image: trip.image_url || "/placeholder.png",
    price:
      typeof trip.price === "object"
        ? `${trip.price.amount} ${trip.price.currency}`
        : trip.price ?? 0,
    title: trip.name || "Trip",
    description: trip.subtitle || "",
    link: "#", // если нет ссылки в API
    location: center.slug,
    details: trip.description || "",
    equipmentPrice: "", // пока нет в API
  })) ?? [];
  return (
    <div className="min-h-screen bg-white">
      <PenicheHero center={center} />
      <SimpleTripsSection className="!bg-white py-8" tripCards={tripCards} />
      <SimpleCoursesSection
        className="!bg-[#f1f1f1]"
        courseCards={courseCards}
      />{" "}
      <CenterInfoSection tabs={tabs} />
      <Parceiros partners={center.partners} />
      <div className="md:hidden mx-4 h-px border border-[#e4e4e4] mt-10" />
      <PaymentMethods paymentMethods={center.payment_methods} />
      <LegalInfo legalSupports={center.legal_supports} />
    </div>
  );
}
