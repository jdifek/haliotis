// app/[locale]/courses/[...slug]/page.tsx
// Обрабатывает: /courses/category, /courses/category/center, /courses/course-name

import { Metadata } from "next";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { CourseDetailClient } from "@/components/CourseDetailClient";
import Courses from "../page";

type Props = {
  params: Promise<{ locale: string; slug: string[] }>;
};

// API для деталей курса
type CourseData = {
  data: {
    id: number;
    name: string;
    slug: string;
    image: string | null;
    price_per_person_eur: number | null;
    description: string | null;
    content: string | null;
    structure: string | null;
    duration: string | null;
    duration_label: string | null;
    requirements: string | null;
    included: string | null;
    assigned: string | null;
    label: {
      id: number;
      name: string;
      image: string | null;
    } | null;
  };
  recommended: {
    headers: {
      id: string;
      widget: string;
      entity: string;
      title: string;
      description: string;
    };
    courses: Array<{
      id: string;
      center_ids: string;
      name: string;
      description: string;
      slug: string;
      image_url: string | null;
      duration_label: string;
      label: {
        id: number;
        name: string;
        image: string | null;
      } | null;
      price: Array<{
        amount: number;
        currency: string;
      }>;
    }>;
  };
  recommendedEquipment: {
    headers: {
      id: string;
      widget: string;
      entity: string;
      title: string;
      description: string;
    };
    equipment: string;
  };
  seo: {
    meta_description: string | null;
    meta_keywords: string | null;
  };
};

async function getCourseData(
  slug: string,
  locale: string
): Promise<CourseData | null> {
  try {
    const response = await fetch(
      `https://cp.haliotis.space/api/v1/courses/${slug}?lang=${locale}`,
      {
        headers: { Accept: "application/json" },
        next: { revalidate: 3600 },
      }
    );
    if (!response.ok) return null;
    return response.json();
  } catch (error) {
    console.error("Failed to fetch course data:", error);
    return null;
  }
}

function buildAccordionItems(data: CourseData["data"]) {
  const fields: Array<{ id: string; label: string; html: string }> = [
    { id: "content", label: "Content", html: data.content ?? "" },
    { id: "structure", label: "Structure", html: data.structure ?? "" },
    { id: "duration", label: "Duration", html: data.duration ?? "" },
    { id: "requirements", label: "Requirements", html: data.requirements ?? "" },
    { id: "included", label: "Included", html: data.included ?? "" },
    { id: "assigned", label: "Assigned", html: data.assigned ?? "" },
  ];

  return fields
    .filter((f) => f.html.trim() !== "")
    .map((f) => ({
      id: f.id,
      label: f.label,
      html: f.html,
    }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  
  // slug[0] может быть категория/центр/курс
  // Попытаемся загрузить как курс
  const courseData = await getCourseData(slug[slug.length - 1], locale);

  if (courseData) {
    return {
      title: courseData.data.name,
      description:
        courseData.seo?.meta_description || courseData.data.description || "",
      keywords: courseData.seo?.meta_keywords ?? undefined,
      openGraph: {
        title: courseData.data.name,
        description: courseData.data.description || "",
        images: courseData.data.image
          ? [{ url: courseData.data.image, width: 1200, height: 630, alt: courseData.data.name }]
          : [],
      },
    };
  }

  return {
    title: "Courses",
    description: "Diving courses",
  };
}

export default async function CoursesPage({ params }: Props) {
  const { locale, slug } = await params;

  // slug[0] = первый параметр
  // slug[1] = второй параметр (если есть)
  // slug[2] = третий параметр (если есть)

  // Логика:
  // /courses/category → slug = ['category']
  // /courses/category/center → slug = ['category', 'center']
  // /courses/padi-open-water → slug = ['padi-open-water']

  // Пытаемся загрузить как курс (последний элемент в slug)
  const potentialCourseSlug = slug[slug.length - 1];
  const courseData = await getCourseData(potentialCourseSlug, locale);

  // Если это курс, показываем деталь
  if (courseData) {
    const { data, recommended, recommendedEquipment } = courseData;

    const accordionItems = buildAccordionItems(data).map((item) => ({
      id: item.id,
      label: item.label,
      content: (
        <div
          className="text-[15px] font-normal leading-[160%] text-[#101010] opacity-80"
          dangerouslySetInnerHTML={{ __html: item.html }}
        />
      ),
    }));

    const recommendedCourseCards = recommended.courses.map((course) => ({
      image: course.image_url || "/Rectangle 8.png",
      title: course.name,
      price: course.price?.[0]?.amount || 0,
      duration: course.duration_label || "3hrs",
      requestBased: false,
      badge: course.label?.name || "Course",
      location: "",
      slug: course.slug,
    }));

    return (
      <main className="min-h-screen bg-white relative pt-4 md:pt-6">
        <div className="px-4 md:px-8 lg:px-[188px]">
          <Breadcrumbs
            className="mb-6 md:mb-8"
            items={[
              { label: "Haliotis", href: "/" },
              { label: "Courses", href: `/${locale}/courses` },
              { label: data.name },
            ]}
          />
        </div>

        <CourseDetailClient
          courseTitle={data.name}
          courseDescription={data.description || ""}
          pricePerPerson={data.price_per_person_eur || 0}
          courseImage={data.image || "/Rectangle 8.png"}
          courseImageAlt={data.name}
          accordionItems={accordionItems}
          recommendedCourses={recommendedCourseCards}
          recommendedEquipment={recommendedEquipment}
        />
      </main>
    );
  }

  // Иначе это категория/центр, показываем список
  // slug[0] = категория (если есть)
  // slug[1] = центр (если есть)
  return <Courses  />;
}