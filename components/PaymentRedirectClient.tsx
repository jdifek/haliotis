"use client";

import { useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { getSibsStatus } from "@/lib/payment";

// Сюда попадает браузер после оплаты в SIBS-виджете (redirectUrl = .../payment/redirect?id=...).
// Задача этой страницы — ОДИН раз спросить статус и тут же увести пользователя
// на один из уже готовых экранов: /cart/success | /cart/pending | /cart/multibanco.
export const PaymentRedirectClient: React.FC<{ locale: string }> = ({ locale }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const transactionId = searchParams.get("id");
  const startedRef = useRef(false);

  useEffect(() => {
    if (startedRef.current) return;
    startedRef.current = true;

    if (!transactionId) {
      router.replace(`/${locale}/cart/pending`);
      return;
    }
    getSibsStatus(transactionId)
    .then((data) => {
      console.log("SIBS status raw response:", JSON.stringify(data, null, 2));
      if (data.payment_method === "REFERENCE" && data.payment_reference) {
          const qs = new URLSearchParams({
            entity: data.payment_reference.entity ?? "",
            reference: data.payment_reference.reference ?? "",
            amount: String(data.amount?.value ?? ""),
            currency: data.amount?.currency ?? "EUR",
            expireDate: data.payment_reference.expire_date ?? "",
          });
          router.replace(`/${locale}/cart/multibanco?${qs.toString()}`);
          return;
        }

     if (data.payment_status === "Success" || data.order_status === "paid") {
          router.replace(`/${locale}/cart/success`);
          return;
        }

        // Явно отклонённые/проваленные платежи — отдельный экран,
        // это НЕ "в обработке", пользователю нужно попробовать снова.
        const FAILED_STATUSES = ["Declined", "Failed", "Cancelled", "Error", "Expired"];
        if (FAILED_STATUSES.includes(data.payment_status)) {
          const qs = new URLSearchParams({
            reason: data.raw?.transactionStatusDescription || "",
          });
          router.replace(`/${locale}/cart/failed?${qs.toString()}`);
          return;
        }

        // Настоящий pending / partial / что-то незнакомое — общий экран "в обработке".
        router.replace(`/${locale}/cart/pending`);

      })
      .catch(() => {
        // Не смогли узнать статус — безопасный дефолт, не спойлерим "успех" зря.
        router.replace(`/${locale}/cart/pending`);
      });
  }, [transactionId, router, locale]);

  return (
    <div className="min-h-[60vh] flex items-center justify-center bg-[#f5f5f5]">
      <div className="h-10 w-10 animate-spin rounded-full border-2 border-black/10 border-t-black/60" />
    </div>
  );
};

export default PaymentRedirectClient;