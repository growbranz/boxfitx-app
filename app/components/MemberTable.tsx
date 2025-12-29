"use client";

import Link from "next/link";

export default function MemberTable({ members, meta, onPageChange }: any) {
  return (
    <div className="bg-black/60 rounded-xl border border-white/10 overflow-hidden">
      <table className="w-full text-sm">
        <thead className="bg-white/5 text-gray-400">
          <tr>
            <th className="p-3 text-left">Name</th>
            <th>Age</th>
            <th>Plan</th>
            <th>Status</th>
            <th>Phone</th>
            <th></th>
          </tr>
        </thead>

        <tbody>
          {members.map((m: any) => (
            <tr
              key={m._id}
              className="border-t border-white/5 hover:bg-white/5"
            >
              <td className="p-3 text-white font-medium">{m.fullName}</td>
              <td className="text-gray-300">{m.age || "-"}</td>
              <td className="text-gray-300">{m.membership?.planType || "-"}</td>
              <td>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold
                  ${
                    m.status === "active"
                      ? "bg-green-500/20 text-green-400"
                      : m.status === "expired"
                      ? "bg-red-500/20 text-red-400"
                      : "bg-yellow-500/20 text-yellow-400"
                  }`}
                >
                  {m.status}
                </span>
              </td>
              <td className="text-gray-400">{m.number}</td>
              <td className="p-3 text-right">
                <Link
                  href={`/dashboard/members/${m._id}`}
                  className="text-green-400 hover:underline"
                >
                  View
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* PAGINATION */}
      {meta && (
        <div className="flex justify-end gap-2 p-4">
          {Array.from({ length: meta.totalPages }).map((_, i) => (
            <button
              key={i}
              onClick={() => onPageChange(i + 1)}
              className="px-3 py-1 bg-white/10 text-white rounded hover:bg-green-500/30"
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
