// lib/api/travels.ts
export async function getTravelBySlug(slug: string, locale: string) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/travels/${slug}?lang=${locale}`,
    { next: { revalidate: 60 } }
  );
  if (!res.ok) throw new Error('Failed to fetch travel');
  return res.json();
}