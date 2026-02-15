"use client";

import { useState, useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";
import "swiper/css";

// ─── Types ────────────────────────────────────────────────────────────────────

type EquipmentItem = {
  id: number;
  name: string;
  price: number;
  isSelected: boolean;
};

type Participant = {
  id: number;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: string;
  phone: string;
  email: string;
  height: string;
  weight: string;
  shoeSize: string;
  equipment: EquipmentItem[];
  isExpanded: boolean;
  isEquipmentExpanded: boolean;
};

type Props = {
  isOpen: boolean;
  onClose: () => void;
  courseTitle?: string;
  pricePerPerson?: number;
  unavailableDates?: string[]; // "YYYY-MM-DD"
};

// ─── Equipment template ───────────────────────────────────────────────────────

const EQUIPMENT_TEMPLATE: Omit<EquipmentItem, "isSelected">[] = [
  { id: 1, name: "Pack de Regulador Legend", price: 929 },
  { id: 2, name: "Aqualung I330R Computer", price: 929 },
  { id: 3, name: "Helix Pro Regulator Pack", price: 929 },
  { id: 4, name: "Apeks Exotec BCD", price: 929 },
  { id: 5, name: "DrySuit Aqualung Blizzard Slim Fit", price: 929 },
  { id: 6, name: "Semi DrySuit Iceland Comfort", price: 929 },
  { id: 7, name: "Ascend Reel Apeks 30M", price: 929 },
  { id: 8, name: "Pack Regulador MBS", price: 929 },
];

const createParticipant = (id: number): Participant => ({
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
  isEquipmentExpanded: id === 1,
});

// ─── Icons ────────────────────────────────────────────────────────────────────

const ChevronDown = ({ className = "" }: { className?: string }) => (
  <svg
    width="11"
    height="7"
    viewBox="0 0 11 7"
    fill="none"
    className={className}
  >
    <path
      d="M1 1L5.5 6L10 1"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const CalendarIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
    <path
      d="M6.5 1v3M13.5 1v3M1.5 7h17M2.5 3h15a1 1 0 011 1v13a1 1 0 01-1 1h-15a1 1 0 01-1-1V4a1 1 0 011-1z"
      stroke="white"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
    <path
      d="M13.5 12l-2 2-2-2"
      stroke="white"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const PersonIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <g clipPath="url(#clip0_1_15854)">
      <path d="M8.33333 0C6.04497 0 4.16667 1.87857 4.16667 4.16582C4.16667 5.39983 4.71407 6.51428 5.57695 7.27956C2.31926 8.48567 0 11.7629 0 15.5559C2.09555e-05 15.8505 0.117127 16.133 0.325561 16.3413C0.533994 16.5496 0.816686 16.6666 1.11146 16.6667H6.45794C6.67648 15.8594 7.02643 15.1083 7.48769 14.4451H2.31087C2.80243 11.3247 5.32943 9.00599 8.33333 9.00599C8.74965 9.00599 9.15628 9.05201 9.55013 9.13704C9.68538 7.77978 10.6477 6.65423 11.9209 6.27331C12.2882 5.65376 12.5 4.93294 12.5 4.16582C12.5 1.87857 10.6217 0 8.33333 0ZM8.33333 2.22155C9.41967 2.22155 10.2771 3.07849 10.2771 4.16582C10.2771 5.25315 9.41967 6.11022 8.33333 6.11022C7.247 6.11022 6.38952 5.25315 6.38952 4.16582C6.38952 3.07849 7.247 2.22155 8.33333 2.22155Z" fill="#E84814" />
      <path d="M13.3327 6.66675C11.502 6.66675 9.99935 8.16963 9.99935 9.99943C9.99935 10.9866 10.4373 11.8782 11.1276 12.4904C8.5214 13.4553 6.66602 16.0771 6.66602 19.1115C6.66604 19.3471 6.75972 19.5731 6.92646 19.7398C7.09321 19.9064 7.31935 20.0001 7.55516 20.0001H13.3327H19.1102C19.346 20.0001 19.5721 19.9064 19.7389 19.7398C19.9056 19.5731 19.9993 19.3471 19.9993 19.1115C19.9993 16.0771 18.144 13.4553 15.5378 12.4904C16.2282 11.8782 16.666 10.9866 16.666 9.99943C16.666 8.16963 15.1634 6.66675 13.3327 6.66675ZM13.3327 8.44401C14.2018 8.44401 14.8877 9.12957 14.8877 9.99943C14.8877 10.8693 14.2018 11.5549 13.3327 11.5549C12.4636 11.5549 11.7776 10.8693 11.7776 9.99943C11.7776 9.12957 12.4636 8.44401 13.3327 8.44401ZM13.3327 13.8715C15.7358 13.8715 17.7574 15.7265 18.1507 18.2228H13.3327H8.51471C8.90796 15.7265 10.9296 13.8715 13.3327 13.8715Z" fill="#E84814" />
    </g>
    <defs>
      <clipPath id="clip0_1_15854">
        <rect width="20" height="20" fill="white" />
      </clipPath>
    </defs>
  </svg>
);

const LocationIcon = () => (
  <svg width="12" height="16" viewBox="0 0 12 16" fill="none">
    <path
      d="M6 0C2.686 0 0 2.686 0 6c0 4.5 6 10 6 10s6-5.5 6-10c0-3.314-2.686-6-6-6zm0 8.5A2.5 2.5 0 116 3.5a2.5 2.5 0 010 5z"
      fill="#e84814"
    />
  </svg>
);

const CheckMark = () => (
  <svg width="12" height="9" viewBox="0 0 12 9" fill="none">
    <path
      d="M1 4L4.5 7.5L11 1"
      stroke="#e84814"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const PlusIcon = () => (
  <svg width="44" height="44" viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="44" height="44" rx="22" fill="white" />
    <path d="M12 22H32M22 12V32" stroke="#CFCFCF" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const CheckIconActive = () => (
  <svg width="44" height="44" viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="44" height="44" rx="22" fill="white" />
    <path d="M32.496 14.463C32.3505 14.3163 32.1774 14.1999 31.9866 14.1204C31.7959 14.0409 31.5913 14 31.3846 14C31.178 14 30.9733 14.0409 30.7826 14.1204C30.5918 14.1999 30.4187 14.3163 30.2732 14.463L18.6109 26.1403L13.7112 21.2252C13.5601 21.0792 13.3817 20.9645 13.1863 20.8874C12.9908 20.8104 12.7821 20.7727 12.5721 20.7763C12.362 20.7799 12.1547 20.8249 11.9621 20.9086C11.7694 20.9924 11.5951 21.1132 11.4492 21.2643C11.3032 21.4154 11.1884 21.5937 11.1114 21.7892C11.0344 21.9846 10.9966 22.1933 11.0002 22.4033C11.0039 22.6134 11.0488 22.8206 11.1326 23.0133C11.2163 23.206 11.3372 23.3802 11.4883 23.5262L17.4994 29.537C17.645 29.6837 17.8181 29.8001 18.0089 29.8796C18.1996 29.9591 18.4042 30 18.6109 30C18.8175 30 19.0221 29.9591 19.2129 29.8796C19.4037 29.8001 19.5768 29.6837 19.7223 29.537L32.496 16.764C32.6549 16.6174 32.7817 16.4395 32.8685 16.2415C32.9552 16.0435 33 15.8297 33 15.6135C33 15.3973 32.9552 15.1835 32.8685 14.9855C32.7817 14.7875 32.6549 14.6096 32.496 14.463Z" fill="#E84814" />
  </svg>
);

const ArrowLeftInactive = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M2.5 7.50008H13.75C15.8211 7.50008 17.5 9.17901 17.5 11.2501C17.5 13.3211 15.8211 15.0001 13.75 15.0001H10M2.5 7.50008L5.83333 4.16675M2.5 7.50008L5.83333 10.8334" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const ArrowLeftActive = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M2.5 7.50008H13.75C15.8211 7.50008 17.5 9.17901 17.5 11.2501C17.5 13.3211 15.8211 15.0001 13.75 15.0001H10M2.5 7.50008L5.83333 4.16675M2.5 7.50008L5.83333 10.8334" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const ArrowRightInactive = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M17.5 7.50008H6.25C4.17893 7.50008 2.5 9.17901 2.5 11.2501C2.5 13.3211 4.17893 15.0001 6.25 15.0001H10M17.5 7.50008L14.1667 4.16675M17.5 7.50008L14.1667 10.8334" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const ArrowRightActive = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M17.5 7.50008H6.25C4.17893 7.50008 2.5 9.17901 2.5 11.2501C2.5 13.3211 4.17893 15.0001 6.25 15.0001H10M17.5 7.50008L14.1667 4.16675M17.5 7.50008L14.1667 10.8334" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

// ─── Custom Calendar ──────────────────────────────────────────────────────────

const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];
const DAYS = ["S", "M", "T", "W", "T", "F", "S"];

const CustomCalendar = ({
  selected,
  onSelect,
  unavailableDates = [],
  onClose,
}: {
  selected: Date | null;
  onSelect: (d: Date) => void;
  unavailableDates?: string[];
  onClose: () => void;
}) => {
  const today = new Date();
  const [viewYear, setViewYear] = useState(
    selected?.getFullYear() ?? today.getFullYear()
  );
  const [viewMonth, setViewMonth] = useState(
    selected?.getMonth() ?? today.getMonth()
  );

  const startOfMonth = new Date(viewYear, viewMonth, 1);
  const startDay = startOfMonth.getDay();
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();

  const toKey = (d: Date) =>
    `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
      d.getDate()
    ).padStart(2, "0")}`;

  const isUnavailable = (day: number) => {
    const k = `${viewYear}-${String(viewMonth + 1).padStart(2, "0")}-${String(
      day
    ).padStart(2, "0")}`;
    const d = new Date(viewYear, viewMonth, day);
    return (
      unavailableDates.includes(k) ||
      d < new Date(today.getFullYear(), today.getMonth(), today.getDate())
    );
  };

  const isSelected = (day: number) =>
    selected &&
    selected.getFullYear() === viewYear &&
    selected.getMonth() === viewMonth &&
    selected.getDate() === day;

  const isToday = (day: number) =>
    today.getFullYear() === viewYear &&
    today.getMonth() === viewMonth &&
    today.getDate() === day;

  const prevMonth = () => {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear((y) => y - 1);
    } else setViewMonth((m) => m - 1);
  };
  const nextMonth = () => {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear((y) => y + 1);
    } else setViewMonth((m) => m + 1);
  };

  // Visible months strip: current ± 4
  const stripMonths = [-2, -1, 0, 1, 2, 3, 4, 5].map((offset) => {
    let m = viewMonth + offset;
    let y = viewYear;
    while (m < 0) {
      m += 12;
      y--;
    }
    while (m > 11) {
      m -= 12;
      y++;
    }
    return { m, y, label: MONTHS[m], week: m + 1 };
  });

  const cells: (number | null)[] = [];
  for (let i = 0; i < startDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  return (
    <div className="bg-white rounded-2xl shadow-xl overflow-hidden w-full">
      {/* Month strip */}
      <div className="flex items-end px-2 pt-3 pb-2 gap-2 overflow-x-auto scrollbar-hide bg-[#f5f5f5]">
        {stripMonths.map(({ m, y, label, week }) => {
          const isCurrent = m === viewMonth && y === viewYear;
          return (
            <button
              key={`${y}-${m}`}
              onClick={() => {
                setViewMonth(m);
                setViewYear(y);
              }}
              className={`flex flex-col items-center flex-shrink-0 px-3 py-1.5 rounded-xl cursor-pointer transition-colors ${
                isCurrent
                  ? "bg-[#e84814] text-white"
                  : "text-[#999] hover:text-[#111]"
              }`}
            >
              <span className="text-[12px] font-medium leading-none">
                {label}
              </span>
              <span className="text-[14px] font-bold leading-none mt-0.5">
                {String(week).padStart(2, "0")}
              </span>
            </button>
          );
        })}
      </div>

      {/* Nav + title */}
      <div className="flex items-center justify-between px-4 py-3">
        <button
          onClick={prevMonth}
          className="w-8 h-8 flex items-center justify-center rounded-full border border-[#e4e4e4] hover:bg-[#f5f5f5] cursor-pointer"
        >
          <ChevronDown className="rotate-90 w-3 h-3 text-[#111]" />
        </button>
        <span className="text-[15px] font-medium text-[#111]">
          {MONTHS[viewMonth]} {viewYear}
        </span>
        <button
          onClick={nextMonth}
          className="w-8 h-8 flex items-center justify-center rounded-full border border-[#e4e4e4] hover:bg-[#f5f5f5] cursor-pointer"
        >
          <ChevronDown className="-rotate-90 w-3 h-3 text-[#111]" />
        </button>
      </div>

      {/* Day headers */}
      <div className="grid grid-cols-7 px-3">
        {DAYS.map((d, i) => (
          <div
            key={i}
            className="text-center text-[12px] text-[#999] font-medium py-1"
          >
            {d}
          </div>
        ))}
      </div>

      {/* Day grid */}
      <div className="grid grid-cols-7 px-3 pb-3 gap-y-1">
        {cells.map((day, i) => {
          if (!day) return <div key={i} />;
          const unavail = isUnavailable(day);
          const sel = isSelected(day);
          const tod = isToday(day);
          return (
            <button
              key={i}
              disabled={unavail}
              onClick={() => {
                onSelect(new Date(viewYear, viewMonth, day));
                onClose();
              }}
              className={`
                mx-auto w-9 h-9 flex items-center justify-center rounded-full text-[14px] font-medium transition-colors cursor-pointer
                ${sel ? "bg-[#e84814] text-white" : ""}
                ${tod && !sel ? "bg-[#e84814] text-white" : ""}
                ${unavail ? "text-[#ccc] bg-[#f5f5f5] cursor-not-allowed" : ""}
                ${
                  !sel && !tod && !unavail
                    ? "text-[#111] hover:bg-[#f5f5f5]"
                    : ""
                }
              `}
            >
              {day}
            </button>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-2 pb-3">
        <div className="w-3 h-3 rounded-full bg-[#ccc]" />
        <span className="text-[12px] text-[#999]">Unavailable days</span>
      </div>
    </div>
  );
};

// ─── Custom Dropdown ──────────────────────────────────────────────────────────

const CustomDropdown = ({
  label,
  value,
  onChange,
  options,
  unit,
  icon,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: string[];
  unit?: string;
  icon?: React.ReactNode;
}) => {
  const [isOpen, setIsOpen] = useState(false);

  // Разделяем label на текст и звездочку
  const renderLabel = () => {
    if (label.includes('*')) {
      const parts = label.split('*');
      return (
        <>
          {parts[0]}
          <span className="text-[#e84814]">*</span>
        </>
      );
    }
    return label;
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center justify-between gap-2 ${icon ? 'pl-8' : 'pl-3'} pr-3 py-2 rounded-[10px] border border-[#d9d9d9] bg-white text-[15px] text-[#111] leading-[140%] w-full outline-none focus:border-[#e84814] transition-colors cursor-pointer ${
          !value ? "text-[#111]" : ""
        }`}
      >
        {icon && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2">
            {icon}
          </span>
        )}
        <span>{value || renderLabel()}</span>
        <div className="flex items-center gap-2">
          {unit && value && (
            <span className="text-[13px] text-[#d9d9d9] border-l border-[#d9d9d9] pl-2">
              {unit}
            </span>
          )}
          <ChevronDown className={`text-[#d9d9d9] transition-transform ${isOpen ? "rotate-180" : ""}`} />
        </div>
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-[#d9d9d9] rounded-[10px] shadow-lg z-20 max-h-48 overflow-y-auto">
            {options.map((option) => (
              <button
                key={option}
                onClick={() => {
                  onChange(option);
                  setIsOpen(false);
                }}
                className={`w-full px-3 py-2 text-left text-[15px] hover:bg-[#f5f5f5] transition-colors cursor-pointer ${
                  value === option ? "bg-[#f7e4de] text-[#e84814]" : "text-[#111]"
                }`}
              >
                {option} {unit && unit}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

// ─── Field components ─────────────────────────────────────────────────────────

const fieldBase =
  "flex items-center gap-2 px-3 py-2 rounded-[10px] border border-[#d9d9d9] bg-white text-[15px] text-[#111] leading-[140%] w-full";
const inputCls = `${fieldBase} outline-none focus:border-[#e84814] transition-colors placeholder:text-[#111]`;

// ─── Participant block ────────────────────────────────────────────────────────

const ParticipantBlock = ({
  p,
  onChange,
  onToggleEquip,
  onToggleExpand,
  onToggleEquipSection,
}: {
  p: Participant;
  onChange: (id: number, field: string, val: string) => void;
  onToggleEquip: (pid: number, eid: number) => void;
  onToggleExpand: (id: number) => void;
  onToggleEquipSection: (id: number) => void;
}) => {
  const swiperRef = useRef<SwiperType | null>(null);
  const [isBeginning, setIsBeginning] = useState(true);
  const [isEnd, setIsEnd] = useState(false);

  return (
    <div className="bg-white rounded-2xl">
      {/* Header - только на мобилке */}
      <button
        onClick={() => onToggleExpand(p.id)}
        className="flex lg:hidden w-full items-center justify-between px-4 py-3 cursor-pointer"
      >
        <span className="text-[16px] font-medium text-[#111]">
          Participant <span className="text-[#e84814]">{p.id}</span>
        </span>
        <ChevronDown
          className={`text-[#111] transition-transform duration-200 ${
            p.isExpanded ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Desktop: всегда показываем, Mobile: только если expanded */}
      <div className={`${p.isExpanded ? "block" : "hidden"} lg:block px-4 pb-4 pt-2 flex flex-col gap-2`}>
        {/* Desktop заголовок */}
        <div className="hidden lg:block mb-2">
          <span className="text-[16px] font-medium text-[#111]">
            Participant <span className="text-[#e84814]">{p.id}</span>
          </span>
        </div>

        {/* Row 1: First / Last / DOB */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          <input
            className={`${inputCls} border-[#e84814]`}
            placeholder="First Name *"
            value={p.firstName}
            onChange={(e) => onChange(p.id, "firstName", e.target.value)}
          />
          <input
            className={inputCls}
            placeholder="Last Name *"
            value={p.lastName}
            onChange={(e) => onChange(p.id, "lastName", e.target.value)}
          />
          <input
            className={inputCls}
            placeholder="Date of Birth *"
            type="date"
            value={p.dateOfBirth}
            onChange={(e) => onChange(p.id, "dateOfBirth", e.target.value)}
          />
        </div>
        {/* Row 2: Gender / Phone / Email */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mt-2">
          <CustomDropdown
            label="Select Gender *"
            value={p.gender}
            onChange={(v) => onChange(p.id, "gender", v)}
            options={["Male", "Female", "Other"]}
          />
          <input
            className={inputCls}
            placeholder="Phone Number *"
            type="tel"
            value={p.phone}
            onChange={(e) => onChange(p.id, "phone", e.target.value)}
          />
          <input
            className={inputCls}
            placeholder="E-mail *"
            type="email"
            value={p.email}
            onChange={(e) => onChange(p.id, "email", e.target.value)}
          />
        </div>
        {/* Row 3: Height / Weight / Shoe size */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mt-2">
          <CustomDropdown
            label="Height *"
            value={p.height}
            onChange={(v) => onChange(p.id, "height", v)}
            unit="cm"
            options={[
              "150",
              "155",
              "160",
              "165",
              "170",
              "175",
              "180",
              "185",
              "190",
              "195",
              "200",
            ]}
          />
          <CustomDropdown
            label="Weight *"
            value={p.weight}
            onChange={(v) => onChange(p.id, "weight", v)}
            unit="kg"
            options={["40", "50", "60", "70", "80", "90", "100", "110", "120"]}
          />
          <CustomDropdown
            label="Shoe Size *"
            value={p.shoeSize}
            onChange={(v) => onChange(p.id, "shoeSize", v)}
            unit="EU"
            options={[
              "36",
              "37",
              "38",
              "39",
              "40",
              "41",
              "42",
              "43",
              "44",
              "45",
              "46",
            ]}
          />
        </div>

        <p className="text-[13px] text-[#111] opacity-80 leading-[160%] mt-3 mb-4">
          The following equipment will be included in your course: 7mm wetsuit
          including hood and boots, mask, snorkel, fins, weights, buoyancy
          compensator, regulator and any other specific equipment necessary
          unless otherwise noted in the INCLUDED section of the course.
        </p>

        {/* Equipment section header - только на мобилке */}
        <button
          onClick={() => onToggleEquipSection(p.id)}
          className="flex lg:hidden w-full items-center justify-between cursor-pointer mt-2"
        >
          <span className="text-[15px] font-bold text-[#111] text-start">
            Additional Equipment for Participant{" "}
            <span className="text-[#e84814]">{p.id}</span>
          </span>
          <ChevronDown
            className={`text-[#111] transition-transform duration-200 ${
              p.isEquipmentExpanded ? "rotate-180" : ""
            }`}
          />
        </button>

        {/* Desktop заголовок оборудования */}
        <div className="hidden lg:block mt-3 mb-2">
          <span className="text-[15px] font-bold text-[#111] text-start">
            Additional Equipment for Participant{" "}
            <span className="text-[#e84814]">{p.id}</span>
          </span>
        </div>

        {/* Desktop: Swiper, Mobile: обычная сетка с аккордеоном */}
        <div className={`${p.isEquipmentExpanded ? "block" : "hidden"} lg:block`}>
          {/* Mobile Grid */}
          <div className="flex lg:hidden flex-wrap gap-3 mt-4">
            {p.equipment.map((item) => (
              <div
                key={item.id}
                className={`relative w-[114px] flex-shrink-0 transition-colors ${
                  item.isSelected ? "bg-[#f7e4de]" : "bg-[#f1f1f1]"
                } rounded-2xl p-2`}
              >
                {/* Add/Remove btn - поднимаем выше */}
                <button
                  onClick={() => onToggleEquip(p.id, item.id)}
                  className={`absolute -top-2 -left-2 w-12 h-12 rounded-full flex items-center justify-center shadow-md z-20 cursor-pointer transition-colors ${
                    item.isSelected ? "bg-[#e84814]" : "bg-black"
                  }`}
                >
                  {item.isSelected ? (
                    <CheckIconActive />
                  ) : (
                    <PlusIcon />
                  )}
                </button>
                
                {/* Image area */}
                <div className="relative w-full h-[100px] rounded-xl overflow-hidden flex-shrink-0">
                  <img 
                    src="/Rectangle 8.png" 
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                  {/* Price badge */}
                  <div className="absolute top-2 right-2 flex items-center gap-0.5 bg-white rounded-lg px-1.5 py-0.5 shadow-sm z-10">
                    <svg width="12" height="12" viewBox="0 0 20 20" fill="none">
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M0 10C0 4.47715 4.47715 0 10 0C15.5228 0 20 4.47715 20 10C20 15.5228 15.5228 20 10 20C4.47715 20 0 15.5228 0 10ZM8.6158 7.5C9.0535 6.71823 9.8025 6 10.7498 6C11.284 6 11.819 6.23239 12.2923 6.70646C12.6824 7.09734 13.3156 7.09792 13.7065 6.70775C14.0973 6.31758 14.0979 5.68442 13.7077 5.29354C12.9274 4.51179 11.9042 4 10.7498 4C9.3289 4 8.1189 4.77025 7.29826 5.86449C6.93769 6.34528 6.64329 6.89783 6.42654 7.5H6C5.44772 7.5 5 7.94772 5 8.5C5 8.9581 5.30804 9.3443 5.72828 9.4626C5.82228 9.4891 5.91867 9.5 6.01613 9.5C5.99473 9.8304 5.99473 10.1696 6.01613 10.5C5.91867 10.5 5.82228 10.5109 5.72828 10.5374C5.30804 10.6557 5 11.0419 5 11.5C5 12.0523 5.44772 12.5 6 12.5H6.42654C6.64329 13.1022 6.93769 13.6547 7.29826 14.1355C8.1189 15.2298 9.3289 16 10.7498 16C11.9042 16 12.9274 15.4882 13.7077 14.7065C14.0979 14.3156 14.0973 13.6824 13.7065 13.2923C13.3156 12.9021 12.6824 12.9027 12.2923 13.2935C11.819 13.7676 11.284 14 10.7498 14C9.8025 14 9.0535 13.2818 8.6158 12.5H10C10.5523 12.5 11 12.0523 11 11.5C11 10.9477 10.5523 10.5 10 10.5H8.0217C7.99312 10.1735 7.99312 9.8265 8.0217 9.5H11C11.5523 9.5 12 9.0523 12 8.5C12 7.94772 11.5523 7.5 11 7.5H8.6158Z"
                        fill="black"
                      />
                    </svg>
                    <span className="text-[11px] font-bold text-black">
                      {item.price}
                    </span>
                  </div>
                </div>
                
                {/* Name */}
                <div className="bg-white rounded-xl px-2 py-1.5 mt-2">
                  <p className="text-[11px] text-[#111] leading-[130%]">
                    {item.name}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop Swiper */}
          <div className="hidden lg:block relative px-16 mt-4">
            <Swiper
              modules={[Navigation]}
              spaceBetween={12}
              slidesPerView="auto"
              loop={true}
              onSwiper={(swiper) => {
                swiperRef.current = swiper;
                setIsBeginning(swiper.isBeginning);
                setIsEnd(swiper.isEnd);
              }}
              onSlideChange={(swiper) => {
                setIsBeginning(swiper.isBeginning);
                setIsEnd(swiper.isEnd);
              }}
            >
              {p.equipment.map((item) => (
                <SwiperSlide key={item.id} style={{ width: "150px" }}>
                  <div
                    className={`relative w-[150px] flex-shrink-0 transition-colors ${
                      item.isSelected ? "bg-[#f7e4de]" : "bg-[#f1f1f1]"
                    } rounded-2xl p-2`}
                  >
                    {/* Add/Remove btn - поднимаем выше */}
                    <button
                      onClick={() => onToggleEquip(p.id, item.id)}
                      className={`absolute -top-2 -left-2 w-12 h-12 rounded-full flex items-center justify-center shadow-md z-20 cursor-pointer transition-colors ${
                        item.isSelected ? "bg-[#e84814]" : "bg-black"
                      }`}
                    >
                      {item.isSelected ? (
                        <CheckIconActive />
                      ) : (
                        <PlusIcon />
                      )}
                    </button>
                    
                    {/* Image area */}
                    <div className="relative w-full h-[100px] rounded-xl overflow-hidden flex-shrink-0">
                      <img 
                        src="/Rectangle 8.png" 
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                      {/* Price badge */}
                      <div className="absolute top-2 right-2 flex items-center gap-0.5 bg-white rounded-lg px-1.5 py-0.5 shadow-sm z-10">
                        <svg width="12" height="12" viewBox="0 0 20 20" fill="none">
                          <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M0 10C0 4.47715 4.47715 0 10 0C15.5228 0 20 4.47715 20 10C20 15.5228 15.5228 20 10 20C4.47715 20 0 15.5228 0 10ZM8.6158 7.5C9.0535 6.71823 9.8025 6 10.7498 6C11.284 6 11.819 6.23239 12.2923 6.70646C12.6824 7.09734 13.3156 7.09792 13.7065 6.70775C14.0973 6.31758 14.0979 5.68442 13.7077 5.29354C12.9274 4.51179 11.9042 4 10.7498 4C9.3289 4 8.1189 4.77025 7.29826 5.86449C6.93769 6.34528 6.64329 6.89783 6.42654 7.5H6C5.44772 7.5 5 7.94772 5 8.5C5 8.9581 5.30804 9.3443 5.72828 9.4626C5.82228 9.4891 5.91867 9.5 6.01613 9.5C5.99473 9.8304 5.99473 10.1696 6.01613 10.5C5.91867 10.5 5.82228 10.5109 5.72828 10.5374C5.30804 10.6557 5 11.0419 5 11.5C5 12.0523 5.44772 12.5 6 12.5H6.42654C6.64329 13.1022 6.93769 13.6547 7.29826 14.1355C8.1189 15.2298 9.3289 16 10.7498 16C11.9042 16 12.9274 15.4882 13.7077 14.7065C14.0979 14.3156 14.0973 13.6824 13.7065 13.2923C13.3156 12.9021 12.6824 12.9027 12.2923 13.2935C11.819 13.7676 11.284 14 10.7498 14C9.8025 14 9.0535 13.2818 8.6158 12.5H10C10.5523 12.5 11 12.0523 11 11.5C11 10.9477 10.5523 10.5 10 10.5H8.0217C7.99312 10.1735 7.99312 9.8265 8.0217 9.5H11C11.5523 9.5 12 9.0523 12 8.5C12 7.94772 11.5523 7.5 11 7.5H8.6158Z"
                            fill="black"
                          />
                        </svg>
                        <span className="text-[11px] font-bold text-black">
                          {item.price}
                        </span>
                      </div>
                    </div>
                    
                    {/* Name */}
                    <div className="bg-white rounded-xl px-2 py-1.5 mt-2">
                      <p className="text-[11px] text-[#111] leading-[130%]">
                        {item.name}
                      </p>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>

            {/* Navigation Buttons */}
            <button
              onClick={() => swiperRef.current?.slidePrev()}
              disabled={isBeginning}
              className={`absolute left-0 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                isBeginning
                  ? "bg-[#e4e4e4] cursor-not-allowed"
                  : "bg-[#e84814] cursor-pointer hover:bg-[#d63f0f]"
              }`}
            >
              {isBeginning ? <ArrowLeftInactive /> : <ArrowLeftActive />}
            </button>
            <button
              onClick={() => swiperRef.current?.slideNext()}
              disabled={isEnd}
              className={`absolute right-0 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                isEnd
                  ? "bg-[#e4e4e4] cursor-not-allowed"
                  : "bg-[#e84814] cursor-pointer hover:bg-[#d63f0f]"
              }`}
            >
              {isEnd ? <ArrowRightInactive /> : <ArrowRightActive />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── Reservation Summary ──────────────────────────────────────────────────────

const ReservationSummary = ({
  courseTitle,
  participants,
  pricePerPerson,
  onBook,
}: {
  courseTitle: string;
  participants: Participant[];
  pricePerPerson: number;
  onBook: () => void;
}) => {
  const count = participants.length;
  const courseTotal = count * pricePerPerson;
  const equipByP = participants.map((p) => ({
    id: p.id,
    items: p.equipment.filter((e) => e.isSelected),
  }));
  const equipTotal = equipByP
    .flatMap((p) => p.items)
    .reduce((s, e) => s + e.price, 0);
  const grand = courseTotal + equipTotal;

  return (
    <div className="bg-white rounded-2xl border-2 border-[#e84814] p-4 flex flex-col gap-2">
      <h3 className="text-[18px] font-medium text-black">
        Reservation Details
      </h3>
      <div className="h-px bg-[#e4e4e4]" />
      <p className="text-[13px] font-medium text-black leading-[140%]">
        {courseTitle}
      </p>
      <div className="flex justify-between text-[13px] text-black py-1">
        <span>
          {count} Adult{count > 1 ? "s" : ""} x € {pricePerPerson}
        </span>
        <span>€ {courseTotal}</span>
      </div>
      {equipByP.map(
        (p) =>
          p.items.length > 0 && (
            <div key={p.id}>
              <div className="h-px bg-[#e4e4e4] my-1" />
              <p className="text-[12px] font-semibold text-[#111] mb-1">
                Additional Equipment for Participant{" "}
                <span className="text-[#e84814]">{p.id}</span>
              </p>
              {p.items.map((item) => (
                <div
                  key={item.id}
                  className="flex justify-between text-[13px] text-black py-0.5"
                >
                  <span>1 {item.name}</span>
                  <span>€ {item.price}</span>
                </div>
              ))}
            </div>
          )
      )}
      <div className="h-px bg-[#e4e4e4] mt-1" />
      <div className="flex justify-between text-[17px] font-medium text-black py-1">
        <span>Total price</span>
        <span>€ {grand}</span>
      </div>
      <button
        onClick={onBook}
        className="w-full py-2 rounded-full bg-[#e84814] text-white text-[16px] font-semibold hover:bg-[#d63f0f] transition-colors cursor-pointer mt-1"
      >
        Book Now
      </button>
    </div>
  );
};

// ─── MAIN MODAL ───────────────────────────────────────────────────────────────

export const BookingFormModal: React.FC<Props> = ({
  isOpen,
  onClose,
  courseTitle = "PADI Advanced Open Water Diver & PADI Underwater Naturalist Sesimbra",
  pricePerPerson = 519,
  unavailableDates = [],
}) => {
  const [location, setLocation] = useState("Peniche");
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showCalendar, setShowCalendar] = useState(false);
  const [participantCount, setParticipantCount] = useState(2);
  const [participants, setParticipants] = useState<Participant[]>([
    createParticipant(1),
    createParticipant(2),
  ]);
  const [comment, setComment] = useState("");
  const [privacy, setPrivacy] = useState(false);
  const [terms, setTerms] = useState(false);

  const formatDate = (d: Date | null) => {
    if (!d) return "22/09/2025";
    return `${String(d.getDate()).padStart(2, "0")}/${String(
      d.getMonth() + 1
    ).padStart(2, "0")}/${d.getFullYear()}`;
  };

  const setCount = (n: number) => {
    const c = Math.max(1, Math.min(10, n));
    setParticipantCount(c);
    setParticipants((prev) => {
      if (c > prev.length)
        return [
          ...prev,
          ...Array.from({ length: c - prev.length }, (_, i) =>
            createParticipant(prev.length + i + 1)
          ),
        ];
      return prev.slice(0, c);
    });
  };

  const updateParticipant = (id: number, field: string, val: string) =>
    setParticipants((prev) =>
      prev.map((p) => (p.id === id ? { ...p, [field]: val } : p))
    );

  const toggleEquip = (pid: number, eid: number) =>
    setParticipants((prev) =>
      prev.map((p) =>
        p.id === pid
          ? {
              ...p,
              equipment: p.equipment.map((e) =>
                e.id === eid ? { ...e, isSelected: !e.isSelected } : e
              ),
            }
          : p
      )
    );

  const toggleExpand = (id: number) =>
    setParticipants((prev) =>
      prev.map((p) => (p.id === id ? { ...p, isExpanded: !p.isExpanded } : p))
    );

  const toggleEquipSection = (id: number) =>
    setParticipants((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, isEquipmentExpanded: !p.isEquipmentExpanded } : p
      )
    );

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Scroll container */}
      <div className="fixed inset-0 z-50 overflow-y-auto">
        <div className="min-h-full flex items-start justify-center">
          {/* Modal wrapper */}
          <div
            className="relative w-full mx-4 md:mx-8 my-4 md:my-8 lg:mx-[158px] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* ── HEADER ── */}
            <div
              className="relative flex items-end overflow-hidden"
              style={{ height: 76 }}
            >
              {/* Orange shape SVG */}
              <svg
                viewBox="0 0 482 121"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="absolute left-0 bottom-0 h-full w-auto"
                preserveAspectRatio="none"
                style={{ minWidth: 250 }}
              >
                <path
                  d="M0 20C0 8.95431 8.9543 0 20 0H403.17C410.466 0 417.184 3.97311 420.698 10.3672L481.5 121H0V20Z"
                  fill="#E84814"
                />
              </svg>

              {/* Booking Form text */}
              <div className="relative z-0 flex items-center gap-3 px-6 pb-6 pt-4">
                {/* Dive icon */}
                <div className="w-9 h-9 bg-white rounded-full flex items-center justify-center flex-shrink-0">
                  <svg
                    width="44"
                    height="44"
                    viewBox="0 0 44 44"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <rect width="44" height="44" rx="22" fill="white" />
                    <path
                      d="M27.9624 23.293C28.8861 22.3501 30.3835 22.3501 31.3072 23.293C32.2309 24.2358 32.2309 25.7642 31.3072 26.707L27.2341 30.8645C27.1332 30.9675 27.0021 31.1066 26.8434 31.2195L26.843 31.2191C26.7172 31.3088 26.5813 31.383 26.4381 31.4402C26.2583 31.5122 26.0727 31.5468 25.9326 31.5754L23.9487 31.9805C23.6275 32.046 23.2955 31.9435 23.0639 31.707C22.8322 31.4706 22.7317 31.1318 22.796 30.8039L23.1928 28.7789C23.2209 28.6358 23.2543 28.4461 23.3249 28.2625C23.3809 28.1164 23.4537 27.9777 23.5415 27.8492L23.6283 27.7332C23.718 27.6223 23.8136 27.5277 23.8893 27.4504L27.9624 23.293ZM29.9219 24.707C29.7634 24.5453 29.5063 24.5453 29.3478 24.707L25.2747 28.8645C25.2078 28.9328 25.175 28.9665 25.1519 28.9918C25.1513 28.9924 25.1505 28.9928 25.15 28.9934C25.1497 28.9943 25.1498 28.9955 25.1496 28.9965C25.1418 29.0301 25.1325 29.0767 25.114 29.1711L25.0053 29.725L25.5484 29.6145C25.6408 29.5956 25.6865 29.5861 25.7194 29.5781C25.7203 29.5779 25.7213 29.5775 25.7221 29.5773C25.7227 29.5768 25.7234 29.5764 25.724 29.5758C25.7488 29.5522 25.7818 29.5187 25.8488 29.4504L29.9219 25.293C30.0803 25.1312 30.0803 24.8688 29.9219 24.707ZM19.8377 26C20.3787 26 20.8174 26.4478 20.8174 27C20.8174 27.5523 20.3788 28 19.8377 28H16.8986C16.3575 28 15.9189 27.5523 15.9189 27C15.9189 26.4477 16.3575 26 16.8986 26H19.8377ZM23.2667 22C23.8077 22 24.2464 22.4478 24.2464 23C24.2464 23.5523 23.8078 24 23.2667 24H16.8986C16.3575 24 15.9189 23.5523 15.9189 23C15.9189 22.4477 16.3575 22 16.8986 22H23.2667ZM29.6348 20H13.9594V27.8C13.9594 28.3764 13.9601 28.7487 13.9828 29.032C14.0045 29.3036 14.0415 29.4045 14.0662 29.4539L14.1041 29.523C14.1848 29.6572 14.2953 29.7701 14.4267 29.8523L14.4944 29.891L14.5419 29.9117C14.6025 29.934 14.7081 29.9595 14.9078 29.9762C15.1853 29.9993 15.55 30 16.1148 30H19.8377C20.3788 30 20.8174 30.4477 20.8174 31C20.8174 31.5523 20.3788 32 19.8377 32H16.1148C15.5823 32 15.124 32.0009 14.7482 31.9695C14.3608 31.9372 13.9754 31.8659 13.6047 31.673V31.6727C13.0517 31.385 12.602 30.9264 12.3203 30.3621C12.1314 29.9837 12.0615 29.5903 12.0299 29.1949C11.9992 28.8113 12 28.3435 12 27.8V18.2C12 17.6565 11.9992 17.1887 12.0299 16.8051C12.0615 16.4097 12.1314 16.0163 12.3203 15.6379C12.6021 15.0735 13.0517 14.6146 13.6047 14.327C13.9754 14.1342 14.3608 14.0628 14.7482 14.0305C15.0771 14.003 15.4692 14.0011 15.9189 14.0008V13C15.9189 12.4477 16.3575 12 16.8986 12C17.4396 12 17.8783 12.4477 17.8783 13V14H25.716V13C25.716 12.4477 26.1546 12 26.6957 12C27.2368 12 27.6754 12.4477 27.6754 13V14.0008C28.1251 14.0011 28.5171 14.003 28.8461 14.0305C29.2334 14.0628 29.6189 14.1341 29.9896 14.327C30.5424 14.6145 30.9918 15.0735 31.2736 15.6379C31.4624 16.0163 31.5328 16.4097 31.5644 16.8051C31.5951 17.1887 31.5943 17.6565 31.5943 18.2V20C31.5943 20.5523 31.1556 21 30.6145 21C30.0735 21 29.6348 20.5523 29.6348 20ZM16.1148 16C15.55 16 15.1853 16.0007 14.9078 16.0238C14.6417 16.046 14.5429 16.0838 14.4944 16.109C14.3101 16.2048 14.1601 16.3579 14.0662 16.5461C14.0415 16.5956 14.0045 16.6964 13.9828 16.968C13.9628 17.2171 13.9606 17.535 13.9602 18H29.6341C29.6336 17.535 29.6314 17.2171 29.6115 16.968C29.5897 16.6964 29.5527 16.5955 29.5281 16.5461C29.446 16.3816 29.321 16.2437 29.1676 16.1477L29.0998 16.109C29.0514 16.0838 28.9526 16.046 28.6865 16.0238C28.4089 16.0007 28.0442 16 27.4795 16H16.1148Z"
                      fill="black"
                    />
                  </svg>
                </div>
                <span
                  className="text-white leading-[130%]"
                  style={{
                    fontFamily: "var(--font-family)",
                    fontWeight: 500,
                    fontSize: 28,
                  }}
                >
                  Booking Form
                </span>
              </div>

              {/* Close button */}
              <button
                onClick={onClose}
                className="p-1 md:p-3 absolute right-0 top-0 flex items-center justify-center cursor-pointer bg-white rounded-lg hover:bg-[#f5f5f5] transition-colors"
                style={{
                  border: "1px solid rgba(0,0,0,0.12)",
                  borderRadius: 8,
                }}
                aria-label="Close"
              >
                <svg width="32" height="32" viewBox="0 0 53 53" fill="none">
                  <path
                    d="M15.459 15.4583L37.5423 37.5416M15.459 37.5416L37.5423 15.4583"
                    stroke="black"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </div>

            <div className="bg-[#f1f1f1] px-6 rounded-b-2xl z-10 rounded-t-2xl shadow-2xl -mt-3 relative">
              <div className="py-4 px-6 text-center">
                <p className="text-[15px] font-medium text-[#111] leading-[140%]">
                  {courseTitle}
                </p>
              </div>

              {/* ── SELECT DATE BANNER ── */}
              <div className="py-3">
                <div className="bg-[#281d4d] rounded-2xl px-6 py-3 text-center">
                  <span className="text-white text-[17px] font-medium">
                    Select date and travelers
                  </span>
                </div>
              </div>

              {/* ── MAIN CONTENT AREA ── */}
              <div className="pb-8">
                <div className="flex flex-col lg:flex-row gap-4 items-start">
                  {/* ── LEFT: Form ── */}
                  <div className="flex-1 min-w-0 flex flex-col gap-3">
                    {/* Location + Date + Participants - отдельные блоки */}
                    <div className="flex flex-col sm:flex-row gap-3">
                      {/* Location */}
                      <div className="flex-1 min-w-[200px] bg-white rounded-2xl p-4 flex flex-col gap-1.5">
                        <span className="text-[13px] font-medium text-[#111]">
                          Choose location
                        </span>
                        <CustomDropdown
                          label="Select location"
                          value={location}
                          onChange={setLocation}
                          options={[
                            "Peniche",
                            "Sesimbra",
                            "Madeira",
                            "Santa Maria",
                            "Faial",
                            "São Vicente",
                          ]}
                          icon={<LocationIcon />}
                        />
                      </div>

                      {/* Date */}
                      <div className="flex-1 min-w-[200px] bg-white rounded-2xl p-4 flex flex-col gap-1.5 relative">
                        <span className="text-[13px] font-medium text-[#111]">
                          Choose Date
                        </span>
                        <button
                          onClick={() => setShowCalendar((v) => !v)}
                          className={`flex items-center justify-between px-3 py-2 rounded-[10px] border text-[15px] w-full cursor-pointer transition-colors ${
                            showCalendar || selectedDate
                              ? "bg-[#e84814] border-[#e84814] text-white"
                              : "bg-white border-[#d9d9d9] text-[#111]"
                          }`}
                        >
                          <span className="flex items-center gap-2">
                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M15.9624 11.293C16.8861 10.3501 18.3835 10.3501 19.3072 11.293C20.2309 12.2358 20.2309 13.7642 19.3072 14.707L15.2341 18.8645C15.1332 18.9675 15.0021 19.1066 14.8434 19.2195C14.7175 19.3091 14.5813 19.383 14.4381 19.4402C14.2583 19.5122 14.0727 19.5468 13.9326 19.5754L11.9487 19.9805C11.6275 20.046 11.2955 19.9435 11.0639 19.707C10.8322 19.4706 10.7317 19.1318 10.796 18.8039L11.1928 16.7789C11.2209 16.6358 11.2543 16.4461 11.3249 16.2625C11.3809 16.1164 11.4537 15.9777 11.5415 15.8492L11.6283 15.7332C11.718 15.6223 11.8136 15.5277 11.8893 15.4504L15.9624 11.293ZM17.9219 12.707C17.7634 12.5453 17.5063 12.5453 17.3478 12.707L13.2747 16.8645C13.2078 16.9328 13.175 16.9665 13.1519 16.9918C13.1513 16.9924 13.1505 16.9928 13.15 16.9934C13.1497 16.9943 13.1498 16.9955 13.1496 16.9965C13.1418 17.0301 13.1325 17.0767 13.114 17.1711L13.0053 17.725L13.5484 17.6145C13.6408 17.5956 13.6865 17.5861 13.7194 17.5781C13.7203 17.5779 13.7213 17.5775 13.7221 17.5773C13.7227 17.5768 13.7234 17.5764 13.724 17.5758C13.7488 17.5522 13.7818 17.5187 13.8488 17.4504L17.9219 13.293C18.0803 13.1312 18.0803 12.8688 17.9219 12.707ZM7.8377 14C8.37874 14 8.81736 14.4478 8.81741 15C8.8174 15.5523 8.37877 16 7.8377 16H4.89856C4.35749 16 3.91885 15.5523 3.91885 15C3.91887 14.4477 4.3575 14 4.89856 14H7.8377ZM11.2667 10C11.8077 10 12.2464 10.4478 12.2464 11C12.2464 11.5523 11.8078 12 11.2667 12H4.89856C4.35749 12 3.91885 11.5523 3.91885 11C3.91886 10.4477 4.35749 10 4.89856 10H11.2667ZM17.6348 8H1.95943V15.8C1.95943 16.3764 1.9601 16.7487 1.98277 17.032C2.00451 17.3036 2.04153 17.4045 2.0662 17.4539L2.10409 17.523C2.18475 17.6572 2.29532 17.7701 2.4267 17.8523L2.49444 17.891L2.5419 17.9117C2.60254 17.934 2.70806 17.9595 2.90776 17.9762C3.18533 17.9993 3.55003 18 4.11479 18H7.8377C8.37878 18 8.81741 18.4477 8.81741 19C8.81741 19.5523 8.37878 20 7.8377 20H4.11479C3.58233 20 3.12404 20.0009 2.74817 19.9695C2.36084 19.9372 1.97537 19.8659 1.60466 19.673C1.05169 19.3854 0.602024 18.9264 0.320322 18.3621C0.131423 17.9837 0.0614981 17.5903 0.029853 17.1949C-0.000847982 16.8113 2.35339e-06 16.3435 2.35411e-06 15.8V6.2C2.35411e-06 5.6565 -0.000849448 5.18873 0.029853 4.80508C0.061499 4.40973 0.131434 4.01627 0.320322 3.63789C0.602088 3.07348 1.0517 2.61455 1.60466 2.32695C1.97537 2.13415 2.36085 2.06277 2.74817 2.03047C3.07712 2.00304 3.46918 2.00106 3.91885 2.00078V1C3.91885 0.447715 4.35748 0 4.89856 0C5.43964 0 5.87828 0.447715 5.87828 1V2H13.716V1C13.716 0.447715 14.1546 0 14.6957 0C15.2368 0 15.6754 0.447715 15.6754 1V2.00078C16.1251 2.00106 16.5171 2.00304 16.8461 2.03047C17.2334 2.06277 17.6189 2.13414 17.9896 2.32695C18.5424 2.61449 18.9918 3.07346 19.2736 3.63789C19.4624 4.01628 19.5328 4.40973 19.5644 4.80508C19.5951 5.18873 19.5943 5.65651 19.5943 6.2V8C19.5943 8.55228 19.1556 9 18.6145 9C18.0735 9 17.6348 8.55228 17.6348 8ZM4.11479 4C3.55003 4 3.18533 4.00069 2.90776 4.02383C2.64172 4.04601 2.5429 4.08379 2.49444 4.10898C2.31011 4.20485 2.16012 4.35794 2.0662 4.54609C2.04152 4.59555 2.00451 4.69642 1.98277 4.96797C1.96284 5.21709 1.96063 5.53498 1.96019 6H17.6341C17.6336 5.53498 17.6314 5.21709 17.6115 4.96797C17.5897 4.6964 17.5527 4.59555 17.5281 4.54609C17.446 4.3816 17.321 4.24374 17.1676 4.14766L17.0998 4.10898C17.0514 4.08381 16.9526 4.04602 16.6865 4.02383C16.4089 4.00069 16.0442 4 15.4795 4H4.11479Z" fill={showCalendar || selectedDate ? "white" : "#E84814"} />
                            </svg>
                            {formatDate(selectedDate)}
                          </span>
                        </button>
                        {showCalendar && (
                          <div className="absolute top-full left-0 right-0 z-30 mt-1 shadow-xl rounded-2xl">
                            <CustomCalendar
                              selected={selectedDate}
                              onSelect={setSelectedDate}
                              unavailableDates={unavailableDates}
                              onClose={() => setShowCalendar(false)}
                            />
                          </div>
                        )}
                      </div>

                      {/* Participants */}
                      <div className="w-full sm:w-[180px] flex-shrink-0 bg-white rounded-2xl p-4 flex flex-col gap-1.5">
                        <span className="text-[13px] font-medium text-[#111]">
                          Participants{" "}
                          <span className="text-[#e84814]">*</span>
                        </span>
                        <div className="flex items-center gap-2 px-3 py-2 rounded-[10px] border border-[#d9d9d9] bg-white">
                          <PersonIcon />
                          <input
                            type="number"
                            min={1}
                            max={10}
                            value={participantCount}
                            onChange={(e) => setCount(Number(e.target.value))}
                            className="flex-1 text-[15px] text-[#111] bg-transparent outline-none w-8"
                          />
                          <div className="relative w-4">
                            <ChevronDown className="text-[#d9d9d9]" />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Additional Information — mobile только */}
                    <div className="lg:hidden bg-white rounded-2xl p-4 flex flex-col gap-3">
                      <span className="text-[14px] font-medium text-[#111]">
                        Additional Information
                      </span>
                      <textarea
                        className="w-full h-16 px-3 py-2 rounded-[10px] border border-[#d9d9d9] text-[15px] placeholder:text-[#999] resize-none outline-none focus:border-[#e84814]"
                        placeholder="Comment"
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                      />
                      <CheckboxRow
                        checked={privacy}
                        onChange={setPrivacy}
                        label="Política de privacidade da Haliotis"
                      />
                      <CheckboxRow
                        checked={terms}
                        onChange={setTerms}
                        label="Termos e Condições"
                      />
                    </div>

                    {/* Participants */}
                    {participants.map((p) => (
                      <ParticipantBlock
                        key={p.id}
                        p={p}
                        onChange={updateParticipant}
                        onToggleEquip={toggleEquip}
                        onToggleExpand={toggleExpand}
                        onToggleEquipSection={toggleEquipSection}
                      />
                    ))}

                    {/* Mobile reservation summary */}
                    <div className="lg:hidden">
                      <ReservationSummary
                        courseTitle={courseTitle}
                        participants={participants}
                        pricePerPerson={pricePerPerson}
                        onBook={() => console.log("Book")}
                      />
                    </div>
                  </div>

                  {/* ── RIGHT: desktop only sidebar ── */}
                  <div className="hidden lg:flex flex-col gap-3 w-[427px] flex-shrink-0 sticky top-4">
                    {/* Additional info */}
                    <div className="bg-white rounded-2xl p-4 flex flex-col gap-3">
                      <span className="text-[14px] font-medium text-[#111]">
                        Additional Information
                      </span>
                      <textarea
                        className="w-full h-20 px-3 py-2 rounded-[10px] border border-[#d9d9d9] text-[15px] placeholder:text-[#999] resize-none outline-none focus:border-[#e84814]"
                        placeholder="Comment"
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                      />
                      <CheckboxRow
                        checked={privacy}
                        onChange={setPrivacy}
                        label="Política de privacidade da Haliotis"
                      />
                      <CheckboxRow
                        checked={terms}
                        onChange={setTerms}
                        label="Termos e Condições"
                      />
                    </div>

                    {/* Reservation details */}
                    <ReservationSummary
                      courseTitle={courseTitle}
                      participants={participants}
                      pricePerPerson={pricePerPerson}
                      onBook={() => console.log("Book")}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

// ─── Checkbox helper ──────────────────────────────────────────────────────────

const CheckboxRow = ({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
}) => (
  <label className="flex items-start gap-2.5 cursor-pointer">
    <div
      className={`w-5 h-5 rounded flex-shrink-0 border flex items-center justify-center mt-0.5 transition-colors ${
        checked ? "border-[#e84814]" : "border-[#d9d9d9]"
      } bg-white`}
    >
      <input
        type="checkbox"
        className="sr-only"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
      />
      {checked && <CheckMark />}
    </div>
    <span className="text-[14px] text-[#111] leading-[140%]">
      I accept{" "}
      <a
        href="#"
        className="text-[#e84814] underline"
        onClick={(e) => e.preventDefault()}
      >
        {label}
      </a>
    </span>
  </label>
);