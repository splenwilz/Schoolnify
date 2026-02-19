"use client";

import { useParams, notFound } from "next/navigation";
import { getSchoolBySlug } from "@/lib/school-lookup";
import { SchoolNavbar } from "@/components/public/school-navbar";
import { SchoolFooter } from "@/components/public/school-footer";

export default function SchoolLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const params = useParams();
  const slug = params.slug as string;
  const school = getSchoolBySlug(slug);

  if (!school) {
    notFound();
  }

  return (
    <>
      <SchoolNavbar schoolName={school.name} slug={school.slug} />
      <main>{children}</main>
      <SchoolFooter school={school} />
    </>
  );
}
