// app/[locale]/freedive/[[...slug]]/page.tsx
import FreediveClient from "@/components/FreediveClient";
import { getMenu } from "@/app/utils/getMenu";

type Props = {
  params: Promise<{ locale: string; slug?: string[] }>;
};

export default async function FreedivePage({ params }: Props) {
  const { locale, slug } = await params;
  const slugFromUrl = slug?.[0];

  const { divingCenters, colorBySlug, terms } = await getMenu(locale);

  const firstCenter = divingCenters[0];
  let initialData = null;

  if (firstCenter) {
    const baseUrl = process.env.API_URL ?? process.env.NEXT_PUBLIC_API_URL;
    const res = await fetch(
      `${baseUrl}/diving-category/freedive?center_id=${firstCenter.id}&lang=${locale}&attach_regions=true`,
      {
        headers: { Accept: "application/json" },
        next: { revalidate: 60 },
      }
    );

    if (res.ok) {
      const json = await res.json();
      initialData = {
        title: json.data?.title ?? "",
        banner: json.data?.banner ?? null,
        seo: json.data?.seo ?? null,
        dive_trips: json.dive_trips ?? [],
        regions: json.regions ?? null,
      };
    }
  }

  return (
    <FreediveClient
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