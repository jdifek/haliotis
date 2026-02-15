"use client";

import Image from "next/image";
import { useState } from "react";

type AccordionItem = {
  id: string;
  label: string;
  content: React.ReactNode;
};

type Props = {
  className?: string;
  title: string;
  description: string;
  price: number;
  image: string;
  imageAlt?: string;
  onBookClick?: () => void;
  accordionItems?: AccordionItem[];
};

const ChevronIcon = ({ open }: { open: boolean }) => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`transition-transform duration-200 flex-shrink-0 ${open ? "rotate-180" : ""}`}
  >
    <path
      d="M17.8534 9.85369L12.8537 14.8534C12.8073 14.8999 12.7522 14.9367 12.6915 14.9619C12.6308 14.9871 12.5657 15 12.5 15C12.4343 15 12.3692 14.9871 12.3085 14.9619C12.2478 14.9367 12.1927 14.8999 12.1463 14.8534L7.14663 9.85369C7.07663 9.78377 7.02895 9.69465 7.00963 9.59761C6.9903 9.50058 7.00021 9.39999 7.03808 9.30858C7.07595 9.21718 7.1401 9.13907 7.22239 9.08413C7.30468 9.0292 7.40142 8.99992 7.50036 9H17.4996C17.5986 8.99992 17.6953 9.0292 17.7776 9.08413C17.8599 9.13907 17.924 9.21718 17.9619 9.30858C17.9998 9.39999 18.0097 9.50058 17.9904 9.59761C17.971 9.69465 17.9234 9.78377 17.8534 9.85369Z"
      fill="black"
    />
  </svg>
);

const EuroIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M0 10C0 4.47715 4.47715 0 10 0C15.5228 0 20 4.47715 20 10C20 15.5228 15.5228 20 10 20C4.47715 20 0 15.5228 0 10ZM8.6158 7.5C9.0535 6.71823 9.8025 6 10.7498 6C11.284 6 11.819 6.23239 12.2923 6.70646C12.6824 7.09734 13.3156 7.09792 13.7065 6.70775C14.0973 6.31758 14.0979 5.68442 13.7077 5.29354C12.9274 4.51179 11.9042 4 10.7498 4C9.3289 4 8.1189 4.77025 7.29826 5.86449C6.93769 6.34528 6.64329 6.89783 6.42654 7.5H6C5.44772 7.5 5 7.94772 5 8.5C5 8.9581 5.30804 9.3443 5.72828 9.4626C5.82228 9.4891 5.91867 9.5 6.01613 9.5C5.99473 9.8304 5.99473 10.1696 6.01613 10.5C5.91867 10.5 5.82228 10.5109 5.72828 10.5374C5.30804 10.6557 5 11.0419 5 11.5C5 12.0523 5.44772 12.5 6 12.5H6.42654C6.64329 13.1022 6.93769 13.6547 7.29826 14.1355C8.1189 15.2298 9.3289 16 10.7498 16C11.9042 16 12.9274 15.4882 13.7077 14.7065C14.0979 14.3156 14.0973 13.6824 13.7065 13.2923C13.3156 12.9021 12.6824 12.9027 12.2923 13.2935C11.819 13.7676 11.284 14 10.7498 14C9.8025 14 9.0535 13.2818 8.6158 12.5H10C10.5523 12.5 11 12.0523 11 11.5C11 10.9477 10.5523 10.5 10 10.5H8.0217C7.99312 10.1735 7.99312 9.8265 8.0217 9.5H11C11.5523 9.5 12 9.0523 12 8.5C12 7.94772 11.5523 7.5 11 7.5H8.6158Z"
      fill="black"
    />
  </svg>
);

