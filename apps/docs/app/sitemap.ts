import type { MetadataRoute } from "next";

import { componentDocs } from "@/lib/component-docs";
import { hookDocs } from "@/lib/hook-docs";

const origin = "https://pwaui.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    "",
    "/guides/app-layout",
    ...componentDocs.map(({ slug }) => `/components/${slug}`),
    ...hookDocs.map(({ slug }) => `/hooks/${slug}`),
    "/resources/browser-support",
    "/resources/accessibility",
    "/resources/device-qa",
    "/resources/registry",
    "/resources/release-status",
  ];

  return routes.map((route) => ({
    url: `${origin}${route}`,
    changeFrequency: route === "" ? "weekly" : "monthly",
    priority: route === "" ? 1 : route.startsWith("/components/") ? 0.8 : 0.7,
  }));
}
