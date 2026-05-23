import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-background text-secondary">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-border">
          {/* Brand */}
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-brand-primary rounded-lg flex items-center justify-center">
                <span className="text-primary text-sm font-bold">E</span>
              </div>
              <span className="text-primary font-bold text-lg tracking-tight">
                Easy<span className="text-brand-accent">Jobs</span>
              </span>
            </div>
            <p className="text-sm leading-relaxed text-secondary max-w-56">
              Connecting talent with opportunity. A smarter way to hire and get
              hired.
            </p>
          </div>

          {/* Platform */}
          <div>
            <h4 className="text-primary text-sm font-semibold mb-4 uppercase tracking-wider">
              Platform
            </h4>
            <ul className="space-y-2.5">
              <li><Link href="/jobs" className="text-sm hover:text-primary transition-colors">Browse Jobs</Link></li>
              <li><Link href="#" className="text-sm hover:text-primary transition-colors">Post a Job</Link></li>
              <li><Link href="#" className="text-sm hover:text-primary transition-colors">Companies</Link></li>
              <li><Link href="/services" className="text-sm hover:text-primary transition-colors">Pricing</Link></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-primary text-sm font-semibold mb-4 uppercase tracking-wider">
              Company
            </h4>
            <ul className="space-y-2.5">
              <li><Link href="/about" className="text-sm hover:text-primary transition-colors">About Us</Link></li>
              <li><Link href="/services" className="text-sm hover:text-primary transition-colors">Services</Link></li>
              <li><Link href="#" className="text-sm hover:text-primary transition-colors">Contact</Link></li>
              <li><Link href="#" className="text-sm hover:text-primary transition-colors">Blog</Link></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-primary text-sm font-semibold mb-4 uppercase tracking-wider">
              Legal
            </h4>
            <ul className="space-y-2.5">
              <li><Link href="#" className="text-sm hover:text-primary transition-colors">Privacy Policy</Link></li>
              <li><Link href="#" className="text-sm hover:text-primary transition-colors">Terms of Service</Link></li>
              <li><Link href="#" className="text-sm hover:text-primary transition-colors">Cookie Policy</Link></li>
            </ul>
          </div>
        </div>

        <div className="pt-8 flex flex-col md:flex-row justify-between items-center gap-3">
          <p className="text-sm text-muted">© 2025 EasyJobs. Final Year Project.</p>
          <p className="text-sm text-muted">Made with ♥ for better hiring</p>
        </div>
      </div>
    </footer>
  );
}
