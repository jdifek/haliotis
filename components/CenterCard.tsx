import { ButtonWithIcon } from "./buttons/ButtonWithIcon";

type CenterCardProps = {
  image: string;
  title: string;
  description: string;
  buttonColor: string;
  onMoreInfoClick: () => void;
};

export const CenterCard: React.FC<CenterCardProps> = ({
  image,
  title,
  description,
  buttonColor,
  onMoreInfoClick,
}) => {
  return (
<div className="relative w-full max-w-[363px] h-[468px] overflow-hidden rounded-[20px] p-5 lg:h-[550px] lg:pt-10">
{/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src={image}
          alt={title}
          width="364"
          height="550"
          className="h-full w-full object-cover"
        />
      </div>

      {/* Dark Overlay */}
      <div className="absolute inset-0 z-[1] bg-black/40" />

      {/* Content */}
      <div className="relative z-10 flex h-full flex-col justify-between">
        {/* Top Content */}
        <div>
          <h3 className="mb-4 text-[24px] font-medium leading-[140%] text-white">
            {title}
          </h3>
          <p className="text-[15px] mb-4 font-normal leading-[160%] text-white opacity-80">
            {description}
          </p>
            {/* Bottom Button */}
        <div className="flex justify-start">
          <ButtonWithIcon
            label="More Info"
            onClick={onMoreInfoClick}
            className={`!bg-[${buttonColor}] hover:opacity-90`}
            style={{ backgroundColor: buttonColor }}
            width="148px"
            height="48px"
            icon={
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
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
        </div>
        </div>

      
      </div>
    </div>
  );
};