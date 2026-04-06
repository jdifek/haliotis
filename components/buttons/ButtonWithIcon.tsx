import React from "react";
import Link from "next/link";

type ButtonWithIconProps = {
  label: string;
  icon: React.ReactNode;
  onClick?: () => void;
  href?: string;
  width?: string;
  height?: string;
  textColor?: string;
  className?: string;
  style?: React.CSSProperties;
  bgColor?: string;
  iconBgColor?: string;
};

export const ButtonWithIcon: React.FC<ButtonWithIconProps> = ({
  label,
  icon,
  onClick,
  href,
  style,
  width = "140px",
  height = "48px",
  textColor = "text-white",
  className = "",
  bgColor,
  iconBgColor,
}) => {
  const inner = (
    <>
      <span className={`text-[15px] font-bold leading-[120%] ${textColor}`}>
        {label}
      </span>
      <div
        className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full"
        style={{ background: iconBgColor ?? "#fff" }}
      >
        {icon}
      </div>
    </>
  );

  const sharedClassName = `flex items-center cursor-pointer justify-between gap-0.5 rounded-full py-0.5 pl-4 pr-0.5 transition-all ${
    !bgColor ? "bg-[#e84814] hover:bg-[#d63f0f]" : "hover:opacity-90"
  } ${className}`;

  const sharedStyle = {
    width,
    height,
    ...(bgColor ? { background: bgColor } : {}),
    ...style,
  };

  if (href) {
    return (
      <Link href={href} className={sharedClassName} style={sharedStyle}>
        {inner}
      </Link>
    );
  }

  return (
    <button
      onClick={onClick}
      className={sharedClassName}
      style={sharedStyle}
    >
      {inner}
    </button>
  );
};