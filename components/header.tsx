/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import {
  usePathname,
  useRouter,
  useSelectedLayoutSegments,
} from "next/navigation";
import Link from "next/link";
import { useMenu } from "@/app/hooks/useMenu";

type Language = {
  prefix: string;
  label: string;
  default: boolean;
  icon: string;
};

export const Header: React.FC<{
  locale: string;
  logoUrl: string;
  logoAlt: string;
}> = ({ locale, logoUrl, logoAlt }) => {
  const pathname = usePathname();

  // ← единственный источник данных меню, кэшируется глобально
  const { menuData } = useMenu(locale);

  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
  const [selectedLang, setSelectedLang] = useState(locale.toUpperCase());
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [selectedCenter, setSelectedCenter] = useState("");
  const [mobileOpenDropdown, setMobileOpenDropdown] = useState<string | null>(
    null
  );
  const segments = useSelectedLayoutSegments();
  const isNotFound = segments.length === 0 && pathname !== "/";
  const [languages, setLanguages] = useState<Language[]>([]);

  // Languages — отдельный маленький запрос, не меню
  useEffect(() => {
    fetch("https://cp.haliotis.space/api/v1/configs/languages")
      .then((res) => res.json())
      .then((data) => setLanguages(data?.data ?? []));
  }, []);

  const transparentRoutes = [
    "/",
    "/another-page",
    "/courses",
    "/diving",
    "/boat-tours",
    "/contacts",
    "/snorkeling",
    "/dolphin-watching",
  ];

  const isTransparentInitially =
    transparentRoutes.some((route) => pathname.startsWith(route)) ||
    !isNotFound;

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeNav, setActiveNav] = useState("snorkeling");
  const [isScrolled, setIsScrolled] = useState(false);

  const navItems = (menuData?.data.main ?? []).map((item) => ({
    id: item.slug ?? item.label.toLowerCase().replace(/\s+/g, '-'),
    label: item.label,
    hasDropdown: (item.children?.length ?? 0) > 0,
    dropdownType: (item.children?.length ?? 0) > 0 ? "dropdown" : null,   // просто флаг, что это дропдаун
    href: item.url ?? `/${item.slug || ''}`,
    children: item.children,
    rawItem: item,   // передаём оригинальный item, чтобы внутри дропдауна можно было смотреть на структуру
  }));
  const centersData = (menuData?.diving_centers ?? [])
    .sort((a, b) => a.position - b.position)
    .map((c) => ({
      id: c.slug,
      label: c.name.toUpperCase(),
      color: c.color,
    }));

 // Находим пункт меню, у которого дети имеют картинки и их много
// (точно так же, как мы определяем dropdownType = 'courses')
// Находим пункт "Cursos" по наличию большого количества детей + menu_layout === "list"
// Это работает независимо от языка и наличия картинок
const coursesMenuItem = menuData?.data.main.find((item) => {
  const hasChildren = (item.children?.length ?? 0) >= 5;           // курсов обычно много
  const isListLayout = item.menu_layout === "list";
  const hasCourseUrl = item.url?.toLowerCase().includes("/cursos") || 
                       item.slug?.toLowerCase().includes("cursos");

  return hasChildren && (isListLayout || hasCourseUrl);
});

