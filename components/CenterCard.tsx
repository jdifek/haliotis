import Image from "next/image";
import { ButtonWithIcon } from "./buttons/ButtonWithIcon";

type CenterCardProps = {
  image: string;
  title: string;
  description: string;
  slug: string;
  buttonColor: string;
  onMoreInfoClick: () => void;
  className?: string;
  imageFull?: string;
};

export const CenterCard: React.FC<CenterCardProps> = ({
  image,
  title,
  description,
  buttonColor,
  onMoreInfoClick,
  slug,
  className = "",
  imageFull,
}) => {
  return (
    <div
      className={`group relative flex-1 min-w-[220px] h-[460px] overflow-hidden rounded-[20px] ${className}`}
    >
      {/* Full-height background photo */}
      <div className="absolute inset-0">
        <img
          src={imageFull}
          alt={title}
          className="h-full w-full object-cover"
        />
      </div>

      {/* Small icon, top-left, overlaid on the photo */}
      {image && (
        <div className="absolute left-4 top-4 z-10">
          <Image src={image} alt="" width={86} height={86} className="h-auto w-[86px]" />
        </div>
      )}

      {/* Floating color panel */}
      <div
        className="absolute inset-x-3 bottom-3 z-10 flex flex-col gap-3 rounded-[16px] p-4 sm:inset-x-5 sm:bottom-5 sm:gap-4 sm:rounded-[20px] sm:p-5"
        style={{ backgroundColor: buttonColor }}
      >
        <div className="flex flex-col gap-2">
          <h3 className="text-[20px] font-medium leading-[140%] text-white sm:text-[24px]">
            {title}
          </h3>

          <p className="text-[14px] font-normal leading-[160%] text-white opacity-90 sm:text-[15px]">
            {description}
          </p>
        </div>

        <div className="hover-only-button max-h-0 opacity-0 overflow-hidden transition-all duration-300 ease-out group-hover:max-h-[48px] group-hover:opacity-100">
          <ButtonWithIcon
            href={`/centros/${slug}`}
            label="More info"
            onClick={onMoreInfoClick}
            bgColor="#fff"
            textColor="text-black"
            iconBgColor={buttonColor}
            width="100%"
            height="48px"
            icon={
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path
                  d="M7.5 15L12.5 10L7.5 5"
                  stroke="#fff"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            }
          />
        </div>
      </div>
    </div>
  );
};