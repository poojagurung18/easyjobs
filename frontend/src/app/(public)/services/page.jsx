import CTABanner from "@/components/home/CTABanner";
import Link from "next/link";

const seekerServices = [
  { icon: "📝", title: "Profile Creation", desc: "Build a professional profile to showcase your skills, education, and experience to potential employers." },
  { icon: "🎯", title: "Job Recommendations", desc: "Receive personalized job suggestions based on your profile, skills, and browsing history." },
  { icon: "📊", title: "Application Tracking", desc: "Follow every application through: Applied → Shortlisted → Interview → Decision." },
  { icon: "⚡", title: "One-Click Apply", desc: "Apply to multiple jobs instantly with your saved profile. No need to re-fill forms." },
];

const recruiterServices = [
  { icon: "📋", title: "Job Posting", desc: "Post detailed job listings and reach thousands of qualified, verified candidates." },
  { icon: "🗂️", title: "Applicant Management", desc: "View, shortlist, and reject candidates easily. Export reports and track progress." },
  { icon: "📅", title: "Interview Scheduling", desc: "Coordinate interview slots directly with shortlisted candidates from the dashboard." },
  { icon: "🏷️", title: "Company Profile", desc: "Showcase your company culture, logo, team photos, and benefits to attract top talent." },
];

const adminServices = [
  { icon: "🖥️", title: "Platform Monitoring", desc: "Manage all users, track active jobs, and oversee company registrations in real time." },
  { icon: "🚩", title: "Report Handling", desc: "Review fake recruiter reports and take action — ban or suspend accounts as needed." },
  { icon: "📈", title: "Analytics Dashboard", desc: "View platform-wide statistics including signups, job activity, and application trends." },
  { icon: "🔔", title: "Notifications", desc: "Send platform-wide announcements or targeted alerts to specific user groups." },
];

const plans = [
  {
    name: "Free",
    price: "0",
    period: "forever",
    features: ["Post up to 3 job listings", "Basic applicant management", "Standard company profile", "Email support"],
    cta: "Get Started",
    featured: false,
  },
  {
    name: "Premium",
    price: "999",
    period: "per month",
    features: ["Unlimited job posts", "Advanced applicant filtering", "Priority listing placement", "Analytics & reports", "Verified recruiter badge", "Priority support"],
    cta: "Start Free Trial",
    featured: true,
  },
  {
    name: "Enterprise",
    price: "2,499",
    period: "per month",
    features: ["Everything in Premium", "Dedicated account manager", "Custom branding options", "API access", "Bulk job posting", "SLA guarantee"],
    cta: "Contact Sales",
    featured: false,
  },
];

function ServiceCard({ icon, title, desc }) {
  return (
    <div className="bg-surface border border-border rounded-2xl p-6 hover:shadow-md hover:border-brand-primary/20 transition-all">
      <div className="text-2xl mb-4">{icon}</div>
      <h4 className="font-bold text-brand-primary text-sm mb-2">{title}</h4>
      <p className="text-text-secondary text-sm leading-relaxed">{desc}</p>
    </div>
  );
}

function SectionDivider({ icon, label, color }) {
  return (
    <div className="flex items-center gap-3 mb-6">
      <div className={`w-7 h-7 ${color} rounded-md flex items-center justify-center`}>
        <span className="text-white text-xs">{icon}</span>
      </div>
      <h3 className="font-bold text-text-primary text-base">{label}</h3>
      <div className="flex-1 h-px bg-border"></div>
    </div>
  );
}

export default function ServicesPage() {
  return (
    <main>
      {/* Hero */}
      <section className="bg-background py-24 text-center">
        <div className="max-w-3xl mx-auto px-6">
          <span className="inline-block text-xs font-bold text-brand-secondary bg-brand-secondary/10 border border-brand-secondary/30 px-3 py-1.5 rounded-full uppercase tracking-widest mb-4">
            Our Services
          </span>
          <h1 className="text-4xl md:text-5xl font-extrabold text-primary tracking-tight mb-5">
            Everything You Need to
            <br />
            Hire or Get Hired
          </h1>
          <p className="text-secondary text-base leading-relaxed max-w-xl mx-auto">
            Powerful tools for job seekers, recruiters, and platform
            administrators — all under one roof.
          </p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="bg-background py-20">
        <div className="max-w-7xl mx-auto px-6 space-y-14">
          <div>
            <SectionDivider icon="👤" label="For Job Seekers" color="bg-brand-primary" />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {seekerServices.map((s) => <ServiceCard key={s.title} {...s} />)}
            </div>
          </div>

          <div>
            <SectionDivider icon="🏢" label="For Recruiters" color="bg-purple-600" />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {recruiterServices.map((s) => <ServiceCard key={s.title} {...s} />)}
            </div>
          </div>

          <div>
            <SectionDivider icon="⚙️" label="Admin Services" color="bg-brand-primary" />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {adminServices.map((s) => <ServiceCard key={s.title} {...s} />)}
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="bg-background py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-14">
            <span className="inline-block text-xs font-bold text-brand-secondary bg-brand-secondary/10 border border-brand-secondary/30 px-3 py-1.5 rounded-full uppercase tracking-widest mb-3">
              Pricing
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-primary tracking-tight mb-3">
              Simple, Transparent Pricing
            </h2>
            <p className="text-secondary text-sm max-w-md mx-auto">
              Choose a plan that fits your hiring needs. Upgrade or downgrade anytime.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`rounded-2xl p-8 flex flex-col relative transition-all ${
                  plan.featured
                    ? "bg-brand-primary text-primary shadow-2xl scale-[1.02]"
                    : "bg-surface border border-border hover:border-brand-primary/20"
                }`}
              >
                {plan.featured && (
                  <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-brand-accent text-primary text-xs font-bold px-4 py-1 rounded-full">
                    Most Popular
                  </span>
                )}

                <div className="mb-6">
                  <h3 className="font-bold text-base mb-1 text-primary">{plan.name}</h3>
                  <div className="flex items-baseline gap-1 mt-2">
                    <span className="text-3xl font-extrabold text-primary">₹{plan.price}</span>
                    <span className={`text-xs ${plan.featured ? "text-primary/60" : "text-secondary"}`}>
                      /{plan.period}
                    </span>
                  </div>
                </div>

                <ul className="space-y-3 mb-8 flex-1">
                  {plan.features.map((f, i) => (
                    <li key={i} className="flex items-start gap-2.5">
                      <span className={`text-sm mt-0.5 ${plan.featured ? "text-primary" : "text-brand-secondary"}`}>✓</span>
                      <span className={`text-sm ${plan.featured ? "text-primary/80" : "text-secondary"}`}>{f}</span>
                    </li>
                  ))}
                </ul>

                <Link
                  href="#"
                  className={`block text-center text-sm font-semibold py-3 rounded-xl transition-all ${
                    plan.featured
                      ? "bg-white text-brand-accent hover:bg-gray-50 shadow-lg hover:shadow-xl font-black"
                      : "bg-brand-accent text-white hover:shadow-lg"
                  }`}
                >
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CTABanner />
    </main>
  );
}
