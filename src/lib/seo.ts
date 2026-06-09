import type { Metadata } from "next";

import { NEXT_PUBLIC_SITE_URL } from "@/config/global-variables";

export const SITE_URL = NEXT_PUBLIC_SITE_URL;

export const SITE_NAME = "World Cup 2026";

const DEFAULT_OG_IMAGE = "/opengraph-image";

type OgImage =
  | string
  | { url: string; width?: number; height?: number; alt?: string };

type PageMetaInput = {
  title: string;
  description: string;
  /** Path including leading slash, e.g. `/best-11` */
  path?: string;
  keywords?: string[];
  ogImage?: OgImage;
  /** Set for the home page to avoid double suffix in the document title */
  absoluteTitle?: boolean;
  noIndex?: boolean;
};

function resolveOgImages(title: string, ogImage?: OgImage) {
  const image = ogImage ?? DEFAULT_OG_IMAGE;
  if (typeof image === "string") {
    return [{ url: image, width: 1200, height: 630, alt: `${title} · ${SITE_NAME}` }];
  }
  return [
    {
      url: image.url,
      width: image.width ?? 1200,
      height: image.height ?? 630,
      alt: image.alt ?? `${title} · ${SITE_NAME}`,
    },
  ];
}

export function createPageMetadata({
  title,
  description,
  path = "",
  keywords,
  ogImage,
  absoluteTitle = false,
  noIndex = false,
}: PageMetaInput): Metadata {
  const normalizedPath = path === "/" ? "" : path;
  const canonical = normalizedPath ? `${SITE_URL}${normalizedPath}` : SITE_URL;
  const ogTitle = absoluteTitle ? title : `${title} · ${SITE_NAME}`;
  const images = resolveOgImages(title, ogImage);

  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    keywords,
    alternates: { canonical },
    openGraph: {
      title: ogTitle,
      description,
      url: canonical,
      siteName: SITE_NAME,
      type: "website",
      locale: "en_US",
      images,
    },
    twitter: {
      card: "summary_large_image",
      title: ogTitle,
      description,
      images: images.map((img) => img.url),
    },
    ...(noIndex ? { robots: { index: false, follow: false } } : undefined),
  };
}

/** Shared keywords reused across tournament pages */
export const WC26_KEYWORDS = [
  "FIFA World Cup 2026",
  "World Cup 2026",
  "USA Mexico Canada World Cup",
  "football",
  "soccer",
] as const;
