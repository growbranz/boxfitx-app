"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Dumbbell,
  CalendarCheck,
  ClipboardList,
  User,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { getUserFromToken } from "@/app/lib/getUserFromToken";

type Role = "admin" | "member";

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [role, setRole] = useState<Role | null>(null);
  const [collapsed, setCollapsed] = useState(false);

  /* ---------- AUTH CHECK ---------- */
  useEffect(() => {
    const user = getUserFromToken();
    if (!user) {
      router.replace("/auth/signin");
      return;
    }
    setRole(user.role);
  }, [router]);

  /* ---------- LOGOUT ---------- */
  const logout = () => {
    localStorage.removeItem("token");
    router.replace("/auth/signin");
  };

  if (!role) return null;

  /* ---------- MENUS ---------- */
  const adminMenu = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Members", href: "/dashboard/members", icon: Users },
    { name: "Trainers", href: "/dashboard/trainers", icon: Dumbbell },
    { name: "Plans", href: "/dashboard/plans", icon: ClipboardList },
    { name: "Attendance", href: "/dashboard/attendance", icon: CalendarCheck },
  ];

  const memberMenu = [
    { name: "Dashboard", href: "/user/dashboard", icon: LayoutDashboard },
    { name: "My Profile", href: "/user/profile", icon: User },
    { name: "My Attendance", href: "/user/attendance", icon: CalendarCheck },
    { name: "My Membership", href: "/user/membership", icon: ClipboardList },
  ];

  const menu = role === "admin" ? adminMenu : memberMenu;

  return (
    <motion.aside
      animate={{ width: collapsed ? 80 : 256 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="h-screen bg-[#050505] border-r border-[#00FF6A]/20 flex flex-col overflow-hidden"
    >
      {/* ---------- HEADER ---------- */}
      <div className="p-6 border-b border-[#00FF6A]/20 flex items-center justify-between">
        {!collapsed && (
          <div>
            {!collapsed && (
              <div className="flex items-center gap-2">
                <Image
                  src="/logo.png" // put logo inside /public/logo.png
                  alt="BOXFITX"
                  width={140}
                  height={40}
                  priority
                  className="drop-shadow-[0_0_20px_#00FF6A]"
                />
              </div>
            )}
            <p className="text-xs text-gray-400 tracking-widest mt-1">
              {role === "admin" ? "ADMIN PANEL" : "MEMBER PANEL"}
            </p>
          </div>
        )}

        <button
          onClick={() => setCollapsed(!collapsed)}
          className="text-[#00FF6A] hover:scale-110 transition"
        >
          {collapsed ? <Menu size={22} /> : <X size={22} />}
        </button>
      </div>

      {/* ---------- MENU ---------- */}
      <nav className="flex-1 p-3 space-y-1">
        {menu.map((item) => {
          const active =
            item.href === "/dashboard"
              ? pathname === "/dashboard"
              : pathname === item.href || pathname.startsWith(item.href + "/");

          return (
            <Link
              key={item.name}
              href={item.href}
              className={`
                flex items-center gap-3 px-4 py-3 rounded-xl
                transition-all duration-200
                ${
                  active
                    ? "bg-[#00FF6A]/15 text-[#00FF6A] shadow-[0_0_15px_#00FF6A55]"
                    : "text-gray-400 hover:bg-white/5 hover:text-[#00FF6A]"
                }
              `}
            >
              <item.icon size={20} />

              <AnimatePresence>
                {!collapsed && (
                  <motion.span
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ duration: 0.2 }}
                    className="text-sm font-medium tracking-wide whitespace-nowrap"
                  >
                    {item.name}
                  </motion.span>
                )}
              </AnimatePresence>
            </Link>
          );
        })}
      </nav>

      {/* ---------- LOGOUT ---------- */}
      <div className="p-4 border-t border-[#00FF6A]/20">
        <button
          onClick={logout}
          className="flex items-center gap-3 w-full px-4 py-3 rounded-xl
          text-red-400 hover:bg-red-500/10 transition"
        >
          <LogOut size={20} />

          {!collapsed && (
            <span className="text-sm font-medium tracking-wide">Logout</span>
          )}
        </button>
      </div>
    </motion.aside>
  );
}
