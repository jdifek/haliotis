/* eslint-disable @typescript-eslint/no-explicit-any */
// lib/payment.ts
// Общие хелперы для запуска оплаты SIBS. Ничего не рендерят — только сеть/скрипт.

export type SibsPaymentInfo = {
  payment_id: number;
  checkout_token: string;
  transaction_id: string;
  form_context: string;
  amount: { value: number; currency: string };
  widget_script_url: string;
  payment_methods: string[];
};

export type CreateBookingResponse = {
  data: {
    order_id?: number;
    payment: SibsPaymentInfo;
    [key: string]: any;
  };
};

/**
 * POST /api/v1/bookings — отправляет букинг-форму, в ответ получает данные для оплаты.
 * payload — сформируй его из содержимого корзины + данных клиента (см. buildBookingPayload
 * в CartCheckout.tsx как отправную точку, реальный контракт уточни у бэкенда).
 */
export async function createBooking(payload: unknown): Promise<CreateBookingResponse> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/bookings`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const body = await res.json().catch(() => null);
    throw new Error(body?.message || `Booking request failed (${res.status})`);
  }

  return res.json();
}

/**
 * GET /api/v1/payments/sibs/{transactionId}/status
 * Используется на странице-приёмнике редиректа (payment/redirect), чтобы один раз
 * узнать финальный (на момент редиректа) статус и решить, куда роутить пользователя.
 */
export type SibsStatusResponse = {
  order_id: number | null;
  payment_id: number | null;
  transaction_id: string | null;
  payment_status: "Success" | "Pending" | "Declined" | "Timeout" | "Partial" | "In Processing" | string | null;
  payment_method: "CARD" | "REFERENCE" | "MBWAY" | string | null;
  amount: { value: number; currency: string } | null;
  payment_reference: {
    entity?: string;
    reference?: string;
    expire_date?: string;
    [key: string]: any;
  } | null;
  order_status: string | null;
  amount_due: number | null;
  return_status: { status_code: string | null; ok: boolean };
  raw: any;
};
export async function getSibsStatus(transactionId: string): Promise<SibsStatusResponse> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/payments/sibs/${transactionId}/status`,
    { headers: { Accept: "application/json" }, cache: "no-store" }
  );
  if (!res.ok) {
    const body = await res.json().catch(() => null);
    throw new Error(body?.message || `Status request failed (${res.status})`);
  }
  return res.json();
}

// Кэшируем промис загрузки скрипта — виджет должен подключаться на страницу один раз.
let sibsScriptPromise: Promise<void> | null = null;

/**
 * Динамически подключает <script src="{widget_script_url}">.
 * ВАЖНО: вызывай это ПОСЛЕ того, как <form class="paymentSPG" ...> уже в DOM —
 * судя по документации SIBS, виджет ищет форму на странице при загрузке скрипта.
 * Если у SIBS есть отдельный метод реинициализации (например window.SIBS.init()),
 * уточни в их доке/саппорте и вызови его вместо повторной загрузки скрипта.
 */
export function loadSibsWidgetScript(url: string): Promise<void> {
  if (sibsScriptPromise) return sibsScriptPromise;

  sibsScriptPromise = new Promise((resolve, reject) => {
    if (document.querySelector(`script[src="${url}"]`)) {
      resolve();
      return;
    }
    const script = document.createElement("script");
    script.src = url;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => {
      sibsScriptPromise = null;
      reject(new Error("Failed to load SIBS widget script"));
    };
    document.body.appendChild(script);
  });

  return sibsScriptPromise;
}