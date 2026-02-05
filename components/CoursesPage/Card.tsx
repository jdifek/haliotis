import React from "react";
import Image from "next/image";

interface CardProps {
  logo: string;
  name: string;
  alt?: string;
  className?: string;
  heightBottomBlock?: string;
}

export default function Card({ 
  logo, 
  name, 
  alt,
  className = "",
  heightBottomBlock
}: CardProps) {
  return (
    <div className={`inline-block ${className}`}>
      {/* Зовнішній контейнер */}
      <div 
        className="flex md:w-[194px] w-[165px] flex-col gap-2 bg-[#f1f1f1] rounded-[24px] p-2"
      >
        {/* Контейнер з логотипом */}
        <div 
          className="bg-white rounded-2xl p-[15px] flex items-center justify-center overflow-hidden"
          style={{  height: '107px' }}
        >
          <Image
            src={logo}
            alt={alt || name}
            width={179}
            height={107}
            className="rounded-2xl object-contain w-full h-full"
            unoptimized
          />
        </div>

        {/* Контейнер з назвою */}
        <div 
          className="bg-white rounded-2xl px-[5px] py-3 flex items-center justify-center"
          style={{  height: heightBottomBlock ? heightBottomBlock : '66px' }}
        >
          <p className="text-[15px] leading-[160%] text-center text-black font-normal m-0 break-words hyphens-auto">
            {name}
          </p>
        </div>
      </div>
    </div>
  );
}