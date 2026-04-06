const BASE_URL = "https://cp.haliotis.space/api/v1";

export async function getMenuWithCenters() {
  const res = await fetch(`${BASE_URL}/configs/menus`, {
    headers: { Accept: "application/json" },
    next: { revalidate: 60 }, // ISR кэш 60 сек (Next.js App Router)
  });
  if (!res.ok) throw new Error("Failed to fetch menu");
  return res.json();
}

export async function getFreediveData(divingCenterId: number | string, lang = "en", page = 1) {
  const res = await fetch(
    `${BASE_URL}/diving-centers/${divingCenterId}/freedive?lang=${lang}&page=${page}`,
    {
      headers: { Accept: "application/json" },
      next: { revalidate: 60 },
    }
  );
  if (!res.ok) throw new Error("Failed to fetch freedive data");
  return res.json();
}