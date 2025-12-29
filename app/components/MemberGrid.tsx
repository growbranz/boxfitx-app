import Link from "next/link";

export default function MemberGrid({ members = [] }: any) {
  if (!members.length) {
    return (
      <div className="text-center text-gray-500 py-14 tracking-widest">
        NO MEMBERS FOUND
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-4 gap-6">
      {members.map((m: any) => {
        const statusColor =
          m.status === "active"
            ? "bg-[#00FF6A]"
            : m.status === "expired"
            ? "bg-red-500"
            : "bg-yellow-400";

        const statusGlow =
          m.status === "active"
            ? "shadow-[0_0_15px_#00FF6A]"
            : m.status === "expired"
            ? "shadow-[0_0_15px_rgba(239,68,68,0.7)]"
            : "shadow-[0_0_15px_rgba(234,179,8,0.7)]";

        return (
          <div
            key={m._id}
            className="
              relative p-5 rounded-2xl
              bg-black/70 backdrop-blur
              border border-[#00FF6A]/25
              transition-all duration-300
              hover:border-[#00FF6A]
              hover:shadow-[0_0_40px_#00FF6A33]
            "
          >
            {/* STATUS INDICATOR */}
            <span
              className={`absolute top-4 right-4 h-3 w-3 rounded-full ${statusColor} ${statusGlow}`}
            />

            {/* NAME */}
            <h3 className="text-lg font-bold text-white tracking-wide">
              {m.fullName}
            </h3>

            {/* CONTACT */}
            <p className="text-gray-400 text-sm truncate">{m.email}</p>
            <p className="text-gray-400 text-sm mt-1">📞 {m.number || "—"}</p>

            {/* TAGS */}
            <div className="mt-4 flex flex-wrap gap-2 text-xs">
              <span
                className="
                  px-3 py-1 rounded-full
                  bg-[#00FF6A]/15 text-[#00FF6A]
                  border border-[#00FF6A]/40
                "
              >
                {m.membership?.planType || "NO PLAN"}
              </span>

              <span
                className="
                  px-3 py-1 rounded-full
                  bg-white/10 text-gray-300
                  border border-white/10
                "
              >
                {m.gender || "—"}
              </span>
            </div>

            {/* ACTION */}
            <Link
              href={`/dashboard/members/${m._id}`}
              className="
                inline-block mt-5 text-sm tracking-widest
                text-[#00FF6A]
                hover:underline
              "
            >
              VIEW PROFILE →
            </Link>
          </div>
        );
      })}
    </div>
  );
}
