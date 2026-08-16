import type { Metadata } from "next";

export function createPageMetadata(title: string, description: string, path: string): Metadata {
  const fullTitle = `${title} — PWA UI`;
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      url: path,
      siteName: "PWA UI",
      title: fullTitle,
      description,
    },
    twitter: {
      card: "summary",
      title: fullTitle,
      description,
    },
  };
}
