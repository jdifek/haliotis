"use client";

import { LegalInfo } from "@/components/CoursesPage/LegalInfo";
import { Parceiros } from "@/components/CoursesPage/Parceiros";
import { PaymentMethods } from "@/components/CoursesPage/PaymentMethods";
import { PenicheHero } from "@/components/CoursesPage/PenicheHero";
import { SimpleCoursesSection } from "@/components/CoursesPage/SimpleCoursesSection";
import { SimpleTripsSection } from "@/components/CoursesPage/SimpleTripsSection";
import { CenterInfoSection } from "@/components/CoursesPage/CenterInfoSection";
const tripCards = [
  // PENICHE
  {
    image: "/image 6.png",
    price: 189,
    title: "PENICHE",
    description:
      "Discover the underwater world with guided tours and marine biology insights",
    link: "/articles/ocean",
    location: "peniche",
    details: `<p>Morning dive trip by boat to 2 different dive sites in Berlengas Natural Reserve intended for certified divers.</p>
    <p>The Archipelago of Berlengas is composed by 3 groups of islands. Both can provide great dive sites at all levels of experience!</p>
    <p>The meeting point is in our diving center at 8h30, where you will prepare all the diving equipment.</p>`,
    equipmentPrice: "€ 30.00",
  },
  {
    image: "/image 6.png",
    price: 299,
    title: "PENICHE",
    description:
      "Experience the depths like never before in protected natural habitats",
    link: "/articles/deep-sea",
    location: "peniche",
    details: `<p>Deep diving experience in Berlengas Marine Reserve. Explore depths up to 30 meters.</p>
    <p>This trip includes professional dive guide, equipment rental, and underwater photography service.</p>
    <p>Return time is between 15h00 and 16h00. Hot showers available at our facilities.</p>`,
    equipmentPrice: "€ 35.00",
  },
  {
    image: "/image 6.png",
    price: 219,
    title: "PENICHE",
    description:
      "Explore sunken ships and underwater history with expert guides",
    link: "/articles/wreck-diving",
    location: "peniche",
    details: `<p>Explore historic shipwrecks from the 19th century. Perfect for experienced divers.</p>
    <p>All safety equipment included. Dive guide will explain the history of each wreck.</p>`,
    equipmentPrice: "€ 25.00",
  },
  {
    image: "/image 6.png",
    price: 249,
    title: "PENICHE",
    description:
      "Capture stunning underwater moments with professional photography training",
    link: "/articles/photography",
    location: "peniche",
    details: `<p>Learn underwater photography techniques from professional photographers.</p>
    <p>Camera equipment rental available. Small groups for personalized instruction.</p>`,
    equipmentPrice: "€ 40.00",
  },

  // MADEIRA
  {
    image: "/image 6.png",
    price: 239,
    title: "MADEIRA",
    description:
      "Learn essential safety practices for your next dive with professional instructors",
    link: "/articles/diving-safety",
    location: "madeira",
    details: `<p>Comprehensive safety training course. Learn emergency procedures and rescue techniques.</p>
    <p>Certification upon completion. Includes practical exercises and theory sessions.</p>`,
    equipmentPrice: "€ 20.00",
  },
  {
    image: "/image 6.png",
    price: 259,
    title: "MADEIRA",
    description:
      "Discover the ocean's nocturnal wonders in subtropical Atlantic waters",
    link: "/articles/night-diving",
    location: "madeira",
    details: `<p>Night diving in Madeira's crystal clear waters. See nocturnal marine species.</p>
    <p>Special underwater lights provided. Maximum 6 divers per group for safety.</p>`,
    equipmentPrice: "€ 30.00",
  },
  {
    image: "/image 6.png",
    price: 279,
    title: "MADEIRA",
    description:
      "Help protect and restore coral reefs with marine conservation team",
    link: "/articles/reef-conservation",
    location: "madeira",
    details: `<p>Participate in coral reef restoration project. Work alongside marine biologists.</p>
    <p>Learn about marine conservation. Make a real difference for ocean health.</p>`,
    equipmentPrice: "€ 15.00",
  },
  {
    image: "/image 6.png",
    price: 329,
    title: "MADEIRA",
    description:
      "Safely observe diverse marine life in their natural island habitat",
    link: "/articles/shark-encounter",
    location: "madeira",
    details: `<p>Wildlife safari to observe dolphins, turtles, and rays in their natural habitat.</p>
    <p>Full day trip with lunch included. Experienced marine biologist guide.</p>`,
    equipmentPrice: "€ 45.00",
  },

  // SESIMBRA
  {
    image: "/image 6.png",
    price: 199,
    title: "SESIMBRA",
    description:
      "Perfect introduction to underwater exploration in calm protected bays",
    link: "/articles/snorkeling",
    location: "sesimbra",
    details: `<p>Perfect for beginners and families. Explore calm, shallow waters of Arrábida.</p>
    <p>All snorkeling equipment provided. Professional guide ensures safety.</p>`,
    equipmentPrice: "€ 10.00",
  },
  {
    image: "/image 6.png",
    price: 269,
    title: "SESIMBRA",
    description:
      "Explore mysterious underwater caves with experienced speleology guides",
    link: "/articles/cave-diving",
    location: "sesimbra",
    details: `<p>Advanced cave diving experience. Explore stunning underwater caves.</p>
    <p>Cave diving certification required. Small groups for maximum safety.</p>`,
    equipmentPrice: "€ 35.00",
  },
  {
    image: "/image 6.png",
    price: 229,
    title: "SESIMBRA",
    description:
      "Discover tiny underwater creatures with specialized macro lens equipment",
    link: "/articles/macro",
    location: "sesimbra",
    details: `<p>Macro photography dive focusing on tiny marine creatures and details.</p>
    <p>Macro lens rental available. Learn techniques for capturing small subjects.</p>`,
    equipmentPrice: "€ 25.00",
  },

  // SANTA MARIA
  {
    image: "/image 6.png",
    price: 289,
    title: "MARIA",
    description:
      "Swim with friendly dolphins in pristine Azorean blue waters",
    link: "/articles/dolphins",
    location: "santa-maria",
    details: `<p>Swim with wild Atlantic spotted dolphins in crystal clear waters.</p>
    <p>Respectful wildlife interaction. Professional guides ensure dolphin safety.</p>`,
    equipmentPrice: "€ 20.00",
  },
  {
    image: "/image 6.png",
    price: 399,
    title: "MARIA",
    description:
      "Swim with majestic manta rays during seasonal migration routes",
    link: "/articles/manta-rays",
    location: "santa-maria",
    details: `<p>Once in a lifetime manta ray encounter. Best season from June to October.</p>
    <p>Full day boat trip. Includes breakfast and lunch on board.</p>`,
    equipmentPrice: "€ 50.00",
  },
  {
    image: "/image 6.png",
    price: 209,
    title: "MARIA",
    description:
      "Glide effortlessly with ocean currents in volcanic underwater landscapes",
    link: "/articles/drift-diving",
    location: "santa-maria",
    details: `<p>Drift diving along volcanic formations. Advanced certification required.</p>
    <p>Experience weightless gliding with ocean currents. Safety boat follows group.</p>`,
    equipmentPrice: "€ 30.00",
  },

  // FAIAL
  {
    image: "/image 6.png",
    price: 269,
    title: "FAIAL",
    description:
      "Meet sea turtles and learn about conservation efforts firsthand",
    link: "/articles/turtles",
    location: "faial",
    details: `<p>Visit turtle sanctuary and rehabilitation center. Meet rescued sea turtles.</p>
    <p>Learn about conservation efforts. Support important marine protection work.</p>`,
    equipmentPrice: "€ 15.00",
  },
  {
    image: "/image 6.png",
    price: 339,
    title: "FAIAL",
    description:
      "Extended diving adventure on a boat visiting multiple locations",
    link: "/articles/liveaboard",
    location: "faial",
    details: `<p>3-day liveaboard diving trip exploring remote Azorean islands.</p>
    <p>All meals included. Up to 3 dives per day. Comfortable accommodation on board.</p>`,
    equipmentPrice: "€ 60.00",
  },
  {
    image: "/image 6.png",
    price: 259,
    title: "FAIAL",
    description:
      "Observe whales during migration season with marine mammal experts",
    link: "/articles/whales",
    location: "faial",
    details: `<p>Whale watching tour during migration season. See sperm whales and other cetaceans.</p>
    <p>Expert marine biologist on board. Respectful wildlife observation practices.</p>`,
    equipmentPrice: "€ 25.00",
  },

  // SAO VICENTE
  {
    image: "/image 6.png",
    price: 319,
    title: "SAO VICENTE",
    description:
      "Advanced diving techniques and equipment for experienced divers only",
    link: "/articles/technical",
    location: "sao-vicente",
    details: `<p>Technical diving certification course. Learn to use advanced equipment.</p>
    <p>Covers decompression diving, trimix, and rebreathers. 5-day intensive course.</p>`,
    equipmentPrice: "€ 100.00",
  },
  {
    image: "/image 6.png",
    title: "SAO VICENTE",
    price: 189,
    description:
      "Combine diving with environmental cleanup supporting ocean health",
    link: "/articles/cleanup",
    location: "sao-vicente",
    details: `<p>Underwater cleanup dive. Help remove marine debris and plastics.</p>
    <p>Make a positive impact while diving. All cleanup equipment provided.</p>`,
    equipmentPrice: "€ 5.00",
  },
  {
    image: "/image 6.png",
    price: 349,
    title: "SAO VICENTE",
    description:
      "Unique diving experience exploring vibrant tropical reef ecosystems",
    link: "/articles/ice-diving",
    location: "sao-vicente",
    details: `<p>Explore colorful tropical reefs with endemic Cape Verde species.</p>
    <p>Full day safari visiting multiple reef sites. Vibrant marine biodiversity.</p>`,
    equipmentPrice: "€ 40.00",
  },
];

