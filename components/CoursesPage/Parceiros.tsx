import Image from "next/image";

type Partner = {
  id: number;
  image_url: string;
  title: string;
  description: string | null;
  url: string | null;
  position?: number;
};

type Props = { terms: any,partners: Partner[]; title: string };

export const Parceiros = ({ terms,partners, title }: Props) => {
  if (!partners?.length) return null;

  const sortedPartners = [...partners].sort(
    (a, b) => (a.position ?? 0) - (b.position ?? 0)
  );

  return (
    <div className="mx-auto max-w-[1920px] bg-[#f1f1f1] px-4 py-4 md:px-8 md:py-8 lg:px-[188px]">
      <h2 className="flex justify-center text-center text-[20px] font-medium leading-[140%] text-black sm:text-[22px] lg:text-[24px]">
        {title}
      </h2>

      <div className="mt-6 flex flex-wrap justify-center gap-4 lg:gap-6">
        {sortedPartners.map((partner) => {
          const hasContent = Boolean(partner.description || partner.url);

          return (
            <div
              key={partner.id}
              className="relative flex h-[180px] w-full items-center rounded-[24px] bg-white p-2 sm:h-[220px] sm:w-[360px] lg:h-[265px] lg:w-[755px]"
            >
              <div className="flex h-full w-[40%] flex-shrink-0 items-center justify-center sm:w-[45%] lg:w-[334px]">
                <Image
                  src={partner.image_url}
                  alt={partner.title}
                  className="h-auto w-full max-w-[200px] object-contain lg:max-w-[334px]"
                  width={550}
                  height={550}
                />
              </div>

              {hasContent ? (
                <div className="flex h-[calc(100%-8px)] w-[60%] flex-col items-center justify-center rounded-[16px] bg-[#f1f1f1] p-3 text-center sm:absolute sm:right-2 sm:w-[45%] lg:w-[364px]">
                  {partner.description && (
                    <p className="mb-2 font-sans text-[13px] font-normal leading-[160%] text-black lg:text-[15px]">
                      {partner.description}
                    </p>
                  )}
                  {partner.url && (
                    <a
                      href={partner.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[13px] leading-[160%] text-[#e84814] underline decoration-[#e84814] decoration-solid lg:text-[15px]"
                    >
                      {terms.click_to_more || "Click to more information"}
                    </a>
                  )}
                </div>
              ) : (
                <div className="h-[calc(100%-8px)] w-[60%] rounded-[16px] bg-[#f1f1f1] sm:absolute sm:right-2 sm:w-[45%] lg:w-[364px]" />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};