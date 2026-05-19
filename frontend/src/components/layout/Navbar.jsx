"use client";

import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/context/AuthContext";
import { Menu, X, LayoutDashboard, LogOut } from "lucide-react";
import { useState } from "react";

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const firstInitial =
    user?.name?.charAt(0).toUpperCase() ||
    user?.email?.charAt(0).toUpperCase() ||
    "U";

  return (
    <nav className="sticky top-0 z-50 w-full bg-white border-b border-gray-200 shadow-sm">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Left — Logo */}
        <Link href="/" className="flex items-center gap-2.5">
          <Image
            src="/favicon.png"
            alt="EasyJobs Logo"
            width={70}
            height={90}
          />
          <span className="text-lg font-bold text-brand-dark tracking-tight">
            Easy<span className="text-brand-primary">Jobs</span>
          </span>
        </Link>

        {/* Center — Nav links */}
        <div className="hidden md:flex items-center gap-1">
          <Link
            href="/jobs"
            className="px-4 py-2 text-sm font-medium text-gray-600 rounded-lg hover:text-brand-primary hover:bg-brand-light transition-colors"
          >
            Jobs
          </Link>
          <Link
            href="/about"
            className="px-4 py-2 text-sm font-medium text-gray-600 rounded-lg hover:text-brand-primary hover:bg-brand-light transition-colors"
          >
            About
          </Link>
          <Link
            href="/services"
            className="px-4 py-2 text-sm font-medium text-gray-600 rounded-lg hover:text-brand-primary hover:bg-brand-light transition-colors"
          >
            Services
          </Link>
        </div>

        {/* Right — Auth */}
        <div className="hidden md:flex items-center gap-2">
          {isAuthenticated ? (
            <>
              {/* User initial circle */}
              <div className="w-8 h-8 rounded-full bg-brand-primary flex items-center justify-center text-white text-xs font-bold select-none shadow-sm">
                {firstInitial}
              </div>

              {/* Dashboard */}
              <Link
                href="/dashboard"
                className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-white bg-brand-primary rounded-lg hover:bg-brand-primary-hover shadow-md transition-all active:scale-95"
              >
                <LayoutDashboard size={15} />
                Dashboard
              </Link>

              {/* Logout */}
              <button
                onClick={logout}
                className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-gray-600 rounded-lg hover:text-red-600 hover:bg-red-50 transition-colors"
              >
                <LogOut size={15} />
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-brand-primary transition-colors"
              >
                Log In
              </Link>
              <Link
                href="/register"
                className="px-5 py-2.5 text-sm font-semibold text-white bg-brand-primary rounded-lg hover:bg-brand-primary-hover shadow-md transition-all active:scale-95"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>

        {/* Mobile — Hamburger */}
        <button
          className="md:hidden flex items-center justify-center w-9 h-9 rounded-lg hover:bg-gray-100 transition-colors"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white px-4 py-3">
          <div className="flex flex-col gap-1">
            <Link
              href="/jobs"
              onClick={() => setIsMenuOpen(false)}
              className="px-3 py-2.5 text-sm font-medium text-gray-700 rounded-lg hover:bg-white hover:text-brand-primary transition-colors"
            >
              Jobs
            </Link>
            <Link
              href="/about"
              onClick={() => setIsMenuOpen(false)}
              className="px-3 py-2.5 text-sm font-medium text-gray-700 rounded-lg hover:bg-white hover:text-brand-primary transition-colors"
            >
              About
            </Link>
            <Link
              href="/services"
              onClick={() => setIsMenuOpen(false)}
              className="px-3 py-2.5 text-sm font-medium text-gray-700 rounded-lg hover:bg-white hover:text-brand-primary transition-colors"
            >
              Services
            </Link>

            <div className="my-1 border-t border-gray-100"></div>

            {isAuthenticated ? (
              <>
                <div className="flex items-center gap-3 px-3 py-2">
                  <div className="w-8 h-8 rounded-full bg-brand-primary flex items-center justify-center text-white text-xs font-bold shadow-sm">
                    {firstInitial}
                  </div>
                  <span className="text-sm text-gray-600 truncate">
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
                  onClick={() => {
                    logout();
                    setIsMenuOpen(false);
                  }}
                  className="flex items-center gap-2 px-3 py-2.5 text-sm font-medium text-red-600 rounded-lg hover:bg-red-50 transition-colors w-full text-left"
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
                  className="px-3 py-2.5 text-sm font-medium text-gray-700 rounded-lg hover:bg-white transition-colors"
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
