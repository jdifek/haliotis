/* eslint-disable @typescript-eslint/no-explicit-any */
import { HeroBanner } from "@/components/HeroBanner";
import { TravelTripsSection } from "@/components/TravelTripsSection";

async function getTravelsData(locale: string) {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/travels?attach_page=true&lang=${locale}`;

  console.log("[Travels API] Request:", {
    url,
    locale,
    timestamp: new Date().toISOString(),
  });

  const res = await fetch(url, {
    next: { revalidate: 60 },
  });

  console.log("[Travels API] Response:", {
    status: res.status,
    statusText: res.statusText,
    ok: res.ok,
    headers: Object.fromEntries(res.headers.entries()),
  });

  if (!res.ok) {
    const errorText = await res.text();

    console.error("[Travels API] Error response body:", errorText);

    throw new Error(
      `Failed to fetch travels | Status: ${res.status}`
    );
  }

  const data = await res.json();

  console.log("[Travels API] Parsed data:", {
    totalTrips: data?.data?.length,
    hasAttachPage: !!data?.attachPage,
    attachPageTitle: data?.attachPage?.title,
    firstTrip: data?.data?.[0],
  });

  return data;
}

type Props = {
  params: Promise<{ slug: string; locale: string }>;
};

export default async function Travel({ params }: Props) {
  const { locale } = await params;

  console.log("[Travel Page] Current locale:", locale);

  const data = await getTravelsData(locale);

  console.log("[Travel Page] Full response data:", data);

  const tripCards = data.data.map((trip: any) => ({
  locationId: trip.diving_center?.slug || trip.slug || trip.id.toString(),
    images:
      trip.gallery.length > 0
        ? trip.gallery.map((g: any) => g.image)
        : [trip.image],
    price: parseFloat(trip.price.amount),
    title: trip.name,
description: trip.description ? trip.description.replace(/<[^>]*>/g, "") : "",
    link: `/viagens/${trip.slug || trip.id}`,
  }));
  
  const bannerSlides = data.attachPage?.banner?.slides?.length
    ? data.attachPage.banner.slides.map((s: any) => ({
        image: s.desktop_image_url,
        mobileImage: s.mobile_image_url,
        title: s.title,
        description: s.description,
      }))
    : [{ image: "" }];

  const pageTitle = data.attachPage?.title || "";
  return (
    <>
      <HeroBanner
        slides={bannerSlides}
        height="h-[75vh]"
        breadcrumbs={[
          { label: "Haliotis", href: "/" },
          { label: pageTitle },
        ]}
      >
    
      </HeroBanner>

      <TravelTripsSection tripCards={tripCards} />
    </>
  );
}