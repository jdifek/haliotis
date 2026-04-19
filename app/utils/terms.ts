import { Terms } from "../hooks/useMenu";
import { getTermFallback } from "./term-fallbacks";

/**
 * Получить термин из объекта terms с fallback на дефолтное значение
 * @param terms - объект с терминами из API
 * @param key - ключ термина
 * @param fallback - значение по умолчанию, если термин не найден (опционально)
 *                   Если не указано, используется значение из TERM_FALLBACKS
 * @returns строку термина
 */
export function getTerm(
  terms: Terms | undefined | null,
  key: string,
  fallback?: string
): string {
  if (!terms) return fallback ?? getTermFallback(key);
  return terms[key] ?? fallback ?? getTermFallback(key);
}

/**
 * Создать функцию для получения термина с предустановленными terms
 * Удобно использовать в компонентах
 * 
 * @example
 * const t = createTermGetter(terms);
 * <button>{t("book_now")}</button> // автоматически использует fallback "Book Now"
 * <button>{t("custom_key", "Custom Fallback")}</button> // кастомный fallback
 */
export function createTermGetter(terms: Terms | undefined | null) {
  return (key: string, fallback?: string) => getTerm(terms, key, fallback);
}

