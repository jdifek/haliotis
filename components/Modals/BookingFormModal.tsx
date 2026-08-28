"use client";

import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import BookingPhoneField from "../booking/BookingPhoneField";
import { loadSibsWidgetScript } from "@/lib/payment";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";
import ReCAPTCHA from "react-google-recaptcha";
import { useLocale } from "next-intl";
// ─────────────────────────────────────────────────────────────────────────────
// LABELS — все строки собраны в одном месте. Язык — EN (как и было), структура
// готова под замену PT-переводами с бэка: Object.assign(LABELS, ptDict) перед
// первым рендером.
// ─────────────────────────────────────────────────────────────────────────────
const LABELS = {
  bookingForm: "Booking Form",
  selectDateAndTravelers: "Select date and travelers",
  chooseLocation: "Choose location",
  selectLocation: "Select location",
  chooseCenter: "Choose Diving Center",
  selectCenter: "Select center",
  chooseDate: "Choose Date",
  selectDate: "Select date",
  participantsLabel: "Participants",
  additionalInformation: "Additional Information",
  comment: "Comment",
  acceptPrivacyLabel: "Política de privacidade da Haliotis",
  acceptTermsLabel: "Termos e Condições",
  privacyUrl: "/privacy-policy",
  termsUrl: "/terms-and-conditions",
  participant: "Participant",
  firstName: "First Name *",
  lastName: "Last Name *",
  dateOfBirth: "Date of Birth",
  selectGender: "Select Gender *",
  phoneNumber: "Phone Number *",
  email: "E-mail *",
  height: "Height *",
  weight: "Weight *",
  shoeSize: "Shoe Size *",
  equipmentNote:
    "The following equipment will be included in your course: 7mm wetsuit including hood and boots, mask, snorkel, fins, weights, buoyancy compensator, regulator and any other specific equipment necessary unless otherwise noted in the INCLUDED section of the course.",
  additionalEquipmentFor: "Additional Equipment for Participant",
  reservationDetails: "Reservation Details",
  totalPrice: "Total price",
  bookNow: "Book Now",
  sending: "Sending…",
  loadingCourse: "Loading course details…",
  loadError: "Could not load booking details",
  certTitle: "Dive Certification — required for this activity",
  certAgency: "Certification Agency *",
  certLevel: "Certification Level *",
  totalDives: "Total Dives *",
  lastDiveDate: "Last Dive Date",
  certRequiredNote: "Dive certification is required for this activity",
  unavailableDaysLegend: "Unavailable",
  todayLegend: "Today",
  selectedLegend: "Selected",
  submitError: "Something went wrong while submitting your booking.",
  submitSuccess: "Booking submitted successfully!",
  requiredFieldsNote:
    "Please fill in all required fields for every participant",
    certAgencyOtherPlaceholder: "Certification Agency Name *",
};

// ─────────────────────────────────────────────────────────────────────────────
// API
// POST /cart/resolve  { items: [{ type, id }] } →
// {
//   items: [{ id, type, name, slug, image, price:{amount,currency},
//              location: [{id,name,slug}], equipment_rent: [...],
//              requires_certification, available, unavailable_reason }],
//   participant_measurements: { height:[{id,title}], weight:[...], shoe_size:[...] },
//   genders: { male: "Male", female: "Female", other: "Other" }
// }
// POST /bookings { ...payload } → бронирование
// ─────────────────────────────────────────────────────────────────────────────

const API_BASE = process.env.NEXT_PUBLIC_API_URL;

async function resolveItem(type: string, id: number) {
  const res = await fetch(`${API_BASE}/cart/resolve`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({ items: [{ type, id }] }),
  });
  if (!res.ok) throw new Error(`resolve failed: ${res.status}`);
  return res.json();
}


async function submitBookingRequest(payload: any) {
  const res = await fetch(`${API_BASE}/bookings`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    let detail = LABELS.submitError;
    try {
      const body = await res.json();
      if (body?.message) detail = body.message;
      else if (body?.errors)
        detail = Object.values(body.errors).flat().join("; ");
    } catch {}
    throw new Error(detail);
  }
  return res.json();
}

// ─── Types ────────────────────────────────────────────────────────────────────

type MeasurementValue = { value: string; unitId: number | null };
type MeasurementUnit = { id: number; title: string };
type GenderOption = { key: string; label: string };
type CenterOption = { slug: string; name: string };
type AgencyOption = { id: string; title: string };
type EquipmentItem = {
  id: number;
  name: string;
  image?: string | null;
  price: number;
  currency: string;
  isSelected: boolean;
};

type Participant = {
  id: number;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: string; // хранится КЛЮЧ (male/female/other), не лейбл
  phone: string;
  email: string;
  height: MeasurementValue;
  weight: MeasurementValue;
  shoeSize: MeasurementValue;
  equipment: EquipmentItem[];
  certAgency: string;
  certAgencyOther: string;
  certLevel: string;
  totalDives: string;
  lastDiveDate: string;
  isExpanded: boolean;
  isEquipmentExpanded: boolean;
};

// ─────────────────────────────────────────────────────────────────────────────
// Props — ПОЛНЫЙ список того, что нужно передавать в каждом месте вызова
// модалки (пункт 3 из вопроса):
//
//   ОБЯЗАТЕЛЬНО:
//     itemId          — id курса/трипа с бэка (без него нечего резолвить)
//
//   ЖЕЛАТЕЛЬНО (для мгновенного отображения ДО ответа API):
//     courseTitle     — фолбэк-заголовок, подменяется реальным после resolve
//     pricePerPerson  — фолбэк-цена, подменяется реальной после resolve
//
//   ОПЦИОНАЛЬНО:
//     itemType          — "course" | "trip" | "travels", по умолчанию "course"
//     initialCenterSlug — какой центр выбрать по умолчанию в дропдауне (например
//                         slug текущей центр-страницы, откуда открыли карточку).
//                         Список центров всё равно приходит с бэка (apiItem.location),
//                         это только дефолтный выбор.
//     unavailableDates  — массив "YYYY-MM-DD", если есть список занятых дат
//
//   ВСЁ ОСТАЛЬНОЕ (эквипмент, единицы измерения, гендеры, центры, требуется ли
//   сертификация) модалка получает сама через /cart/resolve по itemId — руками
//   прокидывать не нужно.
// ─────────────────────────────────────────────────────────────────────────────

type Props = {
  isOpen: boolean;
  onClose: () => void;
  itemType?: "course" | "trip" | "travels";
  itemId: number;
  courseTitle?: string;
  pricePerPerson?: number;
  initialCenterSlug?: string;
  unavailableDates?: string[];
};

const createParticipant = (id: number): Participant => ({
  id,
  firstName: "",
  lastName: "",
  dateOfBirth: "",
  gender: "",
  phone: "",
  email: "",
  height: { value: "", unitId: null },
  weight: { value: "", unitId: null },
  shoeSize: { value: "", unitId: null },
  equipment: [],
  certAgency: "",
  certAgencyOther: "",
  certLevel: "",
  totalDives: "",
  lastDiveDate: "",
  isExpanded: id === 1,
  isEquipmentExpanded: id === 1,
});

const isParticipantValid = (p: Participant) =>
  !!(
    p.firstName.trim() &&
    p.lastName.trim() &&
    p.dateOfBirth &&
    p.gender &&
    p.phone.trim() &&
    p.email.trim() &&
    p.height.value &&
    p.weight.value &&
    p.shoeSize.value
  );

  const isCertValid = (p: Participant) =>
    !!(
      p.certAgency &&
      (p.certAgency !== "other" || p.certAgencyOther.trim()) &&
      p.certLevel &&
      p.totalDives &&
      p.lastDiveDate
    );
// ─── Portal ───────────────────────────────────────────────────────────────────

const Portal = ({ children }: { children: React.ReactNode }) => {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;
  return createPortal(children, document.body);
};

// z-index выше, чем у самой модалки (модалка использует z-[10000000]),
// иначе дропдауны/календарь в портале рендерятся ПОД оверлеем модалки.
const PORTAL_Z = 100000001;

// ─── Icons ────────────────────────────────────────────────────────────────────

const ChevronDown = ({ className = "" }: { className?: string }) => (
  <svg
    width="11"
    height="7"
    viewBox="0 0 11 7"
    fill="currentColor"
    className={className}
  >
    <path d="M5.5 7L0.9375 1.625C0.71875 1.375 0.90625 1 1.21875 1H9.75C10.0625 1 10.25 1.375 10.0312 1.625L5.5 7Z" />
  </svg>
);

const PersonIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g clipPath="url(#clip0_1_15854)">
      <path
        d="M8.33333 0C6.04497 0 4.16667 1.87857 4.16667 4.16582C4.16667 5.39983 4.71407 6.51428 5.57695 7.27956C2.31926 8.48567 0 11.7629 0 15.5559C2.09555e-05 15.8505 0.117127 16.133 0.325561 16.3413C0.533994 16.5496 0.816686 16.6666 1.11146 16.6667H6.45794C6.67648 15.8594 7.02643 15.1083 7.48769 14.4451H2.31087C2.80243 11.3247 5.32943 9.00599 8.33333 9.00599C8.74965 9.00599 9.15628 9.05201 9.55013 9.13704C9.68538 7.77978 10.6477 6.65423 11.9209 6.27331C12.2882 5.65376 12.5 4.93294 12.5 4.16582C12.5 1.87857 10.6217 0 8.33333 0ZM8.33333 2.22155C9.41967 2.22155 10.2771 3.07849 10.2771 4.16582C10.2771 5.25315 9.41967 6.11022 8.33333 6.11022C7.247 6.11022 6.38952 5.25315 6.38952 4.16582C6.38952 3.07849 7.247 2.22155 8.33333 2.22155Z"
        fill="#E84814"
      />
      <path
        d="M13.3327 6.66675C11.502 6.66675 9.99935 8.16963 9.99935 9.99943C9.99935 10.9866 10.4373 11.8782 11.1276 12.4904C8.5214 13.4553 6.66602 16.0771 6.66602 19.1115C6.66604 19.3471 6.75972 19.5731 6.92646 19.7398C7.09321 19.9064 7.31935 20.0001 7.55516 20.0001H13.3327H19.1102C19.346 20.0001 19.5721 19.9064 19.7389 19.7398C19.9056 19.5731 19.9993 19.3471 19.9993 19.1115C19.9993 16.0771 18.144 13.4553 15.5378 12.4904C16.2282 11.8782 16.666 10.9866 16.666 9.99943C16.666 8.16963 15.1634 6.66675 13.3327 6.66675ZM13.3327 8.44401C14.2018 8.44401 14.8877 9.12957 14.8877 9.99943C14.8877 10.8693 14.2018 11.5549 13.3327 11.5549C12.4636 11.5549 11.7776 10.8693 11.7776 9.99943C11.7776 9.12957 12.4636 8.44401 13.3327 8.44401ZM13.3327 13.8715C15.7358 13.8715 17.7574 15.7265 18.1507 18.2228H13.3327H8.51471C8.90796 15.7265 10.9296 13.8715 13.3327 13.8715Z"
        fill="#E84814"
      />
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

const CalendarFieldIcon = ({ active }: { active?: boolean }) => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M15.9624 11.293C16.8861 10.3501 18.3835 10.3501 19.3072 11.293C20.2309 12.2358 20.2309 13.7642 19.3072 14.707L15.2341 18.8645C15.1332 18.9675 15.0021 19.1066 14.8434 19.2195C14.7175 19.3091 14.5813 19.383 14.4381 19.4402C14.2583 19.5122 14.0727 19.5468 13.9326 19.5754L11.9487 19.9805C11.6275 20.046 11.2955 19.9435 11.0639 19.707C10.8322 19.4706 10.7317 19.1318 10.796 18.8039L11.1928 16.7789C11.2209 16.6358 11.2543 16.4461 11.3249 16.2625C11.3809 16.1164 11.4537 15.9777 11.5415 15.8492L11.6283 15.7332C11.718 15.6223 11.8136 15.5277 11.8893 15.4504L15.9624 11.293ZM17.9219 12.707C17.7634 12.5453 17.5063 12.5453 17.3478 12.707L13.2747 16.8645C13.2078 16.9328 13.175 16.9665 13.1519 16.9918C13.1418 17.0301 13.1325 17.0767 13.114 17.1711L13.0053 17.725L13.5484 17.6145C13.6408 17.5956 13.6865 17.5861 13.7194 17.5781C13.7488 17.5522 13.7818 17.5187 13.8488 17.4504L17.9219 13.293C18.0803 13.1312 18.0803 12.8688 17.9219 12.707ZM7.8377 14C8.37874 14 8.81736 14.4478 8.81741 15C8.8174 15.5523 8.37877 16 7.8377 16H4.89856C4.35749 16 3.91885 15.5523 3.91885 15C3.91887 14.4477 4.3575 14 4.89856 14H7.8377ZM11.2667 10C11.8077 10 12.2464 10.4478 12.2464 11C12.2464 11.5523 11.8078 12 11.2667 12H4.89856C4.35749 12 3.91885 11.5523 3.91885 11C3.91886 10.4477 4.35749 10 4.89856 10H11.2667ZM17.6348 8H1.95943V15.8C1.95943 16.3764 1.9601 16.7487 1.98277 17.032C2.00451 17.3036 2.04153 17.4045 2.0662 17.4539L2.10409 17.523C2.18475 17.6572 2.29532 17.7701 2.4267 17.8523L2.49444 17.891L2.5419 17.9117C2.60254 17.934 2.70806 17.9595 2.90776 17.9762C3.18533 17.9993 3.55003 18 4.11479 18H7.8377C8.37878 18 8.81741 18.4477 8.81741 19C8.81741 19.5523 8.37878 20 7.8377 20H4.11479C3.58233 20 3.12404 20.0009 2.74817 19.9695C2.36084 19.9372 1.97537 19.8659 1.60466 19.673C1.05169 19.3854 0.602024 18.9264 0.320322 18.3621C0.131423 17.9837 0.0614981 17.5903 0.029853 17.1949C-0.000847982 16.8113 2.35339e-06 16.3435 2.35411e-06 15.8V6.2C2.35411e-06 5.6565 -0.000849448 5.18873 0.029853 4.80508C0.061499 4.40973 0.131434 4.01627 0.320322 3.63789C0.602088 3.07348 1.0517 2.61455 1.60466 2.32695C1.97537 2.13415 2.36085 2.06277 2.74817 2.03047C3.07712 2.00304 3.46918 2.00106 3.91885 2.00078V1C3.91885 0.447715 4.35748 0 4.89856 0C5.43964 0 5.87828 0.447715 5.87828 1V2H13.716V1C13.716 0.447715 14.1546 0 14.6957 0C15.2368 0 15.6754 0.447715 15.6754 1V2.00078C16.1251 2.00106 16.5171 2.00304 16.8461 2.03047C17.2334 2.06277 17.6189 2.13414 17.9896 2.32695C18.5424 2.61449 18.9918 3.07346 19.2736 3.63789C19.4624 4.01628 19.5328 4.40973 19.5644 4.80508C19.5951 5.18873 19.5943 5.65651 19.5943 6.2V8C19.5943 8.55228 19.1556 9 18.6145 9C18.0735 9 17.6348 8.55228 17.6348 8ZM4.11479 4C3.55003 4 3.18533 4.00069 2.90776 4.02383C2.64172 4.04601 2.5429 4.08379 2.49444 4.10898C2.31011 4.20485 2.16012 4.35794 2.0662 4.54609C2.04152 4.59555 2.00451 4.69642 1.98277 4.96797C1.96284 5.21709 1.96063 5.53498 1.96019 6H17.6341C17.6336 5.53498 17.6314 5.21709 17.6115 4.96797C17.5897 4.6964 17.5527 4.59555 17.5281 4.54609C17.446 4.3816 17.321 4.24374 17.1676 4.14766L17.0998 4.10898C17.0514 4.08381 16.9526 4.04602 16.6865 4.02383C16.4089 4.00069 16.0442 4 15.4795 4H4.11479Z"
      fill={active ? "white" : "#E84814"}
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
  <svg
    width="44"
    height="44"
    viewBox="0 0 44 44"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect width="44" height="44" rx="22" fill="white" />
    <path
      d="M12 22H32M22 12V32"
      stroke="#CFCFCF"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const CheckIconActive = () => (
  <svg
    width="44"
    height="44"
    viewBox="0 0 44 44"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect width="44" height="44" rx="22" fill="white" />
    <path
      d="M32.496 14.463C32.3505 14.3163 32.1774 14.1999 31.9866 14.1204C31.7959 14.0409 31.5913 14 31.3846 14C31.178 14 30.9733 14.0409 30.7826 14.1204C30.5918 14.1999 30.4187 14.3163 30.2732 14.463L18.6109 26.1403L13.7112 21.2252C13.5601 21.0792 13.3817 20.9645 13.1863 20.8874C12.9908 20.8104 12.7821 20.7727 12.5721 20.7763C12.362 20.7799 12.1547 20.8249 11.9621 20.9086C11.7694 20.9924 11.5951 21.1132 11.4492 21.2643C11.3032 21.4154 11.1884 21.5937 11.1114 21.7892C11.0344 21.9846 10.9966 22.1933 11.0002 22.4033C11.0039 22.6134 11.0488 22.8206 11.1326 23.0133C11.2163 23.206 11.3372 23.3802 11.4883 23.5262L17.4994 29.537C17.645 29.6837 17.8181 29.8001 18.0089 29.8796C18.1996 29.9591 18.4042 30 18.6109 30C18.8175 30 19.0221 29.9591 19.2129 29.8796C19.4037 29.8001 19.5768 29.6837 19.7223 29.537L32.496 16.764C32.6549 16.6174 32.7817 16.4395 32.8685 16.2415C32.9552 16.0435 33 15.8297 33 15.6135C33 15.3973 32.9552 15.1835 32.8685 14.9855C32.7817 14.7875 32.6549 14.6096 32.496 14.463Z"
      fill="#E84814"
    />
  </svg>
);

