import { ButtonWithIcon } from "@/components/buttons/ButtonWithIcon";
import { HeroBanner } from "@/components/HeroBanner";
import { headers } from "next/headers";

async function getNotFoundData(locale = "pt") {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/pages/system/not_found?lang=${locale}`,
    { next: { revalidate: 3600 } }
  );
  const json = await res.json();
  return json.data;
}

export async function generateMetadata() {
  const headersList = await headers();
  const pathname = headersList.get("x-pathname") ?? headersList.get("x-invoke-path") ?? "/pt";
  const locale = pathname.split("/")[1] || "pt";
  
  const data = await getNotFoundData(locale);
  return {
    title: data.title,
    description: data.seo?.meta_description,
    keywords: data.seo?.meta_keywords,
  };
}

export default async function NotFound() {
  const headersList = await headers();
  const pathname = headersList.get("x-pathname") ?? headersList.get("x-invoke-path") ?? "/pt";
  const locale = pathname.split("/")[1] || "pt";

  const data = await getNotFoundData(locale);
console.log(data, 'data');

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
   {data?.system_data?.not_found_button_title && (
            <ButtonWithIcon
            
              bgColor="#FFFFFF"
              width="228px"
              textColor="text-black"
              iconBgColor="#e84814"
              label={data.system_data.not_found_button_title}
              href={data.system_data.not_found_button_link}
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
  </HeroBanner>
  );
}