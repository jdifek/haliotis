import { Metadata } from "next";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { CourseDetailClient } from "@/components/CourseDetailClient";

type Props = {
  params: Promise<{ slug: string; locale: string }>;
  searchParams: Promise<Record<string, string>>;
};

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

// Helper: build accordion items server-side as plain HTML strings
// The client component renders them via dangerouslySetInnerHTML
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
      // Pass raw HTML string — CourseDetailHeroSection renders it
      html: f.html,
    }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug, locale } = await params;
  const courseData = await getCourseData(slug, locale);

  if (!courseData) {
    return {
      title: "Course Not Found",
      description: "The requested course could not be found.",
    };
  }

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

export default async function CourseDetail({ params }: Props) {
  const { slug, locale } = await params;
  const courseData = await getCourseData(slug, locale);

  if (!courseData) {
    return (
      <main className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">Course Not Found</h1>
          <p className="text-gray-600">
            The course you are looking for does not exist.
          </p>
        </div>
      </main>
    );
  }

  const { data, recommended, recommendedEquipment } = courseData;

  const accordionItems = buildAccordionItems(data).map((item) => ({
    id: item.id,
    label: item.label,
    // Convert to ReactNode here on the server via JSX
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