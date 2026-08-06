import { Breadcrumbs } from "@/components/Breadcrumbs";
import { ButtonWithIcon } from "@/components/buttons/ButtonWithIcon";
import { notFound } from "next/navigation";

// ─── Types ────────────────────────────────────────────────────────────────────

type CartStatus = "success" | "pending" | "multibanco";

const VALID_STATUSES: CartStatus[] = ["success", "pending", "multibanco"];

type PageProps = {
  params: Promise<{ locale: string; status: string }>;
  // ← добавили: реальные реквизиты Multibanco приходят как query-параметры
  // от /payment/redirect (entity, reference, amount, currency, expireDate)
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

// Плейсхолдер остаётся как fallback — на случай прямого захода на /cart/multibanco
// без query (например, при разработке/просмотре верстки).
const MULTIBANCO_PLACEHOLDER = {
  entity: "12345",
  reference: "123 456 789",
  amount: "2,395.00",
  currency: "€",
  expireDate: "30/06/2026",
};

// ─── Icons ────────────────────────────────────────────────────────────────────

const IconSlot = ({ children }: { children: React.ReactNode }) => (
  <div className="w-14 h-14 flex items-center justify-center">{children}</div>
);

const SuccessIconPlaceholder = () => (
  <svg width="60" height="60" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
    <g clipPath="url(#clip0_608_3463)">
      <path d="M60 0H0V60H60V0Z" fill="white" fillOpacity="0.01" />
      <path
        d="M30 5L36.5667 9.79005L44.6947 9.77458L47.1917 17.5096L53.7764 22.2746L51.25 30L53.7764 37.7254L47.1917 42.4904L44.6947 50.2254L36.5667 50.21L30 55L23.4334 50.21L15.3054 50.2254L12.8084 42.4904L6.22363 37.7254L8.75005 30L6.22363 22.2746L12.8084 17.5096L15.3054 9.77458L23.4334 9.79005L30 5Z"
        fill="#A0C52E"
        stroke="black"
        strokeWidth="5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M21.25 30L27.5 36.25L40 23.75"
        stroke="white"
        strokeWidth="5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </g>
    <defs>
      <clipPath id="clip0_608_3463">
        <rect width="60" height="60" fill="white" />
      </clipPath>
    </defs>
  </svg>
);

const PendingIconPlaceholder = () => (
  <svg width="60" height="60" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
    <g clipPath="url(#clip0_608_3687)">
      <path d="M58.6888 21.2051C54.9298 8.92828 43.5081 0 30 0C13.4316 0 0 13.4316 0 30C0 43.5081 8.92828 54.9298 21.2052 58.6888L58.6888 21.2051Z" fill="#C6DA8A" />
      <path d="M59.9997 29.9996C59.9997 26.9392 59.5402 23.9862 58.6885 21.2047L52.3285 14.8447L7.6709 45.1546L21.2048 58.6884C23.9863 59.5402 26.9393 59.9996 29.9997 59.9996C46.5682 59.9996 59.9997 46.5682 59.9997 29.9996Z" fill="#A0C52E" />
      <path d="M53.4779 17.6083C53.4779 15.4562 51.7171 13.6953 49.5649 13.6953H29.9996L24.7822 35.217L53.4779 29.9996V22.8257L46.4345 20.8692L53.4779 18.9126V17.6083Z" fill="#4A75C3" />
      <path d="M10.4345 13.6953C8.28234 13.6953 6.52148 15.4562 6.52148 17.6083V18.9126L13.5649 20.8692L6.52148 22.8257V29.9996L29.9998 35.217V13.6953H10.4345Z" fill="#458FDE" />
      <path d="M53.4785 30V42.3913C53.4785 44.5434 51.7177 46.3043 49.5655 46.3043H30.0002L23.4785 38.1521L30.0002 30H53.4785Z" fill="#4D68B5" />
      <path d="M29.9998 30V46.3043H10.4345C8.28234 46.3043 6.52148 44.5434 6.52148 42.3913V30H29.9998Z" fill="#4A75C3" />
      <path d="M53.4782 18.9131V22.8262H29.9999L26.0869 20.8696L29.9999 18.9131H53.4782Z" fill="black" />
      <path d="M29.9998 18.9131H6.52148V22.8261H29.9998V18.9131Z" fill="black" />
      <path d="M27.3911 39.7822H10.4346V42.3909H27.3911V39.7822Z" fill="#458FDE" />
      <path d="M46.9563 38.1325H44.3476V30.652C44.3476 29.2135 43.1774 28.0433 41.7389 28.0433C40.3004 28.0433 39.1302 29.2135 39.1302 30.652V38.1325H36.5215V30.652C36.5215 27.7752 38.862 25.4346 41.7389 25.4346C44.6159 25.4346 46.9563 27.775 46.9563 30.652V38.1325Z" fill="white" />
      <path d="M49.5655 33.2607V48.9129H41.7393L38.8936 41.0869L41.7393 33.2607H49.5655Z" fill="#E5E5E5" />
      <path d="M41.7392 33.2607H33.9131V48.9129H41.7392V33.2607Z" fill="#F2F2F2" />
      <path d="M46.9564 35.8691V46.3039H41.7389L39.8418 41.0866L41.7389 35.8691H46.9564Z" fill="#A0C52E" />
      <path d="M41.7389 35.8691H36.5215V46.3039H41.7389V35.8691Z" fill="#C6DA8A" />
      <path d="M43.0433 38.4785H40.4346V43.6959H43.0433V38.4785Z" fill="black" />
    </g>
    <defs>
      <clipPath id="clip0_608_3687">
        <rect width="60" height="60" fill="white" />
      </clipPath>
    </defs>
  </svg>
);

const MultibancoIconPlaceholder = () => (
  <svg width="60" height="60" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
    <g clipPath="url(#clip0_608_3923)">
      <path d="M58.5292 20.7033C54.6157 8.68594 43.3232 0 30 0C13.4314 0 0 13.4316 0 30C0 43.3232 8.68594 54.6158 20.7032 58.5293L58.5292 20.7033Z" fill="#C6DA8A" />
      <path d="M59.9996 30.0002C59.9996 26.7548 59.4822 23.6307 58.5288 20.7035L46.3039 8.47852L13.6953 51.522L20.7028 58.5295C23.6301 59.4829 26.7542 60.0002 29.9996 60.0002C46.5682 60.0002 59.9996 46.5687 59.9996 30.0002Z" fill="#A0C52E" />
      <path d="M46.3039 43.6956L35.8691 41.0869L38.4778 51.5216H46.3039V43.6956Z" fill="black" />
      <path d="M46.3043 8.47852V43.6959L41.3908 46.3045L38.4782 51.522H30L22.1738 29.8698L30 8.47852H46.3043Z" fill="#F2F2F2" />
      <path d="M29.9996 8.47852V46.3044L28.6953 47.6089L29.9996 48.9132V51.522H13.6953V8.47852H29.9996Z" fill="white" />
      <path d="M38.4785 51.5223V43.6963H46.3045L38.4785 51.5223Z" fill="white" />
      <path d="M29.9996 11.0869L28.6953 12.3912L29.9996 13.6956H43.6953V11.0869H29.9996Z" fill="#4A75C3" />
      <path d="M30.0004 46.3047H16.3047V48.9134H30.0004V46.3047Z" fill="#A0C52E" />
      <path d="M43.6953 16.3047V41.0873H29.9996L28.6953 39.783L29.9996 38.4787H34.2388V24.1308H29.9996L28.6953 22.8265L29.9996 21.5222H41.0866V18.9135H29.9996L28.6953 17.6092L29.9996 16.3047H43.6953ZM41.0866 38.4787V24.1308H36.8475V38.4787H41.0866Z" fill="#4A75C3" />
      <path d="M30.0004 38.4787V41.0874H16.3047V16.3047H30.0004V18.9134H18.9134V21.5221H30.0004V24.1308H18.9134V38.4787H30.0004Z" fill="#458FDE" />
      <path d="M30.0004 11.0869H16.3047V13.6956H30.0004V11.0869Z" fill="#458FDE" />
    </g>
    <defs>
      <clipPath id="clip0_608_3923">
        <rect width="60" height="60" fill="white" />
      </clipPath>
    </defs>
  </svg>
);

// ─── Shared typography ──────────────────────────────────────────────────────────

const MainTitle = ({ children }: { children: React.ReactNode }) => (
  <h1
    className="text-center font-medium text-[30px] sm:text-[36px] md:text-[42px] lg:text-[48px] leading-[130%] text-black"
    style={{ fontFamily: "var(--font-family)" }}
  >
    {children}
  </h1>
);

// ─── Shared shell ───────────────────────────────────────────────────────────────

const StatusShell = ({ children }: { children: React.ReactNode }) => (
  <div className="min-h-screen bg-[#f5f5f5]" style={{ fontFamily: "Inter, sans-serif" }}>
    <div className="max-w-[1200px] mx-auto px-4 py-8">
      <Breadcrumbs items={[{ label: "Haliotis", href: "/" }, { label: "Cart" }]} className="mb-4" />
      <div className="bg-[#f5f5f5] rounded-2xl flex flex-col items-center justify-center text-center px-4 py-5 md:py-12 lg:py-16 min-h-[400px] gap-5">
        {children}
      </div>
    </div>
  </div>
);

// ─── Success ────────────────────────────────────────────────────────────────────

const SuccessContent = () => (
  <>
    <IconSlot>
      <SuccessIconPlaceholder />
    </IconSlot>
    <MainTitle>
      Thank you!
      <br />
      Payment successful.
    </MainTitle>
    <p className="text-[14px] text-[#666] max-w-[420px]">
      Your booking has been successfully completed. Our managers will call you soon.
    </p>
    <ButtonWithIcon
      label="Go to Home"
      href="/"
      className="!w-fit !gap-3"
      icon={
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M17.5 7.50033H6.25C4.17893 7.50033 2.5 9.17926 2.5 11.2503C2.5 13.3214 4.17893 15.0003 6.25 15.0003H10M14.1667 10.8337L17.5 7.50033L14.1667 4.16699" stroke="#E84814" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      }
    />
  </>
);

// ─── Pending ────────────────────────────────────────────────────────────────────

const PendingContent = () => (
  <>
    <IconSlot>
      <PendingIconPlaceholder />
    </IconSlot>
    <MainTitle>Thank you for your order!</MainTitle>
    <p className="text-[14px] text-[#666] max-w-[460px]">
      We will start processing immediately after payment confirmation.
      <br />
      If you chose to pay via bank transfer or deferred payment, it may take some time.
    </p>
    <ButtonWithIcon
      label="Go to Home"
      href="/"
      className="!w-fit !gap-3"
      icon={
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M17.5 7.50033H6.25C4.17893 7.50033 2.5 9.17926 2.5 11.2503C2.5 13.3214 4.17893 15.0003 6.25 15.0003H10M14.1667 10.8337L17.5 7.50033L14.1667 4.16699" stroke="#E84814" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      }
    />
  </>
);

// ─── Multibanco ─────────────────────────────────────────────────────────────────

const MultibancoRow = ({ label, value }: { label: string; value: string }) => (
  <div className="flex items-center justify-between py-[10px] border-b border-[#ebebeb] last:border-b-0">
    <span className="text-[15px] font-400 text-[#111] leading-[160%]">{label}</span>
    <span className="text-[15px] font-400 text-[#111] leading-[160%]">{value}</span>
  </div>
);

// ← теперь принимает реальные данные из query, с фолбэком на плейсхолдер
const MultibancoContent = ({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) => {
  const pick = (key: string) => {
    const v = searchParams[key];
    return Array.isArray(v) ? v[0] : v;
  };

  const entity = pick("entity") || MULTIBANCO_PLACEHOLDER.entity;
  const reference = pick("reference") || MULTIBANCO_PLACEHOLDER.reference;
  const currency = pick("currency") || MULTIBANCO_PLACEHOLDER.currency;
  const rawAmount = pick("amount");
  const amount = rawAmount
    ? Number(rawAmount).toLocaleString("en", { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    : MULTIBANCO_PLACEHOLDER.amount;
  const expireDate = pick("expireDate") || MULTIBANCO_PLACEHOLDER.expireDate;

  return (
    <>
      <IconSlot>
        <MultibancoIconPlaceholder />
      </IconSlot>
      <MainTitle>
        To complete your reservation,
        <br />
        pay via ATM.
      </MainTitle>
      <div
        className="rounded-[20px] p-[10px] w-full max-w-[403px] text-left flex flex-col gap-3 lg:gap-4"
        style={{ background: "#fff" }}
      >
        <p className="px-[10px] pt-[4px] font-medium text-[18px] leading-[130%] sm:text-[20px] lg:text-[24px] text-black">
          Payment details
        </p>
        <div className="w-full border-t border-[#E4E4E4]" />
        <div className="rounded-[12px] bg-white px-[14px]" style={{ background: "#f1f1f1" }}>
          <MultibancoRow label="Entity:" value={entity} />
          <MultibancoRow label="Reference:" value={reference} />
          <MultibancoRow label="Amount:" value={`${amount} ${currency}`} />
          <MultibancoRow label="Valid until:" value={expireDate} />
        </div>
        <p className="text-center font-normal text-[13px] sm:text-[14px] lg:text-[15px] leading-[160%] text-black">
          If you have any questions, feel free to contact us.
        </p>
      </div>
      <ButtonWithIcon
        label="Contact us"
        href="/contactos"
        className="!w-fit !gap-3"
        icon={
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M17.5 7.50033H6.25C4.17893 7.50033 2.5 9.17926 2.5 11.2503C2.5 13.3214 4.17893 15.0003 6.25 15.0003H10M14.1667 10.8337L17.5 7.50033L14.1667 4.16699" stroke="#E84814" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        }
      />
    </>
  );
};

// ─── Page ───────────────────────────────────────────────────────────────────────

export default async function CartStatusPage({ params, searchParams }: PageProps) {
  const { status } = await params;
  const sp = await searchParams;

  if (!VALID_STATUSES.includes(status as CartStatus)) {
    notFound();
  }

  return (
    <StatusShell>
      {status === "success" && <SuccessContent />}
      {status === "pending" && <PendingContent />}
      {status === "multibanco" && <MultibancoContent searchParams={sp} />}
    </StatusShell>
  );
}