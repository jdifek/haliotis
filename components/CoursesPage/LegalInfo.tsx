"use client";

import React, { useState } from "react";
import Card from "./Card";

interface LegalInfo {
  logo: string;
  name: string;
}

export const LegalInfo = () => {
  const [isOpen, setIsOpen] = useState(false);

  const legalEntities: LegalInfo[] = [
    { 
      logo: "/Rectangle 8-3.png", 
      name: "Licenced by Instituto do Desporto de Portugal" 
    },
    { 
      logo: "/Rectangle 8-3.png", 
      name: "Tourism licence 9/2009" 
    },
    { 
      logo: "/Rectangle 8-3.png", 
      name: "Licened by Instituto da conservação da Natureza" 
    },
    { 
      logo: "/Rectangle 8-3.png", 
      name: "Company registered in RNAAT with activities recognized as Nature Tourism" 
    },
    { 
      logo: "/Rectangle 8-3.png", 
      name: "Operador Marítimo Turístico with licence Nº17 by Capitania do Porto de Peniche" 
    },
    { 
      logo: "/Rectangle 8-3.png", 
      name: "All insurance by Mútua dos Pescadores" 
    },
    { 
      logo: "/Rectangle 8-3.png", 
      name: "Livro de Reclamações" 
    },
  ];

  return (
    <div className="mx-auto max-w-[1920px] bg-white pb-8 md:py-12 px-4 md:px-8 lg:px-[158px]">
      {/* Desktop - обычный заголовок */}
      <h2 className="hidden md:block text-black text-[24px] font-medium leading-[140%] mb-8">
        Informação Legal
      </h2>

      {/* Mobile - аккордеон заголовок */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden w-full flex items-center justify-between text-black text-[24px] font-medium leading-[140%] mb-8"
      >
        <span>Informação Legal</span>
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={`transition-transform ${isOpen ? '' : 'rotate-180'}`}
        >
          <path
            d="M17.8534 14.1463L12.8537 9.14663C12.8073 9.10015 12.7522 9.06327 12.6915 9.03811C12.6308 9.01295 12.5657 9 12.5 9C12.4343 9 12.3692 9.01295 12.3085 9.03811C12.2478 9.06327 12.1927 9.10015 12.1463 9.14663L7.14663 14.1463C7.07663 14.2162 7.02895 14.3053 7.00963 14.4024C6.9903 14.4994 7.00021 14.6 7.03808 14.6914C7.07595 14.7828 7.1401 14.8609 7.22239 14.9159C7.30468 14.9708 7.40142 15.0001 7.50036 15L17.4996 15C17.5986 15.0001 17.6953 14.9708 17.7776 14.9159C17.8599 14.8609 17.924 14.7828 17.9619 14.6914C17.9998 14.6 18.0097 14.4994 17.9904 14.4024C17.971 14.3053 17.9234 14.2162 17.8534 14.1463Z"
            fill="black"
          />
        </svg>
      </button>

      {/* Контент - на десктопе всегда видим, на мобилке по клику */}
      <div className={`${isOpen ? 'block' : 'hidden'} md:block`}>
        <div className="flex flex-wrap justify-start gap-4">
          {legalEntities.map((entity, index) => (
            <Card
              heightBottomBlock={'131px'}
              key={index}
              logo={entity.logo}
              name={entity.name}
              alt={`${entity.name} logo`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};