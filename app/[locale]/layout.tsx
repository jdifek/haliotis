import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/header";
import { NextIntlClientProvider } from "next-intl";
import { getSettings } from "@/lib/settings";
import Script from "next/script";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings();
  return {
    title: settings.general.site_name,
    description: settings.general.logo_alt,
  };
}

export async function generateStaticParams() {
  const res = await fetch("https://cp.haliotis.space/api/v1/configs/languages");
  const data = await res.json();
  return data.data.map((lang: { prefix: string }) => ({ locale: lang.prefix }));
}

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;
  const settings = await getSettings();

  const gtmKey = settings.google?.tag_manager_key;
  const gaId = settings.google?.analytics_id;

  return (
    <html lang={locale}>
      <head>
        {gaId && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
              strategy="afterInteractive"
            />
            <Script id="ga-init" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${gaId}');
              `}
            </Script>
          </>
        )}

        {gtmKey && (
          <Script id="gtm-init" strategy="afterInteractive">
            {`
              (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
              new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
              j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
              'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
              })(window,document,'script','dataLayer','${gtmKey}');
            `}
          </Script>
        )}
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {gtmKey && (
          <noscript>
            <iframe
              src={`https://www.googletagmanager.com/ns.html?id=${gtmKey}`}
              height="0"
              width="0"
              style={{ display: "none", visibility: "hidden" }}
            />
          </noscript>
        )}

        <NextIntlClientProvider locale={locale}>
          <Header
            locale={locale}
            logoUrl={settings.general.logo}
            logoAlt={settings.general.logo_alt}
          />
          {children}
          <Footer
            logoUrl={settings.general.footer_logo}
            logoAlt={settings.general.logo_alt}
          />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}