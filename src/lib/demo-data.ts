/**
 * Demo Data for Schoolnify Dashboard
 * This file contains mock data for development and demonstration purposes.
 * In production, this data would come from the API.
 */

// ============================================
// School Info
// ============================================
export const schoolInfo = {
  id: "sch_001",
  slug: "greenwood-academy",
  name: "Greenwood Academy",
  logo: null, // Would be a URL in production
  address: "123 Education Lane, Springfield, ST 12345",
  phone: "+1 (555) 123-4567",
  email: "admin@greenwoodacademy.edu",
  website: "https://greenwoodacademy.edu",
  established: 2010,
  type: "K-12 Private School",
  currentTerm: "Fall 2025",
  academicYear: "2025-2026",
};

// ============================================
// Dashboard Stats
// ============================================
export const dashboardStats = {
  totalStudents: 1247,
  totalStaff: 89,
  totalClasses: 42,
  attendanceRate: 94.2,
  feesCollected: 847500,
  feesOutstanding: 152500,
  parentEngagement: 78,
  upcomingEvents: 5,
};

// ============================================
// Attendance Overview (Last 7 Days)
// ============================================
export const attendanceData = [
  { day: "Mon", present: 1180, absent: 67 },
  { day: "Tue", present: 1195, absent: 52 },
  { day: "Wed", present: 1172, absent: 75 },
  { day: "Thu", present: 1201, absent: 46 },
  { day: "Fri", present: 1156, absent: 91 },
  { day: "Sat", present: 0, absent: 0 }, // Weekend
  { day: "Sun", present: 0, absent: 0 }, // Weekend
];

// ============================================
// Recent Activity
// ============================================
export const recentActivity = [
  {
    id: "act_001",
    type: "enrollment",
    title: "New Student Enrolled",
    description: "Emma Wilson joined Grade 7A",
    timestamp: "2 hours ago",
    icon: "👤",
  },
  {
    id: "act_002",
    type: "payment",
    title: "Fee Payment Received",
    description: "$2,500 received from Johnson family",
    timestamp: "3 hours ago",
    icon: "💰",
  },
  {
    id: "act_003",
    type: "attendance",
    title: "Attendance Marked",
    description: "Grade 10B attendance completed by Mr. Smith",
    timestamp: "4 hours ago",
    icon: "✅",
  },
  {
    id: "act_004",
    type: "message",
    title: "Parent Message",
    description: "Mrs. Davis requested meeting with Grade 5 teacher",
    timestamp: "5 hours ago",
    icon: "💬",
  },
  {
    id: "act_005",
    type: "grade",
    title: "Grades Published",
    description: "Math midterm results for Grade 8 published",
    timestamp: "Yesterday",
    icon: "📊",
  },
];

// ============================================
// Quick Stats Cards
// ============================================
export const quickStats = [
  {
    title: "Total Students",
    value: "1,247",
    change: "+12",
    changeType: "positive" as const,
    icon: "👨‍🎓",
    description: "vs last month",
  },
  {
    title: "Staff Members",
    value: "89",
    change: "+3",
    changeType: "positive" as const,
    icon: "👩‍🏫",
    description: "vs last month",
  },
  {
    title: "Attendance Rate",
    value: "94.2%",
    change: "+2.1%",
    changeType: "positive" as const,
    icon: "📋",
    description: "vs last week",
  },
  {
    title: "Fees Collected",
    value: "$847.5K",
    change: "84.7%",
    changeType: "neutral" as const,
    icon: "💵",
    description: "of total",
  },
];

// ============================================
// Upcoming Events
// ============================================
export const upcomingEvents = [
  {
    id: "evt_001",
    title: "Parent-Teacher Conference",
    date: "Jan 15, 2026",
    time: "2:00 PM - 6:00 PM",
    type: "meeting",
    color: "#0891B2",
  },
  {
    id: "evt_002",
    title: "Science Fair",
    date: "Jan 20, 2026",
    time: "9:00 AM - 3:00 PM",
    type: "event",
    color: "#10B981",
  },
  {
    id: "evt_003",
    title: "Mid-Term Exams Begin",
    date: "Jan 25, 2026",
    time: "All Day",
    type: "academic",
    color: "#F59E0B",
  },
  {
    id: "evt_004",
    title: "Staff Meeting",
    date: "Jan 28, 2026",
    time: "3:30 PM - 5:00 PM",
    type: "meeting",
    color: "#A855F7",
  },
];

// ============================================
// Students List (Nigerian Demo Data)
// ============================================
import type { Student } from "@/types/student";

export const students: Student[] = [
  { id: "std_001", firstName: "Chidera", lastName: "Okonkwo", middleName: "Nnamdi", dateOfBirth: "2016-03-15", gender: "Male", admissionNumber: "2025/001", gradeLevel: "Primary 1", section: "A", enrollmentDate: "2025-01-10", status: "active", boardingStatus: "Day", attendanceRate: 95.2, gpa: 3.6, feeStatus: "paid", bloodGroup: "O+", genotype: "AA", stateOfOrigin: "Anambra", lga: "Onitsha North", religion: "Christianity", tribe: "Igbo", guardians: [{ firstName: "Emeka", lastName: "Okonkwo", phone: "+2348012345001", email: "emeka.okonkwo@email.com", relationship: "Father", occupation: "Engineer", isPrimary: true }, { firstName: "Ngozi", lastName: "Okonkwo", phone: "+2348012345002", relationship: "Mother", isPrimary: false }] },
  { id: "std_002", firstName: "Aisha", lastName: "Bello", middleName: "Fatima", dateOfBirth: "2016-07-22", gender: "Female", admissionNumber: "2025/002", gradeLevel: "Primary 1", section: "B", enrollmentDate: "2025-01-10", status: "active", boardingStatus: "Day", attendanceRate: 92.8, gpa: 3.4, feeStatus: "paid", bloodGroup: "A+", genotype: "AS", stateOfOrigin: "Kano", lga: "Kano Municipal", religion: "Islam", tribe: "Hausa", guardians: [{ firstName: "Musa", lastName: "Bello", phone: "+2348012345003", relationship: "Father", isPrimary: true }, { firstName: "Halima", lastName: "Bello", phone: "+2348012345004", email: "halima.b@email.com", relationship: "Mother", isPrimary: false }] },
  { id: "std_003", firstName: "Oluwaseun", lastName: "Adeyemi", middleName: "Damilola", dateOfBirth: "2015-11-08", gender: "Male", admissionNumber: "2025/003", gradeLevel: "Primary 2", section: "A", enrollmentDate: "2024-01-10", status: "active", boardingStatus: "Day", attendanceRate: 88.5, gpa: 3.1, feeStatus: "pending", bloodGroup: "B+", genotype: "AA", stateOfOrigin: "Lagos", lga: "Ikeja", religion: "Christianity", tribe: "Yoruba", guardians: [{ firstName: "Kayode", lastName: "Adeyemi", phone: "+2348012345005", email: "k.adeyemi@email.com", relationship: "Father", isPrimary: true }] },
  { id: "std_004", firstName: "Zainab", lastName: "Ibrahim", dateOfBirth: "2015-05-30", gender: "Female", admissionNumber: "2025/004", gradeLevel: "Primary 3", section: "A", enrollmentDate: "2024-01-10", status: "active", boardingStatus: "Day", attendanceRate: 97.1, gpa: 3.9, feeStatus: "paid", bloodGroup: "O-", genotype: "AA", stateOfOrigin: "Kaduna", lga: "Kaduna South", religion: "Islam", tribe: "Hausa", guardians: [{ firstName: "Abdullahi", lastName: "Ibrahim", phone: "+2348012345006", relationship: "Father", isPrimary: true }, { firstName: "Amina", lastName: "Ibrahim", phone: "+2348012345007", email: "amina.ibrahim@email.com", relationship: "Mother", isPrimary: false }] },
  { id: "std_005", firstName: "Chiamaka", lastName: "Eze", middleName: "Chisom", dateOfBirth: "2014-01-12", gender: "Female", admissionNumber: "2025/005", gradeLevel: "Primary 4", section: "B", enrollmentDate: "2023-01-10", status: "active", boardingStatus: "Day", attendanceRate: 94.3, gpa: 3.7, feeStatus: "paid", bloodGroup: "AB+", genotype: "AA", stateOfOrigin: "Enugu", lga: "Enugu North", religion: "Christianity", tribe: "Igbo", guardians: [{ firstName: "Chukwudi", lastName: "Eze", phone: "+2348012345008", relationship: "Father", isPrimary: true }, { firstName: "Adaeze", lastName: "Eze", phone: "+2348012345009", relationship: "Mother", isPrimary: false }] },
  { id: "std_006", firstName: "Tunde", lastName: "Ogundimu", dateOfBirth: "2013-09-04", gender: "Male", admissionNumber: "2025/006", gradeLevel: "Primary 5", section: "A", enrollmentDate: "2022-01-10", status: "active", boardingStatus: "Day", attendanceRate: 86.9, gpa: 2.8, feeStatus: "overdue", bloodGroup: "A-", genotype: "AS", stateOfOrigin: "Oyo", lga: "Ibadan North", religion: "Christianity", tribe: "Yoruba", guardians: [{ firstName: "Babatunde", lastName: "Ogundimu", phone: "+2348012345010", email: "b.ogundimu@email.com", relationship: "Father", isPrimary: true }] },
  { id: "std_007", firstName: "Hauwa", lastName: "Suleiman", middleName: "Bilkisu", dateOfBirth: "2013-04-18", gender: "Female", admissionNumber: "2025/007", gradeLevel: "Primary 5", section: "B", enrollmentDate: "2022-01-10", status: "active", boardingStatus: "Day", attendanceRate: 93.6, gpa: 3.5, feeStatus: "paid", bloodGroup: "B-", genotype: "AA", stateOfOrigin: "Borno", lga: "Maiduguri", religion: "Islam", tribe: "Kanuri", guardians: [{ firstName: "Yusuf", lastName: "Suleiman", phone: "+2348012345011", relationship: "Father", isPrimary: true }, { firstName: "Maryam", lastName: "Suleiman", phone: "+2348012345012", relationship: "Mother", isPrimary: false }] },
  { id: "std_008", firstName: "Obinna", lastName: "Nwankwo", dateOfBirth: "2012-12-25", gender: "Male", admissionNumber: "2025/008", gradeLevel: "Primary 6", section: "A", enrollmentDate: "2021-01-10", status: "active", boardingStatus: "Day", attendanceRate: 91.4, gpa: 3.2, feeStatus: "paid", bloodGroup: "O+", genotype: "AA", stateOfOrigin: "Imo", lga: "Owerri West", religion: "Christianity", tribe: "Igbo", guardians: [{ firstName: "Obiora", lastName: "Nwankwo", phone: "+2348012345013", email: "obiora.n@email.com", relationship: "Father", isPrimary: true }, { firstName: "Nneka", lastName: "Nwankwo", phone: "+2348012345014", relationship: "Mother", isPrimary: false }] },
  { id: "std_009", firstName: "Folake", lastName: "Afolabi", middleName: "Oluwabunmi", dateOfBirth: "2012-06-10", gender: "Female", admissionNumber: "2025/009", gradeLevel: "JSS 1", section: "A", enrollmentDate: "2025-01-10", status: "active", boardingStatus: "Boarding", attendanceRate: 96.7, gpa: 3.8, feeStatus: "paid", bloodGroup: "A+", genotype: "AA", stateOfOrigin: "Osun", lga: "Ife Central", religion: "Christianity", tribe: "Yoruba", guardians: [{ firstName: "Adeniyi", lastName: "Afolabi", phone: "+2348012345015", relationship: "Father", isPrimary: true }, { firstName: "Ronke", lastName: "Afolabi", phone: "+2348012345016", email: "ronke.a@email.com", relationship: "Mother", isPrimary: false }] },
  { id: "std_010", firstName: "Usman", lastName: "Aliyu", dateOfBirth: "2012-08-20", gender: "Male", admissionNumber: "2025/010", gradeLevel: "JSS 1", section: "B", enrollmentDate: "2025-01-10", status: "active", boardingStatus: "Boarding", attendanceRate: 89.3, gpa: 2.9, feeStatus: "pending", bloodGroup: "B+", genotype: "AA", stateOfOrigin: "Sokoto", lga: "Sokoto South", religion: "Islam", tribe: "Fulani", guardians: [{ firstName: "Garba", lastName: "Aliyu", phone: "+2348012345017", relationship: "Father", isPrimary: true }] },
  { id: "std_011", firstName: "Adaeze", lastName: "Okwu", middleName: "Chidinma", dateOfBirth: "2011-02-14", gender: "Female", admissionNumber: "2025/011", gradeLevel: "JSS 2", section: "A", enrollmentDate: "2024-01-10", status: "active", boardingStatus: "Boarding", attendanceRate: 94.8, gpa: 3.6, feeStatus: "paid", bloodGroup: "O+", genotype: "AS", stateOfOrigin: "Abia", lga: "Umuahia North", religion: "Christianity", tribe: "Igbo", allergies: "Peanuts", guardians: [{ firstName: "Ikechukwu", lastName: "Okwu", phone: "+2348012345018", email: "ike.okwu@email.com", relationship: "Father", occupation: "Lawyer", isPrimary: true }, { firstName: "Ugochi", lastName: "Okwu", phone: "+2348012345019", relationship: "Mother", isPrimary: false }] },
  { id: "std_012", firstName: "Bashir", lastName: "Mohammed", dateOfBirth: "2011-10-03", gender: "Male", admissionNumber: "2025/012", gradeLevel: "JSS 2", section: "B", enrollmentDate: "2024-01-10", status: "active", boardingStatus: "Boarding", attendanceRate: 87.2, gpa: 2.7, feeStatus: "overdue", bloodGroup: "A+", genotype: "AA", stateOfOrigin: "Bauchi", lga: "Bauchi", religion: "Islam", tribe: "Hausa", guardians: [{ firstName: "Ahmed", lastName: "Mohammed", phone: "+2348012345020", relationship: "Father", isPrimary: true }] },
  { id: "std_013", firstName: "Temitope", lastName: "Ojo", middleName: "Ayomide", dateOfBirth: "2010-05-28", gender: "Female", admissionNumber: "2025/013", gradeLevel: "JSS 3", section: "A", enrollmentDate: "2023-01-10", status: "active", boardingStatus: "Boarding", attendanceRate: 95.1, gpa: 3.7, feeStatus: "paid", bloodGroup: "AB-", genotype: "AA", stateOfOrigin: "Ogun", lga: "Abeokuta South", religion: "Christianity", tribe: "Yoruba", guardians: [{ firstName: "Olalekan", lastName: "Ojo", phone: "+2348012345021", email: "olalekan.ojo@email.com", relationship: "Father", occupation: "Doctor", isPrimary: true }, { firstName: "Bukola", lastName: "Ojo", phone: "+2348012345022", relationship: "Mother", isPrimary: false }] },
  { id: "std_014", firstName: "Chinedu", lastName: "Amadi", dateOfBirth: "2010-01-15", gender: "Male", admissionNumber: "2025/014", gradeLevel: "JSS 3", section: "B", enrollmentDate: "2023-01-10", status: "active", boardingStatus: "Boarding", attendanceRate: 83.6, gpa: 2.5, feeStatus: "pending", bloodGroup: "O+", genotype: "AA", stateOfOrigin: "Rivers", lga: "Port Harcourt", religion: "Christianity", tribe: "Igbo", guardians: [{ firstName: "Patrick", lastName: "Amadi", phone: "+2348012345023", relationship: "Father", isPrimary: true }] },
  { id: "std_015", firstName: "Fatimah", lastName: "Abdulrahman", middleName: "Khadijah", dateOfBirth: "2009-09-12", gender: "Female", admissionNumber: "2025/015", gradeLevel: "SSS 1", section: "Science", enrollmentDate: "2022-01-10", status: "active", boardingStatus: "Boarding", attendanceRate: 97.3, gpa: 3.9, feeStatus: "paid", bloodGroup: "B+", genotype: "AA", stateOfOrigin: "Kwara", lga: "Ilorin West", religion: "Islam", tribe: "Yoruba", guardians: [{ firstName: "Saliu", lastName: "Abdulrahman", phone: "+2348012345024", email: "saliu.a@email.com", relationship: "Father", isPrimary: true }, { firstName: "Muinat", lastName: "Abdulrahman", phone: "+2348012345025", relationship: "Mother", isPrimary: false }] },
  { id: "std_016", firstName: "Ifeanyi", lastName: "Obi", dateOfBirth: "2009-04-07", gender: "Male", admissionNumber: "2025/016", gradeLevel: "SSS 1", section: "Arts", enrollmentDate: "2022-01-10", status: "active", boardingStatus: "Boarding", attendanceRate: 85.4, gpa: 2.6, feeStatus: "overdue", bloodGroup: "A-", genotype: "AS", stateOfOrigin: "Delta", lga: "Oshimili South", religion: "Christianity", tribe: "Igbo", medicalConditions: "Asthma", guardians: [{ firstName: "Okafor", lastName: "Obi", phone: "+2348012345026", relationship: "Father", isPrimary: true }] },
  { id: "std_017", firstName: "Yetunde", lastName: "Bakare", middleName: "Abosede", dateOfBirth: "2008-11-30", gender: "Female", admissionNumber: "2025/017", gradeLevel: "SSS 2", section: "Science", enrollmentDate: "2021-01-10", status: "active", boardingStatus: "Boarding", attendanceRate: 96.0, gpa: 3.8, feeStatus: "paid", bloodGroup: "O+", genotype: "AA", stateOfOrigin: "Ekiti", lga: "Ado Ekiti", religion: "Christianity", tribe: "Yoruba", guardians: [{ firstName: "Adesina", lastName: "Bakare", phone: "+2348012345027", relationship: "Father", isPrimary: true }, { firstName: "Abimbola", lastName: "Bakare", phone: "+2348012345028", email: "abimbola.b@email.com", relationship: "Mother", isPrimary: false }] },
  { id: "std_018", firstName: "Musa", lastName: "Danjuma", dateOfBirth: "2008-07-19", gender: "Male", admissionNumber: "2025/018", gradeLevel: "SSS 2", section: "Commercial", enrollmentDate: "2021-01-10", status: "active", boardingStatus: "Boarding", attendanceRate: 79.8, gpa: 2.3, feeStatus: "pending", bloodGroup: "B-", genotype: "AA", stateOfOrigin: "Taraba", lga: "Jalingo", religion: "Islam", tribe: "Hausa", guardians: [{ firstName: "Danjuma", lastName: "Danjuma", phone: "+2348012345029", relationship: "Father", isPrimary: true }] },
  { id: "std_019", firstName: "Nkechi", lastName: "Uche", middleName: "Amara", dateOfBirth: "2007-03-22", gender: "Female", admissionNumber: "2025/019", gradeLevel: "SSS 3", section: "Science", enrollmentDate: "2020-01-10", status: "active", boardingStatus: "Boarding", attendanceRate: 98.1, gpa: 3.95, feeStatus: "paid", bloodGroup: "AB+", genotype: "AA", stateOfOrigin: "Ebonyi", lga: "Abakaliki", religion: "Christianity", tribe: "Igbo", guardians: [{ firstName: "Emmanuel", lastName: "Uche", phone: "+2348012345030", email: "emmanuel.uche@email.com", relationship: "Father", occupation: "Professor", isPrimary: true }, { firstName: "Joy", lastName: "Uche", phone: "+2348012345031", relationship: "Mother", isPrimary: false }] },
  { id: "std_020", firstName: "Abdullahi", lastName: "Yusuf", dateOfBirth: "2007-12-01", gender: "Male", admissionNumber: "2025/020", gradeLevel: "SSS 3", section: "Arts", enrollmentDate: "2020-01-10", status: "active", boardingStatus: "Boarding", attendanceRate: 90.5, gpa: 3.0, feeStatus: "paid", bloodGroup: "O+", genotype: "AA", stateOfOrigin: "Zamfara", lga: "Gusau", religion: "Islam", tribe: "Hausa", guardians: [{ firstName: "Ismail", lastName: "Yusuf", phone: "+2348012345032", relationship: "Father", isPrimary: true }] },
  { id: "std_021", firstName: "Ebuka", lastName: "Nwosu", dateOfBirth: "2018-05-14", gender: "Male", admissionNumber: "2025/021", gradeLevel: "Nursery 1", enrollmentDate: "2025-01-10", status: "active", boardingStatus: "Day", attendanceRate: 90.0, gpa: 3.3, feeStatus: "paid", bloodGroup: "O+", genotype: "AA", stateOfOrigin: "Anambra", lga: "Awka South", religion: "Christianity", tribe: "Igbo", guardians: [{ firstName: "Chidi", lastName: "Nwosu", phone: "+2348012345033", relationship: "Father", isPrimary: true }, { firstName: "Ifeoma", lastName: "Nwosu", phone: "+2348012345034", relationship: "Mother", isPrimary: false }] },
  { id: "std_022", firstName: "Salamatu", lastName: "Abubakar", dateOfBirth: "2018-09-02", gender: "Female", admissionNumber: "2025/022", gradeLevel: "Nursery 1", enrollmentDate: "2025-01-10", status: "active", boardingStatus: "Day", attendanceRate: 88.5, gpa: 3.2, feeStatus: "pending", bloodGroup: "A+", genotype: "AA", stateOfOrigin: "Niger", lga: "Minna", religion: "Islam", tribe: "Nupe", guardians: [{ firstName: "Abubakar", lastName: "Abubakar", phone: "+2348012345035", relationship: "Father", isPrimary: true }] },
  { id: "std_023", firstName: "Adunni", lastName: "Falade", dateOfBirth: "2017-02-28", gender: "Female", admissionNumber: "2025/023", gradeLevel: "Nursery 2", enrollmentDate: "2024-09-10", status: "active", boardingStatus: "Day", attendanceRate: 93.2, gpa: 3.5, feeStatus: "paid", bloodGroup: "B+", genotype: "AA", stateOfOrigin: "Ondo", lga: "Akure South", religion: "Christianity", tribe: "Yoruba", guardians: [{ firstName: "Femi", lastName: "Falade", phone: "+2348012345036", email: "femi.f@email.com", relationship: "Father", isPrimary: true }, { firstName: "Bola", lastName: "Falade", phone: "+2348012345037", relationship: "Mother", isPrimary: false }] },
  { id: "std_024", firstName: "Ibrahim", lastName: "Lawal", dateOfBirth: "2017-08-11", gender: "Male", admissionNumber: "2025/024", gradeLevel: "Nursery 3", enrollmentDate: "2024-01-10", status: "active", boardingStatus: "Day", attendanceRate: 91.7, gpa: 3.4, feeStatus: "paid", bloodGroup: "O+", genotype: "AS", stateOfOrigin: "Kogi", lga: "Lokoja", religion: "Islam", tribe: "Yoruba", guardians: [{ firstName: "Lawal", lastName: "Lawal", phone: "+2348012345038", relationship: "Father", isPrimary: true }, { firstName: "Fatima", lastName: "Lawal", phone: "+2348012345039", relationship: "Mother", isPrimary: false }] },
  { id: "std_025", firstName: "Nneka", lastName: "Ogbonna", dateOfBirth: "2014-10-05", gender: "Female", admissionNumber: "2025/025", gradeLevel: "Primary 4", section: "A", enrollmentDate: "2023-01-10", status: "active", boardingStatus: "Day", attendanceRate: 96.4, gpa: 3.85, feeStatus: "paid", bloodGroup: "A+", genotype: "AA", stateOfOrigin: "Imo", lga: "Owerri Municipal", religion: "Christianity", tribe: "Igbo", guardians: [{ firstName: "Nonso", lastName: "Ogbonna", phone: "+2348012345040", email: "nonso.o@email.com", relationship: "Father", isPrimary: true }, { firstName: "Ada", lastName: "Ogbonna", phone: "+2348012345041", relationship: "Mother", isPrimary: false }] },
  { id: "std_026", firstName: "Sadiq", lastName: "Umar", dateOfBirth: "2013-06-17", gender: "Male", admissionNumber: "2025/026", gradeLevel: "Primary 6", section: "B", enrollmentDate: "2021-01-10", status: "inactive", boardingStatus: "Day", attendanceRate: 72.3, gpa: 1.9, feeStatus: "overdue", bloodGroup: "B+", genotype: "AA", stateOfOrigin: "Plateau", lga: "Jos North", religion: "Islam", tribe: "Hausa", guardians: [{ firstName: "Umar", lastName: "Umar", phone: "+2348012345042", relationship: "Father", isPrimary: true }] },
  { id: "std_027", firstName: "Olufunmilayo", lastName: "Akinyemi", middleName: "Tolulope", dateOfBirth: "2011-07-09", gender: "Female", admissionNumber: "2025/027", gradeLevel: "JSS 2", section: "A", enrollmentDate: "2024-01-10", status: "active", boardingStatus: "Boarding", attendanceRate: 93.9, gpa: 3.4, feeStatus: "paid", bloodGroup: "O-", genotype: "AA", stateOfOrigin: "Oyo", lga: "Ibadan South East", religion: "Christianity", tribe: "Yoruba", guardians: [{ firstName: "Tayo", lastName: "Akinyemi", phone: "+2348012345043", email: "tayo.a@email.com", relationship: "Father", isPrimary: true }, { firstName: "Morenike", lastName: "Akinyemi", phone: "+2348012345044", relationship: "Mother", isPrimary: false }] },
  { id: "std_028", firstName: "Emeka", lastName: "Igwe", dateOfBirth: "2010-11-23", gender: "Male", admissionNumber: "2025/028", gradeLevel: "JSS 3", section: "A", enrollmentDate: "2023-01-10", status: "active", boardingStatus: "Boarding", attendanceRate: 88.1, gpa: 3.0, feeStatus: "pending", bloodGroup: "AB+", genotype: "AA", stateOfOrigin: "Enugu", lga: "Nsukka", religion: "Christianity", tribe: "Igbo", allergies: "Dust mites", guardians: [{ firstName: "Uchenna", lastName: "Igwe", phone: "+2348012345045", relationship: "Father", isPrimary: true }, { firstName: "Chioma", lastName: "Igwe", phone: "+2348012345046", relationship: "Mother", isPrimary: false }] },
  { id: "std_029", firstName: "Hadiza", lastName: "Garba", dateOfBirth: "2009-01-30", gender: "Female", admissionNumber: "2025/029", gradeLevel: "SSS 1", section: "Commercial", enrollmentDate: "2022-01-10", status: "active", boardingStatus: "Boarding", attendanceRate: 94.5, gpa: 3.3, feeStatus: "paid", bloodGroup: "A+", genotype: "AA", stateOfOrigin: "Jigawa", lga: "Dutse", religion: "Islam", tribe: "Hausa", guardians: [{ firstName: "Garba", lastName: "Garba", phone: "+2348012345047", relationship: "Father", isPrimary: true }, { firstName: "Zulai", lastName: "Garba", phone: "+2348012345048", relationship: "Mother", isPrimary: false }] },
  { id: "std_030", firstName: "Chinonso", lastName: "Onyema", dateOfBirth: "2008-04-16", gender: "Male", admissionNumber: "2025/030", gradeLevel: "SSS 2", section: "Science", enrollmentDate: "2021-01-10", status: "active", boardingStatus: "Boarding", attendanceRate: 91.7, gpa: 3.5, feeStatus: "paid", bloodGroup: "O+", genotype: "AA", stateOfOrigin: "Abia", lga: "Aba North", religion: "Christianity", tribe: "Igbo", guardians: [{ firstName: "Okey", lastName: "Onyema", phone: "+2348012345049", email: "okey.onyema@email.com", relationship: "Father", occupation: "Businessman", isPrimary: true }, { firstName: "Mercy", lastName: "Onyema", phone: "+2348012345050", relationship: "Mother", isPrimary: false }] },
];


// ============================================
// Staff List (Extended Sample)
// ============================================
import type {
  Staff,
  StaffCredential,
  StaffAssignment,
  AssignmentRole,
  PermissionRole,
  StaffCategory,
  EmploymentType,
  EmploymentStatus,
} from "@/types/staff";

// Compact builder: takes the fields that vary per person, fills sensible
// defaults, and derives the legacy aliases (role/joinDate/status/salary/
// classesAssigned/subjects) so existing components keep compiling.
function mkStaff(p: {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string; // E.164
  gender: "male" | "female";
  designation: string;
  staffCategory: StaffCategory;
  isTeacher: boolean;
  permissionRole: PermissionRole;
  department: string;
  hireDate: string;
  reportsToId: string | null;
  gradeBand: string;
  subjects: string[];
  salary: number;
  classesAssigned: number;
  employmentType?: EmploymentType;
  ftePercent?: number;
  onLeave?: boolean;
  employmentStatus?: EmploymentStatus;
}): Staff {
  return {
    id: p.id,
    firstName: p.firstName,
    middleName: null,
    lastName: p.lastName,
    displayName: null,
    email: p.email,
    phone: p.phone,
    avatar: null,
    gender: p.gender,
    employeeNumber: `EMP-${p.id.slice(4)}`,
    designation: p.designation,
    staffCategory: p.staffCategory,
    isTeacher: p.isTeacher,
    permissionRole: p.permissionRole,
    department: p.department,
    employmentType: p.employmentType ?? "full_time",
    ftePercent: p.ftePercent ?? 100,
    hireDate: p.hireDate,
    exitDate: null,
    reportsToId: p.reportsToId,
    employmentStatus: p.employmentStatus ?? "active",
    gradeBand: p.gradeBand,
    customFields: {},
    qualifiedSubjectIds: p.subjects,
    // legacy aliases
    role: p.designation,
    joinDate: p.hireDate,
    status: p.onLeave ? "on_leave" : "active",
    salary: p.salary,
    classesAssigned: p.classesAssigned,
    subjects: p.subjects,
  };
}

