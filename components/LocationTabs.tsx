"use client";

import { useState } from "react";

export type LocationTab = {
  id: string;
  label: string;
};

export const LOCATION_TABS: LocationTab[] = [
  { id: "peniche", label: "Peniche" },
  { id: "sesimbra", label: "Sesimbra" },
  { id: "madeira", label: "Madeira" },
  { id: "santa-maria", label: "Santa Maria" },
  { id: "faial", label: "Faial" },
  { id: "sao-vicente", label: "Sao Vicente" },
];

export const LOCATION_COLORS: Record<string, string> = {
  peniche: "#f49519",
  sesimbra: "#a0c52e",
  madeira: "#e52924",
  "santa-maria": "#fed402",
  faial: "#1b5ba7",
  "sao-vicente": "#7acbe2",
};

export const LOCATION_DESCRIPTIONS: Record<string, string> = {
  peniche:
    "Learn how to scuba dive in Peniche is an incredible experience that will allow you to see amazing creatures in their natural habitat and visit the best scuba diving spots. The beginner PADI courses are internationally recognised which allow you to scuba dive anywhere in the world.",
  sesimbra:
    "Discover scuba diving in Sesimbra, one of Portugal's most beautiful diving destinations. Experience crystal-clear waters and diverse marine life while learning from certified PADI instructors in a stunning coastal setting.",
  madeira:
    "Explore the underwater wonders of Madeira with our PADI courses. This Atlantic paradise offers year-round diving conditions and breathtaking marine biodiversity perfect for beginners and experienced divers alike.",
  "santa-maria":
    "Experience world-class diving in Santa Maria, Azores. Known for its encounters with mobula rays and blue sharks, this destination offers unforgettable diving experiences with our certified PADI instructors.",
  faial:
    "Dive into the volcanic underwater landscapes of Faial in the Azores. Our PADI courses will guide you through unique dive sites featuring dramatic rock formations and abundant Atlantic marine life.",
  "sao-vicente":
    "Start your diving journey in São Vicente, Madeira. With excellent visibility and rich marine ecosystems, this location is perfect for completing your PADI certification in a beautiful island setting.",
};

type Props = {
  activeTab: string;
  onTabChange: (tab: string) => void;
  tabs?: LocationTab[];
  className?: string;
};

export const LocationTabs: React.FC<Props> = ({
  activeTab,
  onTabChange,
  tabs = LOCATION_TABS,
  className = "",
}) => {
  const activeColor = LOCATION_COLORS[activeTab] ?? "#e84814";

  return (
    <>
      {/* Desktop tabs */}
      <div className={`hidden md:flex items-end gap-6 ${className}`}>
        {tabs.map((tab) => {
          const isActive = tab.id === activeTab;
          const color = LOCATION_COLORS[tab.id] ?? "#e84814";
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className="relative pb-3 text-[16px] font-medium leading-[160%] text-[#111] transition-colors hover:opacity-80 cursor-pointer"
              style={{ fontFamily: "var(--font-family)" }}
            >
              {tab.label}
              {/* Underline */}
              <span
                className="absolute bottom-0 left-0 w-full h-[2px] rounded-full transition-all duration-300"
                style={{
                  backgroundColor: color,
                  opacity: isActive ? 1 : 0,
                }}
              />
            </button>
          );
        })}
      </div>

      {/* Mobile: single active color bar hint under label */}
      <div
        className="md:hidden w-full h-[3px] rounded-full mt-1"
        style={{ backgroundColor: activeColor }}
      />
    </>
  );
};

/* -------------------------------------------------------
   Mobile accordion version — exported separately
------------------------------------------------------- */
type MobileAccordionProps = {
  activeTab: string;
  onTabChange: (tab: string) => void;
  tabs?: LocationTab[];
};

export const LocationTabsMobile: React.FC<MobileAccordionProps> = ({
  activeTab,
  onTabChange,
  tabs = LOCATION_TABS,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const activeLabel = tabs.find((t) => t.id === activeTab)?.label ?? "";
  const activeColor = LOCATION_COLORS[activeTab] ?? "#e84814";

  return (
    <div className="md:hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between rounded-[10px] px-3 py-2 h-[42px] bg-white border cursor-pointer"
        style={{ borderColor: activeColor }}
      >
        <span className="text-[16px] font-semibold leading-[160%] text-[#111]">
          {activeLabel}
        </span>
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          className={`transition-transform flex-shrink-0 ${isOpen ? "rotate-180" : ""}`}
        >
          <path
            d="M17.8534 9.85369L12.8537 14.8534C12.8073 14.8999 12.7522 14.9367 12.6915 14.9619C12.6308 14.9871 12.5657 15 12.5 15C12.4343 15 12.3692 14.9871 12.3085 14.9619C12.2478 14.9367 12.1927 14.8999 12.1463 14.8534L7.14663 9.85369C7.07663 9.78377 7.02895 9.69465 7.00963 9.59761C6.9903 9.50058 7.00021 9.39999 7.03808 9.30858C7.07595 9.21718 7.1401 9.13907 7.22239 9.08413C7.30468 9.0292 7.40142 8.99992 7.50036 9H17.4996C17.5986 8.99992 17.6953 9.0292 17.7776 9.08413C17.8599 9.13907 17.924 9.21718 17.9619 9.30858C17.9998 9.39999 18.0097 9.50058 17.9904 9.59761C17.971 9.69465 17.9234 9.78377 17.8534 9.85369Z"
            fill="black"
          />
        </svg>
      </button>

      {isOpen && (
        <div className="mt-2 bg-white rounded-[10px] border-2 border-gray-200 overflow-hidden">
          <div className="flex flex-col gap-[10px] p-2">
            {tabs.map((tab) => {
              const isSelected = tab.id === activeTab;
              const color = LOCATION_COLORS[tab.id] ?? "#e84814";
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    onTabChange(tab.id);
                    setIsOpen(false);
                  }}
                  className="flex items-center justify-between rounded-[10px] px-3 py-2 h-[40px] border-2 cursor-pointer transition-colors"
                  style={
                    isSelected
                      ? { backgroundColor: color, borderColor: color }
                      : { backgroundColor: "white", borderColor: "#d9d9d9" }
                  }
                >
                  <span
                    className={`text-[16px] font-normal leading-[140%] ${isSelected ? "text-white" : "text-[#111]"}`}
                  >
                    {tab.label}
                  </span>
                  {isSelected && (
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                      <path
                        d="M9.8537 6.14663L14.8534 11.1463C14.8999 11.1927 14.9367 11.2478 14.9619 11.3085C14.9871 11.3692 15 11.4343 15 11.5C15 11.5657 14.9871 11.6308 14.9619 11.6915C14.9367 11.7522 14.8999 11.8073 14.8534 11.8537L9.8537 16.8534C9.78377 16.9234 9.69465 16.971 9.59762 16.9904C9.50058 17.0097 9.39999 16.9998 9.30859 16.9619C9.21718 16.924 9.13907 16.8599 9.08414 16.7776C9.0292 16.6953 8.99992 16.5986 9 16.4996L9 6.50036C8.99992 6.40142 9.0292 6.30468 9.08414 6.22239C9.13907 6.1401 9.21718 6.07595 9.30859 6.03808C9.39999 6.00021 9.50058 5.99031 9.59761 6.00963C9.69465 6.02895 9.78377 6.07663 9.8537 6.14663Z"
                        fill="white"
                      />
                    </svg>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};