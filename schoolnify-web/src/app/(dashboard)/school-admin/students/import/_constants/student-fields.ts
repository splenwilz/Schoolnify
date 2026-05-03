/**
 * Student import field definitions, region-specific fields, fuzzy matching,
 * and demo data for development.
 */

// ---------------------------------------------------------------------------
// Field definition
// ---------------------------------------------------------------------------

export interface StudentField {
  key: string;
  label: string;
  required: boolean;
  type: "text" | "date" | "enum" | "number";
  /** Accepted enum values (lowercase). Empty = free text. */
  enumValues?: string[];
  /** Common column name aliases for fuzzy matching */
  aliases: string[];
}

// ---------------------------------------------------------------------------
// Core fields (every school, every country)
// ---------------------------------------------------------------------------

export const CORE_FIELDS: StudentField[] = [
  { key: "first_name", label: "First Name", required: true, type: "text", aliases: ["firstname", "first name", "given name", "given_name", "forename"] },
  { key: "last_name", label: "Last Name", required: true, type: "text", aliases: ["lastname", "last name", "surname", "family name", "family_name"] },
  { key: "middle_name", label: "Middle Name", required: false, type: "text", aliases: ["middlename", "middle name", "other names", "other_names"] },
  { key: "date_of_birth", label: "Date of Birth", required: true, type: "date", aliases: ["dob", "dateofbirth", "date of birth", "birth date", "birth_date", "birthday"] },
  { key: "gender", label: "Gender", required: true, type: "enum", enumValues: ["male", "female", "other", "m", "f", "o"], aliases: ["sex"] },
  { key: "grade_level", label: "Grade Level", required: true, type: "text", aliases: ["grade", "class", "year", "year group", "year_group", "level", "form", "standard"] },
  { key: "section", label: "Section / Stream", required: false, type: "text", aliases: ["stream", "division", "arm", "class section"] },
  { key: "admission_number", label: "Admission Number", required: false, type: "text", aliases: ["admission no", "admno", "adm no", "student id", "student_id", "student number", "reg no", "registration number"] },
  { key: "enrollment_date", label: "Enrollment Date", required: false, type: "date", aliases: ["date of admission", "admission date", "enrolment date", "entry date", "join date"] },
  { key: "boarding_status", label: "Boarding Status", required: false, type: "enum", enumValues: ["day", "boarding", "weekly boarding"], aliases: ["boarding", "day/boarding", "student type"] },
];

// ---------------------------------------------------------------------------
// Contact fields
// ---------------------------------------------------------------------------

export const CONTACT_FIELDS: StudentField[] = [
  { key: "phone", label: "Phone Number", required: false, type: "text", aliases: ["phone number", "mobile", "mobile number", "cell", "tel", "telephone"] },
  { key: "email", label: "Email", required: false, type: "text", aliases: ["email address", "student email", "e-mail"] },
  { key: "address", label: "Address", required: false, type: "text", aliases: ["home address", "street address", "address line 1", "address_line_1"] },
  { key: "city", label: "City / Town", required: false, type: "text", aliases: ["town", "city/town"] },
  { key: "state", label: "State / Province", required: false, type: "text", aliases: ["province", "region", "county"] },
  { key: "postal_code", label: "Postal Code", required: false, type: "text", aliases: ["zip", "zip code", "postcode", "post code"] },
];

// ---------------------------------------------------------------------------
// Guardian fields (2 guardians, flat columns)
// ---------------------------------------------------------------------------

