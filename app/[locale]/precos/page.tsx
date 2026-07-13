/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { HeroBanner } from "@/components/HeroBanner";
import PricesSections from "@/components/PricesSections";
import { usePrices } from "@/app/hooks/usePrices";
import { useMenu } from "@/app/hooks/useMenu";
import { useLocale } from "next-intl";

export default function Prices() {
  const locale = useLocale();
  const { divingCenters } = useMenu(locale);
  const activeCenter = divingCenters[0] ?? null;
  const { data: pricesData } = usePrices(activeCenter?.id ?? null, locale);

  return (
    <>
      <HeroBanner
        slides={
          pricesData?.page?.banner?.slides?.length
            ? pricesData.page.banner.slides.map((s: any) => ({
                image: s.desktop_image_url,
                mobileImage: s.mobile_image_url,
                title: s.title,
                description: s.description,
              }))
            : [{ image: "" }]
        }
        height="h-[90vh]"
        breadcrumbs={[
          { label: "Haliotis", href: "/" },
          { label: pricesData?.page?.title ?? "Prices" },
        ]}
      >
       
      </HeroBanner>
      <PricesSections />
    </>
  );
}