const coursesData = (coursesMenuItem?.children ?? []).map((course) => ({
  id: course.slug ?? course.label.toLowerCase().replace(/\s+/g, '-'),
  label: course.label,
  image: course.img_url ?? "",   // может быть пустым — это нормально
}));
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 0);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  const dropdownButtonRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const dropdownRef = useRef<HTMLDivElement>(null);
  const coursesRef = useRef<HTMLDivElement>(null);
  const langRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const langButtonRef = useRef<HTMLButtonElement>(null);
  const [langButtonWidth, setLangButtonWidth] = useState<number | null>(null);

  const handleToMain = () => router.push("/");

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
  
      if (!isInsideDropdown && !isInsideButton && !isInsideLang) {
        setOpenDropdown(null);
        setMobileOpenDropdown(null);
        setIsLangMenuOpen(false);
      }
    };
  
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  const MobileDynamicDropdown = ({
    item,
    centersData,
    coursesData,
    setMobileOpenDropdown,
    setIsMenuOpen,
  }: {
    item: any;
    centersData: any[];
    coursesData: any[];
    setMobileOpenDropdown: (value: string | null) => void;
    setIsMenuOpen: (value: boolean) => void;
  }) => {
    const children = item.children || [];
    const raw = item.rawItem || {};
  
    const isCenters = children.some((child: any) => child.link_type === "dive_center");
    const isCourses = children.length >= 5 && raw.menu_layout === "list";
  
    // ==================== CENTERS - MOBILE ====================
    if (isCenters) {
      return (
        <div className="absolute rounded-lg -left-3.5 -top-2 z-10 w-[calc(100%_+_28px)] overflow-hidden rounded-t-lg" style={{ background: "#fff" }}>
          <button 
            onClick={() => setMobileOpenDropdown(null)}
            className="flex h-[42px] w-full items-center justify-between px-[14px] py-[10px]"
          >
            <span className="text-[15px] font-normal uppercase leading-[120%] text-black">CENTROS</span>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="rotate-180">
              <path d="M17.8534 9.85369L12.8537 14.8534C12.8073 14.8999 12.7522 14.9367 12.6915 14.9619C12.6308 14.9871 12.5657 15 12.5 15C12.4343 15 12.3692 14.9871 12.3085 14.9619C12.2478 14.9367 12.1927 14.8999 12.1463 14.8534L7.14663 9.85369C7.07663 9.78377 7.02895 9.69465 7.00963 9.59761C6.9903 9.50058 7.00021 9.39999 7.03808 9.30858C7.07595 9.21718 7.1401 9.13907 7.22239 9.08413C7.30468 9.0292 7.40142 8.99992 7.50036 9H17.4996C17.5986 8.99992 17.6953 9.0292 17.7776 9.08413C17.8599 9.13907 17.924 9.21718 17.9619 9.30858C17.9998 9.39999 18.0097 9.50058 17.9904 9.59761C17.971 9.69465 17.9234 9.78377 17.8534 9.85369Z" fill="black"/>
            </svg>
          </button>
  
          <div className="flex flex-col bg-[#1a1a3e] border-2 border-white rounded-lg">
            {centersData.map((center, index) => (
              <button
                key={center.id}
                onClick={() => {
                  setSelectedCenter(center.id);
                  router.push("/centers");
                  setIsMenuOpen(false);
                  setMobileOpenDropdown(null);
                }}
                className={`flex h-[44px] items-center cursor-pointer justify-between px-[14px] transition-all hover:bg-[#111d9e] ${
                  selectedCenter === center.id ? "bg-[#111d9e]" : ""
                } ${index === centersData.length - 1 ? "rounded-b-lg" : ""}`}
              >
                <span className="text-[15px] font-semibold uppercase leading-[160%]" style={{ color: center.color }}>
                  {center.label}
                </span>
                {selectedCenter === center.id && (
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M9.8537 6.14663L14.8534 11.1463C14.8999 11.1927 14.9367 11.2478 14.9619 11.3085C14.9871 11.3692 15 11.4343 15 11.5C15 11.5657 14.9871 11.6308 14.9619 11.6915C14.9367 11.7522 14.8999 11.8073 14.8534 11.8537L9.8537 16.8534C9.78377 16.9234 9.69465 16.971 9.59762 16.9904C9.50058 17.0097 9.39999 16.9998 9.30859 16.9619C9.21718 16.924 9.13907 16.8599 9.08414 16.7776C9.0292 16.6953 8.99992 16.5986 9 16.4996L9 6.50036C8.99992 6.40142 9.0292 6.30468 9.08414 6.22239C9.13907 6.1401 9.21718 6.07595 9.30859 6.03808C9.39999 6.00021 9.50058 5.99031 9.59761 6.00963C9.69465 6.02895 9.78377 6.07663 9.8537 6.14663Z" fill={center.color} />
                  </svg>
                )}
              </button>
            ))}
          </div>
        </div>
      );
    }
  
    // ==================== COURSES - MOBILE ====================
    if (isCourses) {
      return (
        <div
          className="absolute -left-3.5 -top-2 z-10 w-[calc(100%_+_28px)] overflow-hidden rounded-lg"
          style={{ background: "#fff", maxHeight: "600px", overflowY: "auto" }}
        >
          <button
            onClick={() => setMobileOpenDropdown(null)}
            className="flex h-[42px] w-full items-center justify-between px-[14px] py-[10px]"
          >
            <span className="text-[15px] font-normal uppercase leading-[120%] text-black">CURSOS</span>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="rotate-180">
              <path d="M17.8534 9.85369L12.8537 14.8534C12.8073 14.8999 12.7522 14.9367 12.6915 14.9619C12.6308 14.9871 12.5657 15 12.5 15C12.4343 15 12.3692 14.9871 12.3085 14.9619C12.2478 14.9367 12.1927 14.8999 12.1463 14.8534L7.14663 9.85369C7.07663 9.78377 7.02895 9.69465 7.00963 9.59761C6.9903 9.50058 7.00021 9.39999 7.03808 9.30858C7.07595 9.21718 7.1401 9.13907 7.22239 9.08413C7.30468 9.0292 7.40142 8.99992 7.50036 9H17.4996C17.5986 8.99992 17.6953 9.0292 17.7776 9.08413C17.8599 9.13907 17.924 9.21718 17.9619 9.30858C17.9998 9.39999 18.0097 9.50058 17.9904 9.59761C17.971 9.69465 17.9234 9.78377 17.8534 9.85369Z" fill="black"/>
            </svg>
          </button>
  
          <div className="grid grid-cols-3 gap-[10px] bg-[#1a1a3e] border-2 border-white rounded-lg p-[10px] pb-[20px]">
            {coursesData.map((course) => (
              <Link
                key={course.id}
                href="/courses"
                onClick={() => {
                  setMobileOpenDropdown(null);
                  setIsMenuOpen(false);
                }}
                className="flex flex-col items-center gap-[5px] rounded-[20px] px-0 pb-[5px] pt-[10px]"
              >
                <div className="h-[80px] w-[80px] overflow-hidden rounded-[16px]">
                  <Image
                    src={course.image || "/placeholder.jpg"}
                    alt={course.label}
                    width={80}
                    height={80}
                    className="h-full w-full object-cover"
                  />
                </div>
                <span className="text-center text-[16px] font-normal leading-[140%] text-white">
                  {course.label}
                </span>
              </Link>
            ))}
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
    dropdownRef,
    coursesRef,
    setOpenDropdown,
  }: {
    item: any;
    centersData: any[];
    coursesData: any[];
    dropdownRef: any
    coursesRef: any
    setOpenDropdown: (value: string | null) => void;
  }) => {
    const children = item.children || [];
    const raw = item.rawItem || {};
  
    // Определяем тип дропдауна один раз в одном месте
    const isCenters = children.some((child: any) => child.link_type === "dive_center");
    const isCourses = children.length >= 5 && raw.menu_layout === "list";
  
    // ==================== CENTERS DROPDOWN ====================
    if (isCenters) {
      return (
        <div
          ref={dropdownRef}
          className="absolute -left-2 top-4 z-50 mt-2 flex flex-col gap-0 rounded-tr-[10px] rounded-b-[10px] border-2 border-white p-0"
          style={{ width: "238px", background: "rgba(0, 3, 38, 0.5)", backdropFilter: "blur(10px)", boxShadow: "0 4px 4px 0 rgba(0,0,0,0.25)" }}
        >
          {centersData.map((center, index) => (
            <button
              key={center.id}
              onClick={() => {
                setSelectedCenter(center.id);
                router.push("/centers");
                setOpenDropdown(null);
              }}
              className={`flex h-[44px] cursor-pointer items-center justify-between px-[14px] transition-all hover:bg-[#111d9e] ${selectedCenter === center.id ? "bg-[#111d9e]" : ""} ${index === 0 ? "rounded-t-[8px]" : ""} ${index === centersData.length - 1 ? "rounded-b-[8px]" : ""}`}
            >
              <span className="text-[15px] font-semibold uppercase leading-[160%]" style={{ fontFamily: "var(--font-family)", color: center.color }}>
                {center.label}
              </span>
              {selectedCenter === center.id ? (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M9.8537 6.14663L14.8534 11.1463C14.8999 11.1927 14.9367 11.2478 14.9619 11.3085C14.9871 11.3692 15 11.4343 15 11.5C15 11.5657 14.9871 11.6308 14.9619 11.6915C14.9367 11.7522 14.8999 11.8073 14.8534 11.8537L9.8537 16.8534C9.78377 16.9234 9.69465 16.971 9.59762 16.9904C9.50058 17.0097 9.39999 16.9998 9.30859 16.9619C9.21718 16.924 9.13907 16.8599 9.08414 16.7776C9.0292 16.6953 8.99992 16.5986 9 16.4996L9 6.50036C8.99992 6.40142 9.0292 6.30468 9.08414 6.22239C9.13907 6.1401 9.21718 6.07595 9.30859 6.03808C9.39999 6.00021 9.50058 5.99031 9.59761 6.00963C9.69465 6.02895 9.78377 6.07663 9.8537 6.14663Z" fill={center.color} />
                </svg>
              ) : (
                <svg width="24" height="25" viewBox="0 0 24 25" fill="none">
                  <path d="M4.94092 0.139404C5.33371 0.595553 5.84055 1.62189 6.09396 2.44549C6.43607 3.31977 6.55011 5.10635 6.34737 6.42411C6.29669 6.72821 6.23334 7.04498 6.15731 7.34908C6.15731 7.14635 6.14464 6.72821 6.14464 6.41144C6.10663 4.27008 5.80253 2.12872 4.94092 0.139404Z" fill="#F49519"/>
                </svg>
              )}
            </button>
          ))}
        </div>
      );
    }
  
    // ==================== COURSES DROPDOWN ====================
    if (isCourses) {
      return (
        <div
          ref={coursesRef}
          className="absolute left-0 top-9 z-50 mt-2  rounded-[10px] border-2 border-white p-6
                     bg-[rgba(0,3,38,0.5)] backdrop-blur-[10px] shadow-xl"
          style={{ 
            minWidth: "560px",      // минимальная комфортная ширина для 3 колонок
            maxWidth: "92vw"        // не вылезает за экран
          }}
        >
          <div className="grid grid-cols-3 gap-4">
            {coursesData.map((course) => (
              <Link 
                key={course.id} 
                href="/courses" 
                onClick={() => setOpenDropdown(null)}
                className="flex flex-col items-center gap-3 rounded-2xl border-2 border-transparent p-3 transition-all hover:border-white hover:bg-[#111d9e]/80"
              >
                <div className="h-[78px] w-[78px] overflow-hidden rounded-xl bg-black/30">
                  <Image 
                    src={course.image || "/placeholder.jpg"} 
                    alt={course.label} 
                    width={78} 
                    height={78} 
                    className="h-full w-full object-cover" 
                  />
                </div>
                <span className="text-center text-sm font-semibold leading-tight text-white px-1">
                  {course.label}
                </span>
              </Link>
            ))}
          </div>
        </div>
      );
    }
  
    // Если в будущем добавят новый тип дропдауна — просто добавь сюда новый if
    return null;
  };

  return (
    <>
      <header className="sticky top-0 z-50 p-5">
        {(!isTransparentInitially || isScrolled) && (
          <div className="absolute inset-0 bg-[#281d4d] -z-10" />
        )}
        <div className="absolute left-5 right-5 bottom-0 border-b border-[rgba(255,255,255,0.2)]" />
        <div className="flex items-center justify-between gap-4">
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
  <div className="flex w-full items-center justify-center gap-[clamp(8px,1.4vw,28px)]">
    {navItems.slice(0, -1).map((item) => (
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
              setOpenDropdown(openDropdown !== item.id ? item.id : null);
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
              <span className="absolute inset-x-[-8px] inset-y-[-8px] rounded-[8px] bg-white pointer-events-none" aria-hidden="true" />
            )}
            <p className={`relative z-10 ${openDropdown === item.id ? "text-black" : "text-white"}`}>
              {item.label}
            </p>
            {item.hasDropdown && (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className={`transition-transform xl:h-6 xl:w-6 relative z-10 ${openDropdown === item.id ? "rotate-180" : ""}`}>
                <path d="M17.8534 9.85369L12.8537 14.8534C12.8073 14.8999 12.7522 14.9367 12.6915 14.9619C12.6308 14.9871 12.5657 15 12.5 15C12.4343 15 12.3692 14.9871 12.3085 14.9619C12.2478 14.9367 12.1927 14.8999 12.1463 14.8534L7.14663 9.85369C7.07663 9.78377 7.02895 9.69465 7.00963 9.59761C6.9903 9.50058 7.00021 9.39999 7.03808 9.30858C7.07595 9.21718 7.1401 9.13907 7.22239 9.08413C7.30468 9.0292 7.40142 8.99992 7.50036 9H17.4996C17.5986 8.99992 17.6953 9.0292 17.7776 9.08413C17.8599 9.13907 17.924 9.21718 17.9619 9.30858C17.9998 9.39999 18.0097 9.50058 17.9904 9.59761C17.971 9.69465 17.9234 9.78377 17.8534 9.85369Z" fill={openDropdown === item.id ? "black" : "white"} />
              </svg>
            )}
          </span>

          {activeNav === item.id && !openDropdown && pathname === `/${item.id}` && (
            <div className="absolute -bottom-[16.5px] left-0 right-0 mx-auto h-0.5 bg-[#e84814]" style={{ width: "100%", border: "1px solid #e84814" }} />
          )}
        </button>

        {/* Универсальный дропдаун без хардкода */}
        {item.hasDropdown && openDropdown === item.id && (
          <DynamicDropdown
            item={item}
            centersData={centersData}
            coursesData={coursesData}
            dropdownRef={dropdownRef}
            coursesRef={coursesRef}
            setOpenDropdown={setOpenDropdown}
          />
        )}
      </div>
    ))}
  </div>
