"use client";

import { useRef, useState } from "react";

// Оставлено для обратной совместимости — в новом коде используй tab.color
export const LOCATION_COLORS: Record<string, string> = {
  peniche: "#f49519",
  sesimbra: "#a0c52e",
  madeira: "#e52924",
  "santa-maria": "#fed402",
  faial: "#1b5ba7",
  "sao-vicente": "#7acbe2",
};

export interface Tab {
  id: string;
  label: string;
  color?: string;
}

interface TabsProps {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
  /** Цвет активного таба — берётся из tab.color, если не передан отдельно */
  activeColor?: string;
  className?: string;
  tabsContainerClassName?: string;
  tabButtonClassName?: string;
  activeTabClassName?: string;
  inactiveTabClassName?: string;
  underlineClassName?: string;
  activeUnderlineClassName?: string;
  inactiveUnderlineClassName?: string;
  fontSize?: string;
  gap?: string;
  underlineHeight?: string;
  underlineBottom?: string;
  /** @deprecated Передавай color в каждый Tab напрямую */
  useLocationColors?: boolean;
}

export const Tabs: React.FC<TabsProps> = ({
  tabs,
  activeTab,
  onTabChange,
  activeColor,
  className = "mb-8 md:mb-12",
  tabsContainerClassName = "relative flex gap-6",
  tabButtonClassName = "relative text-[24px] font-medium transition-colors",
  activeTabClassName = "text-black",
  inactiveTabClassName = "text-black/50 hover:text-black cursor-pointer",
  underlineClassName = "absolute -bottom-3 left-0 w-full h-[2px] transition-opacity",
  activeUnderlineClassName = "opacity-100",
  inactiveUnderlineClassName = "opacity-0 group-hover:opacity-50",
  fontSize,
  gap,
  underlineHeight,
  underlineBottom,
}) => {
  const tabRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const [isOpen, setIsOpen] = useState(false);

  const activeTabData = Array.isArray(tabs) ? tabs.find((t) => t.id === activeTab) ?? tabs[0] : null;
  const resolvedActiveColor =
    activeColor ?? activeTabData?.color ?? "#e84814";

  const getTabColor = (tab: Tab) =>
    activeColor ?? tab.color ?? "#e84814";

  const dynamicTabsContainerStyle = { ...(gap && { gap }) };
  const dynamicTabButtonStyle = { ...(fontSize && { fontSize }) };

  return (
    <>
      {/* ── Desktop ── */}
      <div className={`hidden md:block ${className}`}>
        <div
          className={tabsContainerClassName}
          style={dynamicTabsContainerStyle}
        >
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            const color = getTabColor(tab);

            return (
              <button
                key={tab.id}
                ref={(el) => { tabRefs.current[tab.id] = el; }}
                onClick={() => onTabChange(tab.id)}
                className={`${tabButtonClassName} ${
                  isActive ? activeTabClassName : inactiveTabClassName
                }`}
                style={dynamicTabButtonStyle}
              >
                {tab.label}
                <span
                  className={`${underlineClassName} ${
                    isActive ? activeUnderlineClassName : inactiveUnderlineClassName
                  }`}
                  style={{
                    backgroundColor: color,
                    ...(underlineHeight && { height: underlineHeight }),
                    ...(underlineBottom && { bottom: underlineBottom }),
                  }}
                />
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Mobile dropdown ── */}
      <div className="md:hidden">
        <button
          onClick={() => setIsOpen((v) => !v)}
          className="flex w-full items-center justify-between rounded-[10px] px-3 py-2 h-[42px] bg-white border"
          style={{ borderColor: resolvedActiveColor }}
        >
          <span className="text-[16px] font-semibold leading-[160%] text-[#111]">
            {activeTabData?.label}
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
                const color = getTabColor(tab);
                return (
                  <button
                    key={tab.id}
                    onClick={() => {
                      onTabChange(tab.id);
                      setIsOpen(false);
                    }}
                    className="flex items-center justify-between rounded-[10px] px-3 py-2 h-[40px] border-2"
                    style={
                      isSelected
                        ? { backgroundColor: color, borderColor: color }
                        : { backgroundColor: "white", borderColor: "#d9d9d9" }
                    }
                  >
                    <span
                      className={`text-[16px] font-normal leading-[140%] ${
                        isSelected ? "text-white" : "text-[#111]"
                      }`}
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
    </>
  );
};