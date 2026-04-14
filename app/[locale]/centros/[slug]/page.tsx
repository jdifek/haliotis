/* eslint-disable @typescript-eslint/no-explicit-any */
import PenichePage from "@/components/PenichePage";
import { notFound } from "next/navigation";

export default async function CenterPage({
  params,
}: {
  params: Promise<{ slug: string; locale: string }>;
}) {
  const { slug, locale } = await params;
  console.log("[PARAMS]", { slug, locale });

  // ================= CENTER =================
  const centerUrl = `https://cp.haliotis.space/api/v1/diving-centers/${slug}?lang=${locale}`;

  let center: any;

  try {
    console.log("[CENTER] Fetching:", centerUrl);

    const centerRes = await fetch(centerUrl, {
      headers: { Accept: "application/json" },
      next: { revalidate: 3600 },
    });

    console.log("[CENTER] Status:", centerRes.status);

    const centerJson = await centerRes.json();
    console.log("[CENTER] FULL RESPONSE:", centerJson);

    if (!centerRes.ok || !centerJson?.data || !centerJson.data.id) {
      console.error("[CENTER] INVALID DATA:", centerJson);
      return notFound();
    }

    
    center = centerJson.data; // ✅ без shadowing
  } catch (error: any) {
    console.error("[CENTER] FETCH FAILED:", {
      message: error.message,
      cause: error.cause,
    });
    throw error;
  }

  // ================= TABS =================
  const tabsUrl = `https://cp.haliotis.space/api/v1/diving-centers/tabs/${center.id}`;

  let tabs: any;

  try {
    console.log("[TABS] Fetching:", tabsUrl);

    const tabsRes = await fetch(tabsUrl, {
      headers: { Accept: "application/json" },
      next: { revalidate: 3600 },
    });

    console.log("[TABS] Status:", tabsRes.status);

    const tabsJson = await tabsRes.json();
    console.log("[TABS] FULL RESPONSE:", tabsJson);

    if (!tabsRes.ok || !tabsJson?.data) {
      console.error("[TABS] INVALID DATA:", tabsJson);
      tabs = []; // 👉 не падаем, просто пусто
    } else {
      tabs = tabsJson.data;
    }
  } catch (error: any) {
    console.error("[TABS] FETCH FAILED:", {
      message: error.message,
      cause: error.cause,
    });

    tabs = []; // 👉 fallback
  }

  // ================= DEBUG =================
  console.log("[FINAL DATA]", {
    centerId: center?.id,
    tabsCount: tabs?.length,
  });

  // ================= RENDER =================
  return <PenichePage center={center} tabs={tabs} />;
}