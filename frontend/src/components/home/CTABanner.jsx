import Link from "next/link";

export default function CTABanner() {
  return (
    <section className="bg-background py-20">
      <div className="max-w-7xl mx-auto px-6">
        <div className="teal-gradient rounded-[2.5rem] px-10 py-20 text-center relative overflow-hidden shadow-2xl">
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
              className="bg-white text-brand-accent font-black text-base px-10 py-4 rounded-2xl hover:bg-gray-50 hover:scale-105 transition-all shadow-2xl active:scale-[0.98]"
            >
              Create Free Account
            </Link>
            <Link
              href="/jobs"
              className="bg-white/15 border-2 border-white text-white text-base font-bold px-10 py-4 rounded-2xl hover:bg-white/25 transition-all active:scale-[0.98] backdrop-blur-sm"
            >
              Browse Jobs
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
