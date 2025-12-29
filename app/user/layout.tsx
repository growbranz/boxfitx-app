"use client";

import Sidebar from "../components/Sidebar";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getUserFromToken } from "@/app/lib/getUserFromToken";

export default function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  useEffect(() => {
    const user = getUserFromToken();

    // ❌ Not logged in
    if (!user) {
      router.replace("/auth/signin");
      return;
    }

    // ❌ Admin trying to access user pages
    if (user.role !== "member") {
      router.replace("/dashboard");
    }
  }, [router]);

  return (
    <div className="flex h-screen bg-[#050505] overflow-hidden">
      {/* SIDEBAR */}
      <aside className="h-screen flex-shrink-0">
        <Sidebar />
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 overflow-y-auto p-8 text-white">{children}</main>
    </div>
  );
}