const BookNowButton = ({ onClick }: { onClick?: () => void }) => (
  <button
    onClick={onClick}
    className="flex items-center whitespace-nowrap cursor-pointer gap-[23px] md:gap-6 rounded-full bg-[#e84814] py-0.5 pl-[14px] md:pl-4 pr-0.5 transition-all hover:bg-[#d63f0f]"
  >
    <span className="text-[15px] font-bold leading-[120%] text-white">Book Now</span>
    {/* Desktop icon */}
    <div className="hidden md:flex h-11 w-11 items-center justify-center rounded-full bg-white">
      <svg width="44" height="44" viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="44" height="44" rx="22" fill="white" />
        <path d="M27.9624 23.293C28.8861 22.3501 30.3835 22.3501 31.3072 23.293C32.2309 24.2358 32.2309 25.7642 31.3072 26.707L27.2341 30.8645C27.1332 30.9675 27.0021 31.1066 26.8434 31.2195L26.843 31.2191C26.7172 31.3088 26.5813 31.383 26.4381 31.4402C26.2583 31.5122 26.0727 31.5468 25.9326 31.5754L23.9487 31.9805C23.6275 32.046 23.2955 31.9435 23.0639 31.707C22.8322 31.4706 22.7317 31.1318 22.796 30.8039L23.1928 28.7789C23.2209 28.6358 23.2543 28.4461 23.3249 28.2625C23.3809 28.1164 23.4537 27.9777 23.5415 27.8492L23.6283 27.7332C23.718 27.6223 23.8136 27.5277 23.8893 27.4504L27.9624 23.293ZM29.9219 24.707C29.7634 24.5453 29.5063 24.5453 29.3478 24.707L25.2747 28.8645C25.2078 28.9328 25.175 28.9665 25.1519 28.9918C25.1513 28.9924 25.1505 28.9928 25.15 28.9934C25.1497 28.9943 25.1498 28.9955 25.1496 28.9965C25.1418 29.0301 25.1325 29.0767 25.114 29.1711L25.0053 29.725L25.5484 29.6145C25.6408 29.5956 25.6865 29.5861 25.7194 29.5781C25.7203 29.5779 25.7213 29.5775 25.7221 29.5773C25.7227 29.5768 25.7234 29.5764 25.724 29.5758C25.7488 29.5522 25.7818 29.5187 25.8488 29.4504L29.9219 25.293C30.0803 25.1312 30.0803 24.8688 29.9219 24.707ZM19.8377 26C20.3787 26 20.8174 26.4478 20.8174 27C20.8174 27.5523 20.3788 28 19.8377 28H16.8986C16.3575 28 15.9189 27.5523 15.9189 27C15.9189 26.4477 16.3575 26 16.8986 26H19.8377ZM23.2667 22C23.8077 22 24.2464 22.4478 24.2464 23C24.2464 23.5523 23.8078 24 23.2667 24H16.8986C16.3575 24 15.9189 23.5523 15.9189 23C15.9189 22.4477 16.3575 22 16.8986 22H23.2667ZM29.6348 20H13.9594V27.8C13.9594 28.3764 13.9601 28.7487 13.9828 29.032C14.0045 29.3036 14.0415 29.4045 14.0662 29.4539L14.1041 29.523C14.1848 29.6572 14.2953 29.7701 14.4267 29.8523L14.4944 29.891L14.5419 29.9117C14.6025 29.934 14.7081 29.9595 14.9078 29.9762C15.1853 29.9993 15.55 30 16.1148 30H19.8377C20.3788 30 20.8174 30.4477 20.8174 31C20.8174 31.5523 20.3788 32 19.8377 32H16.1148C15.5823 32 15.124 32.0009 14.7482 31.9695C14.3608 31.9372 13.9754 31.8659 13.6047 31.673V31.6727C13.0517 31.385 12.602 30.9264 12.3203 30.3621C12.1314 29.9837 12.0615 29.5903 12.0299 29.1949C11.9992 28.8113 12 28.3435 12 27.8V18.2C12 17.6565 11.9992 17.1887 12.0299 16.8051C12.0615 16.4097 12.1314 16.0163 12.3203 15.6379C12.6021 15.0735 13.0517 14.6146 13.6047 14.327C13.9754 14.1342 14.3608 14.0628 14.7482 14.0305C15.0771 14.003 15.4692 14.0011 15.9189 14.0008V13C15.9189 12.4477 16.3575 12 16.8986 12C17.4396 12 17.8783 12.4477 17.8783 13V14H25.716V13C25.716 12.4477 26.1546 12 26.6957 12C27.2368 12 27.6754 12.4477 27.6754 13V14.0008C28.1251 14.0011 28.5171 14.003 28.8461 14.0305C29.2334 14.0628 29.6189 14.1341 29.9896 14.327C30.5424 14.6145 30.9918 15.0735 31.2735 15.6379C31.4624 16.0163 31.5328 16.4097 31.5644 16.8051C31.5951 17.1887 31.5943 17.6565 31.5943 18.2V20C31.5943 20.5523 31.1556 21 30.6145 21C30.0735 21 29.6348 20.5523 29.6348 20ZM16.1148 16C15.55 16 15.1853 16.0007 14.9078 16.0238C14.6417 16.046 14.5429 16.0838 14.4944 16.109C14.3101 16.2048 14.1601 16.3579 14.0662 16.5461C14.0415 16.5956 14.0045 16.6964 13.9828 16.968C13.9628 17.2171 13.9606 17.535 13.9602 18H29.6341C29.6336 17.535 29.6314 17.2171 29.6115 16.968C29.5897 16.6964 29.5527 16.5955 29.5281 16.5461C29.446 16.3816 29.321 16.2437 29.1676 16.1477L29.0998 16.109C29.0514 16.0838 28.9526 16.046 28.6865 16.0238C28.4089 16.0007 28.0442 16 27.4795 16H16.1148Z" fill="black" />
      </svg>
    </div>
    {/* Mobile icon */}
    <div className="flex md:hidden h-[36px] w-[36px] items-center justify-center rounded-full bg-white">
      <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="36" height="36" rx="18" fill="white" />
        <path d="M22.7699 19.0344C23.5089 18.2801 24.7068 18.2801 25.4458 19.0344C26.1847 19.7886 26.1847 21.0114 25.4458 21.7656L22.1873 25.0916C22.1066 25.174 22.0017 25.2853 21.8747 25.3756L21.8744 25.3753C21.7737 25.447 21.665 25.5064 21.5505 25.5522C21.4067 25.6098 21.2582 25.6374 21.1461 25.6603L19.5589 25.9844C19.302 26.0368 19.0364 25.9548 18.8511 25.7656C18.6658 25.5765 18.5854 25.3054 18.6368 25.0431L18.9543 23.4231C18.9767 23.3087 19.0034 23.1569 19.0599 23.01C19.1048 22.8932 19.163 22.7821 19.2332 22.6794L19.3027 22.5866C19.3744 22.4979 19.4509 22.4222 19.5115 22.3603L22.7699 19.0344ZM24.3375 20.1656C24.2107 20.0362 24.005 20.0362 23.8782 20.1656L20.6198 23.4916C20.5662 23.5462 20.54 23.5732 20.5215 23.5934C20.521 23.5939 20.5204 23.5942 20.52 23.5947C20.5198 23.5954 20.5199 23.5964 20.5197 23.5972C20.5134 23.6241 20.506 23.6613 20.4912 23.7369L20.4042 24.18L20.8387 24.0916C20.9127 24.0765 20.9492 24.0689 20.9755 24.0625C20.9762 24.0623 20.977 24.062 20.9777 24.0619C20.9781 24.0614 20.9787 24.0611 20.9792 24.0606C20.999 24.0418 21.0255 24.015 21.079 23.9603L24.3375 20.6344C24.4643 20.505 24.4643 20.295 24.3375 20.1656ZM16.2702 21.2C16.703 21.2 17.0539 21.5582 17.0539 22C17.0539 22.4418 16.703 22.8 16.2702 22.8H13.9189C13.486 22.8 13.1351 22.4418 13.1351 22C13.1351 21.5582 13.486 21.2 13.9189 21.2H16.2702ZM19.0134 18C19.4462 18 19.7971 18.3582 19.7971 18.8C19.7971 19.2418 19.4462 19.6 19.0134 19.6H13.9189C13.486 19.6 13.1351 19.2418 13.1351 18.8C13.1351 18.3582 13.486 18 13.9189 18H19.0134ZM24.1079 16.4H11.5675V22.64C11.5675 23.1012 11.5681 23.399 11.5862 23.6256C11.6036 23.8429 11.6332 23.9236 11.653 23.9631L11.6833 24.0184C11.7478 24.1258 11.8363 24.2161 11.9414 24.2819L11.9956 24.3128L12.0335 24.3294C12.082 24.3472 12.1664 24.3676 12.3262 24.3809C12.5483 24.3994 12.84 24.4 13.2918 24.4H16.2702C16.703 24.4 17.0539 24.7582 17.0539 25.2C17.0539 25.6418 16.703 26 16.2702 26H13.2918C12.8659 26 12.4992 26.0007 12.1985 25.9756C11.8887 25.9498 11.5803 25.8927 11.2837 25.7384V25.7381C10.8414 25.508 10.4816 25.1411 10.2563 24.6897C10.1051 24.387 10.0492 24.0722 10.0239 23.7559C9.99932 23.449 10 23.0748 10 22.64V14.96C10 14.5252 9.99932 14.151 10.0239 13.8441C10.0492 13.5278 10.1051 13.213 10.2563 12.9103C10.4817 12.4588 10.8414 12.0916 11.2837 11.8616C11.5803 11.7073 11.8887 11.6502 12.1985 11.6244C12.4617 11.6024 12.7753 11.6008 13.1351 11.6006V10.8C13.1351 10.3582 13.486 10 13.9189 10C14.3517 10 14.7026 10.3582 14.7026 10.8V11.6H20.9728V10.8C20.9728 10.3582 21.3237 10 21.7566 10C22.1894 10 22.5403 10.3582 22.5403 10.8V11.6006C22.9001 11.6008 23.2137 11.6024 23.4769 11.6244C23.7867 11.6502 24.0951 11.7073 24.3917 11.8616C24.8339 12.0916 25.1934 12.4588 25.4188 12.9103C25.57 13.213 25.6262 13.5278 25.6515 13.8441C25.6761 14.151 25.6754 14.5252 25.6754 14.96V16.4C25.6754 16.8418 25.3245 17.2 24.8916 17.2C24.4588 17.2 24.1079 16.8418 24.1079 16.4ZM13.2918 13.2C12.84 13.2 12.5483 13.2006 12.3262 13.2191C12.1134 13.2368 12.0343 13.267 11.9956 13.2872C11.8481 13.3639 11.7281 13.4864 11.653 13.6369C11.6332 13.6764 11.6036 13.7571 11.5862 13.9744C11.5703 14.1737 11.5685 14.428 11.5682 14.8H24.1073C24.1069 14.428 24.1051 14.1737 24.0892 13.9744C24.0718 13.7571 24.0422 13.6764 24.0224 13.6369C23.9568 13.5053 23.8568 13.395 23.734 13.3181L23.6799 13.2872C23.6411 13.267 23.562 13.2368 23.3492 13.2191C23.1271 13.2006 22.8354 13.2 22.3836 13.2H13.2918Z" fill="black" />
      </svg>
    </div>
  </button>
);

