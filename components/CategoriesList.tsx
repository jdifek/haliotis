"use client";
import { useState } from "react";

type Category = {
  id: string;
  label: string;
};

const categories: Category[] = [
  { id: "promotions", label: "Promotions" },
  { id: "freediving", label: "Freediving" },
  { id: "referral", label: "Referral" },
  { id: "beginner", label: "Beginner" },
  { id: "advanced", label: "Advanced" },
  { id: "rescue", label: "Rescue" },
  { id: "specialties", label: "Specialties" },
  { id: "aware", label: "AWARE" },
  { id: "sidemount", label: "Sidemount" },
  { id: "caverns", label: "Caverns" },
  { id: "divemaster", label: "Divemaster" },
  { id: "dive-instructor", label: "Dive Instructor" },
  { id: "specialty-instructor", label: "Specialty Instructor" },
  { id: "first-aid", label: "First Aid" },
  { id: "junior", label: "Junior" },
  { id: "reactivate", label: "ReActivate" },
  { id: "tec-diving", label: "Tec Diving" },
  { id: "safety", label: "Safety" },
  { id: "try-dive", label: "Try Dive" },
  { id: "snorkeling", label: "Snorkeling" },
];

export const CategoriesList = () => {
  const [activeCategory, setActiveCategory] = useState("promotions");

  return (
    <div
      className="rounded-[24px] bg-white p-2"
      style={{ width: "285px" }}
    >
      <div
        className="rounded-[24px] bg-[#f1f1f1] p-[10px_15px]"
        style={{ width: "269px" }}
      >
        {/* Header */}
        <h3
          className="mb-3 text-start text-[15px] font-semibold leading-[160%] text-[#111]"
          style={{ fontFamily: "var(--font-family)" }}
        >
          Categories
        </h3>

        {/* Categories List */}
        <div className="flex flex-col gap-2">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`flex h-10 w-full cursor-pointer items-center justify-between rounded-[10px] border-2 px-3 py-2 transition-all ${
                activeCategory === category.id
                  ? "border-[#e84814] bg-[#e84814] text-white"
                  : "border-[#d9d9d9] bg-white text-[#111] hover:border-[#e84814]"
              }`}
              style={{ width: "239px" }}
            >
              <span
                className="text-center text-[15px] font-normal leading-[160%]"
                style={{ fontFamily: "var(--font-family)" }}
              >
                {category.label}
              </span>

              {/* Arrow Icon */}
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M9.8537 6.14663L14.8534 11.1463C14.8999 11.1927 14.9367 11.2478 14.9619 11.3085C14.9871 11.3692 15 11.4343 15 11.5C15 11.5657 14.9871 11.6308 14.9619 11.6915C14.9367 11.7522 14.8999 11.8073 14.8534 11.8537L9.8537 16.8534C9.78377 16.9234 9.69465 16.971 9.59762 16.9904C9.50058 17.0097 9.39999 16.9998 9.30859 16.9619C9.21718 16.924 9.13907 16.8599 9.08414 16.7776C9.0292 16.6953 8.99992 16.5986 9 16.4996L9 6.50036C8.99992 6.40142 9.0292 6.30468 9.08414 6.22239C9.13907 6.1401 9.21718 6.07595 9.30859 6.03808C9.39999 6.00021 9.50058 5.99031 9.59761 6.00963C9.69465 6.02895 9.78377 6.07663 9.8537 6.14663Z"
                  fill={activeCategory === category.id ? "white" : "#E84814"}
                />
              </svg>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};