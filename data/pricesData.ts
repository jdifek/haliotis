export type PriceItem = {
  label: string;
  price: string;
  description?: string;
};

export type PriceCategory = {
  id: string;
  label: string;
  items: PriceItem[];
};

// ─────────────────────────────────────────
// PENICHE
// ─────────────────────────────────────────
const peniacheCategories: PriceCategory[] = [
  {
    id: "dive-trips",
    label: "Dive Trips",
    items: [
      { label: "Single Dive Trip", price: "45€" },
      { label: "Double Dive Trip", price: "80€", description: "2 dives, 12L air tanks, weights, boat trip, guide, insurance, water and snack between dives." },
      { label: "Night Dive", price: "55€" },
      { label: "Guided Shore Dive", price: "35€" },
    ],
  },
  {
    id: "equipment-rental-diving",
    label: "Equipment Rental in Diving Activities",
    items: [
      { label: "Mask, snorkel and fins", price: "10€" },
      { label: "Wetsuit, boots and hood", price: "15€" },
      { label: "BCD", price: "15€" },
      { label: "Regulator", price: "15€" },
      { label: "Full Equipment for Double Dive Trip", price: "40€" },
      { label: "Full Equipment for Single Dive Trip", price: "35€" },
      { label: "Dive Computer", price: "10€" },
      { label: "Dive Light", price: "10€" },
    ],
  },
  {
    id: "freedive-trips",
    label: "Freedive Trips",
    items: [
      { label: "Single Freedive Session", price: "40€" },
      { label: "Double Freedive Session", price: "70€" },
    ],
  },
  {
    id: "equipment-rental-freedive",
    label: "Equipment Rental for Freedive",
    items: [
      { label: "Mask and snorkel", price: "5€" },
      { label: "Freedive fins", price: "10€" },
      { label: "Wetsuit", price: "10€" },
    ],
  },
  {
    id: "snorkeling",
    label: "Snorkeling",
    items: [
      { label: "Snorkeling Trip", price: "30€" },
      { label: "Snorkeling Equipment", price: "8€" },
    ],
  },
  {
    id: "equipment-rental-off",
    label: "Equipment Rental Off Our Activities",
    items: [
      { label: "Full Equipment", price: "50€" },
      { label: "BCD only", price: "20€" },
    ],
  },
  {
    id: "upgrades",
    label: "Upgrades",
    items: [
      { label: "Nitrox", price: "10€" },
      { label: "15L tank", price: "8€" },
    ],
  },
  {
    id: "fillings",
    label: "Fillings",
    items: [
      { label: "Air filling", price: "6€" },
      { label: "Nitrox filling", price: "12€" },
    ],
  },
];

// ─────────────────────────────────────────
// SESIMBRA — замени цены на реальные
// ─────────────────────────────────────────
const sesimbraCategories: PriceCategory[] = [
  {
    id: "dive-trips",
    label: "Dive Trips",
    items: [
      { label: "Single Dive Trip", price: "50€" },
      { label: "Double Dive Trip", price: "90€", description: "2 dives, 12L air tanks, weights, boat trip, guide, insurance, water and snack between dives." },
      { label: "Night Dive", price: "60€" },
      { label: "Guided Shore Dive", price: "40€" },
    ],
  },
  {
    id: "equipment-rental-diving",
    label: "Equipment Rental in Diving Activities",
    items: [
      { label: "Mask, snorkel and fins", price: "12€" },
      { label: "Wetsuit, boots and hood", price: "18€" },
      { label: "BCD", price: "18€" },
      { label: "Regulator", price: "18€" },
      { label: "Full Equipment for Double Dive Trip", price: "45€" },
      { label: "Full Equipment for Single Dive Trip", price: "40€" },
      { label: "Dive Computer", price: "12€" },
      { label: "Dive Light", price: "12€" },
    ],
  },
  {
    id: "snorkeling",
    label: "Snorkeling",
    items: [
      { label: "Snorkeling Trip", price: "35€" },
      { label: "Snorkeling Equipment", price: "10€" },
    ],
  },
  {
    id: "upgrades",
    label: "Upgrades",
    items: [
      { label: "Nitrox", price: "12€" },
      { label: "15L tank", price: "10€" },
    ],
  },
];

// ─────────────────────────────────────────
// MADEIRA — замени цены на реальные
// ─────────────────────────────────────────
const madeiraCategories: PriceCategory[] = [
  {
    id: "dive-trips",
    label: "Dive Trips",
    items: [
      { label: "Single Dive Trip", price: "55€" },
      { label: "Double Dive Trip", price: "95€", description: "2 dives, 12L air tanks, weights, boat trip, guide, insurance, water and snack between dives." },
      { label: "Night Dive", price: "65€" },
    ],
  },
  {
    id: "equipment-rental-diving",
    label: "Equipment Rental in Diving Activities",
    items: [
      { label: "Mask, snorkel and fins", price: "12€" },
      { label: "Wetsuit, boots and hood", price: "20€" },
      { label: "BCD", price: "20€" },
      { label: "Regulator", price: "20€" },
      { label: "Full Equipment", price: "50€" },
      { label: "Dive Computer", price: "15€" },
    ],
  },
  {
    id: "snorkeling",
    label: "Snorkeling",
    items: [
      { label: "Snorkeling Trip", price: "40€" },
      { label: "Snorkeling Equipment", price: "10€" },
    ],
  },
];

