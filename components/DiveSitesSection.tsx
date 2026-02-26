"use client";

import { useState } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

type DiveSite = {
  id: string;
  name: string;
  fishes: number;
  difficulty: number;
  maxDepth: string;
  padiLevel: string;
  description: string;
  videoSrc?: string;
};

type LocationTab = {
  id: string;
  label: string;
  sites: DiveSite[];
};

// ─── SVG Icons ────────────────────────────────────────────────────────────────

const FishIcon = () => (
  <svg
    width="30"
    height="30"
    viewBox="0 0 30 30"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g clipPath="url(#clip_fish_ds)">
      <path
        d="M13.418 5.42578C10.6113 5.70117 7.75781 6.89648 5.54883 8.72461L5.08594 9.09961L7.57031 11.584C8.92969 12.9434 10.0664 14.0625 10.0898 14.0625C10.1074 14.0625 10.3359 13.9219 10.5879 13.7461C11.4492 13.1543 12.4043 12.7559 13.4941 12.5332C13.8223 12.4688 14.0977 12.4043 14.1035 12.3984C14.1152 12.3867 14.1152 10.8047 14.1094 8.87109L14.0918 5.36133L13.418 5.42578Z"
        fill="#E84814"
      />
      <path
        d="M15.8789 8.88867V12.4219L16.0137 12.4453C16.084 12.4629 16.3125 12.5039 16.5234 12.5391C16.7344 12.5801 17.1504 12.6855 17.4492 12.7852L17.9941 12.9551L18.2109 12.8262C18.3281 12.75 18.7324 12.4922 19.1016 12.252C20.0918 11.6133 20.4316 11.4668 21.0117 11.4375C21.3926 11.4141 21.5859 11.4375 21.9199 11.543L22.3418 11.6719L23.6309 10.3828L24.9141 9.09961L24.4512 8.72461C22.2363 6.89648 19.418 5.71289 16.5762 5.42578L15.8789 5.35547V8.88867Z"
        fill="#E84814"
      />
      <path
        d="M3.47483 10.793C1.4885 13.2012 0.328345 16.0137 0.0529544 19.1016C-0.0583737 20.373 0.000220045 20.6836 0.433814 21C0.592017 21.123 0.65647 21.123 3.54514 21.123C6.43381 21.123 6.49827 21.123 6.65647 21C6.99045 20.7539 7.04905 20.6133 7.09592 19.9395C7.15452 19.2012 7.27756 18.5039 7.44749 17.9473C7.62327 17.3789 8.13889 16.3359 8.51975 15.791L8.84788 15.3223L6.37522 12.8496C5.00999 11.4844 3.87913 10.3711 3.86155 10.3711C3.83811 10.3711 3.66819 10.5645 3.47483 10.793Z"
        fill="#E84814"
      />
      <path
        d="M24.832 11.6426L23.5664 12.9199L23.6836 13.2422C23.8301 13.6348 23.8535 14.4434 23.7363 14.7949C23.6895 14.9238 23.3848 15.6152 23.0508 16.3301L22.4473 17.6309L22.5645 18C22.7285 18.5332 22.8457 19.2188 22.9043 19.9395C22.9512 20.6133 23.0098 20.7539 23.3437 21C23.502 21.123 23.5664 21.123 26.4551 21.123C29.3437 21.123 29.4082 21.123 29.5664 21C30 20.6836 30.0586 20.373 29.9473 19.1016C29.707 16.4062 28.8398 14.0273 27.2871 11.8066C26.8535 11.1914 26.2031 10.3711 26.1387 10.3711C26.1211 10.3711 25.5293 10.9453 24.832 11.6426Z"
        fill="#E84814"
      />
      <path
        d="M20.2964 13.582C18.1929 14.9004 13.0484 18.2109 12.7906 18.4101C11.9468 19.0547 11.4253 20.2558 11.5015 21.3633C11.6304 23.2031 13.1363 24.6152 14.9702 24.6211C15.5796 24.6269 15.9663 24.539 16.5523 24.2578C17.1265 23.9765 17.5484 23.6133 17.8882 23.0976C18.2515 22.5468 22.0425 14.3906 22.0718 14.0918C22.1245 13.6054 21.7202 13.1836 21.2105 13.1836C20.9702 13.1836 20.8531 13.2363 20.2964 13.582Z"
        fill="#E84814"
      />
    </g>
    <defs>
      <clipPath id="clip_fish_ds">
        <rect width="30" height="30" fill="white" />
      </clipPath>
    </defs>
  </svg>
);

