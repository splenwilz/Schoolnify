"use client";

import Link from "next/link";
import { useState } from "react";

const plans = [
  {
    name: "Starter",
    description: "Perfect for small schools getting started",
    monthlyPrice: 29,
    yearlyPrice: 24,
    period: "/month",
    features: [
      { text: "Up to 200 students", included: true },
      { text: "5 staff accounts", included: true },
      { text: "Basic academic management", included: true },
      { text: "Attendance tracking", included: true },
      { text: "Parent portal", included: true },
      { text: "Email support", included: true },
      { text: "Offline mode", included: false },
      { text: "Payment integration", included: false },
    ],
    cta: "Start Free Trial",
    ctaLink: "/register",
    highlighted: false,
    icon: "🎯",
  },
  {
    name: "Professional",
    description: "For growing schools with advanced needs",
    monthlyPrice: 79,
    yearlyPrice: 65,
    period: "/month",
    badge: "Most Popular",
    features: [
      { text: "Up to 1,000 students", included: true },
      { text: "Unlimited staff accounts", included: true },
      { text: "Full academic suite", included: true },
      { text: "Financial management", included: true },
      { text: "Push notifications", included: true },
      { text: "Offline mode", included: true },
      { text: "Priority support", included: true },
      { text: "Custom reports", included: true },
    ],
    cta: "Start 14-Day Free Trial",
    ctaLink: "/register",
    highlighted: true,
    icon: "⚡",
  },
  {
    name: "Enterprise",
    description: "For large institutions and school groups",
    monthlyPrice: null,
    yearlyPrice: null,
    period: "",
    features: [
      { text: "Unlimited students", included: true },
      { text: "Unlimited staff", included: true },
      { text: "All features included", included: true },
      { text: "Multi-campus support", included: true },
      { text: "API access", included: true },
      { text: "Dedicated support manager", included: true },
      { text: "Custom integrations", included: true },
      { text: "On-premise option", included: true },
    ],
    cta: "Contact Sales",
    ctaLink: "/contact",
    highlighted: false,
    icon: "🏫",
  },
];

const faqs = [
  {
    question: "Is there a free trial?",
    answer: "Yes! All paid plans come with a 14-day free trial. No credit card required. You can explore all features before committing.",
  },
  {
    question: "Can I cancel anytime?",
    answer: "Absolutely. Cancel anytime from your dashboard with no questions asked. Your data remains accessible for 30 days after cancellation.",
  },
  {
    question: "Do you charge per student?",
    answer: "No. Our plans are based on student capacity, not per-student fees. Add or remove students within your plan's limit at no extra cost.",
  },
  {
    question: "What payment methods do you accept?",
    answer: "We accept all major credit cards (Visa, Mastercard, Amex), PayPal, and bank transfers for annual plans.",
  },
  {
    question: "Is there a discount for annual billing?",
    answer: "Yes! Pay annually and save about 18%. That's equivalent to getting 2 months free. Plus, you get priority support.",
  },
  {
    question: "Do you offer discounts for public schools?",
    answer: "Yes, we offer special pricing for registered non-profits, public schools, and educational institutions. Contact our sales team to learn more.",
  },
];

const comparisonFeatures = [
  { name: "Number of Students", starter: "200", pro: "1,000", enterprise: "Unlimited" },
  { name: "Staff Accounts", starter: "5", pro: "Unlimited", enterprise: "Unlimited" },
  { name: "Academic Management", starter: "Basic", pro: "Full Suite", enterprise: "Full Suite + Custom" },
  { name: "Financial Management", starter: "-", pro: "✓", enterprise: "✓ Advanced" },
  { name: "Offline Mode", starter: "-", pro: "✓", enterprise: "✓" },
  { name: "Push Notifications", starter: "-", pro: "✓", enterprise: "✓" },
  { name: "Custom Reports", starter: "-", pro: "✓", enterprise: "✓" },
  { name: "API Access", starter: "-", pro: "-", enterprise: "✓" },
  { name: "Multi-Campus", starter: "-", pro: "-", enterprise: "✓" },
  { name: "Support", starter: "Email", pro: "Priority", enterprise: "Dedicated Manager" },
];

