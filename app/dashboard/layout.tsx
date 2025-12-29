"use client";

import Sidebar from "../components/Sidebar";
import DashboardNavbar from "../components/DashboardNavbar";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getUserFromToken } from "@/app/lib/getUserFromToken";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  useEffect(() => {
    const user = getUserFromToken();

    // ❌ No token
    if (!user) {
      router.replace("/auth/signin");
      return;
    }

    // ❌ Member trying to access admin dashboard
    if (user.role !== "admin") {
      router.replace("/user/profile");
    }
  }, [router]);

  return (
    <div className="flex h-screen bg-[#050505] overflow-hidden">
      {/* SIDEBAR */}
      <aside className="h-screen flex-shrink-0">
        <Sidebar />
      </aside>

      {/* CONTENT AREA */}
      <div className="flex-1 flex flex-col h-screen">
        <DashboardNavbar />
        <main className="flex-1 overflow-y-auto p-8">{children}</main>
      </div>
    </div>
  );
}