export const staff: Staff[] = [
  mkStaff({ id: "stf_001", firstName: "John", lastName: "Smith", email: "john.smith@greenwood.edu", phone: "+15551112222", gender: "male", designation: "Teacher", staffCategory: "academic", isTeacher: true, permissionRole: "teacher", department: "Mathematics", hireDate: "2018-08-01", reportsToId: "stf_005", gradeBand: "T3", subjects: ["Algebra", "Geometry", "Calculus"], salary: 65000, classesAssigned: 4 }),
  mkStaff({ id: "stf_002", firstName: "Emily", lastName: "Davis", email: "emily.davis@greenwood.edu", phone: "+15552223333", gender: "female", designation: "Teacher", staffCategory: "academic", isTeacher: true, permissionRole: "teacher", department: "English", hireDate: "2019-08-15", reportsToId: "stf_005", gradeBand: "T2", subjects: ["Literature", "Creative Writing", "Grammar"], salary: 62000, classesAssigned: 5 }),
  mkStaff({ id: "stf_003", firstName: "Michael", lastName: "Lee", email: "michael.lee@greenwood.edu", phone: "+15553334444", gender: "male", designation: "Department Head", staffCategory: "academic", isTeacher: true, permissionRole: "teacher", department: "Science", hireDate: "2015-08-01", reportsToId: "stf_005", gradeBand: "M2", subjects: ["Physics", "Chemistry"], salary: 78000, classesAssigned: 3 }),
  mkStaff({ id: "stf_004", firstName: "Sarah", lastName: "Taylor", email: "sarah.taylor@greenwood.edu", phone: "+15554445555", gender: "female", designation: "Counselor", staffCategory: "support", isTeacher: false, permissionRole: "registrar", department: "Student Services", hireDate: "2020-01-15", reportsToId: "stf_005", gradeBand: "S2", subjects: [], salary: 55000, classesAssigned: 0 }),
  mkStaff({ id: "stf_005", firstName: "David", lastName: "Anderson", email: "david.anderson@greenwood.edu", phone: "+15555556666", gender: "male", designation: "Administrator", staffCategory: "support", isTeacher: false, permissionRole: "school_admin", department: "Administration", hireDate: "2017-06-01", reportsToId: null, gradeBand: "M3", subjects: [], salary: 72000, classesAssigned: 0 }),
  mkStaff({ id: "stf_006", firstName: "Jennifer", lastName: "Wilson", email: "jennifer.wilson@greenwood.edu", phone: "+15556667777", gender: "female", designation: "Teacher", staffCategory: "academic", isTeacher: true, permissionRole: "teacher", department: "History", hireDate: "2021-08-15", reportsToId: "stf_005", gradeBand: "T2", subjects: ["World History", "US History", "Civics"], salary: 58000, classesAssigned: 4 }),
  mkStaff({ id: "stf_007", firstName: "Robert", lastName: "Brown", email: "robert.brown@greenwood.edu", phone: "+15557778888", gender: "male", designation: "Teacher", staffCategory: "academic", isTeacher: true, permissionRole: "teacher", department: "Physical Education", hireDate: "2016-08-01", reportsToId: "stf_005", gradeBand: "T2", subjects: ["Physical Education", "Health"], salary: 52000, classesAssigned: 6 }),
  mkStaff({ id: "stf_008", firstName: "Lisa", lastName: "Martinez", email: "lisa.martinez@greenwood.edu", phone: "+15558889999", gender: "female", designation: "Teacher", staffCategory: "academic", isTeacher: true, permissionRole: "teacher", department: "Art", hireDate: "2019-01-10", reportsToId: "stf_005", gradeBand: "T2", subjects: ["Visual Arts", "Art History"], salary: 54000, classesAssigned: 5 }),
  mkStaff({ id: "stf_009", firstName: "James", lastName: "Garcia", email: "james.garcia@greenwood.edu", phone: "+15559990000", gender: "male", designation: "IT Support", staffCategory: "support", isTeacher: false, permissionRole: "support", department: "Technology", hireDate: "2022-03-01", reportsToId: "stf_005", gradeBand: "S2", subjects: [], salary: 60000, classesAssigned: 0 }),
  mkStaff({ id: "stf_010", firstName: "Amanda", lastName: "Thompson", email: "amanda.thompson@greenwood.edu", phone: "+15550001111", gender: "female", designation: "Librarian", staffCategory: "support", isTeacher: false, permissionRole: "support", department: "Library", hireDate: "2018-02-15", reportsToId: "stf_005", gradeBand: "S1", subjects: [], salary: 48000, classesAssigned: 0 }),
  mkStaff({ id: "stf_011", firstName: "Christopher", lastName: "Moore", email: "christopher.moore@greenwood.edu", phone: "+15551110000", gender: "male", designation: "Teacher", staffCategory: "academic", isTeacher: true, permissionRole: "teacher", department: "Music", hireDate: "2020-08-15", reportsToId: "stf_005", gradeBand: "T2", subjects: ["Band", "Choir", "Music Theory"], salary: 56000, classesAssigned: 3, employmentType: "part_time", ftePercent: 60, onLeave: true }),
  mkStaff({ id: "stf_012", firstName: "Patricia", lastName: "White", email: "patricia.white@greenwood.edu", phone: "+15552221111", gender: "female", designation: "Nurse", staffCategory: "support", isTeacher: false, permissionRole: "support", department: "Health Services", hireDate: "2017-09-01", reportsToId: "stf_005", gradeBand: "S1", subjects: [], salary: 50000, classesAssigned: 0 }),

  // --- Expanded roster: realistic department clustering + employment variety ---
  mkStaff({ id: "stf_013", firstName: "Daniel", lastName: "Okafor", email: "daniel.okafor@greenwood.edu", phone: "+15553120013", gender: "male", designation: "Teacher", staffCategory: "academic", isTeacher: true, permissionRole: "teacher", department: "Mathematics", hireDate: "2019-09-01", reportsToId: "stf_005", gradeBand: "T2", subjects: ["Mathematics"], salary: 60000, classesAssigned: 0 }),
  mkStaff({ id: "stf_014", firstName: "Grace", lastName: "Bello", email: "grace.bello@greenwood.edu", phone: "+15553120014", gender: "female", designation: "Teacher", staffCategory: "academic", isTeacher: true, permissionRole: "teacher", department: "Mathematics", hireDate: "2021-09-01", reportsToId: "stf_005", gradeBand: "T1", subjects: ["Mathematics"], salary: 36000, classesAssigned: 0, employmentType: "part_time", ftePercent: 60 }),
  mkStaff({ id: "stf_015", firstName: "Aisha", lastName: "Suleiman", email: "aisha.suleiman@greenwood.edu", phone: "+15553120015", gender: "female", designation: "Teacher", staffCategory: "academic", isTeacher: true, permissionRole: "teacher", department: "English", hireDate: "2018-09-01", reportsToId: "stf_005", gradeBand: "T2", subjects: ["English Studies", "Literature"], salary: 58000, classesAssigned: 0 }),
  mkStaff({ id: "stf_016", firstName: "Mark", lastName: "Thompson", email: "mark.thompson@greenwood.edu", phone: "+15553120016", gender: "male", designation: "Teacher", staffCategory: "academic", isTeacher: true, permissionRole: "teacher", department: "English", hireDate: "2022-09-01", reportsToId: "stf_005", gradeBand: "T1", subjects: ["English Studies"], salary: 52000, classesAssigned: 0 }),
  mkStaff({ id: "stf_017", firstName: "Ngozi", lastName: "Eze", email: "ngozi.eze@greenwood.edu", phone: "+15553120017", gender: "female", designation: "Teacher", staffCategory: "academic", isTeacher: true, permissionRole: "teacher", department: "Science", hireDate: "2017-09-01", reportsToId: "stf_003", gradeBand: "T2", subjects: ["Physics"], salary: 61000, classesAssigned: 0 }),
  mkStaff({ id: "stf_018", firstName: "Samuel", lastName: "Adeyemi", email: "samuel.adeyemi@greenwood.edu", phone: "+15553120018", gender: "male", designation: "Teacher", staffCategory: "academic", isTeacher: true, permissionRole: "teacher", department: "Science", hireDate: "2016-09-01", reportsToId: "stf_003", gradeBand: "T2", subjects: ["Chemistry"], salary: 62000, classesAssigned: 0 }),
  mkStaff({ id: "stf_019", firstName: "Fatima", lastName: "Yusuf", email: "fatima.yusuf@greenwood.edu", phone: "+15553120019", gender: "female", designation: "Teacher", staffCategory: "academic", isTeacher: true, permissionRole: "teacher", department: "Science", hireDate: "2020-09-01", reportsToId: "stf_003", gradeBand: "T1", subjects: ["Biology"], salary: 55000, classesAssigned: 0 }),
  mkStaff({ id: "stf_020", firstName: "Peter", lastName: "Nwosu", email: "peter.nwosu@greenwood.edu", phone: "+15553120020", gender: "male", designation: "Teacher", staffCategory: "academic", isTeacher: true, permissionRole: "teacher", department: "History", hireDate: "2019-01-10", reportsToId: "stf_005", gradeBand: "T2", subjects: ["History", "Government"], salary: 54000, classesAssigned: 0 }),
  mkStaff({ id: "stf_021", firstName: "Linda", lastName: "Effiong", email: "linda.effiong@greenwood.edu", phone: "+15553120021", gender: "female", designation: "Teacher", staffCategory: "academic", isTeacher: true, permissionRole: "teacher", department: "Physical Education", hireDate: "2021-09-01", reportsToId: "stf_005", gradeBand: "T1", subjects: ["Physical & Health Education"], salary: 40000, classesAssigned: 0, employmentType: "term_time" }),
  mkStaff({ id: "stf_022", firstName: "Tunde", lastName: "Bakare", email: "tunde.bakare@greenwood.edu", phone: "+15553120022", gender: "male", designation: "Teacher", staffCategory: "academic", isTeacher: true, permissionRole: "teacher", department: "Art", hireDate: "2020-01-15", reportsToId: "stf_005", gradeBand: "T1", subjects: ["Cultural & Creative Arts"], salary: 30000, classesAssigned: 0, employmentType: "part_time", ftePercent: 50 }),
  mkStaff({ id: "stf_023", firstName: "Marie", lastName: "Laurent", email: "marie.laurent@greenwood.edu", phone: "+15553120023", gender: "female", designation: "Teacher", staffCategory: "academic", isTeacher: true, permissionRole: "teacher", department: "English", hireDate: "2018-09-01", reportsToId: "stf_005", gradeBand: "T2", subjects: ["French"], salary: 57000, classesAssigned: 0 }),
  mkStaff({ id: "stf_024", firstName: "Yetunde", lastName: "Ade", email: "yetunde.ade@greenwood.edu", phone: "+15553120024", gender: "female", designation: "Teacher", staffCategory: "academic", isTeacher: true, permissionRole: "teacher", department: "English", hireDate: "2022-09-01", reportsToId: "stf_005", gradeBand: "T1", subjects: ["Yoruba"], salary: 50000, classesAssigned: 0 }),
  mkStaff({ id: "stf_025", firstName: "Kevin", lastName: "Mensah", email: "kevin.mensah@greenwood.edu", phone: "+15553120025", gender: "male", designation: "Teacher", staffCategory: "academic", isTeacher: true, permissionRole: "teacher", department: "Technology", hireDate: "2026-01-15", reportsToId: "stf_005", gradeBand: "T1", subjects: ["Computer Studies"], salary: 52000, classesAssigned: 0, employmentStatus: "onboarding" }),
  mkStaff({ id: "stf_026", firstName: "Rachel", lastName: "Adamu", email: "rachel.adamu@greenwood.edu", phone: "+15553120026", gender: "female", designation: "Teacher", staffCategory: "academic", isTeacher: true, permissionRole: "teacher", department: "Mathematics", hireDate: "2026-02-01", reportsToId: "stf_005", gradeBand: "T1", subjects: ["Mathematics"], salary: 45000, classesAssigned: 0, employmentType: "contract", employmentStatus: "onboarding" }),
  mkStaff({ id: "stf_027", firstName: "Olu", lastName: "Adekunle", email: "olu.adekunle@greenwood.edu", phone: "+15553120027", gender: "male", designation: "Vice Principal", staffCategory: "support", isTeacher: false, permissionRole: "school_admin", department: "Administration", hireDate: "2014-08-01", reportsToId: "stf_005", gradeBand: "M3", subjects: [], salary: 75000, classesAssigned: 0 }),
  mkStaff({ id: "stf_028", firstName: "Chioma", lastName: "Okeke", email: "chioma.okeke@greenwood.edu", phone: "+15553120028", gender: "female", designation: "Bursar", staffCategory: "support", isTeacher: false, permissionRole: "bursar", department: "Administration", hireDate: "2016-03-01", reportsToId: "stf_005", gradeBand: "M2", subjects: [], salary: 68000, classesAssigned: 0 }),
  mkStaff({ id: "stf_029", firstName: "Helen", lastName: "Park", email: "helen.park@greenwood.edu", phone: "+15553120029", gender: "female", designation: "Registrar", staffCategory: "support", isTeacher: false, permissionRole: "registrar", department: "Administration", hireDate: "2019-05-01", reportsToId: "stf_005", gradeBand: "S2", subjects: [], salary: 52000, classesAssigned: 0 }),
  mkStaff({ id: "stf_030", firstName: "Ibrahim", lastName: "Sani", email: "ibrahim.sani@greenwood.edu", phone: "+15553120030", gender: "male", designation: "Facilities Officer", staffCategory: "support", isTeacher: false, permissionRole: "support", department: "Administration", hireDate: "2018-02-01", reportsToId: "stf_005", gradeBand: "S1", subjects: [], salary: 38000, classesAssigned: 0 }),
];

// Staff credentials (license, work permit/visa, background check, medical,
// contract) with expiry dates. Statuses are stored for the demo; once live they
// derive from expiryDate via credentialStatusFor(). Dates relative to mid-2026.
export const staffCredentials: StaffCredential[] = [
  { id: "cred_001", staffId: "stf_001", type: "teaching_license", name: "QTS", issuingAuthority: "Teaching Regulation Agency", number: "QTS-2018-4471", issueDate: "2018-07-01", expiryDate: null, status: "valid" },
  { id: "cred_002", staffId: "stf_001", type: "background_check", name: "DBS", issuingAuthority: "Disclosure and Barring Service", number: "DBS-99102", issueDate: "2023-07-10", expiryDate: "2026-07-15", status: "expiring" },
  { id: "cred_003", staffId: "stf_003", type: "teaching_license", name: "State Educator ID", issuingAuthority: "State Board of Education", number: "SEID-553120", issueDate: "2015-06-01", expiryDate: "2028-01-01", status: "valid" },
  { id: "cred_004", staffId: "stf_003", type: "work_permit", name: "H-1B Visa", issuingAuthority: "USCIS", number: "H1B-22-771", issueDate: "2023-06-20", expiryDate: "2026-06-20", status: "expiring" },
  { id: "cred_005", staffId: "stf_006", type: "teaching_license", name: "State Educator ID", issuingAuthority: "State Board of Education", number: "SEID-661204", issueDate: "2021-07-15", expiryDate: "2026-03-01", status: "expired" },
  { id: "cred_006", staffId: "stf_009", type: "contract", name: "Employment contract", issuingAuthority: "Greenwood Academy", number: "CT-2022-009", issueDate: "2022-03-01", expiryDate: "2026-08-31", status: "expiring" },
  { id: "cred_007", staffId: "stf_012", type: "medical", name: "First Aid certification", issuingAuthority: "Red Cross", number: "FA-2024-112", issueDate: "2024-12-01", expiryDate: "2026-12-01", status: "valid" },
  { id: "cred_008", staffId: "stf_011", type: "teaching_license", name: "QTS", issuingAuthority: "Teaching Regulation Agency", number: "QTS-2020-8830", issueDate: "2020-07-15", expiryDate: null, status: "valid" },
];

// ============================================
// Classes/Grades (Extended)
// ============================================
import type { Class, ClassSubject, ClassEnrollment, ClassSubjectEnrollment } from "@/types/class";

export const classes: Class[] = [
  // Nursery
  { id: "cls_001", name: "Nursery 1", gradeLevel: "Nursery 1", arm: "A", stream: null, academicSession: "2025/2026", currentTerm: "Second", classTeacherId: "stf_002", room: "N1", capacity: 25, status: "active", studentCount: 1, averageGrade: null, averageAttendance: null, students: 1, avgGrade: 0, attendanceRate: 0, teacher: "Emily Davis", schedule: "Mon-Fri 8:00-12:30" },
  { id: "cls_002", name: "Nursery 2", gradeLevel: "Nursery 2", arm: "A", stream: null, academicSession: "2025/2026", currentTerm: "Second", classTeacherId: "stf_002", room: "N2", capacity: 25, status: "active", studentCount: 1, averageGrade: null, averageAttendance: null, students: 1, avgGrade: 0, attendanceRate: 0, teacher: "Emily Davis", schedule: "Mon-Fri 8:00-12:30" },
  { id: "cls_003", name: "Nursery 3", gradeLevel: "Nursery 3", arm: "A", stream: null, academicSession: "2025/2026", currentTerm: "Second", classTeacherId: "stf_004", room: "N3", capacity: 25, status: "active", studentCount: 1, averageGrade: null, averageAttendance: null, students: 1, avgGrade: 0, attendanceRate: 0, teacher: "Sarah Wilson", schedule: "Mon-Fri 8:00-12:30" },

  // Primary
  { id: "cls_004", name: "Primary 1A", gradeLevel: "Primary 1", arm: "A", stream: null, academicSession: "2025/2026", currentTerm: "Second", classTeacherId: "stf_001", room: "P1A", capacity: 30, status: "active", studentCount: 1, averageGrade: null, averageAttendance: null, students: 1, avgGrade: 0, attendanceRate: 0, teacher: "John Smith", schedule: "Mon-Fri 8:00-2:00" },
  { id: "cls_005", name: "Primary 1B", gradeLevel: "Primary 1", arm: "B", stream: null, academicSession: "2025/2026", currentTerm: "Second", classTeacherId: "stf_002", room: "P1B", capacity: 30, status: "active", studentCount: 1, averageGrade: null, averageAttendance: null, students: 1, avgGrade: 0, attendanceRate: 0, teacher: "Emily Davis", schedule: "Mon-Fri 8:00-2:00" },
  { id: "cls_006", name: "Primary 4A", gradeLevel: "Primary 4", arm: "A", stream: null, academicSession: "2025/2026", currentTerm: "Second", classTeacherId: "stf_003", room: "P4A", capacity: 32, status: "active", studentCount: 1, averageGrade: null, averageAttendance: null, students: 1, avgGrade: 0, attendanceRate: 0, teacher: "Michael Lee", schedule: "Mon-Fri 8:00-2:30" },
  { id: "cls_007", name: "Primary 4B", gradeLevel: "Primary 4", arm: "B", stream: null, academicSession: "2025/2026", currentTerm: "Second", classTeacherId: "stf_004", room: "P4B", capacity: 32, status: "active", studentCount: 1, averageGrade: null, averageAttendance: null, students: 1, avgGrade: 0, attendanceRate: 0, teacher: "Sarah Wilson", schedule: "Mon-Fri 8:00-2:30" },
  { id: "cls_008", name: "Primary 6A", gradeLevel: "Primary 6", arm: "A", stream: null, academicSession: "2025/2026", currentTerm: "Second", classTeacherId: "stf_005", room: "P6A", capacity: 32, status: "active", studentCount: 2, averageGrade: null, averageAttendance: null, students: 2, avgGrade: 0, attendanceRate: 0, teacher: "David Brown", schedule: "Mon-Fri 8:00-2:30" },

  // JSS
  { id: "cls_009", name: "JSS 1A", gradeLevel: "JSS 1", arm: "A", stream: null, academicSession: "2025/2026", currentTerm: "Second", classTeacherId: "stf_006", room: "J1A", capacity: 35, status: "active", studentCount: 1, averageGrade: null, averageAttendance: null, students: 1, avgGrade: 0, attendanceRate: 0, teacher: "Lisa Martinez", schedule: "Mon-Fri 8:00-3:00" },
  { id: "cls_010", name: "JSS 1B", gradeLevel: "JSS 1", arm: "B", stream: null, academicSession: "2025/2026", currentTerm: "Second", classTeacherId: "stf_007", room: "J1B", capacity: 35, status: "active", studentCount: 1, averageGrade: null, averageAttendance: null, students: 1, avgGrade: 0, attendanceRate: 0, teacher: "Robert Taylor", schedule: "Mon-Fri 8:00-3:00" },
  { id: "cls_011", name: "JSS 2A", gradeLevel: "JSS 2", arm: "A", stream: null, academicSession: "2025/2026", currentTerm: "Second", classTeacherId: "stf_008", room: "J2A", capacity: 35, status: "active", studentCount: 2, averageGrade: null, averageAttendance: null, students: 2, avgGrade: 0, attendanceRate: 0, teacher: "Jennifer Anderson", schedule: "Mon-Fri 8:00-3:00" },
  { id: "cls_012", name: "JSS 2B", gradeLevel: "JSS 2", arm: "B", stream: null, academicSession: "2025/2026", currentTerm: "Second", classTeacherId: "stf_009", room: "J2B", capacity: 35, status: "active", studentCount: 1, averageGrade: null, averageAttendance: null, students: 1, avgGrade: 0, attendanceRate: 0, teacher: "James Thomas", schedule: "Mon-Fri 8:00-3:00" },
  { id: "cls_013", name: "JSS 3A", gradeLevel: "JSS 3", arm: "A", stream: null, academicSession: "2025/2026", currentTerm: "Second", classTeacherId: "stf_010", room: "J3A", capacity: 35, status: "active", studentCount: 2, averageGrade: null, averageAttendance: null, students: 2, avgGrade: 0, attendanceRate: 0, teacher: "Patricia Jackson", schedule: "Mon-Fri 8:00-3:00" },

  // SSS
  { id: "cls_014", name: "SS1 Science A", gradeLevel: "SSS 1", arm: "A", stream: "Science", academicSession: "2025/2026", currentTerm: "Second", classTeacherId: "stf_011", room: "S1SciA", capacity: 30, status: "active", studentCount: 1, averageGrade: null, averageAttendance: null, students: 1, avgGrade: 0, attendanceRate: 0, teacher: "Christopher White", schedule: "Mon-Fri 8:00-3:30" },
  { id: "cls_015", name: "SS1 Arts A", gradeLevel: "SSS 1", arm: "A", stream: "Arts", academicSession: "2025/2026", currentTerm: "Second", classTeacherId: "stf_012", room: "S1ArtA", capacity: 30, status: "active", studentCount: 1, averageGrade: null, averageAttendance: null, students: 1, avgGrade: 0, attendanceRate: 0, teacher: "Linda Harris", schedule: "Mon-Fri 8:00-3:30" },
  { id: "cls_016", name: "SS2 Science A", gradeLevel: "SSS 2", arm: "A", stream: "Science", academicSession: "2025/2026", currentTerm: "Second", classTeacherId: "stf_003", room: "S2SciA", capacity: 30, status: "active", studentCount: 2, averageGrade: null, averageAttendance: null, students: 2, avgGrade: 0, attendanceRate: 0, teacher: "Michael Lee", schedule: "Mon-Fri 8:00-3:30" },
  { id: "cls_017", name: "SS3 Science A", gradeLevel: "SSS 3", arm: "A", stream: "Science", academicSession: "2025/2026", currentTerm: "Second", classTeacherId: "stf_001", room: "S3SciA", capacity: 30, status: "active", studentCount: 1, averageGrade: null, averageAttendance: null, students: 1, avgGrade: 0, attendanceRate: 0, teacher: "John Smith", schedule: "Mon-Fri 8:00-4:00" },

  // A freshly-created draft class -- no teacher, subjects, or roster yet. Used
  // to demonstrate the "Set up this class" checklist; the cohort generator
  // skips non-active classes so it stays empty.
  { id: "cls_018", name: "JSS 1C", gradeLevel: "JSS 1", arm: "C", stream: null, academicSession: "2025/2026", currentTerm: "Second", classTeacherId: "", room: "TBD", capacity: 35, status: "draft", studentCount: 0, averageGrade: null, averageAttendance: null, students: 0, avgGrade: 0, attendanceRate: 0, teacher: "Unassigned", schedule: "Not set" },
];

const PRIMARY_SUBJECTS = ["Mathematics", "English Studies", "Basic Science", "Social Studies", "Civic Education", "Computer Studies", "Christian Religious Studies", "Physical & Health Education"];
const JSS_SUBJECTS = ["Mathematics", "English Studies", "Basic Science", "Basic Technology", "Business Studies", "Civic Education", "Computer Studies", "Cultural & Creative Arts", "Religious Studies", "Yoruba"];
const SSS_SCIENCE_SUBJECTS = ["Mathematics", "English Language", "Physics", "Chemistry", "Biology", "Further Mathematics", "Civic Education"];
const SSS_ARTS_SUBJECTS = ["Mathematics", "English Language", "Literature in English", "Government", "History", "Christian Religious Studies", "Civic Education"];
const NURSERY_SUBJECTS = ["Numeracy", "Literacy", "Rhymes & Stories", "Creative Arts", "Physical Activities"];

// SSS electives that not every student in the stream takes (per-subject
// sub-roster lives in classSubjectEnrollments). Everything else is core.
const SSS_ELECTIVES = ["Further Mathematics"];

function classSubjectsFor(
  classId: string,
  subjects: string[],
  teacherPool: (string | null)[],
  electives: string[] = []
): ClassSubject[] {
  return subjects.map((subjectId, i) => {
    const primary = teacherPool[i % teacherPool.length];
    // Demo co-teaching: every 4th subject with a real teacher gets a second one.
    const ids =
      primary && i % 4 === 3
        ? [primary, teacherPool[(i + 1) % teacherPool.length]]
        : [primary];
    return {
      classId,
      subjectId,
      teacherIds: ids.filter((x): x is string => Boolean(x)),
      isCore: !electives.includes(subjectId),
    };
  });
}

// Active teaching pool used to populate subject teachers across JSS/SSS classes.
// Excludes the two onboarding hires (stf_025, stf_026) so they surface as
// unassigned teachers in the coverage widget.
const subjectTeacherPool = [
  "stf_001", "stf_002", "stf_003", "stf_006", "stf_007", "stf_008",
  "stf_013", "stf_014", "stf_015", "stf_016", "stf_017", "stf_018",
  "stf_019", "stf_020", "stf_021", "stf_022", "stf_023", "stf_024",
];

export const classSubjects: ClassSubject[] = [
  ...classSubjectsFor("cls_001", NURSERY_SUBJECTS, [null]),
  ...classSubjectsFor("cls_002", NURSERY_SUBJECTS, [null]),
  ...classSubjectsFor("cls_003", NURSERY_SUBJECTS, [null]),
  ...classSubjectsFor("cls_004", PRIMARY_SUBJECTS, [null]),
  ...classSubjectsFor("cls_005", PRIMARY_SUBJECTS, [null]),
  ...classSubjectsFor("cls_006", PRIMARY_SUBJECTS, [null]),
  ...classSubjectsFor("cls_007", PRIMARY_SUBJECTS, [null]),
  ...classSubjectsFor("cls_008", PRIMARY_SUBJECTS, [null]),
  ...classSubjectsFor("cls_009", JSS_SUBJECTS, subjectTeacherPool),
  ...classSubjectsFor("cls_010", JSS_SUBJECTS, subjectTeacherPool),
  ...classSubjectsFor("cls_011", JSS_SUBJECTS, subjectTeacherPool),
  ...classSubjectsFor("cls_012", JSS_SUBJECTS, subjectTeacherPool),
  ...classSubjectsFor("cls_013", JSS_SUBJECTS, subjectTeacherPool),
  ...classSubjectsFor("cls_014", SSS_SCIENCE_SUBJECTS, subjectTeacherPool, SSS_ELECTIVES),
  ...classSubjectsFor("cls_015", SSS_ARTS_SUBJECTS, subjectTeacherPool, SSS_ELECTIVES),
  ...classSubjectsFor("cls_016", SSS_SCIENCE_SUBJECTS, subjectTeacherPool, SSS_ELECTIVES),
  ...classSubjectsFor("cls_017", SSS_SCIENCE_SUBJECTS, subjectTeacherPool, SSS_ELECTIVES),
];

// Per-subject sub-rosters for non-core (elective) subjects. Empty in the demo
// until the SSS elective-picking UI is built; the schema (and isCore flag
// above) already model it so the backend can build to this shape.
export const classSubjectEnrollments: ClassSubjectEnrollment[] = [];

export const classEnrollments: ClassEnrollment[] = [
  { classId: "cls_001", studentId: "std_021", enrolledAt: "2025-01-10", exitedAt: null, status: "active" },
  { classId: "cls_001", studentId: "std_022", enrolledAt: "2025-01-10", exitedAt: null, status: "active" },
  { classId: "cls_002", studentId: "std_023", enrolledAt: "2024-09-10", exitedAt: null, status: "active" },
  { classId: "cls_003", studentId: "std_024", enrolledAt: "2024-01-10", exitedAt: null, status: "active" },
  { classId: "cls_004", studentId: "std_001", enrolledAt: "2025-01-10", exitedAt: null, status: "active" },
  { classId: "cls_005", studentId: "std_002", enrolledAt: "2025-01-10", exitedAt: null, status: "active" },
  { classId: "cls_006", studentId: "std_025", enrolledAt: "2023-01-10", exitedAt: null, status: "active" },
  { classId: "cls_007", studentId: "std_005", enrolledAt: "2023-01-10", exitedAt: null, status: "active" },
  { classId: "cls_008", studentId: "std_008", enrolledAt: "2021-01-10", exitedAt: null, status: "active" },
  { classId: "cls_008", studentId: "std_026", enrolledAt: "2021-01-10", exitedAt: null, status: "active" },
  { classId: "cls_009", studentId: "std_009", enrolledAt: "2025-01-10", exitedAt: null, status: "active" },
  { classId: "cls_010", studentId: "std_010", enrolledAt: "2025-01-10", exitedAt: null, status: "active" },
  { classId: "cls_011", studentId: "std_011", enrolledAt: "2024-01-10", exitedAt: null, status: "active" },
  { classId: "cls_011", studentId: "std_027", enrolledAt: "2024-01-10", exitedAt: null, status: "active" },
  { classId: "cls_012", studentId: "std_012", enrolledAt: "2024-01-10", exitedAt: null, status: "active" },
  { classId: "cls_013", studentId: "std_013", enrolledAt: "2023-01-10", exitedAt: null, status: "active" },
  { classId: "cls_013", studentId: "std_028", enrolledAt: "2023-01-10", exitedAt: null, status: "active" },
  { classId: "cls_014", studentId: "std_015", enrolledAt: "2025-01-10", exitedAt: null, status: "active" },
  { classId: "cls_015", studentId: "std_016", enrolledAt: "2025-01-10", exitedAt: null, status: "active" },
  { classId: "cls_016", studentId: "std_017", enrolledAt: "2024-01-10", exitedAt: null, status: "active" },
  { classId: "cls_016", studentId: "std_030", enrolledAt: "2024-01-10", exitedAt: null, status: "active" },
  { classId: "cls_017", studentId: "std_019", enrolledAt: "2023-01-10", exitedAt: null, status: "active" },
];

// ---------------------------------------------------------------------------
// Synthetic cohort generation (DEMO ONLY)
// ---------------------------------------------------------------------------
// Fills each class to a realistic size with deterministically-generated demo
// students so the Classes UI looks like a populated school. Deterministic (no
// Math.random) to avoid SSR/CSR hydration mismatch. The real backend replaces
// all of this with computed rosters + stats.
(function generateCohorts() {
  const FIRST_M = ["Chidi", "Emeka", "Tunde", "Yusuf", "Ibrahim", "Obi", "Kunle", "Femi", "Sani", "Uche", "Bayo", "Nnamdi", "Segun", "Musa", "Kelechi", "Olumide", "Chuka", "Dayo", "Ahmed", "Gbenga"];
  const FIRST_F = ["Amaka", "Ngozi", "Fatima", "Aisha", "Bukola", "Chioma", "Halima", "Funke", "Zainab", "Adaeze", "Yemi", "Hauwa", "Ifeoma", "Temi", "Bisi", "Nkechi", "Maryam", "Tola", "Ronke", "Esther"];
  const LAST = ["Okafor", "Bello", "Adeyemi", "Ibrahim", "Eze", "Okonkwo", "Musa", "Afolabi", "Nwosu", "Lawal", "Balogun", "Okeke", "Sani", "Adewale", "Obi", "Yakubu", "Chukwu", "Danjuma", "Olayinka", "Mohammed"];
  const STATES = ["Lagos", "Kano", "Anambra", "Oyo", "Rivers", "Enugu", "Kaduna", "Imo", "Delta", "Ogun"];

  function seeded(seedStr: string) {
    let h = 1779033703 ^ seedStr.length;
    for (let i = 0; i < seedStr.length; i++) {
      h = Math.imul(h ^ seedStr.charCodeAt(i), 3432918353);
      h = (h << 13) | (h >>> 19);
    }
    let st = (h >>> 0) || 1;
    return () => {
      st = Math.imul(st ^ (st >>> 15), st | 1);
      st ^= st + Math.imul(st ^ (st >>> 7), st | 61);
      return ((st ^ (st >>> 14)) >>> 0) / 4294967296;
    };
  }

  function targetSize(gradeLevel: string) {
    if (gradeLevel.startsWith("Nursery")) return 18;
    if (gradeLevel.startsWith("Primary")) return 30;
    if (gradeLevel.startsWith("JSS")) return 34;
    return 28;
  }

  const BIRTH_YEAR: Record<string, number> = {
    "Nursery 1": 2021, "Nursery 2": 2020, "Nursery 3": 2019,
    "Primary 1": 2018, "Primary 2": 2017, "Primary 3": 2016, "Primary 4": 2015, "Primary 5": 2014, "Primary 6": 2013,
    "JSS 1": 2012, "JSS 2": 2011, "JSS 3": 2010, "SSS 1": 2009, "SSS 2": 2008, "SSS 3": 2007,
  };

  let counter = 1000;
  for (const c of classes) {
    if (c.status !== "active") continue; // leave draft/archived classes empty
    const rand = seeded(c.id);
    const existing = classEnrollments.filter((e) => e.classId === c.id).length;
    const need = Math.max(0, targetSize(c.gradeLevel) - existing);
    for (let i = 0; i < need; i++) {
      const female = rand() < 0.5;
      const fn = (female ? FIRST_F : FIRST_M)[Math.floor(rand() * 20)];
      const ln = LAST[Math.floor(rand() * 20)];
      const guardianFn = (rand() < 0.5 ? FIRST_M : FIRST_F)[Math.floor(rand() * 20)];
      const sid = `gen_${c.id}_${String(i + 1).padStart(2, "0")}`;
      counter += 1;
      const att = Math.round((80 + rand() * 19) * 10) / 10;
      const gpa = Math.round((2.3 + rand() * 1.7) * 100) / 100;
      const fr = rand();
      const fee = fr < 0.7 ? "paid" : fr < 0.9 ? "pending" : "overdue";
      const yr = BIRTH_YEAR[c.gradeLevel] ?? 2012;
      const mo = String(1 + Math.floor(rand() * 12)).padStart(2, "0");
      const day = String(1 + Math.floor(rand() * 28)).padStart(2, "0");
      students.push({
        id: sid,
        firstName: fn,
        lastName: ln,
        dateOfBirth: `${yr}-${mo}-${day}`,
        gender: female ? "Female" : "Male",
        admissionNumber: `2025/${String(counter).padStart(4, "0")}`,
        gradeLevel: c.gradeLevel,
        section: c.arm,
        enrollmentDate: "2025-01-10",
        status: "active",
        boardingStatus: "Day",
        stateOfOrigin: STATES[Math.floor(rand() * STATES.length)],
        attendanceRate: att,
        gpa,
        feeStatus: fee,
        guardians: [
          { firstName: guardianFn, lastName: ln, phone: `+23480${String(10000000 + Math.floor(rand() * 89999999))}`, relationship: "Parent", isPrimary: true },
        ],
      });
      classEnrollments.push({ classId: c.id, studentId: sid, enrolledAt: "2025-01-10", exitedAt: null, status: "active" });
    }
  }

  for (const c of classes) {
    const ids = new Set(
      classEnrollments.filter((e) => e.classId === c.id && e.status === "active").map((e) => e.studentId)
    );
    const roster = students.filter((s) => ids.has(s.id));
    const att = roster.map((s) => s.attendanceRate).filter((v) => v != null);
    const gpas = roster.map((s) => s.gpa).filter((v) => v != null);
    const avgAtt = att.length ? Math.round((att.reduce((a, b) => a + b, 0) / att.length) * 10) / 10 : null;
    const avgGpa = gpas.length ? Math.round((gpas.reduce((a, b) => a + b, 0) / gpas.length) * 100) / 100 : null;
    c.studentCount = roster.length;
    c.students = roster.length;
    c.averageAttendance = avgAtt;
    c.averageGrade = avgGpa;
    c.attendanceRate = avgAtt ?? 0;
    c.avgGrade = avgGpa ?? 0;
  }
})();

