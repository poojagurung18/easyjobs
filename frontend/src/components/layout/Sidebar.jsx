// "use client";

// import { usePathname } from "next/navigation";
// import { useState } from "react";
// import {
//   LayoutDashboard,
//   User,
//   Briefcase,
//   FileText,
//   Settings,
//   Users,
//   Building2,
//   CreditCard,
//   ChevronLeft,
//   ChevronRight,
//   LogOut,
//   Menu,
//   X,
//   Search,
//   Heart,
//   AlertTriangle,
//   MessageSquare,
//   Calendar,
// } from "lucide-react";
// import Image from "next/image";
// import Link from "next/link";
// import { useAuth } from "@/context/AuthContext";

// const seekerMenuItems = [
//   { href: "/dashboard/seeker", label: "Overview", icon: LayoutDashboard },
//   { href: "/dashboard/seeker/jobs", label: "Browse Jobs", icon: Search },
//   {
//     href: "/dashboard/seeker/applications",
//     label: "My Applications",
//     icon: FileText,
//   },
//   { href: "/dashboard/seeker/saved-jobs", label: "Saved Jobs", icon: Heart },
//   { href: "/dashboard/seeker/chat", label: "Messages", icon: MessageSquare },
//   { href: "/dashboard/seeker/profile", label: "My Profile", icon: User },
//   { href: "/dashboard/seeker/settings", label: "Settings", icon: Settings },
// ];

// const recruiterMenuItems = [
//   { href: "/dashboard/recruiter", label: "Overview", icon: LayoutDashboard },
//   {
//     href: "/dashboard/recruiter/profile",
//     label: "Company Profile",
//     icon: Building2,
//   },
//   { href: "/dashboard/recruiter/jobs", label: "My Jobs", icon: Briefcase },
//   {
//     href: "/dashboard/recruiter/applications",
//     label: "Applications",
//     icon: FileText,
//   },
//   {
//     href: "/dashboard/recruiter/interviews",
//     label: "Interviews",
//     icon: Calendar,
//   },
//   { href: "/dashboard/recruiter/chat", label: "Messages", icon: MessageSquare },
//   {
//     href: "/dashboard/recruiter/subscription",
//     label: "Subscription",
//     icon: CreditCard,
//   },
//   { href: "/dashboard/recruiter/settings", label: "Settings", icon: Settings },
// ];

// const adminMenuItems = [
//   { href: "/dashboard/admin", label: "Overview", icon: LayoutDashboard },
//   {
//     href: "/dashboard/admin/reported-recruiters",
//     label: "Reported Recruiters",
//     icon: AlertTriangle,
//   },
//   { href: "/dashboard/admin/users", label: "Users", icon: Users },
//   { href: "/dashboard/admin/settings", label: "Settings", icon: Settings },
// ];

// export default function Sidebar({
//   isCollapsed,
//   setIsCollapsed,
//   showLogo = true,
// }) {
//   const pathname = usePathname();
//   const { user, logout } = useAuth();

//   const role = user?.role?.toLowerCase();
//   const menuItems =
//     role === "admin"
//       ? adminMenuItems
//       : role === "recruiter" || role === "job_recruiter"
//         ? recruiterMenuItems
//         : seekerMenuItems;

//   return (
//     <>
//       <button
//         onClick={() => setIsCollapsed(!isCollapsed)}
//         className="fixed left-0 top-20 z-50 flex h-10 w-10 items-center justify-center rounded-r-lg bg-gray-600 text-white shadow-lg lg:hidden"
//       >
//         {isCollapsed ? <Menu size={20} /> : <X size={20} />}
//       </button>

//       <aside
//         className={`fixed left-0 top-16 z-40 h-[calc(100vh-4rem)] border-r border-gray-200 bg-white transition-all duration-300 ${
//           isCollapsed ? "-translate-x-full lg:translate-x-0 lg:w-20" : "w-64"
//         }`}
//       >
//         <div className="flex h-full flex-col">
//           <nav className="flex-1 space-y-1 overflow-y-auto p-4">
//             {menuItems.map((item) => {
//               const Icon = item.icon;
//               const isActive = pathname === item.href;