export const GUARDIAN_FIELDS: StudentField[] = [
  { key: "guardian1_first_name", label: "Guardian 1 First Name", required: false, type: "text", aliases: ["parent name", "father name", "mother name", "guardian name", "parent first name", "guardian1 name", "parent1 name"] },
  { key: "guardian1_last_name", label: "Guardian 1 Last Name", required: false, type: "text", aliases: ["parent surname", "parent last name", "guardian1 surname", "parent1 surname"] },
  { key: "guardian1_phone", label: "Guardian 1 Phone", required: false, type: "text", aliases: ["parent phone", "father phone", "mother phone", "guardian phone", "parent1 phone", "guardian1 mobile"] },
  { key: "guardian1_email", label: "Guardian 1 Email", required: false, type: "text", aliases: ["parent email", "father email", "mother email", "guardian email", "parent1 email"] },
  { key: "guardian1_relationship", label: "Guardian 1 Relationship", required: false, type: "enum", enumValues: ["father", "mother", "guardian", "step-father", "step-mother", "grandfather", "grandmother", "uncle", "aunt", "other"], aliases: ["relationship", "parent relationship", "guardian1 relationship"] },
  { key: "guardian2_first_name", label: "Guardian 2 First Name", required: false, type: "text", aliases: ["parent2 name", "guardian2 name", "second parent name"] },
  { key: "guardian2_last_name", label: "Guardian 2 Last Name", required: false, type: "text", aliases: ["parent2 surname", "guardian2 surname"] },
  { key: "guardian2_phone", label: "Guardian 2 Phone", required: false, type: "text", aliases: ["parent2 phone", "guardian2 mobile"] },
  { key: "guardian2_email", label: "Guardian 2 Email", required: false, type: "text", aliases: ["parent2 email", "guardian2 email"] },
  { key: "guardian2_relationship", label: "Guardian 2 Relationship", required: false, type: "enum", enumValues: ["father", "mother", "guardian", "step-father", "step-mother", "grandfather", "grandmother", "uncle", "aunt", "other"], aliases: ["parent2 relationship"] },
];

// ---------------------------------------------------------------------------
// Medical fields
// ---------------------------------------------------------------------------

export const MEDICAL_FIELDS: StudentField[] = [
  { key: "blood_group", label: "Blood Group", required: false, type: "enum", enumValues: ["a+", "a-", "b+", "b-", "ab+", "ab-", "o+", "o-"], aliases: ["blood type", "bloodgroup"] },
  { key: "allergies", label: "Allergies", required: false, type: "text", aliases: ["allergy", "known allergies"] },
  { key: "medical_conditions", label: "Medical Conditions", required: false, type: "text", aliases: ["health conditions", "medical history", "chronic conditions", "health issues"] },
  { key: "previous_school", label: "Previous School", required: false, type: "text", aliases: ["former school", "last school", "school transferred from", "transfer from"] },
];

// ---------------------------------------------------------------------------
// Region-specific fields
// ---------------------------------------------------------------------------

export const REGION_FIELDS: Record<string, StudentField[]> = {
  NG: [
    { key: "state_of_origin", label: "State of Origin", required: false, type: "text", aliases: ["state origin", "origin state", "home state"] },
    { key: "lga", label: "Local Government Area", required: false, type: "text", aliases: ["local govt", "local government", "lga of origin"] },
    { key: "religion", label: "Religion", required: false, type: "text", aliases: ["faith", "religious affiliation"] },
    { key: "tribe", label: "Tribe / Ethnicity", required: false, type: "text", aliases: ["ethnicity", "ethnic group", "tribe/ethnicity"] },
    { key: "genotype", label: "Genotype", required: false, type: "enum", enumValues: ["aa", "as", "ss", "ac", "sc"], aliases: ["sickle cell", "genotype status"] },
  ],
  GB: [
    { key: "upn", label: "UPN (Unique Pupil Number)", required: false, type: "text", aliases: ["unique pupil number"] },
    { key: "fsm_eligible", label: "FSM Eligible", required: false, type: "enum", enumValues: ["yes", "no", "y", "n"], aliases: ["free school meals", "fsm"] },
    { key: "sen_status", label: "SEN Status", required: false, type: "enum", enumValues: ["no sen", "sen support", "ehc plan"], aliases: ["special needs", "send status", "sen"] },
    { key: "ethnicity_code", label: "Ethnicity Code", required: false, type: "text", aliases: ["ethnicity", "dfe ethnicity"] },
    { key: "first_language", label: "First Language", required: false, type: "text", aliases: ["home language", "mother tongue", "language"] },
  ],
  US: [
    { key: "state_student_id", label: "State Student ID", required: false, type: "text", aliases: ["ssid", "state id"] },
    { key: "race_ethnicity", label: "Race / Ethnicity", required: false, type: "text", aliases: ["race", "ethnicity"] },
    { key: "iep_status", label: "IEP Status", required: false, type: "enum", enumValues: ["yes", "no", "y", "n"], aliases: ["iep", "special ed"] },
    { key: "ell_status", label: "ELL Status", required: false, type: "enum", enumValues: ["yes", "no", "y", "n"], aliases: ["ell", "esl", "english learner", "lep"] },
  ],
  IN: [
    { key: "aadhaar_number", label: "Aadhaar Number", required: false, type: "text", aliases: ["aadhaar", "aadhar", "uid"] },
    { key: "caste_category", label: "Caste Category", required: false, type: "enum", enumValues: ["general", "obc", "sc", "st"], aliases: ["caste", "social category", "category"] },
    { key: "mother_tongue", label: "Mother Tongue", required: false, type: "text", aliases: ["native language"] },
  ],
  KE: [
    { key: "birth_certificate_number", label: "Birth Certificate Number", required: false, type: "text", aliases: ["birth cert no", "birth cert number"] },
    { key: "home_county", label: "Home County", required: false, type: "text", aliases: ["county", "home county"] },
  ],
  ZA: [
    { key: "sa_id_number", label: "SA ID Number", required: false, type: "text", aliases: ["id number", "national id"] },
    { key: "home_language", label: "Home Language", required: false, type: "text", aliases: ["language", "first language"] },
  ],
  AE: [
    { key: "emirates_id", label: "Emirates ID", required: false, type: "text", aliases: ["eid", "eid number"] },
    { key: "visa_status", label: "Visa Status", required: false, type: "text", aliases: ["visa", "residency status"] },
    { key: "passport_number", label: "Passport Number", required: false, type: "text", aliases: ["passport no", "passport"] },
  ],
};

