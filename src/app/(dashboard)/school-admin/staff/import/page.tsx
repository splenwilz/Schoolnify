import type { Metadata } from "next";
import { connection } from "next/server";
import { schoolInfo, staff } from "@/lib/demo-data";
import { toISODate } from "@/lib/staff/dates";
import { ImportPageView } from "./_components/import-page-view";

export const metadata: Metadata = { title: "Import staff" };

export default async function StaffImportPage() {
  // "Today" drives the age and contract rules; request-time, not build-time.
  await connection();
  return <ImportPageView existingStaff={staff} today={toISODate(new Date())} country={schoolInfo.country} />;
}
