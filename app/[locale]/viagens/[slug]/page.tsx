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
    const res = await fetch(`https://cp.haliotis.space/api/v1/configs/menus?lang=${locale}`);
console.log(res, 'resres');

    if (!res.ok) {
      return {}; // возвращаем пустой объект если ошибка
    }

    const data = await res.json();
    console.log(data,'aaaaaa');
    
    return data?.terms || {};
  } catch (error) {
    console.error("Error fetching terms:", error);
    return {};
  }
}

export default async function TravelDetailPage({ params }: Props) {
  const { slug, locale } = await params;
  const { data, recommended } = await getTravelBySlug(slug, locale);
console.log(data, 'data');
console.log(recommended, 'recommended');
const terms = await getTerms(locale);

console.log(terms, 'terms');
console.log(data, 'datadatadata');

  const price = parseFloat(data.price?.amount ?? "0");
  const currency = data.price?.currency;

  const accordionItems = [
    ...(data.information ? [{
      id: "information",
      label: terms.information,
      content: (
        <div
          className="text-[15px] font-normal leading-[160%] text-[#101010] opacity-80"
          dangerouslySetInnerHTML={{ __html: data.information }}
        />
      ),
    }] : []),
    ...(data.other_information?.body ? [{
      id: "other_information",
      label: terms.other_information,
      content: (
        <div
          className="text-[15px] font-normal leading-[160%] text-[#101010] opacity-80"
          dangerouslySetInnerHTML={{ __html: data.other_information.body }}
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
locationId: t.divingCenter?.slug ?? "",
    images: t.image ? [t.image] : ["/travel.png"],
price: parseFloat(t.price?.amount ?? "0"),
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
          { label: "Travel", href: "/viagens" },
          { label: data.destination?.name ?? data.name },
        ]}
      />
    <TravelBookingWrapper
    images={data.gallery.map((g: any) => g.image)}
  title={data.name}
  description={data.summary?.replace(/<[^>]*>/g, "") ?? ""}
  price={price}
  image={data.image_url ?? "/travel.png"}
  imageAlt={data.name}
  pricePerPerson={price}
  currency={currency}
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