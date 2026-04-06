/* eslint-disable react-hooks/set-state-in-effect */
// app/hooks/usePrices.ts
"use client";
import { useState, useEffect } from "react";

type PricesService = {
  id: number;
  name: string;
  description: string | null;
  position: number;
  is_active: boolean;
  service_category_id: number;
  price: string;
};

type PricesServiceType = {
  id: number;
  name: string;
  position: number;
};

type PricesCategory = {
  id: number;
  name: string;
  position: number;
  service_type_id: number;
};

type PricesPage = {
  specialized_maintenance: { title: string; description: string };
  fills: { title: string; description: string };
};

export type PricesData = {
  page: PricesPage;
  services: PricesService[];
  service_types: PricesServiceType[];
  categories: PricesCategory[];
};

async function fetchPrices(centerId: number, lang: string): Promise<PricesData> {
  const res = await fetch(
    `https://cp.haliotis.space/api/v1/diving-centers/${centerId}/prices?lang=${lang}`,
    { headers: { Accept: "application/json" } }
  );
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const json = await res.json();
  return json.data;
}

export function usePrices(centerId: number | null, lang: string) {
  const [data, setData] = useState<PricesData | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!centerId) return;
    setLoading(true);
    fetchPrices(centerId, lang)
      .then(setData)
      .finally(() => setLoading(false));
  }, [centerId, lang]);

  return { data, loading };
}