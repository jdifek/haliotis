/* eslint-disable react/no-unescaped-entities */
"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";

type Tab = {
  id: string;
  label: string;
};

const tabs: Tab[] = [
  { id: "berlengas", label: "Berlengas Information" },
  { id: "facilities", label: "Facilities" },
  { id: "boats", label: "Boats" },
  { id: "history", label: "History of the center" },
  { id: "team", label: "Team" },
];

const facilitiesFilters = [
  "GENERAL",
  "GEOGRAPHY",
  "GEOLOGY",
  "HISTORY",
  "FAUNA",
  "FLORA",
  "DIVING",
];

const boatsList = [
  {
    name: "Lascaris",
    image: "/Rectangle 8.png",
    description:
      "Our semi-rigid Searths with 12 meters, with 2 motors YAMAHA 350 horsepower is the best dive boat in Portugal. It has sounder, VHF, d-gps, tanks to equip, access ladders,oxygen kit and first aid kit; everything for the safety and welfare of divers . There is no excuse of discomfort that makes so many people leave dive in Portugal.",
  },
  {
    name: "Necora",
    image: "/Rectangle 8.png",
    description:
      "Our semi-rigid Searths with 9.6 meters, with two Yamaha 200 horsepower offboard engines is specially customized to diving conditions in Portugal. It has sounder, d-gps, oxygen kit and first aid kit; and for divers comfort , Necora is equipped with travelling seats and access ladders.",
  },
];

const teamMembers = [
  {
    name: "Pedro Oliveira",
    role: "Manager",
    image: "/Rectangle 8.png",
    email: "pedro.oliveira@haliotis.pt",
    divingCerts: [
      "PADI Course Director",
      "PADI TecRec Instructor Trainer",
      "EFR Instructor Trainer",
    ],
    nauticalCerts: ["Oceanic Skipper"],
  },
  {
    name: "Bruno Ribeiro",
    role: "Base Leader and Head of Training",
    image: "/Rectangle 8.png",
    email: "bruno.ribeiro@haliotis.pt",
    divingCerts: ["PADI Course Director", "EFR Instructor Trainer"],
    nauticalCerts: ["Coastal Skipper"],
    academicFormation: ["Marine Biology"],
  },
  {
    name: "José Alberto",
    role: "Technical Director",
    image: "/Rectangle 8.png",
    email: "jose.alberto@haliotis.pt",
    divingCerts: ["PADI IDC Staff Instructor", "EFR Instructor Trainer"],
    nauticalCerts: ["Coastal Skipper"],
  },
  {
    name: "Mariana Jerónimo",
    role: "Diving Instructor",
    image: "/Rectangle 8.png",
    email: "mariana.jeronimo@haliotis.pt",
    divingCerts: [
      "PADI IDC Staff Instructor",
      "Emergency First Response Instructor",
    ],
    nauticalCerts: ["Coastal Skipper"],
    academicFormation: ["Marine Biology"],
  },
  {
    name: "Andreia Antunes",
    role: "Front Office",
    image: "/Rectangle 8.png",
    email: "andreia.antunes@haliotis.pt",
    divingCerts: [
      "PADI Open Water Scuba Instructor",
      "Emergency First Response Instructor",
    ],
    nauticalCerts: ["Local Skipper"],
    academicFormation: ["Marine Biology"],
  },
  {
    name: "Luísa Pitadas",
    role: "Front Office",
    image: "/Rectangle 8.png",
    email: "luisa.pitadas@haliotis.pt",
    nauticalCerts: ["Local Skipper"],
  },
  {
    name: "Ana Peixoto",
    role: "Sales Department",
    image: "/Rectangle 8.png",
    email: "ana.peixoto@haliotis.pt",
    divingCerts: [
      "PADI IDC Staff Instructor",
      "Emergency First Response Instructor",
    ],
    nauticalCerts: ["Local Skipper"],
    academicFormation: ["Marine Biology"],
  },
  {
    name: "Inês Rodrigues",
    role: "Dive Instructor",
    image: "/Rectangle 8.png",
    email: "ines.rodrigues@haliotis.pt",
    divingCerts: [
      "PADI Open Water Scuba Instructor",
      "Emergency First Response Instructor",
    ],
    nauticalCerts: ["Local Skipper"],
    academicFormation: ["Marine Biology"],
  },
];

