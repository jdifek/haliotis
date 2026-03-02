import React from "react";

type ButtonWithIconProps = {
  label: string;
  icon: React.ReactNode;
  onClick?: () => void;
  width?: string;
  height?: string;
  textColor?: string;
  className?: string;
  style?: React.CSSProperties;
  bgColor?: string;       // фон кнопки, дефолт #e84814
  iconBgColor?: string;   // фон иконки, дефолт #fff
};

export const ButtonWithIcon: React.FC<ButtonWithIconProps> = ({
  label,
  icon,
  onClick,
  style,
  width = "140px",
  height = "48px",
  textColor = "text-white",
  className = "",
  bgColor,
  iconBgColor,
}) => {
  return (
    <button
      onClick={onClick}
      className={`flex items-center cursor-pointer justify-between gap-0.5 rounded-full py-0.5 pl-4 pr-0.5 transition-all ${!bgColor ? "bg-[#e84814] hover:bg-[#d63f0f]" : "hover:opacity-90"} ${className}`}
      style={{ width, height, ...(bgColor ? { background: bgColor } : {}), ...style }}
    >
      <span className={`text-[15px] font-bold leading-[120%] ${textColor}`}>
        {label}
      </span>
      <div
        className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full"
        style={{ background: iconBgColor ?? "#fff" }}
      >
        {icon}
      </div>
    </button>
  );
};