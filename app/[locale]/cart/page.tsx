"use client";

import { useState, useRef, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";

// ─── Types & Data ─────────────────────────────────────────────────────────────

const EQUIPMENT_TEMPLATE = [
  { id: 1, name: "Pack de Regulador Legend", price: 929 },
  { id: 2, name: "Aqualung I330R Computer", price: 929 },
  { id: 3, name: "Helix Pro Regulator Pack", price: 929 },
  { id: 4, name: "Apeks Exotec BCD", price: 929 },
  { id: 5, name: "DrySuit Aqualung Blizzard Slim Fit", price: 929 },
  { id: 6, name: "Semi DrySuit Iceland Comfort", price: 929 },
  { id: 7, name: "Ascend Reel Apeks 30M", price: 929 },
  { id: 8, name: "Pack Regulador MBS", price: 929 },
];

const createParticipant = (id) => ({
  id,
  firstName: "",
  lastName: "",
  dateOfBirth: "",
  gender: "",
  phone: "",
  email: "",
  height: "",
  weight: "",
  shoeSize: "",
  equipment: EQUIPMENT_TEMPLATE.map((e) => ({ ...e, isSelected: false })),
  isExpanded: id === 1,
  isEquipmentExpanded: true,
  certAgency: "",
  certLevel: "",
  totalDives: "",
  lastDiveDate: "",
});

const INITIAL_ACTIVITIES = [
  {
    id: 1,
    type: "COURSE",
    title: "PADI Advanced Open Water Diver & PADI Underwater Naturalist Sesimbra",
    date: "June 14, 2026",
    location: "Sesimbra, Portugal",
    pricePerPerson: 89,
    image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=80&h=80&fit=crop",
    requiresCert: true,
    participants: [createParticipant(1), createParticipant(2), createParticipant(3)],
  },
  {
    id: 2,
    type: "TRAVEL",
    title: "PADI Open Water Diver — Madeira",
    date: "July 3-5, 2026",
    location: "Madeira, Portugal",
    pricePerPerson: 469,
    image: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=80&h=80&fit=crop",
    requiresCert: false,
    participants: [createParticipant(1)],
  },
];

// ─── Icons ────────────────────────────────────────────────────────────────────

const ChevronDown = ({ className = "" }) => (
  <svg width="11" height="7" viewBox="0 0 11 7" fill="currentColor" className={className}>
    <path d="M5.5 7L0.9375 1.625C0.71875 1.375 0.90625 1 1.21875 1H9.75C10.0625 1 10.25 1.375 10.0312 1.625L5.5 7Z" />
  </svg>
);

const PersonIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
    <g clipPath="url(#clip0)">
      <path d="M8.33333 0C6.04497 0 4.16667 1.87857 4.16667 4.16582C4.16667 5.39983 4.71407 6.51428 5.57695 7.27956C2.31926 8.48567 0 11.7629 0 15.5559C2.09555e-05 15.8505 0.117127 16.133 0.325561 16.3413C0.533994 16.5496 0.816686 16.6666 1.11146 16.6667H6.45794C6.67648 15.8594 7.02643 15.1083 7.48769 14.4451H2.31087C2.80243 11.3247 5.32943 9.00599 8.33333 9.00599C8.74965 9.00599 9.15628 9.05201 9.55013 9.13704C9.68538 7.77978 10.6477 6.65423 11.9209 6.27331C12.2882 5.65376 12.5 4.93294 12.5 4.16582C12.5 1.87857 10.6217 0 8.33333 0ZM8.33333 2.22155C9.41967 2.22155 10.2771 3.07849 10.2771 4.16582C10.2771 5.25315 9.41967 6.11022 8.33333 6.11022C7.247 6.11022 6.38952 5.25315 6.38952 4.16582C6.38952 3.07849 7.247 2.22155 8.33333 2.22155Z" fill="#E84814" />
      <path d="M13.3327 6.66675C11.502 6.66675 9.99935 8.16963 9.99935 9.99943C9.99935 10.9866 10.4373 11.8782 11.1276 12.4904C8.5214 13.4553 6.66602 16.0771 6.66602 19.1115C6.66604 19.3471 6.75972 19.5731 6.92646 19.7398C7.09321 19.9064 7.31935 20.0001 7.55516 20.0001H13.3327H19.1102C19.346 20.0001 19.5721 19.9064 19.7389 19.7398C19.9056 19.5731 19.9993 19.3471 19.9993 19.1115C19.9993 16.0771 18.144 13.4553 15.5378 12.4904C16.2282 11.8782 16.666 10.9866 16.666 9.99943C16.666 8.16963 15.1634 6.66675 13.3327 6.66675ZM13.3327 8.44401C14.2018 8.44401 14.8877 9.12957 14.8877 9.99943C14.8877 10.8693 14.2018 11.5549 13.3327 11.5549C12.4636 11.5549 11.7776 10.8693 11.7776 9.99943C11.7776 9.12957 12.4636 8.44401 13.3327 8.44401ZM13.3327 13.8715C15.7358 13.8715 17.7574 15.7265 18.1507 18.2228H13.3327H8.51471C8.90796 15.7265 10.9296 13.8715 13.3327 13.8715Z" fill="#E84814" />
    </g>
    <defs><clipPath id="clip0"><rect width="20" height="20" fill="white" /></clipPath></defs>
  </svg>
);

const LocationIcon = () => (
  <svg width="12" height="16" viewBox="0 0 12 16" fill="none">
    <path d="M6 0C2.686 0 0 2.686 0 6c0 4.5 6 10 6 10s6-5.5 6-10c0-3.314-2.686-6-6-6zm0 8.5A2.5 2.5 0 116 3.5a2.5 2.5 0 010 5z" fill="#e84814" />
  </svg>
);

