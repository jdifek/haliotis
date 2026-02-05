import React from "react";
import Card from "./Card";

interface PaymentMethod {
  logo: string;
  name: string;
}

export const PaymentMethods = () => {
  const paymentMethods: PaymentMethod[] = [
    { 
      logo: "/Rectangle 8-3.png", 
      name: "MB WAY" 
    },
    { 
      logo: "/Rectangle 8-3.png", 
      name: "MB MULTIBANCO" 
    },
    { 
      logo: "/Rectangle 8-3.png", 
      name: "VISA" 
    },
    { 
      logo: "/Rectangle 8-3.png", 
      name: "MasterCard" 
    },
    { 
      logo: "/Rectangle 8-3.png", 
      name: "SIBS" 
    },
  ];

  return (
    <div className="mx-auto max-w-[1920px] bg-white py-8 md:py-12 px-4 md:px-8 lg:px-[158px]">
      <h2 className="text-black text-[24px] font-medium leading-[140%] mb-8">
        Meios de Pagamento
      </h2>
      
      <div className="flex flex-wrap justify-start gap-4">
        {paymentMethods.map((method, index) => (
          <Card
            key={index}
            logo={method.logo}
            name={method.name}
            alt={`${method.name} logo`}
          />
        ))}
      </div>
    </div>
  );
};