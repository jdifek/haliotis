"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createPortal } from "react-dom";
import { BookingFormModal } from "./Modals/BookingFormModal";
import { useLocale } from "next-intl";
import { useMenu } from "@/app/hooks/useMenu";

const ModalPortal = ({ children }: { children: React.ReactNode }) => {
  if (typeof window === "undefined") return null;
  return createPortal(children, document.body);
};

type CourseCardProps = {
  id: number; // ← ДОБАВЛЕНО: единственное новое обязательное поле, нужно модалке бронирования
  image: string;
  title: string;
  price: number;
  purchaseLink?: string;
  description?: string;
  duration: string;
  requestBased?: boolean;
  badge?: { name: string }[];
  slug?: string;
  currency?: string;
  centerSlug?: string;
  categorySlug?: string;
  onBookClick?: () => void;
};

export const CourseCard: React.FC<CourseCardProps> = ({
  id,
  image,
  title,
  price,
  purchaseLink,
  duration,
  requestBased = false,
  badge,
  slug,
  description,
  currency,
  centerSlug,
  categorySlug,
}) => {
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const router = useRouter();
  const locale = useLocale();
  const menu = useMenu(locale);

  const handleCardClick = () => {
    if (purchaseLink) {
      window.open(purchaseLink, "_blank", "noopener,noreferrer");
      return;
    }

    if (!slug || !centerSlug) return;

    const categoryPart = categorySlug || "all";

    router.push(`/${locale}/cursos/${categoryPart}/${centerSlug}/${slug}`);
  };

  return (
    <>
      <div className="w-full rounded-3xl bg-white p-2 cursor-pointer" onClick={handleCardClick}>
        {/* Image Container */}
        <div className="relative w-full aspect-[4/3] overflow-hidden rounded-2xl">
          <img src={image} alt={title} className="absolute inset-0 h-full w-full object-cover" />

          {badge && badge.length > 0 && (
            <div className="absolute right-3 top-3 flex flex-col items-end gap-1">
              {badge.map((item) => (
                <div key={item.name} className="rounded-2xl w-fit bg-black/10 px-2.5 py-1">
                  <span className="block text-[15px]  leading-[160%] text-[#f1f1f1]">{item.name}</span>
                </div>
              ))}
            </div>
          )}

          {duration !== "false" && (
            <div className="absolute bottom-3 left-3 flex flex-col md:flex-row items-start md:items-center gap-0.5 md:gap-1 rounded-lg bg-black/50 p-0.5">
              <div className="flex items-center gap-1 rounded-lg bg-black/50 p-1 lg:px-2 lg:py-1.5 xl:px-3 xl:py-2">
                <svg width="20" className="w-[10px] h-[10px] lg:w-[14px] lg:h-[14px] xl:w-[20px] xl:h-[20px]" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" clipRule="evenodd" d="M11.5374 10.3613L14.1043 11.8433C14.3549 11.988 14.436 12.3167 14.2949 12.5611C14.1495 12.8128 13.8359 12.9038 13.578 12.7549L10.9676 11.2478C10.7003 11.4554 10.3646 11.5789 10 11.5789C9.12797 11.5789 8.42105 10.872 8.42105 10C8.42105 9.31252 8.86043 8.72766 9.47368 8.5109V3.68781C9.47368 3.39514 9.71783 3.15789 10 3.15789C10.2907 3.15789 10.5263 3.40305 10.5263 3.68781V8.5109C11.1396 8.72766 11.5789 9.31252 11.5789 10C11.5789 10.1243 11.5646 10.2453 11.5374 10.3613ZM10 20C15.5228 20 20 15.5228 20 10C20 4.47715 15.5228 0 10 0C4.47715 0 0 4.47715 0 10C0 15.5228 4.47715 20 10 20Z" fill="white" />
                </svg>
                <span className="whitespace-nowrap text-[10px] lg:text-[12px] xl:text-[15px] leading-[160%] text-[#f1f1f1]">{duration}</span>
              </div>

              <div className="flex items-center gap-1 rounded-lg bg-black/50 p-1 lg:px-2 lg:py-1.5 xl:px-3 xl:py-2">
                <svg className="w-[10px] h-[10px] lg:w-[14px] lg:h-[14px] xl:w-[20px] xl:h-[20px]" width="19" height="20" viewBox="0 0 19 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M17.4167 1.53846H15.0417V0.769231C15.0417 0.565218 14.9583 0.369561 14.8098 0.225302C14.6613 0.0810437 14.46 0 14.25 0C14.04 0 13.8387 0.0810437 13.6902 0.225302C13.5417 0.369561 13.4583 0.565218 13.4583 0.769231V1.53846H5.54167V0.769231C5.54167 0.565218 5.45826 0.369561 5.30979 0.225302C5.16133 0.0810437 4.95996 0 4.75 0C4.54004 0 4.33867 0.0810437 4.19021 0.225302C4.04174 0.369561 3.95833 0.565218 3.95833 0.769231V1.53846H1.58333C1.16341 1.53846 0.76068 1.70055 0.463748 1.98907C0.166815 2.27758 0 2.6689 0 3.07692V18.4615C0 18.8696 0.166815 19.2609 0.463748 19.5494C0.76068 19.8379 1.16341 20 1.58333 20H17.4167C17.8366 20 18.2393 19.8379 18.5363 19.5494C18.8332 19.2609 19 18.8696 19 18.4615V3.07692C19 2.6689 18.8332 2.27758 18.5363 1.98907C18.2393 1.70055 17.8366 1.53846 17.4167 1.53846ZM13.6226 11.3135L8.8726 15.9288C8.79908 16.0004 8.71177 16.0571 8.61566 16.0958C8.51955 16.1345 8.41654 16.1545 8.3125 16.1545C8.20846 16.1545 8.10545 16.1345 8.00934 16.0958C7.91323 16.0571 7.82592 16.0004 7.7524 15.9288L5.3774 13.6212C5.22885 13.4768 5.14539 13.281 5.14539 13.0769C5.14539 12.8728 5.22885 12.677 5.3774 12.5327C5.52594 12.3884 5.72742 12.3073 5.9375 12.3073C6.14758 12.3073 6.34906 12.3884 6.4976 12.5327L8.3125 14.2971L12.5024 10.225C12.5759 10.1535 12.6633 10.0968 12.7594 10.0582C12.8555 10.0195 12.9585 9.99957 13.0625 9.99957C13.1665 9.99957 13.2695 10.0195 13.3656 10.0582C13.4617 10.0968 13.5491 10.1535 13.6226 10.225C13.6962 10.2965 13.7545 10.3813 13.7943 10.4747C13.8341 10.5681 13.8546 10.6682 13.8546 10.7692C13.8546 10.8703 13.8341 10.9704 13.7943 11.0638C13.7545 11.1571 13.6962 11.242 13.6226 11.3135ZM1.58333 6.15385V3.07692H3.95833V3.84615C3.95833 4.05017 4.04174 4.24582 4.19021 4.39008C4.33867 4.53434 4.54004 4.61538 4.75 4.61538C4.95996 4.61538 5.16133 4.53434 5.30979 4.39008C5.45826 4.24582 5.54167 4.05017 5.54167 3.84615V3.07692H13.4583V3.84615C13.4583 4.05017 13.5417 4.24582 13.6902 4.39008C13.8387 4.53434 14.04 4.61538 14.25 4.61538C14.46 4.61538 14.6613 4.53434 14.8098 4.39008C14.9583 4.24582 15.0417 4.05017 15.0417 3.84615V3.07692H17.4167V6.15385H1.58333Z" fill="white" />
                </svg>
                <span className="whitespace-nowrap text-[10px] lg:text-[12px] xl:text-[15px] leading-[160%] text-[#f1f1f1]">
                  {requestBased ? "Request based" : "Fixed schedule"}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="mt-2 sm:mt-3 h-[220px] md:h-[165px] rounded-2xl bg-[#f1f1f1] p-2 sm:p-3 flex flex-col justify-between">
          <h3 className="line-clamp-5 md:line-clamp-3 text-[16px] md:text-[18px] font-[500] leading-[140%] text-black overflow-hidden">{title}</h3>
          {description && (
            <p className="line-clamp-3 text-[14px] md:text-[16px] leading-[140%] text-gray-700 -mt-4">{description}</p>
          )}

          <div className="flex items-center flex-col md:flex-row justify-between gap-3 items-start md:items-center">
            <div className="flex items-center gap-2 rounded-lg bg-white px-2 md:px-3 py-1 md:py-2">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="10" cy="10" r="10" fill="black" />
                <text x="10" y="14" textAnchor="middle" fill="white" fontSize="12" fontWeight="700">{currency}</text>
              </svg>
              <span className="text-[15px] font-bold leading-[120%] text-black">{price}</span>
            </div>

            <button
              onClick={(e) => {
                e.stopPropagation();
                if (purchaseLink) {
                  window.open(purchaseLink, "_blank", "noopener,noreferrer");
                  return;
                }
                setIsBookingOpen(true);
              }}
              className="flex items-center justify-between whitespace-nowrap cursor-pointer w-full md:w-[160px] rounded-full bg-[#e84814] py-0.5 pl-[14px] md:pl-4 pr-0.5 transition-all hover:bg-[#d63f0f]"
            >
              <span className="text-[15px] font-bold leading-[120%] text-white">{menu.terms.buy_now}</span>
              <div className="hidden md:flex h-11 w-11 items-center justify-center rounded-full bg-white">
                <svg width="44" height="44" viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect width="44" height="44" rx="22" fill="white" />
                  <path d="M27.9624 23.293C28.8861 22.3501 30.3835 22.3501 31.3072 23.293C32.2309 24.2358 32.2309 25.7642 31.3072 26.707L27.2341 30.8645C27.1332 30.9675 27.0021 31.1066 26.8434 31.2195L26.843 31.2191C26.7172 31.3088 26.5813 31.383 26.4381 31.4402C26.2583 31.5122 26.0727 31.5468 25.9326 31.5754L23.9487 31.9805C23.6275 32.046 23.2955 31.9435 23.0639 31.707C22.8322 31.4706 22.7317 31.1318 22.796 30.8039L23.1928 28.7789C23.2209 28.6358 23.2543 28.4461 23.3249 28.2625C23.3809 28.1164 23.4537 27.9777 23.5415 27.8492L23.6283 27.7332C23.718 27.6223 23.8136 27.5277 23.8893 27.4504L27.9624 23.293Z" fill="black" />
                </svg>
              </div>
              <div className="flex md:hidden h-[36px] w-[36px] items-center justify-center rounded-full bg-white">
                <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect width="36" height="36" rx="18" fill="white" />
                  <path d="M22.7699 19.0344C23.5089 18.2801 24.7068 18.2801 25.4458 19.0344C26.1847 19.7886 26.1847 21.0114 25.4458 21.7656L22.1873 25.0916C22.1066 25.174 22.0017 25.2853 21.8747 25.3756L21.8744 25.3753C21.7737 25.447 21.665 25.5064 21.5505 25.5522C21.4067 25.6098 21.2582 25.6374 21.1461 25.6603L19.5589 25.9844C19.302 26.0368 19.0364 25.9548 18.8511 25.7656C18.6658 25.5765 18.5854 25.3054 18.6368 25.0431L18.9543 23.4231C18.9767 23.3087 19.0034 23.1569 19.0599 23.01C19.1048 22.8932 19.163 22.7821 19.2332 22.6794L19.3027 22.5866C19.3744 22.4979 19.4509 22.4222 19.5115 22.3603L22.7699 19.0344Z" fill="black" />
                </svg>
              </div>
            </button>
          </div>
        </div>
      </div>

      <ModalPortal>
        <BookingFormModal
          isOpen={isBookingOpen}
          onClose={() => setIsBookingOpen(false)}
          itemType="course"
          itemId={id}
          courseTitle={title}
          pricePerPerson={price}
          initialCenterSlug={centerSlug}
        />
      </ModalPortal>
    </>
  );
};