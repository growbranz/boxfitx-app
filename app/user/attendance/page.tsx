"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function UserAttendancePage() {
  const router = useRouter();
  const [records, setRecords] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.push("/auth/signin");
      return;
    }

    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/user/attendance`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to load attendance");
        return data;
      })
      .then((data) => setRecords(data.records || []))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="text-center text-gray-400 py-20">
        Loading attendance...
      </div>
    );
  }

  if (error) {
    return <div className="text-center text-red-400 py-20">{error}</div>;
  }

  return (
    <div className="max-w-6xl mx-auto px-4 text-white space-y-8">
      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-extrabold tracking-widest text-[#00FF6A]">
          ATTENDANCE
        </h1>
        <p className="text-sm text-gray-400 mt-1">Your gym check-in history</p>
      </div>

      {/* TABLE */}
      <div className="border border-[#00FF6A]/30 rounded-2xl overflow-hidden shadow-[0_0_60px_#00FF6A11]">
        <table className="w-full text-sm">
          <thead className="bg-[#00FF6A]/10 text-[#00FF6A]">
            <tr>
              <th className="p-4 text-left">DATE</th>
              <th className="p-4">CHECK-IN</th>
              <th className="p-4">CHECK-OUT</th>
              <th className="p-4">STATUS</th>
            </tr>
          </thead>

          <tbody>
            {records.length === 0 ? (
              <tr>
                <td colSpan={4} className="p-10 text-center text-gray-400">
                  No attendance records found
                </td>
              </tr>
            ) : (
              records.map((r, i) => {
                const status =
                  r.checkIn && r.checkOut
                    ? "PRESENT"
                    : r.checkIn
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
                    <td className="p-4">{new Date(r.date).toDateString()}</td>

                    <td className="p-4 text-gray-300">
                      {r.checkIn
                        ? new Date(r.checkIn).toLocaleTimeString("en-IN", {
                            hour: "2-digit",
                            minute: "2-digit",
                            hour12: true,
                          })
                        : "—"}
                    </td>

                    <td className="p-4 text-gray-300">
                      {r.checkOut
                        ? new Date(r.checkOut).toLocaleTimeString("en-IN", {
                            hour: "2-digit",
                            minute: "2-digit",
                            hour12: true,
                          })
                        : "—"}
                    </td>

                    <td className="p-4">
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
    </div>
  );
}
