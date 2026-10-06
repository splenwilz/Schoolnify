export interface TourStep {
  id: string;
  /** CSS selector to find the target element, or null for a center modal */
  target: string | null;
  title: string;
  description: string;
  placement: "top" | "bottom" | "left" | "right" | "center";
  /** If true, step is skipped on mobile where sidebar is hidden */
  requiresSidebar?: boolean;
}

export const SCHOOL_ADMIN_TOUR_STEPS: TourStep[] = [
  {
    id: "welcome",
    target: null,
    title: "Welcome to Schoolnify!",
    description:
      "Let's take a quick tour of your dashboard. We'll show you where everything is so you can hit the ground running.",
    placement: "center",
  },
  {
    id: "sidebar",
    target: '[data-tour-id="sidebar"]',
    title: "Your Navigation Hub",
    description:
      "This sidebar gives you quick access to every part of your school management system. organized by what you use most.",
    placement: "right",
    requiresSidebar: true,
  },
  {
    id: "students",
    target: '[data-tour-id="nav-students"]',
    title: "Student Management",
    description:
      "View, add, and manage all your students. Track enrollment, profiles, and academic records in one place.",
    placement: "right",
    requiresSidebar: true,
  },
  {
    id: "attendance",
    target: '[data-tour-id="nav-attendance"]',
    title: "Attendance Tracking",
    description:
      "Mark and monitor attendance daily. Get real-time insights into student presence and absence patterns.",
    placement: "right",
    requiresSidebar: true,
  },
  {
    id: "finances",
    target: '[data-tour-id="nav-finances"]',
    title: "Fee Management",
    description:
      "Track fee payments, generate invoices, and manage your school's financial health all from here.",
    placement: "right",
    requiresSidebar: true,
  },
  {
    id: "setup",
    target: '[data-tour-id="nav-setup"]',
    title: "School Setup",
    description:
      "Configure your school's identity, academic structure, grading policy, and regional settings. everything needed to get your school fully operational.",
    placement: "right",
    requiresSidebar: true,
  },
  {
    id: "settings",
    target: '[data-tour-id="nav-settings"]',
    title: "School Settings",
    description:
      "Manage your school profile, notifications, security, billing, and team preferences.",
    placement: "right",
    requiresSidebar: true,
  },
  {
    id: "complete",
    target: null,
    title: "You're All Set!",
    description:
      "That's the tour! Head to School Setup to configure your academic structure, grading, and regional settings. You can restart this tour anytime from Help & Support.",
    placement: "center",
  },
];

export const TOUR_STORAGE_KEYS = {
  completed: "schoolnify_tour_completed",
  currentStep: "schoolnify_tour_step",
  bannerDismissed: "schoolnify_welcome_banner_dismissed",
} as const;