// ============================================
// Financial Transactions
// ============================================
export const financialTransactions = [
  { id: "txn_001", studentName: "Emma Wilson", type: "tuition" as const, amount: 2500, status: "completed" as const, date: "2026-01-05", method: "Credit Card" },
  { id: "txn_002", studentName: "James Chen", type: "tuition" as const, amount: 2500, status: "completed" as const, date: "2026-01-05", method: "Bank Transfer" },
  { id: "txn_003", studentName: "Sophia Martinez", type: "activity" as const, amount: 150, status: "completed" as const, date: "2026-01-04", method: "Credit Card" },
  { id: "txn_004", studentName: "Liam Johnson", type: "tuition" as const, amount: 2500, status: "pending" as const, date: "2026-01-03", method: "Bank Transfer" },
  { id: "txn_005", studentName: "Olivia Brown", type: "supplies" as const, amount: 75, status: "completed" as const, date: "2026-01-02", method: "Cash" },
  { id: "txn_006", studentName: "Noah Davis", type: "tuition" as const, amount: 2500, status: "overdue" as const, date: "2025-12-15", method: "Pending" },
  { id: "txn_007", studentName: "Ava Garcia", type: "tuition" as const, amount: 2500, status: "completed" as const, date: "2026-01-06", method: "Credit Card" },
  { id: "txn_008", studentName: "Ethan Miller", type: "tuition" as const, amount: 2500, status: "overdue" as const, date: "2025-12-01", method: "Pending" },
  { id: "txn_009", studentName: "Isabella Anderson", type: "activity" as const, amount: 200, status: "completed" as const, date: "2026-01-04", method: "Credit Card" },
  { id: "txn_010", studentName: "Mason Taylor", type: "tuition" as const, amount: 2500, status: "completed" as const, date: "2026-01-05", method: "Bank Transfer" },
];

// ============================================
// Messages
// ============================================
export const messages = [
  {
    id: "msg_001",
    from: "Mrs. Davis",
    fromRole: "Parent",
    subject: "Meeting Request for Grade 5 Discussion",
    preview: "Hi, I would like to schedule a meeting to discuss my son's progress in...",
    date: "2026-01-06",
    time: "10:30 AM",
    read: false,
    starred: true,
    category: "inbox" as const,
  },
  {
    id: "msg_002",
    from: "Mr. Smith",
    fromRole: "Teacher",
    subject: "Midterm Exam Schedule Update",
    preview: "Please note that the midterm exams for Grade 9 have been rescheduled to...",
    date: "2026-01-06",
    time: "9:15 AM",
    read: false,
    starred: false,
    category: "inbox" as const,
  },
  {
    id: "msg_003",
    from: "System",
    fromRole: "System",
    subject: "Fee Payment Reminder - 23 Overdue",
    preview: "This is an automated reminder that 23 students have overdue fee payments...",
    date: "2026-01-05",
    time: "8:00 AM",
    read: true,
    starred: false,
    category: "inbox" as const,
  },
  {
    id: "msg_004",
    from: "Mrs. Chen",
    fromRole: "Parent",
    subject: "Absence Notification for James",
    preview: "I am writing to inform you that James will be absent on Friday due to...",
    date: "2026-01-05",
    time: "7:45 PM",
    read: true,
    starred: false,
    category: "inbox" as const,
  },
  {
    id: "msg_005",
    from: "Principal Williams",
    fromRole: "Staff",
    subject: "Staff Meeting - Friday 3:30 PM",
    preview: "Reminder: We have a mandatory staff meeting this Friday at 3:30 PM in the...",
    date: "2026-01-04",
    time: "2:00 PM",
    read: true,
    starred: true,
    category: "inbox" as const,
  },
  {
    id: "msg_006",
    from: "You",
    fromRole: "Admin",
    subject: "Re: Meeting Request for Grade 5",
    preview: "Thank you for reaching out. I have scheduled a meeting for...",
    date: "2026-01-04",
    time: "11:00 AM",
    read: true,
    starred: false,
    category: "sent" as const,
  },
  {
    id: "msg_007",
    from: "IT Support",
    fromRole: "Staff",
    subject: "System Maintenance Notice",
    preview: "The school management system will undergo maintenance on Saturday...",
    date: "2026-01-03",
    time: "4:30 PM",
    read: true,
    starred: false,
    category: "inbox" as const,
  },
];

// ============================================
// Fee Summary
// ============================================
export const feeSummary = {
  totalExpected: 1000000,
  totalCollected: 847500,
  totalOutstanding: 152500,
  collectionRate: 84.75,
  thisMonthCollected: 125000,
  overdueAccounts: 23,
};

// ============================================
// Today's Attendance Summary
// ============================================
export const todayAttendance = {
  total: 1247,
  present: 1172,
  absent: 52,
  late: 18,
  excused: 5,
  rate: 94.0,
};

// ============================================
// Class Attendance Records (for Attendance Page)
// ============================================
export const classAttendanceRecords = [
  {
    id: "att_001",
    className: "Grade 5A",
    teacher: "Ms. Johnson",
    date: "2026-01-06",
    totalStudents: 28,
    present: 26,
    absent: 1,
    late: 1,
    rate: 92.9,
    status: "completed" as const,
    markedAt: "08:15 AM",
  },
  {
    id: "att_002",
    className: "Grade 5B",
    teacher: "Mr. Williams",
    date: "2026-01-06",
    totalStudents: 30,
    present: 29,
    absent: 1,
    late: 0,
    rate: 96.7,
    status: "completed" as const,
    markedAt: "08:22 AM",
  },
  {
    id: "att_003",
    className: "Grade 6A",
    teacher: "Mrs. Brown",
    date: "2026-01-06",
    totalStudents: 32,
    present: 30,
    absent: 2,
    late: 0,
    rate: 93.8,
    status: "completed" as const,
    markedAt: "08:30 AM",
  },
  {
    id: "att_004",
    className: "Grade 7A",
    teacher: "Mr. Davis",
    date: "2026-01-06",
    totalStudents: 29,
    present: 27,
    absent: 1,
    late: 1,
    rate: 93.1,
    status: "completed" as const,
    markedAt: "08:18 AM",
  },
  {
    id: "att_005",
    className: "Grade 7B",
    teacher: "Ms. Clark",
    date: "2026-01-06",
    totalStudents: 28,
    present: 0,
    absent: 0,
    late: 0,
    rate: 0,
    status: "pending" as const,
    markedAt: null,
  },
  {
    id: "att_006",
    className: "Grade 8A",
    teacher: "Ms. Miller",
    date: "2026-01-06",
    totalStudents: 31,
    present: 29,
    absent: 1,
    late: 1,
    rate: 93.5,
    status: "completed" as const,
    markedAt: "08:25 AM",
  },
  {
    id: "att_007",
    className: "Grade 8B",
    teacher: "Mr. Thompson",
    date: "2026-01-06",
    totalStudents: 30,
    present: 0,
    absent: 0,
    late: 0,
    rate: 0,
    status: "pending" as const,
    markedAt: null,
  },
  {
    id: "att_008",
    className: "Grade 9A",
    teacher: "Mr. Smith",
    date: "2026-01-06",
    totalStudents: 27,
    present: 25,
    absent: 2,
    late: 0,
    rate: 92.6,
    status: "completed" as const,
    markedAt: "08:35 AM",
  },
  {
    id: "att_009",
    className: "Grade 9B",
    teacher: "Mrs. Lee",
    date: "2026-01-06",
    totalStudents: 28,
    present: 27,
    absent: 0,
    late: 1,
    rate: 96.4,
    status: "completed" as const,
    markedAt: "08:20 AM",
  },
  {
    id: "att_010",
    className: "Grade 10A",
    teacher: "Mrs. Lee",
    date: "2026-01-06",
    totalStudents: 30,
    present: 28,
    absent: 2,
    late: 0,
    rate: 93.3,
    status: "completed" as const,
    markedAt: "09:05 AM",
  },
  {
    id: "att_011",
    className: "Grade 11A",
    teacher: "Mr. Anderson",
    date: "2026-01-06",
    totalStudents: 28,
    present: 0,
    absent: 0,
    late: 0,
    rate: 0,
    status: "pending" as const,
    markedAt: null,
  },
  {
    id: "att_012",
    className: "Grade 12A",
    teacher: "Mrs. White",
    date: "2026-01-06",
    totalStudents: 25,
    present: 24,
    absent: 1,
    late: 0,
    rate: 96.0,
    status: "completed" as const,
    markedAt: "08:40 AM",
  },
];

// ============================================
// Monthly Revenue Trend (for Finance Page)
// ============================================
export const monthlyRevenue = {
  "6M": [
    { month: "Aug", collected: 95000, outstanding: 25000 },
    { month: "Sep", collected: 110000, outstanding: 20000 },
    { month: "Oct", collected: 130000, outstanding: 18000 },
    { month: "Nov", collected: 145000, outstanding: 15000 },
    { month: "Dec", collected: 142000, outstanding: 22000 },
    { month: "Jan", collected: 125000, outstanding: 28000 },
  ],
  "1Y": [
    { month: "Feb", collected: 78000, outstanding: 32000 },
    { month: "Mar", collected: 82000, outstanding: 28000 },
    { month: "Apr", collected: 88000, outstanding: 25000 },
    { month: "May", collected: 91000, outstanding: 22000 },
    { month: "Jun", collected: 60000, outstanding: 18000 },
    { month: "Jul", collected: 45000, outstanding: 15000 },
    { month: "Aug", collected: 95000, outstanding: 25000 },
    { month: "Sep", collected: 110000, outstanding: 20000 },
    { month: "Oct", collected: 130000, outstanding: 18000 },
    { month: "Nov", collected: 145000, outstanding: 15000 },
    { month: "Dec", collected: 142000, outstanding: 22000 },
    { month: "Jan", collected: 125000, outstanding: 28000 },
  ],
  ALL: [
    { month: "2023 Q1", collected: 260000, outstanding: 40000 },
    { month: "Q2", collected: 280000, outstanding: 35000 },
    { month: "Q3", collected: 310000, outstanding: 30000 },
    { month: "Q4", collected: 340000, outstanding: 28000 },
    { month: "2024 Q1", collected: 360000, outstanding: 25000 },
    { month: "Q2", collected: 390000, outstanding: 22000 },
    { month: "Q3", collected: 420000, outstanding: 20000 },
    { month: "Q4", collected: 450000, outstanding: 18000 },
    { month: "2025 Q1", collected: 480000, outstanding: 22000 },
    { month: "Q2", collected: 510000, outstanding: 25000 },
    { month: "Q3", collected: 540000, outstanding: 20000 },
    { month: "2026 Jan", collected: 847500, outstanding: 152500 },
  ],
};

// ============================================
// Upcoming Payment Dues (for Finance Sidebar)
// ============================================
export const upcomingPaymentDues = [
  { id: "due_001", studentName: "Liam Johnson", amount: 2500, dueDate: "2026-02-22", type: "tuition" as const, daysUntil: 3 },
  { id: "due_002", studentName: "Noah Davis", amount: 2500, dueDate: "2026-02-26", type: "tuition" as const, daysUntil: 7 },
  { id: "due_003", studentName: "Charlotte Thomas", amount: 2500, dueDate: "2026-03-03", type: "tuition" as const, daysUntil: 12 },
  { id: "due_004", studentName: "Ethan Miller", amount: 150, dueDate: "2026-03-05", type: "activity" as const, daysUntil: 14 },
  { id: "due_005", studentName: "Isabella Anderson", amount: 75, dueDate: "2026-03-08", type: "supplies" as const, daysUntil: 17 },
];

// ============================================
// Monthly Fee Breakdown by Type (for Finance Charts)
// ============================================
export const monthlyFeeBreakdown = [
  { month: "Sep", tuition: 85000, activity: 15000, supplies: 10000 },
  { month: "Oct", tuition: 100000, activity: 18000, supplies: 12000 },
  { month: "Nov", tuition: 112000, activity: 20000, supplies: 13000 },
  { month: "Dec", tuition: 108000, activity: 22000, supplies: 12000 },
  { month: "Jan", tuition: 95000, activity: 18000, supplies: 12000 },
];

// ============================================
// Weekly Attendance Trends
// ============================================
export const weeklyAttendanceTrends = [
  { date: "Mon, Jan 5", present: 1180, absent: 67, rate: 94.6 },
  { date: "Tue, Jan 6", present: 1172, absent: 52, rate: 94.0 },
  { date: "Wed, Jan 7", present: 0, absent: 0, rate: 0 }, // Future
  { date: "Thu, Jan 8", present: 0, absent: 0, rate: 0 }, // Future
  { date: "Fri, Jan 9", present: 0, absent: 0, rate: 0 }, // Future
];

// ============================================
// Notifications
// ============================================
export const notifications = [
  {
    id: "not_001",
    title: "Fee Payment Reminder",
    message: "23 students have overdue fee payments",
    type: "warning" as const,
    category: "finance" as const,
    priority: "high" as const,
    read: false,
    timestamp: "2026-02-19T08:00:00",
    actionUrl: "/school-admin/finances",
  },
  {
    id: "not_002",
    title: "New Enrollment Request",
    message: "5 new enrollment applications pending review",
    type: "info" as const,
    category: "admissions" as const,
    priority: "normal" as const,
    read: false,
    timestamp: "2026-02-19T07:15:00",
    actionUrl: "/school-admin/admissions",
  },
  {
    id: "not_003",
    title: "System Update",
    message: "Schoolnify will be updated tonight at 2 AM",
    type: "info" as const,
    category: "system" as const,
    priority: "low" as const,
    read: true,
    timestamp: "2026-02-18T18:00:00",
  },
  {
    id: "not_004",
    title: "Discipline Incident Escalated",
    message: "Incident DI-009 has been escalated. vandalism case requires immediate attention",
    type: "warning" as const,
    category: "discipline" as const,
    priority: "urgent" as const,
    read: false,
    timestamp: "2026-02-19T09:30:00",
    actionUrl: "/school-admin/discipline",
  },
  {
    id: "not_005",
    title: "Term 2 Timetable Published",
    message: "The Term 2 exam timetable has been published for all grades",
    type: "info" as const,
    category: "academic" as const,
    priority: "normal" as const,
    read: true,
    timestamp: "2026-02-18T14:00:00",
    actionUrl: "/school-admin/academics",
  },
  {
    id: "not_006",
    title: "Bus Route 3 Delayed",
    message: "Route 3 (Lekki Express) is running 20 minutes late due to traffic",
    type: "warning" as const,
    category: "transport" as const,
    priority: "high" as const,
    read: false,
    timestamp: "2026-02-19T07:45:00",
    actionUrl: "/school-admin/transport",
  },
  {
    id: "not_007",
    title: "Allergy Alert. New Student",
    message: "Newly enrolled student Amara Obi has severe peanut allergy. cafeteria notified",
    type: "warning" as const,
    category: "health" as const,
    priority: "urgent" as const,
    read: false,
    timestamp: "2026-02-19T08:30:00",
    actionUrl: "/school-admin/health",
  },
  {
    id: "not_008",
    title: "Staff Leave Approved",
    message: "Emeka Nwankwo's personal leave for Feb 20 has been approved",
    type: "info" as const,
    category: "academic" as const,
    priority: "low" as const,
    read: true,
    timestamp: "2026-02-18T16:30:00",
  },
  {
    id: "not_009",
    title: "Hostel Maintenance Request",
    message: "Block A, Room 104 reported plumbing issue. maintenance scheduled",
    type: "info" as const,
    category: "system" as const,
    priority: "normal" as const,
    read: true,
    timestamp: "2026-02-18T10:00:00",
    actionUrl: "/school-admin/hostel",
  },
  {
    id: "not_010",
    title: "Performance Reviews Due",
    message: "Term 1 performance reviews for 4 staff members are pending submission",
    type: "warning" as const,
    category: "academic" as const,
    priority: "normal" as const,
    read: false,
    timestamp: "2026-02-17T09:00:00",
  },
  {
    id: "not_011",
    title: "Sub-Admin Invite Pending",
    message: "Samuel Appiah hasn't accepted the HR Administrator invitation. resend?",
    type: "info" as const,
    category: "system" as const,
    priority: "low" as const,
    read: true,
    timestamp: "2026-02-16T11:00:00",
    actionUrl: "/school-admin/sub-admins",
  },
  {
    id: "not_012",
    title: "Immunization Records Overdue",
    message: "3 students have incomplete immunization records that need updating",
    type: "warning" as const,
    category: "health" as const,
    priority: "high" as const,
    read: false,
    timestamp: "2026-02-17T14:00:00",
    actionUrl: "/school-admin/health",
  },
  {
    id: "not_013",
    title: "Transport Fees Overdue",
    message: "8 students have overdue transport fee payments for February",
    type: "warning" as const,
    category: "transport" as const,
    priority: "normal" as const,
    read: true,
    timestamp: "2026-02-15T09:00:00",
    actionUrl: "/school-admin/transport",
  },
  {
    id: "not_014",
    title: "New Document Uploaded",
    message: "PTA Meeting Minutes. February 2026 uploaded by Ngozi Ibe",
    type: "info" as const,
    category: "system" as const,
    priority: "low" as const,
    read: true,
    timestamp: "2026-02-15T13:00:00",
    actionUrl: "/school-admin/documents",
  },
  {
    id: "not_015",
    title: "Admissions Target Reached",
    message: "Grade 7 enrollment has reached 95% of target capacity",
    type: "info" as const,
    category: "admissions" as const,
    priority: "normal" as const,
    read: true,
    timestamp: "2026-02-14T16:00:00",
    actionUrl: "/school-admin/admissions",
  },
];

// ============================================
// Staff Conversations (Internal Messaging)
// ============================================
export const staffConversations = [
  {
    id: "sc_001",
    participants: [
      { id: "usr_001", name: "Admin User", role: "Admin" },
      { id: "usr_williams", name: "Principal Williams", role: "Staff" },
    ],
    messages: [
      {
        id: "sm_001a",
        senderId: "usr_williams",
        content:
          "Reminder: We have a mandatory staff meeting this Friday at 3:30 PM in the main conference room.",
        timestamp: "2026-01-04T14:00:00",
        read: true,
      },
      {
        id: "sm_001b",
        senderId: "usr_001",
        content:
          "Got it. Should I prepare the enrollment report for the meeting?",
        timestamp: "2026-01-04T14:30:00",
        read: true,
      },
      {
        id: "sm_001c",
        senderId: "usr_williams",
        content:
          "Yes, that would be great. Please include the Q4 comparison as well. Also, bring the budget proposal draft if it's ready.",
        timestamp: "2026-01-04T15:15:00",
        read: true,
      },
    ],
    lastMessageAt: "2026-01-04T15:15:00",
    unreadCount: 0,
    pinned: true,
  },
  {
    id: "sc_002",
    participants: [
      { id: "usr_001", name: "Admin User", role: "Admin" },
      { id: "usr_smith", name: "Mr. Smith", role: "Teacher" },
    ],
    messages: [
      {
        id: "sm_002a",
        senderId: "usr_smith",
        content:
          "The midterm exams for Grade 9 have been rescheduled to next Wednesday. I've already informed the students.",
        timestamp: "2026-01-06T09:15:00",
        read: false,
      },
      {
        id: "sm_002b",
        senderId: "usr_smith",
        content:
          "Could you help arrange an extra classroom for the exam? Room 204 might not be large enough for all 35 students.",
        timestamp: "2026-01-06T09:18:00",
        read: false,
      },
    ],
    lastMessageAt: "2026-01-06T09:18:00",
    unreadCount: 2,
    pinned: false,
  },
  {
    id: "sc_003",
    participants: [
      { id: "usr_001", name: "Admin User", role: "Admin" },
      { id: "usr_it", name: "IT Support", role: "Staff" },
    ],
    messages: [
      {
        id: "sm_003a",
        senderId: "usr_it",
        content:
          "The school management system will undergo maintenance on Saturday from 10 PM to 2 AM.",
        timestamp: "2026-01-03T16:30:00",
        read: true,
      },
      {
        id: "sm_003b",
        senderId: "usr_001",
        content:
          "Thanks for the heads up. Will the parent portal be affected?",
        timestamp: "2026-01-03T16:45:00",
        read: true,
      },
      {
        id: "sm_003c",
        senderId: "usr_it",
        content:
          "Yes, the parent portal will also be briefly unavailable. We'll send a notification to all parents beforehand.",
        timestamp: "2026-01-03T17:00:00",
        read: true,
      },
    ],
    lastMessageAt: "2026-01-03T17:00:00",
    unreadCount: 0,
    pinned: false,
  },
  {
    id: "sc_004",
    participants: [
      { id: "usr_001", name: "Admin User", role: "Admin" },
      { id: "usr_clark", name: "Ms. Clark", role: "Teacher" },
    ],
    messages: [
      {
        id: "sm_004a",
        senderId: "usr_clark",
        content:
          "The science fair projects are coming along nicely. We have 15 entries this year! Could we use the gymnasium for the display on the 20th?",
        timestamp: "2026-01-06T15:00:00",
        read: false,
      },
    ],
    lastMessageAt: "2026-01-06T15:00:00",
    unreadCount: 1,
    pinned: false,
  },
  {
    id: "sc_005",
    participants: [
      { id: "usr_001", name: "Admin User", role: "Admin" },
      { id: "usr_johnson", name: "Mrs. Johnson", role: "Teacher" },
    ],
    messages: [
      {
        id: "sm_005a",
        senderId: "usr_johnson",
        content:
          "Hi! I wanted to discuss the new curriculum changes for Grade 3. When would be a good time to chat?",
        timestamp: "2026-01-05T10:00:00",
        read: true,
      },
      {
        id: "sm_005b",
        senderId: "usr_001",
        content:
          "How about Thursday at 11 AM? We can meet in my office.",
        timestamp: "2026-01-05T10:30:00",
        read: true,
      },
    ],
    lastMessageAt: "2026-01-05T10:30:00",
    unreadCount: 0,
    pinned: false,
  },
];

// ============================================
// Current User (School Admin)
// ============================================
export const currentUser = {
  id: "usr_001",
  firstName: "Admin",
  lastName: "User",
  email: "admin@greenwoodacademy.edu",
  role: "School Administrator",
  avatar: null,
  school: schoolInfo,
  permissions: [
    "manage_students",
    "manage_staff",
    "manage_classes",
    "view_finances",
    "manage_attendance",
    "send_notifications",
    "manage_settings",
  ],
};

// ============================================
// Academic Terms
// ============================================
export const academicTerms = [
  {
    id: "term_001",
    name: "First Term",
    startDate: "2025-09-08",
    endDate: "2025-12-19",
    isCurrent: false,
  },
  {
    id: "term_002",
    name: "Second Term",
    startDate: "2026-01-05",
    endDate: "2026-04-10",
    isCurrent: true,
  },
  {
    id: "term_003",
    name: "Third Term",
    startDate: "2026-04-27",
    endDate: "2026-07-17",
    isCurrent: false,
  },
];

// ============================================
// School Events (Calendar)
// ============================================
export const schoolEvents = [
  {
    id: "evt_001",
    title: "Parent-Teacher Conference",
    date: "2026-02-20",
    time: "09:00 AM - 03:00 PM",
    category: "academic" as const,
    description: "Mid-year parent-teacher conference for all grades. Parents can book 15-minute slots with teachers.",
    location: "Main Hall",
  },
  {
    id: "evt_002",
    title: "Mid-Term Examinations",
    date: "2026-03-02",
    endDate: "2026-03-06",
    time: "08:00 AM - 12:00 PM",
    category: "academic" as const,
    description: "Mid-term examinations for all grades. Revised timetable in effect.",
    location: "Exam Halls",
  },
  {
    id: "evt_003",
    title: "Science Fair",
    date: "2026-03-20",
    time: "10:00 AM - 04:00 PM",
    category: "academic" as const,
    description: "Annual science fair showcasing student projects from Grade 5-12.",
    location: "Gymnasium",
  },
  {
    id: "evt_004",
    title: "Inter-House Sports Day",
    date: "2026-02-28",
    time: "08:00 AM - 05:00 PM",
    category: "sports" as const,
    description: "Annual inter-house athletics competition. All students participate.",
    location: "Sports Ground",
  },
  {
    id: "evt_005",
    title: "Swimming Gala",
    date: "2026-03-14",
    time: "09:00 AM - 01:00 PM",
    category: "sports" as const,
    description: "Inter-house swimming competition for qualified swimmers.",
    location: "School Pool",
  },
  {
    id: "evt_006",
    title: "Athletics Day",
    date: "2026-04-03",
    time: "08:00 AM - 04:00 PM",
    category: "sports" as const,
    description: "Track and field events for all grade levels.",
    location: "Sports Ground",
  },
  {
    id: "evt_007",
    title: "Cultural Day Celebration",
    date: "2026-03-25",
    time: "10:00 AM - 02:00 PM",
    category: "cultural" as const,
    description: "Students showcase cultural heritage through performances, food, and art.",
    location: "Main Hall & Courtyard",
  },
  {
    id: "evt_008",
    title: "Art Exhibition",
    date: "2026-04-10",
    time: "11:00 AM - 03:00 PM",
    category: "cultural" as const,
    description: "Student art exhibition showcasing works from the art department.",
    location: "Art Studio & Gallery",
  },
  {
    id: "evt_009",
    title: "Staff Meeting",
    date: "2026-02-21",
    time: "03:30 PM - 05:00 PM",
    category: "meeting" as const,
    description: "Monthly all-staff meeting to discuss academic progress and upcoming events.",
    location: "Conference Room",
  },
  {
    id: "evt_010",
    title: "Board of Governors Meeting",
    date: "2026-03-10",
    time: "02:00 PM - 04:00 PM",
    category: "meeting" as const,
    description: "Quarterly board meeting to review school performance and budget.",
    location: "Board Room",
  },
  {
    id: "evt_011",
    title: "Mid-Term Break",
    date: "2026-03-07",
    endDate: "2026-03-13",
    time: "All Day",
    category: "holiday" as const,
    description: "One-week mid-term break. School resumes on March 14.",
  },
  {
    id: "evt_012",
    title: "Public Holiday - Independence Day",
    date: "2026-03-01",
    time: "All Day",
    category: "holiday" as const,
    description: "National independence day. School closed.",
  },
];

// ============================================
// Admission Applications
// ============================================
export const admissionApplications = [
  {
    id: "app_001",
    trackingCode: "GA-2026-0001",
    studentName: "James Okonkwo",
    email: "james.ok@email.com",
    phone: "+234 801 234 5678",
    grade: "Grade 9",
    appliedDate: "2026-01-15",
    status: "inquiry" as const,
    parentName: "Mr. David Okonkwo",
    parentEmail: "david.ok@email.com",
    previousSchool: "Lagos International School",
    documents: ["birth_certificate"],
    notes: "Interested in the science program",
    statusHistory: [
      { status: "inquiry" as const, date: "2026-01-15", note: "Initial inquiry. parent visited campus" },
    ],
  },
  {
    id: "app_002",
    trackingCode: "GA-2026-0002",
    studentName: "Fatima Hassan",
    email: "fatima.h@email.com",
    phone: "+234 802 345 6789",
    grade: "Grade 7",
    appliedDate: "2026-01-18",
    status: "inquiry" as const,
    parentName: "Mrs. Aisha Hassan",
    parentEmail: "aisha.h@email.com",
    previousSchool: "Abuja Model School",
    documents: [],
    notes: "Relocating from Abuja",
    statusHistory: [
      { status: "inquiry" as const, date: "2026-01-18", note: "Phone inquiry. relocating family" },
    ],
  },
  {
    id: "app_003",
    trackingCode: "GA-2026-0003",
    studentName: "Chidi Nwankwo",
    email: "chidi.n@email.com",
    phone: "+234 803 456 7890",
    grade: "Grade 10",
    appliedDate: "2026-01-10",
    status: "applied" as const,
    parentName: "Dr. Emeka Nwankwo",
    parentEmail: "emeka.n@email.com",
    previousSchool: "Federal Government College",
    documents: ["birth_certificate", "transcript", "recommendation"],
    statusHistory: [
      { status: "applied" as const, date: "2026-01-10", note: "Application submitted online. documents received" },
    ],
  },
  {
    id: "app_004",
    trackingCode: "GA-2026-0004",
    studentName: "Amara Eze",
    email: "amara.e@email.com",
    phone: "+234 804 567 8901",
    grade: "Grade 8",
    appliedDate: "2026-01-12",
    status: "under_review" as const,
    parentName: "Mr. Kenneth Eze",
    parentEmail: "kenneth.e@email.com",
    previousSchool: "Greenfield Academy",
    documents: ["birth_certificate", "transcript"],
    statusHistory: [
      { status: "inquiry" as const, date: "2026-01-08", note: "Campus tour" },
      { status: "applied" as const, date: "2026-01-12", note: "Application submitted. recommendation pending" },
      { status: "under_review" as const, date: "2026-01-14", note: "Admin started reviewing application" },
    ],
  },
  {
    id: "app_005",
    trackingCode: "GA-2026-0005",
    studentName: "Yusuf Bello",
    email: "yusuf.b@email.com",
    phone: "+234 805 678 9012",
    grade: "Grade 11",
    appliedDate: "2026-01-08",
    status: "under_review" as const,
    parentName: "Alhaji Bello",
    parentEmail: "bello@email.com",
    previousSchool: "Kaduna Academy",
    documents: ["birth_certificate", "transcript", "recommendation"],
    notes: "Strong in mathematics",
    statusHistory: [
      { status: "inquiry" as const, date: "2026-01-02", note: "Referred by alumni parent" },
      { status: "applied" as const, date: "2026-01-08", note: "Full application with documents" },
      { status: "under_review" as const, date: "2026-01-10", note: "Documents verified. under academic review" },
    ],
  },
  {
    id: "app_006",
    trackingCode: "GA-2026-0006",
    studentName: "Ngozi Adeyemi",
    email: "ngozi.a@email.com",
    phone: "+234 806 789 0123",
    grade: "Grade 9",
    appliedDate: "2026-01-05",
    status: "under_review" as const,
    parentName: "Chief Adeyemi",
    parentEmail: "chief.a@email.com",
    previousSchool: "Ibadan Grammar School",
    documents: ["birth_certificate", "transcript", "recommendation", "medical_report"],
    statusHistory: [
      { status: "inquiry" as const, date: "2025-12-20", note: "Campus visit" },
      { status: "applied" as const, date: "2026-01-05", note: "Application submitted" },
      { status: "under_review" as const, date: "2026-01-07", note: "Under academic review" },
    ],
  },
  {
    id: "app_007",
    trackingCode: "GA-2026-0007",
    studentName: "Kemi Oladipo",
    email: "kemi.o@email.com",
    phone: "+234 807 890 1234",
    grade: "Grade 7",
    appliedDate: "2026-01-03",
    status: "under_review" as const,
    parentName: "Mrs. Funke Oladipo",
    parentEmail: "funke.o@email.com",
    previousSchool: "Christ the King College",
    documents: ["birth_certificate", "transcript", "recommendation"],
    notes: "Scheduled for entrance exam on Feb 25",
    statusHistory: [
      { status: "inquiry" as const, date: "2025-12-18", note: "Online inquiry" },
      { status: "applied" as const, date: "2026-01-03", note: "Application submitted" },
      { status: "under_review" as const, date: "2026-01-06", note: "Entrance exam scheduled for Feb 25" },
    ],
  },
  {
    id: "app_008",
    trackingCode: "GA-2026-0008",
    studentName: "Emeka Obi",
    email: "emeka.obi@email.com",
    phone: "+234 808 901 2345",
    grade: "Grade 10",
    appliedDate: "2025-12-20",
    status: "accepted" as const,
    parentName: "Mr. Obi Senior",
    parentEmail: "obi.sr@email.com",
    previousSchool: "Enugu State Secondary",
    documents: ["birth_certificate", "transcript", "recommendation", "medical_report"],
    notes: "Accepted. awaiting fee payment",
    statusHistory: [
      { status: "inquiry" as const, date: "2025-12-10", note: "Parent inquiry" },
      { status: "applied" as const, date: "2025-12-20", note: "Application submitted" },
      { status: "under_review" as const, date: "2025-12-22", note: "Documents verified. under review" },
      { status: "accepted" as const, date: "2026-01-15", note: "Admission offer sent" },
    ],
  },
  {
    id: "app_009",
    trackingCode: "GA-2026-0009",
    studentName: "Aisha Musa",
    email: "aisha.m@email.com",
    phone: "+234 809 012 3456",
    grade: "Grade 8",
    appliedDate: "2025-12-15",
    status: "accepted" as const,
    parentName: "Hajia Musa",
    parentEmail: "hajia.m@email.com",
    previousSchool: "Kano Academy",
    documents: ["birth_certificate", "transcript", "recommendation", "medical_report"],
    statusHistory: [
      { status: "inquiry" as const, date: "2025-12-05", note: "Phone inquiry" },
      { status: "applied" as const, date: "2025-12-15", note: "Application submitted" },
      { status: "under_review" as const, date: "2025-12-18", note: "Academic records reviewed" },
      { status: "accepted" as const, date: "2026-01-10", note: "Admission offer sent" },
    ],
  },
  {
    id: "app_010",
    trackingCode: "GA-2026-0010",
    studentName: "Tunde Bakare",
    email: "tunde.b@email.com",
    phone: "+234 810 123 4567",
    grade: "Grade 9",
    appliedDate: "2025-12-10",
    status: "accepted" as const,
    parentName: "Pastor Bakare",
    parentEmail: "bakare@email.com",
    previousSchool: "Redeemers International",
    documents: ["birth_certificate", "transcript", "recommendation", "medical_report"],
    notes: "Scholarship candidate",
    statusHistory: [
      { status: "inquiry" as const, date: "2025-11-25", note: "Scholarship inquiry" },
      { status: "applied" as const, date: "2025-12-10", note: "Scholarship application submitted" },
      { status: "under_review" as const, date: "2025-12-15", note: "Committee review in progress" },
      { status: "accepted" as const, date: "2026-01-08", note: "Accepted with partial scholarship" },
    ],
  },
  {
    id: "app_011",
    trackingCode: "GA-2026-0011",
    studentName: "Chiamaka Udo",
    email: "chiamaka.u@email.com",
    phone: "+234 811 234 5678",
    grade: "Grade 7",
    appliedDate: "2025-11-28",
    status: "enrolled" as const,
    parentName: "Mrs. Udo",
    parentEmail: "udo@email.com",
    previousSchool: "Port Harcourt International",
    documents: ["birth_certificate", "transcript", "recommendation", "medical_report"],
    statusHistory: [
      { status: "inquiry" as const, date: "2025-11-10", note: "Campus visit" },
      { status: "applied" as const, date: "2025-11-28", note: "Application submitted" },
      { status: "under_review" as const, date: "2025-12-01", note: "Documents reviewed" },
      { status: "accepted" as const, date: "2025-12-20", note: "Admission offered" },
      { status: "enrolled" as const, date: "2026-01-05", note: "Fees paid. enrolled in Grade 7B" },
    ],
  },
  {
    id: "app_012",
    trackingCode: "GA-2026-0012",
    studentName: "Ibrahim Sule",
    email: "ibrahim.s@email.com",
    phone: "+234 812 345 6789",
    grade: "Grade 11",
    appliedDate: "2025-11-20",
    status: "enrolled" as const,
    parentName: "Mr. Sule",
    parentEmail: "sule@email.com",
    previousSchool: "Jos Academy",
    documents: ["birth_certificate", "transcript", "recommendation", "medical_report"],
    statusHistory: [
      { status: "inquiry" as const, date: "2025-11-05", note: "Online inquiry" },
      { status: "applied" as const, date: "2025-11-20", note: "Application submitted" },
      { status: "under_review" as const, date: "2025-11-25", note: "Entrance exam completed. under review" },
      { status: "accepted" as const, date: "2025-12-15", note: "Admission offered" },
      { status: "enrolled" as const, date: "2026-01-05", note: "Fees paid. enrolled in Grade 11A" },
    ],
  },
];

