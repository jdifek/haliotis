import { useRef } from 'react';

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
  activeUnderlineClassName = "bg-[#e84814] opacity-100",
  inactiveUnderlineClassName = "bg-[#e84814] opacity-0 group-hover:opacity-50",
  fontSize,
  gap,
  underlineColor,
  underlineHeight,
  underlineBottom,
}) => {
  const tabRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  // Динамические стили
  const dynamicTabsContainerStyle = {
    ...(gap && { gap }),
  };

  const dynamicTabButtonStyle = {
    ...(fontSize && { fontSize }),
  };

  const dynamicUnderlineStyle = {
    ...(underlineColor && { backgroundColor: underlineColor }),
    ...(underlineHeight && { height: underlineHeight }),
    ...(underlineBottom && { bottom: underlineBottom }),
  };

  return (
    <div className={className}>
      <div 
        className={tabsContainerClassName}
        style={dynamicTabsContainerStyle}
      >
        {tabs.map((tab) => (
          <button
            key={tab.id}
            ref={(el) => {
              tabRefs.current[tab.id] = el;
            }}
            onClick={() => onTabChange(tab.id)}
            className={`${tabButtonClassName} ${
              activeTab === tab.id ? activeTabClassName : inactiveTabClassName
            }`}
            style={dynamicTabButtonStyle}
          >
            {tab.label}
            
            {/* Underline */}
            <span
              className={`${underlineClassName} ${
                activeTab === tab.id
                  ? activeUnderlineClassName
                  : inactiveUnderlineClassName
              }`}
              style={dynamicUnderlineStyle}
            />
          </button>
        ))}
      </div>
    </div>
  );
};