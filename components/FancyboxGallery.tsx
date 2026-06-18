"use client";

import { useRef, useEffect } from "react";
import { Fancybox as NativeFancybox } from "@fancyapps/ui";
import "@fancyapps/ui/dist/fancybox/fancybox.css";

type GalleryImage = {
  src: string;
  thumb?: string;
  alt?: string;
};

type Props = {
  images: GalleryImage[];
  previewImage?: string; // главное фото (с "+10")
  totalCount?: number;
};

export function FancyboxGallery({ images, previewImage }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    NativeFancybox.bind(container, "[data-fancybox]", {});
    return () => {
      NativeFancybox.unbind(container);
      NativeFancybox.close();
    };
  }, []);

  // Собираем все фото: сначала previewImage, потом остальные из gallery
  const allImages = [
    ...(previewImage ? [{ src: previewImage }] : []),
    ...images.filter(img => img.src && img.src !== previewImage),
  ];

  if (allImages.length === 0) return null;

  const extraCount = allImages.length - 1;

  return (
    <div ref={containerRef} className="relative w-full h-full">
      {/* Главное превью */}
      <a
        data-fancybox="gallery"
        href={allImages[0].src}
        className="block absolute inset-0"
      >
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${allImages[0].src})` }}
        />
        <div className="absolute bottom-4 right-4 flex items-center gap-1.5 rounded-[12px] bg-black/50 px-3 py-2 cursor-pointer z-10">
           <svg width="20" height="18" viewBox="0 0 20 18" fill="none">
                  <path
                    d="M10 13.75C12.0709 13.75 13.75 12.0709 13.75 10C13.75 7.92906 12.0709 6.25 10 6.25C7.92906 6.25 6.25 7.92906 6.25 10C6.25 12.0709 7.92906 13.75 10 13.75ZM10 7.5C11.3806 7.5 12.5 8.61937 12.5 10C12.5 10.1728 12.3603 10.3125 12.1875 10.3125C12.0147 10.3125 11.875 10.1728 11.875 10C11.875 8.96469 11.0353 8.125 10 8.125C9.82719 8.125 9.6875 7.98531 9.6875 7.8125C9.6875 7.63969 9.82719 7.5 10 7.5Z"
                    fill="white"
                  />
                  <path
                    d="M10 15C12.7616 15 15 12.7619 15 10C15 7.23844 12.7616 5 10 5C7.23844 5 5 7.23844 5 10C5 12.7619 7.23844 15 10 15ZM10 5.625C12.4162 5.625 14.375 7.58375 14.375 10C14.375 12.4162 12.4162 14.375 10 14.375C7.58375 14.375 5.625 12.4162 5.625 10C5.625 7.58375 7.58375 5.625 10 5.625Z"
                    fill="white"
                  />
                  <path
                    d="M17.1875 5.625C17.3601 5.625 17.5 5.48509 17.5 5.3125C17.5 5.13991 17.3601 5 17.1875 5C17.0149 5 16.875 5.13991 16.875 5.3125C16.875 5.48509 17.0149 5.625 17.1875 5.625Z"
                    fill="white"
                  />
                  <path
                    d="M18.75 2.5C18.75 2.5 16.5625 2.5 16.25 2.5C15.9375 2.5 15.7556 2.50125 15.3772 2.12281C14.9988 1.74438 13.6466 0.392188 13.6466 0.392188C13.5878 0.333438 13.2281 0 12.8125 0C12.3969 0 7.64156 0 7.1875 0C6.73344 0 6.40687 0.33875 6.34812 0.397187C6.34812 0.397187 4.99625 1.74906 4.62281 2.1225C4.24937 2.49594 4.06812 2.5 3.75 2.5V1.5625C3.75 1.38969 3.61031 1.25 3.4375 1.25H1.5625C1.38969 1.25 1.25 1.38969 1.25 1.5625V2.5C0.559062 2.5 0 3.05906 0 3.75V7.5H4.96656C5.8875 5.64937 7.79281 4.375 10 4.375C12.2072 4.375 14.1125 5.64937 15.0334 7.5H20V3.75C20 3.05906 19.4409 2.5 18.75 2.5ZM3.125 2.5C2.7375 2.5 2.25563 2.5 1.875 2.5V1.875H3.125V2.5ZM17.1875 6.25C16.6697 6.25 16.25 5.83 16.25 5.3125C16.25 4.795 16.6697 4.375 17.1875 4.375C17.7053 4.375 18.125 4.795 18.125 5.3125C18.125 5.83 17.7053 6.25 17.1875 6.25Z"
                    fill="white"
                  />
                  <path
                    d="M15.625 10C15.625 13.1066 13.1066 15.625 10 15.625C6.89344 15.625 4.375 13.1066 4.375 10C4.375 9.34156 4.49406 8.71219 4.70187 8.125H0V16.25C0 16.9409 0.559062 17.5 1.25 17.5H18.75C19.4409 17.5 20 16.9409 20 16.25V8.125H15.2981C15.5059 8.71219 15.625 9.34156 15.625 10Z"
                    fill="white"
                  />
                </svg>
          <span className="text-[15px] text-white">{extraCount > 0 ? `${extraCount}` : allImages.length}</span>
        </div>
      </a>

      {/* Скрытые ссылки для остальных фото */}
      {allImages.slice(1).map((img, i) => (
        <a
          key={i}
          data-fancybox="gallery"
          href={img.src}
          style={{ display: 'none' }}
        />
      ))}
    </div>
  );
}