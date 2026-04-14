// lib/api/travels.ts
export async function getTravelBySlug(slug: string, locale: string) {
  const res = await fetch(
    `https://cp.haliotis.space/api/v1/travels/${slug}?lang=${locale}`,
    { next: { revalidate: 60 } }
  );
  if (!res.ok) throw new Error('Failed to fetch travel');
  return res.json();
}