const CoinIcon = () => (
  <svg width="12" height="12" viewBox="0 0 20 20" fill="none">
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M0 10C0 4.47715 4.47715 0 10 0C15.5228 0 20 4.47715 20 10C20 15.5228 15.5228 20 10 20C4.47715 20 0 15.5228 0 10ZM8.6158 7.5C9.0535 6.71823 9.8025 6 10.7498 6C11.284 6 11.819 6.23239 12.2923 6.70646C12.6824 7.09734 13.3156 7.09792 13.7065 6.70775C14.0973 6.31758 14.0979 5.68442 13.7077 5.29354C12.9274 4.51179 11.9042 4 10.7498 4C9.3289 4 8.1189 4.77025 7.29826 5.86449C6.93769 6.34528 6.64329 6.89783 6.42654 7.5H6C5.44772 7.5 5 7.94772 5 8.5C5 8.9581 5.30804 9.3443 5.72828 9.4626C5.82228 9.4891 5.91867 9.5 6.01613 9.5C5.99473 9.8304 5.99473 10.1696 6.01613 10.5C5.91867 10.5 5.82228 10.5109 5.72828 10.5374C5.30804 10.6557 5 11.0419 5 11.5C5 12.0523 5.44772 12.5 6 12.5H6.42654C6.64329 13.1022 6.93769 13.6547 7.29826 14.1355C8.1189 15.2298 9.3289 16 10.7498 16C11.9042 16 12.9274 15.4882 13.7077 14.7065C14.0979 14.3156 14.0973 13.6824 13.7065 13.2923C13.3156 12.9021 12.6824 12.9027 12.2923 13.2935C11.819 13.7676 11.284 14 10.7498 14C9.8025 14 9.0535 13.2818 8.6158 12.5H10C10.5523 12.5 11 12.0523 11 11.5C11 10.9477 10.5523 10.5 10 10.5H8.0217C7.99312 10.1735 7.99312 9.8265 8.0217 9.5H11C11.5523 9.5 12 9.0523 12 8.5C12 7.94772 11.5523 7.5 11 7.5H8.6158Z"
      fill="black"
    />
  </svg>
);

const AlertIcon = () => (
  <svg
    width="28"
    height="28"
    viewBox="0 0 28 28"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect width="28" height="28" rx="14" fill="#A0C52E" />
    <path
      d="M14.0008 16.5928C13.4107 16.5928 12.9316 17.0714 12.9316 17.6614C12.9316 18.2517 13.4107 18.7303 14.0008 18.7303C14.5908 18.7303 15.0694 18.2517 15.0694 17.6614C15.0695 17.0714 14.5909 16.5928 14.0008 16.5928Z"
      fill="white"
    />
    <path
      d="M22.7573 18.3508L15.5739 5.90868C15.2504 5.34815 14.6473 5 13.9997 5C13.3526 5 12.7501 5.34819 12.4266 5.90868L5.24266 18.3503C4.91911 18.9108 4.91911 19.6072 5.24266 20.1677C5.56624 20.7282 6.16923 21.0761 6.81636 21.0761H21.1837C21.8307 21.0761 22.4338 20.7282 22.7573 20.1677C23.0809 19.6072 23.0809 18.9108 22.7573 18.3508ZM21.3288 19.2398C21.2251 19.4192 21.032 19.5304 20.8244 19.5304H7.17541C6.96827 19.5304 6.77484 19.4192 6.67165 19.2393C6.56745 19.0596 6.56692 18.8369 6.67116 18.6575L13.4958 6.83656C13.5992 6.65716 13.7923 6.54568 14.0003 6.54568C14.2077 6.54568 14.4005 6.65716 14.5043 6.83684L21.3288 18.6573C21.4326 18.8369 21.4326 19.0601 21.3288 19.2398Z"
      fill="white"
    />
    <path
      d="M14.0008 9.40625C13.4107 9.40625 12.9316 9.88483 12.9316 10.4752L13.3423 15.3087C13.3423 15.6724 13.6368 15.967 14.0008 15.967C14.3642 15.967 14.6593 15.6724 14.6593 15.3087L15.0694 10.4752C15.0695 9.8848 14.5909 9.40625 14.0008 9.40625Z"
      fill="white"
    />
  </svg>
);

const ShieldIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
    <path
      d="M12 2L3 7v5c0 5.25 3.75 10.15 9 11.35C17.25 22.15 21 17.25 21 12V7l-9-5z"
      fill="#4CAF50"
    />
    <path
      d="M9 12l2 2 4-4"
      stroke="white"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