// ============================================
// Subjects (Academic Configuration)
// ============================================
export const subjects = [
  { id: "sub_001", name: "Mathematics", code: "MATH", department: "Mathematics", teachers: ["Mr. Smith", "Mrs. Johnson"], grades: ["Grade 7", "Grade 8", "Grade 9", "Grade 10", "Grade 11", "Grade 12"] },
  { id: "sub_002", name: "English Language", code: "ENG", department: "Languages", teachers: ["Mrs. White", "Mr. Brown"], grades: ["Grade 7", "Grade 8", "Grade 9", "Grade 10", "Grade 11", "Grade 12"] },
  { id: "sub_003", name: "Physics", code: "PHY", department: "Science", teachers: ["Mr. Smith"], grades: ["Grade 10", "Grade 11", "Grade 12"] },
  { id: "sub_004", name: "Chemistry", code: "CHEM", department: "Science", teachers: ["Dr. Adams"], grades: ["Grade 10", "Grade 11", "Grade 12"] },
  { id: "sub_005", name: "Biology", code: "BIO", department: "Science", teachers: ["Ms. Clark"], grades: ["Grade 9", "Grade 10", "Grade 11", "Grade 12"] },
  { id: "sub_006", name: "History", code: "HIST", department: "Arts", teachers: ["Mr. Brown"], grades: ["Grade 7", "Grade 8", "Grade 9", "Grade 10"] },
  { id: "sub_007", name: "Geography", code: "GEO", department: "Arts", teachers: ["Mrs. Johnson"], grades: ["Grade 7", "Grade 8", "Grade 9", "Grade 10"] },
  { id: "sub_008", name: "Computer Science", code: "CS", department: "Science", teachers: ["Mr. Davies"], grades: ["Grade 9", "Grade 10", "Grade 11", "Grade 12"] },
  { id: "sub_009", name: "French", code: "FRN", department: "Languages", teachers: ["Mme. Laurent"], grades: ["Grade 7", "Grade 8", "Grade 9"] },
  { id: "sub_010", name: "Art & Design", code: "ART", department: "Arts", teachers: ["Ms. Okafor"], grades: ["Grade 7", "Grade 8", "Grade 9", "Grade 10"] },
  { id: "sub_011", name: "Physical Education", code: "PE", department: "Arts", teachers: ["Coach Williams"], grades: ["Grade 7", "Grade 8", "Grade 9", "Grade 10", "Grade 11", "Grade 12"] },
  { id: "sub_012", name: "Economics", code: "ECON", department: "Arts", teachers: ["Mr. Osei"], grades: ["Grade 10", "Grade 11", "Grade 12"] },
  { id: "sub_013", name: "Further Mathematics", code: "FMATH", department: "Mathematics", teachers: ["Mr. Smith"], grades: ["Grade 11", "Grade 12"] },
  { id: "sub_014", name: "Literature in English", code: "LIT", department: "Languages", teachers: ["Mrs. White"], grades: ["Grade 10", "Grade 11", "Grade 12"] },
  { id: "sub_015", name: "Civic Education", code: "CIV", department: "Arts", teachers: ["Mr. Brown"], grades: ["Grade 7", "Grade 8", "Grade 9"] },
];

// ============================================
// Timetable Slots (Sample for Grade 10A)
// ============================================
export const timetableSlots = [
  { id: "ts_001", classId: "cls_001", className: "Grade 10A", day: "Monday", period: 1, subject: "Mathematics", teacher: "Mr. Smith", time: "08:00 - 08:45" },
  { id: "ts_002", classId: "cls_001", className: "Grade 10A", day: "Monday", period: 2, subject: "English Language", teacher: "Mrs. White", time: "08:45 - 09:30" },
  { id: "ts_003", classId: "cls_001", className: "Grade 10A", day: "Monday", period: 3, subject: "Physics", teacher: "Mr. Smith", time: "09:45 - 10:30" },
  { id: "ts_004", classId: "cls_001", className: "Grade 10A", day: "Monday", period: 4, subject: "Chemistry", teacher: "Dr. Adams", time: "10:30 - 11:15" },
  { id: "ts_005", classId: "cls_001", className: "Grade 10A", day: "Monday", period: 5, subject: "Biology", teacher: "Ms. Clark", time: "11:30 - 12:15" },
  { id: "ts_006", classId: "cls_001", className: "Grade 10A", day: "Monday", period: 6, subject: "Computer Science", teacher: "Mr. Davies", time: "12:15 - 01:00" },
  { id: "ts_007", classId: "cls_001", className: "Grade 10A", day: "Tuesday", period: 1, subject: "English Language", teacher: "Mrs. White", time: "08:00 - 08:45" },
  { id: "ts_008", classId: "cls_001", className: "Grade 10A", day: "Tuesday", period: 2, subject: "Mathematics", teacher: "Mr. Smith", time: "08:45 - 09:30" },
  { id: "ts_009", classId: "cls_001", className: "Grade 10A", day: "Tuesday", period: 3, subject: "History", teacher: "Mr. Brown", time: "09:45 - 10:30" },
  { id: "ts_010", classId: "cls_001", className: "Grade 10A", day: "Tuesday", period: 4, subject: "Geography", teacher: "Mrs. Johnson", time: "10:30 - 11:15" },
  { id: "ts_011", classId: "cls_001", className: "Grade 10A", day: "Tuesday", period: 5, subject: "Art & Design", teacher: "Ms. Okafor", time: "11:30 - 12:15" },
  { id: "ts_012", classId: "cls_001", className: "Grade 10A", day: "Tuesday", period: 6, subject: "Physical Education", teacher: "Coach Williams", time: "12:15 - 01:00" },
  { id: "ts_013", classId: "cls_001", className: "Grade 10A", day: "Wednesday", period: 1, subject: "Physics", teacher: "Mr. Smith", time: "08:00 - 08:45" },
  { id: "ts_014", classId: "cls_001", className: "Grade 10A", day: "Wednesday", period: 2, subject: "Chemistry", teacher: "Dr. Adams", time: "08:45 - 09:30" },
  { id: "ts_015", classId: "cls_001", className: "Grade 10A", day: "Wednesday", period: 3, subject: "Mathematics", teacher: "Mr. Smith", time: "09:45 - 10:30" },
  { id: "ts_016", classId: "cls_001", className: "Grade 10A", day: "Wednesday", period: 4, subject: "English Language", teacher: "Mrs. White", time: "10:30 - 11:15" },
  { id: "ts_017", classId: "cls_001", className: "Grade 10A", day: "Wednesday", period: 5, subject: "Economics", teacher: "Mr. Osei", time: "11:30 - 12:15" },
  { id: "ts_018", classId: "cls_001", className: "Grade 10A", day: "Wednesday", period: 6, subject: "Literature in English", teacher: "Mrs. White", time: "12:15 - 01:00" },
  { id: "ts_019", classId: "cls_001", className: "Grade 10A", day: "Thursday", period: 1, subject: "Biology", teacher: "Ms. Clark", time: "08:00 - 08:45" },
  { id: "ts_020", classId: "cls_001", className: "Grade 10A", day: "Thursday", period: 2, subject: "Computer Science", teacher: "Mr. Davies", time: "08:45 - 09:30" },
  { id: "ts_021", classId: "cls_001", className: "Grade 10A", day: "Thursday", period: 3, subject: "Mathematics", teacher: "Mr. Smith", time: "09:45 - 10:30" },
  { id: "ts_022", classId: "cls_001", className: "Grade 10A", day: "Thursday", period: 4, subject: "Physics", teacher: "Mr. Smith", time: "10:30 - 11:15" },
  { id: "ts_023", classId: "cls_001", className: "Grade 10A", day: "Thursday", period: 5, subject: "English Language", teacher: "Mrs. White", time: "11:30 - 12:15" },
  { id: "ts_024", classId: "cls_001", className: "Grade 10A", day: "Thursday", period: 6, subject: "Civic Education", teacher: "Mr. Brown", time: "12:15 - 01:00" },
  { id: "ts_025", classId: "cls_001", className: "Grade 10A", day: "Friday", period: 1, subject: "Chemistry", teacher: "Dr. Adams", time: "08:00 - 08:45" },
  { id: "ts_026", classId: "cls_001", className: "Grade 10A", day: "Friday", period: 2, subject: "Biology", teacher: "Ms. Clark", time: "08:45 - 09:30" },
  { id: "ts_027", classId: "cls_001", className: "Grade 10A", day: "Friday", period: 3, subject: "Geography", teacher: "Mrs. Johnson", time: "09:45 - 10:30" },
  { id: "ts_028", classId: "cls_001", className: "Grade 10A", day: "Friday", period: 4, subject: "History", teacher: "Mr. Brown", time: "10:30 - 11:15" },
  { id: "ts_029", classId: "cls_001", className: "Grade 10A", day: "Friday", period: 5, subject: "Physical Education", teacher: "Coach Williams", time: "11:30 - 12:15" },
  { id: "ts_030", classId: "cls_001", className: "Grade 10A", day: "Friday", period: 6, subject: "Art & Design", teacher: "Ms. Okafor", time: "12:15 - 01:00" },
];

// ============================================
// Promotion Rules
// ============================================
export const promotionRules = [
  { id: "pr_001", fromGrade: "Grade 7", toGrade: "Grade 8", minAttendance: 75, minGPA: 1.5, autoPromote: true },
  { id: "pr_002", fromGrade: "Grade 8", toGrade: "Grade 9", minAttendance: 75, minGPA: 1.5, autoPromote: true },
  { id: "pr_003", fromGrade: "Grade 9", toGrade: "Grade 10", minAttendance: 80, minGPA: 2.0, autoPromote: false },
  { id: "pr_004", fromGrade: "Grade 10", toGrade: "Grade 11", minAttendance: 80, minGPA: 2.0, autoPromote: false },
  { id: "pr_005", fromGrade: "Grade 11", toGrade: "Grade 12", minAttendance: 85, minGPA: 2.5, autoPromote: false },
];

// ============================================
// Discipline & Behavior
// ============================================
export const disciplineIncidents = [
  {
    id: "di_001",
    studentName: "James Okafor",
    grade: "Grade 10A",
    date: "2026-02-17",
    type: "behavioral" as const,
    severity: "moderate" as const,
    status: "open" as const,
    description: "Disruptive behavior during Chemistry class. Repeatedly interrupted the teacher and refused to follow instructions.",
    location: "Chemistry Lab",
    reportedBy: "Dr. Adams",
    actionTaken: "",
    parentNotified: false,
  },
  {
    id: "di_002",
    studentName: "Amina Bello",
    grade: "Grade 11B",
    date: "2026-02-15",
    type: "attendance" as const,
    severity: "minor" as const,
    status: "resolved" as const,
    description: "Arrived 45 minutes late to school without prior notification. Third late arrival this month.",
    location: "Main Gate",
    reportedBy: "Mr. Brown",
    actionTaken: "Verbal warning issued. Parent meeting scheduled.",
    parentNotified: true,
  },
  {
    id: "di_003",
    studentName: "Chidi Eze",
    grade: "Grade 9A",
    date: "2026-02-14",
    type: "bullying" as const,
    severity: "major" as const,
    status: "in_progress" as const,
    description: "Reported for intimidating a junior student in the cafeteria. Multiple witnesses confirmed the incident.",
    location: "Cafeteria",
    reportedBy: "Mrs. Johnson",
    actionTaken: "Student separated from victim. Investigation ongoing.",
    parentNotified: true,
  },
  {
    id: "di_004",
    studentName: "Sarah Mensah",
    grade: "Grade 12A",
    date: "2026-02-13",
    type: "academic" as const,
    severity: "moderate" as const,
    status: "resolved" as const,
    description: "Caught using unauthorized notes during a Biology test.",
    location: "Exam Hall",
    reportedBy: "Ms. Clark",
    actionTaken: "Test invalidated. Student to retake under supervision. Academic integrity warning issued.",
    parentNotified: true,
  },
  {
    id: "di_005",
    studentName: "Kwame Asante",
    grade: "Grade 10B",
    date: "2026-02-12",
    type: "property" as const,
    severity: "minor" as const,
    status: "resolved" as const,
    description: "Accidentally damaged a laboratory microscope during practical session.",
    location: "Biology Lab",
    reportedBy: "Ms. Clark",
    actionTaken: "Parent informed about replacement cost. Student reminded of lab safety rules.",
    parentNotified: true,
  },
  {
    id: "di_006",
    studentName: "Fatima Abdullahi",
    grade: "Grade 8A",
    date: "2026-02-11",
    type: "behavioral" as const,
    severity: "minor" as const,
    status: "resolved" as const,
    description: "Using mobile phone during class hours in violation of school policy.",
    location: "Classroom 8A",
    reportedBy: "Mr. Osei",
    actionTaken: "Phone confiscated until end of day. Written warning issued.",
    parentNotified: false,
  },
  {
    id: "di_007",
    studentName: "Daniel Okonkwo",
    grade: "Grade 11A",
    date: "2026-02-10",
    type: "behavioral" as const,
    severity: "major" as const,
    status: "escalated" as const,
    description: "Involved in a physical altercation with another student during break time. Both students sustained minor injuries.",
    location: "School Yard",
    reportedBy: "Coach Williams",
    actionTaken: "Both students suspended for 3 days. Mandatory counseling sessions arranged.",
    parentNotified: true,
  },
  {
    id: "di_008",
    studentName: "Grace Adeyemi",
    grade: "Grade 7B",
    date: "2026-02-09",
    type: "attendance" as const,
    severity: "moderate" as const,
    status: "in_progress" as const,
    description: "Absent for 5 consecutive days without any communication from parents.",
    location: "N/A",
    reportedBy: "Mrs. White",
    actionTaken: "Multiple calls made to parents. Home visit scheduled.",
    parentNotified: false,
  },
  {
    id: "di_009",
    studentName: "Emmanuel Nwosu",
    grade: "Grade 10A",
    date: "2026-02-07",
    type: "property" as const,
    severity: "critical" as const,
    status: "escalated" as const,
    description: "Vandalized school property. graffiti on classroom walls and damaged furniture.",
    location: "Classroom 10A",
    reportedBy: "Mr. Davies",
    actionTaken: "Student suspended pending disciplinary hearing. Parents summoned for emergency meeting.",
    parentNotified: true,
  },
  {
    id: "di_010",
    studentName: "Aisha Mohammed",
    grade: "Grade 9B",
    date: "2026-02-05",
    type: "academic" as const,
    severity: "minor" as const,
    status: "resolved" as const,
    description: "Failed to submit homework assignments for 3 consecutive weeks in Mathematics.",
    location: "Classroom 9B",
    reportedBy: "Mr. Smith",
    actionTaken: "After-school study sessions arranged. Progress monitoring plan created.",
    parentNotified: true,
  },
];

// ============================================
// Staff Leave Management
// ============================================
export const staffLeaveRequests = [
  {
    id: "lr_001",
    staffId: "stf_001",
    staffName: "Adebayo Johnson",
    type: "annual" as const,
    startDate: "2026-03-15",
    endDate: "2026-03-22",
    days: 5,
    status: "pending" as const,
    reason: "Family vacation during mid-term break",
    appliedDate: "2026-02-10",
  },
  {
    id: "lr_002",
    staffId: "stf_003",
    staffName: "Chioma Okafor",
    type: "sick" as const,
    startDate: "2026-02-12",
    endDate: "2026-02-14",
    days: 3,
    status: "approved" as const,
    reason: "Medical appointment and recovery",
    appliedDate: "2026-02-11",
  },
  {
    id: "lr_003",
    staffId: "stf_005",
    staffName: "Emeka Nwankwo",
    type: "personal" as const,
    startDate: "2026-02-20",
    endDate: "2026-02-20",
    days: 1,
    status: "approved" as const,
    reason: "Family emergency",
    appliedDate: "2026-02-19",
  },
  {
    id: "lr_004",
    staffId: "stf_007",
    staffName: "Grace Mensah",
    type: "annual" as const,
    startDate: "2026-04-01",
    endDate: "2026-04-10",
    days: 8,
    status: "pending" as const,
    reason: "Travel plans during Easter holiday",
    appliedDate: "2026-02-15",
  },
  {
    id: "lr_005",
    staffId: "stf_002",
    staffName: "Blessing Osei",
    type: "sick" as const,
    startDate: "2026-01-20",
    endDate: "2026-01-22",
    days: 3,
    status: "approved" as const,
    reason: "Flu and recovery",
    appliedDate: "2026-01-20",
  },
  {
    id: "lr_006",
    staffId: "stf_004",
    staffName: "Daniel Ampah",
    type: "personal" as const,
    startDate: "2026-03-05",
    endDate: "2026-03-06",
    days: 2,
    status: "rejected" as const,
    reason: "House move. no substitute available",
    appliedDate: "2026-02-18",
  },
  {
    id: "lr_007",
    staffId: "stf_009",
    staffName: "Ibrahim Musa",
    type: "annual" as const,
    startDate: "2026-02-01",
    endDate: "2026-02-05",
    days: 5,
    status: "approved" as const,
    reason: "Pilgrimage preparation",
    appliedDate: "2026-01-15",
  },
  {
    id: "lr_008",
    staffId: "stf_006",
    staffName: "Funke Adeyemi",
    type: "sick" as const,
    startDate: "2026-02-17",
    endDate: "2026-02-18",
    days: 2,
    status: "approved" as const,
    reason: "Dental surgery",
    appliedDate: "2026-02-16",
  },
];

export const staffLeaveBalances: Record<string, { annual: { total: number; used: number; remaining: number }; sick: { total: number; used: number; remaining: number }; personal: { total: number; used: number; remaining: number } }> = {
  stf_001: { annual: { total: 21, used: 5, remaining: 16 }, sick: { total: 10, used: 2, remaining: 8 }, personal: { total: 5, used: 1, remaining: 4 } },
  stf_002: { annual: { total: 21, used: 8, remaining: 13 }, sick: { total: 10, used: 3, remaining: 7 }, personal: { total: 5, used: 0, remaining: 5 } },
  stf_003: { annual: { total: 21, used: 3, remaining: 18 }, sick: { total: 10, used: 3, remaining: 7 }, personal: { total: 5, used: 2, remaining: 3 } },
  stf_004: { annual: { total: 21, used: 10, remaining: 11 }, sick: { total: 10, used: 1, remaining: 9 }, personal: { total: 5, used: 2, remaining: 3 } },
  stf_005: { annual: { total: 21, used: 0, remaining: 21 }, sick: { total: 10, used: 0, remaining: 10 }, personal: { total: 5, used: 1, remaining: 4 } },
  stf_006: { annual: { total: 21, used: 7, remaining: 14 }, sick: { total: 10, used: 4, remaining: 6 }, personal: { total: 5, used: 1, remaining: 4 } },
  stf_007: { annual: { total: 21, used: 2, remaining: 19 }, sick: { total: 10, used: 0, remaining: 10 }, personal: { total: 5, used: 0, remaining: 5 } },
  stf_008: { annual: { total: 21, used: 12, remaining: 9 }, sick: { total: 10, used: 5, remaining: 5 }, personal: { total: 5, used: 3, remaining: 2 } },
  stf_009: { annual: { total: 21, used: 5, remaining: 16 }, sick: { total: 10, used: 1, remaining: 9 }, personal: { total: 5, used: 0, remaining: 5 } },
  stf_010: { annual: { total: 21, used: 4, remaining: 17 }, sick: { total: 10, used: 2, remaining: 8 }, personal: { total: 5, used: 1, remaining: 4 } },
  stf_011: { annual: { total: 21, used: 6, remaining: 15 }, sick: { total: 10, used: 3, remaining: 7 }, personal: { total: 5, used: 2, remaining: 3 } },
  stf_012: { annual: { total: 21, used: 1, remaining: 20 }, sick: { total: 10, used: 0, remaining: 10 }, personal: { total: 5, used: 0, remaining: 5 } },
};

// ============================================
// Staff Performance Reviews
// ============================================
export const staffPerformanceReviews = [
  {
    id: "pr_r001",
    staffId: "stf_001",
    staffName: "Adebayo Johnson",
    reviewDate: "2026-01-15",
    reviewer: "Principal Amina Okonkwo",
    period: "Term 1, 2025-2026",
    overallRating: 4.2,
    categories: { teaching: 4.5, communication: 4.0, punctuality: 4.0, teamwork: 4.5, initiative: 4.0 },
    strengths: "Excellent classroom management. Students consistently perform well in Mathematics. Strong mentor to junior staff.",
    improvements: "Could improve integration of technology in lesson delivery.",
  },
  {
    id: "pr_r002",
    staffId: "stf_002",
    staffName: "Blessing Osei",
    reviewDate: "2026-01-15",
    reviewer: "Principal Amina Okonkwo",
    period: "Term 1, 2025-2026",
    overallRating: 4.6,
    categories: { teaching: 4.8, communication: 4.5, punctuality: 4.5, teamwork: 4.5, initiative: 4.8 },
    strengths: "Outstanding English department leadership. Innovative teaching methods. Organized the successful literary festival.",
    improvements: "Delegation skills. tends to take on too much personally.",
  },
  {
    id: "pr_r003",
    staffId: "stf_003",
    staffName: "Chioma Okafor",
    reviewDate: "2026-01-16",
    reviewer: "HOD Science. Dr. Adams",
    period: "Term 1, 2025-2026",
    overallRating: 3.8,
    categories: { teaching: 4.0, communication: 3.5, punctuality: 4.0, teamwork: 3.8, initiative: 3.8 },
    strengths: "Good subject knowledge. Lab practicals are well-organized.",
    improvements: "Should engage more with parents during PTM. Communication with colleagues could be more proactive.",
  },
  {
    id: "pr_r004",
    staffId: "stf_005",
    staffName: "Emeka Nwankwo",
    reviewDate: "2026-01-16",
    reviewer: "Principal Amina Okonkwo",
    period: "Term 1, 2025-2026",
    overallRating: 4.0,
    categories: { teaching: 4.2, communication: 3.8, punctuality: 4.2, teamwork: 4.0, initiative: 3.8 },
    strengths: "History lessons are engaging and well-researched. Good at bringing real-world connections to the curriculum.",
    improvements: "Assessment feedback could be more detailed and timely.",
  },
  {
    id: "pr_r005",
    staffId: "stf_007",
    staffName: "Grace Mensah",
    reviewDate: "2026-01-17",
    reviewer: "HOD Languages. Mrs. White",
    period: "Term 1, 2025-2026",
    overallRating: 4.4,
    categories: { teaching: 4.5, communication: 4.5, punctuality: 4.2, teamwork: 4.5, initiative: 4.2 },
    strengths: "Exceptional rapport with students. French immersion activities are creative and effective.",
    improvements: "Documentation of lesson plans could be more consistent.",
  },
  {
    id: "pr_r006",
    staffId: "stf_010",
    staffName: "Janet Balogun",
    reviewDate: "2026-01-17",
    reviewer: "Principal Amina Okonkwo",
    period: "Term 1, 2025-2026",
    overallRating: 3.5,
    categories: { teaching: 3.5, communication: 3.8, punctuality: 3.0, teamwork: 3.5, initiative: 3.8 },
    strengths: "Good with younger students. Creative art projects that students enjoy.",
    improvements: "Punctuality needs significant improvement. Should follow the curriculum schedule more closely.",
  },
];

// ============================================
// Staff Documents
// ============================================
export const staffDocuments = [
  {
    id: "sd_001",
    staffId: "stf_001",
    name: "Employment Contract. Adebayo Johnson",
    type: "contract" as const,
    uploadDate: "2023-09-01",
    fileSize: "245 KB",
    status: "active" as const,
    expiryDate: "2026-08-31",
  },
  {
    id: "sd_002",
    staffId: "stf_001",
    name: "Teaching Certification. Mathematics",
    type: "certification" as const,
    uploadDate: "2023-09-01",
    fileSize: "180 KB",
    status: "active" as const,
    expiryDate: "2027-12-31",
  },
  {
    id: "sd_003",
    staffId: "stf_002",
    name: "Employment Contract. Blessing Osei",
    type: "contract" as const,
    uploadDate: "2022-01-10",
    fileSize: "250 KB",
    status: "active" as const,
    expiryDate: "2026-12-31",
  },
  {
    id: "sd_004",
    staffId: "stf_002",
    name: "Resume. Blessing Osei",
    type: "resume" as const,
    uploadDate: "2022-01-05",
    fileSize: "320 KB",
    status: "active" as const,
  },
  {
    id: "sd_005",
    staffId: "stf_003",
    name: "Medical Clearance. Chioma Okafor",
    type: "medical" as const,
    uploadDate: "2025-09-15",
    fileSize: "150 KB",
    status: "active" as const,
    expiryDate: "2026-09-14",
  },
  {
    id: "sd_006",
    staffId: "stf_005",
    name: "Teaching Certification. History",
    type: "certification" as const,
    uploadDate: "2024-03-01",
    fileSize: "175 KB",
    status: "expired" as const,
    expiryDate: "2025-12-31",
  },
  {
    id: "sd_007",
    staffId: "stf_007",
    name: "Employment Contract. Grace Mensah",
    type: "contract" as const,
    uploadDate: "2024-08-15",
    fileSize: "240 KB",
    status: "active" as const,
    expiryDate: "2027-08-14",
  },
  {
    id: "sd_008",
    staffId: "stf_010",
    name: "Resume. Janet Balogun",
    type: "resume" as const,
    uploadDate: "2025-01-20",
    fileSize: "290 KB",
    status: "active" as const,
  },
];

// ============================================
// Sub-Admin Management
// ============================================
export const subAdminRoles = [
  {
    id: "role_001",
    name: "Academic Coordinator",
    description: "Manages academic configuration, subjects, timetables, and grading",
    permissions: ["academics.view", "academics.edit", "subjects.manage", "timetable.manage", "grades.view", "grades.edit"],
    color: "#3B82F6",
  },
  {
    id: "role_002",
    name: "Admissions Officer",
    description: "Handles student applications, enrollment, and admissions pipeline",
    permissions: ["admissions.view", "admissions.edit", "applications.manage", "enrollment.manage"],
    color: "#10B981",
  },
  {
    id: "role_003",
    name: "Finance Manager",
    description: "Manages fees, payments, invoices, and financial reports",
    permissions: ["finance.view", "finance.edit", "fees.manage", "payments.manage", "reports.financial"],
    color: "#F59E0B",
  },
  {
    id: "role_004",
    name: "HR Administrator",
    description: "Manages staff records, leave requests, and performance reviews",
    permissions: ["staff.view", "staff.edit", "leave.manage", "performance.manage", "payroll.view"],
    color: "#8B5CF6",
  },
  {
    id: "role_005",
    name: "Discipline Officer",
    description: "Handles behavioral incidents, disciplinary actions, and parent notifications",
    permissions: ["discipline.view", "discipline.edit", "incidents.manage", "notifications.send"],
    color: "#EF4444",
  },
];

export const subAdmins = [
  {
    id: "sa_001",
    firstName: "Ngozi",
    lastName: "Ibe",
    email: "ngozi.ibe@greenwood.edu",
    roleId: "role_001",
    roleName: "Academic Coordinator",
    status: "active" as const,
    invitedDate: "2025-09-01",
    lastActive: "2026-02-19",
  },
  {
    id: "sa_002",
    firstName: "Kofi",
    lastName: "Mensah",
    email: "kofi.mensah@greenwood.edu",
    roleId: "role_002",
    roleName: "Admissions Officer",
    status: "active" as const,
    invitedDate: "2025-09-01",
    lastActive: "2026-02-18",
  },
  {
    id: "sa_003",
    firstName: "Halima",
    lastName: "Yusuf",
    email: "halima.yusuf@greenwood.edu",
    roleId: "role_003",
    roleName: "Finance Manager",
    status: "active" as const,
    invitedDate: "2025-10-15",
    lastActive: "2026-02-19",
  },
  {
    id: "sa_004",
    firstName: "Samuel",
    lastName: "Appiah",
    email: "samuel.appiah@greenwood.edu",
    roleId: "role_004",
    roleName: "HR Administrator",
    status: "invited" as const,
    invitedDate: "2026-02-10",
  },
  {
    id: "sa_005",
    firstName: "Yemi",
    lastName: "Adesanya",
    email: "yemi.adesanya@greenwood.edu",
    roleId: "role_005",
    roleName: "Discipline Officer",
    status: "active" as const,
    invitedDate: "2025-11-01",
    lastActive: "2026-02-17",
  },
  {
    id: "sa_006",
    firstName: "Beatrice",
    lastName: "Nkomo",
    email: "beatrice.nkomo@greenwood.edu",
    roleId: "role_002",
    roleName: "Admissions Officer",
    status: "deactivated" as const,
    invitedDate: "2025-06-01",
    lastActive: "2025-12-15",
  },
];

export const subAdminActivityLog = [
  { id: "al_001", subAdminId: "sa_001", subAdminName: "Ngozi Ibe", action: "Updated timetable for Grade 10A", details: "Changed Period 3 from Physics to Chemistry", timestamp: "2026-02-19T09:30:00", category: "academics" as const },
  { id: "al_002", subAdminId: "sa_002", subAdminName: "Kofi Mensah", action: "Accepted application", details: "Approved admission for Adekunle Balogun (Grade 8)", timestamp: "2026-02-19T08:45:00", category: "admissions" as const },
  { id: "al_003", subAdminId: "sa_003", subAdminName: "Halima Yusuf", action: "Generated fee invoices", details: "Created Term 2 invoices for 245 students", timestamp: "2026-02-18T16:20:00", category: "finance" as const },
  { id: "al_004", subAdminId: "sa_005", subAdminName: "Yemi Adesanya", action: "Logged discipline incident", details: "Behavioral incident for James Okafor. Grade 10A", timestamp: "2026-02-17T14:15:00", category: "discipline" as const },
  { id: "al_005", subAdminId: "sa_001", subAdminName: "Ngozi Ibe", action: "Added new subject", details: "Added 'Introduction to Coding' for Grade 7", timestamp: "2026-02-17T11:00:00", category: "academics" as const },
  { id: "al_006", subAdminId: "sa_002", subAdminName: "Kofi Mensah", action: "Moved application to review", details: "Application for Zainab Musa moved to under_review", timestamp: "2026-02-16T10:30:00", category: "admissions" as const },
  { id: "al_007", subAdminId: "sa_003", subAdminName: "Halima Yusuf", action: "Recorded payment", details: "Payment of ₦150,000 received from Okafor family", timestamp: "2026-02-15T13:45:00", category: "finance" as const },
  { id: "al_008", subAdminId: "sa_005", subAdminName: "Yemi Adesanya", action: "Resolved incident", details: "Incident DI-004 marked as resolved. academic dishonesty", timestamp: "2026-02-14T09:20:00", category: "discipline" as const },
  { id: "al_009", subAdminId: "sa_001", subAdminName: "Ngozi Ibe", action: "Modified promotion rules", details: "Updated minimum GPA for Grade 9→10 from 1.8 to 2.0", timestamp: "2026-02-13T15:00:00", category: "academics" as const },
  { id: "al_010", subAdminId: "sa_002", subAdminName: "Kofi Mensah", action: "Sent enrollment notification", details: "Enrollment confirmation sent to 5 accepted students", timestamp: "2026-02-12T11:30:00", category: "admissions" as const },
];

