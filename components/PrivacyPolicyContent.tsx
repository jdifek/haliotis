/* eslint-disable @typescript-eslint/no-explicit-any */
// components/PrivacyPolicyContent.tsx — CLIENT COMPONENT
"use client";

import Image from "next/image";
import { useState } from "react";

// ─── Chevrons ─────────────────────────────────────────────────────────────────

const ChevronDown = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <path d="M17.8534 14.1463L12.8537 9.14663C12.8073 9.10015 12.7522 9.06327 12.6915 9.03811C12.6308 9.01295 12.5657 9 12.5 9C12.4343 9 12.3692 9.01295 12.3085 9.03811C12.2478 9.06327 12.1927 9.10015 12.1463 9.14663L7.14663 14.1463C7.07663 14.2162 7.02895 14.3053 7.00963 14.4024C6.9903 14.4994 7.00021 14.6 7.03808 14.6914C7.07595 14.7828 7.1401 14.8609 7.22239 14.9159C7.30468 14.9708 7.40142 15.0001 7.50036 15L17.4996 15C17.5986 15.0001 17.6953 14.9708 17.7776 14.9159C17.8599 14.8609 17.924 14.7828 17.9619 14.6914C17.9998 14.6 18.0097 14.4994 17.9904 14.4024C17.971 14.3053 17.9234 14.2162 17.8534 14.1463Z" fill="black" />
  </svg>
);

const ChevronRight = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <path d="M9.85369 6.14663L14.8534 11.1463C14.8999 11.1927 14.9367 11.2478 14.9619 11.3085C14.9871 11.3692 15 11.4343 15 11.5C15 11.5657 14.9871 11.6308 14.9619 11.6915C14.9367 11.7522 14.8999 11.8073 14.8534 11.8537L9.85369 16.8534C9.78377 16.9234 9.69465 16.971 9.59761 16.9904C9.50058 17.0097 9.39999 16.9998 9.30858 16.9619C9.21718 16.924 9.13907 16.8599 9.08413 16.7776C9.0292 16.6953 8.99992 16.5986 9 16.4996L9 6.50036C8.99992 6.40142 9.0292 6.30468 9.08413 6.22239C9.13907 6.1401 9.21718 6.07595 9.30858 6.03808C9.39999 6.00021 9.50058 5.9903 9.59761 6.00963C9.69465 6.02895 9.78377 6.07663 9.85369 6.14663Z" fill="black" />
  </svg>
);

// ─── AccordionItem ────────────────────────────────────────────────────────────

