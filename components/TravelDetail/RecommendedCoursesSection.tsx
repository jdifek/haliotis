"use client";

import { CourseCard } from "../CourseCard";
import { TripCard } from "../TravelTripsSection";
import { BlackActionButton } from "../buttons/BlackActionButton";

type Props = {
  className?: string;
  courseCards: {
    image: string;
    title: string;
    price: number;
    duration: string;
    requestBased: boolean;
    badge: string;
    location: string;
  }[];
};

const DEFAULT_TRIP_CARDS = [
  {
    locationId: "peniche",
    images: ["/travel.png", "/travel.png"],
    price: 890,
    title: "Peniche",
    description:
      "São Vicente is the second more populous island of Cape Verde and it is located at windward group of the archipelago.",
    link: "/trips/peniche",
  },
  {
    locationId: "sesimbra",
    images: ["/travel.png", "/travel.png"],
    price: 839,
    title: "Sesimbra",
    description:
      "São Vicente is the second more populous island of Cape Verde and it is located at windward group of the archipelago.",
    link: "/trips/sesimbra",
  },
  {
    locationId: "madeira",
    images: ["/travel.png", "/travel.png"],
    price: 1695,
    title: "Madeira",
    description:
      "São Vicente is the second more populous island of Cape Verde and it is located at windward group of the archipelago.",
    link: "/trips/madeira",
  },
  {
    locationId: "santa-maria",
    images: ["/travel.png", "/travel.png"],
    price: 810,
    title: "Santa Maria - Azores",
    description:
      "São Vicente is the second more populous island of Cape Verde and it is located at windward group of the archipelago.",
    link: "/trips/santa-maria",
  },
  {
    locationId: "faial",
    images: ["/travel.png", "/travel.png"],
    price: 950,
    title: "Faial",
    description:
      "São Vicente is the second more populous island of Cape Verde and it is located at windward group of the archipelago.",
    link: "/trips/faial",
  },
  {
    locationId: "sao-vicente",
    images: ["/travel.png", "/travel.png"],
    price: 1200,
    title: "Cape Verde",
    description:
      "São Vicente is the second more populous island of Cape Verde and it is located at windward group of the archipelago.",
    link: "/trips/sao-vicente",
  },
];

