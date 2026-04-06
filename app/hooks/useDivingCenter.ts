/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from 'react';

type DivingCenterData = {
  id: number;
  center_name: string;
  slug: string;
  small_description: string | null;
  description: string | null;
  color: string | null;
  center_icon_url: string | null;
  center_image_url: string | null;
  contact_tripadvisor: string | null;
  contact_facebook: string | null;
  contact_youtube: string | null;
  contact_phone: string | null;
  contact_fax: string | null;
  contact_address: string | null;
  latitude: string | null;
  longitude: string | null;
  gallery: Array<{
    id: string;
    image: string;
    position: string;
  }> | null;
  seo: {
    meta_description: string;
    meta_keywords: string;
  } | null;
  sliders: any[];
  partners: Array<{
    id: number;
    image_url: string;
    title: string;
    description: string;
    url: string;
    position: number;
  }>;
  legal_supports: Array<{
    id: number;
    name: string;
    images: string;
  }>;
  payment_methods: Array<{
    id: number;
    name: string;
    images: string;
  }>;
};

export function useDivingCenter(slug: string | null, locale: string) {
  const [data, setData] = useState<DivingCenterData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) return;

    const fetchCenter = async () => {
      setLoading(true);
      setError(null);

      try {
        const url = new URL(`https://cp.haliotis.space/api/v1/diving-centers/${slug}`);
        url.searchParams.set('lang', locale.substring(0, 2));

        const res = await fetch(url.toString(), {
          headers: { Accept: 'application/json' },
        });

        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = await res.json();
        setData(json.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchCenter();
  }, [slug, locale]);

  return { data, loading, error };
}