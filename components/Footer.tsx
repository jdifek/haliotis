"use client";

import Link from "next/link";
import { useState } from "react";
import { useLocale } from "next-intl";
import { ButtonWithIcon } from "./buttons/ButtonWithIcon";
import { useMenu } from "@/app/hooks/useMenu";
import Image from "next/image";

export const Footer: React.FC<{ logoUrl: string; logoAlt: string }> = ({ logoUrl, logoAlt }) => {
  const locale = useLocale();

  // Данные уже в кэше после рендера Header — fetch не повторяется
  const { menuData, loading } = useMenu(locale);

  const [openSection, setOpenSection] = useState<string | null>(null);

  const footerSections = (menuData?.data.footer ?? []).map((section) => ({
    id: section.id, // 👈 ДОБАВЬ
    title: section.label,
    links: (section.children ?? []).map((child) => ({
      id: child.id, // 👈 тоже желательно
      label: child.label,
      href: child.url ?? `/${child.slug}`,
    })),
  }));

  const bottomLinks = (menuData?.data.bottom ?? []).map((item) => ({
    label: item.label,
    href: item.url ?? `/${item.slug}`,
  }));

  const toggleSection = (title: string) =>
    setOpenSection(openSection === title ? null : title);

  return (
    <footer
      className="bg-[#1e1e3f] px-4 pb-12 pt-6 md:px-8 md:pb-16 md:pt-8 xl:px-8 xl:pb-20 xl:pt-[30px]"
      style={{ fontFamily: "var(--font-family)" }}
    >
      <div>
        {/* Top Section */}
        <div className="mb-8 flex flex-col gap-[30px] xl:mb-16 xl:flex-row">
          {/* Logo & Description */}
          <div className="w-full border-b border-white/10 pb-[30px] xl:border-none xl:pb-0 xl:w-[387px] xl:flex-shrink-0">
          <Image src={logoUrl} alt={logoAlt} width={195} height={196} className="mb-4 xl:mb-6" />

            <p className="mb-6 text-sm text-white md:text-base xl:mb-8 xl:text-[15px]" style={{ fontWeight: 400, lineHeight: "160%", opacity: 0.7 }}>
              Haliotis is a network of PADI 5-Star dive centers with over 20 years of experience, located in unique natural sites across Portugal and Cape Verde, offering courses, dives, and fun facilities for safe and comfortable diving.
            </p>
            <ButtonWithIcon
              width="160px"
              label="Contact Us"
              textColor="text-black"
              className="flex items-center gap-3 rounded-full bg-white px-6 py-3 transition-all hover:bg-gray-100"
              icon={
                <svg width="44" height="44" viewBox="0 0 44 44" fill="none">
                  <g clipPath="url(#clip0_footer)">
                    <path d="M44 22C44 9.84974 34.1503 0 22 0C9.84974 0 0 9.84974 0 22C0 34.1503 9.84974 44 22 44C34.1503 44 44 34.1503 44 22Z" fill="#E84814"/>
                    <path d="M30 20.3333H18.75C16.6789 20.3333 15 22.0123 15 24.0833C15 26.1544 16.6789 27.8333 18.75 27.8333H22.5M30 20.3333L26.6667 17M30 20.3333L26.6667 23.6667" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </g>
                  <defs><clipPath id="clip0_footer"><rect width="44" height="44" fill="white"/></clipPath></defs>
                </svg>
              }
            />
          </div>

          {/* Desktop Grid */}
          {loading ? (
            <div className="hidden flex-1 xl:grid xl:grid-cols-7 gap-8">
              {Array.from({ length: 7 }).map((_, i) => (
                <div key={i} className="space-y-3">
                  <div className="h-4 w-20 animate-pulse rounded bg-white/20" />
                  {Array.from({ length: 4 }).map((__, j) => (
                    <div key={j} className="h-3 w-16 animate-pulse rounded bg-white/10" />
                  ))}
                </div>
              ))}
            </div>
          ) : (
            <>
              <div className="hidden flex-1 xl:grid xl:grid-cols-7 gap-8">
                {footerSections.map((section) => (
                  <div key={section.id}>                    <h3 className="mb-4 text-white" style={{ fontSize: "15px", fontWeight: 600, lineHeight: "160%" }}>
                      {section.title}
                    </h3>
                    <ul className="space-y-2">
                      {section.links.map((link) => (
                        <li key={link.href}>
                          <Link href={link.href} className="text-white transition-opacity hover:opacity-100 opacity-70" style={{ fontSize: "15px", fontWeight: 400, lineHeight: "160%" }}>
                            {link.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>

              {/* Mobile Accordion */}
              <div className="flex flex-1 flex-col gap-2 xl:hidden">
                {footerSections.map((section, index) => (
                  <div key={section.id} className={index === footerSections.length - 1 ? "border-b md:border-none border-white/10" : ""}>
                    <button onClick={() => toggleSection(section.title)} className="flex w-full items-center justify-between py-4 text-left">
                      <h3 className="text-white" style={{ fontSize: "15px", fontWeight: 600, lineHeight: "160%" }}>
                        {section.title}
                      </h3>
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className={`transition-transform ${openSection === section.title ? "rotate-180" : ""}`}>
                        <path d="M17.8534 9.85369L12.8537 14.8534C12.8073 14.8999 12.7522 14.9367 12.6915 14.9619C12.6308 14.9871 12.5657 15 12.5 15C12.4343 15 12.3692 14.9871 12.3085 14.9619C12.2478 14.9367 12.1927 14.8999 12.1463 14.8534L7.14663 9.85369C7.07663 9.78377 7.02895 9.69465 7.00963 9.59761C6.9903 9.50058 7.00021 9.39999 7.03808 9.30858C7.07595 9.21718 7.1401 9.13907 7.22239 9.08413C7.30468 9.0292 7.40142 8.99992 7.50036 9H17.4996C17.5986 8.99992 17.6953 9.0292 17.7776 9.08413C17.8599 9.13907 17.924 9.21718 17.9619 9.30858C17.9998 9.39999 18.0097 9.50058 17.9904 9.59761C17.971 9.69465 17.9234 9.78377 17.8534 9.85369Z" fill="white"/>
                      </svg>
                    </button>
                    {openSection === section.title && (
                      <ul className="space-y-2 pb-4">
                        {section.links.map((link) => (
                          <li key={link.href}>
                            <Link href={link.href} className="block text-white transition-opacity hover:opacity-100" style={{ fontSize: "15px", fontWeight: 400, lineHeight: "160%", opacity: 0.7 }}>
                              {link.label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Bottom Section */}
        <div className="flex flex-col gap-4 md:border-t border-white/10 xl:pt-6 md:flex-row md:items-center md:justify-between md:pt-8">
          <p className="order-2 md:order-1 text-center text-sm text-white md:text-left md:text-[15px]" style={{ fontWeight: 400, lineHeight: "160%", opacity: 0.7 }}>
            Copyright © 2025 Haliotis.
          </p>
          <div className="order-1 md:order-2 flex flex-col gap-2 text-left md:flex-row md:gap-8">
            {bottomLinks.length > 0
              ? bottomLinks.map((link) => (
                  <Link key={link.href} href={link.href} className="text-sm opacity-70 text-white transition-opacity hover:opacity-100 md:text-[15px]" style={{ fontWeight: 400, lineHeight: "160%" }}>
                    {link.label}
                  </Link>
                ))
              : (
                // Fallback пока данные не пришли
                ["Alternative Dispute Resolution", "Cancellation Policies", "Privacy Policy", "Cookie Policy", "Terms & Conditions"].map((label) => (
                  <Link key={label} href="#" className="text-sm opacity-70 text-white transition-opacity hover:opacity-100 md:text-[15px]" style={{ fontWeight: 400, lineHeight: "160%" }}>
                    {label}
                  </Link>
                ))
              )
            }
          </div>
        </div>
      </div>
    </footer>
  );
};