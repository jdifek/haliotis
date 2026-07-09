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
      `${process.env.NEXT_PUBLIC_API_URL}/courses/${slug}?lang=${locale}`,
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

// ---------------------------------------------------------------------------
// Новое: SSR-резолв centerId по слагу + начальная выборка курсов.
// НЕ трогает useMenu.ts — это отдельный, независимый server-side fetch
// к тому же эндпоинту, нужен только для того, чтобы при заходе по прямой
// ссылке /cursos/[category]/[center] или /cursos/[center] HTML уже
// содержал реальные курсы, и клиенту не пришлось ничего дозагружать
// (устраняет мелькание старых/пустых карточек на прямых заходах).
// ---------------------------------------------------------------------------

type MenuApiResponse = {
  diving_centers: Array<{ id: number; slug: string; [key: string]: any }>;
};

async function getCenterIdBySlug(
  centerSlug: string,
  locale: string
): Promise<number | null> {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/configs/menus?lang=${locale}`,
      {
        headers: { Accept: "application/json" },
        next: { revalidate: 3600 },
      }
    );
    if (!res.ok) return null;
    const menu: MenuApiResponse = await res.json();
    const center = menu.diving_centers?.find((c) => c.slug === centerSlug);
    return center?.id ?? null;
  } catch (error) {
    console.error("Failed to resolve center id:", error);
    return null;
  }
}

type InitialCategory = {
  id: string;
  name: string;
  slug: string;
  description: string;
};

type InitialCoursesData = {
  data: any[];
  meta: { current_page: number; last_page: number; [key: string]: any };
  attachCategory: InitialCategory[] | string[];
  attachAgency?: any[];
  attachPage?: any;
};

async function getInitialCoursesData(
  centerId: number,
  categorySlug: string | undefined,
  locale: string
): Promise<{
  initialData: InitialCoursesData | null;
  initialCategoryId: string | null;
}> {
  const baseParams = (categoryId?: string) => {
    const url = new URL(`${process.env.NEXT_PUBLIC_API_URL}/courses`);
    url.searchParams.set("center", String(centerId));
    if (categoryId) url.searchParams.set("category", categoryId);
    url.searchParams.set("page", "1");
    url.searchParams.set("per_page", "12");
    url.searchParams.set("lang", locale);
    url.searchParams.set("attach_category", "true");
    url.searchParams.set("attach_agency", "true");
    url.searchParams.set("attach_page", "true");
    return url;
  };

  try {
    // Первый запрос — без категории, чтобы получить список категорий центра
    const firstRes = await fetch(baseParams().toString(), {
      headers: { Accept: "application/json" },
      next: { revalidate: 60 },
    });
    if (!firstRes.ok) return { initialData: null, initialCategoryId: null };
    const firstResp: InitialCoursesData = await firstRes.json();

    if (!categorySlug) {
      return { initialData: firstResp, initialCategoryId: null };
    }

    const cats = Array.isArray(firstResp.attachCategory)
      ? (firstResp.attachCategory as any[])
      : [];
    const matched = cats.find(
      (c) => typeof c === "object" && c !== null && c.slug === categorySlug
    );

    if (!matched) {
      // slug категории не найден — отдаём нефильтрованные данные,
      // клиент разберётся сам (как и раньше вело себя приложение)
      return { initialData: firstResp, initialCategoryId: null };
    }

    // Второй запрос — уже отфильтрованный по найденной категории
    const filteredRes = await fetch(baseParams(matched.id).toString(), {
      headers: { Accept: "application/json" },
      next: { revalidate: 60 },
    });
    if (!filteredRes.ok) {
      return { initialData: firstResp, initialCategoryId: null };
    }
    const filteredResp: InitialCoursesData = await filteredRes.json();
    return { initialData: filteredResp, initialCategoryId: matched.id };
  } catch (error) {
    console.error("Failed to fetch initial courses data:", error);
    return { initialData: null, initialCategoryId: null };
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
  // Прямой заход на /cursos/[center] — резолвим centerId и сразу тянем
  // курсы на сервере, чтобы в HTML уже были реальные данные и картинки
  const centerId = await getCenterIdBySlug(slug[0], locale);
  const { initialData } = centerId
    ? await getInitialCoursesData(centerId, undefined, locale)
    : { initialData: null };

  return (
    <Courses
      initialCenterSlug={slug[0]}
      initialCenterId={centerId ?? undefined}
      initialCoursesData={initialData ?? undefined}
    />
  );
}

// теперь категория первая
if (slug.length === 2) {
  // Прямой заход на /cursos/[category]/[center] — резолвим centerId,
  // резолвим categoryId по слагу и сразу тянем отфильтрованные курсы
  // на сервере (тот самый кейс из отчёта: divemaster/peniche → cavernas/peniche)
  const centerId = await getCenterIdBySlug(slug[1], locale);
  const { initialData, initialCategoryId } = centerId
    ? await getInitialCoursesData(centerId, slug[0], locale)
    : { initialData: null, initialCategoryId: null };

  return (
    <Courses
      initialCategorySlug={slug[0]}
            key={`${slug[0]}-${slug[1]}`} // ← форсируем remount при смене категории/центра

      initialCenterSlug={slug[1]}
      initialCenterId={centerId ?? undefined}
      initialCategoryId={initialCategoryId ?? undefined}
      initialCoursesData={initialData ?? undefined}
    />
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
console.log(recommendedEquipment, 'recommendedEquipment')
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
    duration: course.duration_label,
     requestBased: !course.duration_label,
    badge: course.labels?.length > 0 ? course.labels : [],
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
      <div className="px-[21px] md:px-30 lg:px-[30px]">
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
       courseId={data.id}          // ← добавить
  centerSlug={centerSlug}     // ← добавить (уже есть в scope)
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