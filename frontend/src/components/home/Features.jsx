const seekerFeatures = [
  {
    icon: "👤",
    title: "Professional Profile",
    desc: "Create a standout profile highlighting your skills, experience, and achievements.",
    bg: "bg-brand-light",
  },
  {
    icon: "🎯",
    title: "Personalized Matches",
    desc: "Get job recommendations tailored to your profile, location, and experience level.",
    bg: "bg-brand-light",
  },
  {
    icon: "📊",
    title: "Application Tracking",
    desc: "Track every application in real-time — Applied → Shortlisted → Interview.",
    bg: "bg-brand-light",
  },
  {
    icon: "⚡",
    title: "One-Click Apply",
    desc: "Apply to multiple jobs instantly with your saved profile. No repetitive forms.",
    bg: "bg-brand-light",
  },
];

const recruiterFeatures = [
  {
    icon: "📋",
    title: "Post Job Listings",
    desc: "Publish detailed job openings and reach thousands of qualified candidates.",
    bg: "bg-brand-light",
  },
  {
    icon: "🗂️",
    title: "Manage Applicants",
    desc: "View, shortlist, and reject candidates easily from a clean dashboard.",
    bg: "bg-brand-light",
  },
  {
    icon: "📅",
    title: "Schedule Interviews",
    desc: "Coordinate interview slots with shortlisted candidates without leaving the platform.",
    bg: "bg-brand-light",
  },
  {
    icon: "🏷️",
    title: "Company Branding",
    desc: "Showcase your culture, logo, and perks to attract the right talent.",
    bg: "bg-brand-light",
  },
];

function FeatureCard({ icon, title, desc, bg }) {
  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-6 hover:shadow-md hover:border-gray-200 transition-all">
      <div
        className={`w-11 h-11 ${bg} rounded-xl flex items-center justify-center text-xl mb-4`}
      >
        {icon}
      </div>
      <h3 className="font-bold text-brand-primary text-sm mb-2">{title}</h3>
      <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
    </div>
  );
}

export default function Features() {
  return (
    <section id="features" className="bg-white py-20">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-14">
          <span className="inline-block text-xs font-black text-brand-secondary bg-brand-secondary/10 border border-brand-secondary/30 px-4 py-2 rounded-full uppercase tracking-widest mb-4">
            Features
          </span>
          <h2 className="text-4xl md:text-5xl font-black text-brand-dark tracking-tight mb-4">
            Built for Both Sides of Hiring
          </h2>
          <p className="text-gray-500 max-w-md mx-auto text-sm leading-relaxed">
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
            <h3 className="font-bold text-brand-primary text-base">
              For Job Seekers
            </h3>
            <div className="flex-1 h-px bg-gray-200"></div>
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
            <h3 className="font-bold text-brand-primary text-base">
              For Recruiters
            </h3>
            <div className="flex-1 h-px bg-gray-200"></div>
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
