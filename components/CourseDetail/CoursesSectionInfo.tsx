"use client";

import { useState } from "react";

type Props = {
  body?: string;
  tabs?: { title: string; body: string }[];
  contactPhone?: string | null;
  contactAddress?: string | null;
};

export default function CoursesSectionInfo({
  body,
  tabs,
  contactPhone,
  contactAddress,
}: Props) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleAccordion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const hasContent = body || (tabs && tabs.length > 0);

  if (!hasContent) return null;

  return (
    <section className="bg-white py-3 md:py-[80px] px-4 md:px-5">
      <div className="max-w-[1200px] mx-auto">
        {/* Body HTML */}
        {body && (
          <div
            className="text-[14px] md:text-[15px] leading-[160%] text-[#101010] opacity-80 mb-4 md:mb-6"
            dangerouslySetInnerHTML={{ __html: body }}
          />
        )}

        {/* Desktop - No Accordion */}
        {tabs && tabs.length > 0 && (
          <>
            <div className="hidden md:block">
              {tabs.map((item, index) => (
                <div key={index} className="py-3">
                  <h3 className="font-medium text-[24px] leading-[140%] text-[#111] mb-3">
                    {item.title}
                  </h3>
                  <div
                    className="text-[15px] leading-[160%] text-[#101010] opacity-80"
                    dangerouslySetInnerHTML={{ __html: item.body }}
                  />
                </div>
              ))}
            </div>

            {/* Mobile - Accordion */}
            <div className="md:hidden">
              {tabs.map((item, index) => (
                <div key={index}>
                  <button
                    onClick={() => toggleAccordion(index)}
                    className="w-full flex items-center justify-between py-2 text-left"
                  >
                    <h3 className="font-medium text-[18px] leading-[140%] text-[#111] pr-3">
                      {item.title}
                    </h3>
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className={`flex-shrink-0 transition-transform duration-300 ${
                        openIndex === index ? "rotate-0" : "rotate-90"
                      }`}
                    >
                      <path
                        d="M17.8534 14.1463L12.8537 9.14663C12.8073 9.10015 12.7522 9.06327 12.6915 9.03811C12.6308 9.01295 12.5657 9 12.5 9C12.4343 9 12.3692 9.01295 12.3085 9.03811C12.2478 9.06327 12.1927 9.10015 12.1463 9.14663L7.14663 14.1463C7.07663 14.2162 7.02895 14.3053 7.00963 14.4024C6.9903 14.4994 7.00021 14.6 7.03808 14.6914C7.07595 14.7828 7.1401 14.8609 7.22239 14.9159C7.30468 14.9708 7.40142 15.0001 7.50036 15H17.4996C17.5986 15.0001 17.6953 14.9708 17.7776 14.9159C17.8599 14.8609 17.924 14.7828 17.9619 14.6914C17.9998 14.6 18.0097 14.4994 17.9904 14.4024C17.971 14.3053 17.9234 14.2162 17.8534 14.1463Z"
                        fill="black"
                      />
                    </svg>
                  </button>
                  <div
                    className={`overflow-hidden transition-all duration-300 ${
                      openIndex === index ? "max-h-[500px]" : "max-h-0"
                    }`}
                  >
                    <div className="pb-2">
                      <div
                        className="text-[14px] leading-[160%] text-[#101010] opacity-80"
                        dangerouslySetInnerHTML={{ __html: item.body }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
}
