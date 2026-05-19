import Link from "next/link";

export default function CTABanner() {
  return (
    <section className="bg-white py-20">
      <div className="max-w-7xl mx-auto px-6">
        <div className="teal-gradient rounded-[2.5rem] px-10 py-20 text-center relative overflow-hidden shadow-2xl">
          {/* Subtle radial glow */}
          <div className="absolute inset-0 bg-black/10 pointer-events-none"></div>

          <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight mb-6 relative z-10">
            Ready to Take the Next Step?
          </h2>
          <p className="text-white/80 text-lg mb-10 max-w-xl mx-auto relative z-10 font-medium">
            Join thousands of job seekers and recruiters already building the
            bridge to their future with EasyJobs.
          </p>

          <div className="flex items-center justify-center gap-6 flex-wrap relative z-10">
            <Link
              href="/register"
              className="bg-[#ffffff] text-brand-primary text-base font-black px-10 py-4 rounded-2xl hover:bg-brand-light hover:scale-105 transition-all shadow-xl active:scale-[0.98]"
            >
              Create Free Account
            </Link>
            <Link
              href="/jobs"
              className="bg-brand-dark/40 backdrop-blur-md text-white text-base font-bold px-10 py-4 rounded-2xl border border-white/20 hover:border-white/50 hover:bg-brand-dark/60 transition-all active:scale-[0.98]"
            >
              Browse Jobs
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
