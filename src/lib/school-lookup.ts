import { schoolInfo } from "@/lib/demo-data";

export interface PublicSchoolInfo {
  id: string;
  slug: string;
  name: string;
  logo: string | null;
  address: string;
  phone: string;
  email: string;
  website: string;
  established: number;
  type: string;
  currentTerm: string;
  academicYear: string;
}

/**
 * Look up a school by its slug.
 * Currently resolves against demo data. In production, this will call the API.
 */
export function getSchoolBySlug(slug: string): PublicSchoolInfo | null {
  if (slug === schoolInfo.slug) {
    return schoolInfo as PublicSchoolInfo;
  }
  return null;
}
