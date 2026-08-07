// lib/settings.ts

type Settings = {
  general: {
    site_name: string;
    footer_logo: string;
    logo_alt: string;
    logo: string;
  };
  google: {
    analytics_id: string;
    tag_manager_key: string;
    google_recaptcha_key: string;
  };
};

let _cache: Settings | null = null;

export async function getSettings(): Promise<Settings> {
  if (_cache) return _cache;

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/settings/public`, {

  });
  const json = await res.json();
  
  _cache = json.data;
  return _cache!;
}