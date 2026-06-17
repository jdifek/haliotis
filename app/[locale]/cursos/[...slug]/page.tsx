/* eslint-disable @typescript-eslint/no-explicit-any */
import { Metadata } from "next";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { CourseDetailClient } from "@/components/CourseDetailClient";
import Courses from "../page";

type Props = {
  params: Promise<{ locale: string; slug: string[] }>;
};

type CourseData = {
  data: {
    price: any;
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
    .map((f) => ({ id: f.id, label: f.label, html: f.html }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;

  // /courses/center → slug = ['center']          → показываем список
  // /courses/center/course → slug = ['center', 'course'] → показываем курс
 if (slug.length < 3) {
  return { title: "Courses", description: "Diving courses" };
}

const courseSlug = slug[2]; // было slug[1]
const courseData = await getCourseData(courseSlug, locale);
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
          ? [
              {
                url: courseData.data.image,
                width: 1200,
                height: 630,
                alt: courseData.data.name,
              },
            ]
          : [],
      },
    };
  }

  return { title: "Courses", description: "Diving courses" };
}

export default async function CoursesPage({ params }: Props) {
  const { locale, slug } = await params;

 if (slug.length === 1) {
  return <Courses initialCenterSlug={slug[0]} />;
}

// теперь категория первая
if (slug.length === 2) {
  return (
    <Courses initialCategorySlug={slug[0]} initialCenterSlug={slug[1]} />
  );
}

const categorySlugRaw = slug[0]; // было slug[1]
const centerSlug = slug[1];      // было slug[0]
const courseSlug = slug[2];      // не изменился

// "all" — сентинел "без категории", чтобы курс без категории
// всё равно попадал в детальную (3-сегментную) ветку
const categorySlug = categorySlugRaw === "all" ? undefined : categorySlugRaw;

  const courseData = await getCourseData(courseSlug, locale);

  if (!courseData) {
    return (
      <Courses initialCenterSlug={centerSlug} initialCategorySlug={categorySlug} />
    );
  }
  const { data, recommended, recommendedEquipment } = courseData;
console.log(data, 'data')
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

  console.log(recommended, 
    'recommended'
  );
  const recommendedHeader = recommended.headers;

  
  const recommendedCourseCards = recommended.courses.map((course) => ({
    image: course.image_url || "/Rectangle 8.png",
    title: course.name,
    price: course.price?.amount || 0,
    currency: course.price?.currency || 0,
    duration: course.duration_label || "3hrs",
     requestBased: !course.duration_label,
    badge: course.label?.name || "Course",
    location: course.centers[0].slug,
    slug: course.slug,
    centerSlug: centerSlug,
  }));

  console.log(data.description, 'data.description');
  console.log(data, 'data.description');
  const price = (data.price as any)?.amount ?? null;
const currency = (data.price as any)?.currency ?? "€";     
  return (
    <main className="min-h-screen bg-white relative pt-4 md:pt-6">
      <div className="px-4 md:px-8 lg:px-[188px]">
        <Breadcrumbs
          className="mb-6 md:mb-8"
         items={[
  { label: "Haliotis", href: "/" },
  { label: "Cursos", href: `/${locale}/cursos` },
  { label: centerSlug, href: `/${locale}/cursos/${centerSlug}` },
  ...(categorySlug
    ? [{ label: categorySlug, href: `/${locale}/cursos/${categorySlug}/${centerSlug}` }]
    : []),
  { label: data.name },
]}
        />
      </div>

      <CourseDetailClient
        courseTitle={data.name}
        courseDescription={data.description || ""}
        pricePerPerson={price || 0}
        currency={currency}
        recommendedHeader={recommendedHeader}
        courseImage={data.image || "/Rectangle 8.png"}
        courseImageAlt={data.name}
        accordionItems={accordionItems}
        recommendedCourses={recommendedCourseCards}
        recommendedEquipment={recommendedEquipment}
      />
    </main>
  );
}