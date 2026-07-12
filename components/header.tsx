/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import {
  usePathname,
  useRouter,
  useSelectedLayoutSegments,
} from "next/navigation";
import Link from "@/i18n/link";
import { useMenu } from "@/app/hooks/useMenu";

type Language = {
  prefix: string;
  label: string;
  default: boolean;
  icon: string;
};
type CartLocalItem = {
  type: "course" | "trip" | "travels";
  id: number | string;
  title?: string;
  price?: number;
  currency?: string;
  image?: string;
};
const MobileDynamicDropdown = ({
  item,
  centersData,
  coursesData,
  selectedCenter,
  setSelectedCenter,
  setMobileOpenDropdown,
  setIsMenuOpen,
  router,
}: {
  item: any;
  centersData: any[];
  coursesData: any[];
  selectedCenter: string;
  setSelectedCenter: (v: string) => void;
  setMobileOpenDropdown: (value: string | null) => void;
  setIsMenuOpen: (value: boolean) => void;
  router: any;
}) => {
  const children = item.children || [];
  const raw = item.rawItem || {};

  const isCenters = children.some(
    (child: any) => child.link_type === "dive_center"
  );
  const isCourses = children.length >= 5 && raw.menu_layout === "list";

  // ==================== CENTERS MOBILE ====================
  if (isCenters) {
    console.log(
      "centersData в дропдауне:",
      centersData.map((c) => ({ id: c.id, url: c.url }))
    );

    return (
      <div
        className="absolute rounded-lg -left-3.5 -top-2 z-10 w-[calc(100%_+_28px)] overflow-hidden rounded-t-lg"
        style={{ background: "#fff" }}
      >
        {/* Заголовок с кнопкой назад */}
        <button
          onClick={() => setMobileOpenDropdown(null)}
          className="flex h-[42px] w-full items-center justify-between px-[14px] py-[10px]"
        >
          <span className="text-[15px] font-normal uppercase leading-[120%] text-black">
            {item.label}
          </span>
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            className="rotate-180"
          >
            <path
              d="M17.8534 9.85369L12.8537 14.8534C12.8073 14.8999 12.7522 14.9367 12.6915 14.9619C12.6308 14.9871 12.5657 15 12.5 15C12.4343 15 12.3692 14.9871 12.3085 14.9619C12.2478 14.9367 12.1927 14.8999 12.1463 14.8534L7.14663 9.85369C7.07663 9.78377 7.02895 9.69465 7.00963 9.59761C6.9903 9.50058 7.00021 9.39999 7.03808 9.30858C7.07595 9.21718 7.1401 9.13907 7.22239 9.08413C7.30468 9.0292 7.40142 8.99992 7.50036 9H17.4996C17.5986 8.99992 17.6953 9.0292 17.7776 9.08413C17.8599 9.13907 17.924 9.21718 17.9619 9.30858C17.9998 9.39999 18.0097 9.50058 17.9904 9.59761C17.971 9.69465 17.9234 9.78377 17.8534 9.85369Z"
              fill="black"
            />
          </svg>
        </button>

        <div className="flex flex-col bg-[#1a1a3e] border-2 border-white rounded-lg">
          {centersData.map((center, index) => (
            <button
              key={center.id}
              onClick={() => {
                console.log("CLICK центр", center.id, center.url);
                setSelectedCenter(center.id);
                if (center.new_tab) {
                  window.open(center.url, "_blank");
                } else {
                  console.log("router.push →", center.url);
                  router.push(center.url);
                }
                setMobileOpenDropdown(null);
                setIsMenuOpen(false);
              }}
              className={`flex h-[52px] items-center cursor-pointer justify-between px-[14px] transition-all hover:bg-[#111d9e]
                ${selectedCenter === center.id ? "bg-[#111d9e]" : ""}
                ${index === centersData.length - 1 ? "rounded-b-lg" : ""}`}
            >
              {/* Название с цветом из API */}
              <span
                className="text-[15px] font-semibold uppercase leading-[160%]"
                style={{ color: center.color }}
              >
                {center.label}
              </span>

              {/* Картинка + стрелка */}
              <div className="flex items-center gap-2">
                {center.image && (
                  <div className="h-[36px] w-[52px] flex items-center justify-center flex-shrink-0">
                    <Image
                      src={center.image}
                      alt={center.label}
                      width={52}
                      height={36}
                      className="max-h-full max-w-full object-contain"
                      style={{ width: "auto", height: "auto" }}
                    />
                  </div>
                )}
              </div>
            </button>
          ))}
        </div>
      </div>
    );
  }

  // ==================== COURSES MOBILE ====================
  if (isCourses) {
    return (
      <div
        className="absolute -left-3.5 -top-2 z-10 w-[calc(100%_+_28px)] overflow-hidden rounded-lg"
        style={{ background: "#fff", maxHeight: "600px", overflowY: "auto" }}
      >
        {/* Заголовок с кнопкой назад */}
        <button
          onClick={() => setMobileOpenDropdown(null)}
          className="flex h-[42px] w-full items-center justify-between px-[14px] py-[10px]"
        >
          <span className="text-[15px] font-normal uppercase leading-[120%] text-black">
            {item.label}
          </span>
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            className="rotate-180"
          >
            <path
              d="M17.8534 9.85369L12.8537 14.8534C12.8073 14.8999 12.7522 14.9367 12.6915 14.9619C12.6308 14.9871 12.5657 15 12.5 15C12.4343 15 12.3692 14.9871 12.3085 14.9619C12.2478 14.9367 12.1927 14.8999 12.1463 14.8534L7.14663 9.85369C7.07663 9.78377 7.02895 9.69465 7.00963 9.59761C6.9903 9.50058 7.00021 9.39999 7.03808 9.30858C7.07595 9.21718 7.1401 9.13907 7.22239 9.08413C7.30468 9.0292 7.40142 8.99992 7.50036 9H17.4996C17.5986 8.99992 17.6953 9.0292 17.7776 9.08413C17.8599 9.13907 17.924 9.21718 17.9619 9.30858C17.9998 9.39999 18.0097 9.50058 17.9904 9.59761C17.971 9.69465 17.9234 9.78377 17.8534 9.85369Z"
              fill="black"
            />
          </svg>
        </button>

        <div className="bg-[#1a1a3e] border-2 border-white rounded-lg p-[10px] pb-[20px]">
          {coursesData.some((c) => c.image) ? (
            // Если есть хоть одна картинка — сетка с картинками
            <div className="grid grid-cols-3 gap-[10px]">
              {coursesData.map((course) => {
                const content = (
                  <div className="flex flex-col items-center gap-[5px] rounded-[20px] px-0 pb-[5px] pt-[10px]">
                    <div className="h-[80px] w-[80px] overflow-hidden rounded-[16px] bg-white/10">
                      {course.image ? (
                        <Image
                          src={course.image}
                          alt={course.label}
                          width={80}
                          height={80}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="h-full w-full flex items-center justify-center">
                          <svg
                            width="32"
                            height="32"
                            viewBox="0 0 24 24"
                            fill="none"
                          >
                            <path
                              d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z"
                              fill="rgba(255,255,255,0.3)"
                            />
                          </svg>
                        </div>
                      )}
                    </div>
                    <span className="text-center text-[14px] font-normal leading-[140%] text-white">
                      {course.label}
                    </span>
                  </div>
                );

                return course.new_tab ? (
                  <a
                    key={course.id}
                    href={course.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => {
                      setMobileOpenDropdown(null);
                      setIsMenuOpen(false);
                    }}
                  >
                    {content}
                  </a>
                ) : (
                  <Link
                    key={course.id}
                    href={course.url}
                    onClick={() => {
                      setMobileOpenDropdown(null);
                      setIsMenuOpen(false);
                    }}
                  >
                    {content}
                  </Link>
                );
              })}
            </div>
          ) : (
            // Если картинок нет — простой список
            <div className="flex flex-col gap-1">
              {coursesData.map((course) => {
                const content = (
                  <div className="flex h-[44px] items-center px-[14px] rounded-lg hover:bg-[#111d9e] transition-all">
                    <span className="text-[15px] font-normal text-white uppercase">
                      {course.label}
                    </span>
                  </div>
                );

                return course.new_tab ? (
                  <a
                    key={course.id}
                    href={course.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => {
                      setMobileOpenDropdown(null);
                      setIsMenuOpen(false);
                    }}
                  >
                    {content}
                  </a>
                ) : (
                  <Link
                    key={course.id}
                    href={course.url}
                    onClick={() => {
                      setMobileOpenDropdown(null);
                      setIsMenuOpen(false);
                    }}
                  >
                    {content}
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </div>
    );
  }

  return null;
};
const DynamicDropdown = ({
  item,
  centersData,
  coursesData,
  selectedCenter,
  setSelectedCenter,
  dropdownRef,
  coursesRef,
  setOpenDropdown,
  router,
}: {
  item: any;
  centersData: any[];
  coursesData: any[];
  selectedCenter: string;
  setSelectedCenter: (v: string) => void;
  dropdownRef: any;
  coursesRef: any;
  setOpenDropdown: (value: string | null) => void;
  router: any;
}) => {
  const children = item.children || [];
  const raw = item.rawItem || {};

  const isCenters = children.some(
    (child: any) => child.link_type === "dive_center"
  );
  const isCourses = children.length >= 5 && raw.menu_layout === "list";

  // ==================== CENTERS DESKTOP ====================
  if (isCenters) {
    return (
      <div
        ref={dropdownRef}
        className="absolute -left-2 top-4 z-50 mt-2 flex flex-col gap-0 rounded-tr-[10px] rounded-b-[10px] border-2 border-white p-0"
        style={{
          width: "280px",
          background: "rgba(0, 3, 38, 0.5)",
          backdropFilter: "blur(10px)",
          boxShadow: "0 4px 4px 0 rgba(0,0,0,0.25)",
        }}
      >
        {centersData.map((center, index) => (
          <button
            key={center.id}
            onClick={() => {
              setSelectedCenter(center.id);
              if (center.new_tab) {
                window.open(center.url, "_blank");
              } else {
                router.push(center.url);
              }
              setOpenDropdown(null);
            }}
            className={`flex h-[44px] cursor-pointer items-center justify-between px-[14px] transition-all hover:bg-[#111d9e]
              ${selectedCenter === center.id ? "bg-[#111d9e]" : ""}
              ${index === 0 ? "rounded-t-[8px]" : ""}
              ${index === centersData.length - 1 ? "rounded-b-[8px]" : ""}`}
          >
            {/* Левая часть — цвет с API */}
            <span
              className="text-[15px] font-semibold uppercase leading-[160%]"
              style={{
                fontFamily: "var(--font-family)",
                color: center.color,
              }}
            >
              {center.label}
            </span>

            {/* Правая часть — картинка + стрелка */}
            <div className="flex items-center gap-2">
              {center.image && (
                <div className="h-[32px] w-[48px] flex items-center justify-center flex-shrink-0">
                  <Image
                    src={center.image}
                    alt={center.label}
                    width={48}
                    height={32}
                    className="max-h-full max-w-full object-contain"
                    style={{ width: "auto", height: "auto" }}
                  />
                </div>
              )}
            </div>
          </button>
        ))}
      </div>
    );
  }

  // ==================== COURSES DESKTOP ====================
  if (isCourses) {
    return (
      <div
        ref={coursesRef}
        className="absolute left-0 top-9 z-50 mt-2 rounded-[10px] border-2 border-white p-6"
        style={{
          minWidth: "560px",
          maxWidth: "92vw",
          background: "rgba(0, 3, 38, 0.5)",
          backdropFilter: "blur(10px)",
          boxShadow: "0 4px 4px 0 rgba(0,0,0,0.25)",
        }}
      >
        <div className="grid grid-cols-3 gap-4">
          {coursesData.map((course) => {
            const content = (
              <div className="flex flex-col items-center gap-3 rounded-2xl border-2 border-transparent p-3 transition-all hover:border-white hover:bg-[#111d9e]/80 cursor-pointer">
                {course.image ? (
                  <div className="h-[78px] w-[78px] overflow-hidden rounded-xl bg-black/30">
                    <Image
                      src={course.image}
                      alt={course.label}
                      width={78}
                      height={78}
                      className="h-full w-full object-cover"
                    />
                  </div>
                ) : (
                  // Плейсхолдер если нет картинки
                  <div className="h-[78px] w-[78px] rounded-xl bg-white/10 flex items-center justify-center">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                      <path
                        d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z"
                        fill="rgba(255,255,255,0.3)"
                      />
                    </svg>
                  </div>
                )}
                <span className="text-center text-sm font-semibold leading-tight text-white px-1">
                  {course.label}
                </span>
              </div>
            );

            // new_tab — открываем по-разному
            return course.new_tab ? (
              <a
                key={course.id}
                href={course.url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setOpenDropdown(null)}
              >
                {content}
              </a>
            ) : (
              <Link
                key={course.id}
                href={course.url}
                onClick={() => setOpenDropdown(null)}
              >
                {content}
              </Link>
            );
          })}
        </div>
      </div>
    );
  }

  return null;
};

export const Header: React.FC<{
  locale: string;
  logoUrl: string;
  logoAlt: string;
}> = ({ locale, logoUrl, logoAlt }) => {
  const pathname = usePathname();

  const cartRef = useRef<HTMLDivElement>(null);

  const [cartItems, setCartItems] = useState<CartLocalItem[]>([]);

  const loadCartFromStorage = () => {
    try {
      const raw = localStorage.getItem("cart");
      const parsed = raw ? JSON.parse(raw) : [];
      setCartItems(Array.isArray(parsed) ? parsed : []);
    } catch {
      setCartItems([]);
    }
  };

  useEffect(() => {
    loadCartFromStorage();
    window.addEventListener("cart-updated", loadCartFromStorage);
    window.addEventListener("storage", loadCartFromStorage); // синхронізація між вкладками
    return () => {
      window.removeEventListener("cart-updated", loadCartFromStorage);
      window.removeEventListener("storage", loadCartFromStorage);
    };
  }, []);

  const cartTotal = cartItems.reduce((sum, item) => sum + (item.price || 0), 0);
  const cartCurrency = cartItems[0]?.currency || "€";

  const handleRemoveFromCart = (type: string, id: number | string) => {
    const next = cartItems.filter((i) => !(i.type === type && i.id === id));
    localStorage.setItem("cart", JSON.stringify(next));
    setCartItems(next);
  };
  const [isCartHovered, setIsCartHovered] = useState(false);

  // ← единственный источник данных меню, кэшируется глобально
  const { menuData } = useMenu(locale);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
  const [selectedLang, setSelectedLang] = useState(locale.toUpperCase());
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [selectedCenter, setSelectedCenter] = useState("");
  const [mobileOpenDropdown, setMobileOpenDropdown] = useState<string | null>(
    null
  );
  const [isSocialMenuOpen, setIsSocialMenuOpen] = useState(false);
  const socialButtonRef = useRef<HTMLButtonElement>(null);
  const segments = useSelectedLayoutSegments();
  const isNotFound = segments.length === 0 && pathname !== "/";
  const [languages, setLanguages] = useState<Language[]>([]);
  const [openSocial, setOpenSocial] = useState<
    "facebook" | "youtube" | "instagram" | null
  >(null);
  const socialRef = useRef<HTMLDivElement>(null);
  // Languages — отдельный маленький запрос, не меню
  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/configs/languages`)
      .then((res) => res.json())
      .then((data) => setLanguages(data?.data ?? []));
  }, []);

  const transparentRoutes = [
    "/",
    "/another-page",
    "/cursos",
    "/diving",
    "/boat-tours",
    "/contactos",
    "/snorkeling",
    "/dolphin-watching",
  ];

  const isTransparentInitially =
    transparentRoutes.some((route) => pathname.startsWith(route)) ||
    !isNotFound;

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeNav, setActiveNav] = useState(
    () => pathname.split("/").filter(Boolean)[0] ?? ""
  );
  const [isScrolled, setIsScrolled] = useState(false);
  const router = useRouter();
  const localizeUrl = (url: string) => {
    if (/^\/[a-z]{2}(\/|$)/.test(url)) return url;
    return `/${locale}${url}`;
  };
  const centersData = (() => {
    const centrosItem = menuData?.data.main.find((item) =>
      item.children?.some((child: any) => child.link_type === "dive_center")
    );

    // справочник по slug — цвет, иконка и прочие данные центра
    const centerBySlug: Record<string, any> = {};
    (menuData?.diving_centers ?? []).forEach((c) => {
      centerBySlug[c.slug] = c;
    });

    // порядок — строго из children меню, отсортированных по их position
    const orderedChildren = [...(centrosItem?.children ?? [])].sort(
      (a: any, b: any) => a.position - b.position
    );

    return orderedChildren
      .map((child: any) => {
        const c = centerBySlug[child.slug];
        if (!c) return null;
        return {
          id: c.slug,
          label: c.name.toUpperCase(),
          color: c.color,
          image: c.center_icon_url ?? "",
          url: localizeUrl(child.url ?? `/centros/${child.slug}`),
          new_tab: child.new_tab ?? false,
        };
      })
      .filter((c): c is NonNullable<typeof c> => c !== null);
  })();
  const navItems = (menuData?.data.main ?? []).map((item) => {
    const firstCenterSlug = centersData[0]?.id ?? "";
    const isCourseCategory = item.link_type === "course_category";

    const rawUrl = isCourseCategory
      ? `/cursos/${item.slug}/${firstCenterSlug}`
      : item.url ?? `/${item.slug || ""}`;

    return {
      id: item.slug ?? item.label.toLowerCase().replace(/\s+/g, "-"),
      label: item.label,
      hasDropdown: (item.children?.length ?? 0) > 0,
      dropdownType: (item.children?.length ?? 0) > 0 ? "dropdown" : null,
      href: localizeUrl(rawUrl),
      children: item.children,
      rawItem: item,
    };
  });

  // Находим пункт меню, у которого дети имеют картинки и их много
  // (точно так же, как мы определяем dropdownType = 'courses')
  // Находим пункт "Cursos" по наличию большого количества детей + menu_layout === "list"
  // Это работает независимо от языка и наличия картинок
  const coursesMenuItem = menuData?.data.main.find((item) => {
    const hasChildren = (item.children?.length ?? 0) >= 5;
    const isListLayout = item.menu_layout === "list";
    const hasNoCenter = !item.children?.some(
      (child: any) => child.link_type === "dive_center"
    );
    return hasChildren && isListLayout && hasNoCenter;
  });
  const coursesData = (coursesMenuItem?.children ?? []).map((course) => {
    const isCourseCategory = course.link_type === "course_category";
    const firstCenterSlug = centersData[0]?.id ?? "";

    const builtUrl = isCourseCategory
      ? `/cursos/${course.slug}/${firstCenterSlug}`
      : course.url ?? "/cursos";

    return {
      id: course.slug ?? course.label.toLowerCase().replace(/\s+/g, "-"),
      label: course.label,
      image: course.img_url ?? "",
      url: localizeUrl(builtUrl),
      new_tab: course.new_tab ?? false, // просто как было
    };
  });
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 0);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  const dropdownButtonRefs = useRef<Record<string, HTMLButtonElement | null>>(
    {}
  );
  const dropdownRef = useRef<HTMLDivElement>(null);
  const coursesRef = useRef<HTMLDivElement>(null);
  const langRef = useRef<HTMLDivElement>(null);
  const langButtonRef = useRef<HTMLButtonElement>(null);
  const [langButtonWidth, setLangButtonWidth] = useState<number | null>(null);

  const handleToMain = () => router.push(`/${locale}`);
  const switchLocale = (newLocale: string) => {
    const pathWithoutLocale =
      pathname.replace(new RegExp(`^/${locale}`), "") || "/";
    router.push(`/${newLocale}${pathWithoutLocale}`);
  };

  useEffect(() => {
    setSelectedLang(locale.toUpperCase());
  }, [locale]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isMenuOpen) return;
      const target = event.target as Node;

      const isInsideDropdown =
        (dropdownRef.current && dropdownRef.current.contains(target)) ||
        (coursesRef.current && coursesRef.current.contains(target));

      const isInsideButton = Object.values(dropdownButtonRefs.current).some(
        (ref) => ref && ref.contains(target)
      );

      const isInsideLang =
        (langRef.current && langRef.current.contains(target)) ||
        (langButtonRef.current && langButtonRef.current.contains(target));

      const isInsideSocial =
        socialRef.current && socialRef.current.contains(target);

      const isInsideCart = cartRef.current && cartRef.current.contains(target);

      // Кожен дропдаун закривається незалежно від інших —
      // клік на іншу кнопку більше не "рятує" кошик від закриття
      if (!isInsideDropdown && !isInsideButton) {
        setOpenDropdown(null);
        setMobileOpenDropdown(null);
      }

      if (!isInsideLang) {
        setIsLangMenuOpen(false);
      }

      if (!isInsideSocial) {
        setOpenSocial(null);
      }

      if (!isInsideCart) {
        setIsCartOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isMenuOpen]);
  // Добавляем после centersData
  const currentCenter =
    menuData?.diving_centers.find((c) => c.slug === selectedCenter) ??
    menuData?.diving_centers[0]; // fallback — первый центр

  const socialLinks = [
    currentCenter?.contact_facebook && {
      key: "facebook",
      url: currentCenter.contact_facebook,
      label: "Facebook",
      icon: (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path
            d="M9.99996 1.69995C5.41663 1.69995 1.66663 5.44162 1.66663 10.05C1.66663 14.2166 4.71663 17.675 8.69996 18.3V12.4666H6.58329V10.05H8.69996V8.20828C8.69996 6.11662 9.94163 4.96662 11.85 4.96662C12.7583 4.96662 13.7083 5.12495 13.7083 5.12495V7.18328H12.6583C11.625 7.18328 11.3 7.82495 11.3 8.4833V10.05H13.6166L13.2416 12.4666H11.3V18.3C13.2636 17.9898 15.0518 16.9879 16.3415 15.475C17.6313 13.9621 18.3378 12.038 18.3333 10.05C18.3333 5.44162 14.5833 1.69995 9.99996 1.69995Z"
            fill="white"
          />
        </svg>
      ),
    },
    currentCenter?.contact_youtube && {
      key: "youtube",
      url: currentCenter.contact_youtube,
      label: "YouTube",
      icon: (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path
            d="M19.582 5.186C19.352 4.322 18.674 3.644 17.81 3.414C16.254 3 10 3 10 3C10 3 3.746 3 2.19 3.414C1.326 3.644 0.648 4.322 0.418 5.186C0 6.742 0 10 0 10C0 10 0 13.258 0.418 14.814C0.648 15.678 1.326 16.356 2.19 16.586C3.746 17 10 17 10 17C10 17 16.254 17 17.81 16.586C18.674 16.356 19.352 15.678 19.582 14.814C20 13.258 20 10 20 10C20 10 20 6.742 19.582 5.186ZM8 13V7L13 10L8 13Z"
            fill="white"
          />
        </svg>
      ),
    },
    currentCenter?.contact_tripadvisor && {
      key: "tripadvisor",
      url: currentCenter.contact_tripadvisor,
      label: "Tripadvisor",
      icon: (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path
            d="M10 1.802C12.67 1.802 12.987 1.812 14.041 1.86C16.751 1.986 18.013 3.27 18.139 5.959C18.188 7.013 18.197 7.33 18.197 10C18.197 12.671 18.187 12.987 18.139 14.041C18.012 16.728 16.754 18.014 14.041 18.14C12.987 18.188 12.671 18.198 10 18.198C7.33 18.198 7.013 18.188 5.96 18.14C3.241 18.013 1.988 16.725 1.862 14.04C1.813 12.987 1.803 12.67 1.803 10C1.803 7.33 1.814 7.013 1.862 5.96C1.989 3.27 3.247 1.986 5.96 1.86C7.014 1.812 7.33 1.802 10 1.802ZM10 0C7.284 0 6.944 0.012 5.878 0.06C2.246 0.227 0.228 2.242 0.061 5.877C0.012 6.944 0 7.284 0 10C0 12.716 0.012 13.056 0.06 14.122C0.227 17.754 2.242 19.772 5.877 19.939C6.944 19.988 7.284 20 10 20C12.716 20 13.056 19.988 14.122 19.94C17.751 19.773 19.775 17.757 19.938 14.123C19.988 13.056 20 12.716 20 10C20 7.284 19.988 6.944 19.94 5.878C19.777 2.249 17.758 0.228 14.123 0.061C13.056 0.012 12.716 0 10 0ZM10 4.865C7.164 4.865 4.865 7.164 4.865 10C4.865 12.836 7.164 15.136 10 15.136C12.836 15.136 15.135 12.837 15.135 10C15.135 7.164 12.836 4.865 10 4.865ZM10 13.333C8.159 13.333 6.667 11.842 6.667 10C6.667 8.159 8.159 6.667 10 6.667C11.841 6.667 13.333 8.159 13.333 10C13.333 11.842 11.841 13.333 10 13.333ZM15.338 3.462C14.675 3.462 14.139 3.998 14.139 4.661C14.139 5.324 14.675 5.86 15.338 5.86C16.001 5.86 16.537 5.324 16.537 4.661C16.537 3.998 16.001 3.462 15.338 3.462Z"
            fill="white"
          />
        </svg>
      ),
    },
  ].filter(Boolean) as {
    key: string;
    url: string;
    label: string;
    icon: React.ReactNode;
  }[];

  return (
    <>
      <header className="sticky top-0 z-[100000]">
        {/* Фон на уровне header */}
        {(!isTransparentInitially || isScrolled) && (
          <div className="absolute inset-0 bg-[#281d4d] -z-10" />
        )}

        <div className="relative px-5 pb-[clamp(8px,1vw,16px)]">
          {/* Нижняя граница */}
          <div className="absolute left-5 right-5 bottom-0 border-b border-[rgba(255,255,255,0.2)]" />

          {/* Контент */}
          <div className="flex items-center justify-between gap-4 pt-[clamp(12px,2vw,20px)]">
            <div
              onClick={handleToMain}
              className="relative cursor-pointer flex-shrink-0 xl:hidden"
            >
              <Image
                src={logoUrl}
                alt={logoAlt}
                width={173}
                height={41}
                className="h-[41px] w-auto"
              />
            </div>
            <div
              onClick={handleToMain}
              className="relative cursor-pointer flex-shrink-0 hidden xl:block"
            >
              <Image
                src={logoUrl}
                alt={logoAlt}
                width={158}
                height={25}
                className="h-[clamp(18px,1.4vw,24px)] w-auto"
              />
            </div>
            {/* Desktop Nav */}
            {/* Desktop Nav */}
            <nav className="relative hidden rounded-xl bg-black/10 px-[clamp(8px,1vw,16px)] py-[clamp(10px,0.9vw,16.5px)] xl:flex">
              <div className="flex w-full flex-wrap items-center content-center justify-center gap-x-[clamp(8px,1.4vw,28px)] gap-y-1">
                {" "}
                {navItems.map((item) => (
                  <div key={item.id} className="relative">
                    <button
                      ref={(el) => {
                        if (item.hasDropdown && el) {
                          dropdownButtonRefs.current[item.id] = el;
                        }
                      }}
                      onClick={() => {
                        setActiveNav(item.id);
                        if (item.hasDropdown) {
                          setOpenDropdown(
                            openDropdown !== item.id ? item.id : null
                          );
                        } else if (item.href) {
                          router.push(item.href);
                        }
                      }}
                      className={`relative flex cursor-pointer items-center whitespace-nowrap uppercase transition-all ${
                        pathname === `/${item.id}`
                          ? "text-[16px] font-bold uppercase leading-[120%]"
                          : "text-[15px] font-medium uppercase leading-[120%]"
                      }`}
                    >
                      <span className="relative inline-flex items-center gap-[6px]">
                        {openDropdown === item.id && (
                          <span
                            className="absolute inset-x-[-8px] inset-y-[-8px] rounded-[8px] bg-white pointer-events-none"
                            aria-hidden="true"
                          />
                        )}
                        <p
                          className={`relative z-10 ${
                            openDropdown === item.id
                              ? "text-black"
                              : "text-white"
                          }`}
                        >
                          {item.label}
                        </p>
                        {item.hasDropdown && (
                          <svg
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            className={`transition-transform xl:h-6 xl:w-6 relative z-10 ${
                              openDropdown === item.id ? "rotate-180" : ""
                            }`}
                          >
                            <path
                              d="M17.8534 9.85369L12.8537 14.8534C12.8073 14.8999 12.7522 14.9367 12.6915 14.9619C12.6308 14.9871 12.5657 15 12.5 15C12.4343 15 12.3692 14.9871 12.3085 14.9619C12.2478 14.9367 12.1927 14.8999 12.1463 14.8534L7.14663 9.85369C7.07663 9.78377 7.02895 9.69465 7.00963 9.59761C6.9903 9.50058 7.00021 9.39999 7.03808 9.30858C7.07595 9.21718 7.1401 9.13907 7.22239 9.08413C7.30468 9.0292 7.40142 8.99992 7.50036 9H17.4996C17.5986 8.99992 17.6953 9.0292 17.7776 9.08413C17.8599 9.13907 17.924 9.21718 17.9619 9.30858C17.9998 9.39999 18.0097 9.50058 17.9904 9.59761C17.971 9.69465 17.9234 9.78377 17.8534 9.85369Z"
                              fill={
                                openDropdown === item.id ? "black" : "white"
                              }
                            />
                          </svg>
                        )}
                      </span>

                      {activeNav === item.id &&
                        !openDropdown &&
                        pathname === `/${item.id}` && (
                          <div
                            className="absolute -bottom-[16.5px] left-0 right-0 mx-auto h-0.5 bg-[#e84814]"
                            style={{
                              width: "100%",
                              border: "1px solid #e84814",
                            }}
                          />
                        )}
                    </button>

                    {/* Универсальный дропдаун без хардкода */}
                    {item.hasDropdown && openDropdown === item.id && (
                      <DynamicDropdown
                        item={item}
                        centersData={centersData}
                        coursesData={coursesData}
                        selectedCenter={selectedCenter} // ← добавить
                        setSelectedCenter={setSelectedCenter} // ← добавить
                        dropdownRef={dropdownRef}
                        coursesRef={coursesRef}
                        setOpenDropdown={setOpenDropdown}
                        router={router} // ← добавить
                      />
                    )}
                  </div>
                ))}
              </div>
            </nav>
            {/* Desktop Right Panel */}
            {/* Cart Button + Dropdown */}
            <div className="relative hidden xl:flex" ref={cartRef}>
              <button
                className="flex items-center gap-2 flex-shrink-0 rounded-lg cursor-pointer transition-all"
                style={{
                  height: 44,
                  background: isCartOpen
                    ? "#e84814"
                    : isCartHovered
                    ? "rgba(255,255,255,0.1)"
                    : "transparent",
                  border: "1px solid rgba(255,255,255,0.12)",
                  padding: "10px 14px",
                }}
                onClick={() => setIsCartOpen(!isCartOpen)}
                onMouseEnter={() => setIsCartHovered(true)}
                onMouseLeave={() => setIsCartHovered(false)}
              >
                <svg
                  width="24"
                  height="24"
                  className="flex-shrink-0"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <path
                    d="M6 2L3 6V20C3 20.5304 3.21071 21.0391 3.58579 21.4142C3.96086 21.7893 4.46957 22 5 22H19C19.5304 22 20.0391 21.7893 20.4142 21.4142C20.7893 21.0391 21 20.5304 21 20V6L18 2H6Z"
                    stroke="white"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M3 6H21"
                    stroke="white"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M16 10C16 11.0609 15.5786 12.0783 14.8284 12.8284C14.0783 13.5786 13.0609 14 12 14C10.9391 14 9.92172 13.5786 9.17157 12.8284C8.42143 12.0783 8 11.0609 8 10"
                    stroke="white"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <span
                  style={{
                    fontFamily: "var(--font-family)",
                    fontWeight: 700,
                    fontSize: 15,
                    lineHeight: "120%",
                    color: "#fff",
                  }}
                >
                  {cartCurrency}
                  {cartTotal.toLocaleString("en", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </span>
                <span
                  className="flex items-center justify-center rounded-full text-[11px] font-bold flex-shrink-0"
                  style={{
                    width: 16,
                    height: 16,
                    minWidth: 16,
                    background: isCartOpen ? "#fff" : "#e84814",
                    color: isCartOpen ? "#e84814" : "#fff",
                  }}
                >
                  {cartItems.length}
                </span>
              </button>

              {isCartOpen && (
                <div
                  className="absolute top-full mt-2 right-0 z-50"
                  style={{
                    width: 502,
                    background: "#1f1443",
                    border: "1px solid #534580",
                    borderRadius: "20px 8px 20px 20px",
                  }}
                >
                  {/* Header */}
                  <div
                    className="flex items-end pb-3 justify-between px-5"
                    style={{ borderBottom: "1px solid #534580", height: 65 }}
                  >
                    <span
                      style={{
                        fontFamily: "var(--font-family)",
                        fontWeight: 500,
                        fontSize: 24,
                        lineHeight: "130%",
                        color: "#fff",
                      }}
                    >
                      Your Cart
                    </span>
                    <span
                      style={{
                        fontFamily: "var(--font-family)",
                        fontWeight: 400,
                        fontSize: 15,
                        lineHeight: "160%",
                        color: "#cfcfcf",
                      }}
                    >
                      {cartItems.length}{" "}
                      {cartItems.length === 1 ? "item" : "items"}
                    </span>
                  </div>

                  {/* Items */}
                  <div className="flex flex-col">
                    {cartItems.length === 0 && (
                      <div
                        className="px-5 py-6 text-center"
                        style={{ color: "#cfcfcf", fontSize: 14 }}
                      >
                        Your cart is empty
                      </div>
                    )}
                    {cartItems.map((item) => (
                      <div
                        key={`${item.type}-${item.id}`}
                        className="flex items-center gap-3 px-5 py-[10px]"
                        style={{ borderBottom: "1px solid #534580" }}
                      >
                        <div
                          style={{
                            borderRadius: 10,
                            width: 65,
                            height: 60,
                            overflow: "hidden",
                            flexShrink: 0,
                            background: "#2a1f5e",
                          }}
                        >
                          {item.image && (
                            <img
                              src={item.image}
                              alt={item.title}
                              style={{
                                width: "100%",
                                height: "100%",
                                objectFit: "cover",
                              }}
                            />
                          )}
                        </div>

                        <div className="flex flex-col gap-1 flex-1">
                          <span
                            style={{
                              fontFamily: "var(--font-family)",
                              fontWeight: 400,
                              fontSize: 16,
                              lineHeight: "140%",
                              color: "#fff",
                            }}
                          >
                            {item.title || "Untitled"}
                          </span>
                          <span
                            style={{
                              width: "fit-content",
                              borderRadius: 5,
                              padding: "2px 5px",
                              fontFamily: "var(--font-family)",
                              fontWeight: 400,
                              fontSize: 15,
                              lineHeight: "160%",
                              background:
                                item.type === "travels"
                                  ? "rgba(232, 72, 20, 0.2)"
                                  : "rgba(160, 197, 46, 0.2)",
                              color:
                                item.type === "travels" ? "#e84814" : "#a0c52e",
                            }}
                          >
                            {item.type === "travels"
                              ? "Travel"
                              : item.type === "course"
                              ? "Course"
                              : "Trip"}
                          </span>
                        </div>

                        <span
                          style={{
                            fontFamily: "var(--font-family)",
                            fontWeight: 500,
                            fontSize: 19,
                            lineHeight: "140%",
                            color: "#fff",
                          }}
                        >
                          {item.currency || "€"}
                          {item.price ?? 0}
                        </span>

                        <button
                          onClick={() =>
                            handleRemoveFromCart(item.type, item.id)
                          }
                          className="hover:opacity-80 transition-opacity cursor-pointer"
                        >
                          <svg
                            width="30"
                            height="30"
                            viewBox="0 0 30 30"
                            fill="none"
                          >
                            <g opacity="0.5">
                              <path
                                d="M8.75 8.75L21.25 21.25M8.75 21.25L21.25 8.75"
                                stroke="white"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </g>
                          </svg>
                        </button>
                      </div>
                    ))}
                  </div>

                  <div
                    className="flex items-center justify-between px-5"
                    style={{ padding: "10px 20px 0", height: 41 }}
                  >
                    <span
                      style={{
                        fontFamily: "var(--font-family)",
                        fontWeight: 500,
                        fontSize: 24,
                        lineHeight: "130%",
                        color: "#fff",
                      }}
                    >
                      Total price
                    </span>
                    <span
                      style={{
                        fontFamily: "var(--font-family)",
                        fontWeight: 500,
                        fontSize: 24,
                        lineHeight: "130%",
                        color: "#fff",
                      }}
                    >
                      {cartCurrency}
                      {cartTotal.toLocaleString("en", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </span>
                  </div>

                  {/* Buttons */}
                  <div className="flex items-center gap-3 px-5 py-4">
                    <Link onClick={() => setIsCartOpen(false)} href="/cart">
                      <button
                        style={{
                          border: "1px solid #534580",
                          borderRadius: 1000,
                          padding: "2px 16px",
                          width: 226,
                          height: 48,
                          background: "#1f1443",
                          fontFamily: "var(--font-family)",
                          fontWeight: 700,
                          fontSize: 15,
                          lineHeight: "120%",
                          color: "#cfcfcf",
                          cursor: "pointer",
                        }}
                      >
                        View cart
                      </button>
                    </Link>
                    <button
                      style={{
                        borderRadius: 1000,
                        padding: "2px 16px",
                        width: 226,
                        height: 48,
                        background: "#e84814",
                        fontFamily: "var(--font-family)",
                        fontWeight: 700,
                        fontSize: 15,
                        lineHeight: "120%",
                        color: "#fff",
                        cursor: "pointer",
                      }}
                    >
                      Checkout
                    </button>
                  </div>
                </div>
              )}
            </div>
            <div className="hidden flex-shrink-0 rounded-xl bg-black/10 p-1 xl:flex">
              <div className="flex items-center gap-[clamp(2px,0.4vw,8px)] px-[clamp(2px,0.3vw,8px)]">
                {/* ЯЗЫ К — был и должен быть */}
                <div className="relative">
                  <button
                    ref={langButtonRef}
                    onClick={() => {
                      if (langButtonRef.current && !isLangMenuOpen) {
                        setLangButtonWidth(langButtonRef.current.offsetWidth);
                      }
                      setIsLangMenuOpen(!isLangMenuOpen);
                    }}
                    className="flex items-center justify-center gap-[clamp(4px,0.4vw,8px)] rounded-lg border border-black/12 bg-white cursor-pointer hover:bg-gray-100 px-[clamp(8px,0.9vw,14px)] py-[clamp(6px,0.6vw,10px)] text-[clamp(12px,0.85vw,15px)] font-bold text-black"
                  >
                    {selectedLang}
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      className={`transition-transform xl:h-6 xl:w-6 ${
                        isLangMenuOpen ? "rotate-180" : ""
                      }`}
                    >
                      <path
                        d="M17.8534 9.85369L12.8537 14.8534C12.8073 14.8999 12.7522 14.9367 12.6915 14.9619C12.6308 14.9871 12.5657 15 12.5 15C12.4343 15 12.3692 14.9871 12.3085 14.9619C12.2478 14.9367 12.1927 14.8999 12.1463 14.8534L7.14663 9.85369C7.07663 9.78377 7.02895 9.69465 7.00963 9.59761C6.9903 9.50058 7.00021 9.39999 7.03808 9.30858C7.07595 9.21718 7.1401 9.13907 7.22239 9.08413C7.30468 9.0292 7.40142 8.99992 7.50036 9H17.4996C17.5986 8.99992 17.6953 9.0292 17.7776 9.08413C17.8599 9.13907 17.924 9.21718 17.9619 9.30858C17.9998 9.39999 18.0097 9.50058 17.9904 9.59761C17.971 9.69465 17.9234 9.78377 17.8534 9.85369Z"
                        fill="black"
                      />
                    </svg>
                  </button>
                  {isLangMenuOpen && (
                    <div
                      ref={langRef}
                      className="absolute left-0 top-full mt-2 flex flex-col rounded-[10px] border-2 border-white shadow-lg"
                      style={{
                        width: langButtonWidth
                          ? `${langButtonWidth}px`
                          : "75px",
                        background: "rgba(0, 3, 38, 0.5)",
                        backdropFilter: "blur(10px)",
                      }}
                    >
                      {languages
                        .filter((l) => l?.prefix)
                        .map((lang, index) => (
                          <button
                            key={lang.prefix}
                            onClick={() => {
                              setSelectedLang(lang.prefix.toUpperCase());
                              switchLocale(lang.prefix);
                              setIsLangMenuOpen(false);
                            }}
                            className={`flex h-[40px] w-full cursor-pointer items-center justify-center text-[15px] font-semibold transition-colors
                ${
                  selectedLang === lang.prefix.toUpperCase()
                    ? "text-[#e84814]"
                    : "text-white hover:text-[#e84814]"
                }
                ${
                  index === 0
                    ? "rounded-t-[8px]"
                    : index === languages.length - 1
                    ? "rounded-b-[8px]"
                    : ""
                }`}
                            style={{
                              background:
                                selectedLang === lang.prefix.toUpperCase()
                                  ? "#111d9e"
                                  : "transparent",
                            }}
                          >
                            {lang.prefix.toUpperCase()}
                          </button>
                        ))}
                    </div>
                  )}
                </div>

                {/* СОЦСЕТИ */}
                <div
                  ref={socialRef}
                  className="flex items-center gap-[clamp(2px,0.4vw,8px)]"
                >
                  {/* Facebook */}
                  <div className="relative">
                    <button
                      onClick={() =>
                        setOpenSocial(
                          openSocial === "facebook" ? null : "facebook"
                        )
                      }
                      className="rounded-lg p-2 flex items-center gap-1 hover:bg-white/10 transition-all"
                    >
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 20 20"
                        fill="none"
                      >
                        <path
                          d="M9.99996 1.69995C5.41663 1.69995 1.66663 5.44162 1.66663 10.05C1.66663 14.2166 4.71663 17.675 8.69996 18.3V12.4666H6.58329V10.05H8.69996V8.20828C8.69996 6.11662 9.94163 4.96662 11.85 4.96662C12.7583 4.96662 13.7083 5.12495 13.7083 5.12495V7.18328H12.6583C11.625 7.18328 11.3 7.82495 11.3 8.4833V10.05H13.6166L13.2416 12.4666H11.3V18.3C13.2636 17.9898 15.0518 16.9879 16.3415 15.475C17.6313 13.9621 18.3378 12.038 18.3333 10.05C18.3333 5.44162 14.5833 1.69995 9.99996 1.69995Z"
                          fill="white"
                        />
                      </svg>
                      <svg
                        width="12"
                        height="12"
                        viewBox="0 0 24 24"
                        fill="none"
                        className={`transition-transform ${
                          openSocial === "facebook" ? "rotate-180" : ""
                        }`}
                      >
                        <path
                          d="M17.8534 9.85369L12.8537 14.8534C12.8073 14.8999 12.7522 14.9367 12.6915 14.9619C12.6308 14.9871 12.5657 15 12.5 15C12.4343 15 12.3692 14.9871 12.3085 14.9619C12.2478 14.9367 12.1927 14.8999 12.1463 14.8534L7.14663 9.85369C7.07663 9.78377 7.02895 9.69465 7.00963 9.59761C6.9903 9.50058 7.00021 9.39999 7.03808 9.30858C7.07595 9.21718 7.1401 9.13907 7.22239 9.08413C7.30468 9.0292 7.40142 8.99992 7.50036 9H17.4996C17.5986 8.99992 17.6953 9.0292 17.7776 9.08413C17.8599 9.13907 17.924 9.21718 17.9619 9.30858C17.9998 9.39999 18.0097 9.50058 17.9904 9.59761C17.971 9.69465 17.9234 9.78377 17.8534 9.85369Z"
                          fill="white"
                        />
                      </svg>
                    </button>
                    {openSocial === "facebook" && (
                      <div
                        className="absolute right-0 top-full mt-2 flex flex-col rounded-[10px] border-2 border-white shadow-lg overflow-hidden z-50"
                        style={{
                          minWidth: "180px",
                          background: "rgba(0, 3, 38, 0.5)",
                          backdropFilter: "blur(10px)",
                        }}
                      >
                        {centersData.map((center, index) => {
                          const dc = menuData?.diving_centers.find(
                            (c) => c.slug === center.id
                          );
                          if (!dc?.contact_facebook) return null;
                          return (
                            <a
                              key={center.id}
                              href={dc.contact_facebook}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={() => setOpenSocial(null)}
                              className={`flex h-[44px] items-center gap-[10px] px-[14px] text-white transition-all hover:bg-[#111d9e] ${
                                index === 0 ? "rounded-t-[8px]" : ""
                              } ${
                                index === centersData.length - 1
                                  ? "rounded-b-[8px]"
                                  : ""
                              }`}
                            >
                              <span
                                className="w-2 h-2 rounded-full flex-shrink-0"
                                style={{ background: center.color }}
                              />
                              <span className="text-[14px] font-medium">
                                {center.label}
                              </span>
                            </a>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  {/* YouTube */}
                  {/* <div className="relative">
                  <button
                    onClick={() =>
                      setOpenSocial(openSocial === "youtube" ? null : "youtube")
                    }
                    className="flex items-center gap-1 rounded-lg p-2 hover:bg-white/10 transition-all"
                  >
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                      <path
                        d="M19.582 5.186C19.352 4.322 18.674 3.644 17.81 3.414C16.254 3 10 3 10 3C10 3 3.746 3 2.19 3.414C1.326 3.644 0.648 4.322 0.418 5.186C0 6.742 0 10 0 10C0 10 0 13.258 0.418 14.814C0.648 15.678 1.326 16.356 2.19 16.586C3.746 17 10 17 10 17C10 17 16.254 17 17.81 16.586C18.674 16.356 19.352 15.678 19.582 14.814C20 13.258 20 10 20 10C20 10 20 6.742 19.582 5.186ZM8 13V7L13 10L8 13Z"
                        fill="white"
                      />
                    </svg>
                    <svg
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="none"
                      className={`transition-transform ${
                        openSocial === "youtube" ? "rotate-180" : ""
                      }`}
                    >
                      <path
                        d="M17.8534 9.85369L12.8537 14.8534C12.8073 14.8999 12.7522 14.9367 12.6915 14.9619C12.6308 14.9871 12.5657 15 12.5 15C12.4343 15 12.3692 14.9871 12.3085 14.9619C12.2478 14.9367 12.1927 14.8999 12.1463 14.8534L7.14663 9.85369C7.07663 9.78377 7.02895 9.69465 7.00963 9.59761C6.9903 9.50058 7.00021 9.39999 7.03808 9.30858C7.07595 9.21718 7.1401 9.13907 7.22239 9.08413C7.30468 9.0292 7.40142 8.99992 7.50036 9H17.4996C17.5986 8.99992 17.6953 9.0292 17.7776 9.08413C17.8599 9.13907 17.924 9.21718 17.9619 9.30858C17.9998 9.39999 18.0097 9.50058 17.9904 9.59761C17.971 9.69465 17.9234 9.78377 17.8534 9.85369Z"
                        fill="white"
                      />
                    </svg>
                  </button>
                  {openSocial === "youtube" && (
                    <div
                      className="absolute right-0 top-full mt-2 flex flex-col rounded-[10px] border-2 border-white shadow-lg overflow-hidden z-50"
                      style={{
                        minWidth: "180px",
                        background: "rgba(0, 3, 38, 0.5)",
                        backdropFilter: "blur(10px)",
                      }}
                    >
                      {centersData.map((center, index) => {
                        const dc = menuData?.diving_centers.find(
                          (c) => c.slug === center.id
                        );
                        if (!dc?.contact_youtube) return null;
                        return (
                          <a
                            key={center.id}
                            href={dc.contact_youtube}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={() => setOpenSocial(null)}
                            className={`flex h-[44px] items-center gap-[10px] px-[14px] text-white transition-all hover:bg-[#111d9e] ${
                              index === 0 ? "rounded-t-[8px]" : ""
                            } ${
                              index === centersData.length - 1
                                ? "rounded-b-[8px]"
                                : ""
                            }`}
                          >
                            <span
                              className="w-2 h-2 rounded-full flex-shrink-0"
                              style={{ background: center.color }}
                            />
                            <span className="text-[14px] font-medium">
                              {center.label}
                            </span>
                          </a>
                        );
                      })}
                    </div>
                  )}
                </div> */}

                  {/* Tripadvisor */}
                  <div className="relative">
                    <button
                      onClick={() =>
                        setOpenSocial(
                          openSocial === "instagram" ? null : "instagram"
                        )
                      }
                      className="rounded-lg p-2 flex items-center gap-1 hover:bg-white/10 transition-all"
                    >
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 20 20"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M14.6827 9.28867C13.7645 9.28867 13.0208 10.033 13.0208 10.9505C13.0208 11.868 13.7652 12.6124 14.6827 12.6124C15.6008 12.6124 16.3445 11.868 16.3445 10.9505C16.3445 10.6443 16.262 10.358 16.1177 10.1118L16.122 10.1199C15.8295 9.61992 15.2945 9.28867 14.6827 9.28867ZM5.31703 9.28867C4.39891 9.28867 3.65516 10.033 3.65516 10.9505C3.65516 11.868 4.39953 12.6124 5.31703 12.6124C6.23516 12.6124 6.97891 11.868 6.97891 10.9505C6.97891 10.6443 6.89641 10.358 6.75203 10.1118L6.75641 10.1199C6.46391 9.61992 5.92891 9.28867 5.31703 9.28867ZM14.6827 7.78117C14.6833 7.78117 14.6833 7.78117 14.6839 7.78117C16.4339 7.78117 17.8527 9.19992 17.8527 10.9499C17.8527 12.6999 16.4339 14.1187 14.6839 14.1187C12.9339 14.1187 11.5152 12.6999 11.5152 10.9499C11.5152 10.3668 11.6727 9.82055 11.947 9.35117L11.9389 9.36617C12.4964 8.4118 13.5158 7.7818 14.6827 7.78117ZM5.31703 7.7793C7.06766 7.7793 8.48703 9.19867 8.48703 10.9493C8.48703 12.6999 7.06766 14.1193 5.31703 14.1193C3.56641 14.1193 2.14703 12.6999 2.14703 10.9493C2.14703 10.3655 2.30453 9.81867 2.57953 9.3493L2.57141 9.3643C3.12953 8.40992 4.14953 7.7793 5.31703 7.7793ZM10.0014 5.51305C11.2714 5.51367 12.4802 5.77305 13.5789 6.24117L13.5189 6.21867C11.5358 6.89992 10.1145 8.69992 10.0014 10.8468L10.0008 10.8593C9.88828 8.69992 8.46641 6.8993 6.51953 6.2293L6.48328 6.21867C7.52203 5.77367 8.73141 5.51492 10.0008 5.5143L10.0014 5.51305ZM10.0064 3.98242C10.0052 3.98242 10.0033 3.98242 10.002 3.98242C7.77391 3.98242 5.70641 4.6693 3.99953 5.84367L4.03516 5.82055H0.628906L2.16203 7.48805C1.21953 8.34805 0.630781 9.58117 0.630781 10.9518C0.630781 13.538 2.72766 15.6349 5.31391 15.6349C6.54578 15.6349 7.66641 15.1593 8.50266 14.3818L8.49953 14.3843L10.0008 16.018L11.502 14.3855C12.3352 15.1599 13.4558 15.6355 14.6877 15.6355C17.2745 15.6355 19.3714 13.5387 19.3714 10.9518C19.3714 9.58117 18.7827 8.34742 17.8439 7.49117L17.8402 7.48805L19.3733 5.82055H15.9758C14.3052 4.66992 12.2383 3.98305 10.0102 3.98305C10.0083 3.98305 10.007 3.98305 10.0052 3.98305L10.0064 3.98242Z"
                          fill="white"
                        />
                      </svg>
                      <svg
                        width="12"
                        height="12"
                        viewBox="0 0 24 24"
                        fill="none"
                        className={`transition-transform ${
                          openSocial === "instagram" ? "rotate-180" : ""
                        }`}
                      >
                        <path
                          d="M17.8534 9.85369L12.8537 14.8534C12.8073 14.8999 12.7522 14.9367 12.6915 14.9619C12.6308 14.9871 12.5657 15 12.5 15C12.4343 15 12.3692 14.9871 12.3085 14.9619C12.2478 14.9367 12.1927 14.8999 12.1463 14.8534L7.14663 9.85369C7.07663 9.78377 7.02895 9.69465 7.00963 9.59761C6.9903 9.50058 7.00021 9.39999 7.03808 9.30858C7.07595 9.21718 7.1401 9.13907 7.22239 9.08413C7.30468 9.0292 7.40142 8.99992 7.50036 9H17.4996C17.5986 8.99992 17.6953 9.0292 17.7776 9.08413C17.8599 9.13907 17.924 9.21718 17.9619 9.30858C17.9998 9.39999 18.0097 9.50058 17.9904 9.59761C17.971 9.69465 17.9234 9.78377 17.8534 9.85369Z"
                          fill="white"
                        />
                      </svg>
                    </button>
                    {openSocial === "instagram" && (
                      <div
                        className="absolute right-0 top-full mt-2 flex flex-col rounded-[10px] border-2 border-white shadow-lg overflow-hidden z-50"
                        style={{
                          minWidth: "180px",
                          background: "rgba(0, 3, 38, 0.5)",
                          backdropFilter: "blur(10px)",
                        }}
                      >
                        {centersData.map((center, index) => {
                          const dc = menuData?.diving_centers.find(
                            (c) => c.slug === center.id
                          );
                          if (!dc?.contact_tripadvisor) return null;
                          return (
                            <a
                              key={center.id}
                              href={dc.contact_tripadvisor}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={() => setOpenSocial(null)}
                              className={`flex h-[44px] items-center gap-[10px] px-[14px] text-white transition-all hover:bg-[#111d9e] ${
                                index === 0 ? "rounded-t-[8px]" : ""
                              } ${
                                index === centersData.length - 1
                                  ? "rounded-b-[8px]"
                                  : ""
                              }`}
                            >
                              <span
                                className="w-2 h-2 rounded-full flex-shrink-0"
                                style={{ background: center.color }}
                              />
                              <span className="text-[14px] font-medium">
                                {center.label}
                              </span>
                            </a>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="flex items-center justify-center rounded-lg bg-white p-2 xl:hidden"
            >
              {isMenuOpen ? (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M7 7L17 17M7 17L17 7"
                    stroke="black"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              ) : (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M4 18C3.71667 18 3.47934 17.904 3.288 17.712C3.09667 17.52 3.00067 17.2827 3 17C2.99934 16.7173 3.09534 16.48 3.288 16.288C3.48067 16.096 3.718 16 4 16H20C20.2833 16 20.521 16.096 20.713 16.288C20.905 16.48 21.0007 16.7173 21 17C20.9993 17.2827 20.9033 17.5203 20.712 17.713C20.5207 17.9057 20.2833 18.0013 20 18H4ZM4 13C3.71667 13 3.47934 12.904 3.288 12.712C3.09667 12.52 3.00067 12.2827 3 12C2.99934 11.7173 3.09534 11.48 3.288 11.288C3.48067 11.096 3.718 11 4 11H20C20.2833 11 20.521 11.096 20.713 11.288C20.905 11.48 21.0007 11.7173 21 12C20.9993 12.2827 20.9033 12.5203 20.712 12.713C20.5207 12.9057 20.2833 13.0013 20 13H4ZM4 8C3.71667 8 3.47934 7.904 3.288 7.712C3.09667 7.52 3.00067 7.28267 3 7C2.99934 6.71733 3.09534 6.48 3.288 6.288C3.48067 6.096 3.718 6 4 6H20C20.2833 6 20.521 6.096 20.713 6.288C20.905 6.48 21.0007 6.71733 21 7C20.9993 7.28267 20.9033 7.52033 20.712 7.713C20.5207 7.90567 20.2833 8.00133 20 8H4Z"
                    fill="black"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-50 bg-[#281D4D] xl:hidden">
          <div className="flex h-full flex-col relative">
            <div className="absolute bottom-20 right-10 opacity-50 pointer-events-none">
              {/* decorative svg */}
            </div>

            <div className="flex items-center justify-between p-5 pt-[clamp(12px,2vw,20px)]">
              <div className="relative cursor-pointer" onClick={handleToMain}>
                <Image
                  src={logoUrl}
                  alt={logoAlt}
                  width={173}
                  height={41}
                  className="h-[41px] w-auto"
                />
              </div>
              <button
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center justify-center rounded-lg bg-white p-2"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M7 7L17 17M7 17L17 7"
                    stroke="black"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </div>

            <nav className="flex flex-col gap-4 p-6">
              {navItems.map((item) => (
                <div key={item.id} className="relative">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (item.hasDropdown) {
                        setMobileOpenDropdown(
                          mobileOpenDropdown === item.id ? null : item.id
                        );
                      } else {
                        setActiveNav(item.id);
                        setIsMenuOpen(false);
                        if (item.href) router.push(item.href);
                      }
                    }}
                    className={`flex w-full items-center justify-between uppercase text-[15px] font-normal leading-[120%] ${
                      activeNav === item.id ? "text-[#e84814]" : "text-white"
                    }`}
                  >
                    {item.label}
                    {item.hasDropdown && (
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        className={`transition-transform ${
                          mobileOpenDropdown === item.id ? "rotate-180" : ""
                        }`}
                      >
                        <path
                          d="M17.8534 9.85369L12.8537 14.8534C12.8073 14.8999 12.7522 14.9367 12.6915 14.9619C12.6308 14.9871 12.5657 15 12.5 15C12.4343 15 12.3692 14.9871 12.3085 14.9619C12.2478 14.9367 12.1927 14.8999 12.1463 14.8534L7.14663 9.85369C7.07663 9.78377 7.02895 9.69465 7.00963 9.59761C6.9903 9.50058 7.00021 9.39999 7.03808 9.30858C7.07595 9.21718 7.1401 9.13907 7.22239 9.08413C7.30468 9.0292 7.40142 8.99992 7.50036 9H17.4996C17.5986 8.99992 17.6953 9.0292 17.7776 9.08413C17.8599 9.13907 17.924 9.21718 17.9619 9.30858C17.9998 9.39999 18.0097 9.50058 17.9904 9.59761C17.971 9.69465 17.9234 9.78377 17.8534 9.85369Z"
                          fill="white"
                        />
                      </svg>
                    )}
                  </button>

                  {/* Универсальный мобильный дропдаун */}
                  {item.hasDropdown && mobileOpenDropdown === item.id && (
                    <MobileDynamicDropdown
                      item={item}
                      centersData={centersData}
                      coursesData={coursesData}
                      selectedCenter={selectedCenter} // ← добавить
                      setSelectedCenter={setSelectedCenter} // ← добавить
                      setMobileOpenDropdown={setMobileOpenDropdown}
                      setIsMenuOpen={setIsMenuOpen}
                      router={router} // ← добавить
                    />
                  )}
                </div>
              ))}
            </nav>

            <div className="mt-auto p-6">
              <div className="flex items-center gap-4">
                {/* Язык */}
                <div className="relative">
                  <button
                    ref={langButtonRef}
                    onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
                    className="flex items-center justify-center gap-2 rounded-lg bg-white px-4 py-2 text-black"
                  >
                    {selectedLang}
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      className={`transition-transform ${
                        isLangMenuOpen ? "rotate-180" : ""
                      }`}
                    >
                      <path
                        d="M17.8534 9.85369L12.8537 14.8534C12.8073 14.8999 12.7522 14.9367 12.6915 14.9619C12.6308 14.9871 12.5657 15 12.5 15C12.4343 15 12.3692 14.9871 12.3085 14.9619C12.2478 14.9367 12.1927 14.8999 12.1463 14.8534L7.14663 9.85369C7.07663 9.78377 7.02895 9.69465 7.00963 9.59761C6.9903 9.50058 7.00021 9.39999 7.03808 9.30858C7.07595 9.21718 7.1401 9.13907 7.22239 9.08413C7.30468 9.0292 7.40142 8.99992 7.50036 9H17.4996C17.5986 8.99992 17.6953 9.0292 17.7776 9.08413C17.8599 9.13907 17.924 9.21718 17.9619 9.30858C17.9998 9.39999 18.0097 9.50058 17.9904 9.59761C17.971 9.69465 17.9234 9.78377 17.8534 9.85369Z"
                        fill="black"
                      />
                    </svg>
                  </button>
                  {isLangMenuOpen && (
                    <div
                      ref={langRef}
                      className="absolute bottom-full left-0 mb-2 flex flex-col rounded-[10px] border-2 border-white"
                      style={{
                        width: "75px",
                        background: "rgba(0, 3, 38, 0.5)",
                        backdropFilter: "blur(10px)",
                      }}
                    >
                      {languages
                        .filter((l) => l?.prefix)
                        .map((lang, index) => (
                          <button
                            key={lang.prefix}
                            onClick={() => {
                              setSelectedLang(lang.prefix.toUpperCase());
                              switchLocale(lang.prefix);
                              setIsLangMenuOpen(false);
                            }}
                            className={`flex h-[40px] w-[71px] items-center justify-center text-[15px] font-semibold transition-colors
                ${
                  selectedLang === lang.prefix.toUpperCase()
                    ? "text-[#e84814]"
                    : "text-white hover:text-[#e84814]"
                }
                ${
                  index === 0
                    ? "rounded-t-[8px]"
                    : index === languages.length - 1
                    ? "rounded-b-[8px]"
                    : ""
                }`}
                            style={{
                              background:
                                selectedLang === lang.prefix.toUpperCase()
                                  ? "#111d9e"
                                  : "transparent",
                            }}
                          >
                            {lang.prefix.toUpperCase()}
                          </button>
                        ))}
                    </div>
                  )}
                </div>

                {/* Соцсети мобильные — дропдаун вверх */}
                <div className="flex items-center gap-2">
                  {/* Facebook */}
                  <div className="relative">
                    <button
                      onClick={() =>
                        setOpenSocial(
                          openSocial === "facebook" ? null : "facebook"
                        )
                      }
                      className="rounded-lg p-2 flex items-center gap-1"
                    >
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 20 20"
                        fill="none"
                      >
                        <path
                          d="M9.99996 1.69995C5.41663 1.69995 1.66663 5.44162 1.66663 10.05C1.66663 14.2166 4.71663 17.675 8.69996 18.3V12.4666H6.58329V10.05H8.69996V8.20828C8.69996 6.11662 9.94163 4.96662 11.85 4.96662C12.7583 4.96662 13.7083 5.12495 13.7083 5.12495V7.18328H12.6583C11.625 7.18328 11.3 7.82495 11.3 8.4833V10.05H13.6166L13.2416 12.4666H11.3V18.3C13.2636 17.9898 15.0518 16.9879 16.3415 15.475C17.6313 13.9621 18.3378 12.038 18.3333 10.05C18.3333 5.44162 14.5833 1.69995 9.99996 1.69995Z"
                          fill="white"
                        />
                      </svg>
                      <svg
                        width="12"
                        height="12"
                        viewBox="0 0 24 24"
                        fill="none"
                        className={`transition-transform ${
                          openSocial === "facebook" ? "rotate-180" : ""
                        }`}
                      >
                        <path
                          d="M17.8534 9.85369L12.8537 14.8534C12.8073 14.8999 12.7522 14.9367 12.6915 14.9619C12.6308 14.9871 12.5657 15 12.5 15C12.4343 15 12.3692 14.9871 12.3085 14.9619C12.2478 14.9367 12.1927 14.8999 12.1463 14.8534L7.14663 9.85369C7.07663 9.78377 7.02895 9.69465 7.00963 9.59761C6.9903 9.50058 7.00021 9.39999 7.03808 9.30858C7.07595 9.21718 7.1401 9.13907 7.22239 9.08413C7.30468 9.0292 7.40142 8.99992 7.50036 9H17.4996C17.5986 8.99992 17.6953 9.0292 17.7776 9.08413C17.8599 9.13907 17.924 9.21718 17.9619 9.30858C17.9998 9.39999 18.0097 9.50058 17.9904 9.59761C17.971 9.69465 17.9234 9.78377 17.8534 9.85369Z"
                          fill="white"
                        />
                      </svg>
                    </button>
                    {openSocial === "facebook" && (
                      <div
                        className="absolute bottom-full left-0 mb-2 flex flex-col rounded-[10px] border-2 border-white overflow-hidden z-50"
                        style={{
                          minWidth: "180px",
                          background: "rgba(0, 3, 38, 0.5)",
                          backdropFilter: "blur(10px)",
                        }}
                      >
                        {centersData.map((center, index) => {
                          const dc = menuData?.diving_centers.find(
                            (c) => c.slug === center.id
                          );
                          if (!dc?.contact_facebook) return null;
                          return (
                            <a
                              key={center.id}
                              href={dc.contact_facebook}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={() => setOpenSocial(null)}
                              className={`flex h-[44px] items-center gap-[10px] px-[14px] text-white transition-all hover:bg-[#111d9e] ${
                                index === 0 ? "rounded-t-[8px]" : ""
                              } ${
                                index === centersData.length - 1
                                  ? "rounded-b-[8px]"
                                  : ""
                              }`}
                            >
                              <span
                                className="w-2 h-2 rounded-full flex-shrink-0"
                                style={{ background: center.color }}
                              />
                              <span className="text-[14px] font-medium">
                                {center.label}
                              </span>
                            </a>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  {/* YouTube */}
                  <div className="relative">
                    <button
                      onClick={() =>
                        setOpenSocial(
                          openSocial === "youtube" ? null : "youtube"
                        )
                      }
                      className="rounded-lg p-2 flex items-center gap-1"
                    >
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 20 20"
                        fill="none"
                      >
                        <path
                          d="M19.582 5.186C19.352 4.322 18.674 3.644 17.81 3.414C16.254 3 10 3 10 3C10 3 3.746 3 2.19 3.414C1.326 3.644 0.648 4.322 0.418 5.186C0 6.742 0 10 0 10C0 10 0 13.258 0.418 14.814C0.648 15.678 1.326 16.356 2.19 16.586C3.746 17 10 17 10 17C10 17 16.254 17 17.81 16.586C18.674 16.356 19.352 15.678 19.582 14.814C20 13.258 20 10 20 10C20 10 20 6.742 19.582 5.186ZM8 13V7L13 10L8 13Z"
                          fill="white"
                        />
                      </svg>
                      <svg
                        width="12"
                        height="12"
                        viewBox="0 0 24 24"
                        fill="none"
                        className={`transition-transform ${
                          openSocial === "youtube" ? "rotate-180" : ""
                        }`}
                      >
                        <path
                          d="M17.8534 9.85369L12.8537 14.8534C12.8073 14.8999 12.7522 14.9367 12.6915 14.9619C12.6308 14.9871 12.5657 15 12.5 15C12.4343 15 12.3692 14.9871 12.3085 14.9619C12.2478 14.9367 12.1927 14.8999 12.1463 14.8534L7.14663 9.85369C7.07663 9.78377 7.02895 9.69465 7.00963 9.59761C6.9903 9.50058 7.00021 9.39999 7.03808 9.30858C7.07595 9.21718 7.1401 9.13907 7.22239 9.08413C7.30468 9.0292 7.40142 8.99992 7.50036 9H17.4996C17.5986 8.99992 17.6953 9.0292 17.7776 9.08413C17.8599 9.13907 17.924 9.21718 17.9619 9.30858C17.9998 9.39999 18.0097 9.50058 17.9904 9.59761C17.971 9.69465 17.9234 9.78377 17.8534 9.85369Z"
                          fill="white"
                        />
                      </svg>
                    </button>
                    {openSocial === "youtube" && (
                      <div
                        className="absolute bottom-full left-0 mb-2 flex flex-col rounded-[10px] border-2 border-white overflow-hidden z-50"
                        style={{
                          minWidth: "180px",
                          background: "rgba(0, 3, 38, 0.5)",
                          backdropFilter: "blur(10px)",
                        }}
                      >
                        {centersData.map((center, index) => {
                          const dc = menuData?.diving_centers.find(
                            (c) => c.slug === center.id
                          );
                          if (!dc?.contact_youtube) return null;
                          return (
                            <a
                              key={center.id}
                              href={dc.contact_youtube}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={() => setOpenSocial(null)}
                              className={`flex h-[44px] items-center gap-[10px] px-[14px] text-white transition-all hover:bg-[#111d9e] ${
                                index === 0 ? "rounded-t-[8px]" : ""
                              } ${
                                index === centersData.length - 1
                                  ? "rounded-b-[8px]"
                                  : ""
                              }`}
                            >
                              <span
                                className="w-2 h-2 rounded-full flex-shrink-0"
                                style={{ background: center.color }}
                              />
                              <span className="text-[14px] font-medium">
                                {center.label}
                              </span>
                            </a>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  {/* Tripadvisor */}
                  <div className="relative">
                    <button
                      onClick={() =>
                        setOpenSocial(
                          openSocial === "instagram" ? null : "instagram"
                        )
                      }
                      className="rounded-lg p-2 flex items-center gap-1"
                    >
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 20 20"
                        fill="none"
                      >
                        <path
                          d="M10 1.802C12.67 1.802 12.987 1.812 14.041 1.86C16.751 1.986 18.013 3.27 18.139 5.959C18.188 7.013 18.197 7.33 18.197 10C18.197 12.671 18.187 12.987 18.139 14.041C18.012 16.728 16.754 18.014 14.041 18.14C12.987 18.188 12.671 18.198 10 18.198C7.33 18.198 7.013 18.188 5.96 18.14C3.241 18.013 1.988 16.725 1.862 14.04C1.813 12.987 1.803 12.67 1.803 10C1.803 7.33 1.814 7.013 1.862 5.96C1.989 3.27 3.247 1.986 5.96 1.86C7.014 1.812 7.33 1.802 10 1.802ZM10 0C7.284 0 6.944 0.012 5.878 0.06C2.246 0.227 0.228 2.242 0.061 5.877C0.012 6.944 0 7.284 0 10C0 12.716 0.012 13.056 0.06 14.122C0.227 17.754 2.242 19.772 5.877 19.939C6.944 19.988 7.284 20 10 20C12.716 20 13.056 19.988 14.122 19.94C17.751 19.773 19.775 17.757 19.938 14.123C19.988 13.056 20 12.716 20 10C20 7.284 19.988 6.944 19.94 5.878C19.777 2.249 17.758 0.228 14.123 0.061C13.056 0.012 12.716 0 10 0ZM10 4.865C7.164 4.865 4.865 7.164 4.865 10C4.865 12.836 7.164 15.136 10 15.136C12.836 15.136 15.135 12.837 15.135 10C15.135 7.164 12.836 4.865 10 4.865ZM10 13.333C8.159 13.333 6.667 11.842 6.667 10C6.667 8.159 8.159 6.667 10 6.667C11.841 6.667 13.333 8.159 13.333 10C13.333 11.842 11.841 13.333 10 13.333ZM15.338 3.462C14.675 3.462 14.139 3.998 14.139 4.661C14.139 5.324 14.675 5.86 15.338 5.86C16.001 5.86 16.537 5.324 16.537 4.661C16.537 3.998 16.001 3.462 15.338 3.462Z"
                          fill="white"
                        />
                      </svg>
                      <svg
                        width="12"
                        height="12"
                        viewBox="0 0 24 24"
                        fill="none"
                        className={`transition-transform ${
                          openSocial === "instagram" ? "rotate-180" : ""
                        }`}
                      >
                        <path
                          d="M17.8534 9.85369L12.8537 14.8534C12.8073 14.8999 12.7522 14.9367 12.6915 14.9619C12.6308 14.9871 12.5657 15 12.5 15C12.4343 15 12.3692 14.9871 12.3085 14.9619C12.2478 14.9367 12.1927 14.8999 12.1463 14.8534L7.14663 9.85369C7.07663 9.78377 7.02895 9.69465 7.00963 9.59761C6.9903 9.50058 7.00021 9.39999 7.03808 9.30858C7.07595 9.21718 7.1401 9.13907 7.22239 9.08413C7.30468 9.0292 7.40142 8.99992 7.50036 9H17.4996C17.5986 8.99992 17.6953 9.0292 17.7776 9.08413C17.8599 9.13907 17.924 9.21718 17.9619 9.30858C17.9998 9.39999 18.0097 9.50058 17.9904 9.59761C17.971 9.69465 17.9234 9.78377 17.8534 9.85369Z"
                          fill="white"
                        />
                      </svg>
                    </button>
                    {openSocial === "instagram" && (
                      <div
                        className="absolute bottom-full left-0 mb-2 flex flex-col rounded-[10px] border-2 border-white overflow-hidden z-50"
                        style={{
                          minWidth: "180px",
                          background: "rgba(0, 3, 38, 0.5)",
                          backdropFilter: "blur(10px)",
                        }}
                      >
                        {centersData.map((center, index) => {
                          const dc = menuData?.diving_centers.find(
                            (c) => c.slug === center.id
                          );
                          if (!dc?.contact_tripadvisor) return null;
                          return (
                            <a
                              key={center.id}
                              href={dc.contact_tripadvisor}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={() => setOpenSocial(null)}
                              className={`flex h-[44px] items-center gap-[10px] px-[14px] text-white transition-all hover:bg-[#111d9e] ${
                                index === 0 ? "rounded-t-[8px]" : ""
                              } ${
                                index === centersData.length - 1
                                  ? "rounded-b-[8px]"
                                  : ""
                              }`}
                            >
                              <span
                                className="w-2 h-2 rounded-full flex-shrink-0"
                                style={{ background: center.color }}
                              />
                              <span className="text-[14px] font-medium">
                                {center.label}
                              </span>
                            </a>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