const courseCards = [
  // PENICHE
  {
    image: "/Rectangle 8.png",
    title:
      "PENICHE PADI Rescue Diver Course with Emergency First Response Training",
    price: 349,
    duration: "3 days",
    requestBased: true,
    badge: "New",
    location: "peniche",
  },
  {
    image: "/Rectangle 8.png",
    title:
      "PENICHE Deep Diving Specialty Course for Advanced Divers in Berlengas",
    price: 199,
    duration: "2 days",
    requestBased: false,
    badge: "Specialty",
    location: "peniche",
  },
  {
    image: "/Rectangle 8.png",
    title:
      "PENICHE Night Diving Adventure Course with Underwater Navigation Skills",
    price: 249,
    duration: "2 days",
    requestBased: true,
    badge: "Adventure",
    location: "peniche",
  },

  // MADEIRA
  {
    image: "/Rectangle 8.png",
    title:
      "MADEIRA Curso de Nitrox PADI Enriched Air Diver - inclui mergulhos",
    price: 239,
    duration: "3hrs",
    requestBased: true,
    badge: "Open Trip",
    location: "madeira",
  },
  {
    image: "/Rectangle 8.png",
    title:
      "MADEIRA Wreck Diving Specialty exploring Historic Shipwrecks of Madeira",
    price: 279,
    duration: "3 days",
    requestBased: false,
    badge: "Specialty",
    location: "madeira",
  },
  {
    image: "/Rectangle 8.png",
    title:
      "MADEIRA Marine Life Identification Course with Local Endemic Species",
    price: 189,
    duration: "2 days",
    requestBased: true,
    badge: "Educational",
    location: "madeira",
  },
  {
    image: "/Rectangle 8.png",
    title:
      "MADEIRA Underwater Photography Workshop capturing Atlantic Marine Beauty",
    price: 329,
    duration: "3 days",
    requestBased: false,
    badge: "Creative",
    location: "madeira",
  },

  // SESIMBRA
  {
    image: "/Rectangle 8.png",
    title:
      "SESIMBRA Divemaster Professional Course with Leadership Development Training",
    price: 899,
    duration: "4 weeks",
    requestBased: false,
    badge: "Professional",
    location: "sesimbra",
  },
  {
    image: "/Rectangle 8.png",
    title:
      "SESIMBRA Open Water Diver Certification Course for Complete Beginners",
    price: 399,
    duration: "3 days",
    requestBased: false,
    badge: "Beginner",
    location: "sesimbra",
  },
  {
    image: "/Rectangle 8.png",
    title:
      "SESIMBRA Peak Performance Buoyancy Course improving Diving Control Skills",
    price: 179,
    duration: "1 day",
    requestBased: true,
    badge: "Specialty",
    location: "sesimbra",
  },

  // SANTA MARIA
  {
    image: "/Rectangle 8.png",
    title:
      "SANTA MARIA Blue Shark Diving Experience with Marine Biologist Guidance",
    price: 459,
    duration: "1 day",
    requestBased: true,
    badge: "Adventure",
    location: "santa-maria",
  },
  {
    image: "/Rectangle 8.png",
    title:
      "SANTA MARIA Manta Ray Encounter Diving Safari in Azorean Atlantic Waters",
    price: 389,
    duration: "2 days",
    requestBased: false,
    badge: "Popular",
    location: "santa-maria",
  },
  {
    image: "/Rectangle 8.png",
    title:
      "SANTA MARIA Drift Diving Specialty Course exploring Strong Ocean Currents",
    price: 229,
    duration: "2 days",
    requestBased: true,
    badge: "Specialty",
    location: "santa-maria",
  },

  // FAIAL
  {
    image: "/Rectangle 8.png",
    title:
      "FAIAL Volcanic Diving Adventure exploring Underwater Lava Formations",
    price: 319,
    duration: "2 days",
    requestBased: false,
    badge: "Adventure",
    location: "faial",
  },
  {
    image: "/Rectangle 8.png",
    title:
      "FAIAL Whale Watching Diving Tour with Cetacean Research Experience",
    price: 429,
    duration: "1 day",
    requestBased: true,
    badge: "Educational",
    location: "faial",
  },
  {
    image: "/Rectangle 8.png",
    title:
      "FAIAL Altitude Diving Specialty Course in Caldeira Lake Ecosystem",
    price: 269,
    duration: "2 days",
    requestBased: false,
    badge: "Specialty",
    location: "faial",
  },

  // SAO VICENTE
  {
    image: "/Rectangle 8.png",
    title:
      "SAO VICENTE Tropical Reef Diving Safari discovering Caribbean Marine Species",
    price: 359,
    duration: "3 days",
    requestBased: false,
    badge: "Adventure",
    location: "sao-vicente",
  },
  {
    image: "/Rectangle 8.png",
    title:
      "SAO VICENTE Cave Diving Introduction Course exploring Underwater Caverns",
    price: 399,
    duration: "2 days",
    requestBased: true,
    badge: "Advanced",
    location: "sao-vicente",
  },
  {
    image: "/Rectangle 8.png",
    title:
      "SAO VICENTE Fish Identification Specialty learning Endemic Cape Verde Species",
    price: 199,
    duration: "2 days",
    requestBased: false,
    badge: "Educational",
    location: "sao-vicente",
  },
];
export default function PenichePage() {
 

  return (
    <div className="min-h-screen bg-white">
      <PenicheHero />
      <SimpleTripsSection className={'!bg-white py-8'} tripCards={tripCards} />
      <SimpleCoursesSection className={'!bg-[#f1f1f1]'} courseCards={courseCards} />
      <CenterInfoSection />
      <Parceiros />
      <div className="md:hidden mx-4 md:mx-8  h-px border border-[#e4e4e4] mt-10 " />
      <PaymentMethods />

      <LegalInfo />
    </div>
  );
}