// ─── Custom Dropdown (Portal-based) ────────────────────────────────────────────

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
  const [pos, setPos] = useState({ top: 0, left: 0, width: 0 });
  const triggerRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const open = () => {
    if (triggerRef.current) {
      const r = triggerRef.current.getBoundingClientRect();
      // position: fixed ниже — координаты берём как есть от вьюпорта, БЕЗ scrollY/scrollX,
      // иначе при заблокированном скролле body (position:fixed на body) дропдаун улетает за экран
      setPos({ top: r.bottom + 4, left: r.left, width: r.width });
    }
    setIsOpen(true);
  };

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      const target = e.target as Node;
      if (
        triggerRef.current &&
        !triggerRef.current.contains(target) &&
        dropdownRef.current &&
        !dropdownRef.current.contains(target)
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
      return (
        <>
          <span className="text-[#111]">{parts[0]}</span>
          <span className="text-[#e84814]">*</span>
        </>
      );
    }
    return <span className="text-[#111]">{label}</span>;
  };

  return (
    <div className="relative w-full" ref={triggerRef}>
      <button
        type="button"
        onClick={() => (isOpen ? setIsOpen(false) : open())}
        className={`flex items-center justify-between gap-2 ${
          icon ? "pl-8" : "pl-2"
        } pr-2 py-2 rounded-[10px] border bg-white text-[15px] w-full outline-none transition-colors cursor-pointer relative ${
          isOpen ? "border-[#e84814]" : "border-[#d9d9d9]"
        }`}
      >
        {icon && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2">
            {icon}
          </span>
        )}
        <span className="text-[#111] truncate">{value || renderLabel()}</span>
        <div className="flex items-center gap-2 flex-shrink-0">
          {unit && value && (
            <span className="text-[13px] text-[#999] border-l border-[#d9d9d9] pl-2">
              {unit}
            </span>
          )}
          <ChevronDown
            className={`text-[#d9d9d9] transition-transform ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </div>
      </button>

      {isOpen && (
        <Portal>
          <div
            ref={dropdownRef}
            style={{
              position: "fixed",
              top: pos.top,
              left: pos.left,
              minWidth: pos.width,
              width: "max-content",
              maxWidth: 260,
              zIndex: PORTAL_Z,
            }}
            className="bg-white border border-[#d9d9d9] rounded-[10px] shadow-xl max-h-48 overflow-y-auto"
          >
            {options.map((option) => (
              <button
                type="button"
                key={option}
                onClick={() => {
                  onChange(option);
                  setIsOpen(false);
                }}
                className={`w-full px-3 py-2 text-left text-[15px] hover:bg-[#f5f5f5] transition-colors cursor-pointer ${
                  value === option
                    ? "bg-[#f7e4de] text-[#e84814]"
                    : "text-[#111]"
                }`}
              >
                {option} {unit ? unit : ""}
              </button>
            ))}
          </div>
        </Portal>
      )}
    </div>
  );
};

// ─── Measurement field: значение + отдельный дропдаун единицы измерения ──

const MeasurementField = ({
  label,
  value,
  onChange,
  options,
  units,
}: {
  label: string;
  value: MeasurementValue;
  onChange: (v: MeasurementValue) => void;
  options: string[];
  units: MeasurementUnit[];
}) => {
  const unitValue = units.length
    ? units.find((u) => u.id === value.unitId)?.title || units[0].title
    : "";

  return (
    <div className="flex gap-1 w-full">
      <div className="flex-1 min-w-0">
        <PlaceholderInput
          placeholder={label}
          value={value.value}
          onChange={(v) => onChange({ ...value, value: v })}
          type="number"
        />
      </div>
      {units.length > 1 ? (
        <div className="w-[145px] flex-shrink-0">
          <CustomDropdown
            label="Unit"
            value={unitValue}
            onChange={(title) => {
              const u = units.find((x) => x.title === title);
              onChange({ ...value, unitId: u ? u.id : value.unitId });
            }}
            options={units.map((u) => u.title)}
          />
        </div>
      ) : units.length === 1 ? (
        <div className="w-[145px] sm:w-auto flex items-center justify-center sm:justify-start px-2 text-[13px] text-[#999] border border-[#d9d9d9] rounded-[10px] bg-white whitespace-nowrap flex-shrink-0">
          {units[0].title}
        </div>
      ) : null}
    </div>
  );
};

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

const MiniCalendar = ({
  selected,
  onSelect,
  onClose,
  unavailableDates = [],
  disablePast = false,
  disableFuture = false,
  highlightToday = true,
  showUnavailableLegend = true,
}: {
  selected: string;
  onSelect: (iso: string) => void;
  onClose: () => void;
  unavailableDates?: string[];
  disablePast?: boolean;
  disableFuture?: boolean;
  highlightToday?: boolean;
  showUnavailableLegend?: boolean;
}) => {
  const today = new Date();
  const todayMidnight = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate()
  );
  const selDate = selected ? new Date(selected) : null;
  const [viewYear, setViewYear] = useState(
    selDate?.getFullYear() ?? today.getFullYear()
  );
  const [viewMonth, setViewMonth] = useState(
    selDate?.getMonth() ?? today.getMonth()
  );

  const startDay = new Date(viewYear, viewMonth, 1).getDay();
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();

  const isUnavailable = (day: number) => {
    const k = `${viewYear}-${String(viewMonth + 1).padStart(2, "0")}-${String(
      day
    ).padStart(2, "0")}`;
    if (unavailableDates.includes(k)) return true;
    const d = new Date(viewYear, viewMonth, day);
    if (disablePast && d < todayMidnight) return true;
    // FIX (п.2): дата рождения не может быть в будущем — все дни после сегодня неактивны
    if (disableFuture && d > todayMidnight) return true;
    return false;
  };

  const isSelected = (day: number) =>
    selDate &&
    selDate.getFullYear() === viewYear &&
    selDate.getMonth() === viewMonth &&
    selDate.getDate() === day;

  // FIX (п.2): для даты рождения "сегодня" не подсвечивается как активный день —
  // это сбивало с толку (выглядело как "выбраны две даты").
  const isToday = (day: number) =>
    highlightToday &&
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
  const defaultMinYear = disableFuture
    ? today.getFullYear() - 100
    : today.getFullYear();
  const defaultMaxYear = disableFuture
    ? today.getFullYear()
    : today.getFullYear() + 5;
  const years: number[] = [];
  for (let y = defaultMaxYear; y >= defaultMinYear; y--) years.push(y);
  return (
    <div className="bg-white rounded-2xl shadow-xl overflow-hidden w-full">
      <div
        className="flex items-end px-2 pt-3 pb-2 gap-2 overflow-x-auto bg-[#f5f5f5]"
        style={{ scrollbarWidth: "none" }}
      >
        {stripMonths.map(({ m, y, label, week }) => {
          const isCurrent = m === viewMonth && y === viewYear;
          return (
            <button
              type="button"
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

      <div className="flex items-center justify-between px-4 py-3 gap-2">
        <button
          type="button"
          onClick={prevMonth}
          className="w-8 h-8 flex items-center justify-center rounded-full border border-[#e4e4e4] hover:bg-[#f5f5f5] cursor-pointer flex-shrink-0"
        >
          <ChevronDown className="rotate-90 w-3 h-3 text-[#111]" />
        </button>
        <div className="flex items-center gap-1.5">
          <span className="text-[15px] font-medium text-[#111]">
            {MONTHS[viewMonth]}
          </span>
          <select
            value={viewYear}
            onChange={(e) => setViewYear(Number(e.target.value))}
            className="text-[15px] font-medium text-[#111] border border-[#e4e4e4] rounded-lg pl-2 pr-1 py-0.5 outline-none cursor-pointer bg-white"
          >
            {years.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
        </div>
        <button
          type="button"
          onClick={nextMonth}
          className="w-8 h-8 flex items-center justify-center rounded-full border border-[#e4e4e4] hover:bg-[#f5f5f5] cursor-pointer flex-shrink-0"
        >
          <ChevronDown className="-rotate-90 w-3 h-3 text-[#111]" />
        </button>
      </div>

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

      <div className="grid grid-cols-7 px-3 pb-3 gap-y-1">
        {cells.map((day, i) => {
          if (!day) return <div key={i} />;
          const unavail = isUnavailable(day);
          const sel = isSelected(day);
          const tod = isToday(day) && !unavail;
          return (
            <button
              type="button"
              key={i}
              disabled={unavail}
              onClick={() => {
                const iso = `${viewYear}-${String(viewMonth + 1).padStart(
                  2,
                  "0"
                )}-${String(day).padStart(2, "0")}`;
                onSelect(iso);
                onClose();
              }}
              // FIX (п.2): "сегодня" — только тонкое кольцо, а не сплошная заливка,
              // чтобы не путалось с реально выбранным днём (было похоже на 2 даты сразу)
              className={`mx-auto w-9 h-9 flex items-center justify-center rounded-full text-[14px] font-medium transition-colors
                ${sel ? "bg-[#e84814] text-white" : ""}
                ${
                  tod && !sel
                    ? "text-[#e84814] ring-1 ring-inset ring-[#e84814] hover:bg-[#fff0ed]"
                    : ""
                }
                ${unavail ? "text-[#ccc] bg-[#f5f5f5] cursor-not-allowed" : ""}
                ${
                  !sel && !tod && !unavail
                    ? "text-[#111] hover:bg-[#f5f5f5] cursor-pointer"
                    : ""
                }`}
            >
              {day}
            </button>
          );
        })}
      </div>

      <div className="flex items-center justify-center gap-3 pb-3 flex-wrap px-2">
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-full bg-[#e84814]" />
          <span className="text-[12px] text-[#999]">
            {LABELS.selectedLegend}
          </span>
        </div>
        {highlightToday && (
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full ring-1 ring-inset ring-[#e84814]" />
            <span className="text-[12px] text-[#999]">
              {LABELS.todayLegend}
            </span>
          </div>
        )}
        {showUnavailableLegend && (
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full bg-[#ccc]" />
            <span className="text-[12px] text-[#999]">
              {LABELS.unavailableDaysLegend}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
const DatePickerField = ({
  value,
  onChange,
  placeholder,
  unavailableDates = [],
  disablePast = false,
  disableFuture = false,
  highlightToday = true,
  variant = "default",
  showUnavailableLegend = !disableFuture, // для DOB/last dive (disableFuture) легенда скрыта
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  unavailableDates?: string[];
  disablePast?: boolean;
  disableFuture?: boolean;
  highlightToday?: boolean;
  variant?: "default" | "banner";
}) => {
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState({ top: 0, left: 0, width: 0 });
  const ref = useRef<HTMLDivElement>(null);
  const calendarRef = useRef<HTMLDivElement>(null);

  const openPicker = () => {
    if (ref.current) {
      const r = ref.current.getBoundingClientRect();
      // см. комментарий в CustomDropdown.openPicker — используем viewport-координаты для position:fixed
      setPos({
        top: r.bottom + 4,
        left: r.left,
        width: Math.max(r.width, 300),
      });
    }
    setOpen(true);
  };

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      const target = e.target as Node;
      if (
        ref.current &&
        !ref.current.contains(target) &&
        calendarRef.current &&
        !calendarRef.current.contains(target)
      ) {
        setOpen(false);
      }
    };
    if (open) document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  const formatDisplay = (iso: string) => {
    if (!iso) return null;
    const [y, m, d] = iso.split("-");
    return `${d}/${m}/${y}`;
  };

  const parts = placeholder.split("*");
  const hasAsterisk = parts.length > 1;
  const isBannerActive = variant === "banner" && (open || !!value);
  // FIX (п.1 из предыдущего сообщения): подсветка при открытии работает одинаково
  // и для "banner" (Choose Date), и для обычных полей (дата рождения и т.д.) —
  // раньше это зависело только от нативного :focus у <button>, что вело себя
  // непредсказуемо в разных браузерах.
  const isDefaultActive = variant === "default" && open;

  return (
    <div className="relative w-full" ref={ref}>
      <button
        type="button"
        onClick={() => (open ? setOpen(false) : openPicker())}
        className={`flex items-center justify-between px-3 py-2 rounded-[10px] border text-[15px] w-full cursor-pointer transition-colors focus:outline-none ${
          isBannerActive
            ? "bg-[#e84814] border-[#e84814] text-white"
            : isDefaultActive
            ? "bg-white border-[#e84814] text-[#111]"
            : "bg-white border-[#d9d9d9] text-[#111]"
        }`}
      >
        <span className="flex items-center gap-2">
          {variant === "banner" && (
            <CalendarFieldIcon active={isBannerActive} />
          )}
          {value ? (
            <span>{formatDisplay(value)}</span>
          ) : (
            <span>
              <span className={isBannerActive ? "text-white" : "text-[#111]"}>
                {parts[0]}
              </span>
              {hasAsterisk && <span className="text-[#e84814]">*</span>}
            </span>
          )}
        </span>
        {variant === "default" && <CalendarFieldIcon active={false} />}
      </button>
      {open && (
        <Portal>
          <div
            ref={calendarRef}
            style={{
              position: "fixed",
              top: pos.top,
              left: pos.left,
              width: pos.width,
              zIndex: PORTAL_Z,
            }}
          >
            <MiniCalendar
              selected={value}
              onSelect={(v) => {
                onChange(v);
                setOpen(false);
              }}
              onClose={() => setOpen(false)}
              unavailableDates={unavailableDates}
              disablePast={disablePast}
              disableFuture={disableFuture}
              highlightToday={highlightToday}
              showUnavailableLegend={showUnavailableLegend}
            />
          </div>
        </Portal>
      )}
    </div>
  );
};

// ─── Inputs ───────────────────────────────────────────────────────────────────

const inputCls =
  "flex items-center gap-2 px-3 py-2 rounded-[10px] border border-[#d9d9d9] bg-white text-[15px] text-[#111] w-full outline-none focus:border-[#e84814] transition-colors";

const PlaceholderInput = ({
  placeholder,
  value,
  onChange,
  type = "text",
  extraBorder = false,
}: {
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  extraBorder?: boolean;
}) => {
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

// ─── Equipment grid — без скролла/карусели ─────────────────────────────────────

const EquipmentGrid = ({
  equipment,
  onToggle,
}: {
  equipment: EquipmentItem[];
  onToggle: (id: number) => void;
}) => {
  if (equipment.length === 0) return null;
  return (
    <div className="flex flex-wrap gap-3 mt-4 pt-2">
      {equipment.map((item) => (
        <div
          key={item.id}
          className={`relative w-[130px] flex-shrink-0 transition-colors rounded-2xl p-2 ${
            item.isSelected ? "bg-[#f7e4de]" : "bg-[#f1f1f1]"
          }`}
        >
          <button
            type="button"
            onClick={() => onToggle(item.id)}
            className={`absolute -top-2 -left-2 w-12 h-12 rounded-full flex items-center justify-center shadow-md z-20 cursor-pointer transition-colors ${
              item.isSelected ? "bg-[#e84814]" : "bg-black"
            }`}
          >
            {item.isSelected ? <CheckIconActive /> : <PlusIcon />}
          </button>

          <div className="relative w-full h-[100px] rounded-xl overflow-hidden flex-shrink-0 bg-white">
            {item.image ? (
              <img
                src={item.image}
                alt={item.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-[#2c2c2c] to-[#1a1a1a]" />
            )}
            <div className="absolute top-2 right-2 flex items-center gap-0.5 bg-white rounded-lg px-1.5 py-0.5 shadow-sm z-10">
              <CoinIcon />
              <span className="text-[11px] font-bold text-black">
                {item.price}
              </span>
            </div>
          </div>

          <div className="bg-white rounded-xl px-2 py-1.5 mt-2">
            <p className="text-[11px] text-[#111] leading-[130%]">
              {item.name}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

// ─── Participant block ────────────────────────────────────────────────────────
const ParticipantBlock = ({
  p,
  centerHeights,
  centerWeights,
  centerShoes,
  genderOptions,
  agencies,
  requiresCert,
  onChange,
  onToggleEquip,
  onToggleExpand,
  onToggleEquipSection,
  onChangeCert,
}: {
  p: Participant;
  centerHeights: MeasurementUnit[];
  centerWeights: MeasurementUnit[];
  centerShoes: MeasurementUnit[];
  genderOptions: GenderOption[];
  agencies: AgencyOption[];
  requiresCert: boolean;
  onChange: (id: number, field: string, val: any) => void;
  onToggleEquip: (pid: number, eid: number) => void;
  onToggleExpand: (id: number) => void;
  onToggleEquipSection: (id: number) => void;
  onChangeCert: (id: number, field: string, val: string) => void;
}) => {
  const heightOptions = [
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
  ];
  const weightOptions = [
    "40",
    "50",
    "60",
    "70",
    "80",
    "90",
    "100",
    "110",
    "120",
  ];
  const shoeOptions = [
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
  ];

  const genderLabel =
    genderOptions.find((g) => g.key === p.gender)?.label || "";

  return (
    <div className="bg-white rounded-2xl w-full">
      <button
        type="button"
        onClick={() => onToggleExpand(p.id)}
        className="flex 3xl:hidden w-full items-center justify-between px-4 py-3 cursor-pointer"
      >
        <span className="text-[15px] font-semibold text-[#111] leading-[160%]">
          {LABELS.participant} <span className="text-[#e84814]">{p.id}</span>
        </span>
        <ChevronDown
          className={`text-[#111] transition-transform duration-200 ${
            p.isExpanded ? "rotate-180" : ""
          }`}
        />
      </button>

      <div
        className={`${
          p.isExpanded ? "block" : "hidden"
        } 3xl:block w-full px-4 pb-4 pt-2 flex flex-col gap-2`}
      >
        <div className="hidden 3xl:block mb-2">
          <span className="text-[15px] font-semibold text-[#111] leading-[160%]">
            {LABELS.participant} <span className="text-[#e84814]">{p.id}</span>
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          <PlaceholderInput
            placeholder={LABELS.firstName}
            value={p.firstName}
            onChange={(v) => onChange(p.id, "firstName", v)}
            extraBorder
          />
          <PlaceholderInput
            placeholder={LABELS.lastName}
            value={p.lastName}
            onChange={(v) => onChange(p.id, "lastName", v)}
          />
          {/* FIX (п.2): дата рождения — прошлое доступно, будущее и "сегодня"-подсветка отключены */}
          <DatePickerField
            value={p.dateOfBirth}
            onChange={(v) => onChange(p.id, "dateOfBirth", v)}
            placeholder={LABELS.dateOfBirth}
            disableFuture
            highlightToday={false}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mt-2">
          <CustomDropdown
            label={LABELS.selectGender}
            value={genderLabel}
            onChange={(label) => {
              const g = genderOptions.find((x) => x.label === label);
              onChange(p.id, "gender", g ? g.key : label);
            }}
            options={genderOptions.map((g) => g.label)}
          />
          <BookingPhoneField
            placeholder={LABELS.phoneNumber}
            value={p.phone}
            onChange={(v) => onChange(p.id, "phone", v)}
            
          />
          <PlaceholderInput
            placeholder={LABELS.email}
            value={p.email}
            onChange={(v) => onChange(p.id, "email", v)}
            type="email"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mt-2">
          <MeasurementField
            label={LABELS.height}
            value={p.height}
            onChange={(v) => onChange(p.id, "height", v)}
            options={heightOptions}
            units={centerHeights}
          />
          <MeasurementField
            label={LABELS.weight}
            value={p.weight}
            onChange={(v) => onChange(p.id, "weight", v)}
            options={weightOptions}
            units={centerWeights}
          />
          <MeasurementField
            label={LABELS.shoeSize}
            value={p.shoeSize}
            onChange={(v) => onChange(p.id, "shoeSize", v)}
            options={shoeOptions}
            units={centerShoes}
          />
        </div>

        <p className="text-[13px] text-[#111] leading-[160%] mt-3 mb-1">
          {LABELS.equipmentNote}
        </p>

        {p.equipment.length > 0 && (
          <>
            <button
              type="button"
              onClick={() => onToggleEquipSection(p.id)}
              className="flex 3xl:hidden w-full items-center justify-between cursor-pointer mt-2"
            >
              <span className="text-[15px] font-bold text-[#111] text-start">
                {LABELS.additionalEquipmentFor}{" "}
                <span className="text-[#e84814]">{p.id}</span>
              </span>
              <ChevronDown
                className={`text-[#111] transition-transform duration-200 ${
                  p.isEquipmentExpanded ? "rotate-180" : ""
                }`}
              />
            </button>

            <div className="hidden 3xl:block mt-3 mb-2">
              <span className="text-[15px] font-bold text-[#111] text-start">
                {LABELS.additionalEquipmentFor}{" "}
                <span className="text-[#e84814]">{p.id}</span>
              </span>
            </div>

            <div
              className={`${
                p.isEquipmentExpanded ? "block" : "hidden"
              } 3xl:block`}
            >
              <EquipmentGrid
                equipment={p.equipment}
                onToggle={(eid) => onToggleEquip(p.id, eid)}
              />
            </div>
          </>
        )}

        {requiresCert && (
          <div className="border border-[#e84814] rounded-2xl p-3 mt-3 bg-[#fff8f6]">
            <div className="flex items-center gap-2 mb-3">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <circle
                  cx="10"
                  cy="10"
                  r="9"
                  stroke="#E84814"
                  strokeWidth="1.5"
                />
                <path
                  d="M10 6v5M10 13.5h.01"
                  stroke="#E84814"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
              <span className="text-[13px] font-semibold text-[#e84814]">
                {LABELS.certTitle}
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-2">
              <CustomDropdown
                label={LABELS.certAgency}
                value={
                  [...agencies, { id: "other", title: "Other" }].find(
                    (a) => a.id === p.certAgency
                  )?.title || ""
                }
                onChange={(title) => {
                  const a = [...agencies, { id: "other", title: "Other" }].find(
                    (x) => x.title === title
                  );
                  onChangeCert(p.id, "certAgency", a ? a.id : title);
                }}
                options={[...agencies, { id: "other", title: "Other" }].map(
                  (a) => a.title
                )}
              />
              <PlaceholderInput
                placeholder={LABELS.certLevel}
                value={p.certLevel}
                onChange={(v) => onChangeCert(p.id, "certLevel", v)}
              />
            </div>
            {p.certAgency === "other" && (
              <div className="mb-2">
                <PlaceholderInput
                  placeholder={LABELS.certAgencyOtherPlaceholder}
                  value={p.certAgencyOther}
                  onChange={(v) => onChangeCert(p.id, "certAgencyOther", v)}
                />
              </div>
            )}
            {p.certAgency === "Other" && (
              <div className="mb-2">
                <PlaceholderInput
                  placeholder={LABELS.certAgencyOtherPlaceholder}
                  value={p.certAgencyOther}
                  onChange={(v) => onChangeCert(p.id, "certAgencyOther", v)}
                />
              </div>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <PlaceholderInput
                placeholder={LABELS.totalDives}
                value={p.totalDives}
                onChange={(v) => onChangeCert(p.id, "totalDives", v)}
                type="number"
              />
              {/* последний дайв тоже не может быть в будущем */}
              <DatePickerField
                value={p.lastDiveDate}
                onChange={(v) => onChangeCert(p.id, "lastDiveDate", v)}
                placeholder={LABELS.lastDiveDate}
                disableFuture
              />
            </div>
            <div
              className="flex items-center gap-2 mt-3"
              style={{
                border: "1px solid #a0c52e",
                borderRadius: 10,
                padding: "5px 10px",
                minHeight: 38,
                background: "#fff",
              }}
            >
              <AlertIcon />
              <span
                style={{
                  fontWeight: 600,
                  fontSize: 14,
                  lineHeight: "150%",
                  color: "#000",
                }}
              >
                {LABELS.certRequiredNote}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// ─── Reservation Summary ──────────────────────────────────────────────────────
const ReservationSummary = ({
  courseTitle,
  currency,
  participants,
  pricePerPerson,
  onBook,
  isSubmitting,
  submitError,
  submitSuccess,
  disabled,
  recaptchaRef,
  onCaptchaChange,
  payment,
  widgetReady,
  paymentError,
  locale,
}: {
  courseTitle: string;
  currency: string;
  participants: Participant[];
  pricePerPerson: number;
  onBook: () => void;
  isSubmitting: boolean;
  submitError: string | null;
  submitSuccess: boolean;
  disabled: boolean;
  recaptchaRef: React.RefObject<any>;
  onCaptchaChange: (token: string | null) => void;
  payment: any;
  widgetReady: boolean;
  paymentError: string | null;
  locale: string;
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
    <div className="bg-white rounded-2xl border-2 border-[#e84814] p-4 pt-1 flex flex-col gap-2 w-full">
      <h2 className="text-[24px] font-medium text-black leading-[130%]">
        {LABELS.reservationDetails}
      </h2>
      <div className="h-px bg-[#e4e4e4]" />
      <p className="text-[13px] font-medium text-black leading-[140%]">
        {courseTitle}
      </p>
      <div className="flex justify-between text-[13px] text-black py-1">
        <span>
          {count} {count > 1 ? "Adults" : "Adult"} x {currency} {pricePerPerson}
        </span>
        <span>
          {currency} {courseTotal.toFixed(2)}
        </span>
      </div>
      {equipByP.map(
        (p) =>
          p.items.length > 0 && (
            <div key={p.id}>
              <div className="h-px bg-[#e4e4e4] my-1" />
              <p className="text-[12px] font-semibold text-[#111] mb-1">
                {LABELS.additionalEquipmentFor}{" "}
                <span className="text-[#e84814]">{p.id}</span>
              </p>
              {p.items.map((item) => (
                <div
                  key={item.id}
                  className="flex justify-between text-[13px] text-black py-0.5"
                >
                  <span>1 {item.name}</span>
                  <span>
                    {item.currency} {item.price}
                  </span>
                </div>
              ))}
            </div>
          )
      )}
      <div className="h-px bg-[#e4e4e4] mt-1" />
      <div className="flex justify-between text-[17px] font-medium text-black py-1">
        <span>{LABELS.totalPrice}</span>
        <span>
          {currency} {grand.toFixed(2)}
        </span>
      </div>

      {/* reCAPTCHA v2 — только пока не создан букинг (до payment) */}
      {!payment && (
        <div className="flex justify-center my-2">
          <ReCAPTCHA
            ref={recaptchaRef}
            sitekey={"6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI"}
            onChange={onCaptchaChange}
            onExpired={() => onCaptchaChange(null)}
          />
        </div>
      )}

      {submitError && (
        <div className="px-3 py-2 rounded-[10px] bg-[#fff0ed] border border-[#e84814] text-[13px] text-[#e84814]">
          {submitError}
        </div>
      )}
      {paymentError && (
        <div className="px-3 py-2 rounded-[10px] bg-[#fff0ed] border border-[#e84814] text-[13px] text-[#e84814]">
          {paymentError}
        </div>
      )}
      {/* {disabled && !submitError && !payment && (
        <p className="text-[12px] text-[#e84814] text-center">
          {LABELS.requiredFieldsNote}
        </p>
      )} */}

      {!payment && (
        <button
          type="button"
          onClick={onBook}
          disabled={isSubmitting || disabled}
          className={`w-full py-2 rounded-full text-white text-[16px] font-semibold transition-colors mt-1 ${
            isSubmitting || disabled
              ? "bg-[#ccc] cursor-not-allowed"
              : "bg-[#e84814] hover:bg-[#d63f0f] cursor-pointer"
          }`}
        >
          {isSubmitting ? LABELS.sending : LABELS.bookNow}
        </button>
      )}

      {/* После создания букинга — форма оплаты SIBS вместо кнопки */}
      {payment && (
        <div className="mt-2">
          {submitSuccess && (
            <div className="px-3 py-2 mb-3 rounded-[10px] bg-[#f0fff4] border border-[#4caf50] text-[13px] text-[#2e7d32]">
              {LABELS.submitSuccess}
            </div>
          )}
          {!widgetReady && (
            <div className="flex items-center justify-center gap-2 py-2 text-[13px] text-[#666]">
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-black/10 border-t-[#e84814]" />
              Loading payment methods…
            </div>
          )}
          <form
            className="paymentSPG"
            spg-context={payment.form_context}
            spg-config={JSON.stringify({
              paymentMethodList: payment.payment_methods,
              amount: {
                value: payment.amount.value,
                currency: payment.amount.currency,
              },
              language: locale,
              redirectUrl: `${window.location.origin}/${locale}/payment/redirect`,
            })}
            spg-style={JSON.stringify({
              transaction: { layout: "default", theme: "default" },
            })}
          />
        </div>
      )}

      <div className="flex items-center justify-center gap-1.5 mt-1">
        <ShieldIcon />
        <span className="text-[11px] text-[#999]">
          Secure checkout · SSL encrypted
        </span>
      </div>
    </div>
  );
};

// ─── Checkbox ─────────────────────────────────────────────────────────────────

const CheckboxRow = ({
  checked,
  onChange,
  label,
  href,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
  href: string;
}) => (
  <div className="flex items-start gap-2.5">
    <label className="cursor-pointer">
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
    </label>
    <span className="text-[14px] text-[#111] leading-[140%]">
      I accept{" "}
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="text-[#e84814] underline"
      >
        {label}
      </a>
    </span>
  </div>
);

// ─── MAIN MODAL ───────────────────────────────────────────────────────────────

export const BookingFormModal: React.FC<Props> = ({
  isOpen,
  onClose,
  itemType = "course",
  itemId,
  courseTitle: fallbackTitle = "",
  pricePerPerson: fallbackPrice = 0,
  initialCenterSlug,
  unavailableDates = [],
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const [courseTitle, setCourseTitle] = useState(fallbackTitle);
  const [currency, setCurrency] = useState("€");
  const [pricePerPerson, setPricePerPerson] = useState(fallbackPrice);
  const [equipmentTemplate, setEquipmentTemplate] = useState<EquipmentItem[]>(
    []
  );
  const [requiresCert, setRequiresCert] = useState(false);
  const [measurements, setMeasurements] = useState<{
    height: MeasurementUnit[];
    weight: MeasurementUnit[];
    shoe_size: MeasurementUnit[];
  }>({ height: [], weight: [], shoe_size: [] });

  // FIX (п.4): центры и гендеры — реальные данные с бэка, без мока
  // FIX (п.4): центры и гендеры — реальные данные с бэка, без мока
  const [centers, setCenters] = useState<CenterOption[]>([]);
  const [centerSlug, setCenterSlug] = useState(initialCenterSlug || "");
  const [genderOptions, setGenderOptions] = useState<GenderOption[]>([
    { key: "male", label: "Male" },
    { key: "female", label: "Female" },
    { key: "other", label: "Other" },
  ]);
  const [agencies, setAgencies] = useState<AgencyOption[]>([]);

  const [selectedDate, setSelectedDate] = useState("");
  const [participantCount, setParticipantCount] = useState(2);
  const [participants, setParticipants] = useState<Participant[]>([
    createParticipant(1),
    createParticipant(2),
  ]);

  const [comment, setComment] = useState("");
  const [privacy, setPrivacy] = useState(false);
  const [terms, setTerms] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // ─── reCAPTCHA v2 ───────────────────────────────────────────────
  const recaptchaRef = useRef<any>(null);
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);

  // ─── Payment (SIBS) ─────────────────────────────────────────────
  const [payment, setPayment] = useState<any>(null);
  const [widgetReady, setWidgetReady] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);

  // Локаль для redirectUrl виджета — берите из вашего useLocale(), если он
  // используется в приложении; здесь fallback на "en".
  const locale = useLocale();
  // FIX (п.1): пока модалка открыта — скроллится только она, фон полностью заблокирован
  useEffect(() => {
    if (!isOpen) return;
    const scrollY = window.scrollY;
    const { style } = document.body;
    const prevOverflow = style.overflow;
    const prevPosition = style.position;
    const prevTop = style.top;
    const prevWidth = style.width;

    style.overflow = "hidden";
    style.position = "fixed";
    style.top = `-${scrollY}px`;
    style.width = "100%";

    return () => {
      style.overflow = prevOverflow;
      style.position = prevPosition;
      style.top = prevTop;
      style.width = prevWidth;
      window.scrollTo(0, scrollY);
    };
  }, [isOpen]);

  useEffect(() => {
    if (!payment) return;
    setWidgetReady(false);
    setPaymentError(null);
    const widgetUrl = `${payment.widget_script_url}?id=${payment.transaction_id}`;

    loadSibsWidgetScript(widgetUrl)
      .then(() => setWidgetReady(true))
      .catch((e) =>
        setPaymentError(e.message || "Failed to load payment widget.")
      );
  }, [payment]);
  // Загрузка реального состояния с бэка
  useEffect(() => {
    if (!isOpen || !itemId) return;
    let cancelled = false;
    setIsLoading(true);
    setLoadError(null);

    resolveItem(itemType, itemId)
      .then((data) => {
        if (cancelled) return;
        const apiItem = data.items?.[0] || null;

        if (apiItem) {
          setCourseTitle(apiItem.name || fallbackTitle);
          setCurrency(apiItem.price?.currency || "€");
          // Допущение: amount приходит в минимальных единицах валюты (центах),
          // как в примере 150000 → 1500.00 €. Если бэк отдаёт уже в major units —
          // просто уберите "/ 100" ниже.
          const rawAmount = apiItem.price?.amount;
          setPricePerPerson(
            typeof rawAmount === "number" ? rawAmount : fallbackPrice
          );

          const template: EquipmentItem[] = (apiItem.equipment_rent || []).map(
            (e: any) => ({
              id: e.id,
              name: e.name,
              image: e.image || null,
              price: parseFloat(e.price?.amount ?? 0),
              currency: e.price?.currency || apiItem.price?.currency || "€",
              isSelected: false,
            })
          );
          setEquipmentTemplate(template);
          setRequiresCert(
            itemType !== "course" || !!apiItem.requires_certification
          );
          // FIX (п.4): реальные центры со slug/name из apiItem.location
          if (Array.isArray(apiItem.location) && apiItem.location.length) {
            const mapped: CenterOption[] = apiItem.location.map((l: any) => ({
              slug: l.slug,
              name: l.name,
            }));
            setCenters(mapped);
            setCenterSlug((prev) => {
              if (prev && mapped.some((c) => c.slug === prev)) return prev;
              if (
                initialCenterSlug &&
                mapped.some((c) => c.slug === initialCenterSlug)
              )
                return initialCenterSlug;
              return mapped[0].slug;
            });
          } else {
            setCenters([]);
          }
        }

        if (data.participant_measurements) {
          setMeasurements({
            height: data.participant_measurements.height || [],
            weight: data.participant_measurements.weight || [],
            shoe_size: data.participant_measurements.shoe_size || [],
          });
        }

        // FIX (п.4): реальные гендеры с бэка (ключ→лейбл)
              // FIX (п.4): реальные гендеры с бэка (ключ→лейбл)
              if (data.genders && typeof data.genders === "object") {
                const list: GenderOption[] = Object.entries(data.genders).map(
                  ([key, label]) => ({
                    key,
                    label: String(label),
                  })
                );
                if (list.length) setGenderOptions(list);
              }
      
              if (Array.isArray(data.agencies) && data.agencies.length) {
                setAgencies(data.agencies);
              }
            })
      .catch((err) => {
        if (!cancelled) setLoadError(err.message || LABELS.loadError);
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, itemType, itemId]);

  useEffect(() => {
    setParticipants((prev) =>
      prev.map((p) => ({
        ...p,
        equipment: equipmentTemplate.map((e) => ({ ...e })),
        height: p.height.unitId
          ? p.height
          : { ...p.height, unitId: measurements.height[0]?.id ?? null },
        weight: p.weight.unitId
          ? p.weight
          : { ...p.weight, unitId: measurements.weight[0]?.id ?? null },
        shoeSize: p.shoeSize.unitId
          ? p.shoeSize
          : { ...p.shoeSize, unitId: measurements.shoe_size[0]?.id ?? null },
      }))
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [equipmentTemplate, measurements]);

  const setCount = (n: number) => {
    const c = Math.max(1, Math.min(10, n));
    setParticipantCount(c);
    setParticipants((prev) => {
      if (c > prev.length) {
        const additions = Array.from({ length: c - prev.length }, (_, i) => {
          const np = createParticipant(prev.length + i + 1);
          np.equipment = equipmentTemplate.map((e) => ({ ...e }));
          np.height.unitId = measurements.height[0]?.id ?? null;
          np.weight.unitId = measurements.weight[0]?.id ?? null;
          np.shoeSize.unitId = measurements.shoe_size[0]?.id ?? null;
          return np;
        });
        return [...prev, ...additions];
      }
      return prev.slice(0, c);
    });
  };

  const updateParticipant = (id: number, field: string, val: any) =>
    setParticipants((prev) =>
      prev.map((p) => (p.id === id ? { ...p, [field]: val } : p))
    );

  const updateCert = (id: number, field: string, val: string) =>
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

  const formValid =
    !!selectedDate &&
    (!centers.length || !!centerSlug) &&
    participants.every(isParticipantValid) &&
    (!requiresCert || participants.every(isCertValid)) &&
    privacy &&
    terms &&
    !!captchaToken;

  // ВРЕМЕННЫЙ ДЕБАГ — удалить после диагностики
  if (typeof window !== "undefined") {
    console.log("formValid debug:", {
      selectedDate: !!selectedDate,
      centersOk: !centers.length || !!centerSlug,
      participantsOk: participants.every(isParticipantValid),
      requiresCert,
      certOk: !requiresCert || participants.every(isCertValid),
      privacy,
      terms,
      captchaToken: !!captchaToken,
      participantsDetail: participants.map((p) => ({
        id: p.id,
        firstName: !!p.firstName.trim(),
        lastName: !!p.lastName.trim(),
        dob: !!p.dateOfBirth,
        gender: !!p.gender,
        phone: !!p.phone.trim(),
        email: !!p.email.trim(),
        height: !!p.height.value,
        weight: !!p.weight.value,
        shoeSize: !!p.shoeSize.value,
      })),
    });
  }

  const handleSubmit = async () => {
    setSubmitError(null);
    setSubmitSuccess(false);

    if (!captchaToken) {
      setSubmitError("Please complete the reCAPTCHA.");
      return;
    }

    setIsSubmitting(true);
    try {
      const payload: any = {
        comment,
        recaptcha_token: captchaToken,
        items: [
          {
            type: itemType,
            id: itemId,
            date: selectedDate,
            ...(itemType === "course" && centerSlug
              ? { center_slug: centerSlug }
              : {}),
            participants: participants.map((p) => ({
              first_name: p.firstName,
              last_name: p.lastName,
              date_of_birth: p.dateOfBirth,
              gender: p.gender,
              phone: p.phone,
              email: p.email,
              measurements: {
                height: { value: p.height.value, unit_id: p.height.unitId },
                weight: { value: p.weight.value, unit_id: p.weight.unitId },
                shoe_size: {
                  value: p.shoeSize.value,
                  unit_id: p.shoeSize.unitId,
                },
              },
              certification: requiresCert
              ? {
                  agency_id: p.certAgency !== "other" ? p.certAgency : null,
                  agency_other:
                    p.certAgency === "other" ? p.certAgencyOther : null,
                  level: p.certLevel,
                  total_dives: p.totalDives,
                  last_dive_date: p.lastDiveDate,
                }
              : null,
              equipment_rent: p.equipment
                .filter((e) => e.isSelected)
                .map((e) => ({ id: e.id })),
            })),
          },
        ],
      };

      const res = await submitBookingRequest(payload);
      const bookingData = res?.data;

      if (!bookingData?.payment) {
        setSubmitError(
          bookingData?.payment_error ||
            "Payment could not be started. Please contact support."
        );
        setIsSubmitting(false);
        return;
      }

      setPayment(bookingData.payment);
      setSubmitSuccess(true);
    } catch (err: any) {
      setSubmitError(err.message || LABELS.submitError);
    } finally {
      recaptchaRef.current?.reset();
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 z-[10000000] bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="fixed inset-0 z-[10000000] overflow-y-auto overscroll-contain">
        <div className="min-h-full flex items-start justify-center">
          <div
            className="relative w-full mx-4 md:mx-8 my-4 md:my-8 3xl:mx-[188px] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* ── HEADER ── */}
            <div
              className="relative flex items-end overflow-hidden"
              style={{ height: 76 }}
            >
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

              <div className="relative z-0 flex items-center gap-3 px-6 pb-6 pt-4">
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
                  {LABELS.bookingForm}
                </span>
              </div>

              <button
                type="button"
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

              <div className="py-3">
                <div className="bg-[#281d4d] rounded-2xl px-6 py-3 text-center">
                  <span className="text-white text-[17px] font-medium">
                    {LABELS.selectDateAndTravelers}
                  </span>
                </div>
              </div>

              {isLoading ? (
                <div className="py-16 text-center text-[15px] text-[#999]">
                  {LABELS.loadingCourse}
                </div>
              ) : loadError ? (
                <div className="py-16 text-center text-[15px] text-[#e84814]">
                  {loadError}
                </div>
              ) : (
                <div className="pb-8">
                  <div className="flex flex-col 3xl:flex-row gap-4 items-start">
                    <div className="flex-1 min-w-0 w-full flex flex-col gap-3">
                      <div className="flex flex-col sm:flex-row gap-3">
                        {itemType === "course" && centers.length > 0 && (
                          <div className="flex-1 min-w-[200px] bg-white rounded-2xl p-4 flex flex-col gap-1.5">
                            <span className="text-[15px] font-semibold text-[#111] leading-[160%]">
                              {LABELS.chooseCenter}
                            </span>
                            <CustomDropdown
                              label={LABELS.selectCenter}
                              value={
                                centers.find((c) => c.slug === centerSlug)
                                  ?.name || ""
                              }
                              onChange={(name) => {
                                const c = centers.find((x) => x.name === name);
                                setCenterSlug(c ? c.slug : name);
                              }}
                              options={centers.map((c) => c.name)}
                              icon={<LocationIcon />}
                            />
                          </div>
                        )}

                        <div className="flex-1 min-w-[200px] bg-white rounded-2xl p-4 flex flex-col gap-1.5 relative">
                          <span className="text-[15px] font-semibold text-[#111] leading-[160%]">
                            {LABELS.chooseDate}
                          </span>
                          <DatePickerField
                            value={selectedDate}
                            onChange={setSelectedDate}
                            placeholder={LABELS.selectDate}
                            unavailableDates={unavailableDates}
                            disablePast
                            variant="banner"
                          />
                        </div>

                        <div className="w-full sm:w-[180px] flex-shrink-0 bg-white rounded-2xl p-4 flex flex-col gap-1.5">
                          <span className="text-[15px] font-semibold text-[#111] leading-[160%]">
                            {LABELS.participantsLabel}{" "}
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
                          </div>
                        </div>
                      </div>

                      <div className="3xl:hidden bg-white rounded-2xl p-4 flex flex-col gap-3 w-full">
                        <span className="text-[15px] font-semibold text-[#111] leading-[160%]">
                          {LABELS.additionalInformation}
                        </span>
                        <textarea
                          className="w-full h-16 px-3 py-2 rounded-[10px] border border-[#d9d9d9] text-[15px] text-[#111] placeholder:text-[#999] resize-none outline-none focus:border-[#e84814]"
                          placeholder={LABELS.comment}
                          value={comment}
                          onChange={(e) => setComment(e.target.value)}
                        />
                        <CheckboxRow
                          checked={privacy}
                          onChange={setPrivacy}
                          label={LABELS.acceptPrivacyLabel}
                          href={LABELS.privacyUrl}
                        />
                        <CheckboxRow
                          checked={terms}
                          onChange={setTerms}
                          label={LABELS.acceptTermsLabel}
                          href={LABELS.termsUrl}
                        />
                      </div>

                      {participants.map((p) => (
                        <ParticipantBlock
                          key={p.id}
                          p={p}
                          centerHeights={measurements.height}
                          centerWeights={measurements.weight}
                          centerShoes={measurements.shoe_size}
                          genderOptions={genderOptions}
                          agencies={agencies}
                          requiresCert={requiresCert}
                          onChange={updateParticipant}
                          onToggleEquip={toggleEquip}
                          onToggleExpand={toggleExpand}
                          onToggleEquipSection={toggleEquipSection}
                          onChangeCert={updateCert}
                        />
                      ))}
                      <div className="3xl:hidden w-full">
                        <ReservationSummary
                          courseTitle={courseTitle}
                          currency={currency}
                          participants={participants}
                          pricePerPerson={pricePerPerson}
                          onBook={handleSubmit}
                          isSubmitting={isSubmitting}
                          submitError={submitError}
                          submitSuccess={submitSuccess}
                          disabled={!formValid}
                          recaptchaRef={recaptchaRef}
                          onCaptchaChange={setCaptchaToken}
                          payment={payment}
                          widgetReady={widgetReady}
                          paymentError={paymentError}
                          locale={locale}
                        />
                      </div>
                    </div>

                    <div className="hidden 3xl:flex flex-col gap-3 w-[427px] flex-shrink-0 sticky top-4">
                      <div className="bg-white rounded-2xl p-4 flex flex-col gap-3">
                        <span className="text-[14px] font-medium text-[#111]">
                          {LABELS.additionalInformation}
                        </span>
                        <textarea
                          className="w-full h-20 px-3 py-2 rounded-[10px] border border-[#d9d9d9] text-[15px] text-[#111] placeholder:text-[#999] resize-none outline-none focus:border-[#e84814]"
                          placeholder={LABELS.comment}
                          value={comment}
                          onChange={(e) => setComment(e.target.value)}
                        />
                        <CheckboxRow
                          checked={privacy}
                          onChange={setPrivacy}
                          label={LABELS.acceptPrivacyLabel}
                          href={LABELS.privacyUrl}
                        />
                        <CheckboxRow
                          checked={terms}
                          onChange={setTerms}
                          label={LABELS.acceptTermsLabel}
                          href={LABELS.termsUrl}
                        />
                      </div>

                      <ReservationSummary
                        courseTitle={courseTitle}
                        currency={currency}
                        participants={participants}
                        pricePerPerson={pricePerPerson}
                        onBook={handleSubmit}
                        isSubmitting={isSubmitting}
                        submitError={submitError}
                        submitSuccess={submitSuccess}
                        disabled={!formValid}
                        recaptchaRef={recaptchaRef}
                        onCaptchaChange={setCaptchaToken}
                        payment={payment}
                        widgetReady={widgetReady}
                        paymentError={paymentError}
                        locale={locale}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default BookingFormModal;
