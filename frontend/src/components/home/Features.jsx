const seekerFeatures = [
  {
    icon: "👤",
    title: "Professional Profile",
    desc: "Create a standout profile highlighting your skills, experience, and achievements.",
  },
  {
    icon: "🎯",
    title: "Personalized Matches",
    desc: "Get job recommendations tailored to your profile, location, and experience level.",
  },
  {
    icon: "📊",
    title: "Application Tracking",
    desc: "Track every application in real-time — Applied → Shortlisted → Interview.",
  },
  {
    icon: "⚡",
    title: "One-Click Apply",
    desc: "Apply to multiple jobs instantly with your saved profile. No repetitive forms.",
  },
];

const recruiterFeatures = [
  {
    icon: "📋",
    title: "Post Job Listings",
    desc: "Publish detailed job openings and reach thousands of qualified candidates.",
  },
  {
    icon: "🗂️",
    title: "Manage Applicants",
    desc: "View, shortlist, and reject candidates easily from a clean dashboard.",
  },
  {
    icon: "📅",
    title: "Schedule Interviews",
    desc: "Coordinate interview slots with shortlisted candidates without leaving the platform.",
  },
  {
    icon: "🏷️",
    title: "Company Branding",
    desc: "Showcase your culture, logo, and perks to attract the right talent.",
  },
];

function FeatureCard({ icon, title, desc }) {
  return (
    <div className="bg-surface border border-border rounded-2xl p-6 hover:shadow-md hover:border-brand-primary/20 transition-all">
      <div className="w-11 h-11 bg-brand-primary/10 rounded-xl flex items-center justify-center text-xl mb-4">
        {icon}
      </div>
      <h3 className="font-bold text-text-primary text-sm mb-2">{title}</h3>
      <p className="text-text-secondary text-sm leading-relaxed">{desc}</p>
    </div>
  );
}

export default function Features() {
  return (
    <section id="features" className="bg-background py-20">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-14">
          <span className="inline-block text-xs font-black text-brand-secondary bg-brand-secondary/10 border border-brand-secondary/30 px-4 py-2 rounded-full uppercase tracking-widest mb-4">
            Features
          </span>
          <h2 className="text-4xl md:text-5xl font-black text-text-primary tracking-tight mb-4">
            Built for Both Sides of Hiring
          </h2>
          <p className="text-text-secondary max-w-md mx-auto text-sm leading-relaxed">
            Whether you&apos;re looking for work or looking to hire, EasyJobs
            gives you the right tools.
          </p>
        </div>

        {/* Job Seekers */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-7 h-7 bg-brand-primary rounded-md flex items-center justify-center">
              <span className="text-white text-xs">👤</span>
            </div>
            <h3 className="font-bold text-text-primary text-base">
              For Job Seekers
            </h3>
            <div className="flex-1 h-px bg-border"></div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {seekerFeatures.map((f) => (
              <FeatureCard key={f.title} {...f} />
            ))}
          </div>
        </div>

        {/* Recruiters */}
        <div>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-7 h-7 bg-brand-primary rounded-md flex items-center justify-center">
              <span className="text-white text-xs">🏢</span>
            </div>
            <h3 className="font-bold text-text-primary text-base">
              For Recruiters
            </h3>
            <div className="flex-1 h-px bg-border"></div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {recruiterFeatures.map((f) => (
              <FeatureCard key={f.title} {...f} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
