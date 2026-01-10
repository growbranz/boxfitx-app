"use client";

import { Bell } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";

const UserDashboard = () => {
  const router = useRouter();

  const [records, setRecords] = useState<any[]>([]);
  const [notices, setNotices] = useState<any[]>([]);
  const [trainers, setTrainers] = useState<any[]>([]);
  const [memberId, setMemberId] = useState<string>("");

  const [modal, setModal] = useState<null | "checkin" | "checkout">(null);

  const today = new Date().toISOString().slice(0, 10);
  const todayRecord = records.find((r) => r.date === today);

  const canCheckIn = !todayRecord?.checkIn;
  const canCheckOut = !!todayRecord?.checkIn && !todayRecord?.checkOut;

  /* ---------- LOAD DATA ---------- */
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/auth/signin");
      return;
    }

    const payload = JSON.parse(atob(token.split(".")[1]));
    const memberId =
      typeof payload.memberId === "string"
        ? payload.memberId
        : payload.memberId?._id;

    setMemberId(memberId);

    fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/attendance/member/${memberId}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    )
      .then((r) => r.json())
      .then((d) => setRecords(d.records || []));

    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/notices`)
      .then((r) => r.json())
      .then((d) => setNotices(d.data || []));

    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/trainers/public/list`)
      .then((r) => r.json())
      .then((d) => setTrainers(d.data || []));
  }, []);

  /* ---------- ACTIONS ---------- */
  const performAction = async (type: "checkin" | "checkout") => {
    const token = localStorage.getItem("token");
    const t = toast.loading(
      type === "checkin" ? "Checking in..." : "Checking out..."
    );

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/attendance/${type}`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!res.ok) throw new Error();

      toast.success(
        type === "checkin"
          ? "Checked in successfully"
          : "Checked out successfully",
        { id: t }
      );

      setModal(null);
      location.reload();
    } catch {
      toast.error("Action failed", { id: t });
    }
  };

  /* ---------- UI ---------- */
  return (
    <div className="max-w-6xl mx-auto px-4 text-white space-y-8">
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-extrabold text-[#00FF6A]">
            User Dashboard
          </h1>
          <p className="text-sm text-gray-400">Today’s attendance status</p>
        </div>

        <div className="flex gap-3">
          <button
            disabled={!canCheckIn}
            onClick={() => setModal("checkin")}
            className={`px-6 py-2 rounded-xl font-bold
              ${
                canCheckIn
                  ? "bg-[#00FF6A] text-black"
                  : "bg-gray-700 cursor-not-allowed"
              }`}
          >
            CHECK IN
          </button>

          <button
            disabled={!canCheckOut}
            onClick={() => setModal("checkout")}
            className={`px-6 py-2 rounded-xl font-bold
              ${
                canCheckOut
                  ? "bg-red-500 text-white"
                  : "bg-gray-700 cursor-not-allowed"
              }`}
          >
            CHECK OUT
          </button>
        </div>
      </div>

      {/* TODAY ATTENDANCE */}
      <div className="border border-[#00FF6A]/30 rounded-xl overflow-hidden">
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
            {!todayRecord ? (
              <tr>
                <td colSpan={4} className="p-6 text-center text-gray-400">
                  No check-in or check-out today
                </td>
              </tr>
            ) : (
              <tr className="border-t border-[#00FF6A]/10">
                <td className="p-4">{today}</td>
                <td className="p-4">
                  {todayRecord.checkIn
                    ? new Date(todayRecord.checkIn).toLocaleTimeString("en-IN")
                    : "—"}
                </td>
                <td className="p-4">
                  {todayRecord.checkOut
                    ? new Date(todayRecord.checkOut).toLocaleTimeString("en-IN")
                    : "—"}
                </td>
                <td className="p-4 font-bold">
                  {todayRecord.checkIn && todayRecord.checkOut
                    ? "PRESENT"
                    : todayRecord.checkIn
                    ? "INSIDE"
                    : "ABSENT"}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* NOTICE BOARD (UNCHANGED) */}
      <div className="border border-[#00FF6A]/30 rounded-xl">
        <h3 className="p-4 flex items-center gap-2 text-[#00FF6A]">
          <Bell size={16} /> NOTICE BOARD
        </h3>

        {notices.map((n) => (
          <div key={n._id} className="p-4 border-t border-[#00FF6A]/10">
            <p className="font-semibold">{n.title}</p>
            <p className="text-xs text-gray-400">{n.description}</p>
          </div>
        ))}
      </div>

      {/* TRAINERS (UNCHANGED) */}
      <div className="border border-[#00FF6A]/30 rounded-xl">
        <h3 className="p-4 text-[#00FF6A]">TRAINERS</h3>

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
                <td className="p-3">{t.fullName}</td>
                <td className="p-3">{t.speciality}</td>
                <td className="p-3">{t.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MODAL */}
      {modal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-[#050505] border border-[#00FF6A]/40 rounded-2xl p-8 w-full max-w-sm text-center space-y-6 shadow-[0_0_40px_#00FF6A22]">
            <h2 className="text-xl font-extrabold text-[#00FF6A]">
              {modal === "checkin" ? "Confirm Check-In" : "Confirm Check-Out"}
            </h2>

            <p className="text-gray-400 text-sm">
              Are you sure you want to{" "}
              {modal === "checkin" ? "check in" : "check out"} now?
            </p>

            <div className="flex justify-center gap-4">
              <button
                onClick={() => setModal(null)}
                className="px-5 py-2 rounded-xl bg-gray-700 text-white"
              >
                Cancel
              </button>

              <button
                onClick={() => performAction(modal)}
                className={`px-5 py-2 rounded-xl font-bold ${
                  modal === "checkin"
                    ? "bg-[#00FF6A] text-black"
                    : "bg-red-500 text-white"
                }`}
              >
                Yes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserDashboard;
