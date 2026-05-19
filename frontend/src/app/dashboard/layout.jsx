"use client";

import { useState, useEffect, Suspense } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter, usePathname } from "next/navigation";
import Sidebar from "@/components/layout/Sidebar";

function DashboardContent({ children }) {
  const { user, isLoading, isAuthenticated } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    if (isLoading) return;

    const stored = localStorage.getItem("user_data");
    let role = null;
    if (stored) {
      try {
        role = JSON.parse(stored).role;
      } catch (e) {}
    }

    if (!isAuthenticated && !role) {
      router.push("/login");
      return;
    }

    if (role) {
      const lowerRole = role.toString().toLowerCase();
      const roleDashboard = {
        admin: "/dashboard/admin",
        recruiter: "/dashboard/recruiter",
        job_recruiter: "/dashboard/recruiter",
        employee: "/dashboard/seeker",
        seeker: "/dashboard/seeker",
        job_seeker: "/dashboard/seeker",
      };

      const targetDashboard = roleDashboard[lowerRole] || "/dashboard/seeker";

      if (pathname === "/dashboard" || pathname === "/dashboard/") {
        router.replace(targetDashboard);
      } else if (!pathname.startsWith(targetDashboard)) {
        router.replace(targetDashboard);
      }
    }
  }, [isLoading, isAuthenticated, pathname, router]);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-white">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand-primary border-t-transparent"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-white">
      <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
      <div
        className={`transition-all duration-300 ${
          isCollapsed ? "lg:ml-20" : "lg:ml-64"
        }`}
      >
        <div className="p-4 lg:p-8">{children}</div>
      </div>
    </div>
  );
}

export default function DashboardLayout({ children }) {
  return (
    <Suspense
      fallback={
        <div className="flex h-screen items-center justify-center bg-white">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand-primary border-t-transparent"></div>
        </div>
      }
    >
      <DashboardContent>{children}</DashboardContent>
    </Suspense>
  );
}
