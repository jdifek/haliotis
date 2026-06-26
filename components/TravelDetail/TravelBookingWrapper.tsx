"use client";

import { useState } from "react";
import { CourseDetailHeroSection } from "./CourseDetailHeroSection";
import { BookingFormModal } from "@/components/Modals/BookingFormModal";

// ─── Cart util ────────────────────────────────────────────────────────────────
const addTravelToCart = (id: number | string) => {
  try {
    const raw = localStorage.getItem("cart");
    const cart: Array<{ type: string; id: number | string }> =
      raw ? JSON.parse(raw) : [];

    const exists = cart.some((item) => item.type === "travels" && item.id === id);
    if (!exists) {
      cart.push({ type: "travels", id });
      localStorage.setItem("cart", JSON.stringify(cart));
    }
  } catch {
    // ignore localStorage errors
  }
};

// ─── Types ────────────────────────────────────────────────────────────────────
type Props = React.ComponentProps<typeof CourseDetailHeroSection> & {
  travelId: number | string;
  pricePerPerson: number;
  currency: string;
};

// ─── Component ────────────────────────────────────────────────────────────────
export function TravelBookingWrapper({ travelId, pricePerPerson, currency, ...heroProps }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);

  const handleAddToCart = () => {
    addTravelToCart(travelId);
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  return (
    <>
      <CourseDetailHeroSection
        currency={currency}
        {...heroProps}
        onBookClick={() => setIsOpen(true)}
        onAddToCart={handleAddToCart}
        addedToCart={addedToCart}
      />
      <BookingFormModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        courseTitle={heroProps.title}
        pricePerPerson={pricePerPerson}
      />
    </>
  );
}