// ============================================
// School Documents & Certificates
// ============================================
export const schoolDocuments = [
  { id: "doc_001", name: "Student Enrollment Register 2025-2026", category: "student_records" as const, type: "xlsx" as const, fileSize: "1.2 MB", uploadedBy: "Kofi Mensah", uploadDate: "2025-09-15", status: "active" as const, tags: ["enrollment", "2025-2026"] },
  { id: "doc_002", name: "Staff Payroll. January 2026", category: "staff_records" as const, type: "xlsx" as const, fileSize: "890 KB", uploadedBy: "Halima Yusuf", uploadDate: "2026-02-01", status: "active" as const, tags: ["payroll", "january"] },
  { id: "doc_003", name: "Transfer Certificate Template", category: "certificates" as const, type: "docx" as const, fileSize: "156 KB", uploadedBy: "Ngozi Ibe", uploadDate: "2025-08-20", status: "active" as const, tags: ["template", "transfer"] },
  { id: "doc_004", name: "Term 1 Report Cards. Grade 10", category: "reports" as const, type: "pdf" as const, fileSize: "4.5 MB", uploadedBy: "Ngozi Ibe", uploadDate: "2025-12-20", status: "active" as const, tags: ["reports", "term-1", "grade-10"] },
  { id: "doc_005", name: "School Fee Structure 2025-2026", category: "templates" as const, type: "pdf" as const, fileSize: "320 KB", uploadedBy: "Halima Yusuf", uploadDate: "2025-08-01", status: "active" as const, tags: ["fees", "structure"] },
  { id: "doc_006", name: "Staff Attendance Records. Term 1", category: "staff_records" as const, type: "xlsx" as const, fileSize: "650 KB", uploadedBy: "Yemi Adesanya", uploadDate: "2025-12-22", status: "archived" as const, tags: ["attendance", "term-1"] },
  { id: "doc_007", name: "Graduation Certificate Template", category: "certificates" as const, type: "docx" as const, fileSize: "210 KB", uploadedBy: "Ngozi Ibe", uploadDate: "2025-05-10", status: "active" as const, tags: ["template", "graduation"] },
  { id: "doc_008", name: "Student Medical Records. Grade 7", category: "student_records" as const, type: "pdf" as const, fileSize: "2.1 MB", uploadedBy: "Kofi Mensah", uploadDate: "2025-09-20", status: "active" as const, tags: ["medical", "grade-7"] },
  { id: "doc_009", name: "Annual Budget Report 2024-2025", category: "reports" as const, type: "pdf" as const, fileSize: "1.8 MB", uploadedBy: "Halima Yusuf", uploadDate: "2025-07-30", status: "archived" as const, tags: ["budget", "annual", "2024-2025"] },
  { id: "doc_010", name: "Character Certificate Template", category: "certificates" as const, type: "docx" as const, fileSize: "145 KB", uploadedBy: "Ngozi Ibe", uploadDate: "2025-06-15", status: "active" as const, tags: ["template", "character"] },
  { id: "doc_011", name: "Term 2 Exam Timetable", category: "templates" as const, type: "pdf" as const, fileSize: "280 KB", uploadedBy: "Ngozi Ibe", uploadDate: "2026-02-10", status: "active" as const, tags: ["exam", "timetable", "term-2"] },
  { id: "doc_012", name: "Student Discipline Log 2025-2026", category: "student_records" as const, type: "xlsx" as const, fileSize: "420 KB", uploadedBy: "Yemi Adesanya", uploadDate: "2026-01-15", status: "active" as const, tags: ["discipline", "log"] },
  { id: "doc_013", name: "Staff Contracts. New Hires 2025", category: "staff_records" as const, type: "pdf" as const, fileSize: "3.2 MB", uploadedBy: "Halima Yusuf", uploadDate: "2025-09-01", status: "active" as const, tags: ["contracts", "new-hires"] },
  { id: "doc_014", name: "PTA Meeting Minutes. February 2026", category: "reports" as const, type: "docx" as const, fileSize: "195 KB", uploadedBy: "Ngozi Ibe", uploadDate: "2026-02-15", status: "draft" as const, tags: ["pta", "minutes"] },
  { id: "doc_015", name: "Achievement Certificate Template", category: "certificates" as const, type: "docx" as const, fileSize: "178 KB", uploadedBy: "Ngozi Ibe", uploadDate: "2025-11-01", status: "active" as const, tags: ["template", "achievement"] },
];

export const certificateTemplates = [
  { id: "ct_001", name: "Transfer Certificate", type: "transfer" as const, lastModified: "2025-12-10", status: "active" as const, usageCount: 23 },
  { id: "ct_002", name: "Graduation Certificate", type: "graduation" as const, lastModified: "2025-06-20", status: "active" as const, usageCount: 48 },
  { id: "ct_003", name: "Academic Achievement Award", type: "achievement" as const, lastModified: "2026-01-15", status: "active" as const, usageCount: 156 },
  { id: "ct_004", name: "Character Reference Certificate", type: "character" as const, lastModified: "2025-09-30", status: "active" as const, usageCount: 34 },
  { id: "ct_005", name: "Enrollment Confirmation Letter", type: "enrollment" as const, lastModified: "2026-02-01", status: "active" as const, usageCount: 89 },
];

// ============================================
// Transport Management
// ============================================
export const transportRoutes = [
  {
    id: "tr_001",
    name: "Route 1. Victoria Island",
    description: "Victoria Island to Greenwood Academy via Lekki",
    startPoint: "Victoria Island",
    endPoint: "Greenwood Academy",
    stops: [
      { name: "VI Bus Stop", time: "06:30", studentCount: 8 },
      { name: "Lekki Phase 1", time: "06:50", studentCount: 12 },
      { name: "Chevron Roundabout", time: "07:10", studentCount: 6 },
      { name: "Greenwood Academy", time: "07:30", studentCount: 0 },
    ],
    driverName: "Mr. Tunde Bakare",
    driverPhone: "+234 801 234 5678",
    vehicleId: "tv_001",
    status: "active" as const,
    totalStudents: 26,
  },
  {
    id: "tr_002",
    name: "Route 2. Ikoyi",
    description: "Ikoyi to Greenwood Academy via Obalende",
    startPoint: "Ikoyi",
    endPoint: "Greenwood Academy",
    stops: [
      { name: "Ikoyi Club", time: "06:20", studentCount: 5 },
      { name: "Obalende Junction", time: "06:40", studentCount: 9 },
      { name: "CMS Bus Stop", time: "07:00", studentCount: 7 },
      { name: "Greenwood Academy", time: "07:25", studentCount: 0 },
    ],
    driverName: "Mr. Emeka Obiora",
    driverPhone: "+234 802 345 6789",
    vehicleId: "tv_002",
    status: "active" as const,
    totalStudents: 21,
  },
  {
    id: "tr_003",
    name: "Route 3. Lekki Express",
    description: "Ajah to Greenwood Academy via Lekki Expressway",
    startPoint: "Ajah",
    endPoint: "Greenwood Academy",
    stops: [
      { name: "Ajah Bus Stop", time: "06:15", studentCount: 10 },
      { name: "Abraham Adesanya", time: "06:30", studentCount: 8 },
      { name: "Jakande Roundabout", time: "06:50", studentCount: 6 },
      { name: "VGC Gate", time: "07:05", studentCount: 4 },
      { name: "Greenwood Academy", time: "07:25", studentCount: 0 },
    ],
    driverName: "Mr. Ibrahim Lawal",
    driverPhone: "+234 803 456 7890",
    vehicleId: "tv_003",
    status: "active" as const,
    totalStudents: 28,
  },
  {
    id: "tr_004",
    name: "Route 4. Surulere",
    description: "Surulere to Greenwood Academy via Yaba",
    startPoint: "Surulere",
    endPoint: "Greenwood Academy",
    stops: [
      { name: "National Stadium", time: "06:20", studentCount: 7 },
      { name: "Yaba Bus Stop", time: "06:40", studentCount: 11 },
      { name: "Palmgrove", time: "07:00", studentCount: 5 },
      { name: "Greenwood Academy", time: "07:30", studentCount: 0 },
    ],
    driverName: "Mr. Adebisi Kola",
    driverPhone: "+234 804 567 8901",
    vehicleId: "tv_004",
    status: "active" as const,
    totalStudents: 23,
  },
  {
    id: "tr_005",
    name: "Route 5. Ikeja",
    description: "Ikeja GRA to Greenwood Academy",
    startPoint: "Ikeja GRA",
    endPoint: "Greenwood Academy",
    stops: [
      { name: "Ikeja GRA", time: "06:10", studentCount: 9 },
      { name: "Allen Avenue", time: "06:25", studentCount: 6 },
      { name: "Alausa", time: "06:45", studentCount: 5 },
      { name: "Greenwood Academy", time: "07:20", studentCount: 0 },
    ],
    driverName: "Mr. Segun Afolabi",
    driverPhone: "+234 805 678 9012",
    vehicleId: "tv_005",
    status: "inactive" as const,
    totalStudents: 20,
  },
  {
    id: "tr_006",
    name: "Route 6. Festac/Amuwo",
    description: "Festac Town to Greenwood Academy via Mile 2",
    startPoint: "Festac Town",
    endPoint: "Greenwood Academy",
    stops: [
      { name: "Festac Gate", time: "06:00", studentCount: 8 },
      { name: "Mile 2", time: "06:20", studentCount: 6 },
      { name: "Apapa", time: "06:45", studentCount: 4 },
      { name: "Greenwood Academy", time: "07:30", studentCount: 0 },
    ],
    driverName: "Mr. Chinedu Eze",
    driverPhone: "+234 806 789 0123",
    vehicleId: "tv_001",
    status: "active" as const,
    totalStudents: 18,
  },
];

export const transportVehicles = [
  { id: "tv_001", plateNumber: "LG-234-KJA", type: "bus" as const, capacity: 52, currentLoad: 44, driverName: "Mr. Tunde Bakare", status: "active" as const, lastService: "2026-01-15", nextService: "2026-04-15" },
  { id: "tv_002", plateNumber: "LG-567-ABJ", type: "bus" as const, capacity: 48, currentLoad: 21, driverName: "Mr. Emeka Obiora", status: "active" as const, lastService: "2026-02-01", nextService: "2026-05-01" },
  { id: "tv_003", plateNumber: "LG-891-ENU", type: "minibus" as const, capacity: 30, currentLoad: 28, driverName: "Mr. Ibrahim Lawal", status: "active" as const, lastService: "2025-12-20", nextService: "2026-03-20" },
  { id: "tv_004", plateNumber: "LG-112-PHC", type: "minibus" as const, capacity: 30, currentLoad: 23, driverName: "Mr. Adebisi Kola", status: "maintenance" as const, lastService: "2026-02-10", nextService: "2026-02-25" },
  { id: "tv_005", plateNumber: "LG-345-IBA", type: "van" as const, capacity: 15, currentLoad: 0, driverName: "Mr. Segun Afolabi", status: "inactive" as const, lastService: "2025-11-01", nextService: "2026-02-01" },
];

export const transportAssignments = [
  { id: "ta_001", studentId: "std_001", studentName: "Adewale Johnson", grade: "Grade 10A", routeId: "tr_001", routeName: "Route 1. Victoria Island", stopName: "VI Bus Stop", feeStatus: "paid" as const, monthlyFee: 25000 },
  { id: "ta_002", studentId: "std_002", studentName: "Chidinma Okonkwo", grade: "Grade 11B", routeId: "tr_001", routeName: "Route 1. Victoria Island", stopName: "Lekki Phase 1", feeStatus: "paid" as const, monthlyFee: 25000 },
  { id: "ta_003", studentId: "std_003", studentName: "Kwesi Mensah", grade: "Grade 9A", routeId: "tr_002", routeName: "Route 2. Ikoyi", stopName: "Ikoyi Club", feeStatus: "pending" as const, monthlyFee: 22000 },
  { id: "ta_004", studentId: "std_004", studentName: "Fatima Bello", grade: "Grade 8B", routeId: "tr_002", routeName: "Route 2. Ikoyi", stopName: "Obalende Junction", feeStatus: "paid" as const, monthlyFee: 22000 },
  { id: "ta_005", studentId: "std_005", studentName: "Emeka Nwosu", grade: "Grade 10A", routeId: "tr_003", routeName: "Route 3. Lekki Express", stopName: "Ajah Bus Stop", feeStatus: "overdue" as const, monthlyFee: 28000 },
  { id: "ta_006", studentId: "std_006", studentName: "Amina Yusuf", grade: "Grade 12A", routeId: "tr_003", routeName: "Route 3. Lekki Express", stopName: "Abraham Adesanya", feeStatus: "paid" as const, monthlyFee: 28000 },
  { id: "ta_007", studentId: "std_007", studentName: "Kofi Asante", grade: "Grade 7A", routeId: "tr_004", routeName: "Route 4. Surulere", stopName: "National Stadium", feeStatus: "paid" as const, monthlyFee: 20000 },
  { id: "ta_008", studentId: "std_008", studentName: "Grace Adeyemi", grade: "Grade 7B", routeId: "tr_004", routeName: "Route 4. Surulere", stopName: "Yaba Bus Stop", feeStatus: "pending" as const, monthlyFee: 20000 },
  { id: "ta_009", studentId: "std_009", studentName: "Ibrahim Musa", grade: "Grade 11A", routeId: "tr_001", routeName: "Route 1. Victoria Island", stopName: "Chevron Roundabout", feeStatus: "paid" as const, monthlyFee: 25000 },
  { id: "ta_010", studentId: "std_010", studentName: "Ngozi Ibe", grade: "Grade 9B", routeId: "tr_003", routeName: "Route 3. Lekki Express", stopName: "VGC Gate", feeStatus: "overdue" as const, monthlyFee: 28000 },
  { id: "ta_011", studentId: "std_011", studentName: "Daniel Okafor", grade: "Grade 8A", routeId: "tr_006", routeName: "Route 6. Festac/Amuwo", stopName: "Festac Gate", feeStatus: "paid" as const, monthlyFee: 22000 },
  { id: "ta_012", studentId: "std_012", studentName: "Halima Abdullahi", grade: "Grade 10B", routeId: "tr_006", routeName: "Route 6. Festac/Amuwo", stopName: "Mile 2", feeStatus: "pending" as const, monthlyFee: 22000 },
];

export const transportFees = [
  { id: "tf_001", studentName: "Adewale Johnson", grade: "Grade 10A", routeName: "Route 1", amount: 25000, period: "February 2026", status: "paid" as const, dueDate: "2026-02-05", paidDate: "2026-02-03" },
  { id: "tf_002", studentName: "Chidinma Okonkwo", grade: "Grade 11B", routeName: "Route 1", amount: 25000, period: "February 2026", status: "paid" as const, dueDate: "2026-02-05", paidDate: "2026-02-04" },
  { id: "tf_003", studentName: "Kwesi Mensah", grade: "Grade 9A", routeName: "Route 2", amount: 22000, period: "February 2026", status: "pending" as const, dueDate: "2026-02-05" },
  { id: "tf_004", studentName: "Emeka Nwosu", grade: "Grade 10A", routeName: "Route 3", amount: 28000, period: "February 2026", status: "overdue" as const, dueDate: "2026-02-05" },
  { id: "tf_005", studentName: "Kofi Asante", grade: "Grade 7A", routeName: "Route 4", amount: 20000, period: "February 2026", status: "paid" as const, dueDate: "2026-02-05", paidDate: "2026-02-01" },
  { id: "tf_006", studentName: "Ngozi Ibe", grade: "Grade 9B", routeName: "Route 3", amount: 28000, period: "February 2026", status: "overdue" as const, dueDate: "2026-02-05" },
  { id: "tf_007", studentName: "Grace Adeyemi", grade: "Grade 7B", routeName: "Route 4", amount: 20000, period: "February 2026", status: "pending" as const, dueDate: "2026-02-05" },
  { id: "tf_008", studentName: "Halima Abdullahi", grade: "Grade 10B", routeName: "Route 6", amount: 22000, period: "February 2026", status: "pending" as const, dueDate: "2026-02-05" },
];

// ============================================
// Health Records
// ============================================
export const healthProfiles = [
  {
    id: "hp_001", studentId: "std_001", studentName: "Adewale Johnson", grade: "Grade 10A", bloodGroup: "O+",
    allergies: ["Peanuts", "Dust mites"],
    conditions: ["Mild asthma"],
    emergencyContact: { name: "Mrs. Funke Johnson", phone: "+234 801 111 2222", relation: "Mother" },
    immunizations: [
      { name: "BCG", date: "2011-03-15", status: "completed" as const },
      { name: "Hepatitis B", date: "2011-06-20", status: "completed" as const },
      { name: "Polio (OPV)", date: "2012-01-10", status: "completed" as const },
      { name: "Measles", date: "2012-09-05", status: "completed" as const },
      { name: "Meningitis", date: "2025-09-15", status: "completed" as const },
    ],
    lastCheckup: "2026-01-20", notes: "Carries inhaler. Seated near window for fresh air access.",
  },
  {
    id: "hp_002", studentId: "std_002", studentName: "Chidinma Okonkwo", grade: "Grade 11B", bloodGroup: "A+",
    allergies: [],
    conditions: [],
    emergencyContact: { name: "Mr. Obi Okonkwo", phone: "+234 802 222 3333", relation: "Father" },
    immunizations: [
      { name: "BCG", date: "2010-05-12", status: "completed" as const },
      { name: "Hepatitis B", date: "2010-08-18", status: "completed" as const },
      { name: "Polio (OPV)", date: "2011-02-14", status: "completed" as const },
      { name: "Measles", date: "2011-10-20", status: "completed" as const },
      { name: "HPV", date: "2024-03-10", status: "completed" as const },
    ],
    lastCheckup: "2025-11-15", notes: "",
  },
  {
    id: "hp_003", studentId: "std_003", studentName: "Kwesi Mensah", grade: "Grade 9A", bloodGroup: "B+",
    allergies: ["Penicillin"],
    conditions: ["ADHD. managed with medication"],
    emergencyContact: { name: "Mrs. Ama Mensah", phone: "+234 803 333 4444", relation: "Mother" },
    immunizations: [
      { name: "BCG", date: "2012-07-22", status: "completed" as const },
      { name: "Hepatitis B", date: "2012-10-15", status: "completed" as const },
      { name: "Polio (OPV)", date: "2013-03-08", status: "completed" as const },
      { name: "Measles", date: "2013-11-12", status: "completed" as const },
      { name: "Tetanus Booster", date: "2025-09-01", status: "pending" as const },
    ],
    lastCheckup: "2025-12-10", notes: "Medication administered at nurse's office during lunch break.",
  },
  {
    id: "hp_004", studentId: "std_004", studentName: "Fatima Bello", grade: "Grade 8B", bloodGroup: "AB+",
    allergies: ["Shellfish", "Latex"],
    conditions: [],
    emergencyContact: { name: "Mr. Ahmed Bello", phone: "+234 804 444 5555", relation: "Father" },
    immunizations: [
      { name: "BCG", date: "2013-01-10", status: "completed" as const },
      { name: "Hepatitis B", date: "2013-04-15", status: "completed" as const },
      { name: "Polio (OPV)", date: "2013-09-20", status: "completed" as const },
      { name: "Measles", date: "2014-06-12", status: "completed" as const },
      { name: "Meningitis", date: "2025-08-20", status: "completed" as const },
    ],
    lastCheckup: "2026-02-05", notes: "Cafeteria staff alerted about shellfish allergy.",
  },
  {
    id: "hp_005", studentId: "std_005", studentName: "Emeka Nwosu", grade: "Grade 10A", bloodGroup: "O-",
    allergies: [],
    conditions: ["Type 1 Diabetes"],
    emergencyContact: { name: "Mrs. Ada Nwosu", phone: "+234 805 555 6666", relation: "Mother" },
    immunizations: [
      { name: "BCG", date: "2011-08-05", status: "completed" as const },
      { name: "Hepatitis B", date: "2011-11-10", status: "completed" as const },
      { name: "Polio (OPV)", date: "2012-04-15", status: "completed" as const },
      { name: "Measles", date: "2012-12-20", status: "completed" as const },
      { name: "Flu Shot", date: "2025-10-01", status: "completed" as const },
    ],
    lastCheckup: "2026-01-30", notes: "Insulin kit kept in nurse's office. Allowed snack breaks as needed.",
  },
  {
    id: "hp_006", studentId: "std_006", studentName: "Amina Yusuf", grade: "Grade 12A", bloodGroup: "A-",
    allergies: ["Bee stings"],
    conditions: [],
    emergencyContact: { name: "Mrs. Zainab Yusuf", phone: "+234 806 666 7777", relation: "Mother" },
    immunizations: [
      { name: "BCG", date: "2009-04-12", status: "completed" as const },
      { name: "Hepatitis B", date: "2009-07-18", status: "completed" as const },
      { name: "Polio (OPV)", date: "2010-01-22", status: "completed" as const },
      { name: "Measles", date: "2010-09-14", status: "completed" as const },
      { name: "HPV", date: "2023-05-20", status: "completed" as const },
    ],
    lastCheckup: "2025-10-20", notes: "EpiPen stored in nurse's office for bee sting emergencies.",
  },
  {
    id: "hp_007", studentId: "std_007", studentName: "Kofi Asante", grade: "Grade 7A", bloodGroup: "B-",
    allergies: [],
    conditions: ["Mild scoliosis"],
    emergencyContact: { name: "Mr. Kwadwo Asante", phone: "+234 807 777 8888", relation: "Father" },
    immunizations: [
      { name: "BCG", date: "2014-02-28", status: "completed" as const },
      { name: "Hepatitis B", date: "2014-05-15", status: "completed" as const },
      { name: "Polio (OPV)", date: "2014-11-20", status: "completed" as const },
      { name: "Measles", date: "2015-07-10", status: "completed" as const },
      { name: "Tetanus Booster", date: "2025-09-10", status: "pending" as const },
    ],
    lastCheckup: "2025-11-05", notes: "Ergonomic chair provided. Excused from certain PE activities.",
  },
  {
    id: "hp_008", studentId: "std_008", studentName: "Grace Adeyemi", grade: "Grade 7B", bloodGroup: "O+",
    allergies: ["Eggs"],
    conditions: [],
    emergencyContact: { name: "Mrs. Bola Adeyemi", phone: "+234 808 888 9999", relation: "Mother" },
    immunizations: [
      { name: "BCG", date: "2014-06-15", status: "completed" as const },
      { name: "Hepatitis B", date: "2014-09-20", status: "completed" as const },
      { name: "Polio (OPV)", date: "2015-03-10", status: "completed" as const },
      { name: "Measles", date: "2015-11-05", status: "completed" as const },
      { name: "Meningitis", date: "2025-08-25", status: "pending" as const },
    ],
    lastCheckup: "2026-01-10", notes: "Egg-free lunch option arranged with cafeteria.",
  },
  {
    id: "hp_009", studentId: "std_009", studentName: "Ibrahim Musa", grade: "Grade 11A", bloodGroup: "AB-",
    allergies: [],
    conditions: [],
    emergencyContact: { name: "Mr. Hassan Musa", phone: "+234 809 999 0000", relation: "Father" },
    immunizations: [
      { name: "BCG", date: "2010-12-01", status: "completed" as const },
      { name: "Hepatitis B", date: "2011-03-08", status: "completed" as const },
      { name: "Polio (OPV)", date: "2011-08-15", status: "completed" as const },
      { name: "Measles", date: "2012-04-22", status: "completed" as const },
      { name: "Flu Shot", date: "2025-10-15", status: "completed" as const },
    ],
    lastCheckup: "2025-09-20", notes: "",
  },
  {
    id: "hp_010", studentId: "std_010", studentName: "Ngozi Ibe", grade: "Grade 9B", bloodGroup: "A+",
    allergies: ["Dairy"],
    conditions: ["Eczema"],
    emergencyContact: { name: "Mrs. Chioma Ibe", phone: "+234 810 000 1111", relation: "Mother" },
    immunizations: [
      { name: "BCG", date: "2012-03-18", status: "completed" as const },
      { name: "Hepatitis B", date: "2012-06-22", status: "completed" as const },
      { name: "Polio (OPV)", date: "2013-01-10", status: "completed" as const },
      { name: "Measles", date: "2013-08-15", status: "completed" as const },
      { name: "Tetanus Booster", date: "2025-09-05", status: "completed" as const },
    ],
    lastCheckup: "2026-02-01", notes: "Dairy-free meals. Topical cream applied as needed at nurse's office.",
  },
];

export const clinicVisits = [
  { id: "cv_001", studentId: "std_001", studentName: "Adewale Johnson", grade: "Grade 10A", date: "2026-02-18", reason: "Asthma episode during PE", diagnosis: "Mild asthma attack", treatment: "Administered inhaler, rested for 30 minutes", attendedBy: "Nurse Olamide", status: "treated" as const, parentNotified: true },
  { id: "cv_002", studentId: "std_005", studentName: "Emeka Nwosu", grade: "Grade 10A", date: "2026-02-17", reason: "Low blood sugar episode", diagnosis: "Hypoglycemia", treatment: "Glucose tablets administered, snack provided, blood sugar monitored", attendedBy: "Nurse Olamide", status: "treated" as const, parentNotified: true },
  { id: "cv_003", studentId: "std_008", studentName: "Grace Adeyemi", grade: "Grade 7B", date: "2026-02-15", reason: "Stomach ache after lunch", diagnosis: "Suspected food sensitivity", treatment: "Rest and observation. Symptoms resolved after 1 hour", attendedBy: "Nurse Olamide", status: "treated" as const, parentNotified: false },
  { id: "cv_004", studentId: "std_003", studentName: "Kwesi Mensah", grade: "Grade 9A", date: "2026-02-14", reason: "Headache and dizziness", diagnosis: "Dehydration", treatment: "Oral rehydration, rest period", attendedBy: "Nurse Olamide", status: "treated" as const, parentNotified: false },
  { id: "cv_005", studentId: "std_007", studentName: "Kofi Asante", grade: "Grade 7A", date: "2026-02-12", reason: "Back pain during class", diagnosis: "Scoliosis-related discomfort", treatment: "Pain relief, posture adjustment, referred to specialist", attendedBy: "Nurse Olamide", status: "referred" as const, parentNotified: true },
  { id: "cv_006", studentId: "std_010", studentName: "Ngozi Ibe", grade: "Grade 9B", date: "2026-02-10", reason: "Skin rash on arms", diagnosis: "Eczema flare-up", treatment: "Applied prescribed topical cream, monitoring ongoing", attendedBy: "Nurse Olamide", status: "ongoing" as const, parentNotified: true },
  { id: "cv_007", studentId: "std_006", studentName: "Amina Yusuf", grade: "Grade 12A", date: "2026-02-07", reason: "Anxiety before exam", diagnosis: "Exam anxiety", treatment: "Breathing exercises, counselor referral", attendedBy: "Nurse Olamide", status: "referred" as const, parentNotified: false },
  { id: "cv_008", studentId: "std_004", studentName: "Fatima Bello", grade: "Grade 8B", date: "2026-02-05", reason: "Minor cut during Art class", diagnosis: "Superficial laceration", treatment: "Cleaned and bandaged wound", attendedBy: "Nurse Olamide", status: "treated" as const, parentNotified: false },
];

// ============================================
// Hostel Management
// ============================================
export const hostelBlocks = [
  { id: "hb_001", name: "Block A. Unity House", type: "boys" as const, totalRooms: 5, occupiedRooms: 4, capacity: 40, currentOccupancy: 32, warden: "Mr. Dele Ajayi" },
  { id: "hb_002", name: "Block B. Harmony House", type: "girls" as const, totalRooms: 5, occupiedRooms: 5, capacity: 40, currentOccupancy: 36, warden: "Mrs. Bimpe Ogundimu" },
  { id: "hb_003", name: "Block C. Progress House", type: "boys" as const, totalRooms: 4, occupiedRooms: 3, capacity: 32, currentOccupancy: 20, warden: "Mr. Chukwu Obi" },
];

export const hostelRooms = [
  { id: "hr_001", blockId: "hb_001", blockName: "Block A", roomNumber: "A101", capacity: 8, occupied: 8, occupants: [{ studentId: "std_001", studentName: "Adewale Johnson", grade: "Grade 10A" }, { studentId: "std_009", studentName: "Ibrahim Musa", grade: "Grade 11A" }, { studentId: "std_h01", studentName: "Tunde Abiola", grade: "Grade 10B" }, { studentId: "std_h02", studentName: "Femi Bankole", grade: "Grade 11A" }, { studentId: "std_h03", studentName: "Yemi Oladipo", grade: "Grade 10A" }, { studentId: "std_h04", studentName: "Segun Akindele", grade: "Grade 9A" }, { studentId: "std_h05", studentName: "Bayo Ogundele", grade: "Grade 9B" }, { studentId: "std_h06", studentName: "Dayo Fasola", grade: "Grade 11B" }], status: "full" as const },
  { id: "hr_002", blockId: "hb_001", blockName: "Block A", roomNumber: "A102", capacity: 8, occupied: 8, occupants: [{ studentId: "std_h07", studentName: "Kola Adeniyi", grade: "Grade 10A" }, { studentId: "std_h08", studentName: "Gbenga Sanni", grade: "Grade 12A" }, { studentId: "std_h09", studentName: "Wale Okeowo", grade: "Grade 8A" }, { studentId: "std_h10", studentName: "Lanre Balogun", grade: "Grade 8B" }, { studentId: "std_h11", studentName: "Niyi Okafor", grade: "Grade 9A" }, { studentId: "std_h12", studentName: "Ade Olumide", grade: "Grade 10B" }, { studentId: "std_h13", studentName: "Jide Afolabi", grade: "Grade 11B" }, { studentId: "std_h14", studentName: "Tayo Ekundayo", grade: "Grade 12A" }], status: "full" as const },
  { id: "hr_003", blockId: "hb_001", blockName: "Block A", roomNumber: "A103", capacity: 8, occupied: 8, occupants: [{ studentId: "std_h15", studentName: "Tobi Alade", grade: "Grade 7A" }, { studentId: "std_h16", studentName: "Ayo Babatunde", grade: "Grade 7B" }, { studentId: "std_h17", studentName: "Ola Fagbemi", grade: "Grade 8A" }, { studentId: "std_h18", studentName: "Kunle Dosunmu", grade: "Grade 8B" }, { studentId: "std_h19", studentName: "Rotimi Adeleke", grade: "Grade 9B" }, { studentId: "std_h20", studentName: "Sola Ogunlana", grade: "Grade 7A" }, { studentId: "std_h21", studentName: "Emeka Chukwuma", grade: "Grade 7B" }, { studentId: "std_h22", studentName: "Chidi Anene", grade: "Grade 8A" }], status: "full" as const },
  { id: "hr_004", blockId: "hb_001", blockName: "Block A", roomNumber: "A104", capacity: 8, occupied: 8, occupants: [{ studentId: "std_h23", studentName: "Uche Okafor", grade: "Grade 9A" }, { studentId: "std_h24", studentName: "Nnamdi Eze", grade: "Grade 10A" }, { studentId: "std_h25", studentName: "Obinna Nweke", grade: "Grade 10B" }, { studentId: "std_h26", studentName: "Ikenna Ogbu", grade: "Grade 11A" }, { studentId: "std_h27", studentName: "Chike Obi", grade: "Grade 11B" }, { studentId: "std_h28", studentName: "Ike Udoka", grade: "Grade 12A" }, { studentId: "std_h29", studentName: "Nonso Amadi", grade: "Grade 9B" }, { studentId: "std_h30", studentName: "Kachi Nnadi", grade: "Grade 8B" }], status: "full" as const },
  { id: "hr_005", blockId: "hb_001", blockName: "Block A", roomNumber: "A105", capacity: 8, occupied: 0, occupants: [], status: "maintenance" as const },
  { id: "hr_006", blockId: "hb_002", blockName: "Block B", roomNumber: "B101", capacity: 8, occupied: 8, occupants: [{ studentId: "std_002", studentName: "Chidinma Okonkwo", grade: "Grade 11B" }, { studentId: "std_006", studentName: "Amina Yusuf", grade: "Grade 12A" }, { studentId: "std_h31", studentName: "Folake Adisa", grade: "Grade 10A" }, { studentId: "std_h32", studentName: "Kemi Ojo", grade: "Grade 10B" }, { studentId: "std_h33", studentName: "Titi Balogun", grade: "Grade 11A" }, { studentId: "std_h34", studentName: "Nike Ogunwale", grade: "Grade 9A" }, { studentId: "std_h35", studentName: "Sade Akin", grade: "Grade 9B" }, { studentId: "std_h36", studentName: "Bisi Oladele", grade: "Grade 12A" }], status: "full" as const },
  { id: "hr_007", blockId: "hb_002", blockName: "Block B", roomNumber: "B102", capacity: 8, occupied: 8, occupants: [{ studentId: "std_004", studentName: "Fatima Bello", grade: "Grade 8B" }, { studentId: "std_008", studentName: "Grace Adeyemi", grade: "Grade 7B" }, { studentId: "std_h37", studentName: "Aisha Garba", grade: "Grade 7A" }, { studentId: "std_h38", studentName: "Hauwa Ibrahim", grade: "Grade 8A" }, { studentId: "std_h39", studentName: "Maryam Sule", grade: "Grade 8B" }, { studentId: "std_h40", studentName: "Zainab Usman", grade: "Grade 7B" }, { studentId: "std_h41", studentName: "Habiba Aliyu", grade: "Grade 9A" }, { studentId: "std_h42", studentName: "Rahma Bako", grade: "Grade 9B" }], status: "full" as const },
  { id: "hr_008", blockId: "hb_002", blockName: "Block B", roomNumber: "B103", capacity: 8, occupied: 8, occupants: [{ studentId: "std_010", studentName: "Ngozi Ibe", grade: "Grade 9B" }, { studentId: "std_h43", studentName: "Ada Okeke", grade: "Grade 10A" }, { studentId: "std_h44", studentName: "Nneka Uzoma", grade: "Grade 10B" }, { studentId: "std_h45", studentName: "Ifeoma Chukwu", grade: "Grade 11A" }, { studentId: "std_h46", studentName: "Ugo Emenike", grade: "Grade 11B" }, { studentId: "std_h47", studentName: "Chika Nwobi", grade: "Grade 12A" }, { studentId: "std_h48", studentName: "Oge Okoro", grade: "Grade 8A" }, { studentId: "std_h49", studentName: "Nkechi Eze", grade: "Grade 7A" }], status: "full" as const },
  { id: "hr_009", blockId: "hb_002", blockName: "Block B", roomNumber: "B104", capacity: 8, occupied: 6, occupants: [{ studentId: "std_h50", studentName: "Yetunde Bello", grade: "Grade 10A" }, { studentId: "std_h51", studentName: "Funmi Alabi", grade: "Grade 10B" }, { studentId: "std_h52", studentName: "Lara Oguntade", grade: "Grade 11A" }, { studentId: "std_h53", studentName: "Damilola Aina", grade: "Grade 9A" }, { studentId: "std_h54", studentName: "Bukola Fashina", grade: "Grade 8B" }, { studentId: "std_h55", studentName: "Jumoke Olawoyin", grade: "Grade 7B" }], status: "available" as const },
  { id: "hr_010", blockId: "hb_002", blockName: "Block B", roomNumber: "B105", capacity: 8, occupied: 6, occupants: [{ studentId: "std_h56", studentName: "Adeola Martins", grade: "Grade 12A" }, { studentId: "std_h57", studentName: "Toyin Bakare", grade: "Grade 11B" }, { studentId: "std_h58", studentName: "Shade Adegoke", grade: "Grade 10A" }, { studentId: "std_h59", studentName: "Peju Omotola", grade: "Grade 9B" }, { studentId: "std_h60", studentName: "Bola Okafor", grade: "Grade 8A" }, { studentId: "std_h61", studentName: "Yinka Dada", grade: "Grade 7A" }], status: "available" as const },
  { id: "hr_011", blockId: "hb_003", blockName: "Block C", roomNumber: "C101", capacity: 8, occupied: 8, occupants: [{ studentId: "std_h62", studentName: "Pascal Okwu", grade: "Grade 10A" }, { studentId: "std_h63", studentName: "Victor Nwachukwu", grade: "Grade 10B" }, { studentId: "std_h64", studentName: "Peter Obi", grade: "Grade 11A" }, { studentId: "std_h65", studentName: "Samuel Eze", grade: "Grade 11B" }, { studentId: "std_h66", studentName: "Paul Igwe", grade: "Grade 9A" }, { studentId: "std_h67", studentName: "John Nweke", grade: "Grade 9B" }, { studentId: "std_h68", studentName: "Michael Okafor", grade: "Grade 8A" }, { studentId: "std_h69", studentName: "David Chukwuma", grade: "Grade 8B" }], status: "full" as const },
  { id: "hr_012", blockId: "hb_003", blockName: "Block C", roomNumber: "C102", capacity: 8, occupied: 6, occupants: [{ studentId: "std_h70", studentName: "Daniel Uche", grade: "Grade 12A" }, { studentId: "std_h71", studentName: "Joseph Nnaji", grade: "Grade 7A" }, { studentId: "std_h72", studentName: "Matthew Okeke", grade: "Grade 7B" }, { studentId: "std_h73", studentName: "Andrew Uzor", grade: "Grade 10A" }, { studentId: "std_h74", studentName: "Philip Onu", grade: "Grade 11A" }, { studentId: "std_h75", studentName: "Simon Agbor", grade: "Grade 9A" }], status: "available" as const },
];

