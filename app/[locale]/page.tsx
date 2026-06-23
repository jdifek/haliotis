/* eslint-disable @typescript-eslint/no-explicit-any */
import { notFound } from "next/navigation";
import { HeroSection } from "@/components/HeroSection";
import { CoursesSection } from "@/components/mainSections/CoursesSection";
import { TripsSection } from "@/components/mainSections/TripsSection";
import { DiveTrips } from "@/components/mainSections/DiveTrips";
import { CentersSection } from "@/components/mainSections/CentersSection";
import type { Metadata } from "next";
import { createTermGetter } from "../utils/terms";
import { DiveExploreSection } from "@/components/mainSections/DiveExploreSection";

// Функция для получения terms напрямую (для Server Component)
async function getTerms(locale: string) {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/configs/menus?lang=${locale}`
    );

    if (!res.ok) {
      return {}; // возвращаем пустой объект если ошибка
    }

    const data = await res.json();
    return data?.terms || {};
  } catch (error) {
    console.error("Error fetching terms:", error);
    return {};
  }
}

async function getHomepageData(lang: string) {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/pages/homepage?lang=${lang}`
    );

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
console.log(homepageData, 'homepageData');

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

  const courseCards = (
    homepageData.sliders?.courses?.diving_centers || []
  ).flatMap((center: any) =>
    (center.courses || []).map((course: any) => ({
      image: course.image_url || "/Rectangle 8.png",
      title: course.name,
      slug: course.slug,
      centerSlug: center.slug,
      currency: course.price?.currency || "€",
      price: course.price?.amount || 0,
      duration: course.duration_label || "On request",
      requestBased: !course.duration_label,
      badge: course.label?.name || "Course",
      location: center.slug,
    }))
  );

  console.log(courseCards, "courseCards");

  const centerCardsData = (
    homepageData.sliders?.diving_centers?.entities || []
  ).map((center: any) => ({
    image: center.icon_url,
    title: center.name,
    imageFull: center.image_url || "/image 6.png",
    slug: center.slug,
    description: center.small_description || "",
    buttonColor: center.color || "#f49519",
    location: center.slug,
  }));

  const tripCards = (homepageData.sliders?.dive_trip?.entities || []).flatMap(
    (center: any) =>
      (center.dive_trips || []).map((trip: any) => ({
        image: center.image_url || "/image 6.png",
        price: parseFloat(trip.price?.amount || 0),
        title: trip.name,
        description: trip.description || center.small_description || "",
        link: `/dive-trips/${trip.slug || trip.id}`,
        location: center.slug,
        details: trip.description
          ? `<p>${trip.description}</p>`
          : `<p>${center.small_description || ""}</p>`,
        equipmentPrice: "€ 30.00",
      }))
  );

  const diveTripsCards = (homepageData.sliders?.travels?.entities || []).map(
    (center: any, index: number) => ({
      image: center.image || "/CTABackgroundImage.png",
      location: center.name,
      slug: center.slug,
      currency: center.price?.currency,
      amount: parseFloat(center.price?.amount || 0).toFixed(2).replace(/\.00$/, ''),
      locationNumber: String(center.divingCenter.id || index + 1),
      description: center.description || "",
    })
  );

  console.log(homepageData, "homepageData");

  const heroSlides = (homepageData.banner?.slides || [])
    .filter(
      (slide: any) =>
        slide && (slide.desktop_image_url || slide.mobile_image_url)
    )
    .map((slide: any) => ({
      title: slide.title || "Find the Experience",
      description: slide.description || "The Haliotis Diving Center...",
      desktopImage:
        slide.desktop_image_url && slide.desktop_image_url.trim() !== ""
          ? slide.desktop_image_url
          : "/bg.png",
      mobileImage:
        slide.mobile_image_url && slide.mobile_image_url.trim() !== ""
          ? slide.mobile_image_url
          : "/bg.png",
    }));

  console.log(heroSlides, "heroSlides");

  const partners = (homepageData.sliders?.equipment?.equipment_brands || [])
    .sort((a: any, b: any) => (a.position || 0) - (b.position || 0))
    .map((brand: any) => ({
      name: brand.title,
      image: brand.image,
    }));

  // promoSliders — берём первый блок (главная секция "Dive. Learn. Explore.")
  const promoSlider = homepageData.promoSliders?.[0] ?? null;

  const exploreCards = (promoSlider?.slides || [])
    .sort((a: any, b: any) => (a.position || 0) - (b.position || 0))
    .map((slide: any) => ({
      title: slide.title || "",
      button_name: slide.button_name || "",
      description: slide.description || "",
      image: slide.image_url || "/travel.png",
      tag: slide.button_name || "Explore",
      href: slide.button_url || "/",
    }));

  const exploreSectionTitle = promoSlider?.title || "Dive. Learn. Explore.";
  const exploreSectionSubtitle =
    promoSlider?.subtitle ||
    "Courses, dive trips, and travel experiences — find the adventure that's right for you.";

  return (
    <main className="-mt-[97px]">
      <HeroSection heroSlides={heroSlides} />
      <DiveExploreSection
        title={exploreSectionTitle}
        subtitle={exploreSectionSubtitle}
        cards={exploreCards}
      />
      <CentersSection
        title={homepageData.sliders?.diving_centers?.title}
        subtitle={homepageData.sliders?.diving_centers?.subtitle}
        filter_name={homepageData.sliders?.diving_centers?.filter_name}
        centerCards={centerCardsData}
      />
      <CoursesSection
      filter_name={homepageData.sliders?.courses?.filter_name}
        title={homepageData.sliders?.courses?.title}
        subtitle={homepageData.sliders?.courses?.subtitle}
        locations={locations}
        courseCards={courseCards}
      />

      <TripsSection
              filter_name={homepageData.sliders?.dive_trip?.filter_name}
        title={homepageData.sliders?.dive_trip?.title}
        subtitle={homepageData.sliders?.dive_trip?.subtitle}
  
        locations={locations}
        tripCards={tripCards}
      />
      <DiveTrips
      locale={locale}
        diveTripsTitile={homepageData.sliders?.travels?.title}
        diveTripsCards={diveTripsCards}
        equipmentData={{
          title:
            homepageData.sliders?.equipment?.title ||
            "Gear Up with Exclusive Dive Offers",
          subtitle:
            homepageData.sliders?.equipment?.subtitle ||
            "Discover premium equipment at unbeatable prices — limited-time deals for divers.",
          label_name:
            homepageData.sliders?.equipment?.label_name || "Equipment",
          online_shop_title:
            homepageData.sliders?.equipment?.online_shop_title ||
            "Visit our Online Shop",
          online_shop_link:
            homepageData.sliders?.equipment?.online_shop_link ||
            "https://shop.haliotis.pt/",
          partners: partners,
        }}
      />
    </main>
  );
}
