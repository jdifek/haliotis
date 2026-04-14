// components/TravelDetail/RecommendedCoursesSection.tsx
"use client";

import { TripCard } from "../TravelTripsSection";

type TripCardType = {
  locationId: string;
  images: string[];
  price: number;
  title: string;
  description: string;
  link: string;
};

type Props = {
  className?: string;
  title: string;
  description: string;
  courseCards: TripCardType[];
};

export const RecommendedCoursesSection: React.FC<Props> = ({
  className,
  title,
  description,
  courseCards,
}) => {
  return (
    <section className={`bg-[#f1f1f1] relative pt-4 pb-4 md:pt-6 md:pb-8 ${className ?? ""}`}>
      <div className="mx-auto max-w-[1920px] px-4 md:px-8 lg:px-[188px] flex flex-col gap-[10px] md:gap-[30px]">
        <div className="flex flex-col gap-[10px]">
          <h2 className="text-[28px] font-medium leading-[130%] text-black sm:text-[36px] lg:text-[clamp(32px,2.5vw,42px)]">
            {title}
          </h2>
          <p className="text-[15px] font-normal leading-[160%] text-[#101010] opacity-80">
            {description}
          </p>
        </div>

        {courseCards.map((card, i) => (
          <TripCard key={`${card.locationId}-${i}`} card={card} />
        ))}
      </div>
    </section>
  );
};