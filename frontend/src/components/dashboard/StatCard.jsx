"use client";

import React from "react";

export function StatCard({ label, value, icon: Icon, color }) {
  const colorClasses = {
    blue: "bg-gray-200 text-brand-primary",
    yellow: "bg-yellow-100 text-yellow-600",
    green: "bg-green-100 text-green-600",
    red: "bg-red-100 text-red-600",
    purple: "bg-purple-100 text-purple-600",
    pink: "bg-pink-100 text-pink-600",
    orange: "bg-orange-100 text-orange-600",
    cyan: "bg-cyan-100 text-cyan-600",
  };

  const currentColorClass = colorClasses[color] || colorClasses.blue;

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition-all hover:shadow-md">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{label}</p>
          <p className="mt-1 text-2xl font-bold text-gray-900">{value}</p>
        </div>
        <div className={`rounded-xl p-3 ${currentColorClass}`}>
          <Icon size={24} />
        </div>
      </div>
    </div>
  );
}
