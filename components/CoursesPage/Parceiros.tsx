import Image from "next/image"

export const Parceiros = () => {
  return (
    <div className="mx-auto hidden md:block max-w-[1920px] bg-[#f1f1f1] py-4 md:py-8 px-4 md:px-8 lg:px-[158px]">
      <h2 className="flex justify-center text-black text-[24px] font-medium leading-[140%]">
        Parceiros
      </h2>
      <div className="flex justify-center mt-6">
        <div className="rounded-[24px] relative p-2 w-[755px] h-[265px] bg-white flex items-center">
          <Image src={'/Rectangle 8 (1).png'} alt="logo" className="w-[334px] flex " width={550} height={550}/>
          <div className="rounded-[16px] absolute right-2 p-[12px_5px] w-[364px] h-[249px] bg-[#f1f1f1] flex flex-col justify-center items-center text-center">
  <p className="font-sans font-normal text-[15px] leading-[160%] text-black mb-2">
    Hotel do Mar is the perfect Hotel to stay if you are diving with us!
  </p>
  <a 
    href="#" 
    className="underline decoration-solid decoration-[#e84814] text-[#e84814] text-[15px] leading-[160%]"
  >
    Click here for more information.
  </a>
</div>
        </div>
      </div>
    </div>
  );
};
