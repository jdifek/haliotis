import Link from "next/link";

type BreadcrumbItem = {
  label: string;
  href?: string; // если нет href — считаем текущей страницей
};

type BreadcrumbsProps = {
  items: BreadcrumbItem[];
  className?: string;
  itemLabelColorWhite?: boolean;
};

export const Breadcrumbs = ({
  itemLabelColorWhite,
  items,
  className = "",
}: BreadcrumbsProps) => {
  return (
    <nav
      className={`flex items-center gap-2 text-sm ${className}`}
      aria-label="Breadcrumb"
    >
      {items.map((item, index) => {
        const isLast = index === items.length - 1;

        return (
          <div key={index} className="flex items-center gap-2">
            {item.href && !isLast ? (
              <Link
                href={item.href}
                className={`${
                  itemLabelColorWhite ? "text-[#ffff] " : "text-[#111] "
                } underline hover:text-[#e84814] transition-colors`}
              >
                {item.label}
              </Link>
            ) : (
              <span
                className={
                  isLast
                    ? "text-[#e84814]"
                    : itemLabelColorWhite
                    ? "text-[#ffff] "
                    : "text-[#111] "
                }
              >
                {item.label}
              </span>
            )}

            {!isLast && (
              <span
                className={`${
                  itemLabelColorWhite ? "text-[#ffff] " : "text-[#111] "
                }`}
              >
                /
              </span>
            )}
          </div>
        );
      })}
    </nav>
  );
};
