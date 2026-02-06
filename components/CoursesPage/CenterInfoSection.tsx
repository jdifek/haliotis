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

const berlengasContentData = {
  GENERAL: {
    introText:
      "Situated in the Atlantic Ocean, the Madeira archipelago is a natural paradise with unique biodiversity and stunning landscapes.",

    sections: [
      {
        title: "Location",
        content: [
          "Situated in the Atlantic Ocean just 500 km from the African continent and a 1000 km from mainland Portugal (1h30m to Lisbon by plane), is the archipelago of Madeira.",
          "This, in addition to the island of the same name, consists of the island of Porto Santo (Golden Island) 90 km NE of Funchal); the Desert Islands (only 3 uninhabitable islets - Deserta Grande, Buguio and Ilhéu Chão, 20 km SE of Funchal) and the Selvagens Islands, which are a nature reserve, 280 km from Funchal.",
        ],
      },
      {
        title: "Natural Park",
        content: [
          "Madeira Island, often called the Pearl of the Atlantic, Eden or Paradise, all of it is a Natural Park with its 728 Km2 (57 Km E-W long and 22 km wide NS) having more than 700 species of plants, 100 of them endemic (not seen in any other part of the world).",
          "Its highest moutain is Pico Ruivo (1862 m). Administratively, this island covers 10 municipalities and 52 parishes with a total population of approximately 260,000.",
        ],
      },
    ],
  },
  GEOGRAPHY: {
    introText:
      "Madeira Island features diverse habitats across irregular terrain, with UNESCO-listed Laurissilva Forest and a climate perfect year-round.",
    sections: [
      {
        title: "Geographic caracteristics",
        content: [
          "Madeira Island is situated beteween the coordinates of the parallels 32º 38 'and 32º 52' north latitude, and the meridians 16º 39 'and 17º 16' west longitude. It offers various types of habitats, arranged in a very irregular and steep terrain and a quarter of its surface lies above 1,000 meters.",
          "The island's capital of this autonomous region is the city of Funchal. The municipality is bordered to the north by the Santana district, northeast of Machico, on the east by Santa Cruz and west of Câmara de Lobos, being bathed by the Atlantic Ocean to the south.",
          "Madeira Island is famous for its climate and excellent temperatures, where always seems to be spring, balmy sea water, and by lush vegetation, which nicknamed the island «Pearl of the Atlantic» or «Atlantic Garden».",
        ],
      },
      {
        title: "Climate",
        content: [
          "Most of the people living here think that Madeira has the best climate in the world. Never too hot (the maximum temperatures can reach 33 C, but only when the east wind blows for a few days of the year).",
          "The maximum average is usually arroubd 24 C during the summer months (July to October) and the minimum are around 17 C. In winter there is only a drop of about 4 C.",
        ],
      },
    ],
  },
  GEOLOGY: {
    introText:
      "Madeira's volcanic origins date back 200 million years, shaped by Atlantic plate movements and ongoing geological processes.",
    sections: [
      {
        title: "Volcanic Origin",
        content: [
          "Most Atlantic islands and Madeira in particular are closely linked to the opening of the Atlantic, a process that began about 200 MY ago during the Triassic and that continues today.",
          "The group formed by Madeira, Desertas and Porto Santo came from a long-lasting hot «Pluma» originated from the Upper Mantle.",
        ],
      },
      {
        title: "Geological Formations",
        content: [
          "The island is divided into two large massifs: Massive Volcanic Center, which occupies the central region of the island.",
          "The vast majority of the geological formations of Madeira are extrusive volcanic rocks (magma that cooled) such as effusive lava rocks very compact or porous.",
        ],
      },
    ],
  },
  HISTORY: {
    introText:
      "Discovered in 1419 by Portuguese navigators, Madeira's rich history spans from early colonization to its protected status since 1485.",
    sections: [
      {
        title: "Early Discovery",
        content: [
          "The islands of the archipelago of Madeira were already known before the arrival of the Portuguese to believe present references in certain works as well as the representation in some geographical maps.",
          "A year after the discovery of Porto Santo by João Gonçalves Zarco and Tristão Vaz Teixeira, the two browsers in conjunction with Perestrelo, arrive on the island of Madeira in 1419.",
        ],
      },
      {
        title: "Colonization",
        content: [
          "Having noted the potential of the islands as well as the strategic importance of these colonization began around 1425.",
          "From 1440 the regime of the captaincies is established with the investiture of Tristan Vaz Teixeira as captain-donee of the Captaincy of Machico.",
        ],
      },
    ],
  },
  FAUNA: {
    introText:
      "The island hosts over 200 bird species and 700 insect species, with 20% endemic to Madeira and remarkable marine biodiversity.",
    sections: [
      {
        title: "Endemic Birds",
        content: [
          "Under the vegetation you can find endemic birds of Madeira, as the small Bis-Bis (Regulus ignicapillus madeirensis), Zino's Petrel (Pterodroma madeira), the chaffinch (Fringilla coelebs madeirensis) and Trocaz Pigeon (Columba trocaz).",
          "There are over 200 species of birds and nearly 700 species of insects in the region, representing about 75% of the known fauna of Madeira.",
        ],
      },
      {
        title: "Marine Life",
        content: [
          "One of the great features of the island's waters is the fact that it has great biodiversity at a very shallow depth.",
          "Enjoy and soak in the warm and turquoise waters of Madeira, know the marine fauna with your own eyes, certainly you will be fascinated by the amount of species of fish and shellfish.",
        ],
      },
    ],
  },
  FLORA: {
    introText:
      "Madeira's vegetation spans four climate floors, featuring unique endemic species and the ancient Laurissilva Forest ecosystem.",
    sections: [
      {
        title: "Laurissilva Forest",
        content: [
          "Between about 600 and 1300 meters above sea level, you can still find considerable Laurisilva in good natural state.",
          "This forest Laurissilva is often bathed in fog produced by moist air masses that provide the existence of unique species in the world.",
        ],
      },
      {
        title: "Mountain Flora",
        content: [
          "In the higher regions of the island, where you can breathe the pure, thin mountain air, low temperatures are present.",
          "Predominantly tufts of undergrowth as the cores of various types of heather, mosses, lichens, Aeonium glandulosum (Ensaiões), Thymus caespititius (Rosemary da Serra).",
        ],
      },
    ],
  },
  DIVING: {
    introText:
      "Year-round diving with water temperatures between 17-22°C, excellent visibility, and encounters with groupers and monk seals.",
    sections: [
      {
        title: "Diving Conditions",
        content: [
          "The weather in Madeira allows you to dive all year. Madeira offers easy dives with a great diversity of species.",
          "The water temperature varies between 17ºC and 22ºC and the visibility between 10 and 25 meters.",
          "It is recommended a 5mm suit in the high season, from June to October, and a 7mm suit in the low season, from November to May.",
        ],
      },
      {
        title: "Dive Sites",
        content: [
          "The Garajau reserve being the most wanted place due to the great amount of life found there, especially the great Dusky Groupers.",
          "In front of Madeira are the Desertas Islands, where the only colony of monk seals in Portuguese territory lives.",
          "The dive in the Atlantic Ocean is very dynamic and the conditions vary from day to day.",
        ],
      },
    ],
  },
};

