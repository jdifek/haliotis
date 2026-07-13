"use client";

import { useCallback, useEffect, useState } from "react";

// ─── Cart logic (та же логика/ключ/событие, что и в CourseDetailHeroSection) ──

export type CartItemType = "course" | "trip";

type StoredCartItem = {
  type: string;
  id: number | string;
  location?: string;
  title?: string;
  price?: number;
  currency?: string;
  image?: string;
};

const CART_KEY = "cart";
const CART_EVENT = "cart-updated";

const readCart = (): StoredCartItem[] => {
  try {
    const raw = localStorage.getItem(CART_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const sameItem = (item: StoredCartItem, type: CartItemType, id: number | string) =>
  item.type === type && String(item.id) === String(id);

const isInCart = (type: CartItemType, id: number | string): boolean =>
  readCart().some((i) => sameItem(i, type, id));

const addToCart = (
  type: CartItemType,
  id: number | string,
  data: {
    location?: string;
    title?: string;
    price?: number;
    currency?: string;
    image?: string;
  }
) => {
  try {
    const cart = readCart();
    const exists = cart.some((i) => sameItem(i, type, id));
    if (!exists) {
      cart.push({
        type,
        id,
        ...(data.location ? { location: data.location } : {}),
        ...(data.title ? { title: data.title } : {}),
        ...(data.price !== undefined ? { price: data.price } : {}),
        ...(data.currency ? { currency: data.currency } : {}),
        ...(data.image ? { image: data.image } : {}),
      });
      localStorage.setItem(CART_KEY, JSON.stringify(cart));
      window.dispatchEvent(new Event(CART_EVENT));
    }
  } catch {
    // ignore localStorage errors
  }
};

const removeFromCart = (type: CartItemType, id: number | string) => {
  try {
    const cart = readCart().filter((i) => !sameItem(i, type, id));
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
    window.dispatchEvent(new Event(CART_EVENT));
  } catch {
    // ignore localStorage errors
  }
};

// ─── Component ─────────────────────────────────────────────────────────────

type AddToCartButtonProps = {
  itemType: CartItemType;
  id: number | string;
  location?: string;
  title?: string;
  price?: number;
  currency?: string;
  image?: string;
  className?: string;
};

export const AddToCartButton: React.FC<AddToCartButtonProps> = ({
  itemType,
  id,
  location,
  title,
  price,
  currency,
  image,
  className = "",
}) => {
  const [added, setAdded] = useState(false);

  const sync = useCallback(() => {
    setAdded(isInCart(itemType, id));
  }, [itemType, id]);

  useEffect(() => {
    sync();
    window.addEventListener(CART_EVENT, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(CART_EVENT, sync);
      window.removeEventListener("storage", sync);
    };
  }, [sync]);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isInCart(itemType, id)) {
      removeFromCart(itemType, id);
      setAdded(false);
    } else {
      addToCart(itemType, id, { location, title, price, currency, image });
      setAdded(true);
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-pressed={added}
      aria-label={added ? "Remove from cart" : "Add to cart"}
      className={`relative flex h-8 w-8 md:h-11 md:w-[52px] items-center justify-center rounded-lg cursor-pointer transition-colors ${
        added ? "bg-[#e84814]" : "bg-white"
      } ${className}`}
    >
      <svg
        className="h-[15px] w-[15px] md:h-6 md:w-6"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M6 2L3 6V20C3 20.5304 3.21071 21.0391 3.58579 21.4142C3.96086 21.7893 4.46957 22 5 22H19C19.5304 22 20.0391 21.7893 20.4142 21.4142C20.7893 21.0391 21 20.5304 21 20V6L18 2H6Z"
          stroke={added ? "white" : "#E84814"}
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M3 6H21"
          stroke={added ? "white" : "#E84814"}
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M16 10C16 11.0609 15.5786 12.0783 14.8284 12.8284C14.0783 13.5786 13.0609 14 12 14C10.9391 14 9.92172 13.5786 9.17157 12.8284C8.42143 12.0783 8 11.0609 8 10"
          stroke={added ? "white" : "#E84814"}
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>

      {added && (
        <span className="absolute -right-1 -top-1 md:-right-1.5 md:-top-1.5 flex h-[13px] w-[13px] md:h-[18px] md:w-[18px] items-center justify-center rounded-full bg-white shadow-sm">
          <svg
            className="h-[7px] w-[7px] md:h-[11px] md:w-[11px]"
            viewBox="0 0 11 11"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M11 5.5C11 8.53754 8.53754 11 5.5 11C2.46243 11 0 8.53754 0 5.5C0 2.46243 2.46243 0 5.5 0C8.53754 0 11 2.46243 11 5.5ZM7.71667 3.83332C7.87776 3.99441 7.87776 4.25559 7.71667 4.41667L4.96667 7.16667C4.80557 7.32776 4.54443 7.32776 4.38332 7.16667L3.28332 6.06667C3.12223 5.90557 3.12223 5.64443 3.28332 5.48334C3.44441 5.32224 3.70559 5.32224 3.86668 5.48334L4.675 6.29162L5.90414 5.06248L7.13334 3.83332C7.29443 3.67223 7.55557 3.67223 7.71667 3.83332Z"
              fill="#E84814"
            />
          </svg>
        </span>
      )}
    </button>
  );
};