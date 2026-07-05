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
      <div className="flex md:w-[194px] w-[165px] flex-col gap-2 bg-[#f1f1f1] rounded-[24px] p-2">
        
        {/* Внешний контейнер логотипа — скругление, обрезка и ОТСТУП тут */}
        <div 
          className="bg-white rounded-2xl p-[15px] flex items-center justify-center overflow-hidden"
          style={{ height: '107px' }}
        >
          {/* Внутренняя обёртка под fill — занимает всё свободное место внутри padding */}
     {/* Контейнер з логотипом */}
<div 
  className="bg-white rounded-2xl p-[15px] flex items-center justify-center overflow-hidden isolate"
  style={{ height: '107px', borderRadius: '16px' }}
>
  <img
    src={logo}
    alt={alt || name}
    className="max-w-full max-h-full w-auto h-auto object-contain rounded-2xl"
  />
</div>
        </div>

        <div 
          className="bg-white rounded-2xl px-[5px] py-3 flex items-center justify-center"
          style={{ height: heightBottomBlock ? heightBottomBlock : '66px' }}
        >
          <p className="text-[15px] leading-[160%] text-center text-black font-normal m-0 break-words hyphens-auto">
            {name}
          </p>
        </div>
      </div>
    </div>
  );
}