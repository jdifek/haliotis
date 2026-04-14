import { Breadcrumbs } from "@/components/Breadcrumbs";
import { RecommendedCoursesSection } from "@/components/TravelDetail/RecommendedCoursesSection";
import { TravelBookingWrapper } from "@/components/TravelDetail/TravelBookingWrapper";
import { getTravelBySlug } from "@/services/travels";

type Props = {
  params: Promise<{ slug: string; locale: string }>;
};

export default async function TravelDetailPage({ params }: Props) {
  const { slug, locale } = await params;
  const { data, recommended } = await getTravelBySlug(slug, locale);

  const price = parseFloat(data.price[0]?.amount ?? "0");

  const accordionItems = [
    ...(data.information ? [{
      id: "information",
      label: "Information",
      content: (
        <div
          className="text-[15px] font-normal leading-[160%] text-[#101010] opacity-80"
          dangerouslySetInnerHTML={{ __html: data.information }}
        />
      ),
    }] : []),
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
    locationId: t.divingCenter.slug,
    images: t.image ? [t.image] : ["/travel.png"],
    price: parseFloat(t.price[0]?.amount ?? "0"),
    title: t.name,
    description: "",
    link: `/trips/${t.slug}`,
  }));

  return (
    <main className="min-h-screen bg-white relative pt-4 md:pt-6">
      <Breadcrumbs
        className="mb-6 mx-5 md:mb-8"
        items={[
          { label: "Haliotis", href: "/" },
          { label: "Travel", href: "/travel" },
          { label: data.destination?.name ?? data.name },
        ]}
      />
    <TravelBookingWrapper
  title={data.name}
  description={data.summary?.replace(/<[^>]*>/g, "") ?? ""}
  price={price}
  image={data.image_url ?? "/travel.png"}
  imageAlt={data.name}
  pricePerPerson={price}
  accordionItems={accordionItems}
/>
      <RecommendedCoursesSection
        title={recommended.headers.title}
        description={recommended.headers.description}
        courseCards={recommendedTripCards}
      />
    </main>
  );
}