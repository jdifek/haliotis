import { ReactNode } from "react";

type BlackActionButtonProps = {
  label: string;
  icon: ReactNode;
  onClick?: () => void;
  className?: string;
};

export function BlackActionButton({
  label,
  icon,
  onClick,
  className = "",
}: BlackActionButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`relative mt-4 flex w-full items-center rounded-full bg-[#111] px-[16px] py-[15px] pr-[64px] hover:bg-[#e84814] transition-colors ${className}`}
    >
      <span className="font-bold text-[15px] leading-[1.2] text-white">
        {label}
      </span>

      <div className="absolute right-[4px] top-1/2 flex h-[40px] w-[40px] -translate-y-1/2 items-center justify-center rounded-full bg-white">
        {icon}
      </div>
    </button>
  );
}