// ---------------------------------------------------------------------------
// Normalizers
// ---------------------------------------------------------------------------

export const GENDER_MAP: Record<string, string> = {
  m: "Male", male: "Male", boy: "Male",
  f: "Female", female: "Female", girl: "Female",
  o: "Other", other: "Other", "non-binary": "Other",
};

export const RELATIONSHIP_MAP: Record<string, string> = {
  father: "Father", dad: "Father", papa: "Father",
  mother: "Mother", mom: "Mother", mama: "Mother", mum: "Mother",
  guardian: "Guardian", "legal guardian": "Guardian",
  "step-father": "Step-Father", stepfather: "Step-Father",
  "step-mother": "Step-Mother", stepmother: "Step-Mother",
  grandfather: "Grandfather", grandpa: "Grandfather",
  grandmother: "Grandmother", grandma: "Grandmother",
  uncle: "Uncle", aunt: "Aunt", other: "Other",
};

export const BOARDING_MAP: Record<string, string> = {
  day: "Day", "day student": "Day", "day scholar": "Day",
  boarding: "Boarding", boarder: "Boarding", resident: "Boarding",
  "weekly boarding": "Weekly Boarding", "weekly boarder": "Weekly Boarding",
};

// ---------------------------------------------------------------------------
// Helper: get all fields for a country
// ---------------------------------------------------------------------------

export function getAllFields(countryCode: string): StudentField[] {
  const regionFields = REGION_FIELDS[countryCode.toUpperCase()] ?? [];
  return [...CORE_FIELDS, ...CONTACT_FIELDS, ...GUARDIAN_FIELDS, ...MEDICAL_FIELDS, ...regionFields];
}

// ---------------------------------------------------------------------------
// Helper: fuzzy match a column header to a system field
// ---------------------------------------------------------------------------

export function fuzzyMatchField(header: string, fields: StudentField[]): StudentField | null {
  const normalized = header.toLowerCase().replace(/[_\-]/g, " ").trim();
  // Exact key match
  const keyMatch = fields.find((f) => f.key === normalized.replace(/ /g, "_"));
  if (keyMatch) return keyMatch;
  // Exact label match
  const labelMatch = fields.find((f) => f.label.toLowerCase() === normalized);
  if (labelMatch) return labelMatch;
  // Alias match
  const aliasMatch = fields.find((f) => f.aliases.some((a) => a === normalized));
  if (aliasMatch) return aliasMatch;
  // Partial match (column contains alias or alias contains column)
  const partialMatch = fields.find((f) =>
    f.aliases.some((a) => normalized.includes(a) || a.includes(normalized))
  );
  if (partialMatch) return partialMatch;
  return null;
}

// ---------------------------------------------------------------------------
// Demo data: 50 Nigerian students
// ---------------------------------------------------------------------------