const CheckMark = () => (
  <svg width="12" height="9" viewBox="0 0 12 9" fill="none">
    <path d="M1 4L4.5 7.5L11 1" stroke="#e84814" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const PlusIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
    <path d="M4 10H16M10 4V16" stroke="#CFCFCF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const CheckIconSmall = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
    <path d="M16 5L8 13L4 9" stroke="#E84814" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const CoinIcon = () => (
  <svg width="12" height="12" viewBox="0 0 20 20" fill="none">
    <path fillRule="evenodd" clipRule="evenodd" d="M0 10C0 4.47715 4.47715 0 10 0C15.5228 0 20 4.47715 20 10C20 15.5228 15.5228 20 10 20C4.47715 20 0 15.5228 0 10ZM8.6158 7.5C9.0535 6.71823 9.8025 6 10.7498 6C11.284 6 11.819 6.23239 12.2923 6.70646C12.6824 7.09734 13.3156 7.09792 13.7065 6.70775C14.0973 6.31758 14.0979 5.68442 13.7077 5.29354C12.9274 4.51179 11.9042 4 10.7498 4C9.3289 4 8.1189 4.77025 7.29826 5.86449C6.93769 6.34528 6.64329 6.89783 6.42654 7.5H6C5.44772 7.5 5 7.94772 5 8.5C5 8.9581 5.30804 9.3443 5.72828 9.4626C5.82228 9.4891 5.91867 9.5 6.01613 9.5C5.99473 9.8304 5.99473 10.1696 6.01613 10.5C5.91867 10.5 5.82228 10.5109 5.72828 10.5374C5.30804 10.6557 5 11.0419 5 11.5C5 12.0523 5.44772 12.5 6 12.5H6.42654C6.64329 13.1022 6.93769 13.6547 7.29826 14.1355C8.1189 15.2298 9.3289 16 10.7498 16C11.9042 16 12.9274 15.4882 13.7077 14.7065C14.0979 14.3156 14.0973 13.6824 13.7065 13.2923C13.3156 12.9021 12.6824 12.9027 12.2923 13.2935C11.819 13.7676 11.284 14 10.7498 14C9.8025 14 9.0535 13.2818 8.6158 12.5H10C10.5523 12.5 11 12.0523 11 11.5C11 10.9477 10.5523 10.5 10 10.5H8.0217C7.99312 10.1735 7.99312 9.8265 8.0217 9.5H11C11.5523 9.5 12 9.0523 12 8.5C12 7.94772 11.5523 7.5 11 7.5H8.6158Z" fill="black" />
  </svg>
);

const XIcon = () => (
  <svg width="20" height="20" viewBox="0 0 53 53" fill="none">
    <path d="M15.459 15.4583L37.5423 37.5416M15.459 37.5416L37.5423 15.4583" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const AlertIcon = () => (
  <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="28" height="28" rx="14" fill="#A0C52E" />
    <path d="M14.0008 16.5928C13.4107 16.5928 12.9316 17.0714 12.9316 17.6614C12.9316 18.2517 13.4107 18.7303 14.0008 18.7303C14.5908 18.7303 15.0694 18.2517 15.0694 17.6614C15.0695 17.0714 14.5909 16.5928 14.0008 16.5928Z" fill="white" />
    <path d="M22.7573 18.3508L15.5739 5.90868C15.2504 5.34815 14.6473 5 13.9997 5C13.3526 5 12.7501 5.34819 12.4266 5.90868L5.24266 18.3503C4.91911 18.9108 4.91911 19.6072 5.24266 20.1677C5.56624 20.7282 6.16923 21.0761 6.81636 21.0761H21.1837C21.8307 21.0761 22.4338 20.7282 22.7573 20.1677C23.0809 19.6072 23.0809 18.9108 22.7573 18.3508ZM21.3288 19.2398C21.2251 19.4192 21.032 19.5304 20.8244 19.5304H7.17541C6.96827 19.5304 6.77484 19.4192 6.67165 19.2393C6.56745 19.0596 6.56692 18.8369 6.67116 18.6575L13.4958 6.83656C13.5992 6.65716 13.7923 6.54568 14.0003 6.54568C14.2077 6.54568 14.4005 6.65716 14.5043 6.83684L21.3288 18.6573C21.4326 18.8369 21.4326 19.0601 21.3288 19.2398Z" fill="white" />
    <path d="M14.0008 9.40625C13.4107 9.40625 12.9316 9.88483 12.9316 10.4752L13.3423 15.3087C13.3423 15.6724 13.6368 15.967 14.0008 15.967C14.3642 15.967 14.6593 15.6724 14.6593 15.3087L15.0694 10.4752C15.0695 9.8848 14.5909 9.40625 14.0008 9.40625Z" fill="white" />
  </svg>
);

const CalendarOrangeIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M15.9624 11.293C16.8861 10.3501 18.3835 10.3501 19.3072 11.293C20.2309 12.2358 20.2309 13.7642 19.3072 14.707L15.2341 18.8645C15.1332 18.9675 15.0021 19.1066 14.8434 19.2195C14.7175 19.3091 14.5813 19.383 14.4381 19.4402C14.2583 19.5122 14.0727 19.5468 13.9326 19.5754L11.9487 19.9805C11.6275 20.046 11.2955 19.9435 11.0639 19.707C10.8322 19.4706 10.7317 19.1318 10.796 18.8039L11.1928 16.7789C11.2209 16.6358 11.2543 16.4461 11.3249 16.2625C11.3809 16.1164 11.4537 15.9777 11.5415 15.8492L11.6283 15.7332C11.718 15.6223 11.8136 15.5277 11.8893 15.4504L15.9624 11.293ZM17.9219 12.707C17.7634 12.5453 17.5063 12.5453 17.3478 12.707L13.2747 16.8645C13.2078 16.9328 13.175 16.9665 13.1519 16.9918C13.1513 16.9924 13.1505 16.9928 13.15 16.9934C13.1497 16.9943 13.1498 16.9955 13.1496 16.9965C13.1418 17.0301 13.1325 17.0767 13.114 17.1711L13.0053 17.725L13.5484 17.6145C13.6408 17.5956 13.6865 17.5861 13.7194 17.5781C13.7203 17.5779 13.7213 17.5775 13.7221 17.5773C13.7227 17.5768 13.7234 17.5764 13.724 17.5758C13.7488 17.5522 13.7818 17.5187 13.8488 17.4504L17.9219 13.293C18.0803 13.1312 18.0803 12.8688 17.9219 12.707ZM7.8377 14C8.37874 14 8.81736 14.4478 8.81741 15C8.8174 15.5523 8.37877 16 7.8377 16H4.89856C4.35749 16 3.91885 15.5523 3.91885 15C3.91887 14.4477 4.3575 14 4.89856 14H7.8377ZM11.2667 10C11.8077 10 12.2464 10.4478 12.2464 11C12.2464 11.5523 11.8078 12 11.2667 12H4.89856C4.35749 12 3.91885 11.5523 3.91885 11C3.91886 10.4477 4.35749 10 4.89856 10H11.2667ZM17.6348 8H1.95943V15.8C1.95943 16.3764 1.9601 16.7487 1.98277 17.032C2.00451 17.3036 2.04153 17.4045 2.0662 17.4539L2.10409 17.523C2.18475 17.6572 2.29532 17.7701 2.4267 17.8523L2.49444 17.891L2.5419 17.9117C2.60254 17.934 2.70806 17.9595 2.90776 17.9762C3.18533 17.9993 3.55003 18 4.11479 18H7.8377C8.37878 18 8.81741 18.4477 8.81741 19C8.81741 19.5523 8.37878 20 7.8377 20H4.11479C3.58233 20 3.12404 20.0009 2.74817 19.9695C2.36084 19.9372 1.97537 19.8659 1.60466 19.673C1.05169 19.3854 0.602024 18.9264 0.320322 18.3621C0.131423 17.9837 0.0614981 17.5903 0.029853 17.1949C-0.000847982 16.8113 2.35339e-06 16.3435 2.35411e-06 15.8V6.2C2.35411e-06 5.6565 -0.000849448 5.18873 0.029853 4.80508C0.061499 4.40973 0.131434 4.01627 0.320322 3.63789C0.602088 3.07348 1.0517 2.61455 1.60466 2.32695C1.97537 2.13415 2.36085 2.06277 2.74817 2.03047C3.07712 2.00304 3.46918 2.00106 3.91885 2.00078V1C3.91885 0.447715 4.35748 0 4.89856 0C5.43964 0 5.87828 0.447715 5.87828 1V2H13.716V1C13.716 0.447715 14.1546 0 14.6957 0C15.2368 0 15.6754 0.447715 15.6754 1V2.00078C16.1251 2.00106 16.5171 2.00304 16.8461 2.03047C17.2334 2.06277 17.6189 2.13414 17.9896 2.32695C18.5424 2.61449 18.9918 3.07346 19.2736 3.63789C19.4624 4.01628 19.5328 4.40973 19.5644 4.80508C19.5951 5.18873 19.5943 5.65651 19.5943 6.2V8C19.5943 8.55228 19.1556 9 18.6145 9C18.0735 9 17.6348 8.55228 17.6348 8ZM4.11479 4C3.55003 4 3.18533 4.00069 2.90776 4.02383C2.64172 4.04601 2.5429 4.08379 2.49444 4.10898C2.31011 4.20485 2.16012 4.35794 2.0662 4.54609C2.04152 4.59555 2.00451 4.69642 1.98277 4.96797C1.96284 5.21709 1.96063 5.53498 1.96019 6H17.6341C17.6336 5.53498 17.6314 5.21709 17.6115 4.96797C17.5897 4.6964 17.5527 4.59555 17.5281 4.54609C17.446 4.3816 17.321 4.24374 17.1676 4.14766L17.0998 4.10898C17.0514 4.08381 16.9526 4.04602 16.6865 4.02383C16.4089 4.00069 16.0442 4 15.4795 4H4.11479Z" fill="#E84814" />
  </svg>
);

const ShieldIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
    <path d="M12 2L3 7v5c0 5.25 3.75 10.15 9 11.35C17.25 22.15 21 17.25 21 12V7l-9-5z" fill="#4CAF50" />
    <path d="M9 12l2 2 4-4" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

// ─── Custom Dropdown ──────────────────────────────────────────────────────────

const CustomDropdown = ({ label, value, onChange, options, unit, icon }) => {
  const [isOpen, setIsOpen] = useState(false);

  const renderLabel = () => {
    if (label.includes("*")) {
      const parts = label.split("*");
      return <><span className="text-[#111]">{parts[0]}</span><span className="text-[#e84814]">*</span></>;
    }
    return <span className="text-[#111]">{label}</span>;
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center justify-between gap-2 ${icon ? "pl-8" : "pl-3"} pr-3 py-2 rounded-[10px] border border-[#d9d9d9] bg-white text-[15px] w-full outline-none cursor-pointer relative`}
      >
        {icon && <span className="absolute left-3 top-1/2 -translate-y-1/2">{icon}</span>}
        <span className="text-[#111]">{value || renderLabel()}</span>
        <div className="flex items-center gap-2">
          {unit && value && <span className="text-[13px] text-[#d9d9d9] border-l border-[#d9d9d9] pl-2">{unit}</span>}
          <ChevronDown className={`text-[#d9d9d9] transition-transform ${isOpen ? "rotate-180" : ""}`} />
        </div>
      </button>
      {isOpen && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />
          <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-[#d9d9d9] rounded-[10px] shadow-lg max-h-48 overflow-y-auto" style={{ zIndex: 9999 }}>
            {options.map((option) => (
              <button key={option} onClick={() => { onChange(option); setIsOpen(false); }}
                className={`w-full px-3 py-2 text-left text-[15px] hover:bg-[#f5f5f5] cursor-pointer ${value === option ? "bg-[#f7e4de] text-[#e84814]" : "text-[#111]"}`}>
                {option}{unit ? ` ${unit}` : ""}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

const inputCls = "flex items-center gap-2 px-3 py-2 rounded-[10px] border border-[#d9d9d9] bg-white text-[15px] text-[#111] w-full outline-none focus:border-[#e84814] transition-colors";

// Input with black placeholder text and orange *
const PlaceholderInput = ({ placeholder, value, onChange, type = "text", extraBorder = false }) => {
  const parts = placeholder.split("*");
  const hasAsterisk = parts.length > 1;
  return (
    <div className="relative w-full">
      <input
        className={`${inputCls} ${extraBorder ? "border-[#e84814]" : ""}`}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{ color: value ? "#111" : "transparent", caretColor: "#111" }}
      />
      {!value && (
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[15px] pointer-events-none select-none whitespace-nowrap">
          <span className="text-[#111]">{parts[0]}</span>
          {hasAsterisk && <span className="text-[#e84814]">*</span>}
        </span>
      )}
    </div>
  );
};

// Custom calendar date picker (no native input)
const MONTHS_CAL = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
const DAYS_CAL = ["S","M","T","W","T","F","S"];

const MiniCalendar = ({ selected, onSelect, onClose, allowPast = false }) => {
  const today = new Date();
  const [viewYear, setViewYear] = useState(selected ? new Date(selected).getFullYear() : today.getFullYear());
  const [viewMonth, setViewMonth] = useState(selected ? new Date(selected).getMonth() : today.getMonth());

  const startDay = new Date(viewYear, viewMonth, 1).getDay();
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();

  const isUnavailable = (day) => {
    if (allowPast) return false;
    const d = new Date(viewYear, viewMonth, day);
    return d < new Date(today.getFullYear(), today.getMonth(), today.getDate());
  };

  const selDate = selected ? new Date(selected) : null;
  const isSelected = (day) => selDate && selDate.getFullYear() === viewYear && selDate.getMonth() === viewMonth && selDate.getDate() === day;
  const isToday = (day) => today.getFullYear() === viewYear && today.getMonth() === viewMonth && today.getDate() === day;

  const prevMonth = () => { if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1); } else setViewMonth(m => m - 1); };
  const nextMonth = () => { if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1); } else setViewMonth(m => m + 1); };

  const stripMonths = [-2,-1,0,1,2,3,4,5].map((offset) => {
    let m = viewMonth + offset; let y = viewYear;
    while (m < 0) { m += 12; y--; }
    while (m > 11) { m -= 12; y++; }
    return { m, y, label: MONTHS_CAL[m], week: m + 1 };
  });

  const cells = [];
  for (let i = 0; i < startDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  return (
    <div className="bg-white rounded-2xl shadow-xl overflow-hidden w-full">
      <div className="flex items-end px-2 pt-3 pb-2 gap-2 overflow-x-auto bg-[#f5f5f5]" style={{ scrollbarWidth: "none" }}>
        {stripMonths.map(({ m, y, label, week }) => {
          const isCurrent = m === viewMonth && y === viewYear;
          return (
            <button key={`${y}-${m}`} onClick={() => { setViewMonth(m); setViewYear(y); }}
              className={`flex flex-col items-center flex-shrink-0 px-3 py-1.5 rounded-xl cursor-pointer transition-colors ${isCurrent ? "bg-[#e84814] text-white" : "text-[#999] hover:text-[#111]"}`}>
              <span className="text-[12px] font-medium leading-none">{label}</span>
              <span className="text-[14px] font-bold leading-none mt-0.5">{String(week).padStart(2, "0")}</span>
            </button>
          );
        })}
      </div>
      <div className="flex items-center justify-between px-4 py-3">
        <button onClick={prevMonth} className="w-8 h-8 flex items-center justify-center rounded-full border border-[#e4e4e4] hover:bg-[#f5f5f5] cursor-pointer">
          <ChevronDown className="rotate-90 w-3 h-3 text-[#111]" />
        </button>
        <span className="text-[15px] font-medium text-[#111]">{MONTHS_CAL[viewMonth]} {viewYear}</span>
        <button onClick={nextMonth} className="w-8 h-8 flex items-center justify-center rounded-full border border-[#e4e4e4] hover:bg-[#f5f5f5] cursor-pointer">
          <ChevronDown className="-rotate-90 w-3 h-3 text-[#111]" />
        </button>
      </div>
      <div className="grid grid-cols-7 px-3">
        {DAYS_CAL.map((d, i) => <div key={i} className="text-center text-[12px] text-[#999] font-medium py-1">{d}</div>)}
      </div>
      <div className="grid grid-cols-7 px-3 pb-3 gap-y-1">
        {cells.map((day, i) => {
          if (!day) return <div key={i} />;
          const unavail = isUnavailable(day);
          const sel = isSelected(day);
          const tod = isToday(day);
          return (
            <button key={i} disabled={unavail}
              onClick={() => {
                const iso = `${viewYear}-${String(viewMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
                onSelect(iso);
                onClose();
              }}
              className={`mx-auto w-9 h-9 flex items-center justify-center rounded-full text-[14px] font-medium transition-colors
                ${sel ? "bg-[#e84814] text-white" : ""}
                ${tod && !sel ? "bg-[#e84814] text-white" : ""}
                ${unavail ? "text-[#ccc] bg-[#f5f5f5] cursor-not-allowed" : ""}
                ${!sel && !tod && !unavail ? "text-[#111] hover:bg-[#f5f5f5] cursor-pointer" : ""}`}>
              {day}
            </button>
          );
        })}
      </div>
      <div className="flex items-center justify-center gap-2 pb-3">
        <div className="w-3 h-3 rounded-full bg-[#ccc]" />
        <span className="text-[12px] text-[#999]">Unavailable days</span>
      </div>
    </div>
  );
};

const DatePickerField = ({ value, onChange, placeholder, allowPast = false }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    if (open) document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  const formatDisplay = (iso) => {
    if (!iso) return null;
    const [y, m, d] = iso.split("-");
    return `${d}/${m}/${y}`;
  };

  const parts = placeholder.split("*");
  const hasAsterisk = parts.length > 1;

  return (
    <div className="relative" ref={ref}>
      <button onClick={() => setOpen(v => !v)}
        className="flex items-center justify-between px-3 py-2 rounded-[10px] border border-[#d9d9d9] bg-white text-[15px] w-full cursor-pointer transition-colors focus:outline-none focus:border-[#e84814]">
        {value
          ? <span className="text-[#111]">{formatDisplay(value)}</span>
          : <span className="text-[15px]"><span className="text-[#111]">{parts[0]}</span>{hasAsterisk && <span className="text-[#e84814]">*</span>}</span>
        }
        <CalendarFieldIcon />
      </button>
      {open && (
        <div className="absolute top-full left-0 right-0 mt-1 shadow-xl rounded-2xl" style={{ minWidth: 280, zIndex: 9999 }}>
          <MiniCalendar selected={value} onSelect={onChange} onClose={() => setOpen(false)} allowPast={allowPast} />
        </div>
      )}
    </div>
  );
};

// Participants counter with exact design specs
const ParticipantsCounter = ({ value, onChange }) => (
  <div className="flex items-center" style={{ height: 40, width: 97 }}>
    <button onClick={() => onChange(Math.max(1, value - 1))}
      style={{ border: "1px solid #f1f1f1", borderRadius: "10px 0 0 10px", padding: "8px 12px", width: 31, height: 40, background: "#f1f1f1", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", fontSize: 16, color: "#111", flexShrink: 0, lineHeight: 1 }}>
      −
    </button>
    <div style={{ border: "1px solid #f1f1f1", padding: "8px 12px", width: 34, height: 40, background: "#f1f1f1", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15, fontWeight: 600, color: "#111", flexShrink: 0 }}>
      {value}
    </div>
    <button onClick={() => onChange(Math.min(10, value + 1))}
      style={{ border: "1px solid #f1f1f1", borderRadius: "0 10px 10px 0", padding: "8px 12px", width: 34, height: 40, background: "#f1f1f1", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", fontSize: 16, color: "#111", flexShrink: 0, lineHeight: 1 }}>
      +
    </button>
  </div>
);

// ─── Checkbox ─────────────────────────────────────────────────────────────────

const CheckboxRow = ({ checked, onChange, label }) => (
  <label className="flex items-start gap-2.5 cursor-pointer">
    <div className={`w-5 h-5 rounded flex-shrink-0 border flex items-center justify-center mt-0.5 transition-colors ${checked ? "border-[#e84814]" : "border-[#d9d9d9]"} bg-white`}>
      <input type="checkbox" className="sr-only" checked={checked} onChange={(e) => onChange(e.target.checked)} />
      {checked && <CheckMark />}
    </div>
    <span className="text-[14px] text-[#111] leading-[140%]">
      I accept <a href="#" className="text-[#e84814] underline" onClick={(e) => e.preventDefault()}>{label}</a>
    </span>
  </label>
);

// ─── Arrow icons (same as booking modal) ─────────────────────────────────────

const ArrowLeftInactive = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
    <path d="M2.5 7.50008H13.75C15.8211 7.50008 17.5 9.17901 17.5 11.2501C17.5 13.3211 15.8211 15.0001 13.75 15.0001H10M2.5 7.50008L5.83333 4.16675M2.5 7.50008L5.83333 10.8334" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);
const ArrowLeftActive = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
    <path d="M2.5 7.50008H13.75C15.8211 7.50008 17.5 9.17901 17.5 11.2501C17.5 13.3211 15.8211 15.0001 13.75 15.0001H10M2.5 7.50008L5.83333 4.16675M2.5 7.50008L5.83333 10.8334" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);
const ArrowRightInactive = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
    <path d="M17.5 7.50008H6.25C4.17893 7.50008 2.5 9.17901 2.5 11.2501C2.5 13.3211 4.17893 15.0001 6.25 15.0001H10M17.5 7.50008L14.1667 4.16675M17.5 7.50008L14.1667 10.8334" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);
const ArrowRightActive = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
    <path d="M17.5 7.50008H6.25C4.17893 7.50008 2.5 9.17901 2.5 11.2501C2.5 13.3211 4.17893 15.0001 6.25 15.0001H10M17.5 7.50008L14.1667 4.16675M17.5 7.50008L14.1667 10.8334" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

// ─── Equipment Carousel ───────────────────────────────────────────────────────

const EquipCard = ({ item, onToggle }) => (
  <div className={`relative w-full transition-colors rounded-2xl p-2 ${item.isSelected ? "bg-[#f7e4de]" : "bg-[#f1f1f1]"}`}>
    <button
      onClick={() => onToggle(item.id)}
      style={{ borderRadius: 1000, padding: 2, width: 48, height: 48, background: item.isSelected ? "#e84814" : "#000", border: "none" }}
      className="absolute -top-3 -left-3 flex items-center justify-center z-20 cursor-pointer transition-all">
      {item.isSelected ? (
        <svg width="44" height="44" viewBox="0 0 44 44" fill="none">
          <rect width="44" height="44" rx="22" fill="white"/>
          <path d="M32.496 14.463C32.3505 14.3163 32.1774 14.1999 31.9866 14.1204C31.7959 14.0409 31.5913 14 31.3846 14C31.178 14 30.9733 14.0409 30.7826 14.1204C30.5918 14.1999 30.4187 14.3163 30.2732 14.463L18.6109 26.1403L13.7112 21.2252C13.5601 21.0792 13.3817 20.9645 13.1863 20.8874C12.9908 20.8104 12.7821 20.7727 12.5721 20.7763C12.362 20.7799 12.1547 20.8249 11.9621 20.9086C11.7694 20.9924 11.5951 21.1132 11.4492 21.2643C11.3032 21.4154 11.1884 21.5937 11.1114 21.7892C11.0344 21.9846 10.9966 22.1933 11.0002 22.4033C11.0039 22.6134 11.0488 22.8206 11.1326 23.0133C11.2163 23.206 11.3372 23.3802 11.4883 23.5262L17.4994 29.537C17.645 29.6837 17.8181 29.8001 18.0089 29.8796C18.1996 29.9591 18.4042 30 18.6109 30C18.8175 30 19.0221 29.9591 19.2129 29.8796C19.4037 29.8001 19.5768 29.6837 19.7223 29.537L32.496 16.764C32.6549 16.6174 32.7817 16.4395 32.8685 16.2415C32.9552 16.0435 33 15.8297 33 15.6135C33 15.3973 32.9552 15.1835 32.8685 14.9855C32.7817 14.7875 32.6549 14.6096 32.496 14.463Z" fill="#E84814"/>
        </svg>
      ) : (
        <svg width="44" height="44" viewBox="0 0 44 44" fill="none">
          <rect width="44" height="44" rx="22" fill="white"/>
          <path d="M12 22H32M22 12V32" stroke="#CFCFCF" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      )}
    </button>
    <div className="relative w-full h-[100px] rounded-xl overflow-hidden">
      <div className="w-full h-full bg-gradient-to-br from-[#2c2c2c] to-[#1a1a1a]" />
      <div className="absolute top-1.5 right-1.5 flex items-center gap-0.5 bg-white rounded-lg px-1.5 py-0.5 shadow-sm z-10">
        <CoinIcon />
        <span className="text-[11px] font-bold text-black">{item.price}</span>
      </div>
    </div>
    <div className="bg-white rounded-xl px-2 py-1.5 mt-2">
      <p className="text-[11px] text-[#111] leading-[130%]">{item.name}</p>
    </div>
  </div>
);

const EquipmentCarousel = ({ equipment, onToggle }) => {
  const swiperRef = useRef(null);
  const [isBeginning, setIsBeginning] = useState(true);
  const [isEnd, setIsEnd] = useState(false);

  return (
    <div className="relative px-14 mt-2">
      <Swiper
        modules={[Navigation]}
        spaceBetween={12}
        slidesPerView="auto"
        onSwiper={(s) => { swiperRef.current = s; setIsBeginning(s.isBeginning); setIsEnd(s.isEnd); }}
        onSlideChange={(s) => { setIsBeginning(s.isBeginning); setIsEnd(s.isEnd); }}
        style={{ paddingTop: 16, paddingLeft: 16, paddingBottom: 4 }}
      >
        {equipment.map((item) => (
          <SwiperSlide key={item.id} style={{ width: 150 }}>
            <EquipCard item={item} onToggle={onToggle} />
          </SwiperSlide>
        ))}
      </Swiper>

      <button
        onClick={() => swiperRef.current?.slidePrev()}
        disabled={isBeginning}
        className={`absolute left-0 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full flex items-center justify-center transition-all ${isBeginning ? "bg-[#e4e4e4] cursor-not-allowed" : "bg-[#e84814] cursor-pointer hover:bg-[#d63f0f]"}`}
      >
        {isBeginning ? <ArrowLeftInactive /> : <ArrowLeftActive />}
      </button>

      <button
        onClick={() => swiperRef.current?.slideNext()}
        disabled={isEnd}
        className={`absolute right-0 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full flex items-center justify-center transition-all ${isEnd ? "bg-[#e4e4e4] cursor-not-allowed" : "bg-[#e84814] cursor-pointer hover:bg-[#d63f0f]"}`}
      >
        {isEnd ? <ArrowRightInactive /> : <ArrowRightActive />}
      </button>
    </div>
  );
};

// ─── Participant Block ────────────────────────────────────────────────────────

const ParticipantBlock = ({ p, pNum, activityId, onChange, onToggleEquip, requiresCert }) => {
  const [isExpanded, setIsExpanded] = useState(pNum === 1);
  const [equipExpanded, setEquipExpanded] = useState(true);

  return (
    <div className="border border-[#e4e4e4] rounded-2xl bg-white overflow-hidden">
      {/* Header */}
      <button onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-[#fafafa] transition-colors">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-[#e84814] flex items-center justify-center text-white text-[12px] font-bold flex-shrink-0">
            {pNum}
          </div>
          <span className="text-[14px] font-semibold text-[#111]">Additional Rental Equipment for Participant {pNum}</span>
        </div>
        <ChevronDown className={`text-[#666] transition-transform duration-200 ${isExpanded ? "rotate-180" : ""}`} />
      </button>

      {isExpanded && (
        <div className="px-4 pb-4 flex flex-col gap-2 border-t border-[#f0f0f0]">
          {/* Row 1 */}
          <div className="grid grid-cols-3 gap-2 mt-3">
            <PlaceholderInput placeholder="First Name *" value={p.firstName}
              onChange={(v) => onChange(activityId, p.id, "firstName", v)} extraBorder />
            <PlaceholderInput placeholder="Last Name *" value={p.lastName}
              onChange={(v) => onChange(activityId, p.id, "lastName", v)} />
            <DatePickerField
              value={p.dateOfBirth}
              onChange={(v) => onChange(activityId, p.id, "dateOfBirth", v)}
              placeholder="Date of Birth"
              allowPast={true}
            />
          </div>
          {/* Row 2 */}
          <div className="grid grid-cols-3 gap-2">
            <CustomDropdown label="Select Gender *" value={p.gender}
              onChange={(v) => onChange(activityId, p.id, "gender", v)}
              options={["Male", "Female", "Other"]} />
            <PlaceholderInput placeholder="Phone Number *" value={p.phone}
              onChange={(v) => onChange(activityId, p.id, "phone", v)} type="tel" />
            <PlaceholderInput placeholder="E-mail *" value={p.email}
              onChange={(v) => onChange(activityId, p.id, "email", v)} type="email" />
          </div>
          {/* Row 3 */}
          <div className="grid grid-cols-3 gap-2">
            <CustomDropdown label="Height *" value={p.height}
              onChange={(v) => onChange(activityId, p.id, "height", v)} unit="cm"
              options={["150","155","160","165","170","175","180","185","190","195","200"]} />
            <CustomDropdown label="Weight *" value={p.weight}
              onChange={(v) => onChange(activityId, p.id, "weight", v)} unit="kg"
              options={["40","50","60","70","80","90","100","110","120"]} />
            <CustomDropdown label="Shoe Size *" value={p.shoeSize}
              onChange={(v) => onChange(activityId, p.id, "shoeSize", v)} unit="EU"
              options={["36","37","38","39","40","41","42","43","44","45","46"]} />
          </div>

          <p className="text-[12px] text-[#111] opacity-70 leading-[160%] mt-1">
            The following equipment will be included in your course: 7mm wetsuit including hood and boots, mask, snorkel, fins, weights, buoyancy compensator, regulator and any other specific equipment necessary unless otherwise noted in the INCLUDED section of the course.
          </p>

          {/* Equipment */}
          <button onClick={() => setEquipExpanded(!equipExpanded)}
            className="flex items-center justify-between cursor-pointer mt-1">
            <span className="text-[13px] font-bold text-[#111]">
              Additional Equipment for Participant <span className="text-[#e84814]">{pNum}</span>
            </span>
            <ChevronDown className={`text-[#666] transition-transform ${equipExpanded ? "rotate-180" : ""}`} />
          </button>

          {equipExpanded && (
            <EquipmentGrid equipment={p.equipment} onToggle={(eid) => onToggleEquip(activityId, p.id, eid)} />
          )}

          {/* Dive Certification */}
          {requiresCert && (
            <div className="border border-[#e84814] rounded-2xl p-3 mt-2 bg-[#fff8f6]">
              <div className="flex items-center gap-2 mb-3">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><circle cx="10" cy="10" r="9" stroke="#E84814" strokeWidth="1.5"/><path d="M10 6v5M10 13.5h.01" stroke="#E84814" strokeWidth="1.5" strokeLinecap="round"/></svg>
                <span className="text-[13px] font-semibold text-[#e84814]">Dive Certification — required for this activity</span>
              </div>
              <div className="grid grid-cols-2 gap-2 mb-2">
                <CustomDropdown label="Certification Agency *" value={p.certAgency || ""}
                  onChange={(v) => onChange(activityId, p.id, "certAgency", v)}
                  options={["PADI","SSI","NAUI","CMAS","SDI","TDI"]} />
                <PlaceholderInput placeholder="Certification Level *" value={p.certLevel || ""}
                  onChange={(v) => onChange(activityId, p.id, "certLevel", v)} />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <PlaceholderInput placeholder="Total Dives *" value={p.totalDives || ""}
                  onChange={(v) => onChange(activityId, p.id, "totalDives", v)} type="number" />
                <DatePickerField
                  value={p.lastDiveDate || ""}
                  onChange={(v) => onChange(activityId, p.id, "lastDiveDate", v)}
                  placeholder="Last Dive Date"
                  allowPast={true}
                />
              </div>
              <div className="flex items-center gap-2 mt-3"
                style={{ border: "1px solid #a0c52e", borderRadius: 10, padding: "5px 10px", height: 38, background: "#fff" }}>
                <AlertIcon />
                <span style={{ fontWeight: 600, fontSize: 15, lineHeight: "160%", color: "#000" }}>
                  You need a PADI Dry suit diver certification
                </span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const CalendarFieldIcon = () => (
  <svg width="16" height="16" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M15.9624 11.293C16.8861 10.3501 18.3835 10.3501 19.3072 11.293C20.2309 12.2358 20.2309 13.7642 19.3072 14.707L15.2341 18.8645C15.1332 18.9675 15.0021 19.1066 14.8434 19.2195C14.7175 19.3091 14.5813 19.383 14.4381 19.4402C14.2583 19.5122 14.0727 19.5468 13.9326 19.5754L11.9487 19.9805C11.6275 20.046 11.2955 19.9435 11.0639 19.707C10.8322 19.4706 10.7317 19.1318 10.796 18.8039L11.1928 16.7789C11.2209 16.6358 11.2543 16.4461 11.3249 16.2625C11.3809 16.1164 11.4537 15.9777 11.5415 15.8492L11.6283 15.7332C11.718 15.6223 11.8136 15.5277 11.8893 15.4504L15.9624 11.293ZM17.9219 12.707C17.7634 12.5453 17.5063 12.5453 17.3478 12.707L13.2747 16.8645C13.2078 16.9328 13.175 16.9665 13.1519 16.9918C13.1513 16.9924 13.1505 16.9928 13.15 16.9934C13.1497 16.9943 13.1498 16.9955 13.1496 16.9965C13.1418 17.0301 13.1325 17.0767 13.114 17.1711L13.0053 17.725L13.5484 17.6145C13.6408 17.5956 13.6865 17.5861 13.7194 17.5781C13.7203 17.5779 13.7213 17.5775 13.7221 17.5773C13.7227 17.5768 13.7234 17.5764 13.724 17.5758C13.7488 17.5522 13.7818 17.5187 13.8488 17.4504L17.9219 13.293C18.0803 13.1312 18.0803 12.8688 17.9219 12.707ZM7.8377 14C8.37874 14 8.81736 14.4478 8.81741 15C8.8174 15.5523 8.37877 16 7.8377 16H4.89856C4.35749 16 3.91885 15.5523 3.91885 15C3.91887 14.4477 4.3575 14 4.89856 14H7.8377ZM11.2667 10C11.8077 10 12.2464 10.4478 12.2464 11C12.2464 11.5523 11.8078 12 11.2667 12H4.89856C4.35749 12 3.91885 11.5523 3.91885 11C3.91886 10.4477 4.35749 10 4.89856 10H11.2667ZM17.6348 8H1.95943V15.8C1.95943 16.3764 1.9601 16.7487 1.98277 17.032C2.00451 17.3036 2.04153 17.4045 2.0662 17.4539L2.10409 17.523C2.18475 17.6572 2.29532 17.7701 2.4267 17.8523L2.49444 17.891L2.5419 17.9117C2.60254 17.934 2.70806 17.9595 2.90776 17.9762C3.18533 17.9993 3.55003 18 4.11479 18H7.8377C8.37878 18 8.81741 18.4477 8.81741 19C8.81741 19.5523 8.37878 20 7.8377 20H4.11479C3.58233 20 3.12404 20.0009 2.74817 19.9695C2.36084 19.9372 1.97537 19.8659 1.60466 19.673C1.05169 19.3854 0.602024 18.9264 0.320322 18.3621C0.131423 17.9837 0.0614981 17.5903 0.029853 17.1949C-0.000847982 16.8113 2.35339e-06 16.3435 2.35411e-06 15.8V6.2C2.35411e-06 5.6565 -0.000849448 5.18873 0.029853 4.80508C0.061499 4.40973 0.131434 4.01627 0.320322 3.63789C0.602088 3.07348 1.0517 2.61455 1.60466 2.32695C1.97537 2.13415 2.36085 2.06277 2.74817 2.03047C3.07712 2.00304 3.46918 2.00106 3.91885 2.00078V1C3.91885 0.447715 4.35748 0 4.89856 0C5.43964 0 5.87828 0.447715 5.87828 1V2H13.716V1C13.716 0.447715 14.1546 0 14.6957 0C15.2368 0 15.6754 0.447715 15.6754 1V2.00078C16.1251 2.00106 16.5171 2.00304 16.8461 2.03047C17.2334 2.06277 17.6189 2.13414 17.9896 2.32695C18.5424 2.61449 18.9918 3.07346 19.2736 3.63789C19.4624 4.01628 19.5328 4.40973 19.5644 4.80508C19.5951 5.18873 19.5943 5.65651 19.5943 6.2V8C19.5943 8.55228 19.1556 9 18.6145 9C18.0735 9 17.6348 8.55228 17.6348 8ZM4.11479 4C3.55003 4 3.18533 4.00069 2.90776 4.02383C2.64172 4.04601 2.5429 4.08379 2.49444 4.10898C2.31011 4.20485 2.16012 4.35794 2.0662 4.54609C2.04152 4.59555 2.00451 4.69642 1.98277 4.96797C1.96284 5.21709 1.96063 5.53498 1.96019 6H17.6341C17.6336 5.53498 17.6314 5.21709 17.6115 4.96797C17.5897 4.6964 17.5527 4.59555 17.5281 4.54609C17.446 4.3816 17.321 4.24374 17.1676 4.14766L17.0998 4.10898C17.0514 4.08381 16.9526 4.04602 16.6865 4.02383C16.4089 4.00069 16.0442 4 15.4795 4H4.11479Z" fill="#E84814" />
  </svg>
);

// ─── Equipment Grid (no swiper) ───────────────────────────────────────────────

const EquipmentGrid = ({ equipment, onToggle }) => (
  <div className="flex flex-wrap gap-3 mt-2 pt-4 pl-4">
    {equipment.map((item) => (
      <div key={item.id}
        className={`relative flex-shrink-0 w-[130px] transition-colors rounded-2xl p-2 ${item.isSelected ? "bg-[#f7e4de]" : "bg-[#f1f1f1]"}`}>
        <button
          onClick={() => onToggle(item.id)}
          style={{ borderRadius: 1000, padding: 2, width: 48, height: 48, background: item.isSelected ? "#e84814" : "#000", border: "none" }}
          className="absolute -top-3 -left-3 flex items-center justify-center z-20 cursor-pointer transition-all">
          {item.isSelected ? (
            <svg width="44" height="44" viewBox="0 0 44 44" fill="none">
              <rect width="44" height="44" rx="22" fill="white"/>
              <path d="M32.496 14.463C32.3505 14.3163 32.1774 14.1999 31.9866 14.1204C31.7959 14.0409 31.5913 14 31.3846 14C31.178 14 30.9733 14.0409 30.7826 14.1204C30.5918 14.1999 30.4187 14.3163 30.2732 14.463L18.6109 26.1403L13.7112 21.2252C13.5601 21.0792 13.3817 20.9645 13.1863 20.8874C12.9908 20.8104 12.7821 20.7727 12.5721 20.7763C12.362 20.7799 12.1547 20.8249 11.9621 20.9086C11.7694 20.9924 11.5951 21.1132 11.4492 21.2643C11.3032 21.4154 11.1884 21.5937 11.1114 21.7892C11.0344 21.9846 10.9966 22.1933 11.0002 22.4033C11.0039 22.6134 11.0488 22.8206 11.1326 23.0133C11.2163 23.206 11.3372 23.3802 11.4883 23.5262L17.4994 29.537C17.645 29.6837 17.8181 29.8001 18.0089 29.8796C18.1996 29.9591 18.4042 30 18.6109 30C18.8175 30 19.0221 29.9591 19.2129 29.8796C19.4037 29.8001 19.5768 29.6837 19.7223 29.537L32.496 16.764C32.6549 16.6174 32.7817 16.4395 32.8685 16.2415C32.9552 16.0435 33 15.8297 33 15.6135C33 15.3973 32.9552 15.1835 32.8685 14.9855C32.7817 14.7875 32.6549 14.6096 32.496 14.463Z" fill="#E84814"/>
            </svg>
          ) : (
            <svg width="44" height="44" viewBox="0 0 44 44" fill="none">
              <rect width="44" height="44" rx="22" fill="white"/>
              <path d="M12 22H32M22 12V32" stroke="#CFCFCF" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          )}
        </button>
        <div className="relative w-full h-[100px] rounded-xl overflow-hidden">
          <div className="w-full h-full bg-gradient-to-br from-[#2c2c2c] to-[#1a1a1a]" />
          <div className="absolute top-1.5 right-1.5 flex items-center gap-0.5 bg-white rounded-lg px-1.5 py-0.5 shadow-sm z-10">
            <CoinIcon />
            <span className="text-[11px] font-bold text-black">{item.price}</span>
          </div>
        </div>
        <div className="bg-white rounded-xl px-2 py-1.5 mt-2">
          <p className="text-[11px] text-[#111] leading-[130%]">{item.name}</p>
        </div>
      </div>
    ))}
  </div>
);

// ─── Activity Card (no participants counter — moved to page level) ─────────────

const ActivityCard = ({ activity, onRemove, onUpdateParticipant, onToggleEquip }) => {
  return (
    <div className="bg-white rounded-2xl border border-[#e4e4e4] overflow-hidden mb-4">
      <div className="p-4">
        <div className="flex items-start gap-3">
          <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0">
            <img src={activity.image} alt={activity.title} className="w-full h-full object-cover" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${activity.type === "COURSE" ? "bg-[#e84814] text-white" : "bg-[#1a3a5c] text-white"}`}>
                    {activity.type}
                  </span>
                </div>
                <h3 className="text-[14px] font-semibold text-[#111] leading-[140%]">{activity.title}</h3>
                <div className="flex items-center gap-1 mt-1">
                  <LocationIcon />
                  <span className="text-[12px] text-[#666]">{activity.date} · {activity.location}</span>
                </div>
              </div>
              <button onClick={() => onRemove(activity.id)}
                className="w-8 h-8 flex items-center justify-center rounded-lg border border-[#e4e4e4] hover:bg-[#f5f5f5] cursor-pointer flex-shrink-0 transition-colors">
                <XIcon />
              </button>
            </div>
            <div className="flex items-center gap-2 mt-2">
              <span className="text-[20px] font-bold text-[#111]">€{activity.pricePerPerson}</span>
              <span className="text-[13px] text-[#999]">/ person</span>
            </div>
          </div>
        </div>
      </div>

      {/* Participants forms */}
      <div className="px-4 pb-4 flex flex-col gap-3">
        {activity.participants.map((p, idx) => (
          <ParticipantBlock
            key={p.id}
            p={p}
            pNum={idx + 1}
            activityId={activity.id}
            onChange={onUpdateParticipant}
            onToggleEquip={onToggleEquip}
            requiresCert={activity.requiresCert}
          />
        ))}
      </div>
    </div>
  );
};

// ─── Order Summary ────────────────────────────────────────────────────────────

const OrderSummary = ({ activities, privacy, setPrivacy, terms, setTerms }) => {
  const grandTotal = activities.reduce((total, act) => {
    const courseTotal = act.participants.length * act.pricePerPerson;
    const equipTotal = act.participants.flatMap(p => p.equipment.filter(e => e.isSelected)).reduce((s, e) => s + e.price, 0);
    return total + courseTotal + equipTotal;
  }, 0);

  return (
    <div className="bg-white rounded-2xl border border-[#e4e4e4] p-4 sticky top-4">
      <h2 className="text-[20px] font-semibold text-[#111] mb-3">Order Summary</h2>

      {activities.map((act) => {
        const courseTotal = act.participants.length * act.pricePerPerson;
        const selectedEquipByP = act.participants.map(p => ({
          name: p.firstName || `Participant`,
          items: p.equipment.filter(e => e.isSelected),
        }));

        return (
          <div key={act.id} className="mb-4">
            <div className="flex items-start justify-between gap-2 mb-2">
              <p className="text-[13px] text-[#111] leading-[140%] flex-1">{act.title}</p>
              <span className="text-[16px] font-bold text-[#111] flex-shrink-0">€{act.pricePerPerson}</span>
            </div>
            {/* Gray detail block */}
            <div className="bg-[#f5f5f5] rounded-2xl px-3 py-2 flex flex-col gap-1">
              <div className="flex justify-between text-[13px] text-[#444]">
                <span>{act.participants.length} Adults x € {act.pricePerPerson}</span>
                <span>€ {courseTotal}</span>
              </div>
              {selectedEquipByP.map((p, idx) =>
                p.items.length > 0 && (
                  <div key={idx}>
                    <p className="text-[12px] font-semibold text-[#111] mt-1 mb-0.5">
                      Additional Equipment for Participant <span className="text-[#e84814]">{p.name || idx + 1}</span>
                    </p>
                    {p.items.map((item) => (
                      <div key={item.id} className="flex justify-between text-[13px] text-[#444] py-0.5">
                        <span>1 {item.name}</span>
                        <span>€ {item.price}</span>
                      </div>
                    ))}
                  </div>
                )
              )}
            </div>
            <div className="h-px bg-[#f0f0f0] mt-3" />
          </div>
        );
      })}

      <div className="flex justify-between text-[18px] font-bold text-[#111] py-2 mb-4">
        <span>Total price</span>
        <span>€ {grandTotal.toLocaleString()}</span>
      </div>

      {/* Additional Information */}
      <div className="mb-4">
        <p className="text-[13px] font-medium text-[#111] mb-2">Additional Information</p>
        <textarea
          className="w-full h-16 px-3 py-2 rounded-[10px] border border-[#d9d9d9] text-[14px] placeholder:text-[#999] resize-none outline-none focus:border-[#e84814] transition-colors"
          placeholder="Comment"
        />
      </div>

      <div className="flex flex-col gap-2 mb-4">
        <CheckboxRow checked={privacy} onChange={setPrivacy} label="Política de privacidade da Haliotis" />
        <CheckboxRow checked={terms} onChange={setTerms} label="Termos e Condições" />
      </div>

      <button className="w-full py-3 rounded-full bg-[#e84814] text-white text-[15px] font-semibold hover:bg-[#d63f0f] transition-colors cursor-pointer flex items-center justify-center gap-2">
        Proceed to Payment →
      </button>

      <div className="flex items-center justify-center gap-1.5 mt-2">
        <ShieldIcon />
        <span className="text-[11px] text-[#999]">Secure checkout · SSL encrypted</span>
      </div>
    </div>
  );
};

// ─── MAIN CART PAGE ───────────────────────────────────────────────────────────

export default function CartPage() {
  const [activities, setActivities] = useState(INITIAL_ACTIVITIES);
  const [privacy, setPrivacy] = useState(false);
  const [terms, setTerms] = useState(false);
  const [participantCount, setParticipantCount] = useState(2);

  const totalParticipants = participantCount;

  const removeActivity = (id) => setActivities((prev) => prev.filter((a) => a.id !== id));

  const handleCountChange = (n) => {
    const c = Math.max(1, Math.min(10, n));
    setParticipantCount(c);
    // Sync all activities to same participant count
    setActivities((prev) =>
      prev.map((a) => {
        const current = a.participants;
        if (c > current.length) {
          return { ...a, participants: [...current, ...Array.from({ length: c - current.length }, (_, i) => createParticipant(current.length + i + 1))] };
        }
        return { ...a, participants: current.slice(0, c) };
      })
    );
  };

  const updateParticipant = (actId, pid, field, val) =>
    setActivities((prev) =>
      prev.map((a) =>
        a.id === actId
          ? { ...a, participants: a.participants.map((p) => (p.id === pid ? { ...p, [field]: val } : p)) }
          : a
      )
    );

  const toggleEquip = (actId, pid, eid) =>
    setActivities((prev) =>
      prev.map((a) =>
        a.id === actId
          ? {
              ...a,
              participants: a.participants.map((p) =>
                p.id === pid
                  ? { ...p, equipment: p.equipment.map((e) => (e.id === eid ? { ...e, isSelected: !e.isSelected } : e)) }
                  : p
              ),
            }
          : a
      )
    );

  return (
    <div className="min-h-screen bg-[#f5f5f5]" style={{ fontFamily: "Inter, sans-serif" }}>
      <div className="max-w-[1200px] mx-auto px-4 py-8">
        {/* Page header */}
        <h1 className="text-[32px] font-bold text-[#111] mb-1">Your Cart</h1>
        <p className="text-[14px] text-[#111] mb-4">Review your selections and complete booking details for each participant.</p>
        <p className="text-[13px] text-[#666] mb-6">
          {activities.length} activities · {totalParticipants} participants
        </p>

        <div className="flex flex-col lg:flex-row gap-6 items-start">
          {/* Left: activities */}
          <div className="flex-1 min-w-0">

            {/* ── Participants counter — global, above all cards ── */}
            <div className="bg-white rounded-2xl border border-[#e4e4e4] p-4 mb-4 flex items-center gap-4">
              <div className="flex items-center gap-2">
                <PersonIcon />
                <span className="text-[15px] font-semibold text-[#111]">
                  Participants <span className="text-[#e84814]">*</span>
                </span>
              </div>
              <ParticipantsCounter value={participantCount} onChange={handleCountChange} />
              <span className="text-[13px] text-[#999] ml-2">
                Fill in details for each participant below
              </span>
            </div>

            {activities.length === 0 ? (
              <div className="bg-white rounded-2xl border border-[#e4e4e4] p-12 text-center">
                <p className="text-[18px] font-medium text-[#999]">Your cart is empty</p>
                <p className="text-[14px] text-[#bbb] mt-2">Add some activities to get started</p>
              </div>
            ) : (
              activities.map((act) => (
                <ActivityCard
                  key={act.id}
                  activity={act}
                  onRemove={removeActivity}
                  onUpdateParticipant={updateParticipant}
                  onToggleEquip={toggleEquip}
                />
              ))
            )}
          </div>

          {/* Right: order summary */}
          <div className="w-full lg:w-[360px] flex-shrink-0">
            <OrderSummary
              activities={activities}
              privacy={privacy}
              setPrivacy={setPrivacy}
              terms={terms}
              setTerms={setTerms}
            />
          </div>
        </div>
      </div>
    </div>
  );
}