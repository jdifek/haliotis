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
    {
      image: "/Rectangle 8.png",
      title:
        "Curso de Nitrox PADI Enriched Air Diver Madeira - inclui mergulhos",
      price: 239,
      duration: "3hrs",
      requestBased: true,
      badge: "Open Trip",
    },
    {
      image: "/Rectangle 8.png",
      title:
        "Curso de Nitrox PADI Enriched Air Diver Madeira - inclui mergulhos",
      price: 299,
      duration: "2 days",
      requestBased: false,
      badge: "Popular",
    },
    {
      image: "/Rectangle 8.png",
      title:
        "Curso de Nitrox PADI Enriched Air Diver Madeira - inclui mergulhos",
      price: 349,
      duration: "3 days",
      requestBased: true,
      badge: "New",
    },
    {
      image: "/Rectangle 8.png",
      title:
        "Curso de Nitrox PADI Enriched Air Diver Madeira - inclui mergulhos",
      price: 899,
      duration: "4 weeks",
      requestBased: false,
      badge: "Professional",
    },
    {
      image: "/Rectangle 8.png",
      title:
        "Curso de Nitrox PADI Enriched Air Diver Madeira - inclui mergulhos",
      price: 399,
      duration: "3 days",
      requestBased: false,
      badge: "Beginner",
    },
    {
      image: "/Rectangle 8.png",
      title:
        "Curso de Nitrox PADI Enriched Air Diver Madeira - inclui mergulhos",
      price: 199,
      duration: "2 days",
      requestBased: true,
      badge: "Specialty",
    },
    {
      image: "/Rectangle 8.png",
      title:
        "Curso de Nitrox PADI Enriched Air Diver Madeira - inclui mergulhos",
      price: 249,
      duration: "2 days",
      requestBased: false,
      badge: "Adventure",
    },
    {
      image: "/Rectangle 8.png",
      title:
        "Curso de Nitrox PADI Enriched Air Diver Madeira - inclui mergulhos",
      price: 179,
      duration: "1 day",
      requestBased: true,
      badge: "Specialty",
    },
    {
      image: "/Rectangle 8.png",
      title:
        "Curso de Nitrox PADI Enriched Air Diver Madeira - inclui mergulhos",
      price: 299,
      duration: "2 days",
      requestBased: false,
      badge: "Creative",
    },
  ];
  const tripCards = [
    {
      image: "/image 6.png",
      price: 239,
      title: "Diving Safety Tips",
      description: "Learn essential safety practices for your next dive",
      link: "/articles/diving-safety",
    },
    {
      image: "/image 6.png",
      price: 189,
      title: "Ocean Exploration",
      description: "Discover the underwater world",
      link: "/articles/ocean",
    },
    {
      image: "/image 6.png",
      price: 299,
      title: "Deep Sea Adventure",
      description: "Experience the depths like never before",
      link: "/articles/deep-sea",
    },
    {
      image: "/image 6.png",
      price: 219,
      title: "Wreck Diving Experience",
      description: "Explore sunken ships and underwater history",
      link: "/articles/wreck-diving",
    },
    {
      image: "/image 6.png",
      price: 259,
      title: "Night Diving Adventure",
      description: "Discover the ocean's nocturnal wonders",
      link: "/articles/night-diving",
    },
    {
      image: "/image 6.png",
      price: 279,
      title: "Reef Conservation Trip",
      description: "Help protect and restore coral reefs",
      link: "/articles/reef-conservation",
    },
    {
      image: "/image 6.png",
      price: 329,
      title: "Shark Encounter",
      description: "Safely observe sharks in their natural habitat",
      link: "/articles/shark-encounter",
    },
    {
      image: "/image 6.png",
      price: 199,
      title: "Underwater Photography Tour",
      description: "Capture stunning underwater moments",
      link: "/articles/photography",
    },
    {
      image: "/image 6.png",
      price: 249,
      title: "Cave Diving Expedition",
      description: "Explore mysterious underwater caves",
      link: "/articles/cave-diving",
    },
    {
      image: "/image 6.png",
      price: 289,
      title: "Dolphin Watching Trip",
      description: "Swim with friendly dolphins",
      link: "/articles/dolphins",
    },
    {
      image: "/image 6.png",
      price: 269,
      title: "Turtle Sanctuary Visit",
      description: "Meet sea turtles and learn about conservation",
      link: "/articles/turtles",
    },
    {
      image: "/image 6.png",
      price: 339,
      title: "Multi-Day Liveaboard",
      description: "Extended diving adventure on a boat",
      link: "/articles/liveaboard",
    },
    {
      image: "/image 6.png",
      price: 209,
      title: "Drift Diving Experience",
      description: "Glide effortlessly with ocean currents",
      link: "/articles/drift-diving",
    },
    {
      image: "/image 6.png",
      price: 229,
      title: "Macro Photography Dive",
      description: "Discover tiny underwater creatures",
      link: "/articles/macro",
    },
    {
      image: "/image 6.png",
      price: 319,
      title: "Technical Diving Course",
      description: "Advanced diving techniques and equipment",
      link: "/articles/technical",
    },
    {
      image: "/image 6.png",
      price: 179,
      title: "Beginner Snorkeling",
      description: "Perfect introduction to underwater exploration",
      link: "/articles/snorkeling",
    },
    {
      image: "/image 6.png",
      price: 399,
      title: "Manta Ray Encounter",
      description: "Swim with majestic manta rays",
      link: "/articles/manta-rays",
    },
    {
      image: "/image 6.png",
      price: 259,
      title: "Whale Watching Tour",
      description: "Observe whales during migration season",
      link: "/articles/whales",
    },
    {
      image: "/image 6.png",
      price: 189,
      title: "Beach Cleanup Dive",
      description: "Combine diving with environmental cleanup",
      link: "/articles/cleanup",
    },
    {
      image: "/image 6.png",
      price: 349,
      title: "Ice Diving Adventure",
      description: "Unique diving experience in frozen waters",
      link: "/articles/ice-diving",
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

        <div className="absolute right-10 bottom-10 z-10 hidden lg:block">
          <CarouselControls
            currentSlide={heroCurrentSlide}
            totalSlides={heroSlides.length}
            onPrev={() => heroSwiperRef.current?.slidePrev()}
            onNext={() => heroSwiperRef.current?.slideNext()}
            progressClass="hero-progress "
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
      <CoursesSection locations={locations} courseCards={courseCards} />
      <TripsSection locations={locations} tripCards={tripCards} />
      <DiveTrips diveTripsCards={diveTripsCards} />
    </main>
  );
}
