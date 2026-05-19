const testimonials = [
  {
    text: "EasyJobs helped me land my first full-time job within 3 weeks. The application tracking feature kept me sane throughout the process!",
    name: "Rahul Sharma",
    role: "Software Developer, Kathmandu",
    initials: "RS",
    color: "bg-gray-200 text-blue-700",
  },
  {
    text: "We hired 4 engineers in under a month. The shortlisting tools are excellent and the candidate quality was surprisingly high.",
    name: "Priya Gurung",
    role: "HR Lead, TechCorp Nepal",
    initials: "PG",
    color: "bg-purple-100 text-purple-700",
  },
  {
    text: "The verified recruiter badge gave me confidence I wasn't applying to fake jobs. Highly recommend this platform!",
    name: "Anita Singh",
    role: "UX Designer, Pokhara",
    initials: "AS",
    color: "bg-green-100 text-green-700",
  },
];

export default function Testimonials() {
  return (
    <section className="bg-white py-20">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-12">
          <span className="inline-block text-xs font-bold text-brand-primary bg-gray-100 px-3 py-1.5 rounded-full uppercase tracking-widest mb-3">
            Testimonials
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-brand-primary tracking-tight mb-3">
            What Our Users Say
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <div
              key={i}
              className="bg-white border border-gray-100 rounded-2xl p-7 hover:shadow-md transition-shadow"
            >
              {/* Stars */}
              <div className="flex gap-0.5 mb-4">
                {[...Array(5)].map((_, j) => (
                  <span key={j} className="text-amber-400 text-sm">
                    ★
                  </span>
                ))}
              </div>

              <p className="text-gray-600 text-sm leading-relaxed italic mb-6">
                &ldquo;{t.text}&rdquo;
              </p>

              <div className="flex items-center gap-3">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold ${t.color}`}
                >
                  {t.initials}
                </div>
                <div>
                  <p className="text-sm font-bold text-brand-primary">{t.name}</p>
                  <p className="text-xs text-gray-500">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