</nav>

          {/* Desktop Right Panel */}
          <div className="hidden flex-shrink-0 rounded-xl bg-black/10 p-1 xl:flex">
            <div className="flex items-center gap-[clamp(2px,0.4vw,8px)] px-[clamp(2px,0.3vw,8px)]">
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
                      width: langButtonWidth ? `${langButtonWidth}px` : "75px",
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
                          className={`flex h-[40px] w-full cursor-pointer items-center justify-center text-[15px] font-semibold transition-colors ${
                            selectedLang === lang.prefix.toUpperCase()
                              ? "text-[#e84814]"
                              : "text-white hover:text-[#e84814]"
                          } ${
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

              <button className="rounded-lg p-2 flex items-center gap-1">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path
                    d="M9.99996 1.69995C5.41663 1.69995 1.66663 5.44162 1.66663 10.05C1.66663 14.2166 4.71663 17.675 8.69996 18.3V12.4666H6.58329V10.05H8.69996V8.20828C8.69996 6.11662 9.94163 4.96662 11.85 4.96662C12.7583 4.96662 13.7083 5.12495 13.7083 5.12495V7.18328H12.6583C11.625 7.18328 11.3 7.82495 11.3 8.4833V10.05H13.6166L13.2416 12.4666H11.3V18.3C13.2636 17.9898 15.0518 16.9879 16.3415 15.475C17.6313 13.9621 18.3378 12.038 18.3333 10.05C18.3333 5.44162 14.5833 1.69995 9.99996 1.69995Z"
                    fill="white"
                  />
                </svg>
              </button>
              <button className="flex items-center gap-1 rounded-lg p-2">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path
                    d="M19.582 5.186C19.352 4.322 18.674 3.644 17.81 3.414C16.254 3 10 3 10 3C10 3 3.746 3 2.19 3.414C1.326 3.644 0.648 4.322 0.418 5.186C0 6.742 0 10 0 10C0 10 0 13.258 0.418 14.814C0.648 15.678 1.326 16.356 2.19 16.586C3.746 17 10 17 10 17C10 17 16.254 17 17.81 16.586C18.674 16.356 19.352 15.678 19.582 14.814C20 13.258 20 10 20 10C20 10 20 6.742 19.582 5.186ZM8 13V7L13 10L8 13Z"
                    fill="white"
                  />
                </svg>
              </button>
              <button className="rounded-lg p-2 flex items-center gap-1">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path
                    d="M10 1.802C12.67 1.802 12.987 1.812 14.041 1.86C16.751 1.986 18.013 3.27 18.139 5.959C18.188 7.013 18.197 7.33 18.197 10C18.197 12.671 18.187 12.987 18.139 14.041C18.012 16.728 16.754 18.014 14.041 18.14C12.987 18.188 12.671 18.198 10 18.198C7.33 18.198 7.013 18.188 5.96 18.14C3.241 18.013 1.988 16.725 1.862 14.04C1.813 12.987 1.803 12.67 1.803 10C1.803 7.33 1.814 7.013 1.862 5.96C1.989 3.27 3.247 1.986 5.96 1.86C7.014 1.812 7.33 1.802 10 1.802ZM10 0C7.284 0 6.944 0.012 5.878 0.06C2.246 0.227 0.228 2.242 0.061 5.877C0.012 6.944 0 7.284 0 10C0 12.716 0.012 13.056 0.06 14.122C0.227 17.754 2.242 19.772 5.877 19.939C6.944 19.988 7.284 20 10 20C12.716 20 13.056 19.988 14.122 19.94C17.751 19.773 19.775 17.757 19.938 14.123C19.988 13.056 20 12.716 20 10C20 7.284 19.988 6.944 19.94 5.878C19.777 2.249 17.758 0.228 14.123 0.061C13.056 0.012 12.716 0 10 0ZM10 4.865C7.164 4.865 4.865 7.164 4.865 10C4.865 12.836 7.164 15.136 10 15.136C12.836 15.136 15.135 12.837 15.135 10C15.135 7.164 12.836 4.865 10 4.865ZM10 13.333C8.159 13.333 6.667 11.842 6.667 10C6.667 8.159 8.159 6.667 10 6.667C11.841 6.667 13.333 8.159 13.333 10C13.333 11.842 11.841 13.333 10 13.333ZM15.338 3.462C14.675 3.462 14.139 3.998 14.139 4.661C14.139 5.324 14.675 5.86 15.338 5.86C16.001 5.86 16.537 5.324 16.537 4.661C16.537 3.998 16.001 3.462 15.338 3.462Z"
                    fill="white"
                  />
                </svg>
              </button>
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
      </header>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-50 bg-[#281D4D] xl:hidden">
          <div className="flex h-full flex-col relative">
            <div className="absolute bottom-20 right-10 opacity-50 pointer-events-none">
              {/* decorative svg */}
            </div>

            <div className="flex items-center justify-between p-5">
              <div className="relative h-10 w-32">
                <svg width="173" height="41" viewBox="0 0 173 41" fill="none">
                  <path
                    d="M0 29.328V11.1298H3.83949V18.7911H13.4312V11.1298H17.2707V29.328H13.4312V22.6312H3.83949V29.328H0Z"
                    fill="white"
                  />
                </svg>
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
          setMobileOpenDropdown={setMobileOpenDropdown}
          setIsMenuOpen={setIsMenuOpen}
        />
      )}
    </div>
  ))}
</nav>

            <div className="mt-auto p-6">
              <div className="flex items-center gap-4">
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
                            className={`flex h-[40px] w-[71px] items-center justify-center text-[15px] font-semibold transition-colors ${
                              selectedLang === lang.prefix.toUpperCase()
                                ? "text-[#e84814]"
                                : "text-white hover:text-[#e84814]"
                            } ${
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
                <button className="rounded-lg p-2">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path
                      d="M9.99996 1.69995C5.41663 1.69995 1.66663 5.44162 1.66663 10.05C1.66663 14.2166 4.71663 17.675 8.69996 18.3V12.4666H6.58329V10.05H8.69996V8.20828C8.69996 6.11662 9.94163 4.96662 11.85 4.96662C12.7583 4.96662 13.7083 5.12495 13.7083 5.12495V7.18328H12.6583C11.625 7.18328 11.3 7.82495 11.3 8.4833V10.05H13.6166L13.2416 12.4666H11.3V18.3C13.2636 17.9898 15.0518 16.9879 16.3415 15.475C17.6313 13.9621 18.3378 12.038 18.3333 10.05C18.3333 5.44162 14.5833 1.69995 9.99996 1.69995Z"
                      fill="white"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
