/* eslint-disable react-hooks/set-state-in-effect */
/**
 * useMenu — глобальный кэш меню
 * Один fetch на всё приложение. Header, Footer, Tabs — все берут отсюда.
 * Кэш живёт на уровне модуля, сброс при смене locale.
 */

import { useState, useEffect } from "react";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type Language = {
  prefix: string;
  label: string;
  default: boolean;
  icon: string;
};

export type MenuItem = {
  id: number;
  label: string;
  new_tab: boolean;
  menu_layout: string;
  img_url?: string;
  link_type: string;
  url?: string;
  slug?: string;
  children?: MenuItem[];
};

export type DivingCenter = {
  id: number;
  name: string;
  slug: string;
  color: string;
  position: number;
  center_icon_url?: string;
  contact_tripadvisor?: string;
  contact_facebook?: string;
  contact_youtube?: string;
};

export type MenuData = {
  data: {
    main: MenuItem[];
    footer: MenuItem[];
    bottom: MenuItem[];
  };
  diving_centers: DivingCenter[];
};

// ---------------------------------------------------------------------------
// Module-level cache
// ---------------------------------------------------------------------------

const _cache: Record<string, MenuData> = {};
const _promises: Record<string, Promise<MenuData>> = {};

async function fetchMenuData(locale: string): Promise<MenuData> {
  if (_cache[locale]) return Promise.resolve(_cache[locale]);
  if (await _promises[locale]) return _promises[locale];

  _promises[locale] = fetch(
    `https://cp.haliotis.space/api/v1/configs/menus?lang=${locale}`,
    { headers: { Accept: "application/json" } }
  )
    .then((res) => {
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return res.json() as Promise<MenuData>;
    })
    .then((data) => {
      _cache[locale] = data;
      return data;
    });

  return _promises[locale];
}

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

interface UseMenuResult {
  menuData: MenuData | null;
  divingCenters: DivingCenter[];
  /** slug → color, для быстрого доступа в Tabs */
  colorBySlug: Record<string, string>;
  loading: boolean;
  error: string | null;
}

export function useMenu(locale: string): UseMenuResult {
  const [menuData, setMenuData] = useState<MenuData | null>(_cache[locale] ?? null);
  const [loading, setLoading] = useState(!_cache[locale]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log(`useMenu: Fetching menu data for locale "${locale}"`);
    if (_cache[locale]) {
      console.log(`useMenu: Cache hit for locale "${locale}"`);
      setMenuData(_cache[locale]);
      setLoading(false);
      return;
    }

    let cancelled = false;

    fetchMenuData(locale)
      .then((data) => {
        if (!cancelled) {
          console.log(`useMenu: Successfully fetched menu data for locale "${locale}"`);
          setMenuData(data);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          console.error(`useMenu: Error fetching menu data for locale "${locale}":`, err);
          setError(err.message ?? "Unknown error");
          setLoading(false);
        }
      });

    return () => {
      console.log(`useMenu: Cleanup for locale "${locale}"`);
      cancelled = true;
    };
  }, [locale]);

  const divingCenters = (menuData?.diving_centers ?? []).sort(
    (a, b) => a.position - b.position
  );

  const colorBySlug = Object.fromEntries(
    divingCenters.map((c) => [c.slug, c.color])
  );

  console.log(`useMenu: Returning data for locale "${locale}"`, {
    menuData,
    divingCenters,
    colorBySlug,
    loading,
    error,
  });

  return { menuData, divingCenters, colorBySlug, loading, error };
}