// ─────────────────────────────────────────
// SANTA MARIA — замени цены на реальные
// ─────────────────────────────────────────
const santaMariaCategories: PriceCategory[] = [
  {
    id: "dive-trips",
    label: "Dive Trips",
    items: [
      { label: "Single Dive Trip", price: "50€" },
      { label: "Double Dive Trip", price: "85€", description: "2 dives, 12L air tanks, weights, boat trip, guide, insurance, water and snack between dives." },
      { label: "Night Dive", price: "60€" },
    ],
  },
  {
    id: "equipment-rental-diving",
    label: "Equipment Rental in Diving Activities",
    items: [
      { label: "Mask, snorkel and fins", price: "10€" },
      { label: "Wetsuit, boots and hood", price: "15€" },
      { label: "BCD", price: "15€" },
      { label: "Full Equipment", price: "40€" },
    ],
  },
  {
    id: "freedive-trips",
    label: "Freedive Trips",
    items: [
      { label: "Single Freedive Session", price: "45€" },
      { label: "Double Freedive Session", price: "75€" },
    ],
  },
  {
    id: "snorkeling",
    label: "Snorkeling",
    items: [
      { label: "Snorkeling Trip", price: "32€" },
      { label: "Snorkeling Equipment", price: "8€" },
    ],
  },
];

// ─────────────────────────────────────────
// FAIAL — замени цены на реальные
// ─────────────────────────────────────────
const faialCategories: PriceCategory[] = [
  {
    id: "dive-trips",
    label: "Dive Trips",
    items: [
      { label: "Single Dive Trip", price: "50€" },
      { label: "Double Dive Trip", price: "88€", description: "2 dives, 12L air tanks, weights, boat trip, guide, insurance, water and snack between dives." },
      { label: "Night Dive", price: "58€" },
    ],
  },
  {
    id: "equipment-rental-diving",
    label: "Equipment Rental in Diving Activities",
    items: [
      { label: "Mask, snorkel and fins", price: "10€" },
      { label: "Wetsuit, boots and hood", price: "15€" },
      { label: "Full Equipment", price: "42€" },
    ],
  },
  {
    id: "freedive-trips",
    label: "Freedive Trips",
    items: [
      { label: "Single Freedive Session", price: "42€" },
    ],
  },
  {
    id: "upgrades",
    label: "Upgrades",
    items: [
      { label: "Nitrox", price: "10€" },
    ],
  },
];

// ─────────────────────────────────────────
// SAO VICENTE — замени цены на реальные
// ─────────────────────────────────────────
const saoVicenteCategories: PriceCategory[] = [
  {
    id: "dive-trips",
    label: "Dive Trips",
    items: [
      { label: "Single Dive Trip", price: "48€" },
      { label: "Double Dive Trip", price: "85€", description: "2 dives, 12L air tanks, weights, boat trip, guide, insurance, water and snack between dives." },
      { label: "Night Dive", price: "55€" },
    ],
  },
  {
    id: "equipment-rental-diving",
    label: "Equipment Rental in Diving Activities",
    items: [
      { label: "Mask, snorkel and fins", price: "10€" },
      { label: "Wetsuit, boots and hood", price: "15€" },
      { label: "Full Equipment", price: "38€" },
    ],
  },
  {
    id: "snorkeling",
    label: "Snorkeling",
    items: [
      { label: "Snorkeling Trip", price: "28€" },
      { label: "Snorkeling Equipment", price: "8€" },
    ],
  },
];

// ─────────────────────────────────────────
// EXPORT
// ─────────────────────────────────────────
export const TAB_CATEGORIES: Record<string, PriceCategory[]> = {
  peniche: peniacheCategories,
  sesimbra: sesimbraCategories,
  madeira: madeiraCategories,
  "santa-maria": santaMariaCategories,
  faial: faialCategories,
  "sao-vicente": saoVicenteCategories,
};

// ─────────────────────────────────────────
// MAINTENANCE DATA PER TAB
// Замени цены на реальные для каждой локации
// ─────────────────────────────────────────

const maintenanceBase: PriceCategory[] = [
  {
    id: "regulators",
    label: "Regulators",
    items: [
      { label: "1st Stage Service", price: "60€" },
      { label: "2nd Stage Service", price: "40€" },
      { label: "Full Regulator Service", price: "90€" },
      { label: "Octopus Service", price: "35€" },
    ],
  },
  {
    id: "oxygen-service",
    label: "Oxygen Service",
    items: [
      { label: "O2 Clean 1st Stage", price: "70€" },
      { label: "O2 Clean 2nd Stage", price: "50€" },
      { label: "Full O2 Service", price: "110€" },
    ],
  },
  {
    id: "dry-suits",
    label: "Dry Suits",
    items: [
      { label: "Dry Suit Service", price: "80€" },
      { label: "Zipper Wax", price: "10€" },
      { label: "Seal Replacement", price: "50€" },
    ],
  },
  {
    id: "tanks",
    label: "Tanks",
    items: [
      { label: "Tank Visual Inspection", price: "25€" },
      { label: "Tank Hydro Test", price: "60€" },
      { label: "Valve Service", price: "30€" },
    ],
  },
];

export const TAB_MAINTENANCE_CATEGORIES: Record<string, PriceCategory[]> = {
  peniche: maintenanceBase,
  sesimbra: maintenanceBase,   // 👈 замени на реальные данные Sesimbra
  madeira: maintenanceBase,    // 👈 замени на реальные данные Madeira
  "santa-maria": maintenanceBase,
  faial: maintenanceBase,
  "sao-vicente": maintenanceBase,
};