const PlaneIcon = () => (
  <svg
    width="30"
    height="30"
    viewBox="0 0 30 30"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g clipPath="url(#clip_plane_ds)">
      <path
        d="M7.07795 9.9209C3.70148 10.9884 1.14533 12.9147 0 14.5974C1.15541 16.2967 3.74725 18.2403 7.16766 19.3023C8.02641 17.9703 8.52539 16.3864 8.52539 14.6826C8.52539 12.9183 7.99254 11.2814 7.07795 9.9209ZM4.59961 14.808C4.11164 14.808 3.71701 14.4125 3.71701 13.9254C3.71701 13.4365 4.11158 13.0419 4.59961 13.0419C5.08764 13.0419 5.48309 13.4365 5.48309 13.9254C5.48309 14.4125 5.08758 14.808 4.59961 14.808Z"
        fill="#E84814"
      />
      <path
        d="M29.1456 14.7219C29.0842 14.5324 29.0842 14.3273 29.1456 14.1369L29.9549 11.6238C30.0739 11.2539 29.9567 10.8492 29.6592 10.5993C29.3607 10.3503 28.9414 10.3073 28.599 10.4894L23.8337 13.0273C21.4844 11.3272 19.1416 10.2597 16.8866 9.67377C16.851 9.22242 16.7291 8.64468 16.3776 8.20435C15.8246 7.51494 12.3273 8.52386 10.6253 9.18673C9.70428 9.28013 8.81898 9.4449 7.97852 9.66281C8.89223 11.1176 9.4232 12.8388 9.4232 14.6827C9.4232 16.4643 8.92879 18.1324 8.07004 19.556C9.31791 19.8728 10.6619 20.0696 12.0746 20.0962C12.1286 20.1786 12.1954 20.2546 12.276 20.3187L14.1538 21.8183C14.553 22.137 15.1325 22.0847 15.4685 21.7002L15.7367 21.3916C15.9363 21.1628 16.0151 20.8515 15.9473 20.5549C15.8805 20.2573 15.6745 20.0111 15.3953 19.8902L15.3174 19.8563C18.1263 19.3866 21.11 18.1983 24.1001 15.9745L28.599 18.3704C28.9414 18.5526 29.3607 18.5096 29.6592 18.2596C29.9567 18.0106 30.0739 17.605 29.9549 17.2361L29.1456 14.7219Z"
        fill="#E84814"
      />
    </g>
    <defs>
      <clipPath id="clip_plane_ds">
        <rect width="30" height="30" fill="white" />
      </clipPath>
    </defs>
  </svg>
);

// Checkmark circle — filled orange (как в дизайне)
const CheckFilled = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="11" stroke="#E84814" strokeWidth="1.5" />
    <path
      d="M7.5 12L10.5 15L16.5 9"
      stroke="#E84814"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

// Circle — empty grey
const CheckEmpty = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="11" stroke="#D9D9D9" strokeWidth="1.5" />
  </svg>
);

const ChevronDownWhite = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <path
      d="M17.8534 9.85369L12.8537 14.8534C12.8073 14.8999 12.7522 14.9367 12.6915 14.9619C12.6308 14.9871 12.5657 15 12.5 15C12.4343 15 12.3692 14.9871 12.3085 14.9619C12.2478 14.9367 12.1927 14.8999 12.1463 14.8534L7.14663 9.85369C7.07663 9.78377 7.02895 9.69465 7.00963 9.59761C6.9903 9.50058 7.00021 9.39999 7.03808 9.30858C7.07595 9.21718 7.1401 9.13907 7.22239 9.08413C7.30468 9.0292 7.40142 8.99992 7.50036 9L17.4996 9C17.5986 8.99992 17.6953 9.0292 17.7776 9.08413C17.8599 9.13907 17.924 9.21718 17.9619 9.30858C17.9998 9.39999 18.0097 9.50058 17.9904 9.59761C17.971 9.69465 17.9234 9.78377 17.8534 9.85369Z"
      fill="white"
    />
  </svg>
);