export const hostelFees = [
  { id: "hf_001", studentId: "std_001", studentName: "Adewale Johnson", grade: "Grade 10A", blockName: "Block A", roomNumber: "A101", amount: 150000, period: "Term 2, 2025-2026", status: "paid" as const, dueDate: "2026-01-15" },
  { id: "hf_002", studentId: "std_002", studentName: "Chidinma Okonkwo", grade: "Grade 11B", blockName: "Block B", roomNumber: "B101", amount: 150000, period: "Term 2, 2025-2026", status: "paid" as const, dueDate: "2026-01-15" },
  { id: "hf_003", studentId: "std_009", studentName: "Ibrahim Musa", grade: "Grade 11A", blockName: "Block A", roomNumber: "A101", amount: 150000, period: "Term 2, 2025-2026", status: "pending" as const, dueDate: "2026-01-15" },
  { id: "hf_004", studentId: "std_006", studentName: "Amina Yusuf", grade: "Grade 12A", blockName: "Block B", roomNumber: "B101", amount: 150000, period: "Term 2, 2025-2026", status: "paid" as const, dueDate: "2026-01-15" },
  { id: "hf_005", studentId: "std_004", studentName: "Fatima Bello", grade: "Grade 8B", blockName: "Block B", roomNumber: "B102", amount: 150000, period: "Term 2, 2025-2026", status: "overdue" as const, dueDate: "2026-01-15" },
  { id: "hf_006", studentId: "std_010", studentName: "Ngozi Ibe", grade: "Grade 9B", blockName: "Block B", roomNumber: "B103", amount: 150000, period: "Term 2, 2025-2026", status: "paid" as const, dueDate: "2026-01-15" },
  { id: "hf_007", studentId: "std_h62", studentName: "Pascal Okwu", grade: "Grade 10A", blockName: "Block C", roomNumber: "C101", amount: 120000, period: "Term 2, 2025-2026", status: "pending" as const, dueDate: "2026-01-15" },
  { id: "hf_008", studentId: "std_h70", studentName: "Daniel Uche", grade: "Grade 12A", blockName: "Block C", roomNumber: "C102", amount: 120000, period: "Term 2, 2025-2026", status: "overdue" as const, dueDate: "2026-01-15" },
];

// ============================================
// Phase 4: Enhancement Data
// ============================================

// --- Admissions: Waitlist ---
export const waitlistEntries = [
  { id: "wl_001", studentName: "Oluwatobi Adeyemo", email: "adeyemo.family@email.com", grade: "Grade 7A", appliedDate: "2026-01-05", position: 1, priority: "high" as const, notes: "Sibling already enrolled", status: "waiting" as const },
  { id: "wl_002", studentName: "Chiamaka Obi", email: "obi.chiamaka@email.com", grade: "Grade 8A", appliedDate: "2026-01-08", position: 2, priority: "normal" as const, notes: "Transferred from Lagos", status: "waiting" as const },
  { id: "wl_003", studentName: "Yusuf Abdullahi", email: "abdullahi.y@email.com", grade: "Grade 10A", appliedDate: "2026-01-10", position: 3, priority: "high" as const, notes: "Scholarship candidate", status: "offered" as const },
  { id: "wl_004", studentName: "Blessing Eze", email: "blessing.eze@email.com", grade: "Grade 9A", appliedDate: "2026-01-12", position: 4, priority: "normal" as const, notes: "", status: "waiting" as const },
  { id: "wl_005", studentName: "Damilare Ogunleye", email: "ogunleye.d@email.com", grade: "Grade 7B", appliedDate: "2026-01-15", position: 5, priority: "low" as const, notes: "Late application", status: "declined" as const },
  { id: "wl_006", studentName: "Halima Baba", email: "halima.baba@email.com", grade: "Grade 11A", appliedDate: "2026-01-18", position: 6, priority: "normal" as const, notes: "Relocated from Abuja", status: "waiting" as const },
];

// --- Admissions: Analytics ---
export const admissionsAnalytics = {
  totalInquiries: 245,
  conversionRate: 42,
  topSources: [
    { source: "Website", count: 98 },
    { source: "Referral", count: 65 },
    { source: "Social Media", count: 42 },
    { source: "School Fair", count: 25 },
    { source: "Walk-in", count: 15 },
  ],
  monthlyApplications: [
    { month: "Sep", count: 18 },
    { month: "Oct", count: 32 },
    { month: "Nov", count: 45 },
    { month: "Dec", count: 28 },
    { month: "Jan", count: 52 },
    { month: "Feb", count: 38 },
  ],
  gradeDistribution: [
    { grade: "Grade 7", count: 28 },
    { grade: "Grade 8", count: 22 },
    { grade: "Grade 9", count: 35 },
    { grade: "Grade 10", count: 40 },
    { grade: "Grade 11", count: 18 },
    { grade: "Grade 12", count: 12 },
  ],
};

// --- Attendance: Period-wise ---
export const periodAttendance = [
  { id: "pa_001", classId: "cls_001", className: "Grade 7A", date: "2026-02-18", periods: [
    { period: 1, subject: "Mathematics", teacher: "Mrs. Adebayo", present: 28, absent: 2, late: 1 },
    { period: 2, subject: "English", teacher: "Mr. Okafor", present: 29, absent: 1, late: 1 },
    { period: 3, subject: "Science", teacher: "Dr. Mensah", present: 27, absent: 3, late: 0 },
    { period: 4, subject: "History", teacher: "Mrs. Ojo", present: 28, absent: 2, late: 1 },
    { period: 5, subject: "Art", teacher: "Mr. Bello", present: 30, absent: 0, late: 1 },
  ]},
  { id: "pa_002", classId: "cls_002", className: "Grade 7B", date: "2026-02-18", periods: [
    { period: 1, subject: "English", teacher: "Mr. Okafor", present: 26, absent: 4, late: 2 },
    { period: 2, subject: "Mathematics", teacher: "Mrs. Adebayo", present: 27, absent: 3, late: 1 },
    { period: 3, subject: "Geography", teacher: "Mr. Akin", present: 25, absent: 5, late: 0 },
    { period: 4, subject: "Science", teacher: "Dr. Mensah", present: 26, absent: 4, late: 1 },
    { period: 5, subject: "PE", teacher: "Coach Udo", present: 28, absent: 2, late: 0 },
  ]},
  { id: "pa_003", classId: "cls_003", className: "Grade 8A", date: "2026-02-18", periods: [
    { period: 1, subject: "Science", teacher: "Dr. Mensah", present: 30, absent: 1, late: 0 },
    { period: 2, subject: "Mathematics", teacher: "Mrs. Adebayo", present: 29, absent: 2, late: 1 },
    { period: 3, subject: "English", teacher: "Mr. Okafor", present: 30, absent: 1, late: 0 },
    { period: 4, subject: "ICT", teacher: "Mr. Chukwu", present: 28, absent: 3, late: 1 },
    { period: 5, subject: "French", teacher: "Mme. Diallo", present: 29, absent: 2, late: 0 },
  ]},
  { id: "pa_004", classId: "cls_004", className: "Grade 9A", date: "2026-02-18", periods: [
    { period: 1, subject: "Mathematics", teacher: "Mrs. Adebayo", present: 27, absent: 3, late: 2 },
    { period: 2, subject: "Biology", teacher: "Dr. Mensah", present: 28, absent: 2, late: 1 },
    { period: 3, subject: "English", teacher: "Mr. Okafor", present: 26, absent: 4, late: 0 },
    { period: 4, subject: "Chemistry", teacher: "Mr. Balogun", present: 27, absent: 3, late: 1 },
    { period: 5, subject: "Music", teacher: "Mrs. Nwosu", present: 29, absent: 1, late: 0 },
  ]},
  { id: "pa_005", classId: "cls_005", className: "Grade 10A", date: "2026-02-18", periods: [
    { period: 1, subject: "Physics", teacher: "Mr. Balogun", present: 25, absent: 5, late: 1 },
    { period: 2, subject: "Mathematics", teacher: "Mrs. Adebayo", present: 26, absent: 4, late: 2 },
    { period: 3, subject: "English", teacher: "Mr. Okafor", present: 27, absent: 3, late: 0 },
    { period: 4, subject: "Economics", teacher: "Mrs. Ojo", present: 25, absent: 5, late: 1 },
    { period: 5, subject: "PE", teacher: "Coach Udo", present: 28, absent: 2, late: 0 },
  ]},
  { id: "pa_006", classId: "cls_006", className: "Grade 10B", date: "2026-02-18", periods: [
    { period: 1, subject: "English", teacher: "Mr. Okafor", present: 29, absent: 1, late: 1 },
    { period: 2, subject: "Physics", teacher: "Mr. Balogun", present: 28, absent: 2, late: 0 },
    { period: 3, subject: "Mathematics", teacher: "Mrs. Adebayo", present: 27, absent: 3, late: 2 },
    { period: 4, subject: "Commerce", teacher: "Mr. Akin", present: 28, absent: 2, late: 0 },
    { period: 5, subject: "Art", teacher: "Mr. Bello", present: 30, absent: 0, late: 0 },
  ]},
  { id: "pa_007", classId: "cls_007", className: "Grade 11A", date: "2026-02-18", periods: [
    { period: 1, subject: "Mathematics", teacher: "Mrs. Adebayo", present: 24, absent: 4, late: 3 },
    { period: 2, subject: "Chemistry", teacher: "Mr. Balogun", present: 25, absent: 3, late: 2 },
    { period: 3, subject: "Literature", teacher: "Mr. Okafor", present: 26, absent: 2, late: 1 },
    { period: 4, subject: "Biology", teacher: "Dr. Mensah", present: 24, absent: 4, late: 0 },
    { period: 5, subject: "Civic Ed", teacher: "Mrs. Ojo", present: 27, absent: 1, late: 0 },
  ]},
  { id: "pa_008", classId: "cls_008", className: "Grade 12A", date: "2026-02-18", periods: [
    { period: 1, subject: "Further Maths", teacher: "Mrs. Adebayo", present: 22, absent: 3, late: 1 },
    { period: 2, subject: "Physics", teacher: "Mr. Balogun", present: 23, absent: 2, late: 0 },
    { period: 3, subject: "English", teacher: "Mr. Okafor", present: 24, absent: 1, late: 1 },
    { period: 4, subject: "Chemistry", teacher: "Mr. Balogun", present: 22, absent: 3, late: 0 },
    { period: 5, subject: "Government", teacher: "Mrs. Ojo", present: 25, absent: 0, late: 0 },
  ]},
];

// --- Attendance: Chronic Absentees ---
export const chronicAbsentees = [
  { id: "ca_001", studentId: "std_003", studentName: "Kwesi Mensah", grade: "Grade 9A", totalAbsent: 18, totalDays: 45, rate: 40, lastPresent: "2026-02-10", parentNotified: true, status: "critical" as const },
  { id: "ca_002", studentId: "std_005", studentName: "Emeka Nwosu", grade: "Grade 10A", totalAbsent: 12, totalDays: 45, rate: 27, lastPresent: "2026-02-14", parentNotified: true, status: "at_risk" as const },
  { id: "ca_003", studentId: "std_h15", studentName: "Tobi Alade", grade: "Grade 7A", totalAbsent: 15, totalDays: 45, rate: 33, lastPresent: "2026-02-08", parentNotified: false, status: "critical" as const },
  { id: "ca_004", studentId: "std_h40", studentName: "Zainab Usman", grade: "Grade 7B", totalAbsent: 10, totalDays: 45, rate: 22, lastPresent: "2026-02-16", parentNotified: true, status: "improving" as const },
  { id: "ca_005", studentId: "std_h62", studentName: "Pascal Okwu", grade: "Grade 10A", totalAbsent: 11, totalDays: 45, rate: 24, lastPresent: "2026-02-13", parentNotified: false, status: "at_risk" as const },
];

// --- Attendance: Leave Requests ---
export const studentLeaveRequests = [
  { id: "lr_001", studentId: "std_001", studentName: "Adewale Johnson", grade: "Grade 10A", type: "sick" as const, startDate: "2026-02-20", endDate: "2026-02-22", days: 3, reason: "Dental surgery and recovery", appliedBy: "Mrs. Johnson (Mother)", status: "pending" as const, attachments: ["medical_certificate.pdf"] },
  { id: "lr_002", studentId: "std_004", studentName: "Fatima Bello", grade: "Grade 8B", type: "family" as const, startDate: "2026-02-25", endDate: "2026-02-28", days: 4, reason: "Family wedding in Kano", appliedBy: "Mr. Bello (Father)", status: "approved" as const },
  { id: "lr_003", studentId: "std_006", studentName: "Amina Yusuf", grade: "Grade 12A", type: "personal" as const, startDate: "2026-02-19", endDate: "2026-02-19", days: 1, reason: "Driving test appointment", appliedBy: "Self (Student)", status: "rejected" as const },
  { id: "lr_004", studentId: "std_008", studentName: "Grace Adeyemi", grade: "Grade 7B", type: "sick" as const, startDate: "2026-02-17", endDate: "2026-02-19", days: 3, reason: "Chickenpox. doctor recommends home rest", appliedBy: "Mr. Adeyemi (Father)", status: "approved" as const, attachments: ["doctor_note.pdf"] },
  { id: "lr_005", studentId: "std_003", studentName: "Kwesi Mensah", grade: "Grade 9A", type: "other" as const, startDate: "2026-03-01", endDate: "2026-03-05", days: 5, reason: "National science competition in Accra", appliedBy: "Dr. Mensah (Science HOD)", status: "pending" as const },
  { id: "lr_006", studentId: "std_010", studentName: "Ngozi Ibe", grade: "Grade 9B", type: "sick" as const, startDate: "2026-02-12", endDate: "2026-02-14", days: 3, reason: "Eczema treatment follow-up", appliedBy: "Mrs. Ibe (Mother)", status: "approved" as const, attachments: ["hospital_receipt.pdf"] },
];

// --- Academics: Curriculum ---
export const curriculumItems = [
  { id: "cur_001", subjectId: "sub_001", subjectName: "Mathematics", grade: "Grade 10", term: "Term 2", topics: [
    { name: "Quadratic Equations", duration: "3 weeks", status: "completed" as const },
    { name: "Trigonometry", duration: "4 weeks", status: "completed" as const },
    { name: "Statistics & Probability", duration: "3 weeks", status: "in_progress" as const },
    { name: "Sequences & Series", duration: "2 weeks", status: "upcoming" as const },
  ], completionRate: 58 },
  { id: "cur_002", subjectId: "sub_002", subjectName: "English Language", grade: "Grade 10", term: "Term 2", topics: [
    { name: "Narrative Writing", duration: "2 weeks", status: "completed" as const },
    { name: "Comprehension & Summary", duration: "3 weeks", status: "completed" as const },
    { name: "Speech Writing", duration: "2 weeks", status: "in_progress" as const },
    { name: "Literary Criticism", duration: "3 weeks", status: "upcoming" as const },
    { name: "Revision & Practice", duration: "2 weeks", status: "upcoming" as const },
  ], completionRate: 42 },
  { id: "cur_003", subjectId: "sub_003", subjectName: "Physics", grade: "Grade 11", term: "Term 2", topics: [
    { name: "Electromagnetic Induction", duration: "3 weeks", status: "completed" as const },
    { name: "Waves & Optics", duration: "4 weeks", status: "in_progress" as const },
    { name: "Nuclear Physics", duration: "3 weeks", status: "upcoming" as const },
    { name: "Practical Revision", duration: "2 weeks", status: "upcoming" as const },
  ], completionRate: 33 },
  { id: "cur_004", subjectId: "sub_004", subjectName: "Biology", grade: "Grade 9", term: "Term 2", topics: [
    { name: "Cell Division", duration: "2 weeks", status: "completed" as const },
    { name: "Genetics & Heredity", duration: "3 weeks", status: "completed" as const },
    { name: "Evolution", duration: "2 weeks", status: "completed" as const },
    { name: "Ecology", duration: "3 weeks", status: "in_progress" as const },
    { name: "Practical Lab Work", duration: "2 weeks", status: "upcoming" as const },
  ], completionRate: 62 },
  { id: "cur_005", subjectId: "sub_005", subjectName: "Chemistry", grade: "Grade 11", term: "Term 2", topics: [
    { name: "Organic Chemistry I", duration: "3 weeks", status: "completed" as const },
    { name: "Organic Chemistry II", duration: "3 weeks", status: "in_progress" as const },
    { name: "Electrochemistry", duration: "3 weeks", status: "upcoming" as const },
    { name: "Industrial Chemistry", duration: "2 weeks", status: "upcoming" as const },
  ], completionRate: 35 },
  { id: "cur_006", subjectId: "sub_006", subjectName: "History", grade: "Grade 8", term: "Term 2", topics: [
    { name: "Pre-colonial Africa", duration: "3 weeks", status: "completed" as const },
    { name: "Colonial Era", duration: "3 weeks", status: "completed" as const },
    { name: "Independence Movements", duration: "3 weeks", status: "completed" as const },
    { name: "Post-independence Challenges", duration: "3 weeks", status: "in_progress" as const },
  ], completionRate: 75 },
  { id: "cur_007", subjectId: "sub_007", subjectName: "Geography", grade: "Grade 7", term: "Term 2", topics: [
    { name: "Map Reading", duration: "2 weeks", status: "completed" as const },
    { name: "Climate & Weather", duration: "3 weeks", status: "completed" as const },
    { name: "Population Studies", duration: "3 weeks", status: "in_progress" as const },
    { name: "Settlement", duration: "2 weeks", status: "upcoming" as const },
    { name: "Fieldwork", duration: "2 weeks", status: "upcoming" as const },
  ], completionRate: 45 },
  { id: "cur_008", subjectId: "sub_008", subjectName: "ICT", grade: "Grade 9", term: "Term 2", topics: [
    { name: "Databases", duration: "3 weeks", status: "completed" as const },
    { name: "Spreadsheet Applications", duration: "2 weeks", status: "completed" as const },
    { name: "Web Development Basics", duration: "3 weeks", status: "in_progress" as const },
    { name: "Cyber Security", duration: "2 weeks", status: "upcoming" as const },
    { name: "Project Work", duration: "2 weeks", status: "upcoming" as const },
  ], completionRate: 48 },
];

// --- Academics: Room Allocations ---
export const roomAllocations = [
  { id: "rm_001", roomNumber: "R101", type: "classroom" as const, capacity: 35, assignedClass: "Grade 7A", schedule: [
    { day: "Monday", periods: [1, 2, 3, 4, 5], subject: "Homeroom" },
    { day: "Tuesday", periods: [1, 2, 3, 4, 5], subject: "Homeroom" },
    { day: "Wednesday", periods: [1, 2, 3, 4, 5], subject: "Homeroom" },
    { day: "Thursday", periods: [1, 2, 3, 4, 5], subject: "Homeroom" },
    { day: "Friday", periods: [1, 2, 3, 4, 5], subject: "Homeroom" },
  ]},
  { id: "rm_002", roomNumber: "R102", type: "classroom" as const, capacity: 35, assignedClass: "Grade 8A", schedule: [
    { day: "Monday", periods: [1, 2, 3, 4, 5], subject: "Homeroom" },
    { day: "Tuesday", periods: [1, 2, 3, 4, 5], subject: "Homeroom" },
    { day: "Wednesday", periods: [1, 2, 3, 4, 5], subject: "Homeroom" },
    { day: "Thursday", periods: [1, 2, 3, 4, 5], subject: "Homeroom" },
    { day: "Friday", periods: [1, 2, 3, 4, 5], subject: "Homeroom" },
  ]},
  { id: "rm_003", roomNumber: "Lab A", type: "lab" as const, capacity: 30, assignedClass: "Shared", schedule: [
    { day: "Monday", periods: [1, 2], subject: "Physics. Grade 11A" },
    { day: "Monday", periods: [3, 4], subject: "Chemistry. Grade 10A" },
    { day: "Tuesday", periods: [1, 2], subject: "Biology. Grade 9A" },
    { day: "Wednesday", periods: [3, 4], subject: "Physics. Grade 12A" },
    { day: "Thursday", periods: [1, 2], subject: "Chemistry. Grade 11A" },
    { day: "Friday", periods: [1, 2], subject: "Biology. Grade 10A" },
  ]},
  { id: "rm_004", roomNumber: "Lab B", type: "lab" as const, capacity: 25, assignedClass: "Shared", schedule: [
    { day: "Monday", periods: [1, 2], subject: "ICT. Grade 9A" },
    { day: "Tuesday", periods: [3, 4], subject: "ICT. Grade 8A" },
    { day: "Wednesday", periods: [1, 2], subject: "ICT. Grade 7A" },
    { day: "Thursday", periods: [3, 4], subject: "ICT. Grade 10A" },
    { day: "Friday", periods: [1, 2], subject: "ICT. Grade 11A" },
  ]},
  { id: "rm_005", roomNumber: "Main Hall", type: "hall" as const, capacity: 200, assignedClass: "All", schedule: [
    { day: "Monday", periods: [1], subject: "Morning Assembly" },
    { day: "Wednesday", periods: [5], subject: "Inter-house Sports" },
    { day: "Friday", periods: [4, 5], subject: "Club Activities" },
  ]},
  { id: "rm_006", roomNumber: "Library", type: "library" as const, capacity: 50, assignedClass: "Open Access", schedule: [
    { day: "Monday", periods: [3, 4], subject: "Grade 7 Reading Hour" },
    { day: "Tuesday", periods: [1, 2], subject: "Grade 12 Study Period" },
    { day: "Wednesday", periods: [3, 4], subject: "Grade 8 Reading Hour" },
    { day: "Thursday", periods: [1, 2], subject: "Grade 11 Study Period" },
    { day: "Friday", periods: [3], subject: "Open Study" },
  ]},
];

// --- Calendar: PTC Schedules ---
export const ptcSchedules = [
  { id: "ptc_001", teacherName: "Mrs. Adebayo", parentName: "Mr. Johnson", studentName: "Adewale Johnson", grade: "Grade 10A", date: "2026-02-28", time: "09:00", duration: "20 min", status: "scheduled" as const, notes: "Discuss math performance improvement" },
  { id: "ptc_002", teacherName: "Mr. Okafor", parentName: "Mrs. Okonkwo", studentName: "Chidinma Okonkwo", grade: "Grade 11B", date: "2026-02-28", time: "09:30", duration: "20 min", status: "scheduled" as const },
  { id: "ptc_003", teacherName: "Dr. Mensah", parentName: "Mr. Mensah", studentName: "Kwesi Mensah", grade: "Grade 9A", date: "2026-02-28", time: "10:00", duration: "30 min", status: "scheduled" as const, notes: "Chronic absenteeism. attendance intervention" },
  { id: "ptc_004", teacherName: "Mrs. Adebayo", parentName: "Mrs. Nwosu", studentName: "Emeka Nwosu", grade: "Grade 10A", date: "2026-02-14", time: "09:00", duration: "20 min", status: "completed" as const, notes: "Health accommodations discussed" },
  { id: "ptc_005", teacherName: "Mr. Okafor", parentName: "Mr. Bello", studentName: "Fatima Bello", grade: "Grade 8B", date: "2026-02-14", time: "10:00", duration: "20 min", status: "no_show" as const },
  { id: "ptc_006", teacherName: "Dr. Mensah", parentName: "Mrs. Adeyemi", studentName: "Grace Adeyemi", grade: "Grade 7B", date: "2026-02-14", time: "10:30", duration: "20 min", status: "cancelled" as const, notes: "Parent requested reschedule" },
];

// --- Documents: TC Requests ---
export const tcRequests = [
  { id: "tc_001", studentName: "Damilola Aina", grade: "Grade 9A", requestDate: "2026-02-10", reason: "Family relocation to Port Harcourt", status: "pending" as const },
  { id: "tc_002", studentName: "Rotimi Adeleke", grade: "Grade 9B", requestDate: "2026-02-05", reason: "Transfer to boarding school", status: "generated" as const, generatedDate: "2026-02-08" },
  { id: "tc_003", studentName: "Sola Ogunlana", grade: "Grade 7A", requestDate: "2026-01-28", reason: "Moving abroad with parents", status: "collected" as const, generatedDate: "2026-01-30", collectedDate: "2026-02-02" },
  { id: "tc_004", studentName: "Kunle Dosunmu", grade: "Grade 8B", requestDate: "2026-02-15", reason: "Parent requested school change", status: "pending" as const },
  { id: "tc_005", studentName: "Ayo Babatunde", grade: "Grade 7B", requestDate: "2026-02-01", reason: "Relocating to Ibadan", status: "generated" as const, generatedDate: "2026-02-04" },
];

// --- Health: Special Needs ---
export const specialNeeds = [
  { id: "sn_001", studentId: "std_003", studentName: "Kwesi Mensah", grade: "Grade 9A", type: "IEP" as const, description: "Learning disability. dyscalculia affecting mathematics performance", accommodations: ["Extra time on math tests", "Calculator permitted", "Visual aids for math concepts", "Weekly tutoring sessions"], reviewDate: "2026-03-15", assignedStaff: "Mrs. Adebayo", status: "active" as const },
  { id: "sn_002", studentId: "std_007", studentName: "Kofi Asante", grade: "Grade 7A", type: "physical" as const, description: "Scoliosis requiring ergonomic accommodations and limited physical activity", accommodations: ["Ergonomic chair and desk", "Excused from contact sports", "Permitted to stand/stretch during class", "Ground floor classroom assignment"], reviewDate: "2026-04-01", assignedStaff: "Nurse Olamide", status: "active" as const },
  { id: "sn_003", studentId: "std_005", studentName: "Emeka Nwosu", grade: "Grade 10A", type: "504" as const, description: "Type 1 diabetes requiring daily management and emergency protocols", accommodations: ["Blood sugar testing during class", "Snack breaks as needed", "Nurse visits scheduled", "Emergency glucagon kit in clinic"], reviewDate: "2026-02-28", assignedStaff: "Nurse Olamide", status: "review_due" as const },
  { id: "sn_004", studentId: "std_h15", studentName: "Tobi Alade", grade: "Grade 7A", type: "behavioral" as const, description: "ADHD. difficulty with sustained attention and impulse control", accommodations: ["Preferential seating near teacher", "Break tasks into smaller chunks", "Movement breaks every 30 minutes", "Behavior chart with daily feedback"], reviewDate: "2026-03-20", assignedStaff: "Mrs. Ojo (Counselor)", status: "active" as const },
];

// ============================================
// Teacher Portal Demo Data
// ============================================

export const teacherUser = {
  id: "stf_001",
  firstName: "John",
  lastName: "Smith",
  email: "john.smith@greenwood.edu",
  role: "Teacher",
  avatar: null,
  department: "Mathematics",
  school: schoolInfo,
};

export const teacherClasses = [
  { id: "tc_001", name: "Grade 8A", subject: "Mathematics", students: 31, room: "301", schedule: "Mon, Wed, Fri 8:00-9:00", avgGrade: 78, attendanceRate: 93.2 },
  { id: "tc_002", name: "Grade 9A", subject: "Mathematics", students: 27, room: "401", schedule: "Mon, Wed, Fri 10:00-11:00", avgGrade: 82, attendanceRate: 92.6 },
  { id: "tc_003", name: "Grade 9B", subject: "Mathematics", students: 28, room: "402", schedule: "Tue, Thu 8:00-9:30", avgGrade: 75, attendanceRate: 96.4 },
  { id: "tc_004", name: "Grade 10A", subject: "Advanced Math", students: 30, room: "501", schedule: "Tue, Thu 10:00-11:30", avgGrade: 71, attendanceRate: 93.3 },
];

export const teacherTimetable = [
  { id: "tt_001", day: "Monday", periods: [
    { time: "8:00-9:00", subject: "Mathematics", class: "Grade 8A", room: "301" },
    { time: "9:15-10:15", subject: "Free Period", class: "", room: "" },
    { time: "10:00-11:00", subject: "Mathematics", class: "Grade 9A", room: "401" },
    { time: "11:15-12:15", subject: "Staff Meeting", class: "", room: "Staff Room" },
    { time: "1:00-2:00", subject: "Prep Time", class: "", room: "Office" },
  ]},
  { id: "tt_002", day: "Tuesday", periods: [
    { time: "8:00-9:30", subject: "Mathematics", class: "Grade 9B", room: "402" },
    { time: "10:00-11:30", subject: "Advanced Math", class: "Grade 10A", room: "501" },
    { time: "12:00-1:00", subject: "Lunch", class: "", room: "" },
    { time: "1:00-2:30", subject: "Prep Time", class: "", room: "Office" },
  ]},
  { id: "tt_003", day: "Wednesday", periods: [
    { time: "8:00-9:00", subject: "Mathematics", class: "Grade 8A", room: "301" },
    { time: "9:15-10:15", subject: "Free Period", class: "", room: "" },
    { time: "10:00-11:00", subject: "Mathematics", class: "Grade 9A", room: "401" },
    { time: "11:15-12:15", subject: "Dept. Meeting", class: "", room: "Conference" },
    { time: "1:00-2:00", subject: "Tutoring", class: "Drop-in", room: "301" },
  ]},
  { id: "tt_004", day: "Thursday", periods: [
    { time: "8:00-9:30", subject: "Mathematics", class: "Grade 9B", room: "402" },
    { time: "10:00-11:30", subject: "Advanced Math", class: "Grade 10A", room: "501" },
    { time: "12:00-1:00", subject: "Lunch", class: "", room: "" },
    { time: "1:00-2:30", subject: "Grading", class: "", room: "Office" },
  ]},
  { id: "tt_005", day: "Friday", periods: [
    { time: "8:00-9:00", subject: "Mathematics", class: "Grade 8A", room: "301" },
    { time: "9:15-10:15", subject: "Free Period", class: "", room: "" },
    { time: "10:00-11:00", subject: "Mathematics", class: "Grade 9A", room: "401" },
    { time: "11:15-12:15", subject: "Club Activity", class: "Math Club", room: "301" },
    { time: "1:00-2:00", subject: "Prep Time", class: "", room: "Office" },
  ]},
];

export const teacherAssignments = [
  { id: "ta_001", title: "Chapter 5 Practice Problems", class: "Grade 8A", subject: "Mathematics", dueDate: "2026-02-22", status: "active" as const, submitted: 24, total: 31, avgScore: null },
  { id: "ta_002", title: "Quadratic Equations Worksheet", class: "Grade 9A", subject: "Mathematics", dueDate: "2026-02-21", status: "active" as const, submitted: 20, total: 27, avgScore: null },
  { id: "ta_003", title: "Midterm Exam Review", class: "Grade 10A", subject: "Advanced Math", dueDate: "2026-02-25", status: "active" as const, submitted: 5, total: 30, avgScore: null },
  { id: "ta_004", title: "Geometry Proofs", class: "Grade 9B", subject: "Mathematics", dueDate: "2026-02-18", status: "graded" as const, submitted: 28, total: 28, avgScore: 82 },
  { id: "ta_005", title: "Linear Equations Test", class: "Grade 8A", subject: "Mathematics", dueDate: "2026-02-15", status: "graded" as const, submitted: 30, total: 31, avgScore: 76 },
  { id: "ta_006", title: "Trigonometry Quiz", class: "Grade 9A", subject: "Mathematics", dueDate: "2026-02-14", status: "graded" as const, submitted: 27, total: 27, avgScore: 85 },
  { id: "ta_007", title: "Probability Homework", class: "Grade 9B", subject: "Mathematics", dueDate: "2026-02-28", status: "draft" as const, submitted: 0, total: 28, avgScore: null },
];

