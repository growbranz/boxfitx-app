import Link from "next/link";

export default function TrainerGrid({ trainers = [] }: any) {
  if (!trainers.length) {
    return (
      <p className="text-center py-10 text-gray-500 tracking-widest">
        NO TRAINERS FOUND
      </p>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {trainers.map((t: any) => (
        <div
          key={t._id}
          className="
            relative p-6 rounded-xl
            bg-black/70 backdrop-blur
            border border-[#00FF6A]/30
            shadow-[0_0_40px_#00FF6A10]
            hover:shadow-[0_0_70px_#00FF6A40]
            hover:border-[#00FF6A]
            transition-all duration-300
          "
        >
          {/* STATUS BADGE */}
          <span
            className={`
              absolute top-4 right-4
              px-3 py-1 text-xs tracking-widest
              rounded-md
              ${
                t.status === "active"
                  ? "bg-[#00FF6A]/20 text-[#00FF6A] shadow-[0_0_15px_#00FF6A55]"
                  : "bg-red-500/20 text-red-400 shadow-[0_0_15px_#ff000055]"
              }
            `}
          >
            {t.status?.toUpperCase()}
          </span>

          {/* NAME */}
          <h3 className="text-xl font-bold text-white tracking-wide">
            {t.fullName}
          </h3>

          {/* SPECIALITY */}
          <p className="mt-1 text-sm text-gray-400 tracking-wide">
            {t.speciality || "—"}
          </p>

          {/* PHONE */}
          <p className="mt-2 text-sm text-gray-400">📞 {t.phone || "N/A"}</p>

          {/* ACTION */}
          <Link
            href={`/dashboard/trainers/${t._id}`}
            className="
              inline-block mt-5
              text-sm tracking-widest
              text-[#00FF6A]
              hover:underline
            "
          >
            VIEW PROFILE →
          </Link>
        </div>
      ))}
    </div>
  );
}