const AccordionArrow = ({ open }: { open: boolean }) => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    style={{
      transition: "transform 0.25s ease",
      transform: open ? "rotate(90deg)" : "rotate(0deg)",
      flexShrink: 0,
    }}
  >
    {/* right-pointing chevron, rotates to down when open */}
    <path
      d="M9.8537 6.14663L14.8534 11.1463C14.8999 11.1927 14.9367 11.2478 14.9619 11.3085C14.9871 11.3692 15 11.4343 15 11.5C15 11.5657 14.9871 11.6308 14.9619 11.6915C14.9367 11.7522 14.8999 11.8073 14.8534 11.8537L9.8537 16.8534C9.78377 16.9234 9.69465 16.971 9.59762 16.9904C9.50058 17.0097 9.39999 16.9998 9.30859 16.9619C9.21718 16.924 9.13907 16.8599 9.08414 16.7776C9.0292 16.6953 8.99992 16.5986 9 16.4996L9 6.50036C8.99992 6.40142 9.0292 6.30468 9.08414 6.22239C9.13907 6.1401 9.21718 6.07595 9.30859 6.03808C9.39999 6.00021 9.50058 5.99031 9.59761 6.00963C9.69465 6.02895 9.78377 6.07663 9.8537 6.14663Z"
      fill="#111"
    />
  </svg>
);

// ─── Rating row ───────────────────────────────────────────────────────────────

const RatingDots = ({
  filled,
  total = 5,
}: {
  filled: number;
  total?: number;
}) => (
  <div className="flex items-center gap-[5px]">
    {Array.from({ length: total }).map((_, i) =>
      i < filled ? <CheckFilled key={i} /> : <CheckEmpty key={i} />
    )}
  </div>
);

// ─── Video block ──────────────────────────────────────────────────────────────

const VideoBlock = ({ src, isMobile }: { src?: string; isMobile: boolean }) => (
  <div
    className="w-full overflow-hidden relative flex items-center justify-center"
    style={{
      borderRadius: 16,
      height: isMobile ? 210 : 671,
      background: "#0d1b35",
    }}
  >
    {src ? (
      <video
        src={src}
        className="w-full h-full object-cover"
        controls
        style={{ borderRadius: 16 }}
      />
    ) : (
      <div
        className="flex flex-col items-center gap-3"
        style={{ opacity: 0.45 }}
      >
        <svg width="56" height="56" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="10" stroke="white" strokeWidth="1" />
          <path d="M10 8.5l5.5 3.5-5.5 3.5V8.5z" fill="white" />
        </svg>
        <span
          style={{
            color: "white",
            fontSize: 13,
            fontFamily: "var(--font-family)",
          }}
        >
          Video
        </span>
      </div>
    )}
  </div>
);

// ─── Dive Site Card ───────────────────────────────────────────────────────────

