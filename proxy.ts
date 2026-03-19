import { NextRequest, NextResponse } from 'next/server';

let cachedLocales: string[] | null = null;
let cachedDefault: string | null = null;

async function getLocales() {
  if (cachedLocales && cachedDefault) {
    return { locales: cachedLocales, defaultLocale: cachedDefault };
  }

  try {
    const res = await fetch('https://cp.haliotis.space/api/v1/configs/languages');
    const data = await res.json();
    
    console.log('API response:', JSON.stringify(data)); // ← добавь это
    
    cachedLocales = data.data.map((lang: { prefix: string }) => lang.prefix);
    cachedDefault = data.meta.default;
  } catch (e) {
    console.log('fetch error:', e); // ← и это
    cachedLocales = ['pt'];
    cachedDefault = 'pt';
  }

  return { locales: cachedLocales!, defaultLocale: cachedDefault! };
}

export default async function proxy(request: NextRequest) {
  const { locales, defaultLocale } = await getLocales();
  const pathname = request.nextUrl.pathname;

  console.log('locales:', locales);
  console.log('pathname:', pathname);

  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  if (pathnameHasLocale) return NextResponse.next();

  const url = request.nextUrl.clone();
  url.pathname = `/${defaultLocale}${pathname}`;
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)'],
};