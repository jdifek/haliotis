// app/utils/getMenu.ts
import type { MenuData, DivingCenter, Terms } from "@/app/hooks/useMenu";

export async function getMenu(locale: string) {
  const baseUrl = process.env.API_URL ?? process.env.NEXT_PUBLIC_API_URL;
  const url = `${baseUrl}/configs/menus?lang=${locale}`;

  const res = await fetch(url, {
    headers: { Accept: "application/json" },
    next: { revalidate: 300 },
  });

  if (!res.ok) throw new Error(`Menu fetch failed: HTTP ${res.status}`);

  const menuData: MenuData = await res.json();

  const divingCenters = [...(menuData.diving_centers ?? [])].sort(
    (a, b) => a.position - b.position
  );

  const colorBySlug = Object.fromEntries(
    divingCenters.map((c) => [c.slug, c.color])
  );

  const terms = menuData.terms ?? {};

  return { menuData, divingCenters, colorBySlug, terms };
}