const DiveSiteCard = ({ site }: { site: DiveSite }) => {
  const [open, setOpen] = useState(false);

  const labelStyle: React.CSSProperties = {
    fontFamily: "var(--font-family)",
    fontWeight: 600,
    fontSize: 15,
    lineHeight: "160%",
    color: "#000",
    opacity: 0.8,
  };

  const metaStyle: React.CSSProperties = {
    fontFamily: "var(--font-family)",
    fontWeight: 400,
    fontSize: 15,
    lineHeight: "160%",
    color: "#101010",
    opacity: 0.8,
  };

  return (
    <div className="w-full">
      {/* ── Bordered card ─────────────────────────────────── */}
      <div
        style={{ border: "4px solid #f1f1f1", borderRadius: 24, padding: 15 }}
      >
        {/* Site name */}
        <h3
          style={{
            fontFamily: "var(--font-family)",
            fontWeight: 500,
            fontSize: 24,
            lineHeight: "140%",
            color: "#111",
            marginBottom: 12,
          }}
        >
          {site.name}
        </h3>

        {/* Rating block with orange border */}
        <div
          style={{
            border: "1px solid #e84814",
            borderRadius: 10,
            padding: "8px 12px",
          }}
        >
          {/* Desktop layout: all in one flex row */}
          <div className="hidden lg:flex justify-between items-center gap-6">
            {/* Fishes */}
            <div className="flex items-center gap-2">
              <FishIcon />
              <span style={labelStyle}>Fishes</span>
              <RatingDots filled={site.fishes} />
            </div>

            {/* Difficulty */}
            <div className="flex items-center gap-2">
              <PlaneIcon />
              <span style={labelStyle}>Difficulty</span>
              <RatingDots filled={site.difficulty} />
            </div>

            {/* Max Depth */}
            <span style={labelStyle}>Maximum Depth {site.maxDepth}</span>

            {/* PADI — pushed to the right */}
            <span style={{ ...labelStyle }}>{site.padiLevel}</span>
          </div>

          {/* Mobile layout: Fishes + Difficulty stacked, then Depth + PADI below */}
          <div className="flex flex-col gap-2 lg:hidden">
            {/* Fishes row */}
            <div className="flex items-center gap-2">
              <FishIcon />
              <span style={labelStyle}>Fishes</span>
              <RatingDots filled={site.fishes} />
            </div>

            {/* Difficulty row */}
            <div className="flex items-center gap-2">
              <PlaneIcon />
              <span style={labelStyle}>Difficulty</span>
              <RatingDots filled={site.difficulty} />
            </div>

            {/* Max Depth */}
            <span style={metaStyle}>Maximum Depth {site.maxDepth}</span>

            {/* PADI */}
            <span style={metaStyle}>{site.padiLevel}</span>
          </div>
        </div>
        {/* Mobile: аккордион */}
        <div className="lg:hidden mt-3">
          <button
            onClick={() => setOpen(!open)}
            className="flex items-center justify-between w-full cursor-pointer py-2"
            style={{ background: "none", border: "none" }}
          >
            <span
              style={{
                fontFamily: "var(--font-family)",
                fontWeight: 500,
                fontSize: 16,
                lineHeight: "140%",
                color: "#111",
              }}
            >
              Details
            </span>
            <AccordionArrow open={open} />
          </button>

          <div
            style={{
              overflow: "hidden",
              maxHeight: open ? 9999 : 0,
              opacity: open ? 1 : 0,
              transition: "max-height 0.35s ease, opacity 0.25s ease",
            }}
          >
            <p
              style={{
                fontFamily: "var(--font-family)",
                fontWeight: 400,
                fontSize: 15,
                lineHeight: "160%",
                color: "#101010",
                opacity: 0.8,
                paddingTop: 4,
                paddingBottom: 16,
              }}
            >
              {site.description}
            </p>
            <VideoBlock src={site.videoSrc} isMobile={true} />
          </div>
        </div>

        {/* Desktop: всегда раскрыто */}
        <div className="hidden lg:block mt-4">
          <p
            style={{
              fontFamily: "var(--font-family)",
              fontWeight: 400,
              fontSize: 15,
              lineHeight: "160%",
              color: "#101010",
              opacity: 0.8,
              paddingTop: 4,
              paddingBottom: 16,
            }}
          >
            {site.description}
          </p>
          <VideoBlock src={site.videoSrc} isMobile={false} />
        </div>
      </div>
    </div>
  );
};

// ─── Sample data ──────────────────────────────────────────────────────────────

