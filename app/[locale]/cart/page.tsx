"use client";

import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";

// ─── API ──────────────────────────────────────────────────────────────────────

const API_BASE = process.env.NEXT_PUBLIC_API_URL;

const readCartFromStorage = () => {
  try {
    const raw = localStorage.getItem("cart");
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const resolveCart = async (items) => {
  const res = await fetch(`${API_BASE}/cart/resolve`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({ items }),
  });
  if (!res.ok) throw new Error(`cart/resolve failed: ${res.status}`);
  return res.json();
};

const submitBooking = async (payload) => {
  const res = await fetch(`${API_BASE}/bookings`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error(`booking failed: ${res.status}`);
  return res.json();
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

const formatDate = (isoString) => {
  if (!isoString) return "";
  const d = new Date(isoString);
  return d.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
};

const getActivitySubtitle = (item, storageItem) => {
  if (item.type === "travels") {
    const start = item.dates?.start ? formatDate(item.dates.start) : "";
    const end = item.dates?.end ? formatDate(item.dates.end) : "";
    const dest = item.destination?.name || "";
    const datePart = start && end ? `${start} → ${end}` : start || end;
    return [datePart, dest].filter(Boolean).join(" · ");
  }
  if (item.type === "trip") {
    return item.location?.name || "";
  }
  // course — location from localStorage
  return storageItem?.location || "";
};

// Map API equipment_rent item → internal shape (full version with variations/size)
const mapEquipItem = (e) => ({
  id: e.id,
  name: e.name,
  image: e.image || null,
  price: parseFloat(e.price?.amount ?? 0),
  currency: e.price?.currency || "€",
  hasSize: e.category?.has_size || false,
  variations: e.variations || [],
  requiresCertification: e.requires_certification || false,
  isSelected: false,
  selectedVariationId: null,
});

// ─── Shared participants (one record per participant, used across ALL activities) ──

const createSharedParticipant = (id) => ({
  id,
  firstName: "",
  lastName: "",
  dateOfBirth: "",
  gender: "",
  phone: "",
  email: "",
  // measurements stored as { value, unitId }
  height: { value: "", unitId: null },
  weight: { value: "", unitId: null },
  shoeSize: { value: "", unitId: null },
});

// ─── Per-activity, per-participant data (equipment selection + certification) ──

const createActivityParticipantData = (equipmentTemplate = []) => ({
  equipment: equipmentTemplate.map((e) => ({ ...e })),
  certAgency: "",
  certLevel: "",
  totalDives: "",
  lastDiveDate: "",
});

// Map a resolved API activity item → internal activity object
const mapResolvedItem = (apiItem, storageItem, participantIds) => {
  const equipmentTemplate = (apiItem.equipment_rent || []).map(mapEquipItem);
  const byParticipant = {};
  participantIds.forEach((pid) => {
    byParticipant[pid] = createActivityParticipantData(equipmentTemplate);
  });
  console.log(storageItem, ' storageItem?.location');
  
  return {
    id: apiItem.id,
    apiType: apiItem.type, // "course" | "trip" | "travels"
    type: apiItem.type.toUpperCase(),
    title: apiItem.name,
    slug: apiItem.slug,
    centerSlug:  storageItem?.location || null,
    image: apiItem.image || null,
    subtitle: getActivitySubtitle(apiItem, storageItem),
    price: parseFloat(apiItem.price?.amount ?? apiItem.price ?? 0),
    currency: apiItem.price?.currency || "€",
    available: apiItem.available !== false,
    unavailableReason: apiItem.unavailable_reason || null,
    equipmentTemplate,
    requiresCert:
      !!apiItem.requires_certification ||
      equipmentTemplate.some((e) => e.requiresCertification),
    byParticipant, // { [participantId]: { equipment, certAgency, certLevel, totalDives, lastDiveDate } }
  };
};

// ─── Portal ───────────────────────────────────────────────────────────────────

const Portal = ({ children }) => {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);
  if (!mounted) return null;
  return createPortal(children, document.body);
};

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

const ShieldIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
    <path d="M12 2L3 7v5c0 5.25 3.75 10.15 9 11.35C17.25 22.15 21 17.25 21 12V7l-9-5z" fill="#4CAF50" />
    <path d="M9 12l2 2 4-4" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const CalendarFieldIcon = () => (
  <svg width="16" height="16" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M15.9624 11.293C16.8861 10.3501 18.3835 10.3501 19.3072 11.293C20.2309 12.2358 20.2309 13.7642 19.3072 14.707L15.2341 18.8645C15.1332 18.9675 15.0021 19.1066 14.8434 19.2195C14.7175 19.3091 14.5813 19.383 14.4381 19.4402C14.2583 19.5122 14.0727 19.5468 13.9326 19.5754L11.9487 19.9805C11.6275 20.046 11.2955 19.9435 11.0639 19.707C10.8322 19.4706 10.7317 19.1318 10.796 18.8039L11.1928 16.7789C11.2209 16.6358 11.2543 16.4461 11.3249 16.2625C11.3809 16.1164 11.4537 15.9777 11.5415 15.8492L11.6283 15.7332C11.718 15.6223 11.8136 15.5277 11.8893 15.4504L15.9624 11.293ZM17.9219 12.707C17.7634 12.5453 17.5063 12.5453 17.3478 12.707L13.2747 16.8645C13.2078 16.9328 13.175 16.9665 13.1519 16.9918C13.1418 17.0301 13.1325 17.0767 13.114 17.1711L13.0053 17.725L13.5484 17.6145C13.6408 17.5956 13.6865 17.5861 13.7194 17.5781C13.7488 17.5522 13.7818 17.5187 13.8488 17.4504L17.9219 13.293C18.0803 13.1312 18.0803 12.8688 17.9219 12.707ZM7.8377 14C8.37874 14 8.81736 14.4478 8.81741 15C8.8174 15.5523 8.37877 16 7.8377 16H4.89856C4.35749 16 3.91885 15.5523 3.91885 15C3.91887 14.4477 4.3575 14 4.89856 14H7.8377ZM11.2667 10C11.8077 10 12.2464 10.4478 12.2464 11C12.2464 11.5523 11.8078 12 11.2667 12H4.89856C4.35749 12 3.91885 11.5523 3.91885 11C3.91886 10.4477 4.35749 10 4.89856 10H11.2667ZM17.6348 8H1.95943V15.8C1.95943 16.3764 1.9601 16.7487 1.98277 17.032C2.00451 17.3036 2.04153 17.4045 2.0662 17.4539L2.10409 17.523C2.18475 17.6572 2.29532 17.7701 2.4267 17.8523L2.49444 17.891L2.5419 17.9117C2.60254 17.934 2.70806 17.9595 2.90776 17.9762C3.18533 17.9993 3.55003 18 4.11479 18H7.8377C8.37878 18 8.81741 18.4477 8.81741 19C8.81741 19.5523 8.37878 20 7.8377 20H4.11479C3.58233 20 3.12404 20.0009 2.74817 19.9695C2.36084 19.9372 1.97537 19.8659 1.60466 19.673C1.05169 19.3854 0.602024 18.9264 0.320322 18.3621C0.131423 17.9837 0.0614981 17.5903 0.029853 17.1949C-0.000847982 16.8113 2.35339e-06 16.3435 2.35411e-06 15.8V6.2C2.35411e-06 5.6565 -0.000849448 5.18873 0.029853 4.80508C0.061499 4.40973 0.131434 4.01627 0.320322 3.63789C0.602088 3.07348 1.0517 2.61455 1.60466 2.32695C1.97537 2.13415 2.36085 2.06277 2.74817 2.03047C3.07712 2.00304 3.46918 2.00106 3.91885 2.00078V1C3.91885 0.447715 4.35748 0 4.89856 0C5.43964 0 5.87828 0.447715 5.87828 1V2H13.716V1C13.716 0.447715 14.1546 0 14.6957 0C15.2368 0 15.6754 0.447715 15.6754 1V2.00078C16.1251 2.00106 16.5171 2.00304 16.8461 2.03047C17.2334 2.06277 17.6189 2.13414 17.9896 2.32695C18.5424 2.61449 18.9918 3.07346 19.2736 3.63789C19.4624 4.01628 19.5328 4.40973 19.5644 4.80508C19.5951 5.18873 19.5943 5.65651 19.5943 6.2V8C19.5943 8.55228 19.1556 9 18.6145 9C18.0735 9 17.6348 8.55228 17.6348 8ZM4.11479 4C3.55003 4 3.18533 4.00069 2.90776 4.02383C2.64172 4.04601 2.5429 4.08379 2.49444 4.10898C2.31011 4.20485 2.16012 4.35794 2.0662 4.54609C2.04152 4.59555 2.00451 4.69642 1.98277 4.96797C1.96284 5.21709 1.96063 5.53498 1.96019 6H17.6341C17.6336 5.53498 17.6314 5.21709 17.6115 4.96797C17.5897 4.6964 17.5527 4.59555 17.5281 4.54609C17.446 4.3816 17.321 4.24374 17.1676 4.14766L17.0998 4.10898C17.0514 4.08381 16.9526 4.04602 16.6865 4.02383C16.4089 4.00069 16.0442 4 15.4795 4H4.11479Z" fill="#E84814" />
  </svg>
);

// ─── Custom Dropdown ──────────────────────────────────────────────────────────

const CustomDropdown = ({ label, value, onChange, options, unit, icon }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [pos, setPos] = useState({ top: 0, left: 0, width: 0 });
  const triggerRef = useRef(null);
  const dropdownRef = useRef(null); // ← додай ref для портала

  const open = () => {
    if (triggerRef.current) {
      const r = triggerRef.current.getBoundingClientRect();
      setPos({ top: r.bottom + window.scrollY + 4, left: r.left + window.scrollX, width: r.width });
    }
    setIsOpen(true);
  };

  useEffect(() => {
    const handler = (e) => {
      if (
        triggerRef.current && !triggerRef.current.contains(e.target) &&
        dropdownRef.current && !dropdownRef.current.contains(e.target) // ← додай це
      ) {
        setIsOpen(false);
      }
    };
    if (isOpen) document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [isOpen]);

  const renderLabel = () => {
    if (label.includes("*")) {
      const parts = label.split("*");
      return <><span className="text-[#111]">{parts[0]}</span><span className="text-[#e84814]">*</span></>;
    }
    return <span className="text-[#111]">{label}</span>;
  };

  // Determine display value string
  const displayValue = typeof value === "object" && value !== null
    ? (value.title || value.name || "")
    : value;

  return (
    <div className="relative" ref={triggerRef}>
      <button
        onClick={() => (isOpen ? setIsOpen(false) : open())}
        className={`flex items-center justify-between gap-2 ${icon ? "pl-8" : "pl-3"} pr-3 py-2 rounded-[10px] border border-[#d9d9d9] bg-white text-[15px] w-full outline-none cursor-pointer relative`}
      >
        {icon && <span className="absolute left-3 top-1/2 -translate-y-1/2">{icon}</span>}
        <span className="text-[#111] truncate">{displayValue || renderLabel()}</span>
        <div className="flex items-center gap-2 flex-shrink-0">
          {unit && displayValue && (
            <span className="text-[13px] text-[#d9d9d9] border-l border-[#d9d9d9] pl-2">{unit}</span>
          )}
          <ChevronDown className={`text-[#d9d9d9] transition-transform ${isOpen ? "rotate-180" : ""}`} />
        </div>
      </button>
      {isOpen && (
        <Portal>
          <div
                ref={dropdownRef}  // ← додай це

            style={{ position: "absolute", top: pos.top, left: pos.left, width: pos.width, zIndex: 99999 }}
            className="bg-white border border-[#d9d9d9] rounded-[10px] shadow-xl max-h-48 overflow-y-auto"
          >
            {options.map((option) => {
              const optKey = typeof option === "object" ? option.id : option;
              const optLabel = typeof option === "object" ? (option.title || option.name) : option;
              const isSelected =
                typeof option === "object"
                  ? (value && value.id === option.id)
                  : option === value;
              return (
                <button
                  key={optKey}
                  onClick={() => { onChange(option); setIsOpen(false); }}
                  className={`w-full px-3 py-2 text-left text-[15px] hover:bg-[#f5f5f5] cursor-pointer ${isSelected ? "bg-[#f7e4de] text-[#e84814]" : "text-[#111]"}`}
                >
                  {optLabel}{unit && typeof option !== "object" ? ` ${unit}` : ""}
                </button>
              );
            })}
          </div>
        </Portal>
      )}
    </div>
  );
};

const inputCls =
  "flex items-center gap-2 px-3 py-2 rounded-[10px] border border-[#d9d9d9] bg-white text-[15px] text-[#111] w-full outline-none focus:border-[#e84814] transition-colors";

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

// ─── Custom calendar date picker ──────────────────────────────────────────────

const MONTHS_CAL = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const DAYS_CAL = ["S", "M", "T", "W", "T", "F", "S"];

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
  const isSelected = (day) =>
    selDate &&
    selDate.getFullYear() === viewYear &&
    selDate.getMonth() === viewMonth &&
    selDate.getDate() === day;
  const isToday = (day) =>
    today.getFullYear() === viewYear &&
    today.getMonth() === viewMonth &&
    today.getDate() === day;

  const prevMonth = () => {
    if (viewMonth === 0) { setViewMonth(11); setViewYear((y) => y - 1); } else setViewMonth((m) => m - 1);
  };
  const nextMonth = () => {
    if (viewMonth === 11) { setViewMonth(0); setViewYear((y) => y + 1); } else setViewMonth((m) => m + 1);
  };

  const stripMonths = [-2, -1, 0, 1, 2, 3, 4, 5].map((offset) => {
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
            <button
              key={`${y}-${m}`}
              onClick={() => { setViewMonth(m); setViewYear(y); }}
              className={`flex flex-col items-center flex-shrink-0 px-3 py-1.5 rounded-xl cursor-pointer transition-colors ${isCurrent ? "bg-[#e84814] text-white" : "text-[#999] hover:text-[#111]"}`}
            >
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
        {DAYS_CAL.map((d, i) => (
          <div key={i} className="text-center text-[12px] text-[#999] font-medium py-1">{d}</div>
        ))}
      </div>
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
                const iso = `${viewYear}-${String(viewMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
                onSelect(iso);
                onClose();
              }}
              className={`mx-auto w-9 h-9 flex items-center justify-center rounded-full text-[14px] font-medium transition-colors
                ${sel ? "bg-[#e84814] text-white" : ""}
                ${tod && !sel ? "bg-[#e84814] text-white" : ""}
                ${unavail ? "text-[#ccc] bg-[#f5f5f5] cursor-not-allowed" : ""}
                ${!sel && !tod && !unavail ? "text-[#111] hover:bg-[#f5f5f5] cursor-pointer" : ""}`}
            >
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
  const [pos, setPos] = useState({ top: 0, left: 0, width: 0 });
  const ref = useRef(null);
  const calendarRef = useRef(null); // ← добавили

  const openPicker = () => {
    if (ref.current) {
      const r = ref.current.getBoundingClientRect();
      setPos({ top: r.bottom + window.scrollY + 4, left: r.left + window.scrollX, width: Math.max(r.width, 300) });
    }
    setOpen(true);
  };

  useEffect(() => {
    const handler = (e) => {
      if (
        ref.current && !ref.current.contains(e.target) &&
        calendarRef.current && !calendarRef.current.contains(e.target) // ← добавили проверку
      ) {
        setOpen(false);
      }
    };
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
      <button
        onClick={() => (open ? setOpen(false) : openPicker())}
        className="flex items-center justify-between px-3 py-2 rounded-[10px] border border-[#d9d9d9] bg-white text-[15px] w-full cursor-pointer transition-colors focus:outline-none focus:border-[#e84814]"
      >
        {value ? (
          <span className="text-[#111]">{formatDisplay(value)}</span>
        ) : (
          <span className="text-[15px]">
            <span className="text-[#111]">{parts[0]}</span>
            {hasAsterisk && <span className="text-[#e84814]">*</span>}
          </span>
        )}
        <CalendarFieldIcon />
      </button>
      {open && (
        <Portal>
          <div
            ref={calendarRef} // ← добавили
            style={{ position: "absolute", top: pos.top, left: pos.left, width: pos.width, zIndex: 99999 }}
          >
            <MiniCalendar
              selected={value}
              onSelect={(v) => { onChange(v); setOpen(false); }}
              onClose={() => setOpen(false)}
              allowPast={allowPast}
            />
          </div>
        </Portal>
      )}
    </div>
  );
};

// ─── Participants Counter ─────────────────────────────────────────────────────

const ParticipantsCounter = ({ value, onChange }) => (
  <div className="flex items-center" style={{ height: 40, width: 97 }}>
    <button
      onClick={() => onChange(Math.max(1, value - 1))}
      style={{ border: "1px solid #f1f1f1", borderRadius: "10px 0 0 10px", padding: "8px 12px", width: 31, height: 40, background: "#f1f1f1", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", fontSize: 16, color: "#111", flexShrink: 0, lineHeight: 1 }}
    >
      −
    </button>
    <div
      style={{ border: "1px solid #f1f1f1", padding: "8px 12px", width: 34, height: 40, background: "#f1f1f1", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15, fontWeight: 600, color: "#111", flexShrink: 0 }}
    >
      {value}
    </div>
    <button
      onClick={() => onChange(Math.min(10, value + 1))}
      style={{ border: "1px solid #f1f1f1", borderRadius: "0 10px 10px 0", padding: "8px 12px", width: 34, height: 40, background: "#f1f1f1", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", fontSize: 16, color: "#111", flexShrink: 0, lineHeight: 1 }}
    >
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

// ─── Equipment Grid ───────────────────────────────────────────────────────────

const EquipmentGrid = ({ equipment, onToggle, onSelectVariation }) => (
  <div className="flex flex-wrap gap-3 mt-2 pt-4 pl-4">
    {equipment.map((item) => (
      <div
        key={item.id}
        className={`relative flex-shrink-0 w-[130px] transition-colors rounded-2xl p-2 ${item.isSelected ? "bg-[#f7e4de]" : "bg-[#f1f1f1]"}`}
      >
        <button
          onClick={() => onToggle(item.id)}
          style={{ borderRadius: 1000, padding: 2, width: 48, height: 48, background: item.isSelected ? "#e84814" : "#000", border: "none" }}
          className="absolute -top-3 -left-3 flex items-center justify-center z-20 cursor-pointer transition-all"
        >
          {item.isSelected ? (
            <svg width="44" height="44" viewBox="0 0 44 44" fill="none">
              <rect width="44" height="44" rx="22" fill="white" />
              <path d="M32.496 14.463C32.3505 14.3163 32.1774 14.1999 31.9866 14.1204C31.7959 14.0409 31.5913 14 31.3846 14C31.178 14 30.9733 14.0409 30.7826 14.1204C30.5918 14.1999 30.4187 14.3163 30.2732 14.463L18.6109 26.1403L13.7112 21.2252C13.5601 21.0792 13.3817 20.9645 13.1863 20.8874C12.9908 20.8104 12.7821 20.7727 12.5721 20.7763C12.362 20.7799 12.1547 20.8249 11.9621 20.9086C11.7694 20.9924 11.5951 21.1132 11.4492 21.2643C11.3032 21.4154 11.1884 21.5937 11.1114 21.7892C11.0344 21.9846 10.9966 22.1933 11.0002 22.4033C11.0039 22.6134 11.0488 22.8206 11.1326 23.0133C11.2163 23.206 11.3372 23.3802 11.4883 23.5262L17.4994 29.537C17.645 29.6837 17.8181 29.8001 18.0089 29.8796C18.1996 29.9591 18.4042 30 18.6109 30C18.8175 30 19.0221 29.9591 19.2129 29.8796C19.4037 29.8001 19.5768 29.6837 19.7223 29.537L32.496 16.764C32.6549 16.6174 32.7817 16.4395 32.8685 16.2415C32.9552 16.0435 33 15.8297 33 15.6135C33 15.3973 32.9552 15.1835 32.8685 14.9855C32.7817 14.7875 32.6549 14.6096 32.496 14.463Z" fill="#E84814" />
            </svg>
          ) : (
            <svg width="44" height="44" viewBox="0 0 44 44" fill="none">
              <rect width="44" height="44" rx="22" fill="white" />
              <path d="M12 22H32M22 12V32" stroke="#CFCFCF" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          )}
        </button>
        <div className="relative w-full h-[100px] rounded-xl overflow-hidden">
          {item.image ? (
            <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-[#2c2c2c] to-[#1a1a1a]" />
          )}
          <div className="absolute top-1.5 right-1.5 flex items-center gap-0.5 bg-white rounded-lg px-1.5 py-0.5 shadow-sm z-10">
            <CoinIcon />
            <span className="text-[11px] font-bold text-black">{item.price}</span>
          </div>
        </div>
        <div className="bg-white rounded-xl px-2 py-1.5 mt-2">
          <p className="text-[11px] text-[#111] leading-[130%]">{item.name}</p>
        </div>
        {/* Size/variation selector — shown when item is selected and has_size */}
        {/* {item.isSelected && item.hasSize && item.variations.length > 0 && (
          <div className="mt-1.5">
            <select
              value={item.selectedVariationId || ""}
              onChange={(e) => onSelectVariation(item.id, Number(e.target.value))}
              className="w-full text-[11px] text-black rounded-lg border border-[#d9d9d9] px-1.5 py-1 bg-white outline-none cursor-pointer"
            >
              <option value="">Size</option>
              {item.variations.map((v) => (
                <option key={v.id} value={v.id}>{v.name}</option>
              ))}
            </select>
          </div>
        )} */}
      </div>
    ))}
  </div>
);

// ─── Measurement Field (value + optional unit) ────────────────────────────────

const MeasurementField = ({ label, value, onChange, options, units }) => {
  const unitValue = units?.length === 1 ? units[0] : (value.unitId ? units?.find((u) => u.id === value.unitId) : null);

  return (
    <div className="flex gap-1">
      <div className="flex-1">
        <CustomDropdown
          label={label}
          value={value.value}
          onChange={(v) => onChange({ ...value, value: v })}
          options={options}
        />
      </div>
      {units && units.length > 1 && (
        <div className="w-20">
          <CustomDropdown
            label="Unit"
            value={unitValue || ""}
            onChange={(v) => onChange({ ...value, unitId: v.id })}
            options={units}
          />
        </div>
      )}
      {units && units.length === 1 && (
        <div className="flex items-center px-2 text-[13px] text-[#999] border border-[#d9d9d9] rounded-[10px] bg-white whitespace-nowrap flex-shrink-0">
          {units[0].title}
        </div>
      )}
    </div>
  );
};

// ─── Participant Block ────────────────────────────────────────────────────────
// `shared` = the participant's common data (name, dob, height, weight…), same object
//            reused across all activities.
// `activityData` = this activity's own equipment + certification for this participant.

const ParticipantBlock = ({
  shared,
  pNum,
  activityId,
  onChangeShared,
  activityData,
  onToggleEquip,
  onSelectVariation,
  onChangeCert,
  requiresCert,
  measurements,
}) => {
  const [isExpanded, setIsExpanded] = useState(pNum === 1);
  const [equipExpanded, setEquipExpanded] = useState(true);

  const heightUnits = measurements?.height || [];
  const weightUnits = measurements?.weight || [];
  const shoeSizeUnits = measurements?.shoe_size || [];

  const heightOptions = ["150", "155", "160", "165", "170", "175", "180", "185", "190", "195", "200"];
  const weightOptions = ["40", "50", "60", "70", "80", "90", "100", "110", "120"];
  const shoeOptions = ["36", "37", "38", "39", "40", "41", "42", "43", "44", "45", "46"];

  return (
    <div className="border border-[#e4e4e4] rounded-2xl bg-white overflow-hidden">
      {/* Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-[#fafafa] transition-colors"
      >
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-[#e84814] flex items-center justify-center text-white text-[12px] font-bold flex-shrink-0">
            {pNum}
          </div>
          <span className="text-[14px] font-semibold text-[#111]">Participant {pNum}</span>
        </div>
        <ChevronDown className={`text-[#666] transition-transform duration-200 ${isExpanded ? "rotate-180" : ""}`} />
      </button>

      {isExpanded && (
        <div className="px-4 pb-4 flex flex-col gap-2 border-t border-[#f0f0f0]">
          {/* Row 1 — shared across all activities */}
          <div className="grid grid-cols-3 gap-2 mt-3">
            <PlaceholderInput
              placeholder="First Name *"
              value={shared.firstName}
              onChange={(v) => onChangeShared(shared.id, "firstName", v)}
              extraBorder
            />
            <PlaceholderInput
              placeholder="Last Name *"
              value={shared.lastName}
              onChange={(v) => onChangeShared(shared.id, "lastName", v)}
            />
            <DatePickerField
              value={shared.dateOfBirth}
              onChange={(v) => onChangeShared(shared.id, "dateOfBirth", v)}
              placeholder="Date of Birth"
              allowPast={true}
            />
          </div>
          {/* Row 2 — shared */}
          <div className="grid grid-cols-3 gap-2">
            <CustomDropdown
              label="Select Gender *"
              value={shared.gender}
              onChange={(v) => onChangeShared(shared.id, "gender", v)}
              options={["Male", "Female", "Other"]}
            />
            <PlaceholderInput
              placeholder="Phone Number *"
              value={shared.phone}
              onChange={(v) => onChangeShared(shared.id, "phone", v)}
              type="tel"
            />
            <PlaceholderInput
              placeholder="E-mail *"
              value={shared.email}
              onChange={(v) => onChangeShared(shared.id, "email", v)}
              type="email"
            />
          </div>
          {/* Row 3 — measurements with API units (shared) */}
          <div className="grid grid-cols-3 gap-2">
            <MeasurementField
              label="Height *"
              value={shared.height}
              onChange={(v) => onChangeShared(shared.id, "height", v)}
              options={heightOptions}
              units={heightUnits}
            />
            <MeasurementField
              label="Weight *"
              value={shared.weight}
              onChange={(v) => onChangeShared(shared.id, "weight", v)}
              options={weightOptions}
              units={weightUnits}
            />
            <MeasurementField
              label="Shoe Size *"
              value={shared.shoeSize}
              onChange={(v) => onChangeShared(shared.id, "shoeSize", v)}
              options={shoeOptions}
              units={shoeSizeUnits}
            />
          </div>

          <p className="text-[12px] text-[#111] opacity-70 leading-[160%] mt-1">
            The following equipment will be included in your course: 7mm wetsuit including hood and boots, mask, snorkel, fins, weights, buoyancy compensator, regulator and any other specific equipment necessary unless otherwise noted in the INCLUDED section of the course.
          </p>

          {/* Equipment — specific to this activity */}
          {activityData.equipment.length > 0 && (
            <>
              <button
                onClick={() => setEquipExpanded(!equipExpanded)}
                className="flex items-center justify-between cursor-pointer mt-1"
              >
                <span className="text-[13px] font-bold text-[#111]">
                  Additional Equipment for Participant <span className="text-[#e84814]">{pNum}</span>
                </span>
                <ChevronDown className={`text-[#666] transition-transform ${equipExpanded ? "rotate-180" : ""}`} />
              </button>

              {equipExpanded && (
                <EquipmentGrid
                  equipment={activityData.equipment}
                  onToggle={(eid) => onToggleEquip(activityId, shared.id, eid)}
                  onSelectVariation={(eid, vid) => onSelectVariation(activityId, shared.id, eid, vid)}
                />
              )}
            </>
          )}

          {/* Dive Certification — specific to this activity */}
          {requiresCert && (
            <div className="border border-[#e84814] rounded-2xl p-3 mt-2 bg-[#fff8f6]">
              <div className="flex items-center gap-2 mb-3">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <circle cx="10" cy="10" r="9" stroke="#E84814" strokeWidth="1.5" />
                  <path d="M10 6v5M10 13.5h.01" stroke="#E84814" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
                <span className="text-[13px] font-semibold text-[#e84814]">Dive Certification — required for this activity</span>
              </div>
              <div className="grid grid-cols-2 gap-2 mb-2">
                <CustomDropdown
                  label="Certification Agency *"
                  value={activityData.certAgency || ""}
                  onChange={(v) => onChangeCert(activityId, shared.id, "certAgency", v)}
                  options={["PADI", "SSI", "NAUI", "CMAS", "SDI", "TDI"]}
                />
                <PlaceholderInput
                  placeholder="Certification Level *"
                  value={activityData.certLevel || ""}
                  onChange={(v) => onChangeCert(activityId, shared.id, "certLevel", v)}
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <PlaceholderInput
                  placeholder="Total Dives *"
                  value={activityData.totalDives || ""}
                  onChange={(v) => onChangeCert(activityId, shared.id, "totalDives", v)}
                  type="number"
                />
                <DatePickerField
                  value={activityData.lastDiveDate || ""}
                  onChange={(v) => onChangeCert(activityId, shared.id, "lastDiveDate", v)}
                  placeholder="Last Dive Date"
                  allowPast={true}
                />
              </div>
              <div
                className="flex items-center gap-2 mt-3"
                style={{ border: "1px solid #a0c52e", borderRadius: 10, padding: "5px 10px", height: 38, background: "#fff" }}
              >
                <AlertIcon />
                <span style={{ fontWeight: 600, fontSize: 15, lineHeight: "160%", color: "#000" }}>
                  Dive certification is required for this activity
                </span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// ─── Activity Card ────────────────────────────────────────────────────────────

const ActivityCard = ({
  activity,
  sharedParticipants,
  onRemove,
  onChangeShared,
  onToggleEquip,
  onSelectVariation,
  onChangeCert,
  measurements,
}) => (
  <div className="bg-white rounded-2xl border border-[#e4e4e4] overflow-hidden mb-4">
    <div className="p-4">
      <div className="flex items-start gap-3">
        <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 bg-[#f1f1f1]">
          {activity.image ? (
            <img src={activity.image} alt={activity.title} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-[#2c2c2c] to-[#1a1a1a]" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span
                  className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${activity.apiType === "course" ? "bg-[#e84814] text-white" : "bg-[#1a3a5c] text-white"}`}
                >
                  {activity.type}
                </span>
                {!activity.available && (
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-[#f5f5f5] text-[#999]">Unavailable</span>
                )}
              </div>
              <h3 className="text-[14px] font-semibold text-[#111] leading-[140%]">{activity.title}</h3>
              {activity.subtitle && (
                <div className="flex items-center gap-1 mt-1">
                  <LocationIcon />
                  <span className="text-[12px] text-[#666]">{activity.subtitle}</span>
                </div>
              )}
            </div>
            <button
              onClick={() => onRemove(activity.id)}
              className="w-8 h-8 flex items-center justify-center rounded-lg border border-[#e4e4e4] hover:bg-[#f5f5f5] cursor-pointer flex-shrink-0 transition-colors"
            >
              <XIcon />
            </button>
          </div>
          <div className="flex items-center gap-2 mt-2">
            <span className="text-[20px] font-bold text-[#111]">{activity.currency}{activity.price}</span>
            <span className="text-[13px] text-[#999]">/ person</span>
          </div>
        </div>
      </div>
    </div>

    {/* Participants forms — shared identity, activity-specific equipment/cert */}
    <div className="px-4 pb-4 flex flex-col gap-3">
      {sharedParticipants.map((sp, idx) => (
        <ParticipantBlock
          key={sp.id}
          shared={sp}
          pNum={idx + 1}
          activityId={activity.id}
          onChangeShared={onChangeShared}
          activityData={activity.byParticipant[sp.id] || createActivityParticipantData(activity.equipmentTemplate)}
          onToggleEquip={onToggleEquip}
          onSelectVariation={onSelectVariation}
          onChangeCert={onChangeCert}
          requiresCert={activity.requiresCert}
          measurements={measurements}
        />
      ))}
    </div>
  </div>
);

// ─── Order Summary ────────────────────────────────────────────────────────────

const OrderSummary = ({
  activities,
  sharedParticipants,
  privacy,
  setPrivacy,
  terms,
  setTerms,
  comment,
  setComment,
  onSubmit,
  isSubmitting,
  submitError,
  submitSuccess,
}) => {
  const grandTotal = activities.reduce((total, act) => {
    const courseTotal = sharedParticipants.length * act.price;
    const equipTotal = Object.values(act.byParticipant)
      .flatMap((d) => d.equipment.filter((e) => e.isSelected))
      .reduce((s, e) => s + e.price, 0);
    return total + courseTotal + equipTotal;
  }, 0);

  return (
    <div className="bg-white rounded-2xl border border-[#e4e4e4] p-4 sticky top-4">
      <h2 className="text-[20px] font-semibold text-[#111] mb-3">Order Summary</h2>

      {activities.map((act) => {
        const courseTotal = sharedParticipants.length * act.price;
        const selectedEquipByP = sharedParticipants.map((sp) => ({
          name: sp.firstName || "Participant",
          items: (act.byParticipant[sp.id]?.equipment || []).filter((e) => e.isSelected),
        }));

        return (
          <div key={act.id} className="mb-4">
            <div className="flex items-start justify-between gap-2 mb-2">
              <p className="text-[13px] text-[#111] leading-[140%] flex-1">{act.title}</p>
              <span className="text-[16px] font-bold text-[#111] flex-shrink-0">{act.currency}{act.price}</span>
            </div>
            <div className="bg-[#f5f5f5] rounded-2xl px-3 py-2 flex flex-col gap-1">
              <div className="flex justify-between text-[13px] text-[#444]">
                <span>{sharedParticipants.length} Adults × {act.currency} {act.price}</span>
                <span>{act.currency} {courseTotal.toFixed(2)}</span>
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
                        <span>{item.currency} {item.price}</span>
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
        <span>€ {grandTotal.toLocaleString("en", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
      </div>

      {/* Additional Information */}
      <div className="mb-4">
        <p className="text-[13px] font-medium text-[#111] mb-2">Additional Information</p>
        <textarea
          className="w-full h-16 px-3 py-2 rounded-[10px] border border-[#d9d9d9] text-[14px] placeholder:text-[#999] resize-none outline-none focus:border-[#e84814] transition-colors"
          placeholder="Comment"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
      </div>

      <div className="flex flex-col gap-2 mb-4">
        <CheckboxRow checked={privacy} onChange={setPrivacy} label="Política de privacidade da Haliotis" />
        <CheckboxRow checked={terms} onChange={setTerms} label="Termos e Condições" />
      </div>

      {submitError && (
        <div className="mb-3 px-3 py-2 rounded-[10px] bg-[#fff0ed] border border-[#e84814] text-[13px] text-[#e84814]">
          {submitError}
        </div>
      )}
      {submitSuccess && (
        <div className="mb-3 px-3 py-2 rounded-[10px] bg-[#f0fff4] border border-[#4caf50] text-[13px] text-[#2e7d32]">
          Booking submitted successfully!
        </div>
      )}

      <button
        onClick={onSubmit}
        disabled={isSubmitting || !privacy || !terms}
        className={`w-full py-3 rounded-full text-white text-[15px] font-semibold transition-colors flex items-center justify-center gap-2
          ${isSubmitting || !privacy || !terms ? "bg-[#ccc] cursor-not-allowed" : "bg-[#e84814] hover:bg-[#d63f0f] cursor-pointer"}`}
      >
        {isSubmitting ? "Sending…" : "Proceed to Payment →"}
      </button>

      <div className="flex items-center justify-center gap-1.5 mt-2">
        <ShieldIcon />
        <span className="text-[11px] text-[#999]">Secure checkout · SSL encrypted</span>
      </div>
    </div>
  );
};

// ─── Build booking payload ────────────────────────────────────────────────────

const buildBookingPayload = (activities, sharedParticipants, comment) => ({
  comment,
  items: activities.map((act) => ({
    type: act.apiType,
    id: act.id,
    slug: act.slug,
      ...(act.apiType === "course" && act.centerSlug ? { center_slug: act.centerSlug } : {}),

    participants: sharedParticipants.map((sp) => {
      const ad = act.byParticipant[sp.id] || createActivityParticipantData();
      return {
        first_name: sp.firstName,
        last_name: sp.lastName,
        date_of_birth: sp.dateOfBirth,
        gender: sp.gender,
        phone: sp.phone,
        email: sp.email,
        measurements: {
          height: { value: sp.height.value, unit_id: sp.height.unitId },
          weight: { value: sp.weight.value, unit_id: sp.weight.unitId },
          shoe_size: { value: sp.shoeSize.value, unit_id: sp.shoeSize.unitId },
        },
        certification: act.requiresCert
          ? {
              agency: ad.certAgency,
              level: ad.certLevel,
              total_dives: ad.totalDives,
              last_dive_date: ad.lastDiveDate,
            }
          : null,
        equipment_rent: ad.equipment
          .filter((e) => e.isSelected)
          .map((e) => ({
            id: e.id,
            // variation_id: e.selectedVariationId,
          })),
      };
    }),
  })),
});

// ─── MAIN CART PAGE ───────────────────────────────────────────────────────────

export default function CartPage() {
  const [activities, setActivities] = useState([]);
  const [measurements, setMeasurements] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);

  // Shared participants — ONE set of personal data, reused for every activity.
  const [participantCount, setParticipantCount] = useState(1);
  const [sharedParticipants, setSharedParticipants] = useState([createSharedParticipant(1)]);

  const [privacy, setPrivacy] = useState(false);
  const [terms, setTerms] = useState(false);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Load cart on mount — real API only, no mocks.
  useEffect(() => {
    const storageItems = readCartFromStorage();

    if (storageItems.length === 0) {
      setIsLoading(false);
      return;
    }

    const apiItems = storageItems.map(({ type, id }) => ({ type, id }));
console.log(apiItems, 'apiItems');

    resolveCart(apiItems)
      .then((data) => {
        setMeasurements(data.participant_measurements || null);
        const initialIds = [1]; // initial single participant
        const mapped = (data.items || []).map((apiItem) => {
          const storageItem = storageItems.find((s) => s.type === apiItem.type && s.id === apiItem.id);
          return mapResolvedItem(apiItem, storageItem, initialIds);
        });
        setActivities(mapped);
      })
      .catch((err) => setLoadError(err.message))
      .finally(() => setIsLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const removeActivity = (id) => setActivities((prev) => prev.filter((a) => a.id !== id));

  // Changing participant count adds/removes shared participants AND
  // extends/trims each activity's per-participant equipment+cert map.
  const handleCountChange = (n) => {
    const c = Math.max(1, Math.min(10, n));
    setParticipantCount(c);

    setSharedParticipants((prev) => {
      if (c > prev.length) {
        return [
          ...prev,
          ...Array.from({ length: c - prev.length }, (_, i) =>
            createSharedParticipant(prev.length + i + 1)
          ),
        ];
      }
      return prev.slice(0, c);
    });

    setActivities((prev) =>
      prev.map((a) => {
        const ids = Object.keys(a.byParticipant).map(Number);
        const nextByParticipant = { ...a.byParticipant };
        if (c > ids.length) {
          for (let i = ids.length + 1; i <= c; i++) {
            nextByParticipant[i] = createActivityParticipantData(a.equipmentTemplate);
          }
        } else {
          Object.keys(nextByParticipant).forEach((key) => {
            if (Number(key) > c) delete nextByParticipant[key];
          });
        }
        return { ...a, byParticipant: nextByParticipant };
      })
    );
  };

  // Shared participant field change — applies once, visible in every activity.
  const updateShared = (pid, field, val) =>
    setSharedParticipants((prev) =>
      prev.map((p) => (p.id === pid ? { ...p, [field]: val } : p))
    );

  // Equipment toggle — scoped to one activity + one participant only.
  const toggleEquip = (actId, pid, eid) =>
    setActivities((prev) =>
      prev.map((a) =>
        a.id === actId
          ? {
              ...a,
              byParticipant: {
                ...a.byParticipant,
                [pid]: {
                  ...a.byParticipant[pid],
                  equipment: a.byParticipant[pid].equipment.map((e) =>
                    e.id === eid ? { ...e, isSelected: !e.isSelected } : e
                  ),
                },
              },
            }
          : a
      )
    );

  // Variation select — scoped to one activity + one participant + one equipment item.
  const selectVariation = (actId, pid, eid, vid) =>
    setActivities((prev) =>
      prev.map((a) =>
        a.id === actId
          ? {
              ...a,
              byParticipant: {
                ...a.byParticipant,
                [pid]: {
                  ...a.byParticipant[pid],
                  equipment: a.byParticipant[pid].equipment.map((e) =>
                    e.id === eid ? { ...e, selectedVariationId: vid } : e
                  ),
                },
              },
            }
          : a
      )
    );

  // Certification field change — scoped to one activity + one participant only.
  const updateCert = (actId, pid, field, val) =>
    setActivities((prev) =>
      prev.map((a) =>
        a.id === actId
          ? {
              ...a,
              byParticipant: {
                ...a.byParticipant,
                [pid]: { ...a.byParticipant[pid], [field]: val },
              },
            }
          : a
      )
    );

  const handleSubmit = async () => {
    setSubmitError(null);
    setSubmitSuccess(false);
    setIsSubmitting(true);
    try {
      const payload = buildBookingPayload(activities, sharedParticipants, comment);
      await submitBooking(payload);
      setSubmitSuccess(true);
    } catch (err) {
      setSubmitError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#f5f5f5] flex items-center justify-center">
        <p className="text-[15px] text-[#999]">Loading your cart…</p>
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="min-h-screen bg-[#f5f5f5] flex items-center justify-center">
        <p className="text-[15px] text-[#e84814]">Could not load cart: {loadError}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f5f5f5]" style={{ fontFamily: "Inter, sans-serif" }}>
      <div className="max-w-[1200px] mx-auto px-4 py-8">
        <h1 className="text-[32px] font-bold text-[#111] mb-1">Your Cart</h1>
        <p className="text-[14px] text-[#111] mb-4">
          Review your selections and complete booking details for each participant.
        </p>
        <p className="text-[13px] text-[#666] mb-6">
          {activities.length} activities · {participantCount} participants
        </p>

        <div className="flex flex-col lg:flex-row gap-6 items-start">
          {/* Left: participants counter + activity cards */}
          <div className="flex-1 min-w-0">

            {/* Global participants counter — above all cards */}
            <div className="bg-white rounded-2xl border border-[#e4e4e4] p-4 mb-4 flex items-center gap-4">
              <div className="flex items-center gap-2">
                <PersonIcon />
                <span className="text-[15px] font-semibold text-[#111]">
                  Participants <span className="text-[#e84814]">*</span>
                </span>
              </div>
              <ParticipantsCounter value={participantCount} onChange={handleCountChange} />
              <span className="text-[13px] text-[#999] ml-2">
                Personal details are shared across all activities below
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
                  sharedParticipants={sharedParticipants}
                  onRemove={removeActivity}
                  onChangeShared={updateShared}
                  onToggleEquip={toggleEquip}
                  onSelectVariation={selectVariation}
                  onChangeCert={updateCert}
                  measurements={measurements}
                />
              ))
            )}
          </div>

          {/* Right: order summary */}
          <div className="w-full lg:w-[360px] flex-shrink-0">
            <OrderSummary
              activities={activities}
              sharedParticipants={sharedParticipants}
              privacy={privacy}
              setPrivacy={setPrivacy}
              terms={terms}
              setTerms={setTerms}
              comment={comment}
              setComment={setComment}
              onSubmit={handleSubmit}
              isSubmitting={isSubmitting}
              submitError={submitError}
              submitSuccess={submitSuccess}
            />
          </div>
        </div>
      </div>
    </div>
  );
}