export const teacherGradebook: Record<string, { studentId: string; studentName: string; grades: { label: string; score: number; maxScore: number }[] }[]> = {
  tc_001: [
    { studentId: "std_g8a_01", studentName: "Alice Morgan", grades: [{ label: "HW 1", score: 85, maxScore: 100 }, { label: "Quiz 1", score: 42, maxScore: 50 }, { label: "Test 1", score: 78, maxScore: 100 }] },
    { studentId: "std_g8a_02", studentName: "Ben Carter", grades: [{ label: "HW 1", score: 72, maxScore: 100 }, { label: "Quiz 1", score: 38, maxScore: 50 }, { label: "Test 1", score: 65, maxScore: 100 }] },
    { studentId: "std_g8a_03", studentName: "Chloe Davis", grades: [{ label: "HW 1", score: 91, maxScore: 100 }, { label: "Quiz 1", score: 46, maxScore: 50 }, { label: "Test 1", score: 88, maxScore: 100 }] },
    { studentId: "std_g8a_04", studentName: "Daniel Foster", grades: [{ label: "HW 1", score: 68, maxScore: 100 }, { label: "Quiz 1", score: 30, maxScore: 50 }, { label: "Test 1", score: 59, maxScore: 100 }] },
    { studentId: "std_g8a_05", studentName: "Eva Green", grades: [{ label: "HW 1", score: 95, maxScore: 100 }, { label: "Quiz 1", score: 48, maxScore: 50 }, { label: "Test 1", score: 92, maxScore: 100 }] },
    { studentId: "std_g8a_06", studentName: "Frank Hughes", grades: [{ label: "HW 1", score: 78, maxScore: 100 }, { label: "Quiz 1", score: 35, maxScore: 50 }, { label: "Test 1", score: 71, maxScore: 100 }] },
  ],
  tc_002: [
    { studentId: "std_g9a_01", studentName: "Grace Kim", grades: [{ label: "HW 1", score: 90, maxScore: 100 }, { label: "Quiz 1", score: 45, maxScore: 50 }, { label: "Test 1", score: 87, maxScore: 100 }] },
    { studentId: "std_g9a_02", studentName: "Henry Lee", grades: [{ label: "HW 1", score: 82, maxScore: 100 }, { label: "Quiz 1", score: 40, maxScore: 50 }, { label: "Test 1", score: 79, maxScore: 100 }] },
    { studentId: "std_g9a_03", studentName: "Ivy Nguyen", grades: [{ label: "HW 1", score: 88, maxScore: 100 }, { label: "Quiz 1", score: 47, maxScore: 50 }, { label: "Test 1", score: 91, maxScore: 100 }] },
    { studentId: "std_g9a_04", studentName: "Jack Patel", grades: [{ label: "HW 1", score: 75, maxScore: 100 }, { label: "Quiz 1", score: 33, maxScore: 50 }, { label: "Test 1", score: 68, maxScore: 100 }] },
    { studentId: "std_g9a_05", studentName: "Kate Robinson", grades: [{ label: "HW 1", score: 93, maxScore: 100 }, { label: "Quiz 1", score: 49, maxScore: 50 }, { label: "Test 1", score: 95, maxScore: 100 }] },
  ],
};

export const teacherLeaveBalance = {
  annual: { total: 21, used: 3, remaining: 18 },
  sick: { total: 10, used: 1, remaining: 9 },
  personal: { total: 5, used: 0, remaining: 5 },
};

export const teacherLeaveHistory = [
  { id: "tl_001", type: "annual" as const, startDate: "2026-01-10", endDate: "2026-01-12", days: 3, reason: "Family event", status: "approved" as const },
  { id: "tl_002", type: "sick" as const, startDate: "2026-02-03", endDate: "2026-02-03", days: 1, reason: "Doctor appointment", status: "approved" as const },
];

export const teacherMessages = [
  { id: "tm_001", from: "Mrs. Davis", fromRole: "Parent", subject: "Question about Emma's grade", preview: "Hi Mr. Smith, I wanted to ask about Emma's recent test score...", date: "2026-02-19", read: false },
  { id: "tm_002", from: "Principal Williams", fromRole: "Admin", subject: "Staff meeting Friday", preview: "Reminder: All staff are expected to attend the meeting...", date: "2026-02-18", read: true },
  { id: "tm_003", from: "Mrs. Chen", fromRole: "Parent", subject: "James absence next week", preview: "Dear Mr. Smith, James will be absent next Tuesday due to...", date: "2026-02-17", read: true },
  { id: "tm_004", from: "Ms. Miller", fromRole: "Teacher", subject: "Math dept. curriculum update", preview: "Hi John, I've updated the shared curriculum doc with...", date: "2026-02-16", read: true },
  { id: "tm_005", from: "Mr. Anderson", fromRole: "Admin", subject: "Report cards deadline", preview: "A reminder that all grades must be submitted by...", date: "2026-02-15", read: true },
];

// ============================================
// Bursar Dashboard Data
// ============================================

export const bursarUser = {
  id: "usr_bursar_001",
  firstName: "Patricia",
  lastName: "Okafor",
  email: "p.okafor@greenwoodacademy.edu",
  role: "Bursar",
  avatar: null,
  lastLogin: "2026-02-22T08:15:00",
};

// ============================================
// Fee Structure
// ============================================
export const feeStructure = [
  {
    id: "fee_str_001",
    category: "Tuition Fee",
    description: "Core academic tuition",
    amounts: { "Grade 5": 2500, "Grade 6": 2500, "Grade 7": 2800, "Grade 8": 2800, "Grade 9": 3000, "Grade 10": 3200, "Grade 11": 3200, "Grade 12": 3500 },
    frequency: "per_term" as const,
    mandatory: true,
    status: "active" as const,
  },
  {
    id: "fee_str_002",
    category: "Activity Fee",
    description: "Extracurricular activities and clubs",
    amounts: { "Grade 5": 150, "Grade 6": 150, "Grade 7": 175, "Grade 8": 175, "Grade 9": 200, "Grade 10": 200, "Grade 11": 200, "Grade 12": 200 },
    frequency: "per_term" as const,
    mandatory: false,
    status: "active" as const,
  },
  {
    id: "fee_str_003",
    category: "Supplies Fee",
    description: "Lab materials and stationery",
    amounts: { "Grade 5": 75, "Grade 6": 75, "Grade 7": 100, "Grade 8": 100, "Grade 9": 120, "Grade 10": 120, "Grade 11": 120, "Grade 12": 150 },
    frequency: "per_term" as const,
    mandatory: true,
    status: "active" as const,
  },
  {
    id: "fee_str_004",
    category: "Transport Fee",
    description: "School bus service",
    amounts: { "Grade 5": 350, "Grade 6": 350, "Grade 7": 350, "Grade 8": 350, "Grade 9": 350, "Grade 10": 350, "Grade 11": 350, "Grade 12": 350 },
    frequency: "per_term" as const,
    mandatory: false,
    status: "active" as const,
  },
  {
    id: "fee_str_005",
    category: "Exam Fee",
    description: "Examination and assessment charges",
    amounts: { "Grade 5": 100, "Grade 6": 100, "Grade 7": 150, "Grade 8": 150, "Grade 9": 200, "Grade 10": 250, "Grade 11": 250, "Grade 12": 300 },
    frequency: "per_term" as const,
    mandatory: true,
    status: "active" as const,
  },
  {
    id: "fee_str_006",
    category: "Technology Fee",
    description: "Computer lab and digital resources",
    amounts: { "Grade 5": 80, "Grade 6": 80, "Grade 7": 100, "Grade 8": 100, "Grade 9": 120, "Grade 10": 120, "Grade 11": 120, "Grade 12": 150 },
    frequency: "annual" as const,
    mandatory: true,
    status: "active" as const,
  },
];

// ============================================
// Fee Discounts & Scholarships
// ============================================
export const feeDiscounts = [
  { id: "disc_001", name: "Sibling Discount", type: "percentage" as const, value: 10, appliesTo: "tuition", eligibility: "Students with siblings enrolled", beneficiaries: 34, status: "active" as const },
  { id: "disc_002", name: "Early Payment Discount", type: "percentage" as const, value: 5, appliesTo: "all", eligibility: "Payment before due date", beneficiaries: 156, status: "active" as const },
  { id: "disc_003", name: "Staff Child Waiver", type: "percentage" as const, value: 50, appliesTo: "tuition", eligibility: "Children of school staff", beneficiaries: 12, status: "active" as const },
  { id: "disc_004", name: "Merit Scholarship", type: "fixed" as const, value: 500, appliesTo: "tuition", eligibility: "GPA above 3.8", beneficiaries: 28, status: "active" as const },
  { id: "disc_005", name: "Financial Aid", type: "percentage" as const, value: 25, appliesTo: "all", eligibility: "Demonstrated need", beneficiaries: 45, status: "active" as const },
];

// ============================================
// Invoices
// ============================================
export const invoices = [
  {
    id: "inv_001", invoiceNumber: "INV-2026-001", studentName: "Emma Wilson", grade: "7A", parentName: "Robert Wilson",
    items: [{ description: "Tuition Fee - Term 2", amount: 2800 }, { description: "Activity Fee - Term 2", amount: 175 }, { description: "Supplies Fee - Term 2", amount: 100 }],
    subtotal: 3075, discount: { name: "Early Payment", amount: 153.75 }, total: 2921.25,
    status: "paid" as const, issuedDate: "2026-01-02", dueDate: "2026-01-31", paidDate: "2026-01-15", paymentMethod: "Credit Card",
  },
  {
    id: "inv_002", invoiceNumber: "INV-2026-002", studentName: "James Chen", grade: "9B", parentName: "Lisa Chen",
    items: [{ description: "Tuition Fee - Term 2", amount: 3000 }, { description: "Exam Fee - Term 2", amount: 200 }],
    subtotal: 3200, discount: null, total: 3200,
    status: "paid" as const, issuedDate: "2026-01-02", dueDate: "2026-01-31", paidDate: "2026-01-10", paymentMethod: "Bank Transfer",
  },
  {
    id: "inv_003", invoiceNumber: "INV-2026-003", studentName: "Sophia Martinez", grade: "5C", parentName: "Carlos Martinez",
    items: [{ description: "Tuition Fee - Term 2", amount: 2500 }, { description: "Activity Fee - Term 2", amount: 150 }, { description: "Transport Fee - Term 2", amount: 350 }],
    subtotal: 3000, discount: { name: "Sibling Discount", amount: 250 }, total: 2750,
    status: "paid" as const, issuedDate: "2026-01-02", dueDate: "2026-01-31", paidDate: "2026-01-20", paymentMethod: "Credit Card",
  },
  {
    id: "inv_004", invoiceNumber: "INV-2026-004", studentName: "Liam Johnson", grade: "11A", parentName: "Sarah Johnson",
    items: [{ description: "Tuition Fee - Term 2", amount: 3200 }, { description: "Exam Fee - Term 2", amount: 250 }, { description: "Technology Fee", amount: 120 }],
    subtotal: 3570, discount: null, total: 3570,
    status: "overdue" as const, issuedDate: "2026-01-02", dueDate: "2026-01-31", paidDate: null, paymentMethod: null,
  },
  {
    id: "inv_005", invoiceNumber: "INV-2026-005", studentName: "Olivia Brown", grade: "8A", parentName: "Michael Brown",
    items: [{ description: "Tuition Fee - Term 2", amount: 2800 }, { description: "Supplies Fee - Term 2", amount: 100 }],
    subtotal: 2900, discount: null, total: 2900,
    status: "paid" as const, issuedDate: "2026-01-02", dueDate: "2026-01-31", paidDate: "2026-01-25", paymentMethod: "Mobile Money",
  },
  {
    id: "inv_006", invoiceNumber: "INV-2026-006", studentName: "Noah Davis", grade: "6A", parentName: "Jennifer Davis",
    items: [{ description: "Tuition Fee - Term 2", amount: 2500 }, { description: "Activity Fee - Term 2", amount: 150 }, { description: "Exam Fee - Term 2", amount: 100 }],
    subtotal: 2750, discount: null, total: 2750,
    status: "pending" as const, issuedDate: "2026-02-01", dueDate: "2026-02-28", paidDate: null, paymentMethod: null,
  },
  {
    id: "inv_007", invoiceNumber: "INV-2026-007", studentName: "Ava Garcia", grade: "10A", parentName: "Maria Garcia",
    items: [{ description: "Tuition Fee - Term 2", amount: 3200 }, { description: "Supplies Fee - Term 2", amount: 120 }],
    subtotal: 3320, discount: { name: "Merit Scholarship", amount: 500 }, total: 2820,
    status: "paid" as const, issuedDate: "2026-01-02", dueDate: "2026-01-31", paidDate: "2026-01-08", paymentMethod: "Bank Transfer",
  },
  {
    id: "inv_008", invoiceNumber: "INV-2026-008", studentName: "Ethan Miller", grade: "8B", parentName: "David Miller",
    items: [{ description: "Tuition Fee - Term 2", amount: 2800 }, { description: "Transport Fee - Term 2", amount: 350 }],
    subtotal: 3150, discount: null, total: 3150,
    status: "overdue" as const, issuedDate: "2026-01-02", dueDate: "2026-01-31", paidDate: null, paymentMethod: null,
  },
  {
    id: "inv_009", invoiceNumber: "INV-2026-009", studentName: "Isabella Anderson", grade: "12A", parentName: "Thomas Anderson",
    items: [{ description: "Tuition Fee - Term 2", amount: 3500 }, { description: "Exam Fee - Term 2", amount: 300 }, { description: "Technology Fee", amount: 150 }],
    subtotal: 3950, discount: { name: "Financial Aid", amount: 987.50 }, total: 2962.50,
    status: "pending" as const, issuedDate: "2026-02-01", dueDate: "2026-02-28", paidDate: null, paymentMethod: null,
  },
  {
    id: "inv_010", invoiceNumber: "INV-2026-010", studentName: "Mason Taylor", grade: "9A", parentName: "Jessica Taylor",
    items: [{ description: "Tuition Fee - Term 2", amount: 3000 }, { description: "Activity Fee - Term 2", amount: 200 }],
    subtotal: 3200, discount: null, total: 3200,
    status: "draft" as const, issuedDate: "2026-02-15", dueDate: "2026-03-15", paidDate: null, paymentMethod: null,
  },
];

// ============================================
// Expenses
// ============================================
export const expenses = [
  { id: "exp_001", description: "Staff salaries - January", category: "salaries" as const, amount: 185000, date: "2026-01-30", approvedBy: "Principal Williams", vendor: "Internal - Payroll", status: "approved" as const, receiptRef: "EXP-2026-001" },
  { id: "exp_002", description: "Science lab equipment", category: "supplies" as const, amount: 12500, date: "2026-01-18", approvedBy: "Dr. Adams", vendor: "LabEquip Inc.", status: "approved" as const, receiptRef: "EXP-2026-002" },
  { id: "exp_003", description: "Electricity bill - January", category: "utilities" as const, amount: 8200, date: "2026-01-28", approvedBy: "Principal Williams", vendor: "City Power Co.", status: "approved" as const, receiptRef: "EXP-2026-003" },
  { id: "exp_004", description: "Classroom furniture repair", category: "maintenance" as const, amount: 3500, date: "2026-01-22", approvedBy: "Mr. Thompson", vendor: "QuickFix Services", status: "approved" as const, receiptRef: "EXP-2026-004" },
  { id: "exp_005", description: "Software licenses renewal", category: "technology" as const, amount: 6800, date: "2026-01-15", approvedBy: "Dr. Adams", vendor: "EduTech Solutions", status: "approved" as const, receiptRef: "EXP-2026-005" },
  { id: "exp_006", description: "School bus fuel - January", category: "transport" as const, amount: 4200, date: "2026-01-31", approvedBy: "Mr. Thompson", vendor: "PetroCo Fuels", status: "approved" as const, receiptRef: "EXP-2026-006" },
  { id: "exp_007", description: "Annual sports day event", category: "events" as const, amount: 5500, date: "2026-02-10", approvedBy: "Principal Williams", vendor: "EventPro Ltd.", status: "approved" as const, receiptRef: "EXP-2026-007" },
  { id: "exp_008", description: "Water bill - January", category: "utilities" as const, amount: 2800, date: "2026-01-28", approvedBy: "Principal Williams", vendor: "Municipal Water", status: "approved" as const, receiptRef: "EXP-2026-008" },
  { id: "exp_009", description: "New projectors (3x)", category: "technology" as const, amount: 15300, date: "2026-02-05", approvedBy: "Dr. Adams", vendor: "TechWorld", status: "approved" as const, receiptRef: "EXP-2026-009" },
  { id: "exp_010", description: "Textbook order - Term 2", category: "supplies" as const, amount: 18500, date: "2026-02-12", approvedBy: "Dr. Adams", vendor: "BookMart Publishers", status: "pending" as const, receiptRef: "EXP-2026-010" },
  { id: "exp_011", description: "Security services - Feb", category: "maintenance" as const, amount: 8500, date: "2026-02-01", approvedBy: "Mr. Thompson", vendor: "SafeGuard Security", status: "approved" as const, receiptRef: "EXP-2026-011" },
  { id: "exp_012", description: "Staff training workshop", category: "events" as const, amount: 3200, date: "2026-02-18", approvedBy: "Principal Williams", vendor: "TeachForward", status: "pending" as const, receiptRef: "EXP-2026-012" },
];

export const expenseCategories = [
  { id: "cat_001", name: "Salaries & Benefits", budget: 2200000, spent: 185000, color: "#0891B2" },
  { id: "cat_002", name: "Supplies & Materials", budget: 180000, spent: 31000, color: "#A855F7" },
  { id: "cat_003", name: "Utilities", budget: 120000, spent: 11000, color: "#F59E0B" },
  { id: "cat_004", name: "Maintenance & Security", budget: 95000, spent: 12000, color: "#EF4444" },
  { id: "cat_005", name: "Technology", budget: 85000, spent: 22100, color: "#10B981" },
  { id: "cat_006", name: "Transport", budget: 75000, spent: 4200, color: "#3B82F6" },
  { id: "cat_007", name: "Events & Activities", budget: 45000, spent: 8700, color: "#EC4899" },
];

export const budgetSummary = {
  totalBudget: 2800000,
  totalSpent: 274000,
  totalCommitted: 21700,
  remainingBudget: 2504300,
  fiscalYear: "2025-2026",
};

// ============================================
// Payroll
// ============================================
export const payrollRecords = [
  { id: "pay_001", staffName: "John Smith", role: "Senior Teacher", department: "Mathematics", baseSalary: 65000, monthlyGross: 5416.67, deductions: { tax: 812.50, pension: 270.83, insurance: 150.00 }, netPay: 4183.34, status: "paid" as const, paidDate: "2026-01-30", paymentMethod: "Bank Transfer" },
  { id: "pay_002", staffName: "Sarah Williams", role: "Principal", department: "Administration", baseSalary: 95000, monthlyGross: 7916.67, deductions: { tax: 1583.33, pension: 395.83, insurance: 200.00 }, netPay: 5737.51, status: "paid" as const, paidDate: "2026-01-30", paymentMethod: "Bank Transfer" },
  { id: "pay_003", staffName: "Ms. Johnson", role: "Teacher", department: "English", baseSalary: 55000, monthlyGross: 4583.33, deductions: { tax: 687.50, pension: 229.17, insurance: 150.00 }, netPay: 3516.66, status: "paid" as const, paidDate: "2026-01-30", paymentMethod: "Bank Transfer" },
  { id: "pay_004", staffName: "Mrs. Brown", role: "Teacher", department: "Science", baseSalary: 58000, monthlyGross: 4833.33, deductions: { tax: 725.00, pension: 241.67, insurance: 150.00 }, netPay: 3716.66, status: "paid" as const, paidDate: "2026-01-30", paymentMethod: "Bank Transfer" },
  { id: "pay_005", staffName: "Mr. Davis", role: "Teacher", department: "History", baseSalary: 52000, monthlyGross: 4333.33, deductions: { tax: 650.00, pension: 216.67, insurance: 150.00 }, netPay: 3316.66, status: "paid" as const, paidDate: "2026-01-30", paymentMethod: "Bank Transfer" },
  { id: "pay_006", staffName: "Ms. Clark", role: "Teacher", department: "Science", baseSalary: 54000, monthlyGross: 4500.00, deductions: { tax: 675.00, pension: 225.00, insurance: 150.00 }, netPay: 3450.00, status: "paid" as const, paidDate: "2026-01-30", paymentMethod: "Bank Transfer" },
  { id: "pay_007", staffName: "Ms. Miller", role: "Teacher", department: "Mathematics", baseSalary: 56000, monthlyGross: 4666.67, deductions: { tax: 700.00, pension: 233.33, insurance: 150.00 }, netPay: 3583.34, status: "paid" as const, paidDate: "2026-01-30", paymentMethod: "Bank Transfer" },
  { id: "pay_008", staffName: "Mr. Thompson", role: "VP Operations", department: "Administration", baseSalary: 78000, monthlyGross: 6500.00, deductions: { tax: 1300.00, pension: 325.00, insurance: 200.00 }, netPay: 4675.00, status: "paid" as const, paidDate: "2026-01-30", paymentMethod: "Bank Transfer" },
  { id: "pay_009", staffName: "Mrs. Lee", role: "Teacher", department: "English", baseSalary: 53000, monthlyGross: 4416.67, deductions: { tax: 662.50, pension: 220.83, insurance: 150.00 }, netPay: 3383.34, status: "paid" as const, paidDate: "2026-01-30", paymentMethod: "Bank Transfer" },
  { id: "pay_010", staffName: "Mr. Anderson", role: "Counselor", department: "Student Services", baseSalary: 60000, monthlyGross: 5000.00, deductions: { tax: 750.00, pension: 250.00, insurance: 150.00 }, netPay: 3850.00, status: "paid" as const, paidDate: "2026-01-30", paymentMethod: "Bank Transfer" },
];

export const payrollSummary = {
  totalGrossPayroll: 52166.67,
  totalDeductions: 12253.16,
  totalNetPay: 39412.51,
  staffCount: 10,
  month: "January 2026",
  nextPayDate: "2026-02-28",
};

// ============================================
// Financial Reports Data
// ============================================
export const financialReportData = {
  totalRevenue: 847500,
  totalExpenses: 274000,
  netIncome: 573500,
  collectionEfficiency: 84.75,
  expenseRatio: 32.3,
  outstandingReceivables: 152500,
  monthlyTrend: [
    { month: "Sep", revenue: 110000, expenses: 52000 },
    { month: "Oct", revenue: 148000, expenses: 58000 },
    { month: "Nov", revenue: 160000, expenses: 55000 },
    { month: "Dec", revenue: 164000, expenses: 62000 },
    { month: "Jan", revenue: 125000, expenses: 48000 },
    { month: "Feb", revenue: 140500, expenses: 51000 },
  ],
  collectionByGrade: [
    { grade: "Grade 5", collected: 95000, outstanding: 12000 },
    { grade: "Grade 6", collected: 88000, outstanding: 15000 },
    { grade: "Grade 7", collected: 102000, outstanding: 18000 },
    { grade: "Grade 8", collected: 98000, outstanding: 22000 },
    { grade: "Grade 9", collected: 115000, outstanding: 20000 },
    { grade: "Grade 10", collected: 120000, outstanding: 18000 },
    { grade: "Grade 11", collected: 110000, outstanding: 25000 },
    { grade: "Grade 12", collected: 119500, outstanding: 22500 },
  ],
  agingAnalysis: [
    { range: "0-30 days", count: 45, amount: 68000 },
    { range: "31-60 days", count: 28, amount: 42500 },
    { range: "61-90 days", count: 15, amount: 27000 },
    { range: "90+ days", count: 8, amount: 15000 },
  ],
};

// ============================================
// Audit Trail
// ============================================
export const auditTrail = [
  { id: "aud_001", action: "payment_received", description: "Fee payment of $2,921.25 received from Emma Wilson", performedBy: "Patricia Okafor", timestamp: "2026-01-15T10:30:00", entity: "inv_001", entityType: "invoice" as const },
  { id: "aud_002", action: "invoice_generated", description: "Invoice INV-2026-006 generated for Noah Davis", performedBy: "Patricia Okafor", timestamp: "2026-02-01T09:15:00", entity: "inv_006", entityType: "invoice" as const },
  { id: "aud_003", action: "expense_approved", description: "Expense EXP-2026-007 approved: Annual sports day event ($5,500)", performedBy: "Principal Williams", timestamp: "2026-02-10T14:20:00", entity: "exp_007", entityType: "expense" as const },
  { id: "aud_004", action: "payroll_processed", description: "January payroll processed for 10 staff members", performedBy: "Patricia Okafor", timestamp: "2026-01-30T16:00:00", entity: "payroll_jan", entityType: "payroll" as const },
  { id: "aud_005", action: "fee_structure_updated", description: "Technology Fee updated for Grade 12 ($120 → $150)", performedBy: "Patricia Okafor", timestamp: "2026-01-05T11:45:00", entity: "fee_str_006", entityType: "fee" as const },
  { id: "aud_006", action: "discount_applied", description: "Merit Scholarship ($500) applied to Ava Garcia's invoice", performedBy: "Patricia Okafor", timestamp: "2026-01-02T10:00:00", entity: "inv_007", entityType: "invoice" as const },
  { id: "aud_007", action: "reminder_sent", description: "Payment reminder sent to Sarah Johnson for INV-2026-004", performedBy: "System", timestamp: "2026-02-05T08:00:00", entity: "inv_004", entityType: "invoice" as const },
  { id: "aud_008", action: "payment_received", description: "Fee payment of $3,200 received from James Chen", performedBy: "Patricia Okafor", timestamp: "2026-01-10T11:20:00", entity: "inv_002", entityType: "invoice" as const },
  { id: "aud_009", action: "expense_submitted", description: "Expense submitted: Textbook order - Term 2 ($18,500)", performedBy: "Dr. Adams", timestamp: "2026-02-12T13:30:00", entity: "exp_010", entityType: "expense" as const },
  { id: "aud_010", action: "payment_received", description: "Fee payment of $2,750 received from Sophia Martinez", performedBy: "Patricia Okafor", timestamp: "2026-01-20T09:45:00", entity: "inv_003", entityType: "invoice" as const },
  { id: "aud_011", action: "budget_updated", description: "FY 2025-2026 budget updated: Technology increased by $10,000", performedBy: "Principal Williams", timestamp: "2026-01-08T15:00:00", entity: "budget", entityType: "budget" as const },
  { id: "aud_012", action: "payment_received", description: "Fee payment of $2,900 received from Olivia Brown", performedBy: "Patricia Okafor", timestamp: "2026-01-25T14:10:00", entity: "inv_005", entityType: "invoice" as const },
  { id: "aud_013", action: "invoice_generated", description: "Invoice INV-2026-009 generated for Isabella Anderson", performedBy: "Patricia Okafor", timestamp: "2026-02-01T09:20:00", entity: "inv_009", entityType: "invoice" as const },
  { id: "aud_014", action: "reminder_sent", description: "Payment reminder sent to David Miller for INV-2026-008", performedBy: "System", timestamp: "2026-02-10T08:00:00", entity: "inv_008", entityType: "invoice" as const },
  { id: "aud_015", action: "payment_received", description: "Fee payment of $2,820 received from Ava Garcia", performedBy: "Patricia Okafor", timestamp: "2026-01-08T10:55:00", entity: "inv_007", entityType: "invoice" as const },
];

// ============================================
// LIBRARIAN DASHBOARD DATA
// ============================================

export const librarianUser = {
  id: "usr_librarian_001",
  firstName: "Grace",
  lastName: "Adeyemi",
  email: "g.adeyemi@greenwoodacademy.edu",
  role: "Librarian",
  avatar: null,
  lastLogin: "2026-03-02T09:00:00",
};

// ============================================
// Library Books
// ============================================
export const libraryBooks = [
  { id: "book_001", title: "To Kill a Mockingbird", author: "Harper Lee", isbn: "978-0-06-112008-4", category: "fiction" as const, publisher: "HarperCollins", publishedYear: 1960, totalCopies: 8, availableCopies: 5, condition: "good" as const, location: "Shelf A-12", addedDate: "2024-08-15", coverColor: "#3B82F6", status: "available" as const, borrowCount: 42 },
  { id: "book_002", title: "1984", author: "George Orwell", isbn: "978-0-45-152493-5", category: "fiction" as const, publisher: "Penguin Books", publishedYear: 1949, totalCopies: 6, availableCopies: 2, condition: "good" as const, location: "Shelf A-14", addedDate: "2024-08-15", coverColor: "#EF4444", status: "low_stock" as const, borrowCount: 35 },
  { id: "book_003", title: "The Great Gatsby", author: "F. Scott Fitzgerald", isbn: "978-0-74-327356-5", category: "fiction" as const, publisher: "Scribner", publishedYear: 1925, totalCopies: 5, availableCopies: 0, condition: "fair" as const, location: "Shelf A-15", addedDate: "2024-09-01", coverColor: "#F59E0B", status: "out_of_stock" as const, borrowCount: 29 },
  { id: "book_004", title: "Lord of the Flies", author: "William Golding", isbn: "978-0-57-105686-2", category: "fiction" as const, publisher: "Faber and Faber", publishedYear: 1954, totalCopies: 7, availableCopies: 4, condition: "good" as const, location: "Shelf A-16", addedDate: "2024-08-20", coverColor: "#10B981", status: "available" as const, borrowCount: 24 },
  { id: "book_005", title: "Mathematics Grade 10", author: "David Rayner", isbn: "978-0-19-835214-3", category: "textbook" as const, publisher: "Oxford University Press", publishedYear: 2022, totalCopies: 30, availableCopies: 12, condition: "excellent" as const, location: "Shelf C-01", addedDate: "2025-01-10", coverColor: "#8B5CF6", status: "available" as const, borrowCount: 38 },
  { id: "book_006", title: "Biology: Life on Earth", author: "Teresa Audesirk", isbn: "978-0-13-474426-7", category: "textbook" as const, publisher: "Pearson", publishedYear: 2020, totalCopies: 25, availableCopies: 8, condition: "good" as const, location: "Shelf C-03", addedDate: "2025-01-10", coverColor: "#06B6D4", status: "available" as const, borrowCount: 31 },
  { id: "book_007", title: "Chemistry: The Central Science", author: "Theodore Brown", isbn: "978-0-13-441423-2", category: "textbook" as const, publisher: "Pearson", publishedYear: 2021, totalCopies: 20, availableCopies: 6, condition: "good" as const, location: "Shelf C-05", addedDate: "2025-02-01", coverColor: "#EC4899", status: "available" as const, borrowCount: 22 },
  { id: "book_008", title: "World History: Patterns of Interaction", author: "Roger Beck", isbn: "978-0-54-703421-9", category: "textbook" as const, publisher: "McDougal Littell", publishedYear: 2019, totalCopies: 18, availableCopies: 1, condition: "fair" as const, location: "Shelf C-08", addedDate: "2024-08-15", coverColor: "#D97706", status: "low_stock" as const, borrowCount: 26 },
  { id: "book_009", title: "The World Book Encyclopedia", author: "World Book Inc.", isbn: "978-0-71-660103-6", category: "reference" as const, publisher: "World Book", publishedYear: 2023, totalCopies: 3, availableCopies: 3, condition: "excellent" as const, location: "Shelf R-01", addedDate: "2025-03-01", coverColor: "#1E40AF", status: "available" as const, borrowCount: 15 },
  { id: "book_010", title: "Oxford English Dictionary", author: "Oxford University Press", isbn: "978-0-19-861186-8", category: "reference" as const, publisher: "Oxford University Press", publishedYear: 2022, totalCopies: 5, availableCopies: 4, condition: "excellent" as const, location: "Shelf R-03", addedDate: "2024-08-15", coverColor: "#0F766E", status: "available" as const, borrowCount: 18 },
  { id: "book_011", title: "National Geographic Atlas", author: "National Geographic", isbn: "978-1-42-621160-3", category: "reference" as const, publisher: "National Geographic", publishedYear: 2021, totalCopies: 4, availableCopies: 3, condition: "good" as const, location: "Shelf R-05", addedDate: "2024-09-15", coverColor: "#FBBF24", status: "available" as const, borrowCount: 12 },
  { id: "book_012", title: "A Brief History of Time", author: "Stephen Hawking", isbn: "978-0-55-310953-5", category: "science" as const, publisher: "Bantam Books", publishedYear: 1988, totalCopies: 6, availableCopies: 3, condition: "good" as const, location: "Shelf B-02", addedDate: "2024-10-01", coverColor: "#7C3AED", status: "available" as const, borrowCount: 27 },
  { id: "book_013", title: "The Origin of Species", author: "Charles Darwin", isbn: "978-0-45-152906-0", category: "science" as const, publisher: "Penguin Classics", publishedYear: 1859, totalCopies: 4, availableCopies: 2, condition: "fair" as const, location: "Shelf B-04", addedDate: "2024-08-15", coverColor: "#059669", status: "available" as const, borrowCount: 14 },
  { id: "book_014", title: "Long Walk to Freedom", author: "Nelson Mandela", isbn: "978-0-31-687496-9", category: "biography" as const, publisher: "Back Bay Books", publishedYear: 1995, totalCopies: 5, availableCopies: 3, condition: "good" as const, location: "Shelf B-08", addedDate: "2024-11-01", coverColor: "#DC2626", status: "available" as const, borrowCount: 20 },
  { id: "book_015", title: "The Diary of a Young Girl", author: "Anne Frank", isbn: "978-0-55-329698-3", category: "biography" as const, publisher: "Bantam Books", publishedYear: 1947, totalCopies: 6, availableCopies: 4, condition: "good" as const, location: "Shelf B-10", addedDate: "2024-08-15", coverColor: "#BE185D", status: "available" as const, borrowCount: 23 },
];

