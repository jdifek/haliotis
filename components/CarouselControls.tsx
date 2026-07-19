import { useEffect, useRef, useState } from 'react';
import type { Swiper as SwiperType } from 'swiper';

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
}) => {
  const rootRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState<number | null>(null);

  useEffect(() => {
    // Поднимаемся по дереву вверх, пока не найдём предка,
    // внутри которого есть .swiper. Не зависит от конкретных
    // классов-обёрток родителя — работает для любой структуры.
    let node: HTMLElement | null = rootRef.current;
    let swiperEl: (HTMLElement & { swiper?: SwiperType }) | null = null;
    let depth = 0;

    while (node && depth < 10 && !swiperEl) {
      node = node.parentElement;
      swiperEl =
        node?.querySelector<HTMLElement & { swiper?: SwiperType }>('.swiper') ?? null;
      depth++;
    }

    const swiper = swiperEl?.swiper;
    if (!swiper) return;

    const update = () => setProgress(swiper.progress);

    update(); // начальное состояние
    swiper.on('progress', update);
    swiper.on('slideChange', update);
    swiper.on('resize', update);

    return () => {
      swiper.off('progress', update);
      swiper.off('slideChange', update);
      swiper.off('resize', update);
    };
  }, []);

  const computedProgress =
    progress !== null
      ? Math.min(1, Math.max(0, progress)) * 100
      : ((currentSlide + 1) / totalSlides) * 100; // fallback, если swiper не найден

  const bgColor = theme === 'light' ? 'bg-white' : 'bg-black';
  const bgOpacity = theme === 'light' ? 'bg-white/30' : 'bg-black/30';

  return (
    <div ref={rootRef} className="z-[60] flex justify-between items-center gap-4 lg:gap-[40px]">
      <div
        className={`relative h-1.5 overflow-hidden rounded-full ${bgOpacity} w-[200px] lg:w-[275px]`}
      >
        <div
          className={`absolute left-0 top-0 h-full ${bgColor} transition-all duration-300`}
          style={{ width: `${computedProgress}%` }}
        />
      </div>

      <div className="flex gap-3 lg:gap-[24px]">
        <button
          onClick={onPrev}
          className="flex h-12 w-12 cursor-pointer items-center justify-center rounded-full bg-[#e84814] transition-all hover:bg-[#d03d0f]"
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

        <button
          onClick={onNext}
          className="flex h-12 w-12 cursor-pointer items-center justify-center rounded-full bg-[#e4e4e4] transition-all hover:bg-white"
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