/* eslint-disable @typescript-eslint/no-explicit-any */
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


type PricesCategory = {
  id: number;
  name: string;
  position: number;
  service_type_id: number;
};

type PricesServiceType = {
  id: number;
  name: string;
  description: string;
  position: number;
  display_type: "information" | "calculator";
};

export type PricesData = {
  page: {
    banner: any
    title: string
    specialized_maintenance: { title: string; description: string };
    fills: { title: string; description: string };
  };
  services: PricesService[];
  service_types: PricesServiceType[];
  categories: PricesCategory[];
  calculator_labels: {
    respiratory_blends: string;
    calculate_price: string;
    total_price: string;
  };
  center_icon_url: string;
};

async function fetchPrices(centerId: number, lang: string): Promise<PricesData> {
  const res = await fetch(
    `https://cp.haliotis.space/api/v1/diving-centers/${centerId}/prices?lang=${lang}`,
    { headers: { Accept: "application/json" } }
  );
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const json = await res.json();
  console.log(json, 'json');
  
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