// ============================================
// Library Members
// ============================================
export const libraryMembers = [
  { id: "lib_mem_001", name: "Emma Wilson", studentId: "STD-001", grade: "7A", memberSince: "2024-08-20", status: "active" as const, booksCheckedOut: 2, totalBorrowed: 18, overdueCount: 0, fineBalance: 0, lastActivity: "2026-02-28" },
  { id: "lib_mem_002", name: "James Chen", studentId: "STD-002", grade: "8B", memberSince: "2024-08-20", status: "active" as const, booksCheckedOut: 1, totalBorrowed: 24, overdueCount: 0, fineBalance: 0, lastActivity: "2026-03-01" },
  { id: "lib_mem_003", name: "Sophia Martinez", studentId: "STD-003", grade: "9A", memberSince: "2024-09-05", status: "active" as const, booksCheckedOut: 3, totalBorrowed: 32, overdueCount: 1, fineBalance: 2.50, lastActivity: "2026-02-27" },
  { id: "lib_mem_004", name: "Liam Johnson", studentId: "STD-004", grade: "7B", memberSince: "2024-08-20", status: "suspended" as const, booksCheckedOut: 1, totalBorrowed: 15, overdueCount: 3, fineBalance: 12.00, lastActivity: "2026-02-10" },
  { id: "lib_mem_005", name: "Olivia Brown", studentId: "STD-005", grade: "8A", memberSince: "2024-10-01", status: "active" as const, booksCheckedOut: 2, totalBorrowed: 20, overdueCount: 0, fineBalance: 0, lastActivity: "2026-03-02" },
  { id: "lib_mem_006", name: "Noah Davis", studentId: "STD-006", grade: "10A", memberSince: "2024-08-20", status: "active" as const, booksCheckedOut: 0, totalBorrowed: 28, overdueCount: 0, fineBalance: 0, lastActivity: "2026-02-25" },
  { id: "lib_mem_007", name: "Isabella Anderson", studentId: "STD-007", grade: "9B", memberSince: "2025-01-15", status: "active" as const, booksCheckedOut: 1, totalBorrowed: 10, overdueCount: 0, fineBalance: 0, lastActivity: "2026-02-20" },
  { id: "lib_mem_008", name: "Ethan Thomas", studentId: "STD-008", grade: "11A", memberSince: "2024-08-20", status: "active" as const, booksCheckedOut: 2, totalBorrowed: 35, overdueCount: 0, fineBalance: 0, lastActivity: "2026-03-01" },
  { id: "lib_mem_009", name: "Ava Garcia", studentId: "STD-009", grade: "10B", memberSince: "2024-09-10", status: "suspended" as const, booksCheckedOut: 2, totalBorrowed: 12, overdueCount: 4, fineBalance: 18.50, lastActivity: "2026-01-28" },
  { id: "lib_mem_010", name: "Mason White", studentId: "STD-010", grade: "12A", memberSince: "2024-08-20", status: "active" as const, booksCheckedOut: 1, totalBorrowed: 40, overdueCount: 0, fineBalance: 0, lastActivity: "2026-03-02" },
];

// ============================================
// Library Loans (Circulation Records)
// ============================================
export const libraryLoans = [
  { id: "loan_001", bookId: "book_001", bookTitle: "To Kill a Mockingbird", memberId: "lib_mem_001", memberName: "Emma Wilson", grade: "7A", issueDate: "2026-02-15", dueDate: "2026-03-01", returnDate: null, renewals: 0, status: "overdue" as const, fineAmount: 1.00 },
  { id: "loan_002", bookId: "book_005", bookTitle: "Mathematics Grade 10", memberId: "lib_mem_001", memberName: "Emma Wilson", grade: "7A", issueDate: "2026-02-20", dueDate: "2026-03-06", returnDate: null, renewals: 0, status: "checked_out" as const, fineAmount: 0 },
  { id: "loan_003", bookId: "book_002", bookTitle: "1984", memberId: "lib_mem_002", memberName: "James Chen", grade: "8B", issueDate: "2026-02-25", dueDate: "2026-03-11", returnDate: null, renewals: 0, status: "checked_out" as const, fineAmount: 0 },
  { id: "loan_004", bookId: "book_004", bookTitle: "Lord of the Flies", memberId: "lib_mem_004", memberName: "Liam Johnson", grade: "7B", issueDate: "2026-02-01", dueDate: "2026-02-15", returnDate: null, renewals: 0, status: "overdue" as const, fineAmount: 8.00 },
  { id: "loan_005", bookId: "book_006", bookTitle: "Biology: Life on Earth", memberId: "lib_mem_003", memberName: "Sophia Martinez", grade: "9A", issueDate: "2026-02-18", dueDate: "2026-03-04", returnDate: null, renewals: 1, status: "renewed" as const, fineAmount: 0 },
  { id: "loan_006", bookId: "book_012", bookTitle: "A Brief History of Time", memberId: "lib_mem_005", memberName: "Olivia Brown", grade: "8A", issueDate: "2026-02-22", dueDate: "2026-03-08", returnDate: null, renewals: 0, status: "checked_out" as const, fineAmount: 0 },
  { id: "loan_007", bookId: "book_014", bookTitle: "Long Walk to Freedom", memberId: "lib_mem_008", memberName: "Ethan Thomas", grade: "11A", issueDate: "2026-02-10", dueDate: "2026-02-24", returnDate: "2026-02-23", renewals: 0, status: "returned" as const, fineAmount: 0 },
  { id: "loan_008", bookId: "book_007", bookTitle: "Chemistry: The Central Science", memberId: "lib_mem_003", memberName: "Sophia Martinez", grade: "9A", issueDate: "2026-02-12", dueDate: "2026-02-26", returnDate: "2026-02-28", renewals: 0, status: "returned" as const, fineAmount: 1.00 },
  { id: "loan_009", bookId: "book_003", bookTitle: "The Great Gatsby", memberId: "lib_mem_009", memberName: "Ava Garcia", grade: "10B", issueDate: "2026-01-20", dueDate: "2026-02-03", returnDate: null, renewals: 0, status: "overdue" as const, fineAmount: 14.00 },
  { id: "loan_010", bookId: "book_015", bookTitle: "The Diary of a Young Girl", memberId: "lib_mem_005", memberName: "Olivia Brown", grade: "8A", issueDate: "2026-02-05", dueDate: "2026-02-19", returnDate: "2026-02-18", renewals: 0, status: "returned" as const, fineAmount: 0 },
  { id: "loan_011", bookId: "book_008", bookTitle: "World History: Patterns of Interaction", memberId: "lib_mem_006", memberName: "Noah Davis", grade: "10A", issueDate: "2026-02-14", dueDate: "2026-02-28", returnDate: "2026-02-27", renewals: 1, status: "returned" as const, fineAmount: 0 },
  { id: "loan_012", bookId: "book_010", bookTitle: "Oxford English Dictionary", memberId: "lib_mem_007", memberName: "Isabella Anderson", grade: "9B", issueDate: "2026-02-26", dueDate: "2026-03-12", returnDate: null, renewals: 0, status: "checked_out" as const, fineAmount: 0 },
  { id: "loan_013", bookId: "book_002", bookTitle: "1984", memberId: "lib_mem_008", memberName: "Ethan Thomas", grade: "11A", issueDate: "2026-02-20", dueDate: "2026-03-06", returnDate: null, renewals: 1, status: "renewed" as const, fineAmount: 0 },
  { id: "loan_014", bookId: "book_013", bookTitle: "The Origin of Species", memberId: "lib_mem_010", memberName: "Mason White", grade: "12A", issueDate: "2026-02-28", dueDate: "2026-03-14", returnDate: null, renewals: 0, status: "checked_out" as const, fineAmount: 0 },
  { id: "loan_015", bookId: "book_009", bookTitle: "The World Book Encyclopedia", memberId: "lib_mem_009", memberName: "Ava Garcia", grade: "10B", issueDate: "2026-01-15", dueDate: "2026-01-29", returnDate: null, renewals: 1, status: "renewed" as const, fineAmount: 0 },
];

// ============================================
// Library Fines
// ============================================
export const libraryFines = [
  { id: "fine_001", loanId: "loan_004", memberId: "lib_mem_004", memberName: "Liam Johnson", bookTitle: "Lord of the Flies", daysOverdue: 16, finePerDay: 0.50, totalFine: 8.00, amountPaid: 0, status: "unpaid" as const, issuedDate: "2026-02-15", paidDate: null },
  { id: "fine_002", loanId: "loan_009", memberId: "lib_mem_009", memberName: "Ava Garcia", bookTitle: "The Great Gatsby", daysOverdue: 28, finePerDay: 0.50, totalFine: 14.00, amountPaid: 0, status: "unpaid" as const, issuedDate: "2026-02-03", paidDate: null },
  { id: "fine_003", loanId: "loan_001", memberId: "lib_mem_001", memberName: "Emma Wilson", bookTitle: "To Kill a Mockingbird", daysOverdue: 2, finePerDay: 0.50, totalFine: 1.00, amountPaid: 0, status: "unpaid" as const, issuedDate: "2026-03-01", paidDate: null },
  { id: "fine_004", loanId: "loan_008", memberId: "lib_mem_003", memberName: "Sophia Martinez", bookTitle: "Chemistry: The Central Science", daysOverdue: 2, finePerDay: 0.50, totalFine: 1.00, amountPaid: 1.00, status: "paid" as const, issuedDate: "2026-02-26", paidDate: "2026-02-28" },
  { id: "fine_005", loanId: "prev_loan_001", memberId: "lib_mem_004", memberName: "Liam Johnson", bookTitle: "Mathematics Grade 10", daysOverdue: 7, finePerDay: 0.50, totalFine: 3.50, amountPaid: 2.00, status: "partial" as const, issuedDate: "2026-01-20", paidDate: null },
  { id: "fine_006", loanId: "prev_loan_002", memberId: "lib_mem_009", memberName: "Ava Garcia", bookTitle: "A Brief History of Time", daysOverdue: 10, finePerDay: 0.50, totalFine: 5.00, amountPaid: 5.00, status: "paid" as const, issuedDate: "2026-01-10", paidDate: "2026-01-25" },
  { id: "fine_007", loanId: "prev_loan_003", memberId: "lib_mem_006", memberName: "Noah Davis", bookTitle: "World History: Patterns of Interaction", daysOverdue: 3, finePerDay: 0.50, totalFine: 1.50, amountPaid: 0, status: "waived" as const, issuedDate: "2025-12-15", paidDate: null },
  { id: "fine_008", loanId: "prev_loan_004", memberId: "lib_mem_003", memberName: "Sophia Martinez", bookTitle: "To Kill a Mockingbird", daysOverdue: 5, finePerDay: 0.50, totalFine: 2.50, amountPaid: 2.50, status: "paid" as const, issuedDate: "2025-11-20", paidDate: "2025-11-28" },
];

// ============================================
// Library Reservations
// ============================================
export const libraryReservations = [
  { id: "res_001", bookId: "book_003", bookTitle: "The Great Gatsby", memberId: "lib_mem_005", memberName: "Olivia Brown", grade: "8A", reservedDate: "2026-02-25", status: "pending" as const, queuePosition: 1, notified: false },
  { id: "res_002", bookId: "book_003", bookTitle: "The Great Gatsby", memberId: "lib_mem_007", memberName: "Isabella Anderson", grade: "9B", reservedDate: "2026-02-27", status: "pending" as const, queuePosition: 2, notified: false },
  { id: "res_003", bookId: "book_008", bookTitle: "World History: Patterns of Interaction", memberId: "lib_mem_010", memberName: "Mason White", grade: "12A", reservedDate: "2026-02-20", status: "pending" as const, queuePosition: 1, notified: false },
  { id: "res_004", bookId: "book_001", bookTitle: "To Kill a Mockingbird", memberId: "lib_mem_006", memberName: "Noah Davis", grade: "10A", reservedDate: "2026-02-10", status: "fulfilled" as const, queuePosition: 0, notified: true },
  { id: "res_005", bookId: "book_002", bookTitle: "1984", memberId: "lib_mem_003", memberName: "Sophia Martinez", grade: "9A", reservedDate: "2026-01-28", status: "cancelled" as const, queuePosition: 0, notified: false },
  { id: "res_006", bookId: "book_005", bookTitle: "Mathematics Grade 10", memberId: "lib_mem_009", memberName: "Ava Garcia", grade: "10B", reservedDate: "2026-01-15", status: "expired" as const, queuePosition: 0, notified: true },
];

// ============================================
// Library Summary (Aggregates)
// ============================================
export const librarySummary = {
  totalBooks: 2847,
  totalCopies: 4520,
  booksCheckedOut: 342,
  overdueBooks: 28,
  activeMembers: 856,
  totalMembers: 1247,
  finesCollected: 1245.50,
  finesOutstanding: 384.00,
  dailyCirculation: 45,
  reservationsPending: 12,
  booksAddedThisMonth: 35,
  mostBorrowedCategory: "Fiction",
  returnRate: 92,
};

// ============================================
// Monthly Circulation (Chart Data)
// ============================================
export const monthlyCirculation = [
  { month: "Sep", issued: 380, returned: 365 },
  { month: "Oct", issued: 420, returned: 410 },
  { month: "Nov", issued: 395, returned: 385 },
  { month: "Dec", issued: 280, returned: 310 },
  { month: "Jan", issued: 450, returned: 420 },
  { month: "Feb", issued: 415, returned: 390 },
];

// ============================================
// Popular Books (Top 5)
// ============================================
export const popularBooks = [
  { title: "To Kill a Mockingbird", borrowCount: 42, category: "Fiction" },
  { title: "Mathematics Grade 10", borrowCount: 38, category: "Textbook" },
  { title: "1984", borrowCount: 35, category: "Fiction" },
  { title: "Biology: Life on Earth", borrowCount: 31, category: "Textbook" },
  { title: "A Brief History of Time", borrowCount: 27, category: "Science" },
];

// ============================================
// Category Distribution (Donut Chart)
// ============================================
export const categoryDistribution = [
  { category: "Fiction", count: 680, color: "#3B82F6" },
  { category: "Textbooks", count: 920, color: "#10B981" },
  { category: "Non-Fiction", count: 450, color: "#F59E0B" },
  { category: "Reference", count: 320, color: "#8B5CF6" },
  { category: "Science", count: 280, color: "#0891B2" },
  { category: "Biography", count: 197, color: "#EC4899" },
];

// ============================================
// EXAM OFFICER DASHBOARD DATA
// ============================================

// Exam Officer User
export const examOfficerUser = {
  id: "exam_officer_001",
  firstName: "Daniel",
  lastName: "Mensah",
  role: "Exam Officer",
  email: "d.mensah@greenwoodacademy.edu",
};

// ============================================
// Exam Schedule (10 exams)
// ============================================
export const examSchedule = [
  { id: "exam_001", subject: "Mathematics", class: "JSS 1", date: "2025-03-10", startTime: "09:00", endTime: "11:00", venue: "Hall A", invigilator: "Mr. Owusu", status: "completed", totalStudents: 45, submitted: 45 },
  { id: "exam_002", subject: "English Language", class: "JSS 1", date: "2025-03-11", startTime: "09:00", endTime: "11:30", venue: "Hall A", invigilator: "Mrs. Appiah", status: "completed", totalStudents: 45, submitted: 45 },
  { id: "exam_003", subject: "Integrated Science", class: "JSS 2", date: "2025-03-12", startTime: "09:00", endTime: "11:00", venue: "Hall B", invigilator: "Mr. Boateng", status: "completed", totalStudents: 42, submitted: 42 },
  { id: "exam_004", subject: "Social Studies", class: "JSS 2", date: "2025-03-13", startTime: "09:00", endTime: "11:00", venue: "Hall B", invigilator: "Ms. Dzifa", status: "completed", totalStudents: 42, submitted: 40 },
  { id: "exam_005", subject: "Mathematics", class: "SSS 1", date: "2025-03-17", startTime: "09:00", endTime: "12:00", venue: "Hall C", invigilator: "Mr. Owusu", status: "in_progress", totalStudents: 38, submitted: 0 },
  { id: "exam_006", subject: "English Language", class: "SSS 1", date: "2025-03-18", startTime: "09:00", endTime: "12:00", venue: "Hall C", invigilator: "Mrs. Appiah", status: "scheduled", totalStudents: 38, submitted: 0 },
  { id: "exam_007", subject: "Physics", class: "SSS 2", date: "2025-03-19", startTime: "09:00", endTime: "11:30", venue: "Lab 1", invigilator: "Dr. Asante", status: "scheduled", totalStudents: 35, submitted: 0 },
  { id: "exam_008", subject: "Chemistry", class: "SSS 2", date: "2025-03-20", startTime: "09:00", endTime: "11:30", venue: "Lab 2", invigilator: "Mr. Mensah", status: "scheduled", totalStudents: 35, submitted: 0 },
  { id: "exam_009", subject: "Biology", class: "SSS 3", date: "2025-03-21", startTime: "09:00", endTime: "12:00", venue: "Hall A", invigilator: "Mrs. Tetteh", status: "scheduled", totalStudents: 32, submitted: 0 },
  { id: "exam_010", subject: "Economics", class: "SSS 3", date: "2025-03-24", startTime: "09:00", endTime: "11:00", venue: "Hall B", invigilator: "Mr. Adjei", status: "postponed", totalStudents: 32, submitted: 0 },
];

// ============================================
// Gradebook Entries (20 records)
// ============================================
export const gradebookEntries = [
  { id: "gb_001", studentName: "Kwame Asante", studentId: "STU001", class: "SSS 1", subject: "Mathematics", caScore: 32, examScore: 52, total: 84, grade: "A", position: 1, status: "graded" },
  { id: "gb_002", studentName: "Ama Serwaa", studentId: "STU002", class: "SSS 1", subject: "Mathematics", caScore: 35, examScore: 46, total: 81, grade: "A", position: 2, status: "graded" },
  { id: "gb_003", studentName: "Kofi Mensah", studentId: "STU003", class: "SSS 1", subject: "Mathematics", caScore: 28, examScore: 47, total: 75, grade: "B", position: 3, status: "graded" },
  { id: "gb_004", studentName: "Adwoa Frimpong", studentId: "STU004", class: "SSS 1", subject: "Mathematics", caScore: 30, examScore: 42, total: 72, grade: "B", position: 4, status: "graded" },
  { id: "gb_005", studentName: "Yaw Boateng", studentId: "STU005", class: "SSS 1", subject: "Mathematics", caScore: 26, examScore: 38, total: 64, grade: "C", position: 5, status: "graded" },
  { id: "gb_006", studentName: "Akua Nyarko", studentId: "STU006", class: "SSS 1", subject: "Mathematics", caScore: 22, examScore: 36, total: 58, grade: "C", position: 6, status: "graded" },
  { id: "gb_007", studentName: "Kwesi Adjei", studentId: "STU007", class: "SSS 1", subject: "Mathematics", caScore: 20, examScore: 32, total: 52, grade: "D", position: 7, status: "graded" },
  { id: "gb_008", studentName: "Efua Owusu", studentId: "STU008", class: "SSS 1", subject: "Mathematics", caScore: 18, examScore: 28, total: 46, grade: "D", position: 8, status: "graded" },
  { id: "gb_009", studentName: "Kojo Acheampong", studentId: "STU009", class: "SSS 1", subject: "Mathematics", caScore: 15, examScore: 27, total: 42, grade: "E", position: 9, status: "graded" },
  { id: "gb_010", studentName: "Abena Danquah", studentId: "STU010", class: "SSS 1", subject: "Mathematics", caScore: 12, examScore: 22, total: 34, grade: "F", position: 10, status: "graded" },
  { id: "gb_011", studentName: "Kwame Asante", studentId: "STU001", class: "SSS 1", subject: "English Language", caScore: 30, examScore: 48, total: 78, grade: "B", position: 2, status: "graded" },
  { id: "gb_012", studentName: "Ama Serwaa", studentId: "STU002", class: "SSS 1", subject: "English Language", caScore: 34, examScore: 50, total: 84, grade: "A", position: 1, status: "graded" },
  { id: "gb_013", studentName: "Kofi Mensah", studentId: "STU003", class: "SSS 1", subject: "English Language", caScore: 25, examScore: 40, total: 65, grade: "C", position: 4, status: "graded" },
  { id: "gb_014", studentName: "Adwoa Frimpong", studentId: "STU004", class: "SSS 1", subject: "English Language", caScore: 28, examScore: 44, total: 72, grade: "B", position: 3, status: "graded" },
  { id: "gb_015", studentName: "Yaw Boateng", studentId: "STU005", class: "SSS 1", subject: "English Language", caScore: 20, examScore: 35, total: 55, grade: "C", position: 5, status: "graded" },
  { id: "gb_016", studentName: "Kwame Asante", studentId: "STU001", class: "SSS 1", subject: "Physics", caScore: 36, examScore: 54, total: 90, grade: "A", position: 1, status: "graded" },
  { id: "gb_017", studentName: "Ama Serwaa", studentId: "STU002", class: "SSS 1", subject: "Physics", caScore: 30, examScore: 42, total: 72, grade: "B", position: 3, status: "graded" },
  { id: "gb_018", studentName: "Kofi Mensah", studentId: "STU003", class: "SSS 1", subject: "Physics", caScore: 32, examScore: 48, total: 80, grade: "A", position: 2, status: "graded" },
  { id: "gb_019", studentName: "Adwoa Frimpong", studentId: "STU004", class: "SSS 1", subject: "Physics", caScore: 24, examScore: 30, total: 54, grade: "C", position: 4, status: "pending" },
  { id: "gb_020", studentName: "Yaw Boateng", studentId: "STU005", class: "SSS 1", subject: "Physics", caScore: 18, examScore: 25, total: 43, grade: "E", position: 5, status: "pending" },
];

// ============================================
// Exam Results (15 compiled student results)
// ============================================
export const examResults = [
  { id: "res_001", studentName: "Kwame Asante", studentId: "STU001", class: "SSS 1", totalScore: 504, avgScore: 84.0, gpa: 3.8, classPosition: 1, overallGrade: "A", term: "Term 2", status: "published" },
  { id: "res_002", studentName: "Ama Serwaa", studentId: "STU002", class: "SSS 1", totalScore: 474, avgScore: 79.0, gpa: 3.5, classPosition: 2, overallGrade: "B", term: "Term 2", status: "published" },
  { id: "res_003", studentName: "Kofi Mensah", studentId: "STU003", class: "SSS 1", totalScore: 440, avgScore: 73.3, gpa: 3.2, classPosition: 3, overallGrade: "B", term: "Term 2", status: "published" },
  { id: "res_004", studentName: "Adwoa Frimpong", studentId: "STU004", class: "SSS 1", totalScore: 396, avgScore: 66.0, gpa: 2.8, classPosition: 4, overallGrade: "C", term: "Term 2", status: "published" },
  { id: "res_005", studentName: "Yaw Boateng", studentId: "STU005", class: "SSS 1", totalScore: 324, avgScore: 54.0, gpa: 2.2, classPosition: 5, overallGrade: "C", term: "Term 2", status: "published" },
  { id: "res_006", studentName: "Akua Nyarko", studentId: "STU006", class: "SSS 1", totalScore: 348, avgScore: 58.0, gpa: 2.4, classPosition: 6, overallGrade: "C", term: "Term 2", status: "draft" },
  { id: "res_007", studentName: "Kwesi Adjei", studentId: "STU007", class: "SSS 1", totalScore: 312, avgScore: 52.0, gpa: 2.0, classPosition: 7, overallGrade: "D", term: "Term 2", status: "draft" },
  { id: "res_008", studentName: "Efua Owusu", studentId: "STU008", class: "SSS 1", totalScore: 276, avgScore: 46.0, gpa: 1.6, classPosition: 8, overallGrade: "D", term: "Term 2", status: "draft" },
  { id: "res_009", studentName: "Nana Agyemang", studentId: "STU011", class: "JSS 1", totalScore: 468, avgScore: 78.0, gpa: 3.4, classPosition: 1, overallGrade: "B", term: "Term 2", status: "published" },
  { id: "res_010", studentName: "Akosua Poku", studentId: "STU012", class: "JSS 1", totalScore: 450, avgScore: 75.0, gpa: 3.2, classPosition: 2, overallGrade: "B", term: "Term 2", status: "published" },
  { id: "res_011", studentName: "Kwabena Osei", studentId: "STU013", class: "JSS 2", totalScore: 492, avgScore: 82.0, gpa: 3.7, classPosition: 1, overallGrade: "A", term: "Term 2", status: "published" },
  { id: "res_012", studentName: "Afua Mensah", studentId: "STU014", class: "JSS 2", totalScore: 420, avgScore: 70.0, gpa: 3.0, classPosition: 2, overallGrade: "B", term: "Term 2", status: "published" },
  { id: "res_013", studentName: "Yaa Amoah", studentId: "STU015", class: "SSS 2", totalScore: 510, avgScore: 85.0, gpa: 3.9, classPosition: 1, overallGrade: "A", term: "Term 2", status: "published" },
  { id: "res_014", studentName: "Kweku Darko", studentId: "STU016", class: "SSS 2", totalScore: 456, avgScore: 76.0, gpa: 3.3, classPosition: 2, overallGrade: "B", term: "Term 2", status: "draft" },
  { id: "res_015", studentName: "Afia Boateng", studentId: "STU017", class: "SSS 3", totalScore: 528, avgScore: 88.0, gpa: 4.0, classPosition: 1, overallGrade: "A", term: "Term 2", status: "published" },
];

// ============================================
// Exam Grade Distribution (Donut Chart)
// ============================================
export const examGradeDistribution = [
  { grade: "A", count: 28, color: "#10B981", range: "70-100" },
  { grade: "B", count: 45, color: "#3B82F6", range: "60-69" },
  { grade: "C", count: 52, color: "#F59E0B", range: "50-59" },
  { grade: "D", count: 30, color: "#F97316", range: "45-49" },
  { grade: "E", count: 18, color: "#EF4444", range: "40-44" },
  { grade: "F", count: 12, color: "#6B7280", range: "0-39" },
];

// ============================================
// Subject Performance (8 subjects)
// ============================================
export const subjectPerformance = [
  { subject: "Mathematics", avgScore: 68.7, passRate: 82.5, highest: 96, lowest: 28, totalStudents: 185 },
  { subject: "English Language", avgScore: 72.3, passRate: 88.0, highest: 94, lowest: 32, totalStudents: 185 },
  { subject: "Integrated Science", avgScore: 65.4, passRate: 78.2, highest: 92, lowest: 25, totalStudents: 185 },
  { subject: "Social Studies", avgScore: 70.1, passRate: 85.0, highest: 90, lowest: 30, totalStudents: 185 },
  { subject: "Physics", avgScore: 62.8, passRate: 74.5, highest: 95, lowest: 22, totalStudents: 105 },
  { subject: "Chemistry", avgScore: 60.2, passRate: 71.0, highest: 91, lowest: 20, totalStudents: 105 },
  { subject: "Biology", avgScore: 67.5, passRate: 80.0, highest: 93, lowest: 27, totalStudents: 105 },
  { subject: "Economics", avgScore: 71.8, passRate: 86.5, highest: 97, lowest: 35, totalStudents: 70 },
];

// ============================================
// Class Performance (6 classes)
// ============================================
export const classPerformance = [
  { class: "JSS 1", avgScore: 72.5, passRate: 88.0, totalStudents: 45, topStudent: "Nana Agyemang" },
  { class: "JSS 2", avgScore: 70.2, passRate: 85.5, totalStudents: 42, topStudent: "Kwabena Osei" },
  { class: "JSS 3", avgScore: 68.8, passRate: 82.0, totalStudents: 40, topStudent: "Afia Mensah" },
  { class: "SSS 1", avgScore: 66.4, passRate: 78.5, totalStudents: 38, topStudent: "Kwame Asante" },
  { class: "SSS 2", avgScore: 64.1, passRate: 75.0, totalStudents: 35, topStudent: "Yaa Amoah" },
  { class: "SSS 3", avgScore: 71.0, passRate: 86.0, totalStudents: 32, topStudent: "Afia Boateng" },
];

// ============================================
// Exam Summary (Aggregates)
// ============================================
export const examSummary = {
  totalExams: 48,
  completedExams: 28,
  scheduledExams: 15,
  inProgressExams: 2,
  postponedExams: 3,
  passRate: 82.5,
  avgScore: 68.7,
  pendingGrades: 8,
  totalStudents: 232,
  studentsAssessed: 210,
  highestScore: 97,
  classAverage: 68.8,
  reportsGenerated: 180,
  reportsPending: 52,
  reportsDownloaded: 145,
  reportsPublished: 165,
};

// ============================================
// Termly Trend (3 terms)
// ============================================
export const termlyTrend = [
  { term: "Term 1", avgScore: 65.2, passRate: 78.0, caAvg: 24.5, examAvg: 40.7 },
  { term: "Term 2", avgScore: 68.7, passRate: 82.5, caAvg: 26.1, examAvg: 42.6 },
  { term: "Term 3", avgScore: 71.3, passRate: 85.0, caAvg: 27.8, examAvg: 43.5 },
];

// ============================================
// Top Students (Top 5)
// ============================================
export const topStudents = [
  { name: "Afia Boateng", class: "SSS 3", gpa: 4.0, avgScore: 88.0, position: 1 },
  { name: "Yaa Amoah", class: "SSS 2", gpa: 3.9, avgScore: 85.0, position: 2 },
  { name: "Kwame Asante", class: "SSS 1", gpa: 3.8, avgScore: 84.0, position: 3 },
  { name: "Kwabena Osei", class: "JSS 2", gpa: 3.7, avgScore: 82.0, position: 4 },
  { name: "Nana Agyemang", class: "JSS 1", gpa: 3.4, avgScore: 78.0, position: 5 },
];

// ============================================
// Grading Scale (6 grades)
// ============================================
export const gradingScale = [
  { grade: "A", min: 70, max: 100, description: "Excellent", gpaPoint: 4.0 },
  { grade: "B", min: 60, max: 69, description: "Very Good", gpaPoint: 3.0 },
  { grade: "C", min: 50, max: 59, description: "Good", gpaPoint: 2.0 },
  { grade: "D", min: 45, max: 49, description: "Pass", gpaPoint: 1.5 },
  { grade: "E", min: 40, max: 44, description: "Weak Pass", gpaPoint: 1.0 },
  { grade: "F", min: 0, max: 39, description: "Fail", gpaPoint: 0.0 },
];

// ============================================
// Report Cards (12 entries)
// ============================================
export const reportCards = [
  { id: "rc_001", studentName: "Kwame Asante", class: "SSS 1", term: "Term 2", avgScore: 84.0, position: "1st", status: "published", generatedDate: "2025-03-15", template: "standard" },
  { id: "rc_002", studentName: "Ama Serwaa", class: "SSS 1", term: "Term 2", avgScore: 79.0, position: "2nd", status: "published", generatedDate: "2025-03-15", template: "standard" },
  { id: "rc_003", studentName: "Kofi Mensah", class: "SSS 1", term: "Term 2", avgScore: 73.3, position: "3rd", status: "generated", generatedDate: "2025-03-14", template: "standard" },
  { id: "rc_004", studentName: "Adwoa Frimpong", class: "SSS 1", term: "Term 2", avgScore: 66.0, position: "4th", status: "generated", generatedDate: "2025-03-14", template: "standard" },
  { id: "rc_005", studentName: "Yaw Boateng", class: "SSS 1", term: "Term 2", avgScore: 54.0, position: "5th", status: "draft", generatedDate: "", template: "standard" },
  { id: "rc_006", studentName: "Nana Agyemang", class: "JSS 1", term: "Term 2", avgScore: 78.0, position: "1st", status: "published", generatedDate: "2025-03-13", template: "detailed" },
  { id: "rc_007", studentName: "Akosua Poku", class: "JSS 1", term: "Term 2", avgScore: 75.0, position: "2nd", status: "downloaded", generatedDate: "2025-03-13", template: "detailed" },
  { id: "rc_008", studentName: "Kwabena Osei", class: "JSS 2", term: "Term 2", avgScore: 82.0, position: "1st", status: "published", generatedDate: "2025-03-12", template: "standard" },
  { id: "rc_009", studentName: "Afua Mensah", class: "JSS 2", term: "Term 2", avgScore: 70.0, position: "2nd", status: "generated", generatedDate: "2025-03-12", template: "standard" },
  { id: "rc_010", studentName: "Yaa Amoah", class: "SSS 2", term: "Term 2", avgScore: 85.0, position: "1st", status: "downloaded", generatedDate: "2025-03-11", template: "detailed" },
  { id: "rc_011", studentName: "Kweku Darko", class: "SSS 2", term: "Term 2", avgScore: 76.0, position: "2nd", status: "draft", generatedDate: "", template: "standard" },
  { id: "rc_012", studentName: "Afia Boateng", class: "SSS 3", term: "Term 2", avgScore: 88.0, position: "1st", status: "published", generatedDate: "2025-03-10", template: "detailed" },
];


// ---------------------------------------------------------------------------
// Class roster helper
// ---------------------------------------------------------------------------
/** Active students enrolled in a class. Reads classEnrollments + students. */
export function classRoster(classId: string): Student[] {
  const ids = new Set(
    classEnrollments
      .filter((e) => e.classId === classId && e.status === "active")
      .map((e) => e.studentId)
  );
  return students.filter((s) => ids.has(s.id));
}

/**
 * Real teaching assignments for a staff member, derived from the class links
 * (homeroom via class.classTeacherId, subjects via classSubject.teacherIds).
 * Replaces the old denormalised classesAssigned count. Scoped per class to its
 * own session/term.
 */
export function staffAssignments(staffId: string): StaffAssignment[] {
  const out: StaffAssignment[] = [];
  for (const c of classes) {
    if (c.classTeacherId === staffId) {
      out.push({
        staffId,
        classId: c.id,
        className: c.name,
        subjectId: null,
        role: "homeroom",
        academicSession: c.academicSession,
        term: c.currentTerm,
      });
    }
  }
  for (const cs of classSubjects) {
    if (!cs.teacherIds.includes(staffId)) continue;
    const c = classes.find((x) => x.id === cs.classId);
    if (!c) continue;
    const role: AssignmentRole = cs.teacherIds.length > 1 ? "co_teacher" : "subject";
    out.push({
      staffId,
      classId: c.id,
      className: c.name,
      subjectId: cs.subjectId,
      role,
      academicSession: c.academicSession,
      term: c.currentTerm,
    });
  }
  return out;
}
