import React from "react";
import Card from "./Card";

interface LegalInfo {
  logo: string;
  name: string;
}

export const LegalInfo = () => {
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
    <div className="mx-auto max-w-[1920px] bg-[#ffff] py-8 md:py-12 px-4 md:px-8 lg:px-[158px]">
      <h2 className="text-black text-[24px] font-medium leading-[140%] mb-8">
        Informação Legal
      </h2>
      
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
  );
};