import CTABanner from "@/components/home/CTABanner";

const whyItems = [
  {
    icon: "⚡",
    title: "Easy to Use",
    desc: "Clean, intuitive UI designed for all experience levels.",
  },
  {
    icon: "✅",
    title: "Verified Recruiters",
    desc: "Every recruiter is manually verified before going live.",
  },
  {
    icon: "📊",
    title: "Real-time Tracking",
    desc: "Know your application status at every stage instantly.",
  },
  {
    icon: "🔒",
    title: "Secure & Private",
    desc: "Your data is encrypted and never sold to third parties.",
  },
  {
    icon: "🌐",
    title: "Local Focus",
    desc: "Tailored for Nepal's job market with local industry insight.",
  },
  {
    icon: "🎓",
    title: "Fresh Grad Friendly",
    desc: "Dedicated listings for entry-level and fresh graduate roles.",
  },
];

const teamMembers = [
  {
    initials: "PG",
    name: "POOJA GURUNG",
    color: "bg-brand-primary text-white",
  },
  {
    initials: "RC",
    name: "RUBIN CHHETRI",
    color: "bg-gray-200 text-blue-700",
  },
  {
    initials: "SP",
    name: "SUBODHANA PAUDEL",
    color: "bg-purple-100 text-purple-700",
  },
];

export default function AboutPage() {
  return (
    <main>
      {/* Hero */}
      <section className="bg-brand-light dark-gradient border-b border-gray-100/10 py-24 text-center">
        <div className="max-w-3xl mx-auto px-6">
          <span className="inline-block text-xs font-bold text-blue-400 bg-blue-950/60 border border-blue-900 px-3 py-1.5 rounded-full uppercase tracking-widest mb-4">
            About EasyJobs
          </span>
          <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight mb-5">
            Bridging Talent &amp; Opportunity
          </h1>
          <p className="text-gray-300 text-base leading-relaxed max-w-xl mx-auto">
            We are a platform designed to bridge the gap between talented
            individuals and trusted employers — transparently and efficiently.
          </p>
        </div>
      </section>

      {/* Story */}
      <section className="bg-white py-20 border-b border-gray-200/10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <span className="inline-block text-xs font-bold text-brand-primary bg-gray-100 px-3 py-1.5 rounded-full uppercase tracking-widest mb-4">
                Who We Are
              </span>
              <h2 className="text-3xl font-extrabold text-brand-primary tracking-tight mb-5">
                Our Story
              </h2>
              <p className="text-gray-300 text-sm leading-relaxed mb-6">
                EasyJobs was born from a simple observation: job seeking is
                broken. Fake listings, zero transparency, and slow hiring
                processes frustrate both candidates and employers.
              </p>
              <p className="text-gray-300 text-sm leading-relaxed">
                We set out to build a platform where hiring is honest, fast, and
                human — starting with Nepal&apos;s growing job market and
                building toward a broader vision of accessible employment for
                everyone.
              </p>
            </div>

            {/* Mission & Vision cards */}
            <div className="flex flex-col gap-5">
              <div className="bg-gray-50 border border-gray-100 rounded-2xl p-7">
                <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center text-xl mb-4">
                  🎯
                </div>
                <h3 className="font-bold text-gray-900 text-base mb-2">
                  Our Mission
                </h3>
                <p className="text-gray-300 text-sm leading-relaxed">
                  To simplify the hiring process and create meaningful
                  employment opportunities for everyone — regardless of
                  background or location.
                </p>
              </div>

              <div className="bg-purple-50 border border-purple-100 rounded-2xl p-7">
                <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center text-xl mb-4">
                  🔭
                </div>
                <h3 className="font-bold text-purple-700 text-base mb-2">
                  Our Vision
                </h3>
                <p className="text-purple-300 text-sm leading-relaxed">
                  To become the most trusted job platform in South Asia where
                  hiring is transparent, efficient, and accessible for all.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Problem & Solution */}
      <section className="bg-[#060b13] py-20 border-b border-gray-200/10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <span className="inline-block text-xs font-bold text-brand-primary bg-gray-100 px-3 py-1.5 rounded-full uppercase tracking-widest mb-3">
              The Problem
            </span>
            <h2 className="text-3xl font-extrabold text-brand-primary tracking-tight">
              What We&apos;re Solving
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white border border-red-100 rounded-2xl p-8">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-9 h-9 bg-red-50 rounded-xl flex items-center justify-center text-lg">
                  ❌
                </div>
                <h3 className="font-bold text-brand-primary text-base">
                  The Problem
                </h3>
              </div>
              <p className="text-gray-500 text-sm leading-relaxed">
                Many job seekers face fake job postings, ghosting from
                recruiters, and a complete lack of transparency about
                application status. Recruiters struggle to filter quality
                candidates quickly and efficiently.
              </p>
            </div>

            <div className="bg-white border border-green-100 rounded-2xl p-8">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-9 h-9 bg-green-50 rounded-xl flex items-center justify-center text-lg">
                  ✅
                </div>
                <h3 className="font-bold text-brand-primary text-base">
                  Our Solution
                </h3>
              </div>
              <p className="text-gray-500 text-sm leading-relaxed">
                EasyJobs verifies all recruiters before they can post, offers
                real-time application tracking for job seekers, and provides
                powerful filtering tools for employers — creating a fair,
                transparent ecosystem for everyone.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <span className="inline-block text-xs font-bold text-brand-primary bg-gray-100 px-3 py-1.5 rounded-full uppercase tracking-widest mb-3">
              Why Us
            </span>
            <h2 className="text-3xl font-extrabold text-brand-primary tracking-tight mb-3">
              Why Choose EasyJobs?
            </h2>
            <p className="text-gray-500 text-sm max-w-md mx-auto">
              We built EasyJobs with a focus on trust, simplicity, and real
              outcomes for both sides of hiring.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {whyItems.map((item, i) => (
              <div
                key={i}
                className="flex items-start gap-4 bg-white border border-gray-100 rounded-2xl p-6 hover:border-gray-200 hover:shadow-sm transition-all"
              >
                <div className="w-10 h-10 bg-brand-primary rounded-xl flex items-center justify-center flex-shrink-0 text-lg">
                  {item.icon}
                </div>
                <div>
                  <h4 className="font-bold text-brand-primary text-sm mb-1">
                    {item.title}
                  </h4>
                  <p className="text-gray-500 text-sm leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="bg-[#060b13] py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <span className="inline-block text-xs font-bold text-brand-primary bg-gray-100 px-3 py-1.5 rounded-full uppercase tracking-widest mb-3">
              The Team
            </span>
            <h2 className="text-3xl font-extrabold text-brand-primary tracking-tight mb-3">
              Meet the Builders
            </h2>
            <p className="text-gray-500 text-sm">
              Designed and developed as a Final Year Project.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-2xl mx-auto">
            {teamMembers.map((member, i) => (
              <div
                key={i}
                className="bg-white border border-gray-100 rounded-2xl p-7 text-center hover:shadow-md transition-shadow"
              >
                <div
                  className={`w-16 h-16 rounded-2xl flex items-center justify-center text-xl font-extrabold mx-auto mb-4 ${member.color}`}
                >
                  {member.initials}
                </div>
                <h4 className="font-bold text-brand-primary text-sm mb-1">
                  {member.name}
                </h4>
                <p className="text-gray-500 text-xs leading-relaxed">
                  {member.role}
                </p>
                <p className="text-gray-400 text-xs mt-2">Final Year, BSc CSIT</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CTABanner />
    </main>
  );
}
