/* eslint-disable react/no-unescaped-entities */
"use client";

import { useState } from "react";
import Image from "next/image";
import { Tabs } from "../buttons/Tabs";

import type { CenterTabs } from "@/types/center";
type Props = { tabs: CenterTabs };
export const CenterInfoSection = ({ tabs }: Props) => {
  const tabsList = [
    { id: "berlengas", label: tabs.diving_center_information?.title },
    { id: "facilities", label: tabs.diving_center_facilities?.title },
    { id: "boats", label: tabs.diving_center_boats?.title },
    { id: "history", label: tabs.diving_center_history?.title },
    { id: "team", label: tabs.diving_center_team_members?.title },
  ].filter((t) => t.label); 
  const [activeTab, setActiveTab] = useState(
    tabs.diving_center_information
      ? "berlengas"
      : tabs.diving_center_facilities
      ? "facilities"
      : tabs.diving_center_boats
      ? "boats"
      : "history"
  );
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isTabOpen, setIsTabOpen] = useState(false);

  const infoEntities = tabs.diving_center_information?.entities ?? [];
  const facilitiesFilters = infoEntities
    .filter((e) => e.enumeration) 
    .map((e) => ({
      key: e.enumeration!.key,
      label: e.enumeration!.category.toUpperCase(),
    }));
  const [selectedFilter, setSelectedFilter] = useState(
    infoEntities[0]?.enumeration?.key ?? ""
  );

  // Добавь эти стейты после существующих
  const [openDetailsIndex, setOpenDetailsIndex] = useState<number | null>(null);
  const [openFacilityId, setOpenFacilityId] = useState<number | null>(null);
  const [openHistoryId, setOpenHistoryId] = useState<number | null>(null);

  const [isHistorySunfishOpen, setIsHistorySunfishOpen] = useState(false);
  const renderContent = () => {
    switch (activeTab) {
      case "berlengas":
        return (
          <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
            {/* Sidebar with filters - Mobile Accordion */}
            <div className="lg:hidden">
              <div className="flex flex-col gap-2">
                {/* Header button */}
                <button
                  onClick={() => setIsFilterOpen(!isFilterOpen)}
                  className="flex items-center cursor-pointer justify-between rounded-lg px-3.5 py-2.5 h-[44px] bg-[#e84814]"
                >
                  <span className="text-[16px] font-bold leading-[120%] uppercase text-[#f1f1f1]">
                    {facilitiesFilters.length > 0
                      ? facilitiesFilters.find((f) => f.key === selectedFilter)
                          ?.label ?? ""
                      : ""}
                  </span>
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className={`transition-transform ${
                      isFilterOpen ? "rotate-180" : ""
                    }`}
                  >
                    <path
                      d="M17.8534 9.85369L12.8537 14.8534C12.8073 14.8999 12.7522 14.9367 12.6915 14.9619C12.6308 14.9871 12.5657 15 12.5 15C12.4343 15 12.3692 14.9871 12.3085 14.9619C12.2478 14.9367 12.1927 14.8999 12.1463 14.8534L7.14663 9.85369C7.07663 9.78377 7.02895 9.69465 7.00963 9.59761C6.9903 9.50058 7.00021 9.39999 7.03808 9.30858C7.07595 9.21718 7.1401 9.13907 7.22239 9.08413C7.30468 9.0292 7.40142 8.99992 7.50036 9H17.4996C17.5986 8.99992 17.6953 9.0292 17.7776 9.08413C17.8599 9.13907 17.924 9.21718 17.9619 9.30858C17.9998 9.39999 18.0097 9.50058 17.9904 9.59761C17.971 9.69465 17.9234 9.78377 17.8534 9.85369Z"
                      fill="#F1F1F1"
                    />
                  </svg>
                </button>

                {/* Expanded list */}
                {isFilterOpen && (
                  <div className="lg:hidden bg-white  rounded-2xl border-2 border-gray-200">
                    <div className="flex flex-col gap-2">
                      {" "}
                      {facilitiesFilters.map((filter) => {
                        const isSelected = filter.key === selectedFilter;
                        return (
                          <button
                            key={filter.key}
                            onClick={() => {
                              setSelectedFilter(filter.key);
                              setIsFilterOpen(false);
                            }}
                            className={`flex items-center cursor-pointer justify-between rounded-lg px-3.5 py-2.5 transition-colors h-[44px] ${
                              isSelected
                                ? "bg-[#e84814]"
                                : "bg-white hover:bg-gray-50"
                            }`}
                          >
                            <span
                              className={`text-start uppercase leading-[120%] ${
                                isSelected
                                  ? "text-[16px] font-bold text-[#f1f1f1]"
                                  : "text-[15px] font-normal text-black"
                              }`}
                            >
                              {filter.label}
                            </span>
                            {isSelected && (
                              <svg
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  d="M9.8537 6.14663L14.8534 11.1463C14.8999 11.1927 14.9367 11.2478 14.9619 11.3085C14.9871 11.3692 15 11.4343 15 11.5C15 11.5657 14.9871 11.6308 14.9619 11.6915C14.9367 11.7522 14.8999 11.8073 14.8534 11.8537L9.8537 16.8534C9.78377 16.9234 9.69465 16.971 9.59762 16.9904C9.50058 17.0097 9.39999 16.9998 9.30859 16.9619C9.21718 16.924 9.13907 16.8599 9.08414 16.7776C9.0292 16.6953 8.99992 16.5986 9 16.4996L9 6.50036C8.99992 6.40142 9.0292 6.30468 9.08414 6.22239C9.13907 6.1401 9.21718 6.07595 9.30859 6.03808C9.39999 6.00021 9.50058 5.99031 9.59761 6.00963C9.69465 6.02895 9.78377 6.07663 9.8537 6.14663Z"
                                  fill="#F1F1F1"
                                />
                              </svg>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Sidebar with filters - Desktop */}
            <div className="hidden lg:block w-full lg:w-[285px] flex-shrink-0">
              <div className="bg-white rounded-2xl ">
                <h3 className="text-[18px] font-medium leading-[140%] text-[#111] mb-4">
                  Berlengas Information
                </h3>
                <div className="flex flex-col gap-2 ">
                  {facilitiesFilters.map((filter) => (
                    <button
                      key={filter.key}
                      onClick={() => setSelectedFilter(filter.key)}
                      className={`w-full text-left px-4 py-2.5 rounded-lg text-[15px] font-medium leading-[160%] transition-colors ${
                        selectedFilter === filter.key
                          ? "bg-[#e84814] cursor-pointer text-white"
                          : "bg-[#f1f1f1] cursor-pointer text-[#111] hover:bg-[#e5e5e5]"
                      }`}
                    >
                      {filter.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1">
              {(() => {
                const entity = infoEntities.find(
                  (e) => e.enumeration?.key === selectedFilter
                );
                if (!entity) return null;
                return (
                  <>
                    <div className="mb-6">
                      <Image
                        src={entity.image_path}
                        alt={entity.enumeration?.category ?? ""}
                        width={1228}
                        height={538}
                        className="w-full rounded-2xl md:h-[538px] h-[154px]"
                      />
                    </div>
                    <div
                      className="text-[15px] font-medium leading-[160%] text-[#101010] opacity-80"
                      dangerouslySetInnerHTML={{
                        __html: entity.information ?? "",
                      }}
                    />
                  </>
                );
              })()}
            </div>
          </div>
        );

      case "facilities":
        if (!tabs.diving_center_facilities?.entities) {
          return <p>No facilities information available</p>;
        }
        return (
          <div className="flex flex-col gap-6">
            <p className="text-[15px] font-medium leading-[160%] text-[#111]">
              {tabs.diving_center_facilities?.description}
            </p>

            {/* Desktop: 3-column grid | Mobile: accordion list */}
            <div className="hidden md:grid md:grid-cols-3 md:gap-x-6 md:gap-y-8">
              {tabs.diving_center_facilities.entities.map((item) => (
                <div key={item.id} className="flex flex-col gap-3">
                  <h3 className="text-[18px] font-medium leading-[140%] text-[#111]">
                    {item.title}
                  </h3>
                  <Image
                    src={item.image_path}
                    alt={item.title ?? ""}
                    width={495}
                    height={285}
                    className="w-full h-[285px] rounded-2xl object-cover"
                  />
                  <p className="text-[15px] font-medium leading-[160%] text-[#101010] opacity-80">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>

            {/* Mobile: accordion list */}
            <div className="flex flex-col gap-6 md:hidden">
              {tabs.diving_center_facilities.entities.map((item) => (
                <div key={item.id}>
                  <button
                    onClick={() =>
                      setOpenFacilityId(
                        openFacilityId === item.id ? null : item.id
                      )
                    }
                    className="w-full flex items-center justify-between text-[18px] font-medium leading-[140%] text-[#111] mb-4"
                  >
                    <span>{item.title}</span>
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className={`transition-transform ${
                        openFacilityId ? "" : "rotate-180"
                      }`}
                    >
                      <path
                        d="M17.8534 14.1463L12.8537 9.14663C12.8073 9.10015 12.7522 9.06327 12.6915 9.03811C12.6308 9.01295 12.5657 9 12.5 9C12.4343 9 12.3692 9.01295 12.3085 9.03811C12.2478 9.06327 12.1927 9.10015 12.1463 9.14663L7.14663 14.1463C7.07663 14.2162 7.02895 14.3053 7.00963 14.4024C6.9903 14.4994 7.00021 14.6 7.03808 14.6914C7.07595 14.7828 7.1401 14.8609 7.22239 14.9159C7.30468 14.9708 7.40142 15.0001 7.50036 15L17.4996 15C17.5986 15.0001 17.6953 14.9708 17.7776 14.9159C17.8599 14.8609 17.924 14.7828 17.9619 14.6914C17.9998 14.6 18.0097 14.4994 17.9904 14.4024C17.971 14.3053 17.9234 14.2162 17.8534 14.1463Z"
                        fill="black"
                      />
                    </svg>{" "}
                  </button>
                  {openFacilityId === item.id && (
                    <div className="flex flex-col gap-4">
                      <Image
                        src={item.image_path}
                        alt={item.title ?? ""}
                        width={495}
                        height={285}
                        className="w-full h-[200px] rounded-2xl object-cover"
                      />
                      <p className="text-[15px] font-medium leading-[160%] text-[#101010] opacity-80">
                        {item.description}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        );
      case "boats":
        if (!tabs.diving_center_boats?.entities) {
          return <p>No boats information available</p>;
        }
        return (
          <div className="flex gap-8">
            {tabs.diving_center_history.entities.map((item) => (
              <div key={item.id} className="flex-1">
                <div
                  className={`${
                    openHistoryId === item.id ? "block" : "hidden"
                  } md:block flex flex-col gap-4`}
                >
                  <Image
                    src={item.image_path}
                    alt={item.title ?? ""}
                    width={757}
                    height={435}
                    className="w-full h-[200px] md:h-[435px] rounded-2xl"
                  />
                  <button
                    onClick={() =>
                      setOpenHistoryId(
                        openHistoryId === item.id ? null : item.id
                      )
                    }
                    className="w-full flex items-center justify-between text-[24px] font-medium leading-[140%] text-[#111] mt-2 mb-2 md:pointer-events-none"
                  >
                    <span>{item.title}</span>
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className={`md:hidden transition-transform ${
                        openHistoryId === item.id ? "" : "rotate-180"
                      }`}
                    >
                      <path
                        d="M17.8534 14.1463L12.8537 9.14663C12.8073 9.10015 12.7522 9.06327 12.6915 9.03811C12.6308 9.01295 12.5657 9 12.5 9C12.4343 9 12.3692 9.01295 12.3085 9.03811C12.2478 9.06327 12.1927 9.10015 12.1463 9.14663L7.14663 14.1463C7.07663 14.2162 7.02895 14.3053 7.00963 14.4024C6.9903 14.4994 7.00021 14.6 7.03808 14.6914C7.07595 14.7828 7.1401 14.8609 7.22239 14.9159C7.30468 14.9708 7.40142 15.0001 7.50036 15L17.4996 15C17.5986 15.0001 17.6953 14.9708 17.7776 14.9159C17.8599 14.8609 17.924 14.7828 17.9619 14.6914C17.9998 14.6 18.0097 14.4994 17.9904 14.4024C17.971 14.3053 17.9234 14.2162 17.8534 14.1463Z"
                        fill="black"
                      />
                    </svg>
                  </button>
                  <div
                    className="text-[15px] font-medium leading-[160%] text-[#101010] opacity-80"
                    dangerouslySetInnerHTML={{ __html: item.description ?? "" }}
                  />
                </div>
              </div>
            ))}
          </div>
        );

      case "history":
        if (!tabs.diving_center_history?.entities) {
          return <p>No history information available</p>;
        }
        return (
          <div className="flex  gap-8">
            {/* Peniche */}
            {tabs.diving_center_history.entities.map((item) => (
              <div key={item.id} className="flex-1">
                <div
                  className={`${
                    openHistoryId === item.id ? "block" : "hidden"
                  } md:block flex flex-col gap-4`}
                >
                  <Image
                    src={item.image_path}
                    alt={item.title ?? ""}
                    width={757}
                    height={435}
                    className="w-full h-[200px] md:h-[435px] rounded-2xl"
                  />
                  <button
                    onClick={() =>
                      setOpenHistoryId(
                        openHistoryId === item.id ? null : item.id
                      )
                    }
                    className="w-full flex items-center justify-between text-[24px] font-medium leading-[140%] text-[#111] mt-2 mb-2 md:pointer-events-none"
                  >
                    <span>{item.title}</span>
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className={`md:hidden transition-transform ${
                        openHistoryId === item.id ? "" : "rotate-180"
                      }`}
                    >
                      <path
                        d="M17.8534 14.1463L12.8537 9.14663C12.8073 9.10015 12.7522 9.06327 12.6915 9.03811C12.6308 9.01295 12.5657 9 12.5 9C12.4343 9 12.3692 9.01295 12.3085 9.03811C12.2478 9.06327 12.1927 9.10015 12.1463 9.14663L7.14663 14.1463C7.07663 14.2162 7.02895 14.3053 7.00963 14.4024C6.9903 14.4994 7.00021 14.6 7.03808 14.6914C7.07595 14.7828 7.1401 14.8609 7.22239 14.9159C7.30468 14.9708 7.40142 15.0001 7.50036 15L17.4996 15C17.5986 15.0001 17.6953 14.9708 17.7776 14.9159C17.8599 14.8609 17.924 14.7828 17.9619 14.6914C17.9998 14.6 18.0097 14.4994 17.9904 14.4024C17.971 14.3053 17.9234 14.2162 17.8534 14.1463Z"
                        fill="black"
                      />
                    </svg>{" "}
                  </button>
                  <div
                    className="text-[15px] font-medium leading-[160%] text-[#101010] opacity-80"
                    dangerouslySetInnerHTML={{ __html: item.description ?? "" }}
                  />
                </div>
              </div>
            ))}

            {/* Sunfish */}
            <div className="flex-1">
              <div
                className={`${
                  isHistorySunfishOpen ? "block" : "hidden"
                } md:block flex flex-col gap-4`}
              >
                <Image
                  src="/Rectangle 8.png"
                  alt="Sunfish"
                  width={757}
                  height={435}
                  className="w-full h-[200px] md:h-[435px] rounded-2xl"
                />
                <button
                  onClick={() => setIsHistorySunfishOpen(!isHistorySunfishOpen)}
                  className="w-full flex items-center justify-between text-[24px] font-medium leading-[140%] text-[#111] mt-2 mb-2 md:pointer-events-none"
                >
                  <span>Sunfish</span>
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className={`md:hidden transition-transform ${
                      isHistorySunfishOpen ? "" : "rotate-180"
                    }`}
                  >
                    <path
                      d="M17.8534 14.1463L12.8537 9.14663C12.8073 9.10015 12.7522 9.06327 12.6915 9.03811C12.6308 9.01295 12.5657 9 12.5 9C12.4343 9 12.3692 9.01295 12.3085 9.03811C12.2478 9.06327 12.1927 9.10015 12.1463 9.14663L7.14663 14.1463C7.07663 14.2162 7.02895 14.3053 7.00963 14.4024C6.9903 14.4994 7.00021 14.6 7.03808 14.6914C7.07595 14.7828 7.1401 14.8609 7.22239 14.9159C7.30468 14.9708 7.40142 15.0001 7.50036 15L17.4996 15C17.5986 15.0001 17.6953 14.9708 17.7776 14.9159C17.8599 14.8609 17.924 14.7828 17.9619 14.6914C17.9998 14.6 18.0097 14.4994 17.9904 14.4024C17.971 14.3053 17.9234 14.2162 17.8534 14.1463Z"
                      fill="black"
                    />
                  </svg>
                </button>
                <p className="text-[15px] font-medium leading-[160%] text-[#101010] opacity-80">
                  Sunfish is the ex libris of Berlengas. His scientific name is
                  Mola mola and it's the largest known fish with bones. It can
                  reach 4 meters of height and 2300 kg weight. The large female
                  can put around 300 000 000 eggs.
                </p>
                <p className="text-[15px] font-medium leading-[160%] text-[#101010] opacity-80">
                  It has curious behaviors like "relax" in the surface in side
                  and its brightness is reflected and visible from a distance.
                  It also jumps out of the water which makes it a great show.
                </p>
                <p className="text-[15px] font-medium leading-[160%] text-[#101010] opacity-80">
                  Actually, the sunfish in Berlengas in the end of the Summer is
                  an expected moment. There are already groups of divers that
                  come from Germany and France just to see it.
                </p>
              </div>
            </div>
          </div>
        );

      case "team":
        return (
          <div className="flex flex-col gap-6">
            <p className="text-[15px] font-medium leading-[160%] text-[#111] mb-2">
              {tabs.diving_center_team_members?.description}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
              {tabs.diving_center_team_members.entities.map((member) => (
                <div
                  key={member.id}
                  className="bg-[#f1f1f1] rounded-3xl p-2 flex flex-col gap-4"
                >
                  <Image
                    src={member.avatar_path ?? "/Rectangle 8.png"}
                    alt={member.name ?? ""}
                    width={348}
                    height={232}
                    className="w-full h-[232px] rounded-2xl object-cover"
                  />
                  <div className="px-3 py-4 h-full flex flex-col gap-3 bg-white rounded-2xl">
                    <div>
                      <h3 className="text-[24px] font-medium leading-[140%] text-black">
                        {member.name}
                      </h3>
                      <p className="text-[15px] font-semibold leading-[160%] text-black">
                        {member.job}
                      </p>
                    </div>

                    <button
                      onClick={() =>
                        setOpenDetailsIndex(
                          openDetailsIndex === member.id ? null : member.id
                        )
                      }
                      className="md:hidden flex items-center justify-between text-[15px] font-medium leading-[160%] text-[#e84814]"
                    >
                      <span>Details</span>
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className={`transition-transform ${
                          openDetailsIndex === member.id ? "" : "rotate-180"
                        }`}
                      >
                        <path
                          d="M17.8534 14.1463L12.8537 9.14663C12.8073 9.10015 12.7522 9.06327 12.6915 9.03811C12.6308 9.01295 12.5657 9 12.5 9C12.4343 9 12.3692 9.01295 12.3085 9.03811C12.2478 9.06327 12.1927 9.10015 12.1463 9.14663L7.14663 14.1463C7.07663 14.2162 7.02895 14.3053 7.00963 14.4024C6.9903 14.4994 7.00021 14.6 7.03808 14.6914C7.07595 14.7828 7.1401 14.8609 7.22239 14.9159C7.30468 14.9708 7.40142 15.0001 7.50036 15L17.4996 15C17.5986 15.0001 17.6953 14.9708 17.7776 14.9159C17.8599 14.8609 17.924 14.7828 17.9619 14.6914C17.9998 14.6 18.0097 14.4994 17.9904 14.4024C17.971 14.3053 17.9234 14.2162 17.8534 14.1463Z"
                          fill="#E84814"
                        />
                      </svg>{" "}
                    </button>

                    <div
                      className={`${
                        openDetailsIndex === member.id ? "block" : "hidden"
                      } md:block flex flex-col gap-3`}
                    >
                      <a
                        href={`mailto:${member.email}`}
                        className="flex items-center gap-2 text-[15px] font-medium leading-[160%] text-[#111] underline"
                      >
                        <svg
                          width="20"
                          height="16"
                          viewBox="0 0 20 16"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M18.4615 5.18629L15.9523 6.58992C13.9598 7.70401 12.8224 8.34967 11.6014 8.60242C10.5449 8.82104 9.45511 8.82104 8.39864 8.60242C7.17767 8.34967 6.04023 7.70401 4.04768 6.58992L1.53846 5.18629V11.9226C1.53846 12.5135 1.53891 12.9103 1.5637 13.2157C1.58777 13.512 1.63098 13.6537 1.67829 13.7472C1.80121 13.9899 1.99728 14.1873 2.23838 14.3109C2.33126 14.3585 2.47235 14.402 2.76683 14.4262C3.07026 14.4511 3.4643 14.4516 4.05128 14.4516H15.9487C16.5357 14.4516 16.9297 14.4511 17.2332 14.4262C17.5277 14.402 17.6688 14.3585 17.7616 14.3109C18.0028 14.1872 18.1989 13.9899 18.3217 13.7472C18.369 13.6537 18.4122 13.5117 18.4363 13.2153C18.4611 12.9099 18.4615 12.5133 18.4615 11.9226V5.18629ZM4.05128 1.54839C3.4643 1.54839 3.07027 1.54885 2.76683 1.57379C2.47234 1.59801 2.33126 1.64148 2.23838 1.68911C1.99723 1.8128 1.80118 2.01011 1.67829 2.25282C1.63096 2.3463 1.58776 2.48829 1.5637 2.78468C1.54954 2.95923 1.54403 3.16358 1.54127 3.41694L4.79487 5.23629C6.87458 6.39911 7.77348 6.89188 8.70873 7.08548C9.56069 7.26176 10.4393 7.26176 11.2913 7.08548C12.2266 6.89188 13.1254 6.39911 15.2051 5.23629L18.4583 3.41694C18.4556 3.16358 18.4505 2.95923 18.4363 2.78468C18.4122 2.48829 18.369 2.3463 18.3217 2.25282C18.1989 2.01016 18.0028 1.81283 17.7616 1.68911C17.6688 1.6415 17.528 1.59801 17.2336 1.57379C16.9301 1.54884 16.5358 1.54839 15.9487 1.54839H4.05128ZM20 11.9226C20 12.4879 20.0006 12.9584 19.9696 13.3415C19.9377 13.7336 19.8689 14.1019 19.6927 14.45C19.4223 14.9842 18.9907 15.4186 18.4599 15.6907C18.1141 15.8681 17.7482 15.9373 17.3586 15.9694C16.9779 16.0007 16.5104 16 15.9487 16H4.05128C3.4896 16 3.02206 16.0007 2.64143 15.9694C2.30048 15.9413 1.97777 15.8846 1.67067 15.752L1.54006 15.6907C1.00926 15.4186 0.577681 14.9841 0.307293 14.45C0.131073 14.1019 0.0622795 13.7336 0.0304497 13.3415C-0.000643678 12.9584 1.02212e-06 12.4879 1.02212e-06 11.9226V4.07742C1.02212e-06 4.01246 0.00116975 3.94876 0.00120295 3.88629C0.00091465 3.87232 0.000734902 3.85837 0.00120295 3.84436C0.00160782 3.3814 0.00373116 2.98764 0.0304497 2.65847C0.0622812 2.26636 0.131071 1.89812 0.307293 1.55C0.5777 1.01585 1.00933 0.581427 1.54006 0.309275C1.88595 0.131916 2.25183 0.0626829 2.64143 0.0306462C3.02206 -0.000649378 3.4896 1.03584e-06 4.05128 1.03584e-06H15.9487C16.5104 1.03528e-06 16.9779 -0.000647846 17.3586 0.0306462C17.7482 0.0626813 18.1141 0.131919 18.4599 0.309275C18.9906 0.581408 19.4223 1.01577 19.6927 1.55L19.7536 1.68145C19.8853 1.99053 19.9417 2.31533 19.9696 2.65847C19.9963 2.98765 19.9984 3.3814 19.9988 3.84436C19.9993 3.85837 19.9991 3.87232 19.9988 3.88629C19.9988 3.94876 20 4.01246 20 4.07742V11.9226Z"
                            fill="#E84814"
                          />
                        </svg>
                        {member.email}
                      </a>

                      {member.certifications?.diving &&
                        member.certifications.diving.length > 0 && (
                          <div>
                            <h4 className="text-[15px] font-semibold leading-[160%] text-black mb-1">
                              Diving certifications
                            </h4>
                            {member.certifications.diving.map((cert) => (
                              <p
                                key={cert.id}
                                className="text-[15px] font-medium leading-[160%] text-black"
                              >
                                {cert.title}
                              </p>
                            ))}
                          </div>
                        )}

                      {member.certifications?.nautical &&
                        member.certifications.nautical.length > 0 && (
                          <div>
                            <h4 className="text-[15px] font-semibold leading-[160%] text-black mb-1">
                              Nautical certifications
                            </h4>
                            {member.certifications.nautical.map((cert) => (
                              <p
                                key={cert.id}
                                className="text-[15px] font-medium leading-[160%] text-black"
                              >
                                {cert.title}
                              </p>
                            ))}
                          </div>
                        )}

                      {member.academic_background && (
                        <div>
                          <h4 className="text-[15px] font-semibold leading-[160%] text-black mb-1">
                            Academic formation
                          </h4>
                          <p className="text-[15px] font-medium leading-[160%] text-black">
                            {member.academic_background}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <section className="bg-white py-6 md:py-12 lg:py-16">
      <div className="mx-auto max-w-[1920px] px-4 md:px-8 lg:px-[188px]">
        {/* Tabs Navigation - Desktop */}
        <Tabs
          tabs={tabsList}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />

        {/* Tabs Navigation - Mobile Accordion */}
        <div className="mb-4 md:hidden">
          <div className="flex flex-col gap-2">
            {/* Header button */}
            <button
              onClick={() => setIsTabOpen(!isTabOpen)}
              className="flex items-center cursor-pointer justify-between rounded-lg px-3.5 py-2.5 h-[48px] bg-white border-2 border-[#e84814]"
            >
              <span className="text-[20px] font-medium leading-[140%] text-black">
                {tabsList.find((tab) => tab.id === activeTab)?.label}
              </span>
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className={`transition-transform ${
                  isTabOpen ? "rotate-180" : ""
                }`}
              >
                <path
                  d="M17.8534 9.85369L12.8537 14.8534C12.8073 14.8999 12.7522 14.9367 12.6915 14.9619C12.6308 14.9871 12.5657 15 12.5 15C12.4343 15 12.3692 14.9871 12.3085 14.9619C12.2478 14.9367 12.1927 14.8999 12.1463 14.8534L7.14663 9.85369C7.07663 9.78377 7.02895 9.69465 7.00963 9.59761C6.9903 9.50058 7.00021 9.39999 7.03808 9.30858C7.07595 9.21718 7.1401 9.13907 7.22239 9.08413C7.30468 9.0292 7.40142 8.99992 7.50036 9H17.4996C17.5986 8.99992 17.6953 9.0292 17.7776 9.08413C17.8599 9.13907 17.924 9.21718 17.9619 9.30858C17.9998 9.39999 18.0097 9.50058 17.9904 9.59761C17.971 9.69465 17.9234 9.78377 17.8534 9.85369Z"
                  fill="black"
                />
              </svg>
            </button>

            {/* Expanded list */}
            {isTabOpen && (
              <div className="bg-white rounded-lg border-2 border-gray-200">
                <div className="flex flex-col gap-2">
                  {tabsList.map((tab) => {
                    const isSelected = tab.id === activeTab;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => {
                          setActiveTab(tab.id);
                          setIsTabOpen(false);
                        }}
                        className={`flex items-center cursor-pointer justify-between rounded-lg px-3.5 py-2.5 transition-colors h-[48px] ${
                          isSelected ? "bg-[#e84814]" : "bg-white"
                        }`}
                      >
                        <span
                          className={`text-start leading-[140%] ${
                            isSelected
                              ? "text-[20px] font-medium text-white"
                              : "text-[18px] font-normal text-black"
                          }`}
                        >
                          {tab.label}
                        </span>
                        {isSelected && (
                          <svg
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                          >
                            <path
                              d="M9.8537 6.14663L14.8534 11.1463C14.8999 11.1927 14.9367 11.2478 14.9619 11.3085C14.9871 11.3692 15 11.4343 15 11.5C15 11.5657 14.9871 11.6308 14.9619 11.6915C14.9367 11.7522 14.8999 11.8073 14.8534 11.8537L9.8537 16.8534C9.78377 16.9234 9.69465 16.971 9.59762 16.9904C9.50058 17.0097 9.39999 16.9998 9.30859 16.9619C9.21718 16.924 9.13907 16.8599 9.08414 16.7776C9.0292 16.6953 8.99992 16.5986 9 16.4996L9 6.50036C8.99992 6.40142 9.0292 6.30468 9.08414 6.22239C9.13907 6.1401 9.21718 6.07595 9.30859 6.03808C9.39999 6.00021 9.50058 5.99031 9.59761 6.00963C9.69465 6.02895 9.78377 6.07663 9.8537 6.14663Z"
                              fill="white"
                            />
                          </svg>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Tab Content */}
        <div className="animate-fadeIn">{renderContent()}</div>
      </div>
    </section>
  );
};
