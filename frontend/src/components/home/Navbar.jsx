import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="w-full bg-white border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-brand-primary rounded-lg flex items-center justify-center">
            <span className="text-white text-sm font-bold">E</span>
          </div>
          <span className="text-brand-primary font-bold text-lg tracking-tight">
            Easy<span className="text-brand-primary">Jobs</span>
          </span>
        </Link>

        {/* Links */}
        <div className="hidden md:flex items-center gap-8">
          <Link
            href="/"
            className="text-sm text-gray-600 hover:text-brand-primary transition-colors font-medium"
          >
            Home
          </Link>
          <Link
            href="/about"
            className="text-sm text-gray-600 hover:text-brand-primary transition-colors font-medium"
          >
            About
          </Link>
          <Link
            href="/services"
            className="text-sm text-gray-600 hover:text-brand-primary transition-colors font-medium"
          >
            Services
          </Link>
          <Link
            href="#"
            className="text-sm text-gray-600 hover:text-brand-primary transition-colors font-medium"
          >
            Jobs
          </Link>
        </div>

        {/* Auth buttons */}
        <div className="flex items-center gap-3">
          <Link
            href="#"
            className="text-sm font-medium text-gray-700 hover:text-brand-primary transition-colors px-4 py-2"
          >
            Log In
          </Link>
          <Link
            href="#"
            className="text-sm font-medium bg-brand-primary text-white px-5 py-2.5 rounded-lg hover:bg-brand-primary-hover transition-colors"
          >
            Sign Up
          </Link>
        </div>
      </div>
    </nav>
  );
}
