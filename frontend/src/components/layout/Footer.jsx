import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="bg-background text-primary pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 pb-12 border-b border-border">
          {/* Brand Column */}
          <div className="col-span-1 md:col-span-1">
            <Link href="/" className="flex items-center gap-2.5 mb-6">
              <Image
                src="/favicon.png"
                alt="EasyJobs Logo"
                width={60}
                height={80}
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

          <div className="md:text-center">
            <h4 className="text-brand-secondary font-bold mb-6">Quick Links</h4>
            <nav className="flex flex-col gap-4">
              <Link href="/jobs" className="text-secondary text-sm hover:text-primary transition-colors">Find Jobs</Link>
              <Link href="/about" className="text-secondary text-sm hover:text-primary transition-colors">About Us</Link>
              <Link href="/services" className="text-secondary text-sm hover:text-primary transition-colors">Our Services</Link>
            </nav>
          </div>

          <div className="md:text-right">
            <h4 className="text-brand-secondary font-bold mb-6">Contact Us</h4>
            <p className="text-secondary text-sm mb-2">support@easyjobs.com</p>
            <p className="text-secondary text-sm">+977 9845533399</p>
          </div>
        </div>

        <div className="pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-gray-500">© 2026 EasyJobs.</p>
        </div>
      </div>
    </footer>
  );
}
