/* eslint-disable @typescript-eslint/no-explicit-any */
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { RecommendedCoursesSection } from "@/components/TravelDetail/RecommendedCoursesSection";
import { TravelBookingWrapper } from "@/components/TravelDetail/TravelBookingWrapper";
import { getTravelBySlug } from "@/services/travels";

type Props = {
  params: Promise<{ slug: string; locale: string }>;
};

async function getTerms(locale: string) {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/configs/menus?lang=${locale}`
    );
    if (!res.ok) return {};
    const data = await res.json();
    return data?.terms || {};
  } catch (error) {
    console.error("Error fetching terms:", error);
    return {};
  }
}

export default async function TravelDetailPage({ params }: Props) {
  const { slug, locale } = await params;
  const { data, recommended } = await getTravelBySlug(slug, locale);
  const terms = await getTerms(locale);
console.log(recommended, 'recommended');

  const price = parseFloat(data.price?.amount ?? "0");
  const currency = data.price?.currency;

  const accordionItems = [
    ...(data.summary
      ? [
          {
            id: "summary",
            label: terms.summary,
            content: (
              <div
                className="text-[15px] font-normal leading-[160%] text-[#101010] opacity-80"
                dangerouslySetInnerHTML={{ __html: data.summary }}
              />
            ),
          },
        ]
      : []),
    ...(data.information
      ? [
          {
            id: "information",
            label: terms.information,
            content: (
              <div
                className="text-[15px] font-normal leading-[160%] text-[#101010] opacity-80"
                dangerouslySetInnerHTML={{ __html: data.information }}
              />
            ),
          },
        ]
      : []),
    ...(data.other_information?.body
      ? [
          {
            id: "other_information",
            label: terms.other_information,
            content: (
              <div
                className="text-[15px] font-normal leading-[160%] text-[#101010] opacity-80"
                dangerouslySetInnerHTML={{ __html: data.other_information.body }}
              />
            ),
          },
        ]
      : []),
    ...(data.other_information?.tabs ?? []).map((tab: any) => ({
      id: tab.title,
      label: tab.title,
      content: (
        <div
          className="text-[15px] font-normal leading-[160%] text-[#101010] opacity-80"
          dangerouslySetInnerHTML={{ __html: tab.body }}
        />
      ),
    })),
  ];

  const recommendedTripCards = recommended.travels.map((t: any) => ({
    locationId: t.divingCenter?.slug ?? "",
    images: t.image ? [t.image] : ["/travel.png"],
    price: parseFloat(t.price?.amount ?? "0"),
    title: t.name,
    description: t.description,
    link: `/trips/${t.slug}`,
  }));

  return (
    <main className="min-h-screen bg-white relative pt-4 md:pt-6">
      <Breadcrumbs
        className="mb-6 mx-5 md:mb-8"
        items={[
          { label: "Haliotis", href: "/" },
          { label: "Viagens", href: "/viagens" },
          { label: data.destination?.name ?? data.name },
        ]}
      />

      <TravelBookingWrapper
        travelId={data.id}                                    // ← передаём id
        images={data.gallery.map((g: any) => g.image)}
        title={data.name}
        description={data.description?.replace(/<[^>]*>/g, "") ?? ""}
        price={price}
        image={data.image_url ?? "/travel.png"}
        imageAlt={data.name}
        pricePerPerson={price}
        currency={currency}
        accordionItems={accordionItems}
      />

  {recommendedTripCards.length > 0 && (
  <RecommendedCoursesSection
    recommendedHeader={{
      title: recommended.headers.title,
      description: recommended.headers.description,
    }}
    courseCards={recommendedTripCards}
  />
)}
    </main>
  );
}