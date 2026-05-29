"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "@/components/theme/theme-toggle";

interface SchoolNavbarProps {
  schoolName: string;
  slug: string;
}

export function SchoolNavbar({ schoolName, slug }: SchoolNavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  const base = `/schools/${slug}`;
  const links = [
    { href: base, label: "Home" },
    { href: `${base}/apply`, label: "Apply" },
    { href: `${base}/apply/track`, label: "Track" },
    { href: `${base}#contact`, label: "Contact" },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isLinkActive = (href: string) => {
    if (href.includes("#")) return false;
    if (href === base) return pathname === base;
    return pathname.startsWith(href);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-4 pt-4">
      <nav
        className={`
          max-w-5xl mx-auto rounded-2xl border transition-all duration-300
          ${scrolled
            ? "bg-[var(--background)]/95 backdrop-blur-xl border-[var(--border)] shadow-lg"
            : "bg-[var(--background)]/60 backdrop-blur-md border-[var(--border)]/50"
          }
        `}
        style={{ boxShadow: scrolled ? "0 10px 40px var(--shadow-color)" : "none" }}
      >
        <div className="px-4 sm:px-6 h-14 flex items-center justify-between gap-4">
          {/* School Name */}
          <Link href={base} className="flex items-center gap-3 group">
            <div className="relative">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#0891B2] to-[#0E7490] flex items-center justify-center shadow-lg shadow-[#0891B2]/20 group-hover:shadow-[#0891B2]/40 transition-shadow">
                <span className="text-white font-bold text-sm">
                  {schoolName
                    .split(" ")
                    .map((w) => w[0])
                    .join("")
                    .slice(0, 2)}
                </span>
              </div>
            </div>
            <div className="hidden sm:block">
              <span className="font-bold text-[var(--foreground)] tracking-tight text-sm">
                {schoolName}
              </span>
            </div>
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center p-1 rounded-full bg-[var(--background-secondary)]/50 border border-[var(--border)]/50">
            {links.map((link) => {
              const active = isLinkActive(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`
                    relative px-4 py-1.5 text-sm font-medium rounded-full transition-all duration-200
                    ${active
                      ? "text-white bg-[#0891B2]"
                      : "text-[var(--muted)] hover:text-[var(--foreground)] hover:bg-[var(--card-hover)]"
                    }
                  `}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>

          {/* Right side */}
          <div className="flex items-center gap-2">
            <ThemeToggle />

            <Link
              href={`${base}/apply`}
              className="hidden sm:flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg bg-gradient-to-r from-[#0891B2] to-[#0E7490] text-white hover:from-[#0E7490] hover:to-[#0891B2] transition-all shadow-lg shadow-[#0891B2]/20 hover:shadow-[#0891B2]/40 hover:scale-[1.02]"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Apply Now
            </Link>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-[var(--muted)] hover:text-[var(--foreground)] rounded-lg hover:bg-[var(--card-hover)] transition-colors"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div
          className={`
            md:hidden overflow-hidden transition-all duration-300 ease-in-out
            ${mobileMenuOpen ? "max-h-[400px] opacity-100" : "max-h-0 opacity-0"}
          `}
        >
          <div className="px-4 pb-4 pt-2 border-t border-[var(--border)]/50">
            <div className="space-y-1 mb-4">
              {links.map((link) => {
                const active = isLinkActive(link.href);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`
                      flex items-center gap-3 px-4 py-3 text-sm rounded-xl transition-colors
                      ${active
                        ? "bg-[#0891B2]/20 text-[#22D3EE]"
                        : "text-[var(--foreground-secondary)] hover:bg-[var(--card-hover)] hover:text-[var(--foreground)]"
                      }
                    `}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </div>

            <Link
              href={`${base}/apply`}
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-center gap-2 px-4 py-3 text-sm font-semibold bg-gradient-to-r from-[#0891B2] to-[#0E7490] text-white rounded-xl hover:from-[#0E7490] hover:to-[#0891B2] transition-all"
            >
              Apply Now
            </Link>
          </div>
        </div>
      </nav>
    </header>
  );
}
