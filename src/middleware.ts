import { NextRequest, NextResponse } from "next/server";
import { locales, defaultLocale, type Locale } from "@/i18n/config";

/**
 * Detect the preferred locale for the user.
 * Priority:
 *   1. Cookie set by the language switcher (user explicitly chose a language)
 *   2. Vercel geolocation header (Bulgaria → bg)
 *   3. Accept-Language header
 *   4. Default to English
 */
function getLocale(request: NextRequest): Locale {
  // 1. Cookie — only set when user clicks the language switcher
  const cookieLocale = request.cookies.get("NEXT_LOCALE")?.value;
  if (cookieLocale && locales.includes(cookieLocale as Locale)) {
    return cookieLocale as Locale;
  }

  // 2. Geolocation headers (Vercel, Cloudflare, standard proxies)
  const country =
    request.headers.get("x-vercel-ip-country") ||
    request.headers.get("cf-ipcountry") ||
    "";
  if (country === "BG") return "bg";

  // 3. Accept-Language header
  const acceptLang = request.headers.get("accept-language") || "";
  if (/\bbg\b/i.test(acceptLang)) return "bg";

  // 4. Default
  return defaultLocale;
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if the URL already contains a locale prefix
  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  if (pathnameHasLocale) {
    const response = NextResponse.next();
    // Clean up old cookie name from before the rename
    if (request.cookies.get("locale")) {
      response.cookies.delete("locale");
    }
    return response;
  }

  // Redirect to locale-prefixed path
  const locale = getLocale(request);
  const url = request.nextUrl.clone();
  url.pathname = `/${locale}${pathname}`;

  return NextResponse.redirect(url);
}

export const config = {
  // Match all paths except: API routes, Next.js internals, and static files
  matcher: ["/((?!api|_next/static|_next/image|favicon\\.svg|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|txt|xml|json)$).*)"],
};
