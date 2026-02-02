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
};

export const ButtonWithIcon: React.FC<ButtonWithIconProps> = ({
  label,
  icon,
  onClick,
  style,
  width = "140px",
  height = "48px",
  textColor = 'text-white',
  className = "",
}) => {
  return (
    <button
      onClick={onClick}
      className={`flex items-center cursor-pointer justify-between gap-0.5 rounded-full bg-[#e84814] py-0.5 pl-4 pr-0.5 transition-all hover:bg-[#d63f0f] ${className}`}
      style={{ width, height, ...style }}
    >
      <span className={`text-[15px] font-bold leading-[120%] ${textColor}`}>
      {label}
      </span>
      <div  className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full bg-white">
      {icon}
      </div>
    </button>
  );
};