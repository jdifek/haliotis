type CarouselControlsProps = {
  currentSlide: number;
  totalSlides: number;
  onPrev: () => void;
  onNext: () => void;
  theme?: 'light' | 'dark';
  progressClass?: string;
};

export const CarouselControls: React.FC<CarouselControlsProps> = ({
  currentSlide,
  totalSlides,
  onPrev,
  onNext,
  theme = 'dark',
  progressClass = '',
}) => {
  const progress = ((currentSlide + 1) / totalSlides) * 100;
  const bgColor = theme === 'light' ? 'bg-white' : 'bg-black';
  const bgOpacity = theme === 'light' ? 'bg-white/30' : 'bg-black/30';

  return (
    <div className="flex justify-between items-center gap-4 lg:gap-[40px]">
   {/* Progress Bar */}
<div
  className={`relative h-1.5 overflow-hidden  rounded-full ${bgOpacity} w-[200px] lg:w-[275px]`}
>
  <div
    className={`absolute left-0 top-0 h-full ${bgColor} transition-all duration-300`}
    style={{ width: `${progress}%` }}
  />
</div>   {/* Progress Bar */}
    

      {/* Arrow Buttons */}
      <div className="flex gap-3 lg:gap-[24px]">
        {/* Previous Button */}
        <button
          onClick={onPrev}
          className="flex h-12 w-12 cursor-pointer items-center justify-center rounded-full bg-[#e84814] transition-all hover:bg-[#d03d0f] lg:h-16 lg:w-16"
        >
          <svg className="h-5 w-5 lg:h-6 lg:w-6" viewBox="0 0 20 20" fill="none">
            <path
              d="M2.5 7.50008H13.75C15.8211 7.50008 17.5 9.17901 17.5 11.2501C17.5 13.3211 15.8211 15.0001 13.75 15.0001H10M2.5 7.50008L5.83333 4.16675M2.5 7.50008L5.83333 10.8334"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>

        {/* Next Button */}
        <button
          onClick={onNext}
          className="flex h-12 w-12 cursor-pointer items-center justify-center rounded-full bg-[#e4e4e4] transition-all hover:bg-white lg:h-16 lg:w-16"
        >
          <svg className="h-5 w-5 lg:h-6 lg:w-6" viewBox="0 0 20 20" fill="none">
            <path
              d="M17.5 7.50008H6.25C4.17893 7.50008 2.5 9.17901 2.5 11.2501C2.5 13.3211 4.17893 15.0001 6.25 15.0001H10M17.5 7.50008L14.1667 4.16675M17.5 7.50008L14.1667 10.8334"
              stroke={'#111111'}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};