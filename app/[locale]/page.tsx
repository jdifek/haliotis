/* eslint-disable @typescript-eslint/no-explicit-any */
import { notFound } from "next/navigation";
import { HeroSection } from "@/components/HeroSection";
import { CoursesSection } from "@/components/mainSections/CoursesSection";
import { TripsSection } from "@/components/mainSections/TripsSection";
import { DiveTrips } from "@/components/mainSections/DiveTrips";
import { CentersSection } from "@/components/mainSections/CentersSection";
import type { Metadata } from "next";
import { createTermGetter } from "../utils/terms";

// Функция для получения terms напрямую (для Server Component)
async function getTerms(locale: string) {
  try {
    const res = await fetch(`https://cp.haliotis.space/api/v1/menu/${locale}`, {
      next: { revalidate: 3600 }, // кеш на 1 час
    });

    if (!res.ok) {
      return {}; // возвращаем пустой объект если ошибка
    }

    const data = await res.json();
    return data.data?.terms || {};
  } catch (error) {
    console.error("Error fetching terms:", error);
    return {};
  }
}

async function getHomepageData(lang: string) {
  try {
    const res = await fetch(`https://cp.haliotis.space/api/v1/pages/homepage?lang=${lang}`, {
      next: { revalidate: 3600 },
    });

    if (!res.ok) {
      throw new Error("Failed to fetch homepage data");
    }

    const data = await res.json();
    return data.data;
  } catch (error) {
    console.error("Error fetching homepage:", error);
    return null;
  }
}
type Props = {
  params: Promise<{ slug: string; locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;

  const homepageData = await getHomepageData(locale);

  return {
    title: homepageData?.title || "Haliotis Diving Center",
    description:
      homepageData?.seo?.meta_description ||
      "Professional diving courses and equipment for all skill levels",
    keywords:
      homepageData?.seo?.meta_keywords || "diving, courses, equipment, PADI",
  };
}

export default async function Home({ params }: Props) {
  const { locale } = await params;

  const terms = await getTerms(locale);
  const t = createTermGetter(terms);

  const homepageData = await getHomepageData(locale);

  if (!homepageData) {
    notFound();
  }

  // Формируем locations из API данных
  const locations = [
    { id: "all", label: t("all", "ALL") },
    ...(homepageData.sliders?.diving_centers?.entities || []).map(
      (center: any) => ({
        id: center.slug,
        label: center.name.toUpperCase(),
      })
    ),
  ];

  // Остальной код остается без изменений...
  const courseCards = (
    homepageData.sliders?.courses?.diving_centers || []
  ).flatMap((center: any) =>
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

  const centerCardsData = (
    homepageData.sliders?.diving_centers?.entities || []
  ).map((center: any) => ({
    image: center.icon_url || "/CTABackgroundImage.png",
    title: center.name,
    slug: center.slug,
    description: center.small_description || "",
    buttonColor: center.color || "#f49519",
    location: center.slug,
  }));

  const tripCards = (homepageData.sliders?.dive_trip?.entities || []).flatMap(
    (center: any) =>
      (center.dive_trips || []).map((trip: any) => ({
        image: center.icon_url || "/image 6.png",
        price: parseFloat(trip.price?.amount || 0),
        title: center.name,
        description: trip.description || center.small_description || "",
        link: `/dive-trips/${trip.slug || trip.id}`,
        location: center.slug,
        details: trip.description
          ? `<p>${trip.description}</p>`
          : `<p>${center.small_description || ""}</p>`,
        equipmentPrice: "€ 30.00",
      }))
  );

  const diveTripsCards = (
    homepageData.sliders?.diving_centers?.entities || []
  ).map((center: any, index: number) => ({
    image: center.icon_url || "/CTABackgroundImage.png",
    location: center.name,
    slug: center.slug,
    locationNumber: String(center.id || index + 1),
    description: center.small_description || "",
  }));
  console.log(homepageData, "homepageData");

  const heroSlides = (homepageData.banner?.slides || []).map((slide: any) => ({
    title: slide.title || "Find the Experience",
    description: slide.description || "The Haliotis Diving Center...",
    desktopImage: slide.desktop_image_url || "/bg.png",
    mobileImage: slide.mobile_image_url || slide.desktop_image_url || "/bg.png",
  }));

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
          title:
            homepageData.sliders?.equipment?.title ||
            "Gear Up with Exclusive Dive Offers",
          subtitle:
            homepageData.sliders?.equipment?.subtitle ||
            "Discover premium equipment at unbeatable prices — limited-time deals for divers.",
          partners: partners,
        }}
      />
    </main>
  );
}
