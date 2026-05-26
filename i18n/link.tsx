// src/i18n/link.tsx

"use client";

import NextLink, { LinkProps } from "next/link";
import { usePathname } from "next/navigation";

type Props = LinkProps & {
  children: React.ReactNode;
  className?: string;
};

const LOCALE_REGEX = /^\/([a-z]{2})(\/|$)/;

export default function Link({
  href,
  children,
  ...props
}: Props) {
  const pathname = usePathname();

  const currentLocale =
    pathname.match(LOCALE_REGEX)?.[1] || "pt";

  let finalHref = href;

  if (typeof href === "string") {
    const hasLocale = LOCALE_REGEX.test(href);

    if (!hasLocale && href.startsWith("/")) {
      finalHref = `/${currentLocale}${href}`;
    }
  }

  return (
    <NextLink href={finalHref} {...props}>
      {children}
    </NextLink>
  );
}