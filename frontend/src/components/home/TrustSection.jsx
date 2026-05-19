const trustItems = [
  {
    icon: "✅",
    title: "Verified Recruiters",
    desc: "Every recruiter is manually reviewed before posting jobs on the platform.",
  },
  {
    icon: "🔒",
    title: "Secure Platform",
    desc: "Your data is encrypted and protected using industry-standard security.",
  },
  {
    icon: "🚩",
    title: "Report Fake Listings",
    desc: "Flag suspicious jobs easily. Our team reviews every report within 24 hours.",
  },
  {
    icon: "👁️",
    title: "Transparent Hiring",
    desc: "Real-time status updates ensure you always know where your application stands.",
  },
];

export default function TrustSection() {
  return (
    <section className="bg-brand-dark py-24 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full dark-gradient opacity-50"></div>
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-12">
          <span className="inline-block text-xs font-black text-brand-secondary bg-brand-secondary/10 border border-brand-secondary/30 px-4 py-2 rounded-full uppercase tracking-widest mb-4">
            Trust & Safety
          </span>
          <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight mb-4 relative z-10">
            A Platform You Can Trust
          </h2>
          <p className="text-gray-400 max-w-md mx-auto text-sm leading-relaxed">
            We take safety and transparency seriously at every step of the
            hiring journey.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {trustItems.map((item, i) => (
            <div
              key={i}
              className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/8 hover:border-white/20 transition-all"
            >
              <div className="text-3xl mb-4">{item.icon}</div>
              <h3 className="font-bold text-white text-sm mb-2">
                {item.title}
              </h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
