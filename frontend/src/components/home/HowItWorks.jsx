const steps = [
  {
    num: "01",
    title: "Register Your Account",
    desc: "Sign up in under a minute as a Job Seeker or Recruiter.",
    icon: "📝",
  },
  {
    num: "02",
    title: "Complete Your Profile",
    desc: "Fill in your skills and experience, or add your company details.",
    icon: "🙋",
  },
  {
    num: "03",
    title: "Apply or Post Jobs",
    desc: "Browse tailored listings or publish your open positions.",
    icon: "🚀",
  },
  {
    num: "04",
    title: "Get Hired or Hire",
    desc: "Connect, interview, and close the deal — all on the platform.",
    icon: "🎉",
  },
];

export default function HowItWorks() {
  return (
    <section className="bg-surface py-20">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-14">
          <span className="inline-block text-xs font-black text-brand-secondary bg-brand-secondary/10 border border-brand-secondary/30 px-4 py-2 rounded-full uppercase tracking-widest mb-4">
            Process
          </span>
          <h2 className="text-4xl md:text-5xl font-black text-text-primary tracking-tight mb-4">
            How EasyJobs Works
          </h2>
          <p className="text-text-secondary max-w-md mx-auto text-sm leading-relaxed">
            Four simple steps to get started — whether you&apos;re hiring or job
            hunting.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          {/* Connector line (desktop) */}
          <div className="hidden lg:block absolute top-10 left-[12.5%] right-[12.5%] h-px bg-border z-0"></div>

          {steps.map((step, i) => (
            <div
              key={i}
              className="relative z-10 flex flex-col items-center text-center"
            >
              <div className="w-20 h-20 bg-surface rounded-2xl flex flex-col items-center justify-center mb-5 shadow-xl border border-border">
                <span className="text-xl mb-0.5">{step.icon}</span>
                <span className="text-brand-secondary text-[10px] font-mono font-bold">
                  {step.num}
                </span>
              </div>

              <h3 className="font-bold text-text-primary text-sm mb-2">
                {step.title}
              </h3>
              <p className="text-text-secondary text-sm leading-relaxed">
                {step.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
