import { useRef } from 'react';

export const LOCATION_COLORS: Record<string, string> = {
  peniche: "#f49519",
  sesimbra: "#a0c52e",
  madeira: "#e52924",
  "santa-maria": "#fed402",
  faial: "#1b5ba7",
  "sao-vicente": "#7acbe2",
};

interface Tab {
  id: string;
  label: string;
}

interface TabsProps {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
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
  underlineColor?: string;
  underlineHeight?: string;
  underlineBottom?: string;
  /** Если true — цвет подчёркивания берётся из LOCATION_COLORS по tab.id */
  useLocationColors?: boolean;
}

export const Tabs: React.FC<TabsProps> = ({
  tabs,
  activeTab,
  onTabChange,
  className = "mb-8 md:mb-12 hidden md:block",
  tabsContainerClassName = "relative flex gap-6 mb-6",
  tabButtonClassName = "relative text-[24px] font-medium transition-colors",
  activeTabClassName = "text-black",
  inactiveTabClassName = "text-black/50 hover:text-black cursor-pointer",
  underlineClassName = "absolute -bottom-3 left-0 w-full h-[2px] transition-opacity",
  activeUnderlineClassName = "opacity-100",
  inactiveUnderlineClassName = "opacity-0 group-hover:opacity-50",
  fontSize,
  gap,
  underlineColor,
  underlineHeight,
  underlineBottom,
  useLocationColors = false,
}) => {
  const tabRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  const dynamicTabsContainerStyle = {
    ...(gap && { gap }),
  };

  const dynamicTabButtonStyle = {
    ...(fontSize && { fontSize }),
  };

  return (
    <div className={className}>
      <div
        className={tabsContainerClassName}
        style={dynamicTabsContainerStyle}
      >
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;

          // Resolve underline color:
          // 1. useLocationColors → pick from LOCATION_COLORS map per tab
          // 2. underlineColor prop → use that for all tabs
          // 3. fallback → original orange #e84814
          const resolvedColor = useLocationColors
            ? (LOCATION_COLORS[tab.id] ?? "#e84814")
            : (underlineColor ?? "#e84814");

          const dynamicUnderlineStyle = {
            backgroundColor: resolvedColor,
            ...(underlineHeight && { height: underlineHeight }),
            ...(underlineBottom && { bottom: underlineBottom }),
          };

          return (
            <button
              key={tab.id}
              ref={(el) => {
                tabRefs.current[tab.id] = el;
              }}
              onClick={() => onTabChange(tab.id)}
              className={`${tabButtonClassName} ${
                isActive ? activeTabClassName : inactiveTabClassName
              }`}
              style={dynamicTabButtonStyle}
            >
              {tab.label}

              {/* Underline */}
              <span
                className={`${underlineClassName} ${
                  isActive ? activeUnderlineClassName : inactiveUnderlineClassName
                }`}
                style={dynamicUnderlineStyle}
              />
            </button>
          );
        })}
      </div>
    </div>
  );
};