const defaultAccordionItems: AccordionItem[] = [
  {
    id: "content",
    label: "Content",
    content: (
      <p className="text-[15px] font-normal leading-[160%] text-[#101010] opacity-80">
        See the contents of the respective courses:{" "}
        <a href="#" className="underline decoration-skip-ink-none text-[#e84814]">
          PADI Advanced Open Water Diver
        </a>{" "}
        e{" "}
        <a href="#" className="underline decoration-skip-ink-none text-[#e84814]">
          PADI Underwater Naturalist
        </a>
      </p>
    ),
  },
  {
    id: "structure",
    label: "Structure",
    content: (
      <p className="text-[15px] font-normal leading-[160%] text-[#101010] opacity-80">
        Merge of the two courses, including the following fases: Knowledge development (theoretical
        modules carried out via eLearning). Open water dives where you will do 6 dives in the sea,
        2 of which were dedicated to the Underwater Naturalist course in Sesimbra, held over three
        days.
      </p>
    ),
  },
  {
    id: "duration",
    label: "Duration",
    content: (
      <p className="text-[15px] font-normal leading-[160%] text-[#101010] opacity-80">
        The diving courses are held over three days, which can be scheduled on pre-defined dates or
        on any date arranged with the participants, either during working hours or after work hours.
        We offer diving courses with just one participant without any additional cost.
      </p>
    ),
  },
  {
    id: "requirements",
    label: "Requirements",
    content: (
      <p className="text-[15px] font-normal leading-[160%] text-[#101010] opacity-80">
        <a href="#" className="underline decoration-skip-ink-none text-[#e84814]">
          PADI (Junior) Open Water Diver
        </a>{" "}
        or equivalent certification from another scuba diving agency. Be at least 12 years old.
      </p>
    ),
  },
  {
    id: "included",
    label: "Included",
    content: (
      <p className="text-[15px] font-normal leading-[160%] text-[#101010] opacity-80">
        Unlimited access to the online eLearning course in the selected language. Your scuba diving
        training includes all the necessary scuba diving equipment, snack, water between dives and
        insurance.
      </p>
    ),
  },
  {
    id: "assigned",
    label: "Assigned",
    content: (
      <p className="text-[15px] font-normal leading-[160%] text-[#101010] opacity-80">
        International digital certifications PADI Advanced Open Water Diver and PADI Underwater
        Naturalist.
      </p>
    ),
  },
];

