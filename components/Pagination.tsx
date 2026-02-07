"use client";
import { useState } from "react";

interface PaginationProps {
  totalPages: number;
  currentPage?: number;
  onPageChange?: (page: number) => void;
}

export const Pagination = ({
  totalPages,
  currentPage: controlledPage,
  onPageChange,
}: PaginationProps) => {
  const [internalPage, setInternalPage] = useState(1);
  
  // Используем контролируемое или внутреннее состояние
  const currentPage = controlledPage ?? internalPage;

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    
    if (onPageChange) {
      onPageChange(page);
    } else {
      setInternalPage(page);
    }
  };

  // Функция для генерации отображаемых страниц
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const delta = 2; // Сколько страниц показывать вокруг текущей

    // Если страниц мало, показываем все
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
      return pages;
    }

    // Всегда показываем первую страницу
    pages.push(1);

    // Определяем диапазон страниц вокруг текущей
    const start = Math.max(2, currentPage - delta);
    const end = Math.min(totalPages - 1, currentPage + delta);

    // Добавляем "..." если нужно
    if (start > 2) {
      pages.push("...");
    }

    // Добавляем страницы в диапазоне
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    // Добавляем "..." если нужно
    if (end < totalPages - 1) {
      pages.push("...");
    }

    // Всегда показываем последнюю страницу
    pages.push(totalPages);

    return pages;
  };

  const pageNumbers = getPageNumbers();

  return (
    <div className="flex items-center justify-between md:justify-start gap-2">
      {/* PREV Button */}
      <button
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="flex h-[38px] items-center cursor-pointer gap-2 rounded-lg bg-white px-[14px] py-[10px] uppercase transition-all hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
        style={{ fontFamily: "var(--font-family)" }}
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M14.1463 6.14663L9.14663 11.1463C9.10015 11.1927 9.06327 11.2478 9.03811 11.3085C9.01295 11.3692 9 11.4343 9 11.5C9 11.5657 9.01295 11.6308 9.03811 11.6915C9.06327 11.7522 9.10015 11.8073 9.14663 11.8537L14.1463 16.8534C14.2162 16.9234 14.3053 16.971 14.4024 16.9904C14.4994 17.0097 14.6 16.9998 14.6914 16.9619C14.7828 16.924 14.8609 16.8599 14.9159 16.7776C14.9708 16.6953 15.0001 16.5986 15 16.4996L15 6.50036C15.0001 6.40142 14.9708 6.30468 14.9159 6.22239C14.8609 6.1401 14.7828 6.07595 14.6914 6.03808C14.6 6.00021 14.4994 5.99031 14.4024 6.00963C14.3054 6.02895 14.2162 6.07663 14.1463 6.14663Z"
            fill="black"
          />
        </svg>
        <span className="text-[16px] font-bold leading-[120%] text-black">
          PREV
        </span>
      </button>

      {/* Page Numbers - Hidden on mobile */}
      <div className="hidden md:flex items-center gap-2">
        {pageNumbers.map((page, index) => {
          if (page === "...") {
            return (
              <div
                key={`dots-${index}`}
                className="flex h-[38px] w-[41px] cursor-pointer items-center justify-center rounded-lg bg-white px-[14px] py-[10px] opacity-30"
                style={{ fontFamily: "var(--font-family)" }}
              >
                <span className="text-[15px] font-normal leading-[120%] uppercase text-black">
                  ...
                </span>
              </div>
            );
          }

          const pageNumber = page as number;
          const isActive = pageNumber === currentPage;

          return (
            <button
              key={pageNumber}
              onClick={() => handlePageChange(pageNumber)}
              className={`flex h-[38px] min-w-[38px] cursor-pointer items-center justify-center rounded-lg px-[14px] py-[10px] uppercase transition-all ${
                isActive
                  ? "bg-[#e84814] text-white"
                  : "bg-white text-black hover:bg-gray-100"
              }`}
              style={{ fontFamily: "var(--font-family)" }}
            >
              <span className="text-[15px] font-normal leading-[120%]">
                {pageNumber}
              </span>
            </button>
          );
        })}
      </div>

      {/* Current page indicator - Visible only on mobile */}
      <div className="md:hidden flex h-[38px] min-w-[38px] items-center justify-center rounded-lg bg-[#e84814] px-[14px] py-[10px]"
        style={{ fontFamily: "var(--font-family)" }}>
        <span className="text-[15px] font-normal leading-[120%] text-white">
          {currentPage}
        </span>
      </div>

      {/* NEXT Button */}
      <button
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="flex h-[38px] items-center cursor-pointer gap-2 rounded-lg bg-[#e84814] px-[14px] py-[10px] uppercase transition-all hover:bg-[#d63f0f] disabled:cursor-not-allowed disabled:opacity-50"
        style={{ fontFamily: "var(--font-family)" }}
      >
        <span className="text-[16px] font-bold leading-[120%] text-white">
          NEXT
        </span>
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M9.8537 6.14663L14.8534 11.1463C14.8999 11.1927 14.9367 11.2478 14.9619 11.3085C14.9871 11.3692 15 11.4343 15 11.5C15 11.5657 14.9871 11.6308 14.9619 11.6915C14.9367 11.7522 14.8999 11.8073 14.8534 11.8537L9.8537 16.8534C9.78377 16.9234 9.69465 16.971 9.59762 16.9904C9.50058 17.0097 9.39999 16.9998 9.30859 16.9619C9.21718 16.924 9.13907 16.8599 9.08414 16.7776C9.0292 16.6953 8.99992 16.5986 9 16.4996L9 6.50036C8.99992 6.40142 9.0292 6.30468 9.08414 6.22239C9.13907 6.1401 9.21718 6.07595 9.30859 6.03808C9.39999 6.00021 9.50058 5.99031 9.59761 6.00963C9.69465 6.02895 9.78377 6.07663 9.8537 6.14663Z"
            fill="white"
          />
        </svg>
      </button>
    </div>
  );
};