export const CenterInfoSection = () => {
  const [activeTab, setActiveTab] = useState("berlengas");
  const [selectedFilter, setSelectedFilter] = useState("GEOGRAPHY");
  const [tabWidths, setTabWidths] = useState<{ [key: string]: number }>({});
  const tabRefs = useRef<{ [key: string]: HTMLButtonElement | null }>({});

  // Calculate tab positions
  const getTabPosition = () => {
    const activeTabRef = tabRefs.current[activeTab];
    if (!activeTabRef) return { left: 0, width: 0 };

    return {
      left: activeTabRef.offsetLeft,
      width: activeTabRef.offsetWidth,
    };
  };

  const [tabPosition, setTabPosition] = useState({ left: 0, width: 0 });

  // Update tab position when activeTab changes or window resizes
  useEffect(() => {
    const updateTabPosition = () => {
      const activeTabRef = tabRefs.current[activeTab];
      if (activeTabRef) {
        setTabPosition({
          left: activeTabRef.offsetLeft,
          width: activeTabRef.offsetWidth,
        });
      }
    };

    updateTabPosition();

    const handleResize = () => {
      setTabWidths({}); // Force recalculation
      updateTabPosition();
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [activeTab]);

  const renderContent = () => {
    switch (activeTab) {
      case "berlengas":
        return (
          <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
            {/* Sidebar with filters - Mobile Dropdown */}
            <div className="lg:hidden">
              <div className="relative mb-6">
                <select
                  value={selectedFilter}
                  onChange={(e) => setSelectedFilter(e.target.value)}
                  className="w-full px-4 py-3 text-[15px] font-medium leading-[160%] text-[#111] bg-white border-2 border-[#e5e5e5] rounded-lg appearance-none cursor-pointer focus:outline-none focus:border-[#e84814]"
                >
                  {facilitiesFilters.map((filter) => (
                    <option key={filter} value={filter}>
                      {filter}
                    </option>
                  ))}
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M4 6L8 10L12 6"
                      stroke="black"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              </div>
            </div>

            {/* Sidebar with filters - Desktop */}
            <div className="hidden lg:block w-full lg:w-[253px] flex-shrink-0">
              <div className="bg-white rounded-2xl ">
                <h3 className="text-[18px] font-medium leading-[140%] text-[#111] mb-4">
                  Berlengas Information
                </h3>
                <div className="flex flex-col gap-2">
                  {facilitiesFilters.map((filter) => (
                    <button
                      key={filter}
                      onClick={() => setSelectedFilter(filter)}
                      className={`w-full text-left px-4 py-2.5 rounded-lg text-[15px] font-medium leading-[160%] transition-colors ${
                        selectedFilter === filter
                          ? "bg-[#e84814] text-white"
                          : "bg-[#f1f1f1] text-[#111] hover:bg-[#e5e5e5]"
                      }`}
                    >
                      {filter}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1">
              <p className="text-[15px] font-medium leading-[160%] text-[#111] mb-6">
                Unique location due to the diversity of life and dive sites
                including reefs, caverns and wrecks.
              </p>

              <div className="mb-6">
                <Image
                  src="/Rectangle 8.png"
                  alt="Berlengas Geography"
                  width={1228}
                  height={538}
                  className="w-full  rounded-2xl h-[538px]"
                />
              </div>

              <h3 className="text-[24px] font-medium leading-[140%] text-[#111] mb-4">
                Geographic caracteristics
              </h3>
              <p className="text-[15px] font-medium leading-[160%] text-[#101010] opacity-80 mb-4">
                The Natural Reserve of the Berlengas extends over a vast marine
                area of approximately 9.560 ha (on land ca. 104ha and ca.
                9,456ha of marine territory).
              </p>
              <p className="text-[15px] font-medium leading-[160%] text-[#101010] opacity-80 mb-4">
                This archipelago consists of small islands and riffs with an
                irregular shape, with steep slopes, and consists of three
                groups: Berlenga, Estelas and Farilhões-Forcadas. The
                archipelago sits on the continental shelf, about 6 miles west of
                Cabo Carvoeiro, close to the town of Peniche.
              </p>

              <h3 className="text-[24px] font-medium leading-[140%] text-[#111] mb-4 mt-8">
                Climate
              </h3>
              <p className="text-[15px] font-medium leading-[160%] text-[#101010] opacity-80">
                The archipelago of the Berlengas is located in a temperate
                maritime climate zone...
              </p>
            </div>
          </div>
        );

      case "facilities":
        return (
          <div className="flex flex-col gap-6">
            <p className="text-[15px] font-medium leading-[160%] text-[#111]">
              Customed for the efficiency and comfort of divers, we have male
              and female seats with a capacity for 60 people, hot water shower
              with towel, two classrooms, technical zone with all equipment to
              rent, shop with the best brands and a place where you can relax
              before and after dives. We are an Aqualung center with about 50
              equipments available for use by our customers.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  title: "Diving Center Facilities",
                  image: "/Rectangle 8.png",
                  description:
                    "Our center is located next to the beach Supertubos in Peniche 5 minutes away from the boarding points, being this route made in one of our vans.",
                },
                {
                  title: "Store",
                  image: "/Rectangle 8.png",
                  description:
                    "The best and best known equipment brands like Aqualung, TUSA, Apeks among many others.",
                },
                {
                  title: "Large Classroom",
                  image: "/Rectangle 8.png",
                  description:
                    "With capacity for twenty students and fully equipped, being a perfect place for your training.",
                },
                {
                  title: "Small Classroom",
                  image: "/Rectangle 8.png",
                  description:
                    "For smaller groups or for more specific formations the small room is the perfect solution for you.",
                },
                {
                  title: "Filling Station",
                  image: "/Rectangle 8.png",
                  description:
                    "Our filling station has a BAUER compressor capable of filling all the bottles (Aluminium (AL), Alloy, Trimix and GDI, Having more than 100 bottles (12L, 15L, 18L, Double 12L, Double 15L), we are also a rebreather friendly center.",
                },
                {
                  title: "Changing Rooms",
                  image: "/Rectangle 8.png",
                  description:
                    "So that everyone can equip with comfort our changing rooms, male and female, are spacious and comfortable. Always available with hot water shower with towel and shampoo.",
                },
              ].map((facility, index) => (
                <div key={index} className="flex flex-col gap-4">
                  <h3 className="text-[18px] font-medium leading-[140%] text-[#111]">
                    {facility.title}
                  </h3>
                  <Image
                    src={facility.image}
                    alt={facility.title}
                    width={495}
                    height={285}
                    className="w-full h-[285px] rounded-2xl"
                  />
                  <p className="text-[15px] font-medium leading-[160%] text-[#101010] opacity-80">
                    {facility.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        );

      case "boats":
        return (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {boatsList.map((boat, index) => (
              <div key={index} className="flex flex-col gap-4">
                <h3 className="text-[24px] font-medium leading-[140%] text-[#111]">
                  {boat.name}
                </h3>
                <Image
                  src={boat.image}
                  alt={boat.name}
                  width={757}
                  height={435}
                  className="w-full h-[435px] rounded-2xl"
                />
                <p className="text-[15px] font-medium leading-[160%] text-[#101010] opacity-80">
                  {boat.description}
                </p>
              </div>
            ))}
          </div>
        );

      case "history":
        return (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="flex flex-col gap-4">
              <Image
                src="/Rectangle 8.png"
                alt="Peniche"
                width={757}
                height={435}
                className="w-full h-[435px] rounded-2xl"
              />
              <h3 className="text-[24px] font-medium leading-[140%] text-[#111]">
                Peniche
              </h3>
              <p className="text-[15px] font-medium leading-[160%] text-[#101010] opacity-80">
                It was in Peniche that the Haliotis project started.
                Infrastructures above average and an optimized way of operating
                have made this center one of the most famous in the diving
                world. But none of this would have been possible without the
                Berlengas. From 1485, in the reign of D. Afonso V, that the
                berlengas have status of protected zone. They are undoubtedly
                the most attractive area for diving on the Portuguese mainland.
                Its famous visibility and seabed richness is a tremendous appeal
                to divers who dream of exciting experiences.
              </p>
              <p className="text-[15px] font-medium leading-[160%] text-[#101010] opacity-80">
                Anyone who has experienced the Gorgonian cave-covered dives, the
                endless pools of pelagics in the autumn knows that only in
                distant places can the emotions achieved here be overcome.
              </p>
              <p className="text-[15px] font-medium leading-[160%] text-[#101010] opacity-80">
                Bays of turquoise waters, brimming with confident fish, cliffs
                struck by the Atlantic, with endless shoals of Sargos, there are
                endless dive sites for all levels of divers. The center
                continues to be an example of quality and functionality,
                continuously improved, received in 2012 a new vessel, Lascaris,
                which once again reinforces this place as a reference for diving
                in Portugal.
              </p>
            </div>
            <div className="flex flex-col gap-4">
              <Image
                src="/Rectangle 8.png"
                alt="Sunfish"
                width={757}
                height={435}
                className="w-full h-[435px] rounded-2xl"
              />
              <h3 className="text-[24px] font-medium leading-[140%] text-[#111]">
                Sunfish
              </h3>
              <p className="text-[15px] font-medium leading-[160%] text-[#101010] opacity-80">
                Sunfish is the ex libris of Berlengas. His scientific name is
                Mola mola and it's the largest known fish with bones. It can
                reach 4 meters of height and 2300 kg weight. The large female
                can put around 300 000 000 eggs.
              </p>
              <p className="text-[15px] font-medium leading-[160%] text-[#101010] opacity-80">
                It has curious behaviors like "relax" in the surface in side and
                its brightness is reflected and visible from a distance. It also
                jumps out of the water which makes it a great show.
              </p>
              <p className="text-[15px] font-medium leading-[160%] text-[#101010] opacity-80">
                Actually, the sunfish in Berlengas in the end of the Summer is
                an expected moment. There are already groups of divers that come
                from Germany and France just to see it.
              </p>
            </div>
          </div>
        );

      case "team":
        return (
          <div className="flex flex-col gap-6">
            <p className="text-[15px] font-medium leading-[160%] text-[#111] mb-2">
              Meet the members of our team, who work daily to provide the best
              underwater experiences.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
              {teamMembers.map((member, index) => (
                <div
                  key={index}
                  className="bg-[#f1f1f1] rounded-3xl p-2 flex flex-col gap-4"
                >
                  <Image
                    src={member.image}
                    alt={member.name}
                    width={348}
                    height={232}
                    className="w-full h-[232px] rounded-2xl"
                  />
                  <div className="px-2 pb-2 flex flex-col gap-3">
                    <div>
                      <h3 className="text-[24px] font-medium leading-[140%] text-black">
                        {member.name}
                      </h3>
                      <p className="text-[15px] font-semibold leading-[160%] text-black">
                        {member.role}
                      </p>
                    </div>

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

                    {member.divingCerts && (
                      <div>
                        <h4 className="text-[15px] font-semibold leading-[160%] text-black mb-1">
                          Diving certifications
                        </h4>
                        {member.divingCerts.map((cert, i) => (
                          <p
                            key={i}
                            className="text-[15px] font-medium leading-[160%] text-black"
                          >
                            {cert}
                          </p>
                        ))}
                      </div>
                    )}

                    {member.nauticalCerts && (
                      <div>
                        <h4 className="text-[15px] font-semibold leading-[160%] text-black mb-1">
                          Nautical certifications
                        </h4>
                        {member.nauticalCerts.map((cert, i) => (
                          <p
                            key={i}
                            className="text-[15px] font-medium leading-[160%] text-black"
                          >
                            {cert}
                          </p>
                        ))}
                      </div>
                    )}

                    {member.academicFormation && (
                      <div>
                        <h4 className="text-[15px] font-semibold leading-[160%] text-black mb-1">
                          Academic formation
                        </h4>
                        {member.academicFormation.map((form, i) => (
                          <p
                            key={i}
                            className="text-[15px] font-medium leading-[160%] text-black"
                          >
                            {form}
                          </p>
                        ))}
                      </div>
                    )}
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
    <section className="bg-white py-12 md:py-16 lg:py-20">
      <div className="mx-auto max-w-[1920px] px-4 md:px-8 lg:px-[158px]">
        {/* Tabs Navigation - Desktop */}
        <div className="mb-8 md:mb-12 hidden md:block">
          <div className="relative flex gap-6 mb-6">
            {tabs.map((tab) => (
              <button
              key={tab.id}
              ref={(el) => {
                tabRefs.current[tab.id] = el;
              }}
              onClick={() => setActiveTab(tab.id)}
              className={`relative text-[24px] font-medium transition-colors
                ${
                  activeTab === tab.id
                    ? "text-black"
                    : "text-black/50 hover:text-black cursor-pointer"
                }
              `}
            >
              {tab.label}
            
              {/* underline */}
              <span
                className={`absolute -bottom-3 left-0 w-full h-[2px] transition-opacity
                  ${
                    activeTab === tab.id
                      ? "bg-[#e84814] opacity-100"
                      : "bg-[#e84814] opacity-0 group-hover:opacity-50"
                  }
                `}
              />
            </button>
            
            ))}
          </div>
        </div>

        {/* Tabs Navigation - Mobile (Dropdown) */}
        <div className="mb-8 md:hidden">
          <div className="relative">
            <select
              value={activeTab}
              onChange={(e) => setActiveTab(e.target.value)}
              className="w-full px-4 py-3 text-[16px] font-medium leading-[140%] text-black bg-white border-2 border-[#e5e5e5] rounded-lg appearance-none cursor-pointer focus:outline-none focus:border-[#e84814]"
            >
              {tabs.map((tab) => (
                <option key={tab.id} value={tab.id}>
                  {tab.label}
                </option>
              ))}
            </select>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M4 6L8 10L12 6"
                  stroke="black"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* Tab Content */}
        <div className="animate-fadeIn">{renderContent()}</div>
      </div>
    </section>
  );
};
