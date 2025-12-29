"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

export default function TrainerProfilePage() {
  const { id } = useParams();
  const router = useRouter();
  const [trainer, setTrainer] = useState<any>(null);

  const fetchTrainer = async () => {
    const token = localStorage.getItem("token");

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/trainers/${id}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    const data = await res.json();
    setTrainer(data);
  };

  useEffect(() => {
    fetchTrainer();
  }, [id]);

  if (!trainer) return null;

  return (
    <div className="max-w-3xl mx-auto px-4 space-y-10">
      {/* HEADER */}
      <div className="relative pl-4">
        <span className="absolute left-0 top-1 h-10 w-1 bg-[#00FF6A]" />
        <h1 className="text-3xl font-extrabold tracking-widest text-[#00FF6A]">
          TRAINER PROFILE
        </h1>
        <p className="text-xs text-gray-400 tracking-[0.3em] uppercase">
          Boxfitx Management
        </p>
      </div>

      {/* PROFILE CARD */}
      <div
        className="
          relative p-8 rounded-2xl
          bg-black/70 backdrop-blur
          border border-[#00FF6A]/40
          shadow-[0_0_60px_#00FF6A15]
        "
      >
        {/* STATUS */}
        <span
          className={`
            absolute top-6 right-6
            px-4 py-1 text-xs tracking-widest rounded-md
            ${
              trainer.status === "active"
                ? "bg-[#00FF6A]/20 text-[#00FF6A] shadow-[0_0_15px_#00FF6A55]"
                : "bg-red-500/20 text-red-400 shadow-[0_0_15px_#ff000055]"
            }
          `}
        >
          {trainer.status?.toUpperCase()}
        </span>

        {/* DETAILS */}
        <div className="space-y-4">
          <div>
            <p className="text-gray-400 text-xs tracking-widest">FULL NAME</p>
            <p className="text-xl font-bold text-white">{trainer.fullName}</p>
          </div>

          <div>
            <p className="text-gray-400 text-xs tracking-widest">SPECIALITY</p>
            <p className="text-white">{trainer.speciality || "—"}</p>
          </div>

          <div>
            <p className="text-gray-400 text-xs tracking-widest">PHONE</p>
            <p className="text-white">{trainer.phone || "—"}</p>
          </div>
        </div>
      </div>

      {/* ACTIONS */}
      <div className="flex flex-wrap gap-4">
        {/* TOGGLE STATUS */}
        <button
          onClick={async () => {
            const token = localStorage.getItem("token");
            await fetch(
              `${process.env.NEXT_PUBLIC_API_URL}/api/trainers/${id}/toggle`,
              {
                method: "PATCH",
                headers: { Authorization: `Bearer ${token}` },
              }
            );
            fetchTrainer();
          }}
          className="
            px-6 py-3 rounded-xl
            bg-yellow-500/20 text-yellow-400
            border border-yellow-500/40
            hover:bg-yellow-500/30
            transition
          "
        >
          TOGGLE STATUS
        </button>

        {/* ARCHIVE */}
        <button
          onClick={async () => {
            const token = localStorage.getItem("token");
            await fetch(
              `${process.env.NEXT_PUBLIC_API_URL}/api/trainers/${id}/archive`,
              {
                method: "PATCH",
                headers: { Authorization: `Bearer ${token}` },
              }
            );
            router.push("/dashboard/trainers");
          }}
          className="
            px-6 py-3 rounded-xl
            bg-red-500/20 text-red-400
            border border-red-500/40
            hover:bg-red-500/30
            transition
          "
        >
          ARCHIVE TRAINER
        </button>

        {/* BACK */}
        <button
          onClick={() => router.back()}
          className="
            px-6 py-3 rounded-xl
            bg-white/10 text-gray-300
            border border-white/20
            hover:bg-white/20
            transition
          "
        >
          ← BACK
        </button>
      </div>
    </div>
  );
}
