// lib/cart.ts
export const CART_UPDATED_EVENT = "cart-updated";

export type CartStorageItem = {
  type: "course" | "trip" | "travels";
  id: number | string;
  location?: string;
  price?: number;
  currency?: string;
};

export const readCartFromStorage = (): CartStorageItem[] => {
  try {
    const raw = localStorage.getItem("cart");
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

export const writeCartToStorage = (items: CartStorageItem[]) => {
  try {
    localStorage.setItem("cart", JSON.stringify(items));
    // сповіщаємо всі компоненти (включно з хедером) в межах тієї ж вкладки
    window.dispatchEvent(new Event(CART_UPDATED_EVENT));
  } catch {
    // ignore
  }
};

export const addItemToCart = (item: CartStorageItem) => {
  const cart = readCartFromStorage();
  const exists = cart.some((c) => c.type === item.type && c.id === item.id);
  if (!exists) {
    writeCartToStorage([...cart, item]);
  }
};

export const removeItemFromCart = (type: string, id: number | string) => {
  const cart = readCartFromStorage();
  writeCartToStorage(cart.filter((c) => !(c.type === type && c.id === id)));
};