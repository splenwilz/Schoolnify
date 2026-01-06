import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme/theme-provider"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: {
    default: "Schoolnify - School Management Software",
    template: "%s | Schoolnify",
  },
  description:
    "The school management software educators trust. Manage students, track attendance, handle payments, and communicate with parents. Trusted by 10,000+ schools worldwide.",
  keywords: [
    "school management system",
    "school software",
    "education technology",
    "student management",
    "attendance tracking",
    "grade management",
    "offline first",
    "school administration",
  ],
  authors: [{ name: "Schoolnify" }],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://schoolnify.com",
    title: "Schoolnify - School Management Software",
    description:
      "The school management software educators trust. Trusted by 10,000+ schools worldwide.",
    siteName: "Schoolnify",
  },
  twitter: {
    card: "summary_large_image",
    title: "Schoolnify - School Management Software",
    description:
      "The school management software educators trust. Trusted by 10,000+ schools worldwide.",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen`}
      >
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