export const DEMO_STUDENTS = [
  { first_name: "Chidera", last_name: "Okonkwo", middle_name: "Nnamdi", date_of_birth: "2018-03-15", gender: "Male", grade_level: "Nursery 1", admission_number: "2025/001", state_of_origin: "Anambra", lga: "Onitsha North", religion: "Christianity", tribe: "Igbo", genotype: "AA", blood_group: "O+", guardian1_first_name: "Emeka", guardian1_last_name: "Okonkwo", guardian1_phone: "+2348012345001", guardian1_email: "emeka.okonkwo@email.com", guardian1_relationship: "Father", guardian2_first_name: "Ngozi", guardian2_last_name: "Okonkwo", guardian2_phone: "+2348012345002", guardian2_relationship: "Mother", boarding_status: "Day" },
  { first_name: "Aisha", last_name: "Bello", middle_name: "Fatima", date_of_birth: "2018-07-22", gender: "Female", grade_level: "Nursery 1", admission_number: "2025/002", state_of_origin: "Kano", lga: "Kano Municipal", religion: "Islam", tribe: "Hausa", genotype: "AS", blood_group: "A+", guardian1_first_name: "Musa", guardian1_last_name: "Bello", guardian1_phone: "+2348012345003", guardian1_relationship: "Father", guardian2_first_name: "Halima", guardian2_last_name: "Bello", guardian2_phone: "+2348012345004", guardian2_relationship: "Mother", boarding_status: "Day" },
  { first_name: "Oluwaseun", last_name: "Adeyemi", middle_name: "Damilola", date_of_birth: "2017-11-08", gender: "Male", grade_level: "Nursery 2", admission_number: "2025/003", state_of_origin: "Lagos", lga: "Ikeja", religion: "Christianity", tribe: "Yoruba", genotype: "AA", blood_group: "B+", guardian1_first_name: "Kayode", guardian1_last_name: "Adeyemi", guardian1_phone: "+2348012345005", guardian1_email: "k.adeyemi@email.com", guardian1_relationship: "Father", boarding_status: "Day" },
  { first_name: "Zainab", last_name: "Ibrahim", date_of_birth: "2017-05-30", gender: "Female", grade_level: "Nursery 3", admission_number: "2025/004", state_of_origin: "Kaduna", lga: "Kaduna South", religion: "Islam", tribe: "Hausa", genotype: "AA", blood_group: "O-", guardian1_first_name: "Abdullahi", guardian1_last_name: "Ibrahim", guardian1_phone: "+2348012345006", guardian1_relationship: "Father", guardian2_first_name: "Amina", guardian2_last_name: "Ibrahim", guardian2_phone: "+2348012345007", guardian2_email: "amina.ibrahim@email.com", guardian2_relationship: "Mother", boarding_status: "Day" },
  { first_name: "Chiamaka", last_name: "Eze", middle_name: "Chisom", date_of_birth: "2016-01-12", gender: "Female", grade_level: "Primary 1", admission_number: "2025/005", state_of_origin: "Enugu", lga: "Enugu North", religion: "Christianity", tribe: "Igbo", genotype: "AA", blood_group: "AB+", guardian1_first_name: "Chukwudi", guardian1_last_name: "Eze", guardian1_phone: "+2348012345008", guardian1_relationship: "Father", guardian2_first_name: "Adaeze", guardian2_last_name: "Eze", guardian2_phone: "+2348012345009", guardian2_relationship: "Mother", boarding_status: "Day" },
  { first_name: "Tunde", last_name: "Ogundimu", date_of_birth: "2015-09-04", gender: "Male", grade_level: "Primary 2", admission_number: "2025/006", state_of_origin: "Oyo", lga: "Ibadan North", religion: "Christianity", tribe: "Yoruba", genotype: "AS", blood_group: "A-", guardian1_first_name: "Babatunde", guardian1_last_name: "Ogundimu", guardian1_phone: "+2348012345010", guardian1_email: "b.ogundimu@email.com", guardian1_relationship: "Father", boarding_status: "Day" },
  { first_name: "Hauwa", last_name: "Suleiman", middle_name: "Bilkisu", date_of_birth: "2015-04-18", gender: "Female", grade_level: "Primary 3", admission_number: "2025/007", state_of_origin: "Borno", lga: "Maiduguri", religion: "Islam", tribe: "Kanuri", genotype: "AA", blood_group: "B-", guardian1_first_name: "Yusuf", guardian1_last_name: "Suleiman", guardian1_phone: "+2348012345011", guardian1_relationship: "Father", guardian2_first_name: "Maryam", guardian2_last_name: "Suleiman", guardian2_phone: "+2348012345012", guardian2_relationship: "Mother", boarding_status: "Day" },
  { first_name: "Obinna", last_name: "Nwankwo", date_of_birth: "2014-12-25", gender: "Male", grade_level: "Primary 4", admission_number: "2025/008", state_of_origin: "Imo", lga: "Owerri West", religion: "Christianity", tribe: "Igbo", genotype: "AA", blood_group: "O+", guardian1_first_name: "Obiora", guardian1_last_name: "Nwankwo", guardian1_phone: "+2348012345013", guardian1_email: "obiora.n@email.com", guardian1_relationship: "Father", guardian2_first_name: "Nneka", guardian2_last_name: "Nwankwo", guardian2_phone: "+2348012345014", guardian2_relationship: "Mother", boarding_status: "Day" },
  { first_name: "Folake", last_name: "Afolabi", middle_name: "Oluwabunmi", date_of_birth: "2014-06-10", gender: "Female", grade_level: "Primary 5", admission_number: "2025/009", state_of_origin: "Osun", lga: "Ife Central", religion: "Christianity", tribe: "Yoruba", genotype: "AA", blood_group: "A+", guardian1_first_name: "Adeniyi", guardian1_last_name: "Afolabi", guardian1_phone: "+2348012345015", guardian1_relationship: "Father", guardian2_first_name: "Ronke", guardian2_last_name: "Afolabi", guardian2_phone: "+2348012345016", guardian2_relationship: "Mother", boarding_status: "Day" },
  { first_name: "Usman", last_name: "Aliyu", date_of_birth: "2013-08-20", gender: "Male", grade_level: "Primary 6", admission_number: "2025/010", state_of_origin: "Sokoto", lga: "Sokoto South", religion: "Islam", tribe: "Fulani", genotype: "AA", blood_group: "B+", guardian1_first_name: "Garba", guardian1_last_name: "Aliyu", guardian1_phone: "+2348012345017", guardian1_relationship: "Father", boarding_status: "Day" },
  { first_name: "Adaeze", last_name: "Okwu", middle_name: "Chidinma", date_of_birth: "2012-02-14", gender: "Female", grade_level: "JSS 1", admission_number: "2025/011", state_of_origin: "Abia", lga: "Umuahia North", religion: "Christianity", tribe: "Igbo", genotype: "AS", blood_group: "O+", guardian1_first_name: "Ikechukwu", guardian1_last_name: "Okwu", guardian1_phone: "+2348012345018", guardian1_email: "ike.okwu@email.com", guardian1_relationship: "Father", guardian2_first_name: "Ugochi", guardian2_last_name: "Okwu", guardian2_phone: "+2348012345019", guardian2_relationship: "Mother", boarding_status: "Boarding", allergies: "Peanuts" },
  { first_name: "Bashir", last_name: "Mohammed", date_of_birth: "2012-10-03", gender: "Male", grade_level: "JSS 1", admission_number: "2025/012", state_of_origin: "Bauchi", lga: "Bauchi", religion: "Islam", tribe: "Hausa", genotype: "AA", blood_group: "A+", guardian1_first_name: "Ahmed", guardian1_last_name: "Mohammed", guardian1_phone: "+2348012345020", guardian1_relationship: "Father", boarding_status: "Boarding" },
  { first_name: "Temitope", last_name: "Ojo", middle_name: "Ayomide", date_of_birth: "2011-05-28", gender: "Female", grade_level: "JSS 2", admission_number: "2025/013", state_of_origin: "Ogun", lga: "Abeokuta South", religion: "Christianity", tribe: "Yoruba", genotype: "AA", blood_group: "AB-", guardian1_first_name: "Olalekan", guardian1_last_name: "Ojo", guardian1_phone: "+2348012345021", guardian1_email: "olalekan.ojo@email.com", guardian1_relationship: "Father", guardian2_first_name: "Bukola", guardian2_last_name: "Ojo", guardian2_phone: "+2348012345022", guardian2_relationship: "Mother", boarding_status: "Boarding" },
  { first_name: "Chinedu", last_name: "Amadi", date_of_birth: "2011-01-15", gender: "Male", grade_level: "JSS 3", admission_number: "2025/014", state_of_origin: "Rivers", lga: "Port Harcourt", religion: "Christianity", tribe: "Igbo", genotype: "AA", blood_group: "O+", guardian1_first_name: "Patrick", guardian1_last_name: "Amadi", guardian1_phone: "+2348012345023", guardian1_relationship: "Father", boarding_status: "Boarding" },
  { first_name: "Fatimah", last_name: "Abdulrahman", middle_name: "Khadijah", date_of_birth: "2010-09-12", gender: "Female", grade_level: "SSS 1", admission_number: "2025/015", state_of_origin: "Kwara", lga: "Ilorin West", religion: "Islam", tribe: "Yoruba", genotype: "AA", blood_group: "B+", guardian1_first_name: "Saliu", guardian1_last_name: "Abdulrahman", guardian1_phone: "+2348012345024", guardian1_email: "saliu.a@email.com", guardian1_relationship: "Father", guardian2_first_name: "Muinat", guardian2_last_name: "Abdulrahman", guardian2_phone: "+2348012345025", guardian2_relationship: "Mother", boarding_status: "Boarding" },
  { first_name: "Ifeanyi", last_name: "Obi", date_of_birth: "2010-04-07", gender: "Male", grade_level: "SSS 1", admission_number: "2025/016", state_of_origin: "Delta", lga: "Oshimili South", religion: "Christianity", tribe: "Igbo", genotype: "AS", blood_group: "A-", guardian1_first_name: "Okafor", guardian1_last_name: "Obi", guardian1_phone: "+2348012345026", guardian1_relationship: "Father", boarding_status: "Boarding", medical_conditions: "Asthma" },
  { first_name: "Yetunde", last_name: "Bakare", middle_name: "Abosede", date_of_birth: "2009-11-30", gender: "Female", grade_level: "SSS 2", admission_number: "2025/017", state_of_origin: "Ekiti", lga: "Ado Ekiti", religion: "Christianity", tribe: "Yoruba", genotype: "AA", blood_group: "O+", guardian1_first_name: "Adesina", guardian1_last_name: "Bakare", guardian1_phone: "+2348012345027", guardian1_relationship: "Father", guardian2_first_name: "Abimbola", guardian2_last_name: "Bakare", guardian2_phone: "+2348012345028", guardian2_email: "abimbola.b@email.com", guardian2_relationship: "Mother", boarding_status: "Boarding" },
  { first_name: "Musa", last_name: "Danjuma", date_of_birth: "2009-07-19", gender: "Male", grade_level: "SSS 2", admission_number: "2025/018", state_of_origin: "Taraba", lga: "Jalingo", religion: "Islam", tribe: "Hausa", genotype: "AA", blood_group: "B-", guardian1_first_name: "Danjuma", guardian1_last_name: "Danjuma", guardian1_phone: "+2348012345029", guardian1_relationship: "Father", boarding_status: "Boarding" },
  { first_name: "Nkechi", last_name: "Uche", middle_name: "Amara", date_of_birth: "2008-03-22", gender: "Female", grade_level: "SSS 3", admission_number: "2025/019", state_of_origin: "Ebonyi", lga: "Abakaliki", religion: "Christianity", tribe: "Igbo", genotype: "AA", blood_group: "AB+", guardian1_first_name: "Emmanuel", guardian1_last_name: "Uche", guardian1_phone: "+2348012345030", guardian1_email: "emmanuel.uche@email.com", guardian1_relationship: "Father", guardian2_first_name: "Joy", guardian2_last_name: "Uche", guardian2_phone: "+2348012345031", guardian2_relationship: "Mother", boarding_status: "Boarding" },
  { first_name: "Abdullahi", last_name: "Yusuf", date_of_birth: "2008-12-01", gender: "Male", grade_level: "SSS 3", admission_number: "2025/020", state_of_origin: "Zamfara", lga: "Gusau", religion: "Islam", tribe: "Hausa", genotype: "AA", blood_group: "O+", guardian1_first_name: "Ismail", guardian1_last_name: "Yusuf", guardian1_phone: "+2348012345032", guardian1_relationship: "Father", boarding_status: "Boarding" },
];