export const RecommendedCoursesSection: React.FC<Props> = ({
  className,
  courseCards,
}) => {
  return (
    <section
      className={`bg-[#f1f1f1] relative pt-4 pb-4 md:pt-6 md:pb-8 ${className}`}
    >
      <div className="mx-auto  max-w-[1920px] px-4 md:px-8 lg:px-[188px]  flex flex-col gap-[10px] md:gap-[30px]">
        {/* Заголовок */}
        <div className="flex flex-col gap-[10px]">
          <h2 className="text-[28px] font-medium leading-[130%] text-black sm:text-[36px] lg:text-[clamp(32px,2.5vw,42px)]">
            The following travel are recommended
          </h2>
          <p className="text-[15px] font-normal leading-[160%] text-[#101010] opacity-80">
            The perfect travel for you
          </p>
        </div>

        <TripCard card={DEFAULT_TRIP_CARDS[0]} />

        <div className="flex justify-center">
          <BlackActionButton
            className="md:w-[280px]"
            label="Show more"
            icon={
              <svg
                width="44"
                height="44"
                viewBox="0 0 44 44"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect width="44" height="44" rx="22" fill="white" />
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M27.3916 25.3968C28.0013 25.5779 28.6561 25.2049 28.8302 24.536C28.9971 23.8769 28.6411 23.1847 28.027 22.9985L27.5489 22.8545L26.9297 25.2487L27.3916 25.3968Z"
                  fill="black"
                />
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M26.9304 22.2487L22.2146 20.9315C21.9214 20.855 21.6269 21.0308 21.546 21.3236L21.127 22.8114C21.0447 23.1035 21.2044 23.4035 21.5048 23.4915L26.2206 24.7954L26.9304 22.2487Z"
                  fill="black"
                />
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M30.9401 28.0303C31.5989 27.7085 32.0406 27.0955 32.101 26.3917C32.1832 25.4322 31.4316 24.8019 30.4159 24.7955C29.3534 24.789 29.3018 25.7592 28.8711 26.0717L30.9401 28.0303Z"
                  fill="black"
                />
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M37.1107 34.1877C37.2611 33.7412 36.702 33.4478 36.702 33.4478L33.287 31.7304C33.0318 31.5846 32.4491 31.0495 32.4491 31.0495L27.7132 26.2057C27.3147 25.8226 26.8189 25.5184 26.2413 25.3581L19.9047 23.5677L16.0965 19.5792C15.814 19.318 15.6653 18.8829 15.6653 18.8829L13.7499 13.7504C13.5386 12.9714 12.5676 12.7081 12.5676 12.7081L10.8658 12.1818L7.18176 11.2623C7.18176 11.2623 6.91948 11.2151 6.87317 11.4267C6.82619 11.6384 7.07123 11.69 7.07123 11.69L10.8418 13.3211C11.6777 13.6026 12.0518 14.543 12.0518 14.543L13.8425 20.7775C13.8425 20.7775 14.1004 21.5505 14.5384 21.9512L18.6196 26.7603C18.6196 26.7603 19.0181 27.407 20.0216 27.7395L28.325 30.2455L31.3834 32.818C31.3834 32.818 31.6241 33.1157 32.3467 33.299L36.3475 34.4598C36.6507 34.5398 36.9971 34.5246 37.1107 34.1877Z"
                  fill="black"
                />
                <mask
                  id="mask0_407_329"
                  style={{ maskType: "luminance" }}
                  maskUnits="userSpaceOnUse"
                  x="13"
                  y="9"
                  width="6"
                  height="12"
                >
                  <path
                    d="M18.5027 9.5H13.3555V20.707H18.5027V9.5Z"
                    fill="white"
                  />
                </mask>
                <g mask="url(#mask0_407_329)">
                  <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M17.9903 20.707L18.4799 16.3769C18.6203 15.7772 18.0593 15.2501 18.0593 15.2501L17.0994 14.2834L14.9413 12.338C14.9413 12.338 14.7815 12.2116 14.6727 12.3372C14.5643 12.4626 14.7112 12.5857 14.7112 12.5857L16.6686 15.0407C17.1321 15.531 17.0433 16.2981 17.0433 16.2981L16.5676 18.6988C16.5676 18.6988 16.4937 19.153 16.8811 19.581L17.9903 20.707Z"
                    fill="black"
                  />
                </g>
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M30.0483 16.1823C29.8934 16.0207 28.6895 15.1714 27.2136 15.1714C27.0492 15.1714 26.8885 15.1817 26.7312 15.198L25.4275 14.4439C25.4275 14.8082 25.5256 15.1728 25.6119 15.4215C24.8578 15.6323 24.2059 15.8997 23.6407 15.8997L22.3984 15.0908C22.3984 15.7377 22.7089 16.385 22.7089 16.385C22.7089 16.385 22.3984 17.0319 22.3984 17.6788L23.6407 16.8699C24.2059 16.8699 24.8578 17.1373 25.6119 17.3481C25.5256 17.5971 25.4275 17.9614 25.4275 18.3257L26.7309 17.5716C26.8885 17.5875 27.0492 17.5978 27.2136 17.5978C28.6895 17.5978 29.8934 16.7489 30.0483 16.5869C30.2039 16.4249 30.2039 16.3436 30.0483 16.1823Z"
                  fill="#E84814"
                />
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M20.3305 29.7692C20.1625 29.6074 18.8584 28.7584 17.2599 28.7584C17.0811 28.7584 16.9072 28.7685 16.7369 28.7845L15.3248 28.0303C15.3248 28.3945 15.4312 28.759 15.5245 29.0077C14.7078 29.2183 14.002 29.4859 13.3893 29.4859L12.043 28.6772C12.043 29.3241 12.3796 29.9713 12.3796 29.9713C12.3796 29.9713 12.043 30.6183 12.043 31.2652L13.3893 30.4565C14.0017 30.4565 14.7074 30.724 15.5245 30.9346C15.4312 31.1836 15.3248 31.5482 15.3248 31.9121L16.7369 31.1578C16.9072 31.1739 17.0811 31.184 17.2599 31.184C18.8584 31.184 20.1625 30.3346 20.3305 30.1731C20.4991 30.012 20.4985 29.9304 20.3305 29.7692Z"
                  fill="#E84814"
                />
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M33.993 18.5485C33.9157 18.4677 33.3139 18.0429 32.5762 18.0429C32.4935 18.0429 32.4132 18.0481 32.3343 18.0561L31.6829 17.6787C31.6829 17.8606 31.7317 18.0432 31.7745 18.1676C31.3978 18.2729 31.072 18.4067 30.7893 18.4067L30.168 18.0021C30.168 18.3258 30.3235 18.6492 30.3235 18.6492C30.3235 18.6492 30.168 18.9729 30.168 19.2963L30.7893 18.8917C31.0723 18.8917 31.3978 19.0252 31.7745 19.1308C31.7317 19.2552 31.6829 19.4374 31.6829 19.6197L32.3343 19.2423C32.4129 19.2503 32.4935 19.2555 32.5762 19.2555C33.3139 19.2555 33.9157 18.8307 33.993 18.7499C34.0706 18.6698 34.0706 18.629 33.993 18.5485Z"
                  fill="#E84814"
                />
              </svg>
            }
          />
        </div>
      </div>
    </section>
  );
};
