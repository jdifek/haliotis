"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import {
  usePhoneInput,
  defaultCountries,
  parseCountry,
} from "react-international-phone";
import "react-international-phone/style.css";
import ReactCountryFlag from "react-country-flag";

const Portal = ({ children }) => {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;
  return createPortal(children, document.body);
};

const ChevronDown = ({ className = "" }) => (
  <svg width="11" height="7" viewBox="0 0 11 7" fill="currentColor" className={className}>
    <path d="M5.5 7L0.9375 1.625C0.71875 1.375 0.90625 1 1.21875 1H9.75C10.0625 1 10.25 1.375 10.0312 1.625L5.5 7Z" />
  </svg>
);

const EXCLUDED_COUNTRIES = ["ru", "by"];

// value / onChange — полная строка вида "+351912345678"
export default function BookingPhoneField({
  value = "",
  onChange,
  placeholder = "Phone Number *",
  defaultCountry = "pt", // ← дефолт Португалия
  extraBorder = false,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [pos, setPos] = useState({ top: 0, left: 0, width: 0 });
  const triggerRef = useRef(null);
  const dropdownRef = useRef(null);

  const { inputValue, handlePhoneValueChange, country, setCountry } =
    usePhoneInput({
      defaultCountry,
      disableDialCodeAndPrefix: true, // код страны не редактируется руками
    });

  const countries = useMemo(
    () =>
      defaultCountries
        .map((c) => parseCountry(c))
        .filter((c) => !EXCLUDED_COUNTRIES.includes(c.iso2)),
    []
  );

  // Отдаём наружу полный номер. Если цифр ещё нет — отдаём "", чтобы
  // валидация формы не считала поле заполненным раньше времени.
  useEffect(() => {
    onChange?.(inputValue ? `+${country.dialCode}${inputValue}` : "");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [country.dialCode, inputValue]);

  const open = () => {
    if (triggerRef.current) {
      const r = triggerRef.current.getBoundingClientRect();
      setPos({
        top: r.bottom + window.scrollY + 4,
        left: r.left + window.scrollX,
        width: r.width,
      });
    }
    setIsOpen(true);
  };

  useEffect(() => {
    const handler = (e) => {
      if (
        triggerRef.current &&
        !triggerRef.current.contains(e.target) &&
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target)
      ) {
        setIsOpen(false);
      }
    };
    if (isOpen) document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [isOpen]);

  const parts = placeholder.split("*");
  const hasAsterisk = parts.length > 1;

  return (
    <div className="relative w-full">
      <div
        className={`flex items-center gap-1 px-1 py-2 rounded-[10px] border bg-white text-[15px] w-full focus-within:border-[#e84814] transition-colors ${
          extraBorder ? "border-[#e84814]" : "border-[#d9d9d9]"
        }`}
      >
        <button
          type="button"
          ref={triggerRef}
          onClick={() => (isOpen ? setIsOpen(false) : open())}
          className="flex items-center gap-1 pl-1 pr-1  border-r border-[#d9d9d9] shrink-0 cursor-pointer"
        >
          <ReactCountryFlag
            countryCode={country.iso2.toUpperCase()}
            svg
            style={{ width: 20, height: 20 }}
          />
          <span className="text-[#111]">+{country.dialCode}</span>
          <ChevronDown
            className={`text-[#d9d9d9] transition-transform ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </button>

        <input
          type="tel"
          inputMode="numeric"
          autoComplete="off"
          value={inputValue}
          onChange={handlePhoneValueChange}
          placeholder={hasAsterisk ? parts[0].trim() : placeholder}
          className="flex-1 min-w-0 pl-2 bg-transparent outline-none text-[#111] placeholder:text-[#111]"
        />
        {hasAsterisk && !inputValue && (
          <span className="text-[#e84814] pr-2">*</span>
        )}
      </div>

      {isOpen && (
        <Portal>
          <div
            ref={dropdownRef}
            style={{
              position: "absolute",
              top: pos.top,
              left: pos.left,
              minWidth: pos.width,
              width: "max-content",
              maxWidth: 280,
              zIndex: 99999,
            }}
            className="bg-white border border-[#d9d9d9] rounded-[10px] shadow-xl max-h-56 overflow-y-auto"
          >
            {countries.map((c) => (
              <button
                type="button"
                key={c.iso2}
                onClick={() => {
                  setCountry(c.iso2);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center gap-2 px-3 py-2 text-left text-[14px] hover:bg-[#f5f5f5] cursor-pointer ${
                  c.iso2 === country.iso2
                    ? "bg-[#f7e4de] text-[#e84814]"
                    : "text-[#111]"
                }`}
              >
                <ReactCountryFlag
                  countryCode={c.iso2.toUpperCase()}
                  svg
                  style={{ width: 18, height: 18 }}
                />
                <span className="truncate">{c.name}</span>
                <span className="ml-auto text-[#999]">+{c.dialCode}</span>
              </button>
            ))}
          </div>
        </Portal>
      )}
    </div>
  );
}