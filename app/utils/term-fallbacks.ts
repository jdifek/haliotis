/**
 * Fallback значения для всех терминов
 * Используются когда термин не приходит из API
 */

export const TERM_FALLBACKS = {
  // Основные действия
  book_now: "Book Now",
  more_info: "More Info",
  show_more: "Show More",
  find_more: "Find More",
  contact_us: "Contact Us",
  
  // Навигация
  prev: "PREV",
  next: "NEXT",
  show_on_map: "Show on Map",
  
  // Категории и фильтры
  categories: "Categories",
  all_categories: "All Categories",
  all: "All",
  
  // Курсы
  show_more_courses: "Show more courses",
  show_more_dives: "Show more dives",
  padi_advanced_open_water_diver: "PADI Advanced Open Water Diver",
  padi_underwater_naturalist_sesimbra: "PADI Underwater Naturalist Sesimbra",
  padi_owd: "PADI OWD",
  
  // Характеристики дайв-сайтов
  fishes: "Fishes",
  difficulty: "Difficulty",
  maximum_depth: "Maximum Depth",
  meters: "meters",
  
  // Бронирование и цены
  booking_form: "Booking Form",
  total_price: "Total price",
  calculate_price: "Calculate Price",
  respiratory_blends: "Respiratory Blends",
  
  // Футер и юридическая информация
  information_legal: "Information Legal",
  meios_de_pagamento: "Meios de Pagamento",
  parceiros: "Parceiros",
  
  // Магазин
  visit_our_online_shop: "Visit our Online Shop",
  
  // Прочее
  reviews: "reviews",
  make_sure_you_are_on_the_right_place: "Make sure you are on the right place",
  description: "Description",
} as const;

export type TermKey = keyof typeof TERM_FALLBACKS;

/**
 * Получить fallback значение для термина
 */
export function getTermFallback(key: string): string {
  return TERM_FALLBACKS[key as TermKey] || key;
}