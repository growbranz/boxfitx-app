"use client";

import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import {
  Users,
  UserCheck,
  UserX,
  CalendarCheck,
  Dumbbell,
  Bell,
  Pencil,
  Trash2,
} from "lucide-react";

import { useRouter } from "next/navigation";
export default function DashboardPage() {
  const [summary, setSummary] = useState<any>(null);
  const [attendance, setAttendance] = useState<any[]>([]);
  const [notices, setNotices] = useState<any[]>([]);
  const [trainers, setTrainers] = useState<any[]>([]);
  const router = useRouter();
  const formatIST = (isoString?: string) => {
    if (!isoString) return "—";

    return new Date(isoString).toLocaleTimeString("en-IN", {
      timeZone: "Asia/Kolkata",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  useEffect(() => {
    const token = localStorage.getItem("token");

    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/dashboard/summary`)
      .then((r) => r.json())
      .then((d) => setSummary(d.data));

    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/attendance/today`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((d) => setAttendance(d.records || []));

    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/notices`)
      .then((r) => r.json())
      .then((d) => setNotices(d.data || []));

    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/trainers`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((d) => setTrainers(d.data || []));
  }, []);

  if (!summary) return null;

  return (
    <div className="space-y-12 text-white bg-[#050505] min-h-full">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div className="relative pl-4">
          <span className="absolute left-0 top-1 h-10 w-1 bg-[#00FF6A]" />
          <h1 className="text-4xl font-extrabold tracking-widest text-[#00FF6A]">
            BOXFITX
          </h1>
          <p className="text-xs text-gray-400 tracking-[0.3em] uppercase">
            Gym Control Dashboard
          </p>
        </div>

        <div className="flex items-center gap-2 text-[#00FF6A]">
          <Dumbbell />
          <span className="font-bold tracking-widest">POWER MODE</span>
        </div>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-6">
        <Stat
          icon={<Users />}
          label="TOTAL MEMBERS"
          value={summary.TotalMembers}
        />
        <Stat
          icon={<UserCheck />}
          label="ACTIVE"
          value={summary.ActiveMembers}
        />
        <Stat
          icon={<UserX />}
          label="INACTIVE"
          value={summary.InactiveMembers}
        />
        <Stat
          icon={<CalendarCheck />}
          label="EXPIRED"
          value={summary.ExpiredMembers}
        />
        <Stat
          icon={<Dumbbell />}
          label="TRAINERS"
          value={summary.TotalTrainers}
        />
        <Stat
          icon={<CalendarCheck />}
          label="TODAY CHECK-INS"
          value={attendance.filter((a) => a.checkIn).length}
        />
      </div>

      {/* ATTENDANCE + NOTICE */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* TODAY ATTENDANCE */}
        <div className="xl:col-span-2 border border-[#00FF6A]/40 shadow-[0_0_60px_#00FF6A11]">
          <h3 className="p-4 text-sm tracking-widest text-[#00FF6A]">
            TODAY ATTENDANCE
          </h3>

          <table className="w-full text-sm">
            <thead className="bg-[#00FF6A]/10 text-[#00FF6A]">
              <tr>
                <th className="p-3 text-left">MEMBER</th>
                <th className="p-3">CHECK-IN</th>
                <th className="p-3">CHECK-OUT</th>
                <th className="p-3">STATUS</th>
              </tr>
            </thead>

            <tbody>
              {attendance.length === 0 ? (
                <tr>
                  <td colSpan={4} className="p-6 text-center text-gray-400">
                    No attendance recorded today
                  </td>
                </tr>
              ) : (
                attendance.slice(0, 6).map((a, i) => {
                  const status =
                    a.checkIn && a.checkOut
                      ? "PRESENT"
                      : a.checkIn
                      ? "INSIDE"
                      : "ABSENT";

                  const badge =
                    status === "PRESENT"
                      ? "bg-green-500/20 text-green-400"
                      : status === "INSIDE"
                      ? "bg-yellow-500/20 text-yellow-400"
                      : "bg-red-500/20 text-red-400";

                  return (
                    <tr
                      key={i}
                      className="border-t border-[#00FF6A]/10 hover:bg-[#00FF6A]/5"
                    >
                      <td className="p-3 font-medium">
                        {a.member?.fullName || "—"}
                      </td>

                      <td className="p-3 text-gray-300">
                        {formatIST(a.checkIn)}
                      </td>

                      <td className="p-3 text-gray-300">
                        {formatIST(a.checkOut)}
                      </td>

                      <td className="p-3">
                        <span
                          className={`px-3 py-1 text-xs font-bold tracking-widest rounded ${badge}`}
                        >
                          {status}
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* NOTICE BOARD */}
        <div className="border border-[#00FF6A]/40 shadow-[0_0_60px_#00FF6A11]">
          <h3
            onClick={() => router.push("/dashboard/notices/create")}
            className="p-4 flex items-center gap-2 text-sm tracking-widest
    text-[#00FF6A] cursor-pointer hover:bg-[#00FF6A]/10 transition"
          >
            <Bell size={16} />
            NOTICE BOARD
            <span className="ml-auto text-xs text-gray-400 tracking-widest">
              + ADD
            </span>
          </h3>

          <div className="divide-y divide-[#00FF6A]/10">
            {notices.map((n) => {
              const badge =
                n.priority === "high"
                  ? "bg-red-500/20 text-red-400"
                  : n.priority === "low"
                  ? "bg-blue-500/20 text-blue-400"
                  : "bg-yellow-500/20 text-yellow-400";

              const deleteNotice = async () => {
                const token = localStorage.getItem("token");
                const t = toast.loading("Deleting notice...");

                try {
                  await fetch(
                    `${process.env.NEXT_PUBLIC_API_URL}/api/notices/${n._id}`,
                    {
                      method: "DELETE",
                      headers: { Authorization: `Bearer ${token}` },
                    }
                  );

                  toast.success("Notice deleted", { id: t });
                  setNotices((prev) => prev.filter((x) => x._id !== n._id));
                } catch {
                  toast.error("Delete failed", { id: t });
                }
              };

              return (
                <div key={n._id} className="p-4 hover:bg-[#00FF6A]/5">
                  <div className="flex justify-between items-center">
                    <p className="text-sm font-semibold">{n.title}</p>

                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-1 text-xs rounded ${badge}`}>
                        {n.priority.toUpperCase()}
                      </span>

                      {/* EDIT */}
                      <button
                        onClick={() =>
                          router.push(`/dashboard/notices/${n._id}`)
                        }
                        className="text-blue-400 hover:text-blue-300"
                      >
                        <Pencil size={14} />
                      </button>

                      {/* DELETE */}
                      <button
                        onClick={deleteNotice}
                        className="text-red-400 hover:text-red-300"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>

                  {n.description && (
                    <p className="text-xs text-gray-400 mt-1">
                      {n.description}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* TRAINERS */}
      <div className="border border-[#00FF6A]/40 shadow-[0_0_60px_#00FF6A11]">
        <h3 className="p-4 text-sm tracking-widest text-[#00FF6A]">TRAINERS</h3>

        <table className="w-full text-sm">
          <thead className="bg-[#00FF6A]/10 text-[#00FF6A]">
            <tr>
              <th className="p-3 text-left">NAME</th>
              <th className="p-3">SPECIALITY</th>
              <th className="p-3">STATUS</th>
            </tr>
          </thead>

          <tbody>
            {trainers.map((t) => (
              <tr
                key={t._id}
                className="border-t border-[#00FF6A]/10 hover:bg-[#00FF6A]/5"
              >
                <td className="p-3 font-medium">{t.fullName}</td>
                <td className="p-3 text-gray-300">{t.speciality}</td>
                <td className="p-3">
                  <span
                    className={`px-3 py-1 text-xs font-bold tracking-widest rounded
                    ${
                      t.status === "active"
                        ? "bg-green-500/20 text-green-400"
                        : "bg-red-500/20 text-red-400"
                    }`}
                  >
                    {t.status.toUpperCase()}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ---------- STAT CARD ---------- */

function Stat({ icon, label, value }: any) {
  return (
    <div
      className="relative p-5 border border-[#00FF6A]/50
      shadow-[0_0_50px_#00FF6A22]
      hover:shadow-[0_0_80px_#00FF6A66]
      transition"
    >
      <div className="flex items-center justify-between text-[#00FF6A]">
        {icon}
        <span className="text-3xl font-extrabold">{value}</span>
      </div>
      <p className="mt-3 text-xs tracking-[0.3em] text-gray-400">{label}</p>
    </div>
  );
}