//               return (
//                 <Link
//                   key={item.href}
//                   href={item.href}
//                   className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
//                     isActive
//                       ? "bg-gray-100 text-brand-primary"
//                       : "text-gray-700 hover:bg-gray-100"
//                   }`}
//                 >
//                   <Icon size={20} className={isCollapsed ? "mx-auto" : ""} />
//                   {!isCollapsed && <span>{item.label}</span>}
//                 </Link>
//               );
//             })}
//           </nav>

//           <div className="border-t border-gray-200 p-4">
//             {!isCollapsed && (
//               <div className="mb-3">
//                 <p className="truncate text-sm font-medium text-gray-900">
//                   {user?.email}
//                 </p>
//                 <p className="truncate text-xs text-gray-500 capitalize">
//                   {user?.role}
//                 </p>
//               </div>
//             )}
//             <button
//               onClick={logout}
//               className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-red-600 transition-colors hover:bg-red-50 ${
//                 isCollapsed ? "justify-center" : ""
//               }`}
//             >
//               <LogOut size={20} />
//               {!isCollapsed && <span>Logout</span>}
//             </button>
//           </div>

//           <button
//             onClick={() => setIsCollapsed(!isCollapsed)}
//             className="hidden lg:flex absolute -right-3 top-20 h-6 w-6 items-center justify-center rounded-full border border-gray-200 bg-white shadow-sm"
//           >
//             {isCollapsed ? (
//               <ChevronRight size={14} />
//             ) : (
//               <ChevronLeft size={14} />
//             )}
//           </button>
//         </div>
//       </aside>
//     </>
//   );
// }
"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import {
  LayoutDashboard,
  User,
  Briefcase,
  FileText,
  Settings,
  Users,
  Building2,
  CreditCard,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Search,
  Heart,
  AlertTriangle,
  MessageSquare,
  Calendar,
  X,
} from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

