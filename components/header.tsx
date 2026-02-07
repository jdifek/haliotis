"use client";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";

export const Header: React.FC = ({}) => {
  const pathname = usePathname();

  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
  const [selectedLang, setSelectedLang] = useState("En");
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [selectedCenter, setSelectedCenter] = useState("");
  const [mobileOpenDropdown, setMobileOpenDropdown] = useState<string | null>(
    null
  );
  const isTransparentInitially =
    pathname === "/" ||
    pathname === "/another-page" ||
    pathname.startsWith("/course/");

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeNav, setActiveNav] = useState("snorkeling");
  const [isScrolled, setIsScrolled] = useState(false);
  const navItems = [
    { id: "centers", label: "Centers", hasDropdown: true },
    { id: "courses", label: "Courses", hasDropdown: true },
    { id: "snorkeling", label: "Snorkeling", hasDropdown: false },
    { id: "diving", label: "Diving", hasDropdown: false },
    { id: "freedive", label: "Freedive", hasDropdown: false },
    { id: "travel", label: "Travel", hasDropdown: false },
    { id: "shop", label: "Shop", hasDropdown: false },
    { id: "prices", label: "Prices", hasDropdown: false },
    { id: "contacts", label: "Contacts", hasDropdown: false },
  ];
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  const languages = [
    { code: "En", label: "English" },
    { code: "Pt", label: "Português" },
    { code: "Es", label: "Español" },
    { code: "Fr", label: "Français" },
  ];

  const centersData = [
    { id: "peniche", label: "PENICHE", color: "#F49519" },
    { id: "sesimbra", label: "SESIMBRA", color: "#A0C52E" },
    { id: "madeira", label: "MADEIRA", color: "#E84814" },
    { id: "santa-maria", label: "SANTA MARIA", color: "#FED402" },
    { id: "faial", label: "FAIAL", color: "#568DD9" },
    { id: "sao-vicente", label: "SAO VICENTE", color: "#7acbe2" },
  ];

  const coursesData = [
    { id: "promotions", label: "Promotions", image: "/Rectangle 8.png" },
    { id: "beginner", label: "Beginner", image: "/Rectangle 8.png" },
    { id: "advanced", label: "Advanced", image: "/Rectangle 8.png" },
    { id: "rescue", label: "Rescue", image: "/Rectangle 8.png" },
    { id: "specialties", label: "Specialties", image: "/Rectangle 8.png" },
    { id: "divemaster", label: "Divemaster", image: "/Rectangle 8.png" },
    {
      id: "dive-instructor",
      label: "Dive Instructor",
      image: "/Rectangle 8.png",
    },
    { id: "tec-diving", label: "Tec Diving", image: "/Rectangle 8.png" },
  ];
  const dropdownRef = useRef<HTMLDivElement>(null); // для centers
  const coursesRef = useRef<HTMLDivElement>(null);
  const langRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const centersButtonRef = useRef<HTMLButtonElement>(null);
  const coursesButtonRef = useRef<HTMLButtonElement>(null);
  const langButtonRef = useRef<HTMLButtonElement>(null);
  const [langButtonWidth, setLangButtonWidth] = useState<number | null>(null);
  const handleToMain = () => {
    router.push("/");
  };
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;

      const isInside =
        (dropdownRef.current && dropdownRef.current.contains(target)) ||
        (coursesRef.current && coursesRef.current.contains(target)) ||
        (langRef.current && langRef.current.contains(target)) ||
        (centersButtonRef.current &&
          centersButtonRef.current.contains(target)) ||
        (coursesButtonRef.current &&
          coursesButtonRef.current.contains(target)) ||
        (langButtonRef.current && langButtonRef.current.contains(target));

      if (!isInside) {
        setOpenDropdown(null);
        setMobileOpenDropdown(null);
        setIsLangMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  return (
    <>
      <header className="sticky top-0 z-50 p-5 ">
        {/* Подложка при скролле */}
        {(!isTransparentInitially || isScrolled) && (
          <div className="absolute inset-0 bg-[#281d4d] -z-10" />
        )}{" "}
        <div className="absolute left-5 right-5 bottom-0 border-b border-[rgba(255,255,255,0.2)]" />
        <div className="flex items-center justify-between gap-4">
          <div
            onClick={handleToMain}
            className="relative cursor-pointer flex-shrink-0  lg:hidden"
          >
            <svg
              width="173"
              height="41"
              viewBox="0 0 173 41"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M116.833 13.5647L116.337 13.714C115.841 13.714 115.592 13.4131 115.591 12.8598C115.591 12.258 115.838 11.9049 116.335 11.9061L116.831 12.0566V12.3078L116.335 12.1573C115.938 12.1573 115.839 12.3575 115.839 12.8598C115.841 13.3124 115.94 13.5126 116.337 13.5126L116.833 13.3633V13.5647ZM116.314 11.1296C115.381 11.1296 114.626 11.8843 114.626 12.8161C114.626 13.7485 115.381 14.5032 116.314 14.5032C117.245 14.5032 118 13.7485 118 12.8161C118 11.8843 117.245 11.1296 116.314 11.1296Z"
                fill="white"
              />
              <path
                d="M0 29.328V11.1298H3.83949V18.7911H13.4312V11.1298H17.2707V29.328H13.4312V22.6312H3.83949V29.328H0Z"
                fill="white"
              />
              <path
                d="M32.8497 19.7556V17.8088C32.8497 17.0257 32.5767 16.3705 32.0119 15.8245C31.4477 15.2603 30.7925 14.9879 30.0105 14.9879H25.1519C24.3693 14.9879 23.7135 15.2603 23.1493 15.8245C22.6033 16.3705 22.3303 17.0257 22.3303 17.8088V19.7556H32.8497ZM18.4727 29.3279V17.8088C18.4727 15.9701 19.1278 14.3867 20.42 13.0952C21.7298 11.7848 23.3131 11.1296 25.1519 11.1296H30.0105C31.8669 11.1296 33.4502 11.7848 34.7418 13.0764C36.0346 14.3691 36.6898 15.9519 36.6898 17.8088V29.3279H32.8497V23.6133H22.3303V29.3279H18.4727Z"
                fill="white"
              />
              <path
                d="M41.8227 11.1296V22.6487C41.8227 23.4319 42.095 24.0871 42.6416 24.6512C43.2052 25.1972 43.8604 25.4702 44.643 25.4702H52.2686V29.3279H44.643C42.8048 29.3279 41.2221 28.6727 39.9117 27.3624C38.6195 26.0708 37.9644 24.488 37.9644 22.6487V11.1296H41.8227Z"
                fill="white"
              />
              <path
                d="M53.27 29.3285H57.1101V15.5946H53.27V29.3285Z"
                fill="white"
              />
              <path
                d="M65.2564 14.9877C64.492 14.9877 63.8368 15.2601 63.2726 15.8243C62.7266 16.3702 62.4536 17.0254 62.4536 17.7898V22.6679C62.4536 23.4322 62.7266 24.0874 63.2726 24.6516C63.8368 25.1976 64.492 25.47 65.2564 25.47H70.1338C70.8982 25.47 71.5534 25.1976 72.0988 24.6516C72.6636 24.0874 72.9359 23.4322 72.9359 22.6679V17.7898C72.9359 17.0254 72.6636 16.3702 72.0988 15.8243C71.5534 15.2601 70.8982 14.9877 70.1338 14.9877H65.2564ZM70.1338 11.13C71.9714 11.13 73.5553 11.7852 74.8475 13.0767C76.1391 14.3689 76.7948 15.9523 76.7948 17.7898V22.6679C76.7948 24.5054 76.1391 26.0888 74.8475 27.3815C73.5553 28.6731 71.9714 29.3283 70.1338 29.3283H65.2564C63.4182 29.3283 61.8349 28.6731 60.5433 27.3815C59.2511 26.0888 58.5959 24.5054 58.5959 22.6679V17.7898C58.5959 15.9523 59.2511 14.3689 60.5433 13.0767C61.8349 11.7852 63.4182 11.13 65.2564 11.13H70.1338Z"
                fill="white"
              />
              <path
                d="M90.6137 14.9509H85.6458V29.3279H81.8239V14.9509H76.8555V11.1296H90.6137V14.9509Z"
                fill="white"
              />
              <path
                d="M91.5793 29.3285H95.4194V15.5946H91.5793V29.3285Z"
                fill="white"
              />
              <path
                d="M101.934 18.2638C102.062 18.2814 102.881 18.2814 104.391 18.2814H104.846H104.974C105.064 18.2638 105.137 18.2638 105.228 18.2638C107.066 18.2092 108.468 18.2996 109.414 18.5186C110.942 18.8632 112.089 19.573 112.853 20.6831C113.436 21.5385 113.726 22.4855 113.726 23.5411C113.726 25.5248 112.599 27.3812 110.851 28.4003C109.796 29.0191 108.668 29.3279 107.466 29.3279H101.897C100.551 29.3279 99.3136 28.9463 98.167 28.2001C97.0387 27.4534 96.2197 26.4524 95.6919 25.2154L99.259 23.6867C99.714 24.7604 100.733 25.4332 101.897 25.4332H107.466C108.468 25.4332 109.177 25.0698 109.596 24.36C109.76 24.0877 109.832 23.8135 109.832 23.5411C109.832 22.7579 109.177 22.3217 107.886 22.1943C107.139 22.1215 106.283 22.1027 105.319 22.1585L104.918 22.1761H104.482C102.68 22.2307 101.315 22.1397 100.387 21.9213C98.9132 21.5755 97.8024 20.8657 97.0569 19.7556C96.4745 18.919 96.1833 17.9726 96.1833 16.9165C96.1833 14.9333 97.3117 13.0952 99.0588 12.0578C100.096 11.439 101.225 11.1296 102.444 11.1296H107.375C108.722 11.1296 109.96 11.5112 111.088 12.258C112.216 13.0042 113.035 13.9863 113.563 15.2427L109.996 16.7709C109.559 15.6977 108.54 15.0243 107.375 15.0243H102.444C101.442 15.0243 100.733 15.3883 100.315 16.0981C100.151 16.3705 100.077 16.6441 100.077 16.9165C100.077 17.6808 100.697 18.1358 101.934 18.2638Z"
                fill="white"
              />
              <path
                d="M91.5793 14.9604H95.4194V11.13H91.5793V14.9604Z"
                fill="white"
              />
              <path
                d="M53.27 14.9604H57.1101V11.13H53.27V14.9604Z"
                fill="white"
              />
              <path
                d="M128.155 25.7597C128.612 26.8217 130.187 27.0786 131.762 26.4082C133.168 25.8091 133.794 24.0199 133.096 22.3981C132.422 20.8321 131.618 20.5123 129.426 20.9835C128.206 21.1306 127.724 24.7578 128.155 25.7597Z"
                fill="#E84814"
              />
              <path
                d="M135.063 27.2991C134.737 28.1661 135.507 29.181 136.792 29.6588C137.94 30.086 139.298 29.394 139.796 28.0692C140.276 26.7915 139.989 26.1642 138.457 25.2309C137.667 24.6448 135.371 26.4816 135.063 27.2991Z"
                fill="#E84814"
              />
              <path
                d="M145.22 30.3694C145.952 30.5604 146.715 29.8571 146.998 28.7829C147.25 27.8234 146.575 26.7865 145.456 26.4951C144.376 26.2142 143.889 26.497 143.256 27.8081C142.844 28.4919 144.529 30.1893 145.22 30.3694Z"
                fill="#E84814"
              />
              <path
                d="M153.354 29.1789C153.965 28.9843 154.19 28.1366 153.903 27.2402C153.645 26.4395 152.804 26.1759 151.871 26.4724C150.969 26.7592 150.634 27.0083 150.779 28.2319C150.797 28.9074 152.778 29.3617 153.354 29.1789Z"
                fill="#E84814"
              />
              <path
                d="M158.912 23.4732C158.388 23.5968 158.146 24.2911 158.33 25.0592C158.494 25.7446 159.266 26.1698 160.066 25.9807C160.838 25.7979 161.048 25.4586 161.004 24.4257C161.033 23.8604 159.405 23.3563 158.912 23.4732Z"
                fill="#E84814"
              />
              <path
                d="M164.096 21.773C164.529 21.8871 164.981 21.4729 165.15 20.8385C165.301 20.2721 164.903 19.6585 164.243 19.4839C163.605 19.316 163.316 19.4824 162.94 20.2556C162.696 20.6596 163.688 21.6655 164.096 21.773Z"
                fill="#E84814"
              />
              <path
                d="M166.198 16.8914C166.462 17.1307 166.935 17.0036 167.29 16.6172C167.607 16.2724 167.554 15.6925 167.152 15.3269C166.763 14.9739 166.498 14.986 165.944 15.3944C165.622 15.5898 165.95 16.6654 166.198 16.8914Z"
                fill="#E84814"
              />
              <path
                d="M167.932 11.7092C168.136 11.8795 168.484 11.7696 168.737 11.4703C168.962 11.2028 168.904 10.7716 168.591 10.5119C168.29 10.2613 168.093 10.2789 167.693 10.6014C167.459 10.7571 167.738 11.5492 167.932 11.7092Z"
                fill="#E84814"
              />
              <path
                d="M167.45 7.58467C167.525 7.75846 167.783 7.80083 168.041 7.69098C168.27 7.59291 168.374 7.30026 168.259 7.03506C168.149 6.7785 168.017 6.72633 167.658 6.80322C167.458 6.82715 167.38 7.42108 167.45 7.58467Z"
                fill="#E84814"
              />
              <path
                d="M166.45 5.22712C166.491 5.32206 166.631 5.34481 166.771 5.28479C166.897 5.23144 166.952 5.07216 166.89 4.9278C166.831 4.78775 166.759 4.75989 166.563 4.80148C166.455 4.81442 166.412 5.13768 166.45 5.22712Z"
                fill="#E84814"
              />
              <path
                d="M163.574 4.23426C163.6 4.29232 163.686 4.30644 163.772 4.26957C163.849 4.2374 163.883 4.13893 163.845 4.04988C163.809 3.96436 163.764 3.9471 163.644 3.9726C163.578 3.98084 163.551 4.17934 163.574 4.23426Z"
                fill="#E84814"
              />
              <path
                d="M165.096 4.1731C165.137 4.26764 165.277 4.29079 165.417 4.23077C165.543 4.17781 165.598 4.01814 165.536 3.87338C165.476 3.73373 165.405 3.70548 165.209 3.74746C165.101 3.7604 165.058 4.08366 165.096 4.1731Z"
                fill="#E84814"
              />
              <path
                d="M162.62 5.05877C162.645 5.11683 162.732 5.13095 162.818 5.09408C162.895 5.06152 162.929 4.96344 162.891 4.87439C162.854 4.78887 162.81 4.77122 162.69 4.79711C162.623 4.80495 162.596 5.00385 162.62 5.05877Z"
                fill="#E84814"
              />
              <path
                d="M162.868 5.85481C162.889 5.90306 162.96 5.91483 163.031 5.88423C163.096 5.85677 163.124 5.77517 163.092 5.70181C163.062 5.63041 163.025 5.6159 162.926 5.63748C162.87 5.64415 162.848 5.8093 162.868 5.85481Z"
                fill="#E84814"
              />
              <path
                d="M163.477 6.05041C163.493 6.08807 163.549 6.09748 163.605 6.07355C163.656 6.05197 163.677 5.98842 163.652 5.93075C163.629 5.87505 163.6 5.86328 163.522 5.88015C163.478 5.88564 163.462 6.01471 163.477 6.05041Z"
                fill="#E84814"
              />
              <path
                d="M164.008 5.86033C164.017 5.88151 164.049 5.88701 164.081 5.87327C164.109 5.86072 164.122 5.82502 164.108 5.79207C164.094 5.76029 164.078 5.75402 164.033 5.76304C164.008 5.76618 163.999 5.83993 164.008 5.86033Z"
                fill="#E84814"
              />
              <path
                d="M164.156 5.41238C164.161 5.42611 164.181 5.42886 164.201 5.42062C164.218 5.41317 164.227 5.39041 164.218 5.37001C164.209 5.3504 164.199 5.34648 164.171 5.35236C164.156 5.35432 164.15 5.39983 164.156 5.41238Z"
                fill="#E84814"
              />
              <path
                d="M163.852 5.07925C163.858 5.09259 163.877 5.09573 163.897 5.08749C163.915 5.08004 163.923 5.05728 163.914 5.03688C163.906 5.01727 163.895 5.01335 163.868 5.01923C163.853 5.02119 163.847 5.0667 163.852 5.07925Z"
                fill="#E84814"
              />
              <path
                d="M163.61 5.33338C163.613 5.3414 163.624 5.3426 163.635 5.33779C163.645 5.33378 163.65 5.32135 163.645 5.30972C163.64 5.29889 163.635 5.29689 163.619 5.3001C163.611 5.3009 163.607 5.32616 163.61 5.33338Z"
                fill="#E84814"
              />
              <path
                d="M134.007 36.6563C136.55 37.2663 138.826 37.8442 141.488 37.6625C151.136 37.0082 160.628 32.3701 166.965 25.0914C171.948 19.3682 173.069 10.2323 168.227 4.08347C167.382 3.00936 164.721 0.0396685 162.81 1.19498L162.585 1.35033L162.36 1.55394L162.135 1.81089L162.141 1.80501L162.096 1.93917L162.051 2.1467L162.024 2.40091C161.992 3.32987 163.181 4.96849 164.255 4.32277C164.814 3.98657 164.671 3.07252 164.658 2.5488L164.821 2.51428C165.02 3.31221 165.26 4.48518 164.287 4.88611C162.588 5.58597 161.069 3.55348 161.195 2.04038C161.401 -0.431873 164.672 -0.347921 166.21 0.667344C173.18 5.26428 174.515 14.3511 171.441 21.6949C169.617 26.0556 165.827 29.9017 162.05 32.5866C155.998 36.8866 149.08 39.7621 141.639 40.3976C138.586 40.6581 135.967 40.0328 133.034 39.3828C132.276 39.116 131.881 38.2883 132.15 37.535C132.419 36.7822 133.25 36.3888 134.007 36.6563Z"
                fill="white"
              />
            </svg>
          </div>
          <div
            onClick={handleToMain}
            className="relative cursor-pointer flex-shrink-0 hidden lg:block"
          >
            <svg
              width="158"
              height="25"
              viewBox="0 0 158 25"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-auto"
            >
              <path
                d="M155.838 3.24805L155.177 3.44711C154.515 3.44711 154.183 3.04576 154.181 2.30778C154.181 1.50508 154.511 1.03413 155.173 1.03575L155.835 1.23643V1.57143L155.174 1.37075C154.644 1.37075 154.511 1.63778 154.512 2.30778C154.515 2.91143 154.647 3.17846 155.177 3.17846L155.838 2.9794V3.24805ZM155.145 0C153.901 0 152.895 1.00662 152.895 2.24952C152.895 3.49323 153.901 4.49985 155.145 4.49985C156.388 4.49985 157.394 3.49323 157.394 2.24952C157.394 1.00662 156.388 0 155.145 0Z"
                fill="white"
              />
              <path
                d="M0 24.2742V0.000366211H5.1213V10.2195H17.9153V0.000366211H23.0366V24.2742H17.9153V15.3416H5.1213V24.2742H0Z"
                fill="white"
              />
              <path
                d="M43.8166 11.5059V8.9092C43.8166 7.86455 43.4525 6.99063 42.6992 6.26237C41.9466 5.50983 41.0727 5.14651 40.0297 5.14651H33.5489C32.5051 5.14651 31.6304 5.50983 30.8778 6.26237C30.1496 6.99063 29.7854 7.86455 29.7854 8.9092V11.5059H43.8166ZM24.6399 24.2739V8.9092C24.6399 6.45657 25.5138 4.34461 27.2373 2.62187C28.9843 0.874037 31.0963 0.00012207 33.5489 0.00012207H40.0297C42.5058 0.00012207 44.6177 0.874037 46.3405 2.59678C48.0648 4.32115 48.9387 6.4323 48.9387 8.9092V24.2739H43.8166V16.6514H29.7854V24.2739H24.6399Z"
                fill="white"
              />
              <path
                d="M55.7852 0.000244141V15.365C55.7852 16.4096 56.1486 17.2835 56.8776 18.0361C57.6294 18.7643 58.5033 19.1285 59.5471 19.1285H69.7185V24.274H59.5471C57.0953 24.274 54.9842 23.4001 53.2363 21.6523C51.5128 19.9296 50.6389 17.8184 50.6389 15.365V0.000244141H55.7852Z"
                fill="white"
              />
              <path
                d="M71.0542 24.2745H76.1763V5.95544H71.0542V24.2745Z"
                fill="white"
              />
              <path
                d="M87.0422 5.14607C86.0226 5.14607 85.1487 5.50939 84.3962 6.26193C83.6679 6.99019 83.3038 7.86411 83.3038 8.88367V15.3903C83.3038 16.4099 83.6679 17.2838 84.3962 18.0363C85.1487 18.7646 86.0226 19.1279 87.0422 19.1279H93.548C94.5676 19.1279 95.4415 18.7646 96.1689 18.0363C96.9223 17.2838 97.2856 16.4099 97.2856 15.3903V8.88367C97.2856 7.86411 96.9223 6.99019 96.1689 6.26193C95.4415 5.50939 94.5676 5.14607 93.548 5.14607H87.0422ZM93.548 0.000488281C95.999 0.000488281 98.1118 0.874404 99.8353 2.59715C101.558 4.3207 102.433 6.43267 102.433 8.88367V15.3903C102.433 17.8413 101.558 19.9533 99.8353 21.6776C98.1118 23.4004 95.999 24.2743 93.548 24.2743H87.0422C84.5904 24.2743 82.4784 23.4004 80.7557 21.6776C79.0321 19.9533 78.1582 17.8413 78.1582 15.3903V8.88367C78.1582 6.43267 79.0321 4.3207 80.7557 2.59715C82.4784 0.874404 84.5904 0.000488281 87.0422 0.000488281H93.548Z"
                fill="white"
              />
              <path
                d="M120.865 5.09715H114.239V24.2739H109.141V5.09715H102.514V0.00012207H120.865V5.09715Z"
                fill="white"
              />
              <path
                d="M122.153 24.2745H127.275V5.95544H122.153V24.2745Z"
                fill="white"
              />
              <path
                d="M135.965 9.51609C136.135 9.53955 137.228 9.53955 139.242 9.53955H139.849H140.019C140.14 9.51609 140.237 9.51609 140.359 9.51609C142.81 9.44326 144.68 9.56383 145.942 9.85594C147.981 10.3156 149.51 11.2623 150.53 12.7431C151.307 13.884 151.694 15.1472 151.694 16.5551C151.694 19.2012 150.19 21.6773 147.859 23.0367C146.451 23.8621 144.946 24.2739 143.344 24.2739H135.916C134.12 24.2739 132.47 23.7649 130.94 22.7697C129.435 21.7736 128.343 20.4384 127.639 18.7885L132.397 16.7494C133.004 18.1816 134.363 19.079 135.916 19.079H143.344C144.68 19.079 145.626 18.5943 146.184 17.6475C146.403 17.2842 146.5 16.9185 146.5 16.5551C146.5 15.5105 145.626 14.9287 143.903 14.7588C142.907 14.6617 141.766 14.6366 140.48 14.711L139.946 14.7345H139.363C136.96 14.8073 135.139 14.6859 133.901 14.3946C131.936 13.9334 130.454 12.9867 129.459 11.5059C128.683 10.39 128.294 9.12768 128.294 7.7189C128.294 5.07368 129.799 2.62187 132.13 1.23817C133.513 0.412804 135.019 0.00012207 136.645 0.00012207H143.223C145.019 0.00012207 146.67 0.509097 148.175 1.5052C149.68 2.50049 150.772 3.81055 151.476 5.48637L146.718 7.52469C146.136 6.09325 144.776 5.19506 143.223 5.19506H136.645C135.309 5.19506 134.363 5.68057 133.805 6.62731C133.586 6.99063 133.488 7.35557 133.488 7.7189C133.488 8.73846 134.315 9.34535 135.965 9.51609Z"
                fill="white"
              />
              <path
                d="M122.153 5.10978H127.275V0.000610352H122.153V5.10978Z"
                fill="white"
              />
              <path
                d="M71.0542 5.10978H76.1763V0.000610352H71.0542V5.10978Z"
                fill="white"
              />
            </svg>
          </div>

          {/* Desktop Navigation */}
          {/* Desktop Navigation */}
          <nav className="relative hidden rounded-xl bg-black/10 px-4 py-[16.5px] lg:flex">
            <div className="flex w-full items-center justify-center gap-2 xl:gap-7">
              {navItems.slice(0, -1).map((item) => (
                <div key={item.id} className="relative">
                  <button
                    ref={
                      item.id === "centers"
                        ? centersButtonRef
                        : item.id === "courses"
                        ? coursesButtonRef
                        : undefined
                    }
                    onClick={(e) => {
                      console.log("[CENTERS BTN] клик по кнопке центров");
                      setActiveNav(item.id);
                      if (item.hasDropdown) {
                        const willOpen = openDropdown !== item.id;
                        console.log(
                          "[CENTERS BTN] меняем openDropdown →",
                          willOpen ? "открываем" : "закрываем",
                          "текущее значение:",
                          openDropdown
                        );
                        setOpenDropdown(willOpen ? item.id : null);
                      }
                    }}
                    className={`relative flex cursor-pointer items-center whitespace-nowrap uppercase transition-all ${
                      activeNav === item.id
                        ? "text-[16px] font-bold uppercase leading-[120%]  "
                        : "text-[15px] font-medium uppercase leading-[120%]  "
                    }`}
                    style={{ lineHeight: "120%" }}
                  >
                    <span className="relative inline-flex items-center gap-[6px] ">
                      {/* Фон лежит под текстом, не влияет на размеры кнопки */}
                      {openDropdown === item.id && (
                        <span
                          className="absolute  inset-x-[-8px] inset-y-[-8px] rounded-[8px] bg-white pointer-events-none"
                          aria-hidden="true"
                        />
                      )}

                      {/* Текст и стрелка поверх фона */}
                      <p
                        className={`
    relative z-10
    ${openDropdown === item.id ? "text-black" : "text-white"}
  `}
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
                            fill={openDropdown === item.id ? "black" : "white"}
                          />
                        </svg>
                      )}
                    </span>
                    {activeNav === item.id && !openDropdown && (
                      <div
                        className="absolute -bottom-[16.5px] left-0 right-0 mx-auto h-0.5 bg-[#e84814]"
                        style={{ width: "100%", border: "1px solid #e84814" }}
                      />
                    )}
                  </button>

                  {/* Centers Dropdown */}
                  {item.hasDropdown &&
                    openDropdown === item.id &&
                    item.id === "centers" && (
                      <div
                        ref={dropdownRef}
                        data-dropdown
                        className="absolute -left-2 top-4 z-50 mt-2 flex flex-col gap-0 rounded-tr-[10px] rounded-b-[10px] border-2 border-white p-0"
                        style={{
                          width: "238px",
                          background: "rgba(0, 3, 38, 0.5)",
                          backdropFilter: "blur(10px)",
                          boxShadow: "0 4px 4px 0 rgba(0, 0, 0, 0.25)",
                        }}
                      >
                        {centersData.map((center, index) => (
                          <button
                            key={center.id}
                            onClick={() => {
                              setSelectedCenter(center.id);
                              router.push("/centers");
                              setOpenDropdown("");
                            }}
                            className={`flex h-[44px]  cursor-pointer  items-center justify-between px-[14px] transition-all hover:bg-[#111d9e] ${
                              selectedCenter === center.id ? "bg-[#111d9e]" : ""
                            } ${index === 0 ? "rounded-t-[8px]" : ""} ${
                              index === centersData.length - 1
                                ? "rounded-b-[8px]"
                                : ""
                            }`}
                          >
                            <span
                              className="text-[15px] font-semibold uppercase leading-[160%]"
                              style={{
                                fontFamily: "var(--font-family)",
                                color: center.color,
                              }}
                            >
                              {center.label}
                            </span>
                            {selectedCenter === center.id ? (
                              <svg
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  d="M9.8537 6.14663L14.8534 11.1463C14.8999 11.1927 14.9367 11.2478 14.9619 11.3085C14.9871 11.3692 15 11.4343 15 11.5C15 11.5657 14.9871 11.6308 14.9619 11.6915C14.9367 11.7522 14.8999 11.8073 14.8534 11.8537L9.8537 16.8534C9.78377 16.9234 9.69465 16.971 9.59762 16.9904C9.50058 17.0097 9.39999 16.9998 9.30859 16.9619C9.21718 16.924 9.13907 16.8599 9.08414 16.7776C9.0292 16.6953 8.99992 16.5986 9 16.4996L9 6.50036C8.99992 6.40142 9.0292 6.30468 9.08414 6.22239C9.13907 6.1401 9.21718 6.07595 9.30859 6.03808C9.39999 6.00021 9.50058 5.99031 9.59761 6.00963C9.69465 6.02895 9.78377 6.07663 9.8537 6.14663Z"
                                  fill={center.color}
                                />
                              </svg>
                            ) : (
                              <svg
                                width="24"
                                height="25"
                                viewBox="0 0 24 25"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  d="M4.94092 0.139404C5.33371 0.595553 5.84055 1.62189 6.09396 2.44549C6.43607 3.31977 6.55011 5.10635 6.34737 6.42411C6.29669 6.72821 6.23334 7.04498 6.15731 7.34908C6.15731 7.14635 6.14464 6.72821 6.14464 6.41144C6.10663 4.27008 5.80253 2.12872 4.94092 0.139404Z"
                                  fill="#F49519"
                                />
                                <path
                                  d="M5.80216 16.5354C4.86453 15.7878 4.1423 13.9885 4.16764 12.4934C4.20565 10.9982 4.80117 9.52841 5.80216 8.43872C4.61111 11.277 4.39571 13.7224 5.80216 16.5354Z"
                                  fill="#F49519"
                                />
                                <path
                                  d="M4.81382 16.8141C4.2183 17.1689 3.59743 17.4857 2.98924 17.8025L2.76116 17.9165L2.73582 17.9292C2.62179 18.0052 2.40638 17.9799 2.27967 17.8785C1.54477 17.283 0.733841 15.8132 0.442414 14.5841C-0.507892 12.3667 0.125645 9.16099 1.8362 7.4251C1.89955 7.36174 2.0516 7.23504 2.15296 7.14634C2.22899 7.04497 2.39371 6.96895 2.54576 6.99429C2.59644 6.99429 2.68514 7.01963 2.74849 7.05765C3.44538 7.41243 4.1296 7.76721 4.80115 8.16C4.1296 7.98261 3.47072 7.77988 2.81184 7.56448L2.5711 7.48845L2.54576 7.47578H2.53309C2.53309 7.48845 2.54576 7.48845 2.55843 7.48845C2.55843 7.48845 2.55843 7.48845 2.54576 7.50112L2.52042 7.52646C1.5321 9.0723 0.911236 11.9486 1.15198 13.9506C1.32937 15.205 1.69682 16.4974 2.53309 17.473L2.55843 17.4984L2.5711 17.511C2.55843 17.511 2.54576 17.511 2.53309 17.5237L2.55843 17.511C3.31867 17.245 4.05358 17.0169 4.81382 16.8141Z"
                                  fill="#F49519"
                                />
                                <path
                                  d="M23.6805 11.0489C22.7049 9.71849 20.2341 8.09663 18.1434 7.41241C16.889 7.03228 14.3549 6.96893 12.4923 7.26036C12.0361 7.33638 11.5166 7.46309 11.0858 7.57713C11.0731 7.23502 11.0478 6.90558 11.0351 6.84222C10.6043 3.88993 8.41227 1.54584 5.97949 0C8.71637 0.519502 11.4279 3.44645 12.0361 6.53812C12.0614 6.65216 12.0741 6.75353 12.0868 6.88024L11.4279 6.41142C12.7964 5.87924 15.5586 5.81589 17.5859 6.27204C20.158 6.94359 22.2234 8.92023 23.6805 11.0489Z"
                                  fill="#F49519"
                                />
                                <path
                                  d="M5.14307 24.5433C5.76393 23.2128 6.30877 20.4126 6.34679 18.2586C6.35946 17.9545 6.34678 17.6377 6.35945 17.3209C6.41014 17.5237 6.49883 17.9291 6.54952 18.2459C6.77759 19.1582 6.66355 20.9448 6.2961 22.2245C6.04269 23.0608 5.70058 23.8844 5.14307 24.5433Z"
                                  fill="#F49519"
                                />
                                <path
                                  d="M23.6804 13.9885C22.8948 15.9652 20.1579 18.1065 17.5858 18.7654C15.5584 19.2216 13.4424 19.1455 11.5545 18.6514C11.4911 18.6387 11.4278 18.6134 11.4278 18.6134C11.4278 18.6134 11.4278 18.6134 11.9853 18.2206C12.0487 18.1826 12.0867 18.1699 12.0867 18.2079C12.0867 18.2586 12.0613 18.3726 12.0487 18.4867C11.8206 20.3112 10.0467 22.782 8.09539 24.0111C7.43651 24.4419 6.72695 24.7714 6.10608 24.9868C6.04273 25.0121 6.03006 24.9994 6.09341 24.9614L6.47353 24.708C8.60222 23.8464 10.6549 20.9321 11.0477 18.1952C11.0603 18.1192 11.0857 17.549 11.0984 17.4603C11.4278 17.5617 12.0613 17.7011 12.5048 17.7771C13.7972 18.2079 16.3314 18.1445 18.156 17.625C20.2213 16.9535 22.0712 15.471 23.6804 13.9885Z"
                                  fill="#F49519"
                                />
                                <path
                                  d="M19.6387 10.7575C19.9808 11.1756 20.2595 11.1756 20.2722 10.7575C20.2722 10.3394 19.6513 10.3267 19.6387 10.7575ZM19.6387 10.7575C20.1202 10.124 20.5383 10.124 20.5636 10.7575C20.5383 11.391 19.6513 11.353 19.6387 10.7575Z"
                                  fill="#F49519"
                                />
                              </svg>
                            )}
                          </button>
                        ))}
                      </div>
                    )}
                </div>
              ))}
            </div>

            {/* Courses Dropdown - вынесен за map, позиционируется относительно nav */}
            {openDropdown === "courses" && (
              <div
                ref={coursesRef}
                data-dropdown
                className="absolute left-1/2 top-9 z-50 mt-2 -translate-x-1/2 rounded-[10px] border-2 border-white p-[20px]"
                style={{
                  width: "100%",
                  maxWidth: "100%",
                  background: "rgba(0, 3, 38, 0.5)",
                  backdropFilter: "blur(10px)",
                  boxShadow: "0 4px 4px 0 rgba(0, 0, 0, 0.25)",
                }}
              >
                <div className="flex flex-wrap justify-center gap-[10px]">
                  {coursesData.map((course) => (
                    <button
                      key={course.id}
                      className="flex flex-col items-center gap-[5px] cursor-pointer rounded-[20px] border-2 border-transparent px-0 pb-[5px] pt-[10px] transition-all hover:border-white hover:bg-[#111d9e]"
                      style={{
                        width: "120px",
                        height: "124px",
                      }}
                    >
                      <div className="h-[80px] w-[80px] overflow-hidden rounded-[16px]">
                        <Image
                          src={course.image}
                          alt={course.label}
                          width={80}
                          height={80}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <span
                        className="text-center text-[15px] font-semibold leading-[160%] text-white"
                        style={{
                          fontFamily: "var(--font-family)",
                        }}
                      >
                        {course.label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </nav>
          {/* Desktop Right Panel */}
          <div className="hidden flex-shrink-0 rounded-xl bg-black/10 p-1 lg:flex">
            <div className="flex items-center gap-1.5 px-1.5 xl:gap-2 xl:px-2">
              {/* Language Selector */}
              <div className="relative">
                <button
                  ref={langButtonRef}
                  onClick={(e) => {
                    // Сохраняем ширину при открытии
                    if (langButtonRef.current && !isLangMenuOpen) {
                      setLangButtonWidth(langButtonRef.current.offsetWidth);
                    }
                    setIsLangMenuOpen(!isLangMenuOpen);
                  }}
                  className="flex items-center justify-center gap-1.5 rounded-lg border border-black/12 bg-white cursor-pointer hover:bg-gray-100 px-2.5 py-2.5 text-[14px] font-bold text-black xl:gap-2 xl:px-3.5 xl:text-[15px]"
                  style={{ lineHeight: "120%" }}
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

                {/* Language Dropdown */}
                {isLangMenuOpen && (
                  <div
                    data-dropdown
                    className="absolute left-0 top-full mt-2 flex flex-col rounded-[10px] border-2 border-white shadow-lg"
                    style={{
                      width: langButtonWidth ? `${langButtonWidth}px` : "75px",
                      background: "rgba(0, 3, 38, 0.5)",
                      backdropFilter: "blur(10px)",
                      boxShadow: "0 4px 4px 0 rgba(0, 0, 0, 0.25)",
                    }}
                  >
                    {languages.map((lang, index) => (
                      <button
                        key={lang.code}
                        onClick={() => {
                          setSelectedLang(lang.code);
                          setIsLangMenuOpen(false);
                        }}
                        className={`flex h-[40px] w-full cursor-pointer items-center justify-center text-center text-[15px] font-semibold leading-[160%] transition-colors ${
                          selectedLang === lang.code
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
                          fontFamily: "var(--font-family)",
                          background:
                            selectedLang === lang.code
                              ? "#111d9e"
                              : "transparent",
                        }}
                      >
                        {lang.code}
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
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  className="xl:h-6 xl:w-6"
                >
                  <path
                    d="M17.8534 9.85369L12.8537 14.8534C12.8073 14.8999 12.7522 14.9367 12.6915 14.9619C12.6308 14.9871 12.5657 15 12.5 15C12.4343 15 12.3692 14.9871 12.3085 14.9619C12.2478 14.9367 12.1927 14.8999 12.1463 14.8534L7.14663 9.85369C7.07663 9.78377 7.02895 9.69465 7.00963 9.59761C6.9903 9.50058 7.00021 9.39999 7.03808 9.30858C7.07595 9.21718 7.1401 9.13907 7.22239 9.08413C7.30468 9.0292 7.40142 8.99992 7.50036 9H17.4996C17.5986 8.99992 17.6953 9.0292 17.7776 9.08413C17.8599 9.13907 17.924 9.21718 17.9619 9.30858C17.9998 9.39999 18.0097 9.50058 17.9904 9.59761C17.971 9.69465 17.9234 9.78377 17.8534 9.85369Z"
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
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  className="xl:h-6 xl:w-6"
                >
                  <path
                    d="M17.8534 9.85369L12.8537 14.8534C12.8073 14.8999 12.7522 14.9367 12.6915 14.9619C12.6308 14.9871 12.5657 15 12.5 15C12.4343 15 12.3692 14.9871 12.3085 14.9619C12.2478 14.9367 12.1927 14.8999 12.1463 14.8534L7.14663 9.85369C7.07663 9.78377 7.02895 9.69465 7.00963 9.59761C6.9903 9.50058 7.00021 9.39999 7.03808 9.30858C7.07595 9.21718 7.1401 9.13907 7.22239 9.08413C7.30468 9.0292 7.40142 8.99992 7.50036 9H17.4996C17.5986 8.99992 17.6953 9.0292 17.7776 9.08413C17.8599 9.13907 17.924 9.21718 17.9619 9.30858C17.9998 9.39999 18.0097 9.50058 17.9904 9.59761C17.971 9.69465 17.9234 9.78377 17.8534 9.85369Z"
                    fill="white"
                  />
                </svg>
              </button>

              {/* Instagram */}
              <button className="rounded-lg p-2 flex items-center gap-1">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path
                    d="M10 1.802C12.67 1.802 12.987 1.812 14.041 1.86C16.751 1.986 18.013 3.27 18.139 5.959C18.188 7.013 18.197 7.33 18.197 10C18.197 12.671 18.187 12.987 18.139 14.041C18.012 16.728 16.754 18.014 14.041 18.14C12.987 18.188 12.671 18.198 10 18.198C7.33 18.198 7.013 18.188 5.96 18.14C3.241 18.013 1.988 16.725 1.862 14.04C1.813 12.987 1.803 12.67 1.803 10C1.803 7.33 1.814 7.013 1.862 5.96C1.989 3.27 3.247 1.986 5.96 1.86C7.014 1.812 7.33 1.802 10 1.802ZM10 0C7.284 0 6.944 0.012 5.878 0.06C2.246 0.227 0.228 2.242 0.061 5.877C0.012 6.944 0 7.284 0 10C0 12.716 0.012 13.056 0.06 14.122C0.227 17.754 2.242 19.772 5.877 19.939C6.944 19.988 7.284 20 10 20C12.716 20 13.056 19.988 14.122 19.94C17.751 19.773 19.775 17.757 19.938 14.123C19.988 13.056 20 12.716 20 10C20 7.284 19.988 6.944 19.94 5.878C19.777 2.249 17.758 0.228 14.123 0.061C13.056 0.012 12.716 0 10 0ZM10 4.865C7.164 4.865 4.865 7.164 4.865 10C4.865 12.836 7.164 15.136 10 15.136C12.836 15.136 15.135 12.837 15.135 10C15.135 7.164 12.836 4.865 10 4.865ZM10 13.333C8.159 13.333 6.667 11.842 6.667 10C6.667 8.159 8.159 6.667 10 6.667C11.841 6.667 13.333 8.159 13.333 10C13.333 11.842 11.841 13.333 10 13.333ZM15.338 3.462C14.675 3.462 14.139 3.998 14.139 4.661C14.139 5.324 14.675 5.86 15.338 5.86C16.001 5.86 16.537 5.324 16.537 4.661C16.537 3.998 16.001 3.462 15.338 3.462Z"
                    fill="white"
                  />
                </svg>
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  className="xl:h-6 xl:w-6"
                >
                  <path
                    d="M17.8534 9.85369L12.8537 14.8534C12.8073 14.8999 12.7522 14.9367 12.6915 14.9619C12.6308 14.9871 12.5657 15 12.5 15C12.4343 15 12.3692 14.9871 12.3085 14.9619C12.2478 14.9367 12.1927 14.8999 12.1463 14.8534L7.14663 9.85369C7.07663 9.78377 7.02895 9.69465 7.00963 9.59761C6.9903 9.50058 7.00021 9.39999 7.03808 9.30858C7.07595 9.21718 7.1401 9.13907 7.22239 9.08413C7.30468 9.0292 7.40142 8.99992 7.50036 9H17.4996C17.5986 8.99992 17.6953 9.0292 17.7776 9.08413C17.8599 9.13907 17.924 9.21718 17.9619 9.30858C17.9998 9.39999 18.0097 9.50058 17.9904 9.59761C17.971 9.69465 17.9234 9.78377 17.8534 9.85369Z"
                    fill="white"
                  />
                </svg>
              </button>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="flex items-center justify-center rounded-lg bg-white p-2 lg:hidden"
          >
            {isMenuOpen ? (
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M7 7L17 17M7 17L17 7"
                  stroke="black"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            ) : (
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
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
        <div className="fixed inset-0 z-50 bg-[#281D4D] lg:hidden">
          <div className="flex h-full flex-col relative">
            <div className="absolute bottom-20 right-10">
              <svg
                width="151"
                height="139"
                viewBox="0 0 151 139"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g clip-path="url(#clip0_1_14389)">
                  <path
                    d="M0.520672 86.4674C2.05529 90.032 7.34104 90.8945 12.6268 88.6441C17.3458 86.6333 19.4485 80.6273 17.1049 75.1835C14.842 69.9268 12.1461 68.8536 4.78555 70.4351C0.690156 70.9289 -0.926554 83.1042 0.520672 86.4674Z"
                    fill="#E84814"
                  />
                  <path
                    d="M23.7088 91.635C22.6151 94.5452 25.1984 97.9518 29.5123 99.5557C33.3654 100.99 37.9242 98.6668 39.5965 94.2199C41.2079 89.931 40.244 87.8254 35.0999 84.6927C32.4504 82.7254 24.7416 88.8907 23.7088 91.635Z"
                    fill="#E84814"
                  />
                  <path
                    d="M57.8011 101.941C60.2599 102.582 62.8207 100.221 63.7714 96.6154C64.6175 93.3945 62.3507 89.9141 58.5942 88.9357C54.9676 87.9928 53.3336 88.9423 51.2085 93.3431C49.8275 95.6383 55.4826 101.336 57.8011 101.941Z"
                    fill="#E84814"
                  />
                  <path
                    d="M85.1045 97.9445C87.1569 97.2914 87.9129 94.4457 86.9463 91.4368C86.0817 88.7491 83.2601 87.8642 80.1273 88.8597C77.1004 89.8223 75.975 90.6585 76.4622 94.7657C76.5218 97.0333 83.17 98.5581 85.1045 97.9445Z"
                    fill="#E84814"
                  />
                  <path
                    d="M103.762 78.7922C102.003 79.207 101.192 81.5378 101.809 84.1161C102.36 86.4166 104.951 87.844 107.636 87.2093C110.227 86.5957 110.93 85.4566 110.785 81.9894C110.881 80.0919 105.418 78.3998 103.762 78.7922Z"
                    fill="#E84814"
                  />
                  <path
                    d="M121.163 73.085C122.615 73.4682 124.133 72.0776 124.699 69.9483C125.206 68.0469 123.872 65.9873 121.655 65.4014C119.514 64.8378 118.546 65.3961 117.282 67.9915C116.462 69.3479 119.794 72.7242 121.163 73.085Z"
                    fill="#E84814"
                  />
                  <path
                    d="M128.22 56.6994C129.105 57.5027 130.694 57.076 131.885 55.779C132.949 54.6215 132.771 52.6752 131.421 51.448C130.116 50.2628 129.225 50.3036 127.368 51.6744C126.285 52.3302 127.386 55.9409 128.22 56.6994Z"
                    fill="#E84814"
                  />
                  <path
                    d="M134.038 39.3042C134.723 39.8757 135.891 39.507 136.74 38.5023C137.495 37.6042 137.3 36.157 136.251 35.2853C135.241 34.4438 134.578 34.5031 133.238 35.5855C132.453 36.1083 133.389 38.767 134.038 39.3042Z"
                    fill="#E84814"
                  />
                  <path
                    d="M132.422 25.4595C132.674 26.0429 133.539 26.1851 134.405 25.8164C135.175 25.4872 135.522 24.5048 135.137 23.6147C134.767 22.7535 134.325 22.5783 133.122 22.8364C132.45 22.9168 132.185 24.9104 132.422 25.4595Z"
                    fill="#E84814"
                  />
                  <path
                    d="M129.066 17.5459C129.202 17.8646 129.672 17.941 130.143 17.7395C130.565 17.5604 130.751 17.0258 130.543 16.5412C130.342 16.0711 130.101 15.9776 129.444 16.1172C129.082 16.1606 128.937 17.2457 129.066 17.5459Z"
                    fill="#E84814"
                  />
                  <path
                    d="M119.413 14.2133C119.498 14.4082 119.788 14.4556 120.078 14.3318C120.334 14.2238 120.45 13.8933 120.323 13.5944C120.199 13.3073 120.05 13.2494 119.647 13.335C119.423 13.3626 119.335 14.0289 119.413 14.2133Z"
                    fill="#E84814"
                  />
                  <path
                    d="M124.521 14.0081C124.658 14.3254 125.129 14.4031 125.599 14.2016C126.02 14.0239 126.206 13.4879 125.998 13.002C125.797 12.5332 125.556 12.4384 124.901 12.5793C124.537 12.6228 124.391 13.7078 124.521 14.0081Z"
                    fill="#E84814"
                  />
                  <path
                    d="M116.21 16.9807C116.294 17.1756 116.584 17.223 116.874 17.0992C117.132 16.9899 117.246 16.6607 117.12 16.3618C116.995 16.0747 116.847 16.0155 116.445 16.1024C116.22 16.1287 116.13 16.7964 116.21 16.9807Z"
                    fill="#E84814"
                  />
                  <path
                    d="M117.04 19.6529C117.112 19.8149 117.351 19.8544 117.59 19.7517C117.806 19.6595 117.902 19.3856 117.794 19.1394C117.692 18.8997 117.569 18.851 117.235 18.9234C117.049 18.9458 116.974 19.5002 117.04 19.6529Z"
                    fill="#E84814"
                  />
                  <path
                    d="M119.085 20.3093C119.14 20.4357 119.328 20.4673 119.515 20.387C119.685 20.3146 119.757 20.1013 119.674 19.9077C119.595 19.7207 119.498 19.6812 119.237 19.7378C119.09 19.7563 119.034 20.1895 119.085 20.3093Z"
                    fill="#E84814"
                  />
                  <path
                    d="M120.866 19.6714C120.897 19.7425 121.004 19.7609 121.111 19.7148C121.208 19.6727 121.249 19.5528 121.203 19.4422C121.156 19.3356 121.102 19.3145 120.952 19.3448C120.869 19.3553 120.837 19.6029 120.866 19.6714Z"
                    fill="#E84814"
                  />
                  <path
                    d="M121.363 18.1675C121.382 18.2136 121.448 18.2228 121.515 18.1952C121.574 18.1702 121.601 18.0938 121.571 18.0253C121.543 17.9595 121.509 17.9463 121.416 17.9661C121.364 17.9726 121.344 18.1254 121.363 18.1675Z"
                    fill="#E84814"
                  />
                  <path
                    d="M120.344 17.0494C120.363 17.0941 120.429 17.1047 120.496 17.077C120.556 17.052 120.584 16.9756 120.553 16.9072C120.525 16.8413 120.49 16.8281 120.398 16.8479C120.347 16.8545 120.325 17.0072 120.344 17.0494Z"
                    fill="#E84814"
                  />
                  <path
                    d="M119.532 17.9C119.543 17.9263 119.579 17.9303 119.616 17.9145C119.649 17.9013 119.663 17.8605 119.646 17.8223C119.63 17.7867 119.613 17.7802 119.561 17.7907C119.535 17.7933 119.522 17.8763 119.532 17.9Z"
                    fill="#E84814"
                  />
                  <path
                    d="M20.1643 123.044C28.6981 125.092 36.3407 127.031 45.2756 126.422C77.6588 124.225 109.523 108.656 130.794 84.2241C147.519 65.0129 151.282 34.3468 135.03 13.7069C132.191 10.1015 123.262 0.133155 116.845 4.01119L116.09 4.53266L115.336 5.21609L114.58 6.0786L114.601 6.05885L114.449 6.5092L114.298 7.2058L114.208 8.0591C114.099 11.1773 118.091 16.6777 121.698 14.5102C123.573 13.3817 123.093 10.3135 123.05 8.55554L123.595 8.43966C124.264 11.1181 125.072 15.0554 121.805 16.4012C116.1 18.7504 111.002 11.9279 111.426 6.84894C112.117 -1.44966 123.096 -1.16786 128.26 2.24007C151.657 17.6706 156.136 48.1721 145.819 72.823C139.694 87.4608 126.974 100.371 114.295 109.383C93.9808 123.817 70.7603 133.469 45.7801 135.602C35.533 136.477 26.741 134.378 16.8965 132.196C14.3542 131.3 13.0262 128.522 13.9292 125.994C14.8322 123.467 17.6234 122.146 20.1643 123.044Z"
                    fill="white"
                    fill-opacity="0.5"
                  />
                </g>
                <defs>
                  <clipPath id="clip0_1_14389">
                    <rect width="151" height="139" fill="white" />
                  </clipPath>
                </defs>
              </svg>
            </div>
            {/* Mobile Menu Header */}
            <div className="flex items-center justify-between p-5">
              <div className="relative h-10 w-32">
                <svg
                  width="173"
                  height="41"
                  viewBox="0 0 173 41"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M116.833 13.5647L116.337 13.714C115.841 13.714 115.592 13.4131 115.591 12.8598C115.591 12.258 115.838 11.9049 116.335 11.9061L116.831 12.0566V12.3078L116.335 12.1573C115.938 12.1573 115.839 12.3575 115.839 12.8598C115.841 13.3124 115.94 13.5126 116.337 13.5126L116.833 13.3633V13.5647ZM116.314 11.1296C115.381 11.1296 114.626 11.8843 114.626 12.8161C114.626 13.7485 115.381 14.5032 116.314 14.5032C117.245 14.5032 118 13.7485 118 12.8161C118 11.8843 117.245 11.1296 116.314 11.1296Z"
                    fill="white"
                  />
                  <path
                    d="M0 29.328V11.1298H3.83949V18.7911H13.4312V11.1298H17.2707V29.328H13.4312V22.6312H3.83949V29.328H0Z"
                    fill="white"
                  />
                  <path
                    d="M32.8497 19.7556V17.8088C32.8497 17.0257 32.5767 16.3705 32.0119 15.8245C31.4477 15.2603 30.7925 14.9879 30.0105 14.9879H25.1519C24.3693 14.9879 23.7135 15.2603 23.1493 15.8245C22.6033 16.3705 22.3303 17.0257 22.3303 17.8088V19.7556H32.8497ZM18.4727 29.3279V17.8088C18.4727 15.9701 19.1278 14.3867 20.42 13.0952C21.7298 11.7848 23.3131 11.1296 25.1519 11.1296H30.0105C31.8669 11.1296 33.4502 11.7848 34.7418 13.0764C36.0346 14.3691 36.6898 15.9519 36.6898 17.8088V29.3279H32.8497V23.6133H22.3303V29.3279H18.4727Z"
                    fill="white"
                  />
                  <path
                    d="M41.8227 11.1296V22.6487C41.8227 23.4319 42.095 24.0871 42.6416 24.6512C43.2052 25.1972 43.8604 25.4702 44.643 25.4702H52.2686V29.3279H44.643C42.8048 29.3279 41.2221 28.6727 39.9117 27.3624C38.6195 26.0708 37.9644 24.488 37.9644 22.6487V11.1296H41.8227Z"
                    fill="white"
                  />
                  <path
                    d="M53.27 29.3285H57.1101V15.5946H53.27V29.3285Z"
                    fill="white"
                  />
                  <path
                    d="M65.2564 14.9877C64.492 14.9877 63.8368 15.2601 63.2726 15.8243C62.7266 16.3702 62.4536 17.0254 62.4536 17.7898V22.6679C62.4536 23.4322 62.7266 24.0874 63.2726 24.6516C63.8368 25.1976 64.492 25.47 65.2564 25.47H70.1338C70.8982 25.47 71.5534 25.1976 72.0988 24.6516C72.6636 24.0874 72.9359 23.4322 72.9359 22.6679V17.7898C72.9359 17.0254 72.6636 16.3702 72.0988 15.8243C71.5534 15.2601 70.8982 14.9877 70.1338 14.9877H65.2564ZM70.1338 11.13C71.9714 11.13 73.5553 11.7852 74.8475 13.0767C76.1391 14.3689 76.7948 15.9523 76.7948 17.7898V22.6679C76.7948 24.5054 76.1391 26.0888 74.8475 27.3815C73.5553 28.6731 71.9714 29.3283 70.1338 29.3283H65.2564C63.4182 29.3283 61.8349 28.6731 60.5433 27.3815C59.2511 26.0888 58.5959 24.5054 58.5959 22.6679V17.7898C58.5959 15.9523 59.2511 14.3689 60.5433 13.0767C61.8349 11.7852 63.4182 11.13 65.2564 11.13H70.1338Z"
                    fill="white"
                  />
                  <path
                    d="M90.6137 14.9509H85.6458V29.3279H81.8239V14.9509H76.8555V11.1296H90.6137V14.9509Z"
                    fill="white"
                  />
                  <path
                    d="M91.5793 29.3285H95.4194V15.5946H91.5793V29.3285Z"
                    fill="white"
                  />
                  <path
                    d="M101.934 18.2638C102.062 18.2814 102.881 18.2814 104.391 18.2814H104.846H104.974C105.064 18.2638 105.137 18.2638 105.228 18.2638C107.066 18.2092 108.468 18.2996 109.414 18.5186C110.942 18.8632 112.089 19.573 112.853 20.6831C113.436 21.5385 113.726 22.4855 113.726 23.5411C113.726 25.5248 112.599 27.3812 110.851 28.4003C109.796 29.0191 108.668 29.3279 107.466 29.3279H101.897C100.551 29.3279 99.3136 28.9463 98.167 28.2001C97.0387 27.4534 96.2197 26.4524 95.6919 25.2154L99.259 23.6867C99.714 24.7604 100.733 25.4332 101.897 25.4332H107.466C108.468 25.4332 109.177 25.0698 109.596 24.36C109.76 24.0877 109.832 23.8135 109.832 23.5411C109.832 22.7579 109.177 22.3217 107.886 22.1943C107.139 22.1215 106.283 22.1027 105.319 22.1585L104.918 22.1761H104.482C102.68 22.2307 101.315 22.1397 100.387 21.9213C98.9132 21.5755 97.8024 20.8657 97.0569 19.7556C96.4745 18.919 96.1833 17.9726 96.1833 16.9165C96.1833 14.9333 97.3117 13.0952 99.0588 12.0578C100.096 11.439 101.225 11.1296 102.444 11.1296H107.375C108.722 11.1296 109.96 11.5112 111.088 12.258C112.216 13.0042 113.035 13.9863 113.563 15.2427L109.996 16.7709C109.559 15.6977 108.54 15.0243 107.375 15.0243H102.444C101.442 15.0243 100.733 15.3883 100.315 16.0981C100.151 16.3705 100.077 16.6441 100.077 16.9165C100.077 17.6808 100.697 18.1358 101.934 18.2638Z"
                    fill="white"
                  />
                  <path
                    d="M91.5793 14.9604H95.4194V11.13H91.5793V14.9604Z"
                    fill="white"
                  />
                  <path
                    d="M53.27 14.9604H57.1101V11.13H53.27V14.9604Z"
                    fill="white"
                  />
                  <path
                    d="M128.155 25.7597C128.612 26.8217 130.187 27.0786 131.762 26.4082C133.168 25.8091 133.794 24.0199 133.096 22.3981C132.422 20.8321 131.618 20.5123 129.426 20.9835C128.206 21.1306 127.724 24.7578 128.155 25.7597Z"
                    fill="#E84814"
                  />
                  <path
                    d="M135.063 27.2991C134.737 28.1661 135.507 29.181 136.792 29.6588C137.94 30.086 139.298 29.394 139.796 28.0692C140.276 26.7915 139.989 26.1642 138.457 25.2309C137.667 24.6448 135.371 26.4816 135.063 27.2991Z"
                    fill="#E84814"
                  />
                  <path
                    d="M145.22 30.3694C145.952 30.5604 146.715 29.8571 146.998 28.7829C147.25 27.8234 146.575 26.7865 145.456 26.4951C144.376 26.2142 143.889 26.497 143.256 27.8081C142.844 28.4919 144.529 30.1893 145.22 30.3694Z"
                    fill="#E84814"
                  />
                  <path
                    d="M153.354 29.1789C153.965 28.9843 154.19 28.1366 153.903 27.2402C153.645 26.4395 152.804 26.1759 151.871 26.4724C150.969 26.7592 150.634 27.0083 150.779 28.2319C150.797 28.9074 152.778 29.3617 153.354 29.1789Z"
                    fill="#E84814"
                  />
                  <path
                    d="M158.912 23.4732C158.388 23.5968 158.146 24.2911 158.33 25.0592C158.494 25.7446 159.266 26.1698 160.066 25.9807C160.838 25.7979 161.048 25.4586 161.004 24.4257C161.033 23.8604 159.405 23.3563 158.912 23.4732Z"
                    fill="#E84814"
                  />
                  <path
                    d="M164.096 21.773C164.529 21.8871 164.981 21.4729 165.15 20.8385C165.301 20.2721 164.903 19.6585 164.243 19.4839C163.605 19.316 163.316 19.4824 162.94 20.2556C162.696 20.6596 163.688 21.6655 164.096 21.773Z"
                    fill="#E84814"
                  />
                  <path
                    d="M166.198 16.8914C166.462 17.1307 166.935 17.0036 167.29 16.6172C167.607 16.2724 167.554 15.6925 167.152 15.3269C166.763 14.9739 166.498 14.986 165.944 15.3944C165.622 15.5898 165.95 16.6654 166.198 16.8914Z"
                    fill="#E84814"
                  />
                  <path
                    d="M167.932 11.7092C168.136 11.8795 168.484 11.7696 168.737 11.4703C168.962 11.2028 168.904 10.7716 168.591 10.5119C168.29 10.2613 168.093 10.2789 167.693 10.6014C167.459 10.7571 167.738 11.5492 167.932 11.7092Z"
                    fill="#E84814"
                  />
                  <path
                    d="M167.45 7.58467C167.525 7.75846 167.783 7.80083 168.041 7.69098C168.27 7.59291 168.374 7.30026 168.259 7.03506C168.149 6.7785 168.017 6.72633 167.658 6.80322C167.458 6.82715 167.38 7.42108 167.45 7.58467Z"
                    fill="#E84814"
                  />
                  <path
                    d="M166.45 5.22712C166.491 5.32206 166.631 5.34481 166.771 5.28479C166.897 5.23144 166.952 5.07216 166.89 4.9278C166.831 4.78775 166.759 4.75989 166.563 4.80148C166.455 4.81442 166.412 5.13768 166.45 5.22712Z"
                    fill="#E84814"
                  />
                  <path
                    d="M163.574 4.23426C163.6 4.29232 163.686 4.30644 163.772 4.26957C163.849 4.2374 163.883 4.13893 163.845 4.04988C163.809 3.96436 163.764 3.9471 163.644 3.9726C163.578 3.98084 163.551 4.17934 163.574 4.23426Z"
                    fill="#E84814"
                  />
                  <path
                    d="M165.096 4.1731C165.137 4.26764 165.277 4.29079 165.417 4.23077C165.543 4.17781 165.598 4.01814 165.536 3.87338C165.476 3.73373 165.405 3.70548 165.209 3.74746C165.101 3.7604 165.058 4.08366 165.096 4.1731Z"
                    fill="#E84814"
                  />
                  <path
                    d="M162.62 5.05877C162.645 5.11683 162.732 5.13095 162.818 5.09408C162.895 5.06152 162.929 4.96344 162.891 4.87439C162.854 4.78887 162.81 4.77122 162.69 4.79711C162.623 4.80495 162.596 5.00385 162.62 5.05877Z"
                    fill="#E84814"
                  />
                  <path
                    d="M162.868 5.85481C162.889 5.90306 162.96 5.91483 163.031 5.88423C163.096 5.85677 163.124 5.77517 163.092 5.70181C163.062 5.63041 163.025 5.6159 162.926 5.63748C162.87 5.64415 162.848 5.8093 162.868 5.85481Z"
                    fill="#E84814"
                  />
                  <path
                    d="M163.477 6.05041C163.493 6.08807 163.549 6.09748 163.605 6.07355C163.656 6.05197 163.677 5.98842 163.652 5.93075C163.629 5.87505 163.6 5.86328 163.522 5.88015C163.478 5.88564 163.462 6.01471 163.477 6.05041Z"
                    fill="#E84814"
                  />
                  <path
                    d="M164.008 5.86033C164.017 5.88151 164.049 5.88701 164.081 5.87327C164.109 5.86072 164.122 5.82502 164.108 5.79207C164.094 5.76029 164.078 5.75402 164.033 5.76304C164.008 5.76618 163.999 5.83993 164.008 5.86033Z"
                    fill="#E84814"
                  />
                  <path
                    d="M164.156 5.41238C164.161 5.42611 164.181 5.42886 164.201 5.42062C164.218 5.41317 164.227 5.39041 164.218 5.37001C164.209 5.3504 164.199 5.34648 164.171 5.35236C164.156 5.35432 164.15 5.39983 164.156 5.41238Z"
                    fill="#E84814"
                  />
                  <path
                    d="M163.852 5.07925C163.858 5.09259 163.877 5.09573 163.897 5.08749C163.915 5.08004 163.923 5.05728 163.914 5.03688C163.906 5.01727 163.895 5.01335 163.868 5.01923C163.853 5.02119 163.847 5.0667 163.852 5.07925Z"
                    fill="#E84814"
                  />
                  <path
                    d="M163.61 5.33338C163.613 5.3414 163.624 5.3426 163.635 5.33779C163.645 5.33378 163.65 5.32135 163.645 5.30972C163.64 5.29889 163.635 5.29689 163.619 5.3001C163.611 5.3009 163.607 5.32616 163.61 5.33338Z"
                    fill="#E84814"
                  />
                  <path
                    d="M134.007 36.6563C136.55 37.2663 138.826 37.8442 141.488 37.6625C151.136 37.0082 160.628 32.3701 166.965 25.0914C171.948 19.3682 173.069 10.2323 168.227 4.08347C167.382 3.00936 164.721 0.0396685 162.81 1.19498L162.585 1.35033L162.36 1.55394L162.135 1.81089L162.141 1.80501L162.096 1.93917L162.051 2.1467L162.024 2.40091C161.992 3.32987 163.181 4.96849 164.255 4.32277C164.814 3.98657 164.671 3.07252 164.658 2.5488L164.821 2.51428C165.02 3.31221 165.26 4.48518 164.287 4.88611C162.588 5.58597 161.069 3.55348 161.195 2.04038C161.401 -0.431873 164.672 -0.347921 166.21 0.667344C173.18 5.26428 174.515 14.3511 171.441 21.6949C169.617 26.0556 165.827 29.9017 162.05 32.5866C155.998 36.8866 149.08 39.7621 141.639 40.3976C138.586 40.6581 135.967 40.0328 133.034 39.3828C132.276 39.116 131.881 38.2883 132.15 37.535C132.419 36.7822 133.25 36.3888 134.007 36.6563Z"
                    fill="white"
                  />
                </svg>
              </div>
              <button
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center justify-center rounded-lg bg-white p-2"
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M7 7L17 17M7 17L17 7"
                    stroke="black"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
              </button>
            </div>

            {/* Mobile Navigation */}
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
                    className={`flex w-full items-center justify-between uppercase text-[15px] font-normal uppercase leading-[120%] ${
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

                  {/* Centers Dropdown */}
                  {item.id === "centers" &&
                    mobileOpenDropdown === "centers" && (
                      <div
                        ref={coursesRef}
                        data-dropdown
                        className="absolute  rounded-lg -left-3.5 -top-2 z-10 w-[calc(100%_+_28px)] overflow-hidden rounded-t-lg"
                        style={{
                          background: "#fff",
                        }}
                      >
                        <button
                          onClick={() => setMobileOpenDropdown(null)}
                          className="flex h-[42px] w-full items-center justify-between px-[14px] py-[10px]"
                        >
                          <span
                            className="text-center text-[15px] font-normal uppercase leading-[120%] text-black"
                            style={{ fontFamily: "var(--font-family)" }}
                          >
                            CENTERS
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
                        <div className="flex flex-col bg-[#1a1a3e] border-2 border-white  rounded-lg">
                          {centersData.map((center, index) => (
                            <button
                              key={center.id}
                              onClick={() => {
                                setSelectedCenter(center.id);
                                router.push("/centers");
                                setIsMenuOpen(false);
                                setMobileOpenDropdown(null);
                              }}
                              className={`flex h-[44px] items-center  cursor-pointer justify-between px-[14px] transition-all hover:bg-[#111d9e] ${
                                selectedCenter === center.id
                                  ? "bg-[#111d9e]"
                                  : ""
                              } ${
                                index === centersData.length - 1
                                  ? "rounded-b-lg"
                                  : ""
                              }`}
                            >
                              <span
                                className="text-[15px] font-semibold uppercase leading-[160%]"
                                style={{
                                  fontFamily: "var(--font-family)",
                                  color: center.color,
                                }}
                              >
                                {center.label}
                              </span>
                              {selectedCenter === center.id && (
                                <svg
                                  width="24"
                                  height="24"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                >
                                  <path
                                    d="M9.8537 6.14663L14.8534 11.1463C14.8999 11.1927 14.9367 11.2478 14.9619 11.3085C14.9871 11.3692 15 11.4343 15 11.5C15 11.5657 14.9871 11.6308 14.9619 11.6915C14.9367 11.7522 14.8999 11.8073 14.8534 11.8537L9.8537 16.8534C9.78377 16.9234 9.69465 16.971 9.59762 16.9904C9.50058 17.0097 9.39999 16.9998 9.30859 16.9619C9.21718 16.924 9.13907 16.8599 9.08414 16.7776C9.0292 16.6953 8.99992 16.5986 9 16.4996L9 6.50036C8.99992 6.40142 9.0292 6.30468 9.08414 6.22239C9.13907 6.1401 9.21718 6.07595 9.30859 6.03808C9.39999 6.00021 9.50058 5.99031 9.59761 6.00963C9.69465 6.02895 9.78377 6.07663 9.8537 6.14663Z"
                                    fill="#A0C52E"
                                  />
                                </svg>
                              )}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                  {/* Courses Dropdown */}
                  {item.id === "courses" &&
                    mobileOpenDropdown === "courses" && (
                      <div
                        ref={coursesRef}
                        data-dropdown
                        className="absolute -left-3.5 -top-2 z-10 w-[calc(100%_+_28px)] z-10  overflow-hidden rounded-lg"
                        style={{
                          background: "#fff",
                          maxHeight: "600px",
                          overflowY: "auto",
                        }}
                      >
                        <button
                          onClick={() => setMobileOpenDropdown(null)}
                          className="flex h-[42px] w-full items-center justify-between px-[14px] py-[10px]"
                        >
                          <span
                            className="text-center text-[15px] font-normal uppercase leading-[120%] text-black"
                            style={{ fontFamily: "var(--font-family)" }}
                          >
                            COURSES
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
                        <div className="grid grid-cols-3  border-2 border-white  rounded-lg gap-[10px] bg-[#1a1a3e] p-[10px] pb-[20px]">
                          {coursesData.map((course) => (
                            <button
                              key={course.id}
                              onClick={() => {
                                setMobileOpenDropdown(null);
                              }}
                              className="flex flex-col items-center gap-[5px] rounded-[20px] px-0 pb-[5px] pt-[10px]"
                            >
                              <div className="h-[80px] w-[80px] overflow-hidden rounded-[16px]">
                                <Image
                                  src={course.image}
                                  alt={course.label}
                                  width={80}
                                  height={80}
                                  className="h-full w-full object-cover"
                                />
                              </div>
                              <span
                                className="text-center text-[16px] font-normal leading-[140%] text-white"
                                style={{
                                  fontFamily: "var(--font-family)",
                                }}
                              >
                                {course.label}
                              </span>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                </div>
              ))}
            </nav>
            {/* Mobile Bottom Panel */}
            {/* Mobile Bottom Panel */}
            <div className="mt-auto p-6">
              <div className="flex items-center gap-4">
                {/* Language Selector */}
                <div className="relative">
                  <button
                    ref={langButtonRef}
                    onClick={(e) => {
                      setIsLangMenuOpen(!isLangMenuOpen);
                    }}
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

                  {/* Language Dropdown */}
                  {isLangMenuOpen && (
                    <div
                      data-dropdown
                      className="absolute bottom-full left-0 mb-2 flex flex-col rounded-[10px] border-2 border-white"
                      style={{
                        width: "75px",
                        background: "rgba(0, 3, 38, 0.5)",
                        backdropFilter: "blur(10px)",
                        boxShadow: "0 4px 4px 0 rgba(0, 0, 0, 0.25)",
                      }}
                    >
                      {languages.map((lang, index) => (
                        <button
                          key={lang.code}
                          onClick={() => {
                            setSelectedLang(lang.code);
                            setIsLangMenuOpen(false);
                          }}
                          className={`flex h-[40px] w-[71px] items-center justify-center text-center text-[15px] font-semibold transition-colors ${
                            selectedLang === lang.code
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
                              selectedLang === lang.code
                                ? "#111d9e"
                                : "transparent",
                          }}
                        >
                          {lang.code}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <button className="rounded-lg p-2">
                  {/* TripAdvisor icon */}
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path
                      d="M14.6812 9.28879C13.7631 9.28879 13.0193 10.0332 13.0193 10.9507C13.0193 11.8682 13.7637 12.6125 14.6812 12.6125C15.5993 12.6125 16.3431 11.8682 16.3431 10.9507C16.3431 10.6444 16.2606 10.3582 16.1162 10.1119L16.1206 10.12C15.8281 9.62004 15.2931 9.28879 14.6812 9.28879ZM5.31557 9.28879C4.39744 9.28879 3.65369 10.0332 3.65369 10.9507C3.65369 11.8682 4.39807 12.6125 5.31557 12.6125C6.23369 12.6125 6.97744 11.8682 6.97744 10.9507C6.97744 10.6444 6.89494 10.3582 6.75057 10.1119L6.75494 10.12C6.46244 9.62004 5.92744 9.28879 5.31557 9.28879ZM14.6812 7.78129C14.6818 7.78129 14.6818 7.78129 14.6824 7.78129C16.4324 7.78129 17.8512 9.20004 17.8512 10.95C17.8512 12.7 16.4324 14.1188 14.6824 14.1188C12.9324 14.1188 11.5137 12.7 11.5137 10.95C11.5137 10.3669 11.6712 9.82067 11.9456 9.35129L11.9374 9.36629C12.4949 8.41192 13.5143 7.78192 14.6812 7.78129ZM5.31557 7.77942C7.06619 7.77942 8.48557 9.19879 8.48557 10.9494C8.48557 12.7 7.06619 14.1194 5.31557 14.1194C3.56494 14.1194 2.14557 12.7 2.14557 10.9494C2.14557 10.3657 2.30307 9.81879 2.57807 9.34942L2.56994 9.36442C3.12807 8.41004 4.14807 7.77942 5.31557 7.77942ZM9.99994 5.51317C11.2699 5.51379 12.4787 5.77317 13.5774 6.24129L13.5174 6.21879C11.5343 6.90004 10.1131 8.70004 9.99994 10.8469L9.99932 10.8594C9.88682 8.70004 8.46494 6.89942 6.51807 6.22942L6.48182 6.21879C7.52057 5.77379 8.72994 5.51504 9.99932 5.51442L9.99994 5.51317ZM10.0049 3.98254C10.0037 3.98254 10.0018 3.98254 10.0006 3.98254C7.77244 3.98254 5.70494 4.66942 3.99807 5.84379L4.03369 5.82067H0.627441L2.16057 7.48817C1.21807 8.34817 0.629316 9.58129 0.629316 10.9519C0.629316 13.5382 2.72619 15.635 5.31244 15.635C6.54432 15.635 7.66494 15.1594 8.50119 14.3819L8.49807 14.3844L9.99932 16.0182L11.5006 14.3857C12.3337 15.16 13.4543 15.6357 14.6862 15.6357C17.2731 15.6357 19.3699 13.5388 19.3699 10.9519C19.3699 9.58129 18.7812 8.34754 17.8424 7.49129L17.8387 7.48817L19.3718 5.82067H15.9743C14.3037 4.67004 12.2368 3.98317 10.0087 3.98317C10.0068 3.98317 10.0056 3.98317 10.0037 3.98317L10.0049 3.98254Z"
                      fill="white"
                    />
                  </svg>
                </button>
                <button className="rounded-lg p-2">
                  {/* Facebook icon */}
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
