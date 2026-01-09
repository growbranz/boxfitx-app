"use client";

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

export default function MemberFilters({ onChange, filters }: any) {
  const yearSelected = Boolean(filters?.year);

  return (
    <div
      className="
        mb-8 p-6 rounded-2xl
        bg-black/70 backdrop-blur
        border border-[#00FF6A]/30
        shadow-[0_0_40px_#00FF6A11]
      "
    >
      <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
        {/* SEARCH */}
        <input
          placeholder="Search name, phone or email"
          className="filter-input"
          onChange={(e) =>
            onChange((p: any) => ({ ...p, search: e.target.value, page: 1 }))
          }
        />

        {/* STATUS */}
        <select
          className="filter-input"
          onChange={(e) =>
            onChange((p: any) => ({ ...p, status: e.target.value, page: 1 }))
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
          onChange={(e) =>
            onChange((p: any) => ({ ...p, planType: e.target.value, page: 1 }))
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
          onChange={(e) =>
            onChange((p: any) => ({ ...p, gender: e.target.value, page: 1 }))
          }
        >
          <option value="">All Genders</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
        </select>

        {/* YEAR */}
        <select
          className="filter-input"
          onChange={(e) =>
            onChange((p: any) => {
              const value = e.target.value;
              const next = { ...p, page: 1 };

              if (value) {
                next.year = Number(value);
                delete next.month; // ✅ reset month properly
              } else {
                delete next.year;
                delete next.month;
              }

              return next;
            })
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
          autoFocus={yearSelected}
          // disabled={!yearSelected}
          className={`filter-input ${
            !yearSelected ? "opacity-40 cursor-not-allowed" : "cursor-pointer"
          }`}
          onChange={(e) =>
            onChange((p: any) => {
              const value = e.target.value;
              const next = { ...p, page: 1 };

              if (value) {
                next.month = Number(value);
              } else {
                delete next.month; // ✅ CRITICAL FIX
              }

              return next;
            })
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
