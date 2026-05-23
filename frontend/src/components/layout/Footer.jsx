import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="bg-background text-primary pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 pb-12 border-b border-border">
          {/* Brand Column */}
          <div className="col-span-1 md:col-span-1">
            <Link href="/" className="flex items-center gap-2.5 mb-6">
              <Image
                src="/favicon.png"
                alt="EasyJobs Logo"
                width={60}
                height={80}
                className="brightness-0 invert dark:brightness-100"
              />
              <span className="text-xl font-bold tracking-tight text-primary">
                Easy<span className="text-brand-secondary">Jobs</span>
              </span>
            </Link>
            <p className="text-secondary text-sm leading-relaxed max-w-xs">
              Connecting talent with opportunity across the globe. We build the
              bridge between your dreams and your career.
            </p>
          </div>

          <div>
            <h4 className="text-brand-secondary font-bold mb-6">Quick Links</h4>
            <nav className="flex flex-col gap-4">
              <Link href="/jobs" className="text-secondary text-sm hover:text-primary transition-colors">Find Jobs</Link>
              <Link href="/about" className="text-secondary text-sm hover:text-primary transition-colors">About Us</Link>
              <Link href="/services" className="text-secondary text-sm hover:text-primary transition-colors">Our Services</Link>
            </nav>
          </div>

          <div>
            <h4 className="text-brand-secondary font-bold mb-6">Resources</h4>
            <nav className="flex flex-col gap-4">
              <Link href="#" className="text-secondary text-sm hover:text-primary transition-colors">Career Advice</Link>
              <Link href="#" className="text-secondary text-sm hover:text-primary transition-colors">Help Center</Link>
              <Link href="#" className="text-secondary text-sm hover:text-primary transition-colors">Privacy Policy</Link>
            </nav>
          </div>

          <div>
            <h4 className="text-brand-secondary font-bold mb-6">Contact Us</h4>
            <p className="text-secondary text-sm mb-2">support@easyjobs.com</p>
            <p className="text-secondary text-sm">+1 (555) 000-1111</p>
            <div className="flex gap-4 mt-6">
              <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center hover:bg-brand-primary transition-colors cursor-pointer text-gray-400 text-xs">f</div>
              <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center hover:bg-brand-primary transition-colors cursor-pointer text-gray-400 text-xs">t</div>
              <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center hover:bg-brand-primary transition-colors cursor-pointer text-gray-400 text-xs">i</div>
            </div>
          </div>
        </div>

        <div className="pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-gray-500">© 2026 EasyJobs. Designed by Theme-Pure</p>
          <div className="flex gap-6">
            <Link href="#" className="text-xs text-gray-500 hover:text-white">Terms</Link>
            <Link href="#" className="text-xs text-gray-500 hover:text-white">Privacy</Link>
            <Link href="#" className="text-xs text-gray-500 hover:text-white">Cookies</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
