"use client";

import Link from "next/link";
import { Sun, Moon } from "lucide-react";
import { useThemeStore } from "@/store/themeStore";

export default function Navbar() {
  const { isDark, toggleTheme } = useThemeStore();

  return (
    <nav className="w-full bg-surface border-b border-border sticky top-0 z-50 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-brand-primary rounded-lg flex items-center justify-center">
            <span className="text-white text-sm font-bold">E</span>
          </div>
          <span className="text-text-primary font-bold text-lg tracking-tight">
            Easy<span className="text-brand-primary">Jobs</span>
          </span>
        </Link>

        {/* Links */}
        <div className="hidden md:flex items-center gap-8">
          <Link
            href="/"
            className="text-sm text-text-secondary hover:text-brand-primary transition-colors font-medium"
          >
            Home
          </Link>
          <Link
            href="/about"
            className="text-sm text-text-secondary hover:text-brand-primary transition-colors font-medium"
          >
            About
          </Link>
          <Link
            href="/services"
            className="text-sm text-text-secondary hover:text-brand-primary transition-colors font-medium"
          >
            Services
          </Link>
          <Link
            href="/jobs"
            className="text-sm text-text-secondary hover:text-brand-primary transition-colors font-medium"
          >
            Jobs
          </Link>
        </div>

        {/* Right — toggle + auth */}
        <div className="flex items-center gap-3">
          <button
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="flex items-center justify-center w-9 h-9 rounded-lg text-text-secondary hover:text-brand-primary hover:bg-surface-hover transition-colors"
          >
            {isDark ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          <Link
            href="/login"
            className="text-sm font-medium text-text-secondary hover:text-brand-primary transition-colors px-4 py-2"
          >
            Log In
          </Link>
          <Link
            href="/register"
            className="text-sm font-bold bg-brand-accent text-white px-5 py-2.5 rounded-lg hover:shadow-md transition-all"
          >
            Sign Up
          </Link>
        </div>
      </div>
    </nav>
  );
}
