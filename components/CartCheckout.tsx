/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import {
  createBooking,
  loadSibsWidgetScript,
  type SibsPaymentInfo,
} from "@/lib/payment";

type CartLocalItem = {
  type: "course" | "trip" | "travels";
  id: number | string;
  title?: string;
  price?: number;
  currency?: string;
  image?: string;
};

// TODO: замени на реальную форму букинга (имя/email/телефон/дата и т.п.),
// если бэкенд их требует в теле POST /api/v1/bookings.
function buildBookingPayload(cartItems: CartLocalItem[]) {
  return {
    items: cartItems.map((item) => ({
      type: item.type,
      id: item.id,
    })),
  };
}

export const CartCheckout: React.FC<{
  cartItems: CartLocalItem[];
  cartTotal: number;
  cartCurrency: string;
  locale: string;
}> = ({ cartItems, cartTotal, cartCurrency, locale }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [payment, setPayment] = useState<SibsPaymentInfo | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [widgetReady, setWidgetReady] = useState(false);

  const handleCheckout = async () => {
    if (cartItems.length === 0 || isSubmitting) return;
    setIsSubmitting(true);
    setError(null);

    try {
      const res = await createBooking(buildBookingPayload(cartItems));
      setPayment(res.data.payment);
    } catch (e: any) {
      setError(e?.message || "Something went wrong while creating the booking.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Форма с payment.form_context уже должна быть в DOM (см. рендер ниже) до подключения
  // скрипта виджета — поэтому грузим скрипт в эффекте, который сработает уже после рендера.
  useEffect(() => {
    if (!payment) return;
    setWidgetReady(false);
    loadSibsWidgetScript(payment.widget_script_url)
      .then(() => setWidgetReady(true))
      .catch((e) => setError(e?.message || "Failed to load payment widget."));
  }, [payment]);

  if (payment) {
    const spgConfig = {
      paymentMethodList: payment.payment_methods,
      amount: { value: payment.amount.value, currency: payment.amount.currency },
      language: locale === "pt" ? "pt" : "en",
      redirectUrl: `${window.location.origin}/${locale}/payment/redirect`,
    };

    return (
      <div className="flex flex-col gap-3">
        {!widgetReady && (
          <div className="flex items-center gap-2 text-[14px] text-[#cfcfcf]">
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/20 border-t-white" />
            Loading payment methods…
          </div>
        )}
        {/* eslint-disable-next-line react/no-unknown-property */}
        <form
          className="paymentSPG"
          spg-context={payment.form_context}
          spg-config={JSON.stringify(spgConfig)}
        />
        {error && <p className="text-[13px] text-[#e84814]">{error}</p>}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      <button
        onClick={handleCheckout}
        disabled={cartItems.length === 0 || isSubmitting}
        style={{
          borderRadius: 1000,
          padding: "2px 16px",
          width: 226,
          height: 48,
          background: isSubmitting ? "#a83a10" : "#e84814",
          fontFamily: "var(--font-family)",
          fontWeight: 700,
          fontSize: 15,
          lineHeight: "120%",
          color: "#fff",
          cursor: cartItems.length === 0 || isSubmitting ? "not-allowed" : "pointer",
          opacity: cartItems.length === 0 ? 0.5 : 1,
        }}
      >
        {isSubmitting ? "Processing…" : "Checkout"}
      </button>
      {error && <p className="text-[13px] text-[#e84814]">{error}</p>}
    </div>
  );
};

export default CartCheckout;