export default function PricingPage() {
  const [isAnnual, setIsAnnual] = useState(true);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      {/* Hero Section */}
      <section className="relative pt-32 pb-16 px-6 overflow-hidden">
        {/* Background glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[#0891B2]/10 blur-[150px] rounded-full" />
        
        <div className="relative max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#10B981]/10 border border-[#10B981]/20 text-[#10B981] text-sm font-medium mb-6">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            14-day free trial on all plans
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
            Simple pricing,<br />
            <span className="text-[#0891B2]">powerful features</span>
          </h1>
          <p className="text-xl text-[var(--muted)] max-w-2xl mx-auto mb-10">
            Start free, upgrade when you&apos;re ready. No hidden fees, no surprises. 
            Cancel anytime.
          </p>

          {/* Billing Toggle */}
          <div className="inline-flex items-center gap-4 p-1.5 rounded-full bg-[var(--card)] border border-[var(--border)]">
            <button
              onClick={() => setIsAnnual(false)}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${
                !isAnnual 
                  ? "bg-white text-black" 
                  : "text-[var(--muted)] hover:text-[var(--foreground)]"
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setIsAnnual(true)}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-2 ${
                isAnnual 
                  ? "bg-white text-black" 
                  : "text-[var(--muted)] hover:text-[var(--foreground)]"
              }`}
            >
              Annual
              <span className={`text-xs px-2 py-0.5 rounded-full ${
                isAnnual 
                  ? "bg-[#10B981] text-white" 
                  : "bg-[#10B981]/20 text-[#10B981]"
              }`}>
                Save 18%
              </span>
            </button>
          </div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="px-6 pb-24">
        <div className="max-w-5xl mx-auto">
          <div className="grid lg:grid-cols-3 gap-6">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`relative rounded-2xl p-8 transition-all ${
                  plan.highlighted
                    ? "bg-gradient-to-b from-[#0891B2]/20 to-[var(--card)] border-2 border-[#0891B2]/50 scale-105 lg:-mt-4 lg:mb-4 shadow-xl shadow-[#0891B2]/10"
                    : "bg-[var(--card)] border border-[var(--border)] hover:border-[var(--border)]"
                }`}
              >
                {/* Badge */}
                {plan.badge && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <span className="px-4 py-1.5 rounded-full bg-[#0891B2] text-white text-sm font-semibold shadow-lg shadow-[#0891B2]/30">
                      {plan.badge}
                    </span>
                  </div>
                )}

                {/* Header */}
                <div className="mb-6">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-3xl">{plan.icon}</span>
                    <h3 className="text-xl font-bold">{plan.name}</h3>
                  </div>
                  <p className="text-sm text-[var(--muted)]">{plan.description}</p>
                </div>

                {/* Price */}
                <div className="mb-8">
                  {plan.monthlyPrice !== null ? (
                    <>
                      <div className="flex items-baseline gap-1">
                        <span className="text-5xl font-bold">
                          ${isAnnual ? plan.yearlyPrice : plan.monthlyPrice}
                        </span>
                        <span className="text-[var(--muted)]">{plan.period}</span>
                      </div>
                      {plan.monthlyPrice > 0 && (
                        <p className="text-sm text-[var(--muted)] mt-1">
                          {isAnnual 
                            ? `Billed $${plan.yearlyPrice! * 12}/year` 
                            : "Billed monthly"
                          }
                        </p>
                      )}
                    </>
                  ) : (
                    <div className="flex items-baseline gap-1">
                      <span className="text-4xl font-bold">Custom</span>
                    </div>
                  )}
                </div>

                {/* CTA */}
                <Link
                  href={plan.ctaLink}
                  className={`block w-full py-3.5 rounded-xl font-semibold text-center transition-all mb-8 ${
                    plan.highlighted
                      ? "bg-[#0891B2] text-white hover:bg-[#0E7490] shadow-lg shadow-[#0891B2]/30 hover:shadow-[#0891B2]/50"
                      : "bg-[var(--foreground)] text-[var(--background)] hover:opacity-90"
                  }`}
                >
                  {plan.cta}
                </Link>

                {/* Features */}
                <ul className="space-y-3">
                  {plan.features.map((feature) => (
                    <li 
                      key={feature.text} 
                      className={`flex items-center gap-3 text-sm ${
                        feature.included ? "text-[var(--foreground)]" : "text-[var(--muted)]"
                      }`}
                    >
                      {feature.included ? (
                        <svg className="w-5 h-5 text-[#10B981] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      ) : (
                        <svg className="w-5 h-5 text-zinc-700 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      )}
                      {feature.text}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="px-6 pb-24">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { icon: "🔒", title: "Secure Data", desc: "Bank-level encryption" },
              { icon: "💸", title: "Money-Back", desc: "30-day guarantee" },
              { icon: "🚀", title: "Instant Setup", desc: "Start in minutes" },
              { icon: "💬", title: "24/7 Support", desc: "Always here to help" },
            ].map((badge) => (
              <div key={badge.title} className="p-6 rounded-xl bg-[var(--card)] border border-[var(--border)]">
                <div className="text-3xl mb-3">{badge.icon}</div>
                <h3 className="font-semibold mb-1">{badge.title}</h3>
                <p className="text-sm text-[var(--muted)]">{badge.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Feature Comparison Table */}
      <section className="px-6 pb-24">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-4">
            Compare plans
          </h2>
          <p className="text-[var(--muted)] text-center mb-12">
            Find the perfect plan for your school
          </p>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[var(--border)]">
                  <th className="text-left py-4 px-4 font-medium text-[var(--muted)]">Feature</th>
                  <th className="text-center py-4 px-4 font-medium text-[var(--muted)]">Starter</th>
                  <th className="text-center py-4 px-4 font-medium text-[#0891B2] bg-[#0891B2]/5 rounded-t-lg">Professional</th>
                  <th className="text-center py-4 px-4 font-medium text-[var(--muted)]">Enterprise</th>
                </tr>
              </thead>
              <tbody>
                {comparisonFeatures.map((feature, index) => (
                  <tr 
                    key={feature.name} 
                    className={`border-b border-[var(--border)]/50 ${index % 2 === 0 ? "" : "bg-[var(--background-secondary)]/50"}`}
                  >
                    <td className="py-4 px-4 text-sm">{feature.name}</td>
                    <td className="py-4 px-4 text-sm text-center text-[var(--muted)]">{feature.starter}</td>
                    <td className="py-4 px-4 text-sm text-center bg-[#0891B2]/5 font-medium">{feature.pro}</td>
                    <td className="py-4 px-4 text-sm text-center text-[var(--muted)]">{feature.enterprise}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Testimonial */}
      <section className="px-6 pb-24">
        <div className="max-w-3xl mx-auto">
          <div className="relative p-10 rounded-2xl bg-gradient-to-br from-[#0891B2]/10 to-[var(--card)] border border-[#0891B2]/20">
            {/* Quote mark */}
            <svg className="absolute top-6 left-8 w-10 h-10 text-[#0891B2]/20" fill="currentColor" viewBox="0 0 24 24">
              <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
            </svg>
            
            <blockquote className="text-xl text-zinc-200 leading-relaxed mb-6 relative z-10">
              &ldquo;Switching to Schoolnify Professional was the best decision we made. We saved 20 hours 
              per week on administrative tasks. The parent portal alone is worth the price.&rdquo;
            </blockquote>
            
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#0891B2] to-[#0E7490] flex items-center justify-center text-white font-bold">
                JM
              </div>
              <div>
                <div className="font-semibold">Jennifer Martinez</div>
                <div className="text-sm text-[var(--muted)]">Principal, Sunrise Academy · 850 students</div>
              </div>
              <div className="ml-auto flex gap-0.5">
                {[1, 2, 3, 4, 5].map((star) => (
                  <svg key={star} className="w-5 h-5 text-[#F59E0B]" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQs - Two Column Layout */}
      <section className="px-6 pb-24 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute top-1/2 left-0 w-[400px] h-[400px] bg-[#0891B2]/5 blur-[150px] rounded-full -translate-y-1/2" />
        
        <div className="relative max-w-5xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#0891B2]/10 border border-[#0891B2]/20 text-[#22D3EE] text-sm font-medium mb-6">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Got Questions?
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Frequently asked questions
            </h2>
            <p className="text-[var(--muted)] max-w-lg mx-auto">
              Everything you need to know about our pricing
            </p>
          </div>

          {/* FAQ Grid - Two columns on desktop */}
          <div className="grid md:grid-cols-2 gap-4">
            {faqs.map((faq, index) => (
              <div 
                key={faq.question}
                className={`group rounded-2xl border overflow-hidden transition-all ${
                  openFaq === index 
                    ? "bg-[#0891B2]/5 border-[#0891B2]/30" 
                    : "bg-[var(--card)] border-[var(--border)] hover:border-[var(--border)]"
                }`}
              >
                <button
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  className="w-full flex items-start gap-4 p-6 text-left"
                >
                  {/* Number badge */}
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold shrink-0 transition-colors ${
                    openFaq === index 
                      ? "bg-[#0891B2] text-white" 
                      : "bg-[var(--background-secondary)] text-[var(--muted)] group-hover:bg-[#0891B2]/20 group-hover:text-[#0891B2]"
                  }`}>
                    {String(index + 1).padStart(2, "0")}
                  </div>
                  <div className="flex-1">
                    <span className={`font-semibold block transition-colors ${
                      openFaq === index ? "text-[#22D3EE]" : "text-[var(--foreground)] group-hover:text-[#22D3EE]"
                    }`}>
                      {faq.question}
                    </span>
                  </div>
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-all ${
                    openFaq === index 
                      ? "bg-[#0891B2]/20 rotate-180" 
                      : "bg-[var(--background-secondary)] group-hover:bg-[var(--border)]"
                  }`}>
                    <svg 
                      className="w-4 h-4 text-[var(--muted)]" 
                      fill="none" 
                      viewBox="0 0 24 24" 
                      stroke="currentColor" 
                      strokeWidth={2}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </button>
                <div className={`overflow-hidden transition-all duration-300 ${
                  openFaq === index ? "max-h-40 opacity-100" : "max-h-0 opacity-0"
                }`}>
                  <div className="px-6 pb-6 pl-[4.5rem] text-[var(--muted)] leading-relaxed">
                    {faq.answer}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Still have questions */}
          <div className="mt-12 text-center">
            <div className="inline-flex items-center gap-4 p-4 rounded-2xl bg-[var(--card)] border border-[var(--border)]">
              <div className="w-12 h-12 rounded-xl bg-[#0891B2]/10 flex items-center justify-center">
                <svg className="w-6 h-6 text-[#0891B2]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <div className="text-left">
                <p className="font-medium text-[var(--foreground)]">Still have questions?</p>
                <p className="text-sm text-[var(--muted)]">Our team is here to help</p>
              </div>
              <Link 
                href="/contact" 
                className="ml-4 px-5 py-2.5 rounded-xl bg-[#0891B2] text-white font-semibold hover:bg-[#0E7490] transition-colors"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA - Split Layout */}
      <section className="px-6 pb-32">
        <div className="max-w-5xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-0 rounded-3xl overflow-hidden border border-[var(--border)]">
            {/* Left side - Content */}
            <div className="bg-[var(--card)] p-10 md:p-14 flex flex-col justify-center">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#10B981]/10 border border-[#10B981]/20 text-[#10B981] text-xs font-medium w-fit mb-6">
                <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-pulse" />
                Start in under 5 minutes
              </div>
              
              <h2 className="text-3xl sm:text-4xl font-bold mb-4 leading-tight">
                Ready to transform your school?
              </h2>
              
              <p className="text-[var(--muted)] mb-8 leading-relaxed">
                Download Schoolnify and start your 14-day free trial. 
                No credit card required, cancel anytime.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 mb-8">
                <Link
                  href="/download"
                  className="px-6 py-3.5 rounded-xl bg-[#0891B2] text-white font-semibold hover:bg-[#0E7490] transition-all hover:scale-[1.02] flex items-center justify-center gap-2 shadow-lg shadow-[#0891B2]/20"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  Download Free
                </Link>
                <Link
                  href="/contact"
                  className="px-6 py-3.5 rounded-xl border border-[var(--border)] text-[var(--foreground)] font-semibold hover:bg-[var(--background-secondary)] transition-all flex items-center justify-center gap-2"
                >
                  Contact Sales
                </Link>
              </div>

              {/* Trust indicators */}
              <div className="flex flex-wrap gap-4 text-sm text-[var(--muted)]">
                <span className="flex items-center gap-1.5">
                  <svg className="w-4 h-4 text-[#10B981]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  Free trial
                </span>
                <span className="flex items-center gap-1.5">
                  <svg className="w-4 h-4 text-[#10B981]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  No credit card
                </span>
                <span className="flex items-center gap-1.5">
                  <svg className="w-4 h-4 text-[#10B981]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  Cancel anytime
                </span>
              </div>
            </div>

            {/* Right side - Visual */}
            <div className="relative bg-gradient-to-br from-[#0891B2] to-[#0E7490] p-10 md:p-14 hidden lg:flex items-center justify-center">
              {/* Decorative circles */}
              <div className="absolute top-6 right-6 w-20 h-20 rounded-full border border-white/10" />
              <div className="absolute bottom-6 left-6 w-32 h-32 rounded-full border border-white/10" />
              <div className="absolute top-1/2 left-1/4 w-16 h-16 rounded-full bg-white/5" />

              {/* Stats card */}
              <div className="relative bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 w-full max-w-xs">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-white/60 text-xs">Your potential</div>
                    <div className="text-white font-semibold">Time Saved</div>
                  </div>
                </div>
                
                <div className="text-4xl font-bold text-white mb-2">20+ hrs</div>
                <div className="flex items-center gap-2 text-sm text-white/70 mb-6">
                  <span className="px-2 py-0.5 rounded bg-[#10B981]/20 text-[#10B981] text-xs font-medium">Per Week</span>
                  on admin tasks
                </div>

                {/* Mini stats */}
                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/10">
                  <div>
                    <div className="text-2xl font-bold text-white">10,000+</div>
                    <div className="text-xs text-white/50">Schools trust us</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-white">99.9%</div>
                    <div className="text-xs text-white/50">Uptime SLA</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