const seekerMenuItems = [
  { href: "/dashboard/seeker", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/seeker/jobs", label: "Browse Jobs", icon: Search },
  {
    href: "/dashboard/seeker/applications",
    label: "My Applications",
    icon: FileText,
  },
  { href: "/dashboard/seeker/saved-jobs", label: "Saved Jobs", icon: Heart },
  { href: "/dashboard/seeker/chat", label: "Messages", icon: MessageSquare },
  { href: "/dashboard/seeker/profile", label: "My Profile", icon: User },
  { href: "/dashboard/seeker/settings", label: "Settings", icon: Settings },
];

const recruiterMenuItems = [
  { href: "/dashboard/recruiter", label: "Overview", icon: LayoutDashboard },
  {
    href: "/dashboard/recruiter/profile",
    label: "Company Profile",
    icon: Building2,
  },
  { href: "/dashboard/recruiter/jobs", label: "My Jobs", icon: Briefcase },
  {
    href: "/dashboard/recruiter/applications",
    label: "Applications",
    icon: FileText,
  },
  {
    href: "/dashboard/recruiter/interviews",
    label: "Interviews",
    icon: Calendar,
  },
  { href: "/dashboard/recruiter/chat", label: "Messages", icon: MessageSquare },
  {
    href: "/dashboard/recruiter/subscription",
    label: "Subscription",
    icon: CreditCard,
  },
  { href: "/dashboard/recruiter/settings", label: "Settings", icon: Settings },
];

const adminMenuItems = [
  { href: "/dashboard/admin", label: "Overview", icon: LayoutDashboard },
  {
    href: "/dashboard/admin/reported-recruiters",
    label: "Reported Recruiters",
    icon: AlertTriangle,
  },
  { href: "/dashboard/admin/users", label: "Users", icon: Users },
  { href: "/dashboard/admin/settings", label: "Settings", icon: Settings },
];

export default function Sidebar({
  isCollapsed,
  setIsCollapsed,
  isMobileOpen = false,
  setIsMobileOpen = () => {},
}) {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const sidebarRef = useRef(null);

  const role = user?.role?.toLowerCase();
  const menuItems =
    role === "admin"
      ? adminMenuItems
      : role === "recruiter" || role === "job_recruiter"
        ? recruiterMenuItems
        : seekerMenuItems;

  // Close sidebar when clicking outside (mobile only)
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target) &&
        isMobileOpen
      ) {
        setIsMobileOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isMobileOpen, setIsMobileOpen]);

  // Close mobile sidebar when route changes
  useEffect(() => {
    if (isMobileOpen) setIsMobileOpen(false);
  }, [pathname]); // Removed setIsMobileOpen from deps to avoid unnecessary triggers

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      <div
        className={`fixed inset-0 z-40 bg-black/40 backdrop-blur-sm transition-opacity lg:hidden ${
          isMobileOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />

      <aside
        ref={sidebarRef}
        className={`fixed left-0 top-0 z-50 h-screen border-r border-gray-200 bg-white transition-all duration-300 ease-in-out
          ${isMobileOpen ? "translate-x-0 w-72" : "-translate-x-full lg:translate-x-0"}
          ${isCollapsed ? "lg:w-20" : "lg:w-64"}
        `}
      >
        <div className="flex h-full flex-col">
          {/* Logo / Header Area */}
          <div className="flex h-16 items-center justify-between px-6">
            <span
              className={`text-xl font-bold text-brand-primary transition-opacity ${isCollapsed && !isMobileOpen ? "lg:opacity-0" : "opacity-100"}`}
            >
              JOBPORTAL
            </span>
            <button
              onClick={() => setIsMobileOpen(false)}
              className="lg:hidden"
            >
              <X size={20} className="text-gray-500" />
            </button>
          </div>

          {/* Navigation Items */}
          <nav className="flex-1 space-y-1 overflow-y-auto p-3 custom-scrollbar">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all ${
                    isActive
                      ? "bg-gray-100 text-brand-primary"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  <Icon
                    size={20}
                    className={`flex-shrink-0 ${isActive ? "text-brand-primary" : "text-gray-400"}`}
                  />
                  <span
                    className={`transition-opacity duration-200 ${isCollapsed && !isMobileOpen ? "lg:hidden" : "block"}`}
                  >
                    {item.label}
                  </span>
                </Link>
              );
            })}
          </nav>

          {/* User Profile & Logout */}
          <div className="border-t border-gray-100 p-4">
            <div
              className={`mb-4 flex items-center gap-3 px-2 ${isCollapsed && !isMobileOpen ? "lg:justify-center lg:px-0" : ""}`}
            >
              <div className="h-9 w-9 rounded-full bg-brand-primary/10 flex items-center justify-center text-brand-primary font-bold">
                {user?.email?.[0].toUpperCase()}
              </div>
              <div
                className={`min-w-0 ${isCollapsed && !isMobileOpen ? "lg:hidden" : "block"}`}
              >
                <p className="truncate text-sm font-semibold text-gray-900">
                  {user?.email?.split("@")[0]}
                </p>
                <p className="text-xs text-gray-500 capitalize">
                  {user?.role?.replace("_", " ")}
                </p>
              </div>
            </div>

            <button
              onClick={logout}
              className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-red-600 transition-colors hover:bg-red-50 ${
                isCollapsed && !isMobileOpen ? "lg:justify-center" : ""
              }`}
            >
              <LogOut size={20} />
              <span
                className={isCollapsed && !isMobileOpen ? "lg:hidden" : "block"}
              >
                Logout
              </span>
            </button>
          </div>

          {/* Desktop Toggle Button */}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hidden lg:flex absolute -right-3 top-10 h-6 w-6 items-center justify-center rounded-full border border-gray-200 bg-white shadow-sm hover:bg-gray-50"
          >
            {isCollapsed ? (
              <ChevronRight size={14} />
            ) : (
              <ChevronLeft size={14} />
            )}
          </button>
        </div>
      </aside>
    </>
  );
}
