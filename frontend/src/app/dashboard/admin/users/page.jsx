"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { adminService } from "@/lib/api/admin";
import {
  Loader2,
  Users,
  Search,
  User,
  Briefcase,
  Mail,
  Shield,
} from "lucide-react";

export default function UsersPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const { data: users, isLoading } = useQuery({
    queryKey: ["admin-users"],
    queryFn: adminService.getAllUsers,
  });

  const usersList = Array.isArray(users) ? users : [];

  const filteredUsers = searchQuery
    ? usersList.filter(
        (user) =>
          user.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          user.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          user.role?.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    : usersList;

  const stats = {
    total: usersList.length,
    seekers: usersList.filter(
      (u) =>
        u.role?.toLowerCase() === "job_seeker" ||
        u.role?.toLowerCase() === "seeker",
    ).length,
    recruiters: usersList.filter((u) => u.role?.toLowerCase() === "job_recruiter").length,
    admins: usersList.filter((u) => u.role?.toLowerCase() === "admin").length,
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Users</h1>
          <p className="text-secondary">Manage platform users</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <div className="rounded-xl border border-border bg-surface p-4">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-surface-hover p-2">
              <Users size={20} className="text-brand-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{stats.total}</p>
              <p className="text-sm text-secondary">Total Users</p>
            </div>
          </div>
        </div>
        <div className="rounded-xl border border-border bg-surface p-4">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-green-100 p-2">
              <Briefcase size={20} className="text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{stats.seekers}</p>
              <p className="text-sm text-secondary">Job Seekers</p>
            </div>
          </div>
        </div>
        <div className="rounded-xl border border-border bg-surface p-4">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-purple-100 p-2">
              <User size={20} className="text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{stats.recruiters}</p>
              <p className="text-sm text-secondary">Recruiters</p>
            </div>
          </div>
        </div>
        <div className="rounded-xl border border-border bg-surface p-4">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-red-100 p-2">
              <Shield size={20} className="text-red-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{stats.admins}</p>
              <p className="text-sm text-secondary">Admins</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted" />
          <input
            type="text"
            placeholder="Search users by email, name, or role..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg border border-border bg-background py-2.5 pl-10 pr-4 text-foreground placeholder:text-muted focus:border-brand-primary focus:outline-none"
          />
        </div>
      </div>

      {isLoading ? (
        <div className="flex h-64 items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-brand-primary" />
        </div>
      ) : filteredUsers.length > 0 ? (
        <div className="rounded-xl border border-border bg-surface">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="px-6 py-3 text-left text-sm font-medium text-secondary">User</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-secondary">Email</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-secondary">Role</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-secondary">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-surface-hover">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-surface-hover">
                          <User size={20} className="text-brand-primary" />
                        </div>
                        <span className="font-medium text-foreground">{user.name || "N/A"}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-sm text-secondary">
                        <Mail size={14} />
                        {user.email || "N/A"}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          user.role?.toLowerCase() === "admin"
                            ? "bg-red-100 text-red-700"
                            : user.role?.toLowerCase() === "recruiter"
                              ? "bg-purple-100 text-purple-700"
                              : "bg-green-100 text-green-700"
                        }`}
                      >
                        {user.role || "User"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          user.isActive || user.active
                            ? "bg-green-100 text-green-700"
                            : "bg-surface-hover text-secondary"
                        }`}
                      >
                        {user.isActive || user.active ? "Active" : "Inactive"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="rounded-xl border border-border bg-surface p-12 text-center">
          <Users className="mx-auto h-12 w-12 text-muted" />
          <h3 className="mt-4 text-lg font-medium text-foreground">No users found</h3>
          <p className="mt-1 text-secondary">
            {searchQuery ? "Try a different search term" : "No users on the platform yet"}
          </p>
        </div>
      )}
    </div>
  );
}
