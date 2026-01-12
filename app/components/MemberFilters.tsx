"use client";

import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";

/* ---------- CONSTANTS ---------- */

const YEARS = (() => {
  const currentYear = new Date().getFullYear();
  return Array.from({ length: 6 }, (_, i) => currentYear - i);
})();

const MONTHS = [
  { value: 1, label: "January" },
  { value: 2, label: "February" },
  { value: 3, label: "March" },
  { value: 4, label: "April" },
  { value: 5, label: "May" },
  { value: 6, label: "June" },
  { value: 7, label: "July" },
  { value: 8, label: "August" },
  { value: 9, label: "September" },
  { value: 10, label: "October" },
  { value: 11, label: "November" },
  { value: 12, label: "December" },
];

export type Filters = {
  page: number;
  search?: string;
  status?: string;
  planType?: string;
  gender?: string;
  year?: number;
  month?: number;
};

type Props = {
  onChange: Dispatch<SetStateAction<Filters>>;
  filters?: Filters;
};

export default function MemberFilters({ onChange, filters }: Props) {
  const [local, setLocal] = useState<Filters>(filters ?? { page: 1 });
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  const yearSelected = Boolean(local.year);

  /* ---------- DEBOUNCE ---------- */
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(() => {
      onChange((prev) => ({
        ...prev,
        ...local,
      }));
    }, 400);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [local, onChange]);

  /* ---------- HELPERS ---------- */
  const update = (patch: Partial<Filters>) => {
    setLocal((prev) => ({
      ...prev,
      ...patch,
      page: 1,
    }));
  };

  const reset = (key: keyof Filters) => {
    setLocal((prev) => {
      const next = { ...prev };
      delete next[key];
      next.page = 1;
      return next;
    });
  };

  /* ---------- UI ---------- */
  return (
    <div className="mb-8 p-6 rounded-2xl bg-black/70 backdrop-blur border border-[#00FF6A]/30">
      <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
        {/* SEARCH */}
        <input
          className="filter-input"
          placeholder="Search name, phone or email"
          value={local.search ?? ""}
          onChange={(e) => update({ search: e.target.value })}
        />

        {/* STATUS */}
        <select
          className="filter-input"
          value={local.status ?? ""}
          onChange={(e) =>
            e.target.value
              ? update({ status: e.target.value })
              : reset("status")
          }
        >
          <option value="">All Status</option>
          <option value="active">Active</option>
          <option value="expired">Expired</option>
          <option value="inactive">Inactive</option>
        </select>

        {/* PLAN */}
        <select
          className="filter-input"
          value={local.planType ?? ""}
          onChange={(e) =>
            e.target.value
              ? update({ planType: e.target.value })
              : reset("planType")
          }
        >
          <option value="">All Plans</option>
          <option value="monthly">Monthly</option>
          <option value="quarterly">Quarterly</option>
          <option value="half_yearly">Half Yearly</option>
          <option value="annual">Annual</option>
        </select>

        {/* GENDER */}
        <select
          className="filter-input"
          value={local.gender ?? ""}
          onChange={(e) =>
            e.target.value
              ? update({ gender: e.target.value })
              : reset("gender")
          }
        >
          <option value="">All Genders</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
        </select>

        {/* YEAR */}
        <select
          className="filter-input"
          value={local.year ?? ""}
          onChange={(e) =>
            e.target.value
              ? update({ year: Number(e.target.value), month: undefined })
              : setLocal({ page: 1 })
          }
        >
          <option value="">All Years</option>
          {YEARS.map((y) => (
            <option key={y} value={y}>
              {y}
            </option>
          ))}
        </select>

        {/* MONTH */}
        <select
          disabled={!yearSelected}
          className={`filter-input ${
            !yearSelected ? "opacity-40 cursor-not-allowed" : ""
          }`}
          value={local.month ?? ""}
          onChange={(e) =>
            e.target.value
              ? update({ month: Number(e.target.value) })
              : reset("month")
          }
        >
          <option value="">All Months</option>
          {MONTHS.map((m) => (
            <option key={m.value} value={m.value}>
              {m.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
