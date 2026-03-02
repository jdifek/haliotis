'use client';

import { useState } from 'react';

export default function CoursesSectionInfo() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleAccordion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const accordionItems = [
    {
      title: 'Medical requirements',
      content: 'Scuba diving requires a minimum level of health and fitness. To avoid disappointment, access and review the diver\'s medical form and make sure you don\'t need a doctor\'s approval to dive before signing up for a diving course.'
    },
    {
      title: 'Aquaticity requirements',
      content: 'In addition to the specific requirements of each course, scuba diving requires that you are able to swim, regardless of your level of technique, and that you are comfortable in the water. It is the candidate\'s responsibility to ensure that they meet these and other specific requirements before enrolling on the course.'
    },
    {
      title: 'eLearning',
      content: 'eLearning should ideally be completed in full before starting the practical component with your instructor. The time taken to complete it varies.'
    },
    {
      title: 'Duration',
      content: 'Although the courses have a set duration, they are performance-based. Failure to meet mandatory performance requirements may require extra lessons, which are not included in the initial course fee.'
    },
    {
      title: 'Flying',
      content: 'You may only fly after completing your course 12 hours after completing a single open water dive, or 18 hours after completing more than one open water dive.'
    },
    {
      title: 'After your course',
      content: 'After completing your course, talk to your instructor about the possibilities for continuing your adventure. The possibilities are varied - local dive trips, education, travel and purchasing equipment. Don\'t forget that we have six dive centers ready to welcome you.'
    }
  ];

  return (
    <section className="bg-white py-3 md:py-[80px] px-4 md:px-5">
      <div className="max-w-[1200px] mx-auto">
        {/* Header */}
        <h1 className="font-medium text-[32px] md:text-[42px] leading-[130%] text-black mb-2 md:mb-3">
          Courses and Experiences Important Information
        </h1>
        <p className="text-[14px] md:text-[15px] leading-[160%] text-[#101010] opacity-80 mb-3 md:mb-6">
          Find the perfect diving experience.
        </p>

        {/* Intro Text */}
        <div className="">
          <p className="text-[14px] md:text-[15px] leading-[160%] text-[#101010] opacity-80 mb-4 md:mb-6">
            Haliotis Sesimbra has been a PADI dive center since 2004 and currently holds the rating of PADI Dive Center. We offer the following PADI courses: recreational, technical, and free diving (apnea), from beginner level through various specialties to professional levels like Divemaster.
          </p>
          <p className="text-[14px] md:text-[15px] leading-[160%] text-[#101010] opacity-80 mb-4 md:mb-6">
            Our diving courses are tailored to your availability - start diving lessons whenever you want and choose the teaching method you prefer! We offer courses with only one participant at no additional cost!
          </p>
          <p className="text-[14px] md:text-[15px] leading-[160%] text-[#101010] opacity-80">
            Before signing up for a course, make sure you meet all the requirements listed below.
          </p>
        </div>

        {/* Desktop - No Accordion */}
        <div className="hidden md:block">
          {accordionItems.map((item, index) => (
            <div key={index} className="py-3">
              <h3 className="font-medium text-[24px] leading-[140%] text-[#111] mb-3">
                {item.title}
              </h3>
              <p className="text-[15px] leading-[160%] text-[#101010] opacity-80">
                {item.content}
              </p>
            </div>
          ))}
        </div>

        {/* Mobile - Accordion */}
        <div className="md:hidden">
          {accordionItems.map((item, index) => (
            <div key={index}>
              <button
                onClick={() => toggleAccordion(index)}
                className="w-full flex items-center justify-between py-2 text-left"
              >
                <h3 className="font-medium text-[18px] leading-[140%] text-[#111] pr-3">
                  {item.title}
                </h3>
                <svg 
                  width="24" 
                  height="24" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  xmlns="http://www.w3.org/2000/svg"
                  className={`flex-shrink-0 transition-transform duration-300 ${
                    openIndex === index ? 'rotate-180' : ''
                  }`}
                >
                  <path d="M17.8534 14.1463L12.8537 9.14663C12.8073 9.10015 12.7522 9.06327 12.6915 9.03811C12.6308 9.01295 12.5657 9 12.5 9C12.4343 9 12.3692 9.01295 12.3085 9.03811C12.2478 9.06327 12.1927 9.10015 12.1463 9.14663L7.14663 14.1463C7.07663 14.2162 7.02895 14.3053 7.00963 14.4024C6.9903 14.4994 7.00021 14.6 7.03808 14.6914C7.07595 14.7828 7.1401 14.8609 7.22239 14.9159C7.30468 14.9708 7.40142 15.0001 7.50036 15H17.4996C17.5986 15.0001 17.6953 14.9708 17.7776 14.9159C17.8599 14.8609 17.924 14.7828 17.9619 14.6914C17.9998 14.6 18.0097 14.4994 17.9904 14.4024C17.971 14.3053 17.9234 14.2162 17.8534 14.1463Z" fill="black" />
                </svg>
              </button>
              <div
                className={`overflow-hidden transition-all duration-300 ${
                  openIndex === index ? 'max-h-[500px]' : 'max-h-0'
                }`}
              >
                <div className="pb-2">
                  <p className="text-[14px] leading-[160%] text-[#101010] opacity-80">
                    {item.content}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Contact Section */}
        <div className="">
          <h2 className="font-medium text-[20px] md:text-[24px] leading-[140%] text-[#111] mb-3">
            Haliotis near you
          </h2>
          <p className="text-[14px] md:text-[15px] leading-[160%]">
            <a href="#" className="text-[#e84814] underline decoration-skip-ink-none">
              Contact us
            </a>
            <span className="text-[#101010] opacity-80"> for more information or to enrol a course.</span>
          </p>
        </div>
      </div>
    </section>
  );
}