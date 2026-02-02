"use client";

import { Header } from "@/components/header";
import { CarouselControls } from "@/components/CarouselControls";
import Image from "next/image";
import { ButtonWithIcon } from "@/components/buttons/ButtonWithIcon";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { useState, useRef } from "react";
import type { Swiper as SwiperType } from "swiper";
import { CoursesSection } from "@/components/mainSections/CoursesSection";
import { TripsSection } from "@/components/mainSections/TripsSection";
import { DiveTrips } from "@/components/mainSections/DiveTrips";
import { CentersSection } from "@/components/mainSections/CentersSection";
export default function Home() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeNav, setActiveNav] = useState("snorkeling");
  const [heroCurrentSlide, setHeroCurrentSlide] = useState(0);
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false); // для языкового меню
  const [selectedLang, setSelectedLang] = useState("En"); // выбранный язык
  const [openDropdown, setOpenDropdown] = useState<string | null>(null); // какой dropdown открыт
  const [selectedCenter, setSelectedCenter] = useState("sesimbra"); // выбранный центр
  
  const heroSwiperRef = useRef<SwiperType | null>(null);
  const locations = [
    { id: "all", label: "ALL" },
    { id: "peniche", label: "PENICHE" },
    { id: "madeira", label: "MADEIRA" },
    { id: "sesimbra", label: "SESIMBRA" },
    { id: "santa-maria", label: "SANTA MARIA" },
    { id: "faial", label: "FAIAL" },
    { id: "sao-vicente", label: "SAO VICENTE" },
  ];

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
  
  const centersData = [
    { id: "peniche", label: "PENICHE", color: "#F49519" },
    { id: "sesimbra", label: "SESIMBRA", color: "#A0C52E" },
    { id: "madeira", label: "MADEIRA", color: "#E84814" },
    { id: "santa-maria", label: "SANTA MARIA", color: "#FED402" },
    { id: "faial", label: "FAIAL", color: "#568DD9" },
    { id: "sao-vicente", label: "SAO VICENTE", color: "#D8D8D8" },
  ];
  const languages = [
    { code: "En", label: "English" },
    { code: "Pt", label: "Português" },
    { code: "Es", label: "Español" },
    { code: "Fr", label: "Français" },
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

  const courseCards = [
    // PENICHE
    {
      image: "/Rectangle 8.png",
      title: "PENICHE PADI Rescue Diver Course with Emergency First Response Training",
      price: 349,
      duration: "3 days",
      requestBased: true,
      badge: "New",
      location: "peniche"
    },
    {
      image: "/Rectangle 8.png",
      title: "PENICHE Deep Diving Specialty Course for Advanced Divers in Berlengas",
      price: 199,
      duration: "2 days",
      requestBased: false,
      badge: "Specialty",
      location: "peniche"
    },
    {
      image: "/Rectangle 8.png",
      title: "PENICHE Night Diving Adventure Course with Underwater Navigation Skills",
      price: 249,
      duration: "2 days",
      requestBased: true,
      badge: "Adventure",
      location: "peniche"
    },
    
    // MADEIRA
    {
      image: "/Rectangle 8.png",
      title: "MADEIRA Curso de Nitrox PADI Enriched Air Diver - inclui mergulhos",
      price: 239,
      duration: "3hrs",
      requestBased: true,
      badge: "Open Trip",
      location: "madeira"
    },
    {
      image: "/Rectangle 8.png",
      title: "MADEIRA Wreck Diving Specialty exploring Historic Shipwrecks of Madeira",
      price: 279,
      duration: "3 days",
      requestBased: false,
      badge: "Specialty",
      location: "madeira"
    },
    {
      image: "/Rectangle 8.png",
      title: "MADEIRA Marine Life Identification Course with Local Endemic Species",
      price: 189,
      duration: "2 days",
      requestBased: true,
      badge: "Educational",
      location: "madeira"
    },
    {
      image: "/Rectangle 8.png",
      title: "MADEIRA Underwater Photography Workshop capturing Atlantic Marine Beauty",
      price: 329,
      duration: "3 days",
      requestBased: false,
      badge: "Creative",
      location: "madeira"
    },
    
    // SESIMBRA
    {
      image: "/Rectangle 8.png",
      title: "SESIMBRA Divemaster Professional Course with Leadership Development Training",
      price: 899,
      duration: "4 weeks",
      requestBased: false,
      badge: "Professional",
      location: "sesimbra"
    },
    {
      image: "/Rectangle 8.png",
      title: "SESIMBRA Open Water Diver Certification Course for Complete Beginners",
      price: 399,
      duration: "3 days",
      requestBased: false,
      badge: "Beginner",
      location: "sesimbra"
    },
    {
      image: "/Rectangle 8.png",
      title: "SESIMBRA Peak Performance Buoyancy Course improving Diving Control Skills",
      price: 179,
      duration: "1 day",
      requestBased: true,
      badge: "Specialty",
      location: "sesimbra"
    },
    
    // SANTA MARIA
    {
      image: "/Rectangle 8.png",
      title: "SANTA MARIA Blue Shark Diving Experience with Marine Biologist Guidance",
      price: 459,
      duration: "1 day",
      requestBased: true,
      badge: "Adventure",
      location: "santa-maria"
    },
    {
      image: "/Rectangle 8.png",
      title: "SANTA MARIA Manta Ray Encounter Diving Safari in Azorean Atlantic Waters",
      price: 389,
      duration: "2 days",
      requestBased: false,
      badge: "Popular",
      location: "santa-maria"
    },
    {
      image: "/Rectangle 8.png",
      title: "SANTA MARIA Drift Diving Specialty Course exploring Strong Ocean Currents",
      price: 229,
      duration: "2 days",
      requestBased: true,
      badge: "Specialty",
      location: "santa-maria"
    },
    
    // FAIAL
    {
      image: "/Rectangle 8.png",
      title: "FAIAL Volcanic Diving Adventure exploring Underwater Lava Formations",
      price: 319,
      duration: "2 days",
      requestBased: false,
      badge: "Adventure",
      location: "faial"
    },
    {
      image: "/Rectangle 8.png",
      title: "FAIAL Whale Watching Diving Tour with Cetacean Research Experience",
      price: 429,
      duration: "1 day",
      requestBased: true,
      badge: "Educational",
      location: "faial"
    },
    {
      image: "/Rectangle 8.png",
      title: "FAIAL Altitude Diving Specialty Course in Caldeira Lake Ecosystem",
      price: 269,
      duration: "2 days",
      requestBased: false,
      badge: "Specialty",
      location: "faial"
    },
    
    // SAO VICENTE
    {
      image: "/Rectangle 8.png",
      title: "SAO VICENTE Tropical Reef Diving Safari discovering Caribbean Marine Species",
      price: 359,
      duration: "3 days",
      requestBased: false,
      badge: "Adventure",
      location: "sao-vicente"
    },
    {
      image: "/Rectangle 8.png",
      title: "SAO VICENTE Cave Diving Introduction Course exploring Underwater Caverns",
      price: 399,
      duration: "2 days",
      requestBased: true,
      badge: "Advanced",
      location: "sao-vicente"
    },
    {
      image: "/Rectangle 8.png",
      title: "SAO VICENTE Fish Identification Specialty learning Endemic Cape Verde Species",
      price: 199,
      duration: "2 days",
      requestBased: false,
      badge: "Educational",
      location: "sao-vicente"
    },
  ];
  
  const tripCards = [
    // PENICHE
    {
      image: "/image 6.png",
      price: 189,
      title: "PENICHE",
      description: "Discover the underwater world with guided tours and marine biology insights",
      link: "/articles/ocean",
      location: "peniche",
      details: `<p>Morning dive trip by boat to 2 different dive sites in Berlengas Natural Reserve intended for certified divers.</p>
      <p>The Archipelago of Berlengas is composed by 3 groups of islands. Both can provide great dive sites at all levels of experience!</p>
      <p>The meeting point is in our diving center at 8h30, where you will prepare all the diving equipment.</p>`,
      equipmentPrice: "€ 30.00"
    },
    {
      image: "/image 6.png",
      price: 299,
      title: "PENICHE",
      description: "Experience the depths like never before in protected natural habitats",
      link: "/articles/deep-sea",
      location: "peniche",
      details: `<p>Deep diving experience in Berlengas Marine Reserve. Explore depths up to 30 meters.</p>
      <p>This trip includes professional dive guide, equipment rental, and underwater photography service.</p>
      <p>Return time is between 15h00 and 16h00. Hot showers available at our facilities.</p>`,
      equipmentPrice: "€ 35.00"
    },
    {
      image: "/image 6.png",
      price: 219,
      title: "PENICHE",
      description: "Explore sunken ships and underwater history with expert guides",
      link: "/articles/wreck-diving",
      location: "peniche",
      details: `<p>Explore historic shipwrecks from the 19th century. Perfect for experienced divers.</p>
      <p>All safety equipment included. Dive guide will explain the history of each wreck.</p>`,
      equipmentPrice: "€ 25.00"
    },
    {
      image: "/image 6.png",
      price: 249,
      title: "PENICHE",
      description: "Capture stunning underwater moments with professional photography training",
      link: "/articles/photography",
      location: "peniche",
      details: `<p>Learn underwater photography techniques from professional photographers.</p>
      <p>Camera equipment rental available. Small groups for personalized instruction.</p>`,
      equipmentPrice: "€ 40.00"
    },
    
    // MADEIRA
    {
      image: "/image 6.png",
      price: 239,
      title: "MADEIRA",
      description: "Learn essential safety practices for your next dive with professional instructors",
      link: "/articles/diving-safety",
      location: "madeira",
      details: `<p>Comprehensive safety training course. Learn emergency procedures and rescue techniques.</p>
      <p>Certification upon completion. Includes practical exercises and theory sessions.</p>`,
      equipmentPrice: "€ 20.00"
    },
    {
      image: "/image 6.png",
      price: 259,
      title: "MADEIRA",
      description: "Discover the ocean's nocturnal wonders in subtropical Atlantic waters",
      link: "/articles/night-diving",
      location: "madeira",
      details: `<p>Night diving in Madeira's crystal clear waters. See nocturnal marine species.</p>
      <p>Special underwater lights provided. Maximum 6 divers per group for safety.</p>`,
      equipmentPrice: "€ 30.00"
    },
    {
      image: "/image 6.png",
      price: 279,
      title: "MADEIRA",
      description: "Help protect and restore coral reefs with marine conservation team",
      link: "/articles/reef-conservation",
      location: "madeira",
      details: `<p>Participate in coral reef restoration project. Work alongside marine biologists.</p>
      <p>Learn about marine conservation. Make a real difference for ocean health.</p>`,
      equipmentPrice: "€ 15.00"
    },
    {
      image: "/image 6.png",
      price: 329,
      title: "MADEIRA",
      description: "Safely observe diverse marine life in their natural island habitat",
      link: "/articles/shark-encounter",
      location: "madeira",
      details: `<p>Wildlife safari to observe dolphins, turtles, and rays in their natural habitat.</p>
      <p>Full day trip with lunch included. Experienced marine biologist guide.</p>`,
      equipmentPrice: "€ 45.00"
    },
    
    // SESIMBRA
    {
      image: "/image 6.png",
      price: 199,
      title: "SESIMBRA",
      description: "Perfect introduction to underwater exploration in calm protected bays",
      link: "/articles/snorkeling",
      location: "sesimbra",
      details: `<p>Perfect for beginners and families. Explore calm, shallow waters of Arrábida.</p>
      <p>All snorkeling equipment provided. Professional guide ensures safety.</p>`,
      equipmentPrice: "€ 10.00"
    },
    {
      image: "/image 6.png",
      price: 269,
      title: "SESIMBRA",
      description: "Explore mysterious underwater caves with experienced speleology guides",
      link: "/articles/cave-diving",
      location: "sesimbra",
      details: `<p>Advanced cave diving experience. Explore stunning underwater caves.</p>
      <p>Cave diving certification required. Small groups for maximum safety.</p>`,
      equipmentPrice: "€ 35.00"
    },
    {
      image: "/image 6.png",
      price: 229,
      title: "SESIMBRA",
      description: "Discover tiny underwater creatures with specialized macro lens equipment",
      link: "/articles/macro",
      location: "sesimbra",
      details: `<p>Macro photography dive focusing on tiny marine creatures and details.</p>
      <p>Macro lens rental available. Learn techniques for capturing small subjects.</p>`,
      equipmentPrice: "€ 25.00"
    },
    
    // SANTA MARIA
    {
      image: "/image 6.png",
      price: 289,
      title: "MARIA",
      description: "Swim with friendly dolphins in pristine Azorean blue waters",
      link: "/articles/dolphins",
      location: "santa-maria",
      details: `<p>Swim with wild Atlantic spotted dolphins in crystal clear waters.</p>
      <p>Respectful wildlife interaction. Professional guides ensure dolphin safety.</p>`,
      equipmentPrice: "€ 20.00"
    },
    {
      image: "/image 6.png",
      price: 399,
      title: "MARIA",
      description: "Swim with majestic manta rays during seasonal migration routes",
      link: "/articles/manta-rays",
      location: "santa-maria",
      details: `<p>Once in a lifetime manta ray encounter. Best season from June to October.</p>
      <p>Full day boat trip. Includes breakfast and lunch on board.</p>`,
      equipmentPrice: "€ 50.00"
    },
    {
      image: "/image 6.png",
      price: 209,
      title: "MARIA",
      description: "Glide effortlessly with ocean currents in volcanic underwater landscapes",
      link: "/articles/drift-diving",
      location: "santa-maria",
      details: `<p>Drift diving along volcanic formations. Advanced certification required.</p>
      <p>Experience weightless gliding with ocean currents. Safety boat follows group.</p>`,
      equipmentPrice: "€ 30.00"
    },
    
    // FAIAL
    {
      image: "/image 6.png",
      price: 269,
      title: "FAIAL",
      description: "Meet sea turtles and learn about conservation efforts firsthand",
      link: "/articles/turtles",
      location: "faial",
      details: `<p>Visit turtle sanctuary and rehabilitation center. Meet rescued sea turtles.</p>
      <p>Learn about conservation efforts. Support important marine protection work.</p>`,
      equipmentPrice: "€ 15.00"
    },
    {
      image: "/image 6.png",
      price: 339,
      title: "FAIAL",
      description: "Extended diving adventure on a boat visiting multiple locations",
      link: "/articles/liveaboard",
      location: "faial",
      details: `<p>3-day liveaboard diving trip exploring remote Azorean islands.</p>
      <p>All meals included. Up to 3 dives per day. Comfortable accommodation on board.</p>`,
      equipmentPrice: "€ 60.00"
    },
    {
      image: "/image 6.png",
      price: 259,
      title: "FAIAL",
      description: "Observe whales during migration season with marine mammal experts",
      link: "/articles/whales",
      location: "faial",
      details: `<p>Whale watching tour during migration season. See sperm whales and other cetaceans.</p>
      <p>Expert marine biologist on board. Respectful wildlife observation practices.</p>`,
      equipmentPrice: "€ 25.00"
    },
    
    // SAO VICENTE
    {
      image: "/image 6.png",
      price: 319,
      title: "SAO VICENTE",
      description: "Advanced diving techniques and equipment for experienced divers only",
      link: "/articles/technical",
      location: "sao-vicente",
      details: `<p>Technical diving certification course. Learn to use advanced equipment.</p>
      <p>Covers decompression diving, trimix, and rebreathers. 5-day intensive course.</p>`,
      equipmentPrice: "€ 100.00"
    },
    {
      image: "/image 6.png",
      title: "SAO VICENTE",
      price: 189,
      description: "Combine diving with environmental cleanup supporting ocean health",
      link: "/articles/cleanup",
      location: "sao-vicente",
      details: `<p>Underwater cleanup dive. Help remove marine debris and plastics.</p>
      <p>Make a positive impact while diving. All cleanup equipment provided.</p>`,
      equipmentPrice: "€ 5.00"
    },
    {
      image: "/image 6.png",
      price: 349,
      title: "SAO VICENTE",
      description: "Unique diving experience exploring vibrant tropical reef ecosystems",
      link: "/articles/ice-diving",
      location: "sao-vicente",
      details: `<p>Explore colorful tropical reefs with endemic Cape Verde species.</p>
      <p>Full day safari visiting multiple reef sites. Vibrant marine biodiversity.</p>`,
      equipmentPrice: "€ 40.00"
    },
  ];
  // Mock data for Centers Section

const centerCardsData = [
  // PENICHE
  {
    image: "/CTABackgroundImage.png",
    title: "Peniche",
    description: "Unique location due to the diversity of life and dive sites including reefs, caverns and wrecks.",
    buttonColor: "#f49519",
    location: "peniche"
  },
  {
    image: "/CTABackgroundImage.png",
    title: "Peniche Marine Reserve",
    description: "Protected marine area with exceptional biodiversity. Perfect for wall diving and deep dives.",
    buttonColor: "#f49519",
    location: "peniche"
  },
  
  // MADEIRA
  {
    image: "/CTABackgroundImage.png",
    title: "Madeira",
    description: "Pearl of the Atlantic! Best island destination in Europe. An island blessed by the sun and the sea.",
    buttonColor: "#e52924",
    location: "madeira"
  },
  {
    image: "/CTABackgroundImage.png",
    title: "Madeira South Coast",
    description: "Warm subtropical waters with year-round diving. Excellent visibility and diverse marine life.",
    buttonColor: "#e52924",
    location: "madeira"
  },
  {
    image: "/CTABackgroundImage.png",
    title: "Madeira North Coast",
    description: "Dramatic underwater landscapes with volcanic formations and exciting drift dives.",
    buttonColor: "#e52924",
    location: "madeira"
  },
  
  // SESIMBRA
  {
    image: "/CTABackgroundImage.png",
    title: "Sesimbra",
    description: "From Arrábida to Cabo Espichel, the green combines perfectly with the blue of the sea.",
    buttonColor: "#a0c52e",
    location: "sesimbra"
  },
  {
    image: "/CTABackgroundImage.png",
    title: "Sesimbra Arrábida Park",
    description: "Natural park with crystal clear waters and abundant marine biodiversity.",
    buttonColor: "#a0c52e",
    location: "sesimbra"
  },
  
  // SANTA MARIA
  {
    image: "/CTABackgroundImage.png",
    title: "Santa Maria",
    description: "The sunniest island in the Azores. Famous for encounters with mobula rays and blue sharks.",
    buttonColor: "#fed402",
    location: "santa-maria"
  },
  {
    image: "/CTABackgroundImage.png",
    title: "Santa Maria Blue Zone",
    description: "Open ocean diving with pelagic species. One of Europe's best blue water diving destinations.",
    buttonColor: "#fed402",
    location: "santa-maria"
  },
  {
    image: "/CTABackgroundImage.png",
    title: "Santa Maria Coastal Sites",
    description: "Beautiful volcanic reefs with endemic Atlantic species and excellent underwater photography opportunities.",
    buttonColor: "#fed402",
    location: "santa-maria"
  },
  
  // FAIAL
  {
    image: "/CTABackgroundImage.png",
    title: "Faial",
    description: "Blue island in the middle of the Atlantic. Volcanic underwater landscapes and unique dive sites.",
    buttonColor: "#1b5ba7",
    location: "faial"
  },
  {
    image: "/CTABackgroundImage.png",
    title: "Faial Harbor",
    description: "Historic marina with easy shore dives and fascinating underwater topography.",
    buttonColor: "#1b5ba7",
    location: "faial"
  },
  {
    image: "/CTABackgroundImage.png",
    title: "Faial Caldeira",
    description: "Altitude diving in volcanic crater lake. Unique freshwater diving experience.",
    buttonColor: "#1b5ba7",
    location: "faial"
  },
  
  // SAO VICENTE
  {
    image: "/CTABackgroundImage.png",
    title: "São Vicente",
    description: "Cape Verde's diving paradise with tropical waters, colorful reefs and exotic marine species.",
    buttonColor: "#f49519",
    location: "sao-vicente"
  },
  {
    image: "/CTABackgroundImage.png",
    title: "São Vicente North",
    description: "Advanced diving with strong currents and big fish. Nurse sharks and large pelagics.",
    buttonColor: "#f49519",
    location: "sao-vicente"
  },
  {
    image: "/CTABackgroundImage.png",
    title: "São Vicente Bay",
    description: "Protected bay area perfect for training and easy dives. Beautiful coral formations.",
    buttonColor: "#f49519",
    location: "sao-vicente"
  },
];
  const diveTripsCards = [
    {
      image: "/CTABackgroundImage.png",
      location: "São Vicente - Cape Verde",
      locationNumber: "839",
      description:
        "São Vicente offers exciting dives with a great diversity of species, from endemic species as the white tail damsel fish till the nurse shark, exotic frogfish and not forgetting the huge shoals of surgeon fish, soldier fish, yellow grunt fish and other big pelagic fish.",
    },
    {
      image: "/CTABackgroundImage.png",
      location: "Azores Islands - Portugal",
      locationNumber: "542",
      description:
        "The Azores provide world-class diving with encounters of blue sharks, manta rays, and mobula rays. Crystal clear waters and volcanic formations create unforgettable underwater landscapes.",
    },
    {
      image: "/CTABackgroundImage.png",
      location: "Madeira - Portugal",
      locationNumber: "621",
      description:
        "Madeira's warm waters host a variety of marine life including groupers, moray eels, and barracudas. The island's unique underwater caves and rock formations offer exciting exploration opportunities.",
    },
    {
      image: "/CTABackgroundImage.png",
      location: "Berlengas Islands - Portugal",
      locationNumber: "384",
      description:
        "A protected marine reserve with exceptional biodiversity. Dive among shipwrecks, encounter large schools of fish, and explore dramatic underwater cliffs and caves.",
    },
    {
      image: "/CTABackgroundImage.png",
      location: "Sesimbra - Portugal",
      locationNumber: "456",
      description:
        "Known for its clear waters and diverse marine ecosystems. Perfect for both beginners and experienced divers with various dive sites ranging from shallow reefs to deep walls.",
    },
    {
      image: "/CTABackgroundImage.png",
      location: "Peniche - Portugal",
      locationNumber: "298",
      description:
        "Famous for its challenging dives and strong currents. Home to numerous fish species and occasional visits from dolphins. The Berlengas archipelago nearby offers pristine diving conditions.",
    },
    {
      image: "/CTABackgroundImage.png",
      location: "Algarve Coast - Portugal",
      locationNumber: "673",
      description:
        "The Algarve coastline features stunning rock formations, caves, and an abundance of marine life. Warm waters and excellent visibility make it ideal for underwater photography.",
    },
    {
      image: "/CTABackgroundImage.png",
      location: "Faial Island - Azores",
      locationNumber: "412",
      description:
        "Volcanic formations create unique dive sites with abundant pelagic species. Known for encounters with blue sharks, rays, and seasonal whale watching opportunities.",
    },
  ];
  const heroSlides = [
    {
      title: "Find the Experience",
      description:
        "The Haliotis Diving Center is a PADI Gold Palm IDC center that has been diving in Portugal since 2004. PADI courses and dive shop.",
      image: "/bg.png",
    },
    {
      title: "Discover Underwater World",
      description:
        "Professional diving courses and equipment for all skill levels. Join us for an unforgettable underwater adventure.",
      image: "/bg.png", // Замените на другую картинку если есть
    },
    {
      title: "Expert Diving Training",
      description:
        "PADI certified instructors with years of experience. Start your diving journey with the best in Portugal.",
      image: "/bg.png", // Замените на другую картинку если есть
    },
  ];

  return (
    <main>
      <section className="relative h-[930px] w-full overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <Swiper
            modules={[Navigation, Pagination]}
            spaceBetween={0}
            slidesPerView={1}
            loop={true}
            onSwiper={(swiper) => {
              heroSwiperRef.current = swiper;
            }}
            onSlideChange={(swiper) => {
              setHeroCurrentSlide(swiper.realIndex);
            }}
            className="h-full w-full"
          >
            {heroSlides.map((slide, index) => (
              <SwiperSlide key={index} className="h-full">
                <div className="relative h-full w-full">
                  <Image
                    src={slide.image}
                    alt={`Background ${index + 1}`}
                    fill
                    className="object-cover"
                    priority={index === 0}
                  />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
        {/* Decorative SVG - desktop only */}
        <div className="absolute right-10 top-1/5 z-10 hidden lg:block">
          <svg
            width="699"
            height="647"
            viewBox="0 0 699 647"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g clip-path="url(#clip0_1_2737)">
              <path
                d="M2.41026 402.477C9.51421 419.07 33.9827 423.084 58.4512 412.609C80.2963 403.25 90.0297 375.294 79.1807 349.955C68.7056 325.486 56.2262 320.491 22.153 327.852C3.19483 330.151 -4.28915 386.823 2.41026 402.477Z"
                fill="#E84814"
              />
              <path
                d="M109.751 426.531C104.688 440.077 116.646 455.934 136.616 463.399C154.452 470.074 175.556 459.262 183.297 438.563C190.757 418.6 186.295 408.799 162.482 394.217C150.217 385.06 114.532 413.757 109.751 426.531Z"
                fill="#E84814"
              />
              <path
                d="M267.569 474.501C278.952 477.486 290.806 466.496 295.207 449.713C299.123 434.721 288.63 418.521 271.241 413.967C254.452 409.578 246.889 413.998 237.051 434.482C230.658 445.165 256.837 471.687 267.569 474.501Z"
                fill="#E84814"
              />
              <path
                d="M393.961 455.9C403.461 452.86 406.961 439.614 402.487 425.608C398.484 413.098 385.423 408.979 370.92 413.613C356.909 418.094 351.699 421.986 353.954 441.104C354.23 451.658 385.006 458.756 393.961 455.9Z"
                fill="#E84814"
              />
              <path
                d="M480.328 366.752C472.188 368.683 468.431 379.532 471.287 391.533C473.837 402.241 485.832 408.885 498.263 405.931C510.258 403.074 513.513 397.773 512.839 381.634C513.286 372.801 487.996 364.925 480.328 366.752Z"
                fill="#E84814"
              />
              <path
                d="M560.879 340.187C567.603 341.971 574.627 335.498 577.251 325.587C579.598 316.736 573.42 307.15 563.159 304.422C553.248 301.799 548.767 304.398 542.914 316.479C539.12 322.792 554.541 338.508 560.879 340.187Z"
                fill="#E84814"
              />
              <path
                d="M593.549 263.917C597.644 267.656 604.999 265.67 610.516 259.633C615.437 254.245 614.616 245.186 608.364 239.473C602.327 233.957 598.202 234.147 589.602 240.528C584.588 243.58 589.688 260.387 593.549 263.917Z"
                fill="#E84814"
              />
              <path
                d="M620.478 182.948C623.653 185.609 629.06 183.892 632.989 179.216C636.482 175.035 635.581 168.299 630.727 164.241C626.05 160.325 622.979 160.601 616.776 165.639C613.142 168.072 617.475 180.448 620.478 182.948Z"
                fill="#E84814"
              />
              <path
                d="M613.002 118.506C614.166 121.221 618.169 121.883 622.177 120.167C625.745 118.635 627.351 114.062 625.567 109.919C623.857 105.91 621.81 105.095 616.238 106.296C613.13 106.67 611.905 115.95 613.002 118.506Z"
                fill="#E84814"
              />
              <path
                d="M597.463 81.6704C598.094 83.1537 600.27 83.5092 602.452 82.5714C604.401 81.7378 605.265 79.2493 604.303 76.9937C603.371 74.8055 602.256 74.3703 599.216 75.02C597.536 75.2223 596.868 80.2729 597.463 81.6704Z"
                fill="#E84814"
              />
              <path
                d="M552.779 66.158C553.171 67.0651 554.513 67.2858 555.856 66.7096C557.045 66.207 557.578 64.6686 556.99 63.2772C556.42 61.941 555.727 61.6713 553.864 62.0697C552.828 62.1984 552.417 65.2999 552.779 66.158Z"
                fill="#E84814"
              />
              <path
                d="M576.424 65.2027C577.061 66.6799 579.237 67.0415 581.413 66.1037C583.362 65.2763 584.226 62.7816 583.264 60.5199C582.333 58.3378 581.217 57.8965 578.183 58.5523C576.497 58.7546 575.823 63.8052 576.424 65.2027Z"
                fill="#E84814"
              />
              <path
                d="M537.953 79.0397C538.34 79.9468 539.682 80.1675 541.024 79.5913C542.219 79.0826 542.747 77.5503 542.164 76.1589C541.588 74.8227 540.902 74.5469 539.038 74.9514C537.996 75.074 537.579 78.1816 537.953 79.0397Z"
                fill="#E84814"
              />
              <path
                d="M541.796 91.4778C542.127 92.2317 543.236 92.4156 544.34 91.9375C545.339 91.5085 545.786 90.2336 545.284 89.0874C544.812 87.9718 544.241 87.745 542.697 88.0822C541.839 88.1864 541.489 90.7668 541.796 91.4778Z"
                fill="#E84814"
              />
              <path
                d="M551.259 94.5333C551.517 95.1217 552.387 95.2688 553.252 94.8949C554.036 94.5578 554.373 93.5649 553.987 92.6639C553.619 91.7935 553.172 91.6096 551.964 91.8732C551.284 91.959 551.027 93.9755 551.259 94.5333Z"
                fill="#E84814"
              />
              <path
                d="M559.507 91.564C559.648 91.895 560.145 91.9808 560.641 91.7662C561.089 91.5701 561.279 91.0123 561.064 90.4975C560.85 90.001 560.598 89.9029 559.906 90.0439C559.52 90.0929 559.372 91.2452 559.507 91.564Z"
                fill="#E84814"
              />
              <path
                d="M561.806 84.5641C561.892 84.7787 562.199 84.8216 562.511 84.6929C562.781 84.5764 562.91 84.2209 562.769 83.9022C562.64 83.5957 562.481 83.5344 562.052 83.6263C561.813 83.657 561.721 84.368 561.806 84.5641Z"
                fill="#E84814"
              />
              <path
                d="M557.089 79.3595C557.175 79.5679 557.481 79.617 557.794 79.4883C558.069 79.3718 558.198 79.0163 558.057 78.6976C557.928 78.3911 557.763 78.3298 557.34 78.4217C557.101 78.4524 557.003 79.1634 557.089 79.3595Z"
                fill="#E84814"
              />
              <path
                d="M553.331 83.3188C553.38 83.4414 553.545 83.4598 553.717 83.3862C553.87 83.3249 553.938 83.1349 553.858 82.9572C553.784 82.7917 553.705 82.761 553.466 82.8101C553.343 82.8223 553.282 83.2085 553.331 83.3188Z"
                fill="#E84814"
              />
              <path
                d="M93.3432 572.73C132.847 582.261 168.226 591.289 209.587 588.452C359.493 578.228 506.996 505.76 605.465 392.036C682.885 302.614 700.305 159.873 625.073 63.8014C611.931 47.0192 570.595 0.619794 540.892 18.6708L537.398 21.098L533.904 24.2792L530.405 28.2939L530.503 28.202L529.798 30.2982L529.099 33.5407L528.682 37.5125C528.18 52.0269 546.66 77.6293 563.356 67.5403C572.035 62.2875 569.816 48.006 569.614 39.8233L572.14 39.2839C575.235 51.7511 578.974 70.0779 563.853 76.3421C537.441 87.2769 513.843 55.5206 515.804 31.8796C519.004 -6.74772 569.829 -5.43603 593.733 10.4268C702.039 82.2508 722.775 224.226 675.015 338.968C646.66 407.102 587.782 467.194 529.087 509.144C435.05 576.328 327.559 621.256 211.922 631.186C164.487 635.256 123.788 625.485 78.2158 615.329C66.4474 611.161 60.2997 598.228 64.4799 586.46C68.6601 574.697 81.5809 568.55 93.3432 572.73Z"
                fill="white"
                fill-opacity="0.5"
              />
            </g>
            <defs>
              <clipPath id="clip0_1_2737">
                <rect width="699" height="647" fill="white" />
              </clipPath>
            </defs>
          </svg>
        </div>
        <div className="absolute right-4 bottom-20 z-10 lg:hidden">
        <svg width="199" height="184" viewBox="0 0 199 184" fill="none" xmlns="http://www.w3.org/2000/svg">
  <g clip-path="url(#clip0_1_7629)">
    <path d="M0.686184 114.46C2.70862 119.179 9.67462 120.321 16.6406 117.342C22.8597 114.68 25.6308 106.73 22.5422 99.5235C19.56 92.5649 16.0072 91.1443 6.30679 93.2378C0.909543 93.8914 -1.22109 110.008 0.686184 114.46Z" fill="#E84814" />
    <path d="M31.2453 121.301C29.804 125.153 33.2084 129.663 38.8936 131.786C43.9715 133.684 49.9795 130.609 52.1834 124.723C54.3071 119.045 53.0367 116.258 46.2574 112.111C42.7657 109.507 32.6064 117.668 31.2453 121.301Z" fill="#E84814" />
    <path d="M76.1749 134.943C79.4153 135.792 82.7901 132.667 84.043 127.894C85.1581 123.63 82.1707 119.023 77.2201 117.728C72.4406 116.48 70.2873 117.737 67.4866 123.562C65.6666 126.6 73.1194 134.143 76.1749 134.943Z" fill="#E84814" />
    <path d="M112.158 129.653C114.863 128.788 115.859 125.022 114.585 121.039C113.446 117.481 109.727 116.309 105.598 117.627C101.609 118.901 100.126 120.008 100.768 125.445C100.847 128.447 109.608 130.465 112.158 129.653Z" fill="#E84814" />
    <path d="M136.746 104.3C134.429 104.849 133.359 107.935 134.172 111.348C134.898 114.393 138.313 116.283 141.852 115.443C145.267 114.63 146.193 113.122 146.001 108.533C146.129 106.021 138.929 103.781 136.746 104.3Z" fill="#E84814" />
    <path d="M159.678 96.7457C161.592 97.253 163.592 95.4122 164.339 92.5936C165.007 90.0765 163.248 87.3502 160.327 86.5745C157.506 85.8285 156.23 86.5676 154.563 90.0033C153.483 91.7987 157.874 96.2681 159.678 96.7457Z" fill="#E84814" />
    <path d="M168.979 75.0553C170.145 76.1186 172.239 75.5538 173.809 73.8368C175.21 72.3046 174.977 69.7283 173.197 68.1037C171.478 66.5348 170.304 66.5889 167.855 68.4035C166.428 69.2716 167.88 74.0512 168.979 75.0553Z" fill="#E84814" />
    <path d="M176.646 52.0285C177.55 52.7851 179.089 52.297 180.207 50.967C181.202 49.7782 180.945 47.8625 179.563 46.7085C178.232 45.5946 177.358 45.6731 175.592 47.1059C174.557 47.798 175.791 51.3173 176.646 52.0285Z" fill="#E84814" />
    <path d="M174.517 33.7018C174.848 34.474 175.988 34.6623 177.129 34.1742C178.145 33.7384 178.602 32.4381 178.094 31.2597C177.607 30.1197 177.024 29.8879 175.438 30.2295C174.554 30.3358 174.205 32.9749 174.517 33.7018Z" fill="#E84814" />
    <path d="M170.093 23.2263C170.273 23.6481 170.892 23.7492 171.513 23.4825C172.068 23.2454 172.314 22.5377 172.04 21.8962C171.775 21.2739 171.458 21.1502 170.592 21.335C170.114 21.3925 169.924 22.8288 170.093 23.2263Z" fill="#E84814" />
    <path d="M157.372 18.8147C157.484 19.0727 157.866 19.1354 158.248 18.9716C158.586 18.8286 158.738 18.3911 158.571 17.9954C158.408 17.6154 158.211 17.5387 157.681 17.652C157.386 17.6886 157.269 18.5706 157.372 18.8147Z" fill="#E84814" />
    <path d="M164.103 18.543C164.285 18.9631 164.904 19.0659 165.524 18.7992C166.079 18.5639 166.325 17.8544 166.051 17.2112C165.786 16.5907 165.468 16.4652 164.604 16.6517C164.124 16.7092 163.932 18.1455 164.103 18.543Z" fill="#E84814" />
    <path d="M153.151 22.478C153.261 22.736 153.643 22.7988 154.025 22.6349C154.366 22.4902 154.516 22.0545 154.35 21.6588C154.186 21.2788 153.991 21.2003 153.46 21.3154C153.163 21.3502 153.045 22.234 153.151 22.478Z" fill="#E84814" />
    <path d="M154.245 26.0154C154.339 26.2298 154.655 26.2821 154.969 26.1461C155.254 26.0241 155.381 25.6615 155.238 25.3356C155.104 25.0183 154.941 24.9538 154.502 25.0497C154.257 25.0793 154.158 25.8132 154.245 26.0154Z" fill="#E84814" />
    <path d="M156.939 26.8843C157.013 27.0516 157.261 27.0934 157.507 26.9871C157.73 26.8912 157.826 26.6089 157.716 26.3526C157.611 26.1051 157.484 26.0528 157.14 26.1277C156.946 26.1521 156.873 26.7256 156.939 26.8843Z" fill="#E84814" />
    <path d="M159.287 26.0398C159.328 26.134 159.469 26.1584 159.61 26.0974C159.738 26.0416 159.792 25.883 159.731 25.7365C159.67 25.5953 159.598 25.5674 159.401 25.6075C159.291 25.6215 159.249 25.9492 159.287 26.0398Z" fill="#E84814" />
    <path d="M159.942 24.0492C159.967 24.1102 160.054 24.1224 160.143 24.0858C160.22 24.0527 160.256 23.9516 160.216 23.8609C160.179 23.7738 160.134 23.7564 160.012 23.7825C159.944 23.7912 159.918 23.9934 159.942 24.0492Z" fill="#E84814" />
    <path d="M158.599 22.569C158.623 22.6282 158.711 22.6422 158.8 22.6056C158.878 22.5725 158.915 22.4714 158.875 22.3807C158.838 22.2936 158.791 22.2761 158.671 22.3023C158.603 22.311 158.575 22.5132 158.599 22.569Z" fill="#E84814" />
    <path d="M157.529 23.695C157.543 23.7299 157.59 23.7351 157.639 23.7142C157.683 23.6968 157.702 23.6427 157.679 23.5922C157.658 23.5451 157.636 23.5364 157.568 23.5504C157.533 23.5538 157.515 23.6637 157.529 23.695Z" fill="#E84814" />
    <path d="M26.574 162.878C37.8205 165.589 47.8925 168.157 59.6677 167.349C102.345 164.442 144.338 143.833 172.371 111.491C194.412 86.0603 199.371 45.4663 177.953 18.1445C174.212 13.3718 162.444 0.176263 153.988 5.30978L152.993 6.00006L151.998 6.90475L151.002 8.0465L151.03 8.02035L150.829 8.6165L150.63 9.53862L150.512 10.6682C150.369 14.7959 155.63 22.077 160.383 19.2078C162.854 17.7139 162.222 13.6524 162.165 11.3253L162.884 11.1719C163.765 14.7175 164.829 19.9294 160.524 21.7109C153.005 24.8206 146.287 15.7895 146.846 9.06623C147.756 -1.91898 162.226 -1.54595 169.031 2.96527C199.865 23.3913 205.769 63.7674 192.172 96.3988C184.099 115.775 167.337 132.865 150.627 144.795C123.855 163.902 93.2535 176.679 60.3325 179.503C46.8281 180.66 35.2414 177.881 22.2674 174.993C18.917 173.808 17.1668 170.13 18.3569 166.783C19.5469 163.438 23.2254 161.69 26.574 162.878Z" fill="white" fill-opacity="0.5" />
  </g>
  <defs>
    <clipPath id="clip0_1_7629">
      <rect width="199" height="184" fill="white" />
    </clipPath>
  </defs>
</svg>
</div>

        <div className="absolute right-10 bottom-10 z-10 lg:right-10 lg:bottom-10">
  <CarouselControls
    currentSlide={heroCurrentSlide}
    totalSlides={heroSlides.length}
    onPrev={() => heroSwiperRef.current?.slidePrev()}
    onNext={() => heroSwiperRef.current?.slideNext()}
    progressClass="hero-progress"
  />
</div>
        {/* Content Container */}
        <div className="relative z-20 min-h-screen">
          {/* Header */}
          <Header
            navItems={navItems}
            activeNav={activeNav}
            setActiveNav={setActiveNav}
            isMenuOpen={isMenuOpen}
            setIsMenuOpen={setIsMenuOpen}
          />
        
        

          {/* Hero Section */}
          <section className="container mx-auto px-4 py-12 lg:px-8 lg:py-24">
            <div className="max-w-3xl">
              {/* Показываем только текущий слайд БЕЗ Swiper */}
              <div className="mb-12">
                <h1 className="mb-3 text-5xl font-bold leading-tight text-white lg:text-7xl">
                  {heroSlides[heroCurrentSlide].title}
                </h1>
                <div className="mb-6">
                  <svg
                    width="157"
                    height="7"
                    viewBox="0 0 157 7"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <mask
                      id="mask0_1_2763"
                      maskUnits="userSpaceOnUse"
                      x="0"
                      y="0"
                      width="157"
                      height="7"
                    >
                      <path
                        d="M156.168 6.05303H0V0H156.168V6.05303Z"
                        fill="white"
                      />
                    </mask>
                    <g mask="url(#mask0_1_2763)">
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M155.21 4.137C153.464 4.137 152.645 3.3435 151.609 2.3385C150.478 1.242 149.196 0 146.674 0C144.152 0 142.87 1.242 141.74 2.3385C140.703 3.3435 139.884 4.137 138.139 4.137C136.393 4.137 135.574 3.3435 134.537 2.3385C133.406 1.242 132.124 0 129.602 0C127.079 0 125.797 1.242 124.666 2.3385C123.628 3.3435 122.809 4.137 121.063 4.137C119.317 4.137 118.498 3.3435 117.46 2.3385C116.329 1.242 115.047 0 112.524 0C110.002 0 108.719 1.242 107.588 2.3385C106.551 3.3435 105.732 4.137 103.985 4.137C103.974 4.137 103.964 4.143 103.953 4.14375C103.941 4.143 103.932 4.137 103.92 4.137C102.174 4.137 101.355 3.3435 100.318 2.3385C99.1875 1.242 97.9057 0 95.3835 0C92.8612 0 91.5795 1.242 90.4492 2.3385C89.4127 3.3435 88.5937 4.137 86.8485 4.137C85.1025 4.137 84.2835 3.3435 83.247 2.3385C82.116 1.242 80.8335 0 78.3112 0C75.7882 0 74.5065 1.242 73.3755 2.3385C72.3382 3.3435 71.5192 4.137 69.7732 4.137C68.0265 4.137 67.2075 3.3435 66.1702 2.3385C65.0392 1.242 63.7567 0 61.2337 0C58.7115 0 57.429 1.242 56.298 2.3385C55.2608 3.3435 54.4417 4.137 52.695 4.137C52.6042 4.137 52.5225 4.16475 52.4393 4.18875C52.356 4.16475 52.2742 4.137 52.1835 4.137C50.4375 4.137 49.6185 3.3435 48.582 2.3385C47.451 1.24275 46.1685 0 43.6463 0C41.1248 0 39.843 1.24275 38.712 2.3385C37.6755 3.3435 36.8572 4.137 35.112 4.137C33.366 4.137 32.5463 3.3435 31.5098 2.3385C30.3788 1.24275 29.097 0 26.5748 0C24.0518 0 22.77 1.24275 21.6383 2.3385C20.6018 3.3435 19.7828 4.137 18.0368 4.137C16.29 4.137 15.4703 3.3435 14.4338 2.3385C13.302 1.24275 12.0202 0 9.49725 0C6.97425 0 5.6925 1.24275 4.5615 2.3385C3.52425 3.3435 2.70525 4.137 0.9585 4.137C0.429 4.137 0 4.566 0 5.09475C0 5.62425 0.429 6.05325 0.9585 6.05325C3.48075 6.05325 4.76325 4.8105 5.89425 3.71475C6.9315 2.70975 7.7505 1.91625 9.49725 1.91625C11.244 1.91625 12.063 2.70975 13.1003 3.71475C14.2313 4.8105 15.5138 6.05325 18.0368 6.05325C20.559 6.05325 21.8407 4.8105 22.9725 3.71475C24.009 2.70975 24.828 1.91625 26.5748 1.91625C28.3208 1.91625 29.1398 2.70975 30.1763 3.71475C31.3073 4.8105 32.589 6.05325 35.112 6.05325C37.6335 6.05325 38.9152 4.8105 40.0462 3.71475C41.082 2.70975 41.901 1.91625 43.6463 1.91625C45.393 1.91625 46.2113 2.70975 47.2485 3.71475C48.3795 4.8105 49.6612 6.05325 52.1835 6.05325C52.2742 6.05325 52.356 6.02475 52.4393 6.0015C52.5225 6.02475 52.6042 6.05325 52.695 6.05325C55.218 6.05325 56.4998 4.8105 57.6315 3.71475C58.668 2.70975 59.487 1.91625 61.2337 1.91625C62.9812 1.91625 63.8002 2.70975 64.8375 3.71475C65.9685 4.8105 67.2502 6.05325 69.7732 6.05325C72.2955 6.05325 73.578 4.8105 74.709 3.71475C75.7455 2.70975 76.5645 1.91625 78.3112 1.91625C80.0572 1.91625 80.8762 2.70975 81.9135 3.71475C83.0445 4.8105 84.3262 6.05325 86.8485 6.05325C89.37 6.05325 90.6517 4.8105 91.7827 3.71475C92.8192 2.70975 93.6375 1.91625 95.3835 1.91625C97.1295 1.91625 97.9485 2.70975 98.985 3.71475C100.116 4.8105 101.398 6.05325 103.92 6.05325C103.932 6.05325 103.941 6.04725 103.953 6.0465C103.964 6.04725 103.974 6.05325 103.985 6.05325C106.508 6.05325 107.79 4.8105 108.921 3.71475C109.958 2.70975 110.777 1.91625 112.524 1.91625C114.271 1.91625 115.09 2.70975 116.127 3.71475C117.259 4.8105 118.54 6.05325 121.063 6.05325C123.586 6.05325 124.868 4.8105 125.999 3.71475C127.036 2.70975 127.855 1.91625 129.602 1.91625C131.348 1.91625 132.167 2.70975 133.203 3.71475C134.335 4.8105 135.616 6.05325 138.139 6.05325C140.66 6.05325 141.942 4.8105 143.073 3.71475C144.109 2.70975 144.928 1.91625 146.674 1.91625C148.42 1.91625 149.239 2.70975 150.275 3.71475C151.406 4.8105 152.688 6.05325 155.21 6.05325C155.739 6.05325 156.168 5.62425 156.168 5.09475C156.168 4.566 155.739 4.137 155.21 4.137Z"
                        fill="white"
                      />
                    </g>
                  </svg>
                </div>
                <p className="max-w-xl text-base text-white lg:text-lg">
                  {heroSlides[heroCurrentSlide].description}
                </p>
              </div>
            </div>
          </section>
        </div>
      </section>
      <CentersSection locations={locations} centerCards={centerCardsData} />

      <CoursesSection locations={locations} courseCards={courseCards} />
      <TripsSection locations={locations} tripCards={tripCards} />
      <DiveTrips diveTripsCards={diveTripsCards} />
    </main>
  );
}
