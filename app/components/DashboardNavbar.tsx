"use client";

import { Search, Bell } from "lucide-react";
import Image from "next/image";

export default function DashboardNavbar() {
  return (
    <header
      className="
        sticky top-0 z-40
        h-16 px-6
        flex items-center justify-between
        bg-black/70 backdrop-blur-xl
        border-b border-[#00FF6A]/20
        shadow-[0_2px_20px_#00FF6A11]
      "
    >
      {/* LEFT */}
      <h2 className="text-lg font-bold tracking-wide text-white"></h2>

      {/* RIGHT */}
      <div className="flex items-center gap-5">
        {/* SEARCH */}
        <div className="relative">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            placeholder="Search..."
            className="
              pl-10 pr-4 py-2 w-56
              rounded-lg
              bg-black border border-[#00FF6A]/40
              text-sm text-white placeholder-gray-400
              focus:outline-none
              focus:ring-2 focus:ring-[#00FF6A]/50
            "
          />
        </div>

        {/* NOTIFICATION */}
        <button
          className="
            relative p-2 rounded-lg
            border border-[#00FF6A]/30
            text-[#00FF6A]
            hover:bg-[#00FF6A]/10
            transition
          "
        >
          <Bell size={18} />
          <span className="absolute -top-1 -right-1 h-2 w-2 bg-red-500 rounded-full" />
        </button>

        {/* PROFILE */}
        <div className="flex items-center gap-3">
          <div className="hidden md:block leading-tight">
            <p className="text-sm font-semibold text-white">Admin</p>
            <p className="text-xs text-gray-400">Power Mode</p>
          </div>
        </div>
      </div>
    </header>
  );
}
