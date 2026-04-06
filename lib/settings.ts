// lib/settings.ts

type Settings = {
  general: {
    site_name: string;
    logo_alt: string;
    logo: string;
  };
  google: {
    analytics_id: string;
    tag_manager_key: string;
  };
};

let _cache: Settings | null = null;

export async function getSettings(): Promise<Settings> {
  if (_cache) return _cache;

  const res = await fetch('https://cp.haliotis.space/api/v1/settings/public', {
    next: { revalidate: 3600 }, // кэш на 1 час
  });
  const json = await res.json();
  _cache = json.data;
  return _cache!;
}