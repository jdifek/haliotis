// app/[locale]/diving/[[...slug]]/page.tsx
import { getMenu } from "@/app/utils/getMenu";
import DivingClient from "@/components/DivingClient";
type Props = {
  params: Promise<{ locale: string; slug?: string[] }>; // ← Promise в Next.js 15
};

export default async function DivingPage({ params }: Props) {
  const { locale, slug } = await params; // ← await обязателен
  const slugFromUrl = slug?.[0];

  const { divingCenters, colorBySlug, terms } = await getMenu(locale);


  // Fetch начальных данных для первого таба
  const firstCenter = divingCenters[0];
  let initialData = null;

  if (firstCenter) {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/diving-category/diving?center_id=${firstCenter.id}&lang=${locale}&attach_regions=true`,
      { headers: { Accept: "application/json" }, next: { revalidate: 60 } }
    );
    const json = await res.json();
    initialData = {
      title: json.data?.title ?? "",
      banner: json.data?.banner ?? null,
      seo: json.data?.seo ?? null,
      dive_trips: json.dive_trips ?? [],
      regions: json.regions ?? null,
    };
  }

  return (
    <DivingClient
      locale={locale}
      slugFromUrl={slugFromUrl}
      divingCenters={divingCenters}
      colorBySlug={colorBySlug}
      terms={terms}
      initialData={initialData}
      initialActiveTab={firstCenter?.slug ?? null}
    />
  );
}