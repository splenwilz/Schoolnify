// Navigation links for the marketing site
export const NAV_LINKS = [
  { name: "Features", href: "/features" },
  { name: "Pricing", href: "/pricing" },
  { name: "Docs", href: "/docs" },
  { name: "Downloads", href: "/download" },
] as const

// Demo data for features
export const FEATURES = [
  {
    id: "academic",
    title: "Academic Management",
    description: "Complete class management, assignments, grading, and attendance tracking in one place.",
    icon: "GraduationCap",
    items: [
      "Class & section management",
      "Assignment creation & submission",
      "Automated grading system",
      "Attendance tracking",
      "Report card generation",
      "Exam scheduling",
    ],
  },
  {
    id: "users",
    title: "Multi-Role Support",
    description: "Tailored dashboards and permissions for every stakeholder in the school ecosystem.",
    icon: "Users",
    items: [
      "Admin dashboard",
      "Teacher portal",
      "Student access",
      "Parent monitoring",
      "Staff management",
      "Role-based permissions",
    ],
  },
  {
    id: "finance",
    title: "Financial Management",
    description: "Streamline fee collection, track payments, and generate financial reports effortlessly.",
    icon: "Wallet",
    items: [
      "Fee structure setup",
      "Online payments (Stripe, PayPal)",
      "Payment reminders",
      "Receipt generation",
      "Financial reports",
      "Scholarship management",
    ],
  },
  {
    id: "communication",
    title: "Communication Hub",
    description: "Keep everyone connected with announcements, messaging, and notifications.",
    icon: "MessageSquare",
    items: [
      "School-wide announcements",
      "Direct messaging",
      "Push notifications",
      "Email alerts",
      "Parent-teacher chat",
      "Event notifications",
    ],
  },
  {
    id: "offline",
    title: "Offline-First",
    description: "Works without internet and syncs automatically when connected. Perfect for any environment.",
    icon: "WifiOff",
    items: [
      "Works without internet",
      "Automatic sync",
      "Local data storage",
      "Conflict resolution",
      "Background sync",
      "Low bandwidth optimized",
    ],
  },
  {
    id: "analytics",
    title: "Reports & Analytics",
    description: "Make data-driven decisions with comprehensive dashboards and exportable reports.",
    icon: "BarChart3",
    items: [
      "Performance dashboards",
      "Attendance analytics",
      "Grade distributions",
      "Financial summaries",
      "Custom reports",
      "Excel/PDF exports",
    ],
  },
] as const

// Demo data for pricing plans
export const PRICING_PLANS = [
  {
    name: "Starter",
    description: "Perfect for small schools just getting started",
    price: "$29",
    period: "/month",
    yearlyPrice: "$290",
    yearlyPeriod: "/year",
    features: [
      "Up to 200 students",
      "5 staff accounts",
      "Basic academic management",
      "Attendance tracking",
      "Parent portal",
      "Email support",
    ],
    cta: "Start Free Trial",
    popular: false,
  },
  {
    name: "Professional",
    description: "For growing schools with more needs",
    price: "$79",
    period: "/month",
    yearlyPrice: "$790",
    yearlyPeriod: "/year",
    features: [
      "Up to 1,000 students",
      "Unlimited staff",
      "Full academic suite",
      "Financial management",
      "Push notifications",
      "Offline mode",
      "Priority support",
      "Custom reports",
    ],
    cta: "Start Free Trial",
    popular: true,
  },
  {
    name: "Enterprise",
    description: "For large institutions with custom needs",
    price: "Custom",
    period: "",
    yearlyPrice: "Custom",
    yearlyPeriod: "",
    features: [
      "Unlimited students",
      "Unlimited staff",
      "All features included",
      "Multi-campus support",
      "API access",
      "Dedicated support",
      "Custom integrations",
      "On-premise option",
    ],
    cta: "Contact Sales",
    popular: false,
  },
] as const

// Demo data for testimonials
export const TESTIMONIALS = [
  {
    quote: "Schoolnify transformed how we manage our school. The offline feature is a game-changer for us.",
    author: "Sarah Mitchell",
    role: "Principal",
    school: "Greenwood Academy, California",
    avatar: "/avatars/avatar-1.jpg",
  },
  {
    quote: "Parents love being able to track their children's progress in real-time. Communication has never been easier.",
    author: "James Anderson",
    role: "School Administrator",
    school: "Brighton International School, London",
    avatar: "/avatars/avatar-2.jpg",
  },
  {
    quote: "The fee collection feature alone has saved us countless hours. Highly recommend for any school.",
    author: "Dr. Maria Santos",
    role: "Director",
    school: "St. Augustine Preparatory, Toronto",
    avatar: "/avatars/avatar-3.jpg",
  },
] as const

// Demo data for stats
export const STATS = [
  { value: "10,000+", label: "Schools" },
  { value: "2M+", label: "Students" },
  { value: "99.9%", label: "Uptime" },
  { value: "4.9/5", label: "Rating" },
] as const

// Footer links
export const FOOTER_LINKS = {
  product: [
    { name: "Features", href: "/features" },
    { name: "Pricing", href: "/pricing" },
    { name: "Download", href: "/download" },
    { name: "Changelog", href: "/changelog" },
  ],
  resources: [
    { name: "Documentation", href: "/docs" },
    { name: "Getting Started", href: "/docs/quick-start" },
    { name: "Support", href: "/support" },
  ],
  legal: [
    { name: "Privacy", href: "/privacy" },
    { name: "Terms", href: "/terms" },
  ],
} as const
