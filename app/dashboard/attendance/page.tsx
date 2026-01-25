"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function AttendanceHistoryPage() {
  const router = useRouter();

  const [records, setRecords] = useState<any[]>([]);
  const [stats, setStats] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    const token = localStorage.getItem("token");

    /* TODAY ATTENDANCE */
    const todayRes = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/attendance/today`,
      {
        headers: { Authorization: `Bearer ${token}` },
      },
    );
    const todayData = await todayRes.json();
    setRecords(todayData.records || []);

    /* MONTHLY GRAPH */
    const now = new Date();
    const monthRes = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/attendance/monthly?month=${
        now.getMonth() + 1
      }&year=${now.getFullYear()}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      },
    );
    const monthData = await monthRes.json();
    setStats(monthData.stats || []);

    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="space-y-14 text-white">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div className="relative pl-4">
          <span className="absolute left-0 top-1 h-10 w-1 bg-[#00FF6A]" />
          <h1 className="text-4xl font-extrabold tracking-wider text-[#00FF6A]">
            ATTENDANCE
          </h1>
          <p className="text-xs text-gray-400 tracking-[0.3em] uppercase">
            Member Entry Monitoring
          </p>
        </div>

        {/* IMPORT BUTTON */}
        <button
          onClick={() => router.push("/dashboard/attendance/import")}
          className="
            px-6 py-2 rounded-lg
            bg-[#00FF6A] text-black font-bold tracking-wide
            hover:shadow-[0_0_25px_#00FF6Aaa]
            transition
          "
        >
          IMPORT
        </button>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Stat label="TOTAL CHECK-INS" value={records.length} />
        <Stat
          label="INSIDE"
          value={records.filter((r) => r.checkIn && !r.checkOut).length}
        />
        <Stat
          label="CHECKED OUT"
          value={records.filter((r) => r.checkOut).length}
        />
      </div>

      {/* CHART */}
      <div className="p-6 border border-[#00FF6A]/40 shadow-[0_0_70px_#00FF6A22]">
        <h3 className="mb-4 text-sm tracking-[0.3em] text-[#00FF6A]">
          MONTHLY TREND
        </h3>

        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={stats}>
              <XAxis dataKey="date" stroke="#00FF6A" />
              <YAxis stroke="#00FF6A" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#000",
                  border: "1px solid #00FF6A",
                  color: "#00FF6A",
                }}
              />
              <Line
                type="monotone"
                dataKey="count"
                stroke="#00FF6A"
                strokeWidth={4}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* TABLE */}
      <div className="border border-[#00FF6A]/40 shadow-[0_0_60px_#00FF6A11]">
        <table className="w-full text-sm">
          <thead className="bg-[#00FF6A]/15 text-[#00FF6A]">
            <tr>
              <th className="p-4 text-left">MEMBER</th>
              <th className="p-4">CHECK-IN</th>
              <th className="p-4">CHECK-OUT</th>
              <th className="p-4">SOURCE</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan={4} className="p-10 text-center text-gray-400">
                  LOADING...
                </td>
              </tr>
            ) : records.length === 0 ? (
              <tr>
                <td colSpan={4} className="p-10 text-center text-gray-400">
                  NO DATA
                </td>
              </tr>
            ) : (
              records.map((r) => (
                <tr
                  key={r._id}
                  className="border-t border-[#00FF6A]/10 hover:bg-[#00FF6A]/10"
                >
                  <td className="p-4 font-semibold">
                    {r.member?.fullName || "—"}
                  </td>
                  <td className="p-4 text-gray-300">
                    {r.checkIn
                      ? new Date(r.checkIn).toLocaleTimeString("en-IN", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })
                      : "—"}
                  </td>
                  <td className="p-4 text-gray-300">
                    {r.checkOut
                      ? new Date(r.checkOut).toLocaleTimeString("en-IN", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })
                      : "—"}
                  </td>
                  <td className="p-4">
                    <span
                      className={`px-4 py-1 text-xs font-bold tracking-widest
                        ${
                          r.source === "biometric"
                            ? "bg-[#00FF6A]/20 text-[#00FF6A]"
                            : "bg-yellow-400/20 text-yellow-400"
                        }`}
                    >
                      {r.source.toUpperCase()}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ---------- STAT ---------- */
function Stat({ label, value }: any) {
  return (
    <div className="p-6 border border-[#00FF6A]/40 shadow-[0_0_50px_#00FF6A22]">
      <p className="text-xs tracking-[0.3em] text-gray-400">{label}</p>
      <p className="mt-3 text-4xl font-extrabold text-[#00FF6A]">{value}</p>
    </div>
  );
}
