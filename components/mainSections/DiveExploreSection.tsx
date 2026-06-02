"use client";

import Image from "next/image";
import { ButtonWithIcon } from "../buttons/ButtonWithIcon";

type Card = {
  title: string;
  description: string;
  image: string;
  tag: string;
  href: string;
};

const mockCards: Card[] = [
  {
    title: "Learn to Dive with PADI",
    description:
      "From your first breath underwater to advanced certifications — our instructors guide you every step of the way.",
    image: "/travel.png",
    tag: "COURSES",
    href: "/courses",
  },
  {
    title: "Dive Into the Unknown",
    description:
      "Join our guided dive trips to the most breathtaking underwater sites across the world.",
    image: "/travel.png",
    tag: "TRIPS",
    href: "/trips",
  },
  {
    title: "Plan Your Dive Adventure",
    description:
      "We help you combine diving with travel experiences across the best ocean destinations.",
    image: "/travel.png",
    tag: "TRAVEL",
    href: "/travel",
  },
];

export const DiveExploreSection = () => {
  return (
    <section className="section">
      {/* Header */}
      <div className="header">
        <h2 className="text-black">Dive. Learn. Explore.</h2>
        <p>
          Courses, dive trips, and travel experiences — find the adventure that&apos;s right for you.
        </p>
      </div>

      {/* Grid */}
      <div className="grid">
        {mockCards.map((card, index) => (
          <div className="card" key={index}>
            <Image src={card.image} alt={card.title} fill className="image" />

            <div className="overlay" />

            {/* TOP CONTENT (tag only) */}
            <div className="top-content">
              <div className="tag-wrapper">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none">
                  <rect width="24" height="24" rx="12" fill="#E84814" />
                  <path
                    d="M12 8.5V15.5M14.45 9.54L9.54 14.45M15.47 12H8.53M14.45 14.45L9.54 9.54"
                    stroke="#0C0C0C"
                    strokeWidth="0.833"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>

                <div className="tag">{card.tag}</div>
              </div>
            </div>

            {/* BOTTOM PANEL */}
            <div className="bottom-panel">
              <div className="text-block">
                <h3>{card.title}</h3>
                <p>{card.description}</p>
              </div>

              <ButtonWithIcon
                href={card.href}
                label="Explore"
                width="160px"
                height="48px"
                className="custom-button"
                icon={
                 <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
<path d="M17.5 7.50033H6.25C4.17893 7.50033 2.5 9.17926 2.5 11.2503C2.5 13.3214 4.17893 15.0003 6.25 15.0003H10M14.1667 10.8337L17.5 7.50033L14.1667 4.16699" stroke="#E84814" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
                }
              />
            </div>
          </div>
        ))}
      </div>

      <style jsx>{`
        .section {
          width: 100%;
          background: #f1f1f1;
          padding: 64px 0;
        }

        /* HEADER */
        .header {
          text-align: center;
          margin-bottom: 48px;
          padding: 0 20px;
        }

        .header h2 {
          font-size: clamp(26px, 3vw, 44px);
          font-weight: 500;
          margin: 0;
        }

        .header p {
          font-size: 15px;
          margin-top: 10px;
          max-width: 640px;
          margin-left: auto;
          margin-right: auto;
          color: rgba(0,0,0,0.75);
        }

        /* GRID */
        .grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 24px;
          width: 100%;
          box-sizing: border-box;
          padding: 0 24px;
        }

        @media (max-width: 1024px) {
          .grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 640px) {
          .grid {
            grid-template-columns: 1fr;
          }
        }

        /* CARD */
        .card {
          position: relative;
          height: 420px;
          border-radius: 22px;
          overflow: hidden;
        }

        .image {
          object-fit: cover;
        }

        .overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            to bottom,
            rgba(0,0,0,0.1),
            rgba(0,0,0,0.75)
          );
        }

        /* TOP CONTENT */
        .top-content {
          position: absolute;
          top: 20px;
          left: 20px;
          z-index: 3;
        }

        .tag-wrapper {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .tag {
          color: #fff;
          font-size: 14px;
          font-weight: 500;
        }

        /* BOTTOM PANEL */
        .bottom-panel {
        
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;

          background: rgba(0, 0, 0, 0.3);
          border-radius: 16px;
margin: 20px;
          padding: 40px 16px 12px;

          display: flex;
          flex-direction: column;
          gap: 14px;

          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);

          z-index: 3;
        }

        .text-block h3 {
          margin: 0;
          font-size: 20px;
          color: #fff;
        }

        .text-block p {
          margin: 8px 0 0;
          font-size: 14px;
          line-height: 1.5;
          color: rgba(255,255,255,0.8);
        }

        .custom-button {
          background: #e84814;
        }

        .custom-button:hover {
          opacity: 0.9;
        }
      `}</style>
    </section>
  );
};