import PaymentRedirectClient from "@/components/PaymentRedirectClient";
import { Suspense } from "react";

export default async function PaymentRedirectPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  return (
    <Suspense
      fallback={
        <div className="min-h-[60vh] flex items-center justify-center bg-[#f5f5f5]">
          <div className="h-10 w-10 animate-spin rounded-full border-2 border-black/10 border-t-black/60" />
        </div>
      }
    >
      <PaymentRedirectClient locale={locale} />
    </Suspense>
  );
}