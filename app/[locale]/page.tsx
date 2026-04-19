/* eslint-disable @typescript-eslint/no-explicit-any */
import { notFound } from 'next/navigation';
import Image from "next/image";
import { HeroSection } from "@/components/HeroSection";
import { CoursesSection } from "@/components/mainSections/CoursesSection";
import { TripsSection } from "@/components/mainSections/TripsSection";
import { DiveTrips } from "@/components/mainSections/DiveTrips";
import { CentersSection } from "@/components/mainSections/CentersSection";
import type { Metadata } from 'next';
import { useMenu } from "@/hooks/useMenu";
import { useLocale } from "next-intl";
import { createTermGetter } from "@/utils/terms";

async function getHomepageData() {
  try {
    const res = await fetch('https://cp.haliotis.space/api/v1/pages/homepage', {
      next: { revalidate: 3600 }, // кеш на 1 час
    });
    
    if (!res.ok) {
      throw new Error('Failed to fetch homepage data');
    }
    
    const data = await res.json();
    return data.data;
  } catch (error) {
    console.error('Error fetching homepage:', error);
    return null;
  }
}

export async function generateMetadata(): Promise<Metadata> {
  const homepageData = await getHomepageData();
  
  return {
    title: homepageData?.title || 'Haliotis Diving Center',
    description: homepageData?.seo?.meta_description || 'Professional diving courses and equipment for all skill levels',
    keywords: homepageData?.seo?.meta_keywords || 'diving, courses, equipment, PADI',
  };
}

export default async function Home() {
  const homepageData = await getHomepageData();
  
  if (!homepageData) {
    notFound();
  }

  // Формируем locations из API данных
  const locations = [
    { id: "all", label: {t("all", "ALL")} },
    ...(homepageData.sliders?.diving_centers?.entities || []).map((center: any) => ({
      id: center.slug,
      label: center.name.toUpperCase(),
    }))
  ];

  // Формируем courseCards из API
  const courseCards = (homepageData.sliders?.courses?.diving_centers || []).flatMap((center: any) =>
    (center.courses || []).map((course: any) => ({
      image: course.image_url || "/Rectangle 8.png",
      title: course.name,
      price: course.price?.amount || 0,
      duration: course.duration_label || "On request",
      requestBased: !course.duration_label,
      badge: course.label || "Course",
      location: center.slug,
    }))
  );

  // Формируем centerCards из API
  const centerCardsData = (homepageData.sliders?.diving_centers?.entities || []).map((center: any) => ({
    image: center.icon_url || "/CTABackgroundImage.png",
    title: center.name,
    description: center.small_description || "",
    buttonColor: center.color || "#f49519",
    location: center.slug,
  }));

  // Формируем tripCards из dive_trips
  const tripCards = (homepageData.sliders?.dive_trip?.entities || []).flatMap((center: any) =>
    (center.dive_trips || []).map((trip: any) => ({
      image: center.icon_url || "/image 6.png",
      price: parseFloat(trip.price?.amount || 0),
      title: center.name,
      description: trip.description || center.small_description || "",
      link: `/dive-trips/${trip.slug || trip.id}`,
      location: center.slug,
      details: trip.description ? `<p>${trip.description}</p>` : `<p>${center.small_description || ""}</p>`,
      equipmentPrice: "€ 30.00", // можно добавить в API если нужно
    }))
  );

  // Формируем diveTripsCards из API
  const diveTripsCards = (homepageData.sliders?.diving_centers?.entities || []).map((center: any, index: number) => ({
    image: center.icon_url || "/CTABackgroundImage.png",
    location: center.name,
    locationNumber: String(center.id || index + 1),
    description: center.small_description || "",
  }));

  // Для heroSlides - используем данные страницы или дефолтные
  const heroSlides = [
    {
      title: homepageData.sliders?.diving_centers?.title || "Find the Experience",
      description: homepageData.sliders?.diving_centers?.subtitle || "The Haliotis Diving Center is a PADI Gold Palm IDC center that has been diving in Portugal since 2004. PADI courses and dive shop.",
      image: homepageData.banner || "/bg.png",
    }
  ];

  // Партнеры для Equipment секции
  const partners = (homepageData.sliders?.equipment?.equipment_brands || [])
    .sort((a: any, b: any) => (a.position || 0) - (b.position || 0))
    .map((brand: any) => ({
      name: brand.title,
      image: brand.image,
    }));

  return (
    <main className="-mt-[97px]">
      <HeroSection heroSlides={heroSlides} />
      
      <CentersSection centerCards={centerCardsData} />

      <CoursesSection locations={locations} courseCards={courseCards} />
      
      <TripsSection locations={locations} tripCards={tripCards} />
      
      <DiveTrips 
        diveTripsCards={diveTripsCards} 
        equipmentData={{
          title: homepageData.sliders?.equipment?.title || "Gear Up with Exclusive Dive Offers",
          subtitle: homepageData.sliders?.equipment?.subtitle || "Discover premium equipment at unbeatable prices — limited-time deals for divers.",
          partners: partners,
        }}
      />
    </main>
  );
}