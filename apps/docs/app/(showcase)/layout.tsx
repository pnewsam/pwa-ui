import type { Metadata } from "next";

import { ShowcaseContainment } from "@/components/showcase-containment";

export const metadata: Metadata = {
  title: "Native-feel demo",
  description: "Try PWA UI as an installable, phone-first mini application.",
  alternates: { canonical: "/demo" },
};

export default function ShowcaseLayout({ children }: { children: React.ReactNode }) {
  return <ShowcaseContainment>{children}</ShowcaseContainment>;
}
