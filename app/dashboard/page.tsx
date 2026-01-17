"use client";

import { useEffect, useRef, useState } from "react";
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

/* ---------- TYPES ---------- */
type CachePayload = {
  summary: any;
  attendance: any[];
  notices: any[];
  trainers: any[];
};

const CACHE_KEY = "dashboard_cache";

/* ---------- COMPONENT ---------- */
export default function DashboardPage() {
  const router = useRouter();
  const abortRef = useRef<AbortController | null>(null);

  const [data, setData] = useState<CachePayload | null>(null);
  const [loading, setLoading] = useState(true);

  /* ---------- TIME FORMAT ---------- */
  const formatIST = (iso?: string) =>
    iso
      ? new Date(iso).toLocaleTimeString("en-IN", {
          timeZone: "Asia/Kolkata",
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        })
      : "—";

  /* ---------- FETCH DASHBOARD ---------- */
  useEffect(() => {
    const token = localStorage.getItem("token");

    // 🔐 Not logged in → redirect
    if (!token) {
      toast.error("Please login again");
      router.replace("/login");
      return;
    }

    abortRef.current?.abort();
    abortRef.current = new AbortController();

    // 🚀 Load cache instantly
    const cached = sessionStorage.getItem(CACHE_KEY);
    if (cached) {
      setData(JSON.parse(cached));
      setLoading(false);
    }

    const fetchJSON = async (url: string) => {
      const res = await fetch(url, {
        signal: abortRef.current?.signal,
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (res.status === 401) {
        localStorage.removeItem("token");
        router.replace("/login");
        throw new Error("Unauthorized");
      }

      if (!res.ok) {
        throw new Error(`Failed: ${url}`);
      }

      return res.json();
    };

    const fetchAll = async () => {
      try {
        const api = process.env.NEXT_PUBLIC_API_URL;
        if (!api) throw new Error("API URL missing");

        const [summary, attendance, notices, trainers] = await Promise.all([
          fetchJSON(`${api}/api/dashboard/summary`),
          fetchJSON(`${api}/api/attendance/today`),
          fetchJSON(`${api}/api/notices`),
          fetchJSON(`${api}/api/trainers`),
        ]);

        const payload: CachePayload = {
          summary: summary.data,
          attendance: attendance.records ?? [],
          notices: notices.data ?? [],
          trainers: trainers.data ?? [],
        };

        setData(payload);
        sessionStorage.setItem(CACHE_KEY, JSON.stringify(payload));
      } catch (err: any) {
        if (err.name !== "AbortError") {
          toast.error("Failed to load dashboard");
          console.error(err);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchAll();

    return () => abortRef.current?.abort();
  }, [router]);

  /* ---------- STATES ---------- */
  if (loading) {
    return (
      <div className="text-center text-gray-400 py-32">Loading dashboard…</div>
    );
  }

  if (!data) {
    return (
      <div className="text-center text-red-400 py-32">
        Failed to load dashboard
      </div>
    );
  }

  const { summary, attendance, notices, trainers } = data;

  /* ---------- UI ---------- */
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
        {/* ATTENDANCE */}
        <div className="xl:col-span-2 border border-[#00FF6A]/40">
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
                    <tr key={i} className="border-t border-[#00FF6A]/10">
                      <td className="p-3 font-medium">
                        {a.member?.fullName ?? "—"}
                      </td>
                      <td className="p-3">{formatIST(a.checkIn)}</td>
                      <td className="p-3">{formatIST(a.checkOut)}</td>
                      <td className="p-3">
                        <span
                          className={`px-3 py-1 text-xs font-bold rounded ${badge}`}
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
        <div className="border border-[#00FF6A]/40">
          <h3
            onClick={() => router.push("/dashboard/notices/create")}
            className="p-4 flex items-center gap-2 text-sm tracking-widest text-[#00FF6A] cursor-pointer"
          >
            <Bell size={16} />
            NOTICE BOARD
            <span className="ml-auto text-xs text-gray-400">+ ADD</span>
          </h3>

          <div className="divide-y divide-[#00FF6A]/10">
            {notices.map((n) => (
              <div key={n._id} className="p-4">
                <div className="flex justify-between items-center">
                  <p className="font-semibold">{n.title}</p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => router.push(`/dashboard/notices/${n._id}`)}
                    >
                      <Pencil size={14} />
                    </button>
                    <button
                      onClick={() =>
                        setData((p) =>
                          p
                            ? {
                                ...p,
                                notices: p.notices.filter(
                                  (x) => x._id !== n._id,
                                ),
                              }
                            : p,
                        )
                      }
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
                {n.description && (
                  <p className="text-xs text-gray-400 mt-1">{n.description}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* TRAINERS */}
      <div className="border border-[#00FF6A]/40">
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
              <tr key={t._id} className="border-t border-[#00FF6A]/10">
                <td className="p-3 font-medium">{t.fullName}</td>
                <td className="p-3 text-gray-300">{t.speciality}</td>
                <td className="p-3">
                  <span
                    className={`px-3 py-1 text-xs font-bold rounded ${
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

/* ---------- STAT ---------- */
function Stat({ icon, label, value }: any) {
  return (
    <div className="relative p-5 border border-[#00FF6A]/50">
      <div className="flex justify-between text-[#00FF6A]">
        {icon}
        <span className="text-3xl font-extrabold">{value}</span>
      </div>
      <p className="mt-3 text-xs tracking-[0.3em] text-gray-400">{label}</p>
    </div>
  );
}