export const CourseDetailHeroSection: React.FC<Props> = ({
  className,
  title,
  description,
  price,
  image,
  imageAlt = "Course image",
  onBookClick,
  accordionItems = defaultAccordionItems,
}) => {
  // State only used on mobile
  const [openAccordion, setOpenAccordion] = useState<string | null>("content");

  const toggleAccordion = (id: string) => {
    setOpenAccordion((prev) => (prev === id ? null : id));
  };

  return (
    <section className={`bg-white ${className}`}>
      <div className="mx-auto max-w-[1920px] px-4 md:px-8 lg:px-[158px] pt-0 py-8 md:py-12 md:pt-12 flex flex-col gap-6 md:gap-10">

        {/* ── HERO BLOCK ── */}
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6 md:gap-10">

          {/* Left: Title + Description + Price + Book */}
          <div className="flex flex-col gap-4 md:gap-6 flex-1">
            <h1
              className="text-[28px] sm:text-[36px] lg:text-[48px] font-medium leading-[130%] text-[#111]"
              style={{ fontFamily: "var(--font-family)" }}
            >
              {title}
            </h1>

            <p
              className="text-[15px] font-normal leading-[160%] text-[#101010] opacity-80"
              style={{ fontFamily: "var(--font-family)" }}
            >
              {description}
            </p>

            {/* Price + Book Now */}
            <div className="flex items-center gap-3 md:justify-start justify-between">
              <div className="flex items-center gap-2 rounded-lg bg-[#f1f1f1] px-3 py-2">
                <EuroIcon />
                <span className="text-[15px] font-bold leading-[120%] text-black">{price}</span>
              </div>
              <BookNowButton onClick={onBookClick} />
            </div>
          </div>

          {/* Right: Image */}
          <div className="w-full md:w-[600px] md:flex-shrink-0">
            <Image
              src={image}
              alt={imageAlt}
              width={600}
              height={400}
              className="w-full md:w-[600px] h-[220px] sm:h-[280px] md:h-[400px] rounded-2xl object-cover"
            />
          </div>
        </div>

        {/* ── DIVIDER ── */}
        <div className="h-px bg-[#e4e4e4] -mx-4 md:-mx-8 lg:-mx-[158px]" />
        {/* ── CONTENT SECTIONS ──
            Desktop: all sections always visible, no chevrons, plain headings
            Mobile:  accordion, one open at a time, with chevrons
        ── */}
        <div className="flex flex-col">
          {accordionItems.map((item, index) => (
            <div key={item.id}>

              {/* DESKTOP: always open, no toggle */}
              <div className="hidden md:block py-5">
                <h2
                  className="text-[24px] font-medium leading-[140%] text-[#111] mb-2"
                  style={{ fontFamily: "var(--font-family)" }}
                >
                  {item.label}
                </h2>
                <div>{item.content}</div>
              </div>

              {/* MOBILE: accordion */}
              <div className="md:hidden">
                <button
                  onClick={() => toggleAccordion(item.id)}
                  className="flex w-full cursor-pointer items-center justify-between py-[14px] text-left"
                >
                  <span
                    className="text-[18px] font-medium leading-[140%] text-[#111]"
                    style={{ fontFamily: "var(--font-family)" }}
                  >
                    {item.label}
                  </span>
                  <ChevronIcon open={openAccordion === item.id} />
                </button>
                {openAccordion === item.id && (
                  <div className="pb-4">{item.content}</div>
                )}
              </div>

              {/* Divider between sections */}
              {index < accordionItems.length - 1 && (
                <div className="h-px w-full bg-[#e4e4e4]" />
              )}
            </div>
          ))}

          {/* Trailing divider */}
          <div className="h-px w-full bg-[#e4e4e4]" />
        </div>

        {/* ── BOTTOM BOOK NOW ── */}
        <div>
          <BookNowButton onClick={onBookClick} />
        </div>

      </div>
    </section>
  );
};