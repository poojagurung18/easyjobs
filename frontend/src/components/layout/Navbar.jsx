"use client";

import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/context/AuthContext";
import { Menu, X, LayoutDashboard, LogOut, Sun, Moon } from "lucide-react";
import { useState } from "react";
import { useThemeStore } from "@/store/themeStore";

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isDark, toggleTheme } = useThemeStore();

  const firstInitial =
    user?.name?.charAt(0).toUpperCase() ||
    user?.email?.charAt(0).toUpperCase() ||
    "U";

  return (
    <nav className="sticky top-0 z-50 w-full bg-surface border-b border-border shadow-sm transition-colors duration-200">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Left — Logo */}
        <Link href="/" className="flex items-center gap-2.5">
          <Image
            src="/favicon.png"
            alt="EasyJobs Logo"
            width={70}
            height={90}
          />
          <span className="text-lg font-bold text-text-primary tracking-tight">
            Easy<span className="text-brand-primary">Jobs</span>
          </span>
        </Link>

        {/* Center — Nav links */}
        <div className="hidden md:flex items-center gap-1">
          <Link
            href="/jobs"
            className="px-4 py-2 text-sm font-medium text-text-secondary rounded-lg hover:text-brand-primary hover:bg-surface-hover transition-colors"
          >
            Jobs
          </Link>
          <Link
            href="/about"
            className="px-4 py-2 text-sm font-medium text-text-secondary rounded-lg hover:text-brand-primary hover:bg-surface-hover transition-colors"
          >
            About
          </Link>
          <Link
            href="/services"
            className="px-4 py-2 text-sm font-medium text-text-secondary rounded-lg hover:text-brand-primary hover:bg-surface-hover transition-colors"
          >
            Services
          </Link>
        </div>

        {/* Right — Theme toggle + Auth */}
        <div className="hidden md:flex items-center gap-2">
          {/* Dark / Light toggle */}
          <button
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="flex items-center justify-center w-9 h-9 rounded-lg text-text-secondary hover:text-brand-primary hover:bg-surface-hover transition-colors"
          >
            {isDark ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          {isAuthenticated ? (
            <>
              <div className="w-8 h-8 rounded-full bg-brand-primary flex items-center justify-center text-white text-xs font-bold select-none shadow-sm">
                {firstInitial}
              </div>

              <Link
                href="/dashboard"
                className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-white bg-brand-primary rounded-lg hover:bg-brand-primary-hover shadow-md transition-all active:scale-95"
              >
                <LayoutDashboard size={15} />
                Dashboard
              </Link>

              <button
                onClick={logout}
                className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-text-secondary rounded-lg hover:text-red-500 hover:bg-surface-hover transition-colors"
              >
                <LogOut size={15} />
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="px-4 py-2 text-sm font-medium text-text-secondary hover:text-brand-primary transition-colors"
              >
                Log In
              </Link>
              <Link
                href="/register"
                className="px-5 py-2.5 text-sm font-bold text-white bg-brand-accent rounded-lg hover:shadow-lg transition-all active:scale-95"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>

        {/* Mobile — Theme toggle + Hamburger */}
        <div className="md:hidden flex items-center gap-1">
          <button
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="flex items-center justify-center w-9 h-9 rounded-lg text-text-secondary hover:text-brand-primary hover:bg-surface-hover transition-colors"
          >
            {isDark ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          <button
            className="flex items-center justify-center w-9 h-9 rounded-lg text-text-secondary hover:bg-surface-hover transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden border-t border-border bg-surface px-4 py-3 transition-colors duration-200">
          <div className="flex flex-col gap-1">
            <Link
              href="/jobs"
              onClick={() => setIsMenuOpen(false)}
              className="px-3 py-2.5 text-sm font-medium text-text-secondary rounded-lg hover:bg-surface-hover hover:text-brand-primary transition-colors"
            >
              Jobs
            </Link>
            <Link
              href="/about"
              onClick={() => setIsMenuOpen(false)}
              className="px-3 py-2.5 text-sm font-medium text-text-secondary rounded-lg hover:bg-surface-hover hover:text-brand-primary transition-colors"
            >
              About
            </Link>
            <Link
              href="/services"
              onClick={() => setIsMenuOpen(false)}
              className="px-3 py-2.5 text-sm font-medium text-text-secondary rounded-lg hover:bg-surface-hover hover:text-brand-primary transition-colors"
            >
              Services
            </Link>

            <div className="my-1 border-t border-border" />

            {isAuthenticated ? (
              <>
                <div className="flex items-center gap-3 px-3 py-2">
                  <div className="w-8 h-8 rounded-full bg-brand-primary flex items-center justify-center text-white text-xs font-bold shadow-sm">
                    {firstInitial}
                  </div>
                  <span className="text-sm text-text-secondary truncate">
                    {user?.email}
                  </span>
                </div>

                <Link
                  href="/dashboard"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center gap-2 px-3 py-2.5 text-sm font-semibold text-white bg-brand-primary rounded-lg hover:bg-brand-primary-hover shadow-md transition-all active:scale-95"
                >
                  <LayoutDashboard size={16} />
                  Dashboard
                </Link>
                <button
                  onClick={() => { logout(); setIsMenuOpen(false); }}
                  className="flex items-center gap-2 px-3 py-2.5 text-sm font-medium text-red-500 rounded-lg hover:bg-surface-hover transition-colors w-full text-left"
                >
                  <LogOut size={16} />
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  onClick={() => setIsMenuOpen(false)}
                  className="px-3 py-2.5 text-sm font-medium text-text-secondary rounded-lg hover:bg-surface-hover transition-colors"
                >
                  Log In
                </Link>
                <Link
                  href="/register"
                  onClick={() => setIsMenuOpen(false)}
                  className="px-3 py-2.5 text-sm font-semibold text-white bg-brand-primary rounded-lg hover:bg-brand-primary-hover shadow-md transition-all active:scale-95 text-center"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