const locationTabs: LocationTab[] = [
  {
    id: "berlengas",
    label: "Berlengas",
    sites: [
      {
        id: "baixa-berlengas",
        name: "Baixa do Broeiro",
        fishes: 3,
        difficulty: 3,
        maxDepth: "18 meters",
        padiLevel: "PADI OWD (or equivalent)",
        description:
          "For many the best dive site in Portugal - This is one of the richest fish spots of the Natural Reserve of Berlengas. It is an advanced dive, frequently with currents. Sometimes can note be done due to the conditions of the sea, the experience of the divers and presence of fishermen in spot. When all conditions are good it is frequently amazing. The Reef comes from 40 meters of depth until 5 meters, in its higher point. The north wall drops to 25 meters, wherethere is a platform, then continuing until 40 meters. The spot is full of live. In the shallow areas there are lots of Sea-bream, feeding in the rock. The diving has a usual visibility of 10/15 meters.",
      },
      {
        id: "parados-berlengas",
        name: "Parados",
        fishes: 3,
        difficulty: 2,
        maxDepth: "18 meters",
        padiLevel: "PADI OWD (or equivalent)",
        description:
          "The Parados, located in the Estelas, are a site between 2 and 18 metres deep, usually a dive around a reef that comes to the surface. Triggerfish, Seabreams, and Cowbreams are very common. It's a place where there are plenty of Jewel Anemones. There is a well lined with Soft Coral. Sometimes it's a place where there can be some current, and where we can only dive when the sea is calm and windless.",
      },
    ],
  },
  {
    id: "estelas",
    label: "Estelas",
    sites: [
      {
        id: "baixa-estelas",
        name: "Baixa do Broeiro",
        fishes: 3,
        difficulty: 3,
        maxDepth: "18 meters",
        padiLevel: "PADI OWD (or equivalent)",
        description:
          "For many the best dive site in Portugal - This is one of the richest fish spots of the Natural Reserve of Berlengas. It is an advanced dive, frequently with currents. Sometimes can note be done due to the conditions of the sea, the experience of the divers and presence of fishermen in spot. When all conditions are good it is frequently amazing.",
      },
      {
        id: "parados-estelas",
        name: "Parados",
        fishes: 3,
        difficulty: 2,
        maxDepth: "18 meters",
        padiLevel: "PADI OWD (or equivalent)",
        description:
          "The Parados, located in the Estelas, are a site between 2 and 18 metres deep, usually a dive around a reef that comes to the surface. Triggerfish, Seabreams, and Cowbreams are very common.",
      },
    ],
  },
  {
    id: "farilhoes",
    label: "Farilhões",
    sites: [
      {
        id: "farilhoes-main",
        name: "Farilhões North",
        fishes: 4,
        difficulty: 4,
        maxDepth: "30 meters",
        padiLevel: "PADI AOW (or equivalent)",
        description:
          "Farilhões offers some of the most remote and pristine diving in the Berlengas archipelago. This site features dramatic underwater topography and frequent encounters with large groupers and barracuda.",
      },
    ],
  },
];

// ─── Main Component ───────────────────────────────────────────────────────────

const DiveSitesSection = () => {
  const [activeTab, setActiveTab] = useState("estelas");
  const currentLocation =
    locationTabs.find((t) => t.id === activeTab) ?? locationTabs[0];

  return (
    <section className="bg-white px-4 py-10 md:px-[30px] lg:px-[188px] md:py-[60px]">
      {/* ── Header ───────────────────────────────────────── */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between mb-8 md:mb-10">
        {/* Title */}
        <div>
          <h2
            style={{
              fontFamily: "var(--font-family)",
              fontWeight: 500,
              fontSize: 42,
              lineHeight: "130%",
              color: "#000",
            }}
          >
            Dive Sites
          </h2>
          <p
            style={{
              fontFamily: "var(--font-family)",
              fontWeight: 400,
              fontSize: 15,
              lineHeight: "160%",
              color: "#101010",
              opacity: 0.8,
            }}
          >
            Explore the best dive sites
          </p>
        </div>

        {/* Tab buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          {locationTabs.map((tab) => {
            const isActive = tab.id === activeTab;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className="flex-1 lg:flex-none flex items-center justify-center gap-1 cursor-pointer"
                style={
                  isActive
                    ? {
                        borderRadius: 8,
                        padding: "10px 14px",
                        height: 38,
                        background: "#e84814",
                        fontFamily: "var(--font-family)",
                        fontWeight: 700,
                        fontSize: 16,
                        lineHeight: "120%",
                        textTransform: "uppercase",
                        color: "#fff",
                        border: "none",
                      }
                    : {
                        borderRadius: 8,
                        padding: "10px 14px",
                        height: 38,
                        background: "#f1f1f1",
                        fontFamily: "var(--font-family)",
                        fontWeight: 400,
                        fontSize: 16,
                        lineHeight: "140%",
                        textTransform: "uppercase",
                        textAlign: "center" as const,
                        color: "#000",
                        border: "none",
                      }
                }
              >
                <span>{tab.label}</span>
                {isActive && <ChevronDownWhite />}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Cards ────────────────────────────────────────── */}
      <div className="flex flex-col gap-6">
        {currentLocation.sites.map((site) => (
          <DiveSiteCard key={site.id} site={site} />
        ))}
      </div>
    </section>
  );
};

export default DiveSitesSection;
