import Image from "next/image";

type Partner = { id: number; image_url: string; title: string; description: string; url: string };
type Props = { partners: Partner[] };

export const Parceiros = ({ partners }: Props) => {
  if (!partners?.length) return null;
  return (
    <div className="mx-auto hidden md:block max-w-[1920px] bg-[#f1f1f1] py-4 md:py-8 px-4 md:px-8 lg:px-[188px]">
      <h2 className="flex justify-center text-black text-[24px] font-medium leading-[140%]">
        Parceiros
      </h2>
      <div className="flex justify-center mt-6 gap-6 flex-wrap">
        {partners.map((partner) => (
          <div key={partner.id} className="rounded-[24px] relative p-2 w-[755px] h-[265px] bg-white flex items-center">
            <Image
              src={partner.image_url}
              alt={partner.title}
              className="w-[334px] flex"
              width={550}
              height={550}
            />
            <div className="rounded-[16px] absolute right-2 p-[12px_5px] w-[364px] h-[249px] bg-[#f1f1f1] flex flex-col justify-center items-center text-center">
              <p className="font-sans font-normal text-[15px] leading-[160%] text-black mb-2">
                {partner.description}
              </p>
              <a
                href={partner.url}
                className="underline decoration-solid decoration-[#e84814] text-[#e84814] text-[15px] leading-[160%]"
              >
                Click here for more information.
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};