export const CenterInfoSection = () => {
  const [activeTab, setActiveTab] = useState("berlengas");
  const [selectedFilter, setSelectedFilter] = useState("GEOGRAPHY");
  const tabRefs = useRef<{ [key: string]: HTMLButtonElement | null }>({});
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isTabOpen, setIsTabOpen] = useState(false);
  const [isGeographyOpen, setIsGeographyOpen] = useState(true);
  const [isClimateOpen, setIsClimateOpen] = useState(false);
  const [openSections, setOpenSections] = useState<{ [key: string]: boolean }>(
    {}
  );

  const toggleSection = (sectionTitle: string) => {
    setOpenSections((prev) => ({
      ...prev,
      [sectionTitle]: !prev[sectionTitle],
    }));
  };
  // Добавь эти стейты после существующих
  const [isDivingCenterOpen, setIsDivingCenterOpen] = useState(false);
  const [isStoreOpen, setIsStoreOpen] = useState(false);
  const [isLargeClassroomOpen, setIsLargeClassroomOpen] = useState(false);
  const [isSmallClassroomOpen, setIsSmallClassroomOpen] = useState(false);
  const [isFillingStationOpen, setIsFillingStationOpen] = useState(false);
  const [isChangingRoomsOpen, setIsChangingRoomsOpen] = useState(false);
  const [isLascarisOpen, setIsLascarisOpen] = useState(false);
  const [isNecoraOpen, setIsNecoraOpen] = useState(false);
  const [openDetailsIndex, setOpenDetailsIndex] = useState<number | null>(null);

  const [isHistoryPenicheOpen, setIsHistoryPenicheOpen] = useState(false);
  const [isHistorySunfishOpen, setIsHistorySunfishOpen] = useState(false);
  const renderContent = () => {
    switch (activeTab) {
      case "berlengas":
        return (
          <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
            {/* Sidebar with filters - Mobile Dropdown */}
            {/* Sidebar with filters - Mobile Accordion */}
            <div className="lg:hidden">
              <div className="flex flex-col gap-2">
                {/* Header button */}
                <button
                  onClick={() => setIsFilterOpen(!isFilterOpen)}
                  className="flex items-center cursor-pointer justify-between rounded-lg px-3.5 py-2.5 h-[44px] bg-[#e84814]"
                >
                  <span className="text-[16px] font-bold leading-[120%] uppercase text-[#f1f1f1]">
                    {selectedFilter}
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
                        const isSelected = filter === selectedFilter;
                        return (
                          <button
                            key={filter}
                            onClick={() => {
                              setSelectedFilter(filter);
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
                              {filter}
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
            <div className="hidden lg:block w-full lg:w-[253px] flex-shrink-0">
              <div className="bg-white rounded-2xl ">
                <h3 className="text-[18px] font-medium leading-[140%] text-[#111] mb-4">
                  Berlengas Information
                </h3>
                <div className="flex flex-col gap-2 ">
                  {facilitiesFilters.map((filter) => (
                    <button
                      key={filter}
                      onClick={() => setSelectedFilter(filter)}
                      className={`w-full text-left px-4 py-2.5 rounded-lg text-[15px] font-medium leading-[160%] transition-colors ${
                        selectedFilter === filter
                          ? "bg-[#e84814] cursor-pointer text-white"
                          : "bg-[#f1f1f1] cursor-pointer text-[#111] hover:bg-[#e5e5e5]"
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
                {
                  berlengasContentData[
                    selectedFilter as keyof typeof berlengasContentData
                  ].introText
                }
              </p>

              <div className="mb-6">
                <Image
                  src="/Rectangle 8.png"
                  alt="Berlengas Geography"
                  width={1228}
                  height={538}
                  className="w-full rounded-2xl md:h-[538px] h-[154px]"
                />
              </div>

              {/* Dynamic Sections */}
              {berlengasContentData[
                selectedFilter as keyof typeof berlengasContentData
              ].sections.map((section, index) => (
                <div key={index}>
                  <button
                    onClick={() => toggleSection(section.title)}
                    className="w-full flex items-center justify-between text-[24px] font-medium leading-[140%] text-[#111] mb-4 mt-8 md:pointer-events-none"
                  >
                    <span>{section.title}</span>
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className={`md:hidden transition-transform ${
                        openSections[section.title] ? "" : "rotate-180"
                      }`}
                    >
                      <path
                        d="M17.8534 14.1463L12.8537 9.14663C12.8073 9.10015 12.7522 9.06327 12.6915 9.03811C12.6308 9.01295 12.5657 9 12.5 9C12.4343 9 12.3692 9.01295 12.3085 9.03811C12.2478 9.06327 12.1927 9.10015 12.1463 9.14663L7.14663 14.1463C7.07663 14.2162 7.02895 14.3053 7.00963 14.4024C6.9903 14.4994 7.00021 14.6 7.03808 14.6914C7.07595 14.7828 7.1401 14.8609 7.22239 14.9159C7.30468 14.9708 7.40142 15.0001 7.50036 15L17.4996 15C17.5986 15.0001 17.6953 14.9708 17.7776 14.9159C17.8599 14.8609 17.924 14.7828 17.9619 14.6914C17.9998 14.6 18.0097 14.4994 17.9904 14.4024C17.971 14.3053 17.9234 14.2162 17.8534 14.1463Z"
                        fill="black"
                      />
                    </svg>
                  </button>

                  <div
                    className={`${
                      openSections[section.title] ? "block" : "hidden"
                    } md:block`}
                  >
                    {section.content.map((paragraph, pIndex) => (
                      <p
                        key={pIndex}
                        className="text-[15px] font-medium leading-[160%] text-[#101010] opacity-80 mb-4"
                      >
                        {paragraph}
                      </p>
                    ))}
                  </div>
                </div>
              ))}
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

            <div className="flex flex-col gap-6">
              {/* Diving Center Facilities */}
              <div>
                <button
                  onClick={() => setIsDivingCenterOpen(!isDivingCenterOpen)}
                  className="w-full flex items-center justify-between text-[18px] font-medium leading-[140%] text-[#111] mb-4 md:pointer-events-none"
                >
                  <span>Diving Center Facilities</span>
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className={`md:hidden transition-transform ${
                      isDivingCenterOpen ? "" : "rotate-180"
                    }`}
                  >
                    <path
                      d="M17.8534 14.1463L12.8537 9.14663C12.8073 9.10015 12.7522 9.06327 12.6915 9.03811C12.6308 9.01295 12.5657 9 12.5 9C12.4343 9 12.3692 9.01295 12.3085 9.03811C12.2478 9.06327 12.1927 9.10015 12.1463 9.14663L7.14663 14.1463C7.07663 14.2162 7.02895 14.3053 7.00963 14.4024C6.9903 14.4994 7.00021 14.6 7.03808 14.6914C7.07595 14.7828 7.1401 14.8609 7.22239 14.9159C7.30468 14.9708 7.40142 15.0001 7.50036 15L17.4996 15C17.5986 15.0001 17.6953 14.9708 17.7776 14.9159C17.8599 14.8609 17.924 14.7828 17.9619 14.6914C17.9998 14.6 18.0097 14.4994 17.9904 14.4024C17.971 14.3053 17.9234 14.2162 17.8534 14.1463Z"
                      fill="black"
                    />
                  </svg>
                </button>
                <div
                  className={`${
                    isDivingCenterOpen ? "block" : "hidden"
                  } md:block flex flex-col gap-4`}
                >
                  <Image
                    src="/Rectangle 8.png"
                    alt="Diving Center Facilities"
                    width={495}
                    height={285}
                    className="w-full h-[200px] md:h-[285px] rounded-2xl"
                  />
                  <p className="text-[15px] font-medium leading-[160%] text-[#101010] opacity-80">
                    Our center is located next to the beach Supertubos in
                    Peniche 5 minutes away from the boarding points, being this
                    route made in one of our vans.
                  </p>
                </div>
              </div>

              {/* Store */}
              <div>
                <button
                  onClick={() => setIsStoreOpen(!isStoreOpen)}
                  className="w-full flex items-center justify-between text-[18px] font-medium leading-[140%] text-[#111] mb-4 md:pointer-events-none"
                >
                  <span>Store</span>
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className={`md:hidden transition-transform ${
                      isStoreOpen ? "" : "rotate-180"
                    }`}
                  >
                    <path
                      d="M17.8534 14.1463L12.8537 9.14663C12.8073 9.10015 12.7522 9.06327 12.6915 9.03811C12.6308 9.01295 12.5657 9 12.5 9C12.4343 9 12.3692 9.01295 12.3085 9.03811C12.2478 9.06327 12.1927 9.10015 12.1463 9.14663L7.14663 14.1463C7.07663 14.2162 7.02895 14.3053 7.00963 14.4024C6.9903 14.4994 7.00021 14.6 7.03808 14.6914C7.07595 14.7828 7.1401 14.8609 7.22239 14.9159C7.30468 14.9708 7.40142 15.0001 7.50036 15L17.4996 15C17.5986 15.0001 17.6953 14.9708 17.7776 14.9159C17.8599 14.8609 17.924 14.7828 17.9619 14.6914C17.9998 14.6 18.0097 14.4994 17.9904 14.4024C17.971 14.3053 17.9234 14.2162 17.8534 14.1463Z"
                      fill="black"
                    />
                  </svg>
                </button>
                <div
                  className={`${
                    isStoreOpen ? "block" : "hidden"
                  } md:block flex flex-col gap-4`}
                >
                  <Image
                    src="/Rectangle 8.png"
                    alt="Store"
                    width={495}
                    height={285}
                    className="w-full h-[200px] md:h-[285px] rounded-2xl"
                  />
                  <p className="text-[15px] font-medium leading-[160%] text-[#101010] opacity-80">
                    The best and best known equipment brands like Aqualung,
                    TUSA, Apeks among many others.
                  </p>
                </div>
              </div>

              {/* Large Classroom */}
              <div>
                <button
                  onClick={() => setIsLargeClassroomOpen(!isLargeClassroomOpen)}
                  className="w-full flex items-center justify-between text-[18px] font-medium leading-[140%] text-[#111] mb-4 md:pointer-events-none"
                >
                  <span>Large Classroom</span>
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className={`md:hidden transition-transform ${
                      isLargeClassroomOpen ? "" : "rotate-180"
                    }`}
                  >
                    <path
                      d="M17.8534 14.1463L12.8537 9.14663C12.8073 9.10015 12.7522 9.06327 12.6915 9.03811C12.6308 9.01295 12.5657 9 12.5 9C12.4343 9 12.3692 9.01295 12.3085 9.03811C12.2478 9.06327 12.1927 9.10015 12.1463 9.14663L7.14663 14.1463C7.07663 14.2162 7.02895 14.3053 7.00963 14.4024C6.9903 14.4994 7.00021 14.6 7.03808 14.6914C7.07595 14.7828 7.1401 14.8609 7.22239 14.9159C7.30468 14.9708 7.40142 15.0001 7.50036 15L17.4996 15C17.5986 15.0001 17.6953 14.9708 17.7776 14.9159C17.8599 14.8609 17.924 14.7828 17.9619 14.6914C17.9998 14.6 18.0097 14.4994 17.9904 14.4024C17.971 14.3053 17.9234 14.2162 17.8534 14.1463Z"
                      fill="black"
                    />
                  </svg>
                </button>
                <div
                  className={`${
                    isLargeClassroomOpen ? "block" : "hidden"
                  } md:block flex flex-col gap-4`}
                >
                  <Image
                    src="/Rectangle 8.png"
                    alt="Large Classroom"
                    width={495}
                    height={285}
                    className="w-full h-[200px] md:h-[285px] rounded-2xl"
                  />
                  <p className="text-[15px] font-medium leading-[160%] text-[#101010] opacity-80">
                    With capacity for twenty students and fully equipped, being
                    a perfect place for your training.
                  </p>
                </div>
              </div>

              {/* Small Classroom */}
              <div>
                <button
                  onClick={() => setIsSmallClassroomOpen(!isSmallClassroomOpen)}
                  className="w-full flex items-center justify-between text-[18px] font-medium leading-[140%] text-[#111] mb-4 md:pointer-events-none"
                >
                  <span>Small Classroom</span>
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className={`md:hidden transition-transform ${
                      isSmallClassroomOpen ? "" : "rotate-180"
                    }`}
                  >
                    <path
                      d="M17.8534 14.1463L12.8537 9.14663C12.8073 9.10015 12.7522 9.06327 12.6915 9.03811C12.6308 9.01295 12.5657 9 12.5 9C12.4343 9 12.3692 9.01295 12.3085 9.03811C12.2478 9.06327 12.1927 9.10015 12.1463 9.14663L7.14663 14.1463C7.07663 14.2162 7.02895 14.3053 7.00963 14.4024C6.9903 14.4994 7.00021 14.6 7.03808 14.6914C7.07595 14.7828 7.1401 14.8609 7.22239 14.9159C7.30468 14.9708 7.40142 15.0001 7.50036 15L17.4996 15C17.5986 15.0001 17.6953 14.9708 17.7776 14.9159C17.8599 14.8609 17.924 14.7828 17.9619 14.6914C17.9998 14.6 18.0097 14.4994 17.9904 14.4024C17.971 14.3053 17.9234 14.2162 17.8534 14.1463Z"
                      fill="black"
                    />
                  </svg>
                </button>
                <div
                  className={`${
                    isSmallClassroomOpen ? "block" : "hidden"
                  } md:block flex flex-col gap-4`}
                >
                  <Image
                    src="/Rectangle 8.png"
                    alt="Small Classroom"
                    width={495}
                    height={285}
                    className="w-full h-[200px] md:h-[285px] rounded-2xl"
                  />
                  <p className="text-[15px] font-medium leading-[160%] text-[#101010] opacity-80">
                    For smaller groups or for more specific formations the small
                    room is the perfect solution for you.
                  </p>
                </div>
              </div>

              {/* Filling Station */}
              <div>
                <button
                  onClick={() => setIsFillingStationOpen(!isFillingStationOpen)}
                  className="w-full flex items-center justify-between text-[18px] font-medium leading-[140%] text-[#111] mb-4 md:pointer-events-none"
                >
                  <span>Filling Station</span>
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className={`md:hidden transition-transform ${
                      isFillingStationOpen ? "" : "rotate-180"
                    }`}
                  >
                    <path
                      d="M17.8534 14.1463L12.8537 9.14663C12.8073 9.10015 12.7522 9.06327 12.6915 9.03811C12.6308 9.01295 12.5657 9 12.5 9C12.4343 9 12.3692 9.01295 12.3085 9.03811C12.2478 9.06327 12.1927 9.10015 12.1463 9.14663L7.14663 14.1463C7.07663 14.2162 7.02895 14.3053 7.00963 14.4024C6.9903 14.4994 7.00021 14.6 7.03808 14.6914C7.07595 14.7828 7.1401 14.8609 7.22239 14.9159C7.30468 14.9708 7.40142 15.0001 7.50036 15L17.4996 15C17.5986 15.0001 17.6953 14.9708 17.7776 14.9159C17.8599 14.8609 17.924 14.7828 17.9619 14.6914C17.9998 14.6 18.0097 14.4994 17.9904 14.4024C17.971 14.3053 17.9234 14.2162 17.8534 14.1463Z"
                      fill="black"
                    />
                  </svg>
                </button>
                <div
                  className={`${
                    isFillingStationOpen ? "block" : "hidden"
                  } md:block flex flex-col gap-4`}
                >
                  <Image
                    src="/Rectangle 8.png"
                    alt="Filling Station"
                    width={495}
                    height={285}
                    className="w-full h-[200px] md:h-[285px] rounded-2xl"
                  />
                  <p className="text-[15px] font-medium leading-[160%] text-[#101010] opacity-80">
                    Our filling station has a BAUER compressor capable of
                    filling all the bottles (Aluminium (AL), Alloy, Trimix and
                    GDI, Having more than 100 bottles (12L, 15L, 18L, Double
                    12L, Double 15L), we are also a rebreather friendly center.
                  </p>
                </div>
              </div>

              {/* Changing Rooms */}
              <div>
                <button
                  onClick={() => setIsChangingRoomsOpen(!isChangingRoomsOpen)}
                  className="w-full flex items-center justify-between text-[18px] font-medium leading-[140%] text-[#111] mb-4 md:pointer-events-none"
                >
                  <span>Changing Rooms</span>
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className={`md:hidden transition-transform ${
                      isChangingRoomsOpen ? "" : "rotate-180"
                    }`}
                  >
                    <path
                      d="M17.8534 14.1463L12.8537 9.14663C12.8073 9.10015 12.7522 9.06327 12.6915 9.03811C12.6308 9.01295 12.5657 9 12.5 9C12.4343 9 12.3692 9.01295 12.3085 9.03811C12.2478 9.06327 12.1927 9.10015 12.1463 9.14663L7.14663 14.1463C7.07663 14.2162 7.02895 14.3053 7.00963 14.4024C6.9903 14.4994 7.00021 14.6 7.03808 14.6914C7.07595 14.7828 7.1401 14.8609 7.22239 14.9159C7.30468 14.9708 7.40142 15.0001 7.50036 15L17.4996 15C17.5986 15.0001 17.6953 14.9708 17.7776 14.9159C17.8599 14.8609 17.924 14.7828 17.9619 14.6914C17.9998 14.6 18.0097 14.4994 17.9904 14.4024C17.971 14.3053 17.9234 14.2162 17.8534 14.1463Z"
                      fill="black"
                    />
                  </svg>
                </button>
                <div
                  className={`${
                    isChangingRoomsOpen ? "block" : "hidden"
                  } md:block flex flex-col gap-4`}
                >
                  <Image
                    src="/Rectangle 8.png"
                    alt="Changing Rooms"
                    width={495}
                    height={285}
                    className="w-full h-[200px] md:h-[285px] rounded-2xl"
                  />
                  <p className="text-[15px] font-medium leading-[160%] text-[#101010] opacity-80">
                    So that everyone can equip with comfort our changing rooms,
                    male and female, are spacious and comfortable. Always
                    available with hot water shower with towel and shampoo.
                  </p>
                </div>
              </div>
            </div>
          </div>
        );

      case "boats":
        return (
          <div className="flex flex-col gap-8">
            {/* Lascaris */}
            <div>
              <button
                onClick={() => setIsLascarisOpen(!isLascarisOpen)}
                className="w-full flex items-center justify-between text-[24px] font-medium leading-[140%] text-[#111] mb-4 md:pointer-events-none"
              >
                <span>Lascaris</span>
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className={`md:hidden transition-transform ${
                    isLascarisOpen ? "" : "rotate-180"
                  }`}
                >
                  <path
                    d="M17.8534 14.1463L12.8537 9.14663C12.8073 9.10015 12.7522 9.06327 12.6915 9.03811C12.6308 9.01295 12.5657 9 12.5 9C12.4343 9 12.3692 9.01295 12.3085 9.03811C12.2478 9.06327 12.1927 9.10015 12.1463 9.14663L7.14663 14.1463C7.07663 14.2162 7.02895 14.3053 7.00963 14.4024C6.9903 14.4994 7.00021 14.6 7.03808 14.6914C7.07595 14.7828 7.1401 14.8609 7.22239 14.9159C7.30468 14.9708 7.40142 15.0001 7.50036 15L17.4996 15C17.5986 15.0001 17.6953 14.9708 17.7776 14.9159C17.8599 14.8609 17.924 14.7828 17.9619 14.6914C17.9998 14.6 18.0097 14.4994 17.9904 14.4024C17.971 14.3053 17.9234 14.2162 17.8534 14.1463Z"
                    fill="black"
                  />
                </svg>
              </button>
              <div
                className={`${
                  isLascarisOpen ? "block" : "hidden"
                } md:block flex flex-col gap-4`}
              >
                <Image
                  src="/Rectangle 8.png"
                  alt="Lascaris"
                  width={757}
                  height={435}
                  className="w-full h-[200px] md:h-[435px] rounded-2xl"
                />
                <p className="text-[15px] font-medium leading-[160%] text-[#101010] opacity-80">
                  Our semi-rigid Searths with 12 meters, with 2 motors YAMAHA
                  350 horsepower is the best dive boat in Portugal. It has
                  sounder, VHF, d-gps, tanks to equip, access ladders,oxygen kit
                  and first aid kit; everything for the safety and welfare of
                  divers . There is no excuse of discomfort that makes so many
                  people leave dive in Portugal.
                </p>
              </div>
            </div>

            {/* Necora */}
            <div>
              <button
                onClick={() => setIsNecoraOpen(!isNecoraOpen)}
                className="w-full flex items-center justify-between text-[24px] font-medium leading-[140%] text-[#111] mb-4 md:pointer-events-none"
              >
                <span>Necora</span>
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className={`md:hidden transition-transform ${
                    isNecoraOpen ? "" : "rotate-180"
                  }`}
                >
                  <path
                    d="M17.8534 14.1463L12.8537 9.14663C12.8073 9.10015 12.7522 9.06327 12.6915 9.03811C12.6308 9.01295 12.5657 9 12.5 9C12.4343 9 12.3692 9.01295 12.3085 9.03811C12.2478 9.06327 12.1927 9.10015 12.1463 9.14663L7.14663 14.1463C7.07663 14.2162 7.02895 14.3053 7.00963 14.4024C6.9903 14.4994 7.00021 14.6 7.03808 14.6914C7.07595 14.7828 7.1401 14.8609 7.22239 14.9159C7.30468 14.9708 7.40142 15.0001 7.50036 15L17.4996 15C17.5986 15.0001 17.6953 14.9708 17.7776 14.9159C17.8599 14.8609 17.924 14.7828 17.9619 14.6914C17.9998 14.6 18.0097 14.4994 17.9904 14.4024C17.971 14.3053 17.9234 14.2162 17.8534 14.1463Z"
                    fill="black"
                  />
                </svg>
              </button>
              <div
                className={`${
                  isNecoraOpen ? "block" : "hidden"
                } md:block flex flex-col gap-4`}
              >
                <Image
                  src="/Rectangle 8.png"
                  alt="Necora"
                  width={757}
                  height={435}
                  className="w-full h-[200px] md:h-[435px] rounded-2xl"
                />
                <p className="text-[15px] font-medium leading-[160%] text-[#101010] opacity-80">
                  Our semi-rigid Searths with 9.6 meters, with two Yamaha 200
                  horsepower offboard engines is specially customized to diving
                  conditions in Portugal. It has sounder, d-gps, oxygen kit and
                  first aid kit; and for divers comfort , Necora is equipped
                  with travelling seats and access ladders.
                </p>
              </div>
            </div>
          </div>
        );

      case "history":
        return (
          <div className="flex flex-col gap-8">
            {/* Peniche */}
            <div>
              <button
                onClick={() => setIsHistoryPenicheOpen(!isHistoryPenicheOpen)}
                className="w-full flex items-center justify-between text-[24px] font-medium leading-[140%] text-[#111] mb-4 md:pointer-events-none"
              >
                <span>Peniche</span>
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className={`md:hidden transition-transform ${
                    isHistoryPenicheOpen ? "" : "rotate-180"
                  }`}
                >
                  <path
                    d="M17.8534 14.1463L12.8537 9.14663C12.8073 9.10015 12.7522 9.06327 12.6915 9.03811C12.6308 9.01295 12.5657 9 12.5 9C12.4343 9 12.3692 9.01295 12.3085 9.03811C12.2478 9.06327 12.1927 9.10015 12.1463 9.14663L7.14663 14.1463C7.07663 14.2162 7.02895 14.3053 7.00963 14.4024C6.9903 14.4994 7.00021 14.6 7.03808 14.6914C7.07595 14.7828 7.1401 14.8609 7.22239 14.9159C7.30468 14.9708 7.40142 15.0001 7.50036 15L17.4996 15C17.5986 15.0001 17.6953 14.9708 17.7776 14.9159C17.8599 14.8609 17.924 14.7828 17.9619 14.6914C17.9998 14.6 18.0097 14.4994 17.9904 14.4024C17.971 14.3053 17.9234 14.2162 17.8534 14.1463Z"
                    fill="black"
                  />
                </svg>
              </button>
              <div
                className={`${
                  isHistoryPenicheOpen ? "block" : "hidden"
                } md:block flex flex-col gap-4`}
              >
                <Image
                  src="/Rectangle 8.png"
                  alt="Peniche"
                  width={757}
                  height={435}
                  className="w-full h-[200px] md:h-[435px] rounded-2xl"
                />
                <p className="text-[15px] font-medium leading-[160%] text-[#101010] opacity-80">
                  It was in Peniche that the Haliotis project started.
                  Infrastructures above average and an optimized way of
                  operating have made this center one of the most famous in the
                  diving world. But none of this would have been possible
                  without the Berlengas. From 1485, in the reign of D. Afonso V,
                  that the berlengas have status of protected zone. They are
                  undoubtedly the most attractive area for diving on the
                  Portuguese mainland. Its famous visibility and seabed richness
                  is a tremendous appeal to divers who dream of exciting
                  experiences.
                </p>
                <p className="text-[15px] font-medium leading-[160%] text-[#101010] opacity-80">
                  Anyone who has experienced the Gorgonian cave-covered dives,
                  the endless pools of pelagics in the autumn knows that only in
                  distant places can the emotions achieved here be overcome.
                </p>
                <p className="text-[15px] font-medium leading-[160%] text-[#101010] opacity-80">
                  Bays of turquoise waters, brimming with confident fish, cliffs
                  struck by the Atlantic, with endless shoals of Sargos, there
                  are endless dive sites for all levels of divers. The center
                  continues to be an example of quality and functionality,
                  continuously improved, received in 2012 a new vessel,
                  Lascaris, which once again reinforces this place as a
                  reference for diving in Portugal.
                </p>
              </div>
            </div>

            {/* Sunfish */}
            <div>
              <button
                onClick={() => setIsHistorySunfishOpen(!isHistorySunfishOpen)}
                className="w-full flex items-center justify-between text-[24px] font-medium leading-[140%] text-[#111] mb-4 md:pointer-events-none"
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

                    {/* Details button - только на мобилке */}
                    <button
                      onClick={() =>
                        setOpenDetailsIndex(
                          openDetailsIndex === index ? null : index
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
                          openDetailsIndex === index ? "" : "rotate-180"
                        }`}
                      >
                        <path
                          d="M17.8534 14.1463L12.8537 9.14663C12.8073 9.10015 12.7522 9.06327 12.6915 9.03811C12.6308 9.01295 12.5657 9 12.5 9C12.4343 9 12.3692 9.01295 12.3085 9.03811C12.2478 9.06327 12.1927 9.10015 12.1463 9.14663L7.14663 14.1463C7.07663 14.2162 7.02895 14.3053 7.00963 14.4024C6.9903 14.4994 7.00021 14.6 7.03808 14.6914C7.07595 14.7828 7.1401 14.8609 7.22239 14.9159C7.30468 14.9708 7.40142 15.0001 7.50036 15L17.4996 15C17.5986 15.0001 17.6953 14.9708 17.7776 14.9159C17.8599 14.8609 17.924 14.7828 17.9619 14.6914C17.9998 14.6 18.0097 14.4994 17.9904 14.4024C17.971 14.3053 17.9234 14.2162 17.8534 14.1463Z"
                          fill="#E84814"
                        />
                      </svg>
                    </button>

                    {/* Content - сворачивается на мобилке */}
                    <div
                      className={`${
                        openDetailsIndex === index ? "block" : "hidden"
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

        {/* Tabs Navigation - Mobile Accordion */}
        <div className="mb-4 md:hidden">
          <div className="flex flex-col gap-2">
            {/* Header button */}
            <button
              onClick={() => setIsTabOpen(!isTabOpen)}
              className="flex items-center cursor-pointer justify-between rounded-lg px-3.5 py-2.5 h-[48px] bg-white border-2 border-[#e84814]"
            >
              <span className="text-[20px] font-medium leading-[140%] text-black">
                {tabs.find((tab) => tab.id === activeTab)?.label}
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
                  {tabs.map((tab) => {
                    const isSelected = tab.id === activeTab;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => {
                          setActiveTab(tab.id);
                          setIsTabOpen(false);
                        }}
                        className={`flex items-center cursor-pointer justify-between rounded-lg px-3.5 py-2.5 transition-colors h-[48px] ${
                          isSelected ? "bg-[#e84814]" : "bg-white "
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
                            xmlns="http://www.w3.org/2000/svg"
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