function AccordionItem({
  title,
  body,
  isDesktop,
}: {
  title: string;
  body: string;
  isDesktop: boolean;
}) {
  const [open, setOpen] = useState(false);

  // body may contain HTML (e.g. mailto link from API)
  const bodyContent = (
    <div
      dangerouslySetInnerHTML={{ __html: body }}
      style={{ whiteSpace: "pre-line" }}
    />
  );

  if (isDesktop) {
    return (
      <div>
        <h2
          style={{
            fontFamily: "var(--font-family)",
            fontWeight: 500,
            fontSize: "24px",
            lineHeight: "140%",
            color: "#111",
            marginTop: "10px",
            marginBottom: "10px",
          }}
        >
          {title}
        </h2>
        <div
          style={{
            fontFamily: "var(--font-family)",
            fontWeight: 400,
            fontSize: "15px",
            lineHeight: "160%",
            color: "#101010",
            opacity: 0.8,
          }}
        >
          {bodyContent}
        </div>
      </div>
    );
  }

  return (
    <div>
      <button
        className="flex w-full items-start justify-between py-4 text-left gap-2"
        onClick={() => setOpen((v) => !v)}
      >
        <span
          style={{
            fontFamily: "var(--font-family)",
            fontWeight: 500,
            fontSize: "20px",
            lineHeight: "140%",
            color: "#111",
          }}
        >
          {title}
        </span>
        <span className="flex-shrink-0 mt-[2px]">
          {open ? <ChevronDown /> : <ChevronRight />}
        </span>
      </button>
      {open && (
        <div
          className="pb-4"
          style={{
            fontFamily: "var(--font-family)",
            fontWeight: 400,
            fontSize: "16px",
            lineHeight: "140%",
            color: "#101010",
          }}
        >
          {bodyContent}
        </div>
      )}
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

interface PrivacyPolicyContentProps {
  data: any;
}

export default function PrivacyPolicyContent({ data }: PrivacyPolicyContentProps) {
  // Используем данные из API
  console.log("CLIENT DATA:", data);
  const tabs: any[] = data.content?.tabs || [];  
  // Если нет tabs, показываем только body
  const hasBody = Boolean(data?.content && data.content.body);    const hasTabs = tabs.length > 0;

  // First tab is rendered separately on desktop (always visible, no accordion header)
  const [firstTab, ...restTabs] = tabs;

  // Image: use API url if provided, else local asset
  const imageSrc = data.image ?? "/privacy-lock.png";

  // Если нет ни body, ни tabs - показываем сообщение
  if (!hasBody && !hasTabs) {
    return (
      <section className="bg-[#f1f1f1] px-4 pb-12 pt-8 md:px-[30px] xl:px-[188px] md:pb-[50px] md:pt-[46px]">
        <h1
          className="font-semibold text-[32px] leading-[120%] xl:font-medium xl:text-[48px] xl:leading-[130%] text-[#111]"
          style={{ fontFamily: "var(--font-family)" }}
        >
          {data.title}
        </h1>
        <div className="h-[30px] xl:h-[50px]" />
        <p className="text-[15px] leading-[160%] text-[#101010] opacity-80">
          Content not available.
        </p>
      </section>
    );
  }

  return (
    <section className="bg-[#f1f1f1] px-4 pb-12 pt-8 md:px-[30px] xl:px-[188px] md:pb-[50px] md:pt-[46px]">
      <h1
        className="font-semibold text-[32px] leading-[120%] xl:font-medium xl:text-[48px] xl:leading-[130%] text-[#111]"
        style={{ fontFamily: "var(--font-family)" }}
      >
        {data.title}
      </h1>
    

      <div className="h-[30px] xl:h-[50px]" />

      {/* ── Desktop layout ── */}
      <div className="hidden xl:flex xl:gap-[30px]">
        {/* Left: content */}
        <div className="flex-1 min-w-0">
      
          {/* Body content если есть */}
          {hasBody && (
            <div
              style={{
                fontFamily: "var(--font-family)",
                fontWeight: 400,
                fontSize: "15px",
                lineHeight: "160%",
                color: "#101010",
                opacity: 0.8,
                marginBottom: hasTabs ? "20px" : "0",
              }}
              dangerouslySetInnerHTML={{ __html: data.content?.body ?? "" }}            />
          )}

          {/* Tabs если есть */}
          {hasTabs && firstTab && (
            <>
              <h2
                style={{
                  fontFamily: "var(--font-family)",
                  fontWeight: 500,
                  fontSize: "24px",
                  lineHeight: "140%",
                  color: "#111",
                  marginBottom: "10px",
                }}
              >
                {firstTab.title}
              </h2>
              <div
                style={{
                  fontFamily: "var(--font-family)",
                  fontWeight: 400,
                  fontSize: "15px",
                  lineHeight: "160%",
                  color: "#101010",
                  opacity: 0.8,
                }}
                dangerouslySetInnerHTML={{ __html: firstTab.body }}
              />
            </>
          )}

          {restTabs.length > 0 && (
            <div className="mt-0">
              {restTabs.map((tab, i) => (
                <AccordionItem
                  key={i}
                  title={tab.title}
                  body={tab.body}
                  isDesktop={true}
                />
              ))}
            </div>
          )}
        </div>

        {/* Right: image */}
        <div className="flex-shrink-0">
          <Image
            src={imageSrc}
            alt="Privacy"
            width={600}
            height={400}
            style={{ width: "599px", height: "400px", objectFit: "cover" }}
          />
        </div>
      </div>

      {/* ── Mobile layout ── */}
      <div className="xl:hidden">
        {/* Body content если есть */}
        {hasBody && (
          <div
            style={{
              fontFamily: "var(--font-family)",
              fontWeight: 400,
              fontSize: "16px",
              lineHeight: "140%",
              color: "#101010",
              marginBottom: hasTabs ? "20px" : "0",
            }}
            dangerouslySetInnerHTML={{ __html: data.content?.body ?? "" }}          />
        )}

        {/* Tabs если есть */}
        {hasTabs && (
          <div>
            {tabs.map((tab, i) => (
              <AccordionItem
                key={i}
                title={tab.title}
                body={tab.body}
                isDesktop={false}
              />
            ))}
          </div>
        )}

        <Image
          src={imageSrc}
          alt="Privacy"
          width={600}
          height={400}
          className="w-full mt-6"
          style={{ objectFit: "cover" }}
        />
      </div>
    </section>
  );
}