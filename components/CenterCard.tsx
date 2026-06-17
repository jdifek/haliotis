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
      className={`relative w-full max-w-[363px] min-h-[320px] overflow-hidden rounded-[20px] p-5 lg:pt-10 ${className}`}
    >
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <img
          src={imageFull}
          alt={title}
          width={364}
          height={550}
          className="h-full w-full object-cover"
        />
      </div>

      {/* Overlay */}
      <div className="absolute inset-0 z-[1] bg-black/40" />

      {/* Content */}
      <div className="relative z-10 flex h-full flex-col">
        {/* Top */}
        <div>
          <h3 className="mb-4 text-[24px] font-medium leading-[140%] text-white">
            {title}
          </h3>

          <p className="text-[15px] font-normal leading-[160%] text-white opacity-80">
            {description}
          </p>
        </div>

        {/* Bottom */}
        <div className="mt-auto flex items-end justify-between pt-6">
          <ButtonWithIcon
            href={`/centros/${slug}`}
            label="More Info"
            onClick={onMoreInfoClick}
            className="hover:opacity-90"
            style={{ backgroundColor: buttonColor }}
            width="148px"
            height="48px"
            icon={
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
              >
                <path
                  d="M7.5 15L12.5 10L7.5 5"
                  stroke={buttonColor}
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            }
          />

          <Image
            src={image}
            alt={title}
            width={117}
            height={80}
          />
        </div>
      </div>
    </div>
  );
};