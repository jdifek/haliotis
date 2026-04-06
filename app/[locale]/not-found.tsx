import { ButtonWithIcon } from "@/components/buttons/ButtonWithIcon";
import { HeroBanner } from "@/components/HeroBanner";
import { Breadcrumbs } from "@/components/Breadcrumbs";

async function getNotFoundData(locale = "pt") {
  const res = await fetch(
    `https://cp.haliotis.space/api/v1/not-found?lang=${locale}`,
    { next: { revalidate: 3600 } }
  );
  const json = await res.json();
  return json.data;
}

export async function generateMetadata() {
  const data = await getNotFoundData();
  return {
    title: data.title,
    description: data.seo?.meta_description,
    keywords: data.seo?.meta_keywords,
  };
}

export default async function NotFound() {
  const data = await getNotFoundData();

  const slides = (data.banner?.slides ?? []).map((slide: {
    desktop_image_url: string;
    mobile_image_url: string;
    title: string;
    description: string;
  }) => ({
    image: slide.desktop_image_url,
    mobileImage: slide.mobile_image_url,
    title: slide.title,
    description: slide.description,
  }));

  return (
    <HeroBanner
      slides={slides.length > 0 ? slides : [{ image: "/404.png" }]}
      height="h-[75vh]"
      breadcrumbs={[{ label: "Haliotis", href: "/" }, { label: "404" }]}
    >
      <section className="container px-5 py-6">
        <div className="max-w-3xl">
          <div className="mb-12">
            <h1 className="mb-3 text-[32px] font-bold leading-tight text-white lg:text-5xl">
              {data.title}
            </h1>
            {data.description && (
              <p className="max-w-xl mb-6 text-[16px] font-light text-white lg:text-lg">
                {data.description}
              </p>
            )}
            {data.button?.title && (
              <ButtonWithIcon
                bgColor="#FFFFFF"
                width="228px"
                textColor="text-black"
                iconBgColor="#e84814"
                label={data.button.title}
                href={data.button.link}
                icon={
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path
                      d="M18 8.33333H6.75C4.67893 8.33333 3 10.0123 3 12.0833C3 14.1544 4.67893 15.8333 6.75 15.8333H10.5M18 8.33333L14.6667 5M18 8.33333L14.6667 11.6667"
                      stroke="white"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                }
              />
            )}
          </div>
        </div>
      </section>
    </HeroBanner>
  );
}