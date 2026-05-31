import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-background py-24 md:py-32">
      <div className="absolute top-0 right-0 w-1/2 h-full bg-brand-primary/10 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2"></div>
      <div className="absolute bottom-0 left-0 w-1/3 h-1/2 bg-brand-secondary/5 blur-[100px] rounded-full translate-y-1/2 -translate-x-1/2"></div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left — Text */}
          <div className="text-left">
            <div className="inline-flex items-center gap-2 bg-foreground/5 border border-border text-brand-secondary text-xs font-bold px-4 py-2 rounded-full mb-8 uppercase tracking-widest backdrop-blur-sm">
              <span className="w-2.5 h-2.5 bg-brand-secondary rounded-full animate-pulse"></span>
              Modern Recruitment Solutions
            </div>

            <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-primary leading-[1.1] tracking-tight mb-8">
              Invest In Your <br />
              <span className="bg-clip-text teal-gradient">Future Success</span>
            </h1>

            <p className="text-secondary text-lg md:text-xl leading-relaxed mb-10 max-w-xl">
              Connect with high-performing teams and professional opportunities
              that align with your ambitions. Secure your career with Confidence.
            </p>

            <div className="flex items-center gap-5 flex-wrap">
              <Link
                href="/jobs"
                className="bg-brand-accent text-white text-base font-black px-8 py-4 rounded-xl hover:shadow-[0_0_20px_rgba(14,165,233,0.5)] transition-all transform hover:-translate-y-1 active:scale-95 shadow-lg"
              >
                Get Started Now
              </Link>
              <Link
                href="#features"
                className="border-2 border-brand-accent text-brand-accent bg-white/80 text-base font-bold px-8 py-4 rounded-xl hover:bg-white transition-all"
              >
                Learn More
              </Link>
            </div>
          </div>

          {/* Right — Visual */}
          <div className="relative lg:block">
            <div className="relative z-10 rounded-[2rem] overflow-hidden aspect-[4/4] shadow-2xl border-4 border-border">
              <img
                src="Gemini_Generated_Image_5l618q5l618q5l61.png"
                alt="Professional team"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent"></div>

              <div className="absolute bottom-12 -right-8 bg-brand-primary p-5 rounded-2xl shadow-2xl text-primary transform hover:scale-105 transition-transform">
                <p className="text-[10px] font-bold opacity-80 mb-2 uppercase tracking-widest">
                  Verified Matches
                </p>
                <div className="flex -space-x-3 mb-3">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="w-8 h-8 rounded-full border-2 border-brand-primary overflow-hidden"
                    >
                      <img
                        src={`https://i.pravatar.cc/100?u=${i}`}
                        alt="User"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
                <p className="text-sm font-black">+150 Today</p>
              </div>
            </div>

            <div
              className="absolute -bottom-10 -left-10 w-40 h-40 opacity-20"
              style={{
                backgroundImage:
                  "radial-gradient(circle, #02b2c8 2px, transparent 2px)",
                backgroundSize: "20px 20px",
              }}
            ></div>
          </div>
        </div>
      </div>
    </section>
  );
}
