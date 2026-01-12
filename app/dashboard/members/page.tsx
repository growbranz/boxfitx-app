"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import MemberFilters from "../../components/MemberFilters";
import MemberGrid from "../../components/MemberGrid";

/* ---------- TYPES ---------- */
type Member = any;

type Meta = {
  page: number;
  totalPages: number;
};

type Filters = {
  page: number;
};

/* ---------- QUERY BUILDER ---------- */
const buildQuery = (filters: Record<string, string | number>) => {
  return new URLSearchParams(
    Object.entries(filters).map(([key, value]) => [key, String(value)])
  ).toString();
};

export default function MembersPage() {
  const router = useRouter();

  const [members, setMembers] = useState<Member[]>([]);
  const [meta, setMeta] = useState<Meta | null>(null);
  const [filters, setFilters] = useState<Filters>({ page: 1 });
  const [loading, setLoading] = useState(true);

  const abortRef = useRef<AbortController | null>(null);

  /* ---------- CACHE KEY ---------- */
  const cacheKey = useMemo(() => `members_${buildQuery(filters)}`, [filters]);

  /* ---------- FETCH MEMBERS ---------- */
  const fetchMembers = useCallback(async () => {
    setLoading(true);

    // cancel previous request
    abortRef.current?.abort();
    abortRef.current = new AbortController();

    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/auth/signin");
      return;
    }

    // cache check
    const cached = sessionStorage.getItem(cacheKey);
    if (cached) {
      const parsed = JSON.parse(cached);
      setMembers(parsed.data);
      setMeta(parsed.meta);
      setLoading(false);
      return;
    }

    try {
      const query = buildQuery(filters);

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/members?${query}`,
        {
          headers: { Authorization: `Bearer ${token}` },
          signal: abortRef.current.signal,
        }
      );

      if (res.status === 401) {
        router.push("/auth/signin");
        return;
      }

      const data = await res.json();

      setMembers(data?.data || []);
      setMeta(data?.meta || null);

      sessionStorage.setItem(
        cacheKey,
        JSON.stringify({
          data: data?.data || [],
          meta: data?.meta || null,
        })
      );
    } catch (err: any) {
      if (err.name !== "AbortError") {
        console.error("Failed to fetch members");
      }
    } finally {
      setLoading(false);
    }
  }, [filters, cacheKey, router]);

  /* ---------- EXPORT EXCEL ---------- */
  const exportExcel = useCallback(async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const query = buildQuery(filters);

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/members/export/excel?${query}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "members.xlsx";
    document.body.appendChild(a);
    a.click();
    a.remove();
  }, [filters]);

  /* ---------- EFFECT ---------- */
  useEffect(() => {
    fetchMembers();
    return () => abortRef.current?.abort();
  }, [fetchMembers]);

  /* ---------- PAGINATION ---------- */
  const pagination = useMemo(() => {
    if (!meta) return null;

    return Array.from({ length: meta.totalPages }).map((_, i) => {
      const page = i + 1;
      const active = meta.page === page;

      return (
        <button
          key={page}
          onClick={() => setFilters((p) => ({ ...p, page }))}
          className={`
            px-4 py-2 rounded-lg text-sm font-medium border transition
            ${
              active
                ? "bg-[#00FF6A] text-black border-[#00FF6A] shadow-[0_0_20px_#00FF6A99]"
                : "bg-black/60 text-gray-300 border-[#00FF6A]/30 hover:bg-[#00FF6A]/10"
            }
          `}
        >
          {page}
        </button>
      );
    });
  }, [meta]);

  /* ---------- UI ---------- */
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
              className="px-5 py-2 rounded-xl bg-white/10 text-gray-300 border border-white/20 hover:bg-white/20 transition"
            >
              Export Excel
            </button>

            <Link
              href="/dashboard/members/create"
              className="px-6 py-2 rounded-xl bg-[#00FF6A]/90 text-black font-bold hover:bg-[#00FF6A] shadow-[0_0_25px_#00FF6A99] transition"
            >
              + Add Member
            </Link>
          </div>
        </div>

        {/* FILTERS */}
        <div className="bg-black/70 backdrop-blur border border-[#00FF6A]/30 rounded-2xl shadow-[0_0_50px_#00FF6A11] p-6">
          <MemberFilters onChange={setFilters} />
        </div>

        {/* GRID */}
        {loading ? (
          <p className="text-center text-gray-400 py-20">Loading members…</p>
        ) : (
          <MemberGrid members={members} />
        )}

        {/* PAGINATION */}
        {pagination && (
          <div className="flex justify-center gap-2 pt-6">{pagination}</div>
        )}
      </div>
    </div>
  );
}
