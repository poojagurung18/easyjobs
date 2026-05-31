import CTABanner from "@/components/home/CTABanner";
import Link from "next/link";

const seekerServices = [
  {
    icon: "📝",
    title: "Profile Creation",
    desc: "Build a professional profile to showcase your skills, education, and experience to potential employers.",
  },
  {
    icon: "🎯",
    title: "Job Recommendations",
    desc: "Receive personalized job suggestions based on your profile, skills, and browsing history.",
  },
  {
    icon: "📊",
    title: "Application Tracking",
    desc: "Follow every application through: Applied → Shortlisted → Interview → Decision.",
  },
  {
    icon: "⚡",
    title: "One-Click Apply",
    desc: "Apply to multiple jobs instantly with your saved profile. No need to re-fill forms.",
  },
];

const recruiterServices = [
  {
    icon: "📋",
    title: "Job Posting",
    desc: "Post detailed job listings and reach thousands of qualified, verified candidates.",
  },
  {
    icon: "🗂️",
    title: "Applicant Management",
    desc: "View, shortlist, and reject candidates easily. Export reports and track progress.",
  },
  {
    icon: "📅",
    title: "Interview Scheduling",
    desc: "Coordinate interview slots directly with shortlisted candidates from the dashboard.",
  },
  {
    icon: "🏷️",
    title: "Company Profile",
    desc: "Showcase your company culture, logo, team photos, and benefits to attract top talent.",
  },
];

const adminServices = [
  {
    icon: "🖥️",
    title: "Platform Monitoring",
    desc: "Manage all users, track active jobs, and oversee company registrations in real time.",
  },
  {
    icon: "🚩",
    title: "Report Handling",
    desc: "Review fake recruiter reports and take action — ban or suspend accounts as needed.",
  },
  {
    icon: "📈",
    title: "Analytics Dashboard",
    desc: "View platform-wide statistics including signups, job activity, and application trends.",
  },
  {
    icon: "🔔",
    title: "Notifications",
    desc: "Send platform-wide announcements or targeted alerts to specific user groups.",
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
      <div
        className={`w-7 h-7 ${color} rounded-md flex items-center justify-center`}
      >
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
            <SectionDivider
              icon="👤"
              label="For Job Seekers"
              color="bg-brand-primary"
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {seekerServices.map((s) => (
                <ServiceCard key={s.title} {...s} />
              ))}
            </div>
          </div>

          <div>
            <SectionDivider
              icon="🏢"
              label="For Recruiters"
              color="bg-purple-600"
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {recruiterServices.map((s) => (
                <ServiceCard key={s.title} {...s} />
              ))}
            </div>
          </div>

          <div>
            <SectionDivider
              icon="⚙️"
              label="Admin Services"
              color="bg-brand-primary"
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {adminServices.map((s) => (
                <ServiceCard key={s.title} {...s} />
              ))}
            </div>
          </div>
        </div>
      </section>

      <CTABanner />
    </main>
  );
}
