import { getAllFields, type StudentField } from "../_constants/student-fields";

/**
 * Generate a downloadable CSV template with column headers based on
 * the school's country. Includes one sample row.
 */
export function generateTemplate(countryCode: string, gradeLevels: string[], dateFormat: string): string {
  const fields = getAllFields(countryCode);
  const headers = fields.map((f) => f.label);

  // Sample row with realistic example data
  const sampleValues = fields.map((f) => getSampleValue(f, gradeLevels, dateFormat));

  const lines = [
    headers.join(","),
    sampleValues.map(escapeCSV).join(","),
  ];

  return lines.join("\n");
}

/**
 * Trigger a CSV file download in the browser.
 */
export function downloadCSV(content: string, filename: string) {
  const blob = new Blob(["\uFEFF" + content], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

function escapeCSV(value: string): string {
  if (value.includes(",") || value.includes('"') || value.includes("\n")) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

function getSampleValue(field: StudentField, gradeLevels: string[], dateFormat: string): string {
  const samples: Record<string, string> = {
    first_name: "John",
    last_name: "Doe",
    middle_name: "Adekunle",
    date_of_birth: dateFormat === "MM/DD/YYYY" ? "03/15/2015" : "15/03/2015",
    gender: "Male",
    grade_level: gradeLevels[0] || "Primary 1",
    section: "A",
    admission_number: "2025/001",
    enrollment_date: dateFormat === "MM/DD/YYYY" ? "09/01/2025" : "01/09/2025",
    boarding_status: "Day",
    phone: "+2348012345678",
    email: "parent@example.com",
    address: "12 School Road",
    city: "Lagos",
    state: "Lagos",
    postal_code: "100001",
    guardian1_first_name: "James",
    guardian1_last_name: "Doe",
    guardian1_phone: "+2348012345679",
    guardian1_email: "james.doe@example.com",
    guardian1_relationship: "Father",
    guardian2_first_name: "Mary",
    guardian2_last_name: "Doe",
    guardian2_phone: "+2348012345680",
    guardian2_email: "mary.doe@example.com",
    guardian2_relationship: "Mother",
    blood_group: "O+",
    genotype: "AA",
    allergies: "",
    medical_conditions: "",
    previous_school: "Former Academy",
    state_of_origin: "Lagos",
    lga: "Ikeja",
    religion: "Christianity",
    tribe: "Yoruba",
  };
  return samples[field.key] ?? "";
}
