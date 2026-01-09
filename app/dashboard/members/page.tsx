"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import MemberFilters from "../../components/MemberFilters";
import MemberGrid from "../../components/MemberGrid";
import { useRouter } from "next/navigation";

export default function MembersPage() {
  const [members, setMembers] = useState([]);
  const [meta, setMeta] = useState<any>(null);
  const [filters, setFilters] = useState<any>({ page: 1 });
  const router = useRouter();

  const fetchMembers = async () => {
    const token = localStorage.getItem("token");

    const query = new URLSearchParams(filters).toString();
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/members?${query}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    if (res.status === 401) {
      router.push("/auth/signin");
      return;
    }

    const data = await res.json();
    setMembers(data?.data || []);
    setMeta(data?.meta);
  };

  const exportExcel = async () => {
    const token = localStorage.getItem("token");
    const params = new URLSearchParams(filters).toString();
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/members/export/excel?${params}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "members.xlsx";
    a.click();
  };

  useEffect(() => {
    fetchMembers();
  }, [filters]);

  return (
    <div className="min-h-screen bg-[#050505] text-white">
      <div className="max-w-7xl mx-auto px-6 pb-20 space-y-10">
        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between pt-8 border-b border-[#00FF6A]/20 pb-6">
          <div className="relative pl-4">
            <span className="absolute left-0 top-1 h-10 w-1 bg-[#00FF6A]" />
            <h1 className="text-3xl font-extrabold tracking-widest text-[#00FF6A]">
              MEMBERS
            </h1>
            <p className="text-xs text-gray-400 tracking-[0.3em] uppercase mt-1">
              Boxfitx Gym Member Management
            </p>
          </div>

          <div className="flex gap-3 mt-6 md:mt-0">
            <button
              onClick={exportExcel}
              className="
                px-5 py-2 rounded-xl
                bg-white/10 text-gray-300
                border border-white/20
                hover:bg-white/20
                transition
              "
            >
              Export Excel
            </button>

            <Link
              href="/dashboard/members/create"
              className="
                px-6 py-2 rounded-xl
                bg-[#00FF6A]/90 text-black font-bold
                hover:bg-[#00FF6A]
                shadow-[0_0_25px_#00FF6A99]
                transition
              "
            >
              + Add Member
            </Link>
          </div>
        </div>

        {/* FILTERS */}
        <div
          className="
            bg-black/70 backdrop-blur
            border border-[#00FF6A]/30
            rounded-2xl
            shadow-[0_0_50px_#00FF6A11]
            p-6
          "
        >
          <MemberFilters onChange={setFilters} />
        </div>

        {/* GRID */}
        <MemberGrid members={members} />

        {/* PAGINATION */}
        {meta && (
          <div className="flex justify-center gap-2 pt-6">
            {Array.from({ length: meta.totalPages }).map((_, i) => (
              <button
                key={i}
                onClick={() => setFilters({ ...filters, page: i + 1 })}
                className={`
                  px-4 py-2 rounded-lg text-sm font-medium
                  border transition
                  ${
                    meta.page === i + 1
                      ? "bg-[#00FF6A] text-black border-[#00FF6A] shadow-[0_0_20px_#00FF6A99]"
                      : "bg-black/60 text-gray-300 border-[#00FF6A]/30 hover:bg-[#00FF6A]/10"
                  }
                `}
